export declare type Position = [number, number] | [number, number, number];
export declare type PointCoordinates = Position;
export declare type LineStringCoordinates = Position[];
export declare type PolygonCoordinates = Position[][];
export declare type MultiPointCoordinates = Position[];
export declare type MultiLineStringCoordinates = Position[][];
export declare type MultiPolygonCoordinates = Position[][][];
export declare type AnyCoordinates = PointCoordinates | LineStringCoordinates | PolygonCoordinates | MultiPointCoordinates | MultiLineStringCoordinates | MultiPolygonCoordinates;
export declare type Point = {
    type: 'Point';
    coordinates: PointCoordinates;
};
export declare type LineString = {
    type: 'LineString';
    coordinates: LineStringCoordinates;
};
export declare type Polygon = {
    type: 'Polygon';
    coordinates: PolygonCoordinates;
};
export declare type MultiPoint = {
    type: 'MultiPoint';
    coordinates: MultiPointCoordinates;
};
export declare type MultiLineString = {
    type: 'MultiLineString';
    coordinates: MultiLineStringCoordinates;
};
export declare type MultiPolygon = {
    type: 'MultiPolygon';
    coordinates: MultiPolygonCoordinates;
};
export declare type Geometry = Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon;
export declare type Polygonal = Polygon | MultiPolygon;
export declare type BoundingBoxArray = [number, number, number, number];
export declare type FeatureOf<T extends Geometry> = {
    type: 'Feature';
    geometry: T;
    properties?: {
        [key: string]: any;
    };
    id?: string | number;
    bbox?: BoundingBoxArray;
};
export declare type FeatureWithProps<T extends Geometry, P> = {
    type: 'Feature';
    geometry: T;
    properties: P;
};
export declare type Feature = FeatureOf<Point> | FeatureOf<LineString> | FeatureOf<Polygon> | FeatureOf<MultiPoint> | FeatureOf<MultiLineString> | FeatureOf<MultiPolygon>;
export declare type FeatureCollection = {
    type: 'FeatureCollection';
    features: Feature[];
    properties?: {};
    id?: string | number;
    bbox?: BoundingBoxArray;
};
export declare type AnyGeoJson = Feature | FeatureCollection;
//# sourceMappingURL=geojson-types.d.ts.map