// @flow
import nearestPointOnLine from '@turf/nearest-point-on-line';
import nearestPoint from '@turf/nearest-point';
import {
  lineString as toLineString,
  point as toPoint,
  featureCollection as toFeatureCollection
} from '@turf/helpers';
import type { GeoJsonGeometry } from '../types';

const MAX_INTERMEDIATE_PIXEL_DISTANCE = 50;

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
   * @param featureIndexes The indexes of the features to get edit handles
   * @param project Projection method to convert geographic coordinates to screen coordinates
   * @param pointerPosition Object containg screen and ground coordinates for the location of the pointer
   */
  getEditHandles(featureIndexes: Array<number>, project?: Function, pointerPosition?: Object) {
    const { screenCoords, groundCoords } = pointerPosition || {};
    let handles = [];
    const lineStringTupleArray = [];

    featureIndexes.forEach(featureIndex => {
      const geometry = this.featureCollection.features[featureIndex].geometry;

      switch (geometry.type) {
        case 'Point':
          // positions are not nested
          handles = [
            ...handles,
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
          lineStringTupleArray.push({
            featureIndex,
            coordinates: geometry.coordinates,
            positionIndexPrefix: []
          });
          break;
        case 'Polygon':
        case 'MultiLineString':
          // positions are nested 2 levels
          for (let a = 0; a < geometry.coordinates.length; a++) {
            lineStringTupleArray.push({
              featureIndex,
              coordinates: geometry.coordinates[a],
              positionIndexPrefix: [a]
            });
          }
          break;
        case 'MultiPolygon':
          // positions are nested 3 levels
          for (let a = 0; a < geometry.coordinates.length; a++) {
            for (let b = 0; b < geometry.coordinates[a].length; b++) {
              lineStringTupleArray.push({
                featureIndex,
                coordinates: geometry.coordinates[a][b],
                positionIndexPrefix: [a, b]
              });
            }
          }
          break;
        default:
          throw Error(`Unhandled geometry type: ${geometry.type}`);
      }
    });

    let intermediatePoint = null;
    // the index of tuple array of the line / feature closest to the reference point
    let tupleIndex = null;

    const referencePoint = groundCoords && toPoint(groundCoords);

    lineStringTupleArray.forEach(({ featureIndex, coordinates, positionIndexPrefix }, i) => {
      if (referencePoint) {
        // calculate the intermediate point location by determining the closest linestring segment
        const lineStringFeature = toLineString(coordinates);
        const candidateIntermediatePoint = nearestPointOnLine(lineStringFeature, referencePoint);
        const nearestControlPoint = nearestPoint(
          referencePoint,
          toFeatureCollection(coordinates.map(c => toPoint(c)))
        );

        if (
          // find the best candidate point
          (!intermediatePoint ||
            candidateIntermediatePoint.properties.dist < intermediatePoint.properties.dist) &&
          // prohibit intermediate point from displaying when it is too close to an edit handle
          project &&
          getPixelDistanceBetweenPoints(
            project(candidateIntermediatePoint.geometry.coordinates),
            project(nearestControlPoint.geometry.coordinates)
          ) > 10
        ) {
          intermediatePoint = candidateIntermediatePoint;
          tupleIndex = i;
        }
      }

      // convert the linestring / coordinates to edit handles
      handles = [...handles, ...getEditHandles(coordinates, positionIndexPrefix, featureIndex)];
    });

    // add the lone intermediate point
    if (
      intermediatePoint &&
      tupleIndex !== null &&
      project &&
      // display the intermediate point when it is "close" to the line
      getPixelDistanceBetweenPoints(project(intermediatePoint.geometry.coordinates), screenCoords) <
        MAX_INTERMEDIATE_PIXEL_DISTANCE
    ) {
      const { geometry: { coordinates: position }, properties: { index } } = intermediatePoint;
      const { positionIndexPrefix, featureIndex } = lineStringTupleArray[tupleIndex];
      handles = [
        ...handles,
        {
          position,
          positionIndexes: [...positionIndexPrefix, index + 1],
          featureIndex,
          type: 'intermediate'
        }
      ];
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

function getEditHandles(
  coordinates: Array<Array<number>>,
  positionIndexPrefix: Array<number>,
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
  }
  return editHandles;
}

function getPixelDistanceBetweenPoints(a: Array<number>, b: Array<number>) {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}
