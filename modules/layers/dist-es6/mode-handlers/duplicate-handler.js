"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DuplicateHandler = void 0;

var _translateHandler = require("./translate-handler");

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
var DuplicateHandler = /*#__PURE__*/function (_TranslateHandler) {
  _inherits(DuplicateHandler, _TranslateHandler);

  var _super = _createSuper(DuplicateHandler);

  function DuplicateHandler() {
    _classCallCheck(this, DuplicateHandler);

    return _super.apply(this, arguments);
  }

  _createClass(DuplicateHandler, [{
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      if (!this._isTranslatable) {
        return null;
      }

      this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection();
      return this._geometryBeforeTranslate ? this.getAddManyFeaturesAction(this._geometryBeforeTranslate) : null;
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;

      if (this._isTranslatable) {
        return 'copy';
      }

      return isDragging ? 'grabbing' : 'grab';
    }
  }]);

  return DuplicateHandler;
}(_translateHandler.TranslateHandler);

exports.DuplicateHandler = DuplicateHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2R1cGxpY2F0ZS1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbIkR1cGxpY2F0ZUhhbmRsZXIiLCJldmVudCIsIl9pc1RyYW5zbGF0YWJsZSIsIl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSIsImdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uIiwiZ2V0QWRkTWFueUZlYXR1cmVzQWN0aW9uIiwiaXNEcmFnZ2luZyIsIlRyYW5zbGF0ZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEsZ0I7Ozs7Ozs7Ozs7Ozs7d0NBQ1NDLEssRUFBMEQ7QUFDNUUsVUFBSSxDQUFDLEtBQUtDLGVBQVYsRUFBMkI7QUFDekIsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsV0FBS0Msd0JBQUwsR0FBZ0MsS0FBS0Msc0NBQUwsRUFBaEM7QUFFQSxhQUFPLEtBQUtELHdCQUFMLEdBQ0gsS0FBS0Usd0JBQUwsQ0FBOEIsS0FBS0Ysd0JBQW5DLENBREcsR0FFSCxJQUZKO0FBR0Q7OztvQ0FFMEQ7QUFBQSxVQUEvQ0csVUFBK0MsUUFBL0NBLFVBQStDOztBQUN6RCxVQUFJLEtBQUtKLGVBQVQsRUFBMEI7QUFDeEIsZUFBTyxNQUFQO0FBQ0Q7O0FBQ0QsYUFBT0ksVUFBVSxHQUFHLFVBQUgsR0FBZ0IsTUFBakM7QUFDRDs7OztFQWxCbUNDLGtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhcnREcmFnZ2luZ0V2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMnO1xuaW1wb3J0IHsgRWRpdEFjdGlvbiB9IGZyb20gJy4vbW9kZS1oYW5kbGVyJztcbmltcG9ydCB7IFRyYW5zbGF0ZUhhbmRsZXIgfSBmcm9tICcuL3RyYW5zbGF0ZS1oYW5kbGVyJztcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgaGFuZGxlcnMgb25jZSBFZGl0TW9kZSBmdWxseSBpbXBsZW1lbnRlZFxuZXhwb3J0IGNsYXNzIER1cGxpY2F0ZUhhbmRsZXIgZXh0ZW5kcyBUcmFuc2xhdGVIYW5kbGVyIHtcbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KTogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5faXNUcmFuc2xhdGFibGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbigpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlXG4gICAgICA/IHRoaXMuZ2V0QWRkTWFueUZlYXR1cmVzQWN0aW9uKHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlKVxuICAgICAgOiBudWxsO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKHsgaXNEcmFnZ2luZyB9OiB7IGlzRHJhZ2dpbmc6IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuX2lzVHJhbnNsYXRhYmxlKSB7XG4gICAgICByZXR1cm4gJ2NvcHknO1xuICAgIH1cbiAgICByZXR1cm4gaXNEcmFnZ2luZyA/ICdncmFiYmluZycgOiAnZ3JhYic7XG4gIH1cbn1cbiJdfQ==