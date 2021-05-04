"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransformMode = void 0;

var _helpers = require("@turf/helpers");

var _translateMode = require("./translate-mode");

var _scaleMode = require("./scale-mode");

var _rotateMode = require("./rotate-mode");

var _compositeMode = require("./composite-mode");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var TransformMode = /*#__PURE__*/function (_CompositeMode) {
  _inherits(TransformMode, _CompositeMode);

  var _super = _createSuper(TransformMode);

  function TransformMode() {
    _classCallCheck(this, TransformMode);

    return _super.call(this, [new _translateMode.TranslateMode(), new _scaleMode.ScaleMode(), new _rotateMode.RotateMode()]);
  }

  _createClass(TransformMode, [{
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      var updatedCursor = null;

      _get(_getPrototypeOf(TransformMode.prototype), "handlePointerMove", this).call(this, event, _objectSpread({}, props, {
        onUpdateCursor: function onUpdateCursor(cursor) {
          updatedCursor = cursor || updatedCursor;
        }
      }));

      props.onUpdateCursor(updatedCursor);
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      var scaleMode = null;
      var translateMode = null;
      var filteredModes = []; // If the user selects a scaling edit handle that overlaps with part of the selected feature,
      // it is possible for both scale and translate actions to be triggered. This logic prevents
      // this simultaneous action trigger from happening by putting a higher priority on scaling
      // since the user needs to be more precise to hover over a scaling edit handle.

      this._modes.forEach(function (mode) {
        if (mode instanceof _translateMode.TranslateMode) {
          translateMode = mode;
        } else {
          if (mode instanceof _scaleMode.ScaleMode) {
            scaleMode = mode;
          }

          filteredModes.push(mode);
        }
      });

      if (scaleMode instanceof _scaleMode.ScaleMode && !scaleMode.isEditHandleSelected()) {
        filteredModes.push(translateMode);
      }

      filteredModes.filter(Boolean).forEach(function (mode) {
        return mode.handleStartDragging(event, props);
      });
    }
  }, {
    key: "getGuides",
    value: function getGuides(props) {
      var compositeGuides = _get(_getPrototypeOf(TransformMode.prototype), "getGuides", this).call(this, props);

      var rotateMode = (this._modes || []).find(function (mode) {
        return mode instanceof _rotateMode.RotateMode;
      });

      if (rotateMode instanceof _rotateMode.RotateMode) {
        var nonEnvelopeGuides = compositeGuides.features.filter(function (guide) {
          var _ref = guide.properties || {},
              editHandleType = _ref.editHandleType,
              mode = _ref.mode; // Both scale and rotate modes have the same enveloping box as a guide - only need one


          var guidesToFilterOut = [mode]; // Do not render scaling edit handles if rotating

          if (rotateMode.getIsRotating()) {
            guidesToFilterOut.push(editHandleType);
          }

          return !guidesToFilterOut.includes('scale');
        }); // @ts-ignore

        compositeGuides = (0, _helpers.featureCollection)(nonEnvelopeGuides);
      }

      return compositeGuides;
    }
  }]);

  return TransformMode;
}(_compositeMode.CompositeMode);

exports.TransformMode = TransformMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvdHJhbnNmb3JtLW1vZGUudHMiXSwibmFtZXMiOlsiVHJhbnNmb3JtTW9kZSIsIlRyYW5zbGF0ZU1vZGUiLCJTY2FsZU1vZGUiLCJSb3RhdGVNb2RlIiwiZXZlbnQiLCJwcm9wcyIsInVwZGF0ZWRDdXJzb3IiLCJvblVwZGF0ZUN1cnNvciIsImN1cnNvciIsInNjYWxlTW9kZSIsInRyYW5zbGF0ZU1vZGUiLCJmaWx0ZXJlZE1vZGVzIiwiX21vZGVzIiwiZm9yRWFjaCIsIm1vZGUiLCJwdXNoIiwiaXNFZGl0SGFuZGxlU2VsZWN0ZWQiLCJmaWx0ZXIiLCJCb29sZWFuIiwiaGFuZGxlU3RhcnREcmFnZ2luZyIsImNvbXBvc2l0ZUd1aWRlcyIsInJvdGF0ZU1vZGUiLCJmaW5kIiwibm9uRW52ZWxvcGVHdWlkZXMiLCJmZWF0dXJlcyIsImd1aWRlIiwicHJvcGVydGllcyIsImVkaXRIYW5kbGVUeXBlIiwiZ3VpZGVzVG9GaWx0ZXJPdXQiLCJnZXRJc1JvdGF0aW5nIiwiaW5jbHVkZXMiLCJDb21wb3NpdGVNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsYTs7Ozs7QUFDWCwyQkFBYztBQUFBOztBQUFBLDZCQUNOLENBQUMsSUFBSUMsNEJBQUosRUFBRCxFQUFzQixJQUFJQyxvQkFBSixFQUF0QixFQUF1QyxJQUFJQyxzQkFBSixFQUF2QyxDQURNO0FBRWI7Ozs7c0NBRWlCQyxLLEVBQXlCQyxLLEVBQXFDO0FBQzlFLFVBQUlDLGFBQWEsR0FBRyxJQUFwQjs7QUFDQSwyRkFBd0JGLEtBQXhCLG9CQUNLQyxLQURMO0FBRUVFLFFBQUFBLGNBQWMsRUFBRSx3QkFBQ0MsTUFBRCxFQUFZO0FBQzFCRixVQUFBQSxhQUFhLEdBQUdFLE1BQU0sSUFBSUYsYUFBMUI7QUFDRDtBQUpIOztBQU1BRCxNQUFBQSxLQUFLLENBQUNFLGNBQU4sQ0FBcUJELGFBQXJCO0FBQ0Q7Ozt3Q0FFbUJGLEssRUFBMkJDLEssRUFBcUM7QUFDbEYsVUFBSUksU0FBUyxHQUFHLElBQWhCO0FBQ0EsVUFBSUMsYUFBYSxHQUFHLElBQXBCO0FBQ0EsVUFBTUMsYUFBYSxHQUFHLEVBQXRCLENBSGtGLENBS2xGO0FBQ0E7QUFDQTtBQUNBOztBQUNBLFdBQUtDLE1BQUwsQ0FBWUMsT0FBWixDQUFvQixVQUFDQyxJQUFELEVBQVU7QUFDNUIsWUFBSUEsSUFBSSxZQUFZYiw0QkFBcEIsRUFBbUM7QUFDakNTLFVBQUFBLGFBQWEsR0FBR0ksSUFBaEI7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJQSxJQUFJLFlBQVlaLG9CQUFwQixFQUErQjtBQUM3Qk8sWUFBQUEsU0FBUyxHQUFHSyxJQUFaO0FBQ0Q7O0FBQ0RILFVBQUFBLGFBQWEsQ0FBQ0ksSUFBZCxDQUFtQkQsSUFBbkI7QUFDRDtBQUNGLE9BVEQ7O0FBV0EsVUFBSUwsU0FBUyxZQUFZUCxvQkFBckIsSUFBa0MsQ0FBQ08sU0FBUyxDQUFDTyxvQkFBVixFQUF2QyxFQUF5RTtBQUN2RUwsUUFBQUEsYUFBYSxDQUFDSSxJQUFkLENBQW1CTCxhQUFuQjtBQUNEOztBQUVEQyxNQUFBQSxhQUFhLENBQUNNLE1BQWQsQ0FBcUJDLE9BQXJCLEVBQThCTCxPQUE5QixDQUFzQyxVQUFDQyxJQUFEO0FBQUEsZUFBVUEsSUFBSSxDQUFDSyxtQkFBTCxDQUF5QmYsS0FBekIsRUFBZ0NDLEtBQWhDLENBQVY7QUFBQSxPQUF0QztBQUNEOzs7OEJBRVNBLEssRUFBcUM7QUFDN0MsVUFBSWUsZUFBZSxnRkFBbUJmLEtBQW5CLENBQW5COztBQUNBLFVBQU1nQixVQUFVLEdBQUcsQ0FBQyxLQUFLVCxNQUFMLElBQWUsRUFBaEIsRUFBb0JVLElBQXBCLENBQXlCLFVBQUNSLElBQUQ7QUFBQSxlQUFVQSxJQUFJLFlBQVlYLHNCQUExQjtBQUFBLE9BQXpCLENBQW5COztBQUVBLFVBQUlrQixVQUFVLFlBQVlsQixzQkFBMUIsRUFBc0M7QUFDcEMsWUFBTW9CLGlCQUFpQixHQUFHSCxlQUFlLENBQUNJLFFBQWhCLENBQXlCUCxNQUF6QixDQUFnQyxVQUFDUSxLQUFELEVBQVc7QUFBQSxxQkFDakNBLEtBQUssQ0FBQ0MsVUFBUCxJQUE2QixFQURLO0FBQUEsY0FDM0RDLGNBRDJELFFBQzNEQSxjQUQyRDtBQUFBLGNBQzNDYixJQUQyQyxRQUMzQ0EsSUFEMkMsRUFFbkU7OztBQUNBLGNBQU1jLGlCQUFpQixHQUFHLENBQUNkLElBQUQsQ0FBMUIsQ0FIbUUsQ0FJbkU7O0FBQ0EsY0FBSU8sVUFBVSxDQUFDUSxhQUFYLEVBQUosRUFBZ0M7QUFDOUJELFlBQUFBLGlCQUFpQixDQUFDYixJQUFsQixDQUF1QlksY0FBdkI7QUFDRDs7QUFDRCxpQkFBTyxDQUFDQyxpQkFBaUIsQ0FBQ0UsUUFBbEIsQ0FBMkIsT0FBM0IsQ0FBUjtBQUNELFNBVHlCLENBQTFCLENBRG9DLENBV3BDOztBQUNBVixRQUFBQSxlQUFlLEdBQUcsZ0NBQWtCRyxpQkFBbEIsQ0FBbEI7QUFDRDs7QUFDRCxhQUFPSCxlQUFQO0FBQ0Q7Ozs7RUE5RGdDVyw0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgeyBQb2ludGVyTW92ZUV2ZW50LCBNb2RlUHJvcHMsIFN0YXJ0RHJhZ2dpbmdFdmVudCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IEZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcyc7XG5pbXBvcnQgeyBUcmFuc2xhdGVNb2RlIH0gZnJvbSAnLi90cmFuc2xhdGUtbW9kZSc7XG5pbXBvcnQgeyBTY2FsZU1vZGUgfSBmcm9tICcuL3NjYWxlLW1vZGUnO1xuaW1wb3J0IHsgUm90YXRlTW9kZSB9IGZyb20gJy4vcm90YXRlLW1vZGUnO1xuXG5pbXBvcnQgeyBDb21wb3NpdGVNb2RlIH0gZnJvbSAnLi9jb21wb3NpdGUtbW9kZSc7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1Nb2RlIGV4dGVuZHMgQ29tcG9zaXRlTW9kZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFtuZXcgVHJhbnNsYXRlTW9kZSgpLCBuZXcgU2NhbGVNb2RlKCksIG5ldyBSb3RhdGVNb2RlKCldKTtcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGxldCB1cGRhdGVkQ3Vyc29yID0gbnVsbDtcbiAgICBzdXBlci5oYW5kbGVQb2ludGVyTW92ZShldmVudCwge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICBvblVwZGF0ZUN1cnNvcjogKGN1cnNvcikgPT4ge1xuICAgICAgICB1cGRhdGVkQ3Vyc29yID0gY3Vyc29yIHx8IHVwZGF0ZWRDdXJzb3I7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHByb3BzLm9uVXBkYXRlQ3Vyc29yKHVwZGF0ZWRDdXJzb3IpO1xuICB9XG5cbiAgaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGxldCBzY2FsZU1vZGUgPSBudWxsO1xuICAgIGxldCB0cmFuc2xhdGVNb2RlID0gbnVsbDtcbiAgICBjb25zdCBmaWx0ZXJlZE1vZGVzID0gW107XG5cbiAgICAvLyBJZiB0aGUgdXNlciBzZWxlY3RzIGEgc2NhbGluZyBlZGl0IGhhbmRsZSB0aGF0IG92ZXJsYXBzIHdpdGggcGFydCBvZiB0aGUgc2VsZWN0ZWQgZmVhdHVyZSxcbiAgICAvLyBpdCBpcyBwb3NzaWJsZSBmb3IgYm90aCBzY2FsZSBhbmQgdHJhbnNsYXRlIGFjdGlvbnMgdG8gYmUgdHJpZ2dlcmVkLiBUaGlzIGxvZ2ljIHByZXZlbnRzXG4gICAgLy8gdGhpcyBzaW11bHRhbmVvdXMgYWN0aW9uIHRyaWdnZXIgZnJvbSBoYXBwZW5pbmcgYnkgcHV0dGluZyBhIGhpZ2hlciBwcmlvcml0eSBvbiBzY2FsaW5nXG4gICAgLy8gc2luY2UgdGhlIHVzZXIgbmVlZHMgdG8gYmUgbW9yZSBwcmVjaXNlIHRvIGhvdmVyIG92ZXIgYSBzY2FsaW5nIGVkaXQgaGFuZGxlLlxuICAgIHRoaXMuX21vZGVzLmZvckVhY2goKG1vZGUpID0+IHtcbiAgICAgIGlmIChtb2RlIGluc3RhbmNlb2YgVHJhbnNsYXRlTW9kZSkge1xuICAgICAgICB0cmFuc2xhdGVNb2RlID0gbW9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtb2RlIGluc3RhbmNlb2YgU2NhbGVNb2RlKSB7XG4gICAgICAgICAgc2NhbGVNb2RlID0gbW9kZTtcbiAgICAgICAgfVxuICAgICAgICBmaWx0ZXJlZE1vZGVzLnB1c2gobW9kZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoc2NhbGVNb2RlIGluc3RhbmNlb2YgU2NhbGVNb2RlICYmICFzY2FsZU1vZGUuaXNFZGl0SGFuZGxlU2VsZWN0ZWQoKSkge1xuICAgICAgZmlsdGVyZWRNb2Rlcy5wdXNoKHRyYW5zbGF0ZU1vZGUpO1xuICAgIH1cblxuICAgIGZpbHRlcmVkTW9kZXMuZmlsdGVyKEJvb2xlYW4pLmZvckVhY2goKG1vZGUpID0+IG1vZGUuaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudCwgcHJvcHMpKTtcbiAgfVxuXG4gIGdldEd1aWRlcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGxldCBjb21wb3NpdGVHdWlkZXMgPSBzdXBlci5nZXRHdWlkZXMocHJvcHMpO1xuICAgIGNvbnN0IHJvdGF0ZU1vZGUgPSAodGhpcy5fbW9kZXMgfHwgW10pLmZpbmQoKG1vZGUpID0+IG1vZGUgaW5zdGFuY2VvZiBSb3RhdGVNb2RlKTtcblxuICAgIGlmIChyb3RhdGVNb2RlIGluc3RhbmNlb2YgUm90YXRlTW9kZSkge1xuICAgICAgY29uc3Qgbm9uRW52ZWxvcGVHdWlkZXMgPSBjb21wb3NpdGVHdWlkZXMuZmVhdHVyZXMuZmlsdGVyKChndWlkZSkgPT4ge1xuICAgICAgICBjb25zdCB7IGVkaXRIYW5kbGVUeXBlLCBtb2RlIH0gPSAoZ3VpZGUucHJvcGVydGllcyBhcyBhbnkpIHx8IHt9O1xuICAgICAgICAvLyBCb3RoIHNjYWxlIGFuZCByb3RhdGUgbW9kZXMgaGF2ZSB0aGUgc2FtZSBlbnZlbG9waW5nIGJveCBhcyBhIGd1aWRlIC0gb25seSBuZWVkIG9uZVxuICAgICAgICBjb25zdCBndWlkZXNUb0ZpbHRlck91dCA9IFttb2RlXTtcbiAgICAgICAgLy8gRG8gbm90IHJlbmRlciBzY2FsaW5nIGVkaXQgaGFuZGxlcyBpZiByb3RhdGluZ1xuICAgICAgICBpZiAocm90YXRlTW9kZS5nZXRJc1JvdGF0aW5nKCkpIHtcbiAgICAgICAgICBndWlkZXNUb0ZpbHRlck91dC5wdXNoKGVkaXRIYW5kbGVUeXBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIWd1aWRlc1RvRmlsdGVyT3V0LmluY2x1ZGVzKCdzY2FsZScpO1xuICAgICAgfSk7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb21wb3NpdGVHdWlkZXMgPSBmZWF0dXJlQ29sbGVjdGlvbihub25FbnZlbG9wZUd1aWRlcyk7XG4gICAgfVxuICAgIHJldHVybiBjb21wb3NpdGVHdWlkZXM7XG4gIH1cbn1cbiJdfQ==