"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawRectangleHandler = void 0;

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

var _twoClickPolygonHandler = require("./two-click-polygon-handler");

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var DrawRectangleHandler = /*#__PURE__*/function (_TwoClickPolygonHandl) {
  _inherits(DrawRectangleHandler, _TwoClickPolygonHandl);

  var _super = _createSuper(DrawRectangleHandler);

  function DrawRectangleHandler() {
    _classCallCheck(this, DrawRectangleHandler);

    return _super.apply(this, arguments);
  }

  _createClass(DrawRectangleHandler, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var result = {
        editAction: null,
        cancelMapPan: false
      };
      var clickSequence = this.getClickSequence();

      if (clickSequence.length === 0) {
        // nothing to do yet
        return result;
      }

      var corner1 = clickSequence[0];
      var corner2 = event.groundCoords; // @ts-ignore

      this._setTentativeFeature((0, _bboxPolygon["default"])([corner1[0], corner1[1], corner2[0], corner2[1]]));

      return result;
    }
  }]);

  return DrawRectangleHandler;
}(_twoClickPolygonHandler.TwoClickPolygonHandler);

exports.DrawRectangleHandler = DrawRectangleHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctcmVjdGFuZ2xlLWhhbmRsZXIudHMiXSwibmFtZXMiOlsiRHJhd1JlY3RhbmdsZUhhbmRsZXIiLCJldmVudCIsInJlc3VsdCIsImVkaXRBY3Rpb24iLCJjYW5jZWxNYXBQYW4iLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsImNvcm5lcjEiLCJjb3JuZXIyIiwiZ3JvdW5kQ29vcmRzIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJUd29DbGlja1BvbHlnb25IYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEsb0I7Ozs7Ozs7Ozs7Ozs7c0NBRVRDLEssRUFDc0U7QUFDdEUsVUFBTUMsTUFBTSxHQUFHO0FBQUVDLFFBQUFBLFVBQVUsRUFBRSxJQUFkO0FBQW9CQyxRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBZjtBQUNBLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUFJRCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxlQUFPTCxNQUFQO0FBQ0Q7O0FBRUQsVUFBTU0sT0FBTyxHQUFHSCxhQUFhLENBQUMsQ0FBRCxDQUE3QjtBQUNBLFVBQU1JLE9BQU8sR0FBR1IsS0FBSyxDQUFDUyxZQUF0QixDQVZzRSxDQVd0RTs7QUFDQSxXQUFLQyxvQkFBTCxDQUEwQiw2QkFBWSxDQUFDSCxPQUFPLENBQUMsQ0FBRCxDQUFSLEVBQWFBLE9BQU8sQ0FBQyxDQUFELENBQXBCLEVBQXlCQyxPQUFPLENBQUMsQ0FBRCxDQUFoQyxFQUFxQ0EsT0FBTyxDQUFDLENBQUQsQ0FBNUMsQ0FBWixDQUExQjs7QUFFQSxhQUFPUCxNQUFQO0FBQ0Q7Ozs7RUFsQnVDVSw4QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiYm94UG9seWdvbiBmcm9tICdAdHVyZi9iYm94LXBvbHlnb24nO1xuaW1wb3J0IHsgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzJztcbmltcG9ydCB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5pbXBvcnQgeyBUd29DbGlja1BvbHlnb25IYW5kbGVyIH0gZnJvbSAnLi90d28tY2xpY2stcG9seWdvbi1oYW5kbGVyJztcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgaGFuZGxlcnMgb25jZSBFZGl0TW9kZSBmdWxseSBpbXBsZW1lbnRlZFxuZXhwb3J0IGNsYXNzIERyYXdSZWN0YW5nbGVIYW5kbGVyIGV4dGVuZHMgVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciB7XG4gIGhhbmRsZVBvaW50ZXJNb3ZlKFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50XG4gICk6IHsgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQ7IGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IGNvcm5lcjEgPSBjbGlja1NlcXVlbmNlWzBdO1xuICAgIGNvbnN0IGNvcm5lcjIgPSBldmVudC5ncm91bmRDb29yZHM7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoYmJveFBvbHlnb24oW2Nvcm5lcjFbMF0sIGNvcm5lcjFbMV0sIGNvcm5lcjJbMF0sIGNvcm5lcjJbMV1dKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=