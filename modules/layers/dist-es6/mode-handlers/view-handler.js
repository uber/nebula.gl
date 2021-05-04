"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewHandler = void 0;

var _modeHandler = require("./mode-handler");

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var ViewHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(ViewHandler, _ModeHandler);

  var _super = _createSuper(ViewHandler);

  function ViewHandler() {
    _classCallCheck(this, ViewHandler);

    return _super.apply(this, arguments);
  }

  _createClass(ViewHandler, [{
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;
      return isDragging ? 'grabbing' : 'grab';
    }
  }, {
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      return [];
    }
  }]);

  return ViewHandler;
}(_modeHandler.ModeHandler);

exports.ViewHandler = ViewHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3ZpZXctaGFuZGxlci50cyJdLCJuYW1lcyI6WyJWaWV3SGFuZGxlciIsImlzRHJhZ2dpbmciLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0lBQ2FBLFc7Ozs7Ozs7Ozs7Ozs7b0NBQ2dEO0FBQUEsVUFBL0NDLFVBQStDLFFBQS9DQSxVQUErQztBQUN6RCxhQUFPQSxVQUFVLEdBQUcsVUFBSCxHQUFnQixNQUFqQztBQUNEOzs7bUNBRWNDLEssRUFBb0NDLFksRUFBdUM7QUFDeEYsYUFBTyxFQUFQO0FBQ0Q7Ozs7RUFQOEJDLHdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9zaXRpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHsgRWRpdEhhbmRsZSwgTW9kZUhhbmRsZXIgfSBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBWaWV3SGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgZ2V0Q3Vyc29yKHsgaXNEcmFnZ2luZyB9OiB7IGlzRHJhZ2dpbmc6IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGlzRHJhZ2dpbmcgPyAnZ3JhYmJpbmcnIDogJ2dyYWInO1xuICB9XG5cbiAgZ2V0RWRpdEhhbmRsZXMocGlja3M/OiBBcnJheTxSZWNvcmQ8c3RyaW5nLCBhbnk+PiwgZ3JvdW5kQ29vcmRzPzogUG9zaXRpb24pOiBFZGl0SGFuZGxlW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuIl19