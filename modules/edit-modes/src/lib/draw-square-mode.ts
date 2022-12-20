import bboxPolygon from '@turf/bbox-polygon';
import turfDistance from '@turf/distance';
import turfAlong from '@turf/along';
import { point, lineString as turfLineString } from '@turf/helpers';
import { Position, Polygon, FeatureOf } from '../geojson-types';
import { TwoClickPolygonMode } from './two-click-polygon-mode';

export class DrawSquareMode extends TwoClickPolygonMode {
  getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon> {
    // get the coordinates of the other two rectangle vertices
    const coord3 = [coord2[0], coord1[1]];
    const coord4 = [coord1[0], coord2[1]];

    // determine the shortest distance to the origin, which will be the length of each square side
    const distance1 = turfDistance(point(coord3), point(coord1));
    const distance2 = turfDistance(point(coord4), point(coord1));
    const shortestDistance = distance1 <= distance2 ? distance1 : distance2;

    // determine which coordinate pair of the two is closest to the origin
    const closestPoint = distance1 <= distance2 ? coord3 : coord4;

    // create a linestring which will used to locate the second square vertex
    const line = turfLineString([closestPoint, coord2]);

    // get the coordinates of the second square vertex
    const newPoint = turfAlong(line, shortestDistance);
    const corner = newPoint.geometry.coordinates;

    const square = bboxPolygon([coord1[0], coord1[1], corner[0], corner[1]]);
    square.properties = square.properties || {};
    square.properties.shape = 'Square';

    // @ts-expect-error turf types too wide
    return square;
  }
}
