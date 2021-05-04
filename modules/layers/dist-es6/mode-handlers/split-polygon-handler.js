"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SplitPolygonHandler = void 0;

var _booleanPointInPolygon = _interopRequireDefault(require("@turf/boolean-point-in-polygon"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _buffer = _interopRequireDefault(require("@turf/buffer"));

var _lineIntersect = _interopRequireDefault(require("@turf/line-intersect"));

var _helpers = require("@turf/helpers");

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _destination = _interopRequireDefault(require("@turf/destination"));

var _polygonToLine = _interopRequireDefault(require("@turf/polygon-to-line"));

var _nearestPointOnLine = _interopRequireDefault(require("@turf/nearest-point-on-line"));

var _utils = require("../utils");

var _modeHandler = require("./mode-handler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
var SplitPolygonHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(SplitPolygonHandler, _ModeHandler);

  var _super = _createSuper(SplitPolygonHandler);

  function SplitPolygonHandler() {
    _classCallCheck(this, SplitPolygonHandler);

    return _super.apply(this, arguments);
  }

  _createClass(SplitPolygonHandler, [{
    key: "calculateGroundCoords",
    value: function calculateGroundCoords(clickSequence, groundCoords) {
      var modeConfig = this.getModeConfig();

      if (!modeConfig || !modeConfig.lock90Degree || !clickSequence.length) {
        return groundCoords;
      }

      if (clickSequence.length === 1) {
        // if first point is clicked, then find closest polygon point and build ~90deg vector
        var firstPoint = clickSequence[0];
        var selectedGeometry = this.getSelectedGeometry(); // @ts-ignore

        var feature = (0, _polygonToLine["default"])(selectedGeometry);
        var lines = feature.type === 'FeatureCollection' ? feature.features : [feature];
        var minDistance = Number.MAX_SAFE_INTEGER;
        var closestPoint = null; // If Multipolygon, then we should find nearest polygon line and stick split to it.

        lines.forEach(function (line) {
          var snapPoint = (0, _nearestPointOnLine["default"])(line, firstPoint);
          var distanceFromOrigin = (0, _distance["default"])(snapPoint, firstPoint);

          if (minDistance > distanceFromOrigin) {
            minDistance = distanceFromOrigin;
            closestPoint = snapPoint;
          }
        });

        if (closestPoint) {
          // closest point is used as 90degree entry to the polygon
          var lastBearing = (0, _bearing["default"])(firstPoint, closestPoint);
          var currentDistance = (0, _distance["default"])(firstPoint, groundCoords, {
            units: 'meters'
          });
          return (0, _destination["default"])(firstPoint, currentDistance, lastBearing, {
            units: 'meters'
          }).geometry.coordinates;
        }

        return groundCoords;
      } // Allow only 90 degree turns


      var lastPoint = clickSequence[clickSequence.length - 1];

      var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(clickSequence[clickSequence.length - 2], lastPoint, groundCoords),
          _generatePointsParall2 = _slicedToArray(_generatePointsParall, 1),
          approximatePoint = _generatePointsParall2[0]; // align point with current ground


      var nearestPt = (0, _nearestPointOnLine["default"])((0, _helpers.lineString)([lastPoint, approximatePoint]), groundCoords).geometry.coordinates;
      return nearestPt;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(SplitPolygonHandler.prototype), "handleClick", this).call(this, _objectSpread({}, event, {
        groundCoords: this.calculateGroundCoords(this.getClickSequence(), event.groundCoords)
      }));

      var editAction = null;
      var tentativeFeature = this.getTentativeFeature();
      var selectedGeometry = this.getSelectedGeometry();
      var clickSequence = this.getClickSequence();

      if (!selectedGeometry) {
        // eslint-disable-next-line no-console,no-undef
        console.warn('A polygon must be selected for splitting');

        this._setTentativeFeature(null);

        return editAction;
      }

      var pt = {
        type: 'Point',
        coordinates: clickSequence[clickSequence.length - 1]
      }; // @ts-ignore

      var isPointInPolygon = (0, _booleanPointInPolygon["default"])(pt, selectedGeometry);

      if (clickSequence.length > 1 && tentativeFeature && !isPointInPolygon) {
        this.resetClickSequence(); // @ts-ignore

        var isLineInterectingWithPolygon = (0, _lineIntersect["default"])(tentativeFeature, selectedGeometry);

        if (isLineInterectingWithPolygon.features.length === 0) {
          this._setTentativeFeature(null);

          return editAction;
        }

        return this.splitPolygon();
      }

      return editAction;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(_ref) {
      var groundCoords = _ref.groundCoords;
      var clickSequence = this.getClickSequence();
      var result = {
        editAction: null,
        cancelMapPan: false
      };

      if (clickSequence.length === 0) {
        // nothing to do yet
        return result;
      }

      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [].concat(_toConsumableArray(clickSequence), [this.calculateGroundCoords(clickSequence, groundCoords)])
        }
      });

      return result;
    }
  }, {
    key: "splitPolygon",
    value: function splitPolygon() {
      var selectedGeometry = this.getSelectedGeometry();
      var tentativeFeature = this.getTentativeFeature();
      var featureIndex = this.getSelectedFeatureIndexes()[0];
      var modeConfig = this.getModeConfig() || {}; // Default gap in between the polygon

      var _modeConfig$gap = modeConfig.gap,
          gap = _modeConfig$gap === void 0 ? 0.1 : _modeConfig$gap,
          _modeConfig$units = modeConfig.units,
          units = _modeConfig$units === void 0 ? 'centimeters' : _modeConfig$units;

      if (gap === 0) {
        gap = 0.1;
        units = 'centimeters';
      } // @ts-ignore


      var buffer = (0, _buffer["default"])(tentativeFeature, gap, {
        units: units
      }); // @ts-ignore

      var updatedGeometry = (0, _difference["default"])(selectedGeometry, buffer);

      this._setTentativeFeature(null);

      if (!updatedGeometry) {
        // eslint-disable-next-line no-console,no-undef
        console.warn('Canceling edit. Split Polygon erased');
        return null;
      }

      var _updatedGeometry$geom = updatedGeometry.geometry,
          type = _updatedGeometry$geom.type,
          coordinates = _updatedGeometry$geom.coordinates;
      var updatedCoordinates = [];

      if (type === 'Polygon') {
        // Update the coordinates as per Multipolygon
        // @ts-ignore
        updatedCoordinates = coordinates.map(function (c) {
          return [c];
        });
      } else {
        // Handle Case when Multipolygon has holes
        // @ts-ignore
        updatedCoordinates = coordinates.reduce(function (agg, prev) {
          prev.forEach(function (p) {
            agg.push([p]);
          });
          return agg;
        }, []);
      } // Update the type to Mulitpolygon


      var updatedData = this.getImmutableFeatureCollection().replaceGeometry(featureIndex, {
        type: 'MultiPolygon',
        coordinates: updatedCoordinates
      });
      var editAction = {
        updatedData: updatedData.getObject(),
        editType: 'split',
        featureIndexes: [featureIndex],
        editContext: null
      };
      return editAction;
    }
  }]);

  return SplitPolygonHandler;
}(_modeHandler.ModeHandler);

exports.SplitPolygonHandler = SplitPolygonHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3NwbGl0LXBvbHlnb24taGFuZGxlci50cyJdLCJuYW1lcyI6WyJTcGxpdFBvbHlnb25IYW5kbGVyIiwiY2xpY2tTZXF1ZW5jZSIsImdyb3VuZENvb3JkcyIsIm1vZGVDb25maWciLCJnZXRNb2RlQ29uZmlnIiwibG9jazkwRGVncmVlIiwibGVuZ3RoIiwiZmlyc3RQb2ludCIsInNlbGVjdGVkR2VvbWV0cnkiLCJnZXRTZWxlY3RlZEdlb21ldHJ5IiwiZmVhdHVyZSIsImxpbmVzIiwidHlwZSIsImZlYXR1cmVzIiwibWluRGlzdGFuY2UiLCJOdW1iZXIiLCJNQVhfU0FGRV9JTlRFR0VSIiwiY2xvc2VzdFBvaW50IiwiZm9yRWFjaCIsImxpbmUiLCJzbmFwUG9pbnQiLCJkaXN0YW5jZUZyb21PcmlnaW4iLCJsYXN0QmVhcmluZyIsImN1cnJlbnREaXN0YW5jZSIsInVuaXRzIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImxhc3RQb2ludCIsImFwcHJveGltYXRlUG9pbnQiLCJuZWFyZXN0UHQiLCJldmVudCIsImNhbGN1bGF0ZUdyb3VuZENvb3JkcyIsImdldENsaWNrU2VxdWVuY2UiLCJlZGl0QWN0aW9uIiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjb25zb2xlIiwid2FybiIsIl9zZXRUZW50YXRpdmVGZWF0dXJlIiwicHQiLCJpc1BvaW50SW5Qb2x5Z29uIiwicmVzZXRDbGlja1NlcXVlbmNlIiwiaXNMaW5lSW50ZXJlY3RpbmdXaXRoUG9seWdvbiIsInNwbGl0UG9seWdvbiIsInJlc3VsdCIsImNhbmNlbE1hcFBhbiIsImZlYXR1cmVJbmRleCIsImdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJnYXAiLCJidWZmZXIiLCJ1cGRhdGVkR2VvbWV0cnkiLCJ1cGRhdGVkQ29vcmRpbmF0ZXMiLCJtYXAiLCJjIiwicmVkdWNlIiwiYWdnIiwicHJldiIsInAiLCJwdXNoIiwidXBkYXRlZERhdGEiLCJnZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiIsInJlcGxhY2VHZW9tZXRyeSIsImdldE9iamVjdCIsImVkaXRUeXBlIiwiZmVhdHVyZUluZGV4ZXMiLCJlZGl0Q29udGV4dCIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEsbUI7Ozs7Ozs7Ozs7Ozs7MENBQ1dDLGEsRUFBb0JDLFksRUFBbUI7QUFDM0QsVUFBTUMsVUFBVSxHQUFHLEtBQUtDLGFBQUwsRUFBbkI7O0FBQ0EsVUFBSSxDQUFDRCxVQUFELElBQWUsQ0FBQ0EsVUFBVSxDQUFDRSxZQUEzQixJQUEyQyxDQUFDSixhQUFhLENBQUNLLE1BQTlELEVBQXNFO0FBQ3BFLGVBQU9KLFlBQVA7QUFDRDs7QUFDRCxVQUFJRCxhQUFhLENBQUNLLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxZQUFNQyxVQUFVLEdBQUdOLGFBQWEsQ0FBQyxDQUFELENBQWhDO0FBQ0EsWUFBTU8sZ0JBQWdCLEdBQUcsS0FBS0MsbUJBQUwsRUFBekIsQ0FIOEIsQ0FJOUI7O0FBQ0EsWUFBTUMsT0FBTyxHQUFHLCtCQUFrQkYsZ0JBQWxCLENBQWhCO0FBRUEsWUFBTUcsS0FBSyxHQUFHRCxPQUFPLENBQUNFLElBQVIsS0FBaUIsbUJBQWpCLEdBQXVDRixPQUFPLENBQUNHLFFBQS9DLEdBQTBELENBQUNILE9BQUQsQ0FBeEU7QUFDQSxZQUFJSSxXQUFXLEdBQUdDLE1BQU0sQ0FBQ0MsZ0JBQXpCO0FBQ0EsWUFBSUMsWUFBWSxHQUFHLElBQW5CLENBVDhCLENBVTlCOztBQUNBTixRQUFBQSxLQUFLLENBQUNPLE9BQU4sQ0FBYyxVQUFDQyxJQUFELEVBQVU7QUFDdEIsY0FBTUMs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WUFBckQsRUFBbUU7QUFDckZsQyxRQUFBQSxJQUFJLEVBQUUsY0FEK0U7QUFFckZjLFFBQUFBLFdBQVcsRUFBRXlCO0FBRndFLE9BQW5FLENBQXBCO0FBS0EsVUFBTWxCLFVBQXNCLEdBQUc7QUFDN0IwQixRQUFBQSxXQUFXLEVBQUVBLFdBQVcsQ0FBQ0csU0FBWixFQURnQjtBQUU3QkMsUUFBQUEsUUFBUSxFQUFFLE9BRm1CO0FBRzdCQyxRQUFBQSxjQUFjLEVBQUUsQ0FBQ2xCLFlBQUQsQ0FIYTtBQUk3Qm1CLFFBQUFBLFdBQVcsRUFBRTtBQUpnQixPQUEvQjtBQU9BLGFBQU9oQyxVQUFQO0FBQ0Q7Ozs7RUFqS3NDaUMsd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYm9vbGVhblBvaW50SW5Qb2x5Z29uIGZyb20gJ0B0dXJmL2Jvb2xlYW4tcG9pbnQtaW4tcG9seWdvbic7XG5pbXBvcnQgdHVyZkRpZmZlcmVuY2UgZnJvbSAnQHR1cmYvZGlmZmVyZW5jZSc7XG5pbXBvcnQgdHVyZkJ1ZmZlciBmcm9tICdAdHVyZi9idWZmZXInO1xuaW1wb3J0IGxpbmVJbnRlcnNlY3QgZnJvbSAnQHR1cmYvbGluZS1pbnRlcnNlY3QnO1xuaW1wb3J0IHsgbGluZVN0cmluZyB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHR1cmZCZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgdHVyZkRlc3RpbmF0aW9uIGZyb20gJ0B0dXJmL2Rlc3RpbmF0aW9uJztcbmltcG9ydCB0dXJmUG9seWdvblRvTGluZSBmcm9tICdAdHVyZi9wb2x5Z29uLXRvLWxpbmUnO1xuaW1wb3J0IG5lYXJlc3RQb2ludE9uTGluZSBmcm9tICdAdHVyZi9uZWFyZXN0LXBvaW50LW9uLWxpbmUnO1xuaW1wb3J0IHsgZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IENsaWNrRXZlbnQsIFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcyc7XG5pbXBvcnQgeyBFZGl0QWN0aW9uLCBNb2RlSGFuZGxlciB9IGZyb20gJy4vbW9kZS1oYW5kbGVyJztcblxuLy8gVE9ETyBlZGl0LW1vZGVzOiBkZWxldGUgaGFuZGxlcnMgb25jZSBFZGl0TW9kZSBmdWxseSBpbXBsZW1lbnRlZFxuZXhwb3J0IGNsYXNzIFNwbGl0UG9seWdvbkhhbmRsZXIgZXh0ZW5kcyBNb2RlSGFuZGxlciB7XG4gIGNhbGN1bGF0ZUdyb3VuZENvb3JkcyhjbGlja1NlcXVlbmNlOiBhbnksIGdyb3VuZENvb3JkczogYW55KSB7XG4gICAgY29uc3QgbW9kZUNvbmZpZyA9IHRoaXMuZ2V0TW9kZUNvbmZpZygpO1xuICAgIGlmICghbW9kZUNvbmZpZyB8fCAhbW9kZUNvbmZpZy5sb2NrOTBEZWdyZWUgfHwgIWNsaWNrU2VxdWVuY2UubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZ3JvdW5kQ29vcmRzO1xuICAgIH1cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIGlmIGZpcnN0IHBvaW50IGlzIGNsaWNrZWQsIHRoZW4gZmluZCBjbG9zZXN0IHBvbHlnb24gcG9pbnQgYW5kIGJ1aWxkIH45MGRlZyB2ZWN0b3JcbiAgICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBjbGlja1NlcXVlbmNlWzBdO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRHZW9tZXRyeSgpO1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgZmVhdHVyZSA9IHR1cmZQb2x5Z29uVG9MaW5lKHNlbGVjdGVkR2VvbWV0cnkpO1xuXG4gICAgICBjb25zdCBsaW5lcyA9IGZlYXR1cmUudHlwZSA9PT0gJ0ZlYXR1cmVDb2xsZWN0aW9uJyA/IGZlYXR1cmUuZmVhdHVyZXMgOiBbZmVhdHVyZV07XG4gICAgICBsZXQgbWluRGlzdGFuY2UgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICAgIGxldCBjbG9zZXN0UG9pbnQgPSBudWxsO1xuICAgICAgLy8gSWYgTXVsdGlwb2x5Z29uLCB0aGVuIHdlIHNob3VsZCBmaW5kIG5lYXJlc3QgcG9seWdvbiBsaW5lIGFuZCBzdGljayBzcGxpdCB0byBpdC5cbiAgICAgIGxpbmVzLmZvckVhY2goKGxpbmUpID0+IHtcbiAgICAgICAgY29uc3Qgc25hcFBvaW50ID0gbmVhcmVzdFBvaW50T25MaW5lKGxpbmUsIGZpcnN0UG9pbnQpO1xuICAgICAgICBjb25zdCBkaXN0YW5jZUZyb21PcmlnaW4gPSB0dXJmRGlzdGFuY2Uoc25hcFBvaW50LCBmaXJzdFBvaW50KTtcbiAgICAgICAgaWYgKG1pbkRpc3RhbmNlID4gZGlzdGFuY2VGcm9tT3JpZ2luKSB7XG4gICAgICAgICAgbWluRGlzdGFuY2UgPSBkaXN0YW5jZUZyb21PcmlnaW47XG4gICAgICAgICAgY2xvc2VzdFBvaW50ID0gc25hcFBvaW50O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNsb3Nlc3RQb2ludCkge1xuICAgICAgICAvLyBjbG9zZXN0IHBvaW50IGlzIHVzZWQgYXMgOTBkZWdyZWUgZW50cnkgdG8gdGhlIHBvbHlnb25cbiAgICAgICAgY29uc3QgbGFzdEJlYXJpbmcgPSB0dXJmQmVhcmluZyhmaXJzdFBvaW50LCBjbG9zZXN0UG9pbnQpO1xuICAgICAgICBjb25zdCBjdXJyZW50RGlzdGFuY2UgPSB0dXJmRGlzdGFuY2UoZmlyc3RQb2ludCwgZ3JvdW5kQ29vcmRzLCB7IHVuaXRzOiAnbWV0ZXJzJyB9KTtcbiAgICAgICAgcmV0dXJuIHR1cmZEZXN0aW5hdGlvbihmaXJzdFBvaW50LCBjdXJyZW50RGlzdGFuY2UsIGxhc3RCZWFyaW5nLCB7XG4gICAgICAgICAgdW5pdHM6ICdtZXRlcnMnLFxuICAgICAgICB9KS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBncm91bmRDb29yZHM7XG4gICAgfVxuICAgIC8vIEFsbG93IG9ubHkgOTAgZGVncmVlIHR1cm5zXG4gICAgY29uc3QgbGFzdFBvaW50ID0gY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IFthcHByb3hpbWF0ZVBvaW50XSA9IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMoXG4gICAgICBjbGlja1NlcXVlbmNlW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMl0sXG4gICAgICBsYXN0UG9pbnQsXG4gICAgICBncm91bmRDb29yZHNcbiAgICApO1xuICAgIC8vIGFsaWduIHBvaW50IHdpdGggY3VycmVudCBncm91bmRcbiAgICBjb25zdCBuZWFyZXN0UHQgPSBuZWFyZXN0UG9pbnRPbkxpbmUobGluZVN0cmluZyhbbGFzdFBvaW50LCBhcHByb3hpbWF0ZVBvaW50XSksIGdyb3VuZENvb3JkcylcbiAgICAgIC5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICByZXR1cm4gbmVhcmVzdFB0O1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgc3VwZXIuaGFuZGxlQ2xpY2soe1xuICAgICAgLi4uZXZlbnQsXG4gICAgICBncm91bmRDb29yZHM6IHRoaXMuY2FsY3VsYXRlR3JvdW5kQ29vcmRzKHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpLCBldmVudC5ncm91bmRDb29yZHMpLFxuICAgIH0pO1xuICAgIGNvbnN0IGVkaXRBY3Rpb246IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkID0gbnVsbDtcbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRHZW9tZXRyeSgpO1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmICghc2VsZWN0ZWRHZW9tZXRyeSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIGNvbnNvbGUud2FybignQSBwb2x5Z29uIG11c3QgYmUgc2VsZWN0ZWQgZm9yIHNwbGl0dGluZycpO1xuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgIH1cbiAgICBjb25zdCBwdCA9IHtcbiAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICBjb29yZGluYXRlczogY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdLFxuICAgIH07XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGlzUG9pbnRJblBvbHlnb24gPSBib29sZWFuUG9pbnRJblBvbHlnb24ocHQsIHNlbGVjdGVkR2VvbWV0cnkpO1xuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA+IDEgJiYgdGVudGF0aXZlRmVhdHVyZSAmJiAhaXNQb2ludEluUG9seWdvbikge1xuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IGlzTGluZUludGVyZWN0aW5nV2l0aFBvbHlnb24gPSBsaW5lSW50ZXJzZWN0KHRlbnRhdGl2ZUZlYXR1cmUsIHNlbGVjdGVkR2VvbWV0cnkpO1xuICAgICAgaWYgKGlzTGluZUludGVyZWN0aW5nV2l0aFBvbHlnb24uZmVhdHVyZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUobnVsbCk7XG4gICAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuc3BsaXRQb2x5Z29uKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZSh7XG4gICAgZ3JvdW5kQ29vcmRzLFxuICB9OiBQb2ludGVyTW92ZUV2ZW50KTogeyBlZGl0QWN0aW9uOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZDsgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICBjb25zdCByZXN1bHQgPSB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbLi4uY2xpY2tTZXF1ZW5jZSwgdGhpcy5jYWxjdWxhdGVHcm91bmRDb29yZHMoY2xpY2tTZXF1ZW5jZSwgZ3JvdW5kQ29vcmRzKV0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHNwbGl0UG9seWdvbigpIHtcbiAgICBjb25zdCBzZWxlY3RlZEdlb21ldHJ5ID0gdGhpcy5nZXRTZWxlY3RlZEdlb21ldHJ5KCk7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlRmVhdHVyZSgpO1xuICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpWzBdO1xuICAgIGNvbnN0IG1vZGVDb25maWcgPSB0aGlzLmdldE1vZGVDb25maWcoKSB8fCB7fTtcblxuICAgIC8vIERlZmF1bHQgZ2FwIGluIGJldHdlZW4gdGhlIHBvbHlnb25cbiAgICBsZXQgeyBnYXAgPSAwLjEsIHVuaXRzID0gJ2NlbnRpbWV0ZXJzJyB9ID0gbW9kZUNvbmZpZztcbiAgICBpZiAoZ2FwID09PSAwKSB7XG4gICAgICBnYXAgPSAwLjE7XG4gICAgICB1bml0cyA9ICdjZW50aW1ldGVycyc7XG4gICAgfVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBidWZmZXIgPSB0dXJmQnVmZmVyKHRlbnRhdGl2ZUZlYXR1cmUsIGdhcCwgeyB1bml0cyB9KTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgdXBkYXRlZEdlb21ldHJ5ID0gdHVyZkRpZmZlcmVuY2Uoc2VsZWN0ZWRHZW9tZXRyeSwgYnVmZmVyKTtcbiAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgIGlmICghdXBkYXRlZEdlb21ldHJ5KSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgY29uc29sZS53YXJuKCdDYW5jZWxpbmcgZWRpdC4gU3BsaXQgUG9seWdvbiBlcmFzZWQnKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdHlwZSwgY29vcmRpbmF0ZXMgfSA9IHVwZGF0ZWRHZW9tZXRyeS5nZW9tZXRyeTtcbiAgICBsZXQgdXBkYXRlZENvb3JkaW5hdGVzID0gW107XG4gICAgaWYgKHR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgLy8gVXBkYXRlIHRoZSBjb29yZGluYXRlcyBhcyBwZXIgTXVsdGlwb2x5Z29uXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB1cGRhdGVkQ29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcy5tYXAoKGMpID0+IFtjXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEhhbmRsZSBDYXNlIHdoZW4gTXVsdGlwb2x5Z29uIGhhcyBob2xlc1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdXBkYXRlZENvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXMucmVkdWNlKChhZ2csIHByZXYpID0+IHtcbiAgICAgICAgcHJldi5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgYWdnLnB1c2goW3BdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhZ2c7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSB0eXBlIHRvIE11bGl0cG9seWdvblxuICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpLnJlcGxhY2VHZW9tZXRyeShmZWF0dXJlSW5kZXgsIHtcbiAgICAgIHR5cGU6ICdNdWx0aVBvbHlnb24nLFxuICAgICAgY29vcmRpbmF0ZXM6IHVwZGF0ZWRDb29yZGluYXRlcyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGVkaXRBY3Rpb246IEVkaXRBY3Rpb24gPSB7XG4gICAgICB1cGRhdGVkRGF0YTogdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCksXG4gICAgICBlZGl0VHlwZTogJ3NwbGl0JyxcbiAgICAgIGZlYXR1cmVJbmRleGVzOiBbZmVhdHVyZUluZGV4XSxcbiAgICAgIGVkaXRDb250ZXh0OiBudWxsLFxuICAgIH07XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxufVxuIl19