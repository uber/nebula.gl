// @flow

import nearestPointOnLine from '@turf/nearest-point-on-line';
import turfBbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import circle from '@turf/circle';
import distance from '@turf/distance';
import ellipse from '@turf/ellipse';
import destination from '@turf/destination';
import bearing from '@turf/bearing';
// import turfTransformRotate from '@turf/transform-rotate';
import pointToLineDistance from '@turf/point-to-line-distance';
import { point, lineString as toLineString } from '@turf/helpers';

import type {
  FeatureCollection,
  Feature,
  Geometry,
  Point,
  LineString,
  Polygon,
  Position
} from '../geojson-types.js';

import { recursivelyTraverseNestedArrays } from './utils';
import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

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
  featureCollection: ImmutableFeatureCollection;
  _tentativeFeature: ?Feature;
  _mode: string = 'modify';
  _selectedFeatureIndexes: number[] = [];
  _drawAtFront: boolean = false;
  _clickSequence: Position[] = [];

  constructor(featureCollection: FeatureCollection) {
    this.setFeatureCollection(featureCollection);
  }

  getFeatureCollection(): FeatureCollection {
    return this.featureCollection.getObject();
  }

  getSelectedGeometry(): ?Geometry {
    if (this._selectedFeatureIndexes.length === 1) {
      return this.featureCollection.getObject().features[this._selectedFeatureIndexes[0]].geometry;
    }
    return null;
  }

  setFeatureCollection(featureCollection: FeatureCollection): void {
    this.featureCollection = new ImmutableFeatureCollection(featureCollection);
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

  _setTentativeFeature(tentativeFeature: ?Feature): void {
    this._tentativeFeature = tentativeFeature;
    if (!tentativeFeature) {
      // Reset the click sequence
      this._clickSequence = [];
    }
  }

  /**
   * Returns a flat array of positions for the given feature along with their indexes into the feature's geometry's coordinates.
   *
   * @param featureIndex The index of the feature to get edit handles
   */
  getEditHandles(picks?: Array<Object>, groundCoords?: Position): EditHandle[] {
    let handles = [];

    if (this._mode === 'view') {
      return handles;
    }

    if (this._mode === 'cursor') {
      for (const index of this._selectedFeatureIndexes) {
        const feature = this.featureCollection.getObject().features[index];
        const bbox = bboxPolygon(turfBbox(feature));
        handles = handles.concat(getEditHandlesForGeometry(bbox.geometry, index));
      }
      return handles;
    }

    for (const index of this._selectedFeatureIndexes) {
      const geometry = this.featureCollection.getObject().features[index].geometry;
      handles = handles.concat(getEditHandlesForGeometry(geometry, index));
    }

    if (this._tentativeFeature) {
      if (this._mode === 'drawLineString' || this._mode === 'drawPolygon') {
        handles = handles.concat(getEditHandlesForGeometry(this._tentativeFeature.geometry, -1));
        // Slice off the handles that are are next to the pointer
        if (this._tentativeFeature && this._tentativeFeature.geometry.type === 'LineString') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        } else if (this._tentativeFeature && this._tentativeFeature.geometry.type === 'Polygon') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        }
      }
    }

    // intermediate edit handle
    if (picks && picks.length && groundCoords) {
      const existingEditHandle = picks.find(
        pick => pick.isEditingHandle && pick.object && pick.object.type === 'existing'
      );
      // don't show intermediate point when too close to an existing edit handle
      const featureAsPick = !existingEditHandle && picks.find(pick => !pick.isEditingHandle);

      // is the feature in the pick selected
      if (
        featureAsPick &&
        !featureAsPick.object.geometry.type.includes('Point') &&
        this._selectedFeatureIndexes.includes(featureAsPick.index)
      ) {
        let intermediatePoint = null;
        let positionIndexPrefix = [];
        const referencePoint = point(groundCoords);
        // process all lines of the (single) feature
        recursivelyTraverseNestedArrays(
          featureAsPick.object.geometry.coordinates,
          [],
          (lineString, prefix) => {
            const lineStringFeature = toLineString(lineString);
            const candidateIntermediatePoint = nearestPointOnLine(
              lineStringFeature,
              referencePoint
            );
            if (
              !intermediatePoint ||
              candidateIntermediatePoint.properties.dist < intermediatePoint.properties.dist
            ) {
              intermediatePoint = candidateIntermediatePoint;
              positionIndexPrefix = prefix;
            }
          }
        );
        // tack on the lone intermediate point to the set of handles
        if (intermediatePoint) {
          const {
            geometry: { coordinates: position },
            properties: { index }
          } = intermediatePoint;
          handles = [
            ...handles,
            {
              position,
              positionIndexes: [...positionIndexPrefix, index + 1],
              featureIndex: featureAsPick.index,
              type: 'intermediate'
            }
          ];
        }
      }
    }

    return handles;
  }

  getEditBoundingBoxes(): Feature[] {
    let bboxes = [];

    if (this._mode !== 'cursor') {
      return bboxes;
    }

    for (const index of this._selectedFeatureIndexes) {
      const feature = this.featureCollection.getObject().features[index];
      bboxes = bboxes.concat(bboxPolygon(turfBbox(feature)));
    }

    return bboxes;
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
      updatedData = this.featureCollection
        .removePosition(clickedEditHandle.featureIndex, clickedEditHandle.positionIndexes)
        .getObject();
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
    let editAction: ?EditAction = null;
    const selectedFeatureIndexes = this._selectedFeatureIndexes;
    const selectedGeometry = this.getSelectedGeometry();
    const tentativeFeature = this._tentativeFeature;

    if (
      selectedFeatureIndexes.length > 1 ||
      (selectedGeometry && selectedGeometry.type !== 'LineString')
    ) {
      console.warn(`drawLineString mode only supported for single LineString selection`); // eslint-disable-line
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
      const updatedData = this.featureCollection
        .addPosition(featureIndex, positionIndexes, groundCoords)
        .getObject();

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
    let editAction: ?EditAction = null;
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
    const updatedData = this.featureCollection
      .addFeature({
        type: 'Feature',
        properties: {},
        geometry
      })
      .getObject();

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
    const selectedFeatureIndexes = this._selectedFeatureIndexes;
    const selectedGeometry = this.getSelectedGeometry();

    if (
      selectedFeatureIndexes.length > 1 ||
      (selectedGeometry && selectedGeometry.type !== 'LineString')
    ) {
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
      handles = handles.concat(
        getEditHandlesForCoordinates(geometry.coordinates, [], featureIndex)
      );
      break;
    case 'Polygon':
    case 'MultiLineString':
      // positions are nested 2 levels
      for (let a = 0; a < geometry.coordinates.length; a++) {
        handles = handles.concat(
          getEditHandlesForCoordinates(geometry.coordinates[a], [a], featureIndex)
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
            getEditHandlesForCoordinates(geometry.coordinates[a][b], [a, b], featureIndex)
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
  }
  return editHandles;
}

// function assert(condition, message) {
//   if (!condition) {
//     console.error(`Assertion error: ${message}`); // eslint-disable-line
//     throw Error(message);
//   }
// }
