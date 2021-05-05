"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

var styles = {
  item: {
    position: 'absolute',
    userSelect: 'none'
  }
};

var HtmlOverlayItem = /*#__PURE__*/function (_React$Component) {
  _inherits(HtmlOverlayItem, _React$Component);

  var _super = _createSuper(HtmlOverlayItem);

  function HtmlOverlayItem() {
    _classCallCheck(this, HtmlOverlayItem);

    return _super.apply(this, arguments);
  }

  _createClass(HtmlOverlayItem, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          x = _this$props.x,
          y = _this$props.y,
          children = _this$props.children,
          style = _this$props.style,
          coordinates = _this$props.coordinates,
          props = _objectWithoutProperties(_this$props, ["x", "y", "children", "style", "coordinates"]);

      return (
        /*#__PURE__*/
        //@ts-ignore
        React.createElement("div", _extends({
          style: _objectSpread({}, styles.item, {}, style, {
            left: x,
            top: y
          })
        }, props), children)
      );
    }
  }]);

  return HtmlOverlayItem;
}(React.Component);

exports["default"] = HtmlOverlayItem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odG1sLW92ZXJsYXktaXRlbS50c3giXSwibmFtZXMiOlsic3R5bGVzIiwiaXRlbSIsInBvc2l0aW9uIiwidXNlclNlbGVjdCIsIkh0bWxPdmVybGF5SXRlbSIsInByb3BzIiwieCIsInkiLCJjaGlsZHJlbiIsInN0eWxlIiwiY29vcmRpbmF0ZXMiLCJsZWZ0IiwidG9wIiwiUmVhY3QiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLE1BQU0sR0FBRztBQUNiQyxFQUFBQSxJQUFJLEVBQUU7QUFDSkMsSUFBQUEsUUFBUSxFQUFFLFVBRE47QUFFSkMsSUFBQUEsVUFBVSxFQUFFO0FBRlI7QUFETyxDQUFmOztJQWtCcUJDLGU7Ozs7Ozs7Ozs7Ozs7NkJBQ1Y7QUFBQSx3QkFDa0QsS0FBS0MsS0FEdkQ7QUFBQSxVQUNDQyxDQURELGVBQ0NBLENBREQ7QUFBQSxVQUNJQyxDQURKLGVBQ0lBLENBREo7QUFBQSxVQUNPQyxRQURQLGVBQ09BLFFBRFA7QUFBQSxVQUNpQkMsS0FEakIsZUFDaUJBLEtBRGpCO0FBQUEsVUFDd0JDLFdBRHhCLGVBQ3dCQSxXQUR4QjtBQUFBLFVBQ3dDTCxLQUR4Qzs7QUFHUDtBQUFBO0FBQ0U7QUFDQTtBQUFLLFVBQUEsS0FBSyxvQkFBT0wsTUFBTSxDQUFDQyxJQUFkLE1BQXVCUSxLQUF2QjtBQUE4QkUsWUFBQUEsSUFBSSxFQUFFTCxDQUFwQztBQUF1Q00sWUFBQUEsR0FBRyxFQUFFTDtBQUE1QztBQUFWLFdBQStERixLQUEvRCxHQUNHRyxRQURIO0FBRkY7QUFNRDs7OztFQVYwQ0ssS0FBSyxDQUFDQyxTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jb25zdCBzdHlsZXMgPSB7XG4gIGl0ZW06IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB1c2VyU2VsZWN0OiAnbm9uZScsXG4gIH0sXG59O1xuXG50eXBlIFByb3BzID0ge1xuICAvLyBJbmplY3RlZCBieSBIdG1sT3ZlcmxheVxuICB4PzogbnVtYmVyO1xuICB5PzogbnVtYmVyO1xuXG4gIC8vIFVzZXIgcHJvdmlkZWRcbiAgY29vcmRpbmF0ZXM6IG51bWJlcltdO1xuICBjaGlsZHJlbjogYW55O1xuICBzdHlsZT86IFJlY29yZDxzdHJpbmcsIGFueT47XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdG1sT3ZlcmxheUl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHM+IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgeCwgeSwgY2hpbGRyZW4sIHN0eWxlLCBjb29yZGluYXRlcywgLi4ucHJvcHMgfSA9IHRoaXMucHJvcHM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICA8ZGl2IHN0eWxlPXt7IC4uLnN0eWxlcy5pdGVtLCAuLi5zdHlsZSwgbGVmdDogeCwgdG9wOiB5IH19IHsuLi5wcm9wc30+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==