"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompositeModeHandler = void 0;

var _modeHandler = require("./mode-handler");

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
var CompositeModeHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(CompositeModeHandler, _ModeHandler);

  var _super = _createSuper(CompositeModeHandler);

  function CompositeModeHandler(handlers) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, CompositeModeHandler);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "handlers", void 0);

    _defineProperty(_assertThisInitialized(_this), "options", void 0);

    _this.handlers = handlers;
    _this.options = options;
    return _this;
  }

  _createClass(CompositeModeHandler, [{
    key: "_coalesce",
    value: function _coalesce(callback) {
      var resultEval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var result;

      for (var i = 0; i < this.handlers.length; i++) {
        result = callback(this.handlers[i]);

        if (resultEval ? resultEval(result) : result) {
          break;
        }
      }

      return result;
    }
  }, {
    key: "setFeatureCollection",
    value: function setFeatureCollection(featureCollection) {
      this.handlers.forEach(function (handler) {
        return handler.setFeatureCollection(featureCollection);
      });
    }
  }, {
    key: "setModeConfig",
    value: function setModeConfig(modeConfig) {
      this.handlers.forEach(function (handler) {
        return handler.setModeConfig(modeConfig);
      });
    }
  }, {
    key: "setSelectedFeatureIndexes",
    value: function setSelectedFeatureIndexes(indexes) {
      this.handlers.forEach(function (handler) {
        return handler.setSelectedFeatureIndexes(indexes);
      });
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      return this._coalesce(function (handler) {
        return handler.handleClick(event);
      });
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      return this._coalesce(function (handler) {
        return handler.handlePointerMove(event);
      }, function (result) {
        return result && Boolean(result.editAction);
      });
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event) {
      return this._coalesce(function (handler) {
        return handler.handleStartDragging(event);
      });
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event) {
      return this._coalesce(function (handler) {
        return handler.handleStopDragging(event);
      });
    }
  }, {
    key: "getTentativeFeature",
    value: function getTentativeFeature() {
      return this._coalesce(function (handler) {
        return handler.getTentativeFeature();
      });
    }
  }, {
    key: "getEditHandles",
    value: function getEditHandles(picks, groundCoords) {
      // TODO: Combine the handles *BUT* make sure if none of the results have
      // changed to return the same object so that "editHandles !== this.state.editHandles"
      // in editable-geojson-layer works.
      return this._coalesce(function (handler) {
        return handler.getEditHandles(picks, groundCoords);
      }, function (handles) {
        return Array.isArray(handles) && handles.length > 0;
      });
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;
      return this._coalesce(function (handler) {
        return handler.getCursor({
          isDragging: isDragging
        });
      });
    }
  }]);

  return CompositeModeHandler;
}(_modeHandler.ModeHandler);

exports.CompositeModeHandler = CompositeModeHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2NvbXBvc2l0ZS1tb2RlLWhhbmRsZXIudHMiXSwibmFtZXMiOlsiQ29tcG9zaXRlTW9kZUhhbmRsZXIiLCJoYW5kbGVycyIsIm9wdGlvbnMiLCJjYWxsYmFjayIsInJlc3VsdEV2YWwiLCJyZXN1bHQiLCJpIiwibGVuZ3RoIiwiZmVhdHVyZUNvbGxlY3Rpb24iLCJmb3JFYWNoIiwiaGFuZGxlciIsInNldEZlYXR1cmVDb2xsZWN0aW9uIiwibW9kZUNvbmZpZyIsInNldE1vZGVDb25maWciLCJpbmRleGVzIiwic2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsImV2ZW50IiwiX2NvYWxlc2NlIiwiaGFuZGxlQ2xpY2siLCJoYW5kbGVQb2ludGVyTW92ZSIsIkJvb2xlYW4iLCJlZGl0QWN0aW9uIiwiaGFuZGxlU3RhcnREcmFnZ2luZyIsImhhbmRsZVN0b3BEcmFnZ2luZyIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJwaWNrcyIsImdyb3VuZENvb3JkcyIsImdldEVkaXRIYW5kbGVzIiwiaGFuZGxlcyIsIkFycmF5IiwiaXNBcnJheSIsImlzRHJhZ2dpbmciLCJnZXRDdXJzb3IiLCJNb2RlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQU9BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0lBQ2FBLG9COzs7OztBQUlYLGdDQUFZQyxRQUFaLEVBQTZFO0FBQUE7O0FBQUEsUUFBbkNDLE9BQW1DLHVFQUFKLEVBQUk7O0FBQUE7O0FBQzNFOztBQUQyRTs7QUFBQTs7QUFFM0UsVUFBS0QsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxVQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFIMkU7QUFJNUU7Ozs7OEJBR0NDLFEsRUFFRztBQUFBLFVBREhDLFVBQ0csdUVBRG1ELElBQ25EO0FBQ0gsVUFBSUMsTUFBSjs7QUFFQSxXQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS0wsUUFBTCxDQUFjTSxNQUFsQyxFQUEwQ0QsQ0FBQyxFQUEzQyxFQUErQztBQUM3Q0QsUUFBQUEsTUFBTSxHQUFHRixRQUFRLENBQUMsS0FBS0YsUUFBTCxDQUFjSyxDQUFkLENBQUQsQ0FBakI7O0FBQ0EsWUFBSUYsVUFBVSxHQUFHQSxVQUFVLENBQUNDLE1BQUQsQ0FBYixHQUF3QkEsTUFBdEMsRUFBOEM7QUFDNUM7QUFDRDtBQUNGOztBQUVELGFBQU9BLE1BQVA7QUFDRDs7O3lDQUVvQkcsaUIsRUFBNEM7QUFDL0QsV0FBS1AsUUFBTCxDQUFjUSxPQUFkLENBQXNCLFVBQUNDLE9BQUQ7QUFBQSxlQUFhQSxPQUFPLENBQUNDLG9CQUFSLENBQTZCSCxpQkFBN0IsQ0FBYjtBQUFBLE9BQXRCO0FBQ0Q7OztrQ0FFYUksVSxFQUF1QjtBQUNuQyxXQUFLWCxRQUFMLENBQWNRLE9BQWQsQ0FBc0IsVUFBQ0MsT0FBRDtBQUFBLGVBQWFBLE9BQU8sQ0FBQ0csYUFBUixDQUFzQkQsVUFBdEIsQ0FBYjtBQUFBLE9BQXRCO0FBQ0Q7Ozs4Q0FFeUJFLE8sRUFBeUI7QUFDakQsV0FBS2IsUUFBTCxDQUFjUSxPQUFkLENBQXNCLFVBQUNDLE9BQUQ7QUFBQSxlQUFhQSxPQUFPLENBQUNLLHlCQUFSLENBQWtDRCxPQUFsQyxDQUFiO0FBQUEsT0FBdEI7QUFDRDs7O2dDQUVXRSxLLEVBQWtEO0FBQzVELGFBQU8sS0FBS0MsU0FBTCxDQUFlLFVBQUNQLE9BQUQ7QUFBQSxlQUFhQSxPQUFPLENBQUNRLFdBQVIsQ0FBb0JGLEtBQXBCLENBQWI7QUFBQSxPQUFmLENBQVA7QUFDRDs7O3NDQUdDQSxLLEVBQ3NFO0FBQ3RFLGFBQU8sS0FBS0MsU0FBTCxDQUNMLFVBQUNQLE9BQUQ7QUFBQSxlQUFhQSxPQUFPLENBQUNTLGlCQUFSLENBQTBCSCxLQUExQixDQUFiO0FBQUEsT0FESyxFQUVMLFVBQUNYLE1BQUQ7QUFBQSxlQUFZQSxNQUFNLElBQUllLE9BQU8sQ0FBQ2YsTUFBTSxDQUFDZ0IsVUFBUixDQUE3QjtBQUFBLE9BRkssQ0FBUDtBQUlEOzs7d0NBRW1CTCxLLEVBQTBEO0FBQzVFLGFBQU8sS0FBS0MsU0FBTCxDQUFlLFVBQUNQLE9BQUQ7QUFBQSxlQUFhQSxPQUFPLENBQUNZLG1CQUFSLENBQTRCTixLQUE1QixDQUFiO0FBQUEsT0FBZixDQUFQO0FBQ0Q7Ozt1Q0FFa0JBLEssRUFBeUQ7QUFDMUUsYUFBTyxLQUFLQyxTQUFMLENBQWUsVUFBQ1AsT0FBRDtBQUFBLGVBQWFBLE9BQU8sQ0FBQ2Esa0JBQVIsQ0FBMkJQLEtBQTNCLENBQWI7QUFBQSxPQUFmLENBQVA7QUFDRDs7OzBDQUVpRDtBQUNoRCxhQUFPLEtBQUtDLFNBQUwsQ0FBZSxVQUFDUCxPQUFEO0FBQUEsZUFBYUEsT0FBTyxDQUFDYyxtQkFBUixFQUFiO0FBQUEsT0FBZixDQUFQO0FBQ0Q7OzttQ0FFY0MsSyxFQUFvQ0MsWSxFQUF1QztBQUN4RjtBQUNBO0FBQ0E7QUFDQSxhQUFPLEtBQUtULFNBQUwsQ0FDTCxVQUFDUCxPQUFEO0FBQUEsZUFBYUEsT0FBTyxDQUFDaUIsY0FBUixDQUF1QkYsS0FBdkIsRUFBOEJDLFlBQTlCLENBQWI7QUFBQSxPQURLLEVBRUwsVUFBQ0UsT0FBRDtBQUFBLGVBQWFDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixPQUFkLEtBQTBCQSxPQUFPLENBQUNyQixNQUFSLEdBQWlCLENBQXhEO0FBQUEsT0FGSyxDQUFQO0FBSUQ7OztvQ0FFMEQ7QUFBQSxVQUEvQ3dCLFVBQStDLFFBQS9DQSxVQUErQztBQUN6RCxhQUFPLEtBQUtkLFNBQUwsQ0FBZSxVQUFDUCxPQUFEO0FBQUEsZUFBYUEsT0FBTyxDQUFDc0IsU0FBUixDQUFrQjtBQUFFRCxVQUFBQSxVQUFVLEVBQVZBO0FBQUYsU0FBbEIsQ0FBYjtBQUFBLE9BQWYsQ0FBUDtBQUNEOzs7O0VBM0V1Q0Usd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGZWF0dXJlQ29sbGVjdGlvbiwgRmVhdHVyZSwgUG9zaXRpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHtcbiAgQ2xpY2tFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbn0gZnJvbSAnLi4vZXZlbnQtdHlwZXMnO1xuaW1wb3J0IHsgTW9kZUhhbmRsZXIsIEVkaXRBY3Rpb24sIEVkaXRIYW5kbGUgfSBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBDb21wb3NpdGVNb2RlSGFuZGxlciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgaGFuZGxlcnM6IEFycmF5PE1vZGVIYW5kbGVyPjtcbiAgb3B0aW9uczogUmVjb3JkPHN0cmluZywgYW55PjtcblxuICBjb25zdHJ1Y3RvcihoYW5kbGVyczogQXJyYXk8TW9kZUhhbmRsZXI+LCBvcHRpb25zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuaGFuZGxlcnMgPSBoYW5kbGVycztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgX2NvYWxlc2NlPFQ+KFxuICAgIGNhbGxiYWNrOiAoYXJnMDogTW9kZUhhbmRsZXIpID0+IFQsXG4gICAgcmVzdWx0RXZhbDogKGFyZzA6IFQpID0+IGJvb2xlYW4gfCBudWxsIHwgdW5kZWZpbmVkID0gbnVsbFxuICApOiBUIHtcbiAgICBsZXQgcmVzdWx0OiBUO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHQgPSBjYWxsYmFjayh0aGlzLmhhbmRsZXJzW2ldKTtcbiAgICAgIGlmIChyZXN1bHRFdmFsID8gcmVzdWx0RXZhbChyZXN1bHQpIDogcmVzdWx0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQgYXMgYW55O1xuICB9XG5cbiAgc2V0RmVhdHVyZUNvbGxlY3Rpb24oZmVhdHVyZUNvbGxlY3Rpb246IEZlYXR1cmVDb2xsZWN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5oYW5kbGVycy5mb3JFYWNoKChoYW5kbGVyKSA9PiBoYW5kbGVyLnNldEZlYXR1cmVDb2xsZWN0aW9uKGZlYXR1cmVDb2xsZWN0aW9uKSk7XG4gIH1cblxuICBzZXRNb2RlQ29uZmlnKG1vZGVDb25maWc6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuaGFuZGxlcnMuZm9yRWFjaCgoaGFuZGxlcikgPT4gaGFuZGxlci5zZXRNb2RlQ29uZmlnKG1vZGVDb25maWcpKTtcbiAgfVxuXG4gIHNldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoaW5kZXhlczogbnVtYmVyW10pOiB2b2lkIHtcbiAgICB0aGlzLmhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IGhhbmRsZXIuc2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyhpbmRleGVzKSk7XG4gIH1cblxuICBoYW5kbGVDbGljayhldmVudDogQ2xpY2tFdmVudCk6IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fY29hbGVzY2UoKGhhbmRsZXIpID0+IGhhbmRsZXIuaGFuZGxlQ2xpY2soZXZlbnQpKTtcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKFxuICAgIGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50XG4gICk6IHsgZWRpdEFjdGlvbjogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQ7IGNhbmNlbE1hcFBhbjogYm9vbGVhbiB9IHtcbiAgICByZXR1cm4gdGhpcy5fY29hbGVzY2UoXG4gICAgICAoaGFuZGxlcikgPT4gaGFuZGxlci5oYW5kbGVQb2ludGVyTW92ZShldmVudCksXG4gICAgICAocmVzdWx0KSA9PiByZXN1bHQgJiYgQm9vbGVhbihyZXN1bHQuZWRpdEFjdGlvbilcbiAgICApO1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KTogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9jb2FsZXNjZSgoaGFuZGxlcikgPT4gaGFuZGxlci5oYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50KSk7XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50KTogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9jb2FsZXNjZSgoaGFuZGxlcikgPT4gaGFuZGxlci5oYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQpKTtcbiAgfVxuXG4gIGdldFRlbnRhdGl2ZUZlYXR1cmUoKTogRmVhdHVyZSB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9jb2FsZXNjZSgoaGFuZGxlcikgPT4gaGFuZGxlci5nZXRUZW50YXRpdmVGZWF0dXJlKCkpO1xuICB9XG5cbiAgZ2V0RWRpdEhhbmRsZXMocGlja3M/OiBBcnJheTxSZWNvcmQ8c3RyaW5nLCBhbnk+PiwgZ3JvdW5kQ29vcmRzPzogUG9zaXRpb24pOiBFZGl0SGFuZGxlW10ge1xuICAgIC8vIFRPRE86IENvbWJpbmUgdGhlIGhhbmRsZXMgKkJVVCogbWFrZSBzdXJlIGlmIG5vbmUgb2YgdGhlIHJlc3VsdHMgaGF2ZVxuICAgIC8vIGNoYW5nZWQgdG8gcmV0dXJuIHRoZSBzYW1lIG9iamVjdCBzbyB0aGF0IFwiZWRpdEhhbmRsZXMgIT09IHRoaXMuc3RhdGUuZWRpdEhhbmRsZXNcIlxuICAgIC8vIGluIGVkaXRhYmxlLWdlb2pzb24tbGF5ZXIgd29ya3MuXG4gICAgcmV0dXJuIHRoaXMuX2NvYWxlc2NlKFxuICAgICAgKGhhbmRsZXIpID0+IGhhbmRsZXIuZ2V0RWRpdEhhbmRsZXMocGlja3MsIGdyb3VuZENvb3JkcyksXG4gICAgICAoaGFuZGxlcykgPT4gQXJyYXkuaXNBcnJheShoYW5kbGVzKSAmJiBoYW5kbGVzLmxlbmd0aCA+IDBcbiAgICApO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKHsgaXNEcmFnZ2luZyB9OiB7IGlzRHJhZ2dpbmc6IGJvb2xlYW4gfSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2NvYWxlc2NlKChoYW5kbGVyKSA9PiBoYW5kbGVyLmdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfSkpO1xuICB9XG59XG4iXX0=