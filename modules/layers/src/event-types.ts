import { Position } from '@nebula.gl/edit-modes';

// TODO edit-modes: delete this once all code is refactored to use event types in edit-modes module

export type DeckGLPick = {
  index: number;
  object: any;
  isEditingHandle: boolean | null | undefined;
};

export type ClickEvent = {
  picks: DeckGLPick[];
  screenCoords: Position;
  groundCoords: Position;
  sourceEvent: any;
};

export type StartDraggingEvent = {
  picks: DeckGLPick[];
  screenCoords: Position;
  groundCoords: Position;
  pointerDownScreenCoords: Position;
  pointerDownGroundCoords: Position;
  sourceEvent: any;
};

export type StopDraggingEvent = {
  picks: DeckGLPick[];
  screenCoords: Position;
  groundCoords: Position;
  pointerDownScreenCoords: Position;
  pointerDownGroundCoords: Position;
  sourceEvent: any;
};

export type PointerMoveEvent = {
  screenCoords: Position;
  groundCoords: Position;
  picks: DeckGLPick[];
  isDragging: boolean;
  pointerDownPicks: DeckGLPick[] | null | undefined;
  pointerDownScreenCoords: Position | null | undefined;
  pointerDownGroundCoords: Position | null | undefined;
  sourceEvent: any;
};
