"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreeClickPolygonHandler = void 0;

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
var ThreeClickPolygonHandler = /*#__PURE__*/function (_ModeHandler) {
  _inherits(ThreeClickPolygonHandler, _ModeHandler);

  var _super = _createSuper(ThreeClickPolygonHandler);

  function ThreeClickPolygonHandler() {
    _classCallCheck(this, ThreeClickPolygonHandler);

    return _super.apply(this, arguments);
  }

  _createClass(ThreeClickPolygonHandler, [{
    key: "handleClick",
    value: function handleClick(event) {
      _get(_getPrototypeOf(ThreeClickPolygonHandler.prototype), "handleClick", this).call(this, event);

      var tentativeFeature = this.getTentativeFeature();
      var clickSequence = this.getClickSequence();

      if (clickSequence.length > 2 && tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        var editAction = this.getAddFeatureOrBooleanPolygonAction(tentativeFeature.geometry);
        this.resetClickSequence();

        this._setTentativeFeature(null);

        return editAction;
      }

      return null;
    }
  }]);

  return ThreeClickPolygonHandler;
}(_modeHandler.ModeHandler);

exports.ThreeClickPolygonHandler = ThreeClickPolygonHandler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlLWhhbmRsZXJzL3RocmVlLWNsaWNrLXBvbHlnb24taGFuZGxlci50cyJdLCJuYW1lcyI6WyJUaHJlZUNsaWNrUG9seWdvbkhhbmRsZXIiLCJldmVudCIsInRlbnRhdGl2ZUZlYXR1cmUiLCJnZXRUZW50YXRpdmVGZWF0dXJlIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJnZW9tZXRyeSIsInR5cGUiLCJlZGl0QWN0aW9uIiwiZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24iLCJyZXNldENsaWNrU2VxdWVuY2UiLCJfc2V0VGVudGF0aXZlRmVhdHVyZSIsIk1vZGVIYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtJQUNhQSx3Qjs7Ozs7Ozs7Ozs7OztnQ0FDQ0MsSyxFQUFrRDtBQUM1RCxnR0FBa0JBLEtBQWxCOztBQUVBLFVBQU1DLGdCQUFnQixHQUFHLEtBQUtDLG1CQUFMLEVBQXpCO0FBQ0EsVUFBTUMsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLFVBQ0VELGFBQWEsQ0FBQ0UsTUFBZCxHQUF1QixDQUF2QixJQUNBSixnQkFEQSxJQUVBQSxnQkFBZ0IsQ0FBQ0ssUUFBakIsQ0FBMEJDLElBQTFCLEtBQW1DLFNBSHJDLEVBSUU7QUFDQSxZQUFNQyxVQUFVLEdBQUcsS0FBS0MsbUNBQUwsQ0FBeUNSLGdCQUFnQixDQUFDSyxRQUExRCxDQUFuQjtBQUNBLGFBQUtJLGtCQUFMOztBQUNBLGFBQUtDLG9CQUFMLENBQTBCLElBQTFCOztBQUNBLGVBQU9ILFVBQVA7QUFDRDs7QUFFRCxhQUFPLElBQVA7QUFDRDs7OztFQW5CMkNJLHdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2xpY2tFdmVudCB9IGZyb20gJy4uL2V2ZW50LXR5cGVzJztcbmltcG9ydCB7IE1vZGVIYW5kbGVyLCBFZGl0QWN0aW9uIH0gZnJvbSAnLi9tb2RlLWhhbmRsZXInO1xuXG4vLyBUT0RPIGVkaXQtbW9kZXM6IGRlbGV0ZSBoYW5kbGVycyBvbmNlIEVkaXRNb2RlIGZ1bGx5IGltcGxlbWVudGVkXG5leHBvcnQgY2xhc3MgVGhyZWVDbGlja1BvbHlnb25IYW5kbGVyIGV4dGVuZHMgTW9kZUhhbmRsZXIge1xuICBoYW5kbGVDbGljayhldmVudDogQ2xpY2tFdmVudCk6IEVkaXRBY3Rpb24gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBzdXBlci5oYW5kbGVDbGljayhldmVudCk7XG5cbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gdGhpcy5nZXRUZW50YXRpdmVGZWF0dXJlKCk7XG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZSA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpO1xuXG4gICAgaWYgKFxuICAgICAgY2xpY2tTZXF1ZW5jZS5sZW5ndGggPiAyICYmXG4gICAgICB0ZW50YXRpdmVGZWF0dXJlICYmXG4gICAgICB0ZW50YXRpdmVGZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJ1xuICAgICkge1xuICAgICAgY29uc3QgZWRpdEFjdGlvbiA9IHRoaXMuZ2V0QWRkRmVhdHVyZU9yQm9vbGVhblBvbHlnb25BY3Rpb24odGVudGF0aXZlRmVhdHVyZS5nZW9tZXRyeSk7XG4gICAgICB0aGlzLnJlc2V0Q2xpY2tTZXF1ZW5jZSgpO1xuICAgICAgdGhpcy5fc2V0VGVudGF0aXZlRmVhdHVyZShudWxsKTtcbiAgICAgIHJldHVybiBlZGl0QWN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=