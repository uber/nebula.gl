// @flow

import distance from '@turf/distance';
import ellipse from '@turf/ellipse';
import bearing from '@turf/bearing';
import { point } from '@turf/helpers';
import type { Position, Polygon, FeatureOf } from '../geojson-types.js';
import { getIntermediatePosition } from './geojson-edit-mode.js';
import { ThreeClickPolygonMode } from './three-click-polygon-mode.js';

export class DrawEllipseUsingThreePointsMode extends ThreeClickPolygonMode {
  getThreeClickPolygon(
    coord1: Position,
    coord2: Position,
    coord3: Position,
    modeConfig: any
  ): ?FeatureOf<Polygon> {
    const centerCoordinates = getIntermediatePosition(coord1, coord2);
    const xSemiAxis = Math.max(distance(centerCoordinates, point(coord3)), 0.001);
    const ySemiAxis = Math.max(distance(coord1, coord2), 0.001) / 2;
    const options = { angle: bearing(coord1, coord2) };

    return ellipse(centerCoordinates, xSemiAxis, ySemiAxis, options);
  }
}
