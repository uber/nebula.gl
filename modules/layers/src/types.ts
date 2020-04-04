// [red, green, blue, alpha] in premultiplied alpha format
export type Color = [number, number, number, number];

export type Viewport = {
  width: number;
  height: number;
  longitude: number;
  latitude: number;
  zoom: number;
  isDragging?: boolean;
  isMoving?: boolean;
  bearing?: number;
  pitch?: number;
};
