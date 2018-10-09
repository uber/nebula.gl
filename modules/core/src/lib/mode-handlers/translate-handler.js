// @flow

import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfTransformTranslate from '@turf/transform-translate';
import { point } from '@turf/helpers';
import type { Geometry, Position } from '../../geojson-types.js';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class TranslateHandler extends ModeHandler {
  _geometryBeforeTranslate: ?Geometry;

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    let editAction: ?EditAction = null;
    let cancelMapPan = false;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();

    if (
      event.isDragging &&
      event.pointerDownGroundCoords &&
      this._geometryBeforeTranslate &&
      selectedFeatureIndexes.length === 1
    ) {
      // Translate the geometry
      editAction = this.getEditAction(event.pointerDownGroundCoords, event.groundCoords);
    }

    if (
      event.pointerDownGroundCoords &&
      event.pointerDownPicks &&
      event.pointerDownPicks.length &&
      event.pointerDownPicks[0].index === selectedFeatureIndexes[0]
    ) {
      cancelMapPan = true;
    }

    return { editAction, cancelMapPan };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const geometryBefore = this.getSelectedGeometry();
    const { picks } = event;

    this._geometryBeforeTranslate =
      picks.length && selectedFeatureIndexes[0] === picks[0].index ? geometryBefore : null;

    if (selectedFeatureIndexes.length !== 1 || !geometryBefore) {
      console.warn('translate only supported for single feature selection'); // eslint-disable-line no-console,no-undef
    }

    return null;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    if (
      event.pointerDownGroundCoords &&
      this._geometryBeforeTranslate &&
      selectedFeatureIndexes.length === 1
    ) {
      // Translate the geometry
      editAction = this.getEditAction(event.pointerDownGroundCoords, event.groundCoords);
      if (editAction) {
        editAction.editType = 'translated';
      }
    }

    return editAction;
  }

  getEditAction(startDragPoint: Position, currentPoint: Position): ?EditAction {
    if (!this._geometryBeforeTranslate) {
      return null;
    }
    const p1 = point(startDragPoint);
    const p2 = point(currentPoint);

    const distanceMoved = turfDistance(p1, p2);
    const direction = turfBearing(p1, p2);

    const movedFeature = turfTransformTranslate(
      this._geometryBeforeTranslate,
      distanceMoved,
      direction
    );
    const featureIndex = this.getSelectedFeatureIndexes()[0];
    const updatedData = this.getImmutableFeatureCollection()
      .replaceGeometry(featureIndex, movedFeature)
      .getObject();

    return {
      updatedData,
      editType: 'translating',
      featureIndex,
      positionIndexes: null,
      position: null
    };
  }
}
