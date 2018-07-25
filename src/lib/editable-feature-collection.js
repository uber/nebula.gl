// @flow
import type { GeoJsonGeometry } from '../types';

type FeatureCollection = {
  features: Array<Object>
};

export class EditableFeatureCollection {
  featureCollection: FeatureCollection;

  constructor(featureCollection: FeatureCollection) {
    this.featureCollection = featureCollection;
  }

  getObject(): FeatureCollection {
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
   * @returns A new `EditableFeatureCollection` with the given position replaced. Does not modify this `EditableFeatureCollection`.
   */
  replacePosition(
    featureIndex: number,
    positionIndexes: Array<number>,
    updatedPosition: Array<number>
  ): EditableFeatureCollection {
    const featureToUpdate = this.featureCollection.features[featureIndex];
    const isPolygonal =
      featureToUpdate.geometry.type === 'Polygon' ||
      featureToUpdate.geometry.type === 'MultiPolygon';

    const updatedCoordinates = immutablyReplacePosition(
      featureToUpdate.geometry.coordinates,
      positionIndexes,
      updatedPosition,
      isPolygonal
    );

    const updatedFeature = {
      ...featureToUpdate,
      geometry: {
        ...featureToUpdate.geometry,
        coordinates: updatedCoordinates
      }
    };

    // Immutably replace the feature being edited in the featureCollection
    const updatedFeatureCollection = {
      ...this.featureCollection,
      features: [
        ...this.featureCollection.features.slice(0, featureIndex),
        updatedFeature,
        ...this.featureCollection.features.slice(featureIndex + 1)
      ]
    };

    return new EditableFeatureCollection(updatedFeatureCollection);
  }

  /**
   * Removes a position deeply nested in a GeoJSON geometry coordinates array.
   * Works with MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
   *
   * @param featureIndex The index of the feature to update
   * @param positionIndexes An array containing the indexes of the postion to remove
   *
   * @returns A new `EditableFeatureCollection` with the given coordinate removed. Does not modify this `EditableFeatureCollection`.
   */
  removePosition(featureIndex: number, positionIndexes: Array<number>): EditableFeatureCollection {
    const featureToUpdate = this.featureCollection.features[featureIndex];
    if (featureToUpdate.geometry.type === 'Point') {
      throw Error(`Can't remove a position from a Point or there'd be nothing left`);
    }
    if (
      featureToUpdate.geometry.type === 'MultiPoint' &&
      featureToUpdate.geometry.coordinates.length < 2
    ) {
      throw Error(`Can't remove the last point of a MultiPoint or there'd be nothing left`);
    }
    const isPolygonal =
      featureToUpdate.geometry.type === 'Polygon' ||
      featureToUpdate.geometry.type === 'MultiPolygon';

    const updatedCoordinates = immutablyRemovePosition(
      featureToUpdate.geometry.coordinates,
      positionIndexes,
      isPolygonal
    );

    const updatedGeometry = {
      ...featureToUpdate.geometry,
      coordinates: updatedCoordinates
    };

    // Handle cases where geometry type is "downgraded"
    downgradeGeometryIfNecessary(updatedGeometry);

    const updatedFeature = {
      ...featureToUpdate,
      geometry: updatedGeometry
    };

    // Immutably replace the feature being edited in the featureCollection
    const updatedFeatureCollection = {
      ...this.featureCollection,
      features: [
        ...this.featureCollection.features.slice(0, featureIndex),
        updatedFeature,
        ...this.featureCollection.features.slice(featureIndex + 1)
      ]
    };

    return new EditableFeatureCollection(updatedFeatureCollection);
  }

  /**
   * Adds a position deeply nested in a GeoJSON geometry coordinates array.
   * Works with MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
   *
   * @param featureIndex The index of the feature to update
   * @param positionIndexes An array containing the indexes of the postion that will preceed the new position
   * @param positionToAdd The new position to place in the result (i.e. [lng, lat])
   *
   * @returns A new `EditableFeatureCollection` with the given coordinate removed. Does not modify this `EditableFeatureCollection`.
   */
  addPosition(
    featureIndex: number,
    positionIndexes: Array<number>,
    positionToAdd: Array<number>
  ): EditableFeatureCollection {
    const featureToUpdate = this.featureCollection.features[featureIndex];

    if (featureToUpdate.geometry.type === 'Point') {
      throw new Error('Unable to add a position to a Point feature');
    }

    const isPolygonal =
      featureToUpdate.geometry.type === 'Polygon' ||
      featureToUpdate.geometry.type === 'MultiPolygon';

    const updatedCoordinates = immutablyAddPosition(
      featureToUpdate.geometry.coordinates,
      positionIndexes,
      positionToAdd,
      isPolygonal
    );

    const updatedFeature = {
      ...featureToUpdate,
      geometry: {
        ...featureToUpdate.geometry,
        coordinates: updatedCoordinates
      }
    };

    // Immutably replace the feature being edited in the featureCollection
    const updatedFeatureCollection = {
      ...this.featureCollection,
      features: [
        ...this.featureCollection.features.slice(0, featureIndex),
        updatedFeature,
        ...this.featureCollection.features.slice(featureIndex + 1)
      ]
    };

    return new EditableFeatureCollection(updatedFeatureCollection);
  }

  replaceGeometry(featureIndex: number, geometry: GeoJsonGeometry) {
    const updatedFeature = {
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
    return new EditableFeatureCollection(updatedFeatureCollection);
  }

  addFeature(feature: Object) {
    const updatedFeatureCollection = {
      ...this.featureCollection,
      features: [...this.featureCollection.features, feature]
    };
    return new EditableFeatureCollection(updatedFeatureCollection);
  }

  /**
   * Returns a flat array of positions for the given feature along with their indexes into the feature's geometry's coordinates.
   *
   * @param featureIndex The index of the feature to get edit handles
   */
  getEditHandles(featureIndex: number) {
    let handles = [];

    const geometry = this.featureCollection.features[featureIndex].geometry;

    switch (geometry.type) {
      case 'Point':
        // positions are not nested
        handles = [
          {
            position: geometry.coordinates,
            positionIndexes: [],
            featureIndex,
            type: 'existing'
          }
        ];
        break;
      case 'MultiPoint':
      case 'LineString':
        // positions are nested 1 level
        const includeIntermediate = geometry.type !== 'MultiPoint';
        handles = handles.concat(
          getEditHandles(geometry.coordinates, [], includeIntermediate, featureIndex)
        );
        break;
      case 'Polygon':
      case 'MultiLineString':
        // positions are nested 2 levels
        for (let a = 0; a < geometry.coordinates.length; a++) {
          handles = handles.concat(
            getEditHandles(geometry.coordinates[a], [a], true, featureIndex)
          );
        }
        break;
      case 'MultiPolygon':
        // positions are nested 3 levels
        for (let a = 0; a < geometry.coordinates.length; a++) {
          for (let b = 0; b < geometry.coordinates[a].length; b++) {
            handles = handles.concat(
              getEditHandles(geometry.coordinates[a][b], [a, b], true, featureIndex)
            );
          }
        }
        break;
      default:
        throw Error(`Unhandled geometry type: ${geometry.type}`);
    }

    return handles;
  }
}

function immutablyReplacePosition(
  coordinates: Array<any>,
  positionIndexes: Array<number>,
  updatedPosition: Array<number>,
  isPolygonal: boolean
): Array<any> {
  if (!positionIndexes) {
    return coordinates;
  }
  if (positionIndexes.length === 0) {
    return updatedPosition;
  }
  if (positionIndexes.length === 1) {
    const updated = [
      ...coordinates.slice(0, positionIndexes[0]),
      updatedPosition,
      ...coordinates.slice(positionIndexes[0] + 1)
    ];

    if (
      isPolygonal &&
      (positionIndexes[0] === 0 || positionIndexes[0] === coordinates.length - 1)
    ) {
      // for polygons, the first point is repeated at the end of the array
      // so, update it on both ends of the array
      updated[0] = updatedPosition;
      updated[coordinates.length - 1] = updatedPosition;
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
  coordinates: Array<any>,
  positionIndexes: Array<number>,
  isPolygonal: boolean
): Array<any> {
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
  coordinates: Array<any>,
  positionIndexes: Array<number>,
  positionToAdd: Array<number>,
  isPolygonal: boolean
): Array<any> {
  if (!positionIndexes) {
    return coordinates;
  }
  if (positionIndexes.length === 0) {
    throw Error('Must specify the index of the position to remove');
  }
  if (positionIndexes.length === 1) {
    if (isPolygonal && (positionIndexes[0] < 1 || positionIndexes[0] > coordinates.length - 1)) {
      // TODO: test this case
      throw Error(
        `Invalid position index for polygon: ${
          positionIndexes[0]
        }. Points must be added to a Polygon between the first and last point.`
      );
    }
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

function downgradeGeometryIfNecessary(geometry: GeoJsonGeometry) {
  switch (geometry.type) {
    case 'LineString':
      downgradeLineStringIfNecessary(geometry);
      break;
    case 'Polygon':
      downgradePolygonIfNecessary(geometry);
      break;
    case 'MultiLineString':
      downgradeMultiLineStringIfNecessary(geometry);
      break;
    case 'MultiPolygon':
      downgradeMultiPolygonIfNecessary(geometry);
      break;
    default:
      // Not downgradable
      break;
  }
}

function downgradeLineStringIfNecessary(geometry: GeoJsonGeometry) {
  if (geometry.coordinates.length === 1) {
    // Only one position left, so convert to a Point
    geometry.type = 'Point';
    geometry.coordinates = geometry.coordinates[0];
  }
}

function downgradePolygonIfNecessary(geometry: GeoJsonGeometry) {
  const polygon = geometry.coordinates;
  const outerRing = polygon[0];
  // If the outer ring is no longer a polygon, convert the whole thing to a LineString
  if (outerRing.length <= 3) {
    geometry.type = 'LineString';
    geometry.coordinates = outerRing.slice(0, outerRing.length - 1);
    return;
  }

  // If any hole is no longer a polygon, remove the hole entirely
  for (let holeIndex = 1; holeIndex < polygon.length; holeIndex++) {
    if (removeHoleIfNecessary(polygon, holeIndex)) {
      // It was removed, so keep the index the same
      holeIndex--;
    }
  }
}

function downgradeMultiLineStringIfNecessary(geometry: GeoJsonGeometry) {
  if (geometry.coordinates.length === 1 && geometry.coordinates[0].length === 1) {
    // Only one position left, so convert to a Point
    geometry.type = 'Point';
    geometry.coordinates = geometry.coordinates[0][0];
    return;
  }
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

function downgradeMultiPolygonIfNecessary(geometry: GeoJsonGeometry) {
  if (geometry.coordinates.length === 1) {
    const outerRing = geometry.coordinates[0][0];
    if (outerRing.length <= 3) {
      geometry.type = 'LineString';
      geometry.coordinates = outerRing.slice(0, outerRing.length - 1);
      return;
    }
  }
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

function removeHoleIfNecessary(polygon: Array<any>, holeIndex: number) {
  const hole = polygon[holeIndex];
  if (hole.length <= 3) {
    polygon.splice(holeIndex, 1);
    return true;
  }
  return false;
}

function getIntermediatePosition(
  position1: Array<number>,
  position2: Array<number>
): Array<number> {
  const intermediatePosition = [];
  for (let dimension = 0; dimension < position1.length; dimension++) {
    intermediatePosition.push((position1[dimension] + position2[dimension]) / 2.0);
  }
  return intermediatePosition;
}

function getEditHandles(
  coordinates: Array<Array<number>>,
  positionIndexPrefix: Array<number>,
  includeIntermediate: boolean,
  featureIndex: number
) {
  const editHandles = [];
  for (let i = 0; i < coordinates.length; i++) {
    const position = coordinates[i];
    editHandles.push({
      position,
      positionIndexes: [...positionIndexPrefix, i],
      featureIndex,
      type: 'existing'
    });

    if (includeIntermediate && i < coordinates.length - 1) {
      // add intermediate position after every position except the last one
      const nextPosition = coordinates[i + 1];
      editHandles.push({
        position: getIntermediatePosition(position, nextPosition),
        positionIndexes: [...positionIndexPrefix, i + 1],
        featureIndex,
        type: 'intermediate'
      });
    }
  }
  return editHandles;
}
