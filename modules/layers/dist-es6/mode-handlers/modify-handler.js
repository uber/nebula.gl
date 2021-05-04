"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModifyHandler = void 0;

var _nearestPointOnLine2 = _interopRequireDefault(require("@turf/nearest-point-on-line"));

var _helpers = require("@turf/helpers");

var _utils = require("../utils");

var _modeHandler = require("./mode-handler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO edit-modes: delete handlers once EditMode fully implemented
var ModifyHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(ModifyHandler, _ModeHandler);

  var _super = _createSuper(ModifyHandler);

  function ModifyHandler() {
    var _this;

    _classCallCheck(this, ModifyHandler);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_lastPointerMovePicks", void 0);

    return _this;
  }

  _createClass(ModifyHandler, [{
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      var _this2 = this;

      var handles = [];

      var _this$featureCollecti = this.featureCollection.getObject(),
          features = _this$featureCollecti.features;

      var _iterator = _createForOfIteratorHelper(this.getSelectedFeatureIndexes()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _index = _step.value;

          if (_index < features.length) {
            var _handles;

            var geometry = features[_index].geometry;

            (_handles = handles).push.apply(_handles, _toConsumableArray((0, _modeHandler.getEditHandlesForGeometry)(geometry, _index)));
          } else {
            console.warn("selectedFeatureIndexes out of range ".concat(_index)); // eslint-disable-line no-console,no-undef
          }
        } // intermediate edit handle

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (picks && picks.length && groundCoords) {
        var existingEditHandle = picks.find(function (pick) {
          return pick.isEditingHandle && pick.object && pick.object.type === 'existing';
        }); // don't show intermediate point when too close to an existing edit handle

        var featureAsPick = !existingEditHandle && picks.find(function (pick) {
          return !pick.isEditingHandle;
        }); // is the feature in the pick selected

        if (featureAsPick && !featureAsPick.object.geometry.type.includes('Point') && this.getSelectedFeatureIndexes().includes(featureAsPick.index)) {
          var intermediatePoint = null;
          var positionIndexPrefix = [];
          var referencePoint = (0, _helpers.point)(groundCoords); // process all lines of the (single) feature

          (0, _utils.recursivelyTraverseNestedArrays)(featureAsPick.object.geometry.coordinates, [], function (lineString, prefix) {
            var lineStringFeature = (0, _helpers.lineString)(lineString);

            var candidateIntermediatePoint = _this2.nearestPointOnLine( // @ts-ignore
            lineStringFeature, referencePoint);

            if (!intermediatePoint || candidateIntermediatePoint.properties.dist < intermediatePoint.properties.dist) {
              intermediatePoint = candidateIntermediatePoint;
              positionIndexPrefix = prefix;
            }
          }); // tack on the lone intermediate point to the set of handles

          if (intermediatePoint) {
            var _intermediatePoint = intermediatePoint,
                position = _intermediatePoint.geometry.coordinates,
                index = _intermediatePoint.properties.index;
            handles = [].concat(_toConsumableArray(handles), [{
              position: position,
              positionIndexes: [].concat(_toConsumableArray(positionIndexPrefix), [index + 1]),
              featureIndex: featureAsPick.index,
              type: 'intermediate'
            }]);
          }
        }
      }

      return handles;
    } // turf.js does not support elevation for nearestPointOnLine

  }, {
    key: "nearestPointOnLine",
    value: function nearestPointOnLine(line, inPoint) {
      var coordinates = line.geometry.coordinates;

      if (coordinates.some(function (coord) {
        return coord.length > 2;
      })) {
        var modeConfig = this.getModeConfig();

        if (modeConfig && modeConfig.viewport) {
          // This line has elevation, we need to use alternative algorithm
          return (0, _utils.nearestPointOnProjectedLine)(line, inPoint, modeConfig.viewport);
        } // eslint-disable-next-line no-console,no-undef


        console.log('Editing 3D point but modeConfig.viewport not provided. Falling back to 2D logic.');
      }

      return (0, _nearestPointOnLine2["default"])(line, inPoint);
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      var editAction = null;
      var clickedEditHandle = (0, _modeHandler.getPickedEditHandle)(event.picks);

      if (clickedEditHandle && clickedEditHandle.featureIndex >= 0) {
        if (clickedEditHandle.type === 'existing') {
          var updatedData;

          try {
            updatedData = this.getImmutableFeatureCollection().removePosition(clickedEditHandle.featureIndex, clickedEditHandle.positionIndexes).getObject();
          } catch (ignored) {// This happens if user attempts to remove the last point
          }

          if (updatedData) {
            editAction = {
              updatedData: updatedData,
              editType: 'removePosition',
              featureIndexes: [clickedEditHandle.featureIndex],
              editContext: {
                positionIndexes: clickedEditHandle.positionIndexes,
                position: clickedEditHandle.position
              }
            };
          }
        } else if (clickedEditHandle.type === 'intermediate') {
          var _updatedData = this.getImmutableFeatureCollection().addPosition(clickedEditHandle.featureIndex, clickedEditHandle.positionIndexes, clickedEditHandle.position).getObject();

          if (_updatedData) {
            editAction = {
              updatedData: _updatedData,
              editType: 'addPosition',
              featureIndexes: [clickedEditHandle.featureIndex],
              editContext: {
                positionIndexes: clickedEditHandle.positionIndexes,
                position: clickedEditHandle.position
              }
            };
          }
        }
      }

      return editAction;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      this._lastPointerMovePicks = event.picks;
      var editAction = null;
      var editHandle = (0, _modeHandler.getPickedEditHandle)(event.pointerDownPicks);

      if (event.isDragging && editHandle) {
        var updatedData = this.getImmutableFeatureCollection().replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords).getObject();
        editAction = {
          updatedData: updatedData,
          editType: 'movePosition',
          featureIndexes: [editHandle.featureIndex],
          editContext: {
            positionIndexes: editHandle.positionIndexes,
            position: event.groundCoords
          }
        };
      } // Cancel map panning if pointer went down on an edit handle


      var cancelMapPan = Boolean(editHandle);
      return {
        editAction: editAction,
        cancelMapPan: cancelMapPan
      };
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      var editAction = null;
      var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
      var editHandle = (0, _modeHandler.getPickedEditHandle)(event.picks);

      if (selectedFeatureIndexes.length && editHandle && editHandle.type === 'intermediate') {
        var updatedData = this.getImmutableFeatureCollection().addPosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords).getObject();
        editAction = {
          updatedData: updatedData,
          editType: 'addPosition',
          featureIndexes: [editHandle.featureIndex],
          editContext: {
            positionIndexes: editHandle.positionIndexes,
            position: event.groundCoords
          }
        };
      }

      return editAction;
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      var editAction = null;
      var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
      var editHandle = (0, _modeHandler.getPickedEditHandle)(event.picks);

      if (selectedFeatureIndexes.length && editHandle) {
        var updatedData = this.getImmutableFeatureCollection().replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords).getObject();
        editAction = {
          updatedData: updatedData,
          editType: 'finishMovePosition',
          featureIndexes: [editHandle.featureIndex],
          editContext: {
            positionIndexes: editHandle.positionIndexes,
            position: event.groundCoords
          }
        };
      }

      return editAction;
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;
      var picks = this._lastPointerMovePicks;

      if (picks && picks.length > 0) {
        var handlePicked = picks.some(function (pick) {
          return pick.isEditingHandle;
        });

        if (handlePicked) {
          return 'cell';
        }
      }

      return isDragging ? 'grabbing' : 'grab';
    }
  }]);

  return ModifyHandler;
}(_modeHandler.ModeHandler);

exports.ModifyHandler = ModifyHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL21vZGlmeS1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbIk1vZGlmeUhhbmRsZXIiLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsImhhbmRsZXMiLCJmZWF0dXJlQ29sbGVjdGlvbiIsImdldE9iamVjdCIsImZlYXR1cmVzIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImluZGV4IiwibGVuZ3RoIiwiZ2VvbWV0cnkiLCJwdXNoIiwiY29uc29sZSIsIndhcm4iLCJleGlzdGluZ0VkaXRIYW5kbGUiLCJmaW5kIiwicGljayIsImlzRWRpdGluZ0hhbmRsZSIsIm9iamVjdCIsInR5cGUiLCJmZWF0dXJlQXNQaWNrIiwiaW5jbHVkZXMiLCJpbnRlcm1lZGlhdGVQb2ludCIsInBvc2l0aW9uSW5kZXhQcmVmaXgiLCJyZWZlcmVuY2VQb2ludCIsImNvb3JkaW5hdGVzIiwibGluZVN0cmluZyIsInByZWZpeCIsImxpbmVTdHJpbmdGZWF0dXJlIiwiY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQiLCJuZWFyZXN0UG9pbnRPbkxpbmUiLCJwcm9wZXJ0aWVzIiwiZGlzdCIsInBvc2l0aW9uIiwicG9zaXRpb25JbmRleGVzIiwiZmVhdHVyZUluZGV4IiwibGluZSIsImluUG9pbnQiLCJzb21lIiwiY29vcmQiLCJtb2RlQ29uZmlnIiwiZ2V0TW9kZUNvbmZpZyIsInZpZXdwb3J0IiwibG9nIiwiZXZlbnQiLCJlZGl0QWN0aW9uIiwiY2xpY2tlZEVkaXRIYW5kbGUiLCJ1cGRhdGVkRGF0YSIsImdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwicmVtb3ZlUG9zaXRpb24iLCJpZ25vcmVkIiwiZWRpdFR5cGUiLCJmZWF0dXJlSW5kZXhlcyIsImVkaXRDb250ZXh0IiwiYWRkUG9zaXRpb24iLCJfbGFzdFBvaW50ZXJNb3ZlUGlja3MiLCJlZGl0SGFuZGxlIiwicG9pbnRlckRvd25QaWNrcyIsImlzRHJhZ2dpbmciLCJyZXBsYWNlUG9zaXRpb24iLCJjYW5jZWxNYXBQYW4iLCJCb29sZWFuIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImhhbmRsZVBpY2tlZCIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBV0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBO0lBQ2FBLGE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQUdJQyxLLEVBQW9DQyxZLEVBQXVDO0FBQUE7O0FBQ3hGLFVBQUlDLE9BQU8sR0FBRyxFQUFkOztBQUR3RixrQ0FFbkUsS0FBS0MsaUJBQUwsQ0FBdUJDLFNBQXZCLEVBRm1FO0FBQUEsVUFFaEZDLFFBRmdGLHlCQUVoRkEsUUFGZ0Y7O0FBQUEsaURBSXBFLEtBQUtDLHlCQUFMLEVBSm9FO0FBQUE7O0FBQUE7QUFJeEYsNERBQXNEO0FBQUEsY0FBM0NDLE1BQTJDOztBQUNwRCxjQUFJQSxNQUFLLEdBQUdGLFFBQVEsQ0FBQ0csTUFBckIsRUFBNkI7QUFBQTs7QUFBQSxnQkFDbkJDLFFBRG1CLEdBQ05KLFFBQVEsQ0FBQ0UsTUFBRCxDQURGLENBQ25CRSxRQURtQjs7QUFFM0Isd0JBQUFQLE9BQU8sRUFBQ1EsSUFBUixvQ0FBZ0IsNENBQTBCRCxRQUExQixFQUFvQ0YsTUFBcEMsQ0FBaEI7QUFDRCxXQUhELE1BR087QUFDTEksWUFBQUEsT0FBTyxDQUFDQyxJQUFSLCtDQUFvREwsTUFBcEQsR0FESyxDQUN5RDtBQUMvRDtBQUNGLFNBWHVGLENBYXhGOztBQWJ3RjtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWN4RixVQUFJUCxLQUFLLElBQUlBLEtBQUssQ0FBQ1EsTUFBZixJQUF5QlAsWUFBN0IsRUFBMkM7QUFDekMsWUFBTVksa0JBQWtCLEdBQUdiLEtBQUssQ0FBQ2MsSUFBTixDQUN6QixVQUFDQyxJQUFEO0FBQUEsaUJBQVVBLElBQUksQ0FBQ0MsZUFBTCxJQUF3QkQsSUFBSSxDQUFDRSxNQUE3QixJQUF1Q0YsSUFBSSxDQUFD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R0FBRyxLQUFLQyw2QkFBTCxHQUNqQlcsZUFEaUIsQ0FDREgsVUFBVSxDQUFDckIsWUFEVixFQUN3QnFCLFVBQVUsQ0FBQ3RCLGVBRG5DLEVBQ29EVSxLQUFLLENBQUMxQyxZQUQxRCxFQUVqQkcsU0FGaUIsRUFBcEI7QUFJQXdDLFFBQUFBLFVBQVUsR0FBRztBQUNYRSxVQUFBQSxXQUFXLEVBQVhBLFdBRFc7QUFFWEksVUFBQUEsUUFBUSxFQUFFLG9CQUZDO0FBR1hDLFVBQUFBLGNBQWMsRUFBRSxDQUFDSSxVQUFVLENBQUNyQixZQUFaLENBSEw7QUFJWGtCLFVBQUFBLFdBQVcsRUFBRTtBQUNYbkIsWUFBQUEsZUFBZSxFQUFFc0IsVUFBVSxDQUFDdEIsZUFEakI7QUFFWEQsWUFBQUEsUUFBUSxFQUFFVyxLQUFLLENBQUMxQztBQUZMO0FBSkYsU0FBYjtBQVNEOztBQUVELGFBQU8yQyxVQUFQO0FBQ0Q7OztvQ0FFMEQ7QUFBQSxVQUEvQ2EsVUFBK0MsUUFBL0NBLFVBQStDO0FBQ3pELFVBQU16RCxLQUFLLEdBQUcsS0FBS3NELHFCQUFuQjs7QUFFQSxVQUFJdEQsS0FBSyxJQUFJQSxLQUFLLENBQUNRLE1BQU4sR0FBZSxDQUE1QixFQUErQjtBQUM3QixZQUFNc0QsWUFBWSxHQUFHOUQsS0FBSyxDQUFDcUMsSUFBTixDQUFXLFVBQUN0QixJQUFEO0FBQUEsaUJBQVVBLElBQUksQ0FBQ0MsZUFBZjtBQUFBLFNBQVgsQ0FBckI7O0FBQ0EsWUFBSThDLFlBQUosRUFBa0I7QUFDaEIsaUJBQU8sTUFBUDtBQUNEO0FBQ0Y7O0FBRUQsYUFBT0wsVUFBVSxHQUFHLFVBQUgsR0FBZ0IsTUFBakM7QUFDRDs7OztFQTdPZ0NNLHdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5lYXJlc3RQb2ludE9uTGluZSBmcm9tICdAdHVyZi9uZWFyZXN0LXBvaW50LW9uLWxpbmUnO1xuaW1wb3J0IHsgcG9pbnQsIGxpbmVTdHJpbmcgYXMgdG9MaW5lU3RyaW5nIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgeyBQb3NpdGlvbiwgRmVhdHVyZU9mLCBQb2ludCwgTGluZVN0cmluZyB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQge1xuICByZWN1cnNpdmVseVRyYXZlcnNlTmVzdGVkQXJyYXlzLFxuICBuZWFyZXN0UG9pbnRPblByb2plY3RlZExpbmUsXG4gIE5lYXJlc3RQb2ludFR5cGUsXG59IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7XG4gIENsaWNrRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG59IGZyb20gJy4uL2V2ZW50LXR5cGVzJztcbmltcG9ydCB7XG4gIEVkaXRBY3Rpb24sXG4gIEVkaXRIYW5kbGUsXG4gIE1vZGVIYW5kbGVyLFxuICBnZXRQaWNrZWRFZGl0SGFuZGxlLFxuICBnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5LFxufSBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBNb2RpZnlIYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBfbGFzdFBvaW50ZXJNb3ZlUGlja3M6IGFueTtcblxuICBnZXRFZGl0SGFuZGxlcyhwaWNrcz86IEFycmF5PFJlY29yZDxzdHJpbmcsIGFueT4+LCBncm91bmRDb29yZHM/OiBQb3NpdGlvbik6IEVkaXRIYW5kbGVbXSB7XG4gICAgbGV0IGhhbmRsZXMgPSBbXTtcbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSB0aGlzLmZlYXR1cmVDb2xsZWN0aW9uLmdldE9iamVjdCgpO1xuXG4gICAgZm9yIChjb25zdCBpbmRleCBvZiB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKSkge1xuICAgICAgaWYgKGluZGV4IDwgZmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHsgZ2VvbWV0cnkgfSA9IGZlYXR1cmVzW2luZGV4XTtcbiAgICAgICAgaGFuZGxlcy5wdXNoKC4uLmdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkoZ2VvbWV0cnksIGluZGV4KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oYHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgb3V0IG9mIHJhbmdlICR7aW5kZXh9YCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGludGVybWVkaWF0ZSBlZGl0IGhhbmRsZVxuICAgIGlmIChwaWNrcyAmJiBwaWNrcy5sZW5ndGggJiYgZ3JvdW5kQ29vcmRzKSB7XG4gICAgICBjb25zdCBleGlzdGluZ0VkaXRIYW5kbGUgPSBwaWNrcy5maW5kKFxuICAgICAgICAocGljaykgPT4gcGljay5pc0VkaXRpbmdIYW5kbGUgJiYgcGljay5vYmplY3QgJiYgcGljay5vYmplY3QudHlwZSA9PT0gJ2V4aXN0aW5nJ1xuICAgICAgKTtcbiAgICAgIC8vIGRvbid0IHNob3cgaW50ZXJtZWRpYXRlIHBvaW50IHdoZW4gdG9vIGNsb3NlIHRvIGFuIGV4aXN0aW5nIGVkaXQgaGFuZGxlXG4gICAgICBjb25zdCBmZWF0dXJlQXNQaWNrID0gIWV4aXN0aW5nRWRpdEhhbmRsZSAmJiBwaWNrcy5maW5kKChwaWNrKSA9PiAhcGljay5pc0VkaXRpbmdIYW5kbGUpO1xuXG4gICAgICAvLyBpcyB0aGUgZmVhdHVyZSBpbiB0aGUgcGljayBzZWxlY3RlZFxuICAgICAgaWYgKFxuICAgICAgICBmZWF0dXJlQXNQaWNrICYmXG4gICAgICAgICFmZWF0dXJlQXNQaWNrLm9iamVjdC5nZW9tZXRyeS50eXBlLmluY2x1ZGVzKCdQb2ludCcpICYmXG4gICAgICAgIHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpLmluY2x1ZGVzKGZlYXR1cmVBc1BpY2suaW5kZXgpXG4gICAgICApIHtcbiAgICAgICAgbGV0IGludGVybWVkaWF0ZVBvaW50OiBOZWFyZXN0UG9pbnRUeXBlIHwgbnVsbCB8IHVuZGVmaW5lZCA9IG51bGw7XG4gICAgICAgIGxldCBwb3NpdGlvbkluZGV4UHJlZml4ID0gW107XG4gICAgICAgIGNvbnN0IHJlZmVyZW5jZVBvaW50ID0gcG9pbnQoZ3JvdW5kQ29vcmRzKTtcbiAgICAgICAgLy8gcHJvY2VzcyBhbGwgbGluZXMgb2YgdGhlIChzaW5nbGUpIGZlYXR1cmVcbiAgICAgICAgcmVjdXJzaXZlbHlUcmF2ZXJzZU5lc3RlZEFycmF5cyhcbiAgICAgICAgICBmZWF0dXJlQXNQaWNrLm9iamVjdC5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgICAgICBbXSxcbiAgICAgICAgICAobGluZVN0cmluZywgcHJlZml4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaW5lU3RyaW5nRmVhdHVyZSA9IHRvTGluZVN0cmluZyhsaW5lU3RyaW5nKTtcblxuICAgICAgICAgICAgY29uc3QgY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQgPSB0aGlzLm5lYXJlc3RQb2ludE9uTGluZShcbiAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBsaW5lU3RyaW5nRmVhdHVyZSxcbiAgICAgICAgICAgICAgcmVmZXJlbmNlUG9pbnRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICFpbnRlcm1lZGlhdGVQb2ludCB8fFxuICAgICAgICAgICAgICBjYW5kaWRhdGVJbnRlcm1lZGlhdGVQb2ludC5wcm9wZXJ0aWVzLmRpc3QgPCBpbnRlcm1lZGlhdGVQb2ludC5wcm9wZXJ0aWVzLmRpc3RcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBpbnRlcm1lZGlhdGVQb2ludCA9IGNhbmRpZGF0ZUludGVybWVkaWF0ZVBvaW50O1xuICAgICAgICAgICAgICBwb3NpdGlvbkluZGV4UHJlZml4ID0gcHJlZml4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gdGFjayBvbiB0aGUgbG9uZSBpbnRlcm1lZGlhdGUgcG9pbnQgdG8gdGhlIHNldCBvZiBoYW5kbGVzXG4gICAgICAgIGlmIChpbnRlcm1lZGlhdGVQb2ludCkge1xuICAgICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIGdlb21ldHJ5OiB7IGNvb3JkaW5hdGVzOiBwb3NpdGlvbiB9LFxuICAgICAgICAgICAgcHJvcGVydGllczogeyBpbmRleCB9LFxuICAgICAgICAgIH0gPSBpbnRlcm1lZGlhdGVQb2ludDtcbiAgICAgICAgICBoYW5kbGVzID0gW1xuICAgICAgICAgICAgLi4uaGFuZGxlcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcG9zaXRpb24sXG4gICAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogWy4uLnBvc2l0aW9uSW5kZXhQcmVmaXgsIGluZGV4ICsgMV0sXG4gICAgICAgICAgICAgIGZlYXR1cmVJbmRleDogZmVhdHVyZUFzUGljay5pbmRleCxcbiAgICAgICAgICAgICAgdHlwZTogJ2ludGVybWVkaWF0ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGFuZGxlcztcbiAgfVxuXG4gIC8vIHR1cmYuanMgZG9lcyBub3Qgc3VwcG9ydCBlbGV2YXRpb24gZm9yIG5lYXJlc3RQb2ludE9uTGluZVxuICBuZWFyZXN0UG9pbnRPbkxpbmUobGluZTogRmVhdHVyZU9mPExpbmVTdHJpbmc+LCBpblBvaW50OiBGZWF0dXJlT2Y8UG9pbnQ+KTogTmVhcmVzdFBvaW50VHlwZSB7XG4gICAgY29uc3QgeyBjb29yZGluYXRlcyB9ID0gbGluZS5nZW9tZXRyeTtcbiAgICBpZiAoY29vcmRpbmF0ZXMuc29tZSgoY29vcmQpID0+IGNvb3JkLmxlbmd0aCA+IDIpKSB7XG4gICAgICBjb25zdCBtb2RlQ29uZmlnID0gdGhpcy5nZXRNb2RlQ29uZmlnKCk7XG4gICAgICBpZiAobW9kZUNvbmZpZyAmJiBtb2RlQ29uZmlnLnZpZXdwb3J0KSB7XG4gICAgICAgIC8vIFRoaXMgbGluZSBoYXMgZWxldmF0aW9uLCB3ZSBuZWVkIHRvIHVzZSBhbHRlcm5hdGl2ZSBhbGdvcml0aG1cbiAgICAgICAgcmV0dXJuIG5lYXJlc3RQb2ludE9uUHJvamVjdGVkTGluZShsaW5lLCBpblBvaW50LCBtb2RlQ29uZmlnLnZpZXdwb3J0KTtcbiAgICAgIH1cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgJ0VkaXRpbmcgM0QgcG9pbnQgYnV0IG1vZGVDb25maWcudmlld3BvcnQgbm90IHByb3ZpZGVkLiBGYWxsaW5nIGJhY2sgdG8gMkQgbG9naWMuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmVhcmVzdFBvaW50T25MaW5lKGxpbmUsIGluUG9pbnQpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgbGV0IGVkaXRBY3Rpb246IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkID0gbnVsbDtcblxuICAgIGNvbnN0IGNsaWNrZWRFZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG5cbiAgICBpZiAoY2xpY2tlZEVkaXRIYW5kbGUgJiYgY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4ID49IDApIHtcbiAgICAgIGlmIChjbGlja2VkRWRpdEhhbmRsZS50eXBlID09PSAnZXhpc3RpbmcnKSB7XG4gICAgICAgIGxldCB1cGRhdGVkRGF0YTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgICAgICAgLnJlbW92ZVBvc2l0aW9uKGNsaWNrZWRFZGl0SGFuZGxlLmZlYXR1cmVJbmRleCwgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzKVxuICAgICAgICAgICAgLmdldE9iamVjdCgpO1xuICAgICAgICB9IGNhdGNoIChpZ25vcmVkKSB7XG4gICAgICAgICAgLy8gVGhpcyBoYXBwZW5zIGlmIHVzZXIgYXR0ZW1wdHMgdG8gcmVtb3ZlIHRoZSBsYXN0IHBvaW50XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXBkYXRlZERhdGEpIHtcbiAgICAgICAgICBlZGl0QWN0aW9uID0ge1xuICAgICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgICBlZGl0VHlwZTogJ3JlbW92ZVBvc2l0aW9uJyxcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb24sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2xpY2tlZEVkaXRIYW5kbGUudHlwZSA9PT0gJ2ludGVybWVkaWF0ZScpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgICAgICAuYWRkUG9zaXRpb24oXG4gICAgICAgICAgICBjbGlja2VkRWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsXG4gICAgICAgICAgICBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgICBjbGlja2VkRWRpdEhhbmRsZS5wb3NpdGlvblxuICAgICAgICAgIClcbiAgICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgICAgaWYgKHVwZGF0ZWREYXRhKSB7XG4gICAgICAgICAgZWRpdEFjdGlvbiA9IHtcbiAgICAgICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICAgICAgZWRpdFR5cGU6ICdhZGRQb3NpdGlvbicsXG4gICAgICAgICAgICBmZWF0dXJlSW5kZXhlczogW2NsaWNrZWRFZGl0SGFuZGxlLmZlYXR1cmVJbmRleF0sXG4gICAgICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgICAgcG9zaXRpb246IGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnRcbiAgKTogeyBlZGl0QWN0aW9uOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZDsgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIHRoaXMuX2xhc3RQb2ludGVyTW92ZVBpY2tzID0gZXZlbnQucGlja3M7XG5cbiAgICBsZXQgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQgPSBudWxsO1xuXG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucG9pbnRlckRvd25QaWNrcyk7XG5cbiAgICBpZiAoZXZlbnQuaXNEcmFnZ2luZyAmJiBlZGl0SGFuZGxlKSB7XG4gICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKVxuICAgICAgICAucmVwbGFjZVBvc2l0aW9uKGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LCBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgZXZlbnQuZ3JvdW5kQ29vcmRzKVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ21vdmVQb3NpdGlvbicsXG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXhdLFxuICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogZWRpdEhhbmRsZS5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgcG9zaXRpb246IGV2ZW50Lmdyb3VuZENvb3JkcyxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gQ2FuY2VsIG1hcCBwYW5uaW5nIGlmIHBvaW50ZXIgd2VudCBkb3duIG9uIGFuIGVkaXQgaGFuZGxlXG4gICAgY29uc3QgY2FuY2VsTWFwUGFuID0gQm9vbGVhbihlZGl0SGFuZGxlKTtcblxuICAgIHJldHVybiB7IGVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbiB9O1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KTogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGxldCBlZGl0QWN0aW9uOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCA9IG51bGw7XG5cbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCk7XG5cbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG4gICAgaWYgKHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoICYmIGVkaXRIYW5kbGUgJiYgZWRpdEhhbmRsZS50eXBlID09PSAnaW50ZXJtZWRpYXRlJykge1xuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSB0aGlzLmdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKClcbiAgICAgICAgLmFkZFBvc2l0aW9uKGVkaXRIYW5kbGUuZmVhdHVyZUluZGV4LCBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcywgZXZlbnQuZ3JvdW5kQ29vcmRzKVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ2FkZFBvc2l0aW9uJyxcbiAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtlZGl0SGFuZGxlLmZlYXR1cmVJbmRleF0sXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICBwb3NpdGlvbjogZXZlbnQuZ3JvdW5kQ29vcmRzLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgbGV0IGVkaXRBY3Rpb246IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkID0gbnVsbDtcblxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTtcbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG4gICAgaWYgKHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoICYmIGVkaXRIYW5kbGUpIHtcbiAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpXG4gICAgICAgIC5yZXBsYWNlUG9zaXRpb24oZWRpdEhhbmRsZS5mZWF0dXJlSW5kZXgsIGVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzLCBldmVudC5ncm91bmRDb29yZHMpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgZWRpdEFjdGlvbiA9IHtcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAnZmluaXNoTW92ZVBvc2l0aW9uJyxcbiAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtlZGl0SGFuZGxlLmZlYXR1cmVJbmRleF0sXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBlZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICBwb3NpdGlvbjogZXZlbnQuZ3JvdW5kQ29vcmRzLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIGNvbnN0IHBpY2tzID0gdGhpcy5fbGFzdFBvaW50ZXJNb3ZlUGlja3M7XG5cbiAgICBpZiAocGlja3MgJiYgcGlja3MubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgaGFuZGxlUGlja2VkID0gcGlja3Muc29tZSgocGljaykgPT4gcGljay5pc0VkaXRpbmdIYW5kbGUpO1xuICAgICAgaWYgKGhhbmRsZVBpY2tlZCkge1xuICAgICAgICByZXR1cm4gJ2NlbGwnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpc0RyYWdnaW5nID8gJ2dyYWJiaW5nJyA6ICdncmFiJztcbiAgfVxufVxuIl19