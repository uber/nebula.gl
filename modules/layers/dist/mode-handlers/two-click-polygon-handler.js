"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TwoClickPolygonHandler = void 0;

var _modeHandler = require("./mode-handler");

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var TwoClickPolygonHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(TwoClickPolygonHandler, _ModeHandler);

  var _super = _createSuper(TwoClickPolygonHandler);

  function TwoClickPolygonHandler() {
    _classCallCheck(this, TwoClickPolygonHandler);

    return _super.apply(this, arguments);
  }

  _createClass(TwoClickPolygonHandler, [{
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(TwoClickPolygonHandler.prototype), "handleClick", this).call(this, event);

      var tentativeFeature = this.getTentativeFeature();
      var clickSequence = this.getClickSequence();

      if (clickSequence.length > 1 && tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        var editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry);
        this.resetClickSequence();

        this._setTentativeFeature(null);

        return editAction;
      }

      return null;
    }
  }]);

  return TwoClickPolygonHandler;
}(_modeHandler.ModeHandler);

exports.TwoClickPolygonHandler = TwoClickPolygonHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3R3by1jbGljay1wb2x5Z29uLWhhbmRsZXIudHMiXSwibmFtZXMiOlsiVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciIsImV2ZW50IiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsImdlb21ldHJ5IiwidHlwZSIsImVkaXRBY3Rpb24iLCJnZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbiIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwiTW9kZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0lBQ2FBLHNCOzs7Ozs7Ozs7Ozs7O2dDQUNDQyxLLEVBQWtEO0FBQzVELDhGQUFrQkEsS0FBbEI7O0FBRUEsVUFBTUMsZ0JBQWdCLEdBQUcsS0FBS0MsbUJBQUwsRUFBekI7QUFDQSxVQUFNQyxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7O0FBRUEsVUFDRUQsYUFBYSxDQUFDRSxNQUFkLEdBQXVCLENBQXZCLElBQ0FKLGdCQURBLElBRUFBLGdCQUFnQixDQUFDSyxRQUFqQixDQUEwQkMsSUFBMUIsS0FBbUMsU0FIckMsRUFJRTtBQUNBLFlBQU1DLFVBQVUsR0FBRyxLQUFLQyxtQ0FBTCxDQUF5Q1IsZ0JBQWdCLENBQUNLLFFBQTFELENBQW5CO0FBQ0EsYUFBS0ksa0JBQUw7O0FBQ0EsYUFBS0Msb0JBQUwsQ0FBMEIsSUFBMUI7O0FBQ0EsZUFBT0gsVUFBUDtBQUNEOztBQUVELGFBQU8sSUFBUDtBQUNEOzs7O0VBbkJ5Q0ksd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDbGlja0V2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMnO1xuaW1wb3J0IHsgTW9kZUhhbmRsZXIsIEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBUd29DbGlja1BvbHlnb25IYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBoYW5kbGVDbGljayhldmVudDogQ2xpY2tFdmVudCk6IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBzdXBlci5oYW5kbGVDbGljayhldmVudCk7XG5cbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgaWYgKFxuICAgICAgY2xpY2tTZXF1ZW5jZS5sZW5ndGggPiAxICYmXG4gICAgICB0ZW50YXRpdmVGZWF0dXJlICYmXG4gICAgICB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJ1xuICAgICkge1xuICAgICAgY29uc3QgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24odGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeSk7XG4gICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=