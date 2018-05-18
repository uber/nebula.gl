// @flow

export function toDeckColor(color: number[], defaultColor: number[] = [255, 0, 0, 255]): number[] {
  if (Array.isArray(color)) {
    return color.map(component => component * 255);
  }
  return defaultColor;
}
