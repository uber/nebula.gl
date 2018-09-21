// @flow

import type {
  FeatureCollection,
  Feature,
  Geometry,
  Position,
  Polygon,
  MultiLineString,
  MultiPolygon,
  PolygonCoordinates
} from '../geojson-types.js';

export type EditHandle = {
  position: Position,
  positionIndexes: number[],
  featureIndex: number,
  type: 'existing' | 'intermediate'
};

export type EditAction = {
  updatedData: FeatureCollection,
  editType: string,
  featureIndex: number,
  positionIndexes: ?(number[]),
  position: ?Position
};

export class EditableFeatureCollection {
  featureCollection: FeatureCollection;
  _tentativeFeature: ?Feature;
  _mode: string;
  _selectedFeatureIndexes: number[];
  _selectedFeature: ?Feature;
  _drawAtFront: boolean;

  constructor(featureCollection: FeatureCollection) {
    this.featureCollection = featureCollection;
  }

  getFeatureCollection() {
    return this.featureCollection;
  }

  setFeatureCollection(featureCollection: $Shape<FeatureCollection>) {
    this.featureCollection = {
      ...this.featureCollection,
      ...featureCollection
    };
  }

  setMode(mode: string): void {
    if (this._mode === mode) {
      return;
    }

    this._mode = mode;
    this._setTentativeFeature(null);
  }

  setSelectedFeatureIndexes(indexes: number[]): void {
    if (this._selectedFeatureIndexes === indexes) {
      return;
    }

    this._selectedFeatureIndexes = indexes;
    this._setTentativeFeature(null);

    this._selectedFeature = null;
    if (indexes.length === 1) {
      this._selectedFeature = this.featureCollection.features[indexes[0]];
    }
  }

  setDrawAtFront(drawAtFront: boolean): void {
    if (this._drawAtFront === drawAtFront) {
      return;
    }

    this._drawAtFront = drawAtFront;
    this._setTentativeFeature(null);
  }

  _setTentativeFeature(tentativeFeature: ?Feature) {
    // console.log('Setting tentative feature', JSON.stringify(tentativeFeature));
    this._tentativeFeature = tentativeFeature;
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
    positionIndexes: number[],
    updatedPosition: Position
  ): EditableFeatureCollection {
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
   * @returns A new `EditableFeatureCollection` with the given coordinate removed. Does not modify this `EditableFeatureCollection`.
   */
  removePosition(featureIndex: number, positionIndexes: number[]): EditableFeatureCollection {
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
   * @returns A new `EditableFeatureCollection` with the given coordinate removed. Does not modify this `EditableFeatureCollection`.
   */
  addPosition(
    featureIndex: number,
    positionIndexes: number[],
    positionToAdd: Position
  ): EditableFeatureCollection {
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

  replaceGeometry(featureIndex: number, geometry: Geometry): EditableFeatureCollection {
    const updatedFeature = {
      ...this.featureCollection.features[featureIndex],
      geometry
    };

    this.setFeatureCollection({
      features: [
        ...this.featureCollection.features.slice(0, featureIndex),
        updatedFeature,
        ...this.featureCollection.features.slice(featureIndex + 1)
      ]
    });
    return this;
  }

  addFeature(feature: Object): EditableFeatureCollection {
    this.setFeatureCollection({
      features: [...this.featureCollection.features, feature]
    });

    return this;
  }

  /**
   * Returns a flat array of positions for the given feature along with their indexes into the feature's geometry's coordinates.
   *
   * @param featureIndex The index of the feature to get edit handles
   */
  getEditHandles(featureIndex: number): EditHandle[] {
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

  getTentativeFeature(): ?Feature {
    return this._tentativeFeature;
  }

  onClick(groundCoords: Position): ?EditAction {
    if (this._mode === 'drawLineString') {
      return this._handleClickDrawLineString(groundCoords);
    }
    return null;
  }

  _handleClickDrawLineString(groundCoords: Position): ?EditAction {
    let editAction: ?EditAction;
    const selectedFeatureIndexes = this._selectedFeatureIndexes;
    const selectedFeature = this._selectedFeature;
    const tentativeFeature = this._tentativeFeature;

    if (!tentativeFeature) {
      // Start a new feature
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [groundCoords, groundCoords]
        }
      });
    } else if (this._mode === 'drawLineString') {
      if (!selectedFeature) {
        const updatedData = this.addFeature({
          type: 'Feature',
          properties: {},
          geometry: tentativeFeature.geometry
        }).getFeatureCollection();

        editAction = {
          updatedData,
          editType: 'addFeature',
          featureIndex: updatedData.features.length - 1,
          positionIndexes: [1],
          position: groundCoords
        };
      } else if (selectedFeature.geometry.type === 'LineString') {
        let positionIndexes = [selectedFeature.geometry.coordinates.length];
        if (this._drawAtFront) {
          positionIndexes = [0];
        }
        const featureIndex = selectedFeatureIndexes[0];
        const updatedData = this.addPosition(
          featureIndex,
          positionIndexes,
          groundCoords
        ).getFeatureCollection();

        editAction = {
          updatedData,
          editType: 'addPosition',
          featureIndex,
          positionIndexes,
          position: groundCoords
        };
      } else {
        console.warn(`Unsupported geometry type: ${selectedFeature.geometry.type}`); // eslint-disable-line
      }
    }

    return editAction;
  }

  onPointerMove(groundCoords: ?Position): void {
    if (this._mode === 'drawLineString') {
      this._handlePointerMoveForDrawLineString(groundCoords);
    } else {
      this._setTentativeFeature(null);
    }
  }

  _handlePointerMoveForDrawLineString(groundCoords: ?Position) {
    let startPosition: ?Position = null;
    const selectedFeature = this._selectedFeature;
    const tentativeFeature = this._tentativeFeature;

    if (selectedFeature && selectedFeature.geometry.type === 'LineString') {
      // Draw an extension line starting from one end of the selected LineString
      startPosition =
        selectedFeature.geometry.coordinates[selectedFeature.geometry.coordinates.length - 1];
      if (this._drawAtFront) {
        startPosition = selectedFeature.geometry.coordinates[0];
      }
    } else if (tentativeFeature) {
      // Draw an extension line starting from the first clicked point
      if (tentativeFeature.geometry.type === 'LineString') {
        startPosition = tentativeFeature.geometry.coordinates[0];
      } else {
        // eslint-disable-next-line
        console.warn(`Unexpected tentative feature type ${tentativeFeature.geometry.type}`);
      }
    }

    if (startPosition) {
      const endPosition = groundCoords || startPosition;

      this._setTentativeFeature({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [startPosition, endPosition]
        }
      });
    }
  }
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

function getIntermediatePosition(position1: Position, position2: Position): Position {
  const intermediatePosition = [
    (position1[0] + position2[0]) / 2.0,
    (position1[1] + position2[1]) / 2.0
  ];
  return intermediatePosition;
}

function getEditHandles(
  coordinates: any[],
  positionIndexPrefix: number[],
  includeIntermediate: boolean,
  featureIndex: number
): EditHandle[] {
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

// function assert(condition, message) {
//   if (!condition) {
//     console.error(`Assertion error: ${message}`); // eslint-disable-line
//     throw Error(message);
//   }
// }
