"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIntermediatePosition = getIntermediatePosition;
exports.GeoJsonEditMode = void 0;

var _union = _interopRequireDefault(require("@turf/union"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _intersect = _interopRequireDefault(require("@turf/intersect"));

var _rewind = _interopRequireDefault(require("@turf/rewind"));

var _utils = require("../utils");

var _immutableFeatureCollection = require("./immutable-feature-collection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_GUIDES = {
  type: 'FeatureCollection',
  features: []
};
var DEFAULT_TOOLTIPS = []; // Main interface for `EditMode`s that edit GeoJSON

var GeoJsonEditMode = /*#__PURE__*/function () {
  function GeoJsonEditMode() {
    _classCallCheck(this, GeoJsonEditMode);

    _defineProperty(this, "_clickSequence", []);
  }

  _createClass(GeoJsonEditMode, [{
    key: "getGuides",
    value: function getGuides(props) {
      return DEFAULT_GUIDES;
    }
  }, {
    key: "getTooltips",
    value: function getTooltips(props) {
      return DEFAULT_TOOLTIPS;
    }
  }, {
    key: "getSelectedFeature",
    value: function getSelectedFeature(props) {
      if (props.selectedIndexes.length === 1) {
        return props.data.features[props.selectedIndexes[0]];
      }

      return null;
    }
  }, {
    key: "getSelectedGeometry",
    value: function getSelectedGeometry(props) {
      var feature = this.getSelectedFeature(props);

      if (feature) {
        return feature.geometry;
      }

      return null;
    }
  }, {
    key: "getSelectedFeaturesAsFeatureCollection",
    value: function getSelectedFeaturesAsFeatureCollection(props) {
      var features = props.data.features;
      var selectedFeatures = props.selectedIndexes.map(function (selectedIndex) {
        return features[selectedIndex];
      });
      return {
        type: 'FeatureCollection',
        features: selectedFeatures
      };
    }
  }, {
    key: "getClickSequence",
    value: function getClickSequence() {
      return this._clickSequence;
    }
  }, {
    key: "addClickSequence",
    value: function addClickSequence(_ref) {
      var mapCoords = _ref.mapCoords;

      this._clickSequence.push(mapCoords);
    }
  }, {
    key: "resetClickSequence",
    value: function resetClickSequence() {
      this._clickSequence = [];
    }
  }, {
    key: "getTentativeGuide",
    value: function getTentativeGuide(props) {
      var guides = this.getGuides(props); // @ts-ignore

      return guides.features.find(function (f) {
        return f.properties && f.properties.guideType === 'tentative';
      });
    }
  }, {
    key: "isSelectionPicked",
    value: function isSelectionPicked(picks, props) {
      if (!picks.length) return false;
      var pickedFeatures = (0, _utils.getNonGuidePicks)(picks).map(function (_ref2) {
        var index = _ref2.index;
        return index;
      });
      var pickedHandles = (0, _utils.getPickedEditHandles)(picks).map(function (_ref3) {
        var properties = _ref3.properties;
        return properties.featureIndex;
      });
      var pickedIndexes = new Set([].concat(_toConsumableArray(pickedFeatures), _toConsumableArray(pickedHandles)));
      return props.selectedIndexes.some(function (index) {
        return pickedIndexes.has(index);
      });
    }
  }, {
    key: "rewindPolygon",
    value: function rewindPolygon(feature) {
      var geometry = feature.geometry;
      var isPolygonal = geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';

      if (isPolygonal) {
        // @ts-ignore
        return (0, _rewind["default"])(feature);
      }

      return feature;
    }
  }, {
    key: "getAddFeatureAction",
    value: function getAddFeatureAction(featureOrGeometry, features) {
      // Unsure why flow can't deal with Geometry type, but there I fixed it
      var featureOrGeometryAsAny = featureOrGeometry;
      var feature = featureOrGeometryAsAny.type === 'Feature' ? featureOrGeometryAsAny : {
        type: 'Feature',
        properties: {},
        geometry: featureOrGeometryAsAny
      };
      var rewindFeature = this.rewindPolygon(feature);
      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(features).addFeature(rewindFeature).getObject();
      return {
        updatedData: updatedData,
        editType: 'addFeature',
        editContext: {
          featureIndexes: [updatedData.features.length - 1]
        }
      };
    }
  }, {
    key: "getAddManyFeaturesAction",
    value: function getAddManyFeaturesAction(_ref4, features) {
      var featuresToAdd = _ref4.features;
      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(features);
      var initialIndex = updatedData.getObject().features.length;
      var updatedIndexes = [];

      var _iterator = _createForOfIteratorHelper(featuresToAdd),
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
        editContext: {
          featureIndexes: updatedIndexes
        }
      };
    }
  }, {
    key: "getAddFeatureOrBooleanPolygonAction",
    value: function getAddFeatureOrBooleanPolygonAction(featureOrGeometry, props) {
      var featureOrGeometryAsAny = featureOrGeometry;
      var selectedFeature = this.getSelectedFeature(props);
      var modeConfig = props.modeConfig;

      if (modeConfig && modeConfig.booleanOperation) {
        if (!selectedFeature || selectedFeature.geometry.type !== 'Polygon' && selectedFeature.geometry.type !== 'MultiPolygon') {
          // eslint-disable-next-line no-console,no-undef
          console.warn('booleanOperation only supported for single Polygon or MultiPolygon selection');
          return null;
        }

        var feature = featureOrGeometryAsAny.type === 'Feature' ? featureOrGeometryAsAny : {
          type: 'Feature',
          geometry: featureOrGeometryAsAny
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

        var featureIndex = props.selectedIndexes[0];
        var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replaceGeometry(featureIndex, updatedGeometry.geometry).getObject();
        var editAction = {
          updatedData: updatedData,
          editType: 'unionGeometry',
          editContext: {
            featureIndexes: [featureIndex]
          }
        };
        return editAction;
      }

      return this.getAddFeatureAction(featureOrGeometry, props.data);
    }
  }, {
    key: "createTentativeFeature",
    value: function createTentativeFeature(props) {
      return null;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event, props) {}
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      var tentativeFeature = this.createTentativeFeature(props);

      if (tentativeFeature) {
        props.onEdit({
          updatedData: props.data,
          editType: 'updateTentativeFeature',
          editContext: {
            feature: tentativeFeature
          }
        });
      }
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {}
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {}
  }, {
    key: "handleDragging",
    value: function handleDragging(event, props) {}
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(event, props) {
      if (event.key === 'Escape') {
        this.resetClickSequence();
        props.onEdit({
          // Because the new drawing feature is dropped, so the data will keep as the same.
          updatedData: props.data,
          editType: 'cancelFeature',
          editContext: {}
        });
      }
    }
  }]);

  return GeoJsonEditMode;
}();

exports.GeoJsonEditMode = GeoJsonEditMode;

function getIntermediatePosition(position1, position2) {
  var intermediatePosition = [(position1[0] + position2[0]) / 2.0, (position1[1] + position2[1]) / 2.0]; // @ts-ignore

  return intermediatePosition;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZ2VvanNvbi1lZGl0LW1vZGUudHMiXSwibmFtZXMiOlsiREVGQVVMVF9HVUlERVMiLCJ0eXBlIiwiZmVhdHVyZXMiLCJERUZBVUxUX1RPT0xUSVBTIiwiR2VvSnNvbkVkaXRNb2RlIiwicHJvcHMiLCJzZWxlY3RlZEluZGV4ZXMiLCJsZW5ndGgiLCJkYXRhIiwiZmVhdHVyZSIsImdldFNlbGVjdGVkRmVhdHVyZSIsImdlb21ldHJ5Iiwic2VsZWN0ZWRGZWF0dXJlcyIsIm1hcCIsInNlbGVjdGVkSW5kZXgiLCJfY2xpY2tTZXF1ZW5jZSIsIm1hcENvb3JkcyIsInB1c2giLCJndWlkZXMiLCJnZXRHdWlkZXMiLCJmaW5kIiwiZiIsInByb3BlcnRpZXMiLCJndWlkZVR5cGUiLCJwaWNrcyIsInBpY2tlZEZlYXR1cmVzIiwiaW5kZXgiLCJwaWNrZWRIYW5kbGVzIiwiZmVhdHVyZUluZGV4IiwicGlja2VkSW5kZXhlcyIsIlNldCIsInNvbWUiLCJoYXMiLCJpc1BvbHlnb25hbCIsImZlYXR1cmVPckdlb21ldHJ5IiwiZmVhdHVyZU9yR2VvbWV0cnlBc0FueSIsInJld2luZEZlYXR1cmUiLCJyZXdpbmRQb2x5Z29uIiwidXBkYXRlZERhdGEiLCJJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiIsImFkZEZlYXR1cmUiLCJnZXRPYmplY3QiLCJlZGl0VHlwZSIsImVkaXRDb250ZXh0IiwiZmVhdHVyZUluZGV4ZXMiLCJmZWF0dXJlc1RvQWRkIiwiaW5pdGlhbEluZGV4IiwidXBkYXRlZEluZGV4ZXMiLCJnZW9tZXRyeUFzQW55Iiwic2VsZWN0ZWRGZWF0dXJlIiwibW9kZUNvbmZpZyIsImJvb2xlYW5PcGVyYXRpb24iLCJjb25zb2xlIiwid2FybiIsInVwZGF0ZWRHZW9tZXRyeSIsInJlcGxhY2VHZW9tZXRyeSIsImVkaXRBY3Rpb24iLCJnZXRBZGRGZWF0dXJlQWN0aW9uIiwiZXZlbnQiLCJ0ZW50YXRpdmVGZWF0dXJlIiwiY3JlYXRlVGVudGF0aXZlRmVhdHVyZSIsIm9uRWRpdCIsImtleSIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsImdldEludGVybWVkaWF0ZVBvc2l0aW9uIiwicG9zaXRpb24xIiwicG9zaXRpb24yIiwiaW50ZXJtZWRpYXRlUG9zaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBZ0JBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLElBQU1BLGNBQXNDLEdBQUc7QUFDN0NDLEVBQUFBLElBQUksRUFBRSxtQkFEdUM7QUFFN0NDLEVBQUFBLFFBQVEsRUFBRTtBQUZtQyxDQUEvQztBQUlBLElBQU1DLGdCQUEyQixHQUFHLEVBQXBDLEMsQ0FFQTs7SUFPYUMsZTs7Ozs0Q0FDa0IsRTs7Ozs7OEJBRW5CQyxLLEVBQTZEO0FBQ3JFLGFBQU9MLGNBQVA7QUFDRDs7O2dDQUVXSyxLLEVBQWdEO0FBQzFELGFBQU9GLGdCQUFQO0FBQ0Q7Ozt1Q0FFa0JFLEssRUFBaUU7QUFDbEYsVUFBSUEsS0FBSyxDQUFDQyxlQUFOLENBQXNCQyxNQUF0QixLQUFpQyxDQUFyQyxFQUF3QztBQUN0QyxlQUFPRixLQUFLLENBQUNHLElBQU4sQ0FBV04sUUFBWCxDQUFvQkcsS0FBSyxDQUFDQyxlQUFOLENBQXNCLENBQXRCLENBQXBCLENBQVA7QUFDRDs7QUFDRCxhQUFPLElBQVA7QUFDRDs7O3dDQUVtQkQsSyxFQUFrRTtBQUNwRixVQUFNSSxPQUFPLEdBQUcsS0FBS0Msa0JBQUwsQ0FBd0JMLEtBQXhCLENBQWhCOztBQUNBLFVBQUlJLE9BQUosRUFBYTtBQUNYLGVBQU9BLE9BQU8sQ0FBQ0UsUUFBZjtBQUNEOztBQUNELGFBQU8sSUFBUDtBQUNEOzs7MkRBRXNDTixLLEVBQXdEO0FBQUEsVUFDckZILFFBRHFGLEdBQ3hFRyxLQUFLLENBQUNHLElBRGtFLENBQ3JGTixRQURxRjtBQUU3RixVQUFNVSxnQkFBZ0IsR0FBR1AsS0FBSyxDQUFDQyxlQUFOLENBQXNCTyxHQUF0QixDQUEwQixV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SyxFQUEyQyxDQUFFOzs7dUNBQ3pFcUQsSyxFQUEwQnJELEssRUFBMkMsQ0FBRTs7O21DQUMzRXFELEssRUFBc0JyRCxLLEVBQTJDLENBQUU7OztnQ0FFdEVxRCxLLEVBQXNCckQsSyxFQUEyQztBQUMzRSxVQUFJcUQsS0FBSyxDQUFDSSxHQUFOLEtBQWMsUUFBbEIsRUFBNEI7QUFDMUIsYUFBS0Msa0JBQUw7QUFDQTFELFFBQUFBLEtBQUssQ0FBQ3dELE1BQU4sQ0FBYTtBQUNYO0FBQ0F2QixVQUFBQSxXQUFXLEVBQUVqQyxLQUFLLENBQUNHLElBRlI7QUFHWGtDLFVBQUFBLFFBQVEsRUFBRSxlQUhDO0FBSVhDLFVBQUFBLFdBQVcsRUFBRTtBQUpGLFNBQWI7QUFNRDtBQUNGOzs7Ozs7OztBQUdJLFNBQVNxQix1QkFBVCxDQUFpQ0MsU0FBakMsRUFBc0RDLFNBQXRELEVBQXFGO0FBQzFGLE1BQU1DLG9CQUFvQixHQUFHLENBQzNCLENBQUNGLFNBQVMsQ0FBQyxDQUFELENBQVQsR0FBZUMsU0FBUyxDQUFDLENBQUQsQ0FBekIsSUFBZ0MsR0FETCxFQUUzQixDQUFDRCxTQUFTLENBQUMsQ0FBRCxDQUFULEdBQWVDLFNBQVMsQ0FBQyxDQUFELENBQXpCLElBQWdDLEdBRkwsQ0FBN0IsQ0FEMEYsQ0FLMUY7O0FBQ0EsU0FBT0Msb0JBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0dXJmVW5pb24gZnJvbSAnQHR1cmYvdW5pb24nO1xuaW1wb3J0IHR1cmZEaWZmZXJlbmNlIGZyb20gJ0B0dXJmL2RpZmZlcmVuY2UnO1xuaW1wb3J0IHR1cmZJbnRlcnNlY3QgZnJvbSAnQHR1cmYvaW50ZXJzZWN0JztcbmltcG9ydCByZXdpbmQgZnJvbSAnQHR1cmYvcmV3aW5kJztcblxuaW1wb3J0IHtcbiAgRWRpdEFjdGlvbixcbiAgQ2xpY2tFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgRHJhZ2dpbmdFdmVudCxcbiAgUGljayxcbiAgVG9vbHRpcCxcbiAgTW9kZVByb3BzLFxuICBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uLFxuICBUZW50YXRpdmVGZWF0dXJlLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBGZWF0dXJlQ29sbGVjdGlvbiwgRmVhdHVyZSwgUG9seWdvbiwgR2VvbWV0cnksIFBvc2l0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcyc7XG5pbXBvcnQgeyBnZXRQaWNrZWRFZGl0SGFuZGxlcywgZ2V0Tm9uR3VpZGVQaWNrcyB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IEVkaXRNb2RlIH0gZnJvbSAnLi9lZGl0LW1vZGUnO1xuaW1wb3J0IHsgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuL2ltbXV0YWJsZS1mZWF0dXJlLWNvbGxlY3Rpb24nO1xuXG5leHBvcnQgdHlwZSBHZW9Kc29uRWRpdEFjdGlvbiA9IEVkaXRBY3Rpb248RmVhdHVyZUNvbGxlY3Rpb24+O1xuXG5jb25zdCBERUZBVUxUX0dVSURFUzogR3VpZGVGZWF0dXJlQ29sbGVjdGlvbiA9IHtcbiAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgZmVhdHVyZXM6IFtdLFxufTtcbmNvbnN0IERFRkFVTFRfVE9PTFRJUFM6IFRvb2x0aXBbXSA9IFtdO1xuXG4vLyBNYWluIGludGVyZmFjZSBmb3IgYEVkaXRNb2RlYHMgdGhhdCBlZGl0IEdlb0pTT05cbmV4cG9ydCB0eXBlIEdlb0pzb25FZGl0TW9kZVR5cGUgPSBFZGl0TW9kZTxGZWF0dXJlQ29sbGVjdGlvbiwgRmVhdHVyZUNvbGxlY3Rpb24+O1xuXG5leHBvcnQgaW50ZXJmYWNlIEdlb0pzb25FZGl0TW9kZUNvbnN0cnVjdG9yIHtcbiAgbmV3ICgpOiBHZW9Kc29uRWRpdE1vZGVUeXBlO1xufVxuXG5leHBvcnQgY2xhc3MgR2VvSnNvbkVkaXRNb2RlIGltcGxlbWVudHMgRWRpdE1vZGU8RmVhdHVyZUNvbGxlY3Rpb24sIEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24+IHtcbiAgX2NsaWNrU2VxdWVuY2U6IFBvc2l0aW9uW10gPSBbXTtcblxuICBnZXRHdWlkZXMocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICByZXR1cm4gREVGQVVMVF9HVUlERVM7XG4gIH1cblxuICBnZXRUb29sdGlwcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IFRvb2x0aXBbXSB7XG4gICAgcmV0dXJuIERFRkFVTFRfVE9PTFRJUFM7XG4gIH1cblxuICBnZXRTZWxlY3RlZEZlYXR1cmUocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBGZWF0dXJlIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHByb3BzLnNlbGVjdGVkSW5kZXhlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiBwcm9wcy5kYXRhLmZlYXR1cmVzW3Byb3BzLnNlbGVjdGVkSW5kZXhlc1swXV07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRHZW9tZXRyeShwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEdlb21ldHJ5IHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzKTtcbiAgICBpZiAoZmVhdHVyZSkge1xuICAgICAgcmV0dXJuIGZlYXR1cmUuZ2VvbWV0cnk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgY29uc3QgeyBmZWF0dXJlcyB9ID0gcHJvcHMuZGF0YTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVzID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzLm1hcCgoc2VsZWN0ZWRJbmRleCkgPT4gZmVhdHVyZXNbc2VsZWN0ZWRJbmRleF0pO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IHNlbGVjdGVkRmVhdHVyZXMsXG4gICAgfTtcbiAgfVxuXG4gIGdldENsaWNrU2VxdWVuY2UoKTogUG9zaXRpb25bXSB7XG4gICAgcmV0dXJuIHRoaXMuX2NsaWNrU2VxdWVuY2U7XG4gIH1cblxuICBhZGRDbGlja1NlcXVlbmNlKHsgbWFwQ29vcmRzIH06IENsaWNrRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLl9jbGlja1NlcXVlbmNlLnB1c2gobWFwQ29vcmRzKTtcbiAgfVxuXG4gIHJlc2V0Q2xpY2tTZXF1ZW5jZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9jbGlja1NlcXVlbmNlID0gW107XG4gIH1cblxuICBnZXRUZW50YXRpdmVHdWlkZShwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IFRlbnRhdGl2ZUZlYXR1cmUgfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBndWlkZXMgPSB0aGlzLmdldEd1aWRlcyhwcm9wcyk7XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIGd1aWRlcy5mZWF0dXJlcy5maW5kKChmKSA9PiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLmd1aWRlVHlwZSA9PT0gJ3RlbnRhdGl2ZScpO1xuICB9XG5cbiAgaXNTZWxlY3Rpb25QaWNrZWQocGlja3M6IFBpY2tbXSwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBib29sZWFuIHtcbiAgICBpZiAoIXBpY2tzLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHBpY2tlZEZlYXR1cmVzID0gZ2V0Tm9uR3VpZGVQaWNrcyhwaWNrcykubWFwKCh7IGluZGV4IH0pID0+IGluZGV4KTtcbiAgICBjb25zdCBwaWNrZWRIYW5kbGVzID0gZ2V0UGlja2VkRWRpdEhhbmRsZXMocGlja3MpLm1hcChcbiAgICAgICh7IHByb3BlcnRpZXMgfSkgPT4gcHJvcGVydGllcy5mZWF0dXJlSW5kZXhcbiAgICApO1xuICAgIGNvbnN0IHBpY2tlZEluZGV4ZXMgPSBuZXcgU2V0KFsuLi5waWNrZWRGZWF0dXJlcywgLi4ucGlja2VkSGFuZGxlc10pO1xuICAgIHJldHVybiBwcm9wcy5zZWxlY3RlZEluZGV4ZXMuc29tZSgoaW5kZXgpID0+IHBpY2tlZEluZGV4ZXMuaGFzKGluZGV4KSk7XG4gIH1cblxuICByZXdpbmRQb2x5Z29uKGZlYXR1cmU6IEZlYXR1cmUpOiBGZWF0dXJlIHtcbiAgICBjb25zdCB7IGdlb21ldHJ5IH0gPSBmZWF0dXJlO1xuXG4gICAgY29uc3QgaXNQb2x5Z29uYWwgPSBnZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicgfHwgZ2VvbWV0cnkudHlwZSA9PT0gJ011bHRpUG9seWdvbic7XG4gICAgaWYgKGlzUG9seWdvbmFsKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICByZXR1cm4gcmV3aW5kKGZlYXR1cmUpO1xuICAgIH1cblxuICAgIHJldHVybiBmZWF0dXJlO1xuICB9XG5cbiAgZ2V0QWRkRmVhdHVyZUFjdGlvbihcbiAgICBmZWF0dXJlT3JHZW9tZXRyeTogR2VvbWV0cnkgfCBGZWF0dXJlLFxuICAgIGZlYXR1cmVzOiBGZWF0dXJlQ29sbGVjdGlvblxuICApOiBHZW9Kc29uRWRpdEFjdGlvbiB7XG4gICAgLy8gVW5zdXJlIHdoeSBmbG93IGNhbid0IGRlYWwgd2l0aCBHZW9tZXRyeSB0eXBlLCBidXQgdGhlcmUgSSBmaXhlZCBpdFxuICAgIGNvbnN0IGZlYXR1cmVPckdlb21ldHJ5QXNBbnk6IGFueSA9IGZlYXR1cmVPckdlb21ldHJ5O1xuXG4gICAgY29uc3QgZmVhdHVyZTogYW55ID1cbiAgICAgIGZlYXR1cmVPckdlb21ldHJ5QXNBbnkudHlwZSA9PT0gJ0ZlYXR1cmUnXG4gICAgICAgID8gZmVhdHVyZU9yR2VvbWV0cnlBc0FueVxuICAgICAgICA6IHtcbiAgICAgICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHt9LFxuICAgICAgICAgICAgZ2VvbWV0cnk6IGZlYXR1cmVPckdlb21ldHJ5QXNBbnksXG4gICAgICAgICAgfTtcblxuICAgIGNvbnN0IHJld2luZEZlYXR1cmUgPSB0aGlzLnJld2luZFBvbHlnb24oZmVhdHVyZSk7XG4gICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZXMpXG4gICAgICAuYWRkRmVhdHVyZShyZXdpbmRGZWF0dXJlKVxuICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgZWRpdFR5cGU6ICdhZGRGZWF0dXJlJyxcbiAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBbdXBkYXRlZERhdGEuZmVhdHVyZXMubGVuZ3RoIC0gMV0sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBnZXRBZGRNYW55RmVhdHVyZXNBY3Rpb24oXG4gICAgeyBmZWF0dXJlczogZmVhdHVyZXNUb0FkZCB9OiBGZWF0dXJlQ29sbGVjdGlvbixcbiAgICBmZWF0dXJlczogRmVhdHVyZUNvbGxlY3Rpb25cbiAgKTogR2VvSnNvbkVkaXRBY3Rpb24ge1xuICAgIGxldCB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlcyk7XG4gICAgY29uc3QgaW5pdGlhbEluZGV4ID0gdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCkuZmVhdHVyZXMubGVuZ3RoO1xuICAgIGNvbnN0IHVwZGF0ZWRJbmRleGVzID0gW107XG4gICAgZm9yIChjb25zdCBmZWF0dXJlIG9mIGZlYXR1cmVzVG9BZGQpIHtcbiAgICAgIGNvbnN0IHsgcHJvcGVydGllcywgZ2VvbWV0cnkgfSA9IGZlYXR1cmU7XG4gICAgICBjb25zdCBnZW9tZXRyeUFzQW55OiBhbnkgPSBnZW9tZXRyeTtcbiAgICAgIHVwZGF0ZWREYXRhID0gdXBkYXRlZERhdGEuYWRkRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllcyxcbiAgICAgICAgZ2VvbWV0cnk6IGdlb21ldHJ5QXNBbnksXG4gICAgICB9KTtcbiAgICAgIHVwZGF0ZWRJbmRleGVzLnB1c2goaW5pdGlhbEluZGV4ICsgdXBkYXRlZEluZGV4ZXMubGVuZ3RoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgZWRpdFR5cGU6ICdhZGRGZWF0dXJlJyxcbiAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiB1cGRhdGVkSW5kZXhlcyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uKFxuICAgIGZlYXR1cmVPckdlb21ldHJ5OiBQb2x5Z29uIHwgRmVhdHVyZSxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiBHZW9Kc29uRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGZlYXR1cmVPckdlb21ldHJ5QXNBbnk6IGFueSA9IGZlYXR1cmVPckdlb21ldHJ5O1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmUocHJvcHMpO1xuICAgIGNvbnN0IHsgbW9kZUNvbmZpZyB9ID0gcHJvcHM7XG4gICAgaWYgKG1vZGVDb25maWcgJiYgbW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uKSB7XG4gICAgICBpZiAoXG4gICAgICAgICFzZWxlY3RlZEZlYXR1cmUgfHxcbiAgICAgICAgKHNlbGVjdGVkRmVhdHVyZS5nZW9tZXRyeS50eXBlICE9PSAnUG9seWdvbicgJiZcbiAgICAgICAgICBzZWxlY3RlZEZlYXR1cmUuZ2VvbWV0cnkudHlwZSAhPT0gJ011bHRpUG9seWdvbicpXG4gICAgICApIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdib29sZWFuT3BlcmF0aW9uIG9ubHkgc3VwcG9ydGVkIGZvciBzaW5nbGUgUG9seWdvbiBvciBNdWx0aVBvbHlnb24gc2VsZWN0aW9uJ1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVhdHVyZSA9XG4gICAgICAgIGZlYXR1cmVPckdlb21ldHJ5QXNBbnkudHlwZSA9PT0gJ0ZlYXR1cmUnXG4gICAgICAgICAgPyBmZWF0dXJlT3JHZW9tZXRyeUFzQW55XG4gICAgICAgICAgOiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgICAgICAgZ2VvbWV0cnk6IGZlYXR1cmVPckdlb21ldHJ5QXNBbnksXG4gICAgICAgICAgICB9O1xuXG4gICAgICBsZXQgdXBkYXRlZEdlb21ldHJ5O1xuICAgICAgaWYgKG1vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbiA9PT0gJ3VuaW9uJykge1xuICAgICAgICB1cGRhdGVkR2VvbWV0cnkgPSB0dXJmVW5pb24oc2VsZWN0ZWRGZWF0dXJlLCBmZWF0dXJlKTtcbiAgICAgIH0gZWxzZSBpZiAobW9kZUNvbmZpZy5ib29sZWFuT3BlcmF0aW9uID09PSAnZGlmZmVyZW5jZScpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB1cGRhdGVkR2VvbWV0cnkgPSB0dXJmRGlmZmVyZW5jZShzZWxlY3RlZEZlYXR1cmUsIGZlYXR1cmUpO1xuICAgICAgfSBlbHNlIGlmIChtb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb24gPT09ICdpbnRlcnNlY3Rpb24nKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdXBkYXRlZEdlb21ldHJ5ID0gdHVyZkludGVyc2VjdChzZWxlY3RlZEZlYXR1cmUsIGZlYXR1cmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgICAgY29uc29sZS53YXJuKGBJbnZhbGlkIGJvb2xlYW5PcGVyYXRpb24gJHttb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb259YCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXVwZGF0ZWRHZW9tZXRyeSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICBjb25zb2xlLndhcm4oJ0NhbmNlbGluZyBlZGl0LiBCb29sZWFuIG9wZXJhdGlvbiBlcmFzZWQgZW50aXJlIHBvbHlnb24uJyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmZWF0dXJlSW5kZXggPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXNbMF07XG5cbiAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpXG4gICAgICAgIC5yZXBsYWNlR2VvbWV0cnkoZmVhdHVyZUluZGV4LCB1cGRhdGVkR2VvbWV0cnkuZ2VvbWV0cnkpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgY29uc3QgZWRpdEFjdGlvbjogR2VvSnNvbkVkaXRBY3Rpb24gPSB7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ3VuaW9uR2VvbWV0cnknLFxuICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZmVhdHVyZUluZGV4XSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRBZGRGZWF0dXJlQWN0aW9uKGZlYXR1cmVPckdlb21ldHJ5LCBwcm9wcy5kYXRhKTtcbiAgfVxuXG4gIGNyZWF0ZVRlbnRhdGl2ZUZlYXR1cmUocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBUZW50YXRpdmVGZWF0dXJlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge31cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuY3JlYXRlVGVudGF0aXZlRmVhdHVyZShwcm9wcyk7XG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgIHVwZGF0ZWREYXRhOiBwcm9wcy5kYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ3VwZGF0ZVRlbnRhdGl2ZUZlYXR1cmUnLFxuICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgIGZlYXR1cmU6IHRlbnRhdGl2ZUZlYXR1cmUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge31cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHt9XG4gIGhhbmRsZURyYWdnaW5nKGV2ZW50OiBEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge31cblxuICBoYW5kbGVLZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgIC8vIEJlY2F1c2UgdGhlIG5ldyBkcmF3aW5nIGZlYXR1cmUgaXMgZHJvcHBlZCwgc28gdGhlIGRhdGEgd2lsbCBrZWVwIGFzIHRoZSBzYW1lLlxuICAgICAgICB1cGRhdGVkRGF0YTogcHJvcHMuZGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICdjYW5jZWxGZWF0dXJlJyxcbiAgICAgICAgZWRpdENvbnRleHQ6IHt9LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbihwb3NpdGlvbjE6IFBvc2l0aW9uLCBwb3NpdGlvbjI6IFBvc2l0aW9uKTogUG9zaXRpb24ge1xuICBjb25zdCBpbnRlcm1lZGlhdGVQb3NpdGlvbiA9IFtcbiAgICAocG9zaXRpb24xWzBdICsgcG9zaXRpb24yWzBdKSAvIDIuMCxcbiAgICAocG9zaXRpb24xWzFdICsgcG9zaXRpb24yWzFdKSAvIDIuMCxcbiAgXTtcbiAgLy8gQHRzLWlnbm9yZVxuICByZXR1cm4gaW50ZXJtZWRpYXRlUG9zaXRpb247XG59XG4iXX0=