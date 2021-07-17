"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = require("events");

var _document = _interopRequireDefault(require("global/document"));

var _core = require("@deck.gl/core");

var _deckDrawer = _interopRequireDefault(require("./deck-renderer/deck-drawer"));

var _layerMouseEvent = _interopRequireDefault(require("./layer-mouse-event"));

var _nebulaLayer = _interopRequireDefault(require("./nebula-layer"));

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LOGGER_PREFIX = 'Nebula: ';

var Nebula = /*#__PURE__*/function () {
  function Nebula() {
    var _this = this;

    _classCallCheck(this, Nebula);

    _defineProperty(this, "props", void 0);

    _defineProperty(this, "deckgl", void 0);

    _defineProperty(this, "mainContainer", void 0);

    _defineProperty(this, "deckglMouseOverInfo", void 0);

    _defineProperty(this, "_deckDrawer", void 0);

    _defineProperty(this, "_mouseWasDown", void 0);

    _defineProperty(this, "wmViewport", void 0);

    _defineProperty(this, "queryObjectEvents", new _events.EventEmitter());

    _defineProperty(this, "forceUpdate", void 0);

    _defineProperty(this, "inited", void 0);

    _defineProperty(this, "_onMouseEvent", function (event) {
      if (!_this._isNebulaEvent(event)) {
        return;
      }

      if (event.type === 'mousedown') {
        _this._mouseWasDown = true;
      } // offsetX/Y of the MouseEvent provides the offset in the X/Y coordinate
      // of the mouse pointer between that event and the padding edge of the target node.
      // We set our listener to document so we need to adjust offsetX/Y
      // in case the target is not be our WebGL canvas.


      var _ref = _this.mainContainer ? _this.mainContainer.getBoundingClientRect() : {},
          _ref$top = _ref.top,
          top = _ref$top === void 0 ? 0 : _ref$top,
          _ref$left = _ref.left,
          left = _ref$left === void 0 ? 0 : _ref$left;

      var proxyEvent = new Proxy(event, {
        get: function get(original, propertyName) {
          if (propertyName === 'offsetX') {
            return original.pageX - left;
          }

          if (propertyName === 'offsetY') {
            return original.pageY - top;
          } // TODO: Properly use pointer events


          if (propertyName === 'type') {
            return original.type.replace('pointer', 'mouse');
          }

          var result = original[propertyName];

          if (typeof result === 'function') {
            return result.bind(original);
          }

          return result;
        }
      });

      _this._handleDeckGLEvent(proxyEvent);
    });
  }

  _createClass(Nebula, [{
    key: "init",
    value: function init(props) {
      var _this2 = this;

      this.props = props;
      this.wmViewport = new _core.WebMercatorViewport(this.props.viewport); // TODO: Properly use pointer events: ['click', 'pointermove', 'pointerup', 'pointerdown']

      ['click', 'mousemove', 'mouseup', 'mousedown'].forEach(function (name) {
        return _document["default"].addEventListener(name, _this2._onMouseEvent, true);
      });
    }
  }, {
    key: "detach",
    value: function detach() {
      var _this3 = this;

      // TODO: Properly use pointer events: ['click', 'pointermove', 'pointerup', 'pointerdown']
      ['click', 'mousemove', 'mouseup', 'mousedown'].forEach(function (name) {
        return _document["default"].removeEventListener(name, _this3._onMouseEvent, true);
      });
    }
  }, {
    key: "updateProps",
    value: function updateProps(newProps) {
      this.props = newProps;
      var viewport = this.props.viewport;
      this.wmViewport = new _core.WebMercatorViewport(viewport);
    }
  }, {
    key: "log",
    value: function log(message) {
      var logger = this.props.logger;

      if (logger && logger.info) {
        logger.info(LOGGER_PREFIX + message);
      }
    }
  }, {
    key: "updateAllDeckObjects",
    value: function updateAllDeckObjects() {
      this.getAllLayers().forEach(function (layer) {
        if (layer && layer.deckCache) {
          layer.deckCache.updateAllDeckObjects();
        }
      });
      this.forceUpdate();
    }
  }, {
    key: "updateDeckObjectsByIds",
    value: function updateDeckObjectsByIds(ids) {
      this.getAllLayers().forEach(function (layer) {
        if (layer && layer.deckCache) {
          layer.deckCache.updateDeckObjectsByIds(ids);
        }
      });
      this.forceUpdate();
    }
  }, {
    key: "rerenderLayers",
    value: function rerenderLayers() {
      this.updateAllDeckObjects();
    }
  }, {
    key: "_isNebulaEvent",
    value: function _isNebulaEvent(_ref2) {
      var buttons = _ref2.buttons,
          target = _ref2.target,
          type = _ref2.type;
      var viewport = this.props.viewport; // allow mouseup event aggressively to cancel drag properly
      // TODO: use pointer capture setPointerCapture() to capture mouseup properly after deckgl

      if (this._mouseWasDown && type === 'mouseup') {
        this._mouseWasDown = false;
        return true;
      } // allow mousemove event while dragging


      if (type === 'mousemove' && buttons > 0) {
        return true;
      }

      if (!target.getBoundingClientRect) {
        return false;
      }

      var rect = target.getBoundingClientRect(); // Only listen to events coming from the basemap
      // identified by the canvas of the same size as viewport.
      // Need to round the rect dimension as some monitors
      // have some sub-pixel difference with viewport.

      return Math.round(rect.width) === Math.round(viewport.width) && Math.round(rect.height) === Math.round(viewport.height);
    }
  }, {
    key: "getMouseGroundPosition",
    value: function getMouseGroundPosition(event) {
      return this.wmViewport.unproject([event.offsetX, event.offsetY]);
    }
  }, {
    key: "unprojectMousePosition",
    value: function unprojectMousePosition(mousePosition) {
      // @ts-ignore
      return this.wmViewport.unproject(mousePosition);
    }
  }, {
    key: "_handleDeckGLEvent",
    value: function _handleDeckGLEvent(event) {
      var deckgl = this.deckgl,
          _this$props = this.props,
          onMapMouseEvent = _this$props.onMapMouseEvent,
          selectionType = _this$props.selectionType,
          eventFilter = _this$props.eventFilter;
      var sendMapEvent = true;
      var cursor = 'auto';

      if (event && deckgl && selectionType) {
        if (!this._deckDrawer) this._deckDrawer = new _deckDrawer["default"](this);
        var lngLat = this.getMouseGroundPosition(event);
        if (eventFilter && !eventFilter(lngLat, event)) return; // @ts-ignore

        var drawerResult = this._deckDrawer.handleEvent(event, lngLat, selectionType);

        if (drawerResult.redraw) this.forceUpdate();
        return;
      }

      if (event && deckgl && (!event.buttons || event.type !== 'mousemove')) {
        // TODO: sort by mouse priority
        var layerIds = deckgl.props.layers.filter(function (l) {
          return l && l.props && l.props.nebulaLayer && l.props.nebulaLayer.enablePicking;
        }).map(function (l) {
          return l.id;
        });
        var pickingInfo = deckgl.pickObject({
          x: event.offsetX,
          y: event.offsetY,
          radius: 5,
          layerIds: layerIds
        });
        this.queryObjectEvents.emit('pick', {
          event: event,
          pickingInfo: pickingInfo
        });

        if (pickingInfo) {
          sendMapEvent = false;
          var index = pickingInfo.index,
              _lngLat = pickingInfo.lngLat;
          if (eventFilter && !eventFilter(_lngLat, event)) return;
          var deckLayer = pickingInfo.layer,
              object = pickingInfo.object;

          if (deckLayer && deckLayer.props && deckLayer.props.nebulaLayer && deckLayer.props.nebulaLayer.eventHandler) {
            deckLayer.props.nebulaLayer.eventHandler(event, pickingInfo);
          }

          var original = object.original || deckLayer.props.nebulaLayer && deckLayer.props.nebulaLayer.deckCache && deckLayer.props.nebulaLayer.deckCache.originals[index];

          if (original) {
            this.deckglMouseOverInfo = {
              originalLayer: deckLayer.props.nebulaLayer,
              index: index
            }; // @ts-ignore

            var nebulaMouseEvent = new _layerMouseEvent["default"](event, {
              data: original,
              metadata: object.metadata,
              groundPoint: _lngLat,
              nebula: this
            });
            deckLayer.props.nebulaLayer.emit(event.type, nebulaMouseEvent);
            this.forceUpdate();
          }

          cursor = 'pointer';
        }
      }

      if (_document["default"].documentElement) {
        _document["default"].documentElement.style.cursor = cursor;
      }

      if (sendMapEvent) {
        this.deckglMouseOverInfo = null;

        var _lngLat2 = this.getMouseGroundPosition(event);

        if (eventFilter && !eventFilter(_lngLat2, event)) return; // send to layers first
        // @ts-ignore

        var _nebulaMouseEvent = new _layerMouseEvent["default"](event, {
          groundPoint: _lngLat2,
          nebula: this
        });

        this.getAllLayers().filter(function (layer) {
          return layer && layer.usesMapEvents;
        }).forEach(function (layer) {
          return layer.emit('mapMouseEvent', _nebulaMouseEvent);
        });
        this.getAllLayers().filter(function (layer) {
          return layer && layer.props && layer.props.nebulaLayer && layer.props.nebulaLayer.mapMouseEvent;
        }).forEach(function (layer) {
          return layer.props.nebulaLayer.mapMouseEvent(_nebulaMouseEvent, layer);
        });

        if (onMapMouseEvent) {
          onMapMouseEvent(event, _lngLat2);
        }
      }
    }
  }, {
    key: "getExtraDeckLayers",
    value: function getExtraDeckLayers() {
      var result = [];
      if (this._deckDrawer) result.push.apply(result, _toConsumableArray(this._deckDrawer.render()));
      return result;
    }
  }, {
    key: "renderDeckLayers",
    value: function renderDeckLayers() {
      var _this4 = this;

      return this.getAllLayers().map(function (layer) {
        return layer instanceof _nebulaLayer["default"] ? layer.render({
          nebula: _this4
        }) : layer;
      }).filter(Boolean);
    }
  }, {
    key: "getAllLayers",
    value: function getAllLayers() {
      var result = [];
      this.props.layers.filter(Boolean).forEach(function (layer) {
        result.push(layer); // Only NebulaLayers have helpers, Deck GL layers don't.

        if (layer instanceof _nebulaLayer["default"]) {
          result.push.apply(result, _toConsumableArray(layer.helperLayers));
        }
      });
      return result.filter(Boolean);
    }
  }, {
    key: "getRenderedLayers",
    value: function getRenderedLayers() {
      return [].concat(_toConsumableArray(this.renderDeckLayers()), _toConsumableArray(this.getExtraDeckLayers()));
    }
  }, {
    key: "updateAndGetRenderedLayers",
    value: function updateAndGetRenderedLayers(layers, viewport, container) {
      if (this.inited) {
        this.updateProps({
          layers: layers,
          viewport: viewport
        });

        this.forceUpdate = function () {
          return container.forceUpdate();
        };
      } else {
        this.inited = true;
        this.init({
          layers: layers,
          viewport: viewport
        });

        this.forceUpdate = function () {
          return container.forceUpdate();
        };

        this.updateAllDeckObjects();
      }

      return this.getRenderedLayers();
    }
  }, {
    key: "setDeck",
    value: function setDeck(deckgl) {
      if (deckgl) {
        this.deckgl = deckgl;
      }
    }
  }, {
    key: "setMainContainer",
    value: function setMainContainer(mainContainer) {
      if (mainContainer) {
        this.mainContainer = mainContainer;
      }
    }
  }]);

  return Nebula;
}();

exports["default"] = Nebula;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbmVidWxhLnRzIl0sIm5hbWVzIjpbIkxPR0dFUl9QUkVGSVgiLCJOZWJ1bGEiLCJFdmVudEVtaXR0ZXIiLCJldmVudCIsIl9pc05lYnVsYUV2ZW50IiwidHlwZSIsIl9tb3VzZVdhc0Rvd24iLCJtYWluQ29udGFpbmVyIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInByb3h5RXZlbnQiLCJQcm94eSIsImdldCIsIm9yaWdpbmFsIiwicHJvcGVydHlOYW1lIiwicGFnZVgiLCJwYWdlWSIsInJlcGxhY2UiLCJyZXN1bHQiLCJiaW5kIiwiX2hhbmRsZURlY2tHTEV2ZW50IiwicHJvcHMiLCJ3bVZpZXdwb3J0IiwiV2ViTWVyY2F0b3JWaWV3cG9ydCIsInZpZXdwb3J0IiwiZm9yRWFjaCIsIm5hbWUiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25Nb3VzZUV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm5ld1Byb3BzIiwibWVzc2FnZSIsImxvZ2dlciIsImluZm8iLCJnZXRBbGxMYXllcnMiLCJsYXllciIsImRlY2tDYWNoZSIsInVwZGF0ZUFsbERlY2tPYmplY3RzIiwiZm9yY2VVcGRhdGUiLCJpZHMiLCJ1cGRhdGVEZWNrT2JqZWN0c0J5SWRzIiwiYnV0dG9ucyIsInRhcmdldCIsInJlY3QiLCJNYXRoIiwicm91bmQiLCJ3aWR0aCIsImhlaWdodCIsInVucHJvamVjdCIsIm9mZnNldFgiLCJvZmZzZXRZIiwibW91c2VQb3NpdGlvbiIsImRlY2tnbCIsIm9uTWFwTW91c2VFdmVudCIsInNlbGVjdGlvblR5cGUiLCJldmVudEZpbHRlciIsInNlbmRNYXBFdmVudCIsImN1cnNvciIsIl9kZWNrRHJhd2VyIiwiRGVja0RyYXdlciIsImxuZ0xhdCIsImdldE1vdXNlR3JvdW5kUG9zaXRpb24iLCJkcmF3ZXJSZXN1bHQiLCJoYW5kbGVFdmVudCIsInJlZHJhdyIsImxheWVySWRzIiwibGF5ZXJzIiwiZmlsdGVyIiwibCIsIm5lYnVsYUxheWVyIiwiZW5hYmxlUGlja2luZyIsIm1hcCIsImlkIiwicGlja2luZ0luZm8iLCJwaWNrT2JqZWN0IiwieCIsInkiLCJyYWRpdXMiLCJxdWVyeU9iamVjdEV2ZW50cyIsImVtaXQiLCJpbmRleCIsImRlY2tMYXllciIsIm9iamVjdCIsImV2ZW50SGFuZGxlciIsIm9yaWdpbmFscyIsImRlY2tnbE1vdXNlT3ZlckluZm8iLCJvcmlnaW5hbExheWVyIiwibmVidWxhTW91c2VFdmVudCIsIkxheWVyTW91c2VFdmVudCIsImRhdGEiLCJtZXRhZGF0YSIsImdyb3VuZFBvaW50IiwibmVidWxhIiwiZG9jdW1lbnRFbGVtZW50Iiwic3R5bGUiLCJ1c2VzTWFwRXZlbnRzIiwibWFwTW91c2VFdmVudCIsInB1c2giLCJyZW5kZXIiLCJOZWJ1bGFMYXllciIsIkJvb2xlYW4iLCJoZWxwZXJMYXllcnMiLCJyZW5kZXJEZWNrTGF5ZXJzIiwiZ2V0RXh0cmFEZWNrTGF5ZXJzIiwiY29udGFpbmVyIiwiaW5pdGVkIiwidXBkYXRlUHJvcHMiLCJpbml0IiwiZ2V0UmVuZGVyZWRMYXllcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxHQUFHLFVBQXRCOztJQUVxQkMsTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7K0NBZ0NlLElBQUlDLG9CQUFKLEU7Ozs7OzsyQ0ErRGxCLFVBQUNDLEtBQUQsRUFBOEI7QUFDNUMsVUFBSSxDQUFDLEtBQUksQ0FBQ0MsY0FBTCxDQUFvQkQsS0FBcEIsQ0FBTCxFQUFpQztBQUMvQjtBQUNEOztBQUVELFVBQUlBLEtBQUssQ0FBQ0UsSUFBTixLQUFlLFdBQW5CLEVBQWdDO0FBQzlCLFFBQUEsS0FBSSxDQUFDQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0QsT0FQMkMsQ0FTNUM7QUFDQTtBQUNBO0FBQ0E7OztBQVo0QyxpQkFhZCxLQUFJ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QixLQUFLLENBQUNrRSxZQUFmLEVBQU47QUFDRDtBQUNGLE9BTkQ7QUFRQSxhQUFPcEYsTUFBTSxDQUFDa0QsTUFBUCxDQUFjaUMsT0FBZCxDQUFQO0FBQ0Q7Ozt3Q0FFbUI7QUFDbEIsMENBQVcsS0FBS0UsZ0JBQUwsRUFBWCxzQkFBdUMsS0FBS0Msa0JBQUwsRUFBdkM7QUFDRDs7OytDQUdDckMsTSxFQUNBM0MsUSxFQUNBaUYsUyxFQUNBO0FBQ0EsVUFBSSxLQUFLQyxNQUFULEVBQWlCO0FBQ2YsYUFBS0MsV0FBTCxDQUFpQjtBQUFFeEMsVUFBQUEsTUFBTSxFQUFOQSxNQUFGO0FBQVUzQyxVQUFBQSxRQUFRLEVBQVJBO0FBQVYsU0FBakI7O0FBQ0EsYUFBS2UsV0FBTCxHQUFtQjtBQUFBLGlCQUFNa0UsU0FBUyxDQUFDbEUsV0FBVixFQUFOO0FBQUEsU0FBbkI7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLbUUsTUFBTCxHQUFjLElBQWQ7QUFDQSxhQUFLRSxJQUFMLENBQVU7QUFBRXpDLFVBQUFBLE1BQU0sRUFBTkEsTUFBRjtBQUFVM0MsVUFBQUEsUUFBUSxFQUFSQTtBQUFWLFNBQVY7O0FBQ0EsYUFBS2UsV0FBTCxHQUFtQjtBQUFBLGlCQUFNa0UsU0FBUyxDQUFDbEUsV0FBVixFQUFOO0FBQUEsU0FBbkI7O0FBQ0EsYUFBS0Qsb0JBQUw7QUFDRDs7QUFFRCxhQUFPLEtBQUt1RSxpQkFBTCxFQUFQO0FBQ0Q7Ozs0QkFFT3hELE0sRUFBb0M7QUFDMUMsVUFBSUEsTUFBSixFQUFZO0FBQ1YsYUFBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0Q7QUFDRjs7O3FDQUVnQi9DLGEsRUFBMkM7QUFDMUQsVUFBSUEsYUFBSixFQUFtQjtBQUNqQixhQUFLQSxhQUFMLEdBQXFCQSxhQUFyQjtBQUNEO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG5pbXBvcnQgZG9jdW1lbnQgZnJvbSAnZ2xvYmFsL2RvY3VtZW50JztcbmltcG9ydCB3aW5kb3cgZnJvbSAnZ2xvYmFsL3dpbmRvdyc7XG5pbXBvcnQgeyBXZWJNZXJjYXRvclZpZXdwb3J0IH0gZnJvbSAnQGRlY2suZ2wvY29yZSc7XG5cbmltcG9ydCBEZWNrRHJhd2VyIGZyb20gJy4vZGVjay1yZW5kZXJlci9kZWNrLWRyYXdlcic7XG5pbXBvcnQgTGF5ZXJNb3VzZUV2ZW50IGZyb20gJy4vbGF5ZXItbW91c2UtZXZlbnQnO1xuaW1wb3J0IE5lYnVsYUxheWVyIGZyb20gJy4vbmVidWxhLWxheWVyJztcblxuY29uc3QgTE9HR0VSX1BSRUZJWCA9ICdOZWJ1bGE6ICc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5lYnVsYSB7XG4gIGluaXQocHJvcHM6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgdGhpcy53bVZpZXdwb3J0ID0gbmV3IFdlYk1lcmNhdG9yVmlld3BvcnQodGhpcy5wcm9wcy52aWV3cG9ydCk7XG5cbiAgICAvLyBUT0RPOiBQcm9wZXJseSB1c2UgcG9pbnRlciBldmVudHM6IFsnY2xpY2snLCAncG9pbnRlcm1vdmUnLCAncG9pbnRlcnVwJywgJ3BvaW50ZXJkb3duJ11cbiAgICBbJ2NsaWNrJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJywgJ21vdXNlZG93biddLmZvckVhY2goKG5hbWUpID0+XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIHRoaXMuX29uTW91c2VFdmVudCwgdHJ1ZSlcbiAgICApO1xuICB9XG5cbiAgZGV0YWNoKCkge1xuICAgIC8vIFRPRE86IFByb3Blcmx5IHVzZSBwb2ludGVyIGV2ZW50czogWydjbGljaycsICdwb2ludGVybW92ZScsICdwb2ludGVydXAnLCAncG9pbnRlcmRvd24nXVxuICAgIFsnY2xpY2snLCAnbW91c2Vtb3ZlJywgJ21vdXNldXAnLCAnbW91c2Vkb3duJ10uZm9yRWFjaCgobmFtZSkgPT5cbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgdGhpcy5fb25Nb3VzZUV2ZW50LCB0cnVlKVxuICAgICk7XG4gIH1cblxuICB1cGRhdGVQcm9wcyhuZXdQcm9wczogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIHRoaXMucHJvcHMgPSBuZXdQcm9wcztcbiAgICBjb25zdCB7IHZpZXdwb3J0IH0gPSB0aGlzLnByb3BzO1xuXG4gICAgdGhpcy53bVZpZXdwb3J0ID0gbmV3IFdlYk1lcmNhdG9yVmlld3BvcnQodmlld3BvcnQpO1xuICB9XG5cbiAgcHJvcHM6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIGRlY2tnbDogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGw7XG4gIG1haW5Db250YWluZXI6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsO1xuICBkZWNrZ2xNb3VzZU92ZXJJbmZvOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgX2RlY2tEcmF3ZXI6IERlY2tEcmF3ZXI7XG4gIF9tb3VzZVdhc0Rvd246IGJvb2xlYW47XG4gIHdtVmlld3BvcnQ6IFdlYk1lcmNhdG9yVmlld3BvcnQ7XG4gIHF1ZXJ5T2JqZWN0RXZlbnRzOiBFdmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIGZvcmNlVXBkYXRlOiBGdW5jdGlvbjtcbiAgaW5pdGVkOiBib29sZWFuO1xuXG4gIGxvZyhtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBjb25zdCB7IGxvZ2dlciB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAobG9nZ2VyICYmIGxvZ2dlci5pbmZvKSB7XG4gICAgICBsb2dnZXIuaW5mbyhMT0dHRVJfUFJFRklYICsgbWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQWxsRGVja09iamVjdHMoKSB7XG4gICAgdGhpcy5nZXRBbGxMYXllcnMoKS5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgaWYgKGxheWVyICYmIGxheWVyLmRlY2tDYWNoZSkge1xuICAgICAgICAobGF5ZXIuZGVja0NhY2hlIGFzIGFueSkudXBkYXRlQWxsRGVja09iamVjdHMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gIH1cblxuICB1cGRhdGVEZWNrT2JqZWN0c0J5SWRzKGlkczogc3RyaW5nW10pIHtcbiAgICB0aGlzLmdldEFsbExheWVycygpLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAobGF5ZXIgJiYgbGF5ZXIuZGVja0NhY2hlKSB7XG4gICAgICAgIChsYXllci5kZWNrQ2FjaGUgYXMgYW55KS51cGRhdGVEZWNrT2JqZWN0c0J5SWRzKGlkcyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICB9XG5cbiAgcmVyZW5kZXJMYXllcnMoKSB7XG4gICAgdGhpcy51cGRhdGVBbGxEZWNrT2JqZWN0cygpO1xuICB9XG5cbiAgX2lzTmVidWxhRXZlbnQoeyBidXR0b25zLCB0YXJnZXQsIHR5cGUgfTogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIGNvbnN0IHsgdmlld3BvcnQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAvLyBhbGxvdyBtb3VzZXVwIGV2ZW50IGFnZ3Jlc3NpdmVseSB0byBjYW5jZWwgZHJhZyBwcm9wZXJseVxuICAgIC8vIFRPRE86IHVzZSBwb2ludGVyIGNhcHR1cmUgc2V0UG9pbnRlckNhcHR1cmUoKSB0byBjYXB0dXJlIG1vdXNldXAgcHJvcGVybHkgYWZ0ZXIgZGVja2dsXG4gICAgaWYgKHRoaXMuX21vdXNlV2FzRG93biAmJiB0eXBlID09PSAnbW91c2V1cCcpIHtcbiAgICAgIHRoaXMuX21vdXNlV2FzRG93biA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gYWxsb3cgbW91c2Vtb3ZlIGV2ZW50IHdoaWxlIGRyYWdnaW5nXG4gICAgaWYgKHR5cGUgPT09ICdtb3VzZW1vdmUnICYmIGJ1dHRvbnMgPiAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIXRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCByZWN0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIC8vIE9ubHkgbGlzdGVuIHRvIGV2ZW50cyBjb21pbmcgZnJvbSB0aGUgYmFzZW1hcFxuICAgIC8vIGlkZW50aWZpZWQgYnkgdGhlIGNhbnZhcyBvZiB0aGUgc2FtZSBzaXplIGFzIHZpZXdwb3J0LlxuICAgIC8vIE5lZWQgdG8gcm91bmQgdGhlIHJlY3QgZGltZW5zaW9uIGFzIHNvbWUgbW9uaXRvcnNcbiAgICAvLyBoYXZlIHNvbWUgc3ViLXBpeGVsIGRpZmZlcmVuY2Ugd2l0aCB2aWV3cG9ydC5cbiAgICByZXR1cm4gKFxuICAgICAgTWF0aC5yb3VuZChyZWN0LndpZHRoKSA9PT0gTWF0aC5yb3VuZCh2aWV3cG9ydC53aWR0aCkgJiZcbiAgICAgIE1hdGgucm91bmQocmVjdC5oZWlnaHQpID09PSBNYXRoLnJvdW5kKHZpZXdwb3J0LmhlaWdodClcbiAgICApO1xuICB9XG5cbiAgX29uTW91c2VFdmVudCA9IChldmVudDogd2luZG93Lk1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoIXRoaXMuX2lzTmVidWxhRXZlbnQoZXZlbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZWRvd24nKSB7XG4gICAgICB0aGlzLl9tb3VzZVdhc0Rvd24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIG9mZnNldFgvWSBvZiB0aGUgTW91c2VFdmVudCBwcm92aWRlcyB0aGUgb2Zmc2V0IGluIHRoZSBYL1kgY29vcmRpbmF0ZVxuICAgIC8vIG9mIHRoZSBtb3VzZSBwb2ludGVyIGJldHdlZW4gdGhhdCBldmVudCBhbmQgdGhlIHBhZGRpbmcgZWRnZSBvZiB0aGUgdGFyZ2V0IG5vZGUuXG4gICAgLy8gV2Ugc2V0IG91ciBsaXN0ZW5lciB0byBkb2N1bWVudCBzbyB3ZSBuZWVkIHRvIGFkanVzdCBvZmZzZXRYL1lcbiAgICAvLyBpbiBjYXNlIHRoZSB0YXJnZXQgaXMgbm90IGJlIG91ciBXZWJHTCBjYW52YXMuXG4gICAgY29uc3QgeyB0b3AgPSAwLCBsZWZ0ID0gMCB9ID0gdGhpcy5tYWluQ29udGFpbmVyXG4gICAgICA/IHRoaXMubWFpbkNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgOiB7fTtcbiAgICBjb25zdCBwcm94eUV2ZW50ID0gbmV3IFByb3h5KGV2ZW50LCB7XG4gICAgICBnZXQ6IChvcmlnaW5hbDogYW55LCBwcm9wZXJ0eU5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnb2Zmc2V0WCcpIHtcbiAgICAgICAgICByZXR1cm4gb3JpZ2luYWwucGFnZVggLSBsZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gJ29mZnNldFknKSB7XG4gICAgICAgICAgcmV0dXJuIG9yaWdpbmFsLnBhZ2VZIC0gdG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogUHJvcGVybHkgdXNlIHBvaW50ZXIgZXZlbnRzXG4gICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICd0eXBlJykge1xuICAgICAgICAgIHJldHVybiBvcmlnaW5hbC50eXBlLnJlcGxhY2UoJ3BvaW50ZXInLCAnbW91c2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IG9yaWdpbmFsW3Byb3BlcnR5TmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5iaW5kKG9yaWdpbmFsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuX2hhbmRsZURlY2tHTEV2ZW50KHByb3h5RXZlbnQpO1xuICB9O1xuXG4gIGdldE1vdXNlR3JvdW5kUG9zaXRpb24oZXZlbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICByZXR1cm4gdGhpcy53bVZpZXdwb3J0LnVucHJvamVjdChbZXZlbnQub2Zmc2V0WCwgZXZlbnQub2Zmc2V0WV0pO1xuICB9XG5cbiAgdW5wcm9qZWN0TW91c2VQb3NpdGlvbihtb3VzZVBvc2l0aW9uOiBbbnVtYmVyLCBudW1iZXJdKTogW251bWJlciwgbnVtYmVyXSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiB0aGlzLndtVmlld3BvcnQudW5wcm9qZWN0KG1vdXNlUG9zaXRpb24pO1xuICB9XG5cbiAgX2hhbmRsZURlY2tHTEV2ZW50KGV2ZW50OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgY29uc3Qge1xuICAgICAgZGVja2dsLFxuICAgICAgcHJvcHM6IHsgb25NYXBNb3VzZUV2ZW50LCBzZWxlY3Rpb25UeXBlLCBldmVudEZpbHRlciB9LFxuICAgIH0gPSB0aGlzO1xuICAgIGxldCBzZW5kTWFwRXZlbnQgPSB0cnVlO1xuICAgIGxldCBjdXJzb3IgPSAnYXV0byc7XG5cbiAgICBpZiAoZXZlbnQgJiYgZGVja2dsICYmIHNlbGVjdGlvblR5cGUpIHtcbiAgICAgIGlmICghdGhpcy5fZGVja0RyYXdlcikgdGhpcy5fZGVja0RyYXdlciA9IG5ldyBEZWNrRHJhd2VyKHRoaXMpO1xuXG4gICAgICBjb25zdCBsbmdMYXQgPSB0aGlzLmdldE1vdXNlR3JvdW5kUG9zaXRpb24oZXZlbnQpO1xuICAgICAgaWYgKGV2ZW50RmlsdGVyICYmICFldmVudEZpbHRlcihsbmdMYXQsIGV2ZW50KSkgcmV0dXJuO1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgZHJhd2VyUmVzdWx0ID0gdGhpcy5fZGVja0RyYXdlci5oYW5kbGVFdmVudChldmVudCwgbG5nTGF0LCBzZWxlY3Rpb25UeXBlKTtcbiAgICAgIGlmIChkcmF3ZXJSZXN1bHQucmVkcmF3KSB0aGlzLmZvcmNlVXBkYXRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50ICYmIGRlY2tnbCAmJiAoIWV2ZW50LmJ1dHRvbnMgfHwgZXZlbnQudHlwZSAhPT0gJ21vdXNlbW92ZScpKSB7XG4gICAgICAvLyBUT0RPOiBzb3J0IGJ5IG1vdXNlIHByaW9yaXR5XG4gICAgICBjb25zdCBsYXllcklkcyA9IGRlY2tnbC5wcm9wcy5sYXllcnNcbiAgICAgICAgLmZpbHRlcihcbiAgICAgICAgICAobDogYW55KSA9PiBsICYmIGwucHJvcHMgJiYgbC5wcm9wcy5uZWJ1bGFMYXllciAmJiBsLnByb3BzLm5lYnVsYUxheWVyLmVuYWJsZVBpY2tpbmdcbiAgICAgICAgKVxuICAgICAgICAubWFwKChsOiBhbnkpID0+IGwuaWQpO1xuXG4gICAgICBjb25zdCBwaWNraW5nSW5mbyA9IGRlY2tnbC5waWNrT2JqZWN0KHtcbiAgICAgICAgeDogZXZlbnQub2Zmc2V0WCxcbiAgICAgICAgeTogZXZlbnQub2Zmc2V0WSxcbiAgICAgICAgcmFkaXVzOiA1LFxuICAgICAgICBsYXllcklkcyxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5xdWVyeU9iamVjdEV2ZW50cy5lbWl0KCdwaWNrJywgeyBldmVudCwgcGlja2luZ0luZm8gfSk7XG4gICAgICBpZiAocGlja2luZ0luZm8pIHtcbiAgICAgICAgc2VuZE1hcEV2ZW50ID0gZmFsc2U7XG5cbiAgICAgICAgY29uc3QgeyBpbmRleCwgbG5nTGF0IH0gPSBwaWNraW5nSW5mbztcbiAgICAgICAgaWYgKGV2ZW50RmlsdGVyICYmICFldmVudEZpbHRlcihsbmdMYXQsIGV2ZW50KSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IHsgbGF5ZXI6IGRlY2tMYXllciwgb2JqZWN0IH0gPSBwaWNraW5nSW5mbztcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgZGVja0xheWVyICYmXG4gICAgICAgICAgZGVja0xheWVyLnByb3BzICYmXG4gICAgICAgICAgZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyICYmXG4gICAgICAgICAgZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyLmV2ZW50SGFuZGxlclxuICAgICAgICApIHtcbiAgICAgICAgICBkZWNrTGF5ZXIucHJvcHMubmVidWxhTGF5ZXIuZXZlbnRIYW5kbGVyKGV2ZW50LCBwaWNraW5nSW5mbyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcmlnaW5hbCA9XG4gICAgICAgICAgb2JqZWN0Lm9yaWdpbmFsIHx8XG4gICAgICAgICAgKGRlY2tMYXllci5wcm9wcy5uZWJ1bGFMYXllciAmJlxuICAgICAgICAgICAgZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyLmRlY2tDYWNoZSAmJlxuICAgICAgICAgICAgZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyLmRlY2tDYWNoZS5vcmlnaW5hbHNbaW5kZXhdKTtcblxuICAgICAgICBpZiAob3JpZ2luYWwpIHtcbiAgICAgICAgICB0aGlzLmRlY2tnbE1vdXNlT3ZlckluZm8gPSB7IG9yaWdpbmFsTGF5ZXI6IGRlY2tMYXllci5wcm9wcy5uZWJ1bGFMYXllciwgaW5kZXggfTtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgY29uc3QgbmVidWxhTW91c2VFdmVudCA9IG5ldyBMYXllck1vdXNlRXZlbnQoZXZlbnQsIHtcbiAgICAgICAgICAgIGRhdGE6IG9yaWdpbmFsLFxuICAgICAgICAgICAgbWV0YWRhdGE6IG9iamVjdC5tZXRhZGF0YSxcbiAgICAgICAgICAgIGdyb3VuZFBvaW50OiBsbmdMYXQsXG4gICAgICAgICAgICBuZWJ1bGE6IHRoaXMsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZGVja0xheWVyLnByb3BzLm5lYnVsYUxheWVyLmVtaXQoZXZlbnQudHlwZSwgbmVidWxhTW91c2VFdmVudCk7XG4gICAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY3Vyc29yID0gJ3BvaW50ZXInO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5jdXJzb3IgPSBjdXJzb3I7XG4gICAgfVxuXG4gICAgaWYgKHNlbmRNYXBFdmVudCkge1xuICAgICAgdGhpcy5kZWNrZ2xNb3VzZU92ZXJJbmZvID0gbnVsbDtcblxuICAgICAgY29uc3QgbG5nTGF0ID0gdGhpcy5nZXRNb3VzZUdyb3VuZFBvc2l0aW9uKGV2ZW50KTtcbiAgICAgIGlmIChldmVudEZpbHRlciAmJiAhZXZlbnRGaWx0ZXIobG5nTGF0LCBldmVudCkpIHJldHVybjtcblxuICAgICAgLy8gc2VuZCB0byBsYXllcnMgZmlyc3RcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IG5lYnVsYU1vdXNlRXZlbnQgPSBuZXcgTGF5ZXJNb3VzZUV2ZW50KGV2ZW50LCB7XG4gICAgICAgIGdyb3VuZFBvaW50OiBsbmdMYXQsXG4gICAgICAgIG5lYnVsYTogdGhpcyxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5nZXRBbGxMYXllcnMoKVxuICAgICAgICAuZmlsdGVyKChsYXllcikgPT4gbGF5ZXIgJiYgbGF5ZXIudXNlc01hcEV2ZW50cylcbiAgICAgICAgLmZvckVhY2goKGxheWVyKSA9PiBsYXllci5lbWl0KCdtYXBNb3VzZUV2ZW50JywgbmVidWxhTW91c2VFdmVudCkpO1xuXG4gICAgICB0aGlzLmdldEFsbExheWVycygpXG4gICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgKGxheWVyKSA9PlxuICAgICAgICAgICAgbGF5ZXIgJiYgbGF5ZXIucHJvcHMgJiYgbGF5ZXIucHJvcHMubmVidWxhTGF5ZXIgJiYgbGF5ZXIucHJvcHMubmVidWxhTGF5ZXIubWFwTW91c2VFdmVudFxuICAgICAgICApXG4gICAgICAgIC5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIucHJvcHMubmVidWxhTGF5ZXIubWFwTW91c2VFdmVudChuZWJ1bGFNb3VzZUV2ZW50LCBsYXllcikpO1xuXG4gICAgICBpZiAob25NYXBNb3VzZUV2ZW50KSB7XG4gICAgICAgIG9uTWFwTW91c2VFdmVudChldmVudCwgbG5nTGF0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRFeHRyYURlY2tMYXllcnMoKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgIGlmICh0aGlzLl9kZWNrRHJhd2VyKSByZXN1bHQucHVzaCguLi50aGlzLl9kZWNrRHJhd2VyLnJlbmRlcigpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZW5kZXJEZWNrTGF5ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFsbExheWVycygpXG4gICAgICAubWFwKChsYXllcikgPT4gKGxheWVyIGluc3RhbmNlb2YgTmVidWxhTGF5ZXIgPyBsYXllci5yZW5kZXIoeyBuZWJ1bGE6IHRoaXMgfSkgOiBsYXllcikpXG4gICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuICB9XG5cbiAgZ2V0QWxsTGF5ZXJzKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gICAgdGhpcy5wcm9wcy5sYXllcnMuZmlsdGVyKEJvb2xlYW4pLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICByZXN1bHQucHVzaChsYXllcik7XG4gICAgICAvLyBPbmx5IE5lYnVsYUxheWVycyBoYXZlIGhlbHBlcnMsIERlY2sgR0wgbGF5ZXJzIGRvbid0LlxuICAgICAgaWYgKGxheWVyIGluc3RhbmNlb2YgTmVidWxhTGF5ZXIpIHtcbiAgICAgICAgcmVzdWx0LnB1c2goLi4ubGF5ZXIuaGVscGVyTGF5ZXJzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQuZmlsdGVyKEJvb2xlYW4pO1xuICB9XG5cbiAgZ2V0UmVuZGVyZWRMYXllcnMoKSB7XG4gICAgcmV0dXJuIFsuLi50aGlzLnJlbmRlckRlY2tMYXllcnMoKSwgLi4udGhpcy5nZXRFeHRyYURlY2tMYXllcnMoKV07XG4gIH1cblxuICB1cGRhdGVBbmRHZXRSZW5kZXJlZExheWVycyhcbiAgICBsYXllcnM6IFJlY29yZDxzdHJpbmcsIGFueT5bXSxcbiAgICB2aWV3cG9ydDogV2ViTWVyY2F0b3JWaWV3cG9ydCxcbiAgICBjb250YWluZXI6IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgKSB7XG4gICAgaWYgKHRoaXMuaW5pdGVkKSB7XG4gICAgICB0aGlzLnVwZGF0ZVByb3BzKHsgbGF5ZXJzLCB2aWV3cG9ydCB9KTtcbiAgICAgIHRoaXMuZm9yY2VVcGRhdGUgPSAoKSA9PiBjb250YWluZXIuZm9yY2VVcGRhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5pbml0KHsgbGF5ZXJzLCB2aWV3cG9ydCB9KTtcbiAgICAgIHRoaXMuZm9yY2VVcGRhdGUgPSAoKSA9PiBjb250YWluZXIuZm9yY2VVcGRhdGUoKTtcbiAgICAgIHRoaXMudXBkYXRlQWxsRGVja09iamVjdHMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZW5kZXJlZExheWVycygpO1xuICB9XG5cbiAgc2V0RGVjayhkZWNrZ2w6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsKSB7XG4gICAgaWYgKGRlY2tnbCkge1xuICAgICAgdGhpcy5kZWNrZ2wgPSBkZWNrZ2w7XG4gICAgfVxuICB9XG5cbiAgc2V0TWFpbkNvbnRhaW5lcihtYWluQ29udGFpbmVyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCkge1xuICAgIGlmIChtYWluQ29udGFpbmVyKSB7XG4gICAgICB0aGlzLm1haW5Db250YWluZXIgPSBtYWluQ29udGFpbmVyO1xuICAgIH1cbiAgfVxufVxuIl19