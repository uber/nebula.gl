"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnappableHandler = void 0;

var _modeHandler = require("./mode-handler");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

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

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO edit-modes: delete handlers once EditMode fully implemented
var SnappableHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(SnappableHandler, _ModeHandler);

  var _super = _createSuper(SnappableHandler);

  function SnappableHandler(handler) {
    var _this;

    _classCallCheck(this, SnappableHandler);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "_handler", void 0);

    _defineProperty(_assertThisInitialized(_this), "_editHandlePicks", void 0);

    _defineProperty(_assertThisInitialized(_this), "_startDragSnapHandlePosition", void 0);

    _this._handler = handler;
    return _this;
  }

  _createClass(SnappableHandler, [{
    key: "setFeatureCollection",
    value: function setFeatureCollection(featureCollection) {
      this._handler.setFeatureCollection(featureCollection);
    }
  }, {
    key: "setModeConfig",
    value: function setModeConfig(modeConfig) {
      this._modeConfig = modeConfig;

      this._handler.setModeConfig(modeConfig);
    }
  }, {
    key: "setSelectedFeatureIndexes",
    value: function setSelectedFeatureIndexes(indexes) {
      this._handler.setSelectedFeatureIndexes(indexes);
    }
  }, {
    key: "_getSnappedMouseEvent",
    value: function _getSnappedMouseEvent(event, snapPoint) {
      // @ts-ignore
      return Object.assign({}, event, {
        groundCoords: snapPoint,
        pointerDownGroundCoords: this._startDragSnapHandlePosition
      });
    }
  }, {
    key: "_getEditHandlePicks",
    value: function _getEditHandlePicks(event) {
      var picks = event.picks;
      var potentialSnapHandle = picks.find(function (pick) {
        return pick.object && pick.object.type === 'intermediate';
      });
      var handles = {
        potentialSnapHandle: potentialSnapHandle && potentialSnapHandle.object
      };
      var pickedHandle = (0, _modeHandler.getPickedEditHandle)(event.pointerDownPicks);

      if (pickedHandle) {
        return _objectSpread({}, handles, {
          pickedHandle: pickedHandle
        });
      }

      return handles;
    }
  }, {
    key: "_updatePickedHandlePosition",
    value: function _updatePickedHandlePosition(editAction) {
      var _ref = this._editHandlePicks || {},
          pickedHandle = _ref.pickedHandle;

      if (pickedHandle && editAction) {
        var featureIndexes = editAction.featureIndexes,
            updatedData = editAction.updatedData;

        for (var i = 0; i < featureIndexes.length; i++) {
          var selectedIndex = featureIndexes[i];
          var updatedFeature = updatedData.features[selectedIndex];
          var positionIndexes = pickedHandle.positionIndexes,
              featureIndex = pickedHandle.featureIndex;

          if (selectedIndex >= 0 && featureIndex === selectedIndex) {
            var coordinates = updatedFeature.geometry.coordinates;
            pickedHandle.position = positionIndexes.reduce(function (a, b) {
              return a[b];
            }, coordinates);
          }
        }
      }
    } // If additionalSnapTargets is present in modeConfig and is populated, this
    // method will return those features along with the features
    // that live in the current layer. Otherwise, this method will simply return the
    // features from the current layer

  }, {
    key: "_getSnapTargets",
    value: function _getSnapTargets() {
      var _ref2 = this.getModeConfig() || {},
          additionalSnapTargets = _ref2.additionalSnapTargets;

      additionalSnapTargets = additionalSnapTargets || [];
      var features = [].concat(_toConsumableArray(this._handler.featureCollection.getObject().features), _toConsumableArray(additionalSnapTargets));
      return features;
    }
  }, {
    key: "_getNonPickedIntermediateHandles",
    value: function _getNonPickedIntermediateHandles() {
      var handles = [];

      var features = this._getSnapTargets();

      for (var i = 0; i < features.length; i++) {
        // Filter out the currently selected feature(s)
        var isCurrentIndexFeatureNotSelected = i < features.length && !this._handler.getSelectedFeatureIndexes().includes(i);

        if (isCurrentIndexFeatureNotSelected) {
          var geometry = features[i].geometry;
          handles.push.apply(handles, _toConsumableArray((0, _modeHandler.getEditHandlesForGeometry)(geometry, i, 'intermediate')));
        }
      }

      return handles;
    } // If no snap handle has been picked, only display the edit handles of the
    // selected feature. If a snap handle has been picked, display said snap handle
    // along with all snappable points on all non-selected features.

  }, {
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      var _ref3 = this._modeConfig || {},
          enableSnapping = _ref3.enableSnapping;

      var handles = this._handler.getEditHandles(picks, groundCoords);

      if (!enableSnapping) return handles;

      var _ref4 = this._editHandlePicks || {},
          pickedHandle = _ref4.pickedHandle;

      if (pickedHandle) {
        handles.push.apply(handles, _toConsumableArray(this._getNonPickedIntermediateHandles()).concat([pickedHandle]));
        return handles;
      }

      var _this$_handler$featur = this._handler.featureCollection.getObject(),
          features = _this$_handler$featur.features;

      var _iterator = _createForOfIteratorHelper(this._handler.getSelectedFeatureIndexes()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var index = _step.value;

          if (index < features.length) {
            var geometry = features[index].geometry;
            handles.push.apply(handles, _toConsumableArray((0, _modeHandler.getEditHandlesForGeometry)(geometry, index, 'snap')));
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return handles.filter(Boolean);
    }
  }, {
    key: "_getSnapAwareEvent",
    value: function _getSnapAwareEvent(event) {
      var _ref5 = this._editHandlePicks || {},
          potentialSnapHandle = _ref5.potentialSnapHandle;

      return potentialSnapHandle && potentialSnapHandle.position ? this._getSnappedMouseEvent(event, potentialSnapHandle.position) : event;
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      this._startDragSnapHandlePosition = ((0, _modeHandler.getPickedEditHandle)(event.picks) || {}).position;
      return this._handler.handleStartDragging(event);
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      // @ts-ignore
      var modeActionSummary = this._handler.handleStopDragging(this._getSnapAwareEvent(event));

      this._editHandlePicks = null;
      return modeActionSummary;
    }
  }, {
    key: "getCursor",
    value: function getCursor(event) {
      return this._handler.getCursor(event);
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var _ref6 = this._handler.getModeConfig() || {},
          enableSnapping = _ref6.enableSnapping;

      if (enableSnapping) {
        this._editHandlePicks = this._getEditHandlePicks(event);
      } // @ts-ignore


      var modeActionSummary = this._handler.handlePointerMove(this._getSnapAwareEvent(event));

      var editAction = modeActionSummary.editAction;

      if (editAction) {
        this._updatePickedHandlePosition(editAction);
      }

      return modeActionSummary;
    }
  }]);

  return SnappableHandler;
}(_modeHandler.ModeHandler);

exports.SnappableHandler = SnappableHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3NuYXBwYWJsZS1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbIlNuYXBwYWJsZUhhbmRsZXIiLCJoYW5kbGVyIiwiX2hhbmRsZXIiLCJmZWF0dXJlQ29sbGVjdGlvbiIsInNldEZlYXR1cmVDb2xsZWN0aW9uIiwibW9kZUNvbmZpZyIsIl9tb2RlQ29uZmlnIiwic2V0TW9kZUNvbmZpZyIsImluZGV4ZXMiLCJzZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiZXZlbnQiLCJzbmFwUG9pbnQiLCJPYmplY3QiLCJhc3NpZ24iLCJncm91bmRDb29yZHMiLCJwb2ludGVyRG93bkdyb3VuZENvb3JkcyIsIl9zdGFydERyYWdTbmFwSGFuZGxlUG9zaXRpb24iLCJwaWNrcyIsInBvdGVudGlhbFNuYXBIYW5kbGUiLCJmaW5kIiwicGljayIsIm9iamVjdCIsInR5cGUiLCJoYW5kbGVzIiwicGlja2VkSGFuZGxlIiwicG9pbnRlckRvd25QaWNrcyIsImVkaXRBY3Rpb24iLCJfZWRpdEhhbmRsZVBpY2tzIiwiZmVhdHVyZUluZGV4ZXMiLCJ1cGRhdGVkRGF0YSIsImkiLCJsZW5ndGgiLCJzZWxlY3RlZEluZGV4IiwidXBkYXRlZEZlYXR1cmUiLCJmZWF0dXJlcyIsInBvc2l0aW9uSW5kZXhlcyIsImZlYXR1cmVJbmRleCIsImNvb3JkaW5hdGVzIiwiZ2VvbWV0cnkiLCJwb3NpdGlvbiIsInJlZHVjZSIsImEiLCJiIiwiZ2V0TW9kZUNvbmZpZyIsImFkZGl0aW9uYWxTbmFwVGFyZ2V0cyIsImdldE9iamVjdCIsIl9nZXRTbmFwVGFyZ2V0cyIsImlzQ3VycmVudEluZGV4RmVhdHVyZU5vdFNlbGVjdGVkIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImluY2x1ZGVzIiwicHVzaCIsImVuYWJsZVNuYXBwaW5nIiwiZ2V0RWRpdEhhbmRsZXMiLCJfZ2V0Tm9uUGlja2VkSW50ZXJtZWRpYXRlSGFuZGxlcyIsImluZGV4IiwiZmlsdGVyIiwiQm9vbGVhbiIsIl9nZXRTbmFwcGVkTW91c2VFdmVudCIsImhhbmRsZVN0YXJ0RHJhZ2dpbmciLCJtb2RlQWN0aW9uU3VtbWFyeSIsImhhbmRsZVN0b3BEcmFnZ2luZyIsIl9nZXRTbmFwQXdhcmVFdmVudCIsImdldEN1cnNvciIsIl9nZXRFZGl0SGFuZGxlUGlja3MiLCJoYW5kbGVQb2ludGVyTW92ZSIsIl91cGRhdGVQaWNrZWRIYW5kbGVQb3NpdGlvbiIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVUE7SUFDYUEsZ0I7Ozs7O0FBS1gsNEJBQVlDLE9BQVosRUFBa0M7QUFBQTs7QUFBQTs7QUFDaEM7O0FBRGdDOztBQUFBOztBQUFBOztBQUVoQyxVQUFLQyxRQUFMLEdBQWdCRCxPQUFoQjtBQUZnQztBQUdqQzs7Ozt5Q0FFb0JFLGlCLEVBQTRDO0FBQy9ELFdBQUtELFFBQUwsQ0FBY0Usb0JBQWQsQ0FBbUNELGlCQUFuQztBQUNEOzs7a0NBRWFFLFUsRUFBdUI7QUFDbkMsV0FBS0MsV0FBTCxHQUFtQkQsVUFBbkI7O0FBQ0EsV0FBS0gsUUFBTCxDQUFjSyxhQUFkLENBQTRCRixVQUE1QjtBQUNEOzs7OENBRXlCRyxPLEVBQXlCO0FBQ2pELFdBQUtOLFFBQUwsQ0FBY08seUJBQWQsQ0FBd0NELE9BQXhDO0FBQ0Q7OzswQ0FFcUJFLEssRUFBNEJDLFMsRUFBdUM7QUFDdkY7QUFDQSxhQUFPQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxLQUFsQixFQUF5QjtBQUM5QkksUUFBQUEsWUFBWSxFQUFFSCxTQURnQjtBQUU5QkksUUFBQUEsdUJBQXVCLEVBQUUsS0FBS0M7QUFGQSxPQUF6QixDQUFQO0FBSUQ7Ozt3Q0FFbUJOLEssRUFBc0M7QUFBQSxVQUNoRE8sS0FEZ0QsR0FDdENQLEtBRHNDLENBQ2hETyxLQURnRDtBQUd4RCxVQUFNQyxtQkFBbUIsR0FBR0QsS0FBSyxDQUFD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TWlELGlCQUFpQixHQUFHLEtBQUt6RCxRQUFMLENBQWM4RCxpQkFBZCxDQUFnQyxLQUFLSCxrQkFBTCxDQUF3Qm5ELEtBQXhCLENBQWhDLENBQTFCOztBQVBzRSxVQVE5RGdCLFVBUjhELEdBUS9DaUMsaUJBUitDLENBUTlEakMsVUFSOEQ7O0FBU3RFLFVBQUlBLFVBQUosRUFBZ0I7QUFDZCxhQUFLdUMsMkJBQUwsQ0FBaUN2QyxVQUFqQztBQUNEOztBQUVELGFBQU9pQyxpQkFBUDtBQUNEOzs7O0VBeEttQ08sd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGZWF0dXJlLCBGZWF0dXJlQ29sbGVjdGlvbiwgUG9zaXRpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHsgUG9pbnRlck1vdmVFdmVudCwgU3RhcnREcmFnZ2luZ0V2ZW50LCBTdG9wRHJhZ2dpbmdFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzJztcbmltcG9ydCB7XG4gIEVkaXRIYW5kbGUsXG4gIEVkaXRBY3Rpb24sXG4gIE1vZGVIYW5kbGVyLFxuICBnZXRQaWNrZWRFZGl0SGFuZGxlLFxuICBnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5LFxufSBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5cbnR5cGUgSGFuZGxlUGlja3MgPSB7IHBpY2tlZEhhbmRsZT86IEVkaXRIYW5kbGU7IHBvdGVudGlhbFNuYXBIYW5kbGU/OiBFZGl0SGFuZGxlIH07XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBTbmFwcGFibGVIYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBfaGFuZGxlcjogTW9kZUhhbmRsZXI7XG4gIF9lZGl0SGFuZGxlUGlja3M6IEhhbmRsZVBpY2tzIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgX3N0YXJ0RHJhZ1NuYXBIYW5kbGVQb3NpdGlvbjogUG9zaXRpb247XG5cbiAgY29uc3RydWN0b3IoaGFuZGxlcjogTW9kZUhhbmRsZXIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2hhbmRsZXIgPSBoYW5kbGVyO1xuICB9XG5cbiAgc2V0RmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZUNvbGxlY3Rpb246IEZlYXR1cmVDb2xsZWN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5faGFuZGxlci5zZXRGZWF0dXJlQ29sbGVjdGlvbihmZWF0dXJlQ29sbGVjdGlvbik7XG4gIH1cblxuICBzZXRNb2RlQ29uZmlnKG1vZGVDb25maWc6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX21vZGVDb25maWcgPSBtb2RlQ29uZmlnO1xuICAgIHRoaXMuX2hhbmRsZXIuc2V0TW9kZUNvbmZpZyhtb2RlQ29uZmlnKTtcbiAgfVxuXG4gIHNldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoaW5kZXhlczogbnVtYmVyW10pOiB2b2lkIHtcbiAgICB0aGlzLl9oYW5kbGVyLnNldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoaW5kZXhlcyk7XG4gIH1cblxuICBfZ2V0U25hcHBlZE1vdXNlRXZlbnQoZXZlbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4sIHNuYXBQb2ludDogUG9zaXRpb24pOiBQb2ludGVyTW92ZUV2ZW50IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7XG4gICAgICBncm91bmRDb29yZHM6IHNuYXBQb2ludCxcbiAgICAgIHBvaW50ZXJEb3duR3JvdW5kQ29vcmRzOiB0aGlzLl9zdGFydERyYWdTbmFwSGFuZGxlUG9zaXRpb24sXG4gICAgfSk7XG4gIH1cblxuICBfZ2V0RWRpdEhhbmRsZVBpY2tzKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogSGFuZGxlUGlja3Mge1xuICAgIGNvbnN0IHsgcGlja3MgfSA9IGV2ZW50O1xuXG4gICAgY29uc3QgcG90ZW50aWFsU25hcEhhbmRsZSA9IHBpY2tzLmZpbmQoXG4gICAgICAocGljaykgPT4gcGljay5vYmplY3QgJiYgcGljay5vYmplY3QudHlwZSA9PT0gJ2ludGVybWVkaWF0ZSdcbiAgICApO1xuICAgIGNvbnN0IGhhbmRsZXMgPSB7IHBvdGVudGlhbFNuYXBIYW5kbGU6IHBvdGVudGlhbFNuYXBIYW5kbGUgJiYgcG90ZW50aWFsU25hcEhhbmRsZS5vYmplY3QgfTtcblxuICAgIGNvbnN0IHBpY2tlZEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucG9pbnRlckRvd25QaWNrcyk7XG4gICAgaWYgKHBpY2tlZEhhbmRsZSkge1xuICAgICAgcmV0dXJuIHsgLi4uaGFuZGxlcywgcGlja2VkSGFuZGxlIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGhhbmRsZXM7XG4gIH1cblxuICBfdXBkYXRlUGlja2VkSGFuZGxlUG9zaXRpb24oZWRpdEFjdGlvbjogRWRpdEFjdGlvbikge1xuICAgIGNvbnN0IHsgcGlja2VkSGFuZGxlIH0gPSB0aGlzLl9lZGl0SGFuZGxlUGlja3MgfHwge307XG5cbiAgICBpZiAocGlja2VkSGFuZGxlICYmIGVkaXRBY3Rpb24pIHtcbiAgICAgIGNvbnN0IHsgZmVhdHVyZUluZGV4ZXMsIHVwZGF0ZWREYXRhIH0gPSBlZGl0QWN0aW9uO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZlYXR1cmVJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSBmZWF0dXJlSW5kZXhlc1tpXTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEZlYXR1cmUgPSB1cGRhdGVkRGF0YS5mZWF0dXJlc1tzZWxlY3RlZEluZGV4XTtcblxuICAgICAgICBjb25zdCB7IHBvc2l0aW9uSW5kZXhlcywgZmVhdHVyZUluZGV4IH0gPSBwaWNrZWRIYW5kbGU7XG4gICAgICAgIGlmIChzZWxlY3RlZEluZGV4ID49IDAgJiYgZmVhdHVyZUluZGV4ID09PSBzZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgY29uc3QgeyBjb29yZGluYXRlcyB9ID0gdXBkYXRlZEZlYXR1cmUuZ2VvbWV0cnk7XG4gICAgICAgICAgcGlja2VkSGFuZGxlLnBvc2l0aW9uID0gcG9zaXRpb25JbmRleGVzLnJlZHVjZShcbiAgICAgICAgICAgIChhOiBhbnlbXSwgYjogbnVtYmVyKSA9PiBhW2JdLFxuICAgICAgICAgICAgY29vcmRpbmF0ZXNcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgYWRkaXRpb25hbFNuYXBUYXJnZXRzIGlzIHByZXNlbnQgaW4gbW9kZUNvbmZpZyBhbmQgaXMgcG9wdWxhdGVkLCB0aGlzXG4gIC8vIG1ldGhvZCB3aWxsIHJldHVybiB0aG9zZSBmZWF0dXJlcyBhbG9uZyB3aXRoIHRoZSBmZWF0dXJlc1xuICAvLyB0aGF0IGxpdmUgaW4gdGhlIGN1cnJlbnQgbGF5ZXIuIE90aGVyd2lzZSwgdGhpcyBtZXRob2Qgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZVxuICAvLyBmZWF0dXJlcyBmcm9tIHRoZSBjdXJyZW50IGxheWVyXG4gIF9nZXRTbmFwVGFyZ2V0cygpOiBGZWF0dXJlW10ge1xuICAgIGxldCB7IGFkZGl0aW9uYWxTbmFwVGFyZ2V0cyB9ID0gdGhpcy5nZXRNb2RlQ29uZmlnKCkgfHwge307XG4gICAgYWRkaXRpb25hbFNuYXBUYXJnZXRzID0gYWRkaXRpb25hbFNuYXBUYXJnZXRzIHx8IFtdO1xuXG4gICAgY29uc3QgZmVhdHVyZXMgPSBbXG4gICAgICAuLi50aGlzLl9oYW5kbGVyLmZlYXR1cmVDb2xsZWN0aW9uLmdldE9iamVjdCgpLmZlYXR1cmVzLFxuICAgICAgLi4uYWRkaXRpb25hbFNuYXBUYXJnZXRzLFxuICAgIF07XG4gICAgcmV0dXJuIGZlYXR1cmVzO1xuICB9XG5cbiAgX2dldE5vblBpY2tlZEludGVybWVkaWF0ZUhhbmRsZXMoKTogRWRpdEhhbmRsZVtdIHtcbiAgICBjb25zdCBoYW5kbGVzID0gW107XG4gICAgY29uc3QgZmVhdHVyZXMgPSB0aGlzLl9nZXRTbmFwVGFyZ2V0cygpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmZWF0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGZlYXR1cmUocylcbiAgICAgIGNvbnN0IGlzQ3VycmVudEluZGV4RmVhdHVyZU5vdFNlbGVjdGVkID1cbiAgICAgICAgaSA8IGZlYXR1cmVzLmxlbmd0aCAmJiAhdGhpcy5faGFuZGxlci5nZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzKCkuaW5jbHVkZXMoaSk7XG5cbiAgICAgIGlmIChpc0N1cnJlbnRJbmRleEZlYXR1cmVOb3RTZWxlY3RlZCkge1xuICAgICAgICBjb25zdCB7IGdlb21ldHJ5IH0gPSBmZWF0dXJlc1tpXTtcbiAgICAgICAgaGFuZGxlcy5wdXNoKC4uLmdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkoZ2VvbWV0cnksIGksICdpbnRlcm1lZGlhdGUnKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgLy8gSWYgbm8gc25hcCBoYW5kbGUgaGFzIGJlZW4gcGlja2VkLCBvbmx5IGRpc3BsYXkgdGhlIGVkaXQgaGFuZGxlcyBvZiB0aGVcbiAgLy8gc2VsZWN0ZWQgZmVhdHVyZS4gSWYgYSBzbmFwIGhhbmRsZSBoYXMgYmVlbiBwaWNrZWQsIGRpc3BsYXkgc2FpZCBzbmFwIGhhbmRsZVxuICAvLyBhbG9uZyB3aXRoIGFsbCBzbmFwcGFibGUgcG9pbnRzIG9uIGFsbCBub24tc2VsZWN0ZWQgZmVhdHVyZXMuXG4gIGdldEVkaXRIYW5kbGVzKHBpY2tzPzogQXJyYXk8UmVjb3JkPHN0cmluZywgYW55Pj4sIGdyb3VuZENvb3Jkcz86IFBvc2l0aW9uKTogYW55W10ge1xuICAgIGNvbnN0IHsgZW5hYmxlU25hcHBpbmcgfSA9IHRoaXMuX21vZGVDb25maWcgfHwge307XG4gICAgY29uc3QgaGFuZGxlcyA9IHRoaXMuX2hhbmRsZXIuZ2V0RWRpdEhhbmRsZXMocGlja3MsIGdyb3VuZENvb3Jkcyk7XG5cbiAgICBpZiAoIWVuYWJsZVNuYXBwaW5nKSByZXR1cm4gaGFuZGxlcztcbiAgICBjb25zdCB7IHBpY2tlZEhhbmRsZSB9ID0gdGhpcy5fZWRpdEhhbmRsZVBpY2tzIHx8IHt9O1xuXG4gICAgaWYgKHBpY2tlZEhhbmRsZSkge1xuICAgICAgaGFuZGxlcy5wdXNoKC4uLnRoaXMuX2dldE5vblBpY2tlZEludGVybWVkaWF0ZUhhbmRsZXMoKSwgcGlja2VkSGFuZGxlKTtcbiAgICAgIHJldHVybiBoYW5kbGVzO1xuICAgIH1cblxuICAgIGNvbnN0IHsgZmVhdHVyZXMgfSA9IHRoaXMuX2hhbmRsZXIuZmVhdHVyZUNvbGxlY3Rpb24uZ2V0T2JqZWN0KCk7XG4gICAgZm9yIChjb25zdCBpbmRleCBvZiB0aGlzLl9oYW5kbGVyLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKSkge1xuICAgICAgaWYgKGluZGV4IDwgZmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHsgZ2VvbWV0cnkgfSA9IGZlYXR1cmVzW2luZGV4XTtcbiAgICAgICAgaGFuZGxlcy5wdXNoKC4uLmdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkoZ2VvbWV0cnksIGluZGV4LCAnc25hcCcpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGFuZGxlcy5maWx0ZXIoQm9vbGVhbik7XG4gIH1cblxuICBfZ2V0U25hcEF3YXJlRXZlbnQoZXZlbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgICBjb25zdCB7IHBvdGVudGlhbFNuYXBIYW5kbGUgfSA9IHRoaXMuX2VkaXRIYW5kbGVQaWNrcyB8fCB7fTtcblxuICAgIHJldHVybiBwb3RlbnRpYWxTbmFwSGFuZGxlICYmIHBvdGVudGlhbFNuYXBIYW5kbGUucG9zaXRpb25cbiAgICAgID8gdGhpcy5fZ2V0U25hcHBlZE1vdXNlRXZlbnQoZXZlbnQsIHBvdGVudGlhbFNuYXBIYW5kbGUucG9zaXRpb24pXG4gICAgICA6IGV2ZW50O1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KTogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIHRoaXMuX3N0YXJ0RHJhZ1NuYXBIYW5kbGVQb3NpdGlvbiA9IChnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKSB8fCB7fSkucG9zaXRpb247XG4gICAgcmV0dXJuIHRoaXMuX2hhbmRsZXIuaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudCk7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KTogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBtb2RlQWN0aW9uU3VtbWFyeSA9IHRoaXMuX2hhbmRsZXIuaGFuZGxlU3RvcERyYWdnaW5nKHRoaXMuX2dldFNuYXBBd2FyZUV2ZW50KGV2ZW50KSk7XG5cbiAgICB0aGlzLl9lZGl0SGFuZGxlUGlja3MgPSBudWxsO1xuICAgIHJldHVybiBtb2RlQWN0aW9uU3VtbWFyeTtcbiAgfVxuXG4gIGdldEN1cnNvcihldmVudDogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9oYW5kbGVyLmdldEN1cnNvcihldmVudCk7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShcbiAgICBldmVudDogUG9pbnRlck1vdmVFdmVudFxuICApOiB7IGVkaXRBY3Rpb246IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkOyBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgeyBlbmFibGVTbmFwcGluZyB9ID0gdGhpcy5faGFuZGxlci5nZXRNb2RlQ29uZmlnKCkgfHwge307XG5cbiAgICBpZiAoZW5hYmxlU25hcHBpbmcpIHtcbiAgICAgIHRoaXMuX2VkaXRIYW5kbGVQaWNrcyA9IHRoaXMuX2dldEVkaXRIYW5kbGVQaWNrcyhldmVudCk7XG4gICAgfVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBtb2RlQWN0aW9uU3VtbWFyeSA9IHRoaXMuX2hhbmRsZXIuaGFuZGxlUG9pbnRlck1vdmUodGhpcy5fZ2V0U25hcEF3YXJlRXZlbnQoZXZlbnQpKTtcbiAgICBjb25zdCB7IGVkaXRBY3Rpb24gfSA9IG1vZGVBY3Rpb25TdW1tYXJ5O1xuICAgIGlmIChlZGl0QWN0aW9uKSB7XG4gICAgICB0aGlzLl91cGRhdGVQaWNrZWRIYW5kbGVQb3NpdGlvbihlZGl0QWN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9kZUFjdGlvblN1bW1hcnk7XG4gIH1cbn1cbiJdfQ==