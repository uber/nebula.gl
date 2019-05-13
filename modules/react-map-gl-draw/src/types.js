// @flow

export type {
  Position,
  PointCoordinates,
  LineStringCoordinates,
  PolygonCoordinates,
  MultiPointCoordinates,
  MultiLineStringCoordinates,
  MultiPolygonCoordinates,
  AnyCoordinates,
  Point,
  LineString,
  Polygon,
  MultiPoint,
  MultiLineString,
  MultiPolygon,
  Geometry,
  Polygonal,
  BoundingBoxArray,
  FeatureOf,
  Feature,
  FeatureCollection,
  AnyGeoJson
} from '@nebula.gl/edit-modes';

export type ScreenCoordinates = {
  x: number,
  y: number
};

export type Id = string | number;

export type RenderState = { selected?: ?boolean, hovered?: ?boolean };
