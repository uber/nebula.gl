"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layers = require("@nebula.gl/layers");

var _constants = require("@luma.gl/constants");

var _style = require("../style");

var _nebulaLayer = _interopRequireDefault(require("../nebula-layer"));

var _utils = require("../utils");

var _deckCache = _interopRequireDefault(require("../deck-renderer/deck-cache"));

var _NEBULA_TO_DECK_DIREC;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var NEBULA_TO_DECK_DIRECTIONS = (_NEBULA_TO_DECK_DIREC = {}, _defineProperty(_NEBULA_TO_DECK_DIREC, _style.ArrowStyles.NONE, {
  forward: false,
  backward: false
}), _defineProperty(_NEBULA_TO_DECK_DIREC, _style.ArrowStyles.FORWARD, {
  forward: true,
  backward: false
}), _defineProperty(_NEBULA_TO_DECK_DIREC, _style.ArrowStyles.BACKWARD, {
  forward: false,
  backward: true
}), _defineProperty(_NEBULA_TO_DECK_DIREC, _style.ArrowStyles.BOTH, {
  forward: true,
  backward: true
}), _NEBULA_TO_DECK_DIREC);

var SegmentsLayer = /*#__PURE__*/function (_NebulaLayer) {
  _inherits(SegmentsLayer, _NebulaLayer);

  var _super = _createSuper(SegmentsLayer);

  function SegmentsLayer(config) {
    var _this;

    _classCallCheck(this, SegmentsLayer);

    _this = _super.call(this, config);

    _defineProperty(_assertThisInitialized(_this), "deckCache", void 0);

    _defineProperty(_assertThisInitialized(_this), "noBlend", void 0);

    _defineProperty(_assertThisInitialized(_this), "highlightColor", void 0);

    _defineProperty(_assertThisInitialized(_this), "arrowSize", void 0);

    _defineProperty(_assertThisInitialized(_this), "rounded", void 0);

    _defineProperty(_assertThisInitialized(_this), "dashed", void 0);

    _defineProperty(_assertThisInitialized(_this), "markerLayerProps", void 0);

    _this.deckCache = new _deckCache["default"](config.getData, function (data) {
      return config.toNebulaFeature(data);
    });
    _this.enableSelection = true;
    var _config$enablePicking = config.enablePicking,
        enablePicking = _config$enablePicking === void 0 ? true : _config$enablePicking,
        _config$noBlend = config.noBlend,
        noBlend = _config$noBlend === void 0 ? false : _config$noBlend,
        _config$rounded = config.rounded,
        rounded = _config$rounded === void 0 ? true : _config$rounded,
        _config$dashed = config.dashed,
        dashed = _config$dashed === void 0 ? false : _config$dashed,
        _config$markerLayerPr = config.markerLayerProps,
        markerLayerProps = _config$markerLayerPr === void 0 ? null : _config$markerLayerPr;
    Object.assign(_assertThisInitialized(_this), {
      enablePicking: enablePicking,
      noBlend: noBlend,
      rounded: rounded,
      dashed: dashed,
      markerLayerProps: markerLayerProps
    });
    return _this;
  }

  _createClass(SegmentsLayer, [{
    key: "getMouseOverSegment",
    value: function getMouseOverSegment() {
      // TODO: remove references
      return null;
    }
  }, {
    key: "_calcMarkerPercentages",
    value: function _calcMarkerPercentages(nf) {
      var arrowPercentages = nf.style.arrowPercentages;

      if (arrowPercentages) {
        return arrowPercentages;
      }

      var arrowStyle = nf.style.arrowStyle || _style.DEFAULT_STYLE.arrowStyle;
      if (arrowStyle === _style.ArrowStyles.NONE) return [];
      var arrowCount = Math.min(nf.style.arrowCount || _style.DEFAULT_STYLE.arrowCount, _style.MAX_ARROWS);
      return [[0.5], [0.33, 0.66], [0.25, 0.5, 0.75]][arrowCount - 1];
    }
  }, {
    key: "_getHighlightedObjectIndex",
    value: function _getHighlightedObjectIndex(_ref) {
      var nebula = _ref.nebula;
      var deckglMouseOverInfo = nebula.deckglMouseOverInfo;

      if (deckglMouseOverInfo) {
        var originalLayer = deckglMouseOverInfo.originalLayer,
            index = deckglMouseOverInfo.index;

        if (originalLayer === this) {
          return index;
        }
      } // no object


      return -1;
    }
  }, {
    key: "render",
    value: function render(_ref2) {
      var nebula = _ref2.nebula;
      var defaultColor = [0x0, 0x0, 0x0, 0xff];
      var _this$deckCache = this.deckCache,
          objects = _this$deckCache.objects,
          updateTrigger = _this$deckCache.updateTrigger;
      return new _layers.PathMarkerLayer({
        id: "segments-".concat(this.id),
        data: objects,
        opacity: 1,
        // @ts-ignore
        fp64: false,
        rounded: this.rounded,
        pickable: true,
        sizeScale: this.arrowSize || 6,
        parameters: {
          depthTest: false,
          blend: !this.noBlend,
          blendEquation: _constants.GL.MAX
        },
        getPath: function getPath(nf) {
          return nf.geoJson.geometry.coordinates;
        },
        // @ts-ignore
        getColor: function getColor(nf) {
          return (0, _utils.toDeckColor)(nf.style.lineColor, defaultColor);
        },
        getWidth: function getWidth(nf) {
          return nf.style.lineWidthMeters || 1;
        },
        getZLevel: function getZLevel(nf) {
          return nf.style.zLevel * 255;
        },
        getDirection: function getDirection(nf) {
          return NEBULA_TO_DECK_DIRECTIONS[nf.style.arrowStyle];
        },
        // @ts-ignore
        getMarkerColor: function getMarkerColor(nf) {
          return (0, _utils.toDeckColor)(nf.style.arrowColor, defaultColor);
        },
        getMarkerPercentages: this._calcMarkerPercentages,
        updateTriggers: {
          all: updateTrigger
        },
        highlightedObjectIndex: this._getHighlightedObjectIndex({
          nebula: nebula
        }),
        highlightColor: (0, _utils.toDeckColor)(this.highlightColor),
        dashJustified: this.dashed,
        getDashArray: this.dashed ? function (nf) {
          return nf.style.dashArray;
        } : null,
        markerLayerProps: this.markerLayerProps || _layers.PathMarkerLayer.defaultProps.markerLayerProps,
        nebulaLayer: this
      });
    }
  }]);

  return SegmentsLayer;
}(_nebulaLayer["default"]);

exports["default"] = SegmentsLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGF5ZXJzL3NlZ21lbnRzLWxheWVyLnRzIl0sIm5hbWVzIjpbIk5FQlVMQV9UT19ERUNLX0RJUkVDVElPTlMiLCJBcnJvd1N0eWxlcyIsIk5PTkUiLCJmb3J3YXJkIiwiYmFja3dhcmQiLCJGT1JXQVJEIiwiQkFDS1dBUkQiLCJCT1RIIiwiU2VnbWVudHNMYXllciIsImNvbmZpZyIsImRlY2tDYWNoZSIsIkRlY2tDYWNoZSIsImdldERhdGEiLCJkYXRhIiwidG9OZWJ1bGFGZWF0dXJlIiwiZW5hYmxlU2VsZWN0aW9uIiwiZW5hYmxlUGlja2luZyIsIm5vQmxlbmQiLCJyb3VuZGVkIiwiZGFzaGVkIiwibWFya2VyTGF5ZXJQcm9wcyIsIk9iamVjdCIsImFzc2lnbiIsIm5mIiwiYXJyb3dQZXJjZW50YWdlcyIsInN0eWxlIiwiYXJyb3dTdHlsZSIsIkRFRkFVTFRfU1RZTEUiLCJhcnJvd0NvdW50IiwiTWF0aCIsIm1pbiIsIk1BWF9BUlJPV1MiLCJuZWJ1bGEiLCJkZWNrZ2xNb3VzZU92ZXJJbmZvIiwib3JpZ2luYWxMYXllciIsImluZGV4IiwiZGVmYXVsdENvbG9yIiwib2JqZWN0cyIsInVwZGF0ZVRyaWdnZXIiLCJQYXRoTWFya2VyTGF5ZXIiLCJpZCIsIm9wYWNpdHkiLCJmcDY0IiwicGlja2FibGUiLCJzaXplU2NhbGUiLCJhcnJvd1NpemUiLCJwYXJhbWV0ZXJzIiwiZGVwdGhUZXN0IiwiYmxlbmQiLCJibGVuZEVxdWF0aW9uIiwiR0wiLCJNQVgiLCJnZXRQYXRoIiwiZ2VvSnNvbiIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJnZXRDb2xvciIsImxpbmVDb2xvciIsImdldFdpZHRoIiwibGluZVdpZHRoTWV0ZXJzIiwiZ2V0WkxldmVsIiwiekxldmVsIiwiZ2V0RGlyZWN0aW9uIiwiZ2V0TWFya2VyQ29sb3IiLCJhcnJvd0NvbG9yIiwiZ2V0TWFya2VyUGVyY2VudGFnZXMiLCJfY2FsY01hcmtlclBlcmNlbnRhZ2VzIiwidXBkYXRlVHJpZ2dlcnMiLCJhbGwiLCJoaWdobGlnaHRlZE9iamVjdEluZGV4IiwiX2dldEhpZ2hsaWdodGVkT2JqZWN0SW5kZXgiLCJoaWdobGlnaHRDb2xvciIsImRhc2hKdXN0aWZpZWQiLCJnZXREYXNoQXJyYXkiLCJkYXNoQXJyYXkiLCJkZWZhdWx0UHJvcHMiLCJuZWJ1bGFMYXllciIsIk5lYnVsYUxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLHlCQUF5Qix1RUFDNUJDLG1CQUFZQyxJQURnQixFQUNUO0FBQUVDLEVBQUFBLE9BQU8sRUFBRSxLQUFYO0FBQWtCQyxFQUFBQSxRQUFRLEVBQUU7QUFBNUIsQ0FEUywwQ0FFNUJILG1CQUFZSSxPQUZnQixFQUVOO0FBQUVGLEVBQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCQyxFQUFBQSxRQUFRLEVBQUU7QUFBM0IsQ0FGTSwwQ0FHNUJILG1CQUFZSyxRQUhnQixFQUdMO0FBQUVILEVBQUFBLE9BQU8sRUFBRSxLQUFYO0FBQWtCQyxFQUFBQSxRQUFRLEVBQUU7QUFBNUIsQ0FISywwQ0FJNUJILG1CQUFZTSxJQUpnQixFQUlUO0FBQUVKLEVBQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCQyxFQUFBQSxRQUFRLEVBQUU7QUFBM0IsQ0FKUyx5QkFBL0I7O0lBT3FCSSxhOzs7OztBQVNuQix5QkFBWUMsTUFBWixFQUF5QztBQUFBOztBQUFBOztBQUN2Qyw4QkFBTUEsTUFBTjs7QUFEdUM7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBRXZDLFVBQUtDLFNBQUwsR0FBaUIsSUFBSUMscUJBQUosQ0FBY0YsTUFBTSxDQUFDRyxPQUFyQixFQUE4QixVQUFDQyxJQUFEO0FBQUEsYUFBVUosTUFBTSxDQUFDSyxlQUFQLENBQXVCRCxJQUF2QixDQUFWO0FBQUEsS0FBOUIsQ0FBakI7QUFDQSxVQUFLRSxl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UCxTQXZCUztBQXlCekIrQixRQUFBQSxzQkFBc0IsRUFBRSxLQUFLQywwQkFBTCxDQUFnQztBQUFFdEMsVUFBQUEsTUFBTSxFQUFOQTtBQUFGLFNBQWhDLENBekJDO0FBMEJ6QnVDLFFBQUFBLGNBQWMsRUFBRSx3QkFBWSxLQUFLQSxjQUFqQixDQTFCUztBQTRCekJDLFFBQUFBLGFBQWEsRUFBRSxLQUFLckQsTUE1Qks7QUE2QnpCc0QsUUFBQUEsWUFBWSxFQUFFLEtBQUt0RCxNQUFMLEdBQWMsVUFBQ0ksRUFBRDtBQUFBLGlCQUFRQSxFQUFFLENBQUNFLEtBQUgsQ0FBU2lELFNBQWpCO0FBQUEsU0FBZCxHQUEyQyxJQTdCaEM7QUE4QnpCdEQsUUFBQUEsZ0JBQWdCLEVBQ2QsS0FBS0EsZ0JBQUwsSUFDQ21CLHVCQUFELENBQXlDb0MsWUFBekMsQ0FBc0R2RCxnQkFoQy9CO0FBa0N6QndELFFBQUFBLFdBQVcsRUFBRTtBQWxDWSxPQUFwQixDQUFQO0FBb0NEOzs7O0VBOUZ3Q0MsdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYXRoTWFya2VyTGF5ZXIgfSBmcm9tICdAbmVidWxhLmdsL2xheWVycyc7XG5pbXBvcnQgeyBHTCB9IGZyb20gJ0BsdW1hLmdsL2NvbnN0YW50cyc7XG5cbmltcG9ydCB7IEFycm93U3R5bGVzLCBERUZBVUxUX1NUWUxFLCBNQVhfQVJST1dTIH0gZnJvbSAnLi4vc3R5bGUnO1xuaW1wb3J0IE5lYnVsYUxheWVyIGZyb20gJy4uL25lYnVsYS1sYXllcic7XG5pbXBvcnQgeyB0b0RlY2tDb2xvciB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBEZWNrQ2FjaGUgZnJvbSAnLi4vZGVjay1yZW5kZXJlci9kZWNrLWNhY2hlJztcblxuY29uc3QgTkVCVUxBX1RPX0RFQ0tfRElSRUNUSU9OUyA9IHtcbiAgW0Fycm93U3R5bGVzLk5PTkVdOiB7IGZvcndhcmQ6IGZhbHNlLCBiYWNrd2FyZDogZmFsc2UgfSxcbiAgW0Fycm93U3R5bGVzLkZPUldBUkRdOiB7IGZvcndhcmQ6IHRydWUsIGJhY2t3YXJkOiBmYWxzZSB9LFxuICBbQXJyb3dTdHlsZXMuQkFDS1dBUkRdOiB7IGZvcndhcmQ6IGZhbHNlLCBiYWNrd2FyZDogdHJ1ZSB9LFxuICBbQXJyb3dTdHlsZXMuQk9USF06IHsgZm9yd2FyZDogdHJ1ZSwgYmFja3dhcmQ6IHRydWUgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlZ21lbnRzTGF5ZXIgZXh0ZW5kcyBOZWJ1bGFMYXllciB7XG4gIGRlY2tDYWNoZTogRGVja0NhY2hlPGFueSwgYW55PjtcbiAgbm9CbGVuZDogYm9vbGVhbjtcbiAgaGlnaGxpZ2h0Q29sb3I6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuICBhcnJvd1NpemU6IG51bWJlcjtcbiAgcm91bmRlZDogYm9vbGVhbjtcbiAgZGFzaGVkOiBib29sZWFuO1xuICBtYXJrZXJMYXllclByb3BzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICBzdXBlcihjb25maWcpO1xuICAgIHRoaXMuZGVja0NhY2hlID0gbmV3IERlY2tDYWNoZShjb25maWcuZ2V0RGF0YSwgKGRhdGEpID0+IGNvbmZpZy50b05lYnVsYUZlYXR1cmUoZGF0YSkpO1xuICAgIHRoaXMuZW5hYmxlU2VsZWN0aW9uID0gdHJ1ZTtcbiAgICBjb25zdCB7XG4gICAgICBlbmFibGVQaWNraW5nID0gdHJ1ZSxcbiAgICAgIG5vQmxlbmQgPSBmYWxzZSxcbiAgICAgIHJvdW5kZWQgPSB0cnVlLFxuICAgICAgZGFzaGVkID0gZmFsc2UsXG4gICAgICBtYXJrZXJMYXllclByb3BzID0gbnVsbCxcbiAgICB9ID0gY29uZmlnO1xuICAgIE9iamVjdC5hc3NpZ24odGhpcywgeyBlbmFibGVQaWNraW5nLCBub0JsZW5kLCByb3VuZGVkLCBkYXNoZWQsIG1hcmtlckxheWVyUHJvcHMgfSk7XG4gIH1cblxuICBnZXRNb3VzZU92ZXJTZWdtZW50KCk6IGFueSB7XG4gICAgLy8gVE9ETzogcmVtb3ZlIHJlZmVyZW5jZXNcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIF9jYWxjTWFya2VyUGVyY2VudGFnZXMobmY6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBudW1iZXJbXSB7XG4gICAgY29uc3QgeyBhcnJvd1BlcmNlbnRhZ2VzIH0gPSBuZi5zdHlsZTtcbiAgICBpZiAoYXJyb3dQZXJjZW50YWdlcykge1xuICAgICAgcmV0dXJuIGFycm93UGVyY2VudGFnZXM7XG4gICAgfVxuXG4gICAgY29uc3QgYXJyb3dTdHlsZSA9IG5mLnN0eWxlLmFycm93U3R5bGUgfHwgREVGQVVMVF9TVFlMRS5hcnJvd1N0eWxlO1xuICAgIGlmIChhcnJvd1N0eWxlID09PSBBcnJvd1N0eWxlcy5OT05FKSByZXR1cm4gW107XG5cbiAgICBjb25zdCBhcnJvd0NvdW50ID0gTWF0aC5taW4obmYuc3R5bGUuYXJyb3dDb3VudCB8fCBERUZBVUxUX1NUWUxFLmFycm93Q291bnQsIE1BWF9BUlJPV1MpO1xuICAgIHJldHVybiBbWzAuNV0sIFswLjMzLCAwLjY2XSwgWzAuMjUsIDAuNSwgMC43NV1dW2Fycm93Q291bnQgLSAxXTtcbiAgfVxuXG4gIF9nZXRIaWdobGlnaHRlZE9iamVjdEluZGV4KHsgbmVidWxhIH06IFJlY29yZDxzdHJpbmcsIGFueT4pOiBudW1iZXIge1xuICAgIGNvbnN0IHsgZGVja2dsTW91c2VPdmVySW5mbyB9ID0gbmVidWxhO1xuICAgIGlmIChkZWNrZ2xNb3VzZU92ZXJJbmZvKSB7XG4gICAgICBjb25zdCB7IG9yaWdpbmFsTGF5ZXIsIGluZGV4IH0gPSBkZWNrZ2xNb3VzZU92ZXJJbmZvO1xuICAgICAgaWYgKG9yaWdpbmFsTGF5ZXIgPT09IHRoaXMpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIG5vIG9iamVjdFxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIHJlbmRlcih7IG5lYnVsYSB9OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgY29uc3QgZGVmYXVsdENvbG9yID0gWzB4MCwgMHgwLCAweDAsIDB4ZmZdO1xuICAgIGNvbnN0IHsgb2JqZWN0cywgdXBkYXRlVHJpZ2dlciB9ID0gdGhpcy5kZWNrQ2FjaGU7XG5cbiAgICByZXR1cm4gbmV3IFBhdGhNYXJrZXJMYXllcih7XG4gICAgICBpZDogYHNlZ21lbnRzLSR7dGhpcy5pZH1gLFxuICAgICAgZGF0YTogb2JqZWN0cyxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBmcDY0OiBmYWxzZSxcbiAgICAgIHJvdW5kZWQ6IHRoaXMucm91bmRlZCxcbiAgICAgIHBpY2thYmxlOiB0cnVlLFxuICAgICAgc2l6ZVNjYWxlOiB0aGlzLmFycm93U2l6ZSB8fCA2LFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBkZXB0aFRlc3Q6IGZhbHNlLFxuICAgICAgICBibGVuZDogIXRoaXMubm9CbGVuZCxcbiAgICAgICAgYmxlbmRFcXVhdGlvbjogR0wuTUFYLFxuICAgICAgfSxcbiAgICAgIGdldFBhdGg6IChuZjogYW55KSA9PiBuZi5nZW9Kc29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZ2V0Q29sb3I6IChuZjogYW55KSA9PiB0b0RlY2tDb2xvcihuZi5zdHlsZS5saW5lQ29sb3IsIGRlZmF1bHRDb2xvciksXG4gICAgICBnZXRXaWR0aDogKG5mOiBhbnkpID0+IG5mLnN0eWxlLmxpbmVXaWR0aE1ldGVycyB8fCAxLFxuICAgICAgZ2V0WkxldmVsOiAobmY6IGFueSkgPT4gbmYuc3R5bGUuekxldmVsICogMjU1LFxuICAgICAgZ2V0RGlyZWN0aW9uOiAobmY6IGFueSkgPT4gTkVCVUxBX1RPX0RFQ0tfRElSRUNUSU9OU1tuZi5zdHlsZS5hcnJvd1N0eWxlXSxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGdldE1hcmtlckNvbG9yOiAobmY6IGFueSkgPT4gdG9EZWNrQ29sb3IobmYuc3R5bGUuYXJyb3dDb2xvciwgZGVmYXVsdENvbG9yKSxcbiAgICAgIGdldE1hcmtlclBlcmNlbnRhZ2VzOiB0aGlzLl9jYWxjTWFya2VyUGVyY2VudGFnZXMsXG4gICAgICB1cGRhdGVUcmlnZ2VyczogeyBhbGw6IHVwZGF0ZVRyaWdnZXIgfSxcblxuICAgICAgaGlnaGxpZ2h0ZWRPYmplY3RJbmRleDogdGhpcy5fZ2V0SGlnaGxpZ2h0ZWRPYmplY3RJbmRleCh7IG5lYnVsYSB9KSxcbiAgICAgIGhpZ2hsaWdodENvbG9yOiB0b0RlY2tDb2xvcih0aGlzLmhpZ2hsaWdodENvbG9yKSxcblxuICAgICAgZGFzaEp1c3RpZmllZDogdGhpcy5kYXNoZWQsXG4gICAgICBnZXREYXNoQXJyYXk6IHRoaXMuZGFzaGVkID8gKG5mKSA9PiBuZi5zdHlsZS5kYXNoQXJyYXkgOiBudWxsLFxuICAgICAgbWFya2VyTGF5ZXJQcm9wczpcbiAgICAgICAgdGhpcy5tYXJrZXJMYXllclByb3BzIHx8XG4gICAgICAgIChQYXRoTWFya2VyTGF5ZXIgYXMgUmVjb3JkPHN0cmluZywgYW55PikuZGVmYXVsdFByb3BzLm1hcmtlckxheWVyUHJvcHMsXG5cbiAgICAgIG5lYnVsYUxheWVyOiB0aGlzLFxuICAgIH0pO1xuICB9XG59XG4iXX0=