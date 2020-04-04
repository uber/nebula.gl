// Geometry types

export type Position = [number, number] | [number, number, number];
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
  type: 'Point';
  coordinates: PointCoordinates;
};

export type LineString = {
  type: 'LineString';
  coordinates: LineStringCoordinates;
};

export type Polygon = {
  type: 'Polygon';
  coordinates: PolygonCoordinates;
};

export type MultiPoint = {
  type: 'MultiPoint';
  coordinates: MultiPointCoordinates;
};

export type MultiLineString = {
  type: 'MultiLineString';
  coordinates: MultiLineStringCoordinates;
};

export type MultiPolygon = {
  type: 'MultiPolygon';
  coordinates: MultiPolygonCoordinates;
};

export type Geometry = Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon;

export type Polygonal = Polygon | MultiPolygon;

// Feature types

export type BoundingBoxArray = [number, number, number, number];

export type FeatureOf<T extends Geometry> = {
  type: 'Feature';
  geometry: T;
  properties?: {
    [key: string]: any;
  };
  id?: string | number;
  bbox?: BoundingBoxArray;
};

export type FeatureWithProps<T extends Geometry, P> = {
  type: 'Feature';
  geometry: T;
  properties: P;
};

export type Feature =
  | FeatureOf<Point>
  | FeatureOf<LineString>
  | FeatureOf<Polygon>
  | FeatureOf<MultiPoint>
  | FeatureOf<MultiLineString>
  | FeatureOf<MultiPolygon>;

export type FeatureCollection = {
  type: 'FeatureCollection';
  features: Feature[];
  properties?: {};
  id?: string | number;
  bbox?: BoundingBoxArray;
};

export type AnyGeoJson = Feature | FeatureCollection;
