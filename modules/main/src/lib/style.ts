// Describes the arrow style of polylines
export const ArrowStyles = {
  NONE: 0,
  FORWARD: 1,
  BACKWARD: 2,
  BOTH: 3,
};

export const DEFAULT_ARROWS = 1;
export const MAX_ARROWS = 3;

export const DEFAULT_STYLE = {
  arrowColor: [0, 0, 0, 1],
  arrowCount: DEFAULT_ARROWS,
  arrowStyle: ArrowStyles.NONE,
  fillColor: [0, 0, 0, 1],
  lineColor: [0, 0, 0, 1],
  lineWidthMeters: 5,
  outlineRadiusMeters: 0,
  opacity: 1,
  zLevel: 0,
};
