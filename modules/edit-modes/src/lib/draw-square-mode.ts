import bboxPolygon from '@turf/bbox-polygon';
import turfDistance from '@turf/distance';
import turfAlong from '@turf/along';
import { point, lineString as turfLineString } from '@turf/helpers';
import { Position, Polygon, FeatureOf } from '../geojson-types';
import { TwoClickPolygonMode } from './two-click-polygon-mode';

export class DrawSquareMode extends TwoClickPolygonMode {
  getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon> {
    const x1 = coord1[0];
    const y1 = coord1[1];

    const x2 = coord2[0];
    const y2 = coord2[1];

    // get the coordinates of the other two rectangle vertices
    const coordA = [x2, y1];
    const coordB = [x1, y2];

    // determine the shortest distance to the origin, which will be the length of each square side
    const distanceA = turfDistance(point(coordA), point(coord1));
    const distanceB = turfDistance(point(coordB), point(coord1));
    const shortestDistance = distanceA <= distanceB ? distanceA : distanceB;

    // determine which coordinate pair of the two is closest to the origin
    const closestPoint = distanceA <= distanceB ? coordA : coordB;

    // create a linestring which will used to locate the second square vertex
    const line = turfLineString([closestPoint, coord2]);

    // get the coordinates of the second square vertex
    const newPoint = turfAlong(line, shortestDistance);
    var corner = newPoint.geometry.coordinates;

    const square = bboxPolygon([coord1[0], coord1[1], corner[0], corner[1]]);
    square.properties = square.properties || {};
    square.properties.shape = 'Square';

    // @ts-ignore
    return square;
  }
}
