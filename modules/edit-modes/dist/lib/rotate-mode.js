"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RotateMode = void 0;

var _bbox = _interopRequireDefault(require("@turf/bbox"));

var _centroid = _interopRequireDefault(require("@turf/centroid"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _meta = require("@turf/meta");

var _invariant = require("@turf/invariant");

var _helpers = require("@turf/helpers");

var _transformRotate = _interopRequireDefault(require("@turf/transform-rotate"));

var _polygonToLine = _interopRequireDefault(require("@turf/polygon-to-line"));

var _utils = require("../utils");

var _geojsonEditMode = require("./geojson-edit-mode");

var _immutableFeatureCollection = require("./immutable-feature-collection");

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RotateMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(RotateMode, _GeoJsonEditMode);

  var _super = _createSuper(RotateMode);

  function RotateMode() {
    var _this;

    _classCallCheck(this, RotateMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_selectedEditHandle", void 0);

    _defineProperty(_assertThisInitialized(_this), "_geometryBeingRotated", void 0);

    _defineProperty(_assertThisInitialized(_this), "_isRotating", false);

    _defineProperty(_assertThisInitialized(_this), "_isSinglePointGeometrySelected", function (geometry) {
      var _ref = geometry || {},
          features = _ref.features;

      if (Array.isArray(features) && features.length === 1) {
        // @ts-ignore
        var _getGeom = (0, _invariant.getGeom)(features[0]),
            type = _getGeom.type;

        return type === 'Point';
      }

      return false;
    });

    _defineProperty(_assertThisInitialized(_this), "getIsRotating", function () {
      return _this._isRotating;
    });

    return _this;
  }

  _createClass(RotateMode, [{
    key: "getGuides",
    value: function getGuides(props) {
      var selectedGeometry = this._geometryBeingRotated || this.getSelectedFeaturesAsFeatureCollection(props);

      if (this._isSinglePointGeometrySelected(selectedGeometry)) {
        return {
          type: 'FeatureCollection',
          features: []
        };
      }

      if (this._isRotating) {
        // Display rotate pivot
        return (0, _helpers.featureCollection)([(0, _centroid["default"])(selectedGeometry)]);
      }

      var boundingBox = (0, _bboxPolygon["default"])((0, _bbox["default"])(selectedGeometry));
      var previousCoord = null;
      var topEdgeMidpointCoords = null;
      var longestEdgeLength = 0;
      (0, _meta.coordEach)(boundingBox, function (coord) {
        if (previousCoord) {
          // @ts-ignore
          var edgeMidpoint = (0, _geojsonEditMode.getIntermediatePosition)(coord, previousCoord);

          if (!topEdgeMidpointCoords || edgeMidpoint[1] > topEdgeMidpointCoords[1]) {
            // Get the top edge midpoint of the enveloping box
            topEdgeMidpointCoords = edgeMidpoint;
          } // Get the length of the longest edge of the enveloping box


          var edgeDistance = (0, _distance["default"])(coord, previousCoord);
          longestEdgeLength = Math.max(longestEdgeLength, edgeDistance);
        }

        previousCoord = coord;
      }); // Scale the length of the line between the rotate handler and the enveloping box
      // relative to the length of the longest edge of the enveloping box

      var rotateHandleCoords = topEdgeMidpointCoords && [topEdgeMidpointCoords[0], topEdgeMidpointCoords[1] + longestEdgeLength / 1000];
      var lineFromEnvelopeToRotateHandle = (0, _helpers.lineString)([topEdgeMidpointCoords, rotateHandleCoords]);
      var rotateHandle = (0, _helpers.point)(rotateHandleCoords, {
        guideType: 'editHandle',
        editHandleType: 'rotate'
      }); // @ts-ignore

      return (0, _helpers.featureCollection)([// @ts-ignore
      (0, _polygonToLine["default"])(boundingBox), // @ts-ignore
      rotateHandle, // @ts-ignore
      lineFromEnvelopeToRotateHandle]);
    }
  }, {
    key: "handleDragging",
    value: function handleDragging(event, props) {
      if (!this._isRotating) {
        return;
      }

      var rotateAction = this.getRotateAction(event.pointerDownMapCoords, event.mapCoords, 'rotating', props);

      if (rotateAction) {
        props.onEdit(rotateAction);
      }

      event.cancelPan();
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      if (!this._isRotating) {
        var selectedEditHandle = (0, _utils.getPickedEditHandle)(event.picks);
        this._selectedEditHandle = selectedEditHandle && selectedEditHandle.properties.editHandleType === 'rotate' ? selectedEditHandle : null;
      }

      this.updateCursor(props);
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      if (this._selectedEditHandle) {
        this._isRotating = true;
        this._geometryBeingRotated = this.getSelectedFeaturesAsFeatureCollection(props);
      }
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      if (this._isRotating) {
        // Rotate the geometry
        var rotateAction = this.getRotateAction(event.pointerDownMapCoords, event.mapCoords, 'rotated', props);

        if (rotateAction) {
          props.onEdit(rotateAction);
        }

        this._geometryBeingRotated = null;
        this._selectedEditHandle = null;
        this._isRotating = false;
      }
    }
  }, {
    key: "updateCursor",
    value: function updateCursor(props) {
      if (this._selectedEditHandle) {
        // TODO: look at doing SVG cursors to get a better "rotate" cursor
        props.onUpdateCursor('crosshair');
      } else {
        props.onUpdateCursor(null);
      }
    }
  }, {
    key: "getRotateAction",
    value: function getRotateAction(startDragPoint, currentPoint, editType, props) {
      if (!this._geometryBeingRotated) {
        return null;
      }

      var centroid = (0, _centroid["default"])(this._geometryBeingRotated);
      var angle = getRotationAngle(centroid, startDragPoint, currentPoint); // @ts-ignore

      var rotatedFeatures = (0, _transformRotate["default"])( // @ts-ignore
      this._geometryBeingRotated, angle, {
        pivot: centroid
      });
      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data);
      var selectedIndexes = props.selectedIndexes;

      for (var i = 0; i < selectedIndexes.length; i++) {
        var selectedIndex = selectedIndexes[i];
        var movedFeature = rotatedFeatures.features[i];
        updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
      }

      return {
        updatedData: updatedData.getObject(),
        editType: editType,
        editContext: {
          featureIndexes: selectedIndexes
        }
      };
    }
  }]);

  return RotateMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.RotateMode = RotateMode;

function getRotationAngle(centroid, startDragPoint, currentPoint) {
  var bearing1 = (0, _bearing["default"])(centroid, startDragPoint);
  var bearing2 = (0, _bearing["default"])(centroid, currentPoint);
  return bearing2 - bearing1;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcm90YXRlLW1vZGUudHMiXSwibmFtZXMiOlsiUm90YXRlTW9kZSIsImdlb21ldHJ5IiwiZmVhdHVyZXMiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJ0eXBlIiwiX2lzUm90YXRpbmciLCJwcm9wcyIsInNlbGVjdGVkR2VvbWV0cnkiLCJfZ2VvbWV0cnlCZWluZ1JvdGF0ZWQiLCJnZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbiIsIl9pc1NpbmdsZVBvaW50R2VvbWV0cnlTZWxlY3RlZCIsImJvdW5kaW5nQm94IiwicHJldmlvdXNDb29yZCIsInRvcEVkZ2VNaWRwb2ludENvb3JkcyIsImxvbmdlc3RFZGdlTGVuZ3RoIiwiY29vcmQiLCJlZGdlTWlkcG9pbnQiLCJlZGdlRGlzdGFuY2UiLCJNYXRoIiwibWF4Iiwicm90YXRlSGFuZGxlQ29vcmRzIiwibGluZUZyb21FbnZlbG9wZVRvUm90YXRlSGFuZGxlIiwicm90YXRlSGFuZGxlIiwiZ3VpZGVUeXBlIiwiZWRpdEhhbmRsZVR5cGUiLCJldmVudCIsInJvdGF0ZUFjdGlvbiIsImdldFJvdGF0ZUFjdGlvbiIsInBvaW50ZXJEb3duTWFwQ29vcmRzIiwibWFwQ29vcmRzIiwib25FZGl0IiwiY2FuY2VsUGFuIiwic2VsZWN0ZWRFZGl0SGFuZGxlIiwicGlja3MiLCJfc2VsZWN0ZWRFZGl0SGFuZGxlIiwicHJvcGVydGllcyIsInVwZGF0ZUN1cnNvciIsIm9uVXBkYXRlQ3Vyc29yIiwic3RhcnREcmFnUG9pbnQiLCJjdXJyZW50UG9pbnQiLCJlZGl0VHlwZSIsImNlbnRyb2lkIiwiYW5nbGUiLCJnZXRSb3RhdGlvbkFuZ2xlIiwicm90YXRlZEZlYXR1cmVzIiwicGl2b3QiLCJ1cGRhdGVkRGF0YSIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiZGF0YSIsInNlbGVjdGVkSW5kZXhlcyIsImkiLCJzZWxlY3RlZEluZGV4IiwibW92ZWRGZWF0dXJlIiwicmVwbGFjZUdlb21ldHJ5IiwiZ2V0T2JqZWN0IiwiZWRpdENvbnRleHQiLCJmZWF0dXJlSW5kZXhlcyIsIkdlb0pzb25FZGl0TW9kZSIsImJlYXJpbmcxIiwiYmVhcmluZzIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFVQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrRUFHRyxLOztxRkFFbUIsVUFBQ0MsUUFBRCxFQUE2RDtBQUFBLGlCQUN2RUEsUUFBUSxJQUFJLEVBRDJEO0FBQUEsVUFDcEZDLFFBRG9GLFFBQ3BGQSxRQURvRjs7QUFFNUYsVUFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNGLFFBQWQsS0FBMkJBLFFBQVEsQ0FBQ0csTUFBVCxLQUFvQixDQUFuRCxFQUFzRDtBQUNwRDtBQURvRCx1QkFFbkMsd0JBQVFILFFBQVEsQ0FBQyxDQUFELENBQWhCLENBRm1DO0FBQUEsWUFFNUNJLElBRjRDLFlBRTVDQSxJQUY0Qzs7QUFHcEQsZUFBT0EsSUFBSSxLQUFLLE9BQWhCO0FBQ0Q7O0FBQ0QsYUFBTyxLQUFQO0FBQ0QsSzs7b0VBRWU7QUFBQSxhQUFNLE1BQUtDLFdBQVg7QUFBQSxLOzs7Ozs7OzhCQUVOQyxLLEVBQTZEO0FBQ3JFLFVBQU1DLGdCQUFnQixHQUNwQixLQUFLQyxxQkFBTCxJQUE4QixLQUFLQyxzQ0FBTCxDQUE0Q0gsS0FBNUMsQ0FEaEM7O0FBR0EsVUFBSSxLQUFLSSw4QkFBTCxDQUFvQ0gsZ0JBQXBDLENBQUosRUFBMkQ7QUFDekQsZUFBTztBQUFFSCxVQUFBQSxJQUFJLEVBQUUsbUJBQVI7QUFBNkJKLFVBQUFBLFFBQVEsRUFBRTtBQUF2QyxTQUFQO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLSyxXQUFULEVBQXNCO0FBQ3BCO0FBQ0EsZUFBTyxnQ0FBa0IsQ0FBQywwQkFBYUUsZ0JBQWIsQ0FBRCxDQUFs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LENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELGVBQWUsQ0FBQzlDLE1BQXBDLEVBQTRDK0MsQ0FBQyxFQUE3QyxFQUFpRDtBQUMvQyxZQUFNQyxhQUFhLEdBQUdGLGVBQWUsQ0FBQ0MsQ0FBRCxDQUFyQztBQUNBLFlBQU1FLFlBQVksR0FBR1IsZUFBZSxDQUFDNUMsUUFBaEIsQ0FBeUJrRCxDQUF6QixDQUFyQjtBQUNBSixRQUFBQSxXQUFXLEdBQUdBLFdBQVcsQ0FBQ08sZUFBWixDQUE0QkYsYUFBNUIsRUFBMkNDLFlBQVksQ0FBQ3JELFFBQXhELENBQWQ7QUFDRDs7QUFFRCxhQUFPO0FBQ0wrQyxRQUFBQSxXQUFXLEVBQUVBLFdBQVcsQ0FBQ1EsU0FBWixFQURSO0FBRUxkLFFBQUFBLFFBQVEsRUFBUkEsUUFGSztBQUdMZSxRQUFBQSxXQUFXLEVBQUU7QUFDWEMsVUFBQUEsY0FBYyxFQUFFUDtBQURMO0FBSFIsT0FBUDtBQU9EOzs7O0VBbEw2QlEsZ0M7Ozs7QUFxTGhDLFNBQVNkLGdCQUFULENBQTBCRixRQUExQixFQUE4Q0gsY0FBOUMsRUFBd0VDLFlBQXhFLEVBQWdHO0FBQzlGLE1BQU1tQixRQUFRLEdBQUcseUJBQVlqQixRQUFaLEVBQXNCSCxjQUF0QixDQUFqQjtBQUNBLE1BQU1xQixRQUFRLEdBQUcseUJBQVlsQixRQUFaLEVBQXNCRixZQUF0QixDQUFqQjtBQUNBLFNBQU9vQixRQUFRLEdBQUdELFFBQWxCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBwcmV0dGllci9wcmV0dGllciAqL1xuaW1wb3J0IGJib3ggZnJvbSAnQHR1cmYvYmJveCc7XG5pbXBvcnQgdHVyZkNlbnRyb2lkIGZyb20gJ0B0dXJmL2NlbnRyb2lkJztcbmltcG9ydCB0dXJmQmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCBiYm94UG9seWdvbiBmcm9tICdAdHVyZi9iYm94LXBvbHlnb24nO1xuaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgeyBjb29yZEVhY2ggfSBmcm9tICdAdHVyZi9tZXRhJztcbmltcG9ydCB7IGdldEdlb20gfSBmcm9tICdAdHVyZi9pbnZhcmlhbnQnO1xuaW1wb3J0IHsgcG9pbnQsIGZlYXR1cmVDb2xsZWN0aW9uLCBsaW5lU3RyaW5nIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgdHVyZlRyYW5zZm9ybVJvdGF0ZSBmcm9tICdAdHVyZi90cmFuc2Zvcm0tcm90YXRlJztcbmltcG9ydCBwb2x5Z29uVG9MaW5lIGZyb20gJ0B0dXJmL3BvbHlnb24tdG8tbGluZSc7XG5pbXBvcnQge1xuICBQb2ludGVyTW92ZUV2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50LFxuICBEcmFnZ2luZ0V2ZW50LFxuICBNb2RlUHJvcHMsXG4gIEVkaXRIYW5kbGVGZWF0dXJlLFxuICBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBnZXRQaWNrZWRFZGl0SGFuZGxlIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgRmVhdHVyZUNvbGxlY3Rpb24sIFBvc2l0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcyc7XG5pbXBvcnQgeyBHZW9Kc29uRWRpdE1vZGUsIEdlb0pzb25FZGl0QWN0aW9uLCBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbiB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUnO1xuaW1wb3J0IHsgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuL2ltbXV0YWJsZS1mZWF0dXJlLWNvbGxlY3Rpb24nO1xuXG5leHBvcnQgY2xhc3MgUm90YXRlTW9kZSBleHRlbmRzIEdlb0pzb25FZGl0TW9kZSB7XG4gIF9zZWxlY3RlZEVkaXRIYW5kbGU6IEVkaXRIYW5kbGVGZWF0dXJlIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgX2dlb21ldHJ5QmVpbmdSb3RhdGVkOiBGZWF0dXJlQ29sbGVjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIF9pc1JvdGF0aW5nID0gZmFsc2U7XG5cbiAgX2lzU2luZ2xlUG9pbnRHZW9tZXRyeVNlbGVjdGVkID0gKGdlb21ldHJ5OiBGZWF0dXJlQ29sbGVjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSBnZW9tZXRyeSB8fCB7fTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShmZWF0dXJlcykgJiYgZmVhdHVyZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCB7IHR5cGUgfSA9IGdldEdlb20oZmVhdHVyZXNbMF0pO1xuICAgICAgcmV0dXJuIHR5cGUgPT09ICdQb2ludCc7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBnZXRJc1JvdGF0aW5nID0gKCkgPT4gdGhpcy5faXNSb3RhdGluZztcblxuICBnZXRHdWlkZXMocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICBjb25zdCBzZWxlY3RlZEdlb21ldHJ5ID1cbiAgICAgIHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkIHx8IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMpO1xuXG4gICAgaWYgKHRoaXMuX2lzU2luZ2xlUG9pbnRHZW9tZXRyeVNlbGVjdGVkKHNlbGVjdGVkR2VvbWV0cnkpKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLCBmZWF0dXJlczogW10gfTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5faXNSb3RhdGluZykge1xuICAgICAgLy8gRGlzcGxheSByb3RhdGUgcGl2b3RcbiAgICAgIHJldHVybiBmZWF0dXJlQ29sbGVjdGlvbihbdHVyZkNlbnRyb2lkKHNlbGVjdGVkR2VvbWV0cnkpXSkgYXMgR3VpZGVGZWF0dXJlQ29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICBjb25zdCBib3VuZGluZ0JveCA9IGJib3hQb2x5Z29uKGJib3goc2VsZWN0ZWRHZW9tZXRyeSkpO1xuXG4gICAgbGV0IHByZXZpb3VzQ29vcmQgPSBudWxsO1xuICAgIGxldCB0b3BFZGdlTWlkcG9pbnRDb29yZHMgPSBudWxsO1xuICAgIGxldCBsb25nZXN0RWRnZUxlbmd0aCA9IDA7XG5cbiAgICBjb29yZEVhY2goYm91bmRpbmdCb3gsIChjb29yZCkgPT4ge1xuICAgICAgaWYgKHByZXZpb3VzQ29vcmQpIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCBlZGdlTWlkcG9pbnQgPSBnZXRJbnRlcm1lZGlhdGVQb3NpdGlvbihjb29yZCwgcHJldmlvdXNDb29yZCk7XG4gICAgICAgIGlmICghdG9wRWRnZU1pZHBvaW50Q29vcmRzIHx8IGVkZ2VNaWRwb2ludFsxXSA+IHRvcEVkZ2VNaWRwb2ludENvb3Jkc1sxXSkge1xuICAgICAgICAgIC8vIEdldCB0aGUgdG9wIGVkZ2UgbWlkcG9pbnQgb2YgdGhlIGVudmVsb3BpbmcgYm94XG4gICAgICAgICAgdG9wRWRnZU1pZHBvaW50Q29vcmRzID0gZWRnZU1pZHBvaW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIEdldCB0aGUgbGVuZ3RoIG9mIHRoZSBsb25nZXN0IGVkZ2Ugb2YgdGhlIGVudmVsb3BpbmcgYm94XG4gICAgICAgIGNvbnN0IGVkZ2VEaXN0YW5jZSA9IHR1cmZEaXN0YW5jZShjb29yZCwgcHJldmlvdXNDb29yZCk7XG4gICAgICAgIGxvbmdlc3RFZGdlTGVuZ3RoID0gTWF0aC5tYXgobG9uZ2VzdEVkZ2VMZW5ndGgsIGVkZ2VEaXN0YW5jZSk7XG4gICAgICB9XG4gICAgICBwcmV2aW91c0Nvb3JkID0gY29vcmQ7XG4gICAgfSk7XG5cbiAgICAvLyBTY2FsZSB0aGUgbGVuZ3RoIG9mIHRoZSBsaW5lIGJldHdlZW4gdGhlIHJvdGF0ZSBoYW5kbGVyIGFuZCB0aGUgZW52ZWxvcGluZyBib3hcbiAgICAvLyByZWxhdGl2ZSB0byB0aGUgbGVuZ3RoIG9mIHRoZSBsb25nZXN0IGVkZ2Ugb2YgdGhlIGVudmVsb3BpbmcgYm94XG4gICAgY29uc3Qgcm90YXRlSGFuZGxlQ29vcmRzID0gdG9wRWRnZU1pZHBvaW50Q29vcmRzICYmIFtcbiAgICAgIHRvcEVkZ2VNaWRwb2ludENvb3Jkc1swXSxcbiAgICAgIHRvcEVkZ2VNaWRwb2ludENvb3Jkc1sxXSArIGxvbmdlc3RFZGdlTGVuZ3RoIC8gMTAwMCxcbiAgICBdO1xuXG4gICAgY29uc3QgbGluZUZyb21FbnZlbG9wZVRvUm90YXRlSGFuZGxlID0gbGluZVN0cmluZyhbdG9wRWRnZU1pZHBvaW50Q29vcmRzLCByb3RhdGVIYW5kbGVDb29yZHNdKTtcbiAgICBjb25zdCByb3RhdGVIYW5kbGUgPSBwb2ludChyb3RhdGVIYW5kbGVDb29yZHMsIHtcbiAgICAgIGd1aWRlVHlwZTogJ2VkaXRIYW5kbGUnLFxuICAgICAgZWRpdEhhbmRsZVR5cGU6ICdyb3RhdGUnLFxuICAgIH0pO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gZmVhdHVyZUNvbGxlY3Rpb24oW1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcG9seWdvblRvTGluZShib3VuZGluZ0JveCksXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICByb3RhdGVIYW5kbGUsXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBsaW5lRnJvbUVudmVsb3BlVG9Sb3RhdGVIYW5kbGUsXG4gICAgXSk7XG4gIH1cblxuICBoYW5kbGVEcmFnZ2luZyhldmVudDogRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBpZiAoIXRoaXMuX2lzUm90YXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByb3RhdGVBY3Rpb24gPSB0aGlzLmdldFJvdGF0ZUFjdGlvbihcbiAgICAgIGV2ZW50LnBvaW50ZXJEb3duTWFwQ29vcmRzLFxuICAgICAgZXZlbnQubWFwQ29vcmRzLFxuICAgICAgJ3JvdGF0aW5nJyxcbiAgICAgIHByb3BzXG4gICAgKTtcbiAgICBpZiAocm90YXRlQWN0aW9uKSB7XG4gICAgICBwcm9wcy5vbkVkaXQocm90YXRlQWN0aW9uKTtcbiAgICB9XG5cbiAgICBldmVudC5jYW5jZWxQYW4oKTtcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGlmICghdGhpcy5faXNSb3RhdGluZykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRFZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG4gICAgICB0aGlzLl9zZWxlY3RlZEVkaXRIYW5kbGUgPVxuICAgICAgICBzZWxlY3RlZEVkaXRIYW5kbGUgJiYgc2VsZWN0ZWRFZGl0SGFuZGxlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUgPT09ICdyb3RhdGUnXG4gICAgICAgICAgPyBzZWxlY3RlZEVkaXRIYW5kbGVcbiAgICAgICAgICA6IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVDdXJzb3IocHJvcHMpO1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGlmICh0aGlzLl9zZWxlY3RlZEVkaXRIYW5kbGUpIHtcbiAgICAgIHRoaXMuX2lzUm90YXRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uKHByb3BzKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGlmICh0aGlzLl9pc1JvdGF0aW5nKSB7XG4gICAgICAvLyBSb3RhdGUgdGhlIGdlb21ldHJ5XG4gICAgICBjb25zdCByb3RhdGVBY3Rpb24gPSB0aGlzLmdldFJvdGF0ZUFjdGlvbihcbiAgICAgICAgZXZlbnQucG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgICAgIGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgICAgJ3JvdGF0ZWQnLFxuICAgICAgICBwcm9wc1xuICAgICAgKTtcblxuICAgICAgaWYgKHJvdGF0ZUFjdGlvbikge1xuICAgICAgICBwcm9wcy5vbkVkaXQocm90YXRlQWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQgPSBudWxsO1xuICAgICAgdGhpcy5fc2VsZWN0ZWRFZGl0SGFuZGxlID0gbnVsbDtcbiAgICAgIHRoaXMuX2lzUm90YXRpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVDdXJzb3IocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRFZGl0SGFuZGxlKSB7XG4gICAgICAvLyBUT0RPOiBsb29rIGF0IGRvaW5nIFNWRyBjdXJzb3JzIHRvIGdldCBhIGJldHRlciBcInJvdGF0ZVwiIGN1cnNvclxuICAgICAgcHJvcHMub25VcGRhdGVDdXJzb3IoJ2Nyb3NzaGFpcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcihudWxsKTtcbiAgICB9XG4gIH1cblxuICBnZXRSb3RhdGVBY3Rpb24oXG4gICAgc3RhcnREcmFnUG9pbnQ6IFBvc2l0aW9uLFxuICAgIGN1cnJlbnRQb2ludDogUG9zaXRpb24sXG4gICAgZWRpdFR5cGU6IHN0cmluZyxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiBHZW9Kc29uRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGNlbnRyb2lkID0gdHVyZkNlbnRyb2lkKHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkKTtcbiAgICBjb25zdCBhbmdsZSA9IGdldFJvdGF0aW9uQW5nbGUoY2VudHJvaWQsIHN0YXJ0RHJhZ1BvaW50LCBjdXJyZW50UG9pbnQpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCByb3RhdGVkRmVhdHVyZXM6IEZlYXR1cmVDb2xsZWN0aW9uID0gdHVyZlRyYW5zZm9ybVJvdGF0ZShcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkLFxuICAgICAgYW5nbGUsXG4gICAgICB7XG4gICAgICAgIHBpdm90OiBjZW50cm9pZCxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgbGV0IHVwZGF0ZWREYXRhID0gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRJbmRleGVzID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRJbmRleGVzW2ldO1xuICAgICAgY29uc3QgbW92ZWRGZWF0dXJlID0gcm90YXRlZEZlYXR1cmVzLmZlYXR1cmVzW2ldO1xuICAgICAgdXBkYXRlZERhdGEgPSB1cGRhdGVkRGF0YS5yZXBsYWNlR2VvbWV0cnkoc2VsZWN0ZWRJbmRleCwgbW92ZWRGZWF0dXJlLmdlb21ldHJ5KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgZWRpdFR5cGUsXG4gICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICBmZWF0dXJlSW5kZXhlczogc2VsZWN0ZWRJbmRleGVzLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFJvdGF0aW9uQW5nbGUoY2VudHJvaWQ6IFBvc2l0aW9uLCBzdGFydERyYWdQb2ludDogUG9zaXRpb24sIGN1cnJlbnRQb2ludDogUG9zaXRpb24pIHtcbiAgY29uc3QgYmVhcmluZzEgPSB0dXJmQmVhcmluZyhjZW50cm9pZCwgc3RhcnREcmFnUG9pbnQpO1xuICBjb25zdCBiZWFyaW5nMiA9IHR1cmZCZWFyaW5nKGNlbnRyb2lkLCBjdXJyZW50UG9pbnQpO1xuICByZXR1cm4gYmVhcmluZzIgLSBiZWFyaW5nMTtcbn1cbiJdfQ==