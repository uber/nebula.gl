// @flow
import type { Position } from './geojson-types.js';

export type DeckGLPick = {
  index: number,
  object: any,
  isEditingHandle: ?boolean
};

export type ClickEvent = {
  picks: DeckGLPick[],
  screenCoords: Position,
  groundCoords: Position,
  sourceEvent: any
};

export type DoubleClickEvent = {
  groundCoords: Position,
  sourceEvent: any
};

export type StartDraggingEvent = {
  picks: DeckGLPick[],
  screenCoords: Position,
  groundCoords: Position,
  pointerDownScreenCoords: Position,
  pointerDownGroundCoords: Position,
  sourceEvent: any
};

export type StopDraggingEvent = {
  picks: DeckGLPick[],
  screenCoords: Position,
  groundCoords: Position,
  pointerDownScreenCoords: Position,
  pointerDownGroundCoords: Position,
  sourceEvent: any
};

export type PointerMoveEvent = {
  screenCoords: Position,
  groundCoords: Position,
  picks: DeckGLPick[],
  isDragging: boolean,
  pointerDownPicks: ?(DeckGLPick[]),
  pointerDownScreenCoords: ?Position,
  pointerDownGroundCoords: ?Position,
  sourceEvent: any
};
