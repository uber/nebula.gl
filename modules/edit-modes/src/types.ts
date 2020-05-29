import { Position, Point, Geometry, FeatureWithProps } from './geojson-types';

export type ScreenCoordinates = [number, number];

// Represents an edit action, i.e. a suggestion to update the data based on user interaction events
export type EditAction<TData> = {
  updatedData: TData;
  editType: string;
  editContext: any;
};

// Represents an object "picked" from the screen. This usually reflects an object under the cursor
export type Pick = {
  object: any;
  index: number;
  isGuide: boolean;
};

export type Viewport = {
  width: number;
  height: number;
  longitude: number;
  latitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
};

export type BasePointerEvent = {
  picks: Pick[];
  screenCoords: ScreenCoordinates;
  mapCoords: Position;
  sourceEvent: any;
};

// Represents a click event
export type ClickEvent = BasePointerEvent;

// Represents an event that occurs when the pointer goes down and the cursor starts moving
export type StartDraggingEvent = BasePointerEvent & {
  pointerDownPicks?: Pick[] | null | undefined;
  pointerDownScreenCoords: ScreenCoordinates;
  pointerDownMapCoords: Position;
  cancelPan: () => void;
};

// Represents an event that occurs after the pointer goes down, moves some, then the pointer goes back up
export type StopDraggingEvent = BasePointerEvent & {
  pointerDownPicks?: Pick[] | null | undefined;
  pointerDownScreenCoords: ScreenCoordinates;
  pointerDownMapCoords: Position;
};

// Represents an event that occurs after the pointer goes down and is moving
export type DraggingEvent = BasePointerEvent & {
  pointerDownPicks?: Pick[] | null | undefined;
  pointerDownScreenCoords: ScreenCoordinates;
  pointerDownMapCoords: Position;
  cancelPan: () => void;
};

// Represents an event that occurs every time the pointer moves
export type PointerMoveEvent = BasePointerEvent & {
  pointerDownPicks?: Pick[] | null | undefined;
  pointerDownScreenCoords?: ScreenCoordinates | null | undefined;
  pointerDownMapCoords?: Position | null | undefined;
  cancelPan: () => void;
};

export type Tooltip = {
  position: Position;
  text: string;
};

export type EditHandleType =
  | 'existing'
  | 'intermediate'
  | 'snap-source'
  | 'snap-target'
  | 'scale'
  | 'rotate';

export type EditHandleFeature = FeatureWithProps<
  Point,
  {
    guideType: 'editHandle';
    editHandleType: EditHandleType;
    featureIndex: number;
    positionIndexes?: number[];
    shape?: string;
  }
>;

export type TentativeFeature = FeatureWithProps<
  Geometry,
  {
    guideType: 'tentative';
    shape?: string;
  }
>;

export type GuideFeature = EditHandleFeature | TentativeFeature;

export type GuideFeatureCollection = {
  type: 'FeatureCollection';
  features: Readonly<GuideFeature>[];
  properties?: {};
};

export type ModeProps<TData> = {
  // The data being edited, this can be an array or an object
  data: TData;

  // Additional configuration for this mode
  modeConfig: any;

  // The indexes of the selected features
  selectedIndexes: number[];

  // The cursor type, as a [CSS Cursor](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
  cursor: string | null | undefined;

  // The last pointer move event that occurred
  lastPointerMoveEvent: PointerMoveEvent;

  // Callback used to notify applications of an edit action
  onEdit: (editAction: EditAction<TData>) => void;

  // Callback used to update cursor
  onUpdateCursor: (cursor: string | null | undefined) => void;
};
