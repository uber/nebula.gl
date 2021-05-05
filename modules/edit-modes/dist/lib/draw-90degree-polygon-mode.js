"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Draw90DegreePolygonMode = void 0;

var _destination = _interopRequireDefault(require("@turf/destination"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _lineIntersect = _interopRequireDefault(require("@turf/line-intersect"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _helpers = require("@turf/helpers");

var _utils = require("../utils");

var _geojsonEditMode = require("./geojson-edit-mode");

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

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Draw90DegreePolygonMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(Draw90DegreePolygonMode, _GeoJsonEditMode);

  var _super = _createSuper(Draw90DegreePolygonMode);

  function Draw90DegreePolygonMode() {
    _classCallCheck(this, Draw90DegreePolygonMode);

    return _super.apply(this, arguments);
  }

  _createClass(Draw90DegreePolygonMode, [{
    key: "createTentativeFeature",
    value: function createTentativeFeature(props) {
      var clickSequence = this.getClickSequence();
      var mapCoords = props.lastPointerMoveEvent.mapCoords;
      var p3;

      if (clickSequence.length === 1) {
        p3 = mapCoords;
      } else {
        var p1 = clickSequence[clickSequence.length - 2];
        var p2 = clickSequence[clickSequence.length - 1];

        var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, mapCoords);

        var _generatePointsParall2 = _slicedToArray(_generatePointsParall, 1);

        p3 = _generatePointsParall2[0];
      }

      var tentativeFeature;

      if (clickSequence.length < 3) {
        // Draw a LineString connecting all the clicked points with the hovered point
        tentativeFeature = {
          type: 'Feature',
          properties: {
            guideType: 'tentative'
          },
          geometry: {
            type: 'LineString',
            coordinates: [].concat(_toConsumableArray(clickSequence), [p3])
          }
        };
      } else {
        // Draw a Polygon connecting all the clicked points with the hovered point
        tentativeFeature = {
          type: 'Feature',
          properties: {
            guideType: 'tentative'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[].concat(_toConsumableArray(clickSequence), [p3, clickSequence[0]])]
          }
        };
      }

      return tentativeFeature;
    }
  }, {
    key: "getGuides",
    value: function getGuides(props) {
      var guides = {
        type: 'FeatureCollection',
        features: []
      };
      var clickSequence = this.getClickSequence();

      if (clickSequence.length === 0 || !props.lastPointerMoveEvent) {
        return guides;
      }

      var tentativeFeature = this.createTentativeFeature(props);
      guides.features.push(tentativeFeature);
      guides.features = guides.features.concat((0, _utils.getEditHandlesForGeometry)(tentativeFeature.geometry, -1)); // Slice off the handles that are are next to the pointer

      guides.features = guides.features.slice(0, -1);
      return guides;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      props.onUpdateCursor('cell');

      _get(_getPrototypeOf(Draw90DegreePolygonMode.prototype), "handlePointerMove", this).call(this, event, props);
    }
  }, {
    key: "handleClick",
    value: function handleClick(event, props) {
      var picks = event.picks;
      var tentativeFeature = this.getTentativeGuide(props);
      this.addClickSequence(event);
      var clickSequence = this.getClickSequence();

      if (!tentativeFeature) {
        // nothing else to do
        return;
      }

      if (clickSequence.length === 3 && tentativeFeature.geometry.type === 'LineString') {
        var lineString = tentativeFeature.geometry; // Tweak the clicked position to be the snapped 90 degree point along the polygon

        clickSequence[clickSequence.length - 1] = lineString.coordinates[lineString.coordinates.length - 1];
      } else if (clickSequence.length > 3 && tentativeFeature.geometry.type === 'Polygon') {
        var polygon = tentativeFeature.geometry; // Tweak the clicked position to be the snapped 90 degree point along the polygon

        clickSequence[clickSequence.length - 1] = polygon.coordinates[0][polygon.coordinates[0].length - 2];
        var clickedEditHandle = (0, _utils.getPickedEditHandle)(picks);

        if (clickedEditHandle && Array.isArray(clickedEditHandle.properties.positionIndexes) && (clickedEditHandle.properties.positionIndexes[1] === 0 || clickedEditHandle.properties.positionIndexes[1] === polygon.coordinates[0].length - 3)) {
          // They clicked the first or last point (or double-clicked), so complete the polygon
          var polygonToAdd = {
            type: 'Polygon',
            coordinates: this.finalizedCoordinates(_toConsumableArray(polygon.coordinates[0]))
          };
          this.resetClickSequence();
          var editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);

          if (editAction) {
            props.onEdit(editAction);
          }
        }
      } // Trigger pointer move right away in order for it to update edit handles (to support double-click)


      var fakePointerMoveEvent = {
        screenCoords: [-1, -1],
        mapCoords: event.mapCoords,
        picks: [],
        pointerDownPicks: null,
        pointerDownScreenCoords: null,
        pointerDownMapCoords: null,
        cancelPan: function cancelPan() {},
        sourceEvent: null
      };
      this.handlePointerMove(fakePointerMoveEvent, props);
    }
  }, {
    key: "finalizedCoordinates",
    value: function finalizedCoordinates(coords) {
      // Remove the hovered position
      var coordinates = [[].concat(_toConsumableArray(coords.slice(0, -2)), [coords[0]])];
      var pt = this.getIntermediatePoint(_toConsumableArray(coords));

      if (!pt) {
        // if intermediate point with 90 degree not available
        // try remove the last clicked point and get the intermediate point.
        var tc = _toConsumableArray(coords);

        tc.splice(-3, 1);
        pt = this.getIntermediatePoint(_toConsumableArray(tc));

        if (pt) {
          coordinates = [[].concat(_toConsumableArray(coords.slice(0, -3)), [pt, coords[0]])];
        }
      } else {
        coordinates = [[].concat(_toConsumableArray(coords.slice(0, -2)), [pt, coords[0]])];
      }

      return coordinates;
    }
  }, {
    key: "getIntermediatePoint",
    value: function getIntermediatePoint(coordinates) {
      var pt;

      if (coordinates.length > 4) {
        var _ref = _toConsumableArray(coordinates),
            p1 = _ref[0],
            p2 = _ref[1];

        var angle1 = (0, _bearing["default"])(p1, p2);
        var p3 = coordinates[coordinates.length - 3];
        var p4 = coordinates[coordinates.length - 4];
        var angle2 = (0, _bearing["default"])(p3, p4);
        var angles = {
          first: [],
          second: []
        }; // calculate 3 right angle points for first and last points in lineString

        [1, 2, 3].forEach(function (factor) {
          var newAngle1 = angle1 + factor * 90; // convert angles to 0 to -180 for anti-clock and 0 to 180 for clock wise

          angles.first.push(newAngle1 > 180 ? newAngle1 - 360 : newAngle1);
          var newAngle2 = angle2 + factor * 90;
          angles.second.push(newAngle2 > 180 ? newAngle2 - 360 : newAngle2);
        });
        var distance = (0, _distance["default"])((0, _helpers.point)(p1), (0, _helpers.point)(p3)); // Draw imaginary right angle lines for both first and last points in lineString
        // If there is intersection point for any 2 lines, will be the 90 degree point.

        [0, 1, 2].forEach(function (indexFirst) {
          var line1 = (0, _helpers.lineString)([p1, (0, _destination["default"])(p1, distance, angles.first[indexFirst]).geometry.coordinates]);
          [0, 1, 2].forEach(function (indexSecond) {
            var line2 = (0, _helpers.lineString)([p3, (0, _destination["default"])(p3, distance, angles.second[indexSecond]).geometry.coordinates]);
            var fc = (0, _lineIntersect["default"])(line1, line2);

            if (fc && fc.features.length) {
              // found the intersect point
              pt = fc.features[0].geometry.coordinates;
            }
          });
        });
      }

      return pt;
    }
  }]);

  return Draw90DegreePolygonMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.Draw90DegreePolygonMode = Draw90DegreePolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy05MGRlZ3JlZS1wb2x5Z29uLW1vZGUudHMiXSwibmFtZXMiOlsiRHJhdzkwRGVncmVlUG9seWdvbk1vZGUiLCJwcm9wcyIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwibWFwQ29vcmRzIiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJwMyIsImxlbmd0aCIsInAxIiwicDIiLCJ0ZW50YXRpdmVGZWF0dXJlIiwidHlwZSIsInByb3BlcnRpZXMiLCJndWlkZVR5cGUiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZ3VpZGVzIiwiZmVhdHVyZXMiLCJjcmVhdGVUZW50YXRpdmVGZWF0dXJlIiwicHVzaCIsImNvbmNhdCIsInNsaWNlIiwiZXZlbnQiLCJvblVwZGF0ZUN1cnNvciIsInBpY2tzIiwiZ2V0VGVudGF0aXZlR3VpZGUiLCJhZGRDbGlja1NlcXVlbmNlIiwibGluZVN0cmluZyIsInBvbHlnb24iLCJjbGlja2VkRWRpdEhhbmRsZSIsIkFycmF5IiwiaXNBcnJheSIsInBvc2l0aW9uSW5kZXhlcyIsInBvbHlnb25Ub0FkZCIsImZpbmFsaXplZENvb3JkaW5hdGVzIiwicmVzZXRDbGlja1NlcXVlbmNlIiwiZWRpdEFjdGlvbiIsImdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uIiwib25FZGl0IiwiZmFrZVBvaW50ZXJNb3ZlRXZlbnQiLCJzY3JlZW5Db29yZHMiLCJwb2ludGVyRG93blBpY2tzIiwicG9pbnRlckRvd25TY3JlZW5Db29yZHMiLCJwb2ludGVyRG93bk1hcENvb3JkcyIsImNhbmNlbFBhbiIsInNvdXJjZUV2ZW50IiwiaGFuZGxlUG9pbnRlck1vdmUiLCJjb29yZHMiLCJwdCIsImdldEludGVybWVkaWF0ZVBvaW50IiwidGMiLCJzcGxpY2UiLCJhbmdsZTEiLCJwNCIsImFuZ2xlMiIsImFuZ2xlcyIsImZpcnN0Iiwic2Vjb25kIiwiZm9yRWFjaCIsImZhY3RvciIsIm5ld0FuZ2xlMSIsIm5ld0FuZ2xlMiIsImRpc3RhbmNlIiwiaW5kZXhGaXJzdCIsImxpbmUxIiwiaW5kZXhTZWNvbmQiLCJsaW5lMiIsImZjIiwiR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBYUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLHVCOzs7Ozs7Ozs7Ozs7OzJDQUNZQyxLLEVBQXVEO0FBQzVFLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0QjtBQUQ0RSxVQUdwRUMsU0FIb0UsR0FHdERILEtBQUssQ0FBQ0ksb0JBSGdELENBR3BFRCxTQUhvRTtBQUs1RSxVQUFJRSxFQUFKOztBQUNBLFVBQUlKLGFBQWEsQ0FBQ0ssTUFBZCxLQUF5QixDQUE3QixFQUFnQztBQUM5QkQsUUFBQUEsRUFBRSxHQUFHRixTQUFMO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBTUksRUFBRSxHQUFHTixhQUFhLENBQUNBLGFBQWEsQ0FBQ0ssTUFBZCxHQUF1QixDQUF4QixDQUF4QjtBQUNBLFlBQU1FLEVBQUUsR0FBR1AsYUFBYSxDQUFDQSxhQUFhLENBQUNLLE1BQWQsR0FBdUIsQ0FBeEIsQ0FBeEI7O0FBRkssb0NBR0UsK0NBQW1DQyxFQUFuQyxFQUF1Q0MsRUFBdkMsRUFBMkNMLFNBQTNDLENBSEY7O0FBQUE7O0FBR0pFLFFBQUFBLEVBSEk7QUFJTjs7QUFFRCxVQUFJSSxnQkFBSjs7QUFFQSxVQUFJUixhQUFhLENBQUNLLE1BQWQsR0FBdUIsQ0FBM0IsRUFBOEI7QUFDNUI7QUFDQUcsUUFBQUEsZ0JBQWdCLEdBQUc7QUFDakJDLFVBQUFBLElBQUksRUFBRSxTQURXO0FBRWpCQyxVQUFBQSxVQUFVLEVBQUU7QUFDVkMsWUFBQUEsU0FBUyxFQUFFO0FBREQsV0FGSztBQUtqQkMsVUFBQUEsUUFBUSxFQUFFO0FBQ1JILFlBQUFBLElBQUksRUFBRSxZQURFO0FBRVJJLFlBQUFBLFdBQVcsK0JBQU1iLGFBQU4sSUFBcUJJLEVBQXJCO0FBRkg7QUFMTyxTQUFuQjtBQVVELE9BWkQsTUFZTztBQUNMO0FBQ0FJLFFBQUFBLGdCQUFnQixHQUFHO0FBQ2pCQyxVQUFBQSxJQUFJLEVBQUUsU0FEVztBQUVqQkMsVUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLFlBQUFBLFNBQVMsRUFBRTtBQURELFdBRks7QUFLakJDLFVBQUFBLFFBQVEsRUFBRTtBQUNSSCxZQUFBQSxJQUFJLEVBQUUsU0FERTtBQUVSSSxZQUFBQSxXQUFXLEVBQUUsOEJBQUtiLGFBQUwsSUFBb0JJLEVBQXBCLEVBQXdCSixhQUFhLENBQUMsQ0FBRCxDQUFyQztBQUZMO0FBTE8sU0FBbkI7QUFVRDs7QUFFRCxhQUFPUSxnQkFBUDtBQUNEOzs7OEJBRVNULEssRUFBNkQ7QUFDckUsVUFBTWUsTUFBOEIsR0FBRztBQUNyQ0wsUUFBQUEsSUFBSSxFQUFFLG1CQUQrQjtBQUVyQ00sUUFBQUEsUUFBUSxFQUFFO0FBRjJCLE9BQXZDO0FBS0EsVUFBTWYsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLFVBQUlELGFBQWEsQ0FBQ0ssTUFBZCxLQUF5QixDQUF6QixJQUE4QixDQUFDTixLQUFLLENBQUNJLG9CQUF6QyxFQUErRDtBQUM3RCxlQUFPVyxNQUFQO0FBQ0Q7O0FBQ0QsVUFBTU4sZ0JBQWdCLEdBQUcsS0FBS1Esc0JBQUwsQ0FBNEJqQixLQUE1QixDQUF6QjtBQUVBZSxNQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JFLElBQWhCLENBQXFCVCxnQkFBckI7QUFFQU0sTUFBQUEsTUFBTSxDQUFDQyxRQUFQLEdBQWtCRCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JHLE1BQWhCLENBQ2hCLHNDQUEwQlYsZ0JBQWdCLENBQUNJLFFBQTNDLEVBQXFELENBQUMsQ0FBdEQsQ0FEZ0IsQ0FBbEIsQ0FmcUUsQ0FtQnJFOztBQUNBRSxNQUFBQSxNQUFNLENBQUNDLFFBQVAsR0FBa0JELE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkksS0FBaEIsQ0FBc0IsQ0FBdEIsRUFBeUIsQ0FBQyxDQUExQixDQUFsQjtBQUVBLGFBQU9MLE1BQVA7QUFDRDs7O3NDQUVpQk0sSyxFQUF5QnJCLEssRUFBcUM7QUFDOUVBLE1BQUFBLEtBQUssQ0FBQ3NCLGNBQU4sQ0FBcUIsTUFBckI7O0FBQ0EscUdBQXdCRCxLQUF4QixFQUErQnJCLEtBQS9CO0FBQ0Q7OztnQ0FFV3FCLEssRUFBbUJyQixLLEVBQXFDO0FBQUEsVUFDMUR1QixLQUQwRCxHQUNoREYsS0FEZ0QsQ0FDMURFLEtBRDBEO0FBRWxFLFVBQU1kLGdCQUFnQixHQUFHLEtBQUtlLGlCQUFMLENBQXVCeEIsS0FBdkIsQ0FBekI7QUFDQSxXQUFLeUIsZ0JBQUwsQ0FBc0JKLEtBQXRCO0FBQ0EsVUFBTXBCLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0Qjs7QUFFQSxVQUFJLENBQUNPLGdCQUFMLEVBQXVCO0FBQ3JCO0FBQ0E7QUFDRDs7QUFFRCxVQUFJUixhQUFhLENBQUNLLE1BQWQsS0FBeUIsQ0FBekIsSUFBOEJHLGdCQUFnQixDQUFDSSxRQUFqQixDQUEwQkgsSUFBMUIsS0FBbUMsWUFBckUsRUFBbUY7QUFDakYsWUFBTWdCLFVBQXNCLEdBQUdqQixnQkFBZ0IsQ0FBQ0ksUUFBaEQsQ0FEaUYsQ0FHakY7O0FBQ0FaLFFBQUFBLGFBQWEsQ0FBQ0EsYUFBYSxDQUFDSyxNQUFkLEdBQXVCLENBQXhCLENBQWIsR0FDRW9CLFVBQVUsQ0FBQ1osV0FBWCxDQUF1QlksVUFBVSxDQUFDWixXQUFYLENBQXVCUixNQUF2QixHQUFnQyxDQUF2RCxDQURGO0FBRUQsT0FORCxNQU1PLElBQUlMLGFBQWEsQ0FBQ0ssTUFBZCxHQUF1QixDQUF2QixJQUE0QkcsZ0JBQWdCLENBQUNJLFFBQWpCLENBQTBCSCxJQUExQixLQUFtQyxTQUFuRSxFQUE4RTtBQUNuRixZQUFNaUIsT0FBZ0IsR0FBR2xCLGdCQUFnQixDQUFDSSxRQUExQyxDQURtRixDQUduRjs7QUFDQVosUUFBQUEsYUFBYSxDQUFDQSxhQUFhLENBQUNLLE1BQWQsR0FBdUIsQ0FBeEIsQ0FBYixHQUNFcUIsT0FBTyxDQUFDYixXQUFSLENBQW9CLENBQXBCLEVBQXVCYSxPQUFPLENBQUNiLFdBQVIsQ0FBb0IsQ0FBcEIsRUFBdUJSLE1BQXZCLEdBQWdDLENBQXZELENBREY7QUFHQSxZQUFNc0IsaUJBQWlCLEdBQUcsZ0NBQW9CTCxLQUFwQixDQUExQjs7QUFFQSxZQUNFSyxpQkFBaUIsSUFDakJDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixpQkFBaUIsQ0FBQ2pCLFVBQWxCLENBQTZCb0IsZUFBM0MsQ0FEQSxLQUVDSCxpQkFBaUIsQ0FBQ2pCLFVBQWxCLENBQTZCb0IsZUFBN0IsQ0FBNkMsQ0FBN0MsTUFBb0QsQ0FBcEQsSUFDQ0gsaUJBQWlCLENBQUNqQixVQUFsQixDQUE2Qm9CLGVBQTdCLENBQTZDLENBQTdDLE1BQW9ESixPQUFPLENBQUNiLFdBQVIsQ0FBb0IsQ0FBcEIsRUFBdUJSLE1BQXZCLEdBQWdDLENBSHRGLENBREYsRUFLRTtBQUNBO0FBQ0EsY0FBTTBCLFlBQXFCLEdBQUc7QUFDNUJ0QixZQUFBQSxJQUFJLEVBQUUsU0FEc0I7QUFFNUJJLFlBQUFBLFdBQVcsRUFBRSxLQUFLbUIsb0JBQUwsb0JBQThCTixPQUFPLENBQUNiLFdBQVIsQ0FBb0IsQ0FBcEIsQ0FBOUI7QUFGZSxXQUE5QjtBQUtBLGVBQUtvQixrQkFBTDtBQUVBLGNBQU1DLFVBQVUsR0FBRyxLQUFLQyxtQ0FBTCxDQUF5Q0osWUFBekMsRUFBdURoQyxLQUF2RCxDQUFuQjs7QUFDQSxjQUFJbUMsVUFBSixFQUFnQjtBQUNkbkMsWUFBQUEsS0FBSyxDQUFDcUMsTUFBTixDQUFhRixVQUFiO0FBQ0Q7QUFDRjtBQUNGLE9BN0NpRSxDQStDbEU7OztBQUNBLFVBQU1HLG9CQUFzQyxHQUFHO0FBQzdDQyxRQUFBQSxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFDLENBQU4sQ0FEK0I7QUFFN0NwQyxRQUFBQSxTQUFTLEVBQUVrQixLQUFLLENBQUNsQixTQUY0QjtBQUc3Q29CLFFBQUFBLEtBQUssRUFBRSxFQUhzQztBQUk3Q2lCLFFBQUFBLGdCQUFnQixFQUFFLElBSjJCO0FBSzdDQyxRQUFBQSx1QkFBdUIsRUFBRSxJQUxvQjtBQU03Q0MsUUFBQUEsb0JBQW9CLEVBQUUsSUFOdUI7QUFPN0NDLFFBQUFBLFNBQVMsRUFBRSxxQkFBTSxDQUFFLENBUDBCO0FBUTdDQyxRQUFBQSxXQUFXLEVBQUU7QUFSZ0MsT0FBL0M7QUFXQSxXQUFLQyxpQkFBTCxDQUF1QlAsb0JBQXZCLEVBQTZDdEMsS0FBN0M7QUFDRDs7O3lDQUVvQjhDLE0sRUFBb0I7QUFDdkM7QUFDQSxVQUFJaEMsV0FBVyxHQUFHLDhCQUFLZ0MsTUFBTSxDQUFDMUIsS0FBUCxDQUFhLENBQWIsRUFBZ0IsQ0FBQyxDQUFqQixDQUFMLElBQTBCMEIsTUFBTSxDQUFDLENBQUQsQ0FBaEMsR0FBbEI7QUFDQSxVQUFJQyxFQUFFLEdBQUcsS0FBS0Msb0JBQUwsb0JBQThCRixNQUE5QixFQUFUOztBQUNBLFVBQUksQ0FBQ0MsRUFBTCxFQUFTO0FBQ1A7QUFDQTtBQUNBLFlBQU1FLEVBQUUsc0JBQU9ILE1BQVAsQ0FBUjs7QUFDQUcsUUFBQUEsRUFBRSxDQUFDQyxNQUFILENBQVUsQ0FBQyxDQUFYLEVBQWMsQ0FBZDtBQUNBSCxRQUFBQSxFQUFFLEdBQUcsS0FBS0Msb0JBQUwsb0JBQThCQyxFQUE5QixFQUFMOztBQUNBLFlBQUlGLEVBQUosRUFBUTtBQUNOakMsVUFBQUEsV0FBVyxHQUFHLDhCQUFLZ0MsTUFBTSxDQUFDMUIsS0FBUCxDQUFhLENBQWIsRUFBZ0IsQ0FBQyxDQUFqQixDQUFMLElBQTBCMkIsRUFBMUIsRUFBOEJELE1BQU0sQ0FBQyxDQUFELENBQXBDLEdBQWQ7QUFDRDtBQUNGLE9BVEQsTUFTTztBQUNMaEMsUUFBQUEsV0FBVyxHQUFHLDhCQUFLZ0MsTUFBTSxDQUFDMUIsS0FBUCxDQUFhLENBQWIsRUFBZ0IsQ0FBQyxDQUFqQixDQUFMLElBQTBCMkIsRUFBMUIsRUFBOEJELE1BQU0sQ0FBQyxDQUFELENBQXBDLEdBQWQ7QUFDRDs7QUFDRCxhQUFPaEMsV0FBUDtBQUNEOzs7eUNBRW9CQSxXLEVBQXlCO0FBQzVDLFVBQUlpQyxFQUFKOztBQUNBLFVBQUlqQyxXQUFXLENBQUNSLE1BQVosR0FBcUIsQ0FBekIsRUFBNEI7QUFBQSxzQ0FDTFEsV0FESztBQUFBLFlBQ25CUCxFQURtQjtBQUFBLFlBQ2ZDLEVBRGU7O0FBRTFCLFlBQU0yQyxNQUFNLEdBQUcseUJBQVE1QyxFQUFSLEVBQVlDLEVBQVosQ0FBZjtBQUNBLFlBQU1ILEVBQUUsR0FBR1MsV0FBVyxDQUFDQSxXQUFXLENBQUNSLE1BQVosR0FBcUIsQ0FBdEIsQ0FBdEI7QUFDQSxZQUFNOEMsRUFBRSxHQUFHdEMsV0FBVyxDQUFDQSxXQUFXLENBQUNSLE1BQVosR0FBcUIsQ0FBdEIsQ0FBdEI7QUFDQSxZQUFNK0MsTUFBTSxHQUFHLHlCQUFRaEQsRUFBUixFQUFZK0MsRUFBWixDQUFmO0FBRUEsWUFBTUUsTUFBTSxHQUFHO0FBQUVDLFVBQUFBLEtBQUssRUFBRSxFQUFUO0FBQWFDLFVBQUFBLE1BQU0sRUFBRTtBQUFyQixTQUFmLENBUDBCLENBUTFCOztBQUNBLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVVDLE9BQVYsQ0FBa0IsVUFBQ0MsTUFBRCxFQUFZO0FBQzVCLGNBQU1DLFNBQVMsR0FBR1IsTUFBTSxHQUFHTyxNQUFNLEdBQUcsRUFBcEMsQ0FENEIsQ0FFNUI7O0FBQ0FKLFVBQUFBLE1BQU0sQ0FBQ0MsS0FBUCxDQUFhckMsSUFBYixDQUFrQnlDLFNBQVMsR0FBRyxHQUFaLEdBQWtCQSxTQUFTLEdBQUcsR0FBOUIsR0FBb0NBLFNBQXREO0FBQ0EsY0FBTUMsU0FBUyxHQUFHUCxNQUFNLEdBQUdLLE1BQU0sR0FBRyxFQUFwQztBQUNBSixVQUFBQSxNQUFNLENBQUNFLE1BQVAsQ0FBY3RDLElBQWQsQ0FBbUIwQyxTQUFTLEdBQUcsR0FBWixHQUFrQkEsU0FBUyxHQUFHLEdBQTlCLEdBQW9DQSxTQUF2RDtBQUNELFNBTkQ7QUFRQSxZQUFNQyxRQUFRLEdBQUcsMEJBQWEsb0JBQU10RCxFQUFOLENBQWIsRUFBd0Isb0JBQU1GLEVBQU4sQ0FBeEIsQ0FBakIsQ0FqQjBCLENBa0IxQjtBQUNBOztBQUNBLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVVvRCxPQUFWLENBQWtCLFVBQUNLLFVBQUQsRUFBZ0I7QUFDaEMsY0FBTUMsS0FBSyxHQUFHLHlCQUFlLENBQzNCeEQsRUFEMkIsRUFFM0IsNkJBQVlBLEVBQVosRUFBZ0JzRCxRQUFoQixFQUEwQlAsTUFBTSxDQUFDQyxLQUFQLENBQWFPLFVBQWIsQ0FBMUIsRUFBb0RqRCxRQUFwRCxDQUE2REMsV0FGbEMsQ0FBZixDQUFkO0FBSUEsV0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVTJDLE9BQVYsQ0FBa0IsVUFBQ08sV0FBRCxFQUFpQjtBQUNqQyxnQkFBTUMsS0FBSyxHQUFHLHlCQUFlLENBQzNCNUQsRUFEMkIsRUFFM0IsNkJBQVlBLEVBQVosRUFBZ0J3RCxRQUFoQixFQUEwQlAsTUFBTSxDQUFDRSxNQUFQLENBQWNRLFdBQWQsQ0FBMUIsRUFBc0RuRCxRQUF0RCxDQUErREMsV0FGcEMsQ0FBZixDQUFkO0FBSUEsZ0JBQU1vRCxFQUFFLEdBQUcsK0JBQWNILEtBQWQsRUFBcUJFLEtBQXJCLENBQVg7O0FBQ0EsZ0JBQUlDLEVBQUUsSUFBSUEsRUFBRSxDQUFDbEQsUUFBSCxDQUFZVixNQUF0QixFQUE4QjtBQUM1QjtBQUNBeUMsY0FBQUEsRUFBRSxHQUFHbUIsRUFBRSxDQUFDbEQsUUFBSCxDQUFZLENBQVosRUFBZUgsUUFBZixDQUF3QkMsV0FBN0I7QUFDRDtBQUNGLFdBVkQ7QUFXRCxTQWhCRDtBQWlCRDs7QUFDRCxhQUFPaUMsRUFBUDtBQUNEOzs7O0VBdE0wQ29CLGdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlc3RpbmF0aW9uIGZyb20gJ0B0dXJmL2Rlc3RpbmF0aW9uJztcbmltcG9ydCBiZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IGxpbmVJbnRlcnNlY3QgZnJvbSAnQHR1cmYvbGluZS1pbnRlcnNlY3QnO1xuaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgeyBwb2ludCwgbGluZVN0cmluZyBhcyB0dXJmTGluZVN0cmluZyB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHtcbiAgZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyxcbiAgZ2V0UGlja2VkRWRpdEhhbmRsZSxcbiAgZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSxcbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHtcbiAgQ2xpY2tFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgTW9kZVByb3BzLFxuICBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uLFxuICBUZW50YXRpdmVGZWF0dXJlLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBQb2x5Z29uLCBMaW5lU3RyaW5nLCBQb3NpdGlvbiwgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7IEdlb0pzb25FZGl0TW9kZSB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUnO1xuXG5leHBvcnQgY2xhc3MgRHJhdzkwRGVncmVlUG9seWdvbk1vZGUgZXh0ZW5kcyBHZW9Kc29uRWRpdE1vZGUge1xuICBjcmVhdGVUZW50YXRpdmVGZWF0dXJlKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogVGVudGF0aXZlRmVhdHVyZSB7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgY29uc3QgeyBtYXBDb29yZHMgfSA9IHByb3BzLmxhc3RQb2ludGVyTW92ZUV2ZW50O1xuXG4gICAgbGV0IHAzO1xuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcDMgPSBtYXBDb29yZHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHAxID0gY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDJdO1xuICAgICAgY29uc3QgcDIgPSBjbGlja1NlcXVlbmNlW2NsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMV07XG4gICAgICBbcDNdID0gZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyhwMSwgcDIsIG1hcENvb3Jkcyk7XG4gICAgfVxuXG4gICAgbGV0IHRlbnRhdGl2ZUZlYXR1cmU7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPCAzKSB7XG4gICAgICAvLyBEcmF3IGEgTGluZVN0cmluZyBjb25uZWN0aW5nIGFsbCB0aGUgY2xpY2tlZCBwb2ludHMgd2l0aCB0aGUgaG92ZXJlZCBwb2ludFxuICAgICAgdGVudGF0aXZlRmVhdHVyZSA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZ3VpZGVUeXBlOiAndGVudGF0aXZlJyxcbiAgICAgICAgfSxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFsuLi5jbGlja1NlcXVlbmNlLCBwM10sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEcmF3IGEgUG9seWdvbiBjb25uZWN0aW5nIGFsbCB0aGUgY2xpY2tlZCBwb2ludHMgd2l0aCB0aGUgaG92ZXJlZCBwb2ludFxuICAgICAgdGVudGF0aXZlRmVhdHVyZSA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZ3VpZGVUeXBlOiAndGVudGF0aXZlJyxcbiAgICAgICAgfSxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtbLi4uY2xpY2tTZXF1ZW5jZSwgcDMsIGNsaWNrU2VxdWVuY2VbMF1dXSxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbnRhdGl2ZUZlYXR1cmU7XG4gIH1cblxuICBnZXRHdWlkZXMocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICBjb25zdCBndWlkZXM6IEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24gPSB7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IFtdLFxuICAgIH07XG5cbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDAgfHwgIXByb3BzLmxhc3RQb2ludGVyTW92ZUV2ZW50KSB7XG4gICAgICByZXR1cm4gZ3VpZGVzO1xuICAgIH1cbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5jcmVhdGVUZW50YXRpdmVGZWF0dXJlKHByb3BzKTtcblxuICAgIGd1aWRlcy5mZWF0dXJlcy5wdXNoKHRlbnRhdGl2ZUZlYXR1cmUpO1xuXG4gICAgZ3VpZGVzLmZlYXR1cmVzID0gZ3VpZGVzLmZlYXR1cmVzLmNvbmNhdChcbiAgICAgIGdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkodGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeSwgLTEpXG4gICAgKTtcblxuICAgIC8vIFNsaWNlIG9mZiB0aGUgaGFuZGxlcyB0aGF0IGFyZSBhcmUgbmV4dCB0byB0aGUgcG9pbnRlclxuICAgIGd1aWRlcy5mZWF0dXJlcyA9IGd1aWRlcy5mZWF0dXJlcy5zbGljZSgwLCAtMSk7XG5cbiAgICByZXR1cm4gZ3VpZGVzO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgcHJvcHMub25VcGRhdGVDdXJzb3IoJ2NlbGwnKTtcbiAgICBzdXBlci5oYW5kbGVQb2ludGVyTW92ZShldmVudCwgcHJvcHMpO1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgY29uc3QgeyBwaWNrcyB9ID0gZXZlbnQ7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlR3VpZGUocHJvcHMpO1xuICAgIHRoaXMuYWRkQ2xpY2tTZXF1ZW5jZShldmVudCk7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgaWYgKCF0ZW50YXRpdmVGZWF0dXJlKSB7XG4gICAgICAvLyBub3RoaW5nIGVsc2UgdG8gZG9cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDMgJiYgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIGNvbnN0IGxpbmVTdHJpbmc6IExpbmVTdHJpbmcgPSB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5O1xuXG4gICAgICAvLyBUd2VhayB0aGUgY2xpY2tlZCBwb3NpdGlvbiB0byBiZSB0aGUgc25hcHBlZCA5MCBkZWdyZWUgcG9pbnQgYWxvbmcgdGhlIHBvbHlnb25cbiAgICAgIGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXSA9XG4gICAgICAgIGxpbmVTdHJpbmcuY29vcmRpbmF0ZXNbbGluZVN0cmluZy5jb29yZGluYXRlcy5sZW5ndGggLSAxXTtcbiAgICB9IGVsc2UgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID4gMyAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgY29uc3QgcG9seWdvbjogUG9seWdvbiA9IHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnk7XG5cbiAgICAgIC8vIFR3ZWFrIHRoZSBjbGlja2VkIHBvc2l0aW9uIHRvIGJlIHRoZSBzbmFwcGVkIDkwIGRlZ3JlZSBwb2ludCBhbG9uZyB0aGUgcG9seWdvblxuICAgICAgY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdID1cbiAgICAgICAgcG9seWdvbi5jb29yZGluYXRlc1swXVtwb2x5Z29uLmNvb3JkaW5hdGVzWzBdLmxlbmd0aCAtIDJdO1xuXG4gICAgICBjb25zdCBjbGlja2VkRWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUocGlja3MpO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlICYmXG4gICAgICAgIEFycmF5LmlzQXJyYXkoY2xpY2tlZEVkaXRIYW5kbGUucHJvcGVydGllcy5wb3NpdGlvbkluZGV4ZXMpICYmXG4gICAgICAgIChjbGlja2VkRWRpdEhhbmRsZS5wcm9wZXJ0aWVzLnBvc2l0aW9uSW5kZXhlc1sxXSA9PT0gMCB8fFxuICAgICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlLnByb3BlcnRpZXMucG9zaXRpb25JbmRleGVzWzFdID09PSBwb2x5Z29uLmNvb3JkaW5hdGVzWzBdLmxlbmd0aCAtIDMpXG4gICAgICApIHtcbiAgICAgICAgLy8gVGhleSBjbGlja2VkIHRoZSBmaXJzdCBvciBsYXN0IHBvaW50IChvciBkb3VibGUtY2xpY2tlZCksIHNvIGNvbXBsZXRlIHRoZSBwb2x5Z29uXG4gICAgICAgIGNvbnN0IHBvbHlnb25Ub0FkZDogUG9seWdvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuZmluYWxpemVkQ29vcmRpbmF0ZXMoWy4uLnBvbHlnb24uY29vcmRpbmF0ZXNbMF1dKSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgICAgIGNvbnN0IGVkaXRBY3Rpb24gPSB0aGlzLmdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uKHBvbHlnb25Ub0FkZCwgcHJvcHMpO1xuICAgICAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyaWdnZXIgcG9pbnRlciBtb3ZlIHJpZ2h0IGF3YXkgaW4gb3JkZXIgZm9yIGl0IHRvIHVwZGF0ZSBlZGl0IGhhbmRsZXMgKHRvIHN1cHBvcnQgZG91YmxlLWNsaWNrKVxuICAgIGNvbnN0IGZha2VQb2ludGVyTW92ZUV2ZW50OiBQb2ludGVyTW92ZUV2ZW50ID0ge1xuICAgICAgc2NyZWVuQ29vcmRzOiBbLTEsIC0xXSxcbiAgICAgIG1hcENvb3JkczogZXZlbnQubWFwQ29vcmRzLFxuICAgICAgcGlja3M6IFtdLFxuICAgICAgcG9pbnRlckRvd25QaWNrczogbnVsbCxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IG51bGwsXG4gICAgICBjYW5jZWxQYW46ICgpID0+IHt9LFxuICAgICAgc291cmNlRXZlbnQ6IG51bGwsXG4gICAgfTtcblxuICAgIHRoaXMuaGFuZGxlUG9pbnRlck1vdmUoZmFrZVBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzKTtcbiAgfVxuXG4gIGZpbmFsaXplZENvb3JkaW5hdGVzKGNvb3JkczogUG9zaXRpb25bXSkge1xuICAgIC8vIFJlbW92ZSB0aGUgaG92ZXJlZCBwb3NpdGlvblxuICAgIGxldCBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0yKSwgY29vcmRzWzBdXV07XG4gICAgbGV0IHB0ID0gdGhpcy5nZXRJbnRlcm1lZGlhdGVQb2ludChbLi4uY29vcmRzXSk7XG4gICAgaWYgKCFwdCkge1xuICAgICAgLy8gaWYgaW50ZXJtZWRpYXRlIHBvaW50IHdpdGggOTAgZGVncmVlIG5vdCBhdmFpbGFibGVcbiAgICAgIC8vIHRyeSByZW1vdmUgdGhlIGxhc3QgY2xpY2tlZCBwb2ludCBhbmQgZ2V0IHRoZSBpbnRlcm1lZGlhdGUgcG9pbnQuXG4gICAgICBjb25zdCB0YyA9IFsuLi5jb29yZHNdO1xuICAgICAgdGMuc3BsaWNlKC0zLCAxKTtcbiAgICAgIHB0ID0gdGhpcy5nZXRJbnRlcm1lZGlhdGVQb2ludChbLi4udGNdKTtcbiAgICAgIGlmIChwdCkge1xuICAgICAgICBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0zKSwgcHQsIGNvb3Jkc1swXV1dO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb29yZGluYXRlcyA9IFtbLi4uY29vcmRzLnNsaWNlKDAsIC0yKSwgcHQsIGNvb3Jkc1swXV1dO1xuICAgIH1cbiAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gIH1cblxuICBnZXRJbnRlcm1lZGlhdGVQb2ludChjb29yZGluYXRlczogUG9zaXRpb25bXSkge1xuICAgIGxldCBwdDtcbiAgICBpZiAoY29vcmRpbmF0ZXMubGVuZ3RoID4gNCkge1xuICAgICAgY29uc3QgW3AxLCBwMl0gPSBbLi4uY29vcmRpbmF0ZXNdO1xuICAgICAgY29uc3QgYW5nbGUxID0gYmVhcmluZyhwMSwgcDIpO1xuICAgICAgY29uc3QgcDMgPSBjb29yZGluYXRlc1tjb29yZGluYXRlcy5sZW5ndGggLSAzXTtcbiAgICAgIGNvbnN0IHA0ID0gY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gNF07XG4gICAgICBjb25zdCBhbmdsZTIgPSBiZWFyaW5nKHAzLCBwNCk7XG5cbiAgICAgIGNvbnN0IGFuZ2xlcyA9IHsgZmlyc3Q6IFtdLCBzZWNvbmQ6IFtdIH07XG4gICAgICAvLyBjYWxjdWxhdGUgMyByaWdodCBhbmdsZSBwb2ludHMgZm9yIGZpcnN0IGFuZCBsYXN0IHBvaW50cyBpbiBsaW5lU3RyaW5nXG4gICAgICBbMSwgMiwgM10uZm9yRWFjaCgoZmFjdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0FuZ2xlMSA9IGFuZ2xlMSArIGZhY3RvciAqIDkwO1xuICAgICAgICAvLyBjb252ZXJ0IGFuZ2xlcyB0byAwIHRvIC0xODAgZm9yIGFudGktY2xvY2sgYW5kIDAgdG8gMTgwIGZvciBjbG9jayB3aXNlXG4gICAgICAgIGFuZ2xlcy5maXJzdC5wdXNoKG5ld0FuZ2xlMSA+IDE4MCA/IG5ld0FuZ2xlMSAtIDM2MCA6IG5ld0FuZ2xlMSk7XG4gICAgICAgIGNvbnN0IG5ld0FuZ2xlMiA9IGFuZ2xlMiArIGZhY3RvciAqIDkwO1xuICAgICAgICBhbmdsZXMuc2Vjb25kLnB1c2gobmV3QW5nbGUyID4gMTgwID8gbmV3QW5nbGUyIC0gMzYwIDogbmV3QW5nbGUyKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkaXN0YW5jZSA9IHR1cmZEaXN0YW5jZShwb2ludChwMSksIHBvaW50KHAzKSk7XG4gICAgICAvLyBEcmF3IGltYWdpbmFyeSByaWdodCBhbmdsZSBsaW5lcyBmb3IgYm90aCBmaXJzdCBhbmQgbGFzdCBwb2ludHMgaW4gbGluZVN0cmluZ1xuICAgICAgLy8gSWYgdGhlcmUgaXMgaW50ZXJzZWN0aW9uIHBvaW50IGZvciBhbnkgMiBsaW5lcywgd2lsbCBiZSB0aGUgOTAgZGVncmVlIHBvaW50LlxuICAgICAgWzAsIDEsIDJdLmZvckVhY2goKGluZGV4Rmlyc3QpID0+IHtcbiAgICAgICAgY29uc3QgbGluZTEgPSB0dXJmTGluZVN0cmluZyhbXG4gICAgICAgICAgcDEsXG4gICAgICAgICAgZGVzdGluYXRpb24ocDEsIGRpc3RhbmNlLCBhbmdsZXMuZmlyc3RbaW5kZXhGaXJzdF0pLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICBdKTtcbiAgICAgICAgWzAsIDEsIDJdLmZvckVhY2goKGluZGV4U2Vjb25kKSA9PiB7XG4gICAgICAgICAgY29uc3QgbGluZTIgPSB0dXJmTGluZVN0cmluZyhbXG4gICAgICAgICAgICBwMyxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uKHAzLCBkaXN0YW5jZSwgYW5nbGVzLnNlY29uZFtpbmRleFNlY29uZF0pLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICAgIF0pO1xuICAgICAgICAgIGNvbnN0IGZjID0gbGluZUludGVyc2VjdChsaW5lMSwgbGluZTIpO1xuICAgICAgICAgIGlmIChmYyAmJiBmYy5mZWF0dXJlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIGZvdW5kIHRoZSBpbnRlcnNlY3QgcG9pbnRcbiAgICAgICAgICAgIHB0ID0gZmMuZmVhdHVyZXNbMF0uZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcHQ7XG4gIH1cbn1cbiJdfQ==