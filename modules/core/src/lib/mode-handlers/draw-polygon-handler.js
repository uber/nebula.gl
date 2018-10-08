// @flow

import type { Polygon, Position } from '../../geojson-types.js';
import type { ClickEvent, PointerMoveEvent } from '../event-types.js';
import type { EditAction, EditHandle } from './mode-handler.js';
import { ModeHandler, getPickedEditHandle, getEditHandlesForGeometry } from './mode-handler.js';

export class DrawPolygonHandler extends ModeHandler {
  getEditHandles(picks?: Array<Object>, groundCoords?: Position): EditHandle[] {
    let handles = super.getEditHandles(picks, groundCoords);

    if (this._tentativeFeature) {
      handles = handles.concat(getEditHandlesForGeometry(this._tentativeFeature.geometry, -1));
      // Slice off the handles that are are next to the pointer
      if (this._tentativeFeature && this._tentativeFeature.geometry.type === 'LineString') {
        // Remove the last existing handle
        handles = handles.slice(0, -1);
      } else if (this._tentativeFeature && this._tentativeFeature.geometry.type === 'Polygon') {
        // Remove the last existing handle
        handles = handles.slice(0, -1);
      }
    }

    return handles;
  }

  handleClick(event: ClickEvent): ?EditAction {
    super.handleClick(event);

    const { picks } = event;
    const tentativeFeature = this.getTentativeFeature();
    const featureCollection = this.getImmutableFeatureCollection();

    let editAction: ?EditAction = null;
    const clickedEditHandle = getPickedEditHandle(picks);

    if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
      const polygon: Polygon = tentativeFeature.geometry;

      if (
        clickedEditHandle &&
        clickedEditHandle.featureIndex === -1 &&
        (clickedEditHandle.positionIndexes[1] === 0 ||
          clickedEditHandle.positionIndexes[1] === polygon.coordinates[0].length - 3)
      ) {
        this.resetClickSequence();

        // They clicked the first or last point (or double-clicked), so complete the polygon
        // Remove the hovered position
        const polygonToAdd: Polygon = {
          type: 'Polygon',
          coordinates: [[...polygon.coordinates[0].slice(0, -2), polygon.coordinates[0][0]]]
        };

        const updatedData = featureCollection
          .addFeature({
            type: 'Feature',
            properties: {},
            geometry: polygonToAdd
          })
          .getObject();

        editAction = {
          updatedData,
          editType: 'addFeature',
          featureIndex: updatedData.features.length - 1,
          positionIndexes: null,
          position: null
        };
      }
    }

    // Trigger pointer move right away in order for it to update edit handles (to support double-click)
    const fakePointerMoveEvent = {
      screenCoords: [-1, -1],
      groundCoords: event.groundCoords,
      picks: [],
      isDragging: false,
      pointerDownPicks: null,
      pointerDownScreenCoords: null,
      pointerDownGroundCoords: null,
      sourceEvent: null
    };
    this.handlePointerMove(fakePointerMoveEvent);

    return editAction;
  }

  handlePointerMove({
    groundCoords
  }: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
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
          coordinates: [...clickSequence, groundCoords]
        }
      });
    } else {
      // Draw a Polygon connecting all the clicked points with the hovered point
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...clickSequence, groundCoords, clickSequence[0]]]
        }
      });
    }

    return result;
  }
}
