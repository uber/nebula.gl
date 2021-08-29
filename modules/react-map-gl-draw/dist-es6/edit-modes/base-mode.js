"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _constants = require("../constants");

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BaseMode = /*#__PURE__*/function () {
  function BaseMode() {
    _classCallCheck(this, BaseMode);

    _defineProperty(this, "_tentativeFeature", void 0);

    _defineProperty(this, "_editHandles", void 0);

    this._tentativeFeature = null;
    this._editHandles = null;
  }

  _createClass(BaseMode, [{
    key: "handlePan",
    value: function handlePan(event, props) {}
  }, {
    key: "handleClick",
    value: function handleClick(event, props) {}
  }, {
    key: "handleDblClick",
    value: function handleDblClick(event, props) {}
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {}
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {}
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {}
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(event, props) {}
  }, {
    key: "getGuides",
    value: function getGuides(props) {
      return null;
    }
  }, {
    key: "getTooltips",
    value: function getTooltips(props) {
      return [];
    }
  }, {
    key: "handleDragging",
    value: function handleDragging(event, props) {}
  }, {
    key: "getTentativeFeature",
    value: function getTentativeFeature() {
      return this._tentativeFeature;
    }
  }, {
    key: "getEditHandles",
    value: function getEditHandles() {
      return this._editHandles;
    }
  }, {
    key: "setTentativeFeature",
    value: function setTentativeFeature(feature) {
      this._tentativeFeature = feature;
    }
  }, {
    key: "getEditHandlesFromFeature",
    value: function getEditHandlesFromFeature(feature, featureIndex) {
      var coordinates = (0, _utils.getFeatureCoordinates)(feature);

      if (!coordinates) {
        return null;
      } // @ts-ignore


      return coordinates.map(function (coord, i) {
        return {
          type: 'Feature',
          properties: {
            // TODO deprecate renderType
            renderType: feature.properties.renderType,
            guideType: _constants.GUIDE_TYPE.EDIT_HANDLE,
            editHandleType: 'existing',
            featureIndex: featureIndex,
            positionIndexes: [i]
          },
          geometry: {
            type: _constants.GEOJSON_TYPE.POINT,
            coordinates: coord
          }
        };
      });
    }
  }, {
    key: "getSelectedFeature",
    value: function getSelectedFeature(props, featureIndex) {
      var data = props.data,
          selectedIndexes = props.selectedIndexes; // @ts-ignore

      var features = data && data.features;
      var selectedIndex = (0, _utils.isNumeric)(featureIndex) ? Number(featureIndex) : selectedIndexes && selectedIndexes[0];
      return features && features[selectedIndex];
    }
  }]);

  return BaseMode;
}();

exports["default"] = BaseMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lZGl0LW1vZGVzL2Jhc2UtbW9kZS50cyJdLCJuYW1lcyI6WyJCYXNlTW9kZSIsIl90ZW50YXRpdmVGZWF0dXJlIiwiX2VkaXRIYW5kbGVzIiwiZXZlbnQiLCJwcm9wcyIsImZlYXR1cmUiLCJmZWF0dXJlSW5kZXgiLCJjb29yZGluYXRlcyIsIm1hcCIsImNvb3JkIiwiaSIsInR5cGUiLCJwcm9wZXJ0aWVzIiwicmVuZGVyVHlwZSIsImd1aWRlVHlwZSIsIkdVSURFX1RZUEUiLCJFRElUX0hBTkRMRSIsImVkaXRIYW5kbGVUeXBlIiwicG9zaXRpb25JbmRleGVzIiwiZ2VvbWV0cnkiLCJHRU9KU09OX1RZUEUiLCJQT0lOVCIsImRhdGEiLCJzZWxlY3RlZEluZGV4ZXMiLCJmZWF0dXJlcyIsInNlbGVjdGVkSW5kZXgiLCJOdW1iZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFjQTs7QUFDQTs7Ozs7Ozs7OztJQUVxQkEsUTtBQUluQixzQkFBYztBQUFBOztBQUFBOztBQUFBOztBQUNaLFNBQUtDLGlCQUFMLEdBQXlCLElBQXpCO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQixJQUFwQjtBQUNEOzs7OzhCQUVTQyxLLEVBQW1CQyxLLEVBQXFDLENBQUU7OztnQ0FFeERELEssRUFBbUJDLEssRUFBcUMsQ0FBRTs7O21DQUV2REQsSyxFQUFtQkMsSyxFQUFxQyxDQUFFOzs7c0NBRXZERCxLLEVBQXlCQyxLLEVBQXFDLENBQUU7Ozt3Q0FFOURELEssRUFBMkJDLEssRUFBcUMsQ0FBRTs7O3VDQUVuRUQsSyxFQUEwQkMsSyxFQUFxQyxDQUFFOzs7Z0NBRXhFRCxLLEVBQXNCQyxLLEVBQTJDLENBQUU7Ozs4QkFFckVBLEssRUFBZ0Y7QUFDeEYsYUFBTyxJQUFQO0FBQ0Q7OztnQ0FDV0EsSyxFQUFnRDtBQUMxRCxhQUFPLEVBQVA7QUFDRDs7O21DQUNjRCxLLEVBQXNCQyxLLEVBQTJDLENBQUU7OzswQ0FFNUQ7QUFDcEIsYUFBTyxLQUFLSCxpQkFBWjtBQUNEOzs7cUNBRWdCO0FBQ2YsYUFBTyxLQUFLQyxZQUFaO0FBQ0Q7Ozt3Q0FFbUJHLE8sRUFBa0I7QUFDcEMsV0FBS0osaUJBQUwsR0FBeUJJLE9BQXpCO0FBQ0Q7Ozs4Q0FFeUJBLE8sRUFBa0JDLFksRUFBeUM7QUFDbkYsVUFBTUMsV0FBVyxHQUFHLGtDQUFzQkYsT0FBdEIsQ0FBcEI7O0FBQ0EsVUFBSSxDQUFDRSxXQUFMLEVBQWtCO0FBQ2hCLGVBQU8sSUFBUDtBQUNELE9BSmtGLENBS25GOzs7QUFDQSxhQUFPQSxXQUFXLENBQUNDLEdBQVosQ0FBZ0IsVUFBQ0MsS0FBRCxFQUFRQyxDQUFSLEVBQWM7QUFDbkMsZUFBTztBQUNMQyxVQUFBQSxJQUFJLEVBQUUsU0FERDtBQUVMQyxVQUFBQSxVQUFVLEVBQUU7QUFDVjtBQUNBQyxZQUFBQSxVQUFVLEVBQUVSLE9BQU8sQ0FBQ08sVUFBUixDQUFtQkMsVUFGckI7QUFHVkMsWUFBQUEsU0FBUyxFQUFFQyxzQkFBV0MsV0FIWjtBQUlWQyxZQUFBQSxjQUFjLEVBQUUsVUFKTjtBQUtWWCxZQUFBQSxZQUFZLEVBQVpBLFlBTFU7QUFNVlksWUFBQUEsZUFBZSxFQUFFLENBQUNSLENBQUQ7QUFOUCxXQUZQO0FBVUxTLFVBQUFBLFFBQVEsRUFBRTtBQUNSUixZQUFBQSxJQUFJLEVBQUVTLHdCQUFhQyxLQURYO0FBRVJkLFlBQUFBLFdBQVcsRUFBRUU7QUFGTDtBQVZMLFNBQVA7QUFlRCxPQWhCTSxDQUFQO0FBaUJEOzs7dUNBRWtCTCxLLEVBQXFDRSxZLEVBQXlDO0FBQUEsVUFDdkZnQixJQUR1RixHQUM3RGxCLEtBRDZELENBQ3ZGa0IsSUFEdUY7QUFBQSxVQUNqRkMsZUFEaUYsR0FDN0RuQixLQUQ2RCxDQUNqRm1CLGVBRGlGLEVBRS9GOztBQUNBLFVBQU1DLFFBQVEsR0FBR0YsSUFBSSxJQUFJQSxJQUFJLENBQUNFLFFBQTlCO0FBRUEsVUFBTUMsYUFBYSxHQUFHLHNCQUFVbkIsWUFBVixJQUNsQm9CLE1BQU0sQ0FBQ3BCLFlBQUQsQ0FEWSxHQUVsQmlCLGVBQWUsSUFBSUEsZUFBZSxDQUFDLENBQUQsQ0FGdEM7QUFJQSxhQUFPQyxRQUFRLElBQUlBLFFBQVEsQ0FBQ0MsYUFBRCxDQUEzQjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRWRpdE1vZGUsXG4gIEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24sXG4gIEZlYXR1cmUsXG4gIENsaWNrRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIEZlYXR1cmVDb2xsZWN0aW9uLFxuICBUb29sdGlwLFxuICBEcmFnZ2luZ0V2ZW50LFxufSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHsgTW9kZVByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQgeyBHRU9KU09OX1RZUEUsIEdVSURFX1RZUEUgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0RmVhdHVyZUNvb3JkaW5hdGVzLCBpc051bWVyaWMgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZU1vZGUgaW1wbGVtZW50cyBFZGl0TW9kZTxGZWF0dXJlQ29sbGVjdGlvbiwgR3VpZGVGZWF0dXJlQ29sbGVjdGlvbj4ge1xuICBfdGVudGF0aXZlRmVhdHVyZTogRmVhdHVyZSB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIF9lZGl0SGFuZGxlczogRmVhdHVyZVtdIHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl90ZW50YXRpdmVGZWF0dXJlID0gbnVsbDtcbiAgICB0aGlzLl9lZGl0SGFuZGxlcyA9IG51bGw7XG4gIH1cblxuICBoYW5kbGVQYW4oZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7fVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge31cblxuICBoYW5kbGVEYmxDbGljayhldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHt9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7fVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHt9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHt9XG5cbiAgaGFuZGxlS2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7fVxuXG4gIGdldEd1aWRlcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBnZXRUb29sdGlwcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IFRvb2x0aXBbXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGhhbmRsZURyYWdnaW5nKGV2ZW50OiBEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge31cblxuICBnZXRUZW50YXRpdmVGZWF0dXJlKCkge1xuICAgIHJldHVybiB0aGlzLl90ZW50YXRpdmVGZWF0dXJlO1xuICB9XG5cbiAgZ2V0RWRpdEhhbmRsZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VkaXRIYW5kbGVzO1xuICB9XG5cbiAgc2V0VGVudGF0aXZlRmVhdHVyZShmZWF0dXJlOiBGZWF0dXJlKSB7XG4gICAgdGhpcy5fdGVudGF0aXZlRmVhdHVyZSA9IGZlYXR1cmU7XG4gIH1cblxuICBnZXRFZGl0SGFuZGxlc0Zyb21GZWF0dXJlKGZlYXR1cmU6IEZlYXR1cmUsIGZlYXR1cmVJbmRleDogbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCkge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0RmVhdHVyZUNvb3JkaW5hdGVzKGZlYXR1cmUpO1xuICAgIGlmICghY29vcmRpbmF0ZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIGNvb3JkaW5hdGVzLm1hcCgoY29vcmQsIGkpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIC8vIFRPRE8gZGVwcmVjYXRlIHJlbmRlclR5cGVcbiAgICAgICAgICByZW5kZXJUeXBlOiBmZWF0dXJlLnByb3BlcnRpZXMucmVuZGVyVHlwZSxcbiAgICAgICAgICBndWlkZVR5cGU6IEdVSURFX1RZUEUuRURJVF9IQU5ETEUsXG4gICAgICAgICAgZWRpdEhhbmRsZVR5cGU6ICdleGlzdGluZycsXG4gICAgICAgICAgZmVhdHVyZUluZGV4LFxuICAgICAgICAgIHBvc2l0aW9uSW5kZXhlczogW2ldLFxuICAgICAgICB9LFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6IEdFT0pTT05fVFlQRS5QT0lOVCxcbiAgICAgICAgICBjb29yZGluYXRlczogY29vcmQsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+LCBmZWF0dXJlSW5kZXg6IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQpIHtcbiAgICBjb25zdCB7IGRhdGEsIHNlbGVjdGVkSW5kZXhlcyB9ID0gcHJvcHM7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGZlYXR1cmVzID0gZGF0YSAmJiBkYXRhLmZlYXR1cmVzO1xuXG4gICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IGlzTnVtZXJpYyhmZWF0dXJlSW5kZXgpXG4gICAgICA/IE51bWJlcihmZWF0dXJlSW5kZXgpXG4gICAgICA6IHNlbGVjdGVkSW5kZXhlcyAmJiBzZWxlY3RlZEluZGV4ZXNbMF07XG5cbiAgICByZXR1cm4gZmVhdHVyZXMgJiYgZmVhdHVyZXNbc2VsZWN0ZWRJbmRleF07XG4gIH1cbn1cbiJdfQ==