"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MeasureAngleMode = void 0;

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _center = _interopRequireDefault(require("@turf/center"));

var _memoize = _interopRequireDefault(require("../memoize"));

var _geojsonEditMode = require("./geojson-edit-mode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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

var DEFAULT_TOOLTIPS = [];

var MeasureAngleMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(MeasureAngleMode, _GeoJsonEditMode);

  var _super = _createSuper(MeasureAngleMode);

  function MeasureAngleMode() {
    var _this;

    _classCallCheck(this, MeasureAngleMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_getTooltips", (0, _memoize["default"])(function (_ref) {
      var modeConfig = _ref.modeConfig,
          vertex = _ref.vertex,
          point1 = _ref.point1,
          point2 = _ref.point2;
      var tooltips = DEFAULT_TOOLTIPS;

      if (vertex && point1 && point2) {
        var _ref2 = modeConfig || {},
            formatTooltip = _ref2.formatTooltip,
            measurementCallback = _ref2.measurementCallback;

        var units = 'deg';
        var angle1 = (0, _bearing["default"])(vertex, point1);
        var angle2 = (0, _bearing["default"])(vertex, point2);
        var angle = Math.abs(angle1 - angle2);

        if (angle > 180) {
          angle = 360 - angle;
        }

        var text;

        if (formatTooltip) {
          text = formatTooltip(angle);
        } else {
          // By default, round to 2 decimal places and append units
          // @ts-ignore
          text = "".concat(parseFloat(angle).toFixed(2), " ").concat(units);
        }

        if (measurementCallback) {
          measurementCallback(angle);
        }

        var position = (0, _center["default"])({
          type: 'FeatureCollection',
          features: [point1, point2].map(function (p) {
            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: p
              }
            };
          })
        }).geometry.coordinates;
        tooltips = [{
          position: position,
          text: text
        }];
      }

      return tooltips;
    }));

    return _this;
  }

  _createClass(MeasureAngleMode, [{
    key: "handleClick",
    value: function handleClick(event, props) {
      if (this.getClickSequence().length >= 3) {
        this.resetClickSequence();
      }

      this.addClickSequence(event);
    } // Called when the pointer moved, regardless of whether the pointer is down, up, and whether something was picked

  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      props.onUpdateCursor('cell');
    }
  }, {
    key: "getPoints",
    value: function getPoints(props) {
      var clickSequence = this.getClickSequence();

      var points = _toConsumableArray(clickSequence);

      if (clickSequence.length < 3 && props.lastPointerMoveEvent) {
        points.push(props.lastPointerMoveEvent.mapCoords);
      }

      return points;
    } // Return features that can be used as a guide for editing the data

  }, {
    key: "getGuides",
    value: function getGuides(props) {
      var guides = {
        type: 'FeatureCollection',
        features: []
      };
      var features = guides.features;
      var points = this.getPoints(props);

      if (points.length > 2) {
        features.push({
          type: 'Feature',
          properties: {
            guideType: 'tentative'
          },
          geometry: {
            type: 'LineString',
            coordinates: [points[1], points[0], points[2]]
          }
        });
      } else if (points.length > 1) {
        features.push({
          type: 'Feature',
          properties: {
            guideType: 'tentative'
          },
          geometry: {
            type: 'LineString',
            coordinates: [points[1], points[0]]
          }
        });
      }

      return guides;
    }
  }, {
    key: "getTooltips",
    value: function getTooltips(props) {
      var points = this.getPoints(props);
      return this._getTooltips({
        modeConfig: props.modeConfig,
        vertex: points[0],
        point1: points[1],
        point2: points[2]
      });
    }
  }]);

  return MeasureAngleMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.MeasureAngleMode = MeasureAngleMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbWVhc3VyZS1hbmdsZS1tb2RlLnRzIl0sIm5hbWVzIjpbIkRFRkFVTFRfVE9PTFRJUFMiLCJNZWFzdXJlQW5nbGVNb2RlIiwibW9kZUNvbmZpZyIsInZlcnRleCIsInBvaW50MSIsInBvaW50MiIsInRvb2x0aXBzIiwiZm9ybWF0VG9vbHRpcCIsIm1lYXN1cmVtZW50Q2FsbGJhY2siLCJ1bml0cyIsImFuZ2xlMSIsImFuZ2xlMiIsImFuZ2xlIiwiTWF0aCIsImFicyIsInRleHQiLCJwYXJzZUZsb2F0IiwidG9GaXhlZCIsInBvc2l0aW9uIiwidHlwZSIsImZlYXR1cmVzIiwibWFwIiwicCIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJldmVudCIsInByb3BzIiwiZ2V0Q2xpY2tTZXF1ZW5jZSIsImxlbmd0aCIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsImFkZENsaWNrU2VxdWVuY2UiLCJvblVwZGF0ZUN1cnNvciIsImNsaWNrU2VxdWVuY2UiLCJwb2ludHMiLCJsYXN0UG9pbnRlck1vdmVFdmVudCIsInB1c2giLCJtYXBDb29yZHMiLCJndWlkZXMiLCJnZXRQb2ludHMiLCJwcm9wZXJ0aWVzIiwiZ3VpZGVUeXBlIiwiX2dldFRvb2x0aXBzIiwiR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7O0FBRUE7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxnQkFBZ0IsR0FBRyxFQUF6Qjs7SUFFYUMsZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7bUVBQ0kseUJBQVEsZ0JBQTRDO0FBQUEsVUFBekNDLFVBQXlDLFFBQXpDQSxVQUF5QztBQUFBLFVBQTdCQyxNQUE2QixRQUE3QkEsTUFBNkI7QUFBQSxVQUFyQkMsTUFBcUIsUUFBckJBLE1BQXFCO0FBQUEsVUFBYkMsTUFBYSxRQUFiQSxNQUFhO0FBQ2pFLFVBQUlDLFFBQVEsR0FBR04sZ0JBQWY7O0FBRUEsVUFB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UUFBQUEsTUFBTSxFQUFFNEIsTUFBTSxDQUFDLENBQUQ7QUFKUyxPQUFsQixDQUFQO0FBTUQ7Ozs7RUFsSG1DUyxnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0dXJmQmVhcmluZyBmcm9tICdAdHVyZi9iZWFyaW5nJztcbi8vIEB0cy1pZ25vcmVcbmltcG9ydCB0dXJmQ2VudGVyIGZyb20gJ0B0dXJmL2NlbnRlcic7XG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgbWVtb2l6ZSBmcm9tICcuLi9tZW1vaXplJztcblxuaW1wb3J0IHsgQ2xpY2tFdmVudCwgUG9pbnRlck1vdmVFdmVudCwgVG9vbHRpcCwgTW9kZVByb3BzLCBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7IEdlb0pzb25FZGl0TW9kZSB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUnO1xuXG5jb25zdCBERUZBVUxUX1RPT0xUSVBTID0gW107XG5cbmV4cG9ydCBjbGFzcyBNZWFzdXJlQW5nbGVNb2RlIGV4dGVuZHMgR2VvSnNvbkVkaXRNb2RlIHtcbiAgX2dldFRvb2x0aXBzID0gbWVtb2l6ZSgoeyBtb2RlQ29uZmlnLCB2ZXJ0ZXgsIHBvaW50MSwgcG9pbnQyIH0pID0+IHtcbiAgICBsZXQgdG9vbHRpcHMgPSBERUZBVUxUX1RPT0xUSVBTO1xuXG4gICAgaWYgKHZlcnRleCAmJiBwb2ludDEgJiYgcG9pbnQyKSB7XG4gICAgICBjb25zdCB7IGZvcm1hdFRvb2x0aXAsIG1lYXN1cmVtZW50Q2FsbGJhY2sgfSA9IG1vZGVDb25maWcgfHwge307XG4gICAgICBjb25zdCB1bml0cyA9ICdkZWcnO1xuXG4gICAgICBjb25zdCBhbmdsZTEgPSB0dXJmQmVhcmluZyh2ZXJ0ZXgsIHBvaW50MSk7XG4gICAgICBjb25zdCBhbmdsZTIgPSB0dXJmQmVhcmluZyh2ZXJ0ZXgsIHBvaW50Mik7XG4gICAgICBsZXQgYW5nbGUgPSBNYXRoLmFicyhhbmdsZTEgLSBhbmdsZTIpO1xuICAgICAgaWYgKGFuZ2xlID4gMTgwKSB7XG4gICAgICAgIGFuZ2xlID0gMzYwIC0gYW5nbGU7XG4gICAgICB9XG5cbiAgICAgIGxldCB0ZXh0O1xuICAgICAgaWYgKGZvcm1hdFRvb2x0aXApIHtcbiAgICAgICAgdGV4dCA9IGZvcm1hdFRvb2x0aXAoYW5nbGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnkgZGVmYXVsdCwgcm91bmQgdG8gMiBkZWNpbWFsIHBsYWNlcyBhbmQgYXBwZW5kIHVuaXRzXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGV4dCA9IGAke3BhcnNlRmxvYXQoYW5nbGUpLnRvRml4ZWQoMil9ICR7dW5pdHN9YDtcbiAgICAgIH1cblxuICAgICAgaWYgKG1lYXN1cmVtZW50Q2FsbGJhY2spIHtcbiAgICAgICAgbWVhc3VyZW1lbnRDYWxsYmFjayhhbmdsZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gdHVyZkNlbnRlcih7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICAgIGZlYXR1cmVzOiBbcG9pbnQxLCBwb2ludDJdLm1hcCgocCkgPT4gKHtcbiAgICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICAgICAgICBjb29yZGluYXRlczogcCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSksXG4gICAgICB9KS5nZW9tZXRyeS5jb29yZGluYXRlcztcblxuICAgICAgdG9vbHRpcHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICB0ZXh0LFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9vbHRpcHM7XG4gIH0pO1xuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IHZvaWQge1xuICAgIGlmICh0aGlzLmdldENsaWNrU2VxdWVuY2UoKS5sZW5ndGggPj0gMykge1xuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICB9XG5cbiAgICB0aGlzLmFkZENsaWNrU2VxdWVuY2UoZXZlbnQpO1xuICB9XG5cbiAgLy8gQ2FsbGVkIHdoZW4gdGhlIHBvaW50ZXIgbW92ZWQsIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgcG9pbnRlciBpcyBkb3duLCB1cCwgYW5kIHdoZXRoZXIgc29tZXRoaW5nIHdhcyBwaWNrZWRcbiAgaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogdm9pZCB7XG4gICAgcHJvcHMub25VcGRhdGVDdXJzb3IoJ2NlbGwnKTtcbiAgfVxuXG4gIGdldFBvaW50cyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGNvbnN0IHBvaW50cyA9IFsuLi5jbGlja1NlcXVlbmNlXTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA8IDMgJiYgcHJvcHMubGFzdFBvaW50ZXJNb3ZlRXZlbnQpIHtcbiAgICAgIHBvaW50cy5wdXNoKHByb3BzLmxhc3RQb2ludGVyTW92ZUV2ZW50Lm1hcENvb3Jkcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvaW50cztcbiAgfVxuXG4gIC8vIFJldHVybiBmZWF0dXJlcyB0aGF0IGNhbiBiZSB1c2VkIGFzIGEgZ3VpZGUgZm9yIGVkaXRpbmcgdGhlIGRhdGFcbiAgZ2V0R3VpZGVzKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogR3VpZGVGZWF0dXJlQ29sbGVjdGlvbiB7XG4gICAgY29uc3QgZ3VpZGVzOiBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uID0geyB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLCBmZWF0dXJlczogW10gfTtcbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSBndWlkZXM7XG5cbiAgICBjb25zdCBwb2ludHMgPSB0aGlzLmdldFBvaW50cyhwcm9wcyk7XG5cbiAgICBpZiAocG9pbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIGZlYXR1cmVzLnB1c2goe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgZ3VpZGVUeXBlOiAndGVudGF0aXZlJyB9LFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgICBjb29yZGluYXRlczogW3BvaW50c1sxXSwgcG9pbnRzWzBdLCBwb2ludHNbMl1dLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChwb2ludHMubGVuZ3RoID4gMSkge1xuICAgICAgZmVhdHVyZXMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgcHJvcGVydGllczogeyBndWlkZVR5cGU6ICd0ZW50YXRpdmUnIH0sXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbcG9pbnRzWzFdLCBwb2ludHNbMF1dLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGd1aWRlcztcbiAgfVxuXG4gIGdldFRvb2x0aXBzKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogVG9vbHRpcFtdIHtcbiAgICBjb25zdCBwb2ludHMgPSB0aGlzLmdldFBvaW50cyhwcm9wcyk7XG5cbiAgICByZXR1cm4gdGhpcy5fZ2V0VG9vbHRpcHMoe1xuICAgICAgbW9kZUNvbmZpZzogcHJvcHMubW9kZUNvbmZpZyxcbiAgICAgIHZlcnRleDogcG9pbnRzWzBdLFxuICAgICAgcG9pbnQxOiBwb2ludHNbMV0sXG4gICAgICBwb2ludDI6IHBvaW50c1syXSxcbiAgICB9KTtcbiAgfVxufVxuIl19