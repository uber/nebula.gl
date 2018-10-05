// @flow

import type { Position } from '../geojson-types.js';

export type DeckGLPick = {
  index: number,
  object: any
};

export type ClickEvent = {
  picks: DeckGLPick[],
  screenCoords: Position,
  groundCoords: Position
};

export type DoubleClickEvent = {
  groundCoords: Position
};

export type StartDraggingEvent = {
  picks: DeckGLPick[],
  screenCoords: Position,
  groundCoords: Position,
  dragStartScreenCoords: Position,
  dragStartGroundCoords: Position
};

export type StopDraggingEvent = {
  picks: DeckGLPick[],
  screenCoords: Position,
  groundCoords: Position,
  dragStartScreenCoords: Position,
  dragStartGroundCoords: Position
};

export type PointerMoveEvent = {
  screenCoords: Position,
  groundCoords: Position,
  picks: DeckGLPick[],
  isDragging: boolean,
  dragStartPicks: ?(DeckGLPick[]),
  dragStartScreenCoords: ?Position,
  dragStartGroundCoords: ?Position,
  sourceEvent: any
};
