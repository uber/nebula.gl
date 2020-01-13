// @flow

import type { StartDraggingEvent, ModeProps } from '../types.js';
import type { FeatureCollection } from '../geojson-types.js';
import { TranslateMode } from './translate-mode.js';

export class DuplicateMode extends TranslateMode {
  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    super.handleStartDragging(event, props);

    if (this._geometryBeforeTranslate) {
      props.onEdit(this.getAddManyFeaturesAction(this._geometryBeforeTranslate, props.data));
    }
  }

  updateCursor(props: ModeProps<FeatureCollection>) {
    if (this._isTranslatable) {
      props.onUpdateCursor('copy');
    } else {
      props.onUpdateCursor(null);
    }
  }
}
