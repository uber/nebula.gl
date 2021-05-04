import { Feature, FeatureCollection, Geometry, Position } from '../geojson-types';
export declare class ImmutableFeatureCollection {
    featureCollection: FeatureCollection;
    constructor(featureCollection: FeatureCollection);
    getObject(): FeatureCollection;
    /**
     * Replaces the position deeply nested withing the given feature's geometry.
     * Works with Point, MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
     *
     * @param featureIndex The index of the feature to update
     * @param positionIndexes An array containing the indexes of the position to replace
     * @param updatedPosition The updated position to place in the result (i.e. [lng, lat])
     *
     * @returns A new `ImmutableFeatureCollection` with the given position replaced. Does not modify this `ImmutableFeatureCollection`.
     */
    replacePosition(featureIndex: number, positionIndexes: number[] | null | undefined, updatedPosition: Position): ImmutableFeatureCollection;
    /**
     * Removes a position deeply nested in a GeoJSON geometry coordinates array.
     * Works with MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
     *
     * @param featureIndex The index of the feature to update
     * @param positionIndexes An array containing the indexes of the postion to remove
     *
     * @returns A new `ImmutableFeatureCollection` with the given coordinate removed. Does not modify this `ImmutableFeatureCollection`.
     */
    removePosition(featureIndex: number, positionIndexes: number[] | null | undefined): ImmutableFeatureCollection;
    /**
     * Adds a position deeply nested in a GeoJSON geometry coordinates array.
     * Works with MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
     *
     * @param featureIndex The index of the feature to update
     * @param positionIndexes An array containing the indexes of the position that will proceed the new position
     * @param positionToAdd The new position to place in the result (i.e. [lng, lat])
     *
     * @returns A new `ImmutableFeatureCollection` with the given coordinate removed. Does not modify this `ImmutableFeatureCollection`.
     */
    addPosition(featureIndex: number, positionIndexes: number[] | null | undefined, positionToAdd: Position): ImmutableFeatureCollection;
    replaceGeometry(featureIndex: number, geometry: Geometry): ImmutableFeatureCollection;
    addFeature(feature: Feature): ImmutableFeatureCollection;
    addFeatures(features: Feature[]): ImmutableFeatureCollection;
    deleteFeature(featureIndex: number): ImmutableFeatureCollection;
    deleteFeatures(featureIndexes: number[]): ImmutableFeatureCollection;
}
//# sourceMappingURL=immutable-feature-collection.d.ts.map