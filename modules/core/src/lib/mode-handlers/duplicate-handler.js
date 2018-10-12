// @flow

import type { StartDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { TranslateHandler } from './translate-handler';

export class DuplicateHandler extends TranslateHandler {
  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const geometryBefore = this.getSelectedGeometry();

    if (selectedFeatureIndexes.length !== 1 || !geometryBefore) {
      console.warn('duplicate only supported for single feature selection'); // eslint-disable-line no-console,no-undef
    } else if (this._isTranslatable) {
      this._geometryBeforeTranslate = geometryBefore;
    }

    return this._geometryBeforeTranslate
      ? this.getAddFeatureAction(this._geometryBeforeTranslate)
      : null;
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    if (this._isTranslatable) {
      return 'copy';
    }
    return isDragging ? 'grabbing' : 'grab';
  }
}
