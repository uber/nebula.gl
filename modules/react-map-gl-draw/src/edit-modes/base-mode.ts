// @flow

import type {
  EditMode,
  GuideFeatureCollection,
  Feature,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  FeatureCollection
} from '@nebula.gl/edit-modes';
import type { ModeProps } from '../types';

import { GEOJSON_TYPE, GUIDE_TYPE } from '../constants';
import { getFeatureCoordinates, isNumeric } from './utils';

export default class BaseMode implements EditMode<FeatureCollection, GuideFeatureCollection> {
  _tentativeFeature: ?Feature;
  _editHandles: ?(Feature[]);

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

  getGuides(props: ModeProps<FeatureCollection>): ?Object {}

  getTentativeFeature = () => {
    return this._tentativeFeature;
  };

  getEditHandles = () => {
    return this._editHandles;
  };

  setTentativeFeature = (feature: Feature) => {
    this._tentativeFeature = feature;
  };

  getEditHandlesFromFeature(feature: Feature, featureIndex: ?number) {
    const coordinates = getFeatureCoordinates(feature);
    if (!coordinates) {
      return null;
    }
    return coordinates.map((coord, i) => {
      return {
        type: 'Feature',
        properties: {
          // TODO deprecate renderType
          renderType: feature.properties.renderType,
          guideType: GUIDE_TYPE.EDIT_HANDLE,
          featureIndex,
          positionIndexes: [i]
        },
        geometry: {
          type: GEOJSON_TYPE.POINT,
          coordinates: [coord]
        }
      };
    });
  }

  getSelectedFeature = (props: ModeProps<FeatureCollection>, featureIndex: ?number) => {
    const { data, selectedIndexes } = props;
    const featureCollection = data.getObject();
    const features = featureCollection && featureCollection.features;

    const selectedIndex = isNumeric(featureIndex)
      ? Number(featureIndex)
      : selectedIndexes && selectedIndexes[0];

    return features && features[selectedIndex];
  };
}
