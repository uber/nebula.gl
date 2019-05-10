// @flow

import type {
  Feature,
  FeatureCollection,
  Geometry,
  Polygon,
  MultiLineString,
  MultiPolygon,
  Position,
  PolygonCoordinates
} from '../geojson-types.js';

export class ImmutableFeatureCollection {
  featureCollection: FeatureCollection;

  constructor(featureCollection: FeatureCollection) {
    this.featureCollection = featureCollection;
  }

  getObject() {
    return this.featureCollection;
  }

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
  replacePosition(
    featureIndex: number,
    positionIndexes: number[],
    updatedPosition: Position
  ): ImmutableFeatureCollection {
    const geometry = this.featureCollection.features[featureIndex].geometry;

    const isPolygonal = geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
    const updatedGeometry: any = {
      ...geometry,
      coordinates: immutablyReplacePosition(
        geometry.coordinates,
        positionIndexes,
        updatedPosition,
        isPolygonal
      )
    };

    return this.replaceGeometry(featureIndex, updatedGeometry);
  }

  /**
   * Removes a position deeply nested in a GeoJSON geometry coordinates array.
   * Works with MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
   *
   * @param featureIndex The index of the feature to update
   * @param positionIndexes An array containing the indexes of the postion to remove
   *
   * @returns A new `ImmutableFeatureCollection` with the given coordinate removed. Does not modify this `ImmutableFeatureCollection`.
   */
  removePosition(featureIndex: number, positionIndexes: number[]): ImmutableFeatureCollection {
    const geometry = this.featureCollection.features[featureIndex].geometry;

    if (geometry.type === 'Point') {
      throw Error(`Can't remove a position from a Point or there'd be nothing left`);
    }
    if (
      geometry.type === 'MultiPoint' &&
      // only 1 point left
      geometry.coordinates.length < 2
    ) {
      throw Error(`Can't remove the last point of a MultiPoint or there'd be nothing left`);
    }
    if (
      geometry.type === 'LineString' &&
      // only 2 positions
      geometry.coordinates.length < 3
    ) {
      throw Error(`Can't remove position. LineString must have at least two positions`);
    }
    if (
      geometry.type === 'Polygon' &&
      // outer ring is a triangle
      geometry.coordinates[0].length < 5 &&
      // trying to remove from outer ring
      positionIndexes[0] === 0
    ) {
      throw Error(`Can't remove position. Polygon's outer ring must have at least four positions`);
    }
    if (
      geometry.type === 'MultiLineString' &&
      // only 1 LineString left
      geometry.coordinates.length === 1 &&
      // only 2 positions
      geometry.coordinates[0].length < 3
    ) {
      throw Error(`Can't remove position. MultiLineString must have at least two positions`);
    }
    if (
      geometry.type === 'MultiPolygon' &&
      // only 1 polygon left
      geometry.coordinates.length === 1 &&
      // outer ring is a triangle
      geometry.coordinates[0][0].length < 5 &&
      // trying to remove from first polygon
      positionIndexes[0] === 0 &&
      // trying to remove from outer ring
      positionIndexes[1] === 0
    ) {
      throw Error(
        `Can't remove position. MultiPolygon's outer ring must have at least four positions`
      );
    }

    const isPolygonal = geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
    const updatedGeometry: any = {
      ...geometry,
      coordinates: immutablyRemovePosition(geometry.coordinates, positionIndexes, isPolygonal)
    };

    // Handle cases where incomplete geometries need pruned (e.g. holes that were triangles)
    pruneGeometryIfNecessary(updatedGeometry);

    return this.replaceGeometry(featureIndex, updatedGeometry);
  }

  /**
   * Adds a position deeply nested in a GeoJSON geometry coordinates array.
   * Works with MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
   *
   * @param featureIndex The index of the feature to update
   * @param positionIndexes An array containing the indexes of the postion that will preceed the new position
   * @param positionToAdd The new position to place in the result (i.e. [lng, lat])
   *
   * @returns A new `ImmutableFeatureCollection` with the given coordinate removed. Does not modify this `ImmutableFeatureCollection`.
   */
  addPosition(
    featureIndex: number,
    positionIndexes: number[],
    positionToAdd: Position
  ): ImmutableFeatureCollection {
    const geometry = this.featureCollection.features[featureIndex].geometry;

    if (geometry.type === 'Point') {
      throw new Error('Unable to add a position to a Point feature');
    }

    const isPolygonal = geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
    const updatedGeometry: any = {
      ...geometry,
      coordinates: immutablyAddPosition(
        geometry.coordinates,
        positionIndexes,
        positionToAdd,
        isPolygonal
      )
    };

    return this.replaceGeometry(featureIndex, updatedGeometry);
  }

  replaceGeometry(featureIndex: number, geometry: Geometry): ImmutableFeatureCollection {
    const updatedFeature: any = {
      ...this.featureCollection.features[featureIndex],
      geometry
    };

    const updatedFeatureCollection = {
      ...this.featureCollection,
      features: [
        ...this.featureCollection.features.slice(0, featureIndex),
        updatedFeature,
        ...this.featureCollection.features.slice(featureIndex + 1)
      ]
    };

    return new ImmutableFeatureCollection(updatedFeatureCollection);
  }

  addFeature(feature: Feature): ImmutableFeatureCollection {
    const updatedFeatureCollection = {
      ...this.featureCollection,
      features: [...this.featureCollection.features, feature]
    };

    return new ImmutableFeatureCollection(updatedFeatureCollection);
  }
}

function getUpdatedPosition(updatedPosition: Position, previousPosition: Position): Position {
  // This function checks if the updatedPosition is missing elevation
  // and copies it from previousPosition
  if (updatedPosition.length === 2 && previousPosition.length === 3) {
    const elevation = (previousPosition: any)[2];
    return [updatedPosition[0], updatedPosition[1], elevation];
  }

  return updatedPosition;
}

function immutablyReplacePosition(
  coordinates: any,
  positionIndexes: number[],
  updatedPosition: Position,
  isPolygonal: boolean
): any {
  if (!positionIndexes) {
    return coordinates;
  }
  if (positionIndexes.length === 0) {
    return getUpdatedPosition(updatedPosition, coordinates);
  }
  if (positionIndexes.length === 1) {
    const updated = [
      ...coordinates.slice(0, positionIndexes[0]),
      getUpdatedPosition(updatedPosition, coordinates[positionIndexes[0]]),
      ...coordinates.slice(positionIndexes[0] + 1)
    ];

    if (
      isPolygonal &&
      (positionIndexes[0] === 0 || positionIndexes[0] === coordinates.length - 1)
    ) {
      // for polygons, the first point is repeated at the end of the array
      // so, update it on both ends of the array
      updated[0] = getUpdatedPosition(updatedPosition, coordinates[0]);
      updated[coordinates.length - 1] = getUpdatedPosition(updatedPosition, coordinates[0]);
    }
    return updated;
  }

  // recursively update inner array
  return [
    ...coordinates.slice(0, positionIndexes[0]),
    immutablyReplacePosition(
      coordinates[positionIndexes[0]],
      positionIndexes.slice(1, positionIndexes.length),
      updatedPosition,
      isPolygonal
    ),
    ...coordinates.slice(positionIndexes[0] + 1)
  ];
}

function immutablyRemovePosition(
  coordinates: any,
  positionIndexes: number[],
  isPolygonal: boolean
): any {
  if (!positionIndexes) {
    return coordinates;
  }
  if (positionIndexes.length === 0) {
    throw Error('Must specify the index of the position to remove');
  }
  if (positionIndexes.length === 1) {
    const updated = [
      ...coordinates.slice(0, positionIndexes[0]),
      ...coordinates.slice(positionIndexes[0] + 1)
    ];

    if (
      isPolygonal &&
      (positionIndexes[0] === 0 || positionIndexes[0] === coordinates.length - 1)
    ) {
      // for polygons, the first point is repeated at the end of the array
      // so, if the first/last coordinate is to be removed, coordinates[1] will be the new first/last coordinate
      if (positionIndexes[0] === 0) {
        // change the last to be the same as the first
        updated[updated.length - 1] = updated[0];
      } else if (positionIndexes[0] === coordinates.length - 1) {
        // change the first to be the same as the last
        updated[0] = updated[updated.length - 1];
      }
    }
    return updated;
  }

  // recursively update inner array
  return [
    ...coordinates.slice(0, positionIndexes[0]),
    immutablyRemovePosition(
      coordinates[positionIndexes[0]],
      positionIndexes.slice(1, positionIndexes.length),
      isPolygonal
    ),
    ...coordinates.slice(positionIndexes[0] + 1)
  ];
}

function immutablyAddPosition(
  coordinates: any,
  positionIndexes: number[],
  positionToAdd: Position,
  isPolygonal: boolean
): any {
  if (!positionIndexes) {
    return coordinates;
  }
  if (positionIndexes.length === 0) {
    throw Error('Must specify the index of the position to remove');
  }
  if (positionIndexes.length === 1) {
    const updated = [
      ...coordinates.slice(0, positionIndexes[0]),
      positionToAdd,
      ...coordinates.slice(positionIndexes[0])
    ];
    return updated;
  }

  // recursively update inner array
  return [
    ...coordinates.slice(0, positionIndexes[0]),
    immutablyAddPosition(
      coordinates[positionIndexes[0]],
      positionIndexes.slice(1, positionIndexes.length),
      positionToAdd,
      isPolygonal
    ),
    ...coordinates.slice(positionIndexes[0] + 1)
  ];
}

function pruneGeometryIfNecessary(geometry: Geometry) {
  switch (geometry.type) {
    case 'Polygon':
      prunePolygonIfNecessary(geometry);
      break;
    case 'MultiLineString':
      pruneMultiLineStringIfNecessary(geometry);
      break;
    case 'MultiPolygon':
      pruneMultiPolygonIfNecessary(geometry);
      break;
    default:
      // Not downgradable
      break;
  }
}

function prunePolygonIfNecessary(geometry: Polygon) {
  const polygon = geometry.coordinates;

  // If any hole is no longer a polygon, remove the hole entirely
  for (let holeIndex = 1; holeIndex < polygon.length; holeIndex++) {
    if (removeHoleIfNecessary(polygon, holeIndex)) {
      // It was removed, so keep the index the same
      holeIndex--;
    }
  }
}

function pruneMultiLineStringIfNecessary(geometry: MultiLineString) {
  for (let lineStringIndex = 0; lineStringIndex < geometry.coordinates.length; lineStringIndex++) {
    const lineString = geometry.coordinates[lineStringIndex];
    if (lineString.length === 1) {
      // Only a single position left on this LineString, so remove it (can't have Point in MultiLineString)
      geometry.coordinates.splice(lineStringIndex, 1);
      // Keep the index the same
      lineStringIndex--;
    }
  }
}

function pruneMultiPolygonIfNecessary(geometry: MultiPolygon) {
  for (let polygonIndex = 0; polygonIndex < geometry.coordinates.length; polygonIndex++) {
    const polygon = geometry.coordinates[polygonIndex];
    const outerRing = polygon[0];

    // If the outer ring is no longer a polygon, remove the whole polygon
    if (outerRing.length <= 3) {
      geometry.coordinates.splice(polygonIndex, 1);
      // It was removed, so keep the index the same
      polygonIndex--;
    }

    for (let holeIndex = 1; holeIndex < polygon.length; holeIndex++) {
      if (removeHoleIfNecessary(polygon, holeIndex)) {
        // It was removed, so keep the index the same
        holeIndex--;
      }
    }
  }
}

function removeHoleIfNecessary(polygon: PolygonCoordinates, holeIndex: number) {
  const hole = polygon[holeIndex];
  if (hole.length <= 3) {
    polygon.splice(holeIndex, 1);
    return true;
  }
  return false;
}
