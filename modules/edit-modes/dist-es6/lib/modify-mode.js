"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModifyMode = void 0;

var _nearestPointOnLine2 = _interopRequireDefault(require("@turf/nearest-point-on-line"));

var _helpers = require("@turf/helpers");

var _utils = require("../utils");

var _geojsonEditMode = require("./geojson-edit-mode");

var _immutableFeatureCollection = require("./immutable-feature-collection");

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

var ModifyMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(ModifyMode, _GeoJsonEditMode);

  var _super = _createSuper(ModifyMode);

  function ModifyMode() {
    _classCallCheck(this, ModifyMode);

    return _super.apply(this, arguments);
  }

  _createClass(ModifyMode, [{
    key: "getGuides",
    value: function getGuides(props) {
      var _this = this;

      var handles = [];
      var data = props.data,
          lastPointerMoveEvent = props.lastPointerMoveEvent;
      var features = data.features;
      var picks = lastPointerMoveEvent && lastPointerMoveEvent.picks;
      var mapCoords = lastPointerMoveEvent && lastPointerMoveEvent.mapCoords;

      var _iterator = _createForOfIteratorHelper(props.selectedIndexes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _index = _step.value;

          if (_index < features.length) {
            var geometry = features[_index].geometry;
            handles.push.apply(handles, _toConsumableArray((0, _utils.getEditHandlesForGeometry)(geometry, _index)));
          } else {
            console.warn("selectedFeatureIndexes out of range ".concat(_index)); // eslint-disable-line no-console,no-undef
          }
        } // intermediate edit handle

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (picks && picks.length && mapCoords) {
        var existingEditHandle = (0, _utils.getPickedExistingEditHandle)(picks); // don't show intermediate point when too close to an existing edit handle

        var featureAsPick = !existingEditHandle && picks.find(function (pick) {
          return !pick.isGuide;
        }); // is the feature in the pick selected

        if (featureAsPick && !featureAsPick.object.geometry.type.includes('Point') && props.selectedIndexes.includes(featureAsPick.index)) {
          var intermediatePoint = null;
          var positionIndexPrefix = [];
          var referencePoint = (0, _helpers.point)(mapCoords); // process all lines of the (single) feature

          (0, _utils.recursivelyTraverseNestedArrays)(featureAsPick.object.geometry.coordinates, [], function (lineString, prefix) {
            var lineStringFeature = (0, _helpers.lineString)(lineString);

            var candidateIntermediatePoint = _this.nearestPointOnLine( // @ts-ignore
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
    key: "handleClick",
    value: function handleClick(event, props) {
      var pickedExistingHandle = (0, _utils.getPickedExistingEditHandle)(event.picks);
      var pickedIntermediateHandle = (0, _utils.getPickedIntermediateEditHandle)(event.picks);

      if (pickedExistingHandle) {
        var _pickedExistingHandle = pickedExistingHandle.properties,
            featureIndex = _pickedExistingHandle.featureIndex,
            positionIndexes = _pickedExistingHandle.positionIndexes;
        var updatedData;

        try {
          updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).removePosition(featureIndex, positionIndexes).getObject();
        } catch (ignored) {// This happens if user attempts to remove the last point
        }

        if (updatedData) {
          props.onEdit({
            updatedData: updatedData,
            editType: 'removePosition',
            editContext: {
              featureIndexes: [featureIndex],
              positionIndexes: positionIndexes,
              position: pickedExistingHandle.geometry.coordinates
            }
          });
        }
      } else if (pickedIntermediateHandle) {
        var _pickedIntermediateHa = pickedIntermediateHandle.properties,
            _featureIndex = _pickedIntermediateHa.featureIndex,
            _positionIndexes = _pickedIntermediateHa.positionIndexes;

        var _updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).addPosition(_featureIndex, _positionIndexes, pickedIntermediateHandle.geometry.coordinates).getObject();

        if (_updatedData) {
          props.onEdit({
            updatedData: _updatedData,
            editType: 'addPosition',
            editContext: {
              featureIndexes: [_featureIndex],
              positionIndexes: _positionIndexes,
              position: pickedIntermediateHandle.geometry.coordinates
            }
          });
        }
      }
    }
  }, {
    key: "handleDragging",
    value: function handleDragging(event, props) {
      var editHandle = (0, _utils.getPickedEditHandle)(event.pointerDownPicks);

      if (editHandle) {
        // Cancel map panning if pointer went down on an edit handle
        event.cancelPan();
        var editHandleProperties = editHandle.properties;
        var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replacePosition(editHandleProperties.featureIndex, editHandleProperties.positionIndexes, event.mapCoords).getObject();
        props.onEdit({
          updatedData: updatedData,
          editType: 'movePosition',
          editContext: {
            featureIndexes: [editHandleProperties.featureIndex],
            positionIndexes: editHandleProperties.positionIndexes,
            position: event.mapCoords
          }
        });
      }
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      var cursor = this.getCursor(event);
      props.onUpdateCursor(cursor);
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      var selectedFeatureIndexes = props.selectedIndexes;
      var editHandle = (0, _utils.getPickedIntermediateEditHandle)(event.picks);

      if (selectedFeatureIndexes.length && editHandle) {
        var editHandleProperties = editHandle.properties;
        var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).addPosition(editHandleProperties.featureIndex, editHandleProperties.positionIndexes, event.mapCoords).getObject();
        props.onEdit({
          updatedData: updatedData,
          editType: 'addPosition',
          editContext: {
            featureIndexes: [editHandleProperties.featureIndex],
            positionIndexes: editHandleProperties.positionIndexes,
            position: event.mapCoords
          }
        });
      }
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      var selectedFeatureIndexes = props.selectedIndexes;
      var editHandle = (0, _utils.getPickedEditHandle)(event.picks);

      if (selectedFeatureIndexes.length && editHandle) {
        var editHandleProperties = editHandle.properties;
        var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replacePosition(editHandleProperties.featureIndex, editHandleProperties.positionIndexes, event.mapCoords).getObject();
        props.onEdit({
          updatedData: updatedData,
          editType: 'finishMovePosition',
          editContext: {
            featureIndexes: [editHandleProperties.featureIndex],
            positionIndexes: editHandleProperties.positionIndexes,
            position: event.mapCoords
          }
        });
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

  return ModifyMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.ModifyMode = ModifyMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbW9kaWZ5LW1vZGUudHMiXSwibmFtZXMiOlsiTW9kaWZ5TW9kZSIsInByb3BzIiwiaGFuZGxlcyIsImRhdGEiLCJsYXN0UG9pbnRlck1vdmVFdmVudCIsImZlYXR1cmVzIiwicGlja3MiLCJtYXBDb29yZHMiLCJzZWxlY3RlZEluZGV4ZXMiLCJpbmRleCIsImxlbmd0aCIsImdlb21ldHJ5IiwicHVzaCIsImNvbnNvbGUiLCJ3YXJuIiwiZXhpc3RpbmdFZGl0SGFuZGxlIiwiZmVhdHVyZUFzUGljayIsImZpbmQiLCJwaWNrIiwiaXNHdWlkZSIsIm9iamVjdCIsInR5cGUiLCJpbmNsdWRlcyIsImludGVybWVkaWF0ZVBvaW50IiwicG9zaXRpb25JbmRleFByZWZpeCIsInJlZmVyZW5jZVBvaW50IiwiY29vcmRpbmF0ZXMiLCJsaW5lU3RyaW5nIiwicHJlZml4IiwibGluZVN0cmluZ0ZlYXR1cmUiLCJjYW5kaWRhdGVJbnRlcm1lZGlhdGVQb2ludCIsIm5lYXJlc3RQb2ludE9uTGluZSIsIm1vZGVDb25maWciLCJ2aWV3cG9ydCIsInByb3BlcnRpZXMiLCJkaXN0IiwicG9zaXRpb24iLCJndWlkZVR5cGUiLCJlZGl0SGFuZGxlVHlwZSIsImZlYXR1cmVJbmRleCIsInBvc2l0aW9uSW5kZXhlcyIsImxpbmUiLCJpblBvaW50Iiwic29tZSIsImNvb3JkIiwibG9nIiwiZXZlbnQiLCJwaWNrZWRFeGlzdGluZ0hhbmRsZSIsInBpY2tlZEludGVybWVkaWF0ZUhhbmRsZSIsInVwZGF0ZWREYXRhIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJyZW1vdmVQb3NpdGlvbiIsImdldE9iamVjdCIsImlnbm9yZWQiLCJvbkVkaXQiLCJlZGl0VHlwZSIsImVkaXRDb250ZXh0IiwiZmVhdHVyZUluZGV4ZXMiLCJhZGRQb3NpdGlvbiIsImVkaXRIYW5kbGUiLCJwb2ludGVyRG93blBpY2tzIiwiY2FuY2VsUGFuIiwiZWRpdEhhbmRsZVByb3BlcnRpZXMiLCJyZXBsYWNlUG9zaXRpb24iLCJjdXJzb3IiLCJnZXRDdXJzb3IiLCJvblVwZGF0ZUN1cnNvciIsInNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJoYW5kbGVzUGlja2VkIiwiR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBcUJBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFU7Ozs7Ozs7Ozs7Ozs7OEJBQ0RDLEssRUFBNkQ7QUFBQTs7QUFDckUsVUFBTUMsT0FBTyxHQUFHLEVBQWhCO0FBRHFFLFVBRzdEQyxJQUg2RCxHQUc5QkYsS0FIOEIsQ0FHN0RFLElBSDZEO0FBQUEsVUFHdkRDLG9CQUh1RCxHQUc5QkgsS0FIOEIsQ0FHdkRHLG9CQUh1RDtBQUFBLFVBSTdEQyxRQUo2RCxHQUloREYsSUFKZ0QsQ0FJN0RFLFFBSjZEO0FBS3JFLFVBQU1DLEtBQUssR0FBR0Ysb0JBQW9CLElBQUlBLG9CQUFvQixDQUFDRSxLQUEzRDtBQUNBLFVBQU1DLFNBQVMsR0FBR0gsb0JBQW9CLElBQUlBLG9CQUFvQixDQUFDRyxTQUEvRDs7QUFOcUUsaURBUWpETixLQUFLLENBQUNPLGVBUjJDO0FBQUE7O0FBQUE7QUFRckUsNERBQTJDO0FBQUEsY0FBaENDLE1BQWdDOztBQUN6QyxjQUFJQSxNQUFLLEdBQUdKLFFBQVEsQ0FBQ0ssTUFBckIsRUFBNkI7QUFBQSxnQkFDbkJDLFFBRG1CLEdBQ05OLFFBQVEsQ0FBQ0ksTUFBRCxDQURGLENBQ25CRSxRQURtQjtBQUUzQlQsWUFBQUEsT0FBTyxDQUFDVSxJQUFSLE9BQUFWLE9BQU8scUJBQVMsc0NBQTBCUyxRQUExQixFQUFvQ0YsTUFBcEMsQ0FBVCxFQUFQO0FBQ0QsV0FIRCxNQUdPO0FBQ0xJLFlBQUFBLE9BQU8sQ0FBQ0MsSUFBUiwrQ0FBb0RMLE1BQXBELEdBREssQ0FDeUQ7QUFDL0Q7QUFDRixTQWZvRSxDQWlCckU7O0FBakJxRTtBQUFBO0FBQUE7QUFB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QWhCLElBQTBCLEVBQXhDO0FBRUEsVUFBTThELGFBQWEsR0FBRyxpQ0FBcUI5RCxLQUFyQixDQUF0Qjs7QUFDQSxVQUFJOEQsYUFBYSxDQUFDMUQsTUFBbEIsRUFBMEI7QUFDeEIsZUFBTyxNQUFQO0FBQ0Q7O0FBQ0QsYUFBTyxJQUFQO0FBQ0Q7Ozs7RUF2UDZCMkQsZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbmVhcmVzdFBvaW50T25MaW5lIGZyb20gJ0B0dXJmL25lYXJlc3QtcG9pbnQtb24tbGluZSc7XG5pbXBvcnQgeyBwb2ludCwgbGluZVN0cmluZyBhcyB0b0xpbmVTdHJpbmcgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB7XG4gIHJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMsXG4gIG5lYXJlc3RQb2ludE9uUHJvamVjdGVkTGluZSxcbiAgZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSxcbiAgZ2V0UGlja2VkRWRpdEhhbmRsZXMsXG4gIGdldFBpY2tlZEVkaXRIYW5kbGUsXG4gIGdldFBpY2tlZEV4aXN0aW5nRWRpdEhhbmRsZSxcbiAgZ2V0UGlja2VkSW50ZXJtZWRpYXRlRWRpdEhhbmRsZSxcbiAgTmVhcmVzdFBvaW50VHlwZSxcbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgTGluZVN0cmluZywgUG9pbnQsIEZlYXR1cmVDb2xsZWN0aW9uLCBGZWF0dXJlT2YgfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7XG4gIE1vZGVQcm9wcyxcbiAgQ2xpY2tFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgRHJhZ2dpbmdFdmVudCxcbiAgVmlld3BvcnQsXG4gIEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24sXG59IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IEdlb0pzb25FZGl0TW9kZSB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUnO1xuaW1wb3J0IHsgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuL2ltbXV0YWJsZS1mZWF0dXJlLWNvbGxlY3Rpb24nO1xuXG5leHBvcnQgY2xhc3MgTW9kaWZ5TW9kZSBleHRlbmRzIEdlb0pzb25FZGl0TW9kZSB7XG4gIGdldEd1aWRlcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIGNvbnN0IGhhbmRsZXMgPSBbXTtcblxuICAgIGNvbnN0IHsgZGF0YSwgbGFzdFBvaW50ZXJNb3ZlRXZlbnQgfSA9IHByb3BzO1xuICAgIGNvbnN0IHsgZmVhdHVyZXMgfSA9IGRhdGE7XG4gICAgY29uc3QgcGlja3MgPSBsYXN0UG9pbnRlck1vdmVFdmVudCAmJiBsYXN0UG9pbnRlck1vdmVFdmVudC5waWNrcztcbiAgICBjb25zdCBtYXBDb29yZHMgPSBsYXN0UG9pbnRlck1vdmVFdmVudCAmJiBsYXN0UG9pbnRlck1vdmVFdmVudC5tYXBDb29yZHM7XG5cbiAgICBmb3IgKGNvbnN0IGluZGV4IG9mIHByb3BzLnNlbGVjdGVkSW5kZXhlcykge1xuICAgICAgaWYgKGluZGV4IDwgZmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHsgZ2VvbWV0cnkgfSA9IGZlYXR1cmVzW2luZGV4XTtcbiAgICAgICAgaGFuZGxlcy5wdXNoKC4uLmdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkoZ2VvbWV0cnksIGluZGV4KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oYHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgb3V0IG9mIHJhbmdlICR7aW5kZXh9YCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGludGVybWVkaWF0ZSBlZGl0IGhhbmRsZVxuICAgIGlmIChwaWNrcyAmJiBwaWNrcy5sZW5ndGggJiYgbWFwQ29vcmRzKSB7XG4gICAgICBjb25zdCBleGlzdGluZ0VkaXRIYW5kbGUgPSBnZXRQaWNrZWRFeGlzdGluZ0VkaXRIYW5kbGUocGlja3MpO1xuICAgICAgLy8gZG9uJ3Qgc2hvdyBpbnRlcm1lZGlhdGUgcG9pbnQgd2hlbiB0b28gY2xvc2UgdG8gYW4gZXhpc3RpbmcgZWRpdCBoYW5kbGVcbiAgICAgIGNvbnN0IGZlYXR1cmVBc1BpY2sgPSAhZXhpc3RpbmdFZGl0SGFuZGxlICYmIHBpY2tzLmZpbmQoKHBpY2spID0+ICFwaWNrLmlzR3VpZGUpO1xuXG4gICAgICAvLyBpcyB0aGUgZmVhdHVyZSBpbiB0aGUgcGljayBzZWxlY3RlZFxuICAgICAgaWYgKFxuICAgICAgICBmZWF0dXJlQXNQaWNrICYmXG4gICAgICAgICFmZWF0dXJlQXNQaWNrLm9iamVjdC5nZW9tZXRyeS50eXBlLmluY2x1ZGVzKCdQb2ludCcpICYmXG4gICAgICAgIHByb3BzLnNlbGVjdGVkSW5kZXhlcy5pbmNsdWRlcyhmZWF0dXJlQXNQaWNrLmluZGV4KVxuICAgICAgKSB7XG4gICAgICAgIGxldCBpbnRlcm1lZGlhdGVQb2ludDogTmVhcmVzdFBvaW50VHlwZSB8IG51bGwgfCB1bmRlZmluZWQgPSBudWxsO1xuICAgICAgICBsZXQgcG9zaXRpb25JbmRleFByZWZpeCA9IFtdO1xuICAgICAgICBjb25zdCByZWZlcmVuY2VQb2ludCA9IHBvaW50KG1hcENvb3Jkcyk7XG4gICAgICAgIC8vIHByb2Nlc3MgYWxsIGxpbmVzIG9mIHRoZSAoc2luZ2xlKSBmZWF0dXJlXG4gICAgICAgIHJlY3Vyc2l2ZWx5VHJhdmVyc2VOZXN0ZWRBcnJheXMoXG4gICAgICAgICAgZmVhdHVyZUFzUGljay5vYmplY3QuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgW10sXG4gICAgICAgICAgKGxpbmVTdHJpbmcsIHByZWZpeCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZVN0cmluZ0ZlYXR1cmUgPSB0b0xpbmVTdHJpbmcobGluZVN0cmluZyk7XG4gICAgICAgICAgICBjb25zdCBjYW5kaWRhdGVJbnRlcm1lZGlhdGVQb2ludCA9IHRoaXMubmVhcmVzdFBvaW50T25MaW5lKFxuICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgIGxpbmVTdHJpbmdGZWF0dXJlLFxuICAgICAgICAgICAgICByZWZlcmVuY2VQb2ludCxcbiAgICAgICAgICAgICAgcHJvcHMubW9kZUNvbmZpZyAmJiBwcm9wcy5tb2RlQ29uZmlnLnZpZXdwb3J0XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAhaW50ZXJtZWRpYXRlUG9pbnQgfHxcbiAgICAgICAgICAgICAgY2FuZGlkYXRlSW50ZXJtZWRpYXRlUG9pbnQucHJvcGVydGllcy5kaXN0IDwgaW50ZXJtZWRpYXRlUG9pbnQucHJvcGVydGllcy5kaXN0XG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaW50ZXJtZWRpYXRlUG9pbnQgPSBjYW5kaWRhdGVJbnRlcm1lZGlhdGVQb2ludDtcbiAgICAgICAgICAgICAgcG9zaXRpb25JbmRleFByZWZpeCA9IHByZWZpeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIC8vIHRhY2sgb24gdGhlIGxvbmUgaW50ZXJtZWRpYXRlIHBvaW50IHRvIHRoZSBzZXQgb2YgaGFuZGxlc1xuICAgICAgICBpZiAoaW50ZXJtZWRpYXRlUG9pbnQpIHtcbiAgICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBnZW9tZXRyeTogeyBjb29yZGluYXRlczogcG9zaXRpb24gfSxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHsgaW5kZXggfSxcbiAgICAgICAgICB9ID0gaW50ZXJtZWRpYXRlUG9pbnQ7XG4gICAgICAgICAgaGFuZGxlcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZ3VpZGVUeXBlOiAnZWRpdEhhbmRsZScsXG4gICAgICAgICAgICAgIGVkaXRIYW5kbGVUeXBlOiAnaW50ZXJtZWRpYXRlJyxcbiAgICAgICAgICAgICAgZmVhdHVyZUluZGV4OiBmZWF0dXJlQXNQaWNrLmluZGV4LFxuICAgICAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IFsuLi5wb3NpdGlvbkluZGV4UHJlZml4LCBpbmRleCArIDFdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICAgICAgICAgIGNvb3JkaW5hdGVzOiBwb3NpdGlvbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgIGZlYXR1cmVzOiBoYW5kbGVzLFxuICAgIH07XG4gIH1cblxuICAvLyB0dXJmLmpzIGRvZXMgbm90IHN1cHBvcnQgZWxldmF0aW9uIGZvciBuZWFyZXN0UG9pbnRPbkxpbmVcbiAgbmVhcmVzdFBvaW50T25MaW5lKFxuICAgIGxpbmU6IEZlYXR1cmVPZjxMaW5lU3RyaW5nPixcbiAgICBpblBvaW50OiBGZWF0dXJlT2Y8UG9pbnQ+LFxuICAgIHZpZXdwb3J0OiBWaWV3cG9ydCB8IG51bGwgfCB1bmRlZmluZWRcbiAgKTogTmVhcmVzdFBvaW50VHlwZSB7XG4gICAgY29uc3QgeyBjb29yZGluYXRlcyB9ID0gbGluZS5nZW9tZXRyeTtcbiAgICBpZiAoY29vcmRpbmF0ZXMuc29tZSgoY29vcmQpID0+IGNvb3JkLmxlbmd0aCA+IDIpKSB7XG4gICAgICBpZiAodmlld3BvcnQpIHtcbiAgICAgICAgLy8gVGhpcyBsaW5lIGhhcyBlbGV2YXRpb24sIHdlIG5lZWQgdG8gdXNlIGFsdGVybmF0aXZlIGFsZ29yaXRobVxuICAgICAgICByZXR1cm4gbmVhcmVzdFBvaW50T25Qcm9qZWN0ZWRMaW5lKGxpbmUsIGluUG9pbnQsIHZpZXdwb3J0KTtcbiAgICAgIH1cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlLG5vLXVuZGVmXG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgJ0VkaXRpbmcgM0QgcG9pbnQgYnV0IG1vZGVDb25maWcudmlld3BvcnQgbm90IHByb3ZpZGVkLiBGYWxsaW5nIGJhY2sgdG8gMkQgbG9naWMuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmVhcmVzdFBvaW50T25MaW5lKGxpbmUsIGluUG9pbnQpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgY29uc3QgcGlja2VkRXhpc3RpbmdIYW5kbGUgPSBnZXRQaWNrZWRFeGlzdGluZ0VkaXRIYW5kbGUoZXZlbnQucGlja3MpO1xuICAgIGNvbnN0IHBpY2tlZEludGVybWVkaWF0ZUhhbmRsZSA9IGdldFBpY2tlZEludGVybWVkaWF0ZUVkaXRIYW5kbGUoZXZlbnQucGlja3MpO1xuXG4gICAgaWYgKHBpY2tlZEV4aXN0aW5nSGFuZGxlKSB7XG4gICAgICBjb25zdCB7IGZlYXR1cmVJbmRleCwgcG9zaXRpb25JbmRleGVzIH0gPSBwaWNrZWRFeGlzdGluZ0hhbmRsZS5wcm9wZXJ0aWVzO1xuXG4gICAgICBsZXQgdXBkYXRlZERhdGE7XG4gICAgICB0cnkge1xuICAgICAgICB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKVxuICAgICAgICAgIC5yZW1vdmVQb3NpdGlvbihmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcylcbiAgICAgICAgICAuZ2V0T2JqZWN0KCk7XG4gICAgICB9IGNhdGNoIChpZ25vcmVkKSB7XG4gICAgICAgIC8vIFRoaXMgaGFwcGVucyBpZiB1c2VyIGF0dGVtcHRzIHRvIHJlbW92ZSB0aGUgbGFzdCBwb2ludFxuICAgICAgfVxuXG4gICAgICBpZiAodXBkYXRlZERhdGEpIHtcbiAgICAgICAgcHJvcHMub25FZGl0KHtcbiAgICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgICBlZGl0VHlwZTogJ3JlbW92ZVBvc2l0aW9uJyxcbiAgICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtmZWF0dXJlSW5kZXhdLFxuICAgICAgICAgICAgcG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgICAgcG9zaXRpb246IHBpY2tlZEV4aXN0aW5nSGFuZGxlLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocGlja2VkSW50ZXJtZWRpYXRlSGFuZGxlKSB7XG4gICAgICBjb25zdCB7IGZlYXR1cmVJbmRleCwgcG9zaXRpb25JbmRleGVzIH0gPSBwaWNrZWRJbnRlcm1lZGlhdGVIYW5kbGUucHJvcGVydGllcztcblxuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSlcbiAgICAgICAgLmFkZFBvc2l0aW9uKGZlYXR1cmVJbmRleCwgcG9zaXRpb25JbmRleGVzLCBwaWNrZWRJbnRlcm1lZGlhdGVIYW5kbGUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgaWYgKHVwZGF0ZWREYXRhKSB7XG4gICAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdFR5cGU6ICdhZGRQb3NpdGlvbicsXG4gICAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwaWNrZWRJbnRlcm1lZGlhdGVIYW5kbGUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRHJhZ2dpbmcoZXZlbnQ6IERyYWdnaW5nRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucG9pbnRlckRvd25QaWNrcyk7XG5cbiAgICBpZiAoZWRpdEhhbmRsZSkge1xuICAgICAgLy8gQ2FuY2VsIG1hcCBwYW5uaW5nIGlmIHBvaW50ZXIgd2VudCBkb3duIG9uIGFuIGVkaXQgaGFuZGxlXG4gICAgICBldmVudC5jYW5jZWxQYW4oKTtcblxuICAgICAgY29uc3QgZWRpdEhhbmRsZVByb3BlcnRpZXMgPSBlZGl0SGFuZGxlLnByb3BlcnRpZXM7XG5cbiAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpXG4gICAgICAgIC5yZXBsYWNlUG9zaXRpb24oXG4gICAgICAgICAgZWRpdEhhbmRsZVByb3BlcnRpZXMuZmVhdHVyZUluZGV4LFxuICAgICAgICAgIGVkaXRIYW5kbGVQcm9wZXJ0aWVzLnBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICBldmVudC5tYXBDb29yZHNcbiAgICAgICAgKVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ21vdmVQb3NpdGlvbicsXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtlZGl0SGFuZGxlUHJvcGVydGllcy5mZWF0dXJlSW5kZXhdLFxuICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogZWRpdEhhbmRsZVByb3BlcnRpZXMucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5tYXBDb29yZHMsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICBjb25zdCBjdXJzb3IgPSB0aGlzLmdldEN1cnNvcihldmVudCk7XG4gICAgcHJvcHMub25VcGRhdGVDdXJzb3IoY3Vyc29yKTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzO1xuXG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEludGVybWVkaWF0ZUVkaXRIYW5kbGUoZXZlbnQucGlja3MpO1xuICAgIGlmIChzZWxlY3RlZEZlYXR1cmVJbmRleGVzLmxlbmd0aCAmJiBlZGl0SGFuZGxlKSB7XG4gICAgICBjb25zdCBlZGl0SGFuZGxlUHJvcGVydGllcyA9IGVkaXRIYW5kbGUucHJvcGVydGllcztcblxuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSlcbiAgICAgICAgLmFkZFBvc2l0aW9uKFxuICAgICAgICAgIGVkaXRIYW5kbGVQcm9wZXJ0aWVzLmZlYXR1cmVJbmRleCxcbiAgICAgICAgICBlZGl0SGFuZGxlUHJvcGVydGllcy5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgZXZlbnQubWFwQ29vcmRzXG4gICAgICAgIClcbiAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICBwcm9wcy5vbkVkaXQoe1xuICAgICAgICB1cGRhdGVkRGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICdhZGRQb3NpdGlvbicsXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtlZGl0SGFuZGxlUHJvcGVydGllcy5mZWF0dXJlSW5kZXhdLFxuICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogZWRpdEhhbmRsZVByb3BlcnRpZXMucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5tYXBDb29yZHMsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXM7XG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucGlja3MpO1xuICAgIGlmIChzZWxlY3RlZEZlYXR1cmVJbmRleGVzLmxlbmd0aCAmJiBlZGl0SGFuZGxlKSB7XG4gICAgICBjb25zdCBlZGl0SGFuZGxlUHJvcGVydGllcyA9IGVkaXRIYW5kbGUucHJvcGVydGllcztcblxuICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSlcbiAgICAgICAgLnJlcGxhY2VQb3NpdGlvbihcbiAgICAgICAgICBlZGl0SGFuZGxlUHJvcGVydGllcy5mZWF0dXJlSW5kZXgsXG4gICAgICAgICAgZWRpdEhhbmRsZVByb3BlcnRpZXMucG9zaXRpb25JbmRleGVzLFxuICAgICAgICAgIGV2ZW50Lm1hcENvb3Jkc1xuICAgICAgICApXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgcHJvcHMub25FZGl0KHtcbiAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAnZmluaXNoTW92ZVBvc2l0aW9uJyxcbiAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICBmZWF0dXJlSW5kZXhlczogW2VkaXRIYW5kbGVQcm9wZXJ0aWVzLmZlYXR1cmVJbmRleF0sXG4gICAgICAgICAgcG9zaXRpb25JbmRleGVzOiBlZGl0SGFuZGxlUHJvcGVydGllcy5wb3NpdGlvbkluZGV4ZXMsXG4gICAgICAgICAgcG9zaXRpb246IGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldEN1cnNvcihldmVudDogUG9pbnRlck1vdmVFdmVudCk6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHBpY2tzID0gKGV2ZW50ICYmIGV2ZW50LnBpY2tzKSB8fCBbXTtcblxuICAgIGNvbnN0IGhhbmRsZXNQaWNrZWQgPSBnZXRQaWNrZWRFZGl0SGFuZGxlcyhwaWNrcyk7XG4gICAgaWYgKGhhbmRsZXNQaWNrZWQubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJ2NlbGwnO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19