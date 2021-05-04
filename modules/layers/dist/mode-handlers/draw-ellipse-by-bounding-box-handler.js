"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawEllipseByBoundingBoxHandler = void 0;

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _ellipse = _interopRequireDefault(require("@turf/ellipse"));

var _helpers = require("@turf/helpers");

var _modeHandler = require("./mode-handler");

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
var DrawEllipseByBoundingBoxHandler = /*#__PURE__*/function (_TwoClickPolygonHandl) {
  _inherits(DrawEllipseByBoundingBoxHandler, _TwoClickPolygonHandl);

  var _super = _createSuper(DrawEllipseByBoundingBoxHandler);

  function DrawEllipseByBoundingBoxHandler() {
    _classCallCheck(this, DrawEllipseByBoundingBoxHandler);

    return _super.apply(this, arguments);
  }

  _createClass(DrawEllipseByBoundingBoxHandler, [{
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
      var corner2 = event.groundCoords;
      var minX = Math.min(corner1[0], corner2[0]);
      var minY = Math.min(corner1[1], corner2[1]);
      var maxX = Math.max(corner1[0], corner2[0]);
      var maxY = Math.max(corner1[1], corner2[1]);
      var polygonPoints = (0, _bboxPolygon["default"])([minX, minY, maxX, maxY]).geometry.coordinates[0];
      var centerCoordinates = (0, _modeHandler.getIntermediatePosition)(corner1, corner2);
      var xSemiAxis = Math.max((0, _distance["default"])((0, _helpers.point)(polygonPoints[0]), (0, _helpers.point)(polygonPoints[1])), 0.001);
      var ySemiAxis = Math.max((0, _distance["default"])((0, _helpers.point)(polygonPoints[0]), (0, _helpers.point)(polygonPoints[3])), 0.001); // @ts-ignore

      this._setTentativeFeature((0, _ellipse["default"])(centerCoordinates, xSemiAxis, ySemiAxis));

      return result;
    }
  }]);

  return DrawEllipseByBoundingBoxHandler;
}(_twoClickPolygonHandler.TwoClickPolygonHandler);

exports.DrawEllipseByBoundingBoxHandler = DrawEllipseByBoundingBoxHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctZWxsaXBzZS1ieS1ib3VuZGluZy1ib3gtaGFuZGxlci50cyJdLCJuYW1lcyI6WyJEcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3hIYW5kbGVyIiwiZXZlbnQiLCJyZXN1bHQiLCJlZGl0QWN0aW9uIiwiY2FuY2VsTWFwUGFuIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJjb3JuZXIxIiwiY29ybmVyMiIsImdyb3VuZENvb3JkcyIsIm1pblgiLCJNYXRoIiwibWluIiwibWluWSIsIm1heFgiLCJtYXgiLCJtYXhZIiwicG9seWdvblBvaW50cyIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJjZW50ZXJDb29yZGluYXRlcyIsInhTZW1pQXhpcyIsInlTZW1pQXhpcyIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwiVHdvQ2xpY2tQb2x5Z29uSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0lBQ2FBLCtCOzs7Ozs7Ozs7Ozs7O3NDQUVUQyxLLEVBQ3NFO0FBQ3RFLFVBQU1DLE1BQU0sR0FBRztBQUFFQyxRQUFBQSxVQUFVLEVBQUUsSUFBZDtBQUFvQkMsUUFBQUEsWUFBWSxFQUFFO0FBQWxDLE9BQWY7QUFDQSxVQUFNQyxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7O0FBRUEsVUFBSUQsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCO0FBQ0EsZUFBT0wsTUFBUDtBQUNEOztBQUVELFVBQU1NLE9BQU8sR0FBR0gsYUFBYSxDQUFDLENBQUQsQ0FBN0I7QUFDQSxVQUFNSSxPQUFPLEdBQUdSLEtBQUssQ0FBQ1MsWUFBdEI7QUFFQSxVQUFNQyxJQUFJLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTTCxPQUFPLENBQUMsQ0FBRCxDQUFoQixFQUFxQkMsT0FBTyxDQUFDLENBQUQsQ0FBNUIsQ0FBYjtBQUNBLFVBQU1LLElBQUksR0FBR0YsSUFBSSxDQUFDQyxHQUFMLENBQVNMLE9BQU8sQ0FBQyxDQUFELENBQWhCLEVBQXFCQyxPQUFPLENBQUMsQ0FBRCxDQUE1QixDQUFiO0FBQ0EsVUFBTU0sSUFBSSxHQUFHSCxJQUFJLENBQUNJLEdBQUwsQ0FBU1IsT0FBTyxDQUFDLENBQUQsQ0FBaEIsRUFBcUJDLE9BQU8sQ0FBQyxDQUFELENBQTVCLENBQWI7QUFDQSxVQUFNUSxJQUFJLEdBQUdMLElBQUksQ0FBQ0ksR0FBTCxDQUFTUixPQUFPLENBQUMsQ0FBRCxDQUFoQixFQUFxQkMsT0FBTyxDQUFDLENBQUQsQ0FBNUIsQ0FBYjtBQUVBLFVBQU1TLGFBQWEsR0FBRyw2QkFBWSxDQUFDUCxJQUFELEVBQU9HLElBQVAsRUFBYUMsSUFBYixFQUFtQkUsSUFBbkIsQ0FBWixFQUFzQ0UsUUFBdEMsQ0FBK0NDLFdBQS9DLENBQTJELENBQTNELENBQXRCO0FBQ0EsVUFBTUMsaUJBQWlCLEdBQUcsMENBQXdCYixPQUF4QixFQUFpQ0MsT0FBakMsQ0FBMUI7QUFFQSxVQUFNYSxTQUFTLEdBQUdWLElBQUksQ0FBQ0ksR0FBTCxDQUFTLDBCQUFTLG9CQUFNRSxhQUFhLENBQUMsQ0FBRCxDQUFuQixDQUFULEVBQWtDLG9CQUFNQSxhQUFhLENBQUMsQ0FBRCxDQUFuQixDQUFsQyxDQUFULEVBQXFFLEtBQXJFLENBQWxCO0FBQ0EsVUFBTUssU0FBUyxHQUFHWCxJQUFJLENBQUNJLEdBQUwsQ0FBUywwQkFBUyxvQkFBTUUsYUFBYSxDQUFDLENBQUQsQ0FBbkIsQ0FBVCxFQUFrQyxvQkFBTUEsYUFBYSxDQUFDLENBQUQsQ0FBbkIsQ0FBbEMsQ0FBVCxFQUFxRSxLQUFyRSxDQUFsQixDQXJCc0UsQ0FzQnRFOztBQUNBLFdBQUtNLG9CQUFMLENBQTBCLHlCQUFRSCxpQkFBUixFQUEyQkMsU0FBM0IsRUFBc0NDLFNBQXRDLENBQTFCOztBQUVBLGFBQU9yQixNQUFQO0FBQ0Q7Ozs7RUE3QmtEdUIsOEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmJveFBvbHlnb24gZnJvbSAnQHR1cmYvYmJveC1wb2x5Z29uJztcbmltcG9ydCBkaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgZWxsaXBzZSBmcm9tICdAdHVyZi9lbGxpcHNlJztcbmltcG9ydCB7IHBvaW50IH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgeyBQb2ludGVyTW92ZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMnO1xuaW1wb3J0IHsgRWRpdEFjdGlvbiwgZ2V0SW50ZXJtZWRpYXRlUG9zaXRpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5pbXBvcnQgeyBUd29DbGlja1BvbHlnb25IYW5kbGVyIH0gZnJvbSAnLi90d28tY2xpY2stcG9seWdvbi1oYW5kbGVyJztcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgaGFuZGxlcnMgb25jZSBFZGl0TW9kZSBmdWxseSBpbXBsZW1lbnRlZFxuZXhwb3J0IGNsYXNzIERyYXdFbGxpcHNlQnlCb3VuZGluZ0JveEhhbmRsZXIgZXh0ZW5kcyBUd29DbGlja1BvbHlnb25IYW5kbGVyIHtcbiAgaGFuZGxlUG9pbnRlck1vdmUoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnRcbiAgKTogeyBlZGl0QWN0aW9uOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZDsgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29uc3QgY29ybmVyMSA9IGNsaWNrU2VxdWVuY2VbMF07XG4gICAgY29uc3QgY29ybmVyMiA9IGV2ZW50Lmdyb3VuZENvb3JkcztcblxuICAgIGNvbnN0IG1pblggPSBNYXRoLm1pbihjb3JuZXIxWzBdLCBjb3JuZXIyWzBdKTtcbiAgICBjb25zdCBtaW5ZID0gTWF0aC5taW4oY29ybmVyMVsxXSwgY29ybmVyMlsxXSk7XG4gICAgY29uc3QgbWF4WCA9IE1hdGgubWF4KGNvcm5lcjFbMF0sIGNvcm5lcjJbMF0pO1xuICAgIGNvbnN0IG1heFkgPSBNYXRoLm1heChjb3JuZXIxWzFdLCBjb3JuZXIyWzFdKTtcblxuICAgIGNvbnN0IHBvbHlnb25Qb2ludHMgPSBiYm94UG9seWdvbihbbWluWCwgbWluWSwgbWF4WCwgbWF4WV0pLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdO1xuICAgIGNvbnN0IGNlbnRlckNvb3JkaW5hdGVzID0gZ2V0SW50ZXJtZWRpYXRlUG9zaXRpb24oY29ybmVyMSwgY29ybmVyMik7XG5cbiAgICBjb25zdCB4U2VtaUF4aXMgPSBNYXRoLm1heChkaXN0YW5jZShwb2ludChwb2x5Z29uUG9pbnRzWzBdKSwgcG9pbnQocG9seWdvblBvaW50c1sxXSkpLCAwLjAwMSk7XG4gICAgY29uc3QgeVNlbWlBeGlzID0gTWF0aC5tYXgoZGlzdGFuY2UocG9pbnQocG9seWdvblBvaW50c1swXSksIHBvaW50KHBvbHlnb25Qb2ludHNbM10pKSwgMC4wMDEpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKGVsbGlwc2UoY2VudGVyQ29vcmRpbmF0ZXMsIHhTZW1pQXhpcywgeVNlbWlBeGlzKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=