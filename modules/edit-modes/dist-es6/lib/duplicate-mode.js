"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DuplicateMode = void 0;

var _translateMode = require("./translate-mode");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DuplicateMode = /*#__PURE__*/function (_TranslateMode) {
  _inherits(DuplicateMode, _TranslateMode);

  var _super = _createSuper(DuplicateMode);

  function DuplicateMode() {
    _classCallCheck(this, DuplicateMode);

    return _super.apply(this, arguments);
  }

  _createClass(DuplicateMode, [{
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      _get(_getPrototypeOf(DuplicateMode.prototype), "handleStartDragging", this).call(this, event, props);

      if (this._geometryBeforeTranslate) {
        props.onEdit(this.getAddManyFeaturesAction(this._geometryBeforeTranslate, props.data));
      }
    }
  }, {
    key: "updateCursor",
    value: function updateCursor(props) {
      if (this._isTranslatable) {
        props.onUpdateCursor('copy');
      } else {
        props.onUpdateCursor(null);
      }
    }
  }]);

  return DuplicateMode;
}(_translateMode.TranslateMode);

exports.DuplicateMode = DuplicateMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHVwbGljYXRlLW1vZGUudHMiXSwibmFtZXMiOlsiRHVwbGljYXRlTW9kZSIsImV2ZW50IiwicHJvcHMiLCJfZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUiLCJvbkVkaXQiLCJnZXRBZGRNYW55RmVhdHVyZXNBY3Rpb24iLCJkYXRhIiwiX2lzVHJhbnNsYXRhYmxlIiwib25VcGRhdGVDdXJzb3IiLCJUcmFuc2xhdGVNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsYTs7Ozs7Ozs7Ozs7Ozt3Q0FDU0MsSyxFQUEyQkMsSyxFQUFxQztBQUNsRiw2RkFBMEJELEtBQTFCLEVBQWlDQyxLQUFqQzs7QUFFQSxVQUFJLEtBQUtDLHdCQUFULEVBQW1DO0FBQ2pDRCxRQUFBQSxLQUFLLENBQUNFLE1BQU4sQ0FBYSxLQUFLQyx3QkFBTCxDQUE4QixLQUFLRix3QkFBbkMsRUFBNkRELEtBQUssQ0FBQ0ksSUFBbkUsQ0FBYjtBQUNEO0FBQ0Y7OztpQ0FFWUosSyxFQUFxQztBQUNoRCxVQUFJLEtBQUtLLGVBQVQsRUFBMEI7QUFDeEJMLFFBQUFBLEtBQUssQ0FBQ00sY0FBTixDQUFxQixNQUFyQjtBQUNELE9BRkQsTUFFTztBQUNMTixRQUFBQSxLQUFLLENBQUNNLGNBQU4sQ0FBcUIsSUFBckI7QUFDRDtBQUNGOzs7O0VBZmdDQyw0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YXJ0RHJhZ2dpbmdFdmVudCwgTW9kZVByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7IFRyYW5zbGF0ZU1vZGUgfSBmcm9tICcuL3RyYW5zbGF0ZS1tb2RlJztcblxuZXhwb3J0IGNsYXNzIER1cGxpY2F0ZU1vZGUgZXh0ZW5kcyBUcmFuc2xhdGVNb2RlIHtcbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIHN1cGVyLmhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQsIHByb3BzKTtcblxuICAgIGlmICh0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSkge1xuICAgICAgcHJvcHMub25FZGl0KHRoaXMuZ2V0QWRkTWFueUZlYXR1cmVzQWN0aW9uKHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlLCBwcm9wcy5kYXRhKSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ3Vyc29yKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgaWYgKHRoaXMuX2lzVHJhbnNsYXRhYmxlKSB7XG4gICAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcignY29weScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcihudWxsKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==