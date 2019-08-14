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
  ModeProps
} from '../types.js';
import { BaseGeoJsonEditMode, type GeoJsonEditAction } from './geojson-edit-mode.js';
import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

export class TranslateMode extends BaseGeoJsonEditMode {
  _geometryBeforeTranslate: ?FeatureCollection;
  _isTranslatable: boolean;

  handlePointerMoveAdapter(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>
  ): { editAction: ?GeoJsonEditAction, cancelMapPan: boolean } {
    let editAction: ?GeoJsonEditAction = null;

    this._isTranslatable =
      Boolean(this._geometryBeforeTranslate) || this.isSelectionPicked(event.picks, props);

    if (!this._isTranslatable || !event.pointerDownMapCoords) {
      // Nothing to do
      return { editAction: null, cancelMapPan: false };
    }

    if (event.isDragging && this._geometryBeforeTranslate) {
      // Translate the geometry
      editAction = this.getTranslateAction(
        event.pointerDownMapCoords,
        event.mapCoords,
        'translating',
        props
      );
    }

    return { editAction, cancelMapPan: true };
  }

  handleStartDraggingAdapter(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    if (!this._isTranslatable) {
      return null;
    }

    this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection(props);
    return null;
  }

  handleStopDraggingAdapter(
    event: StopDraggingEvent,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    let editAction: ?GeoJsonEditAction = null;

    if (this._geometryBeforeTranslate) {
      // Translate the geometry
      editAction = this.getTranslateAction(
        event.pointerDownMapCoords,
        event.mapCoords,
        'translated',
        props
      );
      this._geometryBeforeTranslate = null;
    }

    return editAction;
  }

  getCursorAdapter(): ?string {
    if (this._isTranslatable) {
      return 'move';
    }
    return null;
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
