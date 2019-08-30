// @flow

import distance from '@turf/distance';
import ellipse from '@turf/ellipse';
import bearing from '@turf/bearing';
import { point } from '@turf/helpers';
import type { PointerMoveEvent } from '../types.js';
import { getIntermediatePosition, type GeoJsonEditAction } from './geojson-edit-mode.js';
import { ThreeClickPolygonMode } from './three-click-polygon-mode.js';

export class DrawEllipseUsingThreePointsMode extends ThreeClickPolygonMode {
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
      const [p1, p2] = clickSequence;

      const centerCoordinates = getIntermediatePosition(p1, p2);
      const xSemiAxis = Math.max(distance(centerCoordinates, point(mapCoords)), 0.001);
      const ySemiAxis = Math.max(distance(p1, p2), 0.001) / 2;
      const options = { angle: bearing(p1, p2) };

      this._setTentativeFeature(ellipse(centerCoordinates, xSemiAxis, ySemiAxis, options));
    }

    return result;
  }
}
