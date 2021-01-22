import {
  EditMode,
  GuideFeatureCollection,
  Feature,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  FeatureCollection,
  Tooltip,
  DraggingEvent,
} from '@nebula.gl/edit-modes';
import { ModeProps } from '../types';

import { GEOJSON_TYPE, GUIDE_TYPE } from '../constants';
import { getFeatureCoordinates, isNumeric } from './utils';

export default class BaseMode implements EditMode<FeatureCollection, GuideFeatureCollection> {
  _tentativeFeature: Feature | null | undefined;
  _editHandles: Feature[] | null | undefined;

  constructor() {
    this._tentativeFeature = null;
    this._editHandles = null;
  }

  handlePan(event: ClickEvent, props: ModeProps<FeatureCollection>) {}

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {}

  handleDblClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {}

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {}

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {}

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {}

  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>): void {}

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection | null | undefined {
    return null;
  }
  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    return [];
  }
  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void {}

  getTentativeFeature() {
    return this._tentativeFeature;
  }

  getEditHandles() {
    return this._editHandles;
  }

  setTentativeFeature(feature: Feature) {
    this._tentativeFeature = feature;
  }

  getEditHandlesFromFeature(feature: Feature, featureIndex: number | null | undefined) {
    const coordinates = getFeatureCoordinates(feature);
    if (!coordinates) {
      return null;
    }
    // @ts-ignore
    return coordinates.map((coord, i) => {
      return {
        type: 'Feature',
        properties: {
          // TODO deprecate renderType
          renderType: feature.properties.renderType,
          guideType: GUIDE_TYPE.EDIT_HANDLE,
          editHandleType: 'existing',
          featureIndex,
          positionIndexes: [i],
        },
        geometry: {
          type: GEOJSON_TYPE.POINT,
          coordinates: coord,
        },
      };
    });
  }

  getSelectedFeature(props: ModeProps<FeatureCollection>, featureIndex: number | null | undefined) {
    const { data, selectedIndexes } = props;
    // @ts-ignore
    const features = data && data.features;

    const selectedIndex = isNumeric(featureIndex)
      ? Number(featureIndex)
      : selectedIndexes && selectedIndexes[0];

    return features && features[selectedIndex];
  }
}
