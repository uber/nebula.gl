// @flow

import type { Position } from '../geojson-types.js';
import type { EditHandle } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class ViewHandler extends ModeHandler {
  getCursor({ isDragging }: { isDragging: boolean }): string {
    return isDragging ? 'grabbing' : 'grab';
  }

  getEditHandles(picks?: Array<Object>, groundCoords?: Position): EditHandle[] {
    return [];
  }
}
