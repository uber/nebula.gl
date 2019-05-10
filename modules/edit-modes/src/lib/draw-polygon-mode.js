// @flow

import type { ClickEvent, PointerMoveEvent } from '../types.js';
import type { Polygon, Position } from '../geojson-types.js';
import type { GeoJsonEditAction, EditHandle } from './geojson-edit-mode.js';
import {
  BaseGeoJsonEditMode,
  getPickedEditHandle,
  getEditHandlesForGeometry
} from './geojson-edit-mode.js';

export class DrawPolygonMode extends BaseGeoJsonEditMode {
  getEditHandlesAdapter(picks?: Array<Object>, mapCoords?: Position): EditHandle[] {
    let handles = super.getEditHandlesAdapter(picks, mapCoords);

    const tentativeFeature = this.getTentativeFeature();
    if (tentativeFeature) {
      handles = handles.concat(getEditHandlesForGeometry(tentativeFeature.geometry, -1));
      // Slice off the handles that are are next to the pointer
      if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
        // Remove the last existing handle
        handles = handles.slice(0, -1);
      } else if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        // Remove the last existing handle
        handles = handles.slice(0, -1);
      }
    }

    return handles;
  }

  handleClickAdapter(event: ClickEvent): ?GeoJsonEditAction {
    super.handleClickAdapter(event);

    const { picks } = event;
    const tentativeFeature = this.getTentativeFeature();

    let editAction: ?GeoJsonEditAction = null;
    const clickedEditHandle = getPickedEditHandle(picks);

    if (clickedEditHandle) {
      // User clicked an edit handle.
      // Remove it from the click sequence, so it isn't added as a new point.
      const clickSequence = this.getClickSequence();
      clickSequence.splice(clickSequence.length - 1, 1);
    }

    if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
      const polygon: Polygon = tentativeFeature.geometry;

      if (
        clickedEditHandle &&
        clickedEditHandle.featureIndex === -1 &&
        (clickedEditHandle.positionIndexes[1] === 0 ||
          clickedEditHandle.positionIndexes[1] === polygon.coordinates[0].length - 3)
      ) {
        // They clicked the first or last point (or double-clicked), so complete the polygon

        // Remove the hovered position
        const polygonToAdd: Polygon = {
          type: 'Polygon',
          coordinates: [[...polygon.coordinates[0].slice(0, -2), polygon.coordinates[0][0]]]
        };

        this.resetClickSequence();
        this._setTentativeFeature(null);
        editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd);
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

    this.handlePointerMoveAdapter(fakePointerMoveEvent);

    return editAction;
  }

  handlePointerMoveAdapter({
    mapCoords
  }: PointerMoveEvent): { editAction: ?GeoJsonEditAction, cancelMapPan: boolean } {
    const clickSequence = this.getClickSequence();
    const result = { editAction: null, cancelMapPan: false };

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    if (clickSequence.length < 3) {
      // Draw a LineString connecting all the clicked points with the hovered point
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [...clickSequence, mapCoords]
        }
      });
    } else {
      // Draw a Polygon connecting all the clicked points with the hovered point
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...clickSequence, mapCoords, clickSequence[0]]]
        }
      });
    }

    return result;
  }
}
