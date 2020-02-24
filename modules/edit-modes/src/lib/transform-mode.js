// @flow

import envelope from '@turf/envelope';
import { point, featureCollection, lineString } from '@turf/helpers';
import { coordEach } from '@turf/meta';
import { getCoord, getGeom } from '@turf/invariant';
import turfBuffer from '@turf/buffer';
import turfCentroid from '@turf/centroid';
import turfDistance from '@turf/distance';
import turfBearing from '@turf/bearing';
import turfTransformTranslate from '@turf/transform-translate';
import turfTransformScale from '@turf/transform-scale';
import turfTransformRotate from '@turf/transform-rotate';
import { getPickedEditHandle } from '../utils';
import type {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  ModeProps,
  EditHandleFeature
} from '../types.js';
import type { FeatureCollection, Position, Feature } from '../geojson-types.js';
import { BaseGeoJsonEditMode, getIntermediatePosition } from './geojson-edit-mode';
import { ImmutableFeatureCollection } from './immutable-feature-collection';

export class TransformMode extends BaseGeoJsonEditMode {
  _cornerGuidePoints: Array<EditHandleFeature> = [];
  _previousMouseCoords: ?Position;
  _transformMode: ?string;
  _geometryBeforeTransform: ?FeatureCollection;
  _selectedEditHandle: ?EditHandleFeature;
  _cursor: ?string;

  _getOppositeScaleHandle = (selectedHandle: EditHandleFeature) => {
    const selectedHandleIndex =
      selectedHandle && selectedHandle.properties && selectedHandle.properties.index;
    if (typeof selectedHandleIndex !== 'number') return null;
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

  _isSinglePointSelected = (): boolean => {
    const { features } = this._geometryBeforeTransform || {};
    if (Array.isArray(features) && features.length === 1) {
      const { type } = getGeom(features[0]);
      if (type === 'Point') {
        return true;
      }
    }
    return false;
  };

  _getTranslateAction(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
    editType: string
  ) {
    const { pointerDownMapCoords, mapCoords } = event;
    const mouseCoords = this._previousMouseCoords || pointerDownMapCoords;
    const distanceMoved = turfDistance(mouseCoords, mapCoords);
    const direction = turfBearing(mouseCoords, mapCoords);

    const movedFeatures = turfTransformTranslate(
      this._geometryBeforeTransform,
      distanceMoved,
      direction
    );

    this._previousMouseCoords = mapCoords;
    return {
      updatedData: this._getUpdatedData(props, movedFeatures),
      editType,
      editContext: {
        featureIndexes: props.selectedIndexes
      }
    };
  }

  _getScaleAction = (
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
    editType: string
  ) => {
    if (!this._selectedEditHandle || this._isSinglePointSelected()) {
      return null;
    }

    const { pointerDownMapCoords, mapCoords } = event;
    const oppositeHandle = this._getOppositeScaleHandle(this._selectedEditHandle);
    const origin = getCoord(oppositeHandle);

    const startDistance = turfDistance(origin, this._previousMouseCoords || pointerDownMapCoords);
    const endDistance = turfDistance(origin, mapCoords);
    const scaleFactor = endDistance / startDistance;
    const scaledFeatures = turfTransformScale(this._geometryBeforeTransform, scaleFactor, {
      origin
    });

    this._previousMouseCoords = mapCoords;
    return {
      updatedData: this._getUpdatedData(props, scaledFeatures),
      editType,
      editContext: {
        featureIndexes: props.selectedIndexes
      }
    };
  };

  _getRotateAction = (
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>,
    editType: string
  ) => {
    const { pointerDownMapCoords, mapCoords } = event;
    const centroid = turfCentroid(this._geometryBeforeTransform);
    const p1 = turfBearing(centroid, pointerDownMapCoords);
    const p2 = turfBearing(centroid, mapCoords);
    const rotatedFeatures = turfTransformRotate(this._geometryBeforeTransform, p2 - p1, {
      pivot: centroid
    });

    return {
      updatedData: this._getUpdatedData(props, rotatedFeatures),
      editType,
      editContext: {
        featureIndexes: props.selectedIndexes
      }
    };
  };

  _updateCursor = (props: ModeProps<FeatureCollection>, cursor: ?string) => {
    this._cursor = cursor;
    props.onUpdateCursor(cursor);
  };

  _getGuidePointsFromEnvelope = (boundingBox: Feature) => {
    const cornerGuidePoints = [];
    let previousCoord = null;
    let topEdgeMidpointCoords = null;
    let longestEdgeLength = 0;

    coordEach(boundingBox, (coord, coordIndex) => {
      if (coordIndex !== 4) {
        // Get corner midpoint guides from the enveloping box
        const cornerPoint = point(coord, {
          guideType: 'editHandle',
          editHandleType: 'scale',
          index: coordIndex
        });
        cornerGuidePoints.push(cornerPoint);
      }

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

    return { cornerGuidePoints, rotateHandle, lineFromEnvelopeToRotateHandle };
  };

  getGuides(props: ModeProps<FeatureCollection>) {
    if (this._transformMode === 'rotate') {
      // Display rotate pivot
      return featureCollection([turfCentroid(this._geometryBeforeTransform)]);
    }

    this._cornerGuidePoints = [];
    this._geometryBeforeTransform = this.getSelectedFeaturesAsFeatureCollection(props);

    // Add buffer to the enveloping box if a single Point feature is selected
    const featureWithBuffer = this._isSinglePointSelected()
      ? turfBuffer(this._geometryBeforeTransform, 1)
      : this._geometryBeforeTransform;

    const boundingBox = envelope(featureWithBuffer);
    const {
      cornerGuidePoints,
      rotateHandle,
      lineFromEnvelopeToRotateHandle
    } = this._getGuidePointsFromEnvelope(boundingBox);
    this._cornerGuidePoints = cornerGuidePoints;

    return featureCollection([
      boundingBox,
      lineFromEnvelopeToRotateHandle,
      rotateHandle,
      ...this._cornerGuidePoints
    ]);
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    if (!this._transformMode) {
      this._updateCursor(props, null);
    }

    if (this._cursor) {
      props.onUpdateCursor(this._cursor);
      return;
    }

    const { picks, pointerDownPicks } = event;
    const editHandle = getPickedEditHandle(picks);
    if (editHandle) {
      this._selectedEditHandle = editHandle;
      const { editHandleType } = this._selectedEditHandle.properties;
      if (editHandleType === 'rotate') {
        this._updateCursor(props, 'crosshair');
      } else if (editHandleType === 'scale') {
        const centroid = turfCentroid(this._geometryBeforeTransform);
        const bearing = turfBearing(centroid, editHandle);
        const positiveBearing = bearing < 0 ? bearing + 180 : bearing;
        // Get resize cursor direction from the hovered scale editHandle
        if (
          (positiveBearing >= 0 && positiveBearing <= 90) ||
          (positiveBearing >= 180 && positiveBearing <= 270)
        ) {
          this._updateCursor(props, 'nesw-resize');
        } else {
          this._updateCursor(props, 'nwse-resize');
        }
      }
    } else if (this.isSelectionPicked(pointerDownPicks || picks, props)) {
      this._updateCursor(props, 'move');
    }
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    const { picks, pointerDownPicks } = event;
    const editHandle = getPickedEditHandle(picks);
    if (editHandle) {
      this._transformMode = editHandle.properties.editHandleType;
    } else if (this.isSelectionPicked(pointerDownPicks || picks, props)) {
      this._transformMode = 'translate';
    } else {
      this._transformMode = null;
    }
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    switch (this._transformMode) {
      case 'scale':
        const scaleAction = this._getScaleAction(event, props, 'scaling');
        if (scaleAction) {
          props.onEdit(scaleAction);
        }
        break;
      case 'rotate':
        props.onEdit(this._getRotateAction(event, props, 'rotating'));
        break;
      case 'translate':
        props.onEdit(this._getTranslateAction(event, props, 'translating'));
        break;
      default:
    }

    if (typeof this._transformMode === 'string') {
      event.cancelPan();
    }
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    switch (this._transformMode) {
      case 'scale':
        const scaleAction = this._getScaleAction(event, props, 'scaled');
        if (scaleAction) {
          props.onEdit(scaleAction);
        }
        break;
      case 'rotate':
        props.onEdit(this._getRotateAction(event, props, 'rotated'));
        break;
      case 'translate':
        props.onEdit(this._getTranslateAction(event, props, 'translated'));
        break;
      default:
    }

    this._geometryBeforeTransform = null;
    this._previousMouseCoords = null;
    this._selectedEditHandle = null;
    this._transformMode = null;
    this._cursor = null;
  }
}
