"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MeasureAreaMode = void 0;

var _area = _interopRequireDefault(require("@turf/area"));

var _centroid = _interopRequireDefault(require("@turf/centroid"));

var _drawPolygonMode = require("./draw-polygon-mode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var DEFAULT_TOOLTIPS = [];

var MeasureAreaMode = /*#__PURE__*/function (_DrawPolygonMode) {
  _inherits(MeasureAreaMode, _DrawPolygonMode);

  var _super = _createSuper(MeasureAreaMode);

  function MeasureAreaMode() {
    _classCallCheck(this, MeasureAreaMode);

    return _super.apply(this, arguments);
  }

  _createClass(MeasureAreaMode, [{
    key: "handleClick",
    value: function handleClick(event, props) {
      var propsWithoutEdit = _objectSpread({}, props, {
        // @ts-ignore
        onEdit: function onEdit() {}
      });

      _get(_getPrototypeOf(MeasureAreaMode.prototype), "handleClick", this).call(this, event, propsWithoutEdit);
    }
  }, {
    key: "getTooltips",
    value: function getTooltips(props) {
      var tentativeGuide = this.getTentativeGuide(props);

      if (tentativeGuide && tentativeGuide.geometry.type === 'Polygon') {
        var modeConfig = props.modeConfig;

        var _ref = modeConfig || {},
            formatTooltip = _ref.formatTooltip,
            measurementCallback = _ref.measurementCallback;

        var units = 'sq. m';
        var centroid = (0, _centroid["default"])(tentativeGuide);
        var area = (0, _area["default"])(tentativeGuide);
        var text;

        if (formatTooltip) {
          text = formatTooltip(area);
        } else {
          // By default, round to 2 decimal places and append units
          // @ts-ignore
          text = "".concat(parseFloat(area).toFixed(2), " ").concat(units);
        }

        if (measurementCallback) {
          measurementCallback(area);
        }

        return [{
          position: centroid.geometry.coordinates,
          text: text
        }];
      }

      return DEFAULT_TOOLTIPS;
    }
  }]);

  return MeasureAreaMode;
}(_drawPolygonMode.DrawPolygonMode);

exports.MeasureAreaMode = MeasureAreaMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbWVhc3VyZS1hcmVhLW1vZGUudHMiXSwibmFtZXMiOlsiREVGQVVMVF9UT09MVElQUyIsIk1lYXN1cmVBcmVhTW9kZSIsImV2ZW50IiwicHJvcHMiLCJwcm9wc1dpdGhvdXRFZGl0Iiwib25FZGl0IiwidGVudGF0aXZlR3VpZGUiLCJnZXRUZW50YXRpdmVHdWlkZSIsImdlb21ldHJ5IiwidHlwZSIsIm1vZGVDb25maWciLCJmb3JtYXRUb29sdGlwIiwibWVhc3VyZW1lbnRDYWxsYmFjayIsInVuaXRzIiwiY2VudHJvaWQiLCJhcmVhIiwidGV4dCIsInBhcnNlRmxvYXQiLCJ0b0ZpeGVkIiwicG9zaXRpb24iLCJjb29yZGluYXRlcyIsIkRyYXdQb2x5Z29uTW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxnQkFBZ0IsR0FBRyxFQUF6Qjs7SUFFYUMsZTs7Ozs7Ozs7Ozs7OztnQ0FDQ0MsSyxFQUFtQkMsSyxFQUFxQztBQUNsRSxVQUFNQyxnQkFBZ0IscUJBQ2pCRCxLQURpQjtBQUVwQjtBQUNBRSxRQUFBQSxNQUFNLEVBQUUsa0JBQU0sQ0FBRTtBQUhJLFFBQXRCOztBQU1BLHVGQUFrQkgsS0FBbEIsRUFBeUJFLGdCQUF6QjtBQUNEOzs7Z0NBRVdELEssRUFBZ0Q7QUFDMUQsVUFBTUcsY0FBYyxHQUFHLEtBQUtDLGlCQUFMLENBQXVCSixLQUF2QixDQUF2Qjs7QUFFQSxVQUFJRyxjQUFjLElBQUlBLGNBQWMsQ0FBQ0UsUUFBZixDQUF3QkMsSUFBeEIsS0FBaUMsU0FBdkQsRUFBa0U7QUFBQSxZQUN4REMsVUFEd0QsR0FDekNQLEtBRHlDLENBQ3hETyxVQUR3RDs7QUFBQSxtQkFFakJBLFVBQVUsSUFBSSxFQUZHO0FBQUEsWUFFeERDLGFBRndELFFBRXhEQSxhQUZ3RDtBQUFBLFlBRXpDQyxtQkFGeUMsUUFFekNBLG1CQUZ5Qzs7QUFHaEUsWUFBTUMsS0FBSyxHQUFHLE9BQWQ7QUFFQSxZQUFNQyxRQUFRLEdBQUcsMEJBQWFSLGNBQWIsQ0FBakI7QUFDQSxZQUFNUyxJQUFJLEdBQUcsc0JBQVNULGNBQVQsQ0FBYjtBQUVBLFlBQUlVLElBQUo7O0FBQ0EsWUFBSUwsYUFBSixFQUFtQjtBQUNqQkssVUFBQUEsSUFBSSxHQUFHTCxhQUFhLENBQUNJLElBQUQsQ0FBcEI7QUFDRCxTQUZELE1BRU87QUFDTDtBQUNBO0FBQ0FDLFVBQUFBLElBQUksYUFBTUMsVUFBVSxDQUFDRixJQUFELENBQVYsQ0FBaUJHLE9BQWpCLENBQXlCLENBQXpCLENBQU4sY0FBcUNMLEtBQXJDLENBQUo7QUFDRDs7QUFFRCxZQUFJRCxtQkFBSixFQUF5QjtBQUN2QkEsVUFBQUEsbUJBQW1CLENBQUNHLElBQUQsQ0FBbkI7QUFDRDs7QUFFRCxlQUFPLENBQ0w7QUFDRUksVUFBQUEsUUFBUSxFQUFFTCxRQUFRLENBQUNOLFFBQVQsQ0FBa0JZLFdBRDlCO0FBRUVKLFVBQUFBLElBQUksRUFBSkE7QUFGRixTQURLLENBQVA7QUFNRDs7QUFDRCxhQUFPaEIsZ0JBQVA7QUFDRDs7OztFQTNDa0NxQixnQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0dXJmQXJlYSBmcm9tICdAdHVyZi9hcmVhJztcbmltcG9ydCB0dXJmQ2VudHJvaWQgZnJvbSAnQHR1cmYvY2VudHJvaWQnO1xuaW1wb3J0IHsgQ2xpY2tFdmVudCwgVG9vbHRpcCwgTW9kZVByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7IERyYXdQb2x5Z29uTW9kZSB9IGZyb20gJy4vZHJhdy1wb2x5Z29uLW1vZGUnO1xuXG5jb25zdCBERUZBVUxUX1RPT0xUSVBTID0gW107XG5cbmV4cG9ydCBjbGFzcyBNZWFzdXJlQXJlYU1vZGUgZXh0ZW5kcyBEcmF3UG9seWdvbk1vZGUge1xuICBoYW5kbGVDbGljayhldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBjb25zdCBwcm9wc1dpdGhvdXRFZGl0ID0ge1xuICAgICAgLi4ucHJvcHMsXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBvbkVkaXQ6ICgpID0+IHt9LFxuICAgIH07XG5cbiAgICBzdXBlci5oYW5kbGVDbGljayhldmVudCwgcHJvcHNXaXRob3V0RWRpdCk7XG4gIH1cblxuICBnZXRUb29sdGlwcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IFRvb2x0aXBbXSB7XG4gICAgY29uc3QgdGVudGF0aXZlR3VpZGUgPSB0aGlzLmdldFRlbnRhdGl2ZUd1aWRlKHByb3BzKTtcblxuICAgIGlmICh0ZW50YXRpdmVHdWlkZSAmJiB0ZW50YXRpdmVHdWlkZS5nZW9tZXRyeS50eXBlID09PSAnUG9seWdvbicpIHtcbiAgICAgIGNvbnN0IHsgbW9kZUNvbmZpZyB9ID0gcHJvcHM7XG4gICAgICBjb25zdCB7IGZvcm1hdFRvb2x0aXAsIG1lYXN1cmVtZW50Q2FsbGJhY2sgfSA9IG1vZGVDb25maWcgfHwge307XG4gICAgICBjb25zdCB1bml0cyA9ICdzcS4gbSc7XG5cbiAgICAgIGNvbnN0IGNlbnRyb2lkID0gdHVyZkNlbnRyb2lkKHRlbnRhdGl2ZUd1aWRlKTtcbiAgICAgIGNvbnN0IGFyZWEgPSB0dXJmQXJlYSh0ZW50YXRpdmVHdWlkZSk7XG5cbiAgICAgIGxldCB0ZXh0O1xuICAgICAgaWYgKGZvcm1hdFRvb2x0aXApIHtcbiAgICAgICAgdGV4dCA9IGZvcm1hdFRvb2x0aXAoYXJlYSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCeSBkZWZhdWx0LCByb3VuZCB0byAyIGRlY2ltYWwgcGxhY2VzIGFuZCBhcHBlbmQgdW5pdHNcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0ZXh0ID0gYCR7cGFyc2VGbG9hdChhcmVhKS50b0ZpeGVkKDIpfSAke3VuaXRzfWA7XG4gICAgICB9XG5cbiAgICAgIGlmIChtZWFzdXJlbWVudENhbGxiYWNrKSB7XG4gICAgICAgIG1lYXN1cmVtZW50Q2FsbGJhY2soYXJlYSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwb3NpdGlvbjogY2VudHJvaWQuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgdGV4dCxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICAgIHJldHVybiBERUZBVUxUX1RPT0xUSVBTO1xuICB9XG59XG4iXX0=