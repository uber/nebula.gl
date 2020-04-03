// @flow
/* eslint-disable no-unused-vars, prefer-const */

import type {
  Point,
  LineString,
  Polygon,
  MultiPoint,
  MultiLineString,
  MultiPolygon,
  Geometry,
  Position,
  Feature,
  FeatureOf
} from '../src/geojson-types.ts';

let point: Point = {
  type: 'Point',
  coordinates: [1, 2]
};

let lineString: LineString = {
  type: 'LineString',
  coordinates: [[1, 2], [3, 4]]
};

let polygonSolid: Polygon = {
  type: 'Polygon',
  coordinates: [lineString.coordinates]
};

let polygonWithHole: Polygon = {
  type: 'Polygon',
  coordinates: [lineString.coordinates, lineString.coordinates]
};

let multiPoint: MultiPoint = {
  type: 'MultiPoint',
  coordinates: [point.coordinates, point.coordinates]
};

let multiLineString: MultiLineString = {
  type: 'MultiLineString',
  coordinates: [lineString.coordinates, lineString.coordinates]
};

let multiPolygon: MultiPolygon = {
  type: 'MultiPolygon',
  coordinates: [polygonSolid.coordinates, polygonWithHole.coordinates]
};

let position: Position = multiPolygon[1][2];
let longitude: number = position[0];
let latitude: number = position[1];

let pointFeature: FeatureOf<Point> = {
  type: 'Feature',
  geometry: point
};

let lineStringFeature: FeatureOf<LineString> = {
  type: 'Feature',
  geometry: lineString
};

let anyFeature: Feature = {
  type: 'Feature',
  geometry: multiPolygon
};

if (Math.random() > 0.5) {
  anyFeature = pointFeature;
} else {
  anyFeature = lineStringFeature;
}

const anyGeometry = anyFeature.geometry;
if (anyGeometry.type === 'LineString') {
  lineStringFeature.geometry = anyGeometry;
}

// Seems like these should work with Flow, but they don't  =(
// if (anyFeature.geometry.type === 'LineString') {
//   lineStringFeature = anyFeature;
// }
// if (anyFeature.geometry.type === 'Point') {
//   pointFeature = anyFeature;
// }

// $FlowFixMe: expected error
let altitudeNotSupported: number = position[2];

// $FlowFixMe: expected error
let somethinAintRight: FeatureOf<Point> = lineStringFeature;

if (anyGeometry.type === 'Point') {
  // $FlowFixMe: expected error
  lineStringFeature.geometry = anyGeometry;
}
