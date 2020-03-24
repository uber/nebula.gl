// @flow

import turfBuffer from '@turf/buffer';
import bbox from '@turf/bbox';
import turfCentroid from '@turf/centroid';
import turfBearing from '@turf/bearing';
import bboxPolygon from '@turf/bbox-polygon';
import turfDistance from '@turf/distance';
import { coordEach } from '@turf/meta';
import { getGeom } from '@turf/invariant';
import { point, featureCollection, lineString } from '@turf/helpers';
import turfTransformRotate from '@turf/transform-rotate';
import type {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  ModeProps,
  EditHandleFeature
} from '../types.js';
import { getPickedEditHandle } from '../utils';
import type { FeatureCollection, Position } from '../geojson-types.js';
import {
  GeoJsonEditMode,
  type GeoJsonEditAction,
  getIntermediatePosition
} from './geojson-edit-mode.js';
import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

export class RotateMode extends GeoJsonEditMode {
  _selectedEditHandle: ?EditHandleFeature;
  _geometryBeingRotated: ?FeatureCollection;
  _isRotating: boolean = false;

  _isSinglePointGeometrySelected = (geometry: ?FeatureCollection): boolean => {
    const { features } = geometry || {};
    if (Array.isArray(features) && features.length === 1) {
      const { type } = getGeom(features[0]);
      return type === 'Point';
    }
    return false;
  };

  getIsRotating = () => this._isRotating;

  getGuides(props: ModeProps<FeatureCollection>) {
    const selectedGeometry =
      this._geometryBeingRotated || this.getSelectedFeaturesAsFeatureCollection(props);

    if (this._isRotating) {
      // Display rotate pivot
      return featureCollection([turfCentroid(selectedGeometry)]);
    }

    // Add buffer to the enveloping box if a single Point feature is selected
    const featureWithBuffer = this._isSinglePointGeometrySelected(selectedGeometry)
      ? turfBuffer(selectedGeometry, 1)
      : selectedGeometry;

    const boundingBox = bboxPolygon(bbox(featureWithBuffer));

    let previousCoord = null;
    let topEdgeMidpointCoords = null;
    let longestEdgeLength = 0;

    coordEach(boundingBox, (coord, coordIndex) => {
      if (previousCoord) {
        const edgeMidpoint = getIntermediatePosition(coord, previousCoord);
        if (!topEdgeMidpointCoords || edgeMidpoint[1] > topEdgeMidpointCoords[1]) {
          // Get the top edge midpoint of the enveloping box
          topEdgeMidpointCoords = edgeMidpoint;
        }
        // Get the length of the longest edge of the enveloping box
        const edgeDistance = turfDistance(coord, previousCoord);
        longestEdgeLength = Math.max(longestEdgeLength, edgeDistance);
      }
      previousCoord = coord;
    });

    // Scale the length of the line between the rotate handler and the enveloping box
    // relative to the length of the longest edge of the enveloping box
    const rotateHandleCoords = topEdgeMidpointCoords && [
      topEdgeMidpointCoords[0],
      topEdgeMidpointCoords[1] + longestEdgeLength / 1000
    ];

    const lineFromEnvelopeToRotateHandle = lineString([topEdgeMidpointCoords, rotateHandleCoords]);
    const rotateHandle = point(rotateHandleCoords, {
      guideType: 'editHandle',
      editHandleType: 'rotate'
    });

    return featureCollection([boundingBox, rotateHandle, lineFromEnvelopeToRotateHandle]);
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isRotating) {
      return;
    }

    const rotateAction = this.getRotateAction(
      event.pointerDownMapCoords,
      event.mapCoords,
      'rotating',
      props
    );
    if (rotateAction) {
      props.onEdit(rotateAction);
    }

    event.cancelPan();
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isRotating) {
      const selectedEditHandle = getPickedEditHandle(event.picks);
      this._selectedEditHandle =
        selectedEditHandle && selectedEditHandle.properties.editHandleType === 'rotate'
          ? selectedEditHandle
          : null;
    }

    this.updateCursor(props);
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._selectedEditHandle) {
      this._isRotating = true;
      this._geometryBeingRotated = this.getSelectedFeaturesAsFeatureCollection(props);
    }
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._isRotating) {
      // Rotate the geometry
      const rotateAction = this.getRotateAction(
        event.pointerDownMapCoords,
        event.mapCoords,
        'rotated',
        props
      );

      if (rotateAction) {
        props.onEdit(rotateAction);
      }

      this._geometryBeingRotated = null;
      this._selectedEditHandle = null;
      this._isRotating = false;
    }
  }

  updateCursor(props: ModeProps<FeatureCollection>) {
    if (this._selectedEditHandle) {
      // TODO: look at doing SVG cursors to get a better "rotate" cursor
      props.onUpdateCursor('crosshair');
    } else {
      props.onUpdateCursor(null);
    }
  }

  getRotateAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    if (!this._geometryBeingRotated) {
      return null;
    }

    const centroid = turfCentroid(this._geometryBeingRotated);
    const angle = getRotationAngle(centroid, startDragPoint, currentPoint);

    const rotatedFeatures = turfTransformRotate(this._geometryBeingRotated, angle, {
      pivot: centroid
    });

    let updatedData = new ImmutableFeatureCollection(props.data);

    const selectedIndexes = props.selectedIndexes;
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = rotatedFeatures.features[i];
      updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
    }

    return {
      updatedData: updatedData.getObject(),
      editType,
      editContext: {
        featureIndexes: selectedIndexes
      }
    };
  }
}

function getRotationAngle(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const bearing1 = turfBearing(centroid, startDragPoint);
  const bearing2 = turfBearing(centroid, currentPoint);
  return bearing2 - bearing1;
}
