"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResizeCircleMode = void 0;

var _nearestPointOnLine2 = _interopRequireDefault(require("@turf/nearest-point-on-line"));

var _helpers = require("@turf/helpers");

var _circle = _interopRequireDefault(require("@turf/circle"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _center = _interopRequireDefault(require("@turf/center"));

var _utils = require("../utils");

var _geojsonEditMode = require("./geojson-edit-mode");

var _immutableFeatureCollection = require("./immutable-feature-collection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ResizeCircleMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(ResizeCircleMode, _GeoJsonEditMode);

  var _super = _createSuper(ResizeCircleMode);

  function ResizeCircleMode() {
    var _this;

    _classCallCheck(this, ResizeCircleMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_selectedEditHandle", void 0);

    _defineProperty(_assertThisInitialized(_this), "_isResizing", false);

    return _this;
  }

  _createClass(ResizeCircleMode, [{
    key: "getGuides",
    value: function getGuides(props) {
      var _this2 = this;

      var handles = [];
      var selectedFeatureIndexes = props.selectedIndexes;
      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var picks = lastPointerMoveEvent && lastPointerMoveEvent.picks;
      var mapCoords = lastPointerMoveEvent && lastPointerMoveEvent.mapCoords; // intermediate edit handle

      if (picks && picks.length && mapCoords && selectedFeatureIndexes.length === 1 && !this._isResizing) {
        var featureAsPick = picks.find(function (pick) {
          return !pick.isGuide;
        }); // is the feature in the pick selected

        if (featureAsPick && featureAsPick.object.properties.shape && featureAsPick.object.properties.shape.includes('Circle') && props.selectedIndexes.includes(featureAsPick.index)) {
          var intermediatePoint = null;
          var positionIndexPrefix = [];
          var referencePoint = (0, _helpers.point)(mapCoords); // process all lines of the (single) feature

          (0, _utils.recursivelyTraverseNestedArrays)(featureAsPick.object.geometry.coordinates, [], function (lineString, prefix) {
            var lineStringFeature = (0, _helpers.lineString)(lineString);

            var candidateIntermediatePoint = _this2.nearestPointOnLine( // @ts-ignore
            lineStringFeature, referencePoint, props.modeConfig && props.modeConfig.viewport);

            if (!intermediatePoint || candidateIntermediatePoint.properties.dist < intermediatePoint.properties.dist) {
              intermediatePoint = candidateIntermediatePoint;
              positionIndexPrefix = prefix;
            }
          }); // tack on the lone intermediate point to the set of handles

          if (intermediatePoint) {
            var _intermediatePoint = intermediatePoint,
                position = _intermediatePoint.geometry.coordinates,
                index = _intermediatePoint.properties.index;
            handles.push({
              type: 'Feature',
              properties: {
                guideType: 'editHandle',
                editHandleType: 'intermediate',
                featureIndex: featureAsPick.index,
                positionIndexes: [].concat(_toConsumableArray(positionIndexPrefix), [index + 1])
              },
              geometry: {
                type: 'Point',
                coordinates: position
              }
            });
          }
        }
      }

      return {
        type: 'FeatureCollection',
        features: handles
      };
    } // turf.js does not support elevation for nearestPointOnLine

  }, {
    key: "nearestPointOnLine",
    value: function nearestPointOnLine(line, inPoint, viewport) {
      var coordinates = line.geometry.coordinates;

      if (coordinates.some(function (coord) {
        return coord.length > 2;
      })) {
        if (viewport) {
          // This line has elevation, we need to use alternative algorithm
          return (0, _utils.nearestPointOnProjectedLine)(line, inPoint, viewport);
        } // eslint-disable-next-line no-console,no-undef


        console.log('Editing 3D point but modeConfig.viewport not provided. Falling back to 2D logic.');
      }

      return (0, _nearestPointOnLine2["default"])(line, inPoint);
    }
  }, {
    key: "handleDragging",
    value: function handleDragging(event, props) {
      var editHandle = (0, _utils.getPickedEditHandle)(event.pointerDownPicks);

      if (editHandle) {
        // Cancel map panning if pointer went down on an edit handle
        event.cancelPan();
        var editHandleProperties = editHandle.properties;
        var feature = this.getSelectedFeature(props);
        var center = (0, _center["default"])(feature).geometry.coordinates;
        var numberOfSteps = Object.entries(feature.geometry.coordinates[0]).length - 1;
        var radius = Math.max((0, _distance["default"])(center, event.mapCoords), 0.001);
        var _ref = {},
            _ref$steps = _ref.steps,
            steps = _ref$steps === void 0 ? numberOfSteps : _ref$steps;
        var options = {
          steps: steps
        };
        var updatedFeature = (0, _circle["default"])(center, radius, options);
        var geometry = updatedFeature.geometry;
        var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replaceGeometry(editHandleProperties.featureIndex, geometry).getObject();
        props.onEdit({
          updatedData: updatedData,
          editType: 'unionGeometry',
          editContext: {
            featureIndexes: [editHandleProperties.featureIndex]
          }
        });
      }
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      if (!this._isResizing) {
        var selectedEditHandle = (0, _utils.getPickedEditHandle)(event.picks);
        this._selectedEditHandle = selectedEditHandle && selectedEditHandle.properties.editHandleType === 'intermediate' ? selectedEditHandle : null;
      }

      var cursor = this.getCursor(event);
      props.onUpdateCursor(cursor);
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      if (this._selectedEditHandle) {
        this._isResizing = true;
      }
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      if (this._isResizing) {
        this._selectedEditHandle = null;
        this._isResizing = false;
      }
    }
  }, {
    key: "getCursor",
    value: function getCursor(event) {
      var picks = event && event.picks || [];
      var handlesPicked = (0, _utils.getPickedEditHandles)(picks);

      if (handlesPicked.length) {
        return 'cell';
      }

      return null;
    }
  }]);

  return ResizeCircleMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.ResizeCircleMode = ResizeCircleMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcmVzaXplLWNpcmNsZS1tb2RlLnRzIl0sIm5hbWVzIjpbIlJlc2l6ZUNpcmNsZU1vZGUiLCJwcm9wcyIsImhhbmRsZXMiLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwic2VsZWN0ZWRJbmRleGVzIiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJwaWNrcyIsIm1hcENvb3JkcyIsImxlbmd0aCIsIl9pc1Jlc2l6aW5nIiwiZmVhdHVyZUFzUGljayIsImZpbmQiLCJwaWNrIiwiaXNHdWlkZSIsIm9iamVjdCIsInByb3BlcnRpZXMiLCJzaGFwZSIsImluY2x1ZGVzIiwiaW5kZXgiLCJpbnRlcm1lZGlhdGVQb2ludCIsInBvc2l0aW9uSW5kZXhQcmVmaXgiLCJyZWZlcmVuY2VQb2ludCIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJsaW5lU3RyaW5nIiwicHJlZml4IiwibGluZVN0cmluZ0ZlYXR1cmUiLCJjYW5kaWRhdGVJbnRlcm1lZGlhdGVQb2ludCIsIm5lYXJlc3RQb2ludE9uTGluZSIsIm1vZGVDb25maWciLCJ2aWV3cG9ydCIsImRpc3QiLCJwb3NpdGlvbiIsInB1c2giLCJ0eXBlIiwiZ3VpZGVUeXBlIiwiZWRpdEhhbmRsZVR5cGUiLCJmZWF0dXJlSW5kZXgiLCJwb3NpdGlvbkluZGV4ZXMiLCJmZWF0dXJlcyIsImxpbmUiLCJpblBvaW50Iiwic29tZSIsImNvb3JkIiwiY29uc29sZSIsImxvZyIsImV2ZW50IiwiZWRpdEhhbmRsZSIsInBvaW50ZXJEb3duUGlja3MiLCJjYW5jZWxQYW4iLCJlZGl0SGFuZGxlUHJvcGVydGllcyIsImZlYXR1cmUiLCJnZXRTZWxlY3RlZEZlYXR1cmUiLCJjZW50ZXIiLCJudW1iZXJPZlN0ZXBzIiwiT2JqZWN0IiwiZW50cmllcyIsInJhZGl1cyIsIk1hdGgiLCJtYXgiLCJzdGVwcyIsIm9wdGlvbnMiLCJ1cGRhdGVkRmVhdHVyZSIsInVwZGF0ZWREYXRhIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJkYXRhIiwicmVwbGFjZUdlb21ldHJ5IiwiZ2V0T2JqZWN0Iiwib25FZGl0IiwiZWRpdFR5cGUiLCJlZGl0Q29udGV4dCIsImZlYXR1cmVJbmRleGVzIiwic2VsZWN0ZWRFZGl0SGFuZGxlIiwiX3NlbGVjdGVkRWRpdEhhbmRsZSIsImN1cnNvciIsImdldEN1cnNvciIsIm9uVXBkYXRlQ3Vyc29yIiwiaGFuZGxlc1BpY2tlZCIsIkdlb0pzb25FZGl0TW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQWtCQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tFQUVHLEs7Ozs7Ozs7OEJBRUpDLEssRUFBNkQ7QUFBQTs7QUFDckUsVUFBTUMsT0FBTyxHQUFHLEVBQWhCO0FBQ0EsVUFBTUMsc0JBQXNCLEdBQUdGLEtBQUssQ0FBQ0csZUFBckM7QUFGcUUsVUFJN0RDLG9CQUo2RCxHQUlwQ0osS0FKb0MsQ0FJN0RJLG9CQUo2RDtBQUtyRSxVQUFNQyxLQUFLLEdBQUdELG9CQUFvQixJQUFJQSxvQkFBb0IsQ0FBQ0MsS0FBM0Q7QUFDQSxVQUFNQyxTQUFTLEdBQUdGLG9CQUFvQixJQUFJQSxvQkFBb0IsQ0FBQ0UsU0FBL0QsQ0FOcUUsQ0FRckU7O0FBQ0EsVUFDRUQsS0FBSyxJQUNMQSxLQUFLLENBQUNFLE1BRE4sSUFFQUQsU0FGQSxJQUdBSixzQkFBc0IsQ0FBQ0ssTUFBdkIsS0FBa0MsQ0FIbEMsSUFJQSxDQUFDLEtBQUtDLFdBTFIsRUFNRTtBQUNBLFlBQU1DLGFBQWEsR0FBR0osS0FBSyxDQUFDSyxJQUFOLENBQVcsVUFBQ0MsSUFBRDtBQUFBLGlCQUFVLENBQUNBLElBQUksQ0FBQ0MsT0FBaEI7QUFBQSxTQUFYLENBQXRCLENBREEsQ0FHQTs7QUFDQSxZQUNFSCxhQUFhLElBQ2JBLGFBQWEsQ0FBQ0ksTUFBZCxDQUFxQkMsVUFBckIsQ0FB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YXJlc3QtcG9pbnQtb24tbGluZSc7XG5pbXBvcnQgeyBwb2ludCwgbGluZVN0cmluZyBhcyB0b0xpbmVTdHJpbmcgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCBjaXJjbGUgZnJvbSAnQHR1cmYvY2lyY2xlJztcbmltcG9ydCBkaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgdHVyZkNlbnRlciBmcm9tICdAdHVyZi9jZW50ZXInO1xuaW1wb3J0IHtcbiAgcmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyxcbiAgbmVhcmVzdFBvaW50T25Qcm9qZWN0ZWRMaW5lLFxuICBnZXRQaWNrZWRFZGl0SGFuZGxlcyxcbiAgZ2V0UGlja2VkRWRpdEhhbmRsZSxcbiAgTmVhcmVzdFBvaW50VHlwZSxcbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgTGluZVN0cmluZywgUG9pbnQsIEZlYXR1cmVDb2xsZWN0aW9uLCBGZWF0dXJlT2YgfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7XG4gIE1vZGVQcm9wcyxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgRHJhZ2dpbmdFdmVudCxcbiAgVmlld3BvcnQsXG4gIEVkaXRIYW5kbGVGZWF0dXJlLFxuICBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBHZW9Kc29uRWRpdE1vZGUgfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlJztcbmltcG9ydCB7IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi9pbW11dGFibGUtZmVhdHVyZS1jb2xsZWN0aW9uJztcblxuZXhwb3J0IGNsYXNzIFJlc2l6ZUNpcmNsZU1vZGUgZXh0ZW5kcyBHZW9Kc29uRWRpdE1vZGUge1xuICBfc2VsZWN0ZWRFZGl0SGFuZGxlOiBFZGl0SGFuZGxlRmVhdHVyZSB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIF9pc1Jlc2l6aW5nID0gZmFsc2U7XG5cbiAgZ2V0R3VpZGVzKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogR3VpZGVGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgY29uc3QgaGFuZGxlcyA9IFtdO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXM7XG5cbiAgICBjb25zdCB7IGxhc3RQb2ludGVyTW92ZUV2ZW50IH0gPSBwcm9wcztcbiAgICBjb25zdCBwaWNrcyA9IGxhc3RQb2ludGVyTW92ZUV2ZW50ICYmIGxhc3RQb2ludGVyTW92ZUV2ZW50LnBpY2tzO1xuICAgIGNvbnN0IG1hcENvb3JkcyA9IGxhc3RQb2ludGVyTW92ZUV2ZW50ICYmIGxhc3RQb2ludGVyTW92ZUV2ZW50Lm1hcENvb3JkcztcblxuICAgIC8vIGludGVybWVkaWF0ZSBlZGl0IGhhbmRsZVxuICAgIGlmIChcbiAgICAgIHBpY2tzICYmXG4gICAgICBwaWNrcy5sZW5ndGggJiZcbiAgICAgIG1hcENvb3JkcyAmJlxuICAgICAgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGggPT09IDEgJiZcbiAgICAgICF0aGlzLl9pc1Jlc2l6aW5nXG4gICAgKSB7XG4gICAgICBjb25zdCBmZWF0dXJlQXNQaWNrID0gcGlja3MuZmluZCgocGljaykgPT4gIXBpY2suaXNHdWlkZSk7XG5cbiAgICAgIC8vIGlzIHRoZSBmZWF0dXJlIGluIHRoZSBwaWNrIHNlbGVjdGVkXG4gICAgICBpZiAoXG4gICAgICAgIGZlYXR1cmVBc1BpY2sgJiZcbiAgICAgICAgZmVhdHVyZUFzUGljay5vYmplY3QucHJvcGVydGllcy5zaGFwZSAmJlxuICAgICAgICBmZWF0dXJlQXNQaWNrLm9iamVjdC5wcm9wZXJ0aWVzLnNoYXBlLmluY2x1ZGVzKCdDaXJjbGUnKSAmJlxuICAgICAgICBwcm9wcy5zZWxlY3RlZEluZGV4ZXMuaW5jbHVkZXMoZmVhdHVyZUFzUGljay5pbmRleClcbiAgICAgICkge1xuICAgICAgICBsZXQgaW50ZXJtZWRpYXRlUG9pbnQ6IE5lYXJlc3RQb2ludFR5cGUgfCBudWxsIHwgdW5kZWZpbmVkID0gbnVsbDtcbiAgICAgICAgbGV0IHBvc2l0aW9uSW5kZXhQcmVmaXggPSBbXTtcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlUG9pbnQgPSBwb2ludChtYXBDb29yZHMpO1xuICAgICAgICAvLyBwcm9jZXNzIGFsbCBsaW5lcyBvZiB0aGUgKHNpbmdsZSkgZmVhdHVyZVxuICAgICAgICByZWN1cnNpdmVseVRyYXZlcnNlTmVzdGVkQXJyYXlzKFxuICAgICAgICAgIGZlYXR1cmVBc1BpY2sub2JqZWN0Lmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgIFtdLFxuICAgICAgICAgIChsaW5lU3RyaW5nLCBwcmVmaXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmVTdHJpbmdGZWF0dXJlID0gdG9MaW5lU3RyaW5nKGxpbmVTdHJpbmcpO1xuICAgICAgICAgICAgY29uc3QgY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQgPSB0aGlzLm5lYXJlc3RQb2ludE9uTGluZShcbiAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBsaW5lU3RyaW5nRmVhdHVyZSxcbiAgICAgICAgICAgICAgcmVmZXJlbmNlUG9pbnQsXG4gICAgICAgICAgICAgIHByb3BzLm1vZGVDb25maWcgJiYgcHJvcHMubW9kZUNvbmZpZy52aWV3cG9ydFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgIWludGVybWVkaWF0ZVBvaW50IHx8XG4gICAgICAgICAgICAgIGNhbmRpZGF0ZUludGVybWVkaWF0ZVBvaW50LnByb3BlcnRpZXMuZGlzdCA8IGludGVybWVkaWF0ZVBvaW50LnByb3BlcnRpZXMuZGlzdFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGludGVybWVkaWF0ZVBvaW50ID0gY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQ7XG4gICAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhQcmVmaXggPSBwcmVmaXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICAvLyB0YWNrIG9uIHRoZSBsb25lIGludGVybWVkaWF0ZSBwb2ludCB0byB0aGUgc2V0IG9mIGhhbmRsZXNcbiAgICAgICAgaWYgKGludGVybWVkaWF0ZVBvaW50KSB7XG4gICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgZ2VvbWV0cnk6IHsgY29vcmRpbmF0ZXM6IHBvc2l0aW9uIH0sXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7IGluZGV4IH0sXG4gICAgICAgICAgfSA9IGludGVybWVkaWF0ZVBvaW50O1xuICAgICAgICAgIGhhbmRsZXMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGd1aWRlVHlwZTogJ2VkaXRIYW5kbGUnLFxuICAgICAgICAgICAgICBlZGl0SGFuZGxlVHlwZTogJ2ludGVybWVkaWF0ZScsXG4gICAgICAgICAgICAgIGZlYXR1cmVJbmRleDogZmVhdHVyZUFzUGljay5pbmRleCxcbiAgICAgICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBbLi4ucG9zaXRpb25JbmRleFByZWZpeCwgaW5kZXggKyAxXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgICAgICAgICBjb29yZGluYXRlczogcG9zaXRpb24sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogaGFuZGxlcyxcbiAgICB9O1xuICB9XG5cbiAgLy8gdHVyZi5qcyBkb2VzIG5vdCBzdXBwb3J0IGVsZXZhdGlvbiBmb3IgbmVhcmVzdFBvaW50T25MaW5lXG4gIG5lYXJlc3RQb2ludE9uTGluZShcbiAgICBsaW5lOiBGZWF0dXJlT2Y8TGluZVN0cmluZz4sXG4gICAgaW5Qb2ludDogRmVhdHVyZU9mPFBvaW50PixcbiAgICB2aWV3cG9ydDogVmlld3BvcnQgfCBudWxsIHwgdW5kZWZpbmVkXG4gICk6IE5lYXJlc3RQb2ludFR5cGUge1xuICAgIGNvbnN0IHsgY29vcmRpbmF0ZXMgfSA9IGxpbmUuZ2VvbWV0cnk7XG4gICAgaWYgKGNvb3JkaW5hdGVzLnNvbWUoKGNvb3JkKSA9PiBjb29yZC5sZW5ndGggPiAyKSkge1xuICAgICAgaWYgKHZpZXdwb3J0KSB7XG4gICAgICAgIC8vIFRoaXMgbGluZSBoYXMgZWxldmF0aW9uLCB3ZSBuZWVkIHRvIHVzZSBhbHRlcm5hdGl2ZSBhbGdvcml0aG1cbiAgICAgICAgcmV0dXJuIG5lYXJlc3RQb2ludE9uUHJvamVjdGVkTGluZShsaW5lLCBpblBvaW50LCB2aWV3cG9ydCk7XG4gICAgICB9XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICdFZGl0aW5nIDNEIHBvaW50IGJ1dCBtb2RlQ29uZmlnLnZpZXdwb3J0IG5vdCBwcm92aWRlZC4gRmFsbGluZyBiYWNrIHRvIDJEIGxvZ2ljLidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5lYXJlc3RQb2ludE9uTGluZShsaW5lLCBpblBvaW50KTtcbiAgfVxuXG4gIGhhbmRsZURyYWdnaW5nKGV2ZW50OiBEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge1xuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBvaW50ZXJEb3duUGlja3MpO1xuXG4gICAgaWYgKGVkaXRIYW5kbGUpIHtcbiAgICAgIC8vIENhbmNlbCBtYXAgcGFubmluZyBpZiBwb2ludGVyIHdlbnQgZG93biBvbiBhbiBlZGl0IGhhbmRsZVxuICAgICAgZXZlbnQuY2FuY2VsUGFuKCk7XG5cbiAgICAgIGNvbnN0IGVkaXRIYW5kbGVQcm9wZXJ0aWVzID0gZWRpdEhhbmRsZS5wcm9wZXJ0aWVzO1xuXG4gICAgICBjb25zdCBmZWF0dXJlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmUocHJvcHMpO1xuICAgICAgY29uc3QgY2VudGVyID0gdHVyZkNlbnRlcihmZWF0dXJlKS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgIGNvbnN0IG51bWJlck9mU3RlcHMgPSBPYmplY3QuZW50cmllcyhmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdKS5sZW5ndGggLSAxO1xuICAgICAgY29uc3QgcmFkaXVzID0gTWF0aC5tYXgoZGlzdGFuY2UoY2VudGVyLCBldmVudC5tYXBDb29yZHMpLCAwLjAwMSk7XG5cbiAgICAgIGNvbnN0IHsgc3RlcHMgPSBudW1iZXJPZlN0ZXBzIH0gPSB7fTtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IHN0ZXBzIH07XG4gICAgICBjb25zdCB1cGRhdGVkRmVhdHVyZSA9IGNpcmNsZShjZW50ZXIsIHJhZGl1cywgb3B0aW9ucyk7XG4gICAgICBjb25zdCBnZW9tZXRyeSA9IHVwZGF0ZWRGZWF0dXJlLmdlb21ldHJ5O1xuXG4gICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKVxuICAgICAgICAucmVwbGFjZUdlb21ldHJ5KGVkaXRIYW5kbGVQcm9wZXJ0aWVzLmZlYXR1cmVJbmRleCwgZ2VvbWV0cnkpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgcHJvcHMub25FZGl0KHtcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAndW5pb25HZW9tZXRyeScsXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtlZGl0SGFuZGxlUHJvcGVydGllcy5mZWF0dXJlSW5kZXhdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9pc1Jlc2l6aW5nKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZEVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICAgIHRoaXMuX3NlbGVjdGVkRWRpdEhhbmRsZSA9XG4gICAgICAgIHNlbGVjdGVkRWRpdEhhbmRsZSAmJiBzZWxlY3RlZEVkaXRIYW5kbGUucHJvcGVydGllcy5lZGl0SGFuZGxlVHlwZSA9PT0gJ2ludGVybWVkaWF0ZSdcbiAgICAgICAgICA/IHNlbGVjdGVkRWRpdEhhbmRsZVxuICAgICAgICAgIDogbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJzb3IgPSB0aGlzLmdldEN1cnNvcihldmVudCk7XG4gICAgcHJvcHMub25VcGRhdGVDdXJzb3IoY3Vyc29yKTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRFZGl0SGFuZGxlKSB7XG4gICAgICB0aGlzLl9pc1Jlc2l6aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGlmICh0aGlzLl9pc1Jlc2l6aW5nKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZEVkaXRIYW5kbGUgPSBudWxsO1xuICAgICAgdGhpcy5faXNSZXNpemluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGdldEN1cnNvcihldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHBpY2tzID0gKGV2ZW50ICYmIGV2ZW50LnBpY2tzKSB8fCBbXTtcblxuICAgIGNvbnN0IGhhbmRsZXNQaWNrZWQgPSBnZXRQaWNrZWRFZGl0SGFuZGxlcyhwaWNrcyk7XG4gICAgaWYgKGhhbmRsZXNQaWNrZWQubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJ2NlbGwnO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19