"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = _interopRequireDefault(require("events"));

var _uuid = _interopRequireDefault(require("uuid"));

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

var NebulaLayer = /*#__PURE__*/function (_Event$EventEmitter) {
  _inherits(NebulaLayer, _Event$EventEmitter);

  var _super = _createSuper(NebulaLayer);

  // flags
  //
  function NebulaLayer(_ref) {
    var _this;

    var getData = _ref.getData,
        on = _ref.on,
        toNebulaFeature = _ref.toNebulaFeature;

    _classCallCheck(this, NebulaLayer);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "getData", void 0);

    _defineProperty(_assertThisInitialized(_this), "toNebulaFeature", void 0);

    _defineProperty(_assertThisInitialized(_this), "id", void 0);

    _defineProperty(_assertThisInitialized(_this), "helperLayers", void 0);

    _defineProperty(_assertThisInitialized(_this), "usesMapEvents", false);

    _defineProperty(_assertThisInitialized(_this), "enablePicking", false);

    _defineProperty(_assertThisInitialized(_this), "enableSelection", false);

    _this.id = _uuid["default"].v4();
    _this.getData = getData;
    _this.toNebulaFeature = toNebulaFeature;
    _this.helperLayers = [];

    if (on) {
      // @ts-ignore
      Object.keys(on).forEach(function (key) {
        return _this.on(key, on[key]);
      });
    }

    return _this;
  }

  _createClass(NebulaLayer, [{
    key: "render",
    value: function render(config) {
      return null;
    }
  }]);

  return NebulaLayer;
}(_events["default"].EventEmitter);

exports["default"] = NebulaLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbmVidWxhLWxheWVyLnRzIl0sIm5hbWVzIjpbIk5lYnVsYUxheWVyIiwiZ2V0RGF0YSIsIm9uIiwidG9OZWJ1bGFGZWF0dXJlIiwiaWQiLCJ1dWlkIiwidjQiLCJoZWxwZXJMYXllcnMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImNvbmZpZyIsIkV2ZW50IiwiRXZlbnRFbWl0dGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFJcUJBLFc7Ozs7O0FBTW5CO0FBSUE7QUFFQSw2QkFBbUU7QUFBQTs7QUFBQSxRQUFyREMsT0FBcUQsUUFBckRBLE9BQXFEO0FBQUEsUUFBNUNDLEVBQTRDLFFBQTVDQSxFQUE0QztBQUFBLFFBQXhDQyxlQUF3QyxRQUF4Q0EsZUFBd0M7O0FBQUE7O0FBQ2pFOztBQURpRTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQSxvRUFMbkQsS0FLbUQ7O0FBQUEsb0VBSm5ELEtBSW1EOztBQUFBLHNFQUhqRCxLQUdpRDs7QUFFakUsVUFBS0MsRUFBTCxHQUFVQyxpQkFBS0MsRUFBTCxFQUFWO0FBQ0EsVUFBS0wsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsVUFBS0UsZUFBTCxHQUF1QkEsZUFBdkI7QUFDQSxVQUFLSSxZQUFMLEdBQW9CLEVBQXBCOztBQUVBLFFBQUlMLEVBQUosRUFBUTtBQUNOO0FBQ0FNLE1BQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZUCxFQUFaLEVBQWdCUSxPQUFoQixDQUF3QixVQUFDQyxHQUFEO0FBQUEsZUFBUyxNQUFLVCxFQUFMLENBQVFTLEdBQVIsRUFBYVQsRUFBRSxDQUFDUyxHQUFELENBQWYsQ0FBVDtBQUFBLE9BQXhCO0FBQ0Q7O0FBVmdFO0FBV2xFOzs7OzJCQUVNQyxNLEVBQXNDO0FBQzNDLGFBQU8sSUFBUDtBQUNEOzs7O0VBM0JzQ0MsbUJBQU1DLFkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnQgZnJvbSAnZXZlbnRzJztcbmltcG9ydCB1dWlkIGZyb20gJ3V1aWQnO1xuXG5pbXBvcnQgRmVhdHVyZSBmcm9tICcuL2ZlYXR1cmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZWJ1bGFMYXllciBleHRlbmRzIEV2ZW50LkV2ZW50RW1pdHRlciB7XG4gIGdldERhdGE6ICgpID0+IFJlY29yZDxzdHJpbmcsIGFueT5bXTtcbiAgdG9OZWJ1bGFGZWF0dXJlOiAoZGF0YTogUmVjb3JkPHN0cmluZywgYW55PikgPT4gRmVhdHVyZTtcbiAgaWQ6IHN0cmluZztcbiAgaGVscGVyTGF5ZXJzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W107XG5cbiAgLy8gZmxhZ3NcbiAgdXNlc01hcEV2ZW50cyA9IGZhbHNlO1xuICBlbmFibGVQaWNraW5nID0gZmFsc2U7XG4gIGVuYWJsZVNlbGVjdGlvbiA9IGZhbHNlO1xuICAvL1xuXG4gIGNvbnN0cnVjdG9yKHsgZ2V0RGF0YSwgb24sIHRvTmVidWxhRmVhdHVyZSB9OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmlkID0gdXVpZC52NCgpO1xuICAgIHRoaXMuZ2V0RGF0YSA9IGdldERhdGE7XG4gICAgdGhpcy50b05lYnVsYUZlYXR1cmUgPSB0b05lYnVsYUZlYXR1cmU7XG4gICAgdGhpcy5oZWxwZXJMYXllcnMgPSBbXTtcblxuICAgIGlmIChvbikge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgT2JqZWN0LmtleXMob24pLmZvckVhY2goKGtleSkgPT4gdGhpcy5vbihrZXksIG9uW2tleV0pKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoY29uZmlnOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogdW5rbm93biB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==