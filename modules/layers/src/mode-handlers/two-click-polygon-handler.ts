
import type { ClickEvent } from '../event-types.ts';
import { ModeHandler } from './mode-handler.ts';
import type { EditAction } from './mode-handler.ts';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class TwoClickPolygonHandler extends ModeHandler {
  handleClick(event: ClickEvent): ?EditAction {
    super.handleClick(event);

    const tentativeFeature = this.getTentativeFeature();
    const clickSequence = this.getClickSequence();

    if (
      clickSequence.length > 1 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      const editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry);
      this.resetClickSequence();
      this._setTentativeFeature(null);
      return editAction;
    }

    return null;
  }
}
