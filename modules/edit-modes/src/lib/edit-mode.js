// @flow

import type {
  EditAction,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent
} from '../types.js';

export type ModeState<TData, TGuides> = {
  // The data being edited, this can be an array or an object
  data: TData,

  // Additional configuration for this mode
  modeConfig: any,

  // The indexes of the selected features
  selectedIndexes: number[],

  // Features that can be used as a guide for editing the data
  guides: ?TGuides,

  // The cursor type, as a [CSS Cursor](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
  cursor: string,

  // Callback used to notify applications of an edit action
  onEdit: (editAction: EditAction<TData>) => void,

  // Callback used to update guides
  onUpdateGuides: (guides: ?TGuides) => void,

  // Callback used to update cursor
  onUpdateCursor: (cursor: string) => void
};

export interface EditMode<TData, TGuides> {
  // Called every time something in `state` changes
  updateState(state: ModeState<TData, TGuides>): void;

  // Called when the pointer went down and up without dragging regardless of whether something was picked
  handleClick(event: ClickEvent): void;

  // Called when the pointer moved, regardless of whether the pointer is down, up, and whether something was picked
  handlePointerMove(event: PointerMoveEvent): void;

  // Called when the pointer went down on something rendered by this layer and the pointer started to move
  handleStartDragging(event: StartDraggingEvent): void;

  // Called when the pointer went down on something rendered by this layer, the pointer moved, and now the pointer is up
  handleStopDragging(event: StopDraggingEvent): void;
}

export class BaseEditMode<TData, TGuides> implements EditMode<TData, TGuides> {
  state: ModeState<TData, TGuides>;

  getState(): ModeState<TData, TGuides> {
    return this.state;
  }

  updateState(state: ModeState<TData, TGuides>) {
    const prevState = this.state;
    const changedEvents: ((prevState: ModeState<TData, TGuides>) => void)[] = [];
    if (!this.state || this.state.data !== state.data) {
      changedEvents.push(this.onDataChanged);
    }
    if (!this.state || this.state.modeConfig !== state.modeConfig) {
      changedEvents.push(this.onModeConfigChanged);
    }
    if (!this.state || this.state.selectedIndexes !== state.selectedIndexes) {
      changedEvents.push(this.onSelectedIndexesChanged);
    }
    if (!this.state || this.state.guides !== state.guides) {
      changedEvents.push(this.onGuidesChanged);
    }
    this.state = state;

    changedEvents.forEach(fn => fn.bind(this)(prevState));
  }

  // Overridable user interaction handlers
  handleClick(event: ClickEvent): void {}
  handlePointerMove(event: PointerMoveEvent): void {}
  handleStartDragging(event: StartDraggingEvent): void {}
  handleStopDragging(event: StopDraggingEvent): void {}

  // Convenience functions to handle state changes
  onDataChanged(prevState: ModeState<TData, TGuides>): void {}
  onModeConfigChanged(prevState: ModeState<TData, TGuides>): void {}
  onSelectedIndexesChanged(prevState: ModeState<TData, TGuides>): void {}
  onGuidesChanged(prevState: ModeState<TData, TGuides>): void {}

  // Convenience functions to access state
  getData(): TData {
    return this.state.data;
  }
  getModeConfig(): any {
    return this.state.modeConfig;
  }
  getSelectedIndexes(): number[] {
    return this.state.selectedIndexes;
  }
  getGuides(): ?TGuides {
    return this.state && this.state.guides;
  }
  getCursor(): string {
    return this.state && this.state.cursor;
  }
  onEdit(editAction: EditAction<TData>): void {
    this.state.onEdit(editAction);
  }
  onUpdateGuides(guides: ?TGuides): void {
    this.state.onUpdateGuides(guides);
  }
  onUpdateCursor(cursor: string): void {
    this.state.onUpdateCursor(cursor);
  }
}
