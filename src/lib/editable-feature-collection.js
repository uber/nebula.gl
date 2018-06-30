// @flow

export class EditableFeatureCollection {
  constructor(featureCollection) {
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
   * @returns A new `EditableFeatureCollection` with the given position replaced. Does not modify this `EditableFeatureCollection`.
   */
  replacePosition(
    featureIndex: number,
    positionIndexes: Array<number>,
    updatedPosition: [number, number] | [number, number, number]
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
    const isPolygonal =
      featureToUpdate.geometry.type === 'Polygon' ||
      featureToUpdate.geometry.type === 'MultiPolygon';

    const updatedCoordinates = immutablyRemovePosition(
      featureToUpdate.geometry.coordinates,
      positionIndexes,
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
    positionToAdd: [number, number] | [number, number, number]
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

  /**
   * Returns a flat array of positions for the given feature along with their indexes into the feature's geometry's coordinates.
   *
   * @param featureIndex The index of the feature to get edit handles
   */
  getEditHandles(featureIndex: number) {
    let positions = [];

    const geometry = this.featureCollection.features[featureIndex].geometry;

    switch (geometry.type) {
      case 'Point':
        // positions are not nested
        positions = [
          {
            position: geometry.coordinates,
            positionIndexes: [],
            type: 'existing'
          }
        ];
        break;
      case 'MultiPoint':
      case 'LineString':
        // positions are nested 1 level
        const includeIntermediate = geometry.type !== 'MultiPoint';
        positions = positions.concat(getEditHandles(geometry.coordinates, [], includeIntermediate));
        break;
      case 'Polygon':
      case 'MultiLineString':
        // positions are nested 2 levels
        for (let a = 0; a < geometry.coordinates.length; a++) {
          positions = positions.concat(getEditHandles(geometry.coordinates[a], [a], true));
        }
        break;
      case 'MultiPolygon':
        // positions are nested 3 levels
        for (let a = 0; a < geometry.coordinates.length; a++) {
          for (let b = 0; b < geometry.coordinates[a].length; b++) {
            positions = positions.concat(getEditHandles(geometry.coordinates[a][b], [a, b], true));
          }
        }
        break;
      default:
        throw Error(`Unhandled geometry type: ${geometry.type}`);
    }

    return positions;
  }
}

function immutablyReplacePosition(
  coordinates: Array<mixed>,
  positionIndexes: Array<number>,
  updatedPosition: Array<number>,
  isPolygonal: boolean
): Array<mixed> {
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
  coordinates: Array<mixed>,
  positionIndexes: Array<number>,
  isPolygonal: boolean
): Array<mixed> {
  if (!positionIndexes) {
    return coordinates;
  }
  if (positionIndexes.length === 0) {
    throw Error('Must specify the index of the position to remove');
  }
  if (positionIndexes.length === 1) {
    if (isPolygonal && coordinates.length < 5) {
      // TODO: test this case
      throw Error('Cannot remove a position from a triangle as it will no longer be a polygon');
    }
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
  coordinates: Array<mixed>,
  positionIndexes: Array<number>,
  positionToAdd: Array<number>,
  isPolygonal: boolean
): Array<mixed> {
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
  includeIntermediate: boolean
) {
  const editHandles = [];
  for (let i = 0; i < coordinates.length; i++) {
    const position = coordinates[i];
    editHandles.push({
      position,
      positionIndexes: [...positionIndexPrefix, i],
      type: 'existing'
    });

    if (includeIntermediate && i < coordinates.length - 1) {
      // add intermediate position after every position except the last one
      const nextPosition = coordinates[i + 1];
      editHandles.push({
        position: getIntermediatePosition(position, nextPosition),
        positionIndexes: [...positionIndexPrefix, i + 1],
        type: 'intermediate'
      });
    }
  }
  return editHandles;
}
