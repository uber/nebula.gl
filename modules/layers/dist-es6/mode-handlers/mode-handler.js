"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPickedEditHandle = getPickedEditHandle;
exports.getIntermediatePosition = getIntermediatePosition;
exports.getEditHandlesForGeometry = getEditHandlesForGeometry;
exports.ModeHandler = void 0;

var _union = _interopRequireDefault(require("@turf/union"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _intersect = _interopRequireDefault(require("@turf/intersect"));

var _editModes = require("@nebula.gl/edit-modes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ModeHandler = /*#__PURE__*/function () {
  // TODO: add underscore
  function ModeHandler(featureCollection) {
    _classCallCheck(this, ModeHandler);

    _defineProperty(this, "featureCollection", void 0);

    _defineProperty(this, "_tentativeFeature", void 0);

    _defineProperty(this, "_modeConfig", null);

    _defineProperty(this, "_selectedFeatureIndexes", []);

    _defineProperty(this, "_clickSequence", []);

    if (featureCollection) {
      this.setFeatureCollection(featureCollection);
    }
  }

  _createClass(ModeHandler, [{
    key: "getFeatureCollection",
    value: function getFeatureCollection() {
      return this.featureCollection.getObject();
    }
  }, {
    key: "getImmutableFeatureCollection",
    value: function getImmutableFeatureCollection() {
      return this.featureCollection;
    }
  }, {
    key: "getSelectedFeature",
    value: function getSelectedFeature() {
      if (this._selectedFeatureIndexes.length === 1) {
        return this.featureCollection.getObject().features[this._selectedFeatureIndexes[0]];
      }

      return null;
    }
  }, {
    key: "getSelectedGeometry",
    value: function getSelectedGeometry() {
      var feature = this.getSelectedFeature();

      if (feature) {
        return feature.geometry;
      }

      return null;
    }
  }, {
    key: "getSelectedFeaturesAsFeatureCollection",
    value: function getSelectedFeaturesAsFeatureCollection() {
      var _this$featureCollecti = this.featureCollection.getObject(),
          features = _this$featureCollecti.features;

      var selectedFeatures = this.getSelectedFeatureIndexes().map(function (selectedIndex) {
        return features[selectedIndex];
      });
      return {
        type: 'FeatureCollection',
        features: selectedFeatures
      };
    }
  }, {
    key: "setFeatureCollection",
    value: function setFeatureCollection(featureCollection) {
      this.featureCollection = new _editModes.ImmutableFeatureCollection(featureCollection);
    }
  }, {
    key: "getModeConfig",
    value: function getModeConfig() {
      return this._modeConfig;
    }
  }, {
    key: "setModeConfig",
    value: function setModeConfig(modeConfig) {
      if (this._modeConfig === modeConfig) {
        return;
      }

      this._modeConfig = modeConfig;

      this._setTentativeFeature(null);
    }
  }, {
    key: "getSelectedFeatureIndexes",
    value: function getSelectedFeatureIndexes() {
      return this._selectedFeatureIndexes;
    }
  }, {
    key: "setSelectedFeatureIndexes",
    value: function setSelectedFeatureIndexes(indexes) {
      if (this._selectedFeatureIndexes === indexes) {
        return;
      }

      this._selectedFeatureIndexes = indexes;

      this._setTentativeFeature(null);
    }
  }, {
    key: "getClickSequence",
    value: function getClickSequence() {
      return this._clickSequence;
    }
  }, {
    key: "resetClickSequence",
    value: function resetClickSequence() {
      this._clickSequence = [];
    }
  }, {
    key: "getTentativeFeature",
    value: function getTentativeFeature() {
      return this._tentativeFeature;
    } // TODO: remove the underscore

  }, {
    key: "_setTentativeFeature",
    value: function _setTentativeFeature(tentativeFeature) {
      this._tentativeFeature = tentativeFeature;

      if (!tentativeFeature) {
        // Reset the click sequence
        this._clickSequence = [];
      }
    }
    /**
     * Returns a flat array of positions for the given feature along with their indexes into the feature's geometry's coordinates.
     *
     * @param featureIndex The index of the feature to get edit handles
     */

  }, {
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      return [];
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;
      return 'cell';
    }
  }, {
    key: "isSelectionPicked",
    value: function isSelectionPicked(picks) {
      if (!picks.length) return false;
      var pickedIndexes = picks.map(function (_ref2) {
        var index = _ref2.index;
        return index;
      });
      var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
      return selectedFeatureIndexes.some(function (index) {
        return pickedIndexes.includes(index);
      });
    }
  }, {
    key: "getAddFeatureAction",
    value: function getAddFeatureAction(geometry) {
      // Unsure why flow can't deal with Geometry type, but there I fixed it
      var geometryAsAny = geometry;
      var updatedData = this.getImmutableFeatureCollection().addFeature({
        type: 'Feature',
        properties: {},
        geometry: geometryAsAny
      }).getObject();
      return {
        updatedData: updatedData,
        editType: 'addFeature',
        featureIndexes: [updatedData.features.length - 1],
        editContext: {
          featureIndexes: [updatedData.features.length - 1]
        }
      };
    }
  }, {
    key: "getAddManyFeaturesAction",
    value: function getAddManyFeaturesAction(featureCollection) {
      var features = featureCollection.features;
      var updatedData = this.getImmutableFeatureCollection();
      var initialIndex = updatedData.getObject().features.length;
      var updatedIndexes = [];

      var _iterator = _createForOfIteratorHelper(features),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var feature = _step.value;
          var properties = feature.properties,
              geometry = feature.geometry;
          var geometryAsAny = geometry;
          updatedData = updatedData.addFeature({
            type: 'Feature',
            properties: properties,
            geometry: geometryAsAny
          });
          updatedIndexes.push(initialIndex + updatedIndexes.length);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return {
        updatedData: updatedData.getObject(),
        editType: 'addFeature',
        featureIndexes: updatedIndexes,
        editContext: {
          featureIndexes: updatedIndexes
        }
      };
    }
  }, {
    key: "getAddFeatureOrBooleanPolygonAction",
    value: function getAddFeatureOrBooleanPolygonAction(geometry) {
      var selectedFeature = this.getSelectedFeature();
      var modeConfig = this.getModeConfig();

      if (modeConfig && modeConfig.booleanOperation) {
        if (!selectedFeature || selectedFeature.geometry.type !== 'Polygon' && selectedFeature.geometry.type !== 'MultiPolygon') {
          // eslint-disable-next-line no-console,no-undef
          console.warn('booleanOperation only supported for single Polygon or MultiPolygon selection');
          return null;
        }

        var feature = {
          type: 'Feature',
          geometry: geometry
        };
        var updatedGeometry;

        if (modeConfig.booleanOperation === 'union') {
          updatedGeometry = (0, _union["default"])(selectedFeature, feature);
        } else if (modeConfig.booleanOperation === 'difference') {
          // @ts-ignore
          updatedGeometry = (0, _difference["default"])(selectedFeature, feature);
        } else if (modeConfig.booleanOperation === 'intersection') {
          // @ts-ignore
          updatedGeometry = (0, _intersect["default"])(selectedFeature, feature);
        } else {
          // eslint-disable-next-line no-console,no-undef
          console.warn("Invalid booleanOperation ".concat(modeConfig.booleanOperation));
          return null;
        }

        if (!updatedGeometry) {
          // eslint-disable-next-line no-console,no-undef
          console.warn('Canceling edit. Boolean operation erased entire polygon.');
          return null;
        }

        var featureIndex = this.getSelectedFeatureIndexes()[0];
        var updatedData = this.getImmutableFeatureCollection().replaceGeometry(featureIndex, updatedGeometry.geometry).getObject();
        var editAction = {
          updatedData: updatedData,
          editType: 'unionGeometry',
          featureIndexes: [featureIndex],
          editContext: {
            featureIndexes: [featureIndex]
          }
        };
        return editAction;
      }

      return this.getAddFeatureAction(geometry);
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      this._clickSequence.push(event.groundCoords);

      return null;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      return {
        editAction: null,
        cancelMapPan: false
      };
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      return null;
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      return null;
    }
  }]);

  return ModeHandler;
}();

exports.ModeHandler = ModeHandler;

function getPickedEditHandle(picks) {
  var info = picks && picks.find(function (pick) {
    return pick.isEditingHandle;
  });

  if (info) {
    return info.object;
  }

  return null;
}

function getIntermediatePosition(position1, position2) {
  var intermediatePosition = [(position1[0] + position2[0]) / 2.0, (position1[1] + position2[1]) / 2.0]; // @ts-ignore

  return intermediatePosition;
}

function getEditHandlesForGeometry(geometry, featureIndex) {
  var editHandleType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'existing';
  var handles = [];

  switch (geometry.type) {
    case 'Point':
      // positions are not nested
      handles = [{
        position: geometry.coordinates,
        positionIndexes: [],
        featureIndex: featureIndex,
        type: editHandleType
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
      // @ts-ignore
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
      position: position,
      positionIndexes: [].concat(_toConsumableArray(positionIndexPrefix), [i]),
      featureIndex: featureIndex,
      type: editHandleType
    });
  }

  return editHandles;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL21vZGUtaGFuZGxlci50cyJdLCJuYW1lcyI6WyJNb2RlSGFuZGxlciIsImZlYXR1cmVDb2xsZWN0aW9uIiwic2V0RmVhdHVyZUNvbGxlY3Rpb24iLCJnZXRPYmplY3QiLCJfc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImxlbmd0aCIsImZlYXR1cmVzIiwiZmVhdHVyZSIsImdldFNlbGVjdGVkRmVhdHVyZSIsImdlb21ldHJ5Iiwic2VsZWN0ZWRGZWF0dXJlcyIsImdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJtYXAiLCJzZWxlY3RlZEluZGV4IiwidHlwZSIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiX21vZGVDb25maWciLCJtb2RlQ29uZmlnIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJpbmRleGVzIiwiX2NsaWNrU2VxdWVuY2UiLCJfdGVudGF0aXZlRmVhdHVyZSIsInRlbnRhdGl2ZUZlYXR1cmUiLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsImlzRHJhZ2dpbmciLCJwaWNrZWRJbmRleGVzIiwiaW5kZXgiLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwic29tZSIsImluY2x1ZGVzIiwiZ2VvbWV0cnlBc0FueSIsInVwZGF0ZWREYXRhIiwiZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJhZGRGZWF0dXJlIiwicHJvcGVydGllcyIsImVkaXRUeXBlIiwiZmVhdHVyZUluZGV4ZXMiLCJlZGl0Q29udGV4dCIsImluaXRpYWxJbmRleCIsInVwZGF0ZWRJbmRleGVzIiwicHVzaCIsInNlbGVjdGVkRmVhdHVyZSIsImdldE1vZGVDb25maWciLCJib29sZWFuT3BlcmF0aW9uIiwiY29uc29sZSIsIndhcm4iLCJ1cGRhdGVkR2VvbWV0cnkiLCJmZWF0dXJlSW5kZXgiLCJyZXBsYWNlR2VvbWV0cnkiLCJlZGl0QWN0aW9uIiwiZ2V0QWRkRmVhdHVyZUFjdGlvbiIsImV2ZW50IiwiY2FuY2VsTWFwUGFuIiwiZ2V0UGlja2VkRWRpdEhhbmRsZSIsImluZm8iLCJmaW5kIiwicGljayIsImlzRWRpdGluZ0hhbmRsZSIsIm9iamVjdCIsImdldEludGVybWVkaWF0ZVBvc2l0aW9uIiwicG9zaXRpb24xIiwicG9zaXRpb24yIiwiaW50ZXJtZWRpYXRlUG9zaXRpb24iLCJnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5IiwiZWRpdEhhbmRsZVR5cGUiLCJoYW5kbGVzIiwicG9zaXRpb24iLCJjb29yZGluYXRlcyIsInBvc2l0aW9uSW5kZXhlcyIsImNvbmNhdCIsImdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMiLCJhIiwic2xpY2UiLCJiIiwiRXJyb3IiLCJwb3NpdGlvbkluZGV4UHJlZml4IiwiZWRpdEhhbmRsZXMiLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUNhQSxXO0FBQ1g7QUFPQSx1QkFBWUMsaUJBQVosRUFBbUQ7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSx5Q0FKaEMsSUFJZ0M7O0FBQUEscURBSGYsRUFHZTs7QUFBQSw0Q0FGdEIsRUFFc0I7O0FBQ2pELFFBQUlBLGlCQUFKLEVBQXVCO0FBQ3JCLFdBQUtDLG9CQUFMLENBQTBCRCxpQkFBMUI7QUFDRDtBQUNGOzs7OzJDQUV5QztBQUN4QyxhQUFPLEtBQUtBLGlCQUFMLENBQXVCRSxTQUF2QixFQUFQO0FBQ0Q7OztvREFFMkQ7QUFDMUQsYUFBTyxLQUFLRixpQkFBWjtBQUNEOzs7eUNBRWdEO0FBQy9DLFVBQUksS0FBS0csdUJBQUwsQ0FBNkJDLE1BQTdCLEtBQXdDLENBQTVDLEVBQStDO0FBQzdDLGVBQU8sS0FBS0osaUJBQUwsQ0FBdUJFLFNBQXZCLEdBQW1DRyxRQUFuQyxDQUE0QyxLQUFLRix1QkFBTCxDQUE2QixDQUE3QixDQUE1QyxDQUFQO0FBQ0Q7O0FBQ0QsYUFBTyxJQUFQO0FBQ0Q7OzswQ0FFa0Q7QUFDakQsVUFBTUcsT0FBTyxHQUFH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LEdBQUdBLE9BQU8sQ0FBQ08sS0FBUixDQUFjLENBQWQsRUFBaUIsQ0FBQyxDQUFsQixDQUFWO0FBQ0Q7QUFDRjs7QUFFRDs7QUFDRjtBQUNFO0FBQ0EsWUFBTUUsS0FBSyxvQ0FBNkJsRSxRQUFRLENBQUNLLElBQXRDLEVBQVg7QUFyREo7O0FBd0RBLFNBQU9vRCxPQUFQO0FBQ0Q7O0FBRUQsU0FBU0ssNEJBQVQsQ0FDRUgsV0FERixFQUVFUSxtQkFGRixFQUdFNUIsWUFIRixFQUtnQjtBQUFBLE1BRGRpQixjQUNjLHVFQURtQixVQUNuQjtBQUNkLE1BQU1ZLFdBQVcsR0FBRyxFQUFwQjs7QUFDQSxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdWLFdBQVcsQ0FBQy9ELE1BQWhDLEVBQXdDeUUsQ0FBQyxFQUF6QyxFQUE2QztBQUMzQyxRQUFNWCxRQUFRLEdBQUdDLFdBQVcsQ0FBQ1UsQ0FBRCxDQUE1QjtBQUNBRCxJQUFBQSxXQUFXLENBQUNwQyxJQUFaLENBQWlCO0FBQ2YwQixNQUFBQSxRQUFRLEVBQVJBLFFBRGU7QUFFZkUsTUFBQUEsZUFBZSwrQkFBTU8sbUJBQU4sSUFBMkJFLENBQTNCLEVBRkE7QUFHZjlCLE1BQUFBLFlBQVksRUFBWkEsWUFIZTtBQUlmbEMsTUFBQUEsSUFBSSxFQUFFbUQ7QUFKUyxLQUFqQjtBQU1EOztBQUNELFNBQU9ZLFdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcblxuaW1wb3J0IHR1cmZVbmlvbiBmcm9tICdAdHVyZi91bmlvbic7XG5pbXBvcnQgdHVyZkRpZmZlcmVuY2UgZnJvbSAnQHR1cmYvZGlmZmVyZW5jZSc7XG5pbXBvcnQgdHVyZkludGVyc2VjdCBmcm9tICdAdHVyZi9pbnRlcnNlY3QnO1xuXG5pbXBvcnQge1xuICBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbixcbiAgRmVhdHVyZUNvbGxlY3Rpb24sXG4gIEZlYXR1cmUsXG4gIFBvbHlnb24sXG4gIEdlb21ldHJ5LFxuICBQb3NpdGlvbixcbn0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcblxuaW1wb3J0IHtcbiAgQ2xpY2tFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgRGVja0dMUGljayxcbn0gZnJvbSAnLi4vZXZlbnQtdHlwZXMnO1xuXG5leHBvcnQgdHlwZSBFZGl0SGFuZGxlVHlwZSA9ICdleGlzdGluZycgfCAnaW50ZXJtZWRpYXRlJyB8ICdzbmFwJztcblxuZXhwb3J0IHR5cGUgRWRpdEhhbmRsZSA9IHtcbiAgcG9zaXRpb246IFBvc2l0aW9uO1xuICBwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdO1xuICBmZWF0dXJlSW5kZXg6IG51bWJlcjtcbiAgdHlwZTogRWRpdEhhbmRsZVR5cGU7XG59O1xuXG5leHBvcnQgdHlwZSBFZGl0QWN0aW9uID0ge1xuICB1cGRhdGVkRGF0YTogRmVhdHVyZUNvbGxlY3Rpb247XG4gIGVkaXRUeXBlOiBzdHJpbmc7XG4gIGZlYXR1cmVJbmRleGVzOiBudW1iZXJbXTtcbiAgZWRpdENvbnRleHQ6IGFueTtcbn07XG5cbmV4cG9ydCBjbGFzcyBNb2RlSGFuZGxlciB7XG4gIC8vIFRPRE86IGFkZCB1bmRlcnNjb3JlXG4gIGZlYXR1cmVDb2xsZWN0aW9uOiBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbjtcbiAgX3RlbnRhdGl2ZUZlYXR1cmU6IEZlYXR1cmUgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBfbW9kZUNvbmZpZzogYW55ID0gbnVsbDtcbiAgX3NlbGVjdGVkRmVhdHVyZUluZGV4ZXM6IG51bWJlcltdID0gW107XG4gIF9jbGlja1NlcXVlbmNlOiBQb3NpdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoZmVhdHVyZUNvbGxlY3Rpb24/OiBGZWF0dXJlQ29sbGVjdGlvbikge1xuICAgIGlmIChmZWF0dXJlQ29sbGVjdGlvbikge1xuICAgICAgdGhpcy5zZXRGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlQ29sbGVjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgZ2V0RmVhdHVyZUNvbGxlY3Rpb24oKTogRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLmZlYXR1cmVDb2xsZWN0aW9uLmdldE9iamVjdCgpO1xuICB9XG5cbiAgZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKTogSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLmZlYXR1cmVDb2xsZWN0aW9uO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRGZWF0dXJlKCk6IEZlYXR1cmUgfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmZlYXR1cmVDb2xsZWN0aW9uLmdldE9iamVjdCgpLmZlYXR1cmVzW3RoaXMuX3NlbGVjdGVkRmVhdHVyZUluZGV4ZXNbMF1dO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldFNlbGVjdGVkR2VvbWV0cnkoKTogR2VvbWV0cnkgfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBmZWF0dXJlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmUoKTtcbiAgICBpZiAoZmVhdHVyZSkge1xuICAgICAgcmV0dXJuIGZlYXR1cmUuZ2VvbWV0cnk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24oKTogRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIGNvbnN0IHsgZmVhdHVyZXMgfSA9IHRoaXMuZmVhdHVyZUNvbGxlY3Rpb24uZ2V0T2JqZWN0KCk7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpLm1hcChcbiAgICAgIChzZWxlY3RlZEluZGV4KSA9PiBmZWF0dXJlc1tzZWxlY3RlZEluZGV4XVxuICAgICk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogc2VsZWN0ZWRGZWF0dXJlcyxcbiAgICB9O1xuICB9XG5cbiAgc2V0RmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZUNvbGxlY3Rpb246IEZlYXR1cmVDb2xsZWN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5mZWF0dXJlQ29sbGVjdGlvbiA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlQ29sbGVjdGlvbik7XG4gIH1cblxuICBnZXRNb2RlQ29uZmlnKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGVDb25maWc7XG4gIH1cblxuICBzZXRNb2RlQ29uZmlnKG1vZGVDb25maWc6IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9tb2RlQ29uZmlnID09PSBtb2RlQ29uZmlnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbW9kZUNvbmZpZyA9IG1vZGVDb25maWc7XG4gICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTogbnVtYmVyW10ge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZEZlYXR1cmVJbmRleGVzO1xuICB9XG5cbiAgc2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyhpbmRleGVzOiBudW1iZXJbXSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9zZWxlY3RlZEZlYXR1cmVJbmRleGVzID09PSBpbmRleGVzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9IGluZGV4ZXM7XG4gICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgfVxuXG4gIGdldENsaWNrU2VxdWVuY2UoKTogUG9zaXRpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2NsaWNrU2VxdWVuY2U7XG4gIH1cblxuICByZXNldENsaWNrU2VxdWVuY2UoKTogdm9pZCB7XG4gICAgdGhpcy5fY2xpY2tTZXF1ZW5jZSA9IFtdO1xuICB9XG5cbiAgZ2V0VGVudGF0aXZlRmVhdHVyZSgpOiBGZWF0dXJlIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX3RlbnRhdGl2ZUZlYXR1cmU7XG4gIH1cblxuICAvLyBUT0RPOiByZW1vdmUgdGhlIHVuZGVyc2NvcmVcbiAgX3NldFRlbnRhdGl2ZUZlYXR1cmUodGVudGF0aXZlRmVhdHVyZTogRmVhdHVyZSB8IG51bGwgfCB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICB0aGlzLl90ZW50YXRpdmVGZWF0dXJlID0gdGVudGF0aXZlRmVhdHVyZTtcbiAgICBpZiAoIXRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIC8vIFJlc2V0IHRoZSBjbGljayBzZXF1ZW5jZVxuICAgICAgdGhpcy5fY2xpY2tTZXF1ZW5jZSA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgZmxhdCBhcnJheSBvZiBwb3NpdGlvbnMgZm9yIHRoZSBnaXZlbiBmZWF0dXJlIGFsb25nIHdpdGggdGhlaXIgaW5kZXhlcyBpbnRvIHRoZSBmZWF0dXJlJ3MgZ2VvbWV0cnkncyBjb29yZGluYXRlcy5cbiAgICpcbiAgICogQHBhcmFtIGZlYXR1cmVJbmRleCBUaGUgaW5kZXggb2YgdGhlIGZlYXR1cmUgdG8gZ2V0IGVkaXQgaGFuZGxlc1xuICAgKi9cbiAgZ2V0RWRpdEhhbmRsZXMocGlja3M/OiBBcnJheTxSZWNvcmQ8c3RyaW5nLCBhbnk+PiwgZ3JvdW5kQ29vcmRzPzogUG9zaXRpb24pOiBFZGl0SGFuZGxlW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIHJldHVybiAnY2VsbCc7XG4gIH1cblxuICBpc1NlbGVjdGlvblBpY2tlZChwaWNrczogRGVja0dMUGlja1tdKTogYm9vbGVhbiB7XG4gICAgaWYgKCFwaWNrcy5sZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBwaWNrZWRJbmRleGVzID0gcGlja3MubWFwKCh7IGluZGV4IH0pID0+IGluZGV4KTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCk7XG4gICAgcmV0dXJuIHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMuc29tZSgoaW5kZXgpID0+IHBpY2tlZEluZGV4ZXMuaW5jbHVkZXMoaW5kZXgpKTtcbiAgfVxuXG4gIGdldEFkZEZlYXR1cmVBY3Rpb24oZ2VvbWV0cnk6IEdlb21ldHJ5KTogRWRpdEFjdGlvbiB7XG4gICAgLy8gVW5zdXJlIHdoeSBmbG93IGNhbid0IGRlYWwgd2l0aCBHZW9tZXRyeSB0eXBlLCBidXQgdGhlcmUgSSBmaXhlZCBpdFxuICAgIGNvbnN0IGdlb21ldHJ5QXNBbnk6IGFueSA9IGdlb21ldHJ5O1xuXG4gICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgIC5hZGRGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5QXNBbnksXG4gICAgICB9KVxuICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgZWRpdFR5cGU6ICdhZGRGZWF0dXJlJyxcbiAgICAgIGZlYXR1cmVJbmRleGVzOiBbdXBkYXRlZERhdGEuZmVhdHVyZXMubGVuZ3RoIC0gMV0sXG4gICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICBmZWF0dXJlSW5kZXhlczogW3VwZGF0ZWREYXRhLmZlYXR1cmVzLmxlbmd0aCAtIDFdLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0QWRkTWFueUZlYXR1cmVzQWN0aW9uKGZlYXR1cmVDb2xsZWN0aW9uOiBGZWF0dXJlQ29sbGVjdGlvbik6IEVkaXRBY3Rpb24ge1xuICAgIGNvbnN0IGZlYXR1cmVzID0gZmVhdHVyZUNvbGxlY3Rpb24uZmVhdHVyZXM7XG4gICAgbGV0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpO1xuICAgIGNvbnN0IGluaXRpYWxJbmRleCA9IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLmZlYXR1cmVzLmxlbmd0aDtcbiAgICBjb25zdCB1cGRhdGVkSW5kZXhlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgZmVhdHVyZSBvZiBmZWF0dXJlcykge1xuICAgICAgY29uc3QgeyBwcm9wZXJ0aWVzLCBnZW9tZXRyeSB9ID0gZmVhdHVyZTtcbiAgICAgIGNvbnN0IGdlb21ldHJ5QXNBbnk6IGFueSA9IGdlb21ldHJ5O1xuICAgICAgdXBkYXRlZERhdGEgPSB1cGRhdGVkRGF0YS5hZGRGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBwcm9wZXJ0aWVzLFxuICAgICAgICBnZW9tZXRyeTogZ2VvbWV0cnlBc0FueSxcbiAgICAgIH0pO1xuICAgICAgdXBkYXRlZEluZGV4ZXMucHVzaChpbml0aWFsSW5kZXggKyB1cGRhdGVkSW5kZXhlcy5sZW5ndGgpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGVkRGF0YTogdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCksXG4gICAgICBlZGl0VHlwZTogJ2FkZEZlYXR1cmUnLFxuICAgICAgZmVhdHVyZUluZGV4ZXM6IHVwZGF0ZWRJbmRleGVzLFxuICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgZmVhdHVyZUluZGV4ZXM6IHVwZGF0ZWRJbmRleGVzLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24oZ2VvbWV0cnk6IFBvbHlnb24pOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmUoKTtcbiAgICBjb25zdCBtb2RlQ29uZmlnID0gdGhpcy5nZXRNb2RlQ29uZmlnKCk7XG4gICAgaWYgKG1vZGVDb25maWcgJiYgbW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFzZWxlY3RlZEZlYXR1cmUgfHxcbiAgICAgICAgKHNlbGVjdGVkRmVhdHVyZS5nZW9tZXRyeS50eXBlICE9PSAnUG9seWdvbicgJiZcbiAgICAgICAgICBzZWxlY3RlZEZlYXR1cmUuZ2VvbWV0cnkudHlwZSAhPT0gJ011bHRpUG9seWdvbicpXG4gICAgICApIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdib29sZWFuT3BlcmF0aW9uIG9ubHkgc3VwcG9ydGVkIGZvciBzaW5nbGUgUG9seWdvbiBvciBNdWx0aVBvbHlnb24gc2VsZWN0aW9uJ1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVhdHVyZSA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeSxcbiAgICAgIH07XG5cbiAgICAgIGxldCB1cGRhdGVkR2VvbWV0cnk7XG4gICAgICBpZiAobW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uID09PSAndW5pb24nKSB7XG4gICAgICAgIHVwZGF0ZWRHZW9tZXRyeSA9IHR1cmZVbmlvbihzZWxlY3RlZEZlYXR1cmUsIGZlYXR1cmUpO1xuICAgICAgfSBlbHNlIGlmIChtb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb24gPT09ICdkaWZmZXJlbmNlJykge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHVwZGF0ZWRHZW9tZXRyeSA9IHR1cmZEaWZmZXJlbmNlKHNlbGVjdGVkRmVhdHVyZSwgZmVhdHVyZSk7XG4gICAgICB9IGVsc2UgaWYgKG1vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbiA9PT0gJ2ludGVyc2VjdGlvbicpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB1cGRhdGVkR2VvbWV0cnkgPSB0dXJmSW50ZXJzZWN0KHNlbGVjdGVkRmVhdHVyZSwgZmVhdHVyZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICBjb25zb2xlLndhcm4oYEludmFsaWQgYm9vbGVhbk9wZXJhdGlvbiAke21vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbn1gKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICghdXBkYXRlZEdlb21ldHJ5KSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICAgIGNvbnNvbGUud2FybignQ2FuY2VsaW5nIGVkaXQuIEJvb2xlYW4gb3BlcmF0aW9uIGVyYXNlZCBlbnRpcmUgcG9seWdvbi4nKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpWzBdO1xuXG4gICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgICAucmVwbGFjZUdlb21ldHJ5KGZlYXR1cmVJbmRleCwgdXBkYXRlZEdlb21ldHJ5Lmdlb21ldHJ5KVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGNvbnN0IGVkaXRBY3Rpb246IEVkaXRBY3Rpb24gPSB7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ3VuaW9uR2VvbWV0cnknLFxuICAgICAgICBmZWF0dXJlSW5kZXhlczogW2ZlYXR1cmVJbmRleF0sXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtmZWF0dXJlSW5kZXhdLFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldEFkZEZlYXR1cmVBY3Rpb24oZ2VvbWV0cnkpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgdGhpcy5fY2xpY2tTZXF1ZW5jZS5wdXNoKGV2ZW50Lmdyb3VuZENvb3Jkcyk7XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50XG4gICk6IHsgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQ7IGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICByZXR1cm4geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KTogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQaWNrZWRFZGl0SGFuZGxlKFxuICBwaWNrczogYW55W10gfCBudWxsIHwgdW5kZWZpbmVkXG4pOiBFZGl0SGFuZGxlIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGluZm8gPSBwaWNrcyAmJiBwaWNrcy5maW5kKChwaWNrKSA9PiBwaWNrLmlzRWRpdGluZ0hhbmRsZSk7XG4gIGlmIChpbmZvKSB7XG4gICAgcmV0dXJuIGluZm8ub2JqZWN0O1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW50ZXJtZWRpYXRlUG9zaXRpb24ocG9zaXRpb24xOiBQb3NpdGlvbiwgcG9zaXRpb24yOiBQb3NpdGlvbik6IFBvc2l0aW9uIHtcbiAgY29uc3QgaW50ZXJtZWRpYXRlUG9zaXRpb24gPSBbXG4gICAgKHBvc2l0aW9uMVswXSArIHBvc2l0aW9uMlswXSkgLyAyLjAsXG4gICAgKHBvc2l0aW9uMVsxXSArIHBvc2l0aW9uMlsxXSkgLyAyLjAsXG4gIF07XG4gIC8vIEB0cy1pZ25vcmVcbiAgcmV0dXJuIGludGVybWVkaWF0ZVBvc2l0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeShcbiAgZ2VvbWV0cnk6IEdlb21ldHJ5LFxuICBmZWF0dXJlSW5kZXg6IG51bWJlcixcbiAgZWRpdEhhbmRsZVR5cGU6IEVkaXRIYW5kbGVUeXBlID0gJ2V4aXN0aW5nJ1xuKSB7XG4gIGxldCBoYW5kbGVzOiBFZGl0SGFuZGxlW10gPSBbXTtcblxuICBzd2l0Y2ggKGdlb21ldHJ5LnR5cGUpIHtcbiAgICBjYXNlICdQb2ludCc6XG4gICAgICAvLyBwb3NpdGlvbnMgYXJlIG5vdCBuZXN0ZWRcbiAgICAgIGhhbmRsZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwb3NpdGlvbjogZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBbXSxcbiAgICAgICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICAgICAgdHlwZTogZWRpdEhhbmRsZVR5cGUsXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnTXVsdGlQb2ludCc6XG4gICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgICAvLyBwb3NpdGlvbnMgYXJlIG5lc3RlZCAxIGxldmVsXG4gICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoXG4gICAgICAgIGdldEVkaXRIYW5kbGVzRm9yQ29vcmRpbmF0ZXMoZ2VvbWV0cnkuY29vcmRpbmF0ZXMsIFtdLCBmZWF0dXJlSW5kZXgsIGVkaXRIYW5kbGVUeXBlKVxuICAgICAgKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gICAgICAvLyBwb3NpdGlvbnMgYXJlIG5lc3RlZCAyIGxldmVsc1xuICAgICAgZm9yIChsZXQgYSA9IDA7IGEgPCBnZW9tZXRyeS5jb29yZGluYXRlcy5sZW5ndGg7IGErKykge1xuICAgICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoXG4gICAgICAgICAgZ2V0RWRpdEhhbmRsZXNGb3JDb29yZGluYXRlcyhnZW9tZXRyeS5jb29yZGluYXRlc1thXSwgW2FdLCBmZWF0dXJlSW5kZXgsIGVkaXRIYW5kbGVUeXBlKVxuICAgICAgICApO1xuICAgICAgICBpZiAoZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgcmVwZWF0IHRoZSBmaXJzdC9sYXN0IGhhbmRsZSBmb3IgUG9seWdvbnNcbiAgICAgICAgICBoYW5kbGVzID0gaGFuZGxlcy5zbGljZSgwLCAtMSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnTXVsdGlQb2x5Z29uJzpcbiAgICAgIC8vIHBvc2l0aW9ucyBhcmUgbmVzdGVkIDMgbGV2ZWxzXG4gICAgICBmb3IgKGxldCBhID0gMDsgYSA8IGdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aDsgYSsrKSB7XG4gICAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgZ2VvbWV0cnkuY29vcmRpbmF0ZXNbYV0ubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoXG4gICAgICAgICAgICBnZXRFZGl0SGFuZGxlc0ZvckNvb3JkaW5hdGVzKFxuICAgICAgICAgICAgICBnZW9tZXRyeS5jb29yZGluYXRlc1thXVtiXSxcbiAgICAgICAgICAgICAgW2EsIGJdLFxuICAgICAgICAgICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICAgIGVkaXRIYW5kbGVUeXBlXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgICAvLyBEb24ndCByZXBlYXQgdGhlIGZpcnN0L2xhc3QgaGFuZGxlIGZvciBQb2x5Z29uc1xuICAgICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhyb3cgRXJyb3IoYFVuaGFuZGxlZCBnZW9tZXRyeSB0eXBlOiAke2dlb21ldHJ5LnR5cGV9YCk7XG4gIH1cblxuICByZXR1cm4gaGFuZGxlcztcbn1cblxuZnVuY3Rpb24gZ2V0RWRpdEhhbmRsZXNGb3JDb29yZGluYXRlcyhcbiAgY29vcmRpbmF0ZXM6IGFueVtdLFxuICBwb3NpdGlvbkluZGV4UHJlZml4OiBudW1iZXJbXSxcbiAgZmVhdHVyZUluZGV4OiBudW1iZXIsXG4gIGVkaXRIYW5kbGVUeXBlOiBFZGl0SGFuZGxlVHlwZSA9ICdleGlzdGluZydcbik6IEVkaXRIYW5kbGVbXSB7XG4gIGNvbnN0IGVkaXRIYW5kbGVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGNvb3JkaW5hdGVzW2ldO1xuICAgIGVkaXRIYW5kbGVzLnB1c2goe1xuICAgICAgcG9zaXRpb24sXG4gICAgICBwb3NpdGlvbkluZGV4ZXM6IFsuLi5wb3NpdGlvbkluZGV4UHJlZml4LCBpXSxcbiAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgIHR5cGU6IGVkaXRIYW5kbGVUeXBlLFxuICAgIH0pO1xuICB9XG4gIHJldHVybiBlZGl0SGFuZGxlcztcbn1cbiJdfQ==