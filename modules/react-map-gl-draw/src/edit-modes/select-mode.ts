// @flow

import type { ClickEvent, FeatureCollection } from '@nebula.gl/edit-modes';
import type { ModeProps } from '../types';

import { ELEMENT_TYPE } from '../constants';
import BaseMode from './base-mode';
import { isNumeric } from './utils';

export default class SelectMode extends BaseMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const { mapCoords, screenCoords } = event;
    const pickedObject = event.picks && event.picks[0] && event.picks[0].object;
    if (pickedObject && isNumeric(pickedObject.featureIndex)) {
      const selectedFeatureIndex = pickedObject.featureIndex;
      const selectedFeature = this.getSelectedFeature(props, selectedFeatureIndex);
      props.onSelect({
        selectedFeature,
        selectedFeatureIndex,
        selectedEditHandleIndex:
          pickedObject.type === ELEMENT_TYPE.EDIT_HANDLE ? pickedObject.index : null,
        mapCoords,
        screenCoords
      });
    } else {
      props.onSelect({
        selectedFeature: null,
        selectedFeatureIndex: null,
        selectedEditHandleIndex: null,
        mapCoords,
        screenCoords
      });
    }
  }
}
