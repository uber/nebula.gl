// @flow

export const GEOJSON_TYPE = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon'
};

export const RENDER_TYPE = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon',
  RECTANGLE: 'Rectangle'
};

export const RENDER_STATE = {
  INACTIVE: 'INACTIVE',
  UNCOMMITTED: 'UNCOMMITTED',
  SELECTED: 'SELECTED',
  HOVERED: 'HOVERED',
  CLOSING: 'CLOSING'
};

export const GUIDE_TYPE = {
  TENTATIVE: 'tentative',
  EDIT_HANDLE: 'editHandle',
  CURSOR_EDIT_HANDLE: 'cursorEditHandle'
};

export const ELEMENT_TYPE = {
  FEATURE: 'feature',
  FILL: 'fill',
  SEGMENT: 'segment',
  EDIT_HANDLE: 'editHandle'
};

export const EDIT_TYPE = {
  ADD_FEATURE: 'addFeature',
  ADD_POSITION: 'addPosition',
  REMOVE_POSITION: 'removePosition',
  MOVE_POSITION: 'movePosition',
  FINISH_MOVE_POSITION: 'finishMovePosition'
};
