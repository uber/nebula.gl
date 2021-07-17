"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
          editType: 'circleResize',
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
        props.onEdit({
          updatedData: props.data,
          editType: 'circleResizeEnd',
          editContext: {
            featureIndexes: props.selectedIndexes
          }
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcmVzaXplLWNpcmNsZS1tb2RlLnRzIl0sIm5hbWVzIjpbIlJlc2l6ZUNpcmNsZU1vZGUiLCJwcm9wcyIsImhhbmRsZXMiLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwic2VsZWN0ZWRJbmRleGVzIiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJwaWNrcyIsIm1hcENvb3JkcyIsImxlbmd0aCIsIl9pc1Jlc2l6aW5nIiwiZmVhdHVyZUFzUGljayIsImZpbmQiLCJwaWNrIiwiaXNHdWlkZSIsIm9iamVjdCIsInByb3BlcnRpZXMiLCJzaGFwZSIsImluY2x1ZGVzIiwiaW5kZXgiLCJpbnRlcm1lZGlhdGVQb2ludCIsInBvc2l0aW9uSW5kZXhQcmVmaXgiLCJyZWZlcmVuY2VQb2ludCIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJsaW5lU3RyaW5nIiwicHJlZml4IiwibGluZVN0cmluZ0ZlYXR1cmUiLCJjYW5kaWRhdGVJbnRlcm1lZGlhdGVQb2ludCIsIm5lYXJlc3RQb2ludE9uTGluZSIsIm1vZGVDb25maWciLCJ2aWV3cG9ydCIsImRpc3QiLCJwb3NpdGlvbiIsInB1c2giLCJ0eXBlIiwiZ3VpZGVUeXBlIiwiZWRpdEhhbmRsZVR5cGUiLCJmZWF0dXJlSW5kZXgiLCJwb3NpdGlvbkluZGV4ZXMiLCJmZWF0dXJlcyIsImxpbmUiLCJpblBvaW50Iiwic29tZSIsImNvb3JkIiwiY29uc29sZSIsImxvZyIsImV2ZW50IiwiZWRpdEhhbmRsZSIsInBvaW50ZXJEb3duUGlja3MiLCJjYW5jZWxQYW4iLCJlZGl0SGFuZGxlUHJvcGVydGllcyIsImZlYXR1cmUiLCJnZXRTZWxlY3RlZEZlYXR1cmUiLCJjZW50ZXIiLCJudW1iZXJPZlN0ZXBzIiwiT2JqZWN0IiwiZW50cmllcyIsInJhZGl1cyIsIk1hdGgiLCJtYXgiLCJzdGVwcyIsIm9wdGlvbnMiLCJ1cGRhdGVkRmVhdHVyZSIsInVwZGF0ZWREYXRhIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJkYXRhIiwicmVwbGFjZUdlb21ldHJ5IiwiZ2V0T2JqZWN0Iiwib25FZGl0IiwiZWRpdFR5cGUiLCJlZGl0Q29udGV4dCIsImZlYXR1cmVJbmRleGVzIiwic2VsZWN0ZWRFZGl0SGFuZGxlIiwiX3NlbGVjdGVkRWRpdEhhbmRsZSIsImN1cnNvciIsImdldEN1cnNvciIsIm9uVXBkYXRlQ3Vyc29yIiwiaGFuZGxlc1BpY2tlZCIsIkdlb0pzb25FZGl0TW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBa0JBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tFQUVHLEs7Ozs7Ozs7OEJBRUpDLEssRUFBNkQ7QUFBQTs7QUFDckUsVUFBTUMsT0FBTyxHQUFHLEVBQWhCO0FBQ0EsVUFBTUMsc0JBQXNCLEdBQUdGLEtBQUssQ0FBQ0csZUFBckM7QUFGcUUsVUFJN0RDLG9CQUo2RCxHQUlwQ0osS0FKb0MsQ0FJN0RJLG9CQUo2RDtBQUtyRSxVQUFNQyxLQUFLLEdBQUdELG9CQUFvQixJQUFJQSxvQkFBb0IsQ0FBQ0MsS0FBM0Q7QUFDQSxVQUFNQyxTQUFTLEdBQUdGLG9CQUFvQixJQUFJQSxvQkFBb0IsQ0FBQ0UsU0FBL0QsQ0FOcUUsQ0FRckU7O0FBQ0EsVUFDRUQsS0FBSyxJQUNMQSxLQUFLLENBQUNFLE1BRE4sSUFFQUQsU0FGQSxJQUdBSixzQkFBc0IsQ0FBQ0ssTUFBdkIsS0FBa0MsQ0FIbEMsSUFJQSxDQUFDLEtBQUtDLFdBTFIsRUFNRTtBQUNBLFlBQU1DLGFBQWEsR0FBR0osS0FBSyxDQUFDSyxJQUFOLENBQVcsVUFBQ0MsSUFBRDtBQUFBLGlCQUFVLENBQUNBLElBQUksQ0FBQ0MsT0FBaEI7QUFBQSxTQUFYLENBQXRCLENBREEsQ0FHQTs7QUFDQSxZQUNFSCxhQUFhLElBQ2JBLGFBQWEsQ0FBQ0ksTUFBZCxDQUFxQkMsVUFBckIsQ0FB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aUNBQXFCdkUsS0FBckIsQ0FBdEI7O0FBQ0EsVUFBSXVFLGFBQWEsQ0FBQ3JFLE1BQWxCLEVBQTBCO0FBQ3hCLGVBQU8sTUFBUDtBQUNEOztBQUNELGFBQU8sSUFBUDtBQUNEOzs7O0VBbExtQ3NFLGdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5lYXJlc3RQb2ludE9uTGluZSBmcm9tICdAdHVyZi9uZWFyZXN0LXBvaW50LW9uLWxpbmUnO1xuaW1wb3J0IHsgcG9pbnQsIGxpbmVTdHJpbmcgYXMgdG9MaW5lU3RyaW5nIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgY2lyY2xlIGZyb20gJ0B0dXJmL2NpcmNsZSc7XG5pbXBvcnQgZGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IHR1cmZDZW50ZXIgZnJvbSAnQHR1cmYvY2VudGVyJztcbmltcG9ydCB7XG4gIHJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMsXG4gIG5lYXJlc3RQb2ludE9uUHJvamVjdGVkTGluZSxcbiAgZ2V0UGlja2VkRWRpdEhhbmRsZXMsXG4gIGdldFBpY2tlZEVkaXRIYW5kbGUsXG4gIE5lYXJlc3RQb2ludFR5cGUsXG59IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IExpbmVTdHJpbmcsIFBvaW50LCBGZWF0dXJlQ29sbGVjdGlvbiwgRmVhdHVyZU9mIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcyc7XG5pbXBvcnQge1xuICBNb2RlUHJvcHMsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIERyYWdnaW5nRXZlbnQsXG4gIFZpZXdwb3J0LFxuICBFZGl0SGFuZGxlRmVhdHVyZSxcbiAgR3VpZGVGZWF0dXJlQ29sbGVjdGlvbixcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgR2VvSnNvbkVkaXRNb2RlIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZSc7XG5pbXBvcnQgeyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4vaW1tdXRhYmxlLWZlYXR1cmUtY29sbGVjdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBSZXNpemVDaXJjbGVNb2RlIGV4dGVuZHMgR2VvSnNvbkVkaXRNb2RlIHtcbiAgX3NlbGVjdGVkRWRpdEhhbmRsZTogRWRpdEhhbmRsZUZlYXR1cmUgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBfaXNSZXNpemluZyA9IGZhbHNlO1xuXG4gIGdldEd1aWRlcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIGNvbnN0IGhhbmRsZXMgPSBbXTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzO1xuXG4gICAgY29uc3QgeyBsYXN0UG9pbnRlck1vdmVFdmVudCB9ID0gcHJvcHM7XG4gICAgY29uc3QgcGlja3MgPSBsYXN0UG9pbnRlck1vdmVFdmVudCAmJiBsYXN0UG9pbnRlck1vdmVFdmVudC5waWNrcztcbiAgICBjb25zdCBtYXBDb29yZHMgPSBsYXN0UG9pbnRlck1vdmVFdmVudCAmJiBsYXN0UG9pbnRlck1vdmVFdmVudC5tYXBDb29yZHM7XG5cbiAgICAvLyBpbnRlcm1lZGlhdGUgZWRpdCBoYW5kbGVcbiAgICBpZiAoXG4gICAgICBwaWNrcyAmJlxuICAgICAgcGlja3MubGVuZ3RoICYmXG4gICAgICBtYXBDb29yZHMgJiZcbiAgICAgIHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoID09PSAxICYmXG4gICAgICAhdGhpcy5faXNSZXNpemluZ1xuICAgICkge1xuICAgICAgY29uc3QgZmVhdHVyZUFzUGljayA9IHBpY2tzLmZpbmQoKHBpY2spID0+ICFwaWNrLmlzR3VpZGUpO1xuXG4gICAgICAvLyBpcyB0aGUgZmVhdHVyZSBpbiB0aGUgcGljayBzZWxlY3RlZFxuICAgICAgaWYgKFxuICAgICAgICBmZWF0dXJlQXNQaWNrICYmXG4gICAgICAgIGZlYXR1cmVBc1BpY2sub2JqZWN0LnByb3BlcnRpZXMuc2hhcGUgJiZcbiAgICAgICAgZmVhdHVyZUFzUGljay5vYmplY3QucHJvcGVydGllcy5zaGFwZS5pbmNsdWRlcygnQ2lyY2xlJykgJiZcbiAgICAgICAgcHJvcHMuc2VsZWN0ZWRJbmRleGVzLmluY2x1ZGVzKGZlYXR1cmVBc1BpY2suaW5kZXgpXG4gICAgICApIHtcbiAgICAgICAgbGV0IGludGVybWVkaWF0ZVBvaW50OiBOZWFyZXN0UG9pbnRUeXBlIHwgbnVsbCB8IHVuZGVmaW5lZCA9IG51bGw7XG4gICAgICAgIGxldCBwb3NpdGlvbkluZGV4UHJlZml4ID0gW107XG4gICAgICAgIGNvbnN0IHJlZmVyZW5jZVBvaW50ID0gcG9pbnQobWFwQ29vcmRzKTtcbiAgICAgICAgLy8gcHJvY2VzcyBhbGwgbGluZXMgb2YgdGhlIChzaW5nbGUpIGZlYXR1cmVcbiAgICAgICAgcmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyhcbiAgICAgICAgICBmZWF0dXJlQXNQaWNrLm9iamVjdC5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgICAgICBbXSxcbiAgICAgICAgICAobGluZVN0cmluZywgcHJlZml4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaW5lU3RyaW5nRmVhdHVyZSA9IHRvTGluZVN0cmluZyhsaW5lU3RyaW5nKTtcbiAgICAgICAgICAgIGNvbnN0IGNhbmRpZGF0ZUludGVybWVkaWF0ZVBvaW50ID0gdGhpcy5uZWFyZXN0UG9pbnRPbkxpbmUoXG4gICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgbGluZVN0cmluZ0ZlYXR1cmUsXG4gICAgICAgICAgICAgIHJlZmVyZW5jZVBvaW50LFxuICAgICAgICAgICAgICBwcm9wcy5tb2RlQ29uZmlnICYmIHByb3BzLm1vZGVDb25maWcudmlld3BvcnRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICFpbnRlcm1lZGlhdGVQb2ludCB8fFxuICAgICAgICAgICAgICBjYW5kaWRhdGVJbnRlcm1lZGlhdGVQb2ludC5wcm9wZXJ0aWVzLmRpc3QgPCBpbnRlcm1lZGlhdGVQb2ludC5wcm9wZXJ0aWVzLmRpc3RcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBpbnRlcm1lZGlhdGVQb2ludCA9IGNhbmRpZGF0ZUludGVybWVkaWF0ZVBvaW50O1xuICAgICAgICAgICAgICBwb3NpdGlvbkluZGV4UHJlZml4ID0gcHJlZml4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gdGFjayBvbiB0aGUgbG9uZSBpbnRlcm1lZGlhdGUgcG9pbnQgdG8gdGhlIHNldCBvZiBoYW5kbGVzXG4gICAgICAgIGlmIChpbnRlcm1lZGlhdGVQb2ludCkge1xuICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGdlb21ldHJ5OiB7IGNvb3JkaW5hdGVzOiBwb3NpdGlvbiB9LFxuICAgICAgICAgICAgcHJvcGVydGllczogeyBpbmRleCB9LFxuICAgICAgICAgIH0gPSBpbnRlcm1lZGlhdGVQb2ludDtcbiAgICAgICAgICBoYW5kbGVzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICBndWlkZVR5cGU6ICdlZGl0SGFuZGxlJyxcbiAgICAgICAgICAgICAgZWRpdEhhbmRsZVR5cGU6ICdpbnRlcm1lZGlhdGUnLFxuICAgICAgICAgICAgICBmZWF0dXJlSW5kZXg6IGZlYXR1cmVBc1BpY2suaW5kZXgsXG4gICAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogWy4uLnBvc2l0aW9uSW5kZXhQcmVmaXgsIGluZGV4ICsgMV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgICAgICAgICAgY29vcmRpbmF0ZXM6IHBvc2l0aW9uLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IGhhbmRsZXMsXG4gICAgfTtcbiAgfVxuXG4gIC8vIHR1cmYuanMgZG9lcyBub3Qgc3VwcG9ydCBlbGV2YXRpb24gZm9yIG5lYXJlc3RQb2ludE9uTGluZVxuICBuZWFyZXN0UG9pbnRPbkxpbmUoXG4gICAgbGluZTogRmVhdHVyZU9mPExpbmVTdHJpbmc+LFxuICAgIGluUG9pbnQ6IEZlYXR1cmVPZjxQb2ludD4sXG4gICAgdmlld3BvcnQ6IFZpZXdwb3J0IHwgbnVsbCB8IHVuZGVmaW5lZFxuICApOiBOZWFyZXN0UG9pbnRUeXBlIHtcbiAgICBjb25zdCB7IGNvb3JkaW5hdGVzIH0gPSBsaW5lLmdlb21ldHJ5O1xuICAgIGlmIChjb29yZGluYXRlcy5zb21lKChjb29yZCkgPT4gY29vcmQubGVuZ3RoID4gMikpIHtcbiAgICAgIGlmICh2aWV3cG9ydCkge1xuICAgICAgICAvLyBUaGlzIGxpbmUgaGFzIGVsZXZhdGlvbiwgd2UgbmVlZCB0byB1c2UgYWx0ZXJuYXRpdmUgYWxnb3JpdGhtXG4gICAgICAgIHJldHVybiBuZWFyZXN0UG9pbnRPblByb2plY3RlZExpbmUobGluZSwgaW5Qb2ludCwgdmlld3BvcnQpO1xuICAgICAgfVxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAnRWRpdGluZyAzRCBwb2ludCBidXQgbW9kZUNvbmZpZy52aWV3cG9ydCBub3QgcHJvdmlkZWQuIEZhbGxpbmcgYmFjayB0byAyRCBsb2dpYy4nXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBuZWFyZXN0UG9pbnRPbkxpbmUobGluZSwgaW5Qb2ludCk7XG4gIH1cblxuICBoYW5kbGVEcmFnZ2luZyhldmVudDogRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5wb2ludGVyRG93blBpY2tzKTtcblxuICAgIGlmIChlZGl0SGFuZGxlKSB7XG4gICAgICAvLyBDYW5jZWwgbWFwIHBhbm5pbmcgaWYgcG9pbnRlciB3ZW50IGRvd24gb24gYW4gZWRpdCBoYW5kbGVcbiAgICAgIGV2ZW50LmNhbmNlbFBhbigpO1xuXG4gICAgICBjb25zdCBlZGl0SGFuZGxlUHJvcGVydGllcyA9IGVkaXRIYW5kbGUucHJvcGVydGllcztcblxuICAgICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzKTtcbiAgICAgIGNvbnN0IGNlbnRlciA9IHR1cmZDZW50ZXIoZmVhdHVyZSkuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICBjb25zdCBudW1iZXJPZlN0ZXBzID0gT2JqZWN0LmVudHJpZXMoZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlc1swXSkubGVuZ3RoIC0gMTtcbiAgICAgIGNvbnN0IHJhZGl1cyA9IE1hdGgubWF4KGRpc3RhbmNlKGNlbnRlciwgZXZlbnQubWFwQ29vcmRzKSwgMC4wMDEpO1xuXG4gICAgICBjb25zdCB7IHN0ZXBzID0gbnVtYmVyT2ZTdGVwcyB9ID0ge307XG4gICAgICBjb25zdCBvcHRpb25zID0geyBzdGVwcyB9O1xuICAgICAgY29uc3QgdXBkYXRlZEZlYXR1cmUgPSBjaXJjbGUoY2VudGVyLCByYWRpdXMsIG9wdGlvbnMpO1xuICAgICAgY29uc3QgZ2VvbWV0cnkgPSB1cGRhdGVkRmVhdHVyZS5nZW9tZXRyeTtcblxuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSlcbiAgICAgICAgLnJlcGxhY2VHZW9tZXRyeShlZGl0SGFuZGxlUHJvcGVydGllcy5mZWF0dXJlSW5kZXgsIGdlb21ldHJ5KVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ2NpcmNsZVJlc2l6ZScsXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtlZGl0SGFuZGxlUHJvcGVydGllcy5mZWF0dXJlSW5kZXhdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9pc1Jlc2l6aW5nKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZEVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICAgIHRoaXMuX3NlbGVjdGVkRWRpdEhhbmRsZSA9XG4gICAgICAgIHNlbGVjdGVkRWRpdEhhbmRsZSAmJiBzZWxlY3RlZEVkaXRIYW5kbGUucHJvcGVydGllcy5lZGl0SGFuZGxlVHlwZSA9PT0gJ2ludGVybWVkaWF0ZSdcbiAgICAgICAgICA/IHNlbGVjdGVkRWRpdEhhbmRsZVxuICAgICAgICAgIDogbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBjdXJzb3IgPSB0aGlzLmdldEN1cnNvcihldmVudCk7XG4gICAgcHJvcHMub25VcGRhdGVDdXJzb3IoY3Vyc29yKTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRFZGl0SGFuZGxlKSB7XG4gICAgICB0aGlzLl9pc1Jlc2l6aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGlmICh0aGlzLl9pc1Jlc2l6aW5nKSB7XG4gICAgICBwcm9wcy5vbkVkaXQoe1xuICAgICAgICB1cGRhdGVkRGF0YTogcHJvcHMuZGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICdjaXJjbGVSZXNpemVFbmQnLFxuICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBwcm9wcy5zZWxlY3RlZEluZGV4ZXMsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fc2VsZWN0ZWRFZGl0SGFuZGxlID0gbnVsbDtcbiAgICAgIHRoaXMuX2lzUmVzaXppbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBnZXRDdXJzb3IoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBwaWNrcyA9IChldmVudCAmJiBldmVudC5waWNrcykgfHwgW107XG5cbiAgICBjb25zdCBoYW5kbGVzUGlja2VkID0gZ2V0UGlja2VkRWRpdEhhbmRsZXMocGlja3MpO1xuICAgIGlmIChoYW5kbGVzUGlja2VkLmxlbmd0aCkge1xuICAgICAgcmV0dXJuICdjZWxsJztcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==