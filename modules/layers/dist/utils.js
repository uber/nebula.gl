"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDeckColor = toDeckColor;
exports.recursivelyTraverseNestedArrays = recursivelyTraverseNestedArrays;
exports.generatePointsParallelToLinePoints = generatePointsParallelToLinePoints;
exports.distance2d = distance2d;
exports.mix = mix;
exports.nearestPointOnProjectedLine = nearestPointOnProjectedLine;

var _destination = _interopRequireDefault(require("@turf/destination"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _pointToLineDistance = _interopRequireDefault(require("@turf/point-to-line-distance"));

var _helpers = require("@turf/helpers");

var _viewportMercatorProject = _interopRequireDefault(require("viewport-mercator-project"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

function generatePointsParallelToLinePoints(p1, p2, groundCoords) {
  var lineString = {
    type: 'LineString',
    coordinates: [p1, p2]
  };
  var pt = (0, _helpers.point)(groundCoords);
  var ddistance = (0, _pointToLineDistance["default"])(pt, lineString);
  var lineBearing = (0, _bearing["default"])(p1, p2); // Check if current point is to the left or right of line
  // Line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
  // then (x−x1)(y2−y1)−(y−y1)(x2−x1)

  var isPointToLeftOfLine = (groundCoords[0] - p1[0]) * (p2[1] - p1[1]) - (groundCoords[1] - p1[1]) * (p2[0] - p1[0]); // Bearing to draw perpendicular to the line string

  var orthogonalBearing = isPointToLeftOfLine < 0 ? lineBearing - 90 : lineBearing - 270; // Get coordinates for the point p3 and p4 which are perpendicular to the lineString
  // Add the distance as the current position moves away from the lineString

  var p3 = (0, _destination["default"])(p2, ddistance, orthogonalBearing);
  var p4 = (0, _destination["default"])(p1, ddistance, orthogonalBearing); //@ts-ignore

  return [p3.geometry.coordinates, p4.geometry.coordinates];
}

function distance2d(x1, y1, x2, y2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function mix(a, b, ratio) {
  return b * ratio + a * (1 - ratio);
}

function nearestPointOnProjectedLine(line, inPoint, viewport) {
  var wmViewport = new _viewportMercatorProject["default"](viewport); // Project the line to viewport, then find the nearest point

  var coordinates = line.geometry.coordinates;
  var projectedCoords = coordinates.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 3),
        x = _ref2[0],
        y = _ref2[1],
        _ref2$ = _ref2[2],
        z = _ref2$ === void 0 ? 0 : _ref2$;

    return wmViewport.project([x, y, z]);
  }); //@ts-ignore

  var _wmViewport$project = wmViewport.project(inPoint.geometry.coordinates),
      _wmViewport$project2 = _slicedToArray(_wmViewport$project, 2),
      x = _wmViewport$project2[0],
      y = _wmViewport$project2[1]; // console.log('projectedCoords', JSON.stringify(projectedCoords));


  var minDistance = Infinity;
  var minPointInfo = {};
  projectedCoords.forEach(function (_ref3, index) {
    var _ref4 = _slicedToArray(_ref3, 2),
        x2 = _ref4[0],
        y2 = _ref4[1];

    if (index === 0) {
      return;
    }

    var _projectedCoords = _slicedToArray(projectedCoords[index - 1], 2),
        x1 = _projectedCoords[0],
        y1 = _projectedCoords[1]; // line from projectedCoords[index - 1] to projectedCoords[index]
    // convert to Ax + By + C = 0


    var A = y1 - y2;
    var B = x2 - x1;
    var C = x1 * y2 - x2 * y1; // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line

    var div = A * A + B * B;
    var distance = Math.abs(A * x + B * y + C) / Math.sqrt(div); // TODO: Check if inside bounds

    if (distance < minDistance) {
      minDistance = distance;
      minPointInfo = {
        index: index,
        x0: (B * (B * x - A * y) - A * C) / div,
        y0: (A * (-B * x + A * y) - B * C) / div
      };
    }
  }); //@ts-ignore

  var _minPointInfo = minPointInfo,
      index = _minPointInfo.index,
      x0 = _minPointInfo.x0,
      y0 = _minPointInfo.y0;

  var _projectedCoords2 = _slicedToArray(projectedCoords[index - 1], 3),
      x1 = _projectedCoords2[0],
      y1 = _projectedCoords2[1],
      _projectedCoords2$ = _projectedCoords2[2],
      z1 = _projectedCoords2$ === void 0 ? 0 : _projectedCoords2$;

  var _projectedCoords$inde = _slicedToArray(projectedCoords[index], 3),
      x2 = _projectedCoords$inde[0],
      y2 = _projectedCoords$inde[1],
      _projectedCoords$inde2 = _projectedCoords$inde[2],
      z2 = _projectedCoords$inde2 === void 0 ? 0 : _projectedCoords$inde2; // calculate what ratio of the line we are on to find the proper z


  var lineLength = distance2d(x1, y1, x2, y2);
  var startToPointLength = distance2d(x1, y1, x0, y0);
  var ratio = startToPointLength / lineLength;
  var z0 = mix(z1, z2, ratio);
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: wmViewport.unproject([x0, y0, z0])
    },
    properties: {
      // TODO: calculate the distance in proper units
      dist: minDistance,
      index: index - 1
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6WyJ0b0RlY2tDb2xvciIsImNvbG9yIiwiZGVmYXVsdENvbG9yIiwiQXJyYXkiLCJpc0FycmF5IiwicmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyIsImFycmF5IiwicHJlZml4IiwiZm4iLCJpIiwibGVuZ3RoIiwiZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyIsInAxIiwicDIiLCJncm91bmRDb29yZHMiLCJsaW5lU3RyaW5nIiwidHlwZSIsImNvb3JkaW5hdGVzIiwicHQiLCJkZGlzdGFuY2UiLCJsaW5lQmVhcmluZyIsImlzUG9pbnRUb0xlZnRPZkxpbmUiLCJvcnRob2dvbmFsQmVhcmluZyIsInAzIiwicDQiLCJnZW9tZXRyeSIsImRpc3RhbmNlMmQiLCJ4MSIsInkxIiwieDIiLCJ5MiIsImR4IiwiZHkiLCJNYXRoIiwic3FydCIsIm1peCIsImEiLCJiIiwicmF0aW8iLCJuZWFyZXN0UG9pbnRPblByb2plY3RlZExpbmUiLCJsaW5lIiwiaW5Qb2ludCIsInZpZXdwb3J0Iiwid21WaWV3cG9ydCIsIldlYk1lcmNhdG9yVmlld3BvcnQiLCJwcm9qZWN0ZWRDb29yZHMiLCJtYXAiLCJ4IiwieSIsInoiLCJwcm9qZWN0IiwibWluRGlzdGFuY2UiLCJJbmZpbml0eSIsIm1pblBvaW50SW5mbyIsImZvckVhY2giLCJpbmRleCIsIkEiLCJCIiwiQyIsImRpdiIsImRpc3RhbmNlIiwiYWJzIiwieDAiLCJ5MCIsInoxIiwiejIiLCJsaW5lTGVuZ3RoIiwic3RhcnRUb1BvaW50TGVuZ3RoIiwiejAiLCJ1bnByb2plY3QiLCJwcm9wZXJ0aWVzIiwiZGlzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1PLFNBQVNBLFdBQVQsQ0FDTEMsS0FESyxFQUc2QjtBQUFBLE1BRGxDQyxZQUNrQyx1RUFE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QUFyQjtBQUZMLEtBRkw7QUFNTEUsSUFBQUEsVUFBVSxFQUFFO0FBQ1Y7QUFDQUMsTUFBQUEsSUFBSSxFQUFFcEIsV0FGSTtBQUdWSSxNQUFBQSxLQUFLLEVBQUVBLEtBQUssR0FBRztBQUhMO0FBTlAsR0FBUDtBQVlEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlc3RpbmF0aW9uIGZyb20gJ0B0dXJmL2Rlc3RpbmF0aW9uJztcbmltcG9ydCBiZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IHBvaW50VG9MaW5lRGlzdGFuY2UgZnJvbSAnQHR1cmYvcG9pbnQtdG8tbGluZS1kaXN0YW5jZSc7XG5pbXBvcnQgeyBwb2ludCB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHtcbiAgUG9zaXRpb24sXG4gIFBvaW50LFxuICBMaW5lU3RyaW5nLFxuICBGZWF0dXJlT2YsXG4gIEZlYXR1cmVXaXRoUHJvcHMsXG4gIFZpZXdwb3J0LFxufSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IFdlYk1lcmNhdG9yVmlld3BvcnQgZnJvbSAndmlld3BvcnQtbWVyY2F0b3ItcHJvamVjdCc7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGFuZCB1c2UgZWRpdC1tb2Rlcy91dGlscyBpbnN0ZWFkXG5cbmV4cG9ydCB0eXBlIE5lYXJlc3RQb2ludFR5cGUgPSBGZWF0dXJlV2l0aFByb3BzPFBvaW50LCB7IGRpc3Q6IG51bWJlcjsgaW5kZXg6IG51bWJlciB9PjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvRGVja0NvbG9yKFxuICBjb2xvcj86IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdIHwgbnVtYmVyLFxuICBkZWZhdWx0Q29sb3I6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzI1NSwgMCwgMCwgMjU1XVxuKTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoY29sb3IpKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb2xvcjtcbiAgfVxuICByZXR1cm4gW2NvbG9yWzBdICogMjU1LCBjb2xvclsxXSAqIDI1NSwgY29sb3JbMl0gKiAyNTUsIGNvbG9yWzNdICogMjU1XTtcbn1cblxuLy9cbi8vIGEgR2VvSlNPTiBoZWxwZXIgZnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gd2l0aFxuLy8gYW4gYXJndW1lbnQgdGhhdCBpcyB0aGUgbW9zdCBkZWVwbHktbmVzdGVkIGFycmF5IGhhdmluZyBlbGVtZW50c1xuLy8gdGhhdCBhcmUgYXJyYXlzIG9mIHByaW1pdGl2ZXMgYXMgYW4gYXJndW1lbnQsIGUuZy5cbi8vXG4vLyB7XG4vLyAgIFwidHlwZVwiOiBcIk11bHRpUG9seWdvblwiLFxuLy8gICBcImNvb3JkaW5hdGVzXCI6IFtcbi8vICAgICAgIFtcbi8vICAgICAgICAgICBbWzMwLCAyMF0sIFs0NSwgNDBdLCBbMTAsIDQwXSwgWzMwLCAyMF1dXG4vLyAgICAgICBdLFxuLy8gICAgICAgW1xuLy8gICAgICAgICAgIFtbMTUsIDVdLCBbNDAsIDEwXSwgWzEwLCAyMF0sIFs1LCAxMF0sIFsxNSwgNV1dXG4vLyAgICAgICBdXG4vLyAgIF1cbi8vIH1cbi8vXG4vLyB0aGUgZnVuY3Rpb24gd291bGQgYmUgY2FsbGVkIG9uOlxuLy9cbi8vIFtbMzAsIDIwXSwgWzQ1LCA0MF0sIFsxMCwgNDBdLCBbMzAsIDIwXV1cbi8vXG4vLyBhbmRcbi8vXG4vLyBbWzE1LCA1XSwgWzQwLCAxMF0sIFsxMCwgMjBdLCBbNSwgMTBdLCBbMTUsIDVdXVxuLy9cbmV4cG9ydCBmdW5jdGlvbiByZWN1cnNpdmVseVRyYXZlcnNlTmVzdGVkQXJyYXlzKFxuICBhcnJheTogQXJyYXk8YW55PixcbiAgcHJlZml4OiBBcnJheTxudW1iZXI+LFxuICBmbjogRnVuY3Rpb25cbikge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXlbMF0pKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChyZWN1cnNpdmVseVRyYXZlcnNlTmVzdGVkQXJyYXlzKGFycmF5W2ldLCBbLi4ucHJlZml4LCBpXSwgZm4pKSB7XG4gICAgICBmbihhcnJheSwgcHJlZml4KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKFxuICBwMTogUG9zaXRpb24sXG4gIHAyOiBQb3NpdGlvbixcbiAgZ3JvdW5kQ29vcmRzOiBQb3NpdGlvblxuKTogUG9zaXRpb25bXSB7XG4gIGNvbnN0IGxpbmVTdHJpbmc6IExpbmVTdHJpbmcgPSB7XG4gICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgIGNvb3JkaW5hdGVzOiBbcDEsIHAyXSxcbiAgfTtcbiAgY29uc3QgcHQgPSBwb2ludChncm91bmRDb29yZHMpO1xuICBjb25zdCBkZGlzdGFuY2UgPSBwb2ludFRvTGluZURpc3RhbmNlKHB0LCBsaW5lU3RyaW5nKTtcbiAgY29uc3QgbGluZUJlYXJpbmcgPSBiZWFyaW5nKHAxLCBwMik7XG5cbiAgLy8gQ2hlY2sgaWYgY3VycmVudCBwb2ludCBpcyB0byB0aGUgbGVmdCBvciByaWdodCBvZiBsaW5lXG4gIC8vIExpbmUgZnJvbSBBPSh4MSx5MSkgdG8gQj0oeDIseTIpIGEgcG9pbnQgUD0oeCx5KVxuICAvLyB0aGVuICh44oiSeDEpKHky4oiSeTEp4oiSKHniiJJ5MSkoeDLiiJJ4MSlcbiAgY29uc3QgaXNQb2ludFRvTGVmdE9mTGluZSA9XG4gICAgKGdyb3VuZENvb3Jkc1swXSAtIHAxWzBdKSAqIChwMlsxXSAtIHAxWzFdKSAtIChncm91bmRDb29yZHNbMV0gLSBwMVsxXSkgKiAocDJbMF0gLSBwMVswXSk7XG5cbiAgLy8gQmVhcmluZyB0byBkcmF3IHBlcnBlbmRpY3VsYXIgdG8gdGhlIGxpbmUgc3RyaW5nXG4gIGNvbnN0IG9ydGhvZ29uYWxCZWFyaW5nID0gaXNQb2ludFRvTGVmdE9mTGluZSA8IDAgPyBsaW5lQmVhcmluZyAtIDkwIDogbGluZUJlYXJpbmcgLSAyNzA7XG5cbiAgLy8gR2V0IGNvb3JkaW5hdGVzIGZvciB0aGUgcG9pbnQgcDMgYW5kIHA0IHdoaWNoIGFyZSBwZXJwZW5kaWN1bGFyIHRvIHRoZSBsaW5lU3RyaW5nXG4gIC8vIEFkZCB0aGUgZGlzdGFuY2UgYXMgdGhlIGN1cnJlbnQgcG9zaXRpb24gbW92ZXMgYXdheSBmcm9tIHRoZSBsaW5lU3RyaW5nXG4gIGNvbnN0IHAzID0gZGVzdGluYXRpb24ocDIsIGRkaXN0YW5jZSwgb3J0aG9nb25hbEJlYXJpbmcpO1xuICBjb25zdCBwNCA9IGRlc3RpbmF0aW9uKHAxLCBkZGlzdGFuY2UsIG9ydGhvZ29uYWxCZWFyaW5nKTtcbiAgLy9AdHMtaWdub3JlXG4gIHJldHVybiBbcDMuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsIHA0Lmdlb21ldHJ5LmNvb3JkaW5hdGVzXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3RhbmNlMmQoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IGR4ID0geDEgLSB4MjtcbiAgY29uc3QgZHkgPSB5MSAtIHkyO1xuICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1peChhOiBudW1iZXIsIGI6IG51bWJlciwgcmF0aW86IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBiICogcmF0aW8gKyBhICogKDEgLSByYXRpbyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZWFyZXN0UG9pbnRPblByb2plY3RlZExpbmUoXG4gIGxpbmU6IEZlYXR1cmVPZjxMaW5lU3RyaW5nPixcbiAgaW5Qb2ludDogRmVhdHVyZU9mPFBvaW50PixcbiAgdmlld3BvcnQ6IFZpZXdwb3J0XG4pOiBOZWFyZXN0UG9pbnRUeXBlIHtcbiAgY29uc3Qgd21WaWV3cG9ydCA9IG5ldyBXZWJNZXJjYXRvclZpZXdwb3J0KHZpZXdwb3J0KTtcbiAgLy8gUHJvamVjdCB0aGUgbGluZSB0byB2aWV3cG9ydCwgdGhlbiBmaW5kIHRoZSBuZWFyZXN0IHBvaW50XG4gIGNvbnN0IGNvb3JkaW5hdGVzOiBBcnJheTxBcnJheTxudW1iZXI+PiA9IGxpbmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMgYXMgYW55O1xuICBjb25zdCBwcm9qZWN0ZWRDb29yZHMgPSBjb29yZGluYXRlcy5tYXAoKFt4LCB5LCB6ID0gMF0pID0+IHdtVmlld3BvcnQucHJvamVjdChbeCwgeSwgel0pKTtcbiAgLy9AdHMtaWdub3JlXG4gIGNvbnN0IFt4LCB5XSA9IHdtVmlld3BvcnQucHJvamVjdChpblBvaW50Lmdlb21ldHJ5LmNvb3JkaW5hdGVzKTtcbiAgLy8gY29uc29sZS5sb2coJ3Byb2plY3RlZENvb3JkcycsIEpTT04uc3RyaW5naWZ5KHByb2plY3RlZENvb3JkcykpO1xuXG4gIGxldCBtaW5EaXN0YW5jZSA9IEluZmluaXR5O1xuICBsZXQgbWluUG9pbnRJbmZvID0ge307XG5cbiAgcHJvamVjdGVkQ29vcmRzLmZvckVhY2goKFt4MiwgeTJdLCBpbmRleCkgPT4ge1xuICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IFt4MSwgeTFdID0gcHJvamVjdGVkQ29vcmRzW2luZGV4IC0gMV07XG5cbiAgICAvLyBsaW5lIGZyb20gcHJvamVjdGVkQ29vcmRzW2luZGV4IC0gMV0gdG8gcHJvamVjdGVkQ29vcmRzW2luZGV4XVxuICAgIC8vIGNvbnZlcnQgdG8gQXggKyBCeSArIEMgPSAwXG4gICAgY29uc3QgQSA9IHkxIC0geTI7XG4gICAgY29uc3QgQiA9IHgyIC0geDE7XG4gICAgY29uc3QgQyA9IHgxICogeTIgLSB4MiAqIHkxO1xuXG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRGlzdGFuY2VfZnJvbV9hX3BvaW50X3RvX2FfbGluZVxuICAgIGNvbnN0IGRpdiA9IEEgKiBBICsgQiAqIEI7XG4gICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLmFicyhBICogeCArIEIgKiB5ICsgQykgLyBNYXRoLnNxcnQoZGl2KTtcblxuICAgIC8vIFRPRE86IENoZWNrIGlmIGluc2lkZSBib3VuZHNcblxuICAgIGlmIChkaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XG4gICAgICBtaW5EaXN0YW5jZSA9IGRpc3RhbmNlO1xuICAgICAgbWluUG9pbnRJbmZvID0ge1xuICAgICAgICBpbmRleCxcbiAgICAgICAgeDA6IChCICogKEIgKiB4IC0gQSAqIHkpIC0gQSAqIEMpIC8gZGl2LFxuICAgICAgICB5MDogKEEgKiAoLUIgKiB4ICsgQSAqIHkpIC0gQiAqIEMpIC8gZGl2LFxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICAvL0B0cy1pZ25vcmVcbiAgY29uc3QgeyBpbmRleCwgeDAsIHkwIH0gPSBtaW5Qb2ludEluZm87XG4gIGNvbnN0IFt4MSwgeTEsIHoxID0gMF0gPSBwcm9qZWN0ZWRDb29yZHNbaW5kZXggLSAxXTtcbiAgY29uc3QgW3gyLCB5MiwgejIgPSAwXSA9IHByb2plY3RlZENvb3Jkc1tpbmRleF07XG5cbiAgLy8gY2FsY3VsYXRlIHdoYXQgcmF0aW8gb2YgdGhlIGxpbmUgd2UgYXJlIG9uIHRvIGZpbmQgdGhlIHByb3BlciB6XG4gIGNvbnN0IGxpbmVMZW5ndGggPSBkaXN0YW5jZTJkKHgxLCB5MSwgeDIsIHkyKTtcbiAgY29uc3Qgc3RhcnRUb1BvaW50TGVuZ3RoID0gZGlzdGFuY2UyZCh4MSwgeTEsIHgwLCB5MCk7XG4gIGNvbnN0IHJhdGlvID0gc3RhcnRUb1BvaW50TGVuZ3RoIC8gbGluZUxlbmd0aDtcbiAgY29uc3QgejAgPSBtaXgoejEsIHoyLCByYXRpbyk7XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgZ2VvbWV0cnk6IHtcbiAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICBjb29yZGluYXRlczogd21WaWV3cG9ydC51bnByb2plY3QoW3gwLCB5MCwgejBdKSxcbiAgICB9LFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgIC8vIFRPRE86IGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgaW4gcHJvcGVyIHVuaXRzXG4gICAgICBkaXN0OiBtaW5EaXN0YW5jZSxcbiAgICAgIGluZGV4OiBpbmRleCAtIDEsXG4gICAgfSxcbiAgfTtcbn1cbiJdfQ==