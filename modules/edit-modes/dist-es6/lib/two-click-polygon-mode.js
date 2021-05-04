"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TwoClickPolygonMode = void 0;

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

var TwoClickPolygonMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(TwoClickPolygonMode, _GeoJsonEditMode);

  var _super = _createSuper(TwoClickPolygonMode);

  function TwoClickPolygonMode() {
    _classCallCheck(this, TwoClickPolygonMode);

    return _super.apply(this, arguments);
  }

  _createClass(TwoClickPolygonMode, [{
    key: "handleClick",
    value: function handleClick(event, props) {
      if (props.modeConfig && props.modeConfig.dragToDraw) {
        // handled in drag handlers
        return;
      }

      this.addClickSequence(event);
      this.checkAndFinishPolygon(props);
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      if (!props.modeConfig || !props.modeConfig.dragToDraw) {
        // handled in click handlers
        return;
      }

      this.addClickSequence(event);
      event.cancelPan();
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      if (!props.modeConfig || !props.modeConfig.dragToDraw) {
        // handled in click handlers
        return;
      }

      this.addClickSequence(event);
      this.checkAndFinishPolygon(props);
    }
  }, {
    key: "checkAndFinishPolygon",
    value: function checkAndFinishPolygon(props) {
      var clickSequence = this.getClickSequence();
      var tentativeFeature = this.getTentativeGuide(props);

      if (clickSequence.length > 1 && tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        var feature = {
          type: 'Feature',
          properties: {
            shape: tentativeFeature.properties.shape
          },
          geometry: {
            type: 'Polygon',
            coordinates: tentativeFeature.geometry.coordinates
          }
        };
        var editAction = this.getAddFeatureOrBooleanPolygonAction(feature, props);
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

      var corner1 = clickSequence[0];
      var corner2 = lastPointerMoveEvent.mapCoords;
      var polygon = this.getTwoClickPolygon(corner1, corner2, modeConfig);

      if (polygon) {
        guides.features.push({
          type: 'Feature',
          properties: {
            shape: polygon.properties && polygon.properties.shape,
            guideType: 'tentative'
          },
          geometry: polygon.geometry
        });
      }

      return guides;
    }
  }, {
    key: "getTwoClickPolygon",
    value: function getTwoClickPolygon(coord1, coord2, modeConfig) {
      return null;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      props.onUpdateCursor('cell');

      _get(_getPrototypeOf(TwoClickPolygonMode.prototype), "handlePointerMove", this).call(this, event, props);
    }
  }, {
    key: "createTentativeFeature",
    value: function createTentativeFeature(props) {
      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var clickSequence = this.getClickSequence();
      var lastCoords = lastPointerMoveEvent ? [lastPointerMoveEvent.mapCoords] : [];
      var tentativeFeature;

      if (clickSequence.length === 1) {
        tentativeFeature = this.getTwoClickPolygon(clickSequence[0], lastCoords[0], props.modeConfig);
      }

      return tentativeFeature;
    }
  }]);

  return TwoClickPolygonMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.TwoClickPolygonMode = TwoClickPolygonMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdHdvLWNsaWNrLXBvbHlnb24tbW9kZS50cyJdLCJuYW1lcyI6WyJUd29DbGlja1BvbHlnb25Nb2RlIiwiZXZlbnQiLCJwcm9wcyIsIm1vZGVDb25maWciLCJkcmFnVG9EcmF3IiwiYWRkQ2xpY2tTZXF1ZW5jZSIsImNoZWNrQW5kRmluaXNoUG9seWdvbiIsImNhbmNlbFBhbiIsImNsaWNrU2VxdWVuY2UiLCJnZXRDbGlja1NlcXVlbmNlIiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUd1aWRlIiwibGVuZ3RoIiwiZ2VvbWV0cnkiLCJ0eXBlIiwiZmVhdHVyZSIsInByb3BlcnRpZXMiLCJzaGFwZSIsImNvb3JkaW5hdGVzIiwiZWRpdEFjdGlvbiIsImdldEFkZEZlYXR1cmVPckJvb2xlYW5Qb2x5Z29uQWN0aW9uIiwicmVzZXRDbGlja1NlcXVlbmNlIiwib25FZGl0IiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJndWlkZXMiLCJmZWF0dXJlcyIsImNvcm5lcjEiLCJjb3JuZXIyIiwibWFwQ29vcmRzIiwicG9seWdvbiIsImdldFR3b0NsaWNrUG9seWdvbiIsInB1c2giLCJndWlkZVR5cGUiLCJjb29yZDEiLCJjb29yZDIiLCJvblVwZGF0ZUN1cnNvciIsImxhc3RDb29yZHMiLCJHZW9Kc29uRWRpdE1vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxtQjs7Ozs7Ozs7Ozs7OztnQ0FDQ0MsSyxFQUFtQkMsSyxFQUFxQztBQUNsRSxVQUFJQSxLQUFLLENBQUNDLFVBQU4sSUFBb0JELEtBQUssQ0FBQ0MsVUFBTixDQUFpQkMsVUFBekMsRUFBcUQ7QUFDbkQ7QUFDQTtBQUNEOztBQUVELFdBQUtDLGdCQUFMLENBQXNCSixLQUF0QjtBQUVBLFdBQUtLLHFCQUFMLENBQTJCSixLQUEzQjtBQUNEOzs7d0NBRW1CRCxLLEVBQTJCQyxLLEVBQTJDO0FBQ3hGLFVBQUksQ0FBQ0EsS0FBSyxDQUFDQyxVQUFQLElBQXFCLENBQUNELEtBQUssQ0FBQ0MsVUFBTixDQUFpQkMsVUFBM0MsRUFBdUQ7QUFDckQ7QUFDQTtBQUNEOztBQUVELFdBQUtDLGdCQUFMLENBQXNCSixLQUF0QjtBQUNBQSxNQUFBQSxLQUFLLENBQUNNLFNBQU47QUFDRDs7O3VDQUVrQk4sSyxFQUEwQkMsSyxFQUEyQztBQUN0RixVQUFJLENBQUNBLEtBQUssQ0FBQ0MsVUFBUCxJQUFxQixDQUFDRCxLQUFLLENBQUNDLFVBQU4sQ0FBaUJDLFVBQTNDLEVBQXVEO0FBQ3JEO0FBQ0E7QUFDRDs7QUFDRCxXQUFLQyxnQkFBTCxDQUFzQkosS0FBdEI7QUFFQSxXQUFLSyxxQkFBTCxDQUEyQkosS0FBM0I7QUFDRDs7OzBDQUVxQkEsSyxFQUFxQztBQUN6RCxVQUFNTSxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7QUFDQSxVQUFNQyxnQkFBZ0IsR0FBRyxLQUFLQyxpQkFBTCxDQUF1QlQsS0FBdkIsQ0FBekI7O0FBRUEsVUFDRU0sYUFBYSxDQUFDSSxNQUFkLEdBQXVCLENBQXZCLElBQ0FGLGdCQURBLElBRUFBLGdCQUFnQixDQUFDRyxRQUFqQixDQUEwQkMsSUFBMUIsS0FBbUMsU0FIckMsRUFJRTtBQUNBLFlBQU1DLE9BQTJCLEdBQUc7QUFDbENELFVBQUFBLElBQUksRUFBRSxTQUQ0QjtBQUVsQ0UsVUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLFlBQUFBLEtBQUssRUFBRVAsZ0JBQWdCLENBQUNNLFVBQWpCLENBQTRCQztBQUR6QixXQUZzQjtBQUtsQ0osVUFBQUEsUUFBUSxFQUFFO0FBQ1JDLFlBQUFBLElBQUksRUFBRSxTQURFO0FBRVJJLFlBQUFBLFdBQVcsRUFBRVIsZ0JBQWdCLENBQUNHLFFBQWpCLENBQTBCSztBQUYvQjtBQUx3QixTQUFwQztBQVVBLFlBQU1DLFVBQVUsR0FBRyxLQUFLQyxtQ0FBTCxDQUF5Q0wsT0FBekMsRUFBa0RiLEtBQWxELENBQW5CO0FBRUEsYUFBS21CLGtCQUFMOztBQUVBLFlBQUlGLFVBQUosRUFBZ0I7QUFDZGpCLFVBQUFBLEtBQUssQ0FBQ29CLE1BQU4sQ0FBYUgsVUFBYjtBQUNEO0FBQ0Y7QUFDRjs7OzhCQUVTakIsSyxFQUE2RDtBQUFBLFVBQzdEcUIsb0JBRDZELEdBQ3hCckIsS0FEd0IsQ0FDN0RxQixvQkFENkQ7QUFBQSxVQUN2Q3BCLFVBRHVDLEdBQ3hCRCxLQUR3QixDQUN2Q0MsVUFEdUM7QUFFckUsVUFBTUssYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCO0FBRUEsVUFBTWUsTUFBOEIsR0FBRztBQUNyQ1YsUUFBQUEsSUFBSSxFQUFFLG1CQUQrQjtBQUVyQ1csUUFBQUEsUUFBUSxFQUFFO0FBRjJCLE9BQXZDOztBQUtBLFVBQUlqQixhQUFhLENBQUNJLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUI7QUFDQSxlQUFPWSxNQUFQO0FBQ0Q7O0FBRUQsVUFBTUUsT0FBTyxHQUFHbEIsYUFBYSxDQUFDLENBQUQsQ0FBN0I7QUFDQSxVQUFNbUIsT0FBTyxHQUFHSixvQkFBb0IsQ0FBQ0ssU0FBckM7QUFFQSxVQUFNQyxPQUFPLEdBQUcsS0FBS0Msa0JBQUwsQ0FBd0JKLE9BQXhCLEVBQWlDQyxPQUFqQyxFQUEwQ3hCLFVBQTFDLENBQWhCOztBQUNBLFVBQUkwQixPQUFKLEVBQWE7QUFDWEwsUUFBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCTSxJQUFoQixDQUFxQjtBQUNuQmpCLFVBQUFBLElBQUksRUFBRSxTQURhO0FBRW5CRSxVQUFBQSxVQUFVLEVBQUU7QUFDVkMsWUFBQUEsS0FBSyxFQUFFWSxPQUFPLENBQUNiLFVBQVIsSUFBc0JhLE9BQU8sQ0FBQ2IsVUFBUixDQUFtQkMsS0FEdEM7QUFFVmUsWUFBQUEsU0FBUyxFQUFFO0FBRkQsV0FGTztBQU1uQm5CLFVBQUFBLFFBQVEsRUFBRWdCLE9BQU8sQ0FBQ2hCO0FBTkMsU0FBckI7QUFRRDs7QUFFRCxhQUFPVyxNQUFQO0FBQ0Q7Ozt1Q0FHQ1MsTSxFQUNBQyxNLEVBQ0EvQixVLEVBQ3VDO0FBQ3ZDLGFBQU8sSUFBUDtBQUNEOzs7c0NBRWlCRixLLEVBQXlCQyxLLEVBQXFDO0FBQzlFQSxNQUFBQSxLQUFLLENBQUNpQyxjQUFOLENBQXFCLE1BQXJCOztBQUNBLGlHQUF3QmxDLEtBQXhCLEVBQStCQyxLQUEvQjtBQUNEOzs7MkNBRXNCQSxLLEVBQXVEO0FBQUEsVUFDcEVxQixvQkFEb0UsR0FDM0NyQixLQUQyQyxDQUNwRXFCLG9CQURvRTtBQUU1RSxVQUFNZixhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7QUFFQSxVQUFNMkIsVUFBVSxHQUFHYixvQkFBb0IsR0FBRyxDQUFDQSxvQkFBb0IsQ0FBQ0ssU0FBdEIsQ0FBSCxHQUFzQyxFQUE3RTtBQUVBLFVBQUlsQixnQkFBSjs7QUFDQSxVQUFJRixhQUFhLENBQUNJLE1BQWQsS0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUJGLFFBQUFBLGdCQUFnQixHQUFHLEtBQUtvQixrQkFBTCxDQUF3QnRCLGFBQWEsQ0FBQyxDQUFELENBQXJDLEVBQTBDNEIsVUFBVSxDQUFDLENBQUQsQ0FBcEQsRUFBeURsQyxLQUFLLENBQUNDLFVBQS9ELENBQW5CO0FBQ0Q7O0FBRUQsYUFBT08sZ0JBQVA7QUFDRDs7OztFQXRIc0MyQixnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENsaWNrRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIE1vZGVQcm9wcyxcbiAgR3VpZGVGZWF0dXJlQ29sbGVjdGlvbixcbiAgVGVudGF0aXZlRmVhdHVyZSxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgUG9seWdvbiwgRmVhdHVyZUNvbGxlY3Rpb24sIEZlYXR1cmVPZiwgUG9zaXRpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7IEdlb0pzb25FZGl0TW9kZSB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUnO1xuXG5leHBvcnQgY2xhc3MgVHdvQ2xpY2tQb2x5Z29uTW9kZSBleHRlbmRzIEdlb0pzb25FZGl0TW9kZSB7XG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGlmIChwcm9wcy5tb2RlQ29uZmlnICYmIHByb3BzLm1vZGVDb25maWcuZHJhZ1RvRHJhdykge1xuICAgICAgLy8gaGFuZGxlZCBpbiBkcmFnIGhhbmRsZXJzXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hZGRDbGlja1NlcXVlbmNlKGV2ZW50KTtcblxuICAgIHRoaXMuY2hlY2tBbmRGaW5pc2hQb2x5Z29uKHByb3BzKTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICBpZiAoIXByb3BzLm1vZGVDb25maWcgfHwgIXByb3BzLm1vZGVDb25maWcuZHJhZ1RvRHJhdykge1xuICAgICAgLy8gaGFuZGxlZCBpbiBjbGljayBoYW5kbGVyc1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYWRkQ2xpY2tTZXF1ZW5jZShldmVudCk7XG4gICAgZXZlbnQuY2FuY2VsUGFuKCk7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge1xuICAgIGlmICghcHJvcHMubW9kZUNvbmZpZyB8fCAhcHJvcHMubW9kZUNvbmZpZy5kcmFnVG9EcmF3KSB7XG4gICAgICAvLyBoYW5kbGVkIGluIGNsaWNrIGhhbmRsZXJzXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuYWRkQ2xpY2tTZXF1ZW5jZShldmVudCk7XG5cbiAgICB0aGlzLmNoZWNrQW5kRmluaXNoUG9seWdvbihwcm9wcyk7XG4gIH1cblxuICBjaGVja0FuZEZpbmlzaFBvbHlnb24ocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgY29uc3QgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VGVudGF0aXZlR3VpZGUocHJvcHMpO1xuXG4gICAgaWYgKFxuICAgICAgY2xpY2tTZXF1ZW5jZS5sZW5ndGggPiAxICYmXG4gICAgICB0ZW50YXRpdmVGZWF0dXJlICYmXG4gICAgICB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJ1xuICAgICkge1xuICAgICAgY29uc3QgZmVhdHVyZTogRmVhdHVyZU9mPFBvbHlnb24+ID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBzaGFwZTogdGVudGF0aXZlRmVhdHVyZS5wcm9wZXJ0aWVzLnNoYXBlLFxuICAgICAgICB9LFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBjb25zdCBlZGl0QWN0aW9uID0gdGhpcy5nZXRBZGRGZWF0dXJlT3JCb29sZWFuUG9seWdvbkFjdGlvbihmZWF0dXJlLCBwcm9wcyk7XG5cbiAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICAgIGlmIChlZGl0QWN0aW9uKSB7XG4gICAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRHdWlkZXMocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICBjb25zdCB7IGxhc3RQb2ludGVyTW92ZUV2ZW50LCBtb2RlQ29uZmlnIH0gPSBwcm9wcztcbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBjb25zdCBndWlkZXM6IEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24gPSB7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IFtdLFxuICAgIH07XG5cbiAgICBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG8geWV0XG4gICAgICByZXR1cm4gZ3VpZGVzO1xuICAgIH1cblxuICAgIGNvbnN0IGNvcm5lcjEgPSBjbGlja1NlcXVlbmNlWzBdO1xuICAgIGNvbnN0IGNvcm5lcjIgPSBsYXN0UG9pbnRlck1vdmVFdmVudC5tYXBDb29yZHM7XG5cbiAgICBjb25zdCBwb2x5Z29uID0gdGhpcy5nZXRUd29DbGlja1BvbHlnb24oY29ybmVyMSwgY29ybmVyMiwgbW9kZUNvbmZpZyk7XG4gICAgaWYgKHBvbHlnb24pIHtcbiAgICAgIGd1aWRlcy5mZWF0dXJlcy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgc2hhcGU6IHBvbHlnb24ucHJvcGVydGllcyAmJiBwb2x5Z29uLnByb3BlcnRpZXMuc2hhcGUsXG4gICAgICAgICAgZ3VpZGVUeXBlOiAndGVudGF0aXZlJyxcbiAgICAgICAgfSxcbiAgICAgICAgZ2VvbWV0cnk6IHBvbHlnb24uZ2VvbWV0cnksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ3VpZGVzO1xuICB9XG5cbiAgZ2V0VHdvQ2xpY2tQb2x5Z29uKFxuICAgIGNvb3JkMTogUG9zaXRpb24sXG4gICAgY29vcmQyOiBQb3NpdGlvbixcbiAgICBtb2RlQ29uZmlnOiBhbnlcbiAgKTogRmVhdHVyZU9mPFBvbHlnb24+IHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcignY2VsbCcpO1xuICAgIHN1cGVyLmhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50LCBwcm9wcyk7XG4gIH1cblxuICBjcmVhdGVUZW50YXRpdmVGZWF0dXJlKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogVGVudGF0aXZlRmVhdHVyZSB7XG4gICAgY29uc3QgeyBsYXN0UG9pbnRlck1vdmVFdmVudCB9ID0gcHJvcHM7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgY29uc3QgbGFzdENvb3JkcyA9IGxhc3RQb2ludGVyTW92ZUV2ZW50ID8gW2xhc3RQb2ludGVyTW92ZUV2ZW50Lm1hcENvb3Jkc10gOiBbXTtcblxuICAgIGxldCB0ZW50YXRpdmVGZWF0dXJlO1xuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGVudGF0aXZlRmVhdHVyZSA9IHRoaXMuZ2V0VHdvQ2xpY2tQb2x5Z29uKGNsaWNrU2VxdWVuY2VbMF0sIGxhc3RDb29yZHNbMF0sIHByb3BzLm1vZGVDb25maWcpO1xuICAgIH1cblxuICAgIHJldHVybiB0ZW50YXRpdmVGZWF0dXJlO1xuICB9XG59XG4iXX0=