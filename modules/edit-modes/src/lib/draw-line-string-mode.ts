import { LineString, FeatureCollection } from '../geojson-types';
import { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection } from '../types';
import { getPickedEditHandle } from '../utils';
import { GeoJsonEditMode } from './geojson-edit-mode';

export class DrawLineStringMode extends GeoJsonEditMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const { picks } = event;
    const clickedEditHandle = getPickedEditHandle(picks);

    let positionAdded = false;
    if (!clickedEditHandle) {
      // Don't add another point right next to an existing one
      this.addClickSequence(event);
      positionAdded = true;
    }
    const clickSequence = this.getClickSequence();

    if (
      clickSequence.length > 1 &&
      clickedEditHandle &&
      Array.isArray(clickedEditHandle.properties.positionIndexes) &&
      clickedEditHandle.properties.positionIndexes[0] === clickSequence.length - 1
    ) {
      // They clicked the last point (or double-clicked), so add the LineString

      const lineStringToAdd: LineString = {
        type: 'LineString',
        coordinates: [...clickSequence],
      };

      this.resetClickSequence();

      const editAction = this.getAddFeatureAction(lineStringToAdd, props.data);
      if (editAction) {
        props.onEdit(editAction);
      }
    } else if (positionAdded) {
      // new tentative point
      props.onEdit({
        // data is the same
        updatedData: props.data,
        editType: 'addTentativePosition',
        editContext: {
          position: event.mapCoords,
        },
      });
    }
  }
  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>) {
    const { key } = event;
    if (key === 'Enter') {
      const clickSequence = this.getClickSequence();
      if (clickSequence.length > 1) {
        const lineStringToAdd: LineString = {
          type: 'LineString',
          coordinates: [...clickSequence],
        };
        this.resetClickSequence();
        const editAction = this.getAddFeatureAction(lineStringToAdd, props.data);
        if (editAction) {
          props.onEdit(editAction);
        }
      }
    }
  }
  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const { lastPointerMoveEvent } = props;
    const clickSequence = this.getClickSequence();

    const lastCoords = lastPointerMoveEvent ? [lastPointerMoveEvent.mapCoords] : [];

    const guides = {
      type: 'FeatureCollection',
      features: [],
    };

    let tentativeFeature;
    if (clickSequence.length > 0) {
      tentativeFeature = {
        type: 'Feature',
        properties: {
          guideType: 'tentative',
        },
        geometry: {
          type: 'LineString',
          coordinates: [...clickSequence, ...lastCoords],
        },
      };
    }

    if (tentativeFeature) {
      guides.features.push(tentativeFeature);
    }

    const editHandles = clickSequence.map((clickedCoord, index) => ({
      type: 'Feature',
      properties: {
        guideType: 'editHandle',
        editHandleType: 'existing',
        featureIndex: -1,
        positionIndexes: [index],
      },
      geometry: {
        type: 'Point',
        coordinates: clickedCoord,
      },
    }));

    guides.features.push(...editHandles);
    // @ts-ignore
    return guides;
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }
}
