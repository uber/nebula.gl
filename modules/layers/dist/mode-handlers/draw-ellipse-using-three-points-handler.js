"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawEllipseUsingThreePointsHandler = void 0;

var _distance = _interopRequireDefault(require("@turf/distance"));

var _ellipse = _interopRequireDefault(require("@turf/ellipse"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _helpers = require("@turf/helpers");

var _modeHandler = require("./mode-handler");

var _threeClickPolygonHandler = require("./three-click-polygon-handler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
var DrawEllipseUsingThreePointsHandler = /*#__PURE__*/function (_ThreeClickPolygonHan) {
  _inherits(DrawEllipseUsingThreePointsHandler, _ThreeClickPolygonHan);

  var _super = _createSuper(DrawEllipseUsingThreePointsHandler);

  function DrawEllipseUsingThreePointsHandler() {
    _classCallCheck(this, DrawEllipseUsingThreePointsHandler);

    return _super.apply(this, arguments);
  }

  _createClass(DrawEllipseUsingThreePointsHandler, [{
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

      var groundCoords = event.groundCoords;

      if (clickSequence.length === 1) {
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [clickSequence[0], groundCoords]
          }
        });
      } else if (clickSequence.length === 2) {
        var _clickSequence = _slicedToArray(clickSequence, 2),
            p1 = _clickSequence[0],
            p2 = _clickSequence[1];

        var centerCoordinates = (0, _modeHandler.getIntermediatePosition)(p1, p2);
        var xSemiAxis = Math.max((0, _distance["default"])(centerCoordinates, (0, _helpers.point)(groundCoords)), 0.001);
        var ySemiAxis = Math.max((0, _distance["default"])(p1, p2), 0.001) / 2;
        var options = {
          angle: (0, _bearing["default"])(p1, p2)
        }; // @ts-ignore

        this._setTentativeFeature((0, _ellipse["default"])(centerCoordinates, xSemiAxis, ySemiAxis, options));
      }

      return result;
    }
  }]);

  return DrawEllipseUsingThreePointsHandler;
}(_threeClickPolygonHandler.ThreeClickPolygonHandler);

exports.DrawEllipseUsingThreePointsHandler = DrawEllipseUsingThreePointsHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctZWxsaXBzZS11c2luZy10aHJlZS1wb2ludHMtaGFuZGxlci50cyJdLCJuYW1lcyI6WyJEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNIYW5kbGVyIiwiZXZlbnQiLCJyZXN1bHQiLCJlZGl0QWN0aW9uIiwiY2FuY2VsTWFwUGFuIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJncm91bmRDb29yZHMiLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsInR5cGUiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwicDEiLCJwMiIsImNlbnRlckNvb3JkaW5hdGVzIiwieFNlbWlBeGlzIiwiTWF0aCIsIm1heCIsInlTZW1pQXhpcyIsIm9wdGlvbnMiLCJhbmdsZSIsIlRocmVlQ2xpY2tQb2x5Z29uSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0lBQ2FBLGtDOzs7Ozs7Ozs7Ozs7O3NDQUVUQyxLLEVBQ3NFO0FBQ3RFLFVBQU1DLE1BQU0sR0FBRztBQUFFQyxRQUFBQSxVQUFVLEVBQUUsSUFBZDtBQUFvQkMsUUFBQUEsWUFBWSxFQUFFO0FBQWxDLE9BQWY7QUFDQSxVQUFNQyxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7O0FBRUEsVUFBSUQsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCO0FBQ0EsZUFBT0wsTUFBUDtBQUNEOztBQUVELFVBQU1NLFlBQVksR0FBR1AsS0FBSyxDQUFDTyxZQUEzQjs7QUFFQSxVQUFJSCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUIsYUFBS0Usb0JBQUwsQ0FBMEI7QUFDeEJDLFVBQUFBLElBQUksRUFBRSxTQURrQjtBQUV4QkMsVUFBQUEsUUFBUSxFQUFFO0FBQ1JELFlBQUFBLElBQUksRUFBRSxZQURFO0FBRVJFLFlBQUFBLFdBQVcsRUFBRSxDQUFDUCxhQUFhLENBQUMsQ0FBRCxDQUFkLEVBQW1CRyxZQUFuQjtBQUZMO0FBRmMsU0FBMUI7QUFPRCxPQVJELE1BUU8sSUFBSUgsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQUEsNENBQ3BCRixhQURvQjtBQUFBLFlBQzlCUSxFQUQ4QjtBQUFBLFlBQzFCQyxFQUQwQjs7QUFHckMsWUFBTUMsaUJBQWlCLEdBQUcsMENBQXdCRixFQUF4QixFQUE0QkMsRUFBNUIsQ0FBMUI7QUFDQSxZQUFNRSxTQUFTLEdBQUdDLElBQUksQ0FBQ0MsR0FBTCxDQUFTLDBCQUFTSCxpQkFBVCxFQUE0QixvQkFBTVAsWUFBTixDQUE1QixDQUFULEVBQTJELEtBQTNELENBQWxCO0FBQ0EsWUFBTVcsU0FBUyxHQUFHRixJQUFJLENBQUNDLEdBQUwsQ0FBUywwQkFBU0wsRUFBVCxFQUFhQyxFQUFiLENBQVQsRUFBMkIsS0FBM0IsSUFBb0MsQ0FBdEQ7QUFDQSxZQUFNTSxPQUFPLEdBQUc7QUFBRUMsVUFBQUEsS0FBSyxFQUFFLHlCQUFRUixFQUFSLEVBQVlDLEVBQVo7QUFBVCxTQUFoQixDQU5xQyxDQU9yQzs7QUFDQSxhQUFLTCxvQkFBTCxDQUEwQix5QkFBUU0saUJBQVIsRUFBMkJDLFNBQTNCLEVBQXNDRyxTQUF0QyxFQUFpREMsT0FBakQsQ0FBMUI7QUFDRDs7QUFFRCxhQUFPbEIsTUFBUDtBQUNEOzs7O0VBbENxRG9CLGtEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcbmltcG9ydCBlbGxpcHNlIGZyb20gJ0B0dXJmL2VsbGlwc2UnO1xuaW1wb3J0IGJlYXJpbmcgZnJvbSAnQHR1cmYvYmVhcmluZyc7XG5pbXBvcnQgeyBwb2ludCB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHsgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzJztcbmltcG9ydCB7IEVkaXRBY3Rpb24sIGdldEludGVybWVkaWF0ZVBvc2l0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXInO1xuaW1wb3J0IHsgVGhyZWVDbGlja1BvbHlnb25IYW5kbGVyIH0gZnJvbSAnLi90aHJlZS1jbGljay1wb2x5Z29uLWhhbmRsZXInO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgRHJhd0VsbGlwc2VVc2luZ1RocmVlUG9pbnRzSGFuZGxlciBleHRlbmRzIFRocmVlQ2xpY2tQb2x5Z29uSGFuZGxlciB7XG4gIGhhbmRsZVBvaW50ZXJNb3ZlKFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50XG4gICk6IHsgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQ7IGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IGdyb3VuZENvb3JkcyA9IGV2ZW50Lmdyb3VuZENvb3JkcztcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtjbGlja1NlcXVlbmNlWzBdLCBncm91bmRDb29yZHNdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMikge1xuICAgICAgY29uc3QgW3AxLCBwMl0gPSBjbGlja1NlcXVlbmNlO1xuXG4gICAgICBjb25zdCBjZW50ZXJDb29yZGluYXRlcyA9IGdldEludGVybWVkaWF0ZVBvc2l0aW9uKHAxLCBwMik7XG4gICAgICBjb25zdCB4U2VtaUF4aXMgPSBNYXRoLm1heChkaXN0YW5jZShjZW50ZXJDb29yZGluYXRlcywgcG9pbnQoZ3JvdW5kQ29vcmRzKSksIDAuMDAxKTtcbiAgICAgIGNvbnN0IHlTZW1pQXhpcyA9IE1hdGgubWF4KGRpc3RhbmNlKHAxLCBwMiksIDAuMDAxKSAvIDI7XG4gICAgICBjb25zdCBvcHRpb25zID0geyBhbmdsZTogYmVhcmluZyhwMSwgcDIpIH07XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKGVsbGlwc2UoY2VudGVyQ29vcmRpbmF0ZXMsIHhTZW1pQXhpcywgeVNlbWlBeGlzLCBvcHRpb25zKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19