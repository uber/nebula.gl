"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ViewMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(ViewMode, _GeoJsonEditMode);

  var _super = _createSuper(ViewMode);

  function ViewMode() {
    _classCallCheck(this, ViewMode);

    return _super.apply(this, arguments);
  }

  return ViewMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.ViewMode = ViewMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdmlldy1tb2RlLnRzIl0sIm5hbWVzIjpbIlZpZXdNb2RlIiwiR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFE7Ozs7Ozs7Ozs7OztFQUFpQkMsZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBHZW9Kc29uRWRpdE1vZGUgfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlJztcblxuZXhwb3J0IGNsYXNzIFZpZXdNb2RlIGV4dGVuZHMgR2VvSnNvbkVkaXRNb2RlIHt9XG4iXX0=