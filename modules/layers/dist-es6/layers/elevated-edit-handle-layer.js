"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@deck.gl/core");

var _layers = require("@deck.gl/layers");

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

var defaultProps = {};

var ElevatedEditHandleLayer = /*#__PURE__*/function (_CompositeLayer) {
  _inherits(ElevatedEditHandleLayer, _CompositeLayer);

  var _super = _createSuper(ElevatedEditHandleLayer);

  function ElevatedEditHandleLayer() {
    _classCallCheck(this, ElevatedEditHandleLayer);

    return _super.apply(this, arguments);
  }

  _createClass(ElevatedEditHandleLayer, [{
    key: "renderLayers",
    value: function renderLayers() {
      var handles = new _layers.ScatterplotLayer(Object.assign({}, this.props, {
        id: "".concat(this.props.id, "-ScatterplotLayer"),
        data: this.props.data
      }));
      var lines = new _layers.LineLayer(Object.assign({}, this.props, {
        id: "".concat(this.props.id, "-LineLayer"),
        data: this.props.data,
        pickable: false,
        getSourcePosition: function getSourcePosition(_ref) {
          var position = _ref.position;
          return [position[0], position[1], 0];
        },
        getTargetPosition: function getTargetPosition(_ref2) {
          var position = _ref2.position;
          return [position[0], position[1], position[2] || 0];
        },
        getColor: [150, 150, 150, 200],
        getStrokeWidth: 3
      }));
      return [handles, lines];
    }
  }]);

  return ElevatedEditHandleLayer;
}(_core.CompositeLayer);

exports["default"] = ElevatedEditHandleLayer;

_defineProperty(ElevatedEditHandleLayer, "layerName", 'ElevatedEditHandleLayer');

_defineProperty(ElevatedEditHandleLayer, "defaultProps", defaultProps);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWxldmF0ZWQtZWRpdC1oYW5kbGUtbGF5ZXIudHMiXSwibmFtZXMiOlsiZGVmYXVsdFByb3BzIiwiRWxldmF0ZWRFZGl0SGFuZGxlTGF5ZXIiLCJoYW5kbGVzIiwiU2NhdHRlcnBsb3RMYXllciIsIk9iamVjdCIsImFzc2lnbiIsInByb3BzIiwiaWQiLCJkYXRhIiwibGluZXMiLCJMaW5lTGF5ZXIiLCJwaWNrYWJsZSIsImdldFNvdXJjZVBvc2l0aW9uIiwicG9zaXRpb24iLCJnZXRUYXJnZXRQb3NpdGlvbiIsImdldENvbG9yIiwiZ2V0U3Ryb2tlV2lkdGgiLCJDb21wb3NpdGVMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLFlBQVksR0FBRyxFQUFyQjs7SUFFcUJDLHVCOzs7Ozs7Ozs7Ozs7O21DQUdKO0FBQ2IsVUFBTUMsT0FBTyxHQUFHLElBQUlDLHdCQUFKLENBQ2RDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS0MsS0FBdkIsRUFBOEI7QUFDNUJDLFFBQUFBLEVBQUUsWUFBSyxLQUFLRCxLQUFMLENBQVdDLEVBQWhCLHNCQUQwQjtBQUU1QkMsUUFBQUEsSUFBSSxFQUFFLEtBQUtGLEtBQUwsQ0FBV0U7QUFGVyxPQUE5QixDQURjLENBQWhCO0FBT0EsVUFBTUMsS0FBSyxHQUFHLElBQUlDLGlCQUFKLENBQ1pOLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS0MsS0FBdkIsRUFBOEI7QUFDNUJDLFFBQUFBLEVBQUUsWUFBSyxLQUFLRCxLQUFMLENBQVdDLEVBQWhCLGVBRDBCO0FBRTVCQyxRQUFBQSxJQUFJLEVBQUUsS0FBS0YsS0FBTCxDQUFXRSxJQUZXO0FBRzVCRyxRQUFBQSxRQUFRLEVBQUUsS0FIa0I7QUFJNUJDLFFBQUFBLGlCQUFpQixFQUFFO0FBQUEsY0FBR0MsUUFBSCxRQUFHQSxRQUFIO0FBQUEsaUJBQWtCLENBQUNBLFFBQVEsQ0FBQyxDQUFELENBQVQsRUFBY0EsUUFBUSxDQUFDLENBQUQsQ0FBdEIsRUFBMkIsQ0FBM0IsQ0FBbEI7QUFBQSxTQUpTO0FBSzVCQyxRQUFBQSxpQkFBaUIsRUFBRTtBQUFBLGNBQUdELFFBQUgsU0FBR0EsUUFBSDtBQUFBLGlCQUFrQixDQUFDQSxRQUFRLENBQUMsQ0FBRCxDQUFULEVBQWNBLFFBQVEsQ0FBQyxDQUFELENBQXRCLEVBQTJCQSxRQUFRLENBQUMsQ0FBRCxDQUFSLElBQWUsQ0FBMUMsQ0FBbEI7QUFBQSxTQUxTO0FBTTVCRSxRQUFBQSxRQUFRLEVBQUUsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsQ0FOa0I7QUFPNUJDLFFBQUFBLGNBQWMsRUFBRTtBQVBZLE9BQTlCLENBRFksQ0FBZDtBQVlBLGFBQU8sQ0FBQ2QsT0FBRCxFQUFVTyxLQUFWLENBQVA7QUFDRDs7OztFQXhCa0RRLG9COzs7O2dCQUFoQ2hCLHVCLGVBQ0EseUI7O2dCQURBQSx1QixrQkFFR0QsWSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVMYXllciB9IGZyb20gJ0BkZWNrLmdsL2NvcmUnO1xuaW1wb3J0IHsgU2NhdHRlcnBsb3RMYXllciwgTGluZUxheWVyIH0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZXZhdGVkRWRpdEhhbmRsZUxheWVyIGV4dGVuZHMgQ29tcG9zaXRlTGF5ZXI8YW55PiB7XG4gIHN0YXRpYyBsYXllck5hbWUgPSAnRWxldmF0ZWRFZGl0SGFuZGxlTGF5ZXInO1xuICBzdGF0aWMgZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuICByZW5kZXJMYXllcnMoKSB7XG4gICAgY29uc3QgaGFuZGxlcyA9IG5ldyBTY2F0dGVycGxvdExheWVyKFxuICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcywge1xuICAgICAgICBpZDogYCR7dGhpcy5wcm9wcy5pZH0tU2NhdHRlcnBsb3RMYXllcmAsXG4gICAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGNvbnN0IGxpbmVzID0gbmV3IExpbmVMYXllcihcbiAgICAgIE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMsIHtcbiAgICAgICAgaWQ6IGAke3RoaXMucHJvcHMuaWR9LUxpbmVMYXllcmAsXG4gICAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YSxcbiAgICAgICAgcGlja2FibGU6IGZhbHNlLFxuICAgICAgICBnZXRTb3VyY2VQb3NpdGlvbjogKHsgcG9zaXRpb24gfSkgPT4gW3Bvc2l0aW9uWzBdLCBwb3NpdGlvblsxXSwgMF0sXG4gICAgICAgIGdldFRhcmdldFBvc2l0aW9uOiAoeyBwb3NpdGlvbiB9KSA9PiBbcG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdLCBwb3NpdGlvblsyXSB8fCAwXSxcbiAgICAgICAgZ2V0Q29sb3I6IFsxNTAsIDE1MCwgMTUwLCAyMDBdLFxuICAgICAgICBnZXRTdHJva2VXaWR0aDogMyxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJldHVybiBbaGFuZGxlcywgbGluZXNdO1xuICB9XG59XG4iXX0=