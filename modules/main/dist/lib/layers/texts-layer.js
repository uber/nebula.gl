"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layers = require("@deck.gl/layers");

var _nebulaLayer = _interopRequireDefault(require("../nebula-layer"));

var _utils = require("../utils");

var _deckCache = _interopRequireDefault(require("../deck-renderer/deck-cache"));

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

var TextsLayer = /*#__PURE__*/function (_NebulaLayer) {
  _inherits(TextsLayer, _NebulaLayer);

  var _super = _createSuper(TextsLayer);

  function TextsLayer(config) {
    var _this;

    _classCallCheck(this, TextsLayer);

    _this = _super.call(this, config);

    _defineProperty(_assertThisInitialized(_this), "deckCache", void 0);

    _this.deckCache = new _deckCache["default"](config.getData, function (data) {
      return config.toNebulaFeature(data);
    });
    return _this;
  }

  _createClass(TextsLayer, [{
    key: "render",
    value: function render(_ref) {
      var nebula = _ref.nebula;
      var defaultColor = [0x0, 0x0, 0x0, 0xff];
      var _this$deckCache = this.deckCache,
          objects = _this$deckCache.objects,
          updateTrigger = _this$deckCache.updateTrigger;
      var zoom = nebula.props.viewport.zoom;
      return new _layers.TextLayer({
        id: "texts-".concat(this.id),
        data: objects,
        opacity: 1,
        fp64: false,
        pickable: false,
        getText: function getText(nf) {
          return nf.style.text;
        },
        getPosition: function getPosition(nf) {
          return nf.geoJson.geometry.coordinates;
        },
        // @ts-ignore
        getColor: function getColor(nf) {
          return (0, _utils.toDeckColor)(nf.style.fillColor) || defaultColor;
        },
        // TODO: layer should offer option to scale with zoom
        sizeScale: 1 / Math.pow(2, 20 - zoom),
        updateTriggers: {
          all: updateTrigger
        },
        nebulaLayer: this
      });
    }
  }]);

  return TextsLayer;
}(_nebulaLayer["default"]);

exports["default"] = TextsLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGF5ZXJzL3RleHRzLWxheWVyLnRzIl0sIm5hbWVzIjpbIlRleHRzTGF5ZXIiLCJjb25maWciLCJkZWNrQ2FjaGUiLCJEZWNrQ2FjaGUiLCJnZXREYXRhIiwiZGF0YSIsInRvTmVidWxhRmVhdHVyZSIsIm5lYnVsYSIsImRlZmF1bHRDb2xvciIsIm9iamVjdHMiLCJ1cGRhdGVUcmlnZ2VyIiwiem9vbSIsInByb3BzIiwidmlld3BvcnQiLCJUZXh0TGF5ZXIiLCJpZCIsIm9wYWNpdHkiLCJmcDY0IiwicGlja2FibGUiLCJnZXRUZXh0IiwibmYiLCJzdHlsZSIsInRleHQiLCJnZXRQb3NpdGlvbiIsImdlb0pzb24iLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZ2V0Q29sb3IiLCJmaWxsQ29sb3IiLCJzaXplU2NhbGUiLCJNYXRoIiwicG93IiwidXBkYXRlVHJpZ2dlcnMiLCJhbGwiLCJuZWJ1bGFMYXllciIsIk5lYnVsYUxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFcUJBLFU7Ozs7O0FBR25CLHNCQUFZQyxNQUFaLEVBQXlDO0FBQUE7O0FBQUE7O0FBQ3ZDLDhCQUFNQSxNQUFOOztBQUR1Qzs7QUFFdkMsVUFBS0MsU0FBTCxHQUFpQixJQUFJQyxxQkFBSixDQUFjRixNQUFNLENBQUNHLE9BQXJCLEVBQThCLFVBQUNDLElBQUQ7QUFBQSxhQUFVSixNQUFNLENBQUNLLGVBQVAsQ0FBdUJELElBQXZCLENBQVY7QUFBQSxLQUE5QixDQUFqQjtBQUZ1QztBQUd4Qzs7OztpQ0FFdUM7QUFBQSxVQUEvQkUsTUFBK0IsUUFBL0JBLE1BQStCO0FBQ3RDLFVBQU1DLFlBQVksR0FBRyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixJQUFoQixDQUFyQjtBQURzQyw0QkFFSCxLQUFLTixTQUZGO0FBQUEsVUFFOUJPLE9BRjhCLG1CQUU5QkEsT0FGOEI7QUFBQSxVQUVyQkMsYUFGcUIsbUJBRXJCQSxhQUZxQjtBQUFBLFVBSTlCQyxJQUo4QixHQUlyQkosTUFBTSxDQUFDSyxLQUFQLENBQWFDLFFBSlEsQ0FJOUJGLElBSjhCO0FBTXRDLGFBQU8sSUFBSUcsaUJBQUosQ0FBYztBQUNuQkMsUUFBQUEsRUFBRSxrQkFBVyxLQUFLQSxFQUFoQixDQURpQjtBQUVuQlYsUUFBQUEsSUFBSSxFQUFFSSxPQUZhO0FBR25CTyxRQUFBQSxPQUFPLEVBQUUsQ0FIVTtBQUluQkMsUUFBQUEsSUFBSSxFQUFFLEtBSmE7QUFLbkJDLFFBQUFBLFFBQVEsRUFBRSxLQUxTO0FBT25CQyxRQUFBQSxPQUFPLEVBQUUsaUJBQUNDLEVBQUQ7QUFBQSxpQkFBUUEsRUFBRSxDQUFDQyxLQUFILENBQVNDLElBQWpCO0FBQUEsU0FQVTtBQVFuQkMsUUFBQUEsV0FBVyxFQUFFLHFCQUFDSCxFQUFEO0FBQUEsaUJBQVFBLEVBQUUsQ0FBQ0ksT0FBSCxDQUFXQyxRQUFYLENBQW9CQyxXQUE1QjtBQUFBLFNBUk07QUFTbkI7QUFDQUMsUUFBQUEsUUFBUSxFQUFFLGtCQUFDUCxFQUFEO0FBQUEsaUJBQVEsd0JBQVlBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTTyxTQUFyQixLQUFtQ3BCLFlBQTNDO0FBQUEsU0FWUztBQVluQjtBQUNBcUIsUUFBQUEsU0FBUyxFQUFFLElBQUlDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFLcEIsSUFBakIsQ0FiSTtBQWVuQnFCLFFBQUFBLGNBQWMsRUFBRTtBQUFFQyxVQUFBQSxHQUFHLEVBQUV2QjtBQUFQLFNBZkc7QUFpQm5Cd0IsUUFBQUEsV0FBVyxFQUFFO0FBakJNLE9BQWQsQ0FBUDtBQW1CRDs7OztFQWpDcUNDLHVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGV4dExheWVyIH0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcblxuaW1wb3J0IE5lYnVsYUxheWVyIGZyb20gJy4uL25lYnVsYS1sYXllcic7XG5pbXBvcnQgeyB0b0RlY2tDb2xvciB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBEZWNrQ2FjaGUgZnJvbSAnLi4vZGVjay1yZW5kZXJlci9kZWNrLWNhY2hlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dHNMYXllciBleHRlbmRzIE5lYnVsYUxheWVyIHtcbiAgZGVja0NhY2hlOiBEZWNrQ2FjaGU8YW55LCBhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgdGhpcy5kZWNrQ2FjaGUgPSBuZXcgRGVja0NhY2hlKGNvbmZpZy5nZXREYXRhLCAoZGF0YSkgPT4gY29uZmlnLnRvTmVidWxhRmVhdHVyZShkYXRhKSk7XG4gIH1cblxuICByZW5kZXIoeyBuZWJ1bGEgfTogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIGNvbnN0IGRlZmF1bHRDb2xvciA9IFsweDAsIDB4MCwgMHgwLCAweGZmXTtcbiAgICBjb25zdCB7IG9iamVjdHMsIHVwZGF0ZVRyaWdnZXIgfSA9IHRoaXMuZGVja0NhY2hlO1xuXG4gICAgY29uc3QgeyB6b29tIH0gPSBuZWJ1bGEucHJvcHMudmlld3BvcnQ7XG5cbiAgICByZXR1cm4gbmV3IFRleHRMYXllcih7XG4gICAgICBpZDogYHRleHRzLSR7dGhpcy5pZH1gLFxuICAgICAgZGF0YTogb2JqZWN0cyxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBmcDY0OiBmYWxzZSxcbiAgICAgIHBpY2thYmxlOiBmYWxzZSxcblxuICAgICAgZ2V0VGV4dDogKG5mKSA9PiBuZi5zdHlsZS50ZXh0LFxuICAgICAgZ2V0UG9zaXRpb246IChuZikgPT4gbmYuZ2VvSnNvbi5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGdldENvbG9yOiAobmYpID0+IHRvRGVja0NvbG9yKG5mLnN0eWxlLmZpbGxDb2xvcikgfHwgZGVmYXVsdENvbG9yLFxuXG4gICAgICAvLyBUT0RPOiBsYXllciBzaG91bGQgb2ZmZXIgb3B0aW9uIHRvIHNjYWxlIHdpdGggem9vbVxuICAgICAgc2l6ZVNjYWxlOiAxIC8gTWF0aC5wb3coMiwgMjAgLSB6b29tKSxcblxuICAgICAgdXBkYXRlVHJpZ2dlcnM6IHsgYWxsOiB1cGRhdGVUcmlnZ2VyIH0sXG5cbiAgICAgIG5lYnVsYUxheWVyOiB0aGlzLFxuICAgIH0pO1xuICB9XG59XG4iXX0=