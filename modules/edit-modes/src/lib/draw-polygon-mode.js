// @flow

import type { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection } from '../types.js';
import type { Polygon, FeatureCollection } from '../geojson-types.js';
import { BaseGeoJsonEditMode, getPickedEditHandle } from './geojson-edit-mode.js';

export class DrawPolygonMode extends BaseGeoJsonEditMode {
  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const { lastPointerMoveEvent } = props;
    const clickSequence = this.getClickSequence();

    const lastCoords = lastPointerMoveEvent ? [lastPointerMoveEvent.mapCoords] : [];

    const guides = {
      type: 'FeatureCollection',
      features: []
    };

    let tentativeFeature;
    if (clickSequence.length === 1 || clickSequence.length === 2) {
      tentativeFeature = {
        type: 'Feature',
        properties: {
          guideType: 'tentative'
        },
        geometry: {
          type: 'LineString',
          coordinates: [...clickSequence, ...lastCoords]
        }
      };
    } else if (clickSequence.length > 2) {
      tentativeFeature = {
        type: 'Feature',
        properties: {
          guideType: 'tentative'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[...clickSequence, ...lastCoords, clickSequence[0]]]
        }
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
        positionIndexes: [index]
      },
      geometry: {
        type: 'Point',
        coordinates: clickedCoord
      }
    }));

    guides.features.push(...editHandles);

    return guides;
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const { picks } = event;
    const clickedEditHandle = getPickedEditHandle(picks);

    if (!clickedEditHandle) {
      // Don't add another point right next to an existing one
      this.addClickSequence(event);
    }
    const clickSequence = this.getClickSequence();

    if (
      clickSequence.length > 2 &&
      clickedEditHandle &&
      (clickedEditHandle.positionIndexes[0] === 0 ||
        clickedEditHandle.positionIndexes[0] === clickSequence.length - 1)
    ) {
      // They clicked the first or last point (or double-clicked), so complete the polygon

      // Remove the hovered position
      const polygonToAdd: Polygon = {
        type: 'Polygon',
        coordinates: [[...clickSequence, clickSequence[0]]]
      };

      this.resetClickSequence();
      this._setTentativeFeature(null);

      const editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);
      if (editAction) {
        props.onEdit(editAction);
      }
    }

    // Trigger pointer move right away in order for it to update edit handles (to support double-click)
    const fakePointerMoveEvent = {
      screenCoords: [-1, -1],
      mapCoords: event.mapCoords,
      picks: [],
      isDragging: false,
      pointerDownPicks: null,
      pointerDownScreenCoords: null,
      pointerDownMapCoords: null,
      sourceEvent: null
    };

    this.handlePointerMove(fakePointerMoveEvent, props);
  }

  handlePointerMove({ mapCoords }: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    const clickSequence = this.getClickSequence();

    props.onUpdateCursor('cell');

    if (clickSequence.length === 0) {
      // nothing to do yet
      return;
    }

    if (clickSequence.length < 3) {
      // Draw a LineString connecting all the clicked points with the hovered point
      this._setTentativeFeature({
        type: 'Feature',
        properties: {
          guideType: 'tentative'
        },
        geometry: {
          type: 'LineString',
          coordinates: [...clickSequence, mapCoords]
        }
      });
    } else {
      // Draw a Polygon connecting all the clicked points with the hovered point
      this._setTentativeFeature({
        type: 'Feature',
        properties: {
          guideType: 'tentative'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[...clickSequence, mapCoords, clickSequence[0]]]
        }
      });
    }
  }
}
