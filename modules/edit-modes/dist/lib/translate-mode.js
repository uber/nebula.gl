"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TranslateMode = void 0;

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _distance = _interopRequireDefault(require("@turf/distance"));

var _transformTranslate = _interopRequireDefault(require("@turf/transform-translate"));

var _helpers = require("@turf/helpers");

var _geojsonEditMode = require("./geojson-edit-mode");

var _immutableFeatureCollection = require("./immutable-feature-collection");

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

var TranslateMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(TranslateMode, _GeoJsonEditMode);

  var _super = _createSuper(TranslateMode);

  function TranslateMode() {
    var _this;

    _classCallCheck(this, TranslateMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_geometryBeforeTranslate", void 0);

    _defineProperty(_assertThisInitialized(_this), "_isTranslatable", void 0);

    return _this;
  }

  _createClass(TranslateMode, [{
    key: "handleDragging",
    value: function handleDragging(event, props) {
      if (!this._isTranslatable) {
        // Nothing to do
        return;
      }

      if (this._geometryBeforeTranslate) {
        // Translate the geometry
        var editAction = this.getTranslateAction(event.pointerDownMapCoords, event.mapCoords, 'translating', props);

        if (editAction) {
          props.onEdit(editAction);
        }
      } // cancel map panning


      event.cancelPan();
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      this._isTranslatable = this.isSelectionPicked(event.pointerDownPicks || event.picks, props);
      this.updateCursor(props);
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      if (!this._isTranslatable) {
        return;
      }

      this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection(props);
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      if (this._geometryBeforeTranslate) {
        // Translate the geometry
        var editAction = this.getTranslateAction(event.pointerDownMapCoords, event.mapCoords, 'translated', props);

        if (editAction) {
          props.onEdit(editAction);
        }

        this._geometryBeforeTranslate = null;
      }
    }
  }, {
    key: "updateCursor",
    value: function updateCursor(props) {
      if (this._isTranslatable) {
        props.onUpdateCursor('move');
      } else {
        props.onUpdateCursor(null);
      }
    }
  }, {
    key: "getTranslateAction",
    value: function getTranslateAction(startDragPoint, currentPoint, editType, props) {
      if (!this._geometryBeforeTranslate) {
        return null;
      }

      var p1 = (0, _helpers.point)(startDragPoint);
      var p2 = (0, _helpers.point)(currentPoint);
      var distanceMoved = (0, _distance["default"])(p1, p2);
      var direction = (0, _bearing["default"])(p1, p2);
      var movedFeatures = (0, _transformTranslate["default"])( // @ts-ignore
      this._geometryBeforeTranslate, distanceMoved, direction);
      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data);
      var selectedIndexes = props.selectedIndexes;

      for (var i = 0; i < selectedIndexes.length; i++) {
        var selectedIndex = selectedIndexes[i];
        var movedFeature = movedFeatures.features[i];
        updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
      }

      return {
        updatedData: updatedData.getObject(),
        editType: editType,
        editContext: {
          featureIndexes: selectedIndexes
        }
      };
    }
  }]);

  return TranslateMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.TranslateMode = TranslateMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdHJhbnNsYXRlLW1vZGUudHMiXSwibmFtZXMiOlsiVHJhbnNsYXRlTW9kZSIsImV2ZW50IiwicHJvcHMiLCJfaXNUcmFuc2xhdGFibGUiLCJfZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUiLCJlZGl0QWN0aW9uIiwiZ2V0VHJhbnNsYXRlQWN0aW9uIiwicG9pbnRlckRvd25NYXBDb29yZHMiLCJtYXBDb29yZHMiLCJvbkVkaXQiLCJjYW5jZWxQYW4iLCJpc1NlbGVjdGlvblBpY2tlZCIsInBvaW50ZXJEb3duUGlja3MiLCJwaWNrcyIsInVwZGF0ZUN1cnNvciIsImdldFNlbGVjdGVkRmVhdHVyZXNBc0ZlYXR1cmVDb2xsZWN0aW9uIiwib25VcGRhdGVDdXJzb3IiLCJzdGFydERyYWdQb2ludCIsImN1cnJlbnRQb2ludCIsImVkaXRUeXBlIiwicDEiLCJwMiIsImRpc3RhbmNlTW92ZWQiLCJkaXJlY3Rpb24iLCJtb3ZlZEZlYXR1cmVzIiwidXBkYXRlZERhdGEiLCJJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiIsImRhdGEiLCJzZWxlY3RlZEluZGV4ZXMiLCJpIiwibGVuZ3RoIiwic2VsZWN0ZWRJbmRleCIsIm1vdmVkRmVhdHVyZSIsImZlYXR1cmVzIiwicmVwbGFjZUdlb21ldHJ5IiwiZ2VvbWV0cnkiLCJnZXRPYmplY3QiLCJlZGl0Q29udGV4dCIsImZlYXR1cmVJbmRleGVzIiwiR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBU0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQ0FJSUMsSyxFQUFzQkMsSyxFQUFxQztBQUN4RSxVQUFJLENBQUMsS0FBS0MsZUFBVixFQUEyQjtBQUN6QjtBQUNBO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLQyx3QkFBVCxFQUFtQztBQUNqQztBQUNBLFlBQU1DLFVB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VUFBQUEsY0FBYyxFQUFFVjtBQURMO0FBSFIsT0FBUDtBQU9EOzs7O0VBMUdnQ1csZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHVyZkJlYXJpbmcgZnJvbSAnQHR1cmYvYmVhcmluZyc7XG5pbXBvcnQgdHVyZkRpc3RhbmNlIGZyb20gJ0B0dXJmL2Rpc3RhbmNlJztcbmltcG9ydCB0dXJmVHJhbnNmb3JtVHJhbnNsYXRlIGZyb20gJ0B0dXJmL3RyYW5zZm9ybS10cmFuc2xhdGUnO1xuaW1wb3J0IHsgcG9pbnQgfSBmcm9tICdAdHVyZi9oZWxwZXJzJztcbmltcG9ydCB7IEZlYXR1cmVDb2xsZWN0aW9uLCBQb3NpdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMnO1xuaW1wb3J0IHtcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgRHJhZ2dpbmdFdmVudCxcbiAgTW9kZVByb3BzLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBHZW9Kc29uRWRpdE1vZGUsIEdlb0pzb25FZGl0QWN0aW9uIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZSc7XG5pbXBvcnQgeyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4vaW1tdXRhYmxlLWZlYXR1cmUtY29sbGVjdGlvbic7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGVNb2RlIGV4dGVuZHMgR2VvSnNvbkVkaXRNb2RlIHtcbiAgX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlOiBGZWF0dXJlQ29sbGVjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIF9pc1RyYW5zbGF0YWJsZTogYm9vbGVhbjtcblxuICBoYW5kbGVEcmFnZ2luZyhldmVudDogRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBpZiAoIXRoaXMuX2lzVHJhbnNsYXRhYmxlKSB7XG4gICAgICAvLyBOb3RoaW5nIHRvIGRvXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2dlb21ldHJ5QmVmb3JlVHJhbnNsYXRlKSB7XG4gICAgICAvLyBUcmFuc2xhdGUgdGhlIGdlb21ldHJ5XG4gICAgICBjb25zdCBlZGl0QWN0aW9uID0gdGhpcy5nZXRUcmFuc2xhdGVBY3Rpb24oXG4gICAgICAgIGV2ZW50LnBvaW50ZXJEb3duTWFwQ29vcmRzLFxuICAgICAgICBldmVudC5tYXBDb29yZHMsXG4gICAgICAgICd0cmFuc2xhdGluZycsXG4gICAgICAgIHByb3BzXG4gICAgICApO1xuXG4gICAgICBpZiAoZWRpdEFjdGlvbikge1xuICAgICAgICBwcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2FuY2VsIG1hcCBwYW5uaW5nXG4gICAgZXZlbnQuY2FuY2VsUGFuKCk7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICB0aGlzLl9pc1RyYW5zbGF0YWJsZSA9IHRoaXMuaXNTZWxlY3Rpb25QaWNrZWQoZXZlbnQucG9pbnRlckRvd25QaWNrcyB8fCBldmVudC5waWNrcywgcHJvcHMpO1xuXG4gICAgdGhpcy51cGRhdGVDdXJzb3IocHJvcHMpO1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGlmICghdGhpcy5faXNUcmFuc2xhdGFibGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlc0FzRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMpO1xuICB9XG5cbiAgaGFuZGxlU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBpZiAodGhpcy5fZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUpIHtcbiAgICAgIC8vIFRyYW5zbGF0ZSB0aGUgZ2VvbWV0cnlcbiAgICAgIGNvbnN0IGVkaXRBY3Rpb24gPSB0aGlzLmdldFRyYW5zbGF0ZUFjdGlvbihcbiAgICAgICAgZXZlbnQucG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgICAgIGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgICAgJ3RyYW5zbGF0ZWQnLFxuICAgICAgICBwcm9wc1xuICAgICAgKTtcblxuICAgICAgaWYgKGVkaXRBY3Rpb24pIHtcbiAgICAgICAgcHJvcHMub25FZGl0KGVkaXRBY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9nZW9tZXRyeUJlZm9yZVRyYW5zbGF0ZSA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ3Vyc29yKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgaWYgKHRoaXMuX2lzVHJhbnNsYXRhYmxlKSB7XG4gICAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcignbW92ZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9wcy5vblVwZGF0ZUN1cnNvcihudWxsKTtcbiAgICB9XG4gIH1cblxuICBnZXRUcmFuc2xhdGVBY3Rpb24oXG4gICAgc3RhcnREcmFnUG9pbnQ6IFBvc2l0aW9uLFxuICAgIGN1cnJlbnRQb2ludDogUG9zaXRpb24sXG4gICAgZWRpdFR5cGU6IHN0cmluZyxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApOiBHZW9Kc29uRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGlmICghdGhpcy5fZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBwMSA9IHBvaW50KHN0YXJ0RHJhZ1BvaW50KTtcbiAgICBjb25zdCBwMiA9IHBvaW50KGN1cnJlbnRQb2ludCk7XG5cbiAgICBjb25zdCBkaXN0YW5jZU1vdmVkID0gdHVyZkRpc3RhbmNlKHAxLCBwMik7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gdHVyZkJlYXJpbmcocDEsIHAyKTtcblxuICAgIGNvbnN0IG1vdmVkRmVhdHVyZXMgPSB0dXJmVHJhbnNmb3JtVHJhbnNsYXRlKFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5fZ2VvbWV0cnlCZWZvcmVUcmFuc2xhdGUsXG4gICAgICBkaXN0YW5jZU1vdmVkLFxuICAgICAgZGlyZWN0aW9uXG4gICAgKTtcblxuICAgIGxldCB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKTtcblxuICAgIGNvbnN0IHNlbGVjdGVkSW5kZXhlcyA9IHByb3BzLnNlbGVjdGVkSW5kZXhlcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXhlc1tpXTtcbiAgICAgIGNvbnN0IG1vdmVkRmVhdHVyZSA9IG1vdmVkRmVhdHVyZXMuZmVhdHVyZXNbaV07XG4gICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLnJlcGxhY2VHZW9tZXRyeShzZWxlY3RlZEluZGV4LCBtb3ZlZEZlYXR1cmUuZ2VvbWV0cnkpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGVkRGF0YTogdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCksXG4gICAgICBlZGl0VHlwZSxcbiAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgIGZlYXR1cmVJbmRleGVzOiBzZWxlY3RlZEluZGV4ZXMsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiJdfQ==