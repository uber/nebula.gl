"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawPolygonHandler = void 0;

var _modeHandler = require("./mode-handler");

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
var DrawPolygonHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(DrawPolygonHandler, _ModeHandler);

  var _super = _createSuper(DrawPolygonHandler);

  function DrawPolygonHandler() {
    _classCallCheck(this, DrawPolygonHandler);

    return _super.apply(this, arguments);
  }

  _createClass(DrawPolygonHandler, [{
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      var handles = _get(_getPrototypeOf(DrawPolygonHandler.prototype), "getEditHandles", this).call(this, picks, groundCoords);

      if (this._tentativeFeature) {
        handles = handles.concat((0, _modeHandler.getEditHandlesForGeometry)(this._tentativeFeature.geometry, -1)); // Slice off the handles that are are next to the pointer

        if (this._tentativeFeature && this._tentativeFeature.geometry.type === 'LineString') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        } else if (this._tentativeFeature && this._tentativeFeature.geometry.type === 'Polygon') {
          // Remove the last existing handle
          handles = handles.slice(0, -1);
        }
      }

      return handles;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(DrawPolygonHandler.prototype), "handleClick", this).call(this, event);

      var picks = event.picks;
      var tentativeFeature = this.getTentativeFeature();
      var editAction = null;
      var clickedEditHandle = (0, _modeHandler.getPickedEditHandle)(picks);

      if (clickedEditHandle) {
        // User clicked an edit handle.
        // Remove it from the click sequence, so it isn't added as a new point.
        var clickSequence = this.getClickSequence();
        clickSequence.splice(clickSequence.length - 1, 1);
      }

      if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        var polygon = tentativeFeature.geometry;

        if (clickedEditHandle && clickedEditHandle.featureIndex === -1 && (clickedEditHandle.positionIndexes[1] === 0 || clickedEditHandle.positionIndexes[1] === polygon.coordinates[0].length - 3)) {
          // They clicked the first or last point (or double-clicked), so complete the polygon
          // Remove the hovered position
          var polygonToAdd = {
            type: 'Polygon',
            coordinates: [[].concat(_toConsumableArray(polygon.coordinates[0].slice(0, -2)), [polygon.coordinates[0][0]])]
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

      if (clickSequence.length < 3) {
        // Draw a LineString connecting all the clicked points with the hovered point
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [].concat(_toConsumableArray(clickSequence), [groundCoords])
          }
        });
      } else {
        // Draw a Polygon connecting all the clicked points with the hovered point
        this._setTentativeFeature({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[].concat(_toConsumableArray(clickSequence), [groundCoords, clickSequence[0]])]
          }
        });
      }

      return result;
    }
  }]);

  return DrawPolygonHandler;
}(_modeHandler.ModeHandler);

exports.DrawPolygonHandler = DrawPolygonHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctcG9seWdvbi1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbIkRyYXdQb2x5Z29uSGFuZGxlciIsInBpY2tzIiwiZ3JvdW5kQ29vcmRzIiwiaGFuZGxlcyIsIl90ZW50YXRpdmVGZWF0dXJlIiwiY29uY2F0IiwiZ2VvbWV0cnkiLCJ0eXBlIiwic2xpY2UiLCJldmVudCIsInRlbnRhdGl2ZUZlYXR1cmUiLCJnZXRUZW50YXRpdmVGZWF0dXJlIiwiZWRpdEFjdGlvbiIsImNsaWNrZWRFZGl0SGFuZGxlIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJzcGxpY2UiLCJsZW5ndGgiLCJwb2x5Z29uIiwiZmVhdHVyZUluZGV4IiwicG9zaXRpb25JbmRleGVzIiwiY29vcmRpbmF0ZXMiLCJwb2x5Z29uVG9BZGQiLCJyZXNldENsaWNrU2VxdWVuY2UiLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsImdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uIiwiZmFrZVBvaW50ZXJNb3ZlRXZlbnQiLCJzY3JlZW5Db29yZHMiLCJpc0RyYWdnaW5nIiwicG9pbnRlckRvd25QaWNrcyIsInBvaW50ZXJEb3duU2NyZWVuQ29vcmRzIiwicG9pbnRlckRvd25Hcm91bmRDb29yZHMiLCJzb3VyY2VFdmVudCIsImhhbmRsZVBvaW50ZXJNb3ZlIiwicmVzdWx0IiwiY2FuY2VsTWFwUGFuIiwiTW9kZUhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBO0lBQ2FBLGtCOzs7Ozs7Ozs7Ozs7O21DQUNJQyxLLEVBQW9DQyxZLEVBQXVDO0FBQ3hGLFVBQUlDLE9BQU8sMEZBQXdCRixLQUF4QixFQUErQkMsWUFBL0IsQ0FBWDs7QUFFQSxVQUFJLEtBQUtFLGlCQUFULEVBQTRCO0FBQzFCRCxRQUFBQSxPQUFPLEdBQUdBLE9BQU8sQ0FB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RCxDQWtENUQ7O0FBQ0EsV0FBS0MsaUJBQUwsQ0FBdUJQLG9CQUF2QjtBQUVBLGFBQU9kLFVBQVA7QUFDRDs7OzRDQUkwRjtBQUFBLFVBRHpGVixZQUN5RixRQUR6RkEsWUFDeUY7QUFDekYsVUFBTVksYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCO0FBQ0EsVUFBTW1CLE1BQU0sR0FBRztBQUFFdEIsUUFBQUEsVUFBVSxFQUFFLElBQWQ7QUFBb0J1QixRQUFBQSxZQUFZLEVBQUU7QUFBbEMsT0FBZjs7QUFFQSxVQUFJckIsYUFBYSxDQUFDRyxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCO0FBQ0EsZUFBT2lCLE1BQVA7QUFDRDs7QUFFRCxVQUFJcEIsYUFBYSxDQUFDRyxNQUFkLEdBQXVCLENBQTNCLEVBQThCO0FBQzVCO0FBQ0EsYUFBS08sb0JBQUwsQ0FBMEI7QUFDeEJqQixVQUFBQSxJQUFJLEVBQUUsU0FEa0I7QUFFeEJELFVBQUFBLFFBQVEsRUFBRTtBQUNSQyxZQUFBQSxJQUFJLEVBQUUsWUFERTtBQUVSYyxZQUFBQSxXQUFXLCtCQUFNUCxhQUFOLElBQXFCWixZQUFyQjtBQUZIO0FBRmMsU0FBMUI7QUFPRCxPQVRELE1BU087QUFDTDtBQUNBLGFBQUtzQixvQkFBTCxDQUEwQjtBQUN4QmpCLFVBQUFBLElBQUksRUFBRSxTQURrQjtBQUV4QkQsVUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFlBQUFBLElBQUksRUFBRSxTQURFO0FBRVJjLFlBQUFBLFdBQVcsRUFBRSw4QkFBS1AsYUFBTCxJQUFvQlosWUFBcEIsRUFBa0NZLGFBQWEsQ0FBQyxDQUFELENBQS9DO0FBRkw7QUFGYyxTQUExQjtBQU9EOztBQUVELGFBQU9vQixNQUFQO0FBQ0Q7Ozs7RUEzR3FDRSx3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBvbHlnb24sIFBvc2l0aW9uIH0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcbmltcG9ydCB7IENsaWNrRXZlbnQsIFBvaW50ZXJNb3ZlRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcyc7XG5pbXBvcnQge1xuICBFZGl0QWN0aW9uLFxuICBFZGl0SGFuZGxlLFxuICBNb2RlSGFuZGxlcixcbiAgZ2V0UGlja2VkRWRpdEhhbmRsZSxcbiAgZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSxcbn0gZnJvbSAnLi9tb2RlLWhhbmRsZXInO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgRHJhd1BvbHlnb25IYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBnZXRFZGl0SGFuZGxlcyhwaWNrcz86IEFycmF5PFJlY29yZDxzdHJpbmcsIGFueT4+LCBncm91bmRDb29yZHM/OiBQb3NpdGlvbik6IEVkaXRIYW5kbGVbXSB7XG4gICAgbGV0IGhhbmRsZXMgPSBzdXBlci5nZXRFZGl0SGFuZGxlcyhwaWNrcywgZ3JvdW5kQ29vcmRzKTtcblxuICAgIGlmICh0aGlzLl90ZW50YXRpdmVGZWF0dXJlKSB7XG4gICAgICBoYW5kbGVzID0gaGFuZGxlcy5jb25jYXQoZ2V0RWRpdEhhbmRsZXNGb3JHZW9tZXRyeSh0aGlzLl90ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LCAtMSkpO1xuICAgICAgLy8gU2xpY2Ugb2ZmIHRoZSBoYW5kbGVzIHRoYXQgYXJlIGFyZSBuZXh0IHRvIHRoZSBwb2ludGVyXG4gICAgICBpZiAodGhpcy5fdGVudGF0aXZlRmVhdHVyZSAmJiB0aGlzLl90ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGxhc3QgZXhpc3RpbmcgaGFuZGxlXG4gICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fdGVudGF0aXZlRmVhdHVyZSAmJiB0aGlzLl90ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGxhc3QgZXhpc3RpbmcgaGFuZGxlXG4gICAgICAgIGhhbmRsZXMgPSBoYW5kbGVzLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGFuZGxlcztcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50KTogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIHN1cGVyLmhhbmRsZUNsaWNrKGV2ZW50KTtcblxuICAgIGNvbnN0IHsgcGlja3MgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSB0aGlzLmdldFRlbnRhdGl2ZUZlYXR1cmUoKTtcblxuICAgIGxldCBlZGl0QWN0aW9uOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCA9IG51bGw7XG4gICAgY29uc3QgY2xpY2tlZEVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKHBpY2tzKTtcblxuICAgIGlmIChjbGlja2VkRWRpdEhhbmRsZSkge1xuICAgICAgLy8gVXNlciBjbGlja2VkIGFuIGVkaXQgaGFuZGxlLlxuICAgICAgLy8gUmVtb3ZlIGl0IGZyb20gdGhlIGNsaWNrIHNlcXVlbmNlLCBzbyBpdCBpc24ndCBhZGRlZCBhcyBhIG5ldyBwb2ludC5cbiAgICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgIGNsaWNrU2VxdWVuY2Uuc3BsaWNlKGNsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMSwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUgJiYgdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgIGNvbnN0IHBvbHlnb246IFBvbHlnb24gPSB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5O1xuXG4gICAgICBpZiAoXG4gICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlICYmXG4gICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlLmZlYXR1cmVJbmRleCA9PT0gLTEgJiZcbiAgICAgICAgKGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlc1sxXSA9PT0gMCB8fFxuICAgICAgICAgIGNsaWNrZWRFZGl0SGFuZGxlLnBvc2l0aW9uSW5kZXhlc1sxXSA9PT0gcG9seWdvbi5jb29yZGluYXRlc1swXS5sZW5ndGggLSAzKVxuICAgICAgKSB7XG4gICAgICAgIC8vIFRoZXkgY2xpY2tlZCB0aGUgZmlyc3Qgb3IgbGFzdCBwb2ludCAob3IgZG91YmxlLWNsaWNrZWQpLCBzbyBjb21wbGV0ZSB0aGUgcG9seWdvblxuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgaG92ZXJlZCBwb3NpdGlvblxuICAgICAgICBjb25zdCBwb2x5Z29uVG9BZGQ6IFBvbHlnb24gPSB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbWy4uLnBvbHlnb24uY29vcmRpbmF0ZXNbMF0uc2xpY2UoMCwgLTIpLCBwb2x5Z29uLmNvb3JkaW5hdGVzWzBdWzBdXV0sXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgICAgICAgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24ocG9seWdvblRvQWRkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmlnZ2VyIHBvaW50ZXIgbW92ZSByaWdodCBhd2F5IGluIG9yZGVyIGZvciBpdCB0byB1cGRhdGUgZWRpdCBoYW5kbGVzICh0byBzdXBwb3J0IGRvdWJsZS1jbGljaylcbiAgICBjb25zdCBmYWtlUG9pbnRlck1vdmVFdmVudCA9IHtcbiAgICAgIHNjcmVlbkNvb3JkczogWy0xLCAtMV0sXG4gICAgICBncm91bmRDb29yZHM6IGV2ZW50Lmdyb3VuZENvb3JkcyxcbiAgICAgIHBpY2tzOiBbXSxcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgcG9pbnRlckRvd25QaWNrczogbnVsbCxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25Hcm91bmRDb29yZHM6IG51bGwsXG4gICAgICBzb3VyY2VFdmVudDogbnVsbCxcbiAgICB9O1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLmhhbmRsZVBvaW50ZXJNb3ZlKGZha2VQb2ludGVyTW92ZUV2ZW50KTtcblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoe1xuICAgIGdyb3VuZENvb3JkcyxcbiAgfTogUG9pbnRlck1vdmVFdmVudCk6IHsgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQ7IGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA8IDMpIHtcbiAgICAgIC8vIERyYXcgYSBMaW5lU3RyaW5nIGNvbm5lY3RpbmcgYWxsIHRoZSBjbGlja2VkIHBvaW50cyB3aXRoIHRoZSBob3ZlcmVkIHBvaW50XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgICBjb29yZGluYXRlczogWy4uLmNsaWNrU2VxdWVuY2UsIGdyb3VuZENvb3Jkc10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRHJhdyBhIFBvbHlnb24gY29ubmVjdGluZyBhbGwgdGhlIGNsaWNrZWQgcG9pbnRzIHdpdGggdGhlIGhvdmVyZWQgcG9pbnRcbiAgICAgIHRoaXMuX3NldFRlbnRhdGl2ZUZlYXR1cmUoe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbWy4uLmNsaWNrU2VxdWVuY2UsIGdyb3VuZENvb3JkcywgY2xpY2tTZXF1ZW5jZVswXV1dLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19