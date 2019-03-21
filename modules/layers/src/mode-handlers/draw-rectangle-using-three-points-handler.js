// @flow

import { generatePointsParallelToLinePoints } from '../utils';
import type { LineString } from '../geojson-types.js';
import type { PointerMoveEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ThreeClickPolygonHandler } from './three-click-polygon-handler.js';

export class DrawRectangleUsingThreePointsHandler extends ThreeClickPolygonHandler {
  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };
    const clickSequence = this.getClickSequence();

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const groundCoords = event.groundCoords;

    if (clickSequence.length === 1) {
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [clickSequence[0], groundCoords]
        }
      });
    } else if (clickSequence.length === 2) {
      const lineString: LineString = {
        type: 'LineString',
        coordinates: clickSequence
      };
      const [p1, p2] = clickSequence;
      const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, groundCoords);

      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              // Draw a polygon containing all the points of the LineString,
              // then the points orthogonal to the lineString,
              // then back to the starting position
              ...lineString.coordinates,
              p3,
              p4,
              p1
            ]
          ]
        }
      });
    }

    return result;
  }
}
