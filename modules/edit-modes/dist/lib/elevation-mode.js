"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElevationMode = void 0;

var _utils = require("../utils");

var _modifyMode = require("./modify-mode");

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

function defaultCalculateElevationChange(_ref) {
  var pointerDownScreenCoords = _ref.pointerDownScreenCoords,
      screenCoords = _ref.screenCoords;
  return 10 * (pointerDownScreenCoords[1] - screenCoords[1]);
}

var ElevationMode = /*#__PURE__*/function (_ModifyMode) {
  _inherits(ElevationMode, _ModifyMode);

  var _super = _createSuper(ElevationMode);

  function ElevationMode() {
    _classCallCheck(this, ElevationMode);

    return _super.apply(this, arguments);
  }

  _createClass(ElevationMode, [{
    key: "makeElevatedEvent",
    value: function makeElevatedEvent(event, position, props) {
      var _ref2 = props.modeConfig || {},
          _ref2$minElevation = _ref2.minElevation,
          minElevation = _ref2$minElevation === void 0 ? 0 : _ref2$minElevation,
          _ref2$maxElevation = _ref2.maxElevation,
          maxElevation = _ref2$maxElevation === void 0 ? 20000 : _ref2$maxElevation,
          _ref2$calculateElevat = _ref2.calculateElevationChange,
          calculateElevationChange = _ref2$calculateElevat === void 0 ? defaultCalculateElevationChange : _ref2$calculateElevat;

      if (!event.pointerDownScreenCoords) {
        return event;
      } // $FlowFixMe - really, I know it has something at index 2


      var elevation = position.length === 3 ? position[2] : 0; // calculateElevationChange is configurable because (at this time) modes are not aware of the viewport

      elevation += calculateElevationChange({
        pointerDownScreenCoords: event.pointerDownScreenCoords,
        screenCoords: event.screenCoords
      });
      elevation = Math.min(elevation, maxElevation);
      elevation = Math.max(elevation, minElevation);
      return Object.assign({}, event, {
        mapCoords: [position[0], position[1], elevation]
      });
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      var editHandle = (0, _utils.getPickedEditHandle)(event.pointerDownPicks);
      var position = editHandle ? editHandle.geometry.coordinates : event.mapCoords; // @ts-ignore

      _get(_getPrototypeOf(ElevationMode.prototype), "handlePointerMove", this).call(this, this.makeElevatedEvent(event, position, props), props);
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      var editHandle = (0, _utils.getPickedEditHandle)(event.picks);
      var position = editHandle ? editHandle.geometry.coordinates : event.mapCoords; // @ts-ignore

      _get(_getPrototypeOf(ElevationMode.prototype), "handleStopDragging", this).call(this, this.makeElevatedEvent(event, position, props), props);
    }
  }, {
    key: "getCursor",
    value: function getCursor(event) {
      var cursor = _get(_getPrototypeOf(ElevationMode.prototype), "getCursor", this).call(this, event);

      if (cursor === 'cell') {
        cursor = 'ns-resize';
      }

      return cursor;
    }
  }], [{
    key: "calculateElevationChangeWithViewport",
    value: function calculateElevationChangeWithViewport(viewport, _ref3) {
      var pointerDownScreenCoords = _ref3.pointerDownScreenCoords,
          screenCoords = _ref3.screenCoords;
      // Source: https://gis.stackexchange.com/a/127949/111804
      var metersPerPixel = 156543.03392 * Math.cos(viewport.latitude * Math.PI / 180) / Math.pow(2, viewport.zoom);
      return metersPerPixel * (pointerDownScreenCoords[1] - screenCoords[1]) / 2;
    }
  }]);

  return ElevationMode;
}(_modifyMode.ModifyMode);

exports.ElevationMode = ElevationMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZWxldmF0aW9uLW1vZGUudHMiXSwibmFtZXMiOlsiZGVmYXVsdENhbGN1bGF0ZUVsZXZhdGlvbkNoYW5nZSIsInBvaW50ZXJEb3duU2NyZWVuQ29vcmRzIiwic2NyZWVuQ29vcmRzIiwiRWxldmF0aW9uTW9kZSIsImV2ZW50IiwicG9zaXRpb24iLCJwcm9wcyIsIm1vZGVDb25maWciLCJtaW5FbGV2YXRpb24iLCJtYXhFbGV2YXRpb24iLCJjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UiLCJlbGV2YXRpb24iLCJsZW5ndGgiLCJNYXRoIiwibWluIiwibWF4IiwiT2JqZWN0IiwiYXNzaWduIiwibWFwQ29vcmRzIiwiZWRpdEhhbmRsZSIsInBvaW50ZXJEb3duUGlja3MiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwibWFrZUVsZXZhdGVkRXZlbnQiLCJwaWNrcyIsImN1cnNvciIsInZpZXdwb3J0IiwibWV0ZXJzUGVyUGl4ZWwiLCJjb3MiLCJsYXRpdHVkZSIsIlBJIiwicG93Iiwiem9vbSIsIk1vZGlmeU1vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLFNBQVNBLCtCQUFULE9BTUc7QUFBQSxNQUxEQyx1QkFLQyxRQUxEQSx1QkFLQztBQUFBLE1BSkRDLFlBSUMsUUFKREEsWUFJQztBQUNELFNBQU8sTUFBTUQsdUJBQXVCLENBQUMsQ0FBRCxDQUF2QixHQUE2QkMsWUFBWSxDQUFDLENBQUQsQ0FBL0MsQ0FBUDtBQUNEOztJQUVZQyxhOzs7Ozs7Ozs7Ozs7O3NDQUVUQyxLLEVBQ0FDLFEsRUFDQUMsSyxFQUNxQjtBQUFBLGtCQUtqQkEsS0FBSyxDQUFDQyxVQUFOLElBQW9CLEVBTEg7QUFBQSxxQ0FFbkJDLFlBRm1CO0FBQUEsVUFFbkJBLFlBRm1CLG1DQUVKLENBRkk7QUFBQSxxQ0FHbkJDLFlBSG1CO0FBQUEsVUFHbkJBLFlBSG1CLG1DQUdKLEtBSEk7QUFBQSx3Q0FJbkJDLHdCQUptQjtBQUFBLFVBSW5CQSx3QkFKbUIsc0NBSVFWLCtCQUpSOztBQU9yQixVQUFJLENBQUNJLEtBQUssQ0FBQ0gsdUJBQVgsRUFBb0M7QUFDbEMsZUFBT0csS0FBUDtBQUNELE9BVG9CLENBV3JCOzs7QUFDQSxVQUFJTyxTQUFTLEdBQUdOLFFBQVEsQ0FBQ08sTUFBVCxLQUFvQixDQUFwQixHQUF3QlAsUUFBUSxDQUFDLENBQUQsQ0FBaEMsR0FBc0MsQ0FBdEQsQ0FacUIsQ0FjckI7O0FBQ0FNLE1BQUFBLFNBQVMsSUFBSUQsd0JBQXdCLENBQUM7QUFDcENULFFBQUFBLHVCQUF1QixFQUFFRyxLQUFLLENBQUNILHVCQURLO0FBRXBDQyxRQUFBQSxZQUFZLEVBQUVFLEtBQUssQ0FBQ0Y7QUFGZ0IsT0FBRCxDQUFyQztBQUlBUyxNQUFBQSxTQUFTLEdBQUdFLElBQUksQ0FBQ0MsR0FBTCxDQUFTSCxTQUFULEVBQW9CRixZQUFwQixDQUFaO0FBQ0FFLE1BQUFBLFNBQVMsR0FBR0UsSUFBSSxDQUFDRSxHQUFMLENBQVNKLFNBQVQsRUFBb0JILFlBQXBCLENBQVo7QUFFQSxhQUFPUSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCYixLQUFsQixFQUF5QjtBQUM5QmMsUUFBQUEsU0FBUyxFQUFFLENBQUNiLFFBQVEsQ0FBQyxDQUFELENBQVQsRUFBY0EsUUFBUSxDQUFDLENBQUQsQ0FBdEIsRUFBMkJNLFNBQTNCO0FBRG1CLE9BQXpCLENBQVA7QUFHRDs7O3NDQUVpQlAsSyxFQUF5QkUsSyxFQUFxQztBQUM5RSxVQUFNYSxVQUFVLEdBQUcsZ0NBQW9CZixLQUFLLENBQUNnQixnQkFBMUIsQ0FBbkI7QUFDQSxVQUFNZixRQUFRLEdBQUdjLFVBQVUsR0FBR0EsVUFBVSxDQUFDRSxRQUFYLENBQW9CQyxXQUF2QixHQUFxQ2xCLEtBQUssQ0FBQ2MsU0FBdEUsQ0FGOEUsQ0FHOUU7O0FBQ0EsMkZBQXdCLEtBQUtLLGlCQUFMLENBQXVCbkIsS0FBdkIsRUFBOEJDLFFBQTlCLEVBQXdDQyxLQUF4QyxDQUF4QixFQUF3RUEsS0FBeEU7QUFDRDs7O3VDQUVrQkYsSyxFQUEwQkUsSyxFQUFxQztBQUNoRixVQUFNYSxVQUFVLEdBQUcsZ0NBQW9CZixLQUFLLENBQUNvQixLQUExQixDQUFuQjtBQUNBLFVBQU1uQixRQUFRLEdBQUdjLFVBQVUsR0FBR0EsVUFBVSxDQUFDRSxRQUFYLENBQW9CQyxXQUF2QixHQUFxQ2xCLEtBQUssQ0FBQ2MsU0FBdEUsQ0FGZ0YsQ0FHaEY7O0FBQ0EsNEZBQXlCLEtBQUtLLGlCQUFMLENBQXVCbkIsS0FBdkIsRUFBOEJDLFFBQTlCLEVBQXdDQyxLQUF4QyxDQUF6QixFQUF5RUEsS0FBekU7QUFDRDs7OzhCQUVTRixLLEVBQW9EO0FBQzVELFVBQUlxQixNQUFNLGdGQUFtQnJCLEtBQW5CLENBQVY7O0FBQ0EsVUFBSXFCLE1BQU0sS0FBSyxNQUFmLEVBQXVCO0FBQ3JCQSxRQUFBQSxNQUFNLEdBQUcsV0FBVDtBQUNEOztBQUNELGFBQU9BLE1BQVA7QUFDRDs7O3lEQUdDQyxRLFNBUVE7QUFBQSxVQU5OekIsdUJBTU0sU0FOTkEsdUJBTU07QUFBQSxVQUxOQyxZQUtNLFNBTE5BLFlBS007QUFDUjtBQUNBLFVBQU15QixjQUFjLEdBQ2pCLGVBQWVkLElBQUksQ0FBQ2UsR0FBTCxDQUFVRixRQUFRLENBQUNHLFFBQVQsR0FBb0JoQixJQUFJLENBQUNpQixFQUExQixHQUFnQyxHQUF6QyxDQUFoQixHQUFpRWpCLElBQUksQ0FBQ2tCLEdBQUwsQ0FBUyxDQUFULEVBQVlMLFFBQVEsQ0FBQ00sSUFBckIsQ0FEbkU7QUFHQSxhQUFRTCxjQUFjLElBQUkxQix1QkFBdUIsQ0FBQyxDQUFELENBQXZCLEdBQTZCQyxZQUFZLENBQUMsQ0FBRCxDQUE3QyxDQUFmLEdBQW9FLENBQTNFO0FBQ0Q7Ozs7RUFyRWdDK0Isc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2RlUHJvcHMsIFBvaW50ZXJNb3ZlRXZlbnQsIFN0b3BEcmFnZ2luZ0V2ZW50IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgUG9zaXRpb24sIEZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcyc7XG5pbXBvcnQgeyBnZXRQaWNrZWRFZGl0SGFuZGxlIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgTW9kaWZ5TW9kZSB9IGZyb20gJy4vbW9kaWZ5LW1vZGUnO1xuXG5mdW5jdGlvbiBkZWZhdWx0Q2FsY3VsYXRlRWxldmF0aW9uQ2hhbmdlKHtcbiAgcG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gIHNjcmVlbkNvb3Jkcyxcbn06IHtcbiAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IFBvc2l0aW9uO1xuICBzY3JlZW5Db29yZHM6IFBvc2l0aW9uO1xufSkge1xuICByZXR1cm4gMTAgKiAocG9pbnRlckRvd25TY3JlZW5Db29yZHNbMV0gLSBzY3JlZW5Db29yZHNbMV0pO1xufVxuXG5leHBvcnQgY2xhc3MgRWxldmF0aW9uTW9kZSBleHRlbmRzIE1vZGlmeU1vZGUge1xuICBtYWtlRWxldmF0ZWRFdmVudChcbiAgICBldmVudDogUG9pbnRlck1vdmVFdmVudCB8IFN0b3BEcmFnZ2luZ0V2ZW50LFxuICAgIHBvc2l0aW9uOiBQb3NpdGlvbixcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IHtcbiAgICBjb25zdCB7XG4gICAgICBtaW5FbGV2YXRpb24gPSAwLFxuICAgICAgbWF4RWxldmF0aW9uID0gMjAwMDAsXG4gICAgICBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UgPSBkZWZhdWx0Q2FsY3VsYXRlRWxldmF0aW9uQ2hhbmdlLFxuICAgIH0gPSBwcm9wcy5tb2RlQ29uZmlnIHx8IHt9O1xuXG4gICAgaWYgKCFldmVudC5wb2ludGVyRG93blNjcmVlbkNvb3Jkcykge1xuICAgICAgcmV0dXJuIGV2ZW50O1xuICAgIH1cblxuICAgIC8vICRGbG93Rml4TWUgLSByZWFsbHksIEkga25vdyBpdCBoYXMgc29tZXRoaW5nIGF0IGluZGV4IDJcbiAgICBsZXQgZWxldmF0aW9uID0gcG9zaXRpb24ubGVuZ3RoID09PSAzID8gcG9zaXRpb25bMl0gOiAwO1xuXG4gICAgLy8gY2FsY3VsYXRlRWxldmF0aW9uQ2hhbmdlIGlzIGNvbmZpZ3VyYWJsZSBiZWNhdXNlIChhdCB0aGlzIHRpbWUpIG1vZGVzIGFyZSBub3QgYXdhcmUgb2YgdGhlIHZpZXdwb3J0XG4gICAgZWxldmF0aW9uICs9IGNhbGN1bGF0ZUVsZXZhdGlvbkNoYW5nZSh7XG4gICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogZXZlbnQucG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICBzY3JlZW5Db29yZHM6IGV2ZW50LnNjcmVlbkNvb3JkcyxcbiAgICB9KTtcbiAgICBlbGV2YXRpb24gPSBNYXRoLm1pbihlbGV2YXRpb24sIG1heEVsZXZhdGlvbik7XG4gICAgZWxldmF0aW9uID0gTWF0aC5tYXgoZWxldmF0aW9uLCBtaW5FbGV2YXRpb24pO1xuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGV2ZW50LCB7XG4gICAgICBtYXBDb29yZHM6IFtwb3NpdGlvblswXSwgcG9zaXRpb25bMV0sIGVsZXZhdGlvbl0sXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5wb2ludGVyRG93blBpY2tzKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGVkaXRIYW5kbGUgPyBlZGl0SGFuZGxlLmdlb21ldHJ5LmNvb3JkaW5hdGVzIDogZXZlbnQubWFwQ29vcmRzO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBzdXBlci5oYW5kbGVQb2ludGVyTW92ZSh0aGlzLm1ha2VFbGV2YXRlZEV2ZW50KGV2ZW50LCBwb3NpdGlvbiwgcHJvcHMpLCBwcm9wcyk7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBpY2tzKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGVkaXRIYW5kbGUgPyBlZGl0SGFuZGxlLmdlb21ldHJ5LmNvb3JkaW5hdGVzIDogZXZlbnQubWFwQ29vcmRzO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBzdXBlci5oYW5kbGVTdG9wRHJhZ2dpbmcodGhpcy5tYWtlRWxldmF0ZWRFdmVudChldmVudCwgcG9zaXRpb24sIHByb3BzKSwgcHJvcHMpO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50KTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgbGV0IGN1cnNvciA9IHN1cGVyLmdldEN1cnNvcihldmVudCk7XG4gICAgaWYgKGN1cnNvciA9PT0gJ2NlbGwnKSB7XG4gICAgICBjdXJzb3IgPSAnbnMtcmVzaXplJztcbiAgICB9XG4gICAgcmV0dXJuIGN1cnNvcjtcbiAgfVxuXG4gIHN0YXRpYyBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2VXaXRoVmlld3BvcnQoXG4gICAgdmlld3BvcnQ6IGFueSxcbiAgICB7XG4gICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkcyxcbiAgICAgIHNjcmVlbkNvb3JkcyxcbiAgICB9OiB7XG4gICAgICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogUG9zaXRpb247XG4gICAgICBzY3JlZW5Db29yZHM6IFBvc2l0aW9uO1xuICAgIH1cbiAgKTogbnVtYmVyIHtcbiAgICAvLyBTb3VyY2U6IGh0dHBzOi8vZ2lzLnN0YWNrZXhjaGFuZ2UuY29tL2EvMTI3OTQ5LzExMTgwNFxuICAgIGNvbnN0IG1ldGVyc1BlclBpeGVsID1cbiAgICAgICgxNTY1NDMuMDMzOTIgKiBNYXRoLmNvcygodmlld3BvcnQubGF0aXR1ZGUgKiBNYXRoLlBJKSAvIDE4MCkpIC8gTWF0aC5wb3coMiwgdmlld3BvcnQuem9vbSk7XG5cbiAgICByZXR1cm4gKG1ldGVyc1BlclBpeGVsICogKHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzWzFdIC0gc2NyZWVuQ29vcmRzWzFdKSkgLyAyO1xuICB9XG59XG4iXX0=