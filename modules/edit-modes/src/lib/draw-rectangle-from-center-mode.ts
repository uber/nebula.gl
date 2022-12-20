import bboxPolygon from '@turf/bbox-polygon';
import { Position, Polygon, FeatureOf } from '../geojson-types';
import { TwoClickPolygonMode } from './two-click-polygon-mode';

export class DrawRectangleFromCenterMode extends TwoClickPolygonMode {
  getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon> {
    const longitude =
      coord1[0] > coord2[0]
        ? coord1[0] + Math.abs(coord1[0] - coord2[0])
        : coord1[0] - Math.abs(coord1[0] - coord2[0]);
    const latitude =
      coord1[1] > coord2[1]
        ? coord1[1] + Math.abs(coord1[1] - coord2[1])
        : coord1[1] - Math.abs(coord1[1] - coord2[1]);

    const rectangle = bboxPolygon([longitude, latitude, coord2[0], coord2[1]]);
    rectangle.properties = rectangle.properties || {};
    rectangle.properties.shape = 'Rectangle';

    // @ts-expect-error turf typing too wide
    return rectangle;
  }
}
