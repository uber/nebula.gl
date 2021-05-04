"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RotateHandler = void 0;

var _centroid = _interopRequireDefault(require("@turf/centroid"));

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _transformRotate = _interopRequireDefault(require("@turf/transform-rotate"));

var _modeHandler = require("./mode-handler");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var RotateHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(RotateHandler, _ModeHandler);

  var _super = _createSuper(RotateHandler);

  function RotateHandler() {
    var _this;

    _classCallCheck(this, RotateHandler);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_isRotatable", void 0);

    _defineProperty(_assertThisInitialized(_this), "_geometryBeingRotated", void 0);

    return _this;
  }

  _createClass(RotateHandler, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var editAction = null;
      this._isRotatable = Boolean(this._geometryBeingRotated) || this.isSelectionPicked(event.picks);

      if (!this._isRotatable || !event.pointerDownGroundCoords) {
        // Nothing to do
        return {
          editAction: null,
          cancelMapPan: false
        };
      }

      if (event.isDragging && this._geometryBeingRotated) {
        // Rotate the geometry
        editAction = this.getRotateAction(event.pointerDownGroundCoords, event.groundCoords, 'rotating');
      }

      return {
        editAction: editAction,
        cancelMapPan: true
      };
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      if (!this._isRotatable) {
        return null;
      }

      this._geometryBeingRotated = this.getSelectedFeaturesAsFeatureCollection();
      return null;
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      var editAction = null;

      if (this._geometryBeingRotated) {
        // Rotate the geometry
        editAction = this.getRotateAction(event.pointerDownGroundCoords, event.groundCoords, 'rotated');
        this._geometryBeingRotated = null;
      }

      return editAction;
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;

      if (this._isRotatable) {
        // TODO: look at doing SVG cursors to get a better "rotate" cursor
        return 'move';
      }

      return isDragging ? 'grabbing' : 'grab';
    }
  }, {
    key: "getRotateAction",
    value: function getRotateAction(startDragPoint, currentPoint, editType) {
      var startPosition = startDragPoint;
      var centroid = (0, _centroid["default"])(this._geometryBeingRotated);
      var angle = getRotationAngle(centroid, startPosition, currentPoint); // @ts-ignore

      var rotatedFeatures = (0, _transformRotate["default"])(this._geometryBeingRotated, angle);
      var updatedData = this.getImmutableFeatureCollection();
      var selectedIndexes = this.getSelectedFeatureIndexes();

      for (var i = 0; i < selectedIndexes.length; i++) {
        var selectedIndex = selectedIndexes[i];
        var movedFeature = rotatedFeatures.features[i];
        updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
      }

      return {
        updatedData: updatedData.getObject(),
        editType: editType,
        featureIndexes: selectedIndexes,
        editContext: null
      };
    }
  }]);

  return RotateHandler;
}(_modeHandler.ModeHandler);

exports.RotateHandler = RotateHandler;

function getRotationAngle(centroid, startDragPoint, currentPoint) {
  var bearing1 = (0, _bearing["default"])(centroid, startDragPoint);
  var bearing2 = (0, _bearing["default"])(centroid, currentPoint);
  return bearing2 - bearing1;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3JvdGF0ZS1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbIlJvdGF0ZUhhbmRsZXIiLCJldmVudCIsImVkaXRBY3Rpb24iLCJfaXNSb3RhdGFibGUiLCJCb29sZWFuIiwiX2dlb21ldHJ5QmVpbmdSb3RhdGVkIiwiaXNTZWxlY3Rpb25QaWNrZWQiLCJwaWNrcyIsInBvaW50ZXJEb3duR3JvdW5kQ29vcmRzIiwiY2FuY2VsTWFwUGFuIiwiaXNEcmFnZ2luZyIsImdldFJvdGF0ZUFjdGlvbiIsImdyb3VuZENvb3JkcyIsImdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uIiwic3RhcnREcmFnUG9pbnQiLCJjdXJyZW50UG9pbnQiLCJlZGl0VHlwZSIsInN0YXJ0UG9zaXRpb24iLCJjZW50cm9pZCIsImFuZ2xlIiwiZ2V0Um90YXRpb25BbmdsZSIsInJvdGF0ZWRGZWF0dXJlcyIsInVwZGF0ZWREYXRhIiwiZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJzZWxlY3RlZEluZGV4ZXMiLCJnZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiaSIsImxlbmd0aCIsInNlbGVjdGVkSW5kZXgiLCJtb3ZlZEZlYXR1cmUiLCJmZWF0dXJlcyIsInJlcGxhY2VHZW9tZXRyeSIsImdlb21ldHJ5IiwiZ2V0T2JqZWN0IiwiZmVhdHVyZUluZGV4ZXMiLCJlZGl0Q29udGV4dCIsIk1vZGVIYW5kbGVyIiwiYmVhcmluZzEiLCJiZWFyaW5nMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEsYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQ0FLVEMsSyxFQUNzRTtBQUN0RSxVQUFJQyxVQUF5QyxHQUFHLElBQWhEO0FBRUEsV0FBS0MsWUFBTCxHQUFvQkMsT0FBTyxDQUFDLEtBQUtDLHFCQUFOLENBQVAsSUFBdUMsS0FB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WixFQUFzQkosY0FBdEIsQ0FBakI7QUFDQSxNQUFNd0IsUUFBUSxHQUFHLHlCQUFZcEIsUUFBWixFQUFzQkgsWUFBdEIsQ0FBakI7QUFDQSxTQUFPdUIsUUFBUSxHQUFHRCxRQUFsQjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR1cmZDZW50cm9pZCBmcm9tICdAdHVyZi9jZW50cm9pZCc7XG5pbXBvcnQgdHVyZkJlYXJpbmcgZnJvbSAnQHR1cmYvYmVhcmluZyc7XG5pbXBvcnQgdHVyZlRyYW5zZm9ybVJvdGF0ZSBmcm9tICdAdHVyZi90cmFuc2Zvcm0tcm90YXRlJztcbmltcG9ydCB7IEZlYXR1cmVDb2xsZWN0aW9uLCBQb3NpdGlvbiB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgeyBQb2ludGVyTW92ZUV2ZW50LCBTdGFydERyYWdnaW5nRXZlbnQsIFN0b3BEcmFnZ2luZ0V2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMnO1xuaW1wb3J0IHsgRWRpdEFjdGlvbiwgTW9kZUhhbmRsZXIgfSBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBSb3RhdGVIYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBfaXNSb3RhdGFibGU6IGJvb2xlYW47XG4gIF9nZW9tZXRyeUJlaW5nUm90YXRlZDogRmVhdHVyZUNvbGxlY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkO1xuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50XG4gICk6IHsgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQ7IGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICBsZXQgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQgPSBudWxsO1xuXG4gICAgdGhpcy5faXNSb3RhdGFibGUgPSBCb29sZWFuKHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkKSB8fCB0aGlzLmlzU2VsZWN0aW9uUGlja2VkKGV2ZW50LnBpY2tzKTtcblxuICAgIGlmICghdGhpcy5faXNSb3RhdGFibGUgfHwgIWV2ZW50LnBvaW50ZXJEb3duR3JvdW5kQ29vcmRzKSB7XG4gICAgICAvLyBOb3RoaW5nIHRvIGRvXG4gICAgICByZXR1cm4geyBlZGl0QWN0aW9uOiBudWxsLCBjYW5jZWxNYXBQYW46IGZhbHNlIH07XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmlzRHJhZ2dpbmcgJiYgdGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQpIHtcbiAgICAgIC8vIFJvdGF0ZSB0aGUgZ2VvbWV0cnlcbiAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldFJvdGF0ZUFjdGlvbihcbiAgICAgICAgZXZlbnQucG9pbnRlckRvd25Hcm91bmRDb29yZHMsXG4gICAgICAgIGV2ZW50Lmdyb3VuZENvb3JkcyxcbiAgICAgICAgJ3JvdGF0aW5nJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBlZGl0QWN0aW9uLCBjYW5jZWxNYXBQYW46IHRydWUgfTtcbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCk6IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAoIXRoaXMuX2lzUm90YXRhYmxlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9nZW9tZXRyeUJlaW5nUm90YXRlZCA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24oKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZVN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCB7XG4gICAgbGV0IGVkaXRBY3Rpb246IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkID0gbnVsbDtcblxuICAgIGlmICh0aGlzLl9nZW9tZXRyeUJlaW5nUm90YXRlZCkge1xuICAgICAgLy8gUm90YXRlIHRoZSBnZW9tZXRyeVxuICAgICAgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0Um90YXRlQWN0aW9uKFxuICAgICAgICBldmVudC5wb2ludGVyRG93bkdyb3VuZENvb3JkcyxcbiAgICAgICAgZXZlbnQuZ3JvdW5kQ29vcmRzLFxuICAgICAgICAncm90YXRlZCdcbiAgICAgICk7XG4gICAgICB0aGlzLl9nZW9tZXRyeUJlaW5nUm90YXRlZCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVkaXRBY3Rpb247XG4gIH1cblxuICBnZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH06IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5faXNSb3RhdGFibGUpIHtcbiAgICAgIC8vIFRPRE86IGxvb2sgYXQgZG9pbmcgU1ZHIGN1cnNvcnMgdG8gZ2V0IGEgYmV0dGVyIFwicm90YXRlXCIgY3Vyc29yXG4gICAgICByZXR1cm4gJ21vdmUnO1xuICAgIH1cbiAgICByZXR1cm4gaXNEcmFnZ2luZyA/ICdncmFiYmluZycgOiAnZ3JhYic7XG4gIH1cblxuICBnZXRSb3RhdGVBY3Rpb24oc3RhcnREcmFnUG9pbnQ6IFBvc2l0aW9uLCBjdXJyZW50UG9pbnQ6IFBvc2l0aW9uLCBlZGl0VHlwZTogc3RyaW5nKTogRWRpdEFjdGlvbiB7XG4gICAgY29uc3Qgc3RhcnRQb3NpdGlvbiA9IHN0YXJ0RHJhZ1BvaW50O1xuICAgIGNvbnN0IGNlbnRyb2lkID0gdHVyZkNlbnRyb2lkKHRoaXMuX2dlb21ldHJ5QmVpbmdSb3RhdGVkKTtcbiAgICBjb25zdCBhbmdsZSA9IGdldFJvdGF0aW9uQW5nbGUoY2VudHJvaWQsIHN0YXJ0UG9zaXRpb24sIGN1cnJlbnRQb2ludCk7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHJvdGF0ZWRGZWF0dXJlcyA9IHR1cmZUcmFuc2Zvcm1Sb3RhdGUodGhpcy5fZ2VvbWV0cnlCZWluZ1JvdGF0ZWQsIGFuZ2xlKTtcblxuICAgIGxldCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXhlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRJbmRleGVzW2ldO1xuICAgICAgY29uc3QgbW92ZWRGZWF0dXJlID0gcm90YXRlZEZlYXR1cmVzLmZlYXR1cmVzW2ldO1xuICAgICAgdXBkYXRlZERhdGEgPSB1cGRhdGVkRGF0YS5yZXBsYWNlR2VvbWV0cnkoc2VsZWN0ZWRJbmRleCwgbW92ZWRGZWF0dXJlLmdlb21ldHJ5KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlZERhdGE6IHVwZGF0ZWREYXRhLmdldE9iamVjdCgpLFxuICAgICAgZWRpdFR5cGUsXG4gICAgICBmZWF0dXJlSW5kZXhlczogc2VsZWN0ZWRJbmRleGVzLFxuICAgICAgZWRpdENvbnRleHQ6IG51bGwsXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRSb3RhdGlvbkFuZ2xlKGNlbnRyb2lkOiBQb3NpdGlvbiwgc3RhcnREcmFnUG9pbnQ6IFBvc2l0aW9uLCBjdXJyZW50UG9pbnQ6IFBvc2l0aW9uKSB7XG4gIGNvbnN0IGJlYXJpbmcxID0gdHVyZkJlYXJpbmcoY2VudHJvaWQsIHN0YXJ0RHJhZ1BvaW50KTtcbiAgY29uc3QgYmVhcmluZzIgPSB0dXJmQmVhcmluZyhjZW50cm9pZCwgY3VycmVudFBvaW50KTtcbiAgcmV0dXJuIGJlYXJpbmcyIC0gYmVhcmluZzE7XG59XG4iXX0=