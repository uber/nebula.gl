// @flow

import { generatePointsParallelToLinePoints } from '../utils';
import type { LineString } from '../geojson-types.js';
import type { PointerMoveEvent } from '../types.js';
import { type GeoJsonEditAction } from './geojson-edit-mode.js';
import { ThreeClickPolygonMode } from './three-click-polygon-mode.js';

export class DrawRectangleUsingThreePointsMode extends ThreeClickPolygonMode {
  handlePointerMoveAdapter(
    event: PointerMoveEvent
  ): { editAction: ?GeoJsonEditAction, cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };
    const clickSequence = this.getClickSequence();

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const mapCoords = event.mapCoords;

    if (clickSequence.length === 1) {
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [clickSequence[0], mapCoords]
        }
      });
    } else if (clickSequence.length === 2) {
      const lineString: LineString = {
        type: 'LineString',
        coordinates: clickSequence
      };
      const [p1, p2] = clickSequence;
      const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, mapCoords);

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
