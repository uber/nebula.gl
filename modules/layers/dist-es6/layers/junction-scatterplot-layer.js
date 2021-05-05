"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@deck.gl/core");

var _layers = require("@deck.gl/layers");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var JunctionScatterplotLayer = /*#__PURE__*/function (_CompositeLayer) {
  _inherits(JunctionScatterplotLayer, _CompositeLayer);

  var _super = _createSuper(JunctionScatterplotLayer);

  function JunctionScatterplotLayer() {
    _classCallCheck(this, JunctionScatterplotLayer);

    return _super.apply(this, arguments);
  }

  _createClass(JunctionScatterplotLayer, [{
    key: "renderLayers",
    value: function renderLayers() {
      var _this$props = this.props,
          id = _this$props.id,
          getFillColor = _this$props.getFillColor,
          getStrokeColor = _this$props.getStrokeColor,
          getInnerRadius = _this$props.getInnerRadius,
          updateTriggers = _this$props.updateTriggers; // data needs to be passed explicitly after deck.gl 5.3

      return [// the full circles
      new _layers.ScatterplotLayer(_objectSpread({}, this.props, {
        id: "".concat(id, "-full"),
        data: this.props.data,
        getLineColor: getStrokeColor,
        updateTriggers: _objectSpread({}, updateTriggers, {
          getStrokeColor: updateTriggers.getStrokeColor
        })
      })), // the inner part
      new _layers.ScatterplotLayer(_objectSpread({}, this.props, {
        id: "".concat(id, "-inner"),
        data: this.props.data,
        getFillColor: getFillColor,
        getRadius: getInnerRadius,
        pickable: false,
        updateTriggers: _objectSpread({}, updateTriggers, {
          getFillColor: updateTriggers.getFillColor,
          getRadius: updateTriggers.getInnerRadius
        })
      }))];
    }
  }]);

  return JunctionScatterplotLayer;
}(_core.CompositeLayer);

exports["default"] = JunctionScatterplotLayer;

_defineProperty(JunctionScatterplotLayer, "layerName", 'JunctionScatterplotLayer');

_defineProperty(JunctionScatterplotLayer, "defaultProps", _objectSpread({}, _layers.ScatterplotLayer.defaultProps, {
  getFillColor: function getFillColor(d) {
    return [0, 0, 0, 255];
  },
  getStrokeColor: function getStrokeColor(d) {
    return [255, 255, 255, 255];
  },
  getInnerRadius: function getInnerRadius(d) {
    return 1;
  }
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvanVuY3Rpb24tc2NhdHRlcnBsb3QtbGF5ZXIudHMiXSwibmFtZXMiOlsiSnVuY3Rpb25TY2F0dGVycGxvdExheWVyIiwicHJvcHMiLCJpZCIsImdldEZpbGxDb2xvciIsImdldFN0cm9rZUNvbG9yIiwiZ2V0SW5uZXJSYWRpdXMiLCJ1cGRhdGVUcmlnZ2VycyIsIlNjYXR0ZXJwbG90TGF5ZXIiLCJkYXRhIiwiZ2V0TGluZUNvbG9yIiwiZ2V0UmFkaXVzIiwicGlja2FibGUiLCJDb21wb3NpdGVMYXllciIsImRlZmF1bHRQcm9wcyIsImQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRXFCQSx3Qjs7Ozs7Ozs7Ozs7OzttQ0FVSjtBQUFBLHdCQUNnRSxLQUFLQyxLQURyRTtBQUFBLFVBQ0xDLEVBREssZUFDTEEsRUFESztBQUFBLFVBQ0RDLFlBREMsZUFDREEsWUFEQztBQUFBLFVBQ2FDLGNBRGIsZUFDYUEsY0FEYjtBQUFBLFVBQzZCQyxjQUQ3QixlQUM2QkEsY0FEN0I7QUFBQSxVQUM2Q0MsY0FEN0MsZUFDNkNBLGNBRDdDLEVBR2I7O0FBQ0EsYUFBTyxDQUNMO0FBQ0EsVUFBSUMsd0JBQUosbUJBQ0ssS0FBS04sS0FEVjtBQUVFQyxRQUFBQSxFQUFFLFlBQUtBLEVBQUwsVUFGSjtBQUdFTSxRQUFBQSxJQUFJLEVBQUUsS0FBS1AsS0FBTCxDQUFXTyxJQUhuQjtBQUlFQyxRQUFBQSxZQUFZLEVBQUVMLGNBSmhCO0FBS0VFLFFBQUFBLGNBQWMsb0JBQ1RBLGNBRFM7QUFFWkYsVUFBQUEsY0FBYyxFQUFFRSxjQUFjLENBQUNGO0FBRm5CO0FBTGhCLFNBRkssRUFXRDtBQUNKLFVBQUlHLHdCQUFKLG1CQUNLLEtBQUtOLEtBRFY7QUFFRUMsUUFBQUEsRUFBRSxZQUFLQSxFQUFMLFdBRko7QUFHRU0sUUFBQUEsSUFBSSxFQUFFLEtBQUtQLEtBQUwsQ0FBV08sSUFIbkI7QUFJRUwsUUFBQUEsWUFBWSxFQUFaQSxZQUpGO0FBS0VPLFFBQUFBLFNBQVMsRUFBRUwsY0FMYjtBQU1FTSxRQUFBQSxRQUFRLEVBQUUsS0FOWjtBQU9FTCxRQUFBQSxjQUFjLG9CQUNUQSxjQURTO0FBRVpILFVBQUFBLFlBQVksRUFBRUcsY0FBYyxDQUFDSCxZQUZqQjtBQUdaTyxVQUFBQSxTQUFTLEVBQUVKLGNBQWMsQ0FBQ0Q7QUFIZDtBQVBoQixTQVpLLENBQVA7QUEwQkQ7Ozs7RUF4Q21ETyxvQjs7OztnQkFBakNaLHdCLGVBQ0EsMEI7O2dCQURBQSx3QixvQ0FJZE8seUJBQWlCTSxZO0FBQ3BCVixFQUFBQSxZQUFZLEVBQUUsc0JBQUNXLENBQUQ7QUFBQSxXQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsR0FBVixDQUFQO0FBQUEsRztBQUNkVixFQUFBQSxjQUFjLEVBQUUsd0JBQUNVLENBQUQ7QUFBQSxXQUFPLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxHQUFYLEVBQWdCLEdBQWhCLENBQVA7QUFBQSxHO0FBQ2hCVCxFQUFBQSxjQUFjLEVBQUUsd0JBQUNTLENBQUQ7QUFBQSxXQUFPLENBQVA7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvc2l0ZUxheWVyIH0gZnJvbSAnQGRlY2suZ2wvY29yZSc7XG5pbXBvcnQgeyBTY2F0dGVycGxvdExheWVyIH0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSnVuY3Rpb25TY2F0dGVycGxvdExheWVyIGV4dGVuZHMgQ29tcG9zaXRlTGF5ZXI8YW55PiB7XG4gIHN0YXRpYyBsYXllck5hbWUgPSAnSnVuY3Rpb25TY2F0dGVycGxvdExheWVyJztcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgLi4uU2NhdHRlcnBsb3RMYXllci5kZWZhdWx0UHJvcHMsXG4gICAgZ2V0RmlsbENvbG9yOiAoZCkgPT4gWzAsIDAsIDAsIDI1NV0sXG4gICAgZ2V0U3Ryb2tlQ29sb3I6IChkKSA9PiBbMjU1LCAyNTUsIDI1NSwgMjU1XSxcbiAgICBnZXRJbm5lclJhZGl1czogKGQpID0+IDEsXG4gIH07XG5cbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIGNvbnN0IHsgaWQsIGdldEZpbGxDb2xvciwgZ2V0U3Ryb2tlQ29sb3IsIGdldElubmVyUmFkaXVzLCB1cGRhdGVUcmlnZ2VycyB9ID0gdGhpcy5wcm9wcztcblxuICAgIC8vIGRhdGEgbmVlZHMgdG8gYmUgcGFzc2VkIGV4cGxpY2l0bHkgYWZ0ZXIgZGVjay5nbCA1LjNcbiAgICByZXR1cm4gW1xuICAgICAgLy8gdGhlIGZ1bGwgY2lyY2xlc1xuICAgICAgbmV3IFNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgICAuLi50aGlzLnByb3BzLFxuICAgICAgICBpZDogYCR7aWR9LWZ1bGxgLFxuICAgICAgICBkYXRhOiB0aGlzLnByb3BzLmRhdGEsXG4gICAgICAgIGdldExpbmVDb2xvcjogZ2V0U3Ryb2tlQ29sb3IsXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgICAgLi4udXBkYXRlVHJpZ2dlcnMsXG4gICAgICAgICAgZ2V0U3Ryb2tlQ29sb3I6IHVwZGF0ZVRyaWdnZXJzLmdldFN0cm9rZUNvbG9yLFxuICAgICAgICB9LFxuICAgICAgfSksIC8vIHRoZSBpbm5lciBwYXJ0XG4gICAgICBuZXcgU2NhdHRlcnBsb3RMYXllcih7XG4gICAgICAgIC4uLnRoaXMucHJvcHMsXG4gICAgICAgIGlkOiBgJHtpZH0taW5uZXJgLFxuICAgICAgICBkYXRhOiB0aGlzLnByb3BzLmRhdGEsXG4gICAgICAgIGdldEZpbGxDb2xvcixcbiAgICAgICAgZ2V0UmFkaXVzOiBnZXRJbm5lclJhZGl1cyxcbiAgICAgICAgcGlja2FibGU6IGZhbHNlLFxuICAgICAgICB1cGRhdGVUcmlnZ2Vyczoge1xuICAgICAgICAgIC4uLnVwZGF0ZVRyaWdnZXJzLFxuICAgICAgICAgIGdldEZpbGxDb2xvcjogdXBkYXRlVHJpZ2dlcnMuZ2V0RmlsbENvbG9yLFxuICAgICAgICAgIGdldFJhZGl1czogdXBkYXRlVHJpZ2dlcnMuZ2V0SW5uZXJSYWRpdXMsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICBdO1xuICB9XG59XG4iXX0=