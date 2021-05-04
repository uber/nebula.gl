"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layers = require("@nebula.gl/layers");

var _nebulaLayer = _interopRequireDefault(require("../nebula-layer"));

var _utils = require("../utils");

var _deckCache = _interopRequireDefault(require("../deck-renderer/deck-cache"));

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

var JunctionsLayer = /*#__PURE__*/function (_NebulaLayer) {
  _inherits(JunctionsLayer, _NebulaLayer);

  var _super = _createSuper(JunctionsLayer);

  function JunctionsLayer(config) {
    var _this;

    _classCallCheck(this, JunctionsLayer);

    _this = _super.call(this, config);

    _defineProperty(_assertThisInitialized(_this), "deckCache", void 0);

    _this.deckCache = new _deckCache["default"](config.getData, function (data) {
      return config.toNebulaFeature(data);
    });
    _this.enablePicking = true;
    return _this;
  }

  _createClass(JunctionsLayer, [{
    key: "render",
    value: function render(_ref) {
      var nebula = _ref.nebula;
      var defaultColor = [0x0, 0x0, 0x0, 0xff];
      var _this$deckCache = this.deckCache,
          objects = _this$deckCache.objects,
          updateTrigger = _this$deckCache.updateTrigger;
      return new _layers.JunctionScatterplotLayer({
        id: "junctions-".concat(this.id),
        data: objects,
        opacity: 1,
        // @ts-ignore
        fp64: false,
        pickable: true,
        getPosition: function getPosition(nf) {
          return nf.geoJson.geometry.coordinates;
        },
        getFillColor: function getFillColor(nf) {
          return (0, _utils.toDeckColor)(nf.style.fillColor) || defaultColor;
        },
        getStrokeColor: function getStrokeColor(nf) {
          return (0, _utils.toDeckColor)(nf.style.outlineColor) || (0, _utils.toDeckColor)(nf.style.fillColor) || defaultColor;
        },
        getRadius: function getRadius(nf) {
          return nf.style.pointRadiusMeters + nf.style.outlineRadiusMeters || 1;
        },
        getInnerRadius: function getInnerRadius(nf) {
          return nf.style.pointRadiusMeters || 0.5;
        },
        parameters: {
          depthTest: false,
          blend: false
        },
        updateTriggers: {
          all: updateTrigger
        },
        nebulaLayer: this
      });
    }
  }]);

  return JunctionsLayer;
}(_nebulaLayer["default"]);

exports["default"] = JunctionsLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGF5ZXJzL2p1bmN0aW9ucy1sYXllci50cyJdLCJuYW1lcyI6WyJKdW5jdGlvbnNMYXllciIsImNvbmZpZyIsImRlY2tDYWNoZSIsIkRlY2tDYWNoZSIsImdldERhdGEiLCJkYXRhIiwidG9OZWJ1bGFGZWF0dXJlIiwiZW5hYmxlUGlja2luZyIsIm5lYnVsYSIsImRlZmF1bHRDb2xvciIsIm9iamVjdHMiLCJ1cGRhdGVUcmlnZ2VyIiwiSnVuY3Rpb25TY2F0dGVycGxvdExheWVyIiwiaWQiLCJvcGFjaXR5IiwiZnA2NCIsInBpY2thYmxlIiwiZ2V0UG9zaXRpb24iLCJuZiIsImdlb0pzb24iLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZ2V0RmlsbENvbG9yIiwic3R5bGUiLCJmaWxsQ29sb3IiLCJnZXRTdHJva2VDb2xvciIsIm91dGxpbmVDb2xvciIsImdldFJhZGl1cyIsInBvaW50UmFkaXVzTWV0ZXJzIiwib3V0bGluZVJhZGl1c01ldGVycyIsImdldElubmVyUmFkaXVzIiwicGFyYW1ldGVycyIsImRlcHRoVGVzdCIsImJsZW5kIiwidXBkYXRlVHJpZ2dlcnMiLCJhbGwiLCJuZWJ1bGFMYXllciIsIk5lYnVsYUxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFcUJBLGM7Ozs7O0FBR25CLDBCQUFZQyxNQUFaLEVBQXlDO0FBQUE7O0FBQUE7O0FBQ3ZDLDhCQUFNQSxNQUFOOztBQUR1Qzs7QUFFdkMsVUFBS0MsU0FBTCxHQUFpQixJQUFJQyxxQkFBSixDQUFjRixNQUFNLENBQUNHLE9BQXJCLEVBQThCLFVBQUNDLElBQUQ7QUFBQSxhQUFVSixNQUFNLENBQUNLLGVBQVAsQ0FBdUJELElBQXZCLENBQVY7QUFBQSxLQUE5QixDQUFqQjtBQUNBLFVBQUtFLGFBQUwsR0FBcUIsSUFBckI7QUFIdUM7QUFJeEM7Ozs7aUNBRXVDO0FBQUEsVUFBL0JDLE1BQStCLFFBQS9CQSxNQUErQjtBQUN0QyxVQUFNQyxZQUFZLEdBQUcsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBckI7QUFEc0MsNEJBRUgsS0FBS1AsU0FGRjtBQUFBLFVBRTlCUSxPQUY4QixtQkFFOUJBLE9BRjhCO0FBQUEsVUFFckJDLGFBRnFCLG1CQUVyQkEsYUFGcUI7QUFJdEMsYUFBTyxJQUFJQyxnQ0FBSixDQUE2QjtBQUNsQ0MsUUFBQUEsRUFBRSxzQkFBZSxLQUFLQSxFQUFwQixDQURnQztBQUVsQ1IsUUFBQUEsSUFBSSxFQUFFSyxPQUY0QjtBQUdsQ0ksUUFBQUEsT0FBTyxFQUFFLENBSHlCO0FBSWxDO0FBQ0FDLFFBQUFBLElBQUksRUFBRSxLQUw0QjtBQU1sQ0MsUUFBQUEsUUFBUSxFQUFFLElBTndCO0FBT2xDQyxRQUFBQSxXQUFXLEVBQUUscUJBQUNDLEVBQUQ7QUFBQSxpQkFBUUEsRUFBRSxDQUFDQyxPQUFILENBQVdDLFFBQVgsQ0FBb0JDLFdBQTVCO0FBQUEsU0FQcUI7QUFRbENDLFFBQUFBLFlBQVksRUFBRSxzQkFBQ0osRUFBRDtBQUFBLGlCQUFRLHdCQUFZQSxFQUFFLENBQUNLLEtBQUgsQ0FBU0MsU0FBckIsS0FBbUNmLFlBQTNDO0FBQUEsU0FSb0I7QUFTbENnQixRQUFBQSxjQUFjLEVBQUUsd0JBQUNQLEVBQUQ7QUFBQSxpQkFDZCx3QkFBWUEsRUFBRSxDQUFDSyxLQUFILENBQVNHLFlBQXJCLEtBQXNDLHdCQUFZUixFQUFFLENBQUNLLEtBQUgsQ0FBU0MsU0FBckIsQ0FBdEMsSUFBeUVmLFlBRDNEO0FBQUEsU0FUa0I7QUFXbENrQixRQUFBQSxTQUFTLEVBQUUsbUJBQUNULEVBQUQ7QUFBQSxpQkFBUUEsRUFBRSxDQUFDSyxLQUFILENBQVNLLGlCQUFULEdBQTZCVixFQUFFLENBQUNLLEtBQUgsQ0FBU00sbUJBQXRDLElBQTZELENBQXJFO0FBQUEsU0FYdUI7QUFZbENDLFFBQUFBLGNBQWMsRUFBRSx3QkFBQ1osRUFBRDtBQUFBLGlCQUFRQSxFQUFFLENBQUNLLEtBQUgsQ0FBU0ssaUJBQVQsSUFBOEIsR0FBdEM7QUFBQSxTQVprQjtBQWFsQ0csUUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLFVBQUFBLFNBQVMsRUFBRSxLQUREO0FBRVZDLFVBQUFBLEtBQUssRUFBRTtBQUZHLFNBYnNCO0FBa0JsQ0MsUUFBQUEsY0FBYyxFQUFFO0FBQUVDLFVBQUFBLEdBQUcsRUFBRXhCO0FBQVAsU0FsQmtCO0FBb0JsQ3lCLFFBQUFBLFdBQVcsRUFBRTtBQXBCcUIsT0FBN0IsQ0FBUDtBQXNCRDs7OztFQW5DeUNDLHVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSnVuY3Rpb25TY2F0dGVycGxvdExheWVyIH0gZnJvbSAnQG5lYnVsYS5nbC9sYXllcnMnO1xuaW1wb3J0IE5lYnVsYUxheWVyIGZyb20gJy4uL25lYnVsYS1sYXllcic7XG5pbXBvcnQgeyB0b0RlY2tDb2xvciB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBEZWNrQ2FjaGUgZnJvbSAnLi4vZGVjay1yZW5kZXJlci9kZWNrLWNhY2hlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSnVuY3Rpb25zTGF5ZXIgZXh0ZW5kcyBOZWJ1bGFMYXllciB7XG4gIGRlY2tDYWNoZTogRGVja0NhY2hlPGFueSwgYW55PjtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICBzdXBlcihjb25maWcpO1xuICAgIHRoaXMuZGVja0NhY2hlID0gbmV3IERlY2tDYWNoZShjb25maWcuZ2V0RGF0YSwgKGRhdGEpID0+IGNvbmZpZy50b05lYnVsYUZlYXR1cmUoZGF0YSkpO1xuICAgIHRoaXMuZW5hYmxlUGlja2luZyA9IHRydWU7XG4gIH1cblxuICByZW5kZXIoeyBuZWJ1bGEgfTogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIGNvbnN0IGRlZmF1bHRDb2xvciA9IFsweDAsIDB4MCwgMHgwLCAweGZmXTtcbiAgICBjb25zdCB7IG9iamVjdHMsIHVwZGF0ZVRyaWdnZXIgfSA9IHRoaXMuZGVja0NhY2hlO1xuXG4gICAgcmV0dXJuIG5ldyBKdW5jdGlvblNjYXR0ZXJwbG90TGF5ZXIoe1xuICAgICAgaWQ6IGBqdW5jdGlvbnMtJHt0aGlzLmlkfWAsXG4gICAgICBkYXRhOiBvYmplY3RzLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGZwNjQ6IGZhbHNlLFxuICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICBnZXRQb3NpdGlvbjogKG5mKSA9PiBuZi5nZW9Kc29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzLFxuICAgICAgZ2V0RmlsbENvbG9yOiAobmYpID0+IHRvRGVja0NvbG9yKG5mLnN0eWxlLmZpbGxDb2xvcikgfHwgZGVmYXVsdENvbG9yLFxuICAgICAgZ2V0U3Ryb2tlQ29sb3I6IChuZikgPT5cbiAgICAgICAgdG9EZWNrQ29sb3IobmYuc3R5bGUub3V0bGluZUNvbG9yKSB8fCB0b0RlY2tDb2xvcihuZi5zdHlsZS5maWxsQ29sb3IpIHx8IGRlZmF1bHRDb2xvcixcbiAgICAgIGdldFJhZGl1czogKG5mKSA9PiBuZi5zdHlsZS5wb2ludFJhZGl1c01ldGVycyArIG5mLnN0eWxlLm91dGxpbmVSYWRpdXNNZXRlcnMgfHwgMSxcbiAgICAgIGdldElubmVyUmFkaXVzOiAobmYpID0+IG5mLnN0eWxlLnBvaW50UmFkaXVzTWV0ZXJzIHx8IDAuNSxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgZGVwdGhUZXN0OiBmYWxzZSxcbiAgICAgICAgYmxlbmQ6IGZhbHNlLFxuICAgICAgfSxcblxuICAgICAgdXBkYXRlVHJpZ2dlcnM6IHsgYWxsOiB1cGRhdGVUcmlnZ2VyIH0sXG5cbiAgICAgIG5lYnVsYUxheWVyOiB0aGlzLFxuICAgIH0pO1xuICB9XG59XG4iXX0=