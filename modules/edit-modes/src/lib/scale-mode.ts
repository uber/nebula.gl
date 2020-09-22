/* eslint-disable prettier/prettier */
import bbox from '@turf/bbox';
import turfCentroid from '@turf/centroid';
import turfBearing from '@turf/bearing';
import bboxPolygon from '@turf/bbox-polygon';
import { point, featureCollection } from '@turf/helpers';
import polygonToLine from '@turf/polygon-to-line';
import { coordEach } from '@turf/meta';
import turfDistance from '@turf/distance';
import turfTransformScale from '@turf/transform-scale';
import { getCoord, getGeom } from '@turf/invariant';
import { FeatureCollection, Position } from '../geojson-types';
import {
  ModeProps,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  EditHandleFeature,
  GuideFeatureCollection,
} from '../types';
import { getPickedEditHandle } from '../utils';
import { GeoJsonEditMode } from './geojson-edit-mode';
import { ImmutableFeatureCollection } from './immutable-feature-collection';

export class ScaleMode extends GeoJsonEditMode {
  _geometryBeingScaled: FeatureCollection | null | undefined;
  _selectedEditHandle: EditHandleFeature | null | undefined;
  _cornerGuidePoints: Array<EditHandleFeature>;
  _cursor: string | null | undefined;
  _isScaling = false;

  _isSinglePointGeometrySelected = (geometry: FeatureCollection | null | undefined): boolean => {
    const { features } = geometry || {};
    if (Array.isArray(features) && features.length === 1) {
      // @ts-ignore
      const { type } = getGeom(features[0]);
      return type === 'Point';
    }
    return false;
  };

  _getOppositeScaleHandle = (selectedHandle: EditHandleFeature) => {
    const selectedHandleIndex =
      selectedHandle &&
      selectedHandle.properties &&
      Array.isArray(selectedHandle.properties.positionIndexes) &&
      selectedHandle.properties.positionIndexes[0];

    if (typeof selectedHandleIndex !== 'number') {
      return null;
    }
    const guidePointCount = this._cornerGuidePoints.length;
    const oppositeIndex = (selectedHandleIndex + guidePointCount / 2) % guidePointCount;
    return this._cornerGuidePoints.find((p) => {
      if (!Array.isArray(p.properties.positionIndexes)) {
        return false;
      }
      return p.properties.positionIndexes[0] === oppositeIndex;
    });
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

  isEditHandleSelected = (): boolean => Boolean(this._selectedEditHandle);

  getScaleAction = (
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>
  ) => {
    if (!this._selectedEditHandle) {
      return null;
    }

    const oppositeHandle = this._getOppositeScaleHandle(this._selectedEditHandle);
    const origin = getCoord(oppositeHandle);
    // @ts-ignore
    const scaleFactor = getScaleFactor(origin, startDragPoint, currentPoint);
    // @ts-ignore
    const scaledFeatures: FeatureCollection = turfTransformScale(
      // @ts-ignore
      this._geometryBeingScaled,
      scaleFactor,
      { origin }
    );

    return {
      updatedData: this._getUpdatedData(props, scaledFeatures),
      editType,
      editContext: {
        featureIndexes: props.selectedIndexes,
      },
    };
  };

  updateCursor = (props: ModeProps<FeatureCollection>) => {
    if (this._selectedEditHandle) {
      if (this._cursor) {
        props.onUpdateCursor(this._cursor);
      }
      const cursorGeometry = this.getSelectedFeaturesAsFeatureCollection(props);

      // Get resize cursor direction from the hovered scale editHandle (e.g. nesw or nwse)
      const centroid = turfCentroid(cursorGeometry);
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
    } else {
      props.onUpdateCursor(null);
      this._cursor = null;
    }
  };

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isScaling) {
      const selectedEditHandle = getPickedEditHandle(event.picks);
      this._selectedEditHandle =
        selectedEditHandle && selectedEditHandle.properties.editHandleType === 'scale'
          ? selectedEditHandle
          : null;

      if (selectedEditHandle) {
        this.updateCursor(props);
      }
    }
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._selectedEditHandle) {
      this._isScaling = true;
      this._geometryBeingScaled = this.getSelectedFeaturesAsFeatureCollection(props);
    }
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isScaling) {
      return;
    }

    props.onUpdateCursor(this._cursor);

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

      props.onUpdateCursor(null);

      this._geometryBeingScaled = null;
      this._selectedEditHandle = null;
      this._cursor = null;
      this._isScaling = false;
    }
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    this._cornerGuidePoints = [];
    const selectedGeometry = this.getSelectedFeaturesAsFeatureCollection(props);

    // Add buffer to the enveloping box if a single Point feature is selected
    if (this._isSinglePointGeometrySelected(selectedGeometry)) {
      return { type: 'FeatureCollection', features: [] };
    }

    const boundingBox = bboxPolygon(bbox(selectedGeometry));
    boundingBox.properties.mode = 'scale';
    const cornerGuidePoints = [];

    coordEach(boundingBox, (coord, coordIndex) => {
      if (coordIndex < 4) {
        // Get corner midpoint guides from the enveloping box
        const cornerPoint = point(coord, {
          guideType: 'editHandle',
          editHandleType: 'scale',
          positionIndexes: [coordIndex],
        });
        cornerGuidePoints.push(cornerPoint);
      }
    });

    this._cornerGuidePoints = cornerGuidePoints;
    // @ts-ignore
    return featureCollection([polygonToLine(boundingBox), ...this._cornerGuidePoints]);
  }
}

function getScaleFactor(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const startDistance = turfDistance(centroid, startDragPoint);
  const endDistance = turfDistance(centroid, currentPoint);
  return endDistance / startDistance;
}
