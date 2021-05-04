"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawPolygonMode = void 0;

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

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DrawPolygonMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(DrawPolygonMode, _GeoJsonEditMode);

  var _super = _createSuper(DrawPolygonMode);

  function DrawPolygonMode() {
    _classCallCheck(this, DrawPolygonMode);

    return _super.apply(this, arguments);
  }

  _createClass(DrawPolygonMode, [{
    key: "createTentativeFeature",
    value: function createTentativeFeature(props) {
      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var clickSequence = this.getClickSequence();
      var lastCoords = lastPointerMoveEvent ? [lastPointerMoveEvent.mapCoords] : [];
      var tentativeFeature;

      if (clickSequence.length === 1 || clickSequence.length === 2) {
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
      } else if (clickSequence.length > 2) {
        tentativeFeature = {
          type: 'Feature',
          properties: {
            guideType: 'tentative'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[].concat(_toConsumableArray(clickSequence), lastCoords, [clickSequence[0]])]
          }
        };
      }

      return tentativeFeature;
    }
  }, {
    key: "getGuides",
    value: function getGuides(props) {
      var _guides$features;

      var clickSequence = this.getClickSequence();
      var guides = {
        type: 'FeatureCollection',
        features: []
      };
      var tentativeFeature = this.createTentativeFeature(props);

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

      if (clickSequence.length > 2 && clickedEditHandle && Array.isArray(clickedEditHandle.properties.positionIndexes) && (clickedEditHandle.properties.positionIndexes[0] === 0 || clickedEditHandle.properties.positionIndexes[0] === clickSequence.length - 1)) {
        // They clicked the first or last point (or double-clicked), so complete the polygon
        // Remove the hovered position
        var polygonToAdd = {
          type: 'Polygon',
          coordinates: [[].concat(_toConsumableArray(clickSequence), [clickSequence[0]])]
        };
        this.resetClickSequence();
        var editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);

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
      if (event.key === 'Enter') {
        var clickSequence = this.getClickSequence();

        if (clickSequence.length > 2) {
          var polygonToAdd = {
            type: 'Polygon',
            coordinates: [[].concat(_toConsumableArray(clickSequence), [clickSequence[0]])]
          };
          this.resetClickSequence();
          var editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);

          if (editAction) {
            props.onEdit(editAction);
          }
        }
      }
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      props.onUpdateCursor('cell');

      _get(_getPrototypeOf(DrawPolygonMode.prototype), "handlePointerMove", this).call(this, event, props);
    }
  }]);

  return DrawPolygonMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.DrawPolygonMode = DrawPolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1wb2x5Z29uLW1vZGUudHMiXSwibmFtZXMiOlsiRHJhd1BvbHlnb25Nb2RlIiwicHJvcHMiLCJsYXN0UG9pbnRlck1vdmVFdmVudCIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwibGFzdENvb3JkcyIsIm1hcENvb3JkcyIsInRlbnRhdGl2ZUZlYXR1cmUiLCJsZW5ndGgiLCJ0eXBlIiwicHJvcGVydGllcyIsImd1aWRlVHlwZSIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJndWlkZXMiLCJmZWF0dXJlcyIsImNyZWF0ZVRlbnRhdGl2ZUZlYXR1cmUiLCJwdXNoIiwiZWRpdEhhbmRsZXMiLCJtYXAiLCJjbGlja2VkQ29vcmQiLCJpbmRleCIsImVkaXRIYW5kbGVUeXBlIiwiZmVhdHVyZUluZGV4IiwicG9zaXRpb25JbmRleGVzIiwiZXZlbnQiLCJwaWNrcyIsImNsaWNrZWRFZGl0SGFuZGxlIiwicG9zaXRpb25BZGRlZCIsImFkZENsaWNrU2VxdWVuY2UiLCJBcnJheSIsImlzQXJyYXkiLCJwb2x5Z29uVG9BZGQiLCJyZXNldENsaWNrU2VxdWVuY2UiLCJlZGl0QWN0aW9uIiwiZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24iLCJvbkVkaXQiLCJ1cGRhdGVkRGF0YSIsImRhdGEiLCJlZGl0VHlwZSIsImVkaXRDb250ZXh0IiwicG9zaXRpb24iLCJrZXkiLCJvblVwZGF0ZUN1cnNvciIsIkdlb0pzb25FZGl0TW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQVFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLGU7Ozs7Ozs7Ozs7Ozs7MkNBQ1lDLEssRUFBdUQ7QUFBQSxVQUNwRUMsb0JBRG9FLEdBQzNDRCxLQUQyQyxDQUNwRUMsb0JBRG9FO0FBRTVFLFVBQU1DLGFBQWEsR0FBRyxLQUFLQyxnQkFBTCxFQUF0QjtBQUVBLFVBQU1DLFVBQVUs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QixjQUFNd0IsWUFBcUIsR0FBRztBQUM1QnZCLFlBQUFBLElBQUksRUFBRSxTQURzQjtBQUU1QkksWUFBQUEsV0FBVyxFQUFFLDhCQUFLVixhQUFMLElBQW9CQSxhQUFhLENBQUMsQ0FBRCxDQUFqQztBQUZlLFdBQTlCO0FBSUEsZUFBSzhCLGtCQUFMO0FBRUEsY0FBTUMsVUFBVSxHQUFHLEtBQUtDLG1DQUFMLENBQXlDSCxZQUF6QyxFQUF1RC9CLEtBQXZELENBQW5COztBQUNBLGNBQUlpQyxVQUFKLEVBQWdCO0FBQ2RqQyxZQUFBQSxLQUFLLENBQUNtQyxNQUFOLENBQWFGLFVBQWI7QUFDRDtBQUNGO0FBQ0Y7QUFDRjs7O3NDQUNpQlQsSyxFQUF5QnhCLEssRUFBcUM7QUFDOUVBLE1BQUFBLEtBQUssQ0FBQzBDLGNBQU4sQ0FBcUIsTUFBckI7O0FBQ0EsNkZBQXdCbEIsS0FBeEIsRUFBK0J4QixLQUEvQjtBQUNEOzs7O0VBcElrQzJDLGdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2xpY2tFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgTW9kZVByb3BzLFxuICBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uLFxuICBUZW50YXRpdmVGZWF0dXJlLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBQb2x5Z29uLCBGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMnO1xuaW1wb3J0IHsgZ2V0UGlja2VkRWRpdEhhbmRsZSB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IEdlb0pzb25FZGl0TW9kZSB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUnO1xuXG5leHBvcnQgY2xhc3MgRHJhd1BvbHlnb25Nb2RlIGV4dGVuZHMgR2VvSnNvbkVkaXRNb2RlIHtcbiAgY3JlYXRlVGVudGF0aXZlRmVhdHVyZShwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IFRlbnRhdGl2ZUZlYXR1cmUge1xuICAgIGNvbnN0IHsgbGFzdFBvaW50ZXJNb3ZlRXZlbnQgfSA9IHByb3BzO1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGNvbnN0IGxhc3RDb29yZHMgPSBsYXN0UG9pbnRlck1vdmVFdmVudCA/IFtsYXN0UG9pbnRlck1vdmVFdmVudC5tYXBDb29yZHNdIDogW107XG5cbiAgICBsZXQgdGVudGF0aXZlRmVhdHVyZTtcbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDEgfHwgY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRlbnRhdGl2ZUZlYXR1cmUgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGd1aWRlVHlwZTogJ3RlbnRhdGl2ZScsXG4gICAgICAgIH0sXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbLi4uY2xpY2tTZXF1ZW5jZSwgLi4ubGFzdENvb3Jkc10sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPiAyKSB7XG4gICAgICB0ZW50YXRpdmVGZWF0dXJlID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBndWlkZVR5cGU6ICd0ZW50YXRpdmUnLFxuICAgICAgICB9LFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogW1suLi5jbGlja1NlcXVlbmNlLCAuLi5sYXN0Q29vcmRzLCBjbGlja1NlcXVlbmNlWzBdXV0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB0ZW50YXRpdmVGZWF0dXJlO1xuICB9XG5cbiAgZ2V0R3VpZGVzKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogR3VpZGVGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgY29uc3QgZ3VpZGVzID0ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgIGZlYXR1cmVzOiBbXSxcbiAgICB9O1xuXG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuY3JlYXRlVGVudGF0aXZlRmVhdHVyZShwcm9wcyk7XG4gICAgaWYgKHRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIGd1aWRlcy5mZWF0dXJlcy5wdXNoKHRlbnRhdGl2ZUZlYXR1cmUpO1xuICAgIH1cblxuICAgIGNvbnN0IGVkaXRIYW5kbGVzID0gY2xpY2tTZXF1ZW5jZS5tYXAoKGNsaWNrZWRDb29yZCwgaW5kZXgpID0+ICh7XG4gICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGd1aWRlVHlwZTogJ2VkaXRIYW5kbGUnLFxuICAgICAgICBlZGl0SGFuZGxlVHlwZTogJ2V4aXN0aW5nJyxcbiAgICAgICAgZmVhdHVyZUluZGV4OiAtMSxcbiAgICAgICAgcG9zaXRpb25JbmRleGVzOiBbaW5kZXhdLFxuICAgICAgfSxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBjbGlja2VkQ29vcmQsXG4gICAgICB9LFxuICAgIH0pKTtcblxuICAgIGd1aWRlcy5mZWF0dXJlcy5wdXNoKC4uLmVkaXRIYW5kbGVzKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIGd1aWRlcztcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGNvbnN0IHsgcGlja3MgfSA9IGV2ZW50O1xuICAgIGNvbnN0IGNsaWNrZWRFZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShwaWNrcyk7XG5cbiAgICBsZXQgcG9zaXRpb25BZGRlZCA9IGZhbHNlO1xuICAgIGlmICghY2xpY2tlZEVkaXRIYW5kbGUpIHtcbiAgICAgIC8vIERvbid0IGFkZCBhbm90aGVyIHBvaW50IHJpZ2h0IG5leHQgdG8gYW4gZXhpc3Rpbmcgb25lXG4gICAgICB0aGlzLmFkZENsaWNrU2VxdWVuY2UoZXZlbnQpO1xuICAgICAgcG9zaXRpb25BZGRlZCA9IHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGlmIChcbiAgICAgIGNsaWNrU2VxdWVuY2UubGVuZ3RoID4gMiAmJlxuICAgICAgY2xpY2tlZEVkaXRIYW5kbGUgJiZcbiAgICAgIEFycmF5LmlzQXJyYXkoY2xpY2tlZEVkaXRIYW5kbGUucHJvcGVydGllcy5wb3NpdGlvbkluZGV4ZXMpICYmXG4gICAgICAoY2xpY2tlZEVkaXRIYW5kbGUucHJvcGVydGllcy5wb3NpdGlvbkluZGV4ZXNbMF0gPT09IDAgfHxcbiAgICAgICAgY2xpY2tlZEVkaXRIYW5kbGUucHJvcGVydGllcy5wb3NpdGlvbkluZGV4ZXNbMF0gPT09IGNsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMSlcbiAgICApIHtcbiAgICAgIC8vIFRoZXkgY2xpY2tlZCB0aGUgZmlyc3Qgb3IgbGFzdCBwb2ludCAob3IgZG91YmxlLWNsaWNrZWQpLCBzbyBjb21wbGV0ZSB0aGUgcG9seWdvblxuXG4gICAgICAvLyBSZW1vdmUgdGhlIGhvdmVyZWQgcG9zaXRpb25cbiAgICAgIGNvbnN0IHBvbHlnb25Ub0FkZDogUG9seWdvbiA9IHtcbiAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICBjb29yZGluYXRlczogW1suLi5jbGlja1NlcXVlbmNlLCBjbGlja1NlcXVlbmNlWzBdXV0sXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgICBjb25zdCBlZGl0QWN0aW9uID0gdGhpcy5nZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbihwb2x5Z29uVG9BZGQsIHByb3BzKTtcbiAgICAgIGlmIChlZGl0QWN0aW9uKSB7XG4gICAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHBvc2l0aW9uQWRkZWQpIHtcbiAgICAgIC8vIG5ldyB0ZW50YXRpdmUgcG9pbnRcbiAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgIC8vIGRhdGEgaXMgdGhlIHNhbWVcbiAgICAgICAgdXBkYXRlZERhdGE6IHByb3BzLmRhdGEsXG4gICAgICAgIGVkaXRUeXBlOiAnYWRkVGVudGF0aXZlUG9zaXRpb24nLFxuICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5tYXBDb29yZHMsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaGFuZGxlS2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgaWYgKGV2ZW50LmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID4gMikge1xuICAgICAgICBjb25zdCBwb2x5Z29uVG9BZGQ6IFBvbHlnb24gPSB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbWy4uLmNsaWNrU2VxdWVuY2UsIGNsaWNrU2VxdWVuY2VbMF1dXSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcblxuICAgICAgICBjb25zdCBlZGl0QWN0aW9uID0gdGhpcy5nZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbihwb2x5Z29uVG9BZGQsIHByb3BzKTtcbiAgICAgICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgICAgICBwcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgcHJvcHMub25VcGRhdGVDdXJzb3IoJ2NlbGwnKTtcbiAgICBzdXBlci5oYW5kbGVQb2ludGVyTW92ZShldmVudCwgcHJvcHMpO1xuICB9XG59XG4iXX0=