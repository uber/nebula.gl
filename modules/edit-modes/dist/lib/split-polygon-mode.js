"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SplitPolygonMode = void 0;

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

var _geojsonEditMode = require("./geojson-edit-mode");

var _immutableFeatureCollection = require("./immutable-feature-collection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var SplitPolygonMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(SplitPolygonMode, _GeoJsonEditMode);

  var _super = _createSuper(SplitPolygonMode);

  function SplitPolygonMode() {
    _classCallCheck(this, SplitPolygonMode);

    return _super.apply(this, arguments);
  }

  _createClass(SplitPolygonMode, [{
    key: "calculateMapCoords",
    value: function calculateMapCoords(clickSequence, mapCoords, props) {
      var modeConfig = props.modeConfig;

      if (!modeConfig || !modeConfig.lock90Degree || !clickSequence.length) {
        return mapCoords;
      }

      if (clickSequence.length === 1) {
        // if first point is clicked, then find closest polygon point and build ~90deg vector
        var firstPoint = clickSequence[0];
        var selectedGeometry = this.getSelectedGeometry(props); // @ts-ignore

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
          var currentDistance = (0, _distance["default"])(firstPoint, mapCoords, {
            units: 'meters'
          });
          return (0, _destination["default"])(firstPoint, currentDistance, lastBearing, {
            units: 'meters'
          }).geometry.coordinates;
        }

        return mapCoords;
      } // Allow only 90 degree turns


      var lastPoint = clickSequence[clickSequence.length - 1];

      var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(clickSequence[clickSequence.length - 2], lastPoint, mapCoords),
          _generatePointsParall2 = _slicedToArray(_generatePointsParall, 1),
          approximatePoint = _generatePointsParall2[0]; // align point with current ground


      var nearestPt = (0, _nearestPointOnLine["default"])((0, _helpers.lineString)([lastPoint, approximatePoint]), mapCoords).geometry.coordinates;
      return nearestPt;
    }
  }, {
    key: "getGuides",
    value: function getGuides(props) {
      var clickSequence = this.getClickSequence();
      var guides = {
        type: 'FeatureCollection',
        features: []
      };

      if (clickSequence.length === 0 || !props.lastPointerMoveEvent) {
        // nothing to do yet
        return guides;
      }

      var mapCoords = props.lastPointerMoveEvent.mapCoords;
      guides.features.push({
        type: 'Feature',
        properties: {
          guideType: 'tentative'
        },
        geometry: {
          type: 'LineString',
          coordinates: [].concat(_toConsumableArray(clickSequence), [this.calculateMapCoords(clickSequence, mapCoords, props)])
        }
      });
      return guides;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event, props) {
      var tentativeFeature = this.getTentativeGuide(props);
      var selectedGeometry = this.getSelectedGeometry(props);

      if (!selectedGeometry) {
        // eslint-disable-next-line no-console,no-undef
        console.warn('A polygon must be selected for splitting');
        return;
      }

      var clickSequence = this.getClickSequence();

      if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
        clickSequence.push(tentativeFeature.geometry.coordinates[tentativeFeature.geometry.coordinates.length - 1]);
      } else {
        this.addClickSequence(event);
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
          return;
        }

        var editAction = this.splitPolygon(tentativeFeature, props);

        if (editAction) {
          props.onEdit(editAction);
        }
      }
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      props.onUpdateCursor('cell');
    }
  }, {
    key: "splitPolygon",
    value: function splitPolygon(tentativeFeature, props) {
      var selectedGeometry = this.getSelectedGeometry(props);
      var featureIndex = props.selectedIndexes[0];
      var modeConfig = props.modeConfig || {}; // Default gap in between the polygon

      var _modeConfig$gap = modeConfig.gap,
          gap = _modeConfig$gap === void 0 ? 0.1 : _modeConfig$gap,
          _modeConfig$units = modeConfig.units,
          units = _modeConfig$units === void 0 ? 'centimeters' : _modeConfig$units;

      if (gap === 0) {
        gap = 0.1;
        units = 'centimeters';
      }

      var buffer = (0, _buffer["default"])(tentativeFeature, gap, {
        units: units
      }); // @ts-ignore

      var updatedGeometry = (0, _difference["default"])(selectedGeometry, buffer);

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


      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replaceGeometry(featureIndex, {
        type: 'MultiPolygon',
        coordinates: updatedCoordinates
      });
      var editAction = {
        updatedData: updatedData.getObject(),
        editType: 'split',
        editContext: {
          featureIndexes: [featureIndex]
        }
      };
      return editAction;
    }
  }]);

  return SplitPolygonMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.SplitPolygonMode = SplitPolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvc3BsaXQtcG9seWdvbi1tb2RlLnRzIl0sIm5hbWVzIjpbIlNwbGl0UG9seWdvbk1vZGUiLCJjbGlja1NlcXVlbmNlIiwibWFwQ29vcmRzIiwicHJvcHMiLCJtb2RlQ29uZmlnIiwibG9jazkwRGVncmVlIiwibGVuZ3RoIiwiZmlyc3RQb2ludCIsInNlbGVjdGVkR2VvbWV0cnkiLCJnZXRTZWxlY3RlZEdlb21ldHJ5IiwiZmVhdHVyZSIsImxpbmVzIiwidHlwZSIsImZlYXR1cmVzIiwibWluRGlzdGFuY2UiLCJOdW1iZXIiLCJNQVhfU0FGRV9JTlRFR0VSIiwiY2xvc2VzdFBvaW50IiwiZm9yRWFjaCIsImxpbmUiLCJzbmFwUG9pbnQiLCJkaXN0YW5jZUZyb21PcmlnaW4iLCJsYXN0QmVhcmluZyIsImN1cnJlbnREaXN0YW5jZSIsInVuaXRzIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsImxhc3RQb2ludCIsImFwcHJveGltYXRlUG9pbnQiLCJuZWFyZXN0UHQiLCJnZXRDbGlja1NlcXVlbmNlIiwiZ3VpZGVzIiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJwdXNoIiwicHJvcGVydGllcyIsImd1aWRlVHlwZSIsImNhbGN1bGF0ZU1hcENvb3JkcyIsImV2ZW50IiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUd1aWRlIiwiY29uc29sZSIsIndhcm4iLCJhZGRDbGlja1NlcXVlbmNlIiwicHQiLCJpc1BvaW50SW5Qb2x5Z29uIiwicmVzZXRDbGlja1NlcXVlbmNlIiwiaXNMaW5lSW50ZXJlY3RpbmdXaXRoUG9seWdvbiIsImVkaXRBY3Rpb24iLCJzcGxpdFBvbHlnb24iLCJvbkVkaXQiLCJvblVwZGF0ZUN1cnNvciIsImZlYXR1cmVJbmRleCIsInNlbGVjdGVkSW5kZXhlcyIsImdhcCIsImJ1ZmZlciIsInVwZGF0ZWRHZW9tZXRyeSIsInVwZGF0ZWRDb29yZGluYXRlcyIsIm1hcCIsImMiLCJyZWR1Y2UiLCJhZ2ciLCJwcmV2IiwicCIsInVwZGF0ZWREYXRhIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJkYXRhIiwicmVwbGFjZUdlb21ldHJ5IiwiZ2V0T2JqZWN0IiwiZWRpdFR5cGUiLCJlZGl0Q29udGV4dCIsImZlYXR1cmVJbmRleGVzIiwiR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBU0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsZ0I7Ozs7Ozs7Ozs7Ozs7dUNBQ1FDLGEsRUFBb0JDLFMsRUFBZ0JDLEssRUFBcUM7QUFDMUYsVUFBTUMsVUFBVSxHQUFHRCxLQUFLLENBQUNDLFVBQXpCOztBQUNBLFVBQUksQ0FBQ0EsVUFBRCxJQUFlLENBQUNBLFVBQVUsQ0FBQ0MsWUFBM0IsSUFBMkMsQ0FBQ0osYUFBYSxDQUFDSyxNQUE5RCxFQUFzRTtBQUNwRSxlQUFPSixTQUFQO0FBQ0Q7O0FBQ0QsVUFBSUQsYUFBYSxDQUFDSyxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCO0FBQ0EsWUFBTUMsVUFBVSxHQUFHTixhQUFhLENBQUMsQ0FBRCxDQUFoQztBQUNBLFlBQU1PLGdCQUFnQixHQUFHLEtBQUtDLG1CQUFMLENBQXlCTixLQUF6QixDQUF6QixDQUg4QixDQUk5Qjs7QUFDQSxZQUFNTyxPQUFPLEdBQUcsK0JBQWtCRixnQkFBbEIsQ0FBaEI7QUFFQSxZQUFNRyxLQUFLLEdBQUdELE9BQU8sQ0FBQ0UsSUFBUixLQUFpQixtQkFBakIsR0FBdUNGLE9BQU8sQ0FBQ0csUUFBL0MsR0FBMEQsQ0FBQ0gsT0FBRCxDQUF4RTtBQUNBLFlBQUlJLFdBQVcsR0FBR0MsTUFBTSxDQUFDQyxnQkFBekI7QUFDQSxZQUFJQyxZQUFZLEdBQUcsSUFBbkIsQ0FUOEIsQ0FVOUI7O0FBQ0FOLFFBQUFBLEtBQUssQ0FBQ08sT0FB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QjtBQUNBO0FBQ0E0QyxRQUFBQSxrQkFBa0IsR0FBRzlCLFdBQVcsQ0FBQytCLEdBQVosQ0FBZ0IsVUFBQ0MsQ0FBRDtBQUFBLGlCQUFPLENBQUNBLENBQUQsQ0FBUDtBQUFBLFNBQWhCLENBQXJCO0FBQ0QsT0FKRCxNQUlPO0FBQ0w7QUFDQTtBQUNBRixRQUFBQSxrQkFBa0IsR0FBRzlCLFdBQVcsQ0FBQ2lDLE1BQVosQ0FBbUIsVUFBQ0MsR0FBRCxFQUFNQyxJQUFOLEVBQWU7QUFDckRBLFVBQUFBLElBQUksQ0FBQzNDLE9BQUwsQ0FBYSxVQUFDNEMsQ0FBRCxFQUFPO0FBQ2xCRixZQUFBQSxHQUFHLENBQUMzQixJQUFKLENBQVMsQ0FBQzZCLENBQUQsQ0FBVDtBQUNELFdBRkQ7QUFHQSxpQkFBT0YsR0FBUDtBQUNELFNBTG9CLEVBS2xCLEVBTGtCLENBQXJCO0FBTUQsT0FwQ21GLENBc0NwRjs7O0FBQ0EsVUFBTUcsV0FBVyxHQUFHLElBQUlDLHNEQUFKLENBQStCN0QsS0FBSyxDQUFDOEQsSUFBckMsRUFBMkNDLGVBQTNDLENBQTJEZixZQUEzRCxFQUF5RTtBQUMzRnZDLFFBQUFBLElBQUksRUFBRSxjQURxRjtBQUUzRmMsUUFBQUEsV0FBVyxFQUFFOEI7QUFGOEUsT0FBekUsQ0FBcEI7QUFLQSxVQUFNVCxVQUE2QixHQUFHO0FBQ3BDZ0IsUUFBQUEsV0FBVyxFQUFFQSxXQUFXLENBQUNJLFNBQVosRUFEdUI7QUFFcENDLFFBQUFBLFFBQVEsRUFBRSxPQUYwQjtBQUdwQ0MsUUFBQUEsV0FBVyxFQUFFO0FBQ1hDLFVBQUFBLGNBQWMsRUFBRSxDQUFDbkIsWUFBRDtBQURMO0FBSHVCLE9BQXRDO0FBUUEsYUFBT0osVUFBUDtBQUNEOzs7O0VBakxtQ3dCLGdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJvb2xlYW5Qb2ludEluUG9seWdvbiBmcm9tICdAdHVyZi9ib29sZWFuLXBvaW50LWluLXBvbHlnb24nO1xuaW1wb3J0IHR1cmZEaWZmZXJlbmNlIGZyb20gJ0B0dXJmL2RpZmZlcmVuY2UnO1xuaW1wb3J0IHR1cmZCdWZmZXIgZnJvbSAnQHR1cmYvYnVmZmVyJztcbmltcG9ydCBsaW5lSW50ZXJzZWN0IGZyb20gJ0B0dXJmL2xpbmUtaW50ZXJzZWN0JztcbmltcG9ydCB7IGxpbmVTdHJpbmcgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB0dXJmQmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCB0dXJmRGlzdGFuY2UgZnJvbSAnQHR1cmYvZGlzdGFuY2UnO1xuaW1wb3J0IHR1cmZEZXN0aW5hdGlvbiBmcm9tICdAdHVyZi9kZXN0aW5hdGlvbic7XG5pbXBvcnQgdHVyZlBvbHlnb25Ub0xpbmUgZnJvbSAnQHR1cmYvcG9seWdvbi10by1saW5lJztcbmltcG9ydCBuZWFyZXN0UG9pbnRPbkxpbmUgZnJvbSAnQHR1cmYvbmVhcmVzdC1wb2ludC1vbi1saW5lJztcbmltcG9ydCB7IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMnO1xuaW1wb3J0IHtcbiAgQ2xpY2tFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgTW9kZVByb3BzLFxuICBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uLFxuICBUZW50YXRpdmVGZWF0dXJlLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBHZW9Kc29uRWRpdE1vZGUsIEdlb0pzb25FZGl0QWN0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZSc7XG5pbXBvcnQgeyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4vaW1tdXRhYmxlLWZlYXR1cmUtY29sbGVjdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBTcGxpdFBvbHlnb25Nb2RlIGV4dGVuZHMgR2VvSnNvbkVkaXRNb2RlIHtcbiAgY2FsY3VsYXRlTWFwQ29vcmRzKGNsaWNrU2VxdWVuY2U6IGFueSwgbWFwQ29vcmRzOiBhbnksIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgY29uc3QgbW9kZUNvbmZpZyA9IHByb3BzLm1vZGVDb25maWc7XG4gICAgaWYgKCFtb2RlQ29uZmlnIHx8ICFtb2RlQ29uZmlnLmxvY2s5MERlZ3JlZSB8fCAhY2xpY2tTZXF1ZW5jZS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBtYXBDb29yZHM7XG4gICAgfVxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gaWYgZmlyc3QgcG9pbnQgaXMgY2xpY2tlZCwgdGhlbiBmaW5kIGNsb3Nlc3QgcG9seWdvbiBwb2ludCBhbmQgYnVpbGQgfjkwZGVnIHZlY3RvclxuICAgICAgY29uc3QgZmlyc3RQb2ludCA9IGNsaWNrU2VxdWVuY2VbMF07XG4gICAgICBjb25zdCBzZWxlY3RlZEdlb21ldHJ5ID0gdGhpcy5nZXRTZWxlY3RlZEdlb21ldHJ5KHByb3BzKTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IGZlYXR1cmUgPSB0dXJmUG9seWdvblRvTGluZShzZWxlY3RlZEdlb21ldHJ5KTtcblxuICAgICAgY29uc3QgbGluZXMgPSBmZWF0dXJlLnR5cGUgPT09ICdGZWF0dXJlQ29sbGVjdGlvbicgPyBmZWF0dXJlLmZlYXR1cmVzIDogW2ZlYXR1cmVdO1xuICAgICAgbGV0IG1pbkRpc3RhbmNlID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgICBsZXQgY2xvc2VzdFBvaW50ID0gbnVsbDtcbiAgICAgIC8vIElmIE11bHRpcG9seWdvbiwgdGhlbiB3ZSBzaG91bGQgZmluZCBuZWFyZXN0IHBvbHlnb24gbGluZSBhbmQgc3RpY2sgc3BsaXQgdG8gaXQuXG4gICAgICBsaW5lcy5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgICAgIGNvbnN0IHNuYXBQb2ludCA9IG5lYXJlc3RQb2ludE9uTGluZShsaW5lLCBmaXJzdFBvaW50KTtcbiAgICAgICAgY29uc3QgZGlzdGFuY2VGcm9tT3JpZ2luID0gdHVyZkRpc3RhbmNlKHNuYXBQb2ludCwgZmlyc3RQb2ludCk7XG4gICAgICAgIGlmIChtaW5EaXN0YW5jZSA+IGRpc3RhbmNlRnJvbU9yaWdpbikge1xuICAgICAgICAgIG1pbkRpc3RhbmNlID0gZGlzdGFuY2VGcm9tT3JpZ2luO1xuICAgICAgICAgIGNsb3Nlc3RQb2ludCA9IHNuYXBQb2ludDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChjbG9zZXN0UG9pbnQpIHtcbiAgICAgICAgLy8gY2xvc2VzdCBwb2ludCBpcyB1c2VkIGFzIDkwZGVncmVlIGVudHJ5IHRvIHRoZSBwb2x5Z29uXG4gICAgICAgIGNvbnN0IGxhc3RCZWFyaW5nID0gdHVyZkJlYXJpbmcoZmlyc3RQb2ludCwgY2xvc2VzdFBvaW50KTtcbiAgICAgICAgY29uc3QgY3VycmVudERpc3RhbmNlID0gdHVyZkRpc3RhbmNlKGZpcnN0UG9pbnQsIG1hcENvb3JkcywgeyB1bml0czogJ21ldGVycycgfSk7XG4gICAgICAgIHJldHVybiB0dXJmRGVzdGluYXRpb24oZmlyc3RQb2ludCwgY3VycmVudERpc3RhbmNlLCBsYXN0QmVhcmluZywge1xuICAgICAgICAgIHVuaXRzOiAnbWV0ZXJzJyxcbiAgICAgICAgfSkuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFwQ29vcmRzO1xuICAgIH1cbiAgICAvLyBBbGxvdyBvbmx5IDkwIGRlZ3JlZSB0dXJuc1xuICAgIGNvbnN0IGxhc3RQb2ludCA9IGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBbYXBwcm94aW1hdGVQb2ludF0gPSBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKFxuICAgICAgY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDJdLFxuICAgICAgbGFzdFBvaW50LFxuICAgICAgbWFwQ29vcmRzXG4gICAgKTtcbiAgICAvLyBhbGlnbiBwb2ludCB3aXRoIGN1cnJlbnQgZ3JvdW5kXG4gICAgY29uc3QgbmVhcmVzdFB0ID0gbmVhcmVzdFBvaW50T25MaW5lKGxpbmVTdHJpbmcoW2xhc3RQb2ludCwgYXBwcm94aW1hdGVQb2ludF0pLCBtYXBDb29yZHMpXG4gICAgICAuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgcmV0dXJuIG5lYXJlc3RQdDtcbiAgfVxuXG4gIGdldEd1aWRlcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGNvbnN0IGd1aWRlczogR3VpZGVGZWF0dXJlQ29sbGVjdGlvbiA9IHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogW10sXG4gICAgfTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCB8fCAhcHJvcHMubGFzdFBvaW50ZXJNb3ZlRXZlbnQpIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gZ3VpZGVzO1xuICAgIH1cblxuICAgIGNvbnN0IHsgbWFwQ29vcmRzIH0gPSBwcm9wcy5sYXN0UG9pbnRlck1vdmVFdmVudDtcblxuICAgIGd1aWRlcy5mZWF0dXJlcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ3VpZGVUeXBlOiAndGVudGF0aXZlJyxcbiAgICAgIH0sXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBbLi4uY2xpY2tTZXF1ZW5jZSwgdGhpcy5jYWxjdWxhdGVNYXBDb29yZHMoY2xpY2tTZXF1ZW5jZSwgbWFwQ29vcmRzLCBwcm9wcyldLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiBndWlkZXM7XG4gIH1cblxuICBoYW5kbGVDbGljayhldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVHdWlkZShwcm9wcyk7XG5cbiAgICBjb25zdCBzZWxlY3RlZEdlb21ldHJ5ID0gdGhpcy5nZXRTZWxlY3RlZEdlb21ldHJ5KHByb3BzKTtcblxuICAgIGlmICghc2VsZWN0ZWRHZW9tZXRyeSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIGNvbnNvbGUud2FybignQSBwb2x5Z29uIG11c3QgYmUgc2VsZWN0ZWQgZm9yIHNwbGl0dGluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgY2xpY2tTZXF1ZW5jZS5wdXNoKFxuICAgICAgICB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzW3RlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkQ2xpY2tTZXF1ZW5jZShldmVudCk7XG4gICAgfVxuXG4gICAgY29uc3QgcHQgPSB7XG4gICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgY29vcmRpbmF0ZXM6IGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXSxcbiAgICB9O1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBpc1BvaW50SW5Qb2x5Z29uID0gYm9vbGVhblBvaW50SW5Qb2x5Z29uKHB0LCBzZWxlY3RlZEdlb21ldHJ5KTtcbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPiAxICYmIHRlbnRhdGl2ZUZlYXR1cmUgJiYgIWlzUG9pbnRJblBvbHlnb24pIHtcbiAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCBpc0xpbmVJbnRlcmVjdGluZ1dpdGhQb2x5Z29uID0gbGluZUludGVyc2VjdCh0ZW50YXRpdmVGZWF0dXJlLCBzZWxlY3RlZEdlb21ldHJ5KTtcbiAgICAgIGlmIChpc0xpbmVJbnRlcmVjdGluZ1dpdGhQb2x5Z29uLmZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVkaXRBY3Rpb24gPSB0aGlzLnNwbGl0UG9seWdvbih0ZW50YXRpdmVGZWF0dXJlLCBwcm9wcyk7XG5cbiAgICAgIGlmIChlZGl0QWN0aW9uKSB7XG4gICAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcignY2VsbCcpO1xuICB9XG5cbiAgc3BsaXRQb2x5Z29uKHRlbnRhdGl2ZUZlYXR1cmU6IFRlbnRhdGl2ZUZlYXR1cmUsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRHZW9tZXRyeShwcm9wcyk7XG4gICAgY29uc3QgZmVhdHVyZUluZGV4ID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzWzBdO1xuICAgIGNvbnN0IG1vZGVDb25maWcgPSBwcm9wcy5tb2RlQ29uZmlnIHx8IHt9O1xuXG4gICAgLy8gRGVmYXVsdCBnYXAgaW4gYmV0d2VlbiB0aGUgcG9seWdvblxuICAgIGxldCB7IGdhcCA9IDAuMSwgdW5pdHMgPSAnY2VudGltZXRlcnMnIH0gPSBtb2RlQ29uZmlnO1xuICAgIGlmIChnYXAgPT09IDApIHtcbiAgICAgIGdhcCA9IDAuMTtcbiAgICAgIHVuaXRzID0gJ2NlbnRpbWV0ZXJzJztcbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXIgPSB0dXJmQnVmZmVyKHRlbnRhdGl2ZUZlYXR1cmUsIGdhcCwgeyB1bml0cyB9KTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgdXBkYXRlZEdlb21ldHJ5ID0gdHVyZkRpZmZlcmVuY2Uoc2VsZWN0ZWRHZW9tZXRyeSwgYnVmZmVyKTtcbiAgICBpZiAoIXVwZGF0ZWRHZW9tZXRyeSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgIGNvbnNvbGUud2FybignQ2FuY2VsaW5nIGVkaXQuIFNwbGl0IFBvbHlnb24gZXJhc2VkJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7IHR5cGUsIGNvb3JkaW5hdGVzIH0gPSB1cGRhdGVkR2VvbWV0cnkuZ2VvbWV0cnk7XG4gICAgbGV0IHVwZGF0ZWRDb29yZGluYXRlcyA9IFtdO1xuICAgIGlmICh0eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgIC8vIFVwZGF0ZSB0aGUgY29vcmRpbmF0ZXMgYXMgcGVyIE11bHRpcG9seWdvblxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdXBkYXRlZENvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXMubWFwKChjKSA9PiBbY10pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBIYW5kbGUgQ2FzZSB3aGVuIE11bHRpcG9seWdvbiBoYXMgaG9sZXNcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHVwZGF0ZWRDb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzLnJlZHVjZSgoYWdnLCBwcmV2KSA9PiB7XG4gICAgICAgIHByZXYuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgICAgIGFnZy5wdXNoKFtwXSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYWdnO1xuICAgICAgfSwgW10pO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgdHlwZSB0byBNdWxpdHBvbHlnb25cbiAgICBjb25zdCB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKS5yZXBsYWNlR2VvbWV0cnkoZmVhdHVyZUluZGV4LCB7XG4gICAgICB0eXBlOiAnTXVsdGlQb2x5Z29uJyxcbiAgICAgIGNvb3JkaW5hdGVzOiB1cGRhdGVkQ29vcmRpbmF0ZXMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBlZGl0QWN0aW9uOiBHZW9Kc29uRWRpdEFjdGlvbiA9IHtcbiAgICAgIHVwZGF0ZWREYXRhOiB1cGRhdGVkRGF0YS5nZXRPYmplY3QoKSxcbiAgICAgIGVkaXRUeXBlOiAnc3BsaXQnLFxuICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtmZWF0dXJlSW5kZXhdLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cbn1cbiJdfQ==