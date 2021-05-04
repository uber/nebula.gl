"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompositeMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CompositeMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(CompositeMode, _GeoJsonEditMode);

  var _super = _createSuper(CompositeMode);

  function CompositeMode(modes) {
    var _this;

    _classCallCheck(this, CompositeMode);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "_modes", void 0);

    _this._modes = modes;
    return _this;
  }

  _createClass(CompositeMode, [{
    key: "_coalesce",
    value: function _coalesce(callback) {
      var resultEval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var result;

      for (var i = 0; i < this._modes.length; i++) {
        result = callback(this._modes[i]);

        if (resultEval ? resultEval(result) : result) {
          break;
        }
      }

      return result;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event, props) {
      this._coalesce(function (handler) {
        return handler.handleClick(event, props);
      });
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      return this._coalesce(function (handler) {
        return handler.handlePointerMove(event, props);
      });
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      return this._coalesce(function (handler) {
        return handler.handleStartDragging(event, props);
      });
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      return this._coalesce(function (handler) {
        return handler.handleStopDragging(event, props);
      });
    }
  }, {
    key: "handleDragging",
    value: function handleDragging(event, props) {
      return this._coalesce(function (handler) {
        return handler.handleDragging(event, props);
      });
    }
  }, {
    key: "getGuides",
    value: function getGuides(props) {
      // TODO: Combine the guides *BUT* make sure if none of the results have
      // changed to return the same object so that "guides !== this.state.guides"
      // in editable-geojson-layer works.
      var allGuides = [];

      var _iterator = _createForOfIteratorHelper(this._modes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var mode = _step.value;
          allGuides.push.apply(allGuides, _toConsumableArray(mode.getGuides(props).features));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return {
        type: 'FeatureCollection',
        features: allGuides
      };
    }
  }]);

  return CompositeMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.CompositeMode = CompositeMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvY29tcG9zaXRlLW1vZGUudHMiXSwibmFtZXMiOlsiQ29tcG9zaXRlTW9kZSIsIm1vZGVzIiwiX21vZGVzIiwiY2FsbGJhY2siLCJyZXN1bHRFdmFsIiwicmVzdWx0IiwiaSIsImxlbmd0aCIsImV2ZW50IiwicHJvcHMiLCJfY29hbGVzY2UiLCJoYW5kbGVyIiwiaGFuZGxlQ2xpY2siLCJoYW5kbGVQb2ludGVyTW92ZSIsImhhbmRsZVN0YXJ0RHJhZ2dpbmciLCJoYW5kbGVTdG9wRHJhZ2dpbmciLCJoYW5kbGVEcmFnZ2luZyIsImFsbEd1aWRlcyIsIm1vZGUiLCJwdXNoIiwiZ2V0R3VpZGVzIiwiZmVhdHVyZXMiLCJ0eXBlIiwiR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsYTs7Ozs7QUFHWCx5QkFBWUMsS0FBWixFQUEyQztBQUFBOztBQUFBOztBQUN6Qzs7QUFEeUM7O0FBRXpDLFVBQUtDLE1BQUwsR0FBY0QsS0FBZDtBQUZ5QztBQUcxQzs7Ozs4QkFHQ0UsUSxFQUVHO0FBQUEsVUFESEMsVUFDRyx1RUFEbUQsSUFDbkQ7QUFDSCxVQUFJQyxNQUFKOztBQUVBLFdBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLSixNQUFMLENBQVlLLE1BQWhDLEVBQXdDRCxDQUFDLEVBQXpDLEVBQTZDO0FBQzNDRCxRQUFBQSxNQUFNLEdBQUdGLFFBQVEsQ0FBQyxLQUFLRCxNQUFMLENBQVlJLENBQVosQ0FBRCxDQUFqQjs7QUFDQSxZQUFJRixVQUFVLEdBQUdBLFVBQVUsQ0FBQ0MsTUFBRCxDQUFiLEdBQXdCQSxNQUF0QyxFQUE4QztBQUM1QztBQUNEO0FBQ0Y7O0FBRUQsYUFBT0EsTUFBUDtBQUNEOzs7Z0NBRVdHLEssRUFBbUJDLEssRUFBMkM7QUFDeEUsV0FBS0MsU0FBTCxDQUFlLFVBQUNDLE9BQUQ7QUFBQSxlQUFhQSxPQUFPLENBQUNDLFdBQVIsQ0FBb0JKLEtBQXBCLEVBQTJCQyxLQUEzQixDQUFiO0FBQUEsT0FBZjtBQUNEOzs7c0NBRWlCRCxLLEVBQXlCQyxLLEVBQTJDO0FBQ3BGLGFBQU8sS0FBS0MsU0FBTCxDQUFlLFVBQUNDLE9BQUQ7QUFBQSxlQUFhQSxPQUFPLENBQUNFLGlCQUFSLENBQTBCTCxLQUExQixFQUFpQ0MsS0FBakMsQ0FBYjtBQUFBLE9BQWYsQ0FBUDtBQUNEOzs7d0NBRW1CRCxLLEVBQTJCQyxLLEVBQTJDO0FBQ3hGLGFBQU8sS0FBS0MsU0FBTCxDQUFlLFVBQUNDLE9BQUQ7QUFBQSxlQUFhQSxPQUFPLENBQUNHLG1CQUFSLENBQTRCTixLQUE1QixFQUFtQ0MsS0FBbkMsQ0FBYjtBQUFBLE9BQWYsQ0FBUDtBQUNEOzs7dUNBRWtCRCxLLEVBQTBCQyxLLEVBQTJDO0FBQ3RGLGFBQU8sS0FBS0MsU0FBTCxDQUFlLFVBQUNDLE9BQUQ7QUFBQSxlQUFhQSxPQUFPLENBQUNJLGtCQUFSLENBQTJCUCxLQUEzQixFQUFrQ0MsS0FBbEMsQ0FBYjtBQUFBLE9BQWYsQ0FBUDtBQUNEOzs7bUNBRWNELEssRUFBc0JDLEssRUFBMkM7QUFDOUUsYUFBTyxLQUFLQyxTQUFMLENBQWUsVUFBQ0MsT0FBRDtBQUFBLGVBQWFBLE9BQU8sQ0FBQ0ssY0FBUixDQUF1QlIsS0FBdkIsRUFBOEJDLEtBQTlCLENBQWI7QUFBQSxPQUFmLENBQVA7QUFDRDs7OzhCQUVTQSxLLEVBQTZEO0FBQ3JFO0FBQ0E7QUFDQTtBQUVBLFVBQU1RLFNBQVMsR0FBRyxFQUFsQjs7QUFMcUUsaURBTWxELEtBQUtmLE1BTjZDO0FBQUE7O0FBQUE7QUFNckUsNERBQWdDO0FBQUEsY0FBckJnQixJQUFxQjtBQUM5QkQsVUFBQUEsU0FBUyxDQUFDRSxJQUFWLE9BQUFGLFNBQVMscUJBQVNDLElBQUksQ0FBQ0UsU0FBTCxDQUFlWCxLQUFmLEVBQXNCWSxRQUEvQixFQUFUO0FBQ0Q7QUFSb0U7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFVckUsYUFBTztBQUNMQyxRQUFBQSxJQUFJLEVBQUUsbUJBREQ7QUFFTEQsUUFBQUEsUUFBUSxFQUFFSjtBQUZMLE9BQVA7QUFJRDs7OztFQTFEZ0NNLGdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7XG4gIE1vZGVQcm9wcyxcbiAgQ2xpY2tFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgRHJhZ2dpbmdFdmVudCxcbiAgR3VpZGVGZWF0dXJlQ29sbGVjdGlvbixcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgR2VvSnNvbkVkaXRNb2RlIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZSc7XG5cbmV4cG9ydCBjbGFzcyBDb21wb3NpdGVNb2RlIGV4dGVuZHMgR2VvSnNvbkVkaXRNb2RlIHtcbiAgX21vZGVzOiBBcnJheTxHZW9Kc29uRWRpdE1vZGU+O1xuXG4gIGNvbnN0cnVjdG9yKG1vZGVzOiBBcnJheTxHZW9Kc29uRWRpdE1vZGU+KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9tb2RlcyA9IG1vZGVzO1xuICB9XG5cbiAgX2NvYWxlc2NlPFQ+KFxuICAgIGNhbGxiYWNrOiAoYXJnMDogR2VvSnNvbkVkaXRNb2RlKSA9PiBULFxuICAgIHJlc3VsdEV2YWw6IChhcmcwOiBUKSA9PiBib29sZWFuIHwgbnVsbCB8IHVuZGVmaW5lZCA9IG51bGxcbiAgKTogVCB7XG4gICAgbGV0IHJlc3VsdDogVDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbW9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdCA9IGNhbGxiYWNrKHRoaXMuX21vZGVzW2ldKTtcbiAgICAgIGlmIChyZXN1bHRFdmFsID8gcmVzdWx0RXZhbChyZXN1bHQpIDogcmVzdWx0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQgYXMgYW55O1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgdGhpcy5fY29hbGVzY2UoKGhhbmRsZXIpID0+IGhhbmRsZXIuaGFuZGxlQ2xpY2soZXZlbnQsIHByb3BzKSk7XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5fY29hbGVzY2UoKGhhbmRsZXIpID0+IGhhbmRsZXIuaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQsIHByb3BzKSk7XG4gIH1cblxuICBoYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvYWxlc2NlKChoYW5kbGVyKSA9PiBoYW5kbGVyLmhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQsIHByb3BzKSk7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge1xuICAgIHJldHVybiB0aGlzLl9jb2FsZXNjZSgoaGFuZGxlcikgPT4gaGFuZGxlci5oYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQsIHByb3BzKSk7XG4gIH1cblxuICBoYW5kbGVEcmFnZ2luZyhldmVudDogRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5fY29hbGVzY2UoKGhhbmRsZXIpID0+IGhhbmRsZXIuaGFuZGxlRHJhZ2dpbmcoZXZlbnQsIHByb3BzKSk7XG4gIH1cblxuICBnZXRHdWlkZXMocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICAvLyBUT0RPOiBDb21iaW5lIHRoZSBndWlkZXMgKkJVVCogbWFrZSBzdXJlIGlmIG5vbmUgb2YgdGhlIHJlc3VsdHMgaGF2ZVxuICAgIC8vIGNoYW5nZWQgdG8gcmV0dXJuIHRoZSBzYW1lIG9iamVjdCBzbyB0aGF0IFwiZ3VpZGVzICE9PSB0aGlzLnN0YXRlLmd1aWRlc1wiXG4gICAgLy8gaW4gZWRpdGFibGUtZ2VvanNvbi1sYXllciB3b3Jrcy5cblxuICAgIGNvbnN0IGFsbEd1aWRlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgbW9kZSBvZiB0aGlzLl9tb2Rlcykge1xuICAgICAgYWxsR3VpZGVzLnB1c2goLi4ubW9kZS5nZXRHdWlkZXMocHJvcHMpLmZlYXR1cmVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgIGZlYXR1cmVzOiBhbGxHdWlkZXMsXG4gICAgfTtcbiAgfVxufVxuIl19