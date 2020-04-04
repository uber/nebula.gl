import { RENDER_STATE, RENDER_TYPE } from './constants';

const RECT_STYLE = {
  stroke: '#7ac943',
  strokeWidth: 2,
  x: -6,
  y: -6,
  height: 12,
  width: 12,
};

const CIRCLE_RADIUS = 8;

const SELECTED_STYLE = {
  stroke: '#7ac943',
  strokeWidth: 2,
  fill: '#ffff00',
  fillOpacity: 0.7,
};

const HOVERED_STYLE = {
  stroke: '#7ac943',
  strokeWidth: 2,
  fill: '#7ac943',
  fillOpacity: 0.5,
};

const UNCOMMITTED_STYLE = {
  stroke: '#a7a7a7',
  strokeWidth: 2,
  fill: '#a9a9a9',
  fillOpacity: 0.3,
};

const INACTIVE_STYLE = UNCOMMITTED_STYLE;

const DEFAULT_STYLE = {
  stroke: '#000000',
  strokeWidth: 2,
  fill: '#a9a9a9',
  fillOpacity: 0.1,
};

export function featureStyle({ feature, state }) {
  const renderType = feature.properties.renderType;
  let style = null;

  switch (state) {
    case RENDER_STATE.SELECTED:
      style = { ...SELECTED_STYLE };
      break;

    case RENDER_STATE.HOVERED:
      style = { ...HOVERED_STYLE };
      break;

    case RENDER_STATE.UNCOMMITTED:
    case RENDER_STATE.CLOSING:
      style = { ...UNCOMMITTED_STYLE };
      break;

    case RENDER_STATE.INACTIVE:
      style = { ...INACTIVE_STYLE };
      break;

    default:
      style = { ...DEFAULT_STYLE };
  }

  switch (renderType) {
    case RENDER_TYPE.POINT:
      style.r = CIRCLE_RADIUS;
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

export function editHandleStyle({ feature, shape, index, state }) {
  let style = {};
  switch (state) {
    case RENDER_STATE.SELECTED:
      style = { ...SELECTED_STYLE };
      break;

    case RENDER_STATE.HOVERED:
      style = { ...HOVERED_STYLE };
      break;

    case RENDER_STATE.UNCOMMITTED:
    case RENDER_STATE.CLOSING:
      style = { ...UNCOMMITTED_STYLE };
      break;

    case RENDER_STATE.INACTIVE:
      style = { ...INACTIVE_STYLE };
      break;

    default:
      style = { ...DEFAULT_STYLE };
  }

  switch (shape) {
    case 'circle':
      //@ts-ignore
      style.r = CIRCLE_RADIUS;
      break;
    case 'rect':
      style = { ...style, ...RECT_STYLE };
      break;
    default:
  }

  return style;
}
