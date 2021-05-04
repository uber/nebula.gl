"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreeClickPolygonMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var ThreeClickPolygonMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(ThreeClickPolygonMode, _GeoJsonEditMode);

  var _super = _createSuper(ThreeClickPolygonMode);

  function ThreeClickPolygonMode() {
    _classCallCheck(this, ThreeClickPolygonMode);

    return _super.apply(this, arguments);
  }

  _createClass(ThreeClickPolygonMode, [{
    key: "handleClick",
    value: function handleClick(event, props) {
      this.addClickSequence(event);
      var clickSequence = this.getClickSequence();
      var tentativeFeature = this.getTentativeGuide(props);

      if (clickSequence.length > 2 && tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        var editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry, props);
        this.resetClickSequence();

        if (editAction) {
          props.onEdit(editAction);
        }
      }
    }
  }, {
    key: "getGuides",
    value: function getGuides(props) {
      var lastPointerMoveEvent = props.lastPointerMoveEvent,
          modeConfig = props.modeConfig;
      var clickSequence = this.getClickSequence();
      var guides = {
        type: 'FeatureCollection',
        features: []
      };

      if (clickSequence.length === 0) {
        // nothing to do yet
        return guides;
      }

      var hoveredCoord = lastPointerMoveEvent.mapCoords;

      if (clickSequence.length === 1) {
        guides.features.push({
          type: 'Feature',
          properties: {
            guideType: 'tentative'
          },
          geometry: {
            type: 'LineString',
            coordinates: [clickSequence[0], hoveredCoord]
          }
        });
      } else {
        var polygon = this.getThreeClickPolygon(clickSequence[0], clickSequence[1], hoveredCoord, modeConfig);

        if (polygon) {
          guides.features.push({
            type: 'Feature',
            properties: {
              guideType: 'tentative'
            },
            geometry: polygon.geometry
          });
        }
      }

      return guides;
    }
  }, {
    key: "getThreeClickPolygon",
    value: function getThreeClickPolygon(coord1, coord2, coord3, modeConfig) {
      return null;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      props.onUpdateCursor('cell');

      _get(_getPrototypeOf(ThreeClickPolygonMode.prototype), "handlePointerMove", this).call(this, event, props);
    }
  }, {
    key: "createTentativeFeature",
    value: function createTentativeFeature(props) {
      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var clickSequence = this.getClickSequence();
      var lastCoords = lastPointerMoveEvent ? [lastPointerMoveEvent.mapCoords] : [];
      var tentativeFeature;

      if (clickSequence.length === 2) {
        tentativeFeature = this.getThreeClickPolygon(clickSequence[0], clickSequence[1], lastCoords[0], props.modeConfig);
      }

      return tentativeFeature;
    }
  }]);

  return ThreeClickPolygonMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.ThreeClickPolygonMode = ThreeClickPolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdGhyZWUtY2xpY2stcG9seWdvbi1tb2RlLnRzIl0sIm5hbWVzIjpbIlRocmVlQ2xpY2tQb2x5Z29uTW9kZSIsImV2ZW50IiwicHJvcHMiLCJhZGRDbGlja1NlcXVlbmNlIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJ0ZW50YXRpdmVGZWF0dXJlIiwiZ2V0VGVudGF0aXZlR3VpZGUiLCJsZW5ndGgiLCJnZW9tZXRyeSIsInR5cGUiLCJlZGl0QWN0aW9uIiwiZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24iLCJyZXNldENsaWNrU2VxdWVuY2UiLCJvbkVkaXQiLCJsYXN0UG9pbnRlck1vdmVFdmVudCIsIm1vZGVDb25maWciLCJndWlkZXMiLCJmZWF0dXJlcyIsImhvdmVyZWRDb29yZCIsIm1hcENvb3JkcyIsInB1c2giLCJwcm9wZXJ0aWVzIiwiZ3VpZGVUeXBlIiwiY29vcmRpbmF0ZXMiLCJwb2x5Z29uIiwiZ2V0VGhyZWVDbGlja1BvbHlnb24iLCJjb29yZDEiLCJjb29yZDIiLCJjb29yZDMiLCJvblVwZGF0ZUN1cnNvciIsImxhc3RDb29yZHMiLCJHZW9Kc29uRWRpdE1vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxxQjs7Ozs7Ozs7Ozs7OztnQ0FDQ0MsSyxFQUFtQkMsSyxFQUFxQztBQUNsRSxXQUFLQyxnQkFBTCxDQUFzQkYsS0FBdEI7QUFDQSxVQUFNRyxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7QUFDQSxVQUFNQyxnQkFBZ0IsR0FBRyxLQUFLQyxpQkFBTCxDQUF1QkwsS0FBdkIsQ0FBekI7O0FBRUEsVUFDRUUsYUFBYSxDQUFDSSxNQUFkLEdBQXVCLENBQXZCLElBQ0FGLGdCQURBLElBRUFBLGdCQUFnQixDQUFDRyxRQUFqQixDQUEwQkMsSUFBMUIsS0FBbUMsU0FIckMsRUFJRTtBQUNBLFlBQU1DLFVBQVUsR0FBRyxLQUFLQyxtQ0FBTCxDQUF5Q04sZ0JBQWdCLENBQUNHLFFBQTFELEVBQW9FUCxLQUFwRSxDQUFuQjtBQUNBLGFBQUtXLGtCQUFMOztBQUVBLFlBQUlGLFVBQUosRUFBZ0I7QUFDZFQsVUFBQUEsS0FBSyxDQUFDWSxNQUFOLENBQWFILFVBQWI7QUFDRDtBQUNGO0FBQ0Y7Ozs4QkFFU1QsSyxFQUE2RDtBQUFBLFVBQzdEYSxvQkFENkQsR0FDeEJiLEtBRHdCLENBQzdEYSxvQkFENkQ7QUFBQSxVQUN2Q0MsVUFEdUMsR0FDeEJkLEtBRHdCLENBQ3ZDYyxVQUR1QztBQUVyRSxVQUFNWixhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7QUFFQSxVQUFNWSxNQUE4QixHQUFHO0FBQ3JDUCxRQUFBQSxJQUFJLEVBQUUsbUJBRCtCO0FBRXJDUSxRQUFBQSxRQUFRLEVBQUU7QUFGMkIsT0FBdkM7O0FBS0EsVUFBSWQsYUFBYSxDQUFDSSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzlCO0FBQ0EsZUFBT1MsTUFBUDtBQUNEOztBQUVELFVBQU1FLFlBQVksR0FBR0osb0JBQW9CLENBQUNLLFNBQTFDOztBQUVBLFVBQUloQixhQUFhLENBQUNJLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUJTLFFBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkcsSUFBaEIsQ0FBcUI7QUFDbkJYLFVBQUFBLElBQUksRUFBRSxTQURhO0FBRW5CWSxVQUFBQSxVQUFVLEVBQUU7QUFDVkMsWUFBQUEsU0FBUyxFQUFFO0FBREQsV0FGTztBQUtuQmQsVUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFlBQUFBLElBQUksRUFBRSxZQURFO0FBRVJjLFlBQUFBLFdBQVcsRUFBRSxDQUFDcEIsYUFBYSxDQUFDLENBQUQsQ0FBZCxFQUFtQmUsWUFBbkI7QUFGTDtBQUxTLFNBQXJCO0FBVUQsT0FYRCxNQVdPO0FBQ0wsWUFBTU0sT0FBTyxHQUFHLEtBQUtDLG9CQUFMLENBQ2R0QixhQUFhLENBQUMsQ0FBRCxDQURDLEVBRWRBLGFBQWEsQ0FBQyxDQUFELENBRkMsRUFHZGUsWUFIYyxFQUlkSCxVQUpjLENBQWhCOztBQU1BLFlBQUlTLE9BQUosRUFBYTtBQUNYUixVQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JHLElBQWhCLENBQXFCO0FBQ25CWCxZQUFBQSxJQUFJLEVBQUUsU0FEYTtBQUVuQlksWUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLGNBQUFBLFNBQVMsRUFBRTtBQURELGFBRk87QUFLbkJkLFlBQUFBLFFBQVEsRUFBRWdCLE9BQU8sQ0FBQ2hCO0FBTEMsV0FBckI7QUFPRDtBQUNGOztBQUVELGFBQU9RLE1BQVA7QUFDRDs7O3lDQUdDVSxNLEVBQ0FDLE0sRUFDQUMsTSxFQUNBYixVLEVBQ3VDO0FBQ3ZDLGFBQU8sSUFBUDtBQUNEOzs7c0NBRWlCZixLLEVBQXlCQyxLLEVBQXFDO0FBQzlFQSxNQUFBQSxLQUFLLENBQUM0QixjQUFOLENBQXFCLE1BQXJCOztBQUNBLG1HQUF3QjdCLEtBQXhCLEVBQStCQyxLQUEvQjtBQUNEOzs7MkNBRXNCQSxLLEVBQXVEO0FBQUEsVUFDcEVhLG9CQURvRSxHQUMzQ2IsS0FEMkMsQ0FDcEVhLG9CQURvRTtBQUU1RSxVQUFNWCxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7QUFFQSxVQUFNMEIsVUFBVSxHQUFHaEIsb0JBQW9CLEdBQUcsQ0FBQ0Esb0JBQW9CLENBQUNLLFNBQXRCLENBQUgsR0FBc0MsRUFBN0U7QUFFQSxVQUFJZCxnQkFBSjs7QUFDQSxVQUFJRixhQUFhLENBQUNJLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUJGLFFBQUFBLGdCQUFnQixHQUFHLEtBQUtvQixvQkFBTCxDQUNqQnRCLGFBQWEsQ0FBQyxDQUFELENBREksRUFFakJBLGFBQWEsQ0FBQyxDQUFELENBRkksRUFHakIyQixVQUFVLENBQUMsQ0FBRCxDQUhPLEVBSWpCN0IsS0FBSyxDQUFDYyxVQUpXLENBQW5CO0FBTUQ7O0FBRUQsYUFBT1YsZ0JBQVA7QUFDRDs7OztFQW5Hd0MwQixnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENsaWNrRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIE1vZGVQcm9wcyxcbiAgR3VpZGVGZWF0dXJlQ29sbGVjdGlvbixcbiAgVGVudGF0aXZlRmVhdHVyZSxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgUG9zaXRpb24sIFBvbHlnb24sIEZlYXR1cmVPZiwgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7IEdlb0pzb25FZGl0TW9kZSB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUnO1xuXG5leHBvcnQgY2xhc3MgVGhyZWVDbGlja1BvbHlnb25Nb2RlIGV4dGVuZHMgR2VvSnNvbkVkaXRNb2RlIHtcbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgdGhpcy5hZGRDbGlja1NlcXVlbmNlKGV2ZW50KTtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlR3VpZGUocHJvcHMpO1xuXG4gICAgaWYgKFxuICAgICAgY2xpY2tTZXF1ZW5jZS5sZW5ndGggPiAyICYmXG4gICAgICB0ZW50YXRpdmVGZWF0dXJlICYmXG4gICAgICB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJ1xuICAgICkge1xuICAgICAgY29uc3QgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24odGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeSwgcHJvcHMpO1xuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcblxuICAgICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgICAgcHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldEd1aWRlcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIGNvbnN0IHsgbGFzdFBvaW50ZXJNb3ZlRXZlbnQsIG1vZGVDb25maWcgfSA9IHByb3BzO1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGNvbnN0IGd1aWRlczogR3VpZGVGZWF0dXJlQ29sbGVjdGlvbiA9IHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogW10sXG4gICAgfTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gbm90aGluZyB0byBkbyB5ZXRcbiAgICAgIHJldHVybiBndWlkZXM7XG4gICAgfVxuXG4gICAgY29uc3QgaG92ZXJlZENvb3JkID0gbGFzdFBvaW50ZXJNb3ZlRXZlbnQubWFwQ29vcmRzO1xuXG4gICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAxKSB7XG4gICAgICBndWlkZXMuZmVhdHVyZXMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGd1aWRlVHlwZTogJ3RlbnRhdGl2ZScsXG4gICAgICAgIH0sXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbY2xpY2tTZXF1ZW5jZVswXSwgaG92ZXJlZENvb3JkXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5nZXRUaHJlZUNsaWNrUG9seWdvbihcbiAgICAgICAgY2xpY2tTZXF1ZW5jZVswXSxcbiAgICAgICAgY2xpY2tTZXF1ZW5jZVsxXSxcbiAgICAgICAgaG92ZXJlZENvb3JkLFxuICAgICAgICBtb2RlQ29uZmlnXG4gICAgICApO1xuICAgICAgaWYgKHBvbHlnb24pIHtcbiAgICAgICAgZ3VpZGVzLmZlYXR1cmVzLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBndWlkZVR5cGU6ICd0ZW50YXRpdmUnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2VvbWV0cnk6IHBvbHlnb24uZ2VvbWV0cnksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBndWlkZXM7XG4gIH1cblxuICBnZXRUaHJlZUNsaWNrUG9seWdvbihcbiAgICBjb29yZDE6IFBvc2l0aW9uLFxuICAgIGNvb3JkMjogUG9zaXRpb24sXG4gICAgY29vcmQzOiBQb3NpdGlvbixcbiAgICBtb2RlQ29uZmlnOiBhbnlcbiAgKTogRmVhdHVyZU9mPFBvbHlnb24+IHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcignY2VsbCcpO1xuICAgIHN1cGVyLmhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50LCBwcm9wcyk7XG4gIH1cblxuICBjcmVhdGVUZW50YXRpdmVGZWF0dXJlKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogVGVudGF0aXZlRmVhdHVyZSB7XG4gICAgY29uc3QgeyBsYXN0UG9pbnRlck1vdmVFdmVudCB9ID0gcHJvcHM7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgY29uc3QgbGFzdENvb3JkcyA9IGxhc3RQb2ludGVyTW92ZUV2ZW50ID8gW2xhc3RQb2ludGVyTW92ZUV2ZW50Lm1hcENvb3Jkc10gOiBbXTtcblxuICAgIGxldCB0ZW50YXRpdmVGZWF0dXJlO1xuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMikge1xuICAgICAgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGhyZWVDbGlja1BvbHlnb24oXG4gICAgICAgIGNsaWNrU2VxdWVuY2VbMF0sXG4gICAgICAgIGNsaWNrU2VxdWVuY2VbMV0sXG4gICAgICAgIGxhc3RDb29yZHNbMF0sXG4gICAgICAgIHByb3BzLm1vZGVDb25maWdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbnRhdGl2ZUZlYXR1cmU7XG4gIH1cbn1cbiJdfQ==