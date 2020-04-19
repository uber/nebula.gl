import circle from '@turf/circle';
import distance from '@turf/distance';
import { Position, Polygon, FeatureOf } from '../geojson-types';
import { TwoClickPolygonMode } from './two-click-polygon-mode';

export class DrawCircleFromCenterMode extends TwoClickPolygonMode {
  getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon> {
    // Default turf value for circle is 64
    const { steps = 64 } = modeConfig || {};
    const options = { steps };

    if (steps < 4) {
      console.warn(`Minimum steps to draw a circle is 4 `); // eslint-disable-line no-console,no-undef
      options.steps = 4;
    }

    const radius = Math.max(distance(coord1, coord2), 0.001);
    const geometry = circle(coord1, radius, options);

    geometry.properties = geometry.properties || {};
    geometry.properties.shape = 'Circle';

    return geometry;
  }
}
