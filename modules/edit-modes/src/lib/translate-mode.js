// @flow

import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfTransformTranslate from '@turf/transform-translate';
import { point } from '@turf/helpers';
import type { FeatureCollection, Position } from '../geojson-types.js';
import type {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  ModeProps
} from '../types.js';
import { BaseGeoJsonEditMode, type GeoJsonEditAction } from './geojson-edit-mode.js';
import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

export class TranslateMode extends BaseGeoJsonEditMode {
  _geometryBeforeTranslate: ?FeatureCollection;
  _isTranslatable: boolean;

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isTranslatable) {
      // Nothing to do
      return;
    }

    if (this._geometryBeforeTranslate) {
      // Translate the geometry
      const editAction = this.getTranslateAction(
        event.pointerDownMapCoords,
        event.mapCoords,
        'translating',
        props
      );

      if (editAction) {
        props.onEdit(editAction);
      }
    }

    // cancel map panning
    event.cancelPan();
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    this._isTranslatable = this.isSelectionPicked(event.pointerDownPicks || event.picks, props);

    this.updateCursor(props);
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isTranslatable) {
      return;
    }

    this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection(props);
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._geometryBeforeTranslate) {
      // Translate the geometry
      const editAction = this.getTranslateAction(
        event.pointerDownMapCoords,
        event.mapCoords,
        'translated',
        props
      );

      if (editAction) {
        props.onEdit(editAction);
      }

      this._geometryBeforeTranslate = null;
    }
  }

  updateCursor(props: ModeProps<FeatureCollection>) {
    if (this._isTranslatable) {
      props.onUpdateCursor('move');
    } else {
      props.onUpdateCursor(null);
    }
  }

  getTranslateAction(
    startDragPoint: Position,
    currentPoint: Position,
    editType: string,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    if (!this._geometryBeforeTranslate) {
      return null;
    }
    const p1 = point(startDragPoint);
    const p2 = point(currentPoint);

    const distanceMoved = turfDistance(p1, p2);
    const direction = turfBearing(p1, p2);

    const movedFeatures = turfTransformTranslate(
      this._geometryBeforeTranslate,
      distanceMoved,
      direction
    );

    let updatedData = new ImmutableFeatureCollection(props.data);

    const selectedIndexes = props.selectedIndexes;
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = movedFeatures.features[i];
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
