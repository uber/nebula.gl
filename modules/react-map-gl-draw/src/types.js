// @flow
export type ScreenCoordinates = {
  x: number,
  y: number
};

export type Id = string | number;

// export type RenderState = 'selected' | 'hovered' | 'inactive' | 'uncommitted';

export type RenderType = 'Point' | 'LineString' | 'Polygon' | 'Rectangle';

export type Operation = 'NONE' | 'SET' | 'INTERSECT' | 'INSERT';
