// @flow
/* eslint-disable no-unused-vars */

import type {
  Point,
  LineString,
  Polygon,
  MultiPoint,
  MultiLineString,
  MultiPolygon,
  Position
} from '../geojson-types.js';

const point: Point = {
  type: 'Point',
  coordinates: [1, 2]
};

const lineString: LineString = {
  type: 'LineString',
  coordinates: [[1, 2], [3, 4]]
};

const polygonSolid: Polygon = {
  type: 'Polygon',
  coordinates: [lineString.coordinates]
};

const polygonWithHole: Polygon = {
  type: 'Polygon',
  coordinates: [lineString.coordinates, lineString.coordinates]
};

const multiPoint: MultiPoint = {
  type: 'MultiPoint',
  coordinates: [point.coordinates, point.coordinates]
};

const multiLineString: MultiLineString = {
  type: 'MultiLineString',
  coordinates: [lineString.coordinates, lineString.coordinates]
};

const multiPolygon: MultiPolygon = {
  type: 'MultiPolygon',
  coordinates: [polygonSolid.coordinates, polygonWithHole.coordinates]
};

const position: Position = multiPolygon[1][2];
const longitude: number = position[0];
const latitude: number = position[1];

// $FlowFixMe: expected error
const altitudeNotSupported: number = position[2];
