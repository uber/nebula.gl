"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnappableMode = void 0;

var _utils = require("../utils");

var _geojsonEditMode = require("./geojson-edit-mode");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

var SnappableMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(SnappableMode, _GeoJsonEditMode);

  var _super = _createSuper(SnappableMode);

  function SnappableMode(handler) {
    var _this;

    _classCallCheck(this, SnappableMode);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "_handler", void 0);

    _this._handler = handler;
    return _this;
  }

  _createClass(SnappableMode, [{
    key: "_getSnappedMouseEvent",
    value: function _getSnappedMouseEvent(event, snapSource, snapTarget) {
      return Object.assign(event, {
        mapCoords: snapTarget.geometry.coordinates,
        pointerDownMapCoords: snapSource && snapSource.geometry.coordinates
      });
    }
  }, {
    key: "_getPickedSnapTarget",
    value: function _getPickedSnapTarget(picks) {
      return (0, _utils.getPickedEditHandles)(picks).find(function (handle) {
        return handle.properties.editHandleType === 'snap-target';
      });
    }
  }, {
    key: "_getPickedSnapSource",
    value: function _getPickedSnapSource(pointerDownPicks) {
      return (0, _utils.getPickedSnapSourceEditHandle)(pointerDownPicks);
    }
  }, {
    key: "_getUpdatedSnapSourceHandle",
    value: function _getUpdatedSnapSourceHandle(snapSourceHandle, data) {
      var _snapSourceHandle$pro = snapSourceHandle.properties,
          featureIndex = _snapSourceHandle$pro.featureIndex,
          positionIndexes = _snapSourceHandle$pro.positionIndexes;

      if (!Array.isArray(positionIndexes)) {
        return snapSourceHandle;
      }

      var snapSourceFeature = data.features[featureIndex]; // $FlowFixMe

      var snapSourceCoordinates = positionIndexes.reduce(function (a, b) {
        return a[b];
      }, snapSourceFeature.geometry.coordinates);
      return _objectSpread({}, snapSourceHandle, {
        geometry: {
          type: 'Point',
          coordinates: snapSourceCoordinates
        }
      });
    } // If additionalSnapTargets is present in modeConfig and is populated, this
    // method will return those features along with the features
    // that live in the current layer. Otherwise, this method will simply return the
    // features from the current layer

  }, {
    key: "_getSnapTargets",
    value: function _getSnapTargets(props) {
      var _ref = props.modeConfig || {},
          additionalSnapTargets = _ref.additionalSnapTargets;

      additionalSnapTargets = additionalSnapTargets || [];
      var features = [].concat(_toConsumableArray(props.data.features), _toConsumableArray(additionalSnapTargets));
      return features;
    }
  }, {
    key: "_getSnapTargetHandles",
    value: function _getSnapTargetHandles(props) {
      var handles = [];

      var features = this._getSnapTargets(props);

      for (var i = 0; i < features.length; i++) {
        // Filter out the currently selected feature(s)
        var isCurrentIndexFeatureNotSelected = !props.selectedIndexes.includes(i);

        if (isCurrentIndexFeatureNotSelected) {
          var geometry = features[i].geometry;
          handles.push.apply(handles, _toConsumableArray((0, _utils.getEditHandlesForGeometry)(geometry, i, 'snap-target')));
        }
      }

      return handles;
    } // If no snap handle has been picked, only display the edit handles of the
    // selected feature. If a snap handle has been picked, display said snap handle
    // along with all snappable points on all non-selected features.

  }, {
    key: "getGuides",
    value: function getGuides(props) {
      var modeConfig = props.modeConfig,
          lastPointerMoveEvent = props.lastPointerMoveEvent;

      var _ref2 = modeConfig || {},
          enableSnapping = _ref2.enableSnapping;

      var guides = {
        type: 'FeatureCollection',
        features: _toConsumableArray(this._handler.getGuides(props).features)
      };

      if (!enableSnapping) {
        return guides;
      }

      var snapSourceHandle = lastPointerMoveEvent && this._getPickedSnapSource(lastPointerMoveEvent.pointerDownPicks); // They started dragging a handle
      // So render the picked handle (in its updated location) and all possible snap targets


      if (snapSourceHandle) {
        var _guides$features;

        (_guides$features = guides.features).push.apply(_guides$features, _toConsumableArray(this._getSnapTargetHandles(props)).concat([this._getUpdatedSnapSourceHandle(snapSourceHandle, props.data)]));

        return guides;
      } // Render the possible snap source handles


      var features = props.data.features;

      var _iterator = _createForOfIteratorHelper(props.selectedIndexes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var index = _step.value;

          if (index < features.length) {
            var _guides$features2;

            var geometry = features[index].geometry;

            (_guides$features2 = guides.features).push.apply(_guides$features2, _toConsumableArray((0, _utils.getEditHandlesForGeometry)(geometry, index, 'snap-source')));
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return guides;
    }
  }, {
    key: "_getSnapAwareEvent",
    value: function _getSnapAwareEvent(event, props) {
      var snapSource = this._getPickedSnapSource(props.lastPointerMoveEvent.pointerDownPicks);

      var snapTarget = this._getPickedSnapTarget(event.picks);

      return snapSource && snapTarget ? this._getSnappedMouseEvent(event, snapSource, snapTarget) : event;
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      this._handler.handleStartDragging(event, props);
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      this._handler.handleStopDragging(this._getSnapAwareEvent(event, props), props);
    }
  }, {
    key: "handleDragging",
    value: function handleDragging(event, props) {
      this._handler.handleDragging(this._getSnapAwareEvent(event, props), props);
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      this._handler.handlePointerMove(this._getSnapAwareEvent(event, props), props);
    }
  }]);

  return SnappableMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.SnappableMode = SnappableMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvc25hcHBhYmxlLW1vZGUudHMiXSwibmFtZXMiOlsiU25hcHBhYmxlTW9kZSIsImhhbmRsZXIiLCJfaGFuZGxlciIsImV2ZW50Iiwic25hcFNvdXJjZSIsInNuYXBUYXJnZXQiLCJPYmplY3QiLCJhc3NpZ24iLCJtYXBDb29yZHMiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwicG9pbnRlckRvd25NYXBDb29yZHMiLCJwaWNrcyIsImZpbmQiLCJoYW5kbGUiLCJwcm9wZXJ0aWVzIiwiZWRpdEhhbmRsZVR5cGUiLCJwb2ludGVyRG93blBpY2tzIiwic25hcFNvdXJjZUhhbmRsZSIsImRhdGEiLCJmZWF0dXJlSW5kZXgiLCJwb3NpdGlvbkluZGV4ZXMiLCJBcnJheSIsImlzQXJyYXkiLCJzbmFwU291cmNlRmVhdHVyZSIsImZlYXR1cmVzIiwic25hcFNvdXJjZUNvb3JkaW5hdGVzIiwicmVkdWNlIiwiYSIsImIiLCJ0eXBlIiwicHJvcHMiLCJtb2RlQ29uZmlnIiwiYWRkaXRpb25hbFNuYXBUYXJnZXRzIiwiaGFuZGxlcyIsIl9nZXRTbmFwVGFyZ2V0cyIsImkiLCJsZW5ndGgiLCJpc0N1cnJlbnRJbmRleEZlYXR1cmVOb3RTZWxlY3RlZCIsInNlbGVjdGVkSW5kZXhlcyIsImluY2x1ZGVzIiwicHVzaCIsImxhc3RQb2ludGVyTW92ZUV2ZW50IiwiZW5hYmxlU25hcHBpbmciLCJndWlkZXMiLCJnZXRHdWlkZXMiLCJfZ2V0UGlja2VkU25hcFNvdXJjZSIsIl9nZXRTbmFwVGFyZ2V0SGFuZGxlcyIsIl9nZXRVcGRhdGVkU25hcFNvdXJjZUhhbmRsZSIsImluZGV4IiwiX2dldFBpY2tlZFNuYXBUYXJnZXQiLCJfZ2V0U25hcHBlZE1vdXNlRXZlbnQiLCJoYW5kbGVTdGFydERyYWdnaW5nIiwiaGFuZGxlU3RvcERyYWdnaW5nIiwiX2dldFNuYXBBd2FyZUV2ZW50IiwiaGFuZGxlRHJhZ2dpbmciLCJoYW5kbGVQb2ludGVyTW92ZSIsIkdl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S0FBcEU7QUFDRDs7O3NDQUVpQjVCLEssRUFBeUI0QixLLEVBQXFDO0FBQzlFLFdBQUs3QixRQUFMLENBQWNzRCxpQkFBZCxDQUFnQyxLQUFLRixrQkFBTCxDQUF3Qm5ELEtBQXhCLEVBQStCNEIsS0FBL0IsQ0FBaEMsRUFBdUVBLEtBQXZFO0FBQ0Q7Ozs7RUF4SmdDMEIsZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb3NpdGlvbiwgRmVhdHVyZSwgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7XG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIERyYWdnaW5nRXZlbnQsXG4gIE1vZGVQcm9wcyxcbiAgUGljayxcbiAgR3VpZGVGZWF0dXJlQ29sbGVjdGlvbixcbiAgRWRpdEhhbmRsZUZlYXR1cmUsXG59IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7XG4gIGdldFBpY2tlZFNuYXBTb3VyY2VFZGl0SGFuZGxlLFxuICBnZXRQaWNrZWRFZGl0SGFuZGxlcyxcbiAgZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSxcbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgR2VvSnNvbkVkaXRNb2RlIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZSc7XG5cbnR5cGUgTW92ZW1lbnRUeXBlRXZlbnQgPSBQb2ludGVyTW92ZUV2ZW50IHwgU3RhcnREcmFnZ2luZ0V2ZW50IHwgU3RvcERyYWdnaW5nRXZlbnQgfCBEcmFnZ2luZ0V2ZW50O1xuXG5leHBvcnQgY2xhc3MgU25hcHBhYmxlTW9kZSBleHRlbmRzIEdlb0pzb25FZGl0TW9kZSB7XG4gIF9oYW5kbGVyOiBHZW9Kc29uRWRpdE1vZGU7XG5cbiAgY29uc3RydWN0b3IoaGFuZGxlcjogR2VvSnNvbkVkaXRNb2RlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9oYW5kbGVyID0gaGFuZGxlcjtcbiAgfVxuXG4gIF9nZXRTbmFwcGVkTW91c2VFdmVudDxUIGV4dGVuZHMgTW92ZW1lbnRUeXBlRXZlbnQ+KFxuICAgIGV2ZW50OiBULFxuICAgIHNuYXBTb3VyY2U6IEVkaXRIYW5kbGVGZWF0dXJlLFxuICAgIHNuYXBUYXJnZXQ6IEVkaXRIYW5kbGVGZWF0dXJlXG4gICk6IFQge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGV2ZW50LCB7XG4gICAgICBtYXBDb29yZHM6IHNuYXBUYXJnZXQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3Jkczogc25hcFNvdXJjZSAmJiBzbmFwU291cmNlLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgIH0pO1xuICB9XG5cbiAgX2dldFBpY2tlZFNuYXBUYXJnZXQocGlja3M6IFBpY2tbXSk6IEVkaXRIYW5kbGVGZWF0dXJlIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIGdldFBpY2tlZEVkaXRIYW5kbGVzKHBpY2tzKS5maW5kKFxuICAgICAgKGhhbmRsZSkgPT4gaGFuZGxlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUgPT09ICdzbmFwLXRhcmdldCdcbiAgICApO1xuICB9XG5cbiAgX2dldFBpY2tlZFNuYXBTb3VyY2UoXG4gICAgcG9pbnRlckRvd25QaWNrczogUGlja1tdIHwgbnVsbCB8IHVuZGVmaW5lZFxuICApOiBFZGl0SGFuZGxlRmVhdHVyZSB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBnZXRQaWNrZWRTbmFwU291cmNlRWRpdEhhbmRsZShwb2ludGVyRG93blBpY2tzKTtcbiAgfVxuXG4gIF9nZXRVcGRhdGVkU25hcFNvdXJjZUhhbmRsZShcbiAgICBzbmFwU291cmNlSGFuZGxlOiBFZGl0SGFuZGxlRmVhdHVyZSxcbiAgICBkYXRhOiBGZWF0dXJlQ29sbGVjdGlvblxuICApOiBFZGl0SGFuZGxlRmVhdHVyZSB7XG4gICAgY29uc3QgeyBmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcyB9ID0gc25hcFNvdXJjZUhhbmRsZS5wcm9wZXJ0aWVzO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShwb3NpdGlvbkluZGV4ZXMpKSB7XG4gICAgICByZXR1cm4gc25hcFNvdXJjZUhhbmRsZTtcbiAgICB9XG4gICAgY29uc3Qgc25hcFNvdXJjZUZlYXR1cmUgPSBkYXRhLmZlYXR1cmVzW2ZlYXR1cmVJbmRleF07XG5cbiAgICAvLyAkRmxvd0ZpeE1lXG4gICAgY29uc3Qgc25hcFNvdXJjZUNvb3JkaW5hdGVzOiBQb3NpdGlvbiA9IHBvc2l0aW9uSW5kZXhlcy5yZWR1Y2UoXG4gICAgICAoYTogYW55W10sIGI6IG51bWJlcikgPT4gYVtiXSxcbiAgICAgIHNuYXBTb3VyY2VGZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzXG4gICAgKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5zbmFwU291cmNlSGFuZGxlLFxuICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgdHlwZTogJ1BvaW50JyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IHNuYXBTb3VyY2VDb29yZGluYXRlcyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8vIElmIGFkZGl0aW9uYWxTbmFwVGFyZ2V0cyBpcyBwcmVzZW50IGluIG1vZGVDb25maWcgYW5kIGlzIHBvcHVsYXRlZCwgdGhpc1xuICAvLyBtZXRob2Qgd2lsbCByZXR1cm4gdGhvc2UgZmVhdHVyZXMgYWxvbmcgd2l0aCB0aGUgZmVhdHVyZXNcbiAgLy8gdGhhdCBsaXZlIGluIHRoZSBjdXJyZW50IGxheWVyLiBPdGhlcndpc2UsIHRoaXMgbWV0aG9kIHdpbGwgc2ltcGx5IHJldHVybiB0aGVcbiAgLy8gZmVhdHVyZXMgZnJvbSB0aGUgY3VycmVudCBsYXllclxuICBfZ2V0U25hcFRhcmdldHMocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBGZWF0dXJlW10ge1xuICAgIGxldCB7IGFkZGl0aW9uYWxTbmFwVGFyZ2V0cyB9ID0gcHJvcHMubW9kZUNvbmZpZyB8fCB7fTtcbiAgICBhZGRpdGlvbmFsU25hcFRhcmdldHMgPSBhZGRpdGlvbmFsU25hcFRhcmdldHMgfHwgW107XG5cbiAgICBjb25zdCBmZWF0dXJlcyA9IFsuLi5wcm9wcy5kYXRhLmZlYXR1cmVzLCAuLi5hZGRpdGlvbmFsU25hcFRhcmdldHNdO1xuICAgIHJldHVybiBmZWF0dXJlcztcbiAgfVxuXG4gIF9nZXRTbmFwVGFyZ2V0SGFuZGxlcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEVkaXRIYW5kbGVGZWF0dXJlW10ge1xuICAgIGNvbnN0IGhhbmRsZXMgPSBbXTtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuX2dldFNuYXBUYXJnZXRzKHByb3BzKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBmZWF0dXJlKHMpXG4gICAgICBjb25zdCBpc0N1cnJlbnRJbmRleEZlYXR1cmVOb3RTZWxlY3RlZCA9ICFwcm9wcy5zZWxlY3RlZEluZGV4ZXMuaW5jbHVkZXMoaSk7XG5cbiAgICAgIGlmIChpc0N1cnJlbnRJbmRleEZlYXR1cmVOb3RTZWxlY3RlZCkge1xuICAgICAgICBjb25zdCB7IGdlb21ldHJ5IH0gPSBmZWF0dXJlc1tpXTtcbiAgICAgICAgaGFuZGxlcy5wdXNoKC4uLmdldEVkaXRIYW5kbGVzRm9yR2VvbWV0cnkoZ2VvbWV0cnksIGksICdzbmFwLXRhcmdldCcpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZXM7XG4gIH1cblxuICAvLyBJZiBubyBzbmFwIGhhbmRsZSBoYXMgYmVlbiBwaWNrZWQsIG9ubHkgZGlzcGxheSB0aGUgZWRpdCBoYW5kbGVzIG9mIHRoZVxuICAvLyBzZWxlY3RlZCBmZWF0dXJlLiBJZiBhIHNuYXAgaGFuZGxlIGhhcyBiZWVuIHBpY2tlZCwgZGlzcGxheSBzYWlkIHNuYXAgaGFuZGxlXG4gIC8vIGFsb25nIHdpdGggYWxsIHNuYXBwYWJsZSBwb2ludHMgb24gYWxsIG5vbi1zZWxlY3RlZCBmZWF0dXJlcy5cbiAgZ2V0R3VpZGVzKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogR3VpZGVGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgY29uc3QgeyBtb2RlQ29uZmlnLCBsYXN0UG9pbnRlck1vdmVFdmVudCB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyBlbmFibGVTbmFwcGluZyB9ID0gbW9kZUNvbmZpZyB8fCB7fTtcblxuICAgIGNvbnN0IGd1aWRlczogR3VpZGVGZWF0dXJlQ29sbGVjdGlvbiA9IHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogWy4uLnRoaXMuX2hhbmRsZXIuZ2V0R3VpZGVzKHByb3BzKS5mZWF0dXJlc10sXG4gICAgfTtcblxuICAgIGlmICghZW5hYmxlU25hcHBpbmcpIHtcbiAgICAgIHJldHVybiBndWlkZXM7XG4gICAgfVxuXG4gICAgY29uc3Qgc25hcFNvdXJjZUhhbmRsZTogRWRpdEhhbmRsZUZlYXR1cmUgfCBudWxsIHwgdW5kZWZpbmVkID1cbiAgICAgIGxhc3RQb2ludGVyTW92ZUV2ZW50ICYmIHRoaXMuX2dldFBpY2tlZFNuYXBTb3VyY2UobGFzdFBvaW50ZXJNb3ZlRXZlbnQucG9pbnRlckRvd25QaWNrcyk7XG5cbiAgICAvLyBUaGV5IHN0YXJ0ZWQgZHJhZ2dpbmcgYSBoYW5kbGVcbiAgICAvLyBTbyByZW5kZXIgdGhlIHBpY2tlZCBoYW5kbGUgKGluIGl0cyB1cGRhdGVkIGxvY2F0aW9uKSBhbmQgYWxsIHBvc3NpYmxlIHNuYXAgdGFyZ2V0c1xuICAgIGlmIChzbmFwU291cmNlSGFuZGxlKSB7XG4gICAgICBndWlkZXMuZmVhdHVyZXMucHVzaChcbiAgICAgICAgLi4udGhpcy5fZ2V0U25hcFRhcmdldEhhbmRsZXMocHJvcHMpLFxuICAgICAgICB0aGlzLl9nZXRVcGRhdGVkU25hcFNvdXJjZUhhbmRsZShzbmFwU291cmNlSGFuZGxlLCBwcm9wcy5kYXRhKVxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIGd1aWRlcztcbiAgICB9XG5cbiAgICAvLyBSZW5kZXIgdGhlIHBvc3NpYmxlIHNuYXAgc291cmNlIGhhbmRsZXNcbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSBwcm9wcy5kYXRhO1xuICAgIGZvciAoY29uc3QgaW5kZXggb2YgcHJvcHMuc2VsZWN0ZWRJbmRleGVzKSB7XG4gICAgICBpZiAoaW5kZXggPCBmZWF0dXJlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgeyBnZW9tZXRyeSB9ID0gZmVhdHVyZXNbaW5kZXhdO1xuICAgICAgICBndWlkZXMuZmVhdHVyZXMucHVzaCguLi5nZXRFZGl0SGFuZGxlc0Zvckdlb21ldHJ5KGdlb21ldHJ5LCBpbmRleCwgJ3NuYXAtc291cmNlJykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBndWlkZXM7XG4gIH1cblxuICBfZ2V0U25hcEF3YXJlRXZlbnQ8VCBleHRlbmRzIE1vdmVtZW50VHlwZUV2ZW50PihcbiAgICBldmVudDogVCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiBUIHtcbiAgICBjb25zdCBzbmFwU291cmNlID0gdGhpcy5fZ2V0UGlja2VkU25hcFNvdXJjZShwcm9wcy5sYXN0UG9pbnRlck1vdmVFdmVudC5wb2ludGVyRG93blBpY2tzKTtcbiAgICBjb25zdCBzbmFwVGFyZ2V0ID0gdGhpcy5fZ2V0UGlja2VkU25hcFRhcmdldChldmVudC5waWNrcyk7XG5cbiAgICByZXR1cm4gc25hcFNvdXJjZSAmJiBzbmFwVGFyZ2V0XG4gICAgICA/IHRoaXMuX2dldFNuYXBwZWRNb3VzZUV2ZW50KGV2ZW50LCBzbmFwU291cmNlLCBzbmFwVGFyZ2V0KVxuICAgICAgOiBldmVudDtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICB0aGlzLl9oYW5kbGVyLmhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQsIHByb3BzKTtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgdGhpcy5faGFuZGxlci5oYW5kbGVTdG9wRHJhZ2dpbmcodGhpcy5fZ2V0U25hcEF3YXJlRXZlbnQoZXZlbnQsIHByb3BzKSwgcHJvcHMpO1xuICB9XG5cbiAgaGFuZGxlRHJhZ2dpbmcoZXZlbnQ6IERyYWdnaW5nRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgdGhpcy5faGFuZGxlci5oYW5kbGVEcmFnZ2luZyh0aGlzLl9nZXRTbmFwQXdhcmVFdmVudChldmVudCwgcHJvcHMpLCBwcm9wcyk7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICB0aGlzLl9oYW5kbGVyLmhhbmRsZVBvaW50ZXJNb3ZlKHRoaXMuX2dldFNuYXBBd2FyZUV2ZW50KGV2ZW50LCBwcm9wcyksIHByb3BzKTtcbiAgfVxufVxuIl19