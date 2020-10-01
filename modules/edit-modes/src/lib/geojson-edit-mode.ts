import turfUnion from '@turf/union';
import turfDifference from '@turf/difference';
import turfIntersect from '@turf/intersect';
import rewind from '@turf/rewind';

import {
  EditAction,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  Pick,
  Tooltip,
  ModeProps,
  GuideFeatureCollection,
  TentativeFeature,
} from '../types';
import { FeatureCollection, Feature, Polygon, Geometry, Position } from '../geojson-types';
import { getPickedEditHandles, getNonGuidePicks } from '../utils';
import { EditMode } from './edit-mode';
import { ImmutableFeatureCollection } from './immutable-feature-collection';

export type GeoJsonEditAction = EditAction<FeatureCollection>;

const DEFAULT_GUIDES: GuideFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};
const DEFAULT_TOOLTIPS: Tooltip[] = [];

// Main interface for `EditMode`s that edit GeoJSON
export type GeoJsonEditModeType = EditMode<FeatureCollection, FeatureCollection>;

export interface GeoJsonEditModeConstructor {
  new (): GeoJsonEditModeType;
}

export class GeoJsonEditMode implements EditMode<FeatureCollection, GuideFeatureCollection> {
  _clickSequence: Position[] = [];

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    return DEFAULT_GUIDES;
  }

  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    return DEFAULT_TOOLTIPS;
  }

  getSelectedFeature(props: ModeProps<FeatureCollection>): Feature | null | undefined {
    if (props.selectedIndexes.length === 1) {
      return props.data.features[props.selectedIndexes[0]];
    }
    return null;
  }

  getSelectedGeometry(props: ModeProps<FeatureCollection>): Geometry | null | undefined {
    const feature = this.getSelectedFeature(props);
    if (feature) {
      return feature.geometry;
    }
    return null;
  }

  getSelectedFeaturesAsFeatureCollection(props: ModeProps<FeatureCollection>): FeatureCollection {
    const { features } = props.data;
    const selectedFeatures = props.selectedIndexes.map((selectedIndex) => features[selectedIndex]);
    return {
      type: 'FeatureCollection',
      features: selectedFeatures,
    };
  }

  getClickSequence(): Position[] {
    return this._clickSequence;
  }

  addClickSequence({ mapCoords }: ClickEvent): void {
    this._clickSequence.push(mapCoords);
  }

  resetClickSequence(): void {
    this._clickSequence = [];
  }

  getTentativeGuide(props: ModeProps<FeatureCollection>): TentativeFeature | null | undefined {
    const guides = this.getGuides(props);

    // @ts-ignore
    return guides.features.find((f) => f.properties && f.properties.guideType === 'tentative');
  }

  isSelectionPicked(picks: Pick[], props: ModeProps<FeatureCollection>): boolean {
    if (!picks.length) return false;
    const pickedFeatures = getNonGuidePicks(picks).map(({ index }) => index);
    const pickedHandles = getPickedEditHandles(picks).map(
      ({ properties }) => properties.featureIndex
    );
    const pickedIndexes = new Set([...pickedFeatures, ...pickedHandles]);
    return props.selectedIndexes.some((index) => pickedIndexes.has(index));
  }

  rewindPolygon(feature: Feature): Feature {
    const { geometry } = feature;

    const isPolygonal = geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
    if (isPolygonal) {
      // @ts-ignore
      return rewind(feature);
    }

    return feature;
  }

  getAddFeatureAction(
    featureOrGeometry: Geometry | Feature,
    features: FeatureCollection
  ): GeoJsonEditAction {
    // Unsure why flow can't deal with Geometry type, but there I fixed it
    const featureOrGeometryAsAny: any = featureOrGeometry;

    const feature: any =
      featureOrGeometryAsAny.type === 'Feature'
        ? featureOrGeometryAsAny
        : {
            type: 'Feature',
            properties: {},
            geometry: featureOrGeometryAsAny,
          };

    const rewindFeature = this.rewindPolygon(feature);
    const updatedData = new ImmutableFeatureCollection(features)
      .addFeature(rewindFeature)
      .getObject();

    return {
      updatedData,
      editType: 'addFeature',
      editContext: {
        featureIndexes: [updatedData.features.length - 1],
      },
    };
  }

  getAddManyFeaturesAction(
    { features: featuresToAdd }: FeatureCollection,
    features: FeatureCollection
  ): GeoJsonEditAction {
    let updatedData = new ImmutableFeatureCollection(features);
    const initialIndex = updatedData.getObject().features.length;
    const updatedIndexes = [];
    for (const feature of featuresToAdd) {
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
      editContext: {
        featureIndexes: updatedIndexes,
      },
    };
  }

  getAddFeatureOrBooleanPolygonAction(
    featureOrGeometry: Polygon | Feature,
    props: ModeProps<FeatureCollection>
  ): GeoJsonEditAction | null | undefined {
    const featureOrGeometryAsAny: any = featureOrGeometry;

    const selectedFeature = this.getSelectedFeature(props);
    const { modeConfig } = props;
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

      const feature =
        featureOrGeometryAsAny.type === 'Feature'
          ? featureOrGeometryAsAny
          : {
              type: 'Feature',
              geometry: featureOrGeometryAsAny,
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

      const featureIndex = props.selectedIndexes[0];

      const updatedData = new ImmutableFeatureCollection(props.data)
        .replaceGeometry(featureIndex, updatedGeometry.geometry)
        .getObject();

      const editAction: GeoJsonEditAction = {
        updatedData,
        editType: 'unionGeometry',
        editContext: {
          featureIndexes: [featureIndex],
        },
      };

      return editAction;
    }
    return this.getAddFeatureAction(featureOrGeometry, props.data);
  }

  createTentativeFeature(props: ModeProps<FeatureCollection>): TentativeFeature {
    return null;
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void {}
  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void {
    const tentativeFeature = this.createTentativeFeature(props);
    if (tentativeFeature) {
      props.onEdit({
        updatedData: props.data,
        editType: 'updateTentativeFeature',
        editContext: {
          feature: tentativeFeature,
        },
      });
    }
  }
  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void {}
  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void {}
  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void {}

  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>): void {
    if (event.key === 'Escape') {
      this.resetClickSequence();
      props.onEdit({
        // Because the new drawing feature is dropped, so the data will keep as the same.
        updatedData: props.data,
        editType: 'cancelFeature',
        editContext: {},
      });
    }
  }
}

export function getIntermediatePosition(position1: Position, position2: Position): Position {
  const intermediatePosition = [
    (position1[0] + position2[0]) / 2.0,
    (position1[1] + position2[1]) / 2.0,
  ];
  // @ts-ignore
  return intermediatePosition;
}
