import { WebMercatorViewport } from 'viewport-mercator-project';
import {
  ModeProps as BaseModeProps,
  Feature,
  ImmutableFeatureCollection,
  PointerMoveEvent,
  Pick,
  ClickEvent,
  ScreenCoordinates,
  Position,
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
  selectable?: boolean;
  clickRadius?: number;
  featureShape?: () => void | string;
  editHandleShape?: () => void | string;
  editHandleStyle?: () => void | any;
  featureStyle?: () => void | any;
  featuresDraggable?: boolean | null | undefined;
  onUpdate?: (any) => void;
  onSelect?: (selected: any) => void;
  onUpdateCursor?: () => void;
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
