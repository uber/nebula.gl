// @flow

export type LayerMouseEventResult = {
  eventConsumed?: boolean,
  eventSoftConsumed?: boolean,
  mousePointer?: ?string,
  shouldRedraw?: boolean | string[]
};

// [red, green, blue, alpha] in premultiplied alpha format
export type Color = [number, number, number, number];

export type Style = {
  fillColor?: Color,
  lineColor?: Color,
  lineWidthMeters?: number,
  pointRadiusMeters?: number,
  outlineRadiusMeters?: number,
  outlineColor?: Color,
  mousePriority?: number,
  arrowColor?: Color,
  arrowStyle?: number,
  arrowCount?: number,
  iconNumber?: number,
  text?: string,
  tooltip?: string,
  zLevel?: number
};

export type Viewport = {
  width: number,
  height: number,
  longitude: number,
  latitude: number,
  zoom: number,
  isDragging?: boolean,
  isMoving?: boolean,
  bearing?: number,
  pitch?: number
};

export type GeoJsonGeometry = {
  type: string,
  coordinates: Array<any>
};

export type GeoJsonFeature = {
  // type: 'Feature',
  type: string,
  properties: Object,
  geometry: GeoJsonGeometry
};

export type GeoJsonFeatureCollection = {
  // type: 'FeatureCollection',
  type: string,
  features: GeoJsonFeature[]
};
