"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawRectangleUsingThreePointsHandler = void 0;

var _utils = require("../utils");

var _threeClickPolygonHandler = require("./three-click-polygon-handler");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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
var DrawRectangleUsingThreePointsHandler = /*#__PURE__*/function (_ThreeClickPolygonHan) {
  _inherits(DrawRectangleUsingThreePointsHandler, _ThreeClickPolygonHan);

  var _super = _createSuper(DrawRectangleUsingThreePointsHandler);

  function DrawRectangleUsingThreePointsHandler() {
    _classCallCheck(this, DrawRectangleUsingThreePointsHandler);

    return _super.apply(this, arguments);
  }

  _createClass(DrawRectangleUsingThreePointsHandler, [{
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
        var lineString = {
          type: 'LineString',
          coordinates: clickSequence
        };

        var _clickSequence = _slicedToArray(clickSequence, 2),
            p1 = _clickSequence[0],
            p2 = _clickSequence[1];

        var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, groundCoords),
            _generatePointsParall2 = _slicedToArray(_generatePointsParall, 2),
            p3 = _generatePointsParall2[0],
            p4 = _generatePointsParall2[1];

        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[].concat(_toConsumableArray(lineString.coordinates), [p3, p4, p1])]
          }
        });
      }

      return result;
    }
  }]);

  return DrawRectangleUsingThreePointsHandler;
}(_threeClickPolygonHandler.ThreeClickPolygonHandler);

exports.DrawRectangleUsingThreePointsHandler = DrawRectangleUsingThreePointsHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctcmVjdGFuZ2xlLXVzaW5nLXRocmVlLXBvaW50cy1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbIkRyYXdSZWN0YW5nbGVVc2luZ1RocmVlUG9pbnRzSGFuZGxlciIsImV2ZW50IiwicmVzdWx0IiwiZWRpdEFjdGlvbiIsImNhbmNlbE1hcFBhbiIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwibGVuZ3RoIiwiZ3JvdW5kQ29vcmRzIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJ0eXBlIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImxpbmVTdHJpbmciLCJwMSIsInAyIiwicDMiLCJwNCIsIlRocmVlQ2xpY2tQb2x5Z29uSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0lBQ2FBLG9DOzs7Ozs7Ozs7Ozs7O3NDQUVUQyxLLEVBQ3NFO0FBQ3RFLFVBQU1DLE1BQU0sR0FBRztBQUFFQyxRQUFBQSxVQUFVLEVBQUUsSUFBZDtBQUFvQkMsUUFBQUEsWUFBWSxFQUFFO0FBQWxDLE9BQWY7QUFDQSxVQUFNQyxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7O0FBRUEsVUFBSUQsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCO0FBQ0EsZUFBT0wsTUFBUDtBQUNEOztBQUVELFVBQU1NLFlBQVksR0FBR1AsS0FBSyxDQUFDTyxZQUEzQjs7QUFFQSxVQUFJSCxhQUFhLENBQUNFLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUIsYUFBS0Usb0JBQUwsQ0FBMEI7QUFDeEJDLFVBQUFBLElBQUksRUFBRSxTQURrQjtBQUV4QkMsVUFBQUEsUUFBUSxFQUFFO0FBQ1JELFlBQUFBLElBQUksRUFBRSxZQURFO0FBRVJFLFlBQUFBLFdBQVcsRUFBRSxDQUFDUCxhQUFhLENBQUMsQ0FBRCxDQUFkLEVBQW1CRyxZQUFuQjtBQUZMO0FBRmMsU0FBMUI7QUFPRCxPQVJELE1BUU8sSUFBSUgsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQ3JDLFlBQU1NLFVBQXNCLEdBQUc7QUFDN0JILFVBQUFBLElBQUksRUFBRSxZQUR1QjtBQUU3QkUsVUFBQUEsV0FBVyxFQUFFUDtBQUZnQixTQUEvQjs7QUFEcUMsNENBS3BCQSxhQUxvQjtBQUFBLFlBSzlCUyxFQUw4QjtBQUFBLFlBSzFCQyxFQUwwQjs7QUFBQSxvQ0FNcEIsK0NBQW1DRCxFQUFuQyxFQUF1Q0MsRUFBdkMsRUFBMkNQLFlBQTNDLENBTm9CO0FBQUE7QUFBQSxZQU05QlEsRUFOOEI7QUFBQSxZQU0xQkMsRUFOMEI7O0FBUXJDLGFBQUtSLG9CQUFMLENBQTBCO0FBQ3hCQyxVQUFBQSxJQUFJLEVBQUUsU0FEa0I7QUFFeEJDLFVBQUFBLFFBQVEsRUFBRTtBQUNSRCxZQUFBQSxJQUFJLEVBQUUsU0FERTtBQUVSRSxZQUFBQSxXQUFXLEVBQUUsOEJBS05DLFVBQVUsQ0FBQ0QsV0FMTCxJQU1USSxFQU5TLEVBT1RDLEVBUFMsRUFRVEgsRUFSUztBQUZMO0FBRmMsU0FBMUI7QUFpQkQ7O0FBRUQsYUFBT1osTUFBUDtBQUNEOzs7O0VBbER1RGdCLGtEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGluZVN0cmluZyB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgeyBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzJztcbmltcG9ydCB7IEVkaXRBY3Rpb24gfSBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5pbXBvcnQgeyBUaHJlZUNsaWNrUG9seWdvbkhhbmRsZXIgfSBmcm9tICcuL3RocmVlLWNsaWNrLXBvbHlnb24taGFuZGxlcic7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBEcmF3UmVjdGFuZ2xlVXNpbmdUaHJlZVBvaW50c0hhbmRsZXIgZXh0ZW5kcyBUaHJlZUNsaWNrUG9seWdvbkhhbmRsZXIge1xuICBoYW5kbGVQb2ludGVyTW92ZShcbiAgICBldmVudDogUG9pbnRlck1vdmVFdmVudFxuICApOiB7IGVkaXRBY3Rpb246IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkOyBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBub3RoaW5nIHRvIGRvIHlldFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCBncm91bmRDb29yZHMgPSBldmVudC5ncm91bmRDb29yZHM7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbY2xpY2tTZXF1ZW5jZVswXSwgZ3JvdW5kQ29vcmRzXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDIpIHtcbiAgICAgIGNvbnN0IGxpbmVTdHJpbmc6IExpbmVTdHJpbmcgPSB7XG4gICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IGNsaWNrU2VxdWVuY2UsXG4gICAgICB9O1xuICAgICAgY29uc3QgW3AxLCBwMl0gPSBjbGlja1NlcXVlbmNlO1xuICAgICAgY29uc3QgW3AzLCBwNF0gPSBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKHAxLCBwMiwgZ3JvdW5kQ29vcmRzKTtcblxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgLy8gRHJhdyBhIHBvbHlnb24gY29udGFpbmluZyBhbGwgdGhlIHBvaW50cyBvZiB0aGUgTGluZVN0cmluZyxcbiAgICAgICAgICAgICAgLy8gdGhlbiB0aGUgcG9pbnRzIG9ydGhvZ29uYWwgdG8gdGhlIGxpbmVTdHJpbmcsXG4gICAgICAgICAgICAgIC8vIHRoZW4gYmFjayB0byB0aGUgc3RhcnRpbmcgcG9zaXRpb25cbiAgICAgICAgICAgICAgLi4ubGluZVN0cmluZy5jb29yZGluYXRlcyxcbiAgICAgICAgICAgICAgcDMsXG4gICAgICAgICAgICAgIHA0LFxuICAgICAgICAgICAgICBwMSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==