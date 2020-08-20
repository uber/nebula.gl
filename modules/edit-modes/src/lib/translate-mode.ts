import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfTransformTranslate from '@turf/transform-translate';
import { featureReduce, coordReduce, coordEach } from '@turf/meta';
import { point } from '@turf/helpers';
import { FeatureCollection, Position } from '../geojson-types';
import {
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  ModeProps,
} from '../types';
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

    const lngOffset = currentPoint[0] - startDragPoint[0];
    const latOffset = currentPoint[1] - startDragPoint[1];
    // const p1 = point(startDragPoint);
    // const p2 = point(currentPoint);

    // const distanceMoved = turfDistance(p1, p2);
    // const direction = turfBearing(p1, p2);

    // const movedFeatures = turfTransformTranslate(
    //   // @ts-ignore
    //   this._geometryBeforeTranslate,
    //   distanceMoved,
    //   direction,
    //   { mutate: false }
    // );

    const updatedData = new ImmutableFeatureCollection(props.data);
    try {
      const selectedIndexes = props.selectedIndexes;
      for (let i = 0; i < selectedIndexes.length; i++) {
        const selectedIndex = selectedIndexes[i];
        // const movedFeature = movedFeatures.features[i];
        // updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);

        const currentGeometry = this._geometryBeforeTranslate.features[i].geometry;

        const movedCoordinates = [];
        coordEach(
          currentGeometry,
          (coord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) => {
            const movedCoordinate = [coord[0] + lngOffset, coord[1] + latOffset];

            let coordArray;
            if (typeof multiFeatureIndex === 'number' && multiFeatureIndex > -1) {
              if (movedCoordinates.length <= multiFeatureIndex) {
                movedCoordinates.push([]);
              }
              coordArray = movedCoordinates[multiFeatureIndex];
            } else {
              coordArray = movedCoordinates;
            }
            coordArray.push(movedCoordinate);
          }
        );
        const movedGeometry = {
          ...currentGeometry,
          coordinates: movedCoordinates,
        };

        console.log(JSON.stringify(movedGeometry));

        updatedData = updatedData.replaceGeometry(selectedIndex, movedGeometry);
      }
    } catch (crap) {
      console.error(crap);
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
