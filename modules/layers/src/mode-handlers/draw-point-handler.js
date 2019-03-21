// @flow

import type { ClickEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class DrawPointHandler extends ModeHandler {
  handleClick({ groundCoords }: ClickEvent): ?EditAction {
    const geometry = {
      type: 'Point',
      coordinates: groundCoords
    };

    return this.getAddFeatureAction(geometry);
  }
}
