import lineIntersect from '@turf/line-intersect';
import { lineString as turfLineString } from '@turf/helpers';
import {
  ClickEvent,
  PointerMoveEvent,
  ModeProps,
  GuideFeatureCollection,
  TentativeFeature,
  GuideFeature,
} from '../types';
import { Polygon, FeatureCollection, Position } from '../geojson-types';
import { getPickedEditHandle, hasPolygonCrossingLines } from '../utils';
import { GeoJsonEditMode } from './geojson-edit-mode';

export class DrawPolygonMode extends GeoJsonEditMode {
  createTentativeFeature(props: ModeProps<FeatureCollection>): TentativeFeature {
    const { lastPointerMoveEvent } = props;
    const clickSequence = this.getClickSequence();

    const lastCoords = lastPointerMoveEvent ? [lastPointerMoveEvent.mapCoords] : [];

    let tentativeFeature;
    if (clickSequence.length === 1 || clickSequence.length === 2) {
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
    } else if (clickSequence.length > 2) {
      tentativeFeature = {
        type: 'Feature',
        properties: {
          guideType: 'tentative',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[...clickSequence, ...lastCoords, clickSequence[0]]],
        },
      };
    }

    return tentativeFeature;
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const clickSequence = this.getClickSequence();

    const guides: GuideFeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    const tentativeFeature = this.createTentativeFeature(props);
    if (tentativeFeature) {
      guides.features.push(tentativeFeature);
    }

    const editHandles: GuideFeature[] = clickSequence.map((clickedCoord, index) => ({
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

    return guides;
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const { picks } = event;
    const clickedEditHandle = getPickedEditHandle(picks);
    const clickSequence = this.getClickSequence();

    let overlappingLines = false;
    if (clickSequence.length > 2 && props.modeConfig && props.modeConfig.preventOverlappingLines) {
      const currentLine = turfLineString([
        clickSequence[clickSequence.length - 1],
        event.mapCoords,
      ]);
      const otherLines = turfLineString([...clickSequence.slice(0, clickSequence.length - 1)]);
      const intersectingPoints = lineIntersect(currentLine, otherLines);
      if (intersectingPoints.features.length > 0) {
        overlappingLines = true;
      }
    }

    let positionAdded = false;
    if (!clickedEditHandle && !overlappingLines) {
      // Don't add another point right next to an existing one
      this.addClickSequence(event);
      positionAdded = true;
    }

    if (
      clickSequence.length > 2 &&
      clickedEditHandle &&
      Array.isArray(clickedEditHandle.properties.positionIndexes) &&
      (clickedEditHandle.properties.positionIndexes[0] === 0 ||
        clickedEditHandle.properties.positionIndexes[0] === clickSequence.length - 1)
    ) {
      // They clicked the first or last point (or double-clicked), so complete the polygon

      // Remove the hovered position
      const polygonToAdd: Polygon = {
        type: 'Polygon',
        coordinates: [[...clickSequence, clickSequence[0]]],
      };

      const editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);

      if (
        props.modeConfig?.preventOverlappingLines &&
        editAction.updatedData &&
        hasPolygonCrossingLines(
          editAction.updatedData.features[editAction.editContext.featureIndexes[0]].geometry
            .coordinates[0] as Position[]
        )
      ) {
        return;
      }

      this.resetClickSequence();

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
    if (event.key === 'Enter') {
      const clickSequence = this.getClickSequence();
      if (clickSequence.length > 2) {
        const polygonToAdd: Polygon = {
          type: 'Polygon',
          coordinates: [[...clickSequence, clickSequence[0]]],
        };
        this.resetClickSequence();

        const editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);
        if (editAction) {
          props.onEdit(editAction);
        }
      }
    } else if (event.key === 'Escape') {
      this.resetClickSequence();
      props.onEdit({
        // Because the new drawing feature is dropped, so the data will keep as the same.
        updatedData: props.data,
        editType: 'cancelFeature',
        editContext: {},
      });
    }
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
    super.handlePointerMove(event, props);
  }
}
