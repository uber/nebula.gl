// @flow

// Geometry types

export type Position = [number, number];
export type PointCoordinates = Position;
export type LineStringCoordinates = PointCoordinates[];
export type PolygonCoordinates = LineStringCoordinates[];
export type MultiPointCoordinates = PointCoordinates[];
export type MultiLineStringCoordinates = LineStringCoordinates[];
export type MultiPolygonCoordinates = PolygonCoordinates[];

export type AnyCoordinates =
  | PointCoordinates
  | LineStringCoordinates
  | PolygonCoordinates
  | MultiPointCoordinates
  | MultiLineStringCoordinates
  | MultiPolygonCoordinates;

export type Point = {
  type: 'Point',
  coordinates: PointCoordinates
};

export type LineString = {
  type: 'LineString',
  coordinates: LineStringCoordinates
};

export type Polygon = {
  type: 'Polygon',
  coordinates: PolygonCoordinates
};

export type MultiPoint = {
  type: 'MultiPoint',
  coordinates: MultiPointCoordinates
};

export type MultiLineString = {
  type: 'MultiLineString',
  coordinates: MultiLineStringCoordinates
};

export type MultiPolygon = {
  type: 'MultiPolygon',
  coordinates: MultiPolygonCoordinates
};

export type Geometry = Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon;

export type Polygonal = Polygon | MultiPolygon;

// Feature types

export type BoundingBoxArray = [number, number, number, number];

export type Feature = {
  type: 'Feature',
  geometry: Geometry,
  properties?: {},
  id?: string | number,
  bbox?: BoundingBoxArray
};

export type FeatureCollection = {
  type: 'FeatureCollection',
  features: Feature[],
  properties?: {},
  id?: string | number,
  bbox?: BoundingBoxArray
};

export type AnyGeoJson = Feature | FeatureCollection;
