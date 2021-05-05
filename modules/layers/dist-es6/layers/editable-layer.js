"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@deck.gl/core");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

var EVENT_TYPES = ['anyclick', 'pointermove', 'panstart', 'panmove', 'panend', 'keyup'];

var EditableLayer = /*#__PURE__*/function (_CompositeLayer) {
  _inherits(EditableLayer, _CompositeLayer);

  var _super = _createSuper(EditableLayer);

  function EditableLayer() {
    _classCallCheck(this, EditableLayer);

    return _super.apply(this, arguments);
  }

  _createClass(EditableLayer, [{
    key: "onLayerClick",
    // Overridable interaction event handlers
    value: function onLayerClick(event) {// default implementation - do nothing
    }
  }, {
    key: "onStartDragging",
    value: function onStartDragging(event) {// default implementation - do nothing
    }
  }, {
    key: "onStopDragging",
    value: function onStopDragging(event) {// default implementation - do nothing
    }
  }, {
    key: "onDragging",
    value: function onDragging(event) {// default implementation - do nothing
    }
  }, {
    key: "onPointerMove",
    value: function onPointerMove(event) {// default implementation - do nothing
    }
  }, {
    key: "onLayerKeyUp",
    value: function onLayerKeyUp(event) {} // default implementation - do nothing;
    // TODO: implement onCancelDragging (e.g. drag off screen)

  }, {
    key: "initializeState",
    value: function initializeState() {
      this.setState({
        _editableLayerState: {
          // Picked objects at the time the pointer went down
          pointerDownPicks: null,
          // Screen coordinates where the pointer went down
          pointerDownScreenCoords: null,
          // Ground coordinates where the pointer went down
          pointerDownMapCoords: null,
          // Keep track of the mjolnir.js event handler so it can be deregistered
          eventHandler: this._forwardEventToCurrentLayer.bind(this)
        }
      });

      this._addEventHandlers();
    }
  }, {
    key: "finalizeState",
    value: function finalizeState() {
      this._removeEventHandlers();
    }
  }, {
    key: "_addEventHandlers",
    value: function _addEventHandlers() {
      // @ts-ignore
      var eventManager = this.context.deck.eventManager;
      var eventHandler = this.state._editableLayerState.eventHandler;

      var _iterator = _createForOfIteratorHelper(EVENT_TYPES),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var eventType = _step.value;
          eventManager.on(eventType, eventHandler, {
            // give nebula a higher priority so that it can stop propagation to deck.gl's map panning handlers
            priority: 100
          });
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "_removeEventHandlers",
    value: function _removeEventHandlers() {
      // @ts-ignore
      var eventManager = this.context.deck.eventManager;
      var eventHandler = this.state._editableLayerState.eventHandler;

      var _iterator2 = _createForOfIteratorHelper(EVENT_TYPES),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var eventType = _step2.value;
          eventManager.off(eventType, eventHandler);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    } // A new layer instance is created on every render, so forward the event to the current layer
    // This means that the first layer instance will stick around to be the event listener, but will forward the event
    // to the latest layer instance.

  }, {
    key: "_forwardEventToCurrentLayer",
    value: function _forwardEventToCurrentLayer(event) {
      var currentLayer = this.getCurrentLayer(); // Use a naming convention to find the event handling function for this event type

      var func = currentLayer["_on".concat(event.type)].bind(currentLayer);

      if (!func) {
        console.warn("no handler for mjolnir.js event ".concat(event.type)); // eslint-disable-line

        return;
      }

      func(event);
    }
  }, {
    key: "_onanyclick",
    value: function _onanyclick(_ref) {
      var srcEvent = _ref.srcEvent;
      var screenCoords = this.getScreenCoords(srcEvent);
      var mapCoords = this.getMapCoords(screenCoords); // @ts-ignore

      var picks = this.getPicks(screenCoords);
      this.onLayerClick({
        mapCoords: mapCoords,
        // @ts-ignore
        screenCoords: screenCoords,
        picks: picks,
        sourceEvent: srcEvent
      });
    }
  }, {
    key: "_onkeyup",
    value: function _onkeyup(_ref2) {
      var srcEvent = _ref2.srcEvent;
      this.onLayerKeyUp(srcEvent);
    }
  }, {
    key: "_onpanstart",
    value: function _onpanstart(event) {
      var screenCoords = this.getScreenCoords(event.srcEvent);
      var mapCoords = this.getMapCoords(screenCoords); // @ts-ignore

      var picks = this.getPicks(screenCoords);
      this.setState({
        _editableLayerState: _objectSpread({}, this.state._editableLayerState, {
          pointerDownScreenCoords: screenCoords,
          pointerDownMapCoords: mapCoords,
          pointerDownPicks: picks
        })
      });
      this.onStartDragging({
        picks: picks,
        // @ts-ignore
        screenCoords: screenCoords,
        // @ts-ignore
        mapCoords: mapCoords,
        // @ts-ignore
        pointerDownScreenCoords: screenCoords,
        pointerDownMapCoords: mapCoords,
        cancelPan: event.stopImmediatePropagation,
        sourceEvent: event.srcEvent
      });
    }
  }, {
    key: "_onpanmove",
    value: function _onpanmove(event) {
      var srcEvent = event.srcEvent;
      var screenCoords = this.getScreenCoords(srcEvent);
      var mapCoords = this.getMapCoords(screenCoords);
      var _this$state$_editable = this.state._editableLayerState,
          pointerDownPicks = _this$state$_editable.pointerDownPicks,
          pointerDownScreenCoords = _this$state$_editable.pointerDownScreenCoords,
          pointerDownMapCoords = _this$state$_editable.pointerDownMapCoords; // @ts-ignore

      var picks = this.getPicks(screenCoords);
      this.onDragging({
        // @ts-ignore
        screenCoords: screenCoords,
        mapCoords: mapCoords,
        picks: picks,
        pointerDownPicks: pointerDownPicks,
        pointerDownScreenCoords: pointerDownScreenCoords,
        pointerDownMapCoords: pointerDownMapCoords,
        sourceEvent: srcEvent,
        cancelPan: event.stopImmediatePropagation // another (hacky) approach for cancelling map panning
        // const controller = this.context.deck.viewManager.controllers[
        //   Object.keys(this.context.deck.viewManager.controllers)[0]
        // ];
        // controller._state.isDragging = false;

      });
    }
  }, {
    key: "_onpanend",
    value: function _onpanend(_ref3) {
      var srcEvent = _ref3.srcEvent;
      var screenCoords = this.getScreenCoords(srcEvent);
      var mapCoords = this.getMapCoords(screenCoords);
      var _this$state$_editable2 = this.state._editableLayerState,
          pointerDownPicks = _this$state$_editable2.pointerDownPicks,
          pointerDownScreenCoords = _this$state$_editable2.pointerDownScreenCoords,
          pointerDownMapCoords = _this$state$_editable2.pointerDownMapCoords; // @ts-ignore

      var picks = this.getPicks(screenCoords);
      this.onStopDragging({
        picks: picks,
        // @ts-ignore
        screenCoords: screenCoords,
        mapCoords: mapCoords,
        pointerDownPicks: pointerDownPicks,
        pointerDownScreenCoords: pointerDownScreenCoords,
        pointerDownMapCoords: pointerDownMapCoords,
        sourceEvent: srcEvent
      });
      this.setState({
        _editableLayerState: _objectSpread({}, this.state._editableLayerState, {
          pointerDownScreenCoords: null,
          pointerDownMapCoords: null,
          pointerDownPicks: null
        })
      });
    }
  }, {
    key: "_onpointermove",
    value: function _onpointermove(event) {
      var srcEvent = event.srcEvent;
      var screenCoords = this.getScreenCoords(srcEvent);
      var mapCoords = this.getMapCoords(screenCoords);
      var _this$state$_editable3 = this.state._editableLayerState,
          pointerDownPicks = _this$state$_editable3.pointerDownPicks,
          pointerDownScreenCoords = _this$state$_editable3.pointerDownScreenCoords,
          pointerDownMapCoords = _this$state$_editable3.pointerDownMapCoords; // @ts-ignore

      var picks = this.getPicks(screenCoords);
      this.onPointerMove({
        // @ts-ignore
        screenCoords: screenCoords,
        mapCoords: mapCoords,
        picks: picks,
        pointerDownPicks: pointerDownPicks,
        pointerDownScreenCoords: pointerDownScreenCoords,
        pointerDownMapCoords: pointerDownMapCoords,
        sourceEvent: srcEvent
      });
    }
  }, {
    key: "getPicks",
    value: function getPicks(screenCoords) {
      // @ts-ignore
      return this.context.deck.pickMultipleObjects({
        x: screenCoords[0],
        y: screenCoords[1],
        layerIds: [this.props.id],
        radius: this.props.pickingRadius,
        depth: this.props.pickingDepth
      });
    }
  }, {
    key: "getScreenCoords",
    value: function getScreenCoords(pointerEvent) {
      return [pointerEvent.clientX - this.context.gl.canvas.getBoundingClientRect().left, pointerEvent.clientY - this.context.gl.canvas.getBoundingClientRect().top];
    }
  }, {
    key: "getMapCoords",
    value: function getMapCoords(screenCoords) {
      // @ts-ignore
      return this.context.viewport.unproject([screenCoords[0], screenCoords[1]]);
    }
  }]);

  return EditableLayer;
}(_core.CompositeLayer);

exports["default"] = EditableLayer;

_defineProperty(EditableLayer, "layerName", 'EditableLayer');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtbGF5ZXIudHMiXSwibmFtZXMiOlsiRVZFTlRfVFlQRVMiLCJFZGl0YWJsZUxheWVyIiwiZXZlbnQiLCJzZXRTdGF0ZSIsIl9lZGl0YWJsZUxheWVyU3RhdGUiLCJwb2ludGVyRG93blBpY2tzIiwicG9pbnRlckRvd25TY3JlZW5Db29yZHMiLCJwb2ludGVyRG93bk1hcENvb3JkcyIsImV2ZW50SGFuZGxlciIsIl9mb3J3YXJkRXZlbnRUb0N1cnJlbnRMYXllciIsImJpbmQiLCJfYWRkRXZlbnRIYW5kbGVycyIsIl9yZW1vdmVFdmVudEhhbmRsZXJzIiwiZXZlbnRNYW5hZ2VyIiwiY29udGV4dCIsImRlY2siLCJzdGF0ZSIsImV2ZW50VHlwZSIsIm9uIiwicHJpb3JpdHkiLCJvZmYiLCJjdXJyZW50TGF5ZXIiLCJnZXRDdXJyZW50TGF5ZXIiLCJmdW5jIiwidHlwZSIsImNvbnNvbGUiLCJ3YXJuIiwic3JjRXZlbnQiLCJzY3JlZW5Db29yZHMiLCJnZXRTY3JlZW5Db29yZHMiLCJtYXBDb29yZHMiLCJnZXRNYXBDb29yZHMiLCJwaWNrcyIsImdldFBpY2tzIiwib25MYXllckNsaWNrIiwic291cmNlRXZlbnQiLCJvbkxheWVyS2V5VXAiLCJvblN0YXJ0RHJhZ2dpbmciLCJjYW5jZWxQYW4iLCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24iLCJvbkRyYWdnaW5nIiwib25TdG9wRHJhZ2dpbmciLCJvblBvaW50ZXJNb3ZlIiwicGlja011bHRpcGxlT2JqZWN0cyIsIngiLCJ5IiwibGF5ZXJJZHMiLCJwcm9wcyIsImlkIiwicmFkaXVzIiwicGlja2luZ1JhZGl1cyIsImRlcHRoIiwicGlja2luZ0RlcHRoIiwicG9pbnRlckV2ZW50IiwiY2xpZW50WCIsImdsIiwiY2FudmFzIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibGVmdCIsImNsaWVudFkiLCJ0b3AiLCJ2aWV3cG9ydCIsInVucHJvamVjdCIsIkNvbXBvc2l0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QWIsRUFBa0JBLFlBQVksQ0FBQyxDQUFELENBQTlCLENBQWhDLENBQVA7QUFDRDs7OztFQXhQd0NtQyxvQjs7OztnQkFBdEI5RCxhLGVBQ0EsZSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVMYXllciB9IGZyb20gJ0BkZWNrLmdsL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2xpY2tFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgRHJhZ2dpbmdFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbn0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcblxuY29uc3QgRVZFTlRfVFlQRVMgPSBbJ2FueWNsaWNrJywgJ3BvaW50ZXJtb3ZlJywgJ3BhbnN0YXJ0JywgJ3Bhbm1vdmUnLCAncGFuZW5kJywgJ2tleXVwJ107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRhYmxlTGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllcjxhbnk+IHtcbiAgc3RhdGljIGxheWVyTmFtZSA9ICdFZGl0YWJsZUxheWVyJztcbiAgLy8gT3ZlcnJpZGFibGUgaW50ZXJhY3Rpb24gZXZlbnQgaGFuZGxlcnNcbiAgb25MYXllckNsaWNrKGV2ZW50OiBDbGlja0V2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIG9uU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIG9uU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCkge1xuICAgIC8vIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gLSBkbyBub3RoaW5nXG4gIH1cblxuICBvbkRyYWdnaW5nKGV2ZW50OiBEcmFnZ2luZ0V2ZW50KSB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmdcbiAgfVxuXG4gIG9uUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpIHtcbiAgICAvLyBkZWZhdWx0IGltcGxlbWVudGF0aW9uIC0gZG8gbm90aGluZ1xuICB9XG5cbiAgb25MYXllcktleVVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgLy8gZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiAtIGRvIG5vdGhpbmc7XG4gIH1cbiAgLy8gVE9ETzogaW1wbGVtZW50IG9uQ2FuY2VsRHJhZ2dpbmcgKGUuZy4gZHJhZyBvZmYgc2NyZWVuKVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIF9lZGl0YWJsZUxheWVyU3RhdGU6IHtcbiAgICAgICAgLy8gUGlja2VkIG9iamVjdHMgYXQgdGhlIHRpbWUgdGhlIHBvaW50ZXIgd2VudCBkb3duXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3M6IG51bGwsXG4gICAgICAgIC8vIFNjcmVlbiBjb29yZGluYXRlcyB3aGVyZSB0aGUgcG9pbnRlciB3ZW50IGRvd25cbiAgICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICAgIC8vIEdyb3VuZCBjb29yZGluYXRlcyB3aGVyZSB0aGUgcG9pbnRlciB3ZW50IGRvd25cbiAgICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IG51bGwsXG5cbiAgICAgICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgbWpvbG5pci5qcyBldmVudCBoYW5kbGVyIHNvIGl0IGNhbiBiZSBkZXJlZ2lzdGVyZWRcbiAgICAgICAgZXZlbnRIYW5kbGVyOiB0aGlzLl9mb3J3YXJkRXZlbnRUb0N1cnJlbnRMYXllci5iaW5kKHRoaXMpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuX2FkZEV2ZW50SGFuZGxlcnMoKTtcbiAgfVxuXG4gIGZpbmFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5fcmVtb3ZlRXZlbnRIYW5kbGVycygpO1xuICB9XG5cbiAgX2FkZEV2ZW50SGFuZGxlcnMoKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHsgZXZlbnRNYW5hZ2VyIH0gPSB0aGlzLmNvbnRleHQuZGVjaztcbiAgICBjb25zdCB7IGV2ZW50SGFuZGxlciB9ID0gdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlO1xuXG4gICAgZm9yIChjb25zdCBldmVudFR5cGUgb2YgRVZFTlRfVFlQRVMpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5vbihldmVudFR5cGUsIGV2ZW50SGFuZGxlciwge1xuICAgICAgICAvLyBnaXZlIG5lYnVsYSBhIGhpZ2hlciBwcmlvcml0eSBzbyB0aGF0IGl0IGNhbiBzdG9wIHByb3BhZ2F0aW9uIHRvIGRlY2suZ2wncyBtYXAgcGFubmluZyBoYW5kbGVyc1xuICAgICAgICBwcmlvcml0eTogMTAwLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX3JlbW92ZUV2ZW50SGFuZGxlcnMoKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHsgZXZlbnRNYW5hZ2VyIH0gPSB0aGlzLmNvbnRleHQuZGVjaztcbiAgICBjb25zdCB7IGV2ZW50SGFuZGxlciB9ID0gdGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlO1xuXG4gICAgZm9yIChjb25zdCBldmVudFR5cGUgb2YgRVZFTlRfVFlQRVMpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5vZmYoZXZlbnRUeXBlLCBldmVudEhhbmRsZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEEgbmV3IGxheWVyIGluc3RhbmNlIGlzIGNyZWF0ZWQgb24gZXZlcnkgcmVuZGVyLCBzbyBmb3J3YXJkIHRoZSBldmVudCB0byB0aGUgY3VycmVudCBsYXllclxuICAvLyBUaGlzIG1lYW5zIHRoYXQgdGhlIGZpcnN0IGxheWVyIGluc3RhbmNlIHdpbGwgc3RpY2sgYXJvdW5kIHRvIGJlIHRoZSBldmVudCBsaXN0ZW5lciwgYnV0IHdpbGwgZm9yd2FyZCB0aGUgZXZlbnRcbiAgLy8gdG8gdGhlIGxhdGVzdCBsYXllciBpbnN0YW5jZS5cbiAgX2ZvcndhcmRFdmVudFRvQ3VycmVudExheWVyKGV2ZW50OiBhbnkpIHtcbiAgICBjb25zdCBjdXJyZW50TGF5ZXIgPSB0aGlzLmdldEN1cnJlbnRMYXllcigpO1xuXG4gICAgLy8gVXNlIGEgbmFtaW5nIGNvbnZlbnRpb24gdG8gZmluZCB0aGUgZXZlbnQgaGFuZGxpbmcgZnVuY3Rpb24gZm9yIHRoaXMgZXZlbnQgdHlwZVxuICAgIGNvbnN0IGZ1bmMgPSBjdXJyZW50TGF5ZXJbYF9vbiR7ZXZlbnQudHlwZX1gXS5iaW5kKGN1cnJlbnRMYXllcik7XG4gICAgaWYgKCFmdW5jKSB7XG4gICAgICBjb25zb2xlLndhcm4oYG5vIGhhbmRsZXIgZm9yIG1qb2xuaXIuanMgZXZlbnQgJHtldmVudC50eXBlfWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZ1bmMoZXZlbnQpO1xuICB9XG5cbiAgX29uYW55Y2xpY2soeyBzcmNFdmVudCB9OiBhbnkpIHtcbiAgICBjb25zdCBzY3JlZW5Db29yZHMgPSB0aGlzLmdldFNjcmVlbkNvb3JkcyhzcmNFdmVudCk7XG4gICAgY29uc3QgbWFwQ29vcmRzID0gdGhpcy5nZXRNYXBDb29yZHMoc2NyZWVuQ29vcmRzKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgcGlja3MgPSB0aGlzLmdldFBpY2tzKHNjcmVlbkNvb3Jkcyk7XG5cbiAgICB0aGlzLm9uTGF5ZXJDbGljayh7XG4gICAgICBtYXBDb29yZHMsXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBzY3JlZW5Db29yZHMsXG4gICAgICBwaWNrcyxcbiAgICAgIHNvdXJjZUV2ZW50OiBzcmNFdmVudCxcbiAgICB9KTtcbiAgfVxuXG4gIF9vbmtleXVwKHsgc3JjRXZlbnQgfTogeyBzcmNFdmVudDogS2V5Ym9hcmRFdmVudCB9KSB7XG4gICAgdGhpcy5vbkxheWVyS2V5VXAoc3JjRXZlbnQpO1xuICB9XG5cbiAgX29ucGFuc3RhcnQoZXZlbnQ6IGFueSkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKGV2ZW50LnNyY0V2ZW50KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLmdldE1hcENvb3JkcyhzY3JlZW5Db29yZHMpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBwaWNrcyA9IHRoaXMuZ2V0UGlja3Moc2NyZWVuQ29vcmRzKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgX2VkaXRhYmxlTGF5ZXJTdGF0ZToge1xuICAgICAgICAuLi50aGlzLnN0YXRlLl9lZGl0YWJsZUxheWVyU3RhdGUsXG4gICAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBzY3JlZW5Db29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzOiBtYXBDb29yZHMsXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3M6IHBpY2tzLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMub25TdGFydERyYWdnaW5nKHtcbiAgICAgIHBpY2tzLFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgc2NyZWVuQ29vcmRzLFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgbWFwQ29vcmRzLFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IHNjcmVlbkNvb3JkcyxcbiAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzOiBtYXBDb29yZHMsXG4gICAgICBjYW5jZWxQYW46IGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbixcbiAgICAgIHNvdXJjZUV2ZW50OiBldmVudC5zcmNFdmVudCxcbiAgICB9KTtcbiAgfVxuXG4gIF9vbnBhbm1vdmUoZXZlbnQ6IGFueSkge1xuICAgIGNvbnN0IHsgc3JjRXZlbnQgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKHNyY0V2ZW50KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLmdldE1hcENvb3JkcyhzY3JlZW5Db29yZHMpO1xuXG4gICAgY29uc3Qge1xuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgfSA9IHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgcGlja3MgPSB0aGlzLmdldFBpY2tzKHNjcmVlbkNvb3Jkcyk7XG5cbiAgICB0aGlzLm9uRHJhZ2dpbmcoe1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgc2NyZWVuQ29vcmRzLFxuICAgICAgbWFwQ29vcmRzLFxuICAgICAgcGlja3MsXG4gICAgICBwb2ludGVyRG93blBpY2tzLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkcyxcbiAgICAgIHNvdXJjZUV2ZW50OiBzcmNFdmVudCxcbiAgICAgIGNhbmNlbFBhbjogZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uLFxuICAgICAgLy8gYW5vdGhlciAoaGFja3kpIGFwcHJvYWNoIGZvciBjYW5jZWxsaW5nIG1hcCBwYW5uaW5nXG4gICAgICAvLyBjb25zdCBjb250cm9sbGVyID0gdGhpcy5jb250ZXh0LmRlY2sudmlld01hbmFnZXIuY29udHJvbGxlcnNbXG4gICAgICAvLyAgIE9iamVjdC5rZXlzKHRoaXMuY29udGV4dC5kZWNrLnZpZXdNYW5hZ2VyLmNvbnRyb2xsZXJzKVswXVxuICAgICAgLy8gXTtcbiAgICAgIC8vIGNvbnRyb2xsZXIuX3N0YXRlLmlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIF9vbnBhbmVuZCh7IHNyY0V2ZW50IH06IGFueSkge1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKHNyY0V2ZW50KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLmdldE1hcENvb3JkcyhzY3JlZW5Db29yZHMpO1xuXG4gICAgY29uc3Qge1xuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgfSA9IHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgcGlja3MgPSB0aGlzLmdldFBpY2tzKHNjcmVlbkNvb3Jkcyk7XG5cbiAgICB0aGlzLm9uU3RvcERyYWdnaW5nKHtcbiAgICAgIHBpY2tzLFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgc2NyZWVuQ29vcmRzLFxuICAgICAgbWFwQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgICBzb3VyY2VFdmVudDogc3JjRXZlbnQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIF9lZGl0YWJsZUxheWVyU3RhdGU6IHtcbiAgICAgICAgLi4udGhpcy5zdGF0ZS5fZWRpdGFibGVMYXllclN0YXRlLFxuICAgICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogbnVsbCxcbiAgICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IG51bGwsXG4gICAgICAgIHBvaW50ZXJEb3duUGlja3M6IG51bGwsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgX29ucG9pbnRlcm1vdmUoZXZlbnQ6IGFueSkge1xuICAgIGNvbnN0IHsgc3JjRXZlbnQgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IHRoaXMuZ2V0U2NyZWVuQ29vcmRzKHNyY0V2ZW50KTtcbiAgICBjb25zdCBtYXBDb29yZHMgPSB0aGlzLmdldE1hcENvb3JkcyhzY3JlZW5Db29yZHMpO1xuXG4gICAgY29uc3Qge1xuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgfSA9IHRoaXMuc3RhdGUuX2VkaXRhYmxlTGF5ZXJTdGF0ZTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgcGlja3MgPSB0aGlzLmdldFBpY2tzKHNjcmVlbkNvb3Jkcyk7XG5cbiAgICB0aGlzLm9uUG9pbnRlck1vdmUoe1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgc2NyZWVuQ29vcmRzLFxuICAgICAgbWFwQ29vcmRzLFxuICAgICAgcGlja3MsXG4gICAgICBwb2ludGVyRG93blBpY2tzLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkcyxcbiAgICAgIHNvdXJjZUV2ZW50OiBzcmNFdmVudCxcbiAgICB9KTtcbiAgfVxuXG4gIGdldFBpY2tzKHNjcmVlbkNvb3JkczogW251bWJlciwgbnVtYmVyXSkge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0LmRlY2sucGlja011bHRpcGxlT2JqZWN0cyh7XG4gICAgICB4OiBzY3JlZW5Db29yZHNbMF0sXG4gICAgICB5OiBzY3JlZW5Db29yZHNbMV0sXG4gICAgICBsYXllcklkczogW3RoaXMucHJvcHMuaWRdLFxuICAgICAgcmFkaXVzOiB0aGlzLnByb3BzLnBpY2tpbmdSYWRpdXMsXG4gICAgICBkZXB0aDogdGhpcy5wcm9wcy5waWNraW5nRGVwdGgsXG4gICAgfSk7XG4gIH1cblxuICBnZXRTY3JlZW5Db29yZHMocG9pbnRlckV2ZW50OiBhbnkpIHtcbiAgICByZXR1cm4gW1xuICAgICAgcG9pbnRlckV2ZW50LmNsaWVudFggLVxuICAgICAgICAodGhpcy5jb250ZXh0LmdsLmNhbnZhcyBhcyBIVE1MQ2FudmFzRWxlbWVudCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCxcbiAgICAgIHBvaW50ZXJFdmVudC5jbGllbnRZIC1cbiAgICAgICAgKHRoaXMuY29udGV4dC5nbC5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCxcbiAgICBdO1xuICB9XG5cbiAgZ2V0TWFwQ29vcmRzKHNjcmVlbkNvb3JkczogbnVtYmVyW10pIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC52aWV3cG9ydC51bnByb2plY3QoW3NjcmVlbkNvb3Jkc1swXSwgc2NyZWVuQ29vcmRzWzFdXSk7XG4gIH1cbn1cbiJdfQ==