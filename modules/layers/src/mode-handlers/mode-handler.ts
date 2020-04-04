// TODO edit-modes: delete handlers once EditMode fully implemented

import turfUnion from '@turf/union';
import turfDifference from '@turf/difference';
import turfIntersect from '@turf/intersect';

import {
  ImmutableFeatureCollection,
  FeatureCollection,
  Feature,
  Polygon,
  Geometry,
  Position,
} from '@nebula.gl/edit-modes';

import {
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DeckGLPick,
} from '../event-types';

export type EditHandleType = 'existing' | 'intermediate' | 'snap';

export type EditHandle = {
  position: Position;
  positionIndexes: number[];
  featureIndex: number;
  type: EditHandleType;
};

export type EditAction = {
  updatedData: FeatureCollection;
  editType: string;
  featureIndexes: number[];
  editContext: any;
};

export class ModeHandler {
  // TODO: add underscore
  featureCollection: ImmutableFeatureCollection;
  _tentativeFeature: Feature | null | undefined;
  _modeConfig: any = null;
  _selectedFeatureIndexes: number[] = [];
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

  getSelectedFeature(): Feature | null | undefined {
    if (this._selectedFeatureIndexes.length === 1) {
      return this.featureCollection.getObject().features[this._selectedFeatureIndexes[0]];
    }
    return null;
  }

  getSelectedGeometry(): Geometry | null | undefined {
    const feature = this.getSelectedFeature();
    if (feature) {
      return feature.geometry;
    }
    return null;
  }

  getSelectedFeaturesAsFeatureCollection(): FeatureCollection {
    const { features } = this.featureCollection.getObject();
    const selectedFeatures = this.getSelectedFeatureIndexes().map(
      (selectedIndex) => features[selectedIndex]
    );
    return {
      type: 'FeatureCollection',
      features: selectedFeatures,
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

  getClickSequence(): Position[] {
    return this._clickSequence;
  }

  resetClickSequence(): void {
    this._clickSequence = [];
  }

  getTentativeFeature(): Feature | null | undefined {
    return this._tentativeFeature;
  }

  // TODO: remove the underscore
  _setTentativeFeature(tentativeFeature: Feature | null | undefined): void {
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
  getEditHandles(picks?: Array<Record<string, any>>, groundCoords?: Position): EditHandle[] {
    return [];
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    return 'cell';
  }

  isSelectionPicked(picks: DeckGLPick[]): boolean {
    if (!picks.length) return false;
    const pickedIndexes = picks.map(({ index }) => index);
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    return selectedFeatureIndexes.some((index) => pickedIndexes.includes(index));
  }

  getAddFeatureAction(geometry: Geometry): EditAction {
    // Unsure why flow can't deal with Geometry type, but there I fixed it
    const geometryAsAny: any = geometry;

    const updatedData = this.getImmutableFeatureCollection()
      .addFeature({
        type: 'Feature',
        properties: {},
        geometry: geometryAsAny,
      })
      .getObject();

    return {
      updatedData,
      editType: 'addFeature',
      featureIndexes: [updatedData.features.length - 1],
      editContext: {
        featureIndexes: [updatedData.features.length - 1],
      },
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
        geometry: geometryAsAny,
      });
      updatedIndexes.push(initialIndex + updatedIndexes.length);
    }

    return {
      updatedData: updatedData.getObject(),
      editType: 'addFeature',
      featureIndexes: updatedIndexes,
      editContext: {
        featureIndexes: updatedIndexes,
      },
    };
  }

  getAddFeatureOrBooleanPolygonAction(geometry: Polygon): EditAction | null | undefined {
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
        geometry,
      };

      let updatedGeometry;
      if (modeConfig.booleanOperation === 'union') {
        updatedGeometry = turfUnion(selectedFeature, feature);
      } else if (modeConfig.booleanOperation === 'difference') {
        // @ts-ignore
        updatedGeometry = turfDifference(selectedFeature, feature);
      } else if (modeConfig.booleanOperation === 'intersection') {
        // @ts-ignore
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
        editContext: {
          featureIndexes: [featureIndex],
        },
      };

      return editAction;
    }
    return this.getAddFeatureAction(geometry);
  }

  handleClick(event: ClickEvent): EditAction | null | undefined {
    this._clickSequence.push(event.groundCoords);

    return null;
  }

  handlePointerMove(
    event: PointerMoveEvent
  ): { editAction: EditAction | null | undefined; cancelMapPan: boolean } {
    return { editAction: null, cancelMapPan: false };
  }

  handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined {
    return null;
  }

  handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined {
    return null;
  }
}

export function getPickedEditHandle(
  picks: any[] | null | undefined
): EditHandle | null | undefined {
  const info = picks && picks.find((pick) => pick.isEditingHandle);
  if (info) {
    return info.object;
  }
  return null;
}

export function getIntermediatePosition(position1: Position, position2: Position): Position {
  const intermediatePosition = [
    (position1[0] + position2[0]) / 2.0,
    (position1[1] + position2[1]) / 2.0,
  ];
  // @ts-ignore
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
          type: editHandleType,
        },
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
      // @ts-ignore
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
      type: editHandleType,
    });
  }
  return editHandles;
}
