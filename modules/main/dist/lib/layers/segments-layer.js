"use strict";

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

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
          blendEquation: _constants.MAX
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGF5ZXJzL3NlZ21lbnRzLWxheWVyLnRzIl0sIm5hbWVzIjpbIk5FQlVMQV9UT19ERUNLX0RJUkVDVElPTlMiLCJBcnJvd1N0eWxlcyIsIk5PTkUiLCJmb3J3YXJkIiwiYmFja3dhcmQiLCJGT1JXQVJEIiwiQkFDS1dBUkQiLCJCT1RIIiwiU2VnbWVudHNMYXllciIsImNvbmZpZyIsImRlY2tDYWNoZSIsIkRlY2tDYWNoZSIsImdldERhdGEiLCJkYXRhIiwidG9OZWJ1bGFGZWF0dXJlIiwiZW5hYmxlU2VsZWN0aW9uIiwiZW5hYmxlUGlja2luZyIsIm5vQmxlbmQiLCJyb3VuZGVkIiwiZGFzaGVkIiwibWFya2VyTGF5ZXJQcm9wcyIsIk9iamVjdCIsImFzc2lnbiIsIm5mIiwiYXJyb3dQZXJjZW50YWdlcyIsInN0eWxlIiwiYXJyb3dTdHlsZSIsIkRFRkFVTFRfU1RZTEUiLCJhcnJvd0NvdW50IiwiTWF0aCIsIm1pbiIsIk1BWF9BUlJPV1MiLCJuZWJ1bGEiLCJkZWNrZ2xNb3VzZU92ZXJJbmZvIiwib3JpZ2luYWxMYXllciIsImluZGV4IiwiZGVmYXVsdENvbG9yIiwib2JqZWN0cyIsInVwZGF0ZVRyaWdnZXIiLCJQYXRoTWFya2VyTGF5ZXIiLCJpZCIsIm9wYWNpdHkiLCJmcDY0IiwicGlja2FibGUiLCJzaXplU2NhbGUiLCJhcnJvd1NpemUiLCJwYXJhbWV0ZXJzIiwiZGVwdGhUZXN0IiwiYmxlbmQiLCJibGVuZEVxdWF0aW9uIiwiTUFYIiwiZ2V0UGF0aCIsImdlb0pzb24iLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZ2V0Q29sb3IiLCJsaW5lQ29sb3IiLCJnZXRXaWR0aCIsImxpbmVXaWR0aE1ldGVycyIsImdldFpMZXZlbCIsInpMZXZlbCIsImdldERpcmVjdGlvbiIsImdldE1hcmtlckNvbG9yIiwiYXJyb3dDb2xvciIsImdldE1hcmtlclBlcmNlbnRhZ2VzIiwiX2NhbGNNYXJrZXJQZXJjZW50YWdlcyIsInVwZGF0ZVRyaWdnZXJzIiwiYWxsIiwiaGlnaGxpZ2h0ZWRPYmplY3RJbmRleCIsIl9nZXRIaWdobGlnaHRlZE9iamVjdEluZGV4IiwiaGlnaGxpZ2h0Q29sb3IiLCJkYXNoSnVzdGlmaWVkIiwiZ2V0RGFzaEFycmF5IiwiZGFzaEFycmF5IiwiZGVmYXVsdFByb3BzIiwibmVidWxhTGF5ZXIiLCJOZWJ1bGFMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSx5QkFBeUIsdUVBQzVCQyxtQkFBWUMsSUFEZ0IsRUFDVDtBQUFFQyxFQUFBQSxPQUFPLEVBQUUsS0FBWDtBQUFrQkMsRUFBQUEsUUFBUSxFQUFFO0FBQTVCLENBRFMsMENBRTVCSCxtQkFBWUksT0FGZ0IsRUFFTjtBQUFFRixFQUFBQSxPQUFPLEVBQUUsSUFBWDtBQUFpQkMsRUFBQUEsUUFBUSxFQUFFO0FBQTNCLENBRk0sMENBRzVCSCxtQkFBWUssUUFIZ0IsRUFHTDtBQUFFSCxFQUFBQSxPQUFPLEVBQUUsS0FBWDtBQUFrQkMsRUFBQUEsUUFBUSxFQUFFO0FBQTVCLENBSEssMENBSTVCSCxtQkFBWU0sSUFKZ0IsRUFJVDtBQUFFSixFQUFBQSxPQUFPLEVBQUUsSUFBWDtBQUFpQkMsRUFBQUEsUUFBUSxFQUFFO0FBQTNCLENBSlMseUJBQS9COztJQU9xQkksYTs7Ozs7QUFTbkIseUJBQVlDLE1BQVosRUFBeUM7QUFBQTs7QUFBQTs7QUFDdkMsOEJBQU1BLE1BQU47O0FBRHVDOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUV2QyxVQUFLQyxTQUFMLEdBQWlCLElBQUlDLHFCQUFKLENBQWNGLE1BQU0sQ0FBQ0csT0FBckIsRUFBOEIsVUFBQ0MsSUFBRDtBQUFBLGFBQVVKLE1BQU0sQ0FBQ0ssZUFBUCxDQUF1QkQsSUFBdkIsQ0FBVjtBQUFBLEtBQTlCLENBQWpCO0FBQ0EsVUFBS0UsZUFBTCxH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QnpCOEIsUUFBQUEsc0JBQXNCLEVBQUUsS0FBS0MsMEJBQUwsQ0FBZ0M7QUFBRXJDLFVBQUFBLE1BQU0sRUFBTkE7QUFBRixTQUFoQyxDQXpCQztBQTBCekJzQyxRQUFBQSxjQUFjLEVBQUUsd0JBQVksS0FBS0EsY0FBakIsQ0ExQlM7QUE0QnpCQyxRQUFBQSxhQUFhLEVBQUUsS0FBS3BELE1BNUJLO0FBNkJ6QnFELFFBQUFBLFlBQVksRUFBRSxLQUFLckQsTUFBTCxHQUFjLFVBQUNJLEVBQUQ7QUFBQSxpQkFBUUEsRUFBRSxDQUFDRSxLQUFILENBQVNnRCxTQUFqQjtBQUFBLFNBQWQsR0FBMkMsSUE3QmhDO0FBOEJ6QnJELFFBQUFBLGdCQUFnQixFQUNkLEtBQUtBLGdCQUFMLElBQ0NtQix1QkFBRCxDQUF5Q21DLFlBQXpDLENBQXNEdEQsZ0JBaEMvQjtBQWtDekJ1RCxRQUFBQSxXQUFXLEVBQUU7QUFsQ1ksT0FBcEIsQ0FBUDtBQW9DRDs7OztFQTlGd0NDLHVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGF0aE1hcmtlckxheWVyIH0gZnJvbSAnQG5lYnVsYS5nbC9sYXllcnMnO1xuaW1wb3J0IHsgTUFYIH0gZnJvbSAnQGx1bWEuZ2wvY29uc3RhbnRzJztcblxuaW1wb3J0IHsgQXJyb3dTdHlsZXMsIERFRkFVTFRfU1RZTEUsIE1BWF9BUlJPV1MgfSBmcm9tICcuLi9zdHlsZSc7XG5pbXBvcnQgTmVidWxhTGF5ZXIgZnJvbSAnLi4vbmVidWxhLWxheWVyJztcbmltcG9ydCB7IHRvRGVja0NvbG9yIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IERlY2tDYWNoZSBmcm9tICcuLi9kZWNrLXJlbmRlcmVyL2RlY2stY2FjaGUnO1xuXG5jb25zdCBORUJVTEFfVE9fREVDS19ESVJFQ1RJT05TID0ge1xuICBbQXJyb3dTdHlsZXMuTk9ORV06IHsgZm9yd2FyZDogZmFsc2UsIGJhY2t3YXJkOiBmYWxzZSB9LFxuICBbQXJyb3dTdHlsZXMuRk9SV0FSRF06IHsgZm9yd2FyZDogdHJ1ZSwgYmFja3dhcmQ6IGZhbHNlIH0sXG4gIFtBcnJvd1N0eWxlcy5CQUNLV0FSRF06IHsgZm9yd2FyZDogZmFsc2UsIGJhY2t3YXJkOiB0cnVlIH0sXG4gIFtBcnJvd1N0eWxlcy5CT1RIXTogeyBmb3J3YXJkOiB0cnVlLCBiYWNrd2FyZDogdHJ1ZSB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudHNMYXllciBleHRlbmRzIE5lYnVsYUxheWVyIHtcbiAgZGVja0NhY2hlOiBEZWNrQ2FjaGU8YW55LCBhbnk+O1xuICBub0JsZW5kOiBib29sZWFuO1xuICBoaWdobGlnaHRDb2xvcjogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl07XG4gIGFycm93U2l6ZTogbnVtYmVyO1xuICByb3VuZGVkOiBib29sZWFuO1xuICBkYXNoZWQ6IGJvb2xlYW47XG4gIG1hcmtlckxheWVyUHJvcHM6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgdGhpcy5kZWNrQ2FjaGUgPSBuZXcgRGVja0NhY2hlKGNvbmZpZy5nZXREYXRhLCAoZGF0YSkgPT4gY29uZmlnLnRvTmVidWxhRmVhdHVyZShkYXRhKSk7XG4gICAgdGhpcy5lbmFibGVTZWxlY3Rpb24gPSB0cnVlO1xuICAgIGNvbnN0IHtcbiAgICAgIGVuYWJsZVBpY2tpbmcgPSB0cnVlLFxuICAgICAgbm9CbGVuZCA9IGZhbHNlLFxuICAgICAgcm91bmRlZCA9IHRydWUsXG4gICAgICBkYXNoZWQgPSBmYWxzZSxcbiAgICAgIG1hcmtlckxheWVyUHJvcHMgPSBudWxsLFxuICAgIH0gPSBjb25maWc7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCB7IGVuYWJsZVBpY2tpbmcsIG5vQmxlbmQsIHJvdW5kZWQsIGRhc2hlZCwgbWFya2VyTGF5ZXJQcm9wcyB9KTtcbiAgfVxuXG4gIGdldE1vdXNlT3ZlclNlZ21lbnQoKTogYW55IHtcbiAgICAvLyBUT0RPOiByZW1vdmUgcmVmZXJlbmNlc1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgX2NhbGNNYXJrZXJQZXJjZW50YWdlcyhuZjogUmVjb3JkPHN0cmluZywgYW55Pik6IG51bWJlcltdIHtcbiAgICBjb25zdCB7IGFycm93UGVyY2VudGFnZXMgfSA9IG5mLnN0eWxlO1xuICAgIGlmIChhcnJvd1BlcmNlbnRhZ2VzKSB7XG4gICAgICByZXR1cm4gYXJyb3dQZXJjZW50YWdlcztcbiAgICB9XG5cbiAgICBjb25zdCBhcnJvd1N0eWxlID0gbmYuc3R5bGUuYXJyb3dTdHlsZSB8fCBERUZBVUxUX1NUWUxFLmFycm93U3R5bGU7XG4gICAgaWYgKGFycm93U3R5bGUgPT09IEFycm93U3R5bGVzLk5PTkUpIHJldHVybiBbXTtcblxuICAgIGNvbnN0IGFycm93Q291bnQgPSBNYXRoLm1pbihuZi5zdHlsZS5hcnJvd0NvdW50IHx8IERFRkFVTFRfU1RZTEUuYXJyb3dDb3VudCwgTUFYX0FSUk9XUyk7XG4gICAgcmV0dXJuIFtbMC41XSwgWzAuMzMsIDAuNjZdLCBbMC4yNSwgMC41LCAwLjc1XV1bYXJyb3dDb3VudCAtIDFdO1xuICB9XG5cbiAgX2dldEhpZ2hsaWdodGVkT2JqZWN0SW5kZXgoeyBuZWJ1bGEgfTogUmVjb3JkPHN0cmluZywgYW55Pik6IG51bWJlciB7XG4gICAgY29uc3QgeyBkZWNrZ2xNb3VzZU92ZXJJbmZvIH0gPSBuZWJ1bGE7XG4gICAgaWYgKGRlY2tnbE1vdXNlT3ZlckluZm8pIHtcbiAgICAgIGNvbnN0IHsgb3JpZ2luYWxMYXllciwgaW5kZXggfSA9IGRlY2tnbE1vdXNlT3ZlckluZm87XG4gICAgICBpZiAob3JpZ2luYWxMYXllciA9PT0gdGhpcykge1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gbm8gb2JqZWN0XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgcmVuZGVyKHsgbmVidWxhIH06IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICBjb25zdCBkZWZhdWx0Q29sb3IgPSBbMHgwLCAweDAsIDB4MCwgMHhmZl07XG4gICAgY29uc3QgeyBvYmplY3RzLCB1cGRhdGVUcmlnZ2VyIH0gPSB0aGlzLmRlY2tDYWNoZTtcblxuICAgIHJldHVybiBuZXcgUGF0aE1hcmtlckxheWVyKHtcbiAgICAgIGlkOiBgc2VnbWVudHMtJHt0aGlzLmlkfWAsXG4gICAgICBkYXRhOiBvYmplY3RzLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGZwNjQ6IGZhbHNlLFxuICAgICAgcm91bmRlZDogdGhpcy5yb3VuZGVkLFxuICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICBzaXplU2NhbGU6IHRoaXMuYXJyb3dTaXplIHx8IDYsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIGRlcHRoVGVzdDogZmFsc2UsXG4gICAgICAgIGJsZW5kOiAhdGhpcy5ub0JsZW5kLFxuICAgICAgICBibGVuZEVxdWF0aW9uOiBNQVgsXG4gICAgICB9LFxuICAgICAgZ2V0UGF0aDogKG5mOiBhbnkpID0+IG5mLmdlb0pzb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBnZXRDb2xvcjogKG5mOiBhbnkpID0+IHRvRGVja0NvbG9yKG5mLnN0eWxlLmxpbmVDb2xvciwgZGVmYXVsdENvbG9yKSxcbiAgICAgIGdldFdpZHRoOiAobmY6IGFueSkgPT4gbmYuc3R5bGUubGluZVdpZHRoTWV0ZXJzIHx8IDEsXG4gICAgICBnZXRaTGV2ZWw6IChuZjogYW55KSA9PiBuZi5zdHlsZS56TGV2ZWwgKiAyNTUsXG4gICAgICBnZXREaXJlY3Rpb246IChuZjogYW55KSA9PiBORUJVTEFfVE9fREVDS19ESVJFQ1RJT05TW25mLnN0eWxlLmFycm93U3R5bGVdLFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZ2V0TWFya2VyQ29sb3I6IChuZjogYW55KSA9PiB0b0RlY2tDb2xvcihuZi5zdHlsZS5hcnJvd0NvbG9yLCBkZWZhdWx0Q29sb3IpLFxuICAgICAgZ2V0TWFya2VyUGVyY2VudGFnZXM6IHRoaXMuX2NhbGNNYXJrZXJQZXJjZW50YWdlcyxcbiAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7IGFsbDogdXBkYXRlVHJpZ2dlciB9LFxuXG4gICAgICBoaWdobGlnaHRlZE9iamVjdEluZGV4OiB0aGlzLl9nZXRIaWdobGlnaHRlZE9iamVjdEluZGV4KHsgbmVidWxhIH0pLFxuICAgICAgaGlnaGxpZ2h0Q29sb3I6IHRvRGVja0NvbG9yKHRoaXMuaGlnaGxpZ2h0Q29sb3IpLFxuXG4gICAgICBkYXNoSnVzdGlmaWVkOiB0aGlzLmRhc2hlZCxcbiAgICAgIGdldERhc2hBcnJheTogdGhpcy5kYXNoZWQgPyAobmYpID0+IG5mLnN0eWxlLmRhc2hBcnJheSA6IG51bGwsXG4gICAgICBtYXJrZXJMYXllclByb3BzOlxuICAgICAgICB0aGlzLm1hcmtlckxheWVyUHJvcHMgfHxcbiAgICAgICAgKFBhdGhNYXJrZXJMYXllciBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KS5kZWZhdWx0UHJvcHMubWFya2VyTGF5ZXJQcm9wcyxcblxuICAgICAgbmVidWxhTGF5ZXI6IHRoaXMsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==