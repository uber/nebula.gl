// @flow
export type ScreenCoordinates = {
  x: number,
  y: number
};

export type Id = string | number;

export type RenderType = 'Point' | 'LineString' | 'Polygon' | 'Rectangle';

export type Operation = 'NONE' | 'SET' | 'INTERSECT' | 'INSERT';
