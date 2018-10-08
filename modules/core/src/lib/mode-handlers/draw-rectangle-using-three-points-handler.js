// @flow

import destination from '@turf/destination';
import bearing from '@turf/bearing';
import pointToLineDistance from '@turf/point-to-line-distance';
import { point } from '@turf/helpers';
import type { LineString } from '../../geojson-types.js';
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
      const pt = point(groundCoords);
      const options = { units: 'miles' };
      const ddistance = pointToLineDistance(pt, lineString, options);
      const lineBearing = bearing(p1, p2);

      // Check if current point is to the left or right of line
      // Line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
      // then (x−x1)(y2−y1)−(y−y1)(x2−x1)
      const isPointToLeftOfLine =
        (groundCoords[0] - p1[0]) * (p2[1] - p1[1]) - (groundCoords[1] - p1[1]) * (p2[0] - p1[0]);

      // Bearing to draw perpendicular to the line string
      const orthogonalBearing = isPointToLeftOfLine < 0 ? lineBearing - 90 : lineBearing - 270;

      // Get coordinates for the point p3 and p4 which are perpendicular to the lineString
      // Add the distance as the current position moves away from the lineString
      const p3 = destination(p2, ddistance, orthogonalBearing, options);
      const p4 = destination(p1, ddistance, orthogonalBearing, options);

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
              p3.geometry.coordinates,
              p4.geometry.coordinates,
              p1
            ]
          ]
        }
      });
    }

    return result;
  }
}
