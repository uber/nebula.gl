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
exports.getPickedEditHandle = getPickedEditHandle;
exports.getPickedSnapSourceEditHandle = getPickedSnapSourceEditHandle;
exports.getNonGuidePicks = getNonGuidePicks;
exports.getPickedExistingEditHandle = getPickedExistingEditHandle;
exports.getPickedIntermediateEditHandle = getPickedIntermediateEditHandle;
exports.getPickedEditHandles = getPickedEditHandles;
exports.getEditHandlesForGeometry = getEditHandlesForGeometry;

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

function generatePointsParallelToLinePoints(p1, p2, mapCoords) {
  var lineString = {
    type: 'LineString',
    coordinates: [p1, p2]
  };
  var pt = (0, _helpers.point)(mapCoords);
  var ddistance = (0, _pointToLineDistance["default"])(pt, lineString);
  var lineBearing = (0, _bearing["default"])(p1, p2); // Check if current point is to the left or right of line
  // Line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
  // then (x−x1)(y2−y1)−(y−y1)(x2−x1)

  var isPointToLeftOfLine = (mapCoords[0] - p1[0]) * (p2[1] - p1[1]) - (mapCoords[1] - p1[1]) * (p2[0] - p1[0]); // Bearing to draw perpendicular to the line string

  var orthogonalBearing = isPointToLeftOfLine < 0 ? lineBearing - 90 : lineBearing - 270; // Get coordinates for the point p3 and p4 which are perpendicular to the lineString
  // Add the distance as the current position moves away from the lineString

  var p3 = (0, _destination["default"])(p2, ddistance, orthogonalBearing);
  var p4 = (0, _destination["default"])(p1, ddistance, orthogonalBearing);
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

function getPickedEditHandle(picks) {
  var handles = getPickedEditHandles(picks);
  return handles.length ? handles[0] : null;
}

function getPickedSnapSourceEditHandle(picks) {
  var handles = getPickedEditHandles(picks);
  return handles.find(function (handle) {
    return handle.properties.editHandleType === 'snap-source';
  });
}

function getNonGuidePicks(picks) {
  return picks && picks.filter(function (pick) {
    return !pick.isGuide;
  });
}

function getPickedExistingEditHandle(picks) {
  var handles = getPickedEditHandles(picks);
  return handles.find(function (_ref5) {
    var properties = _ref5.properties;
    return properties.featureIndex >= 0 && properties.editHandleType === 'existing';
  });
}

function getPickedIntermediateEditHandle(picks) {
  var handles = getPickedEditHandles(picks);
  return handles.find(function (_ref6) {
    var properties = _ref6.properties;
    return properties.featureIndex >= 0 && properties.editHandleType === 'intermediate';
  });
}

function getPickedEditHandles(picks) {
  var handles = picks && picks.filter(function (pick) {
    return pick.isGuide && pick.object.properties.guideType === 'editHandle';
  }).map(function (pick) {
    return pick.object;
  }) || [];
  return handles;
}

function getEditHandlesForGeometry(geometry, featureIndex) {
  var editHandleType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'existing';
  var handles = [];

  switch (geometry.type) {
    case 'Point':
      // positions are not nested
      handles = [{
        type: 'Feature',
        properties: {
          guideType: 'editHandle',
          editHandleType: editHandleType,
          positionIndexes: [],
          featureIndex: featureIndex
        },
        geometry: {
          type: 'Point',
          coordinates: geometry.coordinates
        }
      }];
      break;

    case 'MultiPoint':
    case 'LineString':
      // positions are nested 1 level
      handles = handles.concat(getEditHandlesForCoordinates(geometry.coordinates, [], featureIndex, editHandleType));
      break;

    case 'Polygon':
    case 'MultiLineString':
      // positions are nested 2 levels
      for (var a = 0; a < geometry.coordinates.length; a++) {
        handles = handles.concat(getEditHandlesForCoordinates(geometry.coordinates[a], [a], featureIndex, editHandleType));

        if (geometry.type === 'Polygon') {
          // Don't repeat the first/last handle for Polygons
          handles = handles.slice(0, -1);
        }
      }

      break;

    case 'MultiPolygon':
      // positions are nested 3 levels
      for (var _a = 0; _a < geometry.coordinates.length; _a++) {
        for (var b = 0; b < geometry.coordinates[_a].length; b++) {
          handles = handles.concat(getEditHandlesForCoordinates(geometry.coordinates[_a][b], [_a, b], featureIndex, editHandleType)); // Don't repeat the first/last handle for Polygons

          handles = handles.slice(0, -1);
        }
      }

      break;

    default:
      //@ts-ignore
      throw Error("Unhandled geometry type: ".concat(geometry.type));
  }

  return handles;
}

function getEditHandlesForCoordinates(coordinates, positionIndexPrefix, featureIndex) {
  var editHandleType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'existing';
  var editHandles = [];

  for (var i = 0; i < coordinates.length; i++) {
    var position = coordinates[i];
    editHandles.push({
      type: 'Feature',
      properties: {
        guideType: 'editHandle',
        positionIndexes: [].concat(_toConsumableArray(positionIndexPrefix), [i]),
        featureIndex: featureIndex,
        editHandleType: editHandleType
      },
      geometry: {
        type: 'Point',
        coordinates: position
      }
    });
  }

  return editHandles;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6WyJ0b0RlY2tDb2xvciIsImNvbG9yIiwiZGVmYXVsdENvbG9yIiwiQXJyYXkiLCJpc0FycmF5IiwicmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyIsImFycmF5IiwicHJlZml4IiwiZm4iLCJpIiwibGVuZ3RoIiwiZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyIsInAxIiwicDIiLCJtYXBDb29yZHMiLCJsaW5lU3RyaW5nIiwidHlwZSIsImNvb3JkaW5hdGVzIiwicHQiLCJkZGlzdGFuY2UiLCJsaW5lQmVhcmluZyIsImlzUG9pbnRUb0xlZnRPZkxpbmUiLCJvcnRob2dvbmFsQmVhcmluZyIsInAzIiwicDQiLCJnZW9tZXRyeSIsImRpc3RhbmNlMmQiLCJ4MSIsInkxIiwieDIiLCJ5MiIsImR4IiwiZHkiLCJNYXRoIiwic3FydCIsIm1peCIsImEiLCJiIiwicmF0aW8iLCJuZWFyZXN0UG9pbnRPblByb2plY3RlZExpbmUiLCJsaW5lIiwiaW5Qb2ludCIsInZpZXdwb3J0Iiwid21WaWV3cG9ydCIsIldlYk1lcmNhdG9yVmlld3BvcnQiLCJwcm9qZWN0ZWRDb29yZHMiLCJtYXAiLCJ4IiwieSIsInoiLCJwcm9qZWN0IiwibWluRGlzdGFuY2UiLCJJbmZpbml0eSIsIm1pblBvaW50SW5mbyIsImZvckVhY2giLCJpbmRleCIsIkEiLCJCIiwiQyIsImRpdiIsImRpc3RhbmNlIiwiYWJzIiwieDAiLCJ5MCIsInoxIiwiejIiLCJsaW5lTGVuZ3RoIiwic3RhcnRUb1BvaW50TGVuZ3RoIiwiejAiLCJ1bnByb2plY3QiLCJwcm9wZXJ0aWVzIiwiZGlzdCIsImdldFBpY2tlZEVkaXRIYW5kbGUiLCJwaWNrcyIsImhhbmRsZXMiLCJnZXRQaWNrZWRFZGl0SGFuZGxlcyIsImdldFBpY2tlZFNuYXBTb3VyY2VFZGl0SGFuZGxlIiwiZmluZCIsImhhbmRsZSIsImVkaXRIYW5kbGVUeXBlIiwiZ2V0Tm9uR3VpZGVQaWNrcyIsImZpbHRlciIsInBpY2siLCJpc0d1aWRlIiwiZ2V0UGlja2VkRXhpc3RpbmdFZGl0SGFuZGxlIiwiZmVhdHVyZUluZGV4IiwiZ2V0UGlja2VkSW50ZXJtZWRpYXRlRWRpdEhhbmRsZSIsIm9iamVjdCIsImd1aWRlVHlwZSIsImdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkiLCJwb3NpdGlvbkluZGV4ZXMiLCJjb25jYXQiLCJnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzIiwic2xpY2UiLCJFcnJvciIsInBvc2l0aW9uSW5kZXhQcmVmaXgiLCJlZGl0SGFuZGxlcyIsInBvc2l0aW9uIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhTyxTQUFTQSxXQUFULENBQ0xDLEtBREssRUFHNkI7QUFBQSxNQURsQ0MsWUFDa0MsdUVBRGUsQ0FBQyxHQUFELEVBQU0sQ0FBTixFQUFTLENBQVQsRUFBWSxHQUFaLENBQ2Y7O0FBQ2xDLE1BQUksQ0FBQ0MsS0FBSyxDQUFDQyxPQUFOLENBQWNILEtBQWQsQ0FBTCxFQUEyQjtBQUN6QixXQUFPQyxZQUFQO0FBQ0Q7O0FBQ0QsU0FBTyxDQUFDRCxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVcsR0FBWixFQUFpQkEsS0FBSyxDQUFDLENBQUQsQ0FBTCxHQUFXLEdBQTVCLEVBQWlDQSxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVcsR0FBNUMsRUFBaURBLEtBQUssQ0FBQyxDQUFELENBQUwsR0FBVyxHQUE1RCxDQUFQO0FBQ0QsQyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTSSwrQkFBVCxDQUNMQyxLQURLLEVBRUxDLE1BRkssRUFH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QUFNaUIsV0FBVyxHQUFHLEVBQXBCOztBQUNBLE9BQUssSUFBSXZGLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdRLFdBQVcsQ0FBQ1AsTUFBaEMsRUFBd0NELENBQUMsRUFBekMsRUFBNkM7QUFDM0MsUUFBTXdGLFFBQVEsR0FBR2hGLFdBQVcsQ0FBQ1IsQ0FBRCxDQUE1QjtBQUNBdUYsSUFBQUEsV0FBVyxDQUFDRSxJQUFaLENBQWlCO0FBQ2ZsRixNQUFBQSxJQUFJLEVBQUUsU0FEUztBQUVmc0QsTUFBQUEsVUFBVSxFQUFFO0FBQ1ZrQixRQUFBQSxTQUFTLEVBQUUsWUFERDtBQUVWRSxRQUFBQSxlQUFlLCtCQUFNSyxtQkFBTixJQUEyQnRGLENBQTNCLEVBRkw7QUFHVjRFLFFBQUFBLFlBQVksRUFBWkEsWUFIVTtBQUlWTixRQUFBQSxjQUFjLEVBQWRBO0FBSlUsT0FGRztBQVFmdEQsTUFBQUEsUUFBUSxFQUFFO0FBQ1JULFFBQUFBLElBQUksRUFBRSxPQURFO0FBRVJDLFFBQUFBLFdBQVcsRUFBRWdGO0FBRkw7QUFSSyxLQUFqQjtBQWFEOztBQUNELFNBQU9ELFdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZXN0aW5hdGlvbiBmcm9tICdAdHVyZi9kZXN0aW5hdGlvbic7XG5pbXBvcnQgYmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCBwb2ludFRvTGluZURpc3RhbmNlIGZyb20gJ0B0dXJmL3BvaW50LXRvLWxpbmUtZGlzdGFuY2UnO1xuaW1wb3J0IHsgcG9pbnQgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCBXZWJNZXJjYXRvclZpZXdwb3J0IGZyb20gJ3ZpZXdwb3J0LW1lcmNhdG9yLXByb2plY3QnO1xuaW1wb3J0IHsgVmlld3BvcnQsIFBpY2ssIEVkaXRIYW5kbGVGZWF0dXJlLCBFZGl0SGFuZGxlVHlwZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHtcbiAgR2VvbWV0cnksXG4gIFBvc2l0aW9uLFxuICBQb2ludCxcbiAgTGluZVN0cmluZyxcbiAgRmVhdHVyZU9mLFxuICBGZWF0dXJlV2l0aFByb3BzLFxufSBmcm9tICcuL2dlb2pzb24tdHlwZXMnO1xuXG5leHBvcnQgdHlwZSBOZWFyZXN0UG9pbnRUeXBlID0gRmVhdHVyZVdpdGhQcm9wczxQb2ludCwgeyBkaXN0OiBudW1iZXI7IGluZGV4OiBudW1iZXIgfT47XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0RlY2tDb2xvcihcbiAgY29sb3I/OiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSB8IG51bWJlcixcbiAgZGVmYXVsdENvbG9yOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFsyNTUsIDAsIDAsIDI1NV1cbik6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGNvbG9yKSkge1xuICAgIHJldHVybiBkZWZhdWx0Q29sb3I7XG4gIH1cbiAgcmV0dXJuIFtjb2xvclswXSAqIDI1NSwgY29sb3JbMV0gKiAyNTUsIGNvbG9yWzJdICogMjU1LCBjb2xvclszXSAqIDI1NV07XG59XG5cbi8vXG4vLyBhIEdlb0pTT04gaGVscGVyIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIHdpdGhcbi8vIGFuIGFyZ3VtZW50IHRoYXQgaXMgdGhlIG1vc3QgZGVlcGx5LW5lc3RlZCBhcnJheSBoYXZpbmcgZWxlbWVudHNcbi8vIHRoYXQgYXJlIGFycmF5cyBvZiBwcmltaXRpdmVzIGFzIGFuIGFyZ3VtZW50LCBlLmcuXG4vL1xuLy8ge1xuLy8gICBcInR5cGVcIjogXCJNdWx0aVBvbHlnb25cIixcbi8vICAgXCJjb29yZGluYXRlc1wiOiBbXG4vLyAgICAgICBbXG4vLyAgICAgICAgICAgW1szMCwgMjBdLCBbNDUsIDQwXSwgWzEwLCA0MF0sIFszMCwgMjBdXVxuLy8gICAgICAgXSxcbi8vICAgICAgIFtcbi8vICAgICAgICAgICBbWzE1LCA1XSwgWzQwLCAxMF0sIFsxMCwgMjBdLCBbNSwgMTBdLCBbMTUsIDVdXVxuLy8gICAgICAgXVxuLy8gICBdXG4vLyB9XG4vL1xuLy8gdGhlIGZ1bmN0aW9uIHdvdWxkIGJlIGNhbGxlZCBvbjpcbi8vXG4vLyBbWzMwLCAyMF0sIFs0NSwgNDBdLCBbMTAsIDQwXSwgWzMwLCAyMF1dXG4vL1xuLy8gYW5kXG4vL1xuLy8gW1sxNSwgNV0sIFs0MCwgMTBdLCBbMTAsIDIwXSwgWzUsIDEwXSwgWzE1LCA1XV1cbi8vXG5leHBvcnQgZnVuY3Rpb24gcmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyhcbiAgYXJyYXk6IEFycmF5PGFueT4sXG4gIHByZWZpeDogQXJyYXk8bnVtYmVyPixcbiAgZm46IEZ1bmN0aW9uXG4pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5WzBdKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAocmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyhhcnJheVtpXSwgWy4uLnByZWZpeCwgaV0sIGZuKSkge1xuICAgICAgZm4oYXJyYXksIHByZWZpeCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyhcbiAgcDE6IFBvc2l0aW9uLFxuICBwMjogUG9zaXRpb24sXG4gIG1hcENvb3JkczogUG9zaXRpb25cbik6IFBvc2l0aW9uW10ge1xuICBjb25zdCBsaW5lU3RyaW5nOiBMaW5lU3RyaW5nID0ge1xuICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICBjb29yZGluYXRlczogW3AxLCBwMl0sXG4gIH07XG4gIGNvbnN0IHB0ID0gcG9pbnQobWFwQ29vcmRzKTtcbiAgY29uc3QgZGRpc3RhbmNlID0gcG9pbnRUb0xpbmVEaXN0YW5jZShwdCwgbGluZVN0cmluZyk7XG4gIGNvbnN0IGxpbmVCZWFyaW5nID0gYmVhcmluZyhwMSwgcDIpO1xuXG4gIC8vIENoZWNrIGlmIGN1cnJlbnQgcG9pbnQgaXMgdG8gdGhlIGxlZnQgb3IgcmlnaHQgb2YgbGluZVxuICAvLyBMaW5lIGZyb20gQT0oeDEseTEpIHRvIEI9KHgyLHkyKSBhIHBvaW50IFA9KHgseSlcbiAgLy8gdGhlbiAoeOKIkngxKSh5MuKIknkxKeKIkih54oiSeTEpKHgy4oiSeDEpXG4gIGNvbnN0IGlzUG9pbnRUb0xlZnRPZkxpbmUgPVxuICAgIChtYXBDb29yZHNbMF0gLSBwMVswXSkgKiAocDJbMV0gLSBwMVsxXSkgLSAobWFwQ29vcmRzWzFdIC0gcDFbMV0pICogKHAyWzBdIC0gcDFbMF0pO1xuXG4gIC8vIEJlYXJpbmcgdG8gZHJhdyBwZXJwZW5kaWN1bGFyIHRvIHRoZSBsaW5lIHN0cmluZ1xuICBjb25zdCBvcnRob2dvbmFsQmVhcmluZyA9IGlzUG9pbnRUb0xlZnRPZkxpbmUgPCAwID8gbGluZUJlYXJpbmcgLSA5MCA6IGxpbmVCZWFyaW5nIC0gMjcwO1xuXG4gIC8vIEdldCBjb29yZGluYXRlcyBmb3IgdGhlIHBvaW50IHAzIGFuZCBwNCB3aGljaCBhcmUgcGVycGVuZGljdWxhciB0byB0aGUgbGluZVN0cmluZ1xuICAvLyBBZGQgdGhlIGRpc3RhbmNlIGFzIHRoZSBjdXJyZW50IHBvc2l0aW9uIG1vdmVzIGF3YXkgZnJvbSB0aGUgbGluZVN0cmluZ1xuICBjb25zdCBwMyA9IGRlc3RpbmF0aW9uKHAyLCBkZGlzdGFuY2UsIG9ydGhvZ29uYWxCZWFyaW5nKTtcbiAgY29uc3QgcDQgPSBkZXN0aW5hdGlvbihwMSwgZGRpc3RhbmNlLCBvcnRob2dvbmFsQmVhcmluZyk7XG5cbiAgcmV0dXJuIFtwMy5nZW9tZXRyeS5jb29yZGluYXRlcywgcDQuZ2VvbWV0cnkuY29vcmRpbmF0ZXNdIGFzIFBvc2l0aW9uW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXN0YW5jZTJkKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIpOiBudW1iZXIge1xuICBjb25zdCBkeCA9IHgxIC0geDI7XG4gIGNvbnN0IGR5ID0geTEgLSB5MjtcbiAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaXgoYTogbnVtYmVyLCBiOiBudW1iZXIsIHJhdGlvOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gYiAqIHJhdGlvICsgYSAqICgxIC0gcmF0aW8pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmVhcmVzdFBvaW50T25Qcm9qZWN0ZWRMaW5lKFxuICBsaW5lOiBGZWF0dXJlT2Y8TGluZVN0cmluZz4sXG4gIGluUG9pbnQ6IEZlYXR1cmVPZjxQb2ludD4sXG4gIHZpZXdwb3J0OiBWaWV3cG9ydFxuKTogTmVhcmVzdFBvaW50VHlwZSB7XG4gIGNvbnN0IHdtVmlld3BvcnQgPSBuZXcgV2ViTWVyY2F0b3JWaWV3cG9ydCh2aWV3cG9ydCk7XG4gIC8vIFByb2plY3QgdGhlIGxpbmUgdG8gdmlld3BvcnQsIHRoZW4gZmluZCB0aGUgbmVhcmVzdCBwb2ludFxuICBjb25zdCBjb29yZGluYXRlczogQXJyYXk8QXJyYXk8bnVtYmVyPj4gPSBsaW5lLmdlb21ldHJ5LmNvb3JkaW5hdGVzIGFzIGFueTtcbiAgY29uc3QgcHJvamVjdGVkQ29vcmRzID0gY29vcmRpbmF0ZXMubWFwKChbeCwgeSwgeiA9IDBdKSA9PiB3bVZpZXdwb3J0LnByb2plY3QoW3gsIHksIHpdKSk7XG4gIC8vQHRzLWlnbm9yZVxuICBjb25zdCBbeCwgeV0gPSB3bVZpZXdwb3J0LnByb2plY3QoaW5Qb2ludC5nZW9tZXRyeS5jb29yZGluYXRlcyk7XG4gIC8vIGNvbnNvbGUubG9nKCdwcm9qZWN0ZWRDb29yZHMnLCBKU09OLnN0cmluZ2lmeShwcm9qZWN0ZWRDb29yZHMpKTtcblxuICBsZXQgbWluRGlzdGFuY2UgPSBJbmZpbml0eTtcbiAgbGV0IG1pblBvaW50SW5mbyA9IHt9O1xuXG4gIHByb2plY3RlZENvb3Jkcy5mb3JFYWNoKChbeDIsIHkyXSwgaW5kZXgpID0+IHtcbiAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBbeDEsIHkxXSA9IHByb2plY3RlZENvb3Jkc1tpbmRleCAtIDFdO1xuXG4gICAgLy8gbGluZSBmcm9tIHByb2plY3RlZENvb3Jkc1tpbmRleCAtIDFdIHRvIHByb2plY3RlZENvb3Jkc1tpbmRleF1cbiAgICAvLyBjb252ZXJ0IHRvIEF4ICsgQnkgKyBDID0gMFxuICAgIGNvbnN0IEEgPSB5MSAtIHkyO1xuICAgIGNvbnN0IEIgPSB4MiAtIHgxO1xuICAgIGNvbnN0IEMgPSB4MSAqIHkyIC0geDIgKiB5MTtcblxuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Rpc3RhbmNlX2Zyb21fYV9wb2ludF90b19hX2xpbmVcbiAgICBjb25zdCBkaXYgPSBBICogQSArIEIgKiBCO1xuICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5hYnMoQSAqIHggKyBCICogeSArIEMpIC8gTWF0aC5zcXJ0KGRpdik7XG5cbiAgICAvLyBUT0RPOiBDaGVjayBpZiBpbnNpZGUgYm91bmRzXG5cbiAgICBpZiAoZGlzdGFuY2UgPCBtaW5EaXN0YW5jZSkge1xuICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICAgIG1pblBvaW50SW5mbyA9IHtcbiAgICAgICAgaW5kZXgsXG4gICAgICAgIHgwOiAoQiAqIChCICogeCAtIEEgKiB5KSAtIEEgKiBDKSAvIGRpdixcbiAgICAgICAgeTA6IChBICogKC1CICogeCArIEEgKiB5KSAtIEIgKiBDKSAvIGRpdixcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiAgLy9AdHMtaWdub3JlXG4gIGNvbnN0IHsgaW5kZXgsIHgwLCB5MCB9ID0gbWluUG9pbnRJbmZvO1xuICBjb25zdCBbeDEsIHkxLCB6MSA9IDBdID0gcHJvamVjdGVkQ29vcmRzW2luZGV4IC0gMV07XG4gIGNvbnN0IFt4MiwgeTIsIHoyID0gMF0gPSBwcm9qZWN0ZWRDb29yZHNbaW5kZXhdO1xuXG4gIC8vIGNhbGN1bGF0ZSB3aGF0IHJhdGlvIG9mIHRoZSBsaW5lIHdlIGFyZSBvbiB0byBmaW5kIHRoZSBwcm9wZXIgelxuICBjb25zdCBsaW5lTGVuZ3RoID0gZGlzdGFuY2UyZCh4MSwgeTEsIHgyLCB5Mik7XG4gIGNvbnN0IHN0YXJ0VG9Qb2ludExlbmd0aCA9IGRpc3RhbmNlMmQoeDEsIHkxLCB4MCwgeTApO1xuICBjb25zdCByYXRpbyA9IHN0YXJ0VG9Qb2ludExlbmd0aCAvIGxpbmVMZW5ndGg7XG4gIGNvbnN0IHowID0gbWl4KHoxLCB6MiwgcmF0aW8pO1xuXG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgIGdlb21ldHJ5OiB7XG4gICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgY29vcmRpbmF0ZXM6IHdtVmlld3BvcnQudW5wcm9qZWN0KFt4MCwgeTAsIHowXSksXG4gICAgfSxcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAvLyBUT0RPOiBjYWxjdWxhdGUgdGhlIGRpc3RhbmNlIGluIHByb3BlciB1bml0c1xuICAgICAgZGlzdDogbWluRGlzdGFuY2UsXG4gICAgICBpbmRleDogaW5kZXggLSAxLFxuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQaWNrZWRFZGl0SGFuZGxlKFxuICBwaWNrczogUGlja1tdIHwgbnVsbCB8IHVuZGVmaW5lZFxuKTogRWRpdEhhbmRsZUZlYXR1cmUgfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgaGFuZGxlcyA9IGdldFBpY2tlZEVkaXRIYW5kbGVzKHBpY2tzKTtcbiAgcmV0dXJuIGhhbmRsZXMubGVuZ3RoID8gaGFuZGxlc1swXSA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQaWNrZWRTbmFwU291cmNlRWRpdEhhbmRsZShcbiAgcGlja3M6IFBpY2tbXSB8IG51bGwgfCB1bmRlZmluZWRcbik6IEVkaXRIYW5kbGVGZWF0dXJlIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGhhbmRsZXMgPSBnZXRQaWNrZWRFZGl0SGFuZGxlcyhwaWNrcyk7XG4gIHJldHVybiBoYW5kbGVzLmZpbmQoKGhhbmRsZSkgPT4gaGFuZGxlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUgPT09ICdzbmFwLXNvdXJjZScpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9uR3VpZGVQaWNrcyhwaWNrczogUGlja1tdKTogUGlja1tdIHtcbiAgcmV0dXJuIHBpY2tzICYmIHBpY2tzLmZpbHRlcigocGljaykgPT4gIXBpY2suaXNHdWlkZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQaWNrZWRFeGlzdGluZ0VkaXRIYW5kbGUoXG4gIHBpY2tzOiBQaWNrW10gfCBudWxsIHwgdW5kZWZpbmVkXG4pOiBFZGl0SGFuZGxlRmVhdHVyZSB8IG51bGwgfCB1bmRlZmluZWQge1xuICBjb25zdCBoYW5kbGVzID0gZ2V0UGlja2VkRWRpdEhhbmRsZXMocGlja3MpO1xuICByZXR1cm4gaGFuZGxlcy5maW5kKFxuICAgICh7IHByb3BlcnRpZXMgfSkgPT4gcHJvcGVydGllcy5mZWF0dXJlSW5kZXggPj0gMCAmJiBwcm9wZXJ0aWVzLmVkaXRIYW5kbGVUeXBlID09PSAnZXhpc3RpbmcnXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQaWNrZWRJbnRlcm1lZGlhdGVFZGl0SGFuZGxlKFxuICBwaWNrczogUGlja1tdIHwgbnVsbCB8IHVuZGVmaW5lZFxuKTogRWRpdEhhbmRsZUZlYXR1cmUgfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgaGFuZGxlcyA9IGdldFBpY2tlZEVkaXRIYW5kbGVzKHBpY2tzKTtcbiAgcmV0dXJuIGhhbmRsZXMuZmluZChcbiAgICAoeyBwcm9wZXJ0aWVzIH0pID0+IHByb3BlcnRpZXMuZmVhdHVyZUluZGV4ID49IDAgJiYgcHJvcGVydGllcy5lZGl0SGFuZGxlVHlwZSA9PT0gJ2ludGVybWVkaWF0ZSdcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBpY2tlZEVkaXRIYW5kbGVzKHBpY2tzOiBQaWNrW10gfCBudWxsIHwgdW5kZWZpbmVkKTogRWRpdEhhbmRsZUZlYXR1cmVbXSB7XG4gIGNvbnN0IGhhbmRsZXMgPVxuICAgIChwaWNrcyAmJlxuICAgICAgcGlja3NcbiAgICAgICAgLmZpbHRlcigocGljaykgPT4gcGljay5pc0d1aWRlICYmIHBpY2sub2JqZWN0LnByb3BlcnRpZXMuZ3VpZGVUeXBlID09PSAnZWRpdEhhbmRsZScpXG4gICAgICAgIC5tYXAoKHBpY2spID0+IHBpY2sub2JqZWN0KSkgfHxcbiAgICBbXTtcblxuICByZXR1cm4gaGFuZGxlcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkoXG4gIGdlb21ldHJ5OiBHZW9tZXRyeSxcbiAgZmVhdHVyZUluZGV4OiBudW1iZXIsXG4gIGVkaXRIYW5kbGVUeXBlOiBFZGl0SGFuZGxlVHlwZSA9ICdleGlzdGluZydcbik6IEVkaXRIYW5kbGVGZWF0dXJlW10ge1xuICBsZXQgaGFuZGxlczogRWRpdEhhbmRsZUZlYXR1cmVbXSA9IFtdO1xuXG4gIHN3aXRjaCAoZ2VvbWV0cnkudHlwZSkge1xuICAgIGNhc2UgJ1BvaW50JzpcbiAgICAgIC8vIHBvc2l0aW9ucyBhcmUgbm90IG5lc3RlZFxuICAgICAgaGFuZGxlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBndWlkZVR5cGU6ICdlZGl0SGFuZGxlJyxcbiAgICAgICAgICAgIGVkaXRIYW5kbGVUeXBlLFxuICAgICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBbXSxcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgICAgICAgY29vcmRpbmF0ZXM6IGdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnTXVsdGlQb2ludCc6XG4gICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgICAvLyBwb3NpdGlvbnMgYXJlIG5lc3RlZCAxIGxldmVsXG4gICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoXG4gICAgICAgIGdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMoZ2VvbWV0cnkuY29vcmRpbmF0ZXMsIFtdLCBmZWF0dXJlSW5kZXgsIGVkaXRIYW5kbGVUeXBlKVxuICAgICAgKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gICAgICAvLyBwb3NpdGlvbnMgYXJlIG5lc3RlZCAyIGxldmVsc1xuICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBnZW9tZXRyeS5jb29yZGluYXRlcy5sZW5ndGg7IGErKykge1xuICAgICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoXG4gICAgICAgICAgZ2V0RWRpdEhhbmRsZXNGb3JDb29yZGluYXRlcyhnZW9tZXRyeS5jb29yZGluYXRlc1thXSwgW2FdLCBmZWF0dXJlSW5kZXgsIGVkaXRIYW5kbGVUeXBlKVxuICAgICAgICApO1xuICAgICAgICBpZiAoZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgcmVwZWF0IHRoZSBmaXJzdC9sYXN0IGhhbmRsZSBmb3IgUG9seWdvbnNcbiAgICAgICAgICBoYW5kbGVzID0gaGFuZGxlcy5zbGljZSgwLCAtMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnTXVsdGlQb2x5Z29uJzpcbiAgICAgIC8vIHBvc2l0aW9ucyBhcmUgbmVzdGVkIDMgbGV2ZWxzXG4gICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgZ2VvbWV0cnkuY29vcmRpbmF0ZXNbYV0ubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoXG4gICAgICAgICAgICBnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzKFxuICAgICAgICAgICAgICBnZW9tZXRyeS5jb29yZGluYXRlc1thXVtiXSxcbiAgICAgICAgICAgICAgW2EsIGJdLFxuICAgICAgICAgICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICAgIGVkaXRIYW5kbGVUeXBlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBEb24ndCByZXBlYXQgdGhlIGZpcnN0L2xhc3QgaGFuZGxlIGZvciBQb2x5Z29uc1xuICAgICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICB0aHJvdyBFcnJvcihgVW5oYW5kbGVkIGdlb21ldHJ5IHR5cGU6ICR7Z2VvbWV0cnkudHlwZX1gKTtcbiAgfVxuXG4gIHJldHVybiBoYW5kbGVzO1xufVxuXG5mdW5jdGlvbiBnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzKFxuICBjb29yZGluYXRlczogYW55W10sXG4gIHBvc2l0aW9uSW5kZXhQcmVmaXg6IG51bWJlcltdLFxuICBmZWF0dXJlSW5kZXg6IG51bWJlcixcbiAgZWRpdEhhbmRsZVR5cGU6IEVkaXRIYW5kbGVUeXBlID0gJ2V4aXN0aW5nJ1xuKTogRWRpdEhhbmRsZUZlYXR1cmVbXSB7XG4gIGNvbnN0IGVkaXRIYW5kbGVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGNvb3JkaW5hdGVzW2ldO1xuICAgIGVkaXRIYW5kbGVzLnB1c2goe1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBndWlkZVR5cGU6ICdlZGl0SGFuZGxlJyxcbiAgICAgICAgcG9zaXRpb25JbmRleGVzOiBbLi4ucG9zaXRpb25JbmRleFByZWZpeCwgaV0sXG4gICAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgICAgZWRpdEhhbmRsZVR5cGUsXG4gICAgICB9LFxuICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IHBvc2l0aW9uLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZWRpdEhhbmRsZXM7XG59XG4iXX0=