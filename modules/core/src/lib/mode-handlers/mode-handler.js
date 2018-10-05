// @flow

import type { EditAction, EditContext } from '../editable-feature-collection.js';
import type { ClickEvent, PointerMoveEvent } from '../event-types.js';

export interface ModeHandler {
  handleClick(event: ClickEvent, editContext: EditContext): ?EditAction;

  handlePointerMove(
    event: PointerMoveEvent,
    editContext: EditContext
  ): { editAction: ?EditAction, cancelMapPan: boolean };
}
