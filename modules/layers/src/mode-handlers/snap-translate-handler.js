// @flow

import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import { point as turfPoint } from '@turf/helpers';
import turfTransformTranslate from '@turf/transform-translate';
import type { FeatureCollection, Position } from '../geojson-types.js';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import { ImmutableFeatureCollection } from '../immutable-feature-collection.js';
import type { EditAction, EditHandle } from './mode-handler.js';
import { getPickedEditHandle, ModeHandler, getEditHandlesForGeometry } from './mode-handler';

const DEFAULT_SNAP_PIXELS = 5;

type HandlePicks = { pickedHandle?: EditHandle, potentialSnapHandle?: EditHandle };

export class SnapTranslateHandler extends ModeHandler {
  _geometryBeforeTranslate: ?FeatureCollection;
  _isTranslatable: boolean;
  _updatedData: ImmutableFeatureCollection;
  _pickedHandle: ?EditHandle;
  _isSnapped: boolean;

  _getEditHandlePicks(event: PointerMoveEvent): HandlePicks {
    const { screenCoords } = event;
    const { snapPixels } = this.getModeConfig() || {};

    const picks = this._context.layerManager.pickObject({
      x: screenCoords[0],
      y: screenCoords[1],
      mode: 'query',
      layerIds: ['geojson-point-edit-handles'],
      radius: snapPixels || DEFAULT_SNAP_PIXELS,
      viewports: [this._context.viewport],
      depth: 2
    });

    const potentialSnapHandle = picks.find(
      pick => pick.object && pick.object.type === 'intermediate'
    );
    const handles = { potentialSnapHandle: potentialSnapHandle && potentialSnapHandle.object };

    const pickedHandle = getPickedEditHandle(event.pointerDownPicks);
    if (pickedHandle) {
      return { ...handles, pickedHandle };
    }

    return handles;
  }

  _updatePickedHandlePosition(index: number, updatedGeometry: any) {
    if (this._pickedHandle) {
      const { positionIndexes, featureIndex } = this._pickedHandle;
      if (index >= 0 && featureIndex !== index) return;

      const { coordinates } = updatedGeometry;
      (this._pickedHandle || {}).position = positionIndexes.reduce(
        (a: any[], b: number) => a[b],
        coordinates
      );
    }
  }

  _getNonPickedIntermediateHandles(): EditHandle[] {
    const handles = [];
    const { features } = this.featureCollection.getObject();

    for (let i = 0; i < features.length; i++) {
      if (!this.getSelectedFeatureIndexes().includes(i) && i < features.length) {
        const { geometry } = features[i];
        handles.push(...getEditHandlesForGeometry(geometry, i, 'intermediate'));
      }
    }
    return handles;
  }

  // If no snap handle has been picked, only display the edit handles of the
  // selected feature. If a snap handle has been picked, display said snap handle
  // along with all snappable points on all non-selected features.
  getEditHandles(picks?: Array<Object>, groundCoords?: Position): any[] {
    const { enableSnapping } = this.getModeConfig() || {};

    const handles = [];
    if (!enableSnapping) return handles;
    if (this._pickedHandle) {
      handles.push(...this._getNonPickedIntermediateHandles(), this._pickedHandle);
      return handles;
    }

    const { features } = this.featureCollection.getObject();
    for (const index of this.getSelectedFeatureIndexes()) {
      if (index < features.length) {
        const { geometry } = features[index];
        handles.push(...getEditHandlesForGeometry(geometry, index, 'snap'));
      }
    }

    return handles;
  }

  _calculateDistanceAndDirection(startDragPoint: Position, currentPoint: Position) {
    const p1 = turfPoint(startDragPoint);
    const p2 = turfPoint(currentPoint);

    const distanceMoved = turfDistance(p1, p2);
    const direction = turfBearing(p1, p2);

    return { distanceMoved, direction };
  }

  _shouldPerformSnap(pickedHandles: ?HandlePicks) {
    if (!pickedHandles) return false;
    const { pickedHandle, potentialSnapHandle } = pickedHandles || {};
    return pickedHandle && potentialSnapHandle;
  }

  _performSnapIfRequired(pickedHandles: ?HandlePicks) {
    if (this._isSnapped || !pickedHandles || !this._shouldPerformSnap(pickedHandles)) return;
    const { pickedHandle, potentialSnapHandle } = pickedHandles || {};
    if (!pickedHandle || !potentialSnapHandle) return;

    const selectedFeatures = this.getSelectedFeaturesAsFeatureCollection();
    const selectedIndexes = this.getSelectedFeatureIndexes();

    const { distanceMoved, direction } = this._calculateDistanceAndDirection(
      pickedHandle.position,
      potentialSnapHandle.position
    );

    const movedFeatures = turfTransformTranslate(selectedFeatures, distanceMoved, direction);
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = movedFeatures.features[i];
      this._updatedData = this._updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
      this._updatePickedHandlePosition(selectedIndex, movedFeature.geometry);
    }
    this._isSnapped = true;
  }

  // Unsnapping only occurs after the user snaps two polygons but continues to drag the
  // cursor past the point of resistance.
  _performUnsnapIfRequired(pickedHandles: HandlePicks) {
    if (!this._isSnapped) return;

    const { potentialSnapHandle } = pickedHandles;
    if (!potentialSnapHandle) {
      this._isSnapped = false;
    }
  }

  _performTranslateIfRequired(startDragPoint: Position, currentPoint: Position) {
    if (this._isSnapped) return;

    const { distanceMoved, direction } = this._calculateDistanceAndDirection(
      startDragPoint,
      currentPoint
    );

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
      this._updatePickedHandlePosition(selectedIndex, movedFeature.geometry);
    }
  }

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    const handlePicks = this._getEditHandlePicks(event);
    this._pickedHandle = handlePicks.pickedHandle;

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
        'translating',
        handlePicks
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

    this._pickedHandle = null;
    this._isSnapped = false;
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
    editType: string,
    pickedHandles: ?HandlePicks
  ): ?EditAction {
    if (!this._geometryBeforeTranslate) {
      return null;
    }

    this._updatedData = this.getImmutableFeatureCollection();
    const { enableSnapping } = this.getModeConfig() || {};

    // Perform snap or unsnap if conditions are met
    if (enableSnapping && pickedHandles) {
      this._performSnapIfRequired(pickedHandles);
      this._performUnsnapIfRequired(pickedHandles);
    }

    // Perform translate
    this._performTranslateIfRequired(startDragPoint, currentPoint);

    return {
      updatedData: this._updatedData.getObject(),
      editType,
      featureIndexes: this.getSelectedFeatureIndexes(),
      editContext: null
    };
  }
}
