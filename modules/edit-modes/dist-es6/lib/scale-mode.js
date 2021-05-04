"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScaleMode = void 0;

var _bbox = _interopRequireDefault(require("@turf/bbox"));

var _centroid = _interopRequireDefault(require("@turf/centroid"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

var _helpers = require("@turf/helpers");

var _polygonToLine = _interopRequireDefault(require("@turf/polygon-to-line"));

var _meta = require("@turf/meta");

var _distance = _interopRequireDefault(require("@turf/distance"));

var _transformScale = _interopRequireDefault(require("@turf/transform-scale"));

var _invariant = require("@turf/invariant");

var _utils = require("../utils");

var _geojsonEditMode = require("./geojson-edit-mode");

var _immutableFeatureCollection = require("./immutable-feature-collection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var ScaleMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(ScaleMode, _GeoJsonEditMode);

  var _super = _createSuper(ScaleMode);

  function ScaleMode() {
    var _this;

    _classCallCheck(this, ScaleMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_geometryBeingScaled", void 0);

    _defineProperty(_assertThisInitialized(_this), "_selectedEditHandle", void 0);

    _defineProperty(_assertThisInitialized(_this), "_cornerGuidePoints", void 0);

    _defineProperty(_assertThisInitialized(_this), "_cursor", void 0);

    _defineProperty(_assertThisInitialized(_this), "_isScaling", false);

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

    _defineProperty(_assertThisInitialized(_this), "_getOppositeScaleHandle", function (selectedHandle) {
      var selectedHandleIndex = selectedHandle && selectedHandle.properties && Array.isArray(selectedHandle.properties.positionIndexes) && selectedHandle.properties.positionIndexes[0];

      if (typeof selectedHandleIndex !== 'number') {
        return null;
      }

      var guidePointCount = _this._cornerGuidePoints.length;
      var oppositeIndex = (selectedHandleIndex + guidePointCount / 2) % guidePointCount;
      return _this._cornerGuidePoints.find(function (p) {
        if (!Array.isArray(p.properties.positionIndexes)) {
          return false;
        }

        return p.properties.positionIndexes[0] === oppositeIndex;
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_getUpdatedData", function (props, editedData) {
      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data);
      var selectedIndexes = props.selectedIndexes;

      for (var i = 0; i < selectedIndexes.length; i++) {
        var selectedIndex = selectedIndexes[i];
        var movedFeature = editedData.features[i];
        updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
      }

      return updatedData.getObject();
    });

    _defineProperty(_assertThisInitialized(_this), "isEditHandleSelected", function () {
      return Boolean(_this._selectedEditHandle);
    });

    _defineProperty(_assertThisInitialized(_this), "getScaleAction", function (startDragPoint, currentPoint, editType, props) {
      if (!_this._selectedEditHandle) {
        return null;
      }

      var oppositeHandle = _this._getOppositeScaleHandle(_this._selectedEditHandle);

      var origin = (0, _invariant.getCoord)(oppositeHandle); // @ts-ignore

      var scaleFactor = getScaleFactor(origin, startDragPoint, currentPoint); // @ts-ignore

      var scaledFeatures = (0, _transformScale["default"])( // @ts-ignore
      _this._geometryBeingScaled, scaleFactor, {
        origin: origin
      });
      return {
        updatedData: _this._getUpdatedData(props, scaledFeatures),
        editType: editType,
        editContext: {
          featureIndexes: props.selectedIndexes
        }
      };
    });

    _defineProperty(_assertThisInitialized(_this), "updateCursor", function (props) {
      if (_this._selectedEditHandle) {
        if (_this._cursor) {
          props.onUpdateCursor(_this._cursor);
        }

        var cursorGeometry = _this.getSelectedFeaturesAsFeatureCollection(props); // Get resize cursor direction from the hovered scale editHandle (e.g. nesw or nwse)


        var centroid = (0, _centroid["default"])(cursorGeometry);
        var bearing = (0, _bearing["default"])(centroid, _this._selectedEditHandle);
        var positiveBearing = bearing < 0 ? bearing + 180 : bearing;

        if (positiveBearing >= 0 && positiveBearing <= 90 || positiveBearing >= 180 && positiveBearing <= 270) {
          _this._cursor = 'nesw-resize';
          props.onUpdateCursor('nesw-resize');
        } else {
          _this._cursor = 'nwse-resize';
          props.onUpdateCursor('nwse-resize');
        }
      } else {
        props.onUpdateCursor(null);
        _this._cursor = null;
      }
    });

    return _this;
  }

  _createClass(ScaleMode, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      if (!this._isScaling) {
        var selectedEditHandle = (0, _utils.getPickedEditHandle)(event.picks);
        this._selectedEditHandle = selectedEditHandle && selectedEditHandle.properties.editHandleType === 'scale' ? selectedEditHandle : null;

        if (selectedEditHandle) {
          this.updateCursor(props);
        }
      }
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      if (this._selectedEditHandle) {
        this._isScaling = true;
        this._geometryBeingScaled = this.getSelectedFeaturesAsFeatureCollection(props);
      }
    }
  }, {
    key: "handleDragging",
    value: function handleDragging(event, props) {
      if (!this._isScaling) {
        return;
      }

      props.onUpdateCursor(this._cursor);
      var scaleAction = this.getScaleAction(event.pointerDownMapCoords, event.mapCoords, 'scaling', props);

      if (scaleAction) {
        props.onEdit(scaleAction);
      }

      event.cancelPan();
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      if (this._isScaling) {
        // Scale the geometry
        var scaleAction = this.getScaleAction(event.pointerDownMapCoords, event.mapCoords, 'scaled', props);

        if (scaleAction) {
          props.onEdit(scaleAction);
        }

        props.onUpdateCursor(null);
        this._geometryBeingScaled = null;
        this._selectedEditHandle = null;
        this._cursor = null;
        this._isScaling = false;
      }
    }
  }, {
    key: "getGuides",
    value: function getGuides(props) {
      this._cornerGuidePoints = [];
      var selectedGeometry = this.getSelectedFeaturesAsFeatureCollection(props); // Add buffer to the enveloping box if a single Point feature is selected

      if (this._isSinglePointGeometrySelected(selectedGeometry)) {
        return {
          type: 'FeatureCollection',
          features: []
        };
      }

      var boundingBox = (0, _bboxPolygon["default"])((0, _bbox["default"])(selectedGeometry));
      boundingBox.properties.mode = 'scale';
      var cornerGuidePoints = [];
      (0, _meta.coordEach)(boundingBox, function (coord, coordIndex) {
        if (coordIndex < 4) {
          // Get corner midpoint guides from the enveloping box
          var cornerPoint = (0, _helpers.point)(coord, {
            guideType: 'editHandle',
            editHandleType: 'scale',
            positionIndexes: [coordIndex]
          });
          cornerGuidePoints.push(cornerPoint);
        }
      });
      this._cornerGuidePoints = cornerGuidePoints; // @ts-ignore

      return (0, _helpers.featureCollection)([(0, _polygonToLine["default"])(boundingBox)].concat(_toConsumableArray(this._cornerGuidePoints)));
    }
  }]);

  return ScaleMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.ScaleMode = ScaleMode;

function getScaleFactor(centroid, startDragPoint, currentPoint) {
  var startDistance = (0, _distance["default"])(centroid, startDragPoint);
  var endDistance = (0, _distance["default"])(centroid, currentPoint);
  return endDistance / startDistance;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvc2NhbGUtbW9kZS50cyJdLCJuYW1lcyI6WyJTY2FsZU1vZGUiLCJnZW9tZXRyeSIsImZlYXR1cmVzIiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwidHlwZSIsInNlbGVjdGVkSGFuZGxlIiwic2VsZWN0ZWRIYW5kbGVJbmRleCIsInByb3BlcnRpZXMiLCJwb3NpdGlvbkluZGV4ZXMiLCJndWlkZVBvaW50Q291bnQiLCJfY29ybmVyR3VpZGVQb2ludHMiLCJvcHBvc2l0ZUluZGV4IiwiZmluZCIsInAiLCJwcm9wcyIsImVkaXRlZERhdGEiLCJ1cGRhdGVkRGF0YSIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiZGF0YSIsInNlbGVjdGVkSW5kZXhlcyIsImkiLCJzZWxlY3RlZEluZGV4IiwibW92ZWRGZWF0dXJlIiwicmVwbGFjZUdlb21ldHJ5IiwiZ2V0T2JqZWN0IiwiQm9vbGVhbiIsIl9zZWxlY3RlZEVkaXRIYW5kbGUiLCJzdGFydERyYWdQb2ludCIsImN1cnJlbnRQb2ludCIsImVkaXRUeXBlIiwib3Bwb3NpdGVIYW5kbGUiLCJfZ2V0T3Bwb3NpdGVTY2FsZUhhbmRsZSIsIm9yaWdpbiIsInNjYWxlRmFjdG9yIiwiZ2V0U2NhbGVGYWN0b3IiLCJzY2FsZWRGZWF0dXJlcyIsIl9nZW9tZXRyeUJlaW5nU2NhbGVkIiwiX2dldFVwZGF0ZWREYXRhIiwiZWRpdENvbnRleHQiLCJmZWF0dXJlSW5kZXhlcyIsIl9jdXJzb3IiLCJvblVwZGF0ZUN1cnNvciIsImN1cnNvckdlb21ldHJ5IiwiZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24iLCJjZW50cm9pZCIsImJlYXJpbmciLCJwb3NpdGl2ZUJlYXJpbmciLCJldmVudCIsIl9pc1NjYWxpbmciLCJzZWxlY3RlZEVkaXRIYW5kbGUiLCJwaWNrcyIsImVkaXRIYW5kbGVUeXBlIiwidXBkYXRlQ3Vyc29yIiwic2NhbGVBY3Rpb24iLCJnZXRTY2FsZUFjdGlvbiIsInBvaW50ZXJEb3duTWFwQ29vcmRzIiwibWFwQ29vcmRzIiwib25FZGl0IiwiY2FuY2VsUGFuIiwic2VsZWN0ZWRHZW9tZXRyeSIsIl9pc1NpbmdsZVBvaW50R2VvbWV0cnlTZWxlY3RlZCIsImJvdW5kaW5nQm94IiwibW9kZSIsImNvcm5lckd1aWRlUG9pbnRzIiwiY29vcmQiLCJjb29yZEluZGV4IiwiY29ybmVyUG9pbnQiLCJndWlkZVR5cGUiLCJwdXNoIiwiR2VvSnNvbkVkaXRNb2RlIiwic3RhcnREaXN0YW5jZSIsImVuZERpc3RhbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBV0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2lFQUtFLEs7O3FGQUVvQixVQUFDQyxRQUFELEVBQTZEO0FBQUEsaUJBQ3ZFQSxRQUFRLElBQUksRUFEMkQ7QUFBQSxVQUNwRkMsUUFEb0YsUUFDcEZBLFFBRG9GOztBQUU1RixVQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0YsUUFBZCxLQUEyQkEsUUFBUSxDQUFDRyxNQUFULEtBQW9CLENBQW5ELEVBQXNEO0FBQ3BEO0FBRG9ELHVCQUVuQyx3QkFBUUgsUUFBUSxDQUFDLENBQUQsQ0FBaEIsQ0FGbUM7QUFBQSxZQUU1Q0ksSUFGNEMsWUFFNUNBLElBRjRDOztBQUdwRCxlQUFPQSxJQUFJLEtBQUssT0FBaEI7QUFDRDs7QUFDRCxhQUFPLEtBQVA7QUFDRCxLOzs4RUFFeUIsVUFBQ0MsY0FBRCxFQUF1QztBQUMvRCxVQUFNQyxtQkFBbUIsR0FDdkJELGNBQWMsSUFDZEEsY0FBYyxDQUFDRSxVQURmLElBRUFOLEtBQUssQ0FBQ0MsT0FBTixDQUFjRyxjQUFjLENBQUNFLFVBQWYsQ0FBMEJDLGVBQXhDLENBRkEsSUFHQUgsY0FBYyxDQUFDRSxVQUFm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QXJCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBwcmV0dGllci9wcmV0dGllciAqL1xuaW1wb3J0IGJib3ggZnJvbSAnQHR1cmYvYmJveCc7XG5pbXBvcnQgdHVyZkNlbnRyb2lkIGZyb20gJ0B0dXJmL2NlbnRyb2lkJztcbmltcG9ydCB0dXJmQmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbmltcG9ydCBiYm94UG9seWdvbiBmcm9tICdAdHVyZi9iYm94LXBvbHlnb24nO1xuaW1wb3J0IHsgcG9pbnQsIGZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgcG9seWdvblRvTGluZSBmcm9tICdAdHVyZi9wb2x5Z29uLXRvLWxpbmUnO1xuaW1wb3J0IHsgY29vcmRFYWNoIH0gZnJvbSAnQHR1cmYvbWV0YSc7XG5pbXBvcnQgdHVyZkRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcbmltcG9ydCB0dXJmVHJhbnNmb3JtU2NhbGUgZnJvbSAnQHR1cmYvdHJhbnNmb3JtLXNjYWxlJztcbmltcG9ydCB7IGdldENvb3JkLCBnZXRHZW9tIH0gZnJvbSAnQHR1cmYvaW52YXJpYW50JztcbmltcG9ydCB7IEZlYXR1cmVDb2xsZWN0aW9uLCBQb3NpdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMnO1xuaW1wb3J0IHtcbiAgTW9kZVByb3BzLFxuICBQb2ludGVyTW92ZUV2ZW50LFxuICBTdGFydERyYWdnaW5nRXZlbnQsXG4gIFN0b3BEcmFnZ2luZ0V2ZW50LFxuICBEcmFnZ2luZ0V2ZW50LFxuICBFZGl0SGFuZGxlRmVhdHVyZSxcbiAgR3VpZGVGZWF0dXJlQ29sbGVjdGlvbixcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0UGlja2VkRWRpdEhhbmRsZSB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IEdlb0pzb25FZGl0TW9kZSB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUnO1xuaW1wb3J0IHsgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuL2ltbXV0YWJsZS1mZWF0dXJlLWNvbGxlY3Rpb24nO1xuXG5leHBvcnQgY2xhc3MgU2NhbGVNb2RlIGV4dGVuZHMgR2VvSnNvbkVkaXRNb2RlIHtcbiAgX2dlb21ldHJ5QmVpbmdTY2FsZWQ6IEZlYXR1cmVDb2xsZWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgX3NlbGVjdGVkRWRpdEhhbmRsZTogRWRpdEhhbmRsZUZlYXR1cmUgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBfY29ybmVyR3VpZGVQb2ludHM6IEFycmF5PEVkaXRIYW5kbGVGZWF0dXJlPjtcbiAgX2N1cnNvcjogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgX2lzU2NhbGluZyA9IGZhbHNlO1xuXG4gIF9pc1NpbmdsZVBvaW50R2VvbWV0cnlTZWxlY3RlZCA9IChnZW9tZXRyeTogRmVhdHVyZUNvbGxlY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgeyBmZWF0dXJlcyB9ID0gZ2VvbWV0cnkgfHwge307XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZmVhdHVyZXMpICYmIGZlYXR1cmVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgeyB0eXBlIH0gPSBnZXRHZW9tKGZlYXR1cmVzWzBdKTtcbiAgICAgIHJldHVybiB0eXBlID09PSAnUG9pbnQnO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgX2dldE9wcG9zaXRlU2NhbGVIYW5kbGUgPSAoc2VsZWN0ZWRIYW5kbGU6IEVkaXRIYW5kbGVGZWF0dXJlKSA9PiB7XG4gICAgY29uc3Qgc2VsZWN0ZWRIYW5kbGVJbmRleCA9XG4gICAgICBzZWxlY3RlZEhhbmRsZSAmJlxuICAgICAgc2VsZWN0ZWRIYW5kbGUucHJvcGVydGllcyAmJlxuICAgICAgQXJyYXkuaXNBcnJheShzZWxlY3RlZEhhbmRsZS5wcm9wZXJ0aWVzLnBvc2l0aW9uSW5kZXhlcykgJiZcbiAgICAgIHNlbGVjdGVkSGFuZGxlLnByb3BlcnRpZXMucG9zaXRpb25JbmRleGVzWzBdO1xuXG4gICAgaWYgKHR5cGVvZiBzZWxlY3RlZEhhbmRsZUluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGd1aWRlUG9pbnRDb3VudCA9IHRoaXMuX2Nvcm5lckd1aWRlUG9pbnRzLmxlbmd0aDtcbiAgICBjb25zdCBvcHBvc2l0ZUluZGV4ID0gKHNlbGVjdGVkSGFuZGxlSW5kZXggKyBndWlkZVBvaW50Q291bnQgLyAyKSAlIGd1aWRlUG9pbnRDb3VudDtcbiAgICByZXR1cm4gdGhpcy5fY29ybmVyR3VpZGVQb2ludHMuZmluZCgocCkgPT4ge1xuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHAucHJvcGVydGllcy5wb3NpdGlvbkluZGV4ZXMpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwLnByb3BlcnRpZXMucG9zaXRpb25JbmRleGVzWzBdID09PSBvcHBvc2l0ZUluZGV4O1xuICAgIH0pO1xuICB9O1xuXG4gIF9nZXRVcGRhdGVkRGF0YSA9IChwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPiwgZWRpdGVkRGF0YTogRmVhdHVyZUNvbGxlY3Rpb24pID0+IHtcbiAgICBsZXQgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSk7XG4gICAgY29uc3Qgc2VsZWN0ZWRJbmRleGVzID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRJbmRleGVzW2ldO1xuICAgICAgY29uc3QgbW92ZWRGZWF0dXJlID0gZWRpdGVkRGF0YS5mZWF0dXJlc1tpXTtcbiAgICAgIHVwZGF0ZWREYXRhID0gdXBkYXRlZERhdGEucmVwbGFjZUdlb21ldHJ5KHNlbGVjdGVkSW5kZXgsIG1vdmVkRmVhdHVyZS5nZW9tZXRyeSk7XG4gICAgfVxuICAgIHJldHVybiB1cGRhdGVkRGF0YS5nZXRPYmplY3QoKTtcbiAgfTtcblxuICBpc0VkaXRIYW5kbGVTZWxlY3RlZCA9ICgpOiBib29sZWFuID0+IEJvb2xlYW4odGhpcy5fc2VsZWN0ZWRFZGl0SGFuZGxlKTtcblxuICBnZXRTY2FsZUFjdGlvbiA9IChcbiAgICBzdGFydERyYWdQb2ludDogUG9zaXRpb24sXG4gICAgY3VycmVudFBvaW50OiBQb3NpdGlvbixcbiAgICBlZGl0VHlwZTogc3RyaW5nLFxuICAgIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+XG4gICkgPT4ge1xuICAgIGlmICghdGhpcy5fc2VsZWN0ZWRFZGl0SGFuZGxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBvcHBvc2l0ZUhhbmRsZSA9IHRoaXMuX2dldE9wcG9zaXRlU2NhbGVIYW5kbGUodGhpcy5fc2VsZWN0ZWRFZGl0SGFuZGxlKTtcbiAgICBjb25zdCBvcmlnaW4gPSBnZXRDb29yZChvcHBvc2l0ZUhhbmRsZSk7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gZ2V0U2NhbGVGYWN0b3Iob3JpZ2luLCBzdGFydERyYWdQb2ludCwgY3VycmVudFBvaW50KTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3Qgc2NhbGVkRmVhdHVyZXM6IEZlYXR1cmVDb2xsZWN0aW9uID0gdHVyZlRyYW5zZm9ybVNjYWxlKFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCxcbiAgICAgIHNjYWxlRmFjdG9yLFxuICAgICAgeyBvcmlnaW4gfVxuICAgICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlZERhdGE6IHRoaXMuX2dldFVwZGF0ZWREYXRhKHByb3BzLCBzY2FsZWRGZWF0dXJlcyksXG4gICAgICBlZGl0VHlwZSxcbiAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBwcm9wcy5zZWxlY3RlZEluZGV4ZXMsXG4gICAgICB9LFxuICAgIH07XG4gIH07XG5cbiAgdXBkYXRlQ3Vyc29yID0gKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSA9PiB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkRWRpdEhhbmRsZSkge1xuICAgICAgaWYgKHRoaXMuX2N1cnNvcikge1xuICAgICAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcih0aGlzLl9jdXJzb3IpO1xuICAgICAgfVxuICAgICAgY29uc3QgY3Vyc29yR2VvbWV0cnkgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uKHByb3BzKTtcblxuICAgICAgLy8gR2V0IHJlc2l6ZSBjdXJzb3IgZGlyZWN0aW9uIGZyb20gdGhlIGhvdmVyZWQgc2NhbGUgZWRpdEhhbmRsZSAoZS5nLiBuZXN3IG9yIG53c2UpXG4gICAgICBjb25zdCBjZW50cm9pZCA9IHR1cmZDZW50cm9pZChjdXJzb3JHZW9tZXRyeSk7XG4gICAgICBjb25zdCBiZWFyaW5nID0gdHVyZkJlYXJpbmcoY2VudHJvaWQsIHRoaXMuX3NlbGVjdGVkRWRpdEhhbmRsZSk7XG4gICAgICBjb25zdCBwb3NpdGl2ZUJlYXJpbmcgPSBiZWFyaW5nIDwgMCA/IGJlYXJpbmcgKyAxODAgOiBiZWFyaW5nO1xuICAgICAgaWYgKFxuICAgICAgICAocG9zaXRpdmVCZWFyaW5nID49IDAgJiYgcG9zaXRpdmVCZWFyaW5nIDw9IDkwKSB8fFxuICAgICAgICAocG9zaXRpdmVCZWFyaW5nID49IDE4MCAmJiBwb3NpdGl2ZUJlYXJpbmcgPD0gMjcwKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX2N1cnNvciA9ICduZXN3LXJlc2l6ZSc7XG4gICAgICAgIHByb3BzLm9uVXBkYXRlQ3Vyc29yKCduZXN3LXJlc2l6ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY3Vyc29yID0gJ253c2UtcmVzaXplJztcbiAgICAgICAgcHJvcHMub25VcGRhdGVDdXJzb3IoJ253c2UtcmVzaXplJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3BzLm9uVXBkYXRlQ3Vyc29yKG51bGwpO1xuICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgaWYgKCF0aGlzLl9pc1NjYWxpbmcpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkRWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucGlja3MpO1xuICAgICAgdGhpcy5fc2VsZWN0ZWRFZGl0SGFuZGxlID1cbiAgICAgICAgc2VsZWN0ZWRFZGl0SGFuZGxlICYmIHNlbGVjdGVkRWRpdEhhbmRsZS5wcm9wZXJ0aWVzLmVkaXRIYW5kbGVUeXBlID09PSAnc2NhbGUnXG4gICAgICAgICAgPyBzZWxlY3RlZEVkaXRIYW5kbGVcbiAgICAgICAgICA6IG51bGw7XG5cbiAgICAgIGlmIChzZWxlY3RlZEVkaXRIYW5kbGUpIHtcbiAgICAgICAgdGhpcy51cGRhdGVDdXJzb3IocHJvcHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRFZGl0SGFuZGxlKSB7XG4gICAgICB0aGlzLl9pc1NjYWxpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZURyYWdnaW5nKGV2ZW50OiBEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGlmICghdGhpcy5faXNTY2FsaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcHJvcHMub25VcGRhdGVDdXJzb3IodGhpcy5fY3Vyc29yKTtcblxuICAgIGNvbnN0IHNjYWxlQWN0aW9uID0gdGhpcy5nZXRTY2FsZUFjdGlvbihcbiAgICAgIGV2ZW50LnBvaW50ZXJEb3duTWFwQ29vcmRzLFxuICAgICAgZXZlbnQubWFwQ29vcmRzLFxuICAgICAgJ3NjYWxpbmcnLFxuICAgICAgcHJvcHNcbiAgICApO1xuICAgIGlmIChzY2FsZUFjdGlvbikge1xuICAgICAgcHJvcHMub25FZGl0KHNjYWxlQWN0aW9uKTtcbiAgICB9XG5cbiAgICBldmVudC5jYW5jZWxQYW4oKTtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgaWYgKHRoaXMuX2lzU2NhbGluZykge1xuICAgICAgLy8gU2NhbGUgdGhlIGdlb21ldHJ5XG4gICAgICBjb25zdCBzY2FsZUFjdGlvbiA9IHRoaXMuZ2V0U2NhbGVBY3Rpb24oXG4gICAgICAgIGV2ZW50LnBvaW50ZXJEb3duTWFwQ29vcmRzLFxuICAgICAgICBldmVudC5tYXBDb29yZHMsXG4gICAgICAgICdzY2FsZWQnLFxuICAgICAgICBwcm9wc1xuICAgICAgKTtcbiAgICAgIGlmIChzY2FsZUFjdGlvbikge1xuICAgICAgICBwcm9wcy5vbkVkaXQoc2NhbGVBY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcihudWxsKTtcblxuICAgICAgdGhpcy5fZ2VvbWV0cnlCZWluZ1NjYWxlZCA9IG51bGw7XG4gICAgICB0aGlzLl9zZWxlY3RlZEVkaXRIYW5kbGUgPSBudWxsO1xuICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICAgIHRoaXMuX2lzU2NhbGluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGdldEd1aWRlcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIHRoaXMuX2Nvcm5lckd1aWRlUG9pbnRzID0gW107XG4gICAgY29uc3Qgc2VsZWN0ZWRHZW9tZXRyeSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMpO1xuXG4gICAgLy8gQWRkIGJ1ZmZlciB0byB0aGUgZW52ZWxvcGluZyBib3ggaWYgYSBzaW5nbGUgUG9pbnQgZmVhdHVyZSBpcyBzZWxlY3RlZFxuICAgIGlmICh0aGlzLl9pc1NpbmdsZVBvaW50R2VvbWV0cnlTZWxlY3RlZChzZWxlY3RlZEdlb21ldHJ5KSkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJywgZmVhdHVyZXM6IFtdIH07XG4gICAgfVxuXG4gICAgY29uc3QgYm91bmRpbmdCb3ggPSBiYm94UG9seWdvbihiYm94KHNlbGVjdGVkR2VvbWV0cnkpKTtcbiAgICBib3VuZGluZ0JveC5wcm9wZXJ0aWVzLm1vZGUgPSAnc2NhbGUnO1xuICAgIGNvbnN0IGNvcm5lckd1aWRlUG9pbnRzID0gW107XG5cbiAgICBjb29yZEVhY2goYm91bmRpbmdCb3gsIChjb29yZCwgY29vcmRJbmRleCkgPT4ge1xuICAgICAgaWYgKGNvb3JkSW5kZXggPCA0KSB7XG4gICAgICAgIC8vIEdldCBjb3JuZXIgbWlkcG9pbnQgZ3VpZGVzIGZyb20gdGhlIGVudmVsb3BpbmcgYm94XG4gICAgICAgIGNvbnN0IGNvcm5lclBvaW50ID0gcG9pbnQoY29vcmQsIHtcbiAgICAgICAgICBndWlkZVR5cGU6ICdlZGl0SGFuZGxlJyxcbiAgICAgICAgICBlZGl0SGFuZGxlVHlwZTogJ3NjYWxlJyxcbiAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IFtjb29yZEluZGV4XSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvcm5lckd1aWRlUG9pbnRzLnB1c2goY29ybmVyUG9pbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fY29ybmVyR3VpZGVQb2ludHMgPSBjb3JuZXJHdWlkZVBvaW50cztcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIGZlYXR1cmVDb2xsZWN0aW9uKFtwb2x5Z29uVG9MaW5lKGJvdW5kaW5nQm94KSwgLi4udGhpcy5fY29ybmVyR3VpZGVQb2ludHNdKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRTY2FsZUZhY3RvcihjZW50cm9pZDogUG9zaXRpb24sIHN0YXJ0RHJhZ1BvaW50OiBQb3NpdGlvbiwgY3VycmVudFBvaW50OiBQb3NpdGlvbikge1xuICBjb25zdCBzdGFydERpc3RhbmNlID0gdHVyZkRpc3RhbmNlKGNlbnRyb2lkLCBzdGFydERyYWdQb2ludCk7XG4gIGNvbnN0IGVuZERpc3RhbmNlID0gdHVyZkRpc3RhbmNlKGNlbnRyb2lkLCBjdXJyZW50UG9pbnQpO1xuICByZXR1cm4gZW5kRGlzdGFuY2UgLyBzdGFydERpc3RhbmNlO1xufVxuIl19