"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElevationHandler = void 0;

var _modeHandler = require("./mode-handler");

var _modifyHandler = require("./modify-handler");

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
} // TODO edit-modes: delete handlers once EditMode fully implemented


var ElevationHandler = /*#__PURE__*/function (_ModifyHandler) {
  _inherits(ElevationHandler, _ModifyHandler);

  var _super = _createSuper(ElevationHandler);

  function ElevationHandler() {
    _classCallCheck(this, ElevationHandler);

    return _super.apply(this, arguments);
  }

  _createClass(ElevationHandler, [{
    key: "makeElevatedEvent",
    value: function makeElevatedEvent(event, position) {
      if (!event.pointerDownScreenCoords) {
        return event;
      }

      var _ref2 = this._modeConfig || {},
          _ref2$minElevation = _ref2.minElevation,
          minElevation = _ref2$minElevation === void 0 ? 0 : _ref2$minElevation,
          _ref2$maxElevation = _ref2.maxElevation,
          maxElevation = _ref2$maxElevation === void 0 ? 20000 : _ref2$maxElevation,
          _ref2$calculateElevat = _ref2.calculateElevationChange,
          calculateElevationChange = _ref2$calculateElevat === void 0 ? defaultCalculateElevationChange : _ref2$calculateElevat; // $FlowFixMe - really, I know it has something at index 2


      var elevation = position.length === 3 ? position[2] : 0; // calculateElevationChange is configurable becase (at this time) modes are not aware of the viewport

      elevation += calculateElevationChange({
        pointerDownScreenCoords: event.pointerDownScreenCoords,
        screenCoords: event.screenCoords
      });
      elevation = Math.min(elevation, maxElevation);
      elevation = Math.max(elevation, minElevation);
      return Object.assign({}, event, {
        groundCoords: [position[0], position[1], elevation]
      });
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var editHandle = (0, _modeHandler.getPickedEditHandle)(event.pointerDownPicks);
      var position = editHandle ? editHandle.position : event.groundCoords; // @ts-ignore

      return _get(_getPrototypeOf(ElevationHandler.prototype), "handlePointerMove", this).call(this, this.makeElevatedEvent(event, position));
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      var editHandle = (0, _modeHandler.getPickedEditHandle)(event.picks);
      var position = editHandle ? editHandle.position : event.groundCoords; // @ts-ignore

      return _get(_getPrototypeOf(ElevationHandler.prototype), "handleStopDragging", this).call(this, this.makeElevatedEvent(event, position));
    }
  }, {
    key: "getCursor",
    value: function getCursor(params) {
      var cursor = _get(_getPrototypeOf(ElevationHandler.prototype), "getCursor", this).call(this, params);

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

  return ElevationHandler;
}(_modifyHandler.ModifyHandler);

exports.ElevationHandler = ElevationHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2VsZXZhdGlvbi1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbImRlZmF1bHRDYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UiLCJwb2ludGVyRG93blNjcmVlbkNvb3JkcyIsInNjcmVlbkNvb3JkcyIsIkVsZXZhdGlvbkhhbmRsZXIiLCJldmVudCIsInBvc2l0aW9uIiwiX21vZGVDb25maWciLCJtaW5FbGV2YXRpb24iLCJtYXhFbGV2YXRpb24iLCJjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UiLCJlbGV2YXRpb24iLCJsZW5ndGgiLCJNYXRoIiwibWluIiwibWF4IiwiT2JqZWN0IiwiYXNzaWduIiwiZ3JvdW5kQ29vcmRzIiwiZWRpdEhhbmRsZSIsInBvaW50ZXJEb3duUGlja3MiLCJtYWtlRWxldmF0ZWRFdmVudCIsInBpY2tzIiwicGFyYW1zIiwiY3Vyc29yIiwidmlld3BvcnQiLCJtZXRlcnNQZXJQaXhlbCIsImNvcyIsImxhdGl0dWRlIiwiUEkiLCJwb3ciLCJ6b29tIiwiTW9kaWZ5SGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsU0FBU0EsK0JBQVQsT0FNRztBQUFBLE1BTERDLHVCQUtDLFFBTERBLHVCQUtDO0FBQUEsTUFKREMsWUFJQyxRQUpEQSxZQUlDO0FBQ0QsU0FBTyxNQUFNRCx1QkFBdUIsQ0FBQyxDQUFELENBQXZCLEdBQTZCQyxZQUFZLENBQUMsQ0FBRCxDQUEvQyxDQUFQO0FBQ0QsQyxDQUVEOzs7SUFDYUMsZ0I7Ozs7Ozs7Ozs7Ozs7c0NBRVRDLEssRUFDQUMsUSxFQUNxQjtBQUNyQixVQUFJLENBQUNELEtBQUssQ0FBQ0gsdUJBQVgsRUFBb0M7QUFDbEMsZUFBT0csS0FBUDtBQUNEOztBQUhvQixrQkFTakIsS0FBS0UsV0FBTCxJQUFvQixFQVRIO0FBQUEscUNBTW5CQyxZQU5tQjtBQUFBLFVBTW5CQSxZQU5tQixtQ0FNSixDQU5JO0FBQUEscUNBT25CQyxZQVBtQjtBQUFBLFVBT25CQSxZQVBtQixtQ0FPSixLQVBJO0FBQUEsd0NBUW5CQyx3QkFSbUI7QUFBQSxVQVFuQkEsd0JBUm1CLHNDQVFRVCwrQkFSUiwwQkFXckI7OztBQUNBLFVBQUlVLFNBQVMsR0FBR0wsUUFBUSxDQUFDTSxNQUFULEtBQW9CLENBQXBCLEdBQXdCTixRQUFRLENBQUMsQ0FBRCxDQUFoQyxHQUFzQyxDQUF0RCxDQVpxQixDQWNyQjs7QUFDQUssTUFBQUEsU0FBUyxJQUFJRCx3QkFBd0IsQ0FBQztBQUNwQ1IsUUFBQUEsdUJBQXVCLEVBQUVHLEtBQUssQ0FBQ0gsdUJBREs7QUFFcENDLFFBQUFBLFlBQVksRUFBRUUsS0FBSyxDQUFDRjtBQUZnQixPQUFELENBQXJDO0FBSUFRLE1BQUFBLFNBQVMsR0FBR0UsSUFBSSxDQUFDQyxHQUFMLENBQVNILFNBQVQsRUFBb0JGLFlBQXBCLENBQVo7QUFDQUUsTUFBQUEsU0FBUyxHQUFHRSxJQUFJLENBQUNFLEdBQUwsQ0FBU0osU0FBVCxFQUFvQkgsWUFBcEIsQ0FBWjtBQUVBLGFBQU9RLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JaLEtBQWxCLEVBQXlCO0FBQzlCYSxRQUFBQSxZQUFZLEVBQUUsQ0FBQ1osUUFBUSxDQUFDLENBQUQsQ0FBVCxFQUFjQSxRQUFRLENBQUMsQ0FBRCxDQUF0QixFQUEyQkssU0FBM0I7QUFEZ0IsT0FBekIsQ0FBUDtBQUdEOzs7c0NBR0NOLEssRUFDc0U7QUFDdEUsVUFBTWMsVUFBVSxHQUFHLHNDQUFvQmQsS0FBSyxDQUFDZSxnQkFBMUIsQ0FBbkI7QUFDQSxVQUFNZCxRQUFRLEdBQUdhLFVBQVUsR0FBR0EsVUFBVSxDQUFDYixRQUFkLEdBQXlCRCxLQUFLLENBQUNhLFlBQTFELENBRnNFLENBR3RFOztBQUNBLHFHQUErQixLQUFLRyxpQkFBTCxDQUF1QmhCLEtBQXZCLEVBQThCQyxRQUE5QixDQUEvQjtBQUNEOzs7dUNBRWtCRCxLLEVBQXlEO0FBQzFFLFVBQU1jLFVBQVUsR0FBRyxzQ0FBb0JkLEtBQUssQ0FBQ2lCLEtBQTFCLENBQW5CO0FBQ0EsVUFBTWhCLFFBQVEsR0FBR2EsVUFBVSxHQUFHQSxVQUFVLENBQUNiLFFBQWQsR0FBeUJELEtBQUssQ0FBQ2EsWUFBMUQsQ0FGMEUsQ0FHMUU7O0FBQ0Esc0dBQWdDLEtBQUtHLGlCQUFMLENBQXVCaEIsS0FBdkIsRUFBOEJDLFFBQTlCLENBQWhDO0FBQ0Q7Ozs4QkFFU2lCLE0sRUFBeUM7QUFDakQsVUFBSUMsTUFBTSxtRkFBbUJELE1BQW5CLENBQVY7O0FBQ0EsVUFBSUMsTUFBTSxLQUFLLE1BQWYsRUFBdUI7QUFDckJBLFFBQUFBLE1BQU0sR0FBRyxXQUFUO0FBQ0Q7O0FBQ0QsYUFBT0EsTUFBUDtBQUNEOzs7eURBR0NDLFEsU0FRUTtBQUFBLFVBTk52Qix1QkFNTSxTQU5OQSx1QkFNTTtBQUFBLFVBTE5DLFlBS00sU0FMTkEsWUFLTTtBQUNSO0FBQ0EsVUFBTXVCLGNBQWMsR0FDakIsZUFBZWIsSUFBSSxDQUFDYyxHQUFMLENBQVVGLFFBQVEsQ0FBQ0csUUFBVCxHQUFvQmYsSUFBSSxDQUFDZ0IsRUFBMUIsR0FBZ0MsR0FBekMsQ0FBaEIsR0FBaUVoQixJQUFJLENBQUNpQixHQUFMLENBQVMsQ0FBVCxFQUFZTCxRQUFRLENBQUNNLElBQXJCLENBRG5FO0FBR0EsYUFBUUwsY0FBYyxJQUFJeEIsdUJBQXVCLENBQUMsQ0FBRCxDQUF2QixHQUE2QkMsWUFBWSxDQUFDLENBQUQsQ0FBN0MsQ0FBZixHQUFvRSxDQUEzRTtBQUNEOzs7O0VBdEVtQzZCLDRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9zaXRpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHsgUG9pbnRlck1vdmVFdmVudCwgU3RvcERyYWdnaW5nRXZlbnQgfSBmcm9tICcuLi9ldmVudC10eXBlcyc7XG5pbXBvcnQgeyBFZGl0QWN0aW9uLCBnZXRQaWNrZWRFZGl0SGFuZGxlIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXInO1xuXG5pbXBvcnQgeyBNb2RpZnlIYW5kbGVyIH0gZnJvbSAnLi9tb2RpZnktaGFuZGxlcic7XG5cbmZ1bmN0aW9uIGRlZmF1bHRDYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2Uoe1xuICBwb2ludGVyRG93blNjcmVlbkNvb3JkcyxcbiAgc2NyZWVuQ29vcmRzLFxufToge1xuICBwb2ludGVyRG93blNjcmVlbkNvb3JkczogUG9zaXRpb247XG4gIHNjcmVlbkNvb3JkczogUG9zaXRpb247XG59KSB7XG4gIHJldHVybiAxMCAqIChwb2ludGVyRG93blNjcmVlbkNvb3Jkc1sxXSAtIHNjcmVlbkNvb3Jkc1sxXSk7XG59XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBFbGV2YXRpb25IYW5kbGVyIGV4dGVuZHMgTW9kaWZ5SGFuZGxlciB7XG4gIG1ha2VFbGV2YXRlZEV2ZW50KFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50IHwgU3RvcERyYWdnaW5nRXZlbnQsXG4gICAgcG9zaXRpb246IFBvc2l0aW9uXG4gICk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGlmICghZXZlbnQucG9pbnRlckRvd25TY3JlZW5Db29yZHMpIHtcbiAgICAgIHJldHVybiBldmVudDtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBtaW5FbGV2YXRpb24gPSAwLFxuICAgICAgbWF4RWxldmF0aW9uID0gMjAwMDAsXG4gICAgICBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UgPSBkZWZhdWx0Q2FsY3VsYXRlRWxldmF0aW9uQ2hhbmdlLFxuICAgIH0gPSB0aGlzLl9tb2RlQ29uZmlnIHx8IHt9O1xuXG4gICAgLy8gJEZsb3dGaXhNZSAtIHJlYWxseSwgSSBrbm93IGl0IGhhcyBzb21ldGhpbmcgYXQgaW5kZXggMlxuICAgIGxldCBlbGV2YXRpb24gPSBwb3NpdGlvbi5sZW5ndGggPT09IDMgPyBwb3NpdGlvblsyXSA6IDA7XG5cbiAgICAvLyBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2UgaXMgY29uZmlndXJhYmxlIGJlY2FzZSAoYXQgdGhpcyB0aW1lKSBtb2RlcyBhcmUgbm90IGF3YXJlIG9mIHRoZSB2aWV3cG9ydFxuICAgIGVsZXZhdGlvbiArPSBjYWxjdWxhdGVFbGV2YXRpb25DaGFuZ2Uoe1xuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IGV2ZW50LnBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgc2NyZWVuQ29vcmRzOiBldmVudC5zY3JlZW5Db29yZHMsXG4gICAgfSk7XG4gICAgZWxldmF0aW9uID0gTWF0aC5taW4oZWxldmF0aW9uLCBtYXhFbGV2YXRpb24pO1xuICAgIGVsZXZhdGlvbiA9IE1hdGgubWF4KGVsZXZhdGlvbiwgbWluRWxldmF0aW9uKTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBldmVudCwge1xuICAgICAgZ3JvdW5kQ29vcmRzOiBbcG9zaXRpb25bMF0sIHBvc2l0aW9uWzFdLCBlbGV2YXRpb25dLFxuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnRcbiAgKTogeyBlZGl0QWN0aW9uOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZDsgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IGVkaXRIYW5kbGUgPSBnZXRQaWNrZWRFZGl0SGFuZGxlKGV2ZW50LnBvaW50ZXJEb3duUGlja3MpO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gZWRpdEhhbmRsZSA/IGVkaXRIYW5kbGUucG9zaXRpb24gOiBldmVudC5ncm91bmRDb29yZHM7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBzdXBlci5oYW5kbGVQb2ludGVyTW92ZSh0aGlzLm1ha2VFbGV2YXRlZEV2ZW50KGV2ZW50LCBwb3NpdGlvbikpO1xuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCk6IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5waWNrcyk7XG4gICAgY29uc3QgcG9zaXRpb24gPSBlZGl0SGFuZGxlID8gZWRpdEhhbmRsZS5wb3NpdGlvbiA6IGV2ZW50Lmdyb3VuZENvb3JkcztcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIHN1cGVyLmhhbmRsZVN0b3BEcmFnZ2luZyh0aGlzLm1ha2VFbGV2YXRlZEV2ZW50KGV2ZW50LCBwb3NpdGlvbikpO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKHBhcmFtczogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIGxldCBjdXJzb3IgPSBzdXBlci5nZXRDdXJzb3IocGFyYW1zKTtcbiAgICBpZiAoY3Vyc29yID09PSAnY2VsbCcpIHtcbiAgICAgIGN1cnNvciA9ICducy1yZXNpemUnO1xuICAgIH1cbiAgICByZXR1cm4gY3Vyc29yO1xuICB9XG5cbiAgc3RhdGljIGNhbGN1bGF0ZUVsZXZhdGlvbkNoYW5nZVdpdGhWaWV3cG9ydChcbiAgICB2aWV3cG9ydDogYW55LFxuICAgIHtcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgc2NyZWVuQ29vcmRzLFxuICAgIH06IHtcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBQb3NpdGlvbjtcbiAgICAgIHNjcmVlbkNvb3JkczogUG9zaXRpb247XG4gICAgfVxuICApOiBudW1iZXIge1xuICAgIC8vIFNvdXJjZTogaHR0cHM6Ly9naXMuc3RhY2tleGNoYW5nZS5jb20vYS8xMjc5NDkvMTExODA0XG4gICAgY29uc3QgbWV0ZXJzUGVyUGl4ZWwgPVxuICAgICAgKDE1NjU0My4wMzM5MiAqIE1hdGguY29zKCh2aWV3cG9ydC5sYXRpdHVkZSAqIE1hdGguUEkpIC8gMTgwKSkgLyBNYXRoLnBvdygyLCB2aWV3cG9ydC56b29tKTtcblxuICAgIHJldHVybiAobWV0ZXJzUGVyUGl4ZWwgKiAocG9pbnRlckRvd25TY3JlZW5Db29yZHNbMV0gLSBzY3JlZW5Db29yZHNbMV0pKSAvIDI7XG4gIH1cbn1cbiJdfQ==