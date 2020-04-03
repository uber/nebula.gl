
import type { Position, LineString, FeatureCollection } from '../geojson-types.ts';
import type { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection } from '../types.ts';
import { GeoJsonEditMode } from './geojson-edit-mode.ts';
import { ImmutableFeatureCollection } from './immutable-feature-collection.ts';

export class ExtendLineStringMode extends GeoJsonEditMode {
  getSingleSelectedLineString(props: ModeProps<FeatureCollection>): ?LineString {
    const selectedGeometry = this.getSelectedGeometry(props);

    if (selectedGeometry && selectedGeometry.type === 'LineString') {
      return selectedGeometry;
    }
    return null;
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const { selectedIndexes } = props;
    const selectedLineString = this.getSingleSelectedLineString(props);

    if (!selectedLineString) {
      console.warn(`ExtendLineStringMode only supported for single LineString selection`); // eslint-disable-line
      return;
    }

    // Extend the LineString
    let positionIndexes = [selectedLineString.coordinates.length];

    const modeConfig = props.modeConfig;
    if (modeConfig && modeConfig.drawAtFront) {
      positionIndexes = [0];
    }
    const featureIndex = selectedIndexes[0];
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
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const guides = {
      type: 'FeatureCollection',
      features: []
    };

    const selectedLineString = this.getSingleSelectedLineString(props);
    if (!selectedLineString) {
      // nothing to do
      return guides;
    }

    const mapCoords = props.lastPointerMoveEvent && props.lastPointerMoveEvent.mapCoords;

    // Draw an extension line starting from one end of the selected LineString to the cursor
    let startPosition: ?Position = null;
    const { modeConfig } = props;
    if (modeConfig && modeConfig.drawAtFront) {
      startPosition = selectedLineString.coordinates[0];
    } else {
      startPosition = selectedLineString.coordinates[selectedLineString.coordinates.length - 1];
    }

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

    return guides;
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }
}
