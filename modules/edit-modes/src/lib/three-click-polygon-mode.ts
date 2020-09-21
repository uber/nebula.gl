import {
  ClickEvent,
  PointerMoveEvent,
  ModeProps,
  GuideFeatureCollection,
  TentativeFeature,
} from '../types';
import { Position, Polygon, FeatureOf, FeatureCollection } from '../geojson-types';
import { GeoJsonEditMode } from './geojson-edit-mode';

export class ThreeClickPolygonMode extends GeoJsonEditMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    this.addClickSequence(event);
    const clickSequence = this.getClickSequence();
    const tentativeFeature = this.getTentativeGuide(props);

    if (
      clickSequence.length > 2 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      const editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry, props);
      this.resetClickSequence();

      if (editAction) {
        props.onEdit(editAction);
      }
    }
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const { lastPointerMoveEvent, modeConfig } = props;
    const clickSequence = this.getClickSequence();

    const guides: GuideFeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (clickSequence.length === 0) {
      // nothing to do yet
      return guides;
    }

    const hoveredCoord = lastPointerMoveEvent.mapCoords;

    if (clickSequence.length === 1) {
      guides.features.push({
        type: 'Feature',
        properties: {
          guideType: 'tentative',
        },
        geometry: {
          type: 'LineString',
          coordinates: [clickSequence[0], hoveredCoord],
        },
      });
    } else {
      const polygon = this.getThreeClickPolygon(
        clickSequence[0],
        clickSequence[1],
        hoveredCoord,
        modeConfig
      );
      if (polygon) {
        guides.features.push({
          type: 'Feature',
          properties: {
            guideType: 'tentative',
          },
          geometry: polygon.geometry,
        });
      }
    }

    return guides;
  }

  getThreeClickPolygon(
    coord1: Position,
    coord2: Position,
    coord3: Position,
    modeConfig: any
  ): FeatureOf<Polygon> | null | undefined {
    return null;
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
    super.handlePointerMove(event, props);
  }

  createTentativeFeature(props: ModeProps<FeatureCollection>): TentativeFeature {
    const { lastPointerMoveEvent } = props;
    const clickSequence = this.getClickSequence();

    const lastCoords = lastPointerMoveEvent ? [lastPointerMoveEvent.mapCoords] : [];

    let tentativeFeature;
    if (clickSequence.length === 2) {
      tentativeFeature = this.getThreeClickPolygon(
        clickSequence[0],
        clickSequence[1],
        lastCoords[0],
        props.modeConfig
      );
    }

    return tentativeFeature;
  }
}
