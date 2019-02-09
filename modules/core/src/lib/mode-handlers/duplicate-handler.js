// @flow

import type { StartDraggingEvent } from '../event-types.js';
import { convertFeatureListToFeatureCollection } from '../utils';
import type { EditAction } from './mode-handler.js';
import { TranslateHandler } from './translate-handler';

export class DuplicateHandler extends TranslateHandler {
  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    const geometryBefore = this.getSelectedGeometries();
    if (this._isTranslatable) {
      this._geometryBeforeTranslate = convertFeatureListToFeatureCollection(geometryBefore);
    }

    return this._geometryBeforeTranslate
      ? this.getAddManyFeaturesAction(this._geometryBeforeTranslate)
      : null;
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    if (this._isTranslatable) {
      return 'copy';
    }
    return isDragging ? 'grabbing' : 'grab';
  }
}
