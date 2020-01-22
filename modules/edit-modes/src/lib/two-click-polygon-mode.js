// @flow

import type {
  ClickEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  PointerMoveEvent,
  ModeProps,
  GuideFeatureCollection
} from '../types.js';
import type { Polygon, FeatureCollection, FeatureOf, Position } from '../geojson-types.js';
import { BaseGeoJsonEditMode } from './geojson-edit-mode.js';

export class TwoClickPolygonMode extends BaseGeoJsonEditMode {
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
      features: []
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
          guideType: 'tentative'
        },
        geometry: polygon.geometry
      });
    }

    return guides;
  }

  getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): ?FeatureOf<Polygon> {
    return null;
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }
}
