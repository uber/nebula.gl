// @flow

export type ScreenCoordinates = [number, number];
export type MapCoordinates = [number, number] | [number, number, number];

// Represents an edit action, i.e. a suggestion to update the data based on user interaction events
export type EditAction<TData> = {
  updatedData: TData,
  editType: string,
  editContext: any
};

// Represents an object "picked" from the screen. This usually reflects an object under the cursor
export type Pick = {
  object: any,
  index: number,
  isGuide: boolean
};

// Represents a click event
export type ClickEvent = {
  picks: Pick[],
  screenCoords: ScreenCoordinates,
  mapCoords: MapCoordinates,
  sourceEvent: any
};

// Represents a double-click event
export type DoubleClickEvent = {
  mapCoords: MapCoordinates,
  sourceEvent: any
};

// Represents an event that occurs when the pointer goes down and the cursor starts moving
export type StartDraggingEvent = {
  picks: Pick[],
  screenCoords: ScreenCoordinates,
  mapCoords: MapCoordinates,
  pointerDownScreenCoords: ScreenCoordinates,
  pointerDownMapCoords: MapCoordinates,
  sourceEvent: any
};

// Represents an event that occurs after the pointer goes down, moves some, then the pointer goes back up
export type StopDraggingEvent = {
  picks: Pick[],
  screenCoords: ScreenCoordinates,
  mapCoords: MapCoordinates,
  pointerDownScreenCoords: ScreenCoordinates,
  pointerDownMapCoords: MapCoordinates,
  sourceEvent: any
};

// Represents an event that occurs every time the pointer moves
export type PointerMoveEvent = {
  screenCoords: ScreenCoordinates,
  mapCoords: MapCoordinates,
  picks: Pick[],
  isDragging: boolean,
  pointerDownPicks: ?(Pick[]),
  pointerDownScreenCoords: ?ScreenCoordinates,
  pointerDownMapCoords: ?MapCoordinates,
  sourceEvent: any
};
