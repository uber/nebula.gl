import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfTransformTranslate from '@turf/transform-translate';
import { point } from '@turf/helpers';
import WebMercatorViewport from 'viewport-mercator-project';
import { FeatureCollection, Position } from '../geojson-types';
import {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  ModeProps,
} from '../types';
import { traverseCoords } from '../utils';
import { GeoJsonEditMode, GeoJsonEditAction } from './geojson-edit-mode';
import { ImmutableFeatureCollection } from './immutable-feature-collection';

export class TranslateMode extends GeoJsonEditMode {
  _geometryBeforeTranslate: FeatureCollection | null | undefined;
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
  ): GeoJsonEditAction | null | undefined {
    if (!this._geometryBeforeTranslate) {
      return null;
    }

    let updatedData = new ImmutableFeatureCollection(props.data);
    const selectedIndexes = props.selectedIndexes;

    const { viewport: viewportDesc, translateInScreenSpace } = props.modeConfig || {};

    if (viewportDesc && translateInScreenSpace) {
      const viewport = viewportDesc.project ? viewportDesc : new WebMercatorViewport(viewportDesc);

      const from = viewport.project(startDragPoint);
      const to = viewport.project(currentPoint);
      const dx = to[0] - from[0];
      const dy = to[1] - from[1];

      for (let i = 0; i < selectedIndexes.length; i++) {
        const selectedIndex = selectedIndexes[i];
        const feature = this._geometryBeforeTranslate.features[i];

        let coordinates = feature.geometry.coordinates;
        if (coordinates) {
          coordinates = traverseCoords(coordinates, (coord) => {
            const pixels = viewport.project(coord);
            if (pixels) {
              pixels[0] += dx;
              pixels[1] += dy;
              return viewport.unproject(pixels);
            }
            return null;
          });

          // @ts-ignore
          updatedData = updatedData.replaceGeometry(selectedIndex, {
            type: feature.geometry.type,
            coordinates,
          });
        }
      }
    } else {
      const p1 = point(startDragPoint);
      const p2 = point(currentPoint);

      const distanceMoved = turfDistance(p1, p2);
      const direction = turfBearing(p1, p2);

      const movedFeatures = turfTransformTranslate(
        // @ts-ignore
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
      editContext: {
        featureIndexes: selectedIndexes,
      },
    };
  }
}
