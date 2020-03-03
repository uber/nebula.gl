// @flow

import turfBuffer from '@turf/buffer';
import bbox from '@turf/bbox';
import turfCentroid from '@turf/centroid';
import turfBearing from '@turf/bearing';
import bboxPolygon from '@turf/bbox-polygon';
import { point, featureCollection } from '@turf/helpers';
import { coordEach } from '@turf/meta';
import turfDistance from '@turf/distance';
import turfTransformScale from '@turf/transform-scale';
import { getCoord, getGeom } from '@turf/invariant';
import type { FeatureCollection, Position } from '../geojson-types.js';
import type {
  ModeProps,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  EditHandleFeature
} from '../types.js';
import { getPickedEditHandle } from '../utils';
import { BaseGeoJsonEditMode } from './geojson-edit-mode.js';
import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

export class ScaleMode extends BaseGeoJsonEditMode {
  _selectedGeometry: ?FeatureCollection;
  _selectedEditHandle: ?EditHandleFeature;
  _cornerGuidePoints: Array<EditHandleFeature>;
  _previousMouseCoords: ?Position;
  _cursor: ?string;
  _isScaling: boolean = false;
  _isCompositionMode: boolean;

  constructor(options: ?{ isCompositionMode: boolean }) {
    super();
    const { isCompositionMode } = options || {};
    this._isCompositionMode = isCompositionMode || false;
  }

  _isSinglePointGeometrySelected = (): boolean => {
    const { features } = this._selectedGeometry || {};
    if (Array.isArray(features) && features.length === 1) {
      const { type } = getGeom(features[0]);
      return type === 'Point';
    }
    return false;
  };

  _getOppositeScaleHandle = (selectedHandle: EditHandleFeature) => {
    const selectedHandleIndex =
      selectedHandle && selectedHandle.properties && selectedHandle.properties.index;
    if (typeof selectedHandleIndex !== 'number') {
      return null;
    }
    const guidePointCount = this._cornerGuidePoints.length;
    const oppositeIndex = (selectedHandleIndex + guidePointCount / 2) % guidePointCount;
    return this._cornerGuidePoints.find(p => p.properties.index === oppositeIndex);
  };

  _getUpdatedData = (props: ModeProps<FeatureCollection>, editedData: FeatureCollection) => {
    let updatedData = new ImmutableFeatureCollection(props.data);
    const selectedIndexes = props.selectedIndexes;
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = editedData.features[i];
      updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
    }
    return updatedData.getObject();
  };

  getScaleAction = (
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>
  ) => {
    if (!this._selectedEditHandle || this._isSinglePointGeometrySelected()) {
      return null;
    }

    const oppositeHandle = this._getOppositeScaleHandle(this._selectedEditHandle);
    const origin = getCoord(oppositeHandle);

    const scaleFactor = getScaleFactor(
      origin,
      this._previousMouseCoords || startDragPoint,
      currentPoint
    );
    const scaledFeatures = turfTransformScale(this._selectedGeometry, scaleFactor, {
      origin
    });

    this._previousMouseCoords = currentPoint;

    return {
      updatedData: this._getUpdatedData(props, scaledFeatures),
      editType,
      editContext: {
        featureIndexes: props.selectedIndexes
      }
    };
  };

  updateCursor = (props: ModeProps<FeatureCollection>): boolean => {
    if (this._selectedEditHandle && this._selectedGeometry) {
      if (this._cursor) {
        props.onUpdateCursor(this._cursor);
        return true;
      }

      // Get resize cursor direction from the hovered scale editHandle (e.g. nesw or nwse)
      const centroid = turfCentroid(this._selectedGeometry);
      const bearing = turfBearing(centroid, this._selectedEditHandle);
      const positiveBearing = bearing < 0 ? bearing + 180 : bearing;
      if (
        (positiveBearing >= 0 && positiveBearing <= 90) ||
        (positiveBearing >= 180 && positiveBearing <= 270)
      ) {
        this._cursor = 'nesw-resize';
        props.onUpdateCursor('nesw-resize');
      } else {
        this._cursor = 'nwse-resize';
        props.onUpdateCursor('nwse-resize');
      }
      return true;
    }

    if (!this._isCompositionMode) {
      props.onUpdateCursor(null);
    }
    this._cursor = null;
    return false;
  };

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isScaling) {
      const selectedEditHandle = getPickedEditHandle(event.picks);
      this._selectedEditHandle =
        selectedEditHandle && selectedEditHandle.properties.editHandleType === 'scale'
          ? selectedEditHandle
          : null;
    }

    if (!this._isCompositionMode) {
      this.updateCursor(props);
    }
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._selectedEditHandle) {
      this._isScaling = true;
    }
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isScaling) {
      return;
    }

    const scaleAction = this.getScaleAction(
      event.pointerDownMapCoords,
      event.mapCoords,
      'scaling',
      props
    );
    if (scaleAction) {
      props.onEdit(scaleAction);
    }

    event.cancelPan();
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._isScaling) {
      // Scale the geometry
      const scaleAction = this.getScaleAction(
        event.pointerDownMapCoords,
        event.mapCoords,
        'scaled',
        props
      );
      if (scaleAction) {
        props.onEdit(scaleAction);
      }

      this._selectedGeometry = null;
      this._selectedEditHandle = null;
      this._previousMouseCoords = null;
      this._cursor = null;
      this._isScaling = false;
    }
  }

  getGuides(props: ModeProps<FeatureCollection>) {
    this._cornerGuidePoints = [];
    this._selectedGeometry = this.getSelectedFeaturesAsFeatureCollection(props);

    // Add buffer to the enveloping box if a single Point feature is selected
    const featureWithBuffer = this._isSinglePointGeometrySelected()
      ? turfBuffer(this._selectedGeometry, 1)
      : this._selectedGeometry;

    const boundingBox = bboxPolygon(bbox(featureWithBuffer));
    const cornerGuidePoints = [];

    coordEach(boundingBox, (coord, coordIndex) => {
      if (coordIndex < 4) {
        // Get corner midpoint guides from the enveloping box
        const cornerPoint = point(coord, {
          guideType: 'editHandle',
          editHandleType: 'scale',
          index: coordIndex
        });
        cornerGuidePoints.push(cornerPoint);
      }
    });

    this._cornerGuidePoints = cornerGuidePoints;
    return featureCollection([boundingBox, ...this._cornerGuidePoints]);
  }
}

function getScaleFactor(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const startDistance = turfDistance(centroid, startDragPoint);
  const endDistance = turfDistance(centroid, currentPoint);
  return endDistance / startDistance;
}
