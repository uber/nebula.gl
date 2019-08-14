// @flow

import type { Position, LineString, FeatureCollection } from '../geojson-types.js';
import type { ClickEvent, PointerMoveEvent, ModeProps } from '../types.js';
import { BaseGeoJsonEditMode, type GeoJsonEditAction } from './geojson-edit-mode.js';
import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

export class DrawLineStringMode extends BaseGeoJsonEditMode {
  handleClickAdapter(event: ClickEvent, props: ModeProps<FeatureCollection>): ?GeoJsonEditAction {
    super.handleClickAdapter(event, props);

    let editAction: ?GeoJsonEditAction = null;
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes(props);
    const selectedGeometry = this.getSelectedGeometry(props);
    const tentativeFeature = this.getTentativeFeature();
    const clickSequence = this.getClickSequence();

    if (
      selectedFeatureIndexes.length > 1 ||
      (selectedGeometry && selectedGeometry.type !== 'LineString')
    ) {
      console.warn(`drawLineString mode only supported for single LineString selection`); // eslint-disable-line
      this.resetClickSequence();
      return null;
    }

    if (selectedGeometry && selectedGeometry.type === 'LineString') {
      // Extend the LineString
      const lineString: LineString = selectedGeometry;

      let positionIndexes = [lineString.coordinates.length];

      const modeConfig = props.modeConfig;
      if (modeConfig && modeConfig.drawAtFront) {
        positionIndexes = [0];
      }
      const featureIndex = selectedFeatureIndexes[0];
      const updatedData = new ImmutableFeatureCollection(props.data)
        .addPosition(featureIndex, positionIndexes, event.mapCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'addPosition',
        editContext: {
          featureIndexes: [featureIndex],
          positionIndexes,
          position: event.mapCoords
        }
      };

      this.resetClickSequence();
    } else if (clickSequence.length === 2 && tentativeFeature) {
      // Add a new LineString
      const geometry: any = tentativeFeature.geometry;
      editAction = this.getAddFeatureAction(geometry, props.data);

      this.resetClickSequence();
    }

    return editAction;
  }

  handlePointerMoveAdapter(
    event: PointerMoveEvent,
    props: ModeProps<FeatureCollection>
  ): { editAction: ?GeoJsonEditAction, cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };

    const clickSequence = this.getClickSequence();
    const mapCoords = event.mapCoords;

    let startPosition: ?Position = null;
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes(props);
    const selectedGeometry = this.getSelectedGeometry(props);

    if (
      selectedFeatureIndexes.length > 1 ||
      (selectedGeometry && selectedGeometry.type !== 'LineString')
    ) {
      // unsupported
      return result;
    }

    if (selectedGeometry && selectedGeometry.type === 'LineString') {
      // Draw an extension line starting from one end of the selected LineString
      startPosition = selectedGeometry.coordinates[selectedGeometry.coordinates.length - 1];

      const modeConfig = props.modeConfig;
      if (modeConfig && modeConfig.drawAtFront) {
        startPosition = selectedGeometry.coordinates[0];
      }
    } else if (clickSequence.length === 1) {
      startPosition = clickSequence[0];
    }

    if (startPosition) {
      this._setTentativeFeature({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [startPosition, mapCoords]
        }
      });
    }

    return result;
  }

  getCursorAdapter() {
    return 'cell';
  }
}
