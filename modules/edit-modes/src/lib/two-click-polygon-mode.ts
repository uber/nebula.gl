import {
  ClickEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  PointerMoveEvent,
  ModeProps,
  GuideFeatureCollection,
  TentativeFeature,
} from '../types';
import { Polygon, FeatureCollection, FeatureOf, Position } from '../geojson-types';
import { GeoJsonEditMode } from './geojson-edit-mode';

export class TwoClickPolygonMode extends GeoJsonEditMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    if (props.modeConfig && props.modeConfig.dragToDraw) {
      // handled in drag handlers
      return;
    }

    this.addClickSequence(event);

    this.checkAndFinishPolygon(props);
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void {
    if (!props.modeConfig || !props.modeConfig.dragToDraw) {
      // handled in click handlers
      return;
    }

    this.addClickSequence(event);
    event.cancelPan();
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void {
    if (!props.modeConfig || !props.modeConfig.dragToDraw) {
      // handled in click handlers
      return;
    }
    this.addClickSequence(event);

    this.checkAndFinishPolygon(props);
  }

  checkAndFinishPolygon(props: ModeProps<FeatureCollection>) {
    const clickSequence = this.getClickSequence();
    const tentativeFeature = this.getTentativeGuide(props);

    if (
      clickSequence.length > 1 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      const feature: FeatureOf<Polygon> = {
        type: 'Feature',
        properties: {
          shape: tentativeFeature.properties.shape,
        },
        geometry: {
          type: 'Polygon',
          coordinates: tentativeFeature.geometry.coordinates,
        },
      };
      const editAction = this.getAddFeatureOrBooleanPolygonAction(feature, props);

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

    const corner1 = clickSequence[0];
    const corner2 = lastPointerMoveEvent.mapCoords;

    const polygon = this.getTwoClickPolygon(corner1, corner2, modeConfig);
    if (polygon) {
      guides.features.push({
        type: 'Feature',
        properties: {
          shape: polygon.properties && polygon.properties.shape,
          guideType: 'tentative',
        },
        geometry: polygon.geometry,
      });
    }

    return guides;
  }

  getTwoClickPolygon(
    coord1: Position,
    coord2: Position,
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
    if (clickSequence.length === 1) {
      tentativeFeature = this.getTwoClickPolygon(clickSequence[0], lastCoords[0], props.modeConfig);
    }

    return tentativeFeature;
  }
}
