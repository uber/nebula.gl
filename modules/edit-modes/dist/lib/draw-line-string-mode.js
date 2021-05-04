"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawLineStringMode = void 0;

var _utils = require("../utils");

var _geojsonEditMode = require("./geojson-edit-mode");

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

var DrawLineStringMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(DrawLineStringMode, _GeoJsonEditMode);

  var _super = _createSuper(DrawLineStringMode);

  function DrawLineStringMode() {
    _classCallCheck(this, DrawLineStringMode);

    return _super.apply(this, arguments);
  }

  _createClass(DrawLineStringMode, [{
    key: "handleClick",
    value: function handleClick(event, props) {
      var picks = event.picks;
      var clickedEditHandle = (0, _utils.getPickedEditHandle)(picks);
      var positionAdded = false;

      if (!clickedEditHandle) {
        // Don't add another point right next to an existing one
        this.addClickSequence(event);
        positionAdded = true;
      }

      var clickSequence = this.getClickSequence();

      if (clickSequence.length > 1 && clickedEditHandle && Array.isArray(clickedEditHandle.properties.positionIndexes) && clickedEditHandle.properties.positionIndexes[0] === clickSequence.length - 1) {
        // They clicked the last point (or double-clicked), so add the LineString
        var lineStringToAdd = {
          type: 'LineString',
          coordinates: _toConsumableArray(clickSequence)
        };
        this.resetClickSequence();
        var editAction = this.getAddFeatureAction(lineStringToAdd, props.data);

        if (editAction) {
          props.onEdit(editAction);
        }
      } else if (positionAdded) {
        // new tentative point
        props.onEdit({
          // data is the same
          updatedData: props.data,
          editType: 'addTentativePosition',
          editContext: {
            position: event.mapCoords
          }
        });
      }
    }
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(event, props) {
      var key = event.key;

      if (key === 'Enter') {
        var clickSequence = this.getClickSequence();

        if (clickSequence.length > 1) {
          var lineStringToAdd = {
            type: 'LineString',
            coordinates: _toConsumableArray(clickSequence)
          };
          this.resetClickSequence();
          var editAction = this.getAddFeatureAction(lineStringToAdd, props.data);

          if (editAction) {
            props.onEdit(editAction);
          }
        }
      }
    }
  }, {
    key: "getGuides",
    value: function getGuides(props) {
      var _guides$features;

      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var clickSequence = this.getClickSequence();
      var lastCoords = lastPointerMoveEvent ? [lastPointerMoveEvent.mapCoords] : [];
      var guides = {
        type: 'FeatureCollection',
        features: []
      };
      var tentativeFeature;

      if (clickSequence.length > 0) {
        tentativeFeature = {
          type: 'Feature',
          properties: {
            guideType: 'tentative'
          },
          geometry: {
            type: 'LineString',
            coordinates: [].concat(_toConsumableArray(clickSequence), lastCoords)
          }
        };
      }

      if (tentativeFeature) {
        guides.features.push(tentativeFeature);
      }

      var editHandles = clickSequence.map(function (clickedCoord, index) {
        return {
          type: 'Feature',
          properties: {
            guideType: 'editHandle',
            editHandleType: 'existing',
            featureIndex: -1,
            positionIndexes: [index]
          },
          geometry: {
            type: 'Point',
            coordinates: clickedCoord
          }
        };
      });

      (_guides$features = guides.features).push.apply(_guides$features, _toConsumableArray(editHandles)); // @ts-ignore


      return guides;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      props.onUpdateCursor('cell');
    }
  }]);

  return DrawLineStringMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.DrawLineStringMode = DrawLineStringMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1saW5lLXN0cmluZy1tb2RlLnRzIl0sIm5hbWVzIjpbIkRyYXdMaW5lU3RyaW5nTW9kZSIsImV2ZW50IiwicHJvcHMiLCJwaWNrcyIsImNsaWNrZWRFZGl0SGFuZGxlIiwicG9zaXRpb25BZGRlZCIsImFkZENsaWNrU2VxdWVuY2UiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsIkFycmF5IiwiaXNBcnJheSIsInByb3BlcnRpZXMiLCJwb3NpdGlvbkluZGV4ZXMiLCJsaW5lU3RyaW5nVG9BZGQiLCJ0eXBlIiwiY29vcmRpbmF0ZXMiLCJyZXNldENsaWNrU2VxdWVuY2UiLCJlZGl0QWN0aW9uIiwiZ2V0QWRkRmVhdHVyZUFjdGlvbiIsImRhdGEiLCJvbkVkaXQiLCJ1cGRhdGVkRGF0YSIsImVkaXRUeXBlIiwiZWRpdENvbnRleHQiLCJwb3NpdGlvbiIsIm1hcENvb3JkcyIsImtleSIsImxhc3RQb2ludGVyTW92ZUV2ZW50IiwibGFzdENvb3JkcyIsImd1aWRlcyIsImZlYXR1cmVzIiwidGVudGF0aXZlRmVhdHVyZSIsImd1aWRlVHlwZSIsImdlb21ldHJ5IiwicHVzaCIsImVkaXRIYW5kbGVzIiwibWFwIiwiY2xpY2tlZENvb3JkIiwiaW5kZXgiLCJlZGl0SGFuZGxlVHlwZSIsImZlYXR1cmVJbmRleCIsIm9uVXBkYXRlQ3Vyc29yIiwiR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxrQjs7Ozs7Ozs7Ozs7OztnQ0FDQ0MsSyxFQUFtQkMsSyxFQUFxQztBQUFBLFVBQzFEQyxLQUQwRCxHQUNoREYsS0FEZ0QsQ0FDMURFLEtBRDBEO0FBRWxFLFVBQU1DLGlCQUFpQixHQUFHLGdDQUFvQkQsS0FBcEIsQ0FBMUI7QUFFQSxVQUFJRSxhQUFhLEdBQUcsS0FBcEI7O0FBQ0EsVUFBSSxD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QUEsV0FBVywrQkFBTVQsYUFBTixHQUF3QnNCLFVBQXhCO0FBRkg7QUFMTyxTQUFuQjtBQVVEOztBQUVELFVBQUlHLGdCQUFKLEVBQXNCO0FBQ3BCRixRQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JJLElBQWhCLENBQXFCSCxnQkFBckI7QUFDRDs7QUFFRCxVQUFNSSxXQUFXLEdBQUc3QixhQUFhLENBQUM4QixHQUFkLENBQWtCLFVBQUNDLFlBQUQsRUFBZUMsS0FBZjtBQUFBLGVBQTBCO0FBQzlEeEIsVUFBQUEsSUFBSSxFQUFFLFNBRHdEO0FBRTlESCxVQUFBQSxVQUFVLEVBQUU7QUFDVnFCLFlBQUFBLFNBQVMsRUFBRSxZQUREO0FBRVZPLFlBQUFBLGNBQWMsRUFBRSxVQUZOO0FBR1ZDLFlBQUFBLFlBQVksRUFBRSxDQUFDLENBSEw7QUFJVjVCLFlBQUFBLGVBQWUsRUFBRSxDQUFDMEIsS0FBRDtBQUpQLFdBRmtEO0FBUTlETCxVQUFBQSxRQUFRLEVBQUU7QUFDUm5CLFlBQUFBLElBQUksRUFBRSxPQURFO0FBRVJDLFlBQUFBLFdBQVcsRUFBRXNCO0FBRkw7QUFSb0QsU0FBMUI7QUFBQSxPQUFsQixDQUFwQjs7QUFjQSwwQkFBQVIsTUFBTSxDQUFDQyxRQUFQLEVBQWdCSSxJQUFoQiw0Q0FBd0JDLFdBQXhCLEdBM0NxRSxDQTRDckU7OztBQUNBLGFBQU9OLE1BQVA7QUFDRDs7O3NDQUVpQjdCLEssRUFBeUJDLEssRUFBcUM7QUFDOUVBLE1BQUFBLEtBQUssQ0FBQ3dDLGNBQU4sQ0FBcUIsTUFBckI7QUFDRDs7OztFQS9HcUNDLGdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTGluZVN0cmluZywgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7IENsaWNrRXZlbnQsIFBvaW50ZXJNb3ZlRXZlbnQsIE1vZGVQcm9wcywgR3VpZGVGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGdldFBpY2tlZEVkaXRIYW5kbGUgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBHZW9Kc29uRWRpdE1vZGUgfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlJztcblxuZXhwb3J0IGNsYXNzIERyYXdMaW5lU3RyaW5nTW9kZSBleHRlbmRzIEdlb0pzb25FZGl0TW9kZSB7XG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGNvbnN0IHsgcGlja3MgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGNsaWNrZWRFZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShwaWNrcyk7XG5cbiAgICBsZXQgcG9zaXRpb25BZGRlZCA9IGZhbHNlO1xuICAgIGlmICghY2xpY2tlZEVkaXRIYW5kbGUpIHtcbiAgICAgIC8vIERvbid0IGFkZCBhbm90aGVyIHBvaW50IHJpZ2h0IG5leHQgdG8gYW4gZXhpc3Rpbmcgb25lXG4gICAgICB0aGlzLmFkZENsaWNrU2VxdWVuY2UoZXZlbnQpO1xuICAgICAgcG9zaXRpb25BZGRlZCA9IHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChcbiAgICAgIGNsaWNrU2VxdWVuY2UubGVuZ3RoID4gMSAmJlxuICAgICAgY2xpY2tlZEVkaXRIYW5kbGUgJiZcbiAgICAgIEFycmF5LmlzQXJyYXkoY2xpY2tlZEVkaXRIYW5kbGUucHJvcGVydGllcy5wb3NpdGlvbkluZGV4ZXMpICYmXG4gICAgICBjbGlja2VkRWRpdEhhbmRsZS5wcm9wZXJ0aWVzLnBvc2l0aW9uSW5kZXhlc1swXSA9PT0gY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXG4gICAgKSB7XG4gICAgICAvLyBUaGV5IGNsaWNrZWQgdGhlIGxhc3QgcG9pbnQgKG9yIGRvdWJsZS1jbGlja2VkKSwgc28gYWRkIHRoZSBMaW5lU3RyaW5nXG5cbiAgICAgIGNvbnN0IGxpbmVTdHJpbmdUb0FkZDogTGluZVN0cmluZyA9IHtcbiAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICBjb29yZGluYXRlczogWy4uLmNsaWNrU2VxdWVuY2VdLFxuICAgICAgfTtcblxuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcblxuICAgICAgY29uc3QgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0QWRkRmVhdHVyZUFjdGlvbihsaW5lU3RyaW5nVG9BZGQsIHByb3BzLmRhdGEpO1xuICAgICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgICAgcHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocG9zaXRpb25BZGRlZCkge1xuICAgICAgLy8gbmV3IHRlbnRhdGl2ZSBwb2ludFxuICAgICAgcHJvcHMub25FZGl0KHtcbiAgICAgICAgLy8gZGF0YSBpcyB0aGUgc2FtZVxuICAgICAgICB1cGRhdGVkRGF0YTogcHJvcHMuZGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICdhZGRUZW50YXRpdmVQb3NpdGlvbicsXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgcG9zaXRpb246IGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBoYW5kbGVLZXlVcChldmVudDogS2V5Ym9hcmRFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBjb25zdCB7IGtleSB9ID0gZXZlbnQ7XG4gICAgaWYgKGtleSA9PT0gJ0VudGVyJykge1xuICAgICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBsaW5lU3RyaW5nVG9BZGQ6IExpbmVTdHJpbmcgPSB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbLi4uY2xpY2tTZXF1ZW5jZV0sXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICAgIGNvbnN0IGVkaXRBY3Rpb24gPSB0aGlzLmdldEFkZEZlYXR1cmVBY3Rpb24obGluZVN0cmluZ1RvQWRkLCBwcm9wcy5kYXRhKTtcbiAgICAgICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgICAgICBwcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0R3VpZGVzKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogR3VpZGVGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgY29uc3QgeyBsYXN0UG9pbnRlck1vdmVFdmVudCB9ID0gcHJvcHM7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgY29uc3QgbGFzdENvb3JkcyA9IGxhc3RQb2ludGVyTW92ZUV2ZW50ID8gW2xhc3RQb2ludGVyTW92ZUV2ZW50Lm1hcENvb3Jkc10gOiBbXTtcblxuICAgIGNvbnN0IGd1aWRlcyA9IHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogW10sXG4gICAgfTtcblxuICAgIGxldCB0ZW50YXRpdmVGZWF0dXJlO1xuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA+IDApIHtcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGd1aWRlVHlwZTogJ3RlbnRhdGl2ZScsXG4gICAgICAgIH0sXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbLi4uY2xpY2tTZXF1ZW5jZSwgLi4ubGFzdENvb3Jkc10sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICh0ZW50YXRpdmVGZWF0dXJlKSB7XG4gICAgICBndWlkZXMuZmVhdHVyZXMucHVzaCh0ZW50YXRpdmVGZWF0dXJlKTtcbiAgICB9XG5cbiAgICBjb25zdCBlZGl0SGFuZGxlcyA9IGNsaWNrU2VxdWVuY2UubWFwKChjbGlja2VkQ29vcmQsIGluZGV4KSA9PiAoe1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBndWlkZVR5cGU6ICdlZGl0SGFuZGxlJyxcbiAgICAgICAgZWRpdEhhbmRsZVR5cGU6ICdleGlzdGluZycsXG4gICAgICAgIGZlYXR1cmVJbmRleDogLTEsXG4gICAgICAgIHBvc2l0aW9uSW5kZXhlczogW2luZGV4XSxcbiAgICAgIH0sXG4gICAgICBnZW9tZXRyeToge1xuICAgICAgICB0eXBlOiAnUG9pbnQnLFxuICAgICAgICBjb29yZGluYXRlczogY2xpY2tlZENvb3JkLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICBndWlkZXMuZmVhdHVyZXMucHVzaCguLi5lZGl0SGFuZGxlcyk7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBndWlkZXM7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcignY2VsbCcpO1xuICB9XG59XG4iXX0=