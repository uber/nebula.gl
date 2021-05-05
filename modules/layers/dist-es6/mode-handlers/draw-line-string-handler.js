"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawLineStringHandler = void 0;

var _modeHandler = require("./mode-handler");

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

// TODO edit-modes: delete handlers once EditMode fully implemented
var DrawLineStringHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(DrawLineStringHandler, _ModeHandler);

  var _super = _createSuper(DrawLineStringHandler);

  function DrawLineStringHandler() {
    _classCallCheck(this, DrawLineStringHandler);

    return _super.apply(this, arguments);
  }

  _createClass(DrawLineStringHandler, [{
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(DrawLineStringHandler.prototype), "handleClick", this).call(this, event);

      var editAction = null;
      var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
      var selectedGeometry = this.getSelectedGeometry();
      var tentativeFeature = this.getTentativeFeature();
      var clickSequence = this.getClickSequence();

      if (selectedFeatureIndexes.length > 1 || selectedGeometry && selectedGeometry.type !== 'LineString') {
        console.warn("drawLineString mode only supported for single LineString selection"); // eslint-disable-line

        this.resetClickSequence();
        return null;
      }

      if (selectedGeometry && selectedGeometry.type === 'LineString') {
        // Extend the LineString
        var lineString = selectedGeometry;
        var positionIndexes = [lineString.coordinates.length];
        var modeConfig = this.getModeConfig();

        if (modeConfig && modeConfig.drawAtFront) {
          positionIndexes = [0];
        }

        var featureIndex = selectedFeatureIndexes[0];
        var updatedData = this.getImmutableFeatureCollection().addPosition(featureIndex, positionIndexes, event.groundCoords).getObject();
        editAction = {
          updatedData: updatedData,
          editType: 'addPosition',
          featureIndexes: [featureIndex],
          editContext: {
            positionIndexes: positionIndexes,
            position: event.groundCoords
          }
        };
        this.resetClickSequence();
      } else if (clickSequence.length === 2 && tentativeFeature) {
        // Add a new LineString
        var geometry = tentativeFeature.geometry;
        editAction = this.getAddFeatureAction(geometry);
        this.resetClickSequence();
      }

      return editAction;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event) {
      var result = {
        editAction: null,
        cancelMapPan: false
      };
      var clickSequence = this.getClickSequence();
      var groundCoords = event.groundCoords;
      var startPosition = null;
      var selectedFeatureIndexes = this.getSelectedFeatureIndexes();
      var selectedGeometry = this.getSelectedGeometry();

      if (selectedFeatureIndexes.length > 1 || selectedGeometry && selectedGeometry.type !== 'LineString') {
        // unsupported
        return result;
      }

      if (selectedGeometry && selectedGeometry.type === 'LineString') {
        // Draw an extension line starting from one end of the selected LineString
        startPosition = selectedGeometry.coordinates[selectedGeometry.coordinates.length - 1];
        var modeConfig = this.getModeConfig();

        if (modeConfig && modeConfig.drawAtFront) {
          startPosition = selectedGeometry.coordinates[0];
        }
      } else if (clickSequence.length === 1) {
        startPosition = clickSequence[0];
      }

      if (startPosition) {
        this._setTentativeFeature({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [startPosition, groundCoords]
          }
        });
      }

      return result;
    }
  }]);

  return DrawLineStringHandler;
}(_modeHandler.ModeHandler);

exports.DrawLineStringHandler = DrawLineStringHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL2RyYXctbGluZS1zdHJpbmctaGFuZGxlci50cyJdLCJuYW1lcyI6WyJEcmF3TGluZVN0cmluZ0hhbmRsZXIiLCJldmVudCIsImVkaXRBY3Rpb24iLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwiZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsInNlbGVjdGVkR2VvbWV0cnkiLCJnZXRTZWxlY3RlZEdlb21ldHJ5IiwidGVudGF0aXZlRmVhdHVyZSIsImdldFRlbnRhdGl2ZUZlYXR1cmUiLCJjbGlja1NlcXVlbmNlIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsInR5cGUiLCJjb25zb2xlIiwid2FybiIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsImxpbmVTdHJpbmciLCJwb3NpdGlvbkluZGV4ZXMiLCJjb29yZGluYXRlcyIsIm1vZGVDb25maWciLCJnZXRNb2RlQ29uZmlnIiwiZHJhd0F0RnJvbnQiLCJmZWF0dXJlSW5kZXgiLCJ1cGRhdGVkRGF0YSIsImdldEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiYWRkUG9zaXRpb24iLCJncm91bmRDb29yZHMiLCJnZXRPYmplY3QiLCJlZGl0VHlwZSIsImZlYXR1cmVJbmRleGVzIiwiZWRpdENvbnRleHQiLCJwb3NpdGlvbiIsImdlb21ldHJ5IiwiZ2V0QWRkRmVhdHVyZUFjdGlvbiIsInJlc3VsdCIsImNhbmNlbE1hcFBhbiIsInN0YXJ0UG9zaXRpb24iLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsInByb3BlcnRpZXMiLCJNb2RlSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7SUFDYUEscUI7Ozs7Ozs7Ozs7Ozs7Z0NBQ0NDLEssRUFBa0Q7QUFDNUQsNkZBQWtCQSxLQUFsQjs7QUFFQSxVQUFJQyxVQUF5QyxHQUFHLElBQWhEO0FBQ0EsVUFBTUMsc0JBQXNCLEdBQUcsS0FBS0MseUJBQUws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QUVBLFlBQU1RLFVBQVUsR0FBRyxLQUFLQyxhQUFMLEVBQW5COztBQUNBLFlBQUlELFVBQVUsSUFBSUEsVUFBVSxDQUFDRSxXQUE3QixFQUEwQztBQUN4Q2UsVUFBQUEsYUFBYSxHQUFHL0IsZ0JBQWdCLENBQUNhLFdBQWpCLENBQTZCLENBQTdCLENBQWhCO0FBQ0Q7QUFDRixPQVJELE1BUU8sSUFBSVQsYUFBYSxDQUFDRSxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQ3JDeUIsUUFBQUEsYUFBYSxHQUFHM0IsYUFBYSxDQUFDLENBQUQsQ0FBN0I7QUFDRDs7QUFFRCxVQUFJMkIsYUFBSixFQUFtQjtBQUNqQixhQUFLQyxvQkFBTCxDQUEwQjtBQUN4QnpCLFVBQUFBLElBQUksRUFBRSxTQURrQjtBQUV4QjBCLFVBQUFBLFVBQVUsRUFBRSxFQUZZO0FBR3hCTixVQUFBQSxRQUFRLEVBQUU7QUFDUnBCLFlBQUFBLElBQUksRUFBRSxZQURFO0FBRVJNLFlBQUFBLFdBQVcsRUFBRSxDQUFDa0IsYUFBRCxFQUFnQlYsWUFBaEI7QUFGTDtBQUhjLFNBQTFCO0FBUUQ7O0FBRUQsYUFBT1EsTUFBUDtBQUNEOzs7O0VBcEd3Q0ssd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb3NpdGlvbiwgTGluZVN0cmluZyB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgeyBDbGlja0V2ZW50LCBQb2ludGVyTW92ZUV2ZW50IH0gZnJvbSAnLi4vZXZlbnQtdHlwZXMnO1xuaW1wb3J0IHsgRWRpdEFjdGlvbiwgTW9kZUhhbmRsZXIgfSBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5cbi8vIFRPRE8gZWRpdC1tb2RlczogZGVsZXRlIGhhbmRsZXJzIG9uY2UgRWRpdE1vZGUgZnVsbHkgaW1wbGVtZW50ZWRcbmV4cG9ydCBjbGFzcyBEcmF3TGluZVN0cmluZ0hhbmRsZXIgZXh0ZW5kcyBNb2RlSGFuZGxlciB7XG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50KTogRWRpdEFjdGlvbiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIHN1cGVyLmhhbmRsZUNsaWNrKGV2ZW50KTtcblxuICAgIGxldCBlZGl0QWN0aW9uOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZCA9IG51bGw7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXhlcygpO1xuICAgIGNvbnN0IHNlbGVjdGVkR2VvbWV0cnkgPSB0aGlzLmdldFNlbGVjdGVkR2VvbWV0cnkoKTtcbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgaWYgKFxuICAgICAgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5sZW5ndGggPiAxIHx8XG4gICAgICAoc2VsZWN0ZWRHZW9tZXRyeSAmJiBzZWxlY3RlZEdlb21ldHJ5LnR5cGUgIT09ICdMaW5lU3RyaW5nJylcbiAgICApIHtcbiAgICAgIGNvbnNvbGUud2FybihgZHJhd0xpbmVTdHJpbmcgbW9kZSBvbmx5IHN1cHBvcnRlZCBmb3Igc2luZ2xlIExpbmVTdHJpbmcgc2VsZWN0aW9uYCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgIHRoaXMucmVzZXRDbGlja1NlcXVlbmNlKCk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0ZWRHZW9tZXRyeSAmJiBzZWxlY3RlZEdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgLy8gRXh0ZW5kIHRoZSBMaW5lU3RyaW5nXG4gICAgICBjb25zdCBsaW5lU3RyaW5nOiBMaW5lU3RyaW5nID0gc2VsZWN0ZWRHZW9tZXRyeTtcblxuICAgICAgbGV0IHBvc2l0aW9uSW5kZXhlcyA9IFtsaW5lU3RyaW5nLmNvb3JkaW5hdGVzLmxlbmd0aF07XG5cbiAgICAgIGNvbnN0IG1vZGVDb25maWcgPSB0aGlzLmdldE1vZGVDb25maWcoKTtcbiAgICAgIGlmIChtb2RlQ29uZmlnICYmIG1vZGVDb25maWcuZHJhd0F0RnJvbnQpIHtcbiAgICAgICAgcG9zaXRpb25JbmRleGVzID0gWzBdO1xuICAgICAgfVxuICAgICAgY29uc3QgZmVhdHVyZUluZGV4ID0gc2VsZWN0ZWRGZWF0dXJlSW5kZXhlc1swXTtcbiAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gdGhpcy5nZXRJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbigpXG4gICAgICAgIC5hZGRQb3NpdGlvbihmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgZXZlbnQuZ3JvdW5kQ29vcmRzKVxuICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGVkaXRBY3Rpb24gPSB7XG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0VHlwZTogJ2FkZFBvc2l0aW9uJyxcbiAgICAgICAgZmVhdHVyZUluZGV4ZXM6IFtmZWF0dXJlSW5kZXhdLFxuICAgICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICAgIHBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICBwb3NpdGlvbjogZXZlbnQuZ3JvdW5kQ29vcmRzLFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICB9IGVsc2UgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID09PSAyICYmIHRlbnRhdGl2ZUZlYXR1cmUpIHtcbiAgICAgIC8vIEFkZCBhIG5ldyBMaW5lU3RyaW5nXG4gICAgICBjb25zdCBnZW9tZXRyeTogYW55ID0gdGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeTtcbiAgICAgIGVkaXRBY3Rpb24gPSB0aGlzLmdldEFkZEZlYXR1cmVBY3Rpb24oZ2VvbWV0cnkpO1xuXG4gICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICB9XG5cbiAgaGFuZGxlUG9pbnRlck1vdmUoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnRcbiAgKTogeyBlZGl0QWN0aW9uOiBFZGl0QWN0aW9uIHwgbnVsbCB8IHVuZGVmaW5lZDsgY2FuY2VsTWFwUGFuOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgZWRpdEFjdGlvbjogbnVsbCwgY2FuY2VsTWFwUGFuOiBmYWxzZSB9O1xuXG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgIGNvbnN0IGdyb3VuZENvb3JkcyA9IGV2ZW50Lmdyb3VuZENvb3JkcztcblxuICAgIGxldCBzdGFydFBvc2l0aW9uOiBQb3NpdGlvbiB8IG51bGwgfCB1bmRlZmluZWQgPSBudWxsO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZUluZGV4ZXMoKTtcbiAgICBjb25zdCBzZWxlY3RlZEdlb21ldHJ5ID0gdGhpcy5nZXRTZWxlY3RlZEdlb21ldHJ5KCk7XG5cbiAgICBpZiAoXG4gICAgICBzZWxlY3RlZEZlYXR1cmVJbmRleGVzLmxlbmd0aCA+IDEgfHxcbiAgICAgIChzZWxlY3RlZEdlb21ldHJ5ICYmIHNlbGVjdGVkR2VvbWV0cnkudHlwZSAhPT0gJ0xpbmVTdHJpbmcnKVxuICAgICkge1xuICAgICAgLy8gdW5zdXBwb3J0ZWRcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdGVkR2VvbWV0cnkgJiYgc2VsZWN0ZWRHZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIC8vIERyYXcgYW4gZXh0ZW5zaW9uIGxpbmUgc3RhcnRpbmcgZnJvbSBvbmUgZW5kIG9mIHRoZSBzZWxlY3RlZCBMaW5lU3RyaW5nXG4gICAgICBzdGFydFBvc2l0aW9uID0gc2VsZWN0ZWRHZW9tZXRyeS5jb29yZGluYXRlc1tzZWxlY3RlZEdlb21ldHJ5LmNvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBjb25zdCBtb2RlQ29uZmlnID0gdGhpcy5nZXRNb2RlQ29uZmlnKCk7XG4gICAgICBpZiAobW9kZUNvbmZpZyAmJiBtb2RlQ29uZmlnLmRyYXdBdEZyb250KSB7XG4gICAgICAgIHN0YXJ0UG9zaXRpb24gPSBzZWxlY3RlZEdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY2xpY2tTZXF1ZW5jZS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHN0YXJ0UG9zaXRpb24gPSBjbGlja1NlcXVlbmNlWzBdO1xuICAgIH1cblxuICAgIGlmIChzdGFydFBvc2l0aW9uKSB7XG4gICAgICB0aGlzLl9zZXRUZW50YXRpdmVGZWF0dXJlKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtzdGFydFBvc2l0aW9uLCBncm91bmRDb29yZHNdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19