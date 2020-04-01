// @flow

import type { WebMercatorViewport } from 'viewport-mercator-project';
import type {
  ModeProps as BaseModeProps,
  Feature,
  ImmutableFeatureCollection,
  PointerMoveEvent,
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
  ...BaseModeProps<TData>,

  viewport: ?WebMercatorViewport,

  // Whether features are draggable in this mode
  featuresDraggable: ?boolean
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
  featuresDraggable: ?boolean,
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
