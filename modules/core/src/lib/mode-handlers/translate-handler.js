// @flow

import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfTransformTranslate from '@turf/transform-translate';
import { point } from '@turf/helpers';
import type { Geometry, Position } from '../../geojson-types.js';
import type {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DeckGLPick
} from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class TranslateHandler extends ModeHandler {
  _geometryBeforeTranslate: ?Geometry;
  _isTranslatable: boolean;

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    let editAction: ?EditAction = null;

    this._isTranslatable =
      Boolean(this._geometryBeforeTranslate) || this.isSingleSelectionPicked(event.picks);

    if (!this._isTranslatable || !event.pointerDownGroundCoords) {
      // Nothing to do
      return { editAction: null, cancelMapPan: false };
    }

    if (event.isDragging && this._geometryBeforeTranslate) {
      // Translate the geometry
      editAction = this.getTranslateAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'translating'
      );
    }

    return { editAction, cancelMapPan: true };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const geometryBefore = this.getSelectedGeometry();

    if (selectedFeatureIndexes.length !== 1 || !geometryBefore) {
      console.warn('translate only supported for single feature selection'); // eslint-disable-line no-console,no-undef
    } else if (this._isTranslatable) {
      this._geometryBeforeTranslate = geometryBefore;
    }

    return null;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    if (this._geometryBeforeTranslate) {
      // Translate the geometry
      editAction = this.getTranslateAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'translated'
      );
      this._geometryBeforeTranslate = null;
    }

    return editAction;
  }

  isSingleSelectionPicked(picks: DeckGLPick[]): boolean {
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const singleSelectedFeature =
      selectedFeatureIndexes.length === 1
        ? this.getFeatureCollection().features[selectedFeatureIndexes[0]]
        : null;

    return picks.some(p => p.object === singleSelectedFeature);
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    if (this._isTranslatable) {
      return 'move';
    }
    return isDragging ? 'grabbing' : 'grab';
  }

  getTranslateAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string
  ): ?EditAction {
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
      editType,
      featureIndex,
      positionIndexes: null,
      position: null
    };
  }
}
