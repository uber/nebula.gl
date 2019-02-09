// @flow

import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfTransformTranslate from '@turf/transform-translate';
import { point } from '@turf/helpers';
import {
  convertFeatureListToFeatureCollection,
  convertFeatureCollectionToFeatureList
} from '../utils';
import type { FeatureCollection, Position } from '../../geojson-types.js';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class TranslateHandler extends ModeHandler {
  _geometryBeforeTranslate: ?FeatureCollection;
  _isTranslatable: boolean;

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    let editAction: ?EditAction = null;

    this._isTranslatable = Boolean(this._geometryBeforeTranslate) || true;

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
    const geometryBefore = this.getSelectedGeometries();
    const combinedGeometry = convertFeatureListToFeatureCollection(geometryBefore);
    if (this._isTranslatable) {
      this._geometryBeforeTranslate = combinedGeometry;
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

    const movedFeatures = convertFeatureCollectionToFeatureList(movedFeature);
    const featureIndexes = [];
    let updatedData = this.getImmutableFeatureCollection();
    for (const feature of movedFeatures) {
      const { index } = feature.properties;
      updatedData = updatedData.replaceGeometry(index, feature);
      featureIndexes.push(index);
    }

    return {
      updatedData: updatedData.getObject(),
      editType,
      featureIndexes,
      editContext: null
    };
  }
}
