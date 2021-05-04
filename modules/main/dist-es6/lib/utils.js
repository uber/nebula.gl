"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDeckColor = toDeckColor;
exports.recursivelyTraverseNestedArrays = recursivelyTraverseNestedArrays;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function toDeckColor(color) {
  var defaultColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [255, 0, 0, 255];

  if (!Array.isArray(color)) {
    return defaultColor;
  }

  return [color[0] * 255, color[1] * 255, color[2] * 255, color[3] * 255];
} //
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


function recursivelyTraverseNestedArrays(array, prefix, fn) {
  if (!Array.isArray(array[0])) {
    return true;
  }

  for (var i = 0; i < array.length; i++) {
    if (recursivelyTraverseNestedArrays(array[i], [].concat(_toConsumableArray(prefix), [i]), fn)) {
      fn(array, prefix);
      break;
    }
  }

  return false;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdXRpbHMudHMiXSwibmFtZXMiOlsidG9EZWNrQ29sb3IiLCJjb2xvciIsImRlZmF1bHRDb2xvciIsIkFycmF5IiwiaXNBcnJheSIsInJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMiLCJhcnJheSIsInByZWZpeCIsImZuIiwiaSIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTyxTQUFTQSxXQUFULENBQ0xDLEtBREssRUFHNkI7QUFBQSxNQURsQ0MsWUFDa0MsdUVBRGUsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLENBQVQsRUFBWSxHQUFaLENBQ2Y7O0FBQ2xDLE1BQUksQ0FBQ0MsS0FBSyxDQUFDQyxPQUFOLENBQWNILEtBQWQsQ0FBTCxFQUEyQjtBQUN6QixXQUFPQyxZQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxDQUFDRCxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVcsR0FBWixFQUFpQkEsS0FBSyxDQUFDLENBQUQsQ0FBTCxHQUFXLEdBQTVCLEVBQWlDQSxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVcsR0FBNUMsRUFBaURBLEtBQUssQ0FBQyxDQUFELENBQUwsR0FBVyxHQUE1RCxDQUFQO0FBQ0QsQyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTSSwrQkFBVCxDQUNMQyxLQURLLEVBRUxDLE1BRkssRUFHTEMsRUFISyxFQUlMO0FBQ0EsTUFBSSxDQUFDTCxLQUFLLENBQUNDLE9BQU4sQ0FBY0UsS0FBSyxDQUFDLENBQUQsQ0FBbkIsQ0FBTCxFQUE4QjtBQUM1QixXQUFPLElBQVA7QUFDRDs7QUFDRCxPQUFLLElBQUlHLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdILEtBQUssQ0FBQ0ksTUFBMUIsRUFBa0NELENBQUMsRUFBbkMsRUFBdUM7QUFDckMsUUFBSUosK0JBQStCLENBQUNDLEtBQUssQ0FBQ0csQ0FBRCxDQUFOLCtCQUFlRixNQUFmLElBQXVCRSxDQUF2QixJQUEyQkQsRUFBM0IsQ0FBbkMsRUFBbUU7QUFDakVBLE1BQUFBLEVBQUUsQ0FBQ0YsS0FBRCxFQUFRQyxNQUFSLENBQUY7QUFDQTtBQUNEO0FBQ0Y7O0FBQ0QsU0FBTyxLQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gdG9EZWNrQ29sb3IoXG4gIGNvbG9yPzogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gfCBudWxsIHwgdW5kZWZpbmVkLFxuICBkZWZhdWx0Q29sb3I6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzI1NSwgMCwgMCwgMjU1XVxuKTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29sb3IpKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb2xvcjtcbiAgfVxuICByZXR1cm4gW2NvbG9yWzBdICogMjU1LCBjb2xvclsxXSAqIDI1NSwgY29sb3JbMl0gKiAyNTUsIGNvbG9yWzNdICogMjU1XTtcbn1cblxuLy9cbi8vIGEgR2VvSlNPTiBoZWxwZXIgZnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gd2l0aFxuLy8gYW4gYXJndW1lbnQgdGhhdCBpcyB0aGUgbW9zdCBkZWVwbHktbmVzdGVkIGFycmF5IGhhdmluZyBlbGVtZW50c1xuLy8gdGhhdCBhcmUgYXJyYXlzIG9mIHByaW1pdGl2ZXMgYXMgYW4gYXJndW1lbnQsIGUuZy5cbi8vXG4vLyB7XG4vLyAgIFwidHlwZVwiOiBcIk11bHRpUG9seWdvblwiLFxuLy8gICBcImNvb3JkaW5hdGVzXCI6IFtcbi8vICAgICAgIFtcbi8vICAgICAgICAgICBbWzMwLCAyMF0sIFs0NSwgNDBdLCBbMTAsIDQwXSwgWzMwLCAyMF1dXG4vLyAgICAgICBdLFxuLy8gICAgICAgW1xuLy8gICAgICAgICAgIFtbMTUsIDVdLCBbNDAsIDEwXSwgWzEwLCAyMF0sIFs1LCAxMF0sIFsxNSwgNV1dXG4vLyAgICAgICBdXG4vLyAgIF1cbi8vIH1cbi8vXG4vLyB0aGUgZnVuY3Rpb24gd291bGQgYmUgY2FsbGVkIG9uOlxuLy9cbi8vIFtbMzAsIDIwXSwgWzQ1LCA0MF0sIFsxMCwgNDBdLCBbMzAsIDIwXV1cbi8vXG4vLyBhbmRcbi8vXG4vLyBbWzE1LCA1XSwgWzQwLCAxMF0sIFsxMCwgMjBdLCBbNSwgMTBdLCBbMTUsIDVdXVxuLy9cbmV4cG9ydCBmdW5jdGlvbiByZWN1cnNpdmVseVRyYXZlcnNlTmVzdGVkQXJyYXlzKFxuICBhcnJheTogQXJyYXk8YW55PixcbiAgcHJlZml4OiBBcnJheTxudW1iZXI+LFxuICBmbjogRnVuY3Rpb25cbikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlbMF0pKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChyZWN1cnNpdmVseVRyYXZlcnNlTmVzdGVkQXJyYXlzKGFycmF5W2ldLCBbLi4ucHJlZml4LCBpXSwgZm4pKSB7XG4gICAgICBmbihhcnJheSwgcHJlZml4KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4iXX0=