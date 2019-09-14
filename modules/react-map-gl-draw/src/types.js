// @flow

import type { WebMercatorViewport } from 'viewport-mercator-project';
import type {
  Feature,
  ImmutableFeatureCollection,
  PointerMoveEvent,
  EditAction,
  Pick,
  ClickEvent,
  ScreenCoordinates
} from '@nebula.gl/edit-modes';

import { RENDER_STATE, MODES, GEOJSON_TYPE } from './constants';

export type Id = string | number;

export type Mode = $Keys<typeof MODES>;
export type RenderState = $Values<typeof RENDER_STATE>;
export type GeoJsonType = $Values<typeof GEOJSON_TYPE>;

// TODO extend from nebula
export type ModeProps<TData> = {
  // The data being edited, this can be an array or an object
  data: TData,

  // Additional configuration for this mode
  modeConfig: any,

  viewport: ?WebMercatorViewport,

  // The indexes of the selected features
  selectedIndexes: number[],

  // The cursor type, as a [CSS Cursor](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
  cursor: ?string,

  // The last pointer move event that occurred
  lastPointerMoveEvent: PointerMoveEvent,

  // Callback used to notify applications of an edit action
  onEdit: (editAction: EditAction<TData>) => void,

  // Callback used to update cursor
  onUpdateCursor: (cursor: ?string) => void
};

export type EditorProps = {
  mode: Mode,
  style: ?Object,
  features: ?(Feature[]),
  selectedFeatureIndex: ?number,
  clickRadius: number,
  featureShape: Function | string,
  editHandleShape: Function | string,
  editHandleStyle: Function | any,
  featureStyle: Function | any,
  onUpdate: Function,
  onSelect: Function
};

export type EditorState = {
  featureCollection: ?ImmutableFeatureCollection,

  selectedFeatureIndex: ?number,

  hovered: ?Pick,
  lastPointerMoveEvent: PointerMoveEvent,

  isDragging: boolean,
  didDrag: boolean,

  pointerDownPicks: ?(Pick[]),
  pointerDownScreenCoords: ?ScreenCoordinates,
  pointerDownMapCoords: ?Position
};

export type BaseEvent = ClickEvent;

export type SelectAction = {
  selectedFeature: ?Feature,
  selectedFeatureIndex?: ?number,
  selectedEditHandleIndex?: ?number,
  screenCoords: ?ScreenCoordinates,
  mapCoords: ?Position
};
