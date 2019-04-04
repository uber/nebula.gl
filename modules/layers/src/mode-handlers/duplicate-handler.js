// @flow

import type { StartDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { SnapTranslateHandler } from './snap-translate-handler';

export class DuplicateHandler extends SnapTranslateHandler {
  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    if (!this._isTranslatable) {
      return null;
    }

    this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection();

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
