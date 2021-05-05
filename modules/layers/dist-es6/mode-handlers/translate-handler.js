"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TranslateHandler = void 0;

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _transformTranslate = _interopRequireDefault(require("@turf/transform-translate"));

var _helpers = require("@turf/helpers");

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
var TranslateHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(TranslateHandler, _ModeHandler);

  var _super = _createSuper(TranslateHandler);

  function TranslateHandler() {
    var _this;

    _classCallCheck(this, TranslateHandler);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_geometryBeforeTranslate", void 0);

    _defineProperty(_assertThisInitialized(_this), "_isTranslatable", void 0);

    return _this;
  }

  _createClass(TranslateHandler, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var editAction = null;
      this._isTranslatable = Boolean(this._geometryBeforeTranslate) || this.isSelectionPicked(event.picks);

      if (!this._isTranslatable || !event.pointerDownGroundCoords) {
        // Nothing to do
        return {
          editAction: null,
          cancelMapPan: false
        };
      }

      if (event.isDragging && this._geometryBeforeTranslate) {
        // Translate the geometry
        editAction = this.getTranslateAction(event.pointerDownGroundCoords, event.groundCoords, 'translating');
      }

      return {
        editAction: editAction,
        cancelMapPan: true
      };
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      if (!this._isTranslatable) {
        return null;
      }

      this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection();
      return null;
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      var editAction = null;

      if (this._geometryBeforeTranslate) {
        // Translate the geometry
        editAction = this.getTranslateAction(event.pointerDownGroundCoords, event.groundCoords, 'translated');
        this._geometryBeforeTranslate = null;
      }

      return editAction;
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;

      if (this._isTranslatable) {
        return 'move';
      }

      return isDragging ? 'grabbing' : 'grab';
    }
  }, {
    key: "getTranslateAction",
    value: function getTranslateAction(startDragPoint, currentPoint, editType) {
      if (!this._geometryBeforeTranslate) {
        return null;
      }

      var p1 = (0, _helpers.point)(startDragPoint);
      var p2 = (0, _helpers.point)(currentPoint);
      var distanceMoved = (0, _distance["default"])(p1, p2);
      var direction = (0, _bearing["default"])(p1, p2);
      var movedFeatures = (0, _transformTranslate["default"])( // @ts-ignore
      this._geometryBeforeTranslate, distanceMoved, direction);
      var updatedData = this.getImmutableFeatureCollection();
      var selectedIndexes = this.getSelectedFeatureIndexes();

      for (var i = 0; i < selectedIndexes.length; i++) {
        var selectedIndex = selectedIndexes[i];
        var movedFeature = movedFeatures.features[i];
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

  return TranslateHandler;
}(_modeHandler.ModeHandler);

exports.TranslateHandler = TranslateHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3RyYW5zbGF0ZS1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbIlRyYW5zbGF0ZUhhbmRsZXIiLCJldmVudCIsImVkaXRBY3Rpb24iLCJfaXNUcmFuc2xhdGFibGUiLCJCb29sZWFuIiwiX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlIiwiaXNTZWxlY3Rpb25QaWNrZWQiLCJwaWNrcyIsInBvaW50ZXJEb3duR3JvdW5kQ29vcmRzIiwiY2FuY2VsTWFwUGFuIiwiaXNEcmFnZ2luZyIsImdldFRyYW5zbGF0ZUFjdGlvbiIsImdyb3VuZENvb3JkcyIsImdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uIiwic3RhcnREcmFnUG9pbnQiLCJjdXJyZW50UG9pbnQiLCJlZGl0VHlwZSIsInAxIiwicDIiLCJkaXN0YW5jZU1vdmVkIiwiZGlyZWN0aW9uIiwibW92ZWRGZWF0dXJlcyIsInVwZGF0ZWREYXRhIiwiZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJzZWxlY3RlZEluZGV4ZXMiLCJnZXRTZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiaSIsImxlbmd0aCIsInNlbGVjdGVkSW5kZXgiLCJtb3ZlZEZlYXR1cmUiLCJmZWF0dXJlcyIsInJlcGxhY2VHZW9tZXRyeSIsImdlb21ldHJ5IiwiZ2V0T2JqZWN0IiwiZmVhdHVyZUluZGV4ZXMiLCJlZGl0Q29udGV4dCIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNhQSxnQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQ0FLVEMsSyxFQUNzRTtBQUN0RSxVQUFJQyxVQUF5QyxHQUFHLElBQWhEO0FBRUEsV0FBS0MsZUFBTCxHQUNFQyxPQUFPLENBQUMsS0FBS0Msd0JBQU4sQ0FBUCxJQUEwQyxLQUFLQyxpQkFBTCxDQUF1QkwsS0FB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ZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgdHVyZlRyYW5zZm9ybVRyYW5zbGF0ZSBmcm9tICdAdHVyZi90cmFuc2Zvcm0tdHJhbnNsYXRlJztcbmltcG9ydCB7IHBvaW50IH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgeyBGZWF0dXJlQ29sbGVjdGlvbiwgUG9zaXRpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHsgUG9pbnRlck1vdmVFdmVudCwgU3RhcnREcmFnZ2luZ0V2ZW50LCBTdG9wRHJhZ2dpbmdFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzJztcbmltcG9ydCB7IEVkaXRBY3Rpb24sIE1vZGVIYW5kbGVyIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXInO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRlSGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlOiBGZWF0dXJlQ29sbGVjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIF9pc1RyYW5zbGF0YWJsZTogYm9vbGVhbjtcblxuICBoYW5kbGVQb2ludGVyTW92ZShcbiAgICBldmVudDogUG9pbnRlck1vdmVFdmVudFxuICApOiB7IGVkaXRBY3Rpb246IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkOyBjYW5jZWxNYXBQYW46IGJvb2xlYW4gfSB7XG4gICAgbGV0IGVkaXRBY3Rpb246IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkID0gbnVsbDtcblxuICAgIHRoaXMuX2lzVHJhbnNsYXRhYmxlID1cbiAgICAgIEJvb2xlYW4odGhpcy5fZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUpIHx8IHRoaXMuaXNTZWxlY3Rpb25QaWNrZWQoZXZlbnQucGlja3MpO1xuXG4gICAgaWYgKCF0aGlzLl9pc1RyYW5zbGF0YWJsZSB8fCAhZXZlbnQucG9pbnRlckRvd25Hcm91bmRDb29yZHMpIHtcbiAgICAgIC8vIE5vdGhpbmcgdG8gZG9cbiAgICAgIHJldHVybiB7IGVkaXRBY3Rpb246IG51bGwsIGNhbmNlbE1hcFBhbjogZmFsc2UgfTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQuaXNEcmFnZ2luZyAmJiB0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSkge1xuICAgICAgLy8gVHJhbnNsYXRlIHRoZSBnZW9tZXRyeVxuICAgICAgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0VHJhbnNsYXRlQWN0aW9uKFxuICAgICAgICBldmVudC5wb2ludGVyRG93bkdyb3VuZENvb3JkcyxcbiAgICAgICAgZXZlbnQuZ3JvdW5kQ29vcmRzLFxuICAgICAgICAndHJhbnNsYXRpbmcnXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB7IGVkaXRBY3Rpb24sIGNhbmNlbE1hcFBhbjogdHJ1ZSB9O1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KTogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5faXNUcmFuc2xhdGFibGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlID0gdGhpcy5nZXRTZWxlY3RlZEZlYXR1cmVzQXNGZWF0dXJlQ29sbGVjdGlvbigpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCk6IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBsZXQgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQgPSBudWxsO1xuXG4gICAgaWYgKHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlKSB7XG4gICAgICAvLyBUcmFuc2xhdGUgdGhlIGdlb21ldHJ5XG4gICAgICBlZGl0QWN0aW9uID0gdGhpcy5nZXRUcmFuc2xhdGVBY3Rpb24oXG4gICAgICAgIGV2ZW50LnBvaW50ZXJEb3duR3JvdW5kQ29vcmRzLFxuICAgICAgICBldmVudC5ncm91bmRDb29yZHMsXG4gICAgICAgICd0cmFuc2xhdGVkJ1xuICAgICAgKTtcbiAgICAgIHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZWRpdEFjdGlvbjtcbiAgfVxuXG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLl9pc1RyYW5zbGF0YWJsZSkge1xuICAgICAgcmV0dXJuICdtb3ZlJztcbiAgICB9XG4gICAgcmV0dXJuIGlzRHJhZ2dpbmcgPyAnZ3JhYmJpbmcnIDogJ2dyYWInO1xuICB9XG5cbiAgZ2V0VHJhbnNsYXRlQWN0aW9uKFxuICAgIHN0YXJ0RHJhZ1BvaW50OiBQb3NpdGlvbixcbiAgICBjdXJyZW50UG9pbnQ6IFBvc2l0aW9uLFxuICAgIGVkaXRUeXBlOiBzdHJpbmdcbiAgKTogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5fZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBwMSA9IHBvaW50KHN0YXJ0RHJhZ1BvaW50KTtcbiAgICBjb25zdCBwMiA9IHBvaW50KGN1cnJlbnRQb2ludCk7XG5cbiAgICBjb25zdCBkaXN0YW5jZU1vdmVkID0gdHVyZkRpc3RhbmNlKHAxLCBwMik7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gdHVyZkJlYXJpbmcocDEsIHAyKTtcblxuICAgIGNvbnN0IG1vdmVkRmVhdHVyZXMgPSB0dXJmVHJhbnNmb3JtVHJhbnNsYXRlKFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5fZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUsXG4gICAgICBkaXN0YW5jZU1vdmVkLFxuICAgICAgZGlyZWN0aW9uXG4gICAgKTtcblxuICAgIGxldCB1cGRhdGVkRGF0YSA9IHRoaXMuZ2V0SW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXhlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gc2VsZWN0ZWRJbmRleGVzW2ldO1xuICAgICAgY29uc3QgbW92ZWRGZWF0dXJlID0gbW92ZWRGZWF0dXJlcy5mZWF0dXJlc1tpXTtcbiAgICAgIHVwZGF0ZWREYXRhID0gdXBkYXRlZERhdGEucmVwbGFjZUdlb21ldHJ5KHNlbGVjdGVkSW5kZXgsIG1vdmVkRmVhdHVyZS5nZW9tZXRyeSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZWREYXRhOiB1cGRhdGVkRGF0YS5nZXRPYmplY3QoKSxcbiAgICAgIGVkaXRUeXBlLFxuICAgICAgZmVhdHVyZUluZGV4ZXM6IHNlbGVjdGVkSW5kZXhlcyxcbiAgICAgIGVkaXRDb250ZXh0OiBudWxsLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==