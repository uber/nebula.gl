// @flow

import turfBearing from '@turf/bearing';
import turfCenter from '@turf/center';
import turfDistance from '@turf/distance';
import { point as turfPoint, polygon as turfPolygon, bearingToAzimuth } from '@turf/helpers';
import { coordAll } from '@turf/meta';
import turfMidpoint from '@turf/midpoint';
import turfTransformTranslate from '@turf/transform-translate';
import turfUnion from '@turf/union';
import turfDifference from '@turf/difference';
import turfIntersect from '@turf/intersect';

import type { FeatureCollection, Feature, Polygon, Geometry, Position } from '../geojson-types.js';
import type {
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DeckGLPick
} from '../event-types.js';
import { SortedList, SortType } from '../utils';
import { ImmutableFeatureCollection } from '../immutable-feature-collection.js';

export type EditHandle = {
  position: Position,
  positionIndexes: number[],
  featureIndex: number,
  type: 'existing' | 'intermediate'
};

export type EditAction = {
  updatedData: FeatureCollection,
  editType: string,
  featureIndexes: number[],
  editContext: any
};

export class ModeHandler {
  // TODO: add underscore
  featureCollection: ImmutableFeatureCollection;
  _tentativeFeature: ?Feature;
  _modeConfig: any = null;
  _selectedFeatureIndexes: number[] = [];
  _clickSequence: Position[] = [];
  _context: Object;
  _snapAssociations: number[][];

  constructor(featureCollection?: FeatureCollection) {
    if (featureCollection) {
      this.setFeatureCollection(featureCollection);
    }
    this._snapAssociations = [];
  }

  getFeatureCollection(): FeatureCollection {
    return this.featureCollection.getObject();
  }

  getImmutableFeatureCollection(): ImmutableFeatureCollection {
    return this.featureCollection;
  }

  getSelectedFeature(): ?Feature {
    if (this._selectedFeatureIndexes.length === 1) {
      return this.featureCollection.getObject().features[this._selectedFeatureIndexes[0]];
    }
    return null;
  }

  getSelectedGeometry(): ?Geometry {
    const feature = this.getSelectedFeature();
    if (feature) {
      return feature.geometry;
    }
    return null;
  }

  getSelectedFeaturesAsFeatureCollection(): FeatureCollection {
    const { features } = this.featureCollection.getObject();
    const selectedFeatures = this.getSelectedFeatureIndexes().map(
      selectedIndex => features[selectedIndex]
    );
    return {
      type: 'FeatureCollection',
      features: selectedFeatures
    };
  }

  setFeatureCollection(featureCollection: FeatureCollection): void {
    this.featureCollection = new ImmutableFeatureCollection(featureCollection);
  }

  getModeConfig(): any {
    return this._modeConfig;
  }

  setModeConfig(modeConfig: any): void {
    if (this._modeConfig === modeConfig) {
      return;
    }

    this._modeConfig = modeConfig;
    this._setTentativeFeature(null);
  }

  getSelectedFeatureIndexes(): number[] {
    return this._selectedFeatureIndexes;
  }

  setSelectedFeatureIndexes(indexes: number[]): void {
    if (this._selectedFeatureIndexes === indexes) {
      return;
    }

    this._selectedFeatureIndexes = indexes;
    this._setTentativeFeature(null);
  }

  setDeckGlContext(context: Object) {
    this._context = context;
  }

  getClickSequence(): Position[] {
    return this._clickSequence;
  }

  resetClickSequence(): void {
    this._clickSequence = [];
  }

  getTentativeFeature(): ?Feature {
    return this._tentativeFeature;
  }

  // TODO: remove the underscore
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
    return [];
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    return 'cell';
  }

  isSelectionPicked(picks: DeckGLPick[]): boolean {
    if (!picks.length) return false;
    const pickedIndexes = picks.map(({ index }) => index);
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    return selectedFeatureIndexes.some(index => pickedIndexes.includes(index));
  }

  getAddFeatureAction(geometry: Geometry): EditAction {
    // Unsure why flow can't deal with Geometry type, but there I fixed it
    const geometryAsAny: any = geometry;

    const updatedData = this.getImmutableFeatureCollection()
      .addFeature({
        type: 'Feature',
        properties: {},
        geometry: geometryAsAny
      })
      .getObject();

    return {
      updatedData,
      editType: 'addFeature',
      featureIndexes: [updatedData.features.length - 1],
      editContext: null
    };
  }

  getAddManyFeaturesAction(featureCollection: FeatureCollection): EditAction {
    const features = featureCollection.features;
    let updatedData = this.getImmutableFeatureCollection();
    const initialIndex = updatedData.getObject().features.length;
    const updatedIndexes = [];
    for (const feature of features) {
      const { properties, geometry } = feature;
      const geometryAsAny: any = geometry;
      updatedData = updatedData.addFeature({
        type: 'Feature',
        properties,
        geometry: geometryAsAny
      });
      updatedIndexes.push(initialIndex + updatedIndexes.length);
    }

    return {
      updatedData: updatedData.getObject(),
      editType: 'addFeature',
      featureIndexes: updatedIndexes,
      editContext: null
    };
  }

  getAddFeatureOrBooleanPolygonAction(geometry: Polygon): ?EditAction {
    const selectedFeature = this.getSelectedFeature();
    const modeConfig = this.getModeConfig();
    if (modeConfig && modeConfig.booleanOperation) {
      if (
        !selectedFeature ||
        (selectedFeature.geometry.type !== 'Polygon' &&
          selectedFeature.geometry.type !== 'MultiPolygon')
      ) {
        // eslint-disable-next-line no-console,no-undef
        console.warn(
          'booleanOperation only supported for single Polygon or MultiPolygon selection'
        );
        return null;
      }

      const feature = {
        type: 'Feature',
        geometry
      };

      let updatedGeometry;
      if (modeConfig.booleanOperation === 'union') {
        updatedGeometry = turfUnion(selectedFeature, feature);
      } else if (modeConfig.booleanOperation === 'difference') {
        updatedGeometry = turfDifference(selectedFeature, feature);
      } else if (modeConfig.booleanOperation === 'intersection') {
        updatedGeometry = turfIntersect(selectedFeature, feature);
      } else {
        // eslint-disable-next-line no-console,no-undef
        console.warn(`Invalid booleanOperation ${modeConfig.booleanOperation}`);
        return null;
      }

      if (!updatedGeometry) {
        // eslint-disable-next-line no-console,no-undef
        console.warn('Canceling edit. Boolean operation erased entire polygon.');
        return null;
      }

      const featureIndex = this.getSelectedFeatureIndexes()[0];

      const updatedData = this.getImmutableFeatureCollection()
        .replaceGeometry(featureIndex, updatedGeometry.geometry)
        .getObject();

      const editAction: EditAction = {
        updatedData,
        editType: 'unionGeometry',
        featureIndexes: [featureIndex],
        editContext: null
      };

      return editAction;
    }
    return this.getAddFeatureAction(geometry);
  }

  handleClick(event: ClickEvent): ?EditAction {
    this._clickSequence.push(event.groundCoords);

    return null;
  }

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    return { editAction: null, cancelMapPan: false };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    return null;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    return null;
  }

  // Get the indexes of polygons closest to the selected feature. The numberToTrack
  // optional parameter dictates how many polygons to track e.g. a numberToTrack = 3
  // will result in the 3 closest polygon indexes being returned by this method.
  getNearestPolygonIndexes(options: ?{ [key: string]: any }) {
    let arraySize = 1;
    if (options) {
      arraySize = options.numberToTrack;
    }
    const allFeatures = this.getImmutableFeatureCollection().getObject().features;
    const [selectedIndex] = this.getSelectedFeatureIndexes();
    const selectedCenter = turfCenter(this.getSelectedFeature());

    const minDistanceArray = new SortedList({
      arraySize,
      getValueToCompareFn: val => val.distance,
      sortType: SortType.MIN
    });
    for (let i = 0; i < allFeatures.length; i++) {
      const currentFeature = allFeatures[i];
      if (i !== selectedIndex && currentFeature.geometry.type === 'Polygon') {
        const currentFeatureCenter = turfCenter(currentFeature);
        const distance = turfDistance(currentFeatureCenter, selectedCenter);
        minDistanceArray.push({ distance, index: i });
      }
    }
    return minDistanceArray.toArray().map(details => details.index);
  }

  // Get the polygon's outer ring of coordinates if the polygon has an inner
  // ring of coordinates that makes up a polygon hole.
  getPolygonOuterRing(originalPoly: Feature) {
    const { coordinates } = originalPoly.geometry;
    return coordinates.length > 1 ? turfPolygon([coordinates[0]]) : originalPoly;
  }

  // Get the point(s) of a specified polygon that have an azimuth (measured from
  // the polygon center to polygon point) that is closest to the specified azimuth.
  getPolygonPointsClosestToAzimuth(polygon: Feature, options: { [key: string]: any }) {
    const arraySize = options.numberToTrack || 1;
    const azimuth = options.azimuth || 0;
    const selectedFeature = polygon;
    const selectedFeatureCenter = turfCenter(selectedFeature);

    const minBearingDiffArray = new SortedList({
      arraySize,
      sortType: SortType.MIN,
      getValueToCompareFn: val => val.azimuthDiff
    });

    const coordPoints = coordAll(this.getPolygonOuterRing(selectedFeature));

    // Coord points loop back to the original point such that the first and
    // last points are the same. Do not process the last coordinate.
    for (let i = 0; i < coordPoints.length - 1; i++) {
      const coordPoint = turfPoint(coordPoints[i]);
      const pointAzimuth = bearingToAzimuth(turfBearing(selectedFeatureCenter, coordPoint));
      const azimuthDiff = Math.min(
        Math.abs(azimuth - pointAzimuth),
        360 - Math.abs(azimuth - pointAzimuth)
      );
      minBearingDiffArray.push({ azimuthDiff, point: coordPoint });
    }
    return minBearingDiffArray.toArray().map(details => details.point);
  }

  // Get the polygon edge midpoint closest to the specified azimuth. The edge
  // midpoint azimuth is calculated from the edge midpoint to the polygon center.
  getPolygonEdgeDetailsFromAzimuth(polygon: any, azimuth: number) {
    const [p1, p2] = this.getPolygonPointsClosestToAzimuth(polygon, {
      azimuth,
      numberToTrack: 2
    });
    const length = turfDistance(p1, p2);
    const midpoint = turfMidpoint(p1, p2);
    return {
      midpoint,
      length
    };
  }

  isSinglePolygonSelected() {
    const selectedIndexes = this.getSelectedFeatureIndexes();
    const selectedFeature = this.getSelectedFeature();
    if (selectedFeature) {
      return selectedIndexes.length === 1 && selectedFeature.geometry.type === 'Polygon';
    }
    return false;
  }

  // Scale the snapping strength proportional to the snapping edge length of the
  // selected polygon.
  getSnapStrengthModifier(edgeLength: number) {
    return Math.pow(edgeLength / 2, 0.8);
  }

  hasSelectedBeenSnapped() {
    const [selectedIndex] = this.getSelectedFeatureIndexes();
    const snapPoints = this._snapAssociations[selectedIndex];
    return snapPoints ? snapPoints.length : false;
  }

  shouldPerformSnap(snapConfigs: Object) {
    const { enablePolygonSnapping } = snapConfigs || {};
    return (
      enablePolygonSnapping && this.isSinglePolygonSelected() && !this.hasSelectedBeenSnapped()
    );
  }

  shouldPerformUnsnap(snapConfigs: Object) {
    const { enablePolygonSnapping } = snapConfigs || {};
    return enablePolygonSnapping && this.isSinglePolygonSelected() && this.hasSelectedBeenSnapped();
  }

  shouldPerformStandardModeAction() {
    return !this.isSinglePolygonSelected() || !this.hasSelectedBeenSnapped();
  }

  // Calculates the closest polygon and the closest edge of said polygon to snap to
  // and returns the details of the snap from the specified list of candidate
  // polygon indexes
  getSnapDetailsFromCandidates(polygonIndexes: number[]) {
    const selectedPolyon = this.getSelectedFeature();
    const selectedPolyCenter = turfCenter(selectedPolyon);
    const { features } = this.getFeatureCollection();

    let minSnapDistance = Number.MAX_VALUE;
    let snapDetails;

    for (const index of polygonIndexes) {
      const polygon = features[index];
      const polyCenter = turfCenter(polygon);
      const azimuth = bearingToAzimuth(turfBearing(selectedPolyCenter, polyCenter));

      const {
        midpoint: selectedEdgeMidpoint,
        length: selectedSnapEdgeLength
      } = this.getPolygonEdgeDetailsFromAzimuth(selectedPolyon, azimuth);
      const nonSelectedPolyEdge = this.getPolygonEdgeDetailsFromAzimuth(
        polygon,
        Math.max(azimuth - 180, azimuth + 180) % 360
      );
      const polyMidpointDistance = turfDistance(selectedEdgeMidpoint, nonSelectedPolyEdge.midpoint);

      if (polyMidpointDistance < minSnapDistance) {
        minSnapDistance = polyMidpointDistance;

        snapDetails = {
          index,
          selectedSnapEdgeLength,
          snapDistance: polyMidpointDistance,
          nonSelectedSnapPoint: nonSelectedPolyEdge.midpoint,
          selectedSnapPoint: selectedEdgeMidpoint
        };
      }
    }
    return snapDetails;
  }

  calculateDistanceAndDirection(startDragPoint: Position, currentPoint: Position) {
    const p1 = turfPoint(startDragPoint);
    const p2 = turfPoint(currentPoint);

    const distanceMoved = turfDistance(p1, p2);
    const direction = turfBearing(p1, p2);

    return {
      distanceMoved,
      direction
    };
  }

  calculateSnapMove(snapDetails: Object, snapStrength: number) {
    if (snapDetails) {
      const {
        nonSelectedSnapPoint,
        selectedSnapPoint,
        snapDistance,
        index,
        selectedSnapEdgeLength
      } = snapDetails;
      const snapStrengthModifier = this.getSnapStrengthModifier(selectedSnapEdgeLength);

      if (snapDistance <= snapStrength * snapStrengthModifier) {
        const selectedIndexes = this.getSelectedFeatureIndexes();
        const selectedFeature = this.getSelectedFeature();
        const [selectedIndex] = selectedIndexes;

        const snapBearing = turfBearing(selectedSnapPoint, nonSelectedSnapPoint);
        const movedPolygon = turfTransformTranslate(selectedFeature, snapDistance, snapBearing);
        this.cacheSnapAssociates(index, selectedIndex);

        return {
          movedPolygon,
          selectedIndex
        };
      }
    }
    return null;
  }

  // Cache the indexes of the polygons that have participated in a snap
  cacheSnapAssociates(index: number, partnerIndex: number) {
    // Cache index to partnerIndex association
    if (!this._snapAssociations[index]) {
      this._snapAssociations[index] = [];
    }
    this._snapAssociations[index].push(partnerIndex);

    // Cache partnerIndex to index association
    if (!this._snapAssociations[partnerIndex]) {
      this._snapAssociations[partnerIndex] = [];
    }
    this._snapAssociations[partnerIndex].push(index);
  }

  getSnapAssociates(index: number) {
    return this._snapAssociations[index] || [];
  }

  // Clear all the polygon index and all partner polygons
  clearSnapAssociates(index: number) {
    const snapPartnerIndexes = this._snapAssociations[index];
    if (!snapPartnerIndexes || !snapPartnerIndexes.length) return;

    // Clear the specified index from all associated partners
    for (const partnerIndex of snapPartnerIndexes) {
      const associatesOfPartner = this._snapAssociations[partnerIndex];
      if (associatesOfPartner) {
        this._snapAssociations[partnerIndex] = associatesOfPartner.filter(i => i !== index);
      }
    }

    // Clear all associations from index
    if (this._snapAssociations[index]) {
      this._snapAssociations[index] = [];
    }
  }
}

export function getPickedEditHandle(picks: ?(any[])): ?EditHandle {
  const info = picks && picks.find(pick => pick.isEditingHandle);
  if (info) {
    return info.object;
  }
  return null;
}

export function getIntermediatePosition(position1: Position, position2: Position): Position {
  const intermediatePosition = [
    (position1[0] + position2[0]) / 2.0,
    (position1[1] + position2[1]) / 2.0
  ];
  return intermediatePosition;
}

export function getEditHandlesForGeometry(geometry: Geometry, featureIndex: number) {
  let handles: EditHandle[] = [];

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
