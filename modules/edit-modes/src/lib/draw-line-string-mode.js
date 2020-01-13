// @flow

import type { Position, LineString, FeatureCollection } from '../geojson-types.js';
import type { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection } from '../types.js';
import { BaseGeoJsonEditMode } from './geojson-edit-mode.js';
import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

export class DrawLineStringMode extends BaseGeoJsonEditMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const selectedFeatureIndexes = props.selectedIndexes;
    const selectedGeometry = this.getSelectedGeometry(props);

    if (
      selectedFeatureIndexes.length > 1 ||
      (selectedGeometry && selectedGeometry.type !== 'LineString')
    ) {
      console.warn(`drawLineString mode only supported for single LineString selection`); // eslint-disable-line
      return;
    }

    this.addClickSequence(event);
    const tentativeFeature = this.getTentativeGuide(props);
    const clickSequence = this.getClickSequence();

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

      props.onEdit({
        updatedData,
        editType: 'addPosition',
        editContext: {
          featureIndexes: [featureIndex],
          positionIndexes,
          position: event.mapCoords
        }
      });

      this.resetClickSequence();
    } else if (clickSequence.length === 2 && tentativeFeature) {
      // Add a new LineString
      const { geometry } = tentativeFeature;
      props.onEdit(this.getAddFeatureAction(geometry, props.data));

      this.resetClickSequence();
    }
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const guides = {
      type: 'FeatureCollection',
      features: []
    };

    const clickSequence = this.getClickSequence();
    const mapCoords = props.lastPointerMoveEvent && props.lastPointerMoveEvent.mapCoords;

    let startPosition: ?Position = null;
    const selectedFeatureIndexes = props.selectedIndexes;
    const selectedGeometry = this.getSelectedGeometry(props);

    if (
      selectedFeatureIndexes.length > 1 ||
      (selectedGeometry && selectedGeometry.type !== 'LineString')
    ) {
      // unsupported
      return guides;
    }

    if (selectedGeometry && selectedGeometry.type === 'LineString') {
      // Draw an extension line starting from one end of the selected LineString
      startPosition = selectedGeometry.coordinates[selectedGeometry.coordinates.length - 1];

      const modeConfig = props.modeConfig;
      if (modeConfig && modeConfig.drawAtFront) {
        startPosition = selectedGeometry.coordinates[0];
      }
    } else if (clickSequence.length > 0) {
      startPosition = clickSequence[0];
    }

    if (startPosition) {
      guides.features.push({
        type: 'Feature',
        properties: {
          guideType: 'tentative'
        },
        geometry: {
          type: 'LineString',
          coordinates: [startPosition, mapCoords]
        }
      });
    }

    return guides;
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }
}
