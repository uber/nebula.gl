// @flow

import turfTransformTranslate from '@turf/transform-translate';
import { point } from '@turf/helpers';
import type { FeatureCollection, Position } from '../geojson-types.js';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class TranslateHandler extends ModeHandler {
  _geometryBeforeTranslate: ?FeatureCollection;
  _isTranslatable: boolean;
  _unsnapMousePointStart: Position;

  handlePointerMove(
    event: PointerMoveEvent,
    snapConfigs: Object
  ): { editAction: ?EditAction, cancelMapPan: boolean } {
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
        'translating',
        snapConfigs
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

  handleStopDragging(event: StopDraggingEvent, snapConfigs: Object): ?EditAction {
    let editAction: ?EditAction = null;

    if (this._geometryBeforeTranslate) {
      // Translate the geometry
      editAction = this.getTranslateAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'translated',
        snapConfigs
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
    editType: string,
    snapConfigs: { [key: string]: any }
  ): ?EditAction {
    if (!this._geometryBeforeTranslate) {
      return null;
    }

    const { snapStrength } = snapConfigs || {};

    let updatedData = this.getImmutableFeatureCollection();
    const selectedIndexes = this.getSelectedFeatureIndexes();
    const { distanceMoved, direction } = this.calculateDistanceAndDirection(
      startDragPoint,
      currentPoint
    );

    // Perform snap
    if (this.shouldPerformSnap(snapConfigs)) {
      const candidateIndexes = this.getNearestPolygonIndexes({ numberToTrack: 8 });
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
    if (this.shouldPerformUnsnap(snapConfigs)) {
      const { distanceMoved: unsnapDistanceMoved } = this.calculateDistanceAndDirection(
        this._unsnapMousePointStart,
        currentPoint
      );

      const [selectedIndex] = selectedIndexes;
      const snapAssociates = this.getSnapAssociates(selectedIndex);

      // Get the longest edge of the selected polygon that has partcipated in a snap and
      // calculate the unsnap strength modifier from this edge length.
      let maxSnappedEdgeLength = 0;
      for (const snapAssociateIndex of snapAssociates) {
        const snapDetails = this.getSnapDetailsFromCandidates([snapAssociateIndex]);
        if (snapDetails) {
          const { selectedSnapEdgeLength } = snapDetails;
          maxSnappedEdgeLength = Math.max(maxSnappedEdgeLength, selectedSnapEdgeLength);
        }
      }

      const unsnapStrengthModifier = this.getSnapStrengthModifier(maxSnappedEdgeLength);
      const unsnapStrength = snapStrength * 2;
      if (unsnapDistanceMoved >= unsnapStrength * unsnapStrengthModifier) {
        this.clearSnapAssociates(selectedIndex);
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
