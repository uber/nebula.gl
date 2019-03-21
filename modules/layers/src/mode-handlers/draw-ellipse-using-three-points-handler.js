// @flow

import distance from '@turf/distance';
import ellipse from '@turf/ellipse';
import bearing from '@turf/bearing';
import { point } from '@turf/helpers';
import type { PointerMoveEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ThreeClickPolygonHandler } from './three-click-polygon-handler.js';
import { getIntermediatePosition } from './mode-handler.js';

export class DrawEllipseUsingThreePointsHandler extends ThreeClickPolygonHandler {
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
      const [p1, p2] = clickSequence;

      const centerCoordinates = getIntermediatePosition(p1, p2);
      const xSemiAxis = Math.max(distance(centerCoordinates, point(groundCoords)), 0.001);
      const ySemiAxis = Math.max(distance(p1, p2), 0.001) / 2;
      const options = { angle: bearing(p1, p2) };

      this._setTentativeFeature(ellipse(centerCoordinates, xSemiAxis, ySemiAxis, options));
    }

    return result;
  }
}
