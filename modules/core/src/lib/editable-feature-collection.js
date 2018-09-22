// @flow

import bboxPolygon from '@turf/bbox-polygon';
import circle from '@turf/circle';
import distance from '@turf/distance';
import ellipse from '@turf/ellipse';
import destination from '@turf/destination';
import bearing from '@turf/bearing';
// import turfTransformRotate from '@turf/transform-rotate';
import pointToLineDistance from '@turf/point-to-line-distance';
import { point } from '@turf/helpers';

import type {
  FeatureCollection,
  Feature,
  Geometry,
  Point,
  LineString,
  Polygon,
  MultiLineString,
  MultiPolygon,
  Position,
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
  _drawAtFront: boolean;
  _clickSequence: Position[] = [];

  constructor(featureCollection: FeatureCollection) {
    this.featureCollection = featureCollection;
  }

  getFeatureCollection() {
    return this.featureCollection;
  }

  getSelectedGeometry() {
    if (this._selectedFeatureIndexes.length === 1) {
      return this.featureCollection.features[this._selectedFeatureIndexes[0]].geometry;
    }
    return null;
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
  }

  setDrawAtFront(drawAtFront: boolean): void {
    if (this._drawAtFront === drawAtFront) {
      return;
    }

    this._drawAtFront = drawAtFront;
    this._setTentativeFeature(null);
  }

  _setTentativeFeature(tentativeFeature: ?Feature) {
    this._tentativeFeature = tentativeFeature;
    if (!tentativeFeature) {
      // Reset the click sequence
      this._clickSequence = [];
    }
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
    const updatedFeature: any = {
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
  getEditHandles(): EditHandle[] {
    let handles = [];

    if (this._mode === 'view') {
      return handles;
    }

    for (const index of this._selectedFeatureIndexes) {
      const geometry = this.featureCollection.features[index].geometry;
      handles = handles.concat(getEditHandlesForGeometry(geometry, index));
    }

    if (this._tentativeFeature) {
      if (this._mode === 'drawLineString' || this._mode === 'drawPolygon') {
        handles = handles.concat(getEditHandlesForGeometry(this._tentativeFeature.geometry, -1));
        // Slice off the handles that are are next to the pointer
        if (this._tentativeFeature && this._tentativeFeature.geometry.type === 'LineString') {
          // Remove the last existing and intermediate handles
          handles = handles.slice(0, -2);
        } else if (this._tentativeFeature && this._tentativeFeature.geometry.type === 'Polygon') {
          // Remove the last existing and 2 intermediate handles
          handles = handles.slice(0, -3);
        }
      }
    }

    return handles;
  }

  getTentativeFeature(): ?Feature {
    return this._tentativeFeature;
  }

  onClick(groundCoords: Position, clickedEditHandle: ?EditHandle): ?EditAction {
    this._clickSequence.push(groundCoords);

    let editAction: ?EditAction = null;
    if (
      clickedEditHandle &&
      clickedEditHandle.type === 'existing' &&
      clickedEditHandle.featureIndex >= 0
    ) {
      editAction = this._handleRemovePosition(clickedEditHandle);
    } else if (this._mode === 'drawPoint') {
      editAction = this._handleClickDrawPoint(groundCoords, clickedEditHandle);
    } else if (this._mode === 'drawLineString') {
      editAction = this._handleClickDrawLineString(groundCoords, clickedEditHandle);
    } else if (this._mode === 'drawPolygon') {
      editAction = this._handleClickDrawPolygon(groundCoords, clickedEditHandle);
    } else if (
      this._mode === 'drawRectangle' ||
      this._mode === 'drawCircleFromCenter' ||
      this._mode === 'drawCircleByBoundingBox' ||
      this._mode === 'drawEllipseByBoundingBox'
    ) {
      editAction = this._handle2ClickPolygon(groundCoords, clickedEditHandle);
    } else if (
      this._mode === 'drawRectangleUsing3Points' ||
      this._mode === 'drawEllipseUsing3Points'
    ) {
      editAction = this._handle3ClickPolygon(groundCoords, clickedEditHandle);
    }

    if (editAction) {
      // Reset the click sequence upon each edit
      this._clickSequence = [];
      this._setTentativeFeature(null);
    }

    // Trigger pointer move handling since that's where most of the tentative feature handling is
    this.onPointerMove(groundCoords);

    return editAction;
  }

  _handleRemovePosition(clickedEditHandle: EditHandle) {
    let updatedData;
    try {
      updatedData = this.removePosition(
        clickedEditHandle.featureIndex,
        clickedEditHandle.positionIndexes
      ).getFeatureCollection();
    } catch (ignored) {
      // This happens if user attempts to remove the last point
    }

    if (updatedData) {
      return {
        updatedData,
        editType: 'removePosition',
        featureIndex: clickedEditHandle.featureIndex,
        positionIndexes: clickedEditHandle.positionIndexes,
        position: null
      };
    }
    return null;
  }

  _handleClickDrawPoint(groundCoords: Position, clickedEditHandle: ?EditHandle): ?EditAction {
    const geometry: Point = {
      type: 'Point',
      coordinates: groundCoords
    };

    return this._getAddFeatureEditAction(geometry);
  }

  _handleClickDrawLineString(groundCoords: Position, clickedEditHandle: ?EditHandle): ?EditAction {
    let editAction: ?EditAction;
    const selectedFeatureIndexes = this._selectedFeatureIndexes;
    const selectedGeometry = this.getSelectedGeometry();
    const tentativeFeature = this._tentativeFeature;

    if (selectedFeatureIndexes.length > 1) {
      console.warn(`Unsupported operation for multiple selection`); // eslint-disable-line
      return null;
    }
    if (selectedGeometry && selectedGeometry.type !== 'LineString') {
      console.warn(`Unsupported geometry type: ${selectedGeometry.type}`); // eslint-disable-line
      return null;
    }

    if (selectedGeometry && selectedGeometry.type === 'LineString') {
      // Extend the LineString
      const lineString: LineString = selectedGeometry;

      let positionIndexes = [lineString.coordinates.length];
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
    } else if (this._clickSequence.length === 2 && tentativeFeature) {
      editAction = this._getAddFeatureEditAction(tentativeFeature.geometry);
    }

    return editAction;
  }

  _handleClickDrawPolygon(groundCoords: Position, clickedEditHandle: ?EditHandle): ?EditAction {
    let editAction: ?EditAction;
    const tentativeFeature = this._tentativeFeature;

    if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
      const polygon: Polygon = tentativeFeature.geometry;

      if (
        clickedEditHandle &&
        clickedEditHandle.featureIndex === -1 &&
        (clickedEditHandle.positionIndexes[1] === 0 ||
          clickedEditHandle.positionIndexes[1] === polygon.coordinates[0].length - 3)
      ) {
        // They clicked the first or last point (or double-clicked), so complete the polygon
        // Remove the hovered position
        const polygonToAdd: Polygon = {
          type: 'Polygon',
          coordinates: [[...polygon.coordinates[0].slice(0, -2), polygon.coordinates[0][0]]]
        };
        editAction = this._getAddFeatureEditAction(polygonToAdd);
      }
    }

    return editAction;
  }

  _handle2ClickPolygon(groundCoords: Position, clickedEditHandle: ?EditHandle): ?EditAction {
    const tentativeFeature = this._tentativeFeature;

    if (
      this._clickSequence.length > 1 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      return this._getAddFeatureEditAction(tentativeFeature.geometry);
    }

    return null;
  }

  _handle3ClickPolygon(groundCoords: Position, clickedEditHandle: ?EditHandle): ?EditAction {
    const tentativeFeature = this._tentativeFeature;

    if (
      this._clickSequence.length > 2 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      return this._getAddFeatureEditAction(tentativeFeature.geometry);
    }

    return null;
  }

  _getAddFeatureEditAction(geometry: Geometry): EditAction {
    const updatedData = this.addFeature({
      type: 'Feature',
      properties: {},
      geometry
    }).getFeatureCollection();

    return {
      updatedData,
      editType: 'addFeature',
      featureIndex: updatedData.features.length - 1,
      positionIndexes: null,
      position: null
    };
  }

  onPointerMove(groundCoords: Position): void {
    if (this._mode === 'drawLineString') {
      this._handlePointerMoveForDrawLineString(groundCoords);
    } else if (this._mode === 'drawPolygon') {
      this._handlePointerMoveForDrawPolygon(groundCoords);
    } else if (this._mode === 'drawRectangle') {
      this._handlePointerMoveForDrawRectangle(groundCoords);
    } else if (this._mode === 'drawCircleFromCenter') {
      this._handlePointerMoveForDrawCircleFromCenter(groundCoords);
    } else if (this._mode === 'drawCircleByBoundingBox') {
      this._handlePointerMoveForDrawCircleByBoundingBox(groundCoords);
    } else if (this._mode === 'drawEllipseByBoundingBox') {
      this._handlePointerMoveForDrawEllipseByBoundingBox(groundCoords);
    } else if (this._mode === 'drawRectangleUsing3Points') {
      this._handlePointerMoveForDrawRectangleUsing3Points(groundCoords);
    } else if (this._mode === 'drawEllipseUsing3Points') {
      this._handlePointerMoveForDrawEllipseUsing3Points(groundCoords);
    }
  }

  _handlePointerMoveForDrawLineString(groundCoords: Position): void {
    let startPosition: ?Position = null;
    const selectedGeometry = this.getSelectedGeometry();

    if (!selectedGeometry || selectedGeometry.type !== 'LineString') {
      // unsupported
      return;
    }

    if (selectedGeometry && selectedGeometry.type === 'LineString') {
      // Draw an extension line starting from one end of the selected LineString
      startPosition = selectedGeometry.coordinates[selectedGeometry.coordinates.length - 1];
      if (this._drawAtFront) {
        startPosition = selectedGeometry.coordinates[0];
      }
    } else if (this._clickSequence.length === 1) {
      startPosition = this._clickSequence[0];
    }

    if (startPosition) {
      this._setTentativeFeature({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [startPosition, groundCoords]
        }
      });
    }
  }

  _handlePointerMoveForDrawPolygon(groundCoords: Position) {
    if (this._clickSequence.length === 0) {
      // nothing to do yet
      return;
    }

    if (this._clickSequence.length < 3) {
      // Draw a LineString connecting all the clicked points with the hovered point
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [...this._clickSequence, groundCoords]
        }
      });
    } else {
      // Draw a Polygon connecting all the clicked points with the hovered point
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...this._clickSequence, groundCoords, this._clickSequence[0]]]
        }
      });
    }
  }

  _handlePointerMoveForDrawRectangle(groundCoords: Position) {
    if (this._clickSequence.length === 0) {
      // nothing to do yet
      return;
    }

    const corner1 = this._clickSequence[0];
    const corner2 = groundCoords;
    this._setTentativeFeature(bboxPolygon([corner1[0], corner1[1], corner2[0], corner2[1]]));
  }

  _handlePointerMoveForDrawCircleFromCenter(groundCoords: Position) {
    if (this._clickSequence.length === 0) {
      // nothing to do yet
      return;
    }

    const centerCoordinates = this._clickSequence[0];
    const radius = Math.max(distance(centerCoordinates, groundCoords), 0.001);
    this._setTentativeFeature(circle(centerCoordinates, radius));
  }

  _handlePointerMoveForDrawCircleByBoundingBox(groundCoords: Position) {
    if (this._clickSequence.length === 0) {
      // nothing to do yet
      return;
    }

    const firstClickedPoint = this._clickSequence[0];
    const centerCoordinates = getIntermediatePosition(firstClickedPoint, groundCoords);
    const radius = Math.max(distance(firstClickedPoint, centerCoordinates), 0.001);
    this._setTentativeFeature(circle(centerCoordinates, radius));
  }

  _handlePointerMoveForDrawEllipseByBoundingBox(groundCoords: Position) {
    if (this._clickSequence.length === 0) {
      // nothing to do yet
      return;
    }

    const corner1 = this._clickSequence[0];
    const corner2 = groundCoords;

    const minX = Math.min(corner1[0], corner2[0]);
    const minY = Math.min(corner1[1], corner2[1]);
    const maxX = Math.max(corner1[0], corner2[0]);
    const maxY = Math.max(corner1[1], corner2[1]);

    const polygonPoints = bboxPolygon([minX, minY, maxX, maxY]).geometry.coordinates[0];
    const centerCoordinates = getIntermediatePosition(corner1, corner2);

    const xSemiAxis = Math.max(distance(point(polygonPoints[0]), point(polygonPoints[1])), 0.001);
    const ySemiAxis = Math.max(distance(point(polygonPoints[0]), point(polygonPoints[3])), 0.001);

    this._setTentativeFeature(ellipse(centerCoordinates, xSemiAxis, ySemiAxis));
  }

  _handlePointerMoveForDrawRectangleUsing3Points(groundCoords: Position) {
    if (this._clickSequence.length === 0) {
      // nothing to do yet
      return;
    }

    if (this._clickSequence.length === 1) {
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [this._clickSequence[0], groundCoords]
        }
      });
    } else if (this._clickSequence.length === 2) {
      const lineString: LineString = {
        type: 'LineString',
        coordinates: this._clickSequence
      };

      const [p1, p2] = this._clickSequence;
      const pt = point(groundCoords);
      const options = { units: 'miles' };
      const ddistance = pointToLineDistance(pt, lineString, options);
      const lineBearing = bearing(p1, p2);

      // Check if current point is to the left or right of line
      // Line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
      // then (x−x1)(y2−y1)−(y−y1)(x2−x1)
      const isPointToLeftOfLine =
        (groundCoords[0] - p1[0]) * (p2[1] - p1[1]) - (groundCoords[1] - p1[1]) * (p2[0] - p1[0]);

      // Bearing to draw perpendicular to the line string
      const orthogonalBearing = isPointToLeftOfLine < 0 ? lineBearing - 90 : lineBearing - 270;

      // Get coordinates for the point p3 and p4 which are perpendicular to the lineString
      // Add the distance as the current position moves away from the lineString
      const p3 = destination(p2, ddistance, orthogonalBearing, options);
      const p4 = destination(p1, ddistance, orthogonalBearing, options);

      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              // Draw a polygon containing all the points of the LineString,
              // then the points orthogonal to the lineString,
              // then back to the starting position
              ...lineString.coordinates,
              p3.geometry.coordinates,
              p4.geometry.coordinates,
              p1
            ]
          ]
        }
      });
    }
  }

  _handlePointerMoveForDrawEllipseUsing3Points(groundCoords: Position) {
    if (this._clickSequence.length === 0) {
      // nothing to do yet
      return;
    }

    if (this._clickSequence.length === 1) {
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [this._clickSequence[0], groundCoords]
        }
      });
    } else if (this._clickSequence.length === 2) {
      const [p1, p2] = this._clickSequence;

      const centerCoordinates = getIntermediatePosition(p1, p2);
      const xSemiAxis = Math.max(distance(centerCoordinates, point(groundCoords)), 0.001);
      const ySemiAxis = Math.max(distance(p1, p2), 0.001) / 2;
      const options = { angle: bearing(p1, p2) };

      this._setTentativeFeature(ellipse(centerCoordinates, xSemiAxis, ySemiAxis, options));
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

function getEditHandlesForGeometry(geometry: Geometry, featureIndex: number) {
  let handles = [];

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
        getEditHandlesForCoordinates(geometry.coordinates, [], includeIntermediate, featureIndex)
      );
      break;
    case 'Polygon':
    case 'MultiLineString':
      // positions are nested 2 levels
      for (let a = 0; a < geometry.coordinates.length; a++) {
        handles = handles.concat(
          getEditHandlesForCoordinates(geometry.coordinates[a], [a], true, featureIndex)
        );
        if (geometry.type === 'Polygon') {
          // Don't repeat the first/last handle for Polygons
          handles = handles.slice(0, -1);
        }
      }
      break;
    case 'MultiPolygon':
      // positions are nested 3 levels
      for (let a = 0; a < geometry.coordinates.length; a++) {
        for (let b = 0; b < geometry.coordinates[a].length; b++) {
          handles = handles.concat(
            getEditHandlesForCoordinates(geometry.coordinates[a][b], [a, b], true, featureIndex)
          );
          // Don't repeat the first/last handle for Polygons
          handles = handles.slice(0, -1);
        }
      }
      break;
    default:
      throw Error(`Unhandled geometry type: ${geometry.type}`);
  }

  return handles;
}

function getEditHandlesForCoordinates(
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
