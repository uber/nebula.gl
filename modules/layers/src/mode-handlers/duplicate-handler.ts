import { StartDraggingEvent } from '../event-types';
import { EditAction } from './mode-handler';
import { TranslateHandler } from './translate-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class DuplicateHandler extends TranslateHandler {
  handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined {
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
