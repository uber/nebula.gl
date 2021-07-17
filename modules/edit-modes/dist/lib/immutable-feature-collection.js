"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImmutableFeatureCollection = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ImmutableFeatureCollection = /*#__PURE__*/function () {
  function ImmutableFeatureCollection(featureCollection) {
    _classCallCheck(this, ImmutableFeatureCollection);

    _defineProperty(this, "featureCollection", void 0);

    this.featureCollection = featureCollection;
  }

  _createClass(ImmutableFeatureCollection, [{
    key: "getObject",
    value: function getObject() {
      return this.featureCollection;
    }
    /**
     * Replaces the position deeply nested withing the given feature's geometry.
     * Works with Point, MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
     *
     * @param featureIndex The index of the feature to update
     * @param positionIndexes An array containing the indexes of the position to replace
     * @param updatedPosition The updated position to place in the result (i.e. [lng, lat])
     *
     * @returns A new `ImmutableFeatureCollection` with the given position replaced. Does not modify this `ImmutableFeatureCollection`.
     */

  }, {
    key: "replacePosition",
    value: function replacePosition(featureIndex, positionIndexes, updatedPosition) {
      var geometry = this.featureCollection.features[featureIndex].geometry;
      var isPolygonal = geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';

      var updatedGeometry = _objectSpread({}, geometry, {
        coordinates: immutablyReplacePosition(geometry.coordinates, positionIndexes, updatedPosition, isPolygonal)
      });

      return this.replaceGeometry(featureIndex, updatedGeometry);
    }
    /**
     * Removes a position deeply nested in a GeoJSON geometry coordinates array.
     * Works with MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
     *
     * @param featureIndex The index of the feature to update
     * @param positionIndexes An array containing the indexes of the postion to remove
     *
     * @returns A new `ImmutableFeatureCollection` with the given coordinate removed. Does not modify this `ImmutableFeatureCollection`.
     */

  }, {
    key: "removePosition",
    value: function removePosition(featureIndex, positionIndexes) {
      var geometry = this.featureCollection.features[featureIndex].geometry;

      if (geometry.type === 'Point') {
        throw Error("Can't remove a position from a Point or there'd be nothing left");
      }

      if (geometry.type === 'MultiPoint' && // only 1 point left
      geometry.coordinates.length < 2) {
        throw Error("Can't remove the last point of a MultiPoint or there'd be nothing left");
      }

      if (geometry.type === 'LineString' && // only 2 positions
      geometry.coordinates.length < 3) {
        throw Error("Can't remove position. LineString must have at least two positions");
      }

      if (geometry.type === 'Polygon' && // outer ring is a triangle
      geometry.coordinates[0].length < 5 && Array.isArray(positionIndexes) && // trying to remove from outer ring
      positionIndexes[0] === 0) {
        throw Error("Can't remove position. Polygon's outer ring must have at least four positions");
      }

      if (geometry.type === 'MultiLineString' && // only 1 LineString left
      geometry.coordinates.length === 1 && // only 2 positions
      geometry.coordinates[0].length < 3) {
        throw Error("Can't remove position. MultiLineString must have at least two positions");
      }

      if (geometry.type === 'MultiPolygon' && // only 1 polygon left
      geometry.coordinates.length === 1 && // outer ring is a triangle
      geometry.coordinates[0][0].length < 5 && Array.isArray(positionIndexes) && // trying to remove from first polygon
      positionIndexes[0] === 0 && // trying to remove from outer ring
      positionIndexes[1] === 0) {
        throw Error("Can't remove position. MultiPolygon's outer ring must have at least four positions");
      }

      var isPolygonal = geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';

      var updatedGeometry = _objectSpread({}, geometry, {
        coordinates: immutablyRemovePosition(geometry.coordinates, positionIndexes, isPolygonal)
      }); // Handle cases where incomplete geometries need pruned (e.g. holes that were triangles)


      pruneGeometryIfNecessary(updatedGeometry);
      return this.replaceGeometry(featureIndex, updatedGeometry);
    }
    /**
     * Adds a position deeply nested in a GeoJSON geometry coordinates array.
     * Works with MultiPoint, LineString, MultiLineString, Polygon, and MultiPolygon.
     *
     * @param featureIndex The index of the feature to update
     * @param positionIndexes An array containing the indexes of the position that will proceed the new position
     * @param positionToAdd The new position to place in the result (i.e. [lng, lat])
     *
     * @returns A new `ImmutableFeatureCollection` with the given coordinate removed. Does not modify this `ImmutableFeatureCollection`.
     */

  }, {
    key: "addPosition",
    value: function addPosition(featureIndex, positionIndexes, positionToAdd) {
      var geometry = this.featureCollection.features[featureIndex].geometry;

      if (geometry.type === 'Point') {
        throw new Error('Unable to add a position to a Point feature');
      }

      var isPolygonal = geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';

      var updatedGeometry = _objectSpread({}, geometry, {
        coordinates: immutablyAddPosition(geometry.coordinates, positionIndexes, positionToAdd, isPolygonal)
      });

      return this.replaceGeometry(featureIndex, updatedGeometry);
    }
  }, {
    key: "replaceGeometry",
    value: function replaceGeometry(featureIndex, geometry) {
      var updatedFeature = _objectSpread({}, this.featureCollection.features[featureIndex], {
        geometry: geometry
      });

      var updatedFeatureCollection = _objectSpread({}, this.featureCollection, {
        features: [].concat(_toConsumableArray(this.featureCollection.features.slice(0, featureIndex)), [updatedFeature], _toConsumableArray(this.featureCollection.features.slice(featureIndex + 1)))
      });

      return new ImmutableFeatureCollection(updatedFeatureCollection);
    }
  }, {
    key: "addFeature",
    value: function addFeature(feature) {
      return this.addFeatures([feature]);
    }
  }, {
    key: "addFeatures",
    value: function addFeatures(features) {
      var updatedFeatureCollection = _objectSpread({}, this.featureCollection, {
        features: [].concat(_toConsumableArray(this.featureCollection.features), _toConsumableArray(features))
      });

      return new ImmutableFeatureCollection(updatedFeatureCollection);
    }
  }, {
    key: "deleteFeature",
    value: function deleteFeature(featureIndex) {
      return this.deleteFeatures([featureIndex]);
    }
  }, {
    key: "deleteFeatures",
    value: function deleteFeatures(featureIndexes) {
      var features = _toConsumableArray(this.featureCollection.features);

      featureIndexes.sort();

      for (var i = featureIndexes.length - 1; i >= 0; i--) {
        var featureIndex = featureIndexes[i];

        if (featureIndex >= 0 && featureIndex < features.length) {
          features.splice(featureIndex, 1);
        }
      }

      var updatedFeatureCollection = _objectSpread({}, this.featureCollection, {
        features: features
      });

      return new ImmutableFeatureCollection(updatedFeatureCollection);
    }
  }]);

  return ImmutableFeatureCollection;
}();

exports.ImmutableFeatureCollection = ImmutableFeatureCollection;

function getUpdatedPosition(updatedPosition, previousPosition) {
  // This function checks if the updatedPosition is missing elevation
  // and copies it from previousPosition
  if (updatedPosition.length === 2 && previousPosition.length === 3) {
    var elevation = previousPosition[2];
    return [updatedPosition[0], updatedPosition[1], elevation];
  }

  return updatedPosition;
}

function immutablyReplacePosition(coordinates, positionIndexes, updatedPosition, isPolygonal) {
  if (!positionIndexes) {
    return coordinates;
  }

  if (positionIndexes.length === 0) {
    return getUpdatedPosition(updatedPosition, coordinates);
  }

  if (positionIndexes.length === 1) {
    var updated = [].concat(_toConsumableArray(coordinates.slice(0, positionIndexes[0])), [getUpdatedPosition(updatedPosition, coordinates[positionIndexes[0]])], _toConsumableArray(coordinates.slice(positionIndexes[0] + 1)));

    if (isPolygonal && (positionIndexes[0] === 0 || positionIndexes[0] === coordinates.length - 1)) {
      // for polygons, the first point is repeated at the end of the array
      // so, update it on both ends of the array
      updated[0] = getUpdatedPosition(updatedPosition, coordinates[0]);
      updated[coordinates.length - 1] = getUpdatedPosition(updatedPosition, coordinates[0]);
    }

    return updated;
  } // recursively update inner array


  return [].concat(_toConsumableArray(coordinates.slice(0, positionIndexes[0])), [immutablyReplacePosition(coordinates[positionIndexes[0]], positionIndexes.slice(1, positionIndexes.length), updatedPosition, isPolygonal)], _toConsumableArray(coordinates.slice(positionIndexes[0] + 1)));
}

function immutablyRemovePosition(coordinates, positionIndexes, isPolygonal) {
  if (!positionIndexes) {
    return coordinates;
  }

  if (positionIndexes.length === 0) {
    throw Error('Must specify the index of the position to remove');
  }

  if (positionIndexes.length === 1) {
    var updated = [].concat(_toConsumableArray(coordinates.slice(0, positionIndexes[0])), _toConsumableArray(coordinates.slice(positionIndexes[0] + 1)));

    if (isPolygonal && (positionIndexes[0] === 0 || positionIndexes[0] === coordinates.length - 1)) {
      // for polygons, the first point is repeated at the end of the array
      // so, if the first/last coordinate is to be removed, coordinates[1] will be the new first/last coordinate
      if (positionIndexes[0] === 0) {
        // change the last to be the same as the first
        updated[updated.length - 1] = updated[0];
      } else if (positionIndexes[0] === coordinates.length - 1) {
        // change the first to be the same as the last
        updated[0] = updated[updated.length - 1];
      }
    }

    return updated;
  } // recursively update inner array


  return [].concat(_toConsumableArray(coordinates.slice(0, positionIndexes[0])), [immutablyRemovePosition(coordinates[positionIndexes[0]], positionIndexes.slice(1, positionIndexes.length), isPolygonal)], _toConsumableArray(coordinates.slice(positionIndexes[0] + 1)));
}

function immutablyAddPosition(coordinates, positionIndexes, positionToAdd, isPolygonal) {
  if (!positionIndexes) {
    return coordinates;
  }

  if (positionIndexes.length === 0) {
    throw Error('Must specify the index of the position to remove');
  }

  if (positionIndexes.length === 1) {
    var updated = [].concat(_toConsumableArray(coordinates.slice(0, positionIndexes[0])), [positionToAdd], _toConsumableArray(coordinates.slice(positionIndexes[0])));
    return updated;
  } // recursively update inner array


  return [].concat(_toConsumableArray(coordinates.slice(0, positionIndexes[0])), [immutablyAddPosition(coordinates[positionIndexes[0]], positionIndexes.slice(1, positionIndexes.length), positionToAdd, isPolygonal)], _toConsumableArray(coordinates.slice(positionIndexes[0] + 1)));
}

function pruneGeometryIfNecessary(geometry) {
  switch (geometry.type) {
    case 'Polygon':
      prunePolygonIfNecessary(geometry);
      break;

    case 'MultiLineString':
      pruneMultiLineStringIfNecessary(geometry);
      break;

    case 'MultiPolygon':
      pruneMultiPolygonIfNecessary(geometry);
      break;

    default:
      // Not downgradable
      break;
  }
}

function prunePolygonIfNecessary(geometry) {
  var polygon = geometry.coordinates; // If any hole is no longer a polygon, remove the hole entirely

  for (var holeIndex = 1; holeIndex < polygon.length; holeIndex++) {
    if (removeHoleIfNecessary(polygon, holeIndex)) {
      // It was removed, so keep the index the same
      holeIndex--;
    }
  }
}

function pruneMultiLineStringIfNecessary(geometry) {
  for (var lineStringIndex = 0; lineStringIndex < geometry.coordinates.length; lineStringIndex++) {
    var lineString = geometry.coordinates[lineStringIndex];

    if (lineString.length === 1) {
      // Only a single position left on this LineString, so remove it (can't have Point in MultiLineString)
      geometry.coordinates.splice(lineStringIndex, 1); // Keep the index the same

      lineStringIndex--;
    }
  }
}

function pruneMultiPolygonIfNecessary(geometry) {
  for (var polygonIndex = 0; polygonIndex < geometry.coordinates.length; polygonIndex++) {
    var polygon = geometry.coordinates[polygonIndex];
    var outerRing = polygon[0]; // If the outer ring is no longer a polygon, remove the whole polygon

    if (outerRing.length <= 3) {
      geometry.coordinates.splice(polygonIndex, 1); // It was removed, so keep the index the same

      polygonIndex--;
    }

    for (var holeIndex = 1; holeIndex < polygon.length; holeIndex++) {
      if (removeHoleIfNecessary(polygon, holeIndex)) {
        // It was removed, so keep the index the same
        holeIndex--;
      }
    }
  }
}

function removeHoleIfNecessary(polygon, holeIndex) {
  var hole = polygon[holeIndex];

  if (hole.length <= 3) {
    polygon.splice(holeIndex, 1);
    return true;
  }

  return false;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaW1tdXRhYmxlLWZlYXR1cmUtY29sbGVjdGlvbi50cyJdLCJuYW1lcyI6WyJJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiIsImZlYXR1cmVDb2xsZWN0aW9uIiwiZmVhdHVyZUluZGV4IiwicG9zaXRpb25JbmRleGVzIiwidXBkYXRlZFBvc2l0aW9uIiwiZ2VvbWV0cnkiLCJmZWF0dXJlcyIsImlzUG9seWdvbmFsIiwidHlwZSIsInVwZGF0ZWRHZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiaW1tdXRhYmx5UmVwbGFjZVBvc2l0aW9uIiwicmVwbGFjZUdlb21ldHJ5IiwiRXJyb3IiLCJsZW5ndGgiLCJBcnJheSIsImlzQXJyYXkiLCJpbW11dGFibHlSZW1vdmVQb3NpdGlvbiIsInBydW5lR2VvbWV0cnlJZk5lY2Vzc2FyeSIsInBvc2l0aW9uVG9BZGQiLCJpbW11dGFibHlBZGRQb3NpdGlvbiIsInVwZGF0ZWRGZWF0dXJlIiwidXBkYXRlZEZlYXR1cmVDb2xsZWN0aW9uIiwic2xpY2UiLCJmZWF0dXJlIiwiYWRkRmVhdHVyZXMiLCJkZWxldGVGZWF0dXJlcyIsImZlYXR1cmVJbmRleGVzIiwic29ydCIsImkiLCJzcGxpY2UiLCJnZXRVcGRhdGVkUG9zaXRpb24iLCJwcmV2aW91c1Bvc2l0aW9uIiwiZWxldmF0aW9uIiwidXBkYXRlZCIsInBydW5lUG9seWdvbklmTmVjZXNzYXJ5IiwicHJ1bmVNdWx0aUxpbmVTdHJpbmdJZk5lY2Vzc2FyeSIsInBydW5lTXVsdGlQb2x5Z29uSWZOZWNlc3NhcnkiLCJwb2x5Z29uIiwiaG9sZUluZGV4IiwicmVtb3ZlSG9sZUlmTmVjZXNzYXJ5IiwibGluZVN0cmluZ0luZGV4IiwibGluZVN0cmluZyIsInBvbHlnb25JbmRleCIsIm91dGVyUmluZyIsImhvbGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFXYUEsMEI7QUFHWCxzQ0FBWUMsaUJBQVosRUFBa0Q7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S0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRmVhdHVyZSxcbiAgRmVhdHVyZUNvbGxlY3Rpb24sXG4gIEdlb21ldHJ5LFxuICBQb2x5Z29uLFxuICBNdWx0aUxpbmVTdHJpbmcsXG4gIE11bHRpUG9seWdvbixcbiAgUG9zaXRpb24sXG4gIFBvbHlnb25Db29yZGluYXRlcyxcbn0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB7XG4gIGZlYXR1cmVDb2xsZWN0aW9uOiBGZWF0dXJlQ29sbGVjdGlvbjtcblxuICBjb25zdHJ1Y3RvcihmZWF0dXJlQ29sbGVjdGlvbjogRmVhdHVyZUNvbGxlY3Rpb24pIHtcbiAgICB0aGlzLmZlYXR1cmVDb2xsZWN0aW9uID0gZmVhdHVyZUNvbGxlY3Rpb247XG4gIH1cblxuICBnZXRPYmplY3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmVhdHVyZUNvbGxlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZXMgdGhlIHBvc2l0aW9uIGRlZXBseSBuZXN0ZWQgd2l0aGluZyB0aGUgZ2l2ZW4gZmVhdHVyZSdzIGdlb21ldHJ5LlxuICAgKiBXb3JrcyB3aXRoIFBvaW50LCBNdWx0aVBvaW50LCBMaW5lU3RyaW5nLCBNdWx0aUxpbmVTdHJpbmcsIFBvbHlnb24sIGFuZCBNdWx0aVBvbHlnb24uXG4gICAqXG4gICAqIEBwYXJhbSBmZWF0dXJlSW5kZXggVGhlIGluZGV4IG9mIHRoZSBmZWF0dXJlIHRvIHVwZGF0ZVxuICAgKiBAcGFyYW0gcG9zaXRpb25JbmRleGVzIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGluZGV4ZXMgb2YgdGhlIHBvc2l0aW9uIHRvIHJlcGxhY2VcbiAgICogQHBhcmFtIHVwZGF0ZWRQb3NpdGlvbiBUaGUgdXBkYXRlZCBwb3NpdGlvbiB0byBwbGFjZSBpbiB0aGUgcmVzdWx0IChpLmUuIFtsbmcsIGxhdF0pXG4gICAqXG4gICAqIEByZXR1cm5zIEEgbmV3IGBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbmAgd2l0aCB0aGUgZ2l2ZW4gcG9zaXRpb24gcmVwbGFjZWQuIERvZXMgbm90IG1vZGlmeSB0aGlzIGBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbmAuXG4gICAqL1xuICByZXBsYWNlUG9zaXRpb24oXG4gICAgZmVhdHVyZUluZGV4OiBudW1iZXIsXG4gICAgcG9zaXRpb25JbmRleGVzOiBudW1iZXJbXSB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgdXBkYXRlZFBvc2l0aW9uOiBQb3NpdGlvblxuICApOiBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSB0aGlzLmZlYXR1cmVDb2xsZWN0aW9uLmZlYXR1cmVzW2ZlYXR1cmVJbmRleF0uZ2VvbWV0cnk7XG5cbiAgICBjb25zdCBpc1BvbHlnb25hbCA9IGdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJyB8fCBnZW9tZXRyeS50eXBlID09PSAnTXVsdGlQb2x5Z29uJztcbiAgICBjb25zdCB1cGRhdGVkR2VvbWV0cnk6IGFueSA9IHtcbiAgICAgIC4uLmdlb21ldHJ5LFxuICAgICAgY29vcmRpbmF0ZXM6IGltbXV0YWJseVJlcGxhY2VQb3NpdGlvbihcbiAgICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgIHBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgdXBkYXRlZFBvc2l0aW9uLFxuICAgICAgICBpc1BvbHlnb25hbFxuICAgICAgKSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMucmVwbGFjZUdlb21ldHJ5KGZlYXR1cmVJbmRleCwgdXBkYXRlZEdlb21ldHJ5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgcG9zaXRpb24gZGVlcGx5IG5lc3RlZCBpbiBhIEdlb0pTT04gZ2VvbWV0cnkgY29vcmRpbmF0ZXMgYXJyYXkuXG4gICAqIFdvcmtzIHdpdGggTXVsdGlQb2ludCwgTGluZVN0cmluZywgTXVsdGlMaW5lU3RyaW5nLCBQb2x5Z29uLCBhbmQgTXVsdGlQb2x5Z29uLlxuICAgKlxuICAgKiBAcGFyYW0gZmVhdHVyZUluZGV4IFRoZSBpbmRleCBvZiB0aGUgZmVhdHVyZSB0byB1cGRhdGVcbiAgICogQHBhcmFtIHBvc2l0aW9uSW5kZXhlcyBBbiBhcnJheSBjb250YWluaW5nIHRoZSBpbmRleGVzIG9mIHRoZSBwb3N0aW9uIHRvIHJlbW92ZVxuICAgKlxuICAgKiBAcmV0dXJucyBBIG5ldyBgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb25gIHdpdGggdGhlIGdpdmVuIGNvb3JkaW5hdGUgcmVtb3ZlZC4gRG9lcyBub3QgbW9kaWZ5IHRoaXMgYEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uYC5cbiAgICovXG4gIHJlbW92ZVBvc2l0aW9uKFxuICAgIGZlYXR1cmVJbmRleDogbnVtYmVyLFxuICAgIHBvc2l0aW9uSW5kZXhlczogbnVtYmVyW10gfCBudWxsIHwgdW5kZWZpbmVkXG4gICk6IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICBjb25zdCBnZW9tZXRyeSA9IHRoaXMuZmVhdHVyZUNvbGxlY3Rpb24uZmVhdHVyZXNbZmVhdHVyZUluZGV4XS5nZW9tZXRyeTtcblxuICAgIGlmIChnZW9tZXRyeS50eXBlID09PSAnUG9pbnQnKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2FuJ3QgcmVtb3ZlIGEgcG9zaXRpb24gZnJvbSBhIFBvaW50IG9yIHRoZXJlJ2QgYmUgbm90aGluZyBsZWZ0YCk7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIGdlb21ldHJ5LnR5cGUgPT09ICdNdWx0aVBvaW50JyAmJiAvLyBvbmx5IDEgcG9pbnQgbGVmdFxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoIDwgMlxuICAgICkge1xuICAgICAgdGhyb3cgRXJyb3IoYENhbid0IHJlbW92ZSB0aGUgbGFzdCBwb2ludCBvZiBhIE11bHRpUG9pbnQgb3IgdGhlcmUnZCBiZSBub3RoaW5nIGxlZnRgKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnICYmIC8vIG9ubHkgMiBwb3NpdGlvbnNcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aCA8IDNcbiAgICApIHtcbiAgICAgIHRocm93IEVycm9yKGBDYW4ndCByZW1vdmUgcG9zaXRpb24uIExpbmVTdHJpbmcgbXVzdCBoYXZlIGF0IGxlYXN0IHR3byBwb3NpdGlvbnNgKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nICYmIC8vIG91dGVyIHJpbmcgaXMgYSB0cmlhbmdsZVxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0ubGVuZ3RoIDwgNSAmJlxuICAgICAgQXJyYXkuaXNBcnJheShwb3NpdGlvbkluZGV4ZXMpICYmIC8vIHRyeWluZyB0byByZW1vdmUgZnJvbSBvdXRlciByaW5nXG4gICAgICBwb3NpdGlvbkluZGV4ZXNbMF0gPT09IDBcbiAgICApIHtcbiAgICAgIHRocm93IEVycm9yKGBDYW4ndCByZW1vdmUgcG9zaXRpb24uIFBvbHlnb24ncyBvdXRlciByaW5nIG11c3QgaGF2ZSBhdCBsZWFzdCBmb3VyIHBvc2l0aW9uc2ApO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICBnZW9tZXRyeS50eXBlID09PSAnTXVsdGlMaW5lU3RyaW5nJyAmJiAvLyBvbmx5IDEgTGluZVN0cmluZyBsZWZ0XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcy5sZW5ndGggPT09IDEgJiYgLy8gb25seSAyIHBvc2l0aW9uc1xuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0ubGVuZ3RoIDwgM1xuICAgICkge1xuICAgICAgdGhyb3cgRXJyb3IoYENhbid0IHJlbW92ZSBwb3NpdGlvbi4gTXVsdGlMaW5lU3RyaW5nIG11c3QgaGF2ZSBhdCBsZWFzdCB0d28gcG9zaXRpb25zYCk7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIGdlb21ldHJ5LnR5cGUgPT09ICdNdWx0aVBvbHlnb24nICYmIC8vIG9ubHkgMSBwb2x5Z29uIGxlZnRcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aCA9PT0gMSAmJiAvLyBvdXRlciByaW5nIGlzIGEgdHJpYW5nbGVcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdWzBdLmxlbmd0aCA8IDUgJiZcbiAgICAgIEFycmF5LmlzQXJyYXkocG9zaXRpb25JbmRleGVzKSAmJiAvLyB0cnlpbmcgdG8gcmVtb3ZlIGZyb20gZmlyc3QgcG9seWdvblxuICAgICAgcG9zaXRpb25JbmRleGVzWzBdID09PSAwICYmIC8vIHRyeWluZyB0byByZW1vdmUgZnJvbSBvdXRlciByaW5nXG4gICAgICBwb3NpdGlvbkluZGV4ZXNbMV0gPT09IDBcbiAgICApIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBgQ2FuJ3QgcmVtb3ZlIHBvc2l0aW9uLiBNdWx0aVBvbHlnb24ncyBvdXRlciByaW5nIG11c3QgaGF2ZSBhdCBsZWFzdCBmb3VyIHBvc2l0aW9uc2BcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgaXNQb2x5Z29uYWwgPSBnZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicgfHwgZ2VvbWV0cnkudHlwZSA9PT0gJ011bHRpUG9seWdvbic7XG4gICAgY29uc3QgdXBkYXRlZEdlb21ldHJ5OiBhbnkgPSB7XG4gICAgICAuLi5nZW9tZXRyeSxcbiAgICAgIGNvb3JkaW5hdGVzOiBpbW11dGFibHlSZW1vdmVQb3NpdGlvbihnZW9tZXRyeS5jb29yZGluYXRlcywgcG9zaXRpb25JbmRleGVzLCBpc1BvbHlnb25hbCksXG4gICAgfTtcblxuICAgIC8vIEhhbmRsZSBjYXNlcyB3aGVyZSBpbmNvbXBsZXRlIGdlb21ldHJpZXMgbmVlZCBwcnVuZWQgKGUuZy4gaG9sZXMgdGhhdCB3ZXJlIHRyaWFuZ2xlcylcbiAgICBwcnVuZUdlb21ldHJ5SWZOZWNlc3NhcnkodXBkYXRlZEdlb21ldHJ5KTtcblxuICAgIHJldHVybiB0aGlzLnJlcGxhY2VHZW9tZXRyeShmZWF0dXJlSW5kZXgsIHVwZGF0ZWRHZW9tZXRyeSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHBvc2l0aW9uIGRlZXBseSBuZXN0ZWQgaW4gYSBHZW9KU09OIGdlb21ldHJ5IGNvb3JkaW5hdGVzIGFycmF5LlxuICAgKiBXb3JrcyB3aXRoIE11bHRpUG9pbnQsIExpbmVTdHJpbmcsIE11bHRpTGluZVN0cmluZywgUG9seWdvbiwgYW5kIE11bHRpUG9seWdvbi5cbiAgICpcbiAgICogQHBhcmFtIGZlYXR1cmVJbmRleCBUaGUgaW5kZXggb2YgdGhlIGZlYXR1cmUgdG8gdXBkYXRlXG4gICAqIEBwYXJhbSBwb3NpdGlvbkluZGV4ZXMgQW4gYXJyYXkgY29udGFpbmluZyB0aGUgaW5kZXhlcyBvZiB0aGUgcG9zaXRpb24gdGhhdCB3aWxsIHByb2NlZWQgdGhlIG5ldyBwb3NpdGlvblxuICAgKiBAcGFyYW0gcG9zaXRpb25Ub0FkZCBUaGUgbmV3IHBvc2l0aW9uIHRvIHBsYWNlIGluIHRoZSByZXN1bHQgKGkuZS4gW2xuZywgbGF0XSlcbiAgICpcbiAgICogQHJldHVybnMgQSBuZXcgYEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uYCB3aXRoIHRoZSBnaXZlbiBjb29yZGluYXRlIHJlbW92ZWQuIERvZXMgbm90IG1vZGlmeSB0aGlzIGBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbmAuXG4gICAqL1xuICBhZGRQb3NpdGlvbihcbiAgICBmZWF0dXJlSW5kZXg6IG51bWJlcixcbiAgICBwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBwb3NpdGlvblRvQWRkOiBQb3NpdGlvblxuICApOiBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSB0aGlzLmZlYXR1cmVDb2xsZWN0aW9uLmZlYXR1cmVzW2ZlYXR1cmVJbmRleF0uZ2VvbWV0cnk7XG5cbiAgICBpZiAoZ2VvbWV0cnkudHlwZSA9PT0gJ1BvaW50Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gYWRkIGEgcG9zaXRpb24gdG8gYSBQb2ludCBmZWF0dXJlJyk7XG4gICAgfVxuXG4gICAgY29uc3QgaXNQb2x5Z29uYWwgPSBnZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicgfHwgZ2VvbWV0cnkudHlwZSA9PT0gJ011bHRpUG9seWdvbic7XG4gICAgY29uc3QgdXBkYXRlZEdlb21ldHJ5OiBhbnkgPSB7XG4gICAgICAuLi5nZW9tZXRyeSxcbiAgICAgIGNvb3JkaW5hdGVzOiBpbW11dGFibHlBZGRQb3NpdGlvbihcbiAgICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgIHBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgcG9zaXRpb25Ub0FkZCxcbiAgICAgICAgaXNQb2x5Z29uYWxcbiAgICAgICksXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnJlcGxhY2VHZW9tZXRyeShmZWF0dXJlSW5kZXgsIHVwZGF0ZWRHZW9tZXRyeSk7XG4gIH1cblxuICByZXBsYWNlR2VvbWV0cnkoZmVhdHVyZUluZGV4OiBudW1iZXIsIGdlb21ldHJ5OiBHZW9tZXRyeSk6IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICBjb25zdCB1cGRhdGVkRmVhdHVyZTogYW55ID0ge1xuICAgICAgLi4udGhpcy5mZWF0dXJlQ29sbGVjdGlvbi5mZWF0dXJlc1tmZWF0dXJlSW5kZXhdLFxuICAgICAgZ2VvbWV0cnksXG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZWRGZWF0dXJlQ29sbGVjdGlvbiA9IHtcbiAgICAgIC4uLnRoaXMuZmVhdHVyZUNvbGxlY3Rpb24sXG4gICAgICBmZWF0dXJlczogW1xuICAgICAgICAuLi50aGlzLmZlYXR1cmVDb2xsZWN0aW9uLmZlYXR1cmVzLnNsaWNlKDAsIGZlYXR1cmVJbmRleCksXG4gICAgICAgIHVwZGF0ZWRGZWF0dXJlLFxuICAgICAgICAuLi50aGlzLmZlYXR1cmVDb2xsZWN0aW9uLmZlYXR1cmVzLnNsaWNlKGZlYXR1cmVJbmRleCArIDEpLFxuICAgICAgXSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbih1cGRhdGVkRmVhdHVyZUNvbGxlY3Rpb24pO1xuICB9XG5cbiAgYWRkRmVhdHVyZShmZWF0dXJlOiBGZWF0dXJlKTogSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLmFkZEZlYXR1cmVzKFtmZWF0dXJlXSk7XG4gIH1cblxuICBhZGRGZWF0dXJlcyhmZWF0dXJlczogRmVhdHVyZVtdKTogSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIGNvbnN0IHVwZGF0ZWRGZWF0dXJlQ29sbGVjdGlvbiA9IHtcbiAgICAgIC4uLnRoaXMuZmVhdHVyZUNvbGxlY3Rpb24sXG4gICAgICBmZWF0dXJlczogWy4uLnRoaXMuZmVhdHVyZUNvbGxlY3Rpb24uZmVhdHVyZXMsIC4uLmZlYXR1cmVzXSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbih1cGRhdGVkRmVhdHVyZUNvbGxlY3Rpb24pO1xuICB9XG5cbiAgZGVsZXRlRmVhdHVyZShmZWF0dXJlSW5kZXg6IG51bWJlcikge1xuICAgIHJldHVybiB0aGlzLmRlbGV0ZUZlYXR1cmVzKFtmZWF0dXJlSW5kZXhdKTtcbiAgfVxuXG4gIGRlbGV0ZUZlYXR1cmVzKGZlYXR1cmVJbmRleGVzOiBudW1iZXJbXSkge1xuICAgIGNvbnN0IGZlYXR1cmVzID0gWy4uLnRoaXMuZmVhdHVyZUNvbGxlY3Rpb24uZmVhdHVyZXNdO1xuICAgIGZlYXR1cmVJbmRleGVzLnNvcnQoKTtcbiAgICBmb3IgKGxldCBpID0gZmVhdHVyZUluZGV4ZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IGZlYXR1cmVJbmRleGVzW2ldO1xuICAgICAgaWYgKGZlYXR1cmVJbmRleCA+PSAwICYmIGZlYXR1cmVJbmRleCA8IGZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICBmZWF0dXJlcy5zcGxpY2UoZmVhdHVyZUluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGVkRmVhdHVyZUNvbGxlY3Rpb24gPSB7XG4gICAgICAuLi50aGlzLmZlYXR1cmVDb2xsZWN0aW9uLFxuICAgICAgZmVhdHVyZXMsXG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24odXBkYXRlZEZlYXR1cmVDb2xsZWN0aW9uKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRVcGRhdGVkUG9zaXRpb24odXBkYXRlZFBvc2l0aW9uOiBQb3NpdGlvbiwgcHJldmlvdXNQb3NpdGlvbjogUG9zaXRpb24pOiBQb3NpdGlvbiB7XG4gIC8vIFRoaXMgZnVuY3Rpb24gY2hlY2tzIGlmIHRoZSB1cGRhdGVkUG9zaXRpb24gaXMgbWlzc2luZyBlbGV2YXRpb25cbiAgLy8gYW5kIGNvcGllcyBpdCBmcm9tIHByZXZpb3VzUG9zaXRpb25cbiAgaWYgKHVwZGF0ZWRQb3NpdGlvbi5sZW5ndGggPT09IDIgJiYgcHJldmlvdXNQb3NpdGlvbi5sZW5ndGggPT09IDMpIHtcbiAgICBjb25zdCBlbGV2YXRpb24gPSAocHJldmlvdXNQb3NpdGlvbiBhcyBhbnkpWzJdO1xuICAgIHJldHVybiBbdXBkYXRlZFBvc2l0aW9uWzBdLCB1cGRhdGVkUG9zaXRpb25bMV0sIGVsZXZhdGlvbl07XG4gIH1cblxuICByZXR1cm4gdXBkYXRlZFBvc2l0aW9uO1xufVxuXG5mdW5jdGlvbiBpbW11dGFibHlSZXBsYWNlUG9zaXRpb24oXG4gIGNvb3JkaW5hdGVzOiBhbnksXG4gIHBvc2l0aW9uSW5kZXhlczogbnVtYmVyW10gfCBudWxsIHwgdW5kZWZpbmVkLFxuICB1cGRhdGVkUG9zaXRpb246IFBvc2l0aW9uLFxuICBpc1BvbHlnb25hbDogYm9vbGVhblxuKTogYW55IHtcbiAgaWYgKCFwb3NpdGlvbkluZGV4ZXMpIHtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cbiAgaWYgKHBvc2l0aW9uSW5kZXhlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZ2V0VXBkYXRlZFBvc2l0aW9uKHVwZGF0ZWRQb3NpdGlvbiwgY29vcmRpbmF0ZXMpO1xuICB9XG4gIGlmIChwb3NpdGlvbkluZGV4ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgY29uc3QgdXBkYXRlZCA9IFtcbiAgICAgIC4uLmNvb3JkaW5hdGVzLnNsaWNlKDAsIHBvc2l0aW9uSW5kZXhlc1swXSksXG4gICAgICBnZXRVcGRhdGVkUG9zaXRpb24odXBkYXRlZFBvc2l0aW9uLCBjb29yZGluYXRlc1twb3NpdGlvbkluZGV4ZXNbMF1dKSxcbiAgICAgIC4uLmNvb3JkaW5hdGVzLnNsaWNlKHBvc2l0aW9uSW5kZXhlc1swXSArIDEpLFxuICAgIF07XG5cbiAgICBpZiAoXG4gICAgICBpc1BvbHlnb25hbCAmJlxuICAgICAgKHBvc2l0aW9uSW5kZXhlc1swXSA9PT0gMCB8fCBwb3NpdGlvbkluZGV4ZXNbMF0gPT09IGNvb3JkaW5hdGVzLmxlbmd0aCAtIDEpXG4gICAgKSB7XG4gICAgICAvLyBmb3IgcG9seWdvbnMsIHRoZSBmaXJzdCBwb2ludCBpcyByZXBlYXRlZCBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheVxuICAgICAgLy8gc28sIHVwZGF0ZSBpdCBvbiBib3RoIGVuZHMgb2YgdGhlIGFycmF5XG4gICAgICB1cGRhdGVkWzBdID0gZ2V0VXBkYXRlZFBvc2l0aW9uKHVwZGF0ZWRQb3NpdGlvbiwgY29vcmRpbmF0ZXNbMF0pO1xuICAgICAgdXBkYXRlZFtjb29yZGluYXRlcy5sZW5ndGggLSAxXSA9IGdldFVwZGF0ZWRQb3NpdGlvbih1cGRhdGVkUG9zaXRpb24sIGNvb3JkaW5hdGVzWzBdKTtcbiAgICB9XG4gICAgcmV0dXJuIHVwZGF0ZWQ7XG4gIH1cblxuICAvLyByZWN1cnNpdmVseSB1cGRhdGUgaW5uZXIgYXJyYXlcbiAgcmV0dXJuIFtcbiAgICAuLi5jb29yZGluYXRlcy5zbGljZSgwLCBwb3NpdGlvbkluZGV4ZXNbMF0pLFxuICAgIGltbXV0YWJseVJlcGxhY2VQb3NpdGlvbihcbiAgICAgIGNvb3JkaW5hdGVzW3Bvc2l0aW9uSW5kZXhlc1swXV0sXG4gICAgICBwb3NpdGlvbkluZGV4ZXMuc2xpY2UoMSwgcG9zaXRpb25JbmRleGVzLmxlbmd0aCksXG4gICAgICB1cGRhdGVkUG9zaXRpb24sXG4gICAgICBpc1BvbHlnb25hbFxuICAgICksXG4gICAgLi4uY29vcmRpbmF0ZXMuc2xpY2UocG9zaXRpb25JbmRleGVzWzBdICsgMSksXG4gIF07XG59XG5cbmZ1bmN0aW9uIGltbXV0YWJseVJlbW92ZVBvc2l0aW9uKFxuICBjb29yZGluYXRlczogYW55LFxuICBwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgaXNQb2x5Z29uYWw6IGJvb2xlYW5cbik6IGFueSB7XG4gIGlmICghcG9zaXRpb25JbmRleGVzKSB7XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG4gIGlmIChwb3NpdGlvbkluZGV4ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgRXJyb3IoJ011c3Qgc3BlY2lmeSB0aGUgaW5kZXggb2YgdGhlIHBvc2l0aW9uIHRvIHJlbW92ZScpO1xuICB9XG4gIGlmIChwb3NpdGlvbkluZGV4ZXMubGVuZ3RoID09PSAxKSB7XG4gICAgY29uc3QgdXBkYXRlZCA9IFtcbiAgICAgIC4uLmNvb3JkaW5hdGVzLnNsaWNlKDAsIHBvc2l0aW9uSW5kZXhlc1swXSksXG4gICAgICAuLi5jb29yZGluYXRlcy5zbGljZShwb3NpdGlvbkluZGV4ZXNbMF0gKyAxKSxcbiAgICBdO1xuXG4gICAgaWYgKFxuICAgICAgaXNQb2x5Z29uYWwgJiZcbiAgICAgIChwb3NpdGlvbkluZGV4ZXNbMF0gPT09IDAgfHwgcG9zaXRpb25JbmRleGVzWzBdID09PSBjb29yZGluYXRlcy5sZW5ndGggLSAxKVxuICAgICkge1xuICAgICAgLy8gZm9yIHBvbHlnb25zLCB0aGUgZmlyc3QgcG9pbnQgaXMgcmVwZWF0ZWQgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXlcbiAgICAgIC8vIHNvLCBpZiB0aGUgZmlyc3QvbGFzdCBjb29yZGluYXRlIGlzIHRvIGJlIHJlbW92ZWQsIGNvb3JkaW5hdGVzWzFdIHdpbGwgYmUgdGhlIG5ldyBmaXJzdC9sYXN0IGNvb3JkaW5hdGVcbiAgICAgIGlmIChwb3NpdGlvbkluZGV4ZXNbMF0gPT09IDApIHtcbiAgICAgICAgLy8gY2hhbmdlIHRoZSBsYXN0IHRvIGJlIHRoZSBzYW1lIGFzIHRoZSBmaXJzdFxuICAgICAgICB1cGRhdGVkW3VwZGF0ZWQubGVuZ3RoIC0gMV0gPSB1cGRhdGVkWzBdO1xuICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbkluZGV4ZXNbMF0gPT09IGNvb3JkaW5hdGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgLy8gY2hhbmdlIHRoZSBmaXJzdCB0byBiZSB0aGUgc2FtZSBhcyB0aGUgbGFzdFxuICAgICAgICB1cGRhdGVkWzBdID0gdXBkYXRlZFt1cGRhdGVkLmxlbmd0aCAtIDFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdXBkYXRlZDtcbiAgfVxuXG4gIC8vIHJlY3Vyc2l2ZWx5IHVwZGF0ZSBpbm5lciBhcnJheVxuICByZXR1cm4gW1xuICAgIC4uLmNvb3JkaW5hdGVzLnNsaWNlKDAsIHBvc2l0aW9uSW5kZXhlc1swXSksXG4gICAgaW1tdXRhYmx5UmVtb3ZlUG9zaXRpb24oXG4gICAgICBjb29yZGluYXRlc1twb3NpdGlvbkluZGV4ZXNbMF1dLFxuICAgICAgcG9zaXRpb25JbmRleGVzLnNsaWNlKDEsIHBvc2l0aW9uSW5kZXhlcy5sZW5ndGgpLFxuICAgICAgaXNQb2x5Z29uYWxcbiAgICApLFxuICAgIC4uLmNvb3JkaW5hdGVzLnNsaWNlKHBvc2l0aW9uSW5kZXhlc1swXSArIDEpLFxuICBdO1xufVxuXG5mdW5jdGlvbiBpbW11dGFibHlBZGRQb3NpdGlvbihcbiAgY29vcmRpbmF0ZXM6IGFueSxcbiAgcG9zaXRpb25JbmRleGVzOiBudW1iZXJbXSB8IG51bGwgfCB1bmRlZmluZWQsXG4gIHBvc2l0aW9uVG9BZGQ6IFBvc2l0aW9uLFxuICBpc1BvbHlnb25hbDogYm9vbGVhblxuKTogYW55IHtcbiAgaWYgKCFwb3NpdGlvbkluZGV4ZXMpIHtcbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cbiAgaWYgKHBvc2l0aW9uSW5kZXhlcy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBFcnJvcignTXVzdCBzcGVjaWZ5IHRoZSBpbmRleCBvZiB0aGUgcG9zaXRpb24gdG8gcmVtb3ZlJyk7XG4gIH1cbiAgaWYgKHBvc2l0aW9uSW5kZXhlcy5sZW5ndGggPT09IDEpIHtcbiAgICBjb25zdCB1cGRhdGVkID0gW1xuICAgICAgLi4uY29vcmRpbmF0ZXMuc2xpY2UoMCwgcG9zaXRpb25JbmRleGVzWzBdKSxcbiAgICAgIHBvc2l0aW9uVG9BZGQsXG4gICAgICAuLi5jb29yZGluYXRlcy5zbGljZShwb3NpdGlvbkluZGV4ZXNbMF0pLFxuICAgIF07XG4gICAgcmV0dXJuIHVwZGF0ZWQ7XG4gIH1cblxuICAvLyByZWN1cnNpdmVseSB1cGRhdGUgaW5uZXIgYXJyYXlcbiAgcmV0dXJuIFtcbiAgICAuLi5jb29yZGluYXRlcy5zbGljZSgwLCBwb3NpdGlvbkluZGV4ZXNbMF0pLFxuICAgIGltbXV0YWJseUFkZFBvc2l0aW9uKFxuICAgICAgY29vcmRpbmF0ZXNbcG9zaXRpb25JbmRleGVzWzBdXSxcbiAgICAgIHBvc2l0aW9uSW5kZXhlcy5zbGljZSgxLCBwb3NpdGlvbkluZGV4ZXMubGVuZ3RoKSxcbiAgICAgIHBvc2l0aW9uVG9BZGQsXG4gICAgICBpc1BvbHlnb25hbFxuICAgICksXG4gICAgLi4uY29vcmRpbmF0ZXMuc2xpY2UocG9zaXRpb25JbmRleGVzWzBdICsgMSksXG4gIF07XG59XG5cbmZ1bmN0aW9uIHBydW5lR2VvbWV0cnlJZk5lY2Vzc2FyeShnZW9tZXRyeTogR2VvbWV0cnkpIHtcbiAgc3dpdGNoIChnZW9tZXRyeS50eXBlKSB7XG4gICAgY2FzZSAnUG9seWdvbic6XG4gICAgICBwcnVuZVBvbHlnb25JZk5lY2Vzc2FyeShnZW9tZXRyeSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdNdWx0aUxpbmVTdHJpbmcnOlxuICAgICAgcHJ1bmVNdWx0aUxpbmVTdHJpbmdJZk5lY2Vzc2FyeShnZW9tZXRyeSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgICAgcHJ1bmVNdWx0aVBvbHlnb25JZk5lY2Vzc2FyeShnZW9tZXRyeSk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gTm90IGRvd25ncmFkYWJsZVxuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHJ1bmVQb2x5Z29uSWZOZWNlc3NhcnkoZ2VvbWV0cnk6IFBvbHlnb24pIHtcbiAgY29uc3QgcG9seWdvbiA9IGdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuXG4gIC8vIElmIGFueSBob2xlIGlzIG5vIGxvbmdlciBhIHBvbHlnb24sIHJlbW92ZSB0aGUgaG9sZSBlbnRpcmVseVxuICBmb3IgKGxldCBob2xlSW5kZXggPSAxOyBob2xlSW5kZXggPCBwb2x5Z29uLmxlbmd0aDsgaG9sZUluZGV4KyspIHtcbiAgICBpZiAocmVtb3ZlSG9sZUlmTmVjZXNzYXJ5KHBvbHlnb24sIGhvbGVJbmRleCkpIHtcbiAgICAgIC8vIEl0IHdhcyByZW1vdmVkLCBzbyBrZWVwIHRoZSBpbmRleCB0aGUgc2FtZVxuICAgICAgaG9sZUluZGV4LS07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHBydW5lTXVsdGlMaW5lU3RyaW5nSWZOZWNlc3NhcnkoZ2VvbWV0cnk6IE11bHRpTGluZVN0cmluZykge1xuICBmb3IgKGxldCBsaW5lU3RyaW5nSW5kZXggPSAwOyBsaW5lU3RyaW5nSW5kZXggPCBnZW9tZXRyeS5jb29yZGluYXRlcy5sZW5ndGg7IGxpbmVTdHJpbmdJbmRleCsrKSB7XG4gICAgY29uc3QgbGluZVN0cmluZyA9IGdlb21ldHJ5LmNvb3JkaW5hdGVzW2xpbmVTdHJpbmdJbmRleF07XG4gICAgaWYgKGxpbmVTdHJpbmcubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBPbmx5IGEgc2luZ2xlIHBvc2l0aW9uIGxlZnQgb24gdGhpcyBMaW5lU3RyaW5nLCBzbyByZW1vdmUgaXQgKGNhbid0IGhhdmUgUG9pbnQgaW4gTXVsdGlMaW5lU3RyaW5nKVxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMuc3BsaWNlKGxpbmVTdHJpbmdJbmRleCwgMSk7XG4gICAgICAvLyBLZWVwIHRoZSBpbmRleCB0aGUgc2FtZVxuICAgICAgbGluZVN0cmluZ0luZGV4LS07XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHBydW5lTXVsdGlQb2x5Z29uSWZOZWNlc3NhcnkoZ2VvbWV0cnk6IE11bHRpUG9seWdvbikge1xuICBmb3IgKGxldCBwb2x5Z29uSW5kZXggPSAwOyBwb2x5Z29uSW5kZXggPCBnZW9tZXRyeS5jb29yZGluYXRlcy5sZW5ndGg7IHBvbHlnb25JbmRleCsrKSB7XG4gICAgY29uc3QgcG9seWdvbiA9IGdlb21ldHJ5LmNvb3JkaW5hdGVzW3BvbHlnb25JbmRleF07XG4gICAgY29uc3Qgb3V0ZXJSaW5nID0gcG9seWdvblswXTtcblxuICAgIC8vIElmIHRoZSBvdXRlciByaW5nIGlzIG5vIGxvbmdlciBhIHBvbHlnb24sIHJlbW92ZSB0aGUgd2hvbGUgcG9seWdvblxuICAgIGlmIChvdXRlclJpbmcubGVuZ3RoIDw9IDMpIHtcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzLnNwbGljZShwb2x5Z29uSW5kZXgsIDEpO1xuICAgICAgLy8gSXQgd2FzIHJlbW92ZWQsIHNvIGtlZXAgdGhlIGluZGV4IHRoZSBzYW1lXG4gICAgICBwb2x5Z29uSW5kZXgtLTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBob2xlSW5kZXggPSAxOyBob2xlSW5kZXggPCBwb2x5Z29uLmxlbmd0aDsgaG9sZUluZGV4KyspIHtcbiAgICAgIGlmIChyZW1vdmVIb2xlSWZOZWNlc3NhcnkocG9seWdvbiwgaG9sZUluZGV4KSkge1xuICAgICAgICAvLyBJdCB3YXMgcmVtb3ZlZCwgc28ga2VlcCB0aGUgaW5kZXggdGhlIHNhbWVcbiAgICAgICAgaG9sZUluZGV4LS07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUhvbGVJZk5lY2Vzc2FyeShwb2x5Z29uOiBQb2x5Z29uQ29vcmRpbmF0ZXMsIGhvbGVJbmRleDogbnVtYmVyKSB7XG4gIGNvbnN0IGhvbGUgPSBwb2x5Z29uW2hvbGVJbmRleF07XG4gIGlmIChob2xlLmxlbmd0aCA8PSAzKSB7XG4gICAgcG9seWdvbi5zcGxpY2UoaG9sZUluZGV4LCAxKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4iXX0=