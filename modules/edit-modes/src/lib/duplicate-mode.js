// @flow

import type { StartDraggingEvent, ModeProps } from '../types.js';
import type { FeatureCollection } from '../geojson-types.js';
import type { GeoJsonEditAction } from './geojson-edit-mode.js';
import { TranslateMode } from './translate-mode.js';

export class DuplicateMode extends TranslateMode {
  handleStartDraggingAdapter(
    event: StartDraggingEvent,
    props: ModeProps<FeatureCollection>
  ): ?GeoJsonEditAction {
    if (!this._isTranslatable) {
      return null;
    }

    this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection(props);

    return this._geometryBeforeTranslate
      ? this.getAddManyFeaturesAction(this._geometryBeforeTranslate)
      : null;
  }

  getCursorAdapter(): ?string {
    if (this._isTranslatable) {
      return 'copy';
    }
    return null;
  }
}
