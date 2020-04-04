export function toDeckColor(
  color?: [number, number, number, number] | null | undefined,
  defaultColor: [number, number, number, number] = [255, 0, 0, 255]
): [number, number, number, number] {
  if (!Array.isArray(color)) {
    return defaultColor;
  }
  return [color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255];
}

//
// a GeoJSON helper function that calls the provided function with
// an argument that is the most deeply-nested array having elements
// that are arrays of primitives as an argument, e.g.
//
// {
//   "type": "MultiPolygon",
//   "coordinates": [
//       [
//           [[30, 20], [45, 40], [10, 40], [30, 20]]
//       ],
//       [
//           [[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
//       ]
//   ]
// }
//
// the function would be called on:
//
// [[30, 20], [45, 40], [10, 40], [30, 20]]
//
// and
//
// [[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
//
export function recursivelyTraverseNestedArrays(
  array: Array<any>,
  prefix: Array<number>,
  fn: Function
) {
  if (!Array.isArray(array[0])) {
    return true;
  }
  for (let i = 0; i < array.length; i++) {
    if (recursivelyTraverseNestedArrays(array[i], [...prefix, i], fn)) {
      fn(array, prefix);
      break;
    }
  }
  return false;
}
