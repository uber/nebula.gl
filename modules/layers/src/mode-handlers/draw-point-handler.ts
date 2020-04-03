// @flow

import type { ClickEvent } from '../event-types.ts';
import type { EditAction } from './mode-handler.ts';
import { ModeHandler } from './mode-handler.ts';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class DrawPointHandler extends ModeHandler {
  handleClick({ groundCoords }: ClickEvent): ?EditAction {
    const geometry = {
      type: 'Point',
      coordinates: groundCoords
    };

    return this.getAddFeatureAction(geometry);
  }
}
