// @flow

import destination from '@turf/destination';
import bearing from '@turf/bearing';
import pointToLineDistance from '@turf/point-to-line-distance';
import { point } from '@turf/helpers';
import type { LineString, Feature } from '../../geojson-types.js';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { getPickedEditHandle } from './mode-handler.js';
import { ModifyHandler } from './modify-handler';

export class ExtrudeHandler extends ModifyHandler {
  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    this._lastPointerMovePicks = event.picks;

    let editAction: ?EditAction = null;

    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (event.isDragging && editHandle) {
      const [row, index] = editHandle.positionIndexes;
      const feature: Feature = this.getImmutableFeatureCollection().getObject().features[
        editHandle.featureIndex
      ];
      const coordinates: any = feature.geometry.coordinates;

      if (coordinates.length && coordinates[row].length) {
        const p1 = coordinates[row][index];
        const p2 = coordinates[row][index + 1];
        const lineString: LineString = {
          type: 'LineString',
          coordinates: [p1, p2]
        };

        const pt = point(event.groundCoords);
        const options = { units: 'miles' };
        const ddistance = pointToLineDistance(pt, lineString, options);
        const lineBearing = bearing(p1, p2);

        // Check if current point is to the left or right of line
        // Line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
        // then (x−x1)(y2−y1)−(y−y1)(x2−x1)
        const isPointToLeftOfLine =
          (event.groundCoords[0] - p1[0]) * (p2[1] - p1[1]) -
          (event.groundCoords[1] - p1[1]) * (p2[0] - p1[0]);

        // Bearing to draw perpendicular to the line string
        const orthogonalBearing = isPointToLeftOfLine < 0 ? lineBearing - 90 : lineBearing - 270;

        // Get coordinates for the point p3 and p4 which are perpendicular to the lineString
        // Add the distance as the current position moves away from the lineString
        const p3 = destination(p2, ddistance, orthogonalBearing, options);
        const p4 = destination(p1, ddistance, orthogonalBearing, options);

        const updatedData = this.getImmutableFeatureCollection()
          .replacePosition(editHandle.featureIndex, [row, index], p4.geometry.coordinates)
          .replacePosition(editHandle.featureIndex, [row, index + 1], p3.geometry.coordinates)
          .getObject();

        editAction = {
          updatedData,
          editType: 'movePosition',
          featureIndex: editHandle.featureIndex,
          positionIndexes: [row, index + 1],
          position: p4.geometry.coordinates
        };
      }
    }

    // Cancel map panning if pointer went down on an edit handle
    const cancelMapPan = Boolean(editHandle);

    return { editAction, cancelMapPan };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();

    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle && editHandle.type === 'intermediate') {
      const [row, index] = editHandle.positionIndexes;
      const feature = this.getImmutableFeatureCollection().getObject().features[
        editHandle.featureIndex
      ];

      const coordinates: any = feature.geometry.coordinates;
      if (coordinates.length && coordinates[row].length) {
        const p1 = coordinates[row][index - 1];
        const p2 = coordinates[row][index];

        const updatedData = this.getImmutableFeatureCollection()
          .addPosition(editHandle.featureIndex, [row, index], p1)
          .addPosition(editHandle.featureIndex, [row, index + 1], p2)
          .getObject();

        editAction = {
          updatedData,
          editType: 'addPositions',
          featureIndex: editHandle.featureIndex,
          positionIndexes: [row, index + 1],
          position: p2
        };
      }
    }

    return editAction;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const [row, index] = editHandle.positionIndexes;
      const feature = this.getImmutableFeatureCollection().getObject().features[
        editHandle.featureIndex
      ];

      const coordinates: any = feature.geometry.coordinates;
      if (coordinates.length && coordinates[row].length) {
        const p1 = coordinates[row][index];
        const p2 = coordinates[row][index + 1];
        const lineString: LineString = {
          type: 'LineString',
          coordinates: [p1, p2]
        };
        const pt = point(event.groundCoords);
        const options = { units: 'miles' };
        const ddistance = pointToLineDistance(pt, lineString, options);
        const lineBearing = bearing(p1, p2);

        // Check if current point is to the left or right of line
        // Line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
        // then (x−x1)(y2−y1)−(y−y1)(x2−x1)
        const isPointToLeftOfLine =
          (event.groundCoords[0] - p1[0]) * (p2[1] - p1[1]) -
          (event.groundCoords[1] - p1[1]) * (p2[0] - p1[0]);

        // Bearing to draw perpendicular to the line string
        const orthogonalBearing = isPointToLeftOfLine < 0 ? lineBearing - 90 : lineBearing - 270;

        // Get coordinates for the point p3 and p4 which are perpendicular to the lineString
        // Add the distance as the current position moves away from the lineString
        const p3 = destination(p2, ddistance, orthogonalBearing, options);
        const p4 = destination(p1, ddistance, orthogonalBearing, options);
        const updatedData = this.getImmutableFeatureCollection()
          .replacePosition(editHandle.featureIndex, [row, index], p4.geometry.coordinates)
          .replacePosition(editHandle.featureIndex, [row, index + 1], p3.geometry.coordinates)
          .getObject();

        editAction = {
          updatedData,
          editType: 'finishMovePositions',
          featureIndex: editHandle.featureIndex,
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords
        };
      }
    }

    return editAction;
  }
}
