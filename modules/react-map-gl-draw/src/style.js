import { RENDER_STATE, RENDER_TYPE } from './constants';

const RECT_STYLE = {
  x: -6,
  y: -6,
  height: 12,
  width: 12
};

const CLOSING_RECT_STYLE = {
  x: -10,
  y: -10,
  height: 20,
  width: 20
};

const DEFAULT_STROKE_WIDTH = 2;
const HIGHLIGHTED_STROKE_WIDTH = 4;
const DEFAULT_RADIUS = 8;

export const HIDDEN_CLICKABLE_STYLE = {
  fill: '#000',
  opacity: 0
};

export function getFeatureStyle({ feature, state }) {
  const style = {
    stroke:
      state === RENDER_STATE.SELECTED || state === RENDER_STATE.HOVERED
        ? '#7ac943'
        : state === RENDER_STATE.UNCOMMITTED || state === RENDER_STATE.CLOSING
          ? '#a9a9a9'
          : '#000',
    strokeWidth: DEFAULT_STROKE_WIDTH,
    fill:
      state === RENDER_STATE.INACTIVE
        ? '#333333'
        : state === RENDER_STATE.HOVERED
          ? '#7ac943'
          : state === RENDER_STATE.SELECTED
            ? '#ffff00'
            : state === RENDER_STATE.UNCOMMITTED || state === RENDER_STATE.CLOSING
              ? '#a9a9a9'
              : '#000000',
    fillOpacity:
      state === RENDER_STATE.INACTIVE
        ? 0.1
        : state === RENDER_STATE.SELECTED
          ? 0.7
          : state === RENDER_STATE.HOVERED
            ? 0.5
            : state === RENDER_STATE.UNCOMMITTED || state === RENDER_STATE.CLOSING
              ? 0.3
              : 1
  };

  const renderType = feature.properties ? feature.properties.renderType : feature.renderType;

  switch (renderType) {
    case RENDER_TYPE.POINT:
      style.r = DEFAULT_RADIUS;
      break;
    case RENDER_TYPE.LINE_STRING:
      style.fill = 'none';
      break;
    case RENDER_TYPE.POLYGON:
      if (state === RENDER_STATE.CLOSING) {
        style.strokeDasharray = '4,2';
      }
      break;
    case RENDER_TYPE.RECTANGLE:
      if (state === RENDER_STATE.UNCOMMITTED) {
        style.strokeDasharray = '4,2';
      }
      break;
    default:
  }

  return style;
}

export function getEditHandleStyle({ feature, index, state }) {
  const style = {
    fill:
      state === RENDER_STATE.INACTIVE
        ? '#ffffff'
        : state === RENDER_STATE.SELECTED || state === RENDER_STATE.CLOSING
          ? '#ffff00'
          : state === RENDER_STATE.HOVERED
            ? '#7ac943'
            : state === RENDER_STATE.UNCOMMITTED
              ? '#a9a9a9'
              : '#000000',
    fillOpacity:
      state === RENDER_STATE.INACTIVE
        ? 1
        : state === RENDER_STATE.HOVERED
          ? 1
          : state === RENDER_STATE.SELECTED || state === RENDER_STATE.CLOSING
            ? 0.8
            : state === RENDER_STATE.UNCOMMITTED
              ? 0.3
              : 1,
    stroke:
      state === RENDER_STATE.SELECTED ||
      state === RENDER_STATE.HOVERED ||
      state === RENDER_STATE.CLOSING
        ? '#7ac943'
        : '#000',
    strokeWidth:
      state === RENDER_STATE.SELECTED || state === RENDER_STATE.CLOSING
        ? HIGHLIGHTED_STROKE_WIDTH
        : DEFAULT_STROKE_WIDTH,
    r: DEFAULT_RADIUS
  };

  const renderType = feature.properties ? feature.properties.renderType : feature.renderType;

  switch (renderType) {
    case RENDER_TYPE.POINT:
      style.fill =
        state === RENDER_STATE.INACTIVE
          ? '#333333'
          : state === RENDER_STATE.SELECTED
            ? '#ffff00'
            : state === RENDER_STATE.HOVERED
              ? '#7ac943'
              : state === RENDER_STATE.UNCOMMITTED
                ? 'none'
                : '#000000';
      style.stroke =
        state === RENDER_STATE.SELECTED
          ? '#7ac943'
          : state === RENDER_STATE.UNCOMMITTED
            ? 'none'
            : '#000';
      break;
    case RENDER_TYPE.LINE_STRING:
    case RENDER_TYPE.POLYGON:
    case RENDER_TYPE.RECTANGLE:
      if (state === RENDER_STATE.CLOSING) {
        Object.assign(style, CLOSING_RECT_STYLE);
      } else {
        Object.assign(style, RECT_STYLE);
      }
      break;
    default:
  }

  return style;
}
