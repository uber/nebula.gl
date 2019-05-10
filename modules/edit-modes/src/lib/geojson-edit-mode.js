// @flow

import turfUnion from '@turf/union';
import turfDifference from '@turf/difference';
import turfIntersect from '@turf/intersect';

import type {
  EditAction,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  Pick
} from '../types.js';
import type { FeatureCollection, Feature, Polygon, Geometry, Position } from '../geojson-types.js';
import type { ModeState } from './edit-mode.js';
import { EditMode, BaseEditMode } from './edit-mode.js';

import { ImmutableFeatureCollection } from './immutable-feature-collection.js';

export type EditHandleType = 'existing' | 'intermediate' | 'snap';

export type EditHandle = {
  position: Position,
  positionIndexes: number[],
  featureIndex: number,
  type: EditHandleType
};

export type GeoJsonEditAction = EditAction<FeatureCollection>;
export type ModeHandlerGuides = { tentativeFeature: ?Feature, editHandles: EditHandle[] };

const DEFAULT_EDIT_HANDLES: EditHandle[] = [];

// Main interface for `EditMode`s that edit GeoJSON
export type GeoJsonEditMode = EditMode<FeatureCollection, ModeHandlerGuides>;

export class BaseGeoJsonEditMode extends BaseEditMode<FeatureCollection, ModeHandlerGuides> {
  // TODO: add underscore
  featureCollection: ImmutableFeatureCollection;
  _clickSequence: Position[] = [];

  constructor(featureCollection?: FeatureCollection) {
    super();
    if (featureCollection) {
      this.setFeatureCollection(featureCollection);
    }
  }

  getFeatureCollection(): FeatureCollection {
    return this.featureCollection.getObject();
  }

  getImmutableFeatureCollection(): ImmutableFeatureCollection {
    return this.featureCollection;
  }

  getSelectedFeature(): ?Feature {
    if (this.getSelectedIndexes().length === 1) {
      return this.featureCollection.getObject().features[this.getSelectedIndexes()[0]];
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

  onDataChanged(): void {
    this.setFeatureCollection(this.getData());
    this._refreshEditHandles();
  }

  setFeatureCollection(featureCollection: FeatureCollection): void {
    this.featureCollection = new ImmutableFeatureCollection(featureCollection);
  }

  // TODO: delete me
  setModeConfig(modeConfig: any): void {
    console.warn('TODO: call to obsolete setModeConfig'); // eslint-disable-line
  }

  // TODO: delete me
  getSelectedFeatureIndexes(): number[] {
    return this.getSelectedIndexes();
  }

  // TODO: delete me
  setSelectedFeatureIndexes(indexes: number[]): void {
    console.warn('TODO: call to obsolete setSelectedFeatureIndexes'); // eslint-disable-line
  }

  onSelectedIndexesChanged(): void {
    this._setTentativeFeature(null);
  }

  onGuidesChanged(prevState: ModeState<FeatureCollection, ModeHandlerGuides>): void {
    const guides = this.getGuides();

    if (!guides) {
      // Reset the click sequence
      this._clickSequence = [];
    }

    if (
      prevState &&
      prevState.guides &&
      guides &&
      prevState.guides.tentativeFeature !== guides.tentativeFeature
    ) {
      // re-calculate edit handles
      this._refreshEditHandles();
    }
  }

  getClickSequence(): Position[] {
    return this._clickSequence;
  }

  resetClickSequence(): void {
    this._clickSequence = [];
  }

  getTentativeFeature(): ?Feature {
    const { tentativeFeature } = this.getGuides() || {};
    return tentativeFeature;
  }

  getEditHandles(): EditHandle[] {
    const { editHandles } = this.getGuides() || { editHandles: DEFAULT_EDIT_HANDLES };
    return editHandles;
  }

  // TODO: delete me once mode handlers do getEditHandles lazily
  _setTentativeFeature(tentativeFeature: ?Feature): void {
    this.getState().onUpdateGuides({
      tentativeFeature,
      editHandles: this.getEditHandles()
    });
  }

  // TODO: delete me once mode handlers do getEditHandles lazily
  _refreshEditHandles(picks?: Array<Object>, mapCoords?: Position): void {
    this.getState().onUpdateGuides({
      tentativeFeature: this.getTentativeFeature(),
      editHandles: this.getEditHandlesAdapter(picks, mapCoords)
    });
  }

  _refreshCursor(): void {
    const currentCursor = this.getCursor();
    const updatedCursor = this.getCursorAdapter({ isDragging: false });

    if (currentCursor !== updatedCursor) {
      this.onUpdateCursor(updatedCursor);
    }
  }

  /**
   * Returns a flat array of positions for the given feature along with their indexes into the feature's geometry's coordinates.
   *
   * @param featureIndex The index of the feature to get edit handles
   */
  getEditHandlesAdapter(
    picks?: Array<Object>,
    mapCoords?: Position,
    tentativeFeature?: ?Feature
  ): EditHandle[] {
    return DEFAULT_EDIT_HANDLES;
  }

  getCursorAdapter({ isDragging }: { isDragging: boolean }): string {
    return 'cell';
  }

  isSelectionPicked(picks: Pick[]): boolean {
    if (!picks.length) return false;
    const pickedIndexes = picks.map(({ index }) => index);
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    return selectedFeatureIndexes.some(index => pickedIndexes.includes(index));
  }

  getAddFeatureAction(geometry: Geometry): GeoJsonEditAction {
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
      editContext: {
        featureIndexes: [updatedData.features.length - 1]
      }
    };
  }

  getAddManyFeaturesAction(featureCollection: FeatureCollection): GeoJsonEditAction {
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
      editContext: {
        featureIndexes: updatedIndexes
      }
    };
  }

  getAddFeatureOrBooleanPolygonAction(geometry: Polygon): ?GeoJsonEditAction {
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

      const editAction: GeoJsonEditAction = {
        updatedData,
        editType: 'unionGeometry',
        editContext: {
          featureIndexes: [featureIndex]
        }
      };

      return editAction;
    }
    return this.getAddFeatureAction(geometry);
  }

  handleClick(event: ClickEvent): void {
    const editAction = this.handleClickAdapter(event);

    this._refreshEditHandles(event.picks, event.mapCoords);
    if (editAction) {
      this.onEdit(editAction);
    }
  }

  handlePointerMove(event: PointerMoveEvent): void {
    const { editAction, cancelMapPan } = this.handlePointerMoveAdapter(event);

    if (cancelMapPan) {
      // TODO: is there a less hacky way to prevent map panning?
      // Stop propagation to prevent map panning while dragging an edit handle
      event.sourceEvent.stopPropagation();
    }

    this._refreshCursor();
    this._refreshEditHandles(event.picks, event.mapCoords);
    if (editAction) {
      this.onEdit(editAction);
    }
  }

  handleStartDragging(event: StartDraggingEvent): void {
    const editAction = this.handleStartDraggingAdapter(event);

    this._refreshEditHandles(event.picks, event.mapCoords);
    if (editAction) {
      this.onEdit(editAction);
    }
  }

  handleStopDragging(event: StopDraggingEvent): void {
    const editAction = this.handleStopDraggingAdapter(event);

    this._refreshEditHandles(event.picks, event.mapCoords);
    if (editAction) {
      this.onEdit(editAction);
    }
  }

  // TODO: delete these adapters once all ModeHandler implementations don't use them
  handleClickAdapter(event: ClickEvent): ?GeoJsonEditAction {
    this._clickSequence.push(event.mapCoords);

    return null;
  }

  handlePointerMoveAdapter(
    event: PointerMoveEvent
  ): { editAction: ?GeoJsonEditAction, cancelMapPan: boolean } {
    return { editAction: null, cancelMapPan: false };
  }

  handleStartDraggingAdapter(event: StartDraggingEvent): ?GeoJsonEditAction {
    return null;
  }

  handleStopDraggingAdapter(event: StopDraggingEvent): ?GeoJsonEditAction {
    return null;
  }
}

export function getPickedEditHandle(picks: ?(any[])): ?EditHandle {
  const info = picks && picks.find(pick => pick.isGuide);
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

export function getEditHandlesForGeometry(
  geometry: Geometry,
  featureIndex: number,
  editHandleType: EditHandleType = 'existing'
) {
  let handles: EditHandle[] = [];

  switch (geometry.type) {
    case 'Point':
      // positions are not nested
      handles = [
        {
          position: geometry.coordinates,
          positionIndexes: [],
          featureIndex,
          type: editHandleType
        }
      ];
      break;
    case 'MultiPoint':
    case 'LineString':
      // positions are nested 1 level
      handles = handles.concat(
        getEditHandlesForCoordinates(geometry.coordinates, [], featureIndex, editHandleType)
      );
      break;
    case 'Polygon':
    case 'MultiLineString':
      // positions are nested 2 levels
      for (let a = 0; a < geometry.coordinates.length; a++) {
        handles = handles.concat(
          getEditHandlesForCoordinates(geometry.coordinates[a], [a], featureIndex, editHandleType)
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
            getEditHandlesForCoordinates(
              geometry.coordinates[a][b],
              [a, b],
              featureIndex,
              editHandleType
            )
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
  featureIndex: number,
  editHandleType: EditHandleType = 'existing'
): EditHandle[] {
  const editHandles = [];
  for (let i = 0; i < coordinates.length; i++) {
    const position = coordinates[i];
    editHandles.push({
      position,
      positionIndexes: [...positionIndexPrefix, i],
      featureIndex,
      type: editHandleType
    });
  }
  return editHandles;
}
