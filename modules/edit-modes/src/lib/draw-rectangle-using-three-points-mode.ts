import { generatePointsParallelToLinePoints } from '../utils';
import { Position, Polygon, FeatureOf } from '../geojson-types';
import { ThreeClickPolygonMode } from './three-click-polygon-mode';

export class DrawRectangleUsingThreePointsMode extends ThreeClickPolygonMode {
  getThreeClickPolygon(
    coord1: Position,
    coord2: Position,
    coord3: Position,
    modeConfig: any
  ): FeatureOf<Polygon> | null | undefined {
    const [p3, p4] = generatePointsParallelToLinePoints(coord1, coord2, coord3);

    return {
      type: 'Feature',
      properties: {
        shape: 'Rectangle',
      },
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
            coord1,
          ],
        ],
      },
    };
  }
}
