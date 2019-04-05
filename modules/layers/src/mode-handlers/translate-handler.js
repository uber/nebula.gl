// @flow

import turfTransformTranslate from '@turf/transform-translate';
import type { FeatureCollection, Position } from '../geojson-types.js';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import { ImmutableFeatureCollection } from '../immutable-feature-collection.js';
import { calculateDistanceAndDirection } from '../utils';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler';

export class TranslateHandler extends ModeHandler {
  _geometryBeforeTranslate: ?FeatureCollection;
  _isTranslatable: boolean;
  _updatedData: ImmutableFeatureCollection;

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    let editAction: ?EditAction = null;

    this._isTranslatable =
      Boolean(this._geometryBeforeTranslate) || this.isSelectionPicked(event.picks);

    if (!this._isTranslatable || !event.pointerDownGroundCoords) {
      // Nothing to do
      return { editAction: null, cancelMapPan: false };
    }

    if (event.isDragging && this._geometryBeforeTranslate) {
      // Translate the geometry
      editAction = this._getTranslateAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'translating'
      );
    }

    return { editAction, cancelMapPan: true };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    if (!this._isTranslatable) {
      return null;
    }

    this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection();
    return null;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    if (this._geometryBeforeTranslate) {
      // Translate the geometry
      editAction = this._getTranslateAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'translated'
      );
      this._geometryBeforeTranslate = null;
    }

    return editAction;
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    if (this._isTranslatable) {
      return 'move';
    }
    return isDragging ? 'grabbing' : 'grab';
  }

  _getTranslateAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string
  ): ?EditAction {
    if (!this._geometryBeforeTranslate) {
      return null;
    }

    this._updatedData = this.getImmutableFeatureCollection();
    const selectedIndexes = this.getSelectedFeatureIndexes();

    const { distanceMoved, direction } = calculateDistanceAndDirection(
      startDragPoint,
      currentPoint
    );

    const movedFeatures = turfTransformTranslate(
      this._geometryBeforeTranslate,
      distanceMoved,
      direction
    );

    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = movedFeatures.features[i];
      this._updatedData = this._updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
    }

    return {
      updatedData: this._updatedData.getObject(),
      editType,
      featureIndexes: selectedIndexes,
      editContext: null
    };
  }
}
