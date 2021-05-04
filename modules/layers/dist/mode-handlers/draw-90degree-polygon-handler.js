"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Draw90DegreePolygonHandler = void 0;

var _destination = _interopRequireDefault(require("@turf/destination"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _lineIntersect = _interopRequireDefault(require("@turf/line-intersect"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _helpers = require("@turf/helpers");

var _utils = require("../utils");

var _modeHandler = require("./mode-handler");

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var Draw90DegreePolygonHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(Draw90DegreePolygonHandler, _ModeHandler);

  var _super = _createSuper(Draw90DegreePolygonHandler);

  function Draw90DegreePolygonHandler() {
    _classCallCheck(this, Draw90DegreePolygonHandler);

    return _super.apply(this, arguments);
  }

  _createClass(Draw90DegreePolygonHandler, [{
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      var handles = _get(_getPrototypeOf(Draw90DegreePolygonHandler.prototype), "getEditHandles", this).call(this, picks, groundCoords);

      var tentativeFeature = this.getTentativeFeature();

      if (tentativeFeature) {
        handles = handles.concat((0, _modeHandler.getEditHandlesForGeometry)(tentativeFeature.geometry, -1)); // Slice off the handles that are are next to the pointer

        if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        } else if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        }
      }

      return handles;
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

      var tentativeFeature = this.getTentativeFeature();

      if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        clickSequence[clickSequence.length - 1] = tentativeFeature.geometry.coordinates[0][clickSequence.length - 1];
      } else if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
        clickSequence[clickSequence.length - 1] = tentativeFeature.geometry.coordinates[clickSequence.length - 1];
      }

      var p3;

      if (clickSequence.length === 1) {
        p3 = groundCoords;
      } else {
        var p1 = clickSequence[clickSequence.length - 2];
        var p2 = clickSequence[clickSequence.length - 1];

        var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, groundCoords);

        var _generatePointsParall2 = _slicedToArray(_generatePointsParall, 1);

        p3 = _generatePointsParall2[0];
      }

      if (clickSequence.length < 3) {
        // Draw a LineString connecting all the clicked points with the hovered point
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [].concat(_toConsumableArray(clickSequence), [p3])
          }
        });
      } else {
        // Draw a Polygon connecting all the clicked points with the hovered point
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[].concat(_toConsumableArray(clickSequence), [p3, clickSequence[0]])]
          }
        });
      }

      return result;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(Draw90DegreePolygonHandler.prototype), "handleClick", this).call(this, event);

      var picks = event.picks;
      var tentativeFeature = this.getTentativeFeature();
      var editAction = null;
      var clickedEditHandle = (0, _modeHandler.getPickedEditHandle)(picks);

      if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        var polygon = tentativeFeature.geometry;

        if (clickedEditHandle && clickedEditHandle.featureIndex === -1 && (clickedEditHandle.positionIndexes[1] === 0 || clickedEditHandle.positionIndexes[1] === polygon.coordinates[0].length - 3)) {
          // They clicked the first or last point (or double-clicked), so complete the polygon
          var polygonToAdd = {
            type: 'Polygon',
            coordinates: this.finalizedCoordinates(_toConsumableArray(polygon.coordinates[0]))
          };
          this.resetClickSequence();

          this._setTentativeFeature(null);

          editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd);
        }
      } // Trigger pointer move right away in order for it to update edit handles (to support double-click)


      var fakePointerMoveEvent = {
        screenCoords: [-1, -1],
        groundCoords: event.groundCoords,
        picks: [],
        isDragging: false,
        pointerDownPicks: null,
        pointerDownScreenCoords: null,
        pointerDownGroundCoords: null,
        sourceEvent: null
      }; // @ts-ignore

      this.handlePointerMove(fakePointerMoveEvent);
      return editAction;
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
        var _ref2 = _toConsumableArray(coordinates),
            p1 = _ref2[0],
            p2 = _ref2[1];

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

  return Draw90DegreePolygonHandler;
}(_modeHandler.ModeHandler);

exports.Draw90DegreePolygonHandler = Draw90DegreePolygonHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctOTBkZWdyZWUtcG9seWdvbi1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbIkRyYXc5MERlZ3JlZVBvbHlnb25IYW5kbGVyIiwicGlja3MiLCJncm91bmRDb29yZHMiLCJoYW5kbGVzIiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjb25jYXQiLCJnZW9tZXRyeSIsInR5cGUiLCJzbGljZSIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwicmVzdWx0IiwiZWRpdEFjdGlvbiIsImNhbmNlbE1hcFBhbiIsImxlbmd0aCIsImNvb3JkaW5hdGVzIiwicDMiLCJwMSIsInAyIiwiX3NldFRlbnRhdGl2ZUZlYXR1cmUiLCJldmVudCIsImNsaWNrZWRFZGl0SGFuZGxlIiwicG9seWdvbiIsImZlYXR1cmVJbmRleCIsInBvc2l0aW9uSW5kZXhlcyIsInBvbHlnb25Ub0FkZCIsImZpbmFsaXplZENvb3JkaW5hdGVzIiwicmVzZXRDbGlja1NlcXVlbmNlIiwiZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24iLCJmYWtlUG9pbnRlck1vdmVFdmVudCIsInNjcmVlbkNvb3JkcyIsImlzRHJhZ2dpbmciLCJwb2ludGVyRG93blBpY2tzIiwicG9pbnRlckRvd25TY3JlZW5Db29yZHMiLCJwb2ludGVyRG93bkdyb3VuZENvb3JkcyIsInNvdXJjZUV2ZW50IiwiaGFuZGxlUG9pbnRlck1vdmUiLCJjb29yZHMiLCJwdCIsImdldEludGVybWVkaWF0ZVBvaW50IiwidGMiLCJzcGxpY2UiLCJhbmdsZTEiLCJwNCIsImFuZ2xlMiIsImFuZ2xlcyIsImZpcnN0Iiwic2Vjb25kIiwiZm9yRWFjaCIsImZhY3RvciIsIm5ld0FuZ2xlMSIsInB1c2giLCJuZXdBbmdsZTIiLCJkaXN0YW5jZSIsImluZGV4Rmlyc3QiLCJsaW5lMSIsImluZGV4U2Vjb25kIiwibGluZTIiLCJmYyIsImZl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Q0FDdkJ6QyxFQUR1QixFQUV2Qiw2QkFBWUEsRUFBWixFQUFnQnFDLFFBQWhCLEVBQTBCUixNQUFNLENBQUNFLE1BQVAsQ0FBY1MsV0FBZCxDQUExQixFQUFzRGxELFFBQXRELENBQStEUyxXQUZ4QyxDQUFYLENBQWQ7QUFJQSxnQkFBTTJDLEVBQUUsR0FBRywrQkFBY0gsS0FBZCxFQUFxQkUsS0FBckIsQ0FBWDs7QUFDQSxnQkFBSUMsRUFBRSxJQUFJQSxFQUFFLENBQUNDLFFBQUgsQ0FBWTdDLE1BQXRCLEVBQThCO0FBQzVCO0FBQ0F3QixjQUFBQSxFQUFFLEdBQUdvQixFQUFFLENBQUNDLFFBQUgsQ0FBWSxDQUFaLEVBQWVyRCxRQUFmLENBQXdCUyxXQUE3QjtBQUNEO0FBQ0YsV0FWRDtBQVdELFNBaEJEO0FBaUJEOztBQUNELGFBQU91QixFQUFQO0FBQ0Q7Ozs7RUFuTDZDc0Isd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVzdGluYXRpb24gZnJvbSAnQHR1cmYvZGVzdGluYXRpb24nO1xuaW1wb3J0IGJlYXJpbmcgZnJvbSAnQHR1cmYvYmVhcmluZyc7XG5pbXBvcnQgbGluZUludGVyc2VjdCBmcm9tICdAdHVyZi9saW5lLWludGVyc2VjdCc7XG5pbXBvcnQgdHVyZkRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcbmltcG9ydCB7IHBvaW50LCBsaW5lU3RyaW5nIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgeyBQb2x5Z29uLCBQb3NpdGlvbiB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgeyBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgQ2xpY2tFdmVudCwgUG9pbnRlck1vdmVFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzJztcbmltcG9ydCB7XG4gIEVkaXRBY3Rpb24sXG4gIEVkaXRIYW5kbGUsXG4gIE1vZGVIYW5kbGVyLFxuICBnZXRQaWNrZWRFZGl0SGFuZGxlLFxuICBnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5LFxufSBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBEcmF3OTBEZWdyZWVQb2x5Z29uSGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgZ2V0RWRpdEhhbmRsZXMocGlja3M/OiBBcnJheTxSZWNvcmQ8c3RyaW5nLCBhbnk+PiwgZ3JvdW5kQ29vcmRzPzogUG9zaXRpb24pOiBFZGl0SGFuZGxlW10ge1xuICAgIGxldCBoYW5kbGVzID0gc3VwZXIuZ2V0RWRpdEhhbmRsZXMocGlja3MsIGdyb3VuZENvb3Jkcyk7XG5cbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLmNvbmNhdChnZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnksIC0xKSk7XG4gICAgICAvLyBTbGljZSBvZmYgdGhlIGhhbmRsZXMgdGhhdCBhcmUgYXJlIG5leHQgdG8gdGhlIHBvaW50ZXJcbiAgICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfSBlbHNlIGlmICh0ZW50YXRpdmVGZWF0dXJlICYmIHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGFzdCBleGlzdGluZyBoYW5kbGVcbiAgICAgICAgaGFuZGxlcyA9IGhhbmRsZXMuc2xpY2UoMCwgLTEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVzO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoe1xuICAgIGdyb3VuZENvb3JkcyxcbiAgfTogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQ7IGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdID1cbiAgICAgICAgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlc1swXVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdO1xuICAgIH0gZWxzZSBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdID1cbiAgICAgICAgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlc1tjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdO1xuICAgIH1cblxuICAgIGxldCBwMztcbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHAzID0gZ3JvdW5kQ29vcmRzO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwMSA9IGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAyXTtcbiAgICAgIGNvbnN0IHAyID0gY2xpY2tTZXF1ZW5jZVtjbGlja1NlcXVlbmNlLmxlbmd0aCAtIDFdO1xuICAgICAgW3AzXSA9IGdlbmVyYXRlUG9pbnRzUGFyYWxsZWxUb0xpbmVQb2ludHMocDEsIHAyLCBncm91bmRDb29yZHMpO1xuICAgIH1cblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA8IDMpIHtcbiAgICAgIC8vIERyYXcgYSBMaW5lU3RyaW5nIGNvbm5lY3RpbmcgYWxsIHRoZSBjbGlja2VkIHBvaW50cyB3aXRoIHRoZSBob3ZlcmVkIHBvaW50XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgICBjb29yZGluYXRlczogWy4uLmNsaWNrU2VxdWVuY2UsIHAzXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEcmF3IGEgUG9seWdvbiBjb25uZWN0aW5nIGFsbCB0aGUgY2xpY2tlZCBwb2ludHMgd2l0aCB0aGUgaG92ZXJlZCBwb2ludFxuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZSh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtbLi4uY2xpY2tTZXF1ZW5jZSwgcDMsIGNsaWNrU2VxdWVuY2VbMF1dXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBoYW5kbGVDbGljayhldmVudDogQ2xpY2tFdmVudCk6IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBzdXBlci5oYW5kbGVDbGljayhldmVudCk7XG5cbiAgICBjb25zdCB7IHBpY2tzIH0gPSBldmVudDtcbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG5cbiAgICBsZXQgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQgPSBudWxsO1xuICAgIGNvbnN0IGNsaWNrZWRFZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShwaWNrcyk7XG5cbiAgICBpZiAodGVudGF0aXZlRmVhdHVyZSAmJiB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgY29uc3QgcG9seWdvbjogUG9seWdvbiA9IHRlbnRhdGl2ZUZlYXR1cmUuZ2VvbWV0cnk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUgJiZcbiAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUuZmVhdHVyZUluZGV4ID09PSAtMSAmJlxuICAgICAgICAoY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzWzFdID09PSAwIHx8XG4gICAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUucG9zaXRpb25JbmRleGVzWzFdID09PSBwb2x5Z29uLmNvb3JkaW5hdGVzWzBdLmxlbmd0aCAtIDMpXG4gICAgICApIHtcbiAgICAgICAgLy8gVGhleSBjbGlja2VkIHRoZSBmaXJzdCBvciBsYXN0IHBvaW50IChvciBkb3VibGUtY2xpY2tlZCksIHNvIGNvbXBsZXRlIHRoZSBwb2x5Z29uXG4gICAgICAgIGNvbnN0IHBvbHlnb25Ub0FkZDogUG9seWdvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuZmluYWxpemVkQ29vcmRpbmF0ZXMoWy4uLnBvbHlnb24uY29vcmRpbmF0ZXNbMF1dKSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKG51bGwpO1xuICAgICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbihwb2x5Z29uVG9BZGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyaWdnZXIgcG9pbnRlciBtb3ZlIHJpZ2h0IGF3YXkgaW4gb3JkZXIgZm9yIGl0IHRvIHVwZGF0ZSBlZGl0IGhhbmRsZXMgKHRvIHN1cHBvcnQgZG91YmxlLWNsaWNrKVxuICAgIGNvbnN0IGZha2VQb2ludGVyTW92ZUV2ZW50ID0ge1xuICAgICAgc2NyZWVuQ29vcmRzOiBbLTEsIC0xXSxcbiAgICAgIGdyb3VuZENvb3JkczogZXZlbnQuZ3JvdW5kQ29vcmRzLFxuICAgICAgcGlja3M6IFtdLFxuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBwb2ludGVyRG93blBpY2tzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICBwb2ludGVyRG93bkdyb3VuZENvb3JkczogbnVsbCxcbiAgICAgIHNvdXJjZUV2ZW50OiBudWxsLFxuICAgIH07XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMuaGFuZGxlUG9pbnRlck1vdmUoZmFrZVBvaW50ZXJNb3ZlRXZlbnQpO1xuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBmaW5hbGl6ZWRDb29yZGluYXRlcyhjb29yZHM6IFBvc2l0aW9uW10pIHtcbiAgICAvLyBSZW1vdmUgdGhlIGhvdmVyZWQgcG9zaXRpb25cbiAgICBsZXQgY29vcmRpbmF0ZXMgPSBbWy4uLmNvb3Jkcy5zbGljZSgwLCAtMiksIGNvb3Jkc1swXV1dO1xuICAgIGxldCBwdCA9IHRoaXMuZ2V0SW50ZXJtZWRpYXRlUG9pbnQoWy4uLmNvb3Jkc10pO1xuICAgIGlmICghcHQpIHtcbiAgICAgIC8vIGlmIGludGVybWVkaWF0ZSBwb2ludCB3aXRoIDkwIGRlZ3JlZSBub3QgYXZhaWxhYmxlXG4gICAgICAvLyB0cnkgcmVtb3ZlIHRoZSBsYXN0IGNsaWNrZWQgcG9pbnQgYW5kIGdldCB0aGUgaW50ZXJtZWRpYXRlIHBvaW50LlxuICAgICAgY29uc3QgdGMgPSBbLi4uY29vcmRzXTtcbiAgICAgIHRjLnNwbGljZSgtMywgMSk7XG4gICAgICBwdCA9IHRoaXMuZ2V0SW50ZXJtZWRpYXRlUG9pbnQoWy4uLnRjXSk7XG4gICAgICBpZiAocHQpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMgPSBbWy4uLmNvb3Jkcy5zbGljZSgwLCAtMyksIHB0LCBjb29yZHNbMF1dXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29vcmRpbmF0ZXMgPSBbWy4uLmNvb3Jkcy5zbGljZSgwLCAtMiksIHB0LCBjb29yZHNbMF1dXTtcbiAgICB9XG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICB9XG5cbiAgZ2V0SW50ZXJtZWRpYXRlUG9pbnQoY29vcmRpbmF0ZXM6IFBvc2l0aW9uW10pIHtcbiAgICBsZXQgcHQ7XG4gICAgaWYgKGNvb3JkaW5hdGVzLmxlbmd0aCA+IDQpIHtcbiAgICAgIGNvbnN0IFtwMSwgcDJdID0gWy4uLmNvb3JkaW5hdGVzXTtcbiAgICAgIGNvbnN0IGFuZ2xlMSA9IGJlYXJpbmcocDEsIHAyKTtcbiAgICAgIGNvbnN0IHAzID0gY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gM107XG4gICAgICBjb25zdCBwNCA9IGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDRdO1xuICAgICAgY29uc3QgYW5nbGUyID0gYmVhcmluZyhwMywgcDQpO1xuXG4gICAgICBjb25zdCBhbmdsZXMgPSB7IGZpcnN0OiBbXSwgc2Vjb25kOiBbXSB9O1xuICAgICAgLy8gY2FsY3VsYXRlIDMgcmlnaHQgYW5nbGUgcG9pbnRzIGZvciBmaXJzdCBhbmQgbGFzdCBwb2ludHMgaW4gbGluZVN0cmluZ1xuICAgICAgWzEsIDIsIDNdLmZvckVhY2goKGZhY3RvcikgPT4ge1xuICAgICAgICBjb25zdCBuZXdBbmdsZTEgPSBhbmdsZTEgKyBmYWN0b3IgKiA5MDtcbiAgICAgICAgLy8gY29udmVydCBhbmdsZXMgdG8gMCB0byAtMTgwIGZvciBhbnRpLWNsb2NrIGFuZCAwIHRvIDE4MCBmb3IgY2xvY2sgd2lzZVxuICAgICAgICBhbmdsZXMuZmlyc3QucHVzaChuZXdBbmdsZTEgPiAxODAgPyBuZXdBbmdsZTEgLSAzNjAgOiBuZXdBbmdsZTEpO1xuICAgICAgICBjb25zdCBuZXdBbmdsZTIgPSBhbmdsZTIgKyBmYWN0b3IgKiA5MDtcbiAgICAgICAgYW5nbGVzLnNlY29uZC5wdXNoKG5ld0FuZ2xlMiA+IDE4MCA/IG5ld0FuZ2xlMiAtIDM2MCA6IG5ld0FuZ2xlMik7XG4gICAgICB9KTtcblxuICAgICAgY29uc3QgZGlzdGFuY2UgPSB0dXJmRGlzdGFuY2UocG9pbnQocDEpLCBwb2ludChwMykpO1xuICAgICAgLy8gRHJhdyBpbWFnaW5hcnkgcmlnaHQgYW5nbGUgbGluZXMgZm9yIGJvdGggZmlyc3QgYW5kIGxhc3QgcG9pbnRzIGluIGxpbmVTdHJpbmdcbiAgICAgIC8vIElmIHRoZXJlIGlzIGludGVyc2VjdGlvbiBwb2ludCBmb3IgYW55IDIgbGluZXMsIHdpbGwgYmUgdGhlIDkwIGRlZ3JlZSBwb2ludC5cbiAgICAgIFswLCAxLCAyXS5mb3JFYWNoKChpbmRleEZpcnN0KSA9PiB7XG4gICAgICAgIGNvbnN0IGxpbmUxID0gbGluZVN0cmluZyhbXG4gICAgICAgICAgcDEsXG4gICAgICAgICAgZGVzdGluYXRpb24ocDEsIGRpc3RhbmNlLCBhbmdsZXMuZmlyc3RbaW5kZXhGaXJzdF0pLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgICBdKTtcbiAgICAgICAgWzAsIDEsIDJdLmZvckVhY2goKGluZGV4U2Vjb25kKSA9PiB7XG4gICAgICAgICAgY29uc3QgbGluZTIgPSBsaW5lU3RyaW5nKFtcbiAgICAgICAgICAgIHAzLFxuICAgICAgICAgICAgZGVzdGluYXRpb24ocDMsIGRpc3RhbmNlLCBhbmdsZXMuc2Vjb25kW2luZGV4U2Vjb25kXSkuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgXSk7XG4gICAgICAgICAgY29uc3QgZmMgPSBsaW5lSW50ZXJzZWN0KGxpbmUxLCBsaW5lMik7XG4gICAgICAgICAgaWYgKGZjICYmIGZjLmZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gZm91bmQgdGhlIGludGVyc2VjdCBwb2ludFxuICAgICAgICAgICAgcHQgPSBmYy5mZWF0dXJlc1swXS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBwdDtcbiAgfVxufVxuIl19