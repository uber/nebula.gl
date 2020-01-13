// @flow

import { generatePointsParallelToLinePoints } from '../utils.js';
import type { Position, Polygon, FeatureOf } from '../geojson-types.js';
import { ThreeClickPolygonMode } from './three-click-polygon-mode.js';

export class DrawRectangleUsingThreePointsMode extends ThreeClickPolygonMode {
  getThreeClickPolygon(
    coord1: Position,
    coord2: Position,
    coord3: Position,
    modeConfig: any
  ): ?FeatureOf<Polygon> {
    const [p3, p4] = generatePointsParallelToLinePoints(coord1, coord2, coord3);

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            // Draw a polygon containing all the points of the LineString,
            // then the points orthogonal to the lineString,
            // then back to the starting position
            coord1,
            coord2,
            p3,
            p4,
            coord1
          ]
        ]
      }
    };
  }
}
