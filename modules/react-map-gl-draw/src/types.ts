import { WebMercatorViewport } from 'viewport-mercator-project';
import {
  ModeProps as BaseModeProps,
  Feature,
  ImmutableFeatureCollection,
  PointerMoveEvent,
  Pick,
  ClickEvent,
  ScreenCoordinates,
} from '@nebula.gl/edit-modes';

import { RENDER_STATE, GEOJSON_TYPE, RENDER_TYPE } from './constants';

export type Id = string | number;

export type RenderState = RENDER_STATE;
export type GeoJsonType = GEOJSON_TYPE;
export type RenderType = RENDER_TYPE;

export type SelectAction = {
  selectedFeature: Feature | null | undefined;
  selectedFeatureIndex?: number | null | undefined;
  selectedEditHandleIndex?: number | null | undefined;
  selectedEditHandleIndexes: number[];
  screenCoords: ScreenCoordinates | null | undefined;
  mapCoords: Position | null | undefined;
};

// TODO extend from nebula
export type ModeProps<TData> = BaseModeProps<TData> & {
  viewport: WebMercatorViewport | null | undefined;
  // Whether features are draggable in this mode
  featuresDraggable: boolean | null | undefined;
};

export type EditorProps = {
  mode?: Record<string, any>;
  style?: Record<string, any> | null | undefined;
  features?: Feature[] | null | undefined;
  selectedFeatureIndex?: number | null | undefined;
  selectable?: Boolean;
  clickRadius?: number;
  featureShape?: Function | string;
  editHandleShape?: Function | string;
  editHandleStyle?: Function | any;
  featureStyle?: Function | any;
  featuresDraggable?: boolean | null | undefined;
  onUpdate?: Function;
  onSelect?: Function;
  onUpdateCursor?: Function;
  modeConfig?: any;
};

export type EditorState = {
  featureCollection: ImmutableFeatureCollection | null | undefined;

  selectedFeatureIndex: number | null | undefined;
  selectedEditHandleIndexes: number[];

  hovered: Pick | null | undefined;
  lastPointerMoveEvent: PointerMoveEvent;

  isDragging: boolean;
  didDrag: boolean;

  pointerDownPicks: Pick[] | null | undefined;
  pointerDownScreenCoords: ScreenCoordinates | null | undefined;
  pointerDownMapCoords: Position | null | undefined;
};

export type BaseEvent = ClickEvent;
