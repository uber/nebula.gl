"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawRectangleUsingThreePointsMode = void 0;

var _utils = require("../utils");

var _threeClickPolygonMode = require("./three-click-polygon-mode");

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

var DrawRectangleUsingThreePointsMode = /*#__PURE__*/function (_ThreeClickPolygonMod) {
  _inherits(DrawRectangleUsingThreePointsMode, _ThreeClickPolygonMod);

  var _super = _createSuper(DrawRectangleUsingThreePointsMode);

  function DrawRectangleUsingThreePointsMode() {
    _classCallCheck(this, DrawRectangleUsingThreePointsMode);

    return _super.apply(this, arguments);
  }

  _createClass(DrawRectangleUsingThreePointsMode, [{
    key: "getThreeClickPolygon",
    value: function getThreeClickPolygon(coord1, coord2, coord3, modeConfig) {
      var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(coord1, coord2, coord3),
          _generatePointsParall2 = _slicedToArray(_generatePointsParall, 2),
          p3 = _generatePointsParall2[0],
          p4 = _generatePointsParall2[1];

      return {
        type: 'Feature',
        properties: {
          shape: 'Rectangle'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[// Draw a polygon containing all the points of the LineString,
          // then the points orthogonal to the lineString,
          // then back to the starting position
          coord1, coord2, p3, p4, coord1]]
        }
      };
    }
  }]);

  return DrawRectangleUsingThreePointsMode;
}(_threeClickPolygonMode.ThreeClickPolygonMode);

exports.DrawRectangleUsingThreePointsMode = DrawRectangleUsingThreePointsMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1yZWN0YW5nbGUtdXNpbmctdGhyZWUtcG9pbnRzLW1vZGUudHMiXSwibmFtZXMiOlsiRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNNb2RlIiwiY29vcmQxIiwiY29vcmQyIiwiY29vcmQzIiwibW9kZUNvbmZpZyIsInAzIiwicDQiLCJ0eXBlIiwicHJvcGVydGllcyIsInNoYXBlIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsIlRocmVlQ2xpY2tQb2x5Z29uTW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsaUM7Ozs7Ozs7Ozs7Ozs7eUNBRVRDLE0sRUFDQUMsTSxFQUNBQyxNLEVBQ0FDLFUsRUFDdUM7QUFBQSxrQ0FDdEIsK0NBQW1DSCxNQUFuQyxFQUEyQ0MsTUFBM0MsRUFBbURDLE1BQW5ELENBRHNCO0FBQUE7QUFBQSxVQUNoQ0UsRUFEZ0M7QUFBQSxVQUM1QkMsRUFENEI7O0FBR3ZDLGFBQU87QUFDTEMsUUFBQUEsSUFBSSxFQUFFLFNBREQ7QUFFTEMsUUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLFVBQUFBLEtBQUssRUFBRTtBQURHLFNBRlA7QUFLTEMsUUFBQUEsUUFBUSxFQUFFO0FBQ1JILFVBQUFBLElBQUksRUFBRSxTQURFO0FBRVJJLFVBQUFBLFdBQVcsRUFBRSxDQUNYLENBQ0U7QUFDQTtBQUNBO0FBQ0FWLFVBQUFBLE1BSkYsRUFLRUMsTUFMRixFQU1FRyxFQU5GLEVBT0VDLEVBUEYsRUFRRUwsTUFSRixDQURXO0FBRkw7QUFMTCxPQUFQO0FBcUJEOzs7O0VBOUJvRFcsNEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgUG9zaXRpb24sIFBvbHlnb24sIEZlYXR1cmVPZiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMnO1xuaW1wb3J0IHsgVGhyZWVDbGlja1BvbHlnb25Nb2RlIH0gZnJvbSAnLi90aHJlZS1jbGljay1wb2x5Z29uLW1vZGUnO1xuXG5leHBvcnQgY2xhc3MgRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNNb2RlIGV4dGVuZHMgVGhyZWVDbGlja1BvbHlnb25Nb2RlIHtcbiAgZ2V0VGhyZWVDbGlja1BvbHlnb24oXG4gICAgY29vcmQxOiBQb3NpdGlvbixcbiAgICBjb29yZDI6IFBvc2l0aW9uLFxuICAgIGNvb3JkMzogUG9zaXRpb24sXG4gICAgbW9kZUNvbmZpZzogYW55XG4gICk6IEZlYXR1cmVPZjxQb2x5Z29uPiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IFtwMywgcDRdID0gZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyhjb29yZDEsIGNvb3JkMiwgY29vcmQzKTtcblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNoYXBlOiAnUmVjdGFuZ2xlJyxcbiAgICAgIH0sXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgLy8gRHJhdyBhIHBvbHlnb24gY29udGFpbmluZyBhbGwgdGhlIHBvaW50cyBvZiB0aGUgTGluZVN0cmluZyxcbiAgICAgICAgICAgIC8vIHRoZW4gdGhlIHBvaW50cyBvcnRob2dvbmFsIHRvIHRoZSBsaW5lU3RyaW5nLFxuICAgICAgICAgICAgLy8gdGhlbiBiYWNrIHRvIHRoZSBzdGFydGluZyBwb3NpdGlvblxuICAgICAgICAgICAgY29vcmQxLFxuICAgICAgICAgICAgY29vcmQyLFxuICAgICAgICAgICAgcDMsXG4gICAgICAgICAgICBwNCxcbiAgICAgICAgICAgIGNvb3JkMSxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=