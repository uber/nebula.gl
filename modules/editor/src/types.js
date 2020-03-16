// @flow

// Property types

export type GeoJsonProperties = { [property: string]: any };

// Geometry types

export type GeoJsonPoint = {
  type: 'Point',
  coordinates: [number, number]
};

export type GeoJsonMultiPoint = {
  type: 'MultiPoint',
  coordinates: [number, number][]
};

export type GeoJsonLineString = {
  type: 'LineString',
  coordinates: [number, number][]
};

export type GeoJsonMultiLineString = {
  type: 'MultiLineString',
  coordinates: [number, number][][]
};

export type GeoJsonPolygon = {
  type: 'Polygon',
  coordinates: number[][][]
};

export type GeoJsonMultiPolygon = {
  type: 'MultiPolygon',
  coordinates: number[][][][]
};

export type BoundingBox = {
  west: number,
  south: number,
  east: number,
  north: number
};

export type GeoJsonGeometry =
  | GeoJsonPoint
  | GeoJsonLineString
  | GeoJsonPolygon
  | GeoJsonMultiPoint
  | GeoJsonMultiLineString
  | GeoJsonMultiPolygon;

export type PolygonalGeometry = GeoJsonPolygon | GeoJsonMultiPolygon;

// Feature types
export type GeoJsonFeature = {
  type: 'Feature',
  geometry: GeoJsonGeometry,

  // Don't allow null, even though it's allowed in the spec, to reduce null-checking bloat
  id: string,
  properties: GeoJsonProperties
};

export type GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: GeoJsonFeature[],

  // Don't allow null, even though it's allowed in the spec, to reduce null-checking bloat
  properties: GeoJsonProperties
};

export type AnyGeoJson = GeoJsonFeature | GeoJsonFeatureCollection;
