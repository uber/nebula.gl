"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toGeoJson = toGeoJson;
exports.toKml = toKml;
exports.toWkt = toWkt;
exports.toStats = toStats;

var _tokml = _interopRequireDefault(require("@maphubs/tokml"));

var _wellknown = require("wellknown");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function toGeoJson(geoJson, filename) {
  return {
    data: JSON.stringify(geoJson, null, 2),
    filename: "".concat(filename, ".geojson"),
    mimetype: 'application/json'
  };
}

function toKml(geoJson, filename) {
  // For some reason, google maps doesn't surface id unless it is in the properties
  // So, put it also in properties
  if (geoJson.type === 'FeatureCollection') {
    geoJson.features.forEach(function (f) {
      f.properties = f.properties || {};
    });
  }

  var kmlString = (0, _tokml["default"])(geoJson); // kmlString = addIdToKml(geoJson, kmlString);

  return {
    data: kmlString,
    filename: "".concat(filename, ".kml"),
    mimetype: 'application/xml'
  };
}

function toWkt(geoJson, filename) {
  var wkt = '';

  if (geoJson.type === 'Feature') {
    // @ts-ignore
    wkt = (0, _wellknown.stringify)(geoJson);
  } else {
    // feature collection
    wkt = '';

    var _iterator = _createForOfIteratorHelper(geoJson.features),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var feature = _step.value;
        // @ts-ignore
        wkt += "".concat((0, _wellknown.stringify)(feature), "\n");
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (wkt.length > 0) {
      wkt = wkt.substring(0, wkt.length - 1);
    }
  }

  return {
    data: wkt,
    filename: "".concat(filename, ".wkt"),
    mimetype: 'text/plain'
  };
}

function toStats(geoJson, filename) {
  var pointCount = 0;
  var ringCount = 0;
  var polygonCount = 0;
  var featureCount = 0;

  if (geoJson.type === 'Feature') {
    var polygonStats = getPolygonalStats(geoJson.geometry);
    pointCount = polygonStats.pointCount;
    ringCount = polygonStats.ringCount;
    polygonCount = polygonStats.polygonCount;
    featureCount = 1;
  } else {
    var _iterator2 = _createForOfIteratorHelper(geoJson.features),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var feature = _step2.value;

        var _polygonStats = getPolygonalStats(feature.geometry);

        pointCount += _polygonStats.pointCount;
        ringCount += _polygonStats.ringCount;
        polygonCount += _polygonStats.polygonCount;
        featureCount++;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  var stats = "Features: ".concat(featureCount, "\nPolygons: ").concat(polygonCount, "\nRings: ").concat(ringCount, "\nPoints: ").concat(pointCount);
  return {
    data: stats,
    filename: "".concat(filename, ".txt"),
    mimetype: 'text/plain'
  };
}

function getPolygonalStats(geometry) {
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
    return {
      pointCount: -1,
      ringCount: -1,
      polygonCount: -1
    };
  }

  var polygonal = geometry;
  var pointCount = 0;
  var ringCount = 0;
  var polygonCount = 0;

  var _iterator3 = _createForOfIteratorHelper(polygonal.coordinates),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var ringOrPolygon = _step3.value;

      if (geometry.type === 'Polygon') {
        polygonCount = 1;
        ringCount++;
        pointCount += ringOrPolygon.length;
      } else if (geometry.type === 'MultiPolygon') {
        polygonCount++;

        var _iterator4 = _createForOfIteratorHelper(ringOrPolygon),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var ring = _step4.value;
            ringCount++;
            pointCount += ring.length;
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return {
    pointCount: pointCount,
    ringCount: ringCount,
    polygonCount: polygonCount
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZXhwb3J0ZXIudHMiXSwibmFtZXMiOlsidG9HZW9Kc29uIiwiZ2VvSnNvbiIsImZpbGVuYW1lIiwiZGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJtaW1ldHlwZSIsInRvS21sIiwidHlwZSIsImZlYXR1cmVzIiwiZm9yRWFjaCIsImYiLCJwcm9wZXJ0aWVzIiwia21sU3RyaW5nIiwidG9Xa3QiLCJ3a3QiLCJmZWF0dXJlIiwibGVuZ3RoIiwic3Vic3RyaW5nIiwidG9TdGF0cyIsInBvaW50Q291bnQiLCJyaW5nQ291bnQiLCJwb2x5Z29uQ291bnQiLCJmZWF0dXJlQ291bnQiLCJwb2x5Z29uU3RhdHMiLCJnZXRQb2x5Z29uYWxTdGF0cyIsImdlb21ldHJ5Iiwic3RhdHMiLCJwb2x5Z29uYWwiLCJjb29yZGluYXRlcyIsInJpbmdPclBvbHlnb24iLCJyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7QUFVTyxTQUFTQSxTQUFULENBQW1CQyxPQUFuQixFQUF3Q0MsUUFBeEMsRUFBNEU7QUFDakYsU0FBTztBQUNMQyxJQUFBQSxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBTCxDQUFlSixPQUFmLEVBQXdCLElBQXhCLEVBQThCLENBQTlCLENBREQ7QUFFTEMsSUFBQUEsUUFBUSxZQUFLQSxRQUFMLGFBRkg7QUFHTEksSUFBQUEsUUFBUSxFQUFFO0FBSEwsR0FBUDtBQUtEOztBQUVNLFNBQVNDLEtBQVQsQ0FBZU4sT0FBZixFQUFvQ0MsUUFBcEMsRUFBd0U7QUFDN0U7QUFDQTtBQUNBLE1BQUlELE9BQU8sQ0FBQ08sSUFBUixLQUFpQixtQkFBckIsRUFBMEM7QUFDeENQLElBQUFBLE9BQU8sQ0FBQ1EsUUFBUixDQUFpQkMsT0FBakIsQ0FBeUIsVUFBQ0MsQ0FBRCxFQUFPO0FBQzlCQSxNQUFBQSxDQUFDLENBQUNDLFVBQUYsR0FBZUQsQ0FBQyxDQUFDQyxVQUFGLElBQWdCLEVBQS9CO0FBQ0QsS0FG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YXBodWJzL3Rva21sJztcbmltcG9ydCB7IHN0cmluZ2lmeSBhcyBzdHJpbmdpZnlXa3QgfSBmcm9tICd3ZWxsa25vd24nO1xuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IHsgQW55R2VvSnNvbiwgR2VvbWV0cnksIFBvbHlnb25hbEdlb21ldHJ5IH0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcblxuZXhwb3J0IHR5cGUgRXhwb3J0UGFyYW1ldGVycyA9IHtcbiAgZGF0YTogc3RyaW5nO1xuICBmaWxlbmFtZTogc3RyaW5nO1xuICBtaW1ldHlwZTogc3RyaW5nO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvR2VvSnNvbihnZW9Kc29uOiBBbnlHZW9Kc29uLCBmaWxlbmFtZTogc3RyaW5nKTogRXhwb3J0UGFyYW1ldGVycyB7XG4gIHJldHVybiB7XG4gICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZ2VvSnNvbiwgbnVsbCwgMiksXG4gICAgZmlsZW5hbWU6IGAke2ZpbGVuYW1lfS5nZW9qc29uYCxcbiAgICBtaW1ldHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9LbWwoZ2VvSnNvbjogQW55R2VvSnNvbiwgZmlsZW5hbWU6IHN0cmluZyk6IEV4cG9ydFBhcmFtZXRlcnMge1xuICAvLyBGb3Igc29tZSByZWFzb24sIGdvb2dsZSBtYXBzIGRvZXNuJ3Qgc3VyZmFjZSBpZCB1bmxlc3MgaXQgaXMgaW4gdGhlIHByb3BlcnRpZXNcbiAgLy8gU28sIHB1dCBpdCBhbHNvIGluIHByb3BlcnRpZXNcbiAgaWYgKGdlb0pzb24udHlwZSA9PT0gJ0ZlYXR1cmVDb2xsZWN0aW9uJykge1xuICAgIGdlb0pzb24uZmVhdHVyZXMuZm9yRWFjaCgoZikgPT4ge1xuICAgICAgZi5wcm9wZXJ0aWVzID0gZi5wcm9wZXJ0aWVzIHx8IHt9O1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3Qga21sU3RyaW5nID0gdG9rbWwoZ2VvSnNvbik7XG5cbiAgLy8ga21sU3RyaW5nID0gYWRkSWRUb0ttbChnZW9Kc29uLCBrbWxTdHJpbmcpO1xuXG4gIHJldHVybiB7XG4gICAgZGF0YToga21sU3RyaW5nLFxuICAgIGZpbGVuYW1lOiBgJHtmaWxlbmFtZX0ua21sYCxcbiAgICBtaW1ldHlwZTogJ2FwcGxpY2F0aW9uL3htbCcsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1drdChnZW9Kc29uOiBBbnlHZW9Kc29uLCBmaWxlbmFtZTogc3RyaW5nKTogRXhwb3J0UGFyYW1ldGVycyB7XG4gIGxldCB3a3QgPSAnJztcbiAgaWYgKGdlb0pzb24udHlwZSA9PT0gJ0ZlYXR1cmUnKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHdrdCA9IHN0cmluZ2lmeVdrdChnZW9Kc29uKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBmZWF0dXJlIGNvbGxlY3Rpb25cbiAgICB3a3QgPSAnJztcbiAgICBmb3IgKGNvbnN0IGZlYXR1cmUgb2YgZ2VvSnNvbi5mZWF0dXJlcykge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgd2t0ICs9IGAke3N0cmluZ2lmeVdrdChmZWF0dXJlKX1cXG5gO1xuICAgIH1cbiAgICBpZiAod2t0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHdrdCA9IHdrdC5zdWJzdHJpbmcoMCwgd2t0Lmxlbmd0aCAtIDEpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGF0YTogd2t0LFxuICAgIGZpbGVuYW1lOiBgJHtmaWxlbmFtZX0ud2t0YCxcbiAgICBtaW1ldHlwZTogJ3RleHQvcGxhaW4nLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9TdGF0cyhnZW9Kc29uOiBBbnlHZW9Kc29uLCBmaWxlbmFtZTogc3RyaW5nKTogRXhwb3J0UGFyYW1ldGVycyB7XG4gIGxldCBwb2ludENvdW50ID0gMDtcbiAgbGV0IHJpbmdDb3VudCA9IDA7XG4gIGxldCBwb2x5Z29uQ291bnQgPSAwO1xuICBsZXQgZmVhdHVyZUNvdW50ID0gMDtcblxuICBpZiAoZ2VvSnNvbi50eXBlID09PSAnRmVhdHVyZScpIHtcbiAgICBjb25zdCBwb2x5Z29uU3RhdHMgPSBnZXRQb2x5Z29uYWxTdGF0cyhnZW9Kc29uLmdlb21ldHJ5KTtcbiAgICAoeyBwb2ludENvdW50LCByaW5nQ291bnQsIHBvbHlnb25Db3VudCB9ID0gcG9seWdvblN0YXRzKTtcbiAgICBmZWF0dXJlQ291bnQgPSAxO1xuICB9IGVsc2Uge1xuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBnZW9Kc29uLmZlYXR1cmVzKSB7XG4gICAgICBjb25zdCBwb2x5Z29uU3RhdHMgPSBnZXRQb2x5Z29uYWxTdGF0cyhmZWF0dXJlLmdlb21ldHJ5KTtcbiAgICAgIHBvaW50Q291bnQgKz0gcG9seWdvblN0YXRzLnBvaW50Q291bnQ7XG4gICAgICByaW5nQ291bnQgKz0gcG9seWdvblN0YXRzLnJpbmdDb3VudDtcbiAgICAgIHBvbHlnb25Db3VudCArPSBwb2x5Z29uU3RhdHMucG9seWdvbkNvdW50O1xuICAgICAgZmVhdHVyZUNvdW50Kys7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3RhdHMgPSBgRmVhdHVyZXM6ICR7ZmVhdHVyZUNvdW50fVxuUG9seWdvbnM6ICR7cG9seWdvbkNvdW50fVxuUmluZ3M6ICR7cmluZ0NvdW50fVxuUG9pbnRzOiAke3BvaW50Q291bnR9YDtcblxuICByZXR1cm4ge1xuICAgIGRhdGE6IHN0YXRzLFxuICAgIGZpbGVuYW1lOiBgJHtmaWxlbmFtZX0udHh0YCxcbiAgICBtaW1ldHlwZTogJ3RleHQvcGxhaW4nLFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRQb2x5Z29uYWxTdGF0cyhnZW9tZXRyeTogR2VvbWV0cnkpIHtcbiAgaWYgKGdlb21ldHJ5LnR5cGUgIT09ICdQb2x5Z29uJyAmJiBnZW9tZXRyeS50eXBlICE9PSAnTXVsdGlQb2x5Z29uJykge1xuICAgIHJldHVybiB7XG4gICAgICBwb2ludENvdW50OiAtMSxcbiAgICAgIHJpbmdDb3VudDogLTEsXG4gICAgICBwb2x5Z29uQ291bnQ6IC0xLFxuICAgIH07XG4gIH1cblxuICBjb25zdCBwb2x5Z29uYWw6IFBvbHlnb25hbEdlb21ldHJ5ID0gZ2VvbWV0cnk7XG5cbiAgbGV0IHBvaW50Q291bnQgPSAwO1xuICBsZXQgcmluZ0NvdW50ID0gMDtcbiAgbGV0IHBvbHlnb25Db3VudCA9IDA7XG4gIGZvciAoY29uc3QgcmluZ09yUG9seWdvbiBvZiBwb2x5Z29uYWwuY29vcmRpbmF0ZXMpIHtcbiAgICBpZiAoZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICBwb2x5Z29uQ291bnQgPSAxO1xuICAgICAgcmluZ0NvdW50Kys7XG4gICAgICBwb2ludENvdW50ICs9IHJpbmdPclBvbHlnb24ubGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAoZ2VvbWV0cnkudHlwZSA9PT0gJ011bHRpUG9seWdvbicpIHtcbiAgICAgIHBvbHlnb25Db3VudCsrO1xuICAgICAgZm9yIChjb25zdCByaW5nIG9mIHJpbmdPclBvbHlnb24pIHtcbiAgICAgICAgcmluZ0NvdW50Kys7XG4gICAgICAgIHBvaW50Q291bnQgKz0gcmluZy5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgcG9pbnRDb3VudCxcbiAgICByaW5nQ291bnQsXG4gICAgcG9seWdvbkNvdW50LFxuICB9O1xufVxuIl19