"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createPathMarkers;

var _math = require("math.gl");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function getLineLength(vPoints) {
  // calculate total length
  var lineLength = 0;

  for (var i = 0; i < vPoints.length - 1; i++) {
    lineLength += vPoints[i].distance(vPoints[i + 1]);
  }

  return lineLength;
}

var DEFAULT_COLOR = [0, 0, 0, 255];
var DEFAULT_DIRECTION = {
  forward: true,
  backward: false
};

function createPathMarkers(_ref) {
  var data = _ref.data,
      _ref$getPath = _ref.getPath,
      getPath = _ref$getPath === void 0 ? function (x) {
    return x.path;
  } : _ref$getPath,
      _ref$getDirection = _ref.getDirection,
      getDirection = _ref$getDirection === void 0 ? function (x) {
    return x.direction;
  } : _ref$getDirection,
      _ref$getColor = _ref.getColor,
      getColor = _ref$getColor === void 0 ? function (x) {
    return DEFAULT_COLOR;
  } : _ref$getColor,
      _ref$getMarkerPercent = _ref.getMarkerPercentages,
      getMarkerPercentages = _ref$getMarkerPercent === void 0 ? function (x) {
    return [0.5];
  } : _ref$getMarkerPercent,
      projectFlat = _ref.projectFlat;
  var markers = [];

  var _iterator = _createForOfIteratorHelper(data),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var object = _step.value;
      var path = getPath(object);
      var direction = getDirection(object) || DEFAULT_DIRECTION;
      var color = getColor(object);
      var vPoints = path.map(function (p) {
        return new _math.Vector2(p);
      });
      var vPointsReverse = vPoints.slice(0).reverse(); // calculate total length

      var lineLength = getLineLength(vPoints); // Ask for where to put markers
      // @ts-ignore

      var percentages = getMarkerPercentages(object, {
        lineLength: lineLength
      }); // Create the markers

      var _iterator2 = _createForOfIteratorHelper(percentages),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var percentage = _step2.value;

          if (direction.forward) {
            var marker = createMarkerAlongPath({
              path: vPoints,
              percentage: percentage,
              lineLength: lineLength,
              color: color,
              object: object,
              projectFlat: projectFlat
            });
            markers.push(marker);
          }

          if (direction.backward) {
            var _marker = createMarkerAlongPath({
              path: vPointsReverse,
              percentage: percentage,
              lineLength: lineLength,
              color: color,
              object: object,
              projectFlat: projectFlat
            });

            markers.push(_marker);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return markers;
}

function createMarkerAlongPath(_ref2) {
  var path = _ref2.path,
      percentage = _ref2.percentage,
      lineLength = _ref2.lineLength,
      color = _ref2.color,
      object = _ref2.object,
      projectFlat = _ref2.projectFlat;
  var distanceAlong = lineLength * percentage;
  var currentDistance = 0;
  var previousDistance = 0;
  var i = 0;

  for (i = 0; i < path.length - 1; i++) {
    currentDistance += path[i].distance(path[i + 1]);

    if (currentDistance > distanceAlong) {
      break;
    }

    previousDistance = currentDistance;
  }

  var vDirection = path[i + 1].clone().subtract(path[i]).normalize();
  var along = distanceAlong - previousDistance;
  var vCenter = vDirection.clone().multiply(new _math.Vector2(along, along)).add(path[i]);
  var vDirection2 = new _math.Vector2(projectFlat(path[i + 1])).subtract(projectFlat(path[i]));
  var angle = vDirection2.verticalAngle() * 180 / Math.PI;
  return {
    position: [vCenter.x, vCenter.y, 0],
    angle: angle,
    color: color,
    object: object
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcGF0aC1tYXJrZXItbGF5ZXIvY3JlYXRlLXBhdGgtbWFya2Vycy50cyJdLCJuYW1lcyI6WyJnZXRMaW5lTGVuZ3RoIiwidlBvaW50cyIsImxpbmVMZW5ndGgiLCJpIiwibGVuZ3RoIiwiZGlzdGFuY2UiLCJERUZBVUxUX0NPTE9SIiwiREVGQVVMVF9ESVJFQ1RJT04iLCJmb3J3YXJkIiwiYmFja3dhcmQiLCJjcmVhdGVQYXRoTWFya2VycyIsImRhdGEiLCJnZXRQYXRoIiwieCIsInBhdGgiLCJnZXREaXJlY3Rpb24iLCJkaXJlY3Rpb24iLCJnZXRDb2xvciIsImdldE1hcmtlclBlcmNlbnRhZ2VzIiwicHJvamVjdEZsYXQiLCJtYXJrZXJzIiwib2JqZWN0IiwiY29sb3IiLCJtYXAiLCJwIiwiVmVjdG9yMiIsInZQb2ludHNSZXZlcnNlIiwic2xpY2UiLCJyZXZlcnNlIiwicGVyY2VudGFnZXMiLCJwZXJjZW50YWdlIiwibWFya2VyIiwiY3JlYXRlTWFya2VyQWxvbmdQYXRoIiwicHVzaCIsImRpc3RhbmNlQWxvbmciLCJjdXJyZW50RGlzdGFuY2UiLCJwcmV2aW91c0Rpc3RhbmNlIiwidkRpcmVjdGlvbiIsImNsb25lIiwic3VidHJhY3QiLCJub3JtYWxpemUiLCJhbG9uZyIsInZDZW50ZXIiLCJtdWx0aXBseSIsImFkZCIsInZEaXJlY3Rpb24yIiwiYW5nbGUiLCJ2ZXJ0aWNhbEFuZ2xlIiwiTWF0aCIsIlBJIiwicG9zaXRpb24iLCJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUEsU0FBU0EsYUFBVCxDQUF1QkMsT0FBdkIsRUFBZ0M7QUFDOUI7QUFDQSxNQUFJQyxVQUFVLEdBQUcsQ0FBakI7O0FBQ0EsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixPQUFPLENBQUNHLE1BQVIsR0FBaUIsQ0FBckMsRUFBd0NELENBQUMsRUFBekMsRUFBNkM7QUFDM0NELElBQUFB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R0FBRyxDQUFMLENBQUosQ0FBWW1DLEtBQVosR0FBb0JDLFFBQXBCLENBQTZCekIsSUFBSSxDQUFDWCxDQUFELENBQWpDLEVBQXNDcUMsU0FBdEMsRUFBbkI7QUFDQSxNQUFNQyxLQUFLLEdBQUdQLGFBQWEsR0FBR0UsZ0JBQTlCO0FBQ0EsTUFBTU0sT0FBTyxHQUFHTCxVQUFVLENBQUNDLEtBQVgsR0FBbUJLLFFBQW5CLENBQTRCLElBQUlsQixhQUFKLENBQVlnQixLQUFaLEVBQW1CQSxLQUFuQixDQUE1QixFQUF1REcsR0FBdkQsQ0FBMkQ5QixJQUFJLENBQUNYLENBQUQsQ0FBL0QsQ0FBaEI7QUFFQSxNQUFNMEMsV0FBVyxHQUFHLElBQUlwQixhQUFKLENBQVlOLFdBQVcsQ0FBQ0wsSUFBSSxDQUFDWCxDQUFDLEdBQUcsQ0FBTCxDQUFMLENBQXZCLEVBQXNDb0MsUUFBdEMsQ0FBK0NwQixXQUFXLENBQUNMLElBQUksQ0FBQ1gsQ0FBRCxDQUFMLENBQTFELENBQXBCO0FBRUEsTUFBTTJDLEtBQUssR0FBSUQsV0FBVyxDQUFDRSxhQUFaLEtBQThCLEdBQS9CLEdBQXNDQyxJQUFJLENBQUNDLEVBQXpEO0FBRUEsU0FBTztBQUFFQyxJQUFBQSxRQUFRLEVBQUUsQ0FBQ1IsT0FBTyxDQUFDN0IsQ0FBVCxFQUFZNkIsT0FBTyxDQUFDUyxDQUFwQixFQUF1QixDQUF2QixDQUFaO0FBQXVDTCxJQUFBQSxLQUFLLEVBQUxBLEtBQXZDO0FBQThDeEIsSUFBQUEsS0FBSyxFQUFMQSxLQUE5QztBQUFxREQsSUFBQUEsTUFBTSxFQUFOQTtBQUFyRCxHQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSAnbWF0aC5nbCc7XG5cbmZ1bmN0aW9uIGdldExpbmVMZW5ndGgodlBvaW50cykge1xuICAvLyBjYWxjdWxhdGUgdG90YWwgbGVuZ3RoXG4gIGxldCBsaW5lTGVuZ3RoID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2UG9pbnRzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGxpbmVMZW5ndGggKz0gdlBvaW50c1tpXS5kaXN0YW5jZSh2UG9pbnRzW2kgKyAxXSk7XG4gIH1cbiAgcmV0dXJuIGxpbmVMZW5ndGg7XG59XG5cbmNvbnN0IERFRkFVTFRfQ09MT1IgPSBbMCwgMCwgMCwgMjU1XTtcbmNvbnN0IERFRkFVTFRfRElSRUNUSU9OID0geyBmb3J3YXJkOiB0cnVlLCBiYWNrd2FyZDogZmFsc2UgfTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlUGF0aE1hcmtlcnMoe1xuICBkYXRhLFxuICBnZXRQYXRoID0gKHgpID0+IHgucGF0aCxcbiAgZ2V0RGlyZWN0aW9uID0gKHgpID0+IHguZGlyZWN0aW9uLFxuICBnZXRDb2xvciA9ICh4KSA9PiBERUZBVUxUX0NPTE9SLFxuICBnZXRNYXJrZXJQZXJjZW50YWdlcyA9ICh4KSA9PiBbMC41XSxcbiAgcHJvamVjdEZsYXQsXG59KSB7XG4gIGNvbnN0IG1hcmtlcnMgPSBbXTtcblxuICBmb3IgKGNvbnN0IG9iamVjdCBvZiBkYXRhKSB7XG4gICAgY29uc3QgcGF0aCA9IGdldFBhdGgob2JqZWN0KTtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBnZXREaXJlY3Rpb24ob2JqZWN0KSB8fCBERUZBVUxUX0RJUkVDVElPTjtcbiAgICBjb25zdCBjb2xvciA9IGdldENvbG9yKG9iamVjdCk7XG5cbiAgICBjb25zdCB2UG9pbnRzID0gcGF0aC5tYXAoKHApID0+IG5ldyBWZWN0b3IyKHApKTtcbiAgICBjb25zdCB2UG9pbnRzUmV2ZXJzZSA9IHZQb2ludHMuc2xpY2UoMCkucmV2ZXJzZSgpO1xuXG4gICAgLy8gY2FsY3VsYXRlIHRvdGFsIGxlbmd0aFxuICAgIGNvbnN0IGxpbmVMZW5ndGggPSBnZXRMaW5lTGVuZ3RoKHZQb2ludHMpO1xuXG4gICAgLy8gQXNrIGZvciB3aGVyZSB0byBwdXQgbWFya2Vyc1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBwZXJjZW50YWdlcyA9IGdldE1hcmtlclBlcmNlbnRhZ2VzKG9iamVjdCwgeyBsaW5lTGVuZ3RoIH0pO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBtYXJrZXJzXG4gICAgZm9yIChjb25zdCBwZXJjZW50YWdlIG9mIHBlcmNlbnRhZ2VzKSB7XG4gICAgICBpZiAoZGlyZWN0aW9uLmZvcndhcmQpIHtcbiAgICAgICAgY29uc3QgbWFya2VyID0gY3JlYXRlTWFya2VyQWxvbmdQYXRoKHtcbiAgICAgICAgICBwYXRoOiB2UG9pbnRzLFxuICAgICAgICAgIHBlcmNlbnRhZ2UsXG4gICAgICAgICAgbGluZUxlbmd0aCxcbiAgICAgICAgICBjb2xvcixcbiAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgcHJvamVjdEZsYXQsXG4gICAgICAgIH0pO1xuICAgICAgICBtYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRpcmVjdGlvbi5iYWNrd2FyZCkge1xuICAgICAgICBjb25zdCBtYXJrZXIgPSBjcmVhdGVNYXJrZXJBbG9uZ1BhdGgoe1xuICAgICAgICAgIHBhdGg6IHZQb2ludHNSZXZlcnNlLFxuICAgICAgICAgIHBlcmNlbnRhZ2UsXG4gICAgICAgICAgbGluZUxlbmd0aCxcbiAgICAgICAgICBjb2xvcixcbiAgICAgICAgICBvYmplY3QsXG4gICAgICAgICAgcHJvamVjdEZsYXQsXG4gICAgICAgIH0pO1xuICAgICAgICBtYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWFya2Vycztcbn1cblxuZnVuY3Rpb24gY3JlYXRlTWFya2VyQWxvbmdQYXRoKHsgcGF0aCwgcGVyY2VudGFnZSwgbGluZUxlbmd0aCwgY29sb3IsIG9iamVjdCwgcHJvamVjdEZsYXQgfSkge1xuICBjb25zdCBkaXN0YW5jZUFsb25nID0gbGluZUxlbmd0aCAqIHBlcmNlbnRhZ2U7XG4gIGxldCBjdXJyZW50RGlzdGFuY2UgPSAwO1xuICBsZXQgcHJldmlvdXNEaXN0YW5jZSA9IDA7XG4gIGxldCBpID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IHBhdGgubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgY3VycmVudERpc3RhbmNlICs9IHBhdGhbaV0uZGlzdGFuY2UocGF0aFtpICsgMV0pO1xuICAgIGlmIChjdXJyZW50RGlzdGFuY2UgPiBkaXN0YW5jZUFsb25nKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcHJldmlvdXNEaXN0YW5jZSA9IGN1cnJlbnREaXN0YW5jZTtcbiAgfVxuXG4gIGNvbnN0IHZEaXJlY3Rpb24gPSBwYXRoW2kgKyAxXS5jbG9uZSgpLnN1YnRyYWN0KHBhdGhbaV0pLm5vcm1hbGl6ZSgpO1xuICBjb25zdCBhbG9uZyA9IGRpc3RhbmNlQWxvbmcgLSBwcmV2aW91c0Rpc3RhbmNlO1xuICBjb25zdCB2Q2VudGVyID0gdkRpcmVjdGlvbi5jbG9uZSgpLm11bHRpcGx5KG5ldyBWZWN0b3IyKGFsb25nLCBhbG9uZykpLmFkZChwYXRoW2ldKTtcblxuICBjb25zdCB2RGlyZWN0aW9uMiA9IG5ldyBWZWN0b3IyKHByb2plY3RGbGF0KHBhdGhbaSArIDFdKSkuc3VidHJhY3QocHJvamVjdEZsYXQocGF0aFtpXSkpO1xuXG4gIGNvbnN0IGFuZ2xlID0gKHZEaXJlY3Rpb24yLnZlcnRpY2FsQW5nbGUoKSAqIDE4MCkgLyBNYXRoLlBJO1xuXG4gIHJldHVybiB7IHBvc2l0aW9uOiBbdkNlbnRlci54LCB2Q2VudGVyLnksIDBdLCBhbmdsZSwgY29sb3IsIG9iamVjdCB9O1xufVxuIl19