"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
  mainContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none'
  }
};

var HtmlOverlay = /*#__PURE__*/function (_React$Component) {
  _inherits(HtmlOverlay, _React$Component);

  var _super = _createSuper(HtmlOverlay);

  function HtmlOverlay() {
    _classCallCheck(this, HtmlOverlay);

    return _super.apply(this, arguments);
  }

  _createClass(HtmlOverlay, [{
    key: "getItems",
    // Override this to provide your items
    value: function getItems() {
      var children = this.props.children;

      if (children) {
        return Array.isArray(children) ? children : [children];
      }

      return [];
    }
  }, {
    key: "getCoords",
    value: function getCoords(coordinates) {
      var pos = this.props.viewport.project(coordinates);
      if (!pos) return [-1, -1];
      return pos;
    }
  }, {
    key: "inView",
    value: function inView(_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          x = _ref2[0],
          y = _ref2[1];

      var _this$props$viewport = this.props.viewport,
          width = _this$props$viewport.width,
          height = _this$props$viewport.height;
      return !(x < 0 || y < 0 || x > width || y > height);
    }
  }, {
    key: "scaleWithZoom",
    value: function scaleWithZoom(n) {
      var zoom = this.props.viewport.zoom;
      return n / Math.pow(2, 20 - zoom);
    }
  }, {
    key: "breakpointWithZoom",
    value: function breakpointWithZoom(threshold, a, b) {
      var zoom = this.props.viewport.zoom;
      return zoom > threshold ? a : b;
    }
  }, {
    key: "getViewport",
    value: function getViewport() {
      return this.props.viewport;
    }
  }, {
    key: "getZoom",
    value: function getZoom() {
      return this.props.viewport.zoom;
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props$zIndex = this.props.zIndex,
          zIndex = _this$props$zIndex === void 0 ? 1 : _this$props$zIndex;
      var style = Object.assign({
        zIndex: zIndex
      }, styles.mainContainer);
      var renderItems = [];
      this.getItems().filter(Boolean).forEach(function (item, index) {
        var _this$getCoords = _this.getCoords(item.props.coordinates),
            _this$getCoords2 = _slicedToArray(_this$getCoords, 2),
            x = _this$getCoords2[0],
            y = _this$getCoords2[1];

        if (_this.inView([x, y])) {
          var key = item.key === null || item.key === undefined ? index : item.key;
          renderItems.push(React.cloneElement(item, {
            x: x,
            y: y,
            key: key
          }));
        }
      });
      return /*#__PURE__*/React.createElement("div", {
        style: style
      }, renderItems);
    }
  }]);

  return HtmlOverlay;
}(React.Component); // This is needed for Deck.gl 8.0+
//@ts-ignore


exports["default"] = HtmlOverlay;
HtmlOverlay.deckGLViewProps = true;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odG1sLW92ZXJsYXkudHN4Il0sIm5hbWVzIjpbInN0eWxlcyIsIm1haW5Db250YWluZXIiLCJ3aWR0aCIsImhlaWdodCIsInBvc2l0aW9uIiwicG9pbnRlckV2ZW50cyIsIkh0bWxPdmVybGF5IiwiY2hpbGRyZW4iLCJwcm9wcyIsIkFycmF5IiwiaXNBcnJheSIsImNvb3JkaW5hdGVzIiwicG9zIiwidmlld3BvcnQiLCJwcm9qZWN0IiwieCIsInkiLCJuIiwiem9vbSIsIk1hdGgiLCJwb3ciLCJ0aHJlc2hvbGQiLCJhIiwiYiIsInpJbmRleCIsInN0eWxlIiwiT2JqZWN0IiwiYXNzaWduIiwicmVuZGVySXRlbXMiLCJnZXRJdGVtcyIsImZpbHRlciIsIkJvb2xlYW4iLCJmb3JFYWNoIiwiaXRlbSIsImluZGV4IiwiZ2V0Q29vcmRzIiwiaW5WaWV3Iiwia2V5IiwidW5kZWZpbmVkIiwicHVzaCIsIlJlYWN0IiwiY2xvbmVFbGVtZW50IiwiQ29tcG9uZW50IiwiZGVja0dMVmlld1Byb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxNQUFNLEdBQUc7QUFDYkMsRUFBQUEsYUFBYSxFQUFFO0FBQ2JDLElBQUFBLEtBQUssRUFBRSxNQURNO0FBRWJDLElBQUFBLE1BQU0sRUFBRSxNQUZLO0FBR2JDLElBQUFBLFFBQVEsRUFBRSxVQUhHO0FBSWJDLElBQUFBLGFBQWEsRUFBRTtBQUpGO0FBREYsQ0FBZjs7SUFTcUJDLFc7Ozs7Ozs7Ozs7Ozs7QUFJbkI7K0JBQ3VCO0FBQUEsVUFDYkMsUUFEYSxHQUNBLEtBQUtDLEtBREwsQ0FDYkQsUUFEYTs7QUFFckIsVUFBSUEsUUFBSixFQUFjO0FBQ1osZUFBT0UsS0FBSyxDQUFDQyxPQUFOLENBQWNILFFBQWQsSUFBMEJBLFFBQTFCLEdBQXFDLENBQUNBLFFBQUQsQ0FBNUM7QUFDRDs7QUFDRCxhQUFPLEVBQVA7QUFD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ZWFjdCc7XG5cbmNvbnN0IHN0eWxlcyA9IHtcbiAgbWFpbkNvbnRhaW5lcjoge1xuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHRtbE92ZXJsYXkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8XG4gIHsgdmlld3BvcnQ/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+OyB6SW5kZXg/OiBudW1iZXI7IGNoaWxkcmVuPzogUmVhY3QuUmVhY3ROb2RlIH0sXG4gIGFueVxuPiB7XG4gIC8vIE92ZXJyaWRlIHRoaXMgdG8gcHJvdmlkZSB5b3VyIGl0ZW1zXG4gIGdldEl0ZW1zKCk6IEFycmF5PGFueT4ge1xuICAgIGNvbnN0IHsgY2hpbGRyZW4gfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKGNoaWxkcmVuKSB7XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShjaGlsZHJlbikgPyBjaGlsZHJlbiA6IFtjaGlsZHJlbl07XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldENvb3Jkcyhjb29yZGluYXRlczogbnVtYmVyW10pOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICBjb25zdCBwb3MgPSB0aGlzLnByb3BzLnZpZXdwb3J0LnByb2plY3QoY29vcmRpbmF0ZXMpO1xuICAgIGlmICghcG9zKSByZXR1cm4gWy0xLCAtMV07XG4gICAgcmV0dXJuIHBvcztcbiAgfVxuXG4gIGluVmlldyhbeCwgeV06IG51bWJlcltdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLnByb3BzLnZpZXdwb3J0O1xuICAgIHJldHVybiAhKHggPCAwIHx8IHkgPCAwIHx8IHggPiB3aWR0aCB8fCB5ID4gaGVpZ2h0KTtcbiAgfVxuXG4gIHNjYWxlV2l0aFpvb20objogbnVtYmVyKSB7XG4gICAgY29uc3QgeyB6b29tIH0gPSB0aGlzLnByb3BzLnZpZXdwb3J0O1xuICAgIHJldHVybiBuIC8gTWF0aC5wb3coMiwgMjAgLSB6b29tKTtcbiAgfVxuXG4gIGJyZWFrcG9pbnRXaXRoWm9vbSh0aHJlc2hvbGQ6IG51bWJlciwgYTogYW55LCBiOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHsgem9vbSB9ID0gdGhpcy5wcm9wcy52aWV3cG9ydDtcbiAgICByZXR1cm4gem9vbSA+IHRocmVzaG9sZCA/IGEgOiBiO1xuICB9XG5cbiAgZ2V0Vmlld3BvcnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudmlld3BvcnQ7XG4gIH1cblxuICBnZXRab29tKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnZpZXdwb3J0Lnpvb207XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyB6SW5kZXggPSAxIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHN0eWxlID0gT2JqZWN0LmFzc2lnbih7IHpJbmRleCB9IGFzIGFueSwgc3R5bGVzLm1haW5Db250YWluZXIpO1xuXG4gICAgY29uc3QgcmVuZGVySXRlbXMgPSBbXTtcbiAgICB0aGlzLmdldEl0ZW1zKClcbiAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgIC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBbeCwgeV0gPSB0aGlzLmdldENvb3JkcyhpdGVtLnByb3BzLmNvb3JkaW5hdGVzKTtcbiAgICAgICAgaWYgKHRoaXMuaW5WaWV3KFt4LCB5XSkpIHtcbiAgICAgICAgICBjb25zdCBrZXkgPSBpdGVtLmtleSA9PT0gbnVsbCB8fCBpdGVtLmtleSA9PT0gdW5kZWZpbmVkID8gaW5kZXggOiBpdGVtLmtleTtcbiAgICAgICAgICByZW5kZXJJdGVtcy5wdXNoKFJlYWN0LmNsb25lRWxlbWVudChpdGVtLCB7IHgsIHksIGtleSB9KSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfT57cmVuZGVySXRlbXN9PC9kaXY+O1xuICB9XG59XG5cbi8vIFRoaXMgaXMgbmVlZGVkIGZvciBEZWNrLmdsIDguMCtcbi8vQHRzLWlnbm9yZVxuSHRtbE92ZXJsYXkuZGVja0dMVmlld1Byb3BzID0gdHJ1ZTtcbiJdfQ==