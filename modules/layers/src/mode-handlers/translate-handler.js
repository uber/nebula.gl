// @flow

import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import { point as turfPoint } from '@turf/helpers';
import turfTransformTranslate from '@turf/transform-translate';
import type { FeatureCollection, Position } from '../geojson-types.js';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import { ImmutableFeatureCollection } from '../immutable-feature-collection.js';
import type { EditAction } from './mode-handler.js';
import { getPickedEditHandle } from './mode-handler';
import { SnapHandler } from './snap-handler.js';

export class TranslateHandler extends SnapHandler {
  _geometryBeforeTranslate: ?FeatureCollection;
  _isTranslatable: boolean;
  _unsnapMousePointStart: Position;
  _updatedData: ImmutableFeatureCollection;

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    this.setPickedHandle(getPickedEditHandle(event.pointerDownPicks));

    let editAction: ?EditAction = null;

    this._isTranslatable =
      Boolean(this._geometryBeforeTranslate) || this.isSelectionPicked(event.picks);

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
    if (!this._isTranslatable) {
      return null;
    }

    this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection();
    this._unsnapMousePointStart = event.pointerDownGroundCoords;
    return null;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    this.clearCachedHandles();
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

  calculateDistanceAndDirection(startDragPoint: Position, currentPoint: Position) {
    const p1 = turfPoint(startDragPoint);
    const p2 = turfPoint(currentPoint);

    const distanceMoved = turfDistance(p1, p2);
    const direction = turfBearing(p1, p2);

    return {
      distanceMoved,
      direction
    };
  }

  performSnap(currentPoint: Position, snapStrength: number) {
    if (this._potentialNonPickedHandle) {
      const snapDetails = this.calculateSnapIfWithinThreshold(snapStrength);
      if (snapDetails && snapDetails.length) {
        for (const snapDetail of snapDetails) {
          const { movedFeature, selectedIndex } = snapDetail;

          this._updatedData = this._updatedData.replaceGeometry(
            selectedIndex,
            movedFeature.geometry
          );

          this.updatePickedHandlePosition(selectedIndex, movedFeature.geometry);
          this._unsnapMousePointStart = currentPoint;
        }
      }
    }
  }

  performUnsnap(currentPoint: Position, snapStrength: number) {
    const { distanceMoved: unsnapDistanceMoved } = this.calculateDistanceAndDirection(
      this._unsnapMousePointStart,
      currentPoint
    );

    const unsnapStrengthModifier = this.getSnapStrengthModifier();
    const unsnapStrength = snapStrength * 2;
    if (unsnapDistanceMoved >= unsnapStrength * unsnapStrengthModifier) {
      const selectedIndexes = this.getSelectedFeatureIndexes();

      selectedIndexes.forEach(index =>
        this.getSnapAssociates(index).forEach(associateIndex => {
          if (!selectedIndexes.includes(associateIndex)) {
            this.clearSnapAssociates(index, associateIndex);
          }
        })
      );
    }
  }

  performTranslate(distanceMoved: number, direction: number) {
    const movedFeatures = turfTransformTranslate(
      this._geometryBeforeTranslate,
      distanceMoved,
      direction
    );

    const selectedIndexes = this.getSelectedFeatureIndexes();
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = movedFeatures.features[i];
      this._updatedData = this._updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
      this.updatePickedHandlePosition(selectedIndex, movedFeature.geometry);
    }
  }

  getTranslateAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string
  ): ?EditAction {
    if (!this._geometryBeforeTranslate) {
      return null;
    }

    const { snapStrength } = this.getModeConfig() || {};
    const selectedIndexes = this.getSelectedFeatureIndexes();

    const { distanceMoved, direction } = this.calculateDistanceAndDirection(
      startDragPoint,
      currentPoint
    );
    this._updatedData = this.getImmutableFeatureCollection();

    // Perform snap
    if (this.shouldPerformSnap()) {
      this.performSnap(currentPoint, snapStrength);
    }

    // Perform unsnap
    if (this.shouldPerformUnsnap()) {
      this.performUnsnap(currentPoint, snapStrength);
    }

    // Perform standard translate
    if (this.shouldPerformStandardModeAction()) {
      this.performTranslate(distanceMoved, direction);
    }

    return {
      updatedData: this._updatedData.getObject(),
      editType,
      featureIndexes: selectedIndexes,
      editContext: null
    };
  }
}
