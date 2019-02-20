// @flow

// Geometry types

export type Position = [number, number];
export type PointCoordinates = Position;
export type LineStringCoordinates = Position[];
export type PolygonCoordinates = Position[][];
export type MultiPointCoordinates = Position[];
export type MultiLineStringCoordinates = Position[][];
export type MultiPolygonCoordinates = Position[][][];

export type AnyCoordinates =
  | PointCoordinates
  | LineStringCoordinates
  | PolygonCoordinates
  | MultiPointCoordinates
  | MultiLineStringCoordinates
  | MultiPolygonCoordinates;

export type Point = {
  type: 'Point',
  coordinates: PointCoordinates,
  properties?: { [key: string]: any }
};

export type LineString = {
  type: 'LineString',
  coordinates: LineStringCoordinates,
  properties?: { [key: string]: any }
};

export type Polygon = {
  type: 'Polygon',
  coordinates: PolygonCoordinates,
  properties?: { [key: string]: any }
};

export type MultiPoint = {
  type: 'MultiPoint',
  coordinates: MultiPointCoordinates,
  properties?: { [key: string]: any }
};

export type MultiLineString = {
  type: 'MultiLineString',
  coordinates: MultiLineStringCoordinates,
  properties?: { [key: string]: any }
};

export type MultiPolygon = {
  type: 'MultiPolygon',
  coordinates: MultiPolygonCoordinates,
  properties?: { [key: string]: any }
};

export type Geometry = Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon;

export type Polygonal = Polygon | MultiPolygon;

// Feature types

export type BoundingBoxArray = [number, number, number, number];

export type FeatureOf<T: Geometry> = {
  type: 'Feature',
  geometry: T,
  properties?: { _internalIndex?: number },
  id?: string | number,
  bbox?: BoundingBoxArray
};

export type Feature =
  | FeatureOf<Point>
  | FeatureOf<LineString>
  | FeatureOf<Polygon>
  | FeatureOf<MultiPoint>
  | FeatureOf<MultiLineString>
  | FeatureOf<MultiPolygon>;

export type FeatureCollection = {
  type: 'FeatureCollection',
  features: Feature[],
  properties?: {},
  id?: string | number,
  bbox?: BoundingBoxArray
};

export type AnyGeoJson = Feature | FeatureCollection;
