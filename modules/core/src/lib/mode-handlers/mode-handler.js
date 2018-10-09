// @flow

import type { FeatureCollection, Feature, Geometry, Position } from '../../geojson-types.js';
import type {
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent
} from '../event-types.js';

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
  featureIndex: number,
  positionIndexes: ?(number[]),
  position: ?Position
};

export class ModeHandler {
  // TODO: add underscore
  featureCollection: ImmutableFeatureCollection;
  _tentativeFeature: ?Feature;
  _modeConfig: any = null;
  _selectedFeatureIndexes: number[] = [];
  _drawAtFront: boolean = false;
  _clickSequence: Position[] = [];

  constructor(featureCollection?: FeatureCollection) {
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

  getSelectedGeometry(): ?Geometry {
    if (this._selectedFeatureIndexes.length === 1) {
      return this.featureCollection.getObject().features[this._selectedFeatureIndexes[0]].geometry;
    }
    return null;
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

  getDrawAtFront(): boolean {
    return this._drawAtFront;
  }

  setDrawAtFront(drawAtFront: boolean): void {
    if (this._drawAtFront === drawAtFront) {
      return;
    }

    this._drawAtFront = drawAtFront;
    this._setTentativeFeature(null);
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

export function getAddFeatureAction(
  featureCollection: ImmutableFeatureCollection,
  geometry: Geometry
) {
  // Unsure why flow can't deal with Geometry type, but there I fixed it
  const geometryAsAny: any = geometry;

  const updatedData = featureCollection
    .addFeature({
      type: 'Feature',
      properties: {},
      geometry: geometryAsAny
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
