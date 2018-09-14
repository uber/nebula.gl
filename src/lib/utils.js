// @flow

export function toDeckColor(
  color?: ?[number, number, number, number],
  defaultColor: [number, number, number, number] = [255, 0, 0, 255]
): [number, number, number, number] {
  if (!Array.isArray(color)) {
    return defaultColor;
  }
  return [color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255];
}
