// @flow

import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import { point as turfPoint } from '@turf/helpers';
import turfTransformTranslate from '@turf/transform-translate';
import { point } from '@turf/helpers';
import type { FeatureCollection, Position } from '../geojson-types.js';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { SnapHandler } from './snap-handler.js';

export class TranslateHandler extends SnapHandler {
  _geometryBeforeTranslate: ?FeatureCollection;
  _isTranslatable: boolean;
  _unsnapMousePointStart: Position;

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
      editAction = this.getTranslateAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'translating'
      );
    }

    return { editAction, cancelMapPan: true };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    this.renderSnapHandles();
    if (!this._isTranslatable) {
      return null;
    }

    this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection();
    this._unsnapMousePointStart = event.pointerDownGroundCoords;
    return null;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    this.hideSnapHandles();
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
    let updatedData = this.getImmutableFeatureCollection();

    // Perform snap
    if (this.shouldPerformSnap()) {
      const candidateIndexes = this.getNearestPolygonIndexes({ numberToTrack: 100 });
      const snapDetails = this.getSnapDetailsFromCandidates(candidateIndexes);

      if (snapDetails) {
        const snapMoveCalculations = this.calculateSnapMove(snapDetails, snapStrength);
        if (snapMoveCalculations) {
          const { movedPolygon, selectedIndex } = snapMoveCalculations;

          updatedData = updatedData.replaceGeometry(selectedIndex, movedPolygon.geometry);
          this._unsnapMousePointStart = currentPoint;
        }
      }
    }

    // Perform unsnap
    if (this.shouldPerformUnsnap()) {
      const { distanceMoved: unsnapDistanceMoved } = this.calculateDistanceAndDirection(
        this._unsnapMousePointStart,
        currentPoint
      );

      const unsnapStrengthModifier = this.getSnapStrengthModifier();
      const unsnapStrength = snapStrength * 2;
      if (unsnapDistanceMoved >= unsnapStrength * unsnapStrengthModifier) {
        this.clearSnapAssociates(selectedIndexes[0]);
      }
    }

    // Perform standard translate
    if (this.shouldPerformStandardModeAction()) {
      const movedFeatures = turfTransformTranslate(
        this._geometryBeforeTranslate,
        distanceMoved,
        direction
      );

      for (let i = 0; i < selectedIndexes.length; i++) {
        const selectedIndex = selectedIndexes[i];
        const movedFeature = movedFeatures.features[i];
        updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
      }
    }

    return {
      updatedData: updatedData.getObject(),
      editType,
      featureIndexes: selectedIndexes,
      editContext: null
    };
  }
}
