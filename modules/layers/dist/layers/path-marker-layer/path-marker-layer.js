"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@deck.gl/core");

var _layers = require("@deck.gl/layers");

var _meshLayers = require("@deck.gl/mesh-layers");

var _pathOutlineLayer = _interopRequireDefault(require("../path-outline-layer/path-outline-layer"));

var _arrow2dGeometry = _interopRequireDefault(require("./arrow-2d-geometry"));

var _createPathMarkers = _interopRequireDefault(require("./create-path-markers"));

var _polyline = require("./polyline");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DISTANCE_FOR_MULTI_ARROWS = 0.1;
var ARROW_HEAD_SIZE = 0.2;
var ARROW_TAIL_WIDTH = 0.05; // const ARROW_CENTER_ADJUST = -0.8;

var DEFAULT_MARKER_LAYER = _meshLayers.SimpleMeshLayer;
var DEFAULT_MARKER_LAYER_PROPS = {
  mesh: new _arrow2dGeometry["default"]({
    headSize: ARROW_HEAD_SIZE,
    tailWidth: ARROW_TAIL_WIDTH
  })
};
var defaultProps = Object.assign({}, _pathOutlineLayer["default"].defaultProps, {
  MarkerLayer: DEFAULT_MARKER_LAYER,
  markerLayerProps: DEFAULT_MARKER_LAYER_PROPS,
  sizeScale: 100,
  fp64: false,
  hightlightIndex: -1,
  highlightPoint: null,
  getPath: function getPath(x) {
    return x.path;
  },
  getColor: function getColor(x) {
    return x.color;
  },
  getMarkerColor: function getMarkerColor(x) {
    return [0, 0, 0, 255];
  },
  getDirection: function getDirection(x) {
    return x.direction;
  },
  getMarkerPercentages: function getMarkerPercentages(object, _ref) {
    var lineLength = _ref.lineLength;
    return lineLength > DISTANCE_FOR_MULTI_ARROWS ? [0.25, 0.5, 0.75] : [0.5];
  }
});

var PathMarkerLayer = /*#__PURE__*/function (_CompositeLayer) {
  _inherits(PathMarkerLayer, _CompositeLayer);

  var _super = _createSuper(PathMarkerLayer);

  function PathMarkerLayer() {
    _classCallCheck(this, PathMarkerLayer);

    return _super.apply(this, arguments);
  }

  _createClass(PathMarkerLayer, [{
    key: "initializeState",
    value: function initializeState() {
      this.state = {
        markers: [],
        mesh: new _arrow2dGeometry["default"]({
          headSize: ARROW_HEAD_SIZE,
          tailWidth: ARROW_TAIL_WIDTH
        }),
        closestPoint: null
      };
    } // @ts-ignore

  }, {
    key: "projectFlat",
    value: function projectFlat(xyz, viewport, coordinateSystem, coordinateOrigin) {
      if (coordinateSystem === _core.COORDINATE_SYSTEM.METER_OFFSETS) {
        var _viewport$metersToLng = viewport.metersToLngLatDelta(xyz),
            _viewport$metersToLng2 = _slicedToArray(_viewport$metersToLng, 2),
            dx = _viewport$metersToLng2[0],
            dy = _viewport$metersToLng2[1];

        var _coordinateOrigin = _slicedToArray(coordinateOrigin, 2),
            x = _coordinateOrigin[0],
            y = _coordinateOrigin[1];

        return viewport.projectFlat([x + dx, dy + y]);
      } else if (coordinateSystem === _core.COORDINATE_SYSTEM.LNGLAT_OFFSETS) {
        var _xyz = _slicedToArray(xyz, 2),
            _dx = _xyz[0],
            _dy = _xyz[1];

        var _coordinateOrigin2 = _slicedToArray(coordinateOrigin, 2),
            _x = _coordinateOrigin2[0],
            _y = _coordinateOrigin2[1];

        return viewport.projectFlat([_x + _dx, _dy + _y]);
      }

      return viewport.projectFlat(xyz);
    }
  }, {
    key: "updateState",
    value: function updateState(_ref2) {
      var _this = this;

      var props = _ref2.props,
          oldProps = _ref2.oldProps,
          changeFlags = _ref2.changeFlags;

      if (changeFlags.dataChanged || changeFlags.updateTriggersChanged) {
        var _this$props = this.props,
            data = _this$props.data,
            getPath = _this$props.getPath,
            getDirection = _this$props.getDirection,
            getMarkerColor = _this$props.getMarkerColor,
            getMarkerPercentages = _this$props.getMarkerPercentages,
            coordinateSystem = _this$props.coordinateSystem,
            coordinateOrigin = _this$props.coordinateOrigin; // @ts-ignore

        var viewport = this.context.viewport;

        var projectFlat = function projectFlat(o) {
          return _this.projectFlat(o, viewport, coordinateSystem, coordinateOrigin);
        };

        this.state.markers = (0, _createPathMarkers["default"])({
          data: data,
          getPath: getPath,
          getDirection: getDirection,
          getColor: getMarkerColor,
          getMarkerPercentages: getMarkerPercentages,
          projectFlat: projectFlat
        });

        this._recalculateClosestPoint();
      }

      if (changeFlags.propsChanged) {
        if (props.point !== oldProps.point) {
          this._recalculateClosestPoint();
        }
      }
    }
  }, {
    key: "_recalculateClosestPoint",
    value: function _recalculateClosestPoint() {
      var _this$props2 = this.props,
          highlightPoint = _this$props2.highlightPoint,
          highlightIndex = _this$props2.highlightIndex;

      if (highlightPoint && highlightIndex >= 0) {
        var object = this.props.data[highlightIndex];
        var points = this.props.getPath(object);

        var _getClosestPointOnPol = (0, _polyline.getClosestPointOnPolyline)({
          points: points,
          p: highlightPoint
        }),
            point = _getClosestPointOnPol.point;

        this.state.closestPoints = [{
          position: point
        }];
      } else {
        this.state.closestPoints = [];
      }
    }
  }, {
    key: "getPickingInfo",
    value: function getPickingInfo(_ref3) {
      var info = _ref3.info;
      return Object.assign(info, {
        // override object with picked feature
        object: info.object && info.object.path || info.object
      });
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      return [new _pathOutlineLayer["default"](this.props, // @ts-ignore
      this.getSubLayerProps({
        id: 'paths',
        // Note: data has to be passed explicitly like this to avoid being empty
        data: this.props.data
      })), new this.props.MarkerLayer(this.getSubLayerProps(Object.assign({}, this.props.markerLayerProps, {
        id: 'markers',
        data: this.state.markers,
        getOrientation: function getOrientation(x) {
          return [0, -x.angle, 0];
        },
        getColor: function getColor(x) {
          return x.color;
        },
        sizeScale: this.props.sizeScale,
        fp64: this.props.fp64,
        pickable: false,
        parameters: {
          blend: false,
          depthTest: false
        }
      }))), this.state.closestPoints && new _layers.ScatterplotLayer({
        id: "".concat(this.props.id, "-highlight"),
        data: this.state.closestPoints,
        // @ts-ignore
        fp64: this.props.fp64
      })];
    }
  }]);

  return PathMarkerLayer;
}(_core.CompositeLayer);

exports["default"] = PathMarkerLayer;

_defineProperty(PathMarkerLayer, "layerName", 'PathMarkerLayer');

_defineProperty(PathMarkerLayer, "defaultProps", defaultProps);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcGF0aC1tYXJrZXItbGF5ZXIvcGF0aC1tYXJrZXItbGF5ZXIudHMiXSwibmFtZXMiOlsiRElTVEFOQ0VfRk9SX01VTFRJX0FSUk9XUyIsIkFSUk9XX0hFQURfU0laRSIsIkFSUk9XX1RBSUxfV0lEVEgiLCJERUZBVUxUX01BUktFUl9MQVlFUiIsIlNpbXBsZU1lc2hMYXllciIsIkRFRkFVTFRfTUFSS0VSX0xBWUVSX1BST1BTIiwibWVzaCIsIkFycm93MkRHZW9tZXRyeSIsImhlYWRTaXplIiwidGFpbFdpZHRoIiwiZGVmYXVsdFByb3BzIiwiT2JqZWN0IiwiYXNzaWduIiwiUGF0aE91dGxpbmVMYXllciIsIk1hcmtlckxheWVyIiwibWFya2VyTGF5ZXJQcm9wcyIsInNpemVTY2FsZSIsImZwNjQiLCJoaWdodGxpZ2h0SW5kZXgiLCJoaWdobGlnaHRQb2ludCIsImdldFBhdGgiLCJ4IiwicGF0aCIsImdldENvbG9yIiwiY29sb3IiLCJnZXRNYXJrZXJDb2xvciIsImdldERpcmVjdGlvbiIsImRpcmVjdGlvbiIsImdldE1hcmtlclBlcmNlbnRhZ2VzIiwib2JqZWN0IiwibGluZUxlbmd0aCIsIlBhdGhNYXJrZXJMYXllciIsInN0YXRlIiwibWFya2VycyIsImNsb3Nlc3RQb2ludCIsInh5eiIsInZpZXdwb3J0IiwiY29vcmRpbmF0ZVN5c3RlbSIsImNvb3JkaW5hdGVPcmlnaW4iLCJDT09SRElOQVRFX1NZU1RFTSIsIk1FVEVSX09GRlNFVFMiLCJtZXRlcnNUb0xuZ0xhdERlbHRhIiwiZHgiLCJkeSIsInkiLCJwcm9qZWN0RmxhdCIsIkxOR0xBVF9PRkZTRVRTIiwicHJvcHMiLCJvbGRQcm9wcyIsImNoYW5nZUZsYWdzIiwiZGF0YUNoYW5nZWQiLCJ1cGRhdGVUcmlnZ2Vyc0NoYW5nZWQiLCJkYXRhIiwiY29udGV4dCIsIm8iLCJfcmVjYWxjdWxhdGVDbG9zZXN0UG9pbnQiLCJwcm9wc0NoYW5nZWQiLCJwb2ludCIsImhpZ2hsaWdodEluZGV4IiwicG9pbnRzIiwicCIsImNsb3Nlc3RQb2ludHMiLCJwb3NpdGlvbiIsImluZm8iLCJnZXRTdWJMYXllclByb3BzIiwiaWQiLCJnZXRPcmllbnRhdGlvbiIsImFuZ2xlIiwicGlja2FibGUiLCJwYXJhbWV0ZXJzIiwiYmxlbmQiLCJkZXB0aFRlc3QiLCJTY2F0dGVycGxvdExheWVyIiwiQ29tcG9zaXRlTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLHlCQUF5QixHQUFHLEdBQWxDO0FBQ0EsSUFBTUMsZUFBZSxHQUFHLEdBQXhCO0FBQ0EsSUFBTUMsZ0JBQWdCLEdBQUcsSUFBekIsQyxDQUNBOztBQUVBLElBQU1DLG9CQUFvQixHQUFHQywyQkFBN0I7QUFFQSxJQUFNQywwQkFBMEIsR0FBRztBQUNqQ0MsRUFBQUEsSUFBSSxFQUFFLElBQUlDLDJCQUFKLENBQW9CO0FBQUVDLElBQUFBLFFBQVEsRUFBRVAsZUFBWjtBQUE2QlEsSUFBQUEsU0FBUyxFQUFFUDtBQUF4QyxHQUFwQjtBQUQyQixDQUFuQztBQUlBLElBQU1RLFlBQVksR0FBR0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQkMsNkJBQWlCSCxZQUFuQyxFQUFpRDtBQUNwRUksRUFBQUEsV0FBVyxFQUFFWCxvQkFEdUQ7QUFFcEVZLEVBQUFBLGdCQUFnQixFQUFFViwwQkFGa0Q7QUFJcEVXLEVBQUFBLFNBQVMsRUFBRSxHQUp5RDtBQUtwRUMsRUFBQUEsSUFBSSxFQUFFLEtBTDhEO0FBT3BFQyxFQUFBQSxlQUFlLEVBQUUsQ0FBQyxDQVBrRDtBQVFwRUMsRUFBQUEsY0FBYyxFQUFFLElBUm9EO0FBVXBFQyxFQUFBQSxPQUFPLEVBQUUsaUJBQUNDLENBQUQ7QUFBQSxXQUFPQSxDQUFDLENBQUNDLElBQVQ7QUFBQSxHQVYyRDtBQVdwRUMsRUFBQUEsUUFBUSxFQUFFLGtCQUFDRixDQUFEO0FBQUEsV0FBT0EsQ0FBQyxDQUFDRyxLQUFUO0FBQUEsR0FYMEQ7QUFZcEVDLEVBQUFBLGNBQWMsRUFBRSx3QkFBQ0osQ0FBRDtBQUFBLFdBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxHQUFWLENBQVA7QUFBQSxHQVpvRDtBQWFwRUssRUFBQUEsWUFBWSxFQUFFLHNCQUFDTCxDQUFEO0FBQUEsV0FBT0EsQ0FBQyxDQUFDTSxTQUFUO0FBQUEsR0Fic0Q7QUFjcEVDLEVBQUFBLG9CQUFvQixFQUFFLDhCQUFDQyxNQUFEO0FBQUEsUUFBV0MsVUFBWCxRQUFXQSxVQUFYO0FBQUEsV0FDcEJBLFVBQVUsR0FBRzlCLHlCQUFiLEdBQXlDLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxJQUFaLENBQXpDLEdBQTZELENBQUMsR0FBRCxDQUR6QztBQUFBO0FBZDhDLENBQWpELENBQXJCOztJQWtCcUIrQixlOzs7Ozs7Ozs7Ozs7O3NDQUlEO0FBQ2hCLFdBQUtDLEtBQUwsR0FBYTtBQUNYQyxRQUFBQSxPQUFPLEVBQUUsRUFERTtBQUVYM0IsUUFBQUEsSUFBSSxFQUFFLElBQUlDLDJCQUFKLENBQW9CO0FBQUVDLFVBQUFBLFFBQVEsRUFBRVAsZUFBWjtBQUE2QlEsVUFBQUEsU0FBUyxFQUFFUDtBQUF4QyxTQUFwQixDQUZLO0FBR1hnQyxRQUFBQSxZQUFZLEVBQUU7QUFISCxPQUFiO0FBS0QsSyxDQUNEOzs7O2dDQUNZQyxHLEVBQUtDLFEsRUFBVUMsZ0IsRUFBa0JDLGdCLEVBQWtCO0FBQzdELFVBQUlELGdCQUFnQixLQUFLRSx3QkFBa0JDLGFBQTNDLEVBQTBEO0FBQUEsb0NBQ3ZDSixRQUFRLENBQUNLLG1CQUFULENBQTZCTixHQUE3QixDQUR1QztBQUFBO0FBQUEsWUFDakRPLEVBRGlEO0FBQUEsWUFDN0NDLEVBRDZDOztBQUFBLCtDQUV6Q0wsZ0JBRnlDO0FBQUEsWUFFakRqQixDQUZpRDtBQUFBLFlBRTlDdUIsQ0FGOEM7O0FBR3hELGVBQU9SLFFBQVEsQ0FBQ1MsV0FBVCxDQUFxQixDQUFDeEIsQ0FBQyxHQUFHcUIsRUFBTCxFQUFTQyxFQUFFLEdBQUdDLENBQWQsQ0FBckIsQ0FBUDtBQUNELE9BSkQsTUFJTyxJQUFJUCxnQkFBZ0IsS0FBS0Usd0JBQWtCTyxjQUEzQyxFQUEyRDtBQUFBLGtDQUMvQ1gsR0FEK0M7QUFBQSxZQUN6RE8sR0FEeUQ7QUFBQSxZQUNyREMsR0FEcUQ7O0FBQUEsZ0RBRWpETCxnQkFGaUQ7QUFBQSxZQUV6RGpCLEVBRnlEO0FBQUEsWUFFdER1QixFQUZzRDs7QUFHaEUsZUFBT1IsUUFBUSxDQUFDUyxXQUFULENBQXFCLENBQUN4QixFQUFDLEdBQUdxQixHQUFMLEVBQVNDLEdBQUUsR0FBR0MsRUFBZCxDQUFyQixDQUFQO0FBQ0Q7O0FBRUQsYUFBT1IsUUFBUSxDQUFDUyxXQUFULENBQXFCVixHQUFyQixDQUFQO0FBQ0Q7Ozt1Q0FFNkM7QUFBQTs7QUFBQSxVQUFoQ1ksS0FBZ0MsU0FBaENBLEtBQWdDO0FBQUEsVUFBekJDLFFBQXlCLFNBQXpCQSxRQUF5QjtBQUFBLFVBQWZDLFdBQWUsU0FBZkEsV0FBZTs7QUFDNUMsVUFBSUEsV0FBVyxDQUFDQyxXQUFaLElBQTJCRCxXQUFXLENBQUNFLHFCQUEzQyxFQUFrRTtBQUFBLDBCQVM1RCxLQUFLSixLQVR1RDtBQUFBLFlBRTlESyxJQUY4RCxlQUU5REEsSUFGOEQ7QUFBQSxZQUc5RGhDLE9BSDhELGVBRzlEQSxPQUg4RDtBQUFBLFlBSTlETSxZQUo4RCxlQUk5REEsWUFKOEQ7QUFBQSxZQUs5REQsY0FMOEQsZUFLOURBLGNBTDhEO0FBQUEsWUFNOURHLG9CQU44RCxlQU05REEsb0JBTjhEO0FBQUEsWUFPOURTLGdCQVA4RCxlQU85REEsZ0JBUDhEO0FBQUEsWUFROURDLGdCQVI4RCxlQVE5REEsZ0JBUjhELEVBVWhFOztBQVZnRSxZQVd4REYsUUFYd0QsR0FXM0MsS0FBS2lCLE9BWHNDLENBV3hEakIsUUFYd0Q7O0FBWWhFLFlBQU1TLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUNTLENBQUQ7QUFBQSxpQkFBTyxLQUFJLENBQUNULFdBQUwsQ0FBaUJTLENBQWpCLEVBQW9CbEIsUUFBcEIsRUFBOEJDLGdCQUE5QixFQUFnREMsZ0JBQWhELENBQVA7QUFBQSxTQUFwQjs7QUFDQSxhQUFLTixLQUFMLENBQVdDLE9BQVgsR0FBcUIsbUNBQWtCO0FBQ3JDbUIsVUFBQUEsSUFBSSxFQUFKQSxJQURxQztBQUVyQ2hDLFVBQUFBLE9BQU8sRUFBUEEsT0FGcUM7QUFHckNNLFVBQUFBLFlBQVksRUFBWkEsWUFIcUM7QUFJckNILFVBQUFBLFFBQVEsRUFBRUUsY0FKMkI7QUFLckNHLFVBQUFBLG9CQUFvQixFQUFwQkEsb0JBTHFDO0FBTXJDaUIsVUFBQUEsV0FBVyxFQUFYQTtBQU5xQyxTQUFsQixDQUFyQjs7QUFRQSxhQUFLVSx3QkFBTDtBQUNEOztBQUNELFVBQUlOLFdBQVcsQ0FBQ08sWUFBaEIsRUFBOEI7QUFDNUIsWUFBSVQsS0FBSyxDQUFDVSxLQUFOLEtBQWdCVCxRQUFRLENBQUNTLEtBQTdCLEVBQW9DO0FBQ2xDLGVBQUtGLHdCQUFMO0FBQ0Q7QUFDRjtBQUNGOzs7K0NBRTBCO0FBQUEseUJBQ2tCLEtBQUtSLEtBRHZCO0FBQUEsVUFDakI1QixjQURpQixnQkFDakJBLGNBRGlCO0FBQUEsVUFDRHVDLGNBREMsZ0JBQ0RBLGNBREM7O0FBRXpCLFVBQUl2QyxjQUFjLElBQUl1QyxjQUFjLElBQUksQ0FBeEMsRUFBMkM7QUFDekMsWUFBTTdCLE1BQU0sR0FBRyxLQUFLa0IsS0FBTCxDQUFXSyxJQUFYLENBQWdCTSxjQUFoQixDQUFmO0FBQ0EsWUFBTUMsTUFBTSxHQUFHLEtBQUtaLEtBQUwsQ0FBVzNCLE9BQVgsQ0FBbUJTLE1BQW5CLENBQWY7O0FBRnlDLG9DQUd2Qix5Q0FBMEI7QUFBRThCLFVBQUFBLE1BQU0sRUFBTkEsTUFBRjtBQUFVQyxVQUFBQSxDQUFDLEVBQUV6QztBQUFiLFNBQTFCLENBSHVCO0FBQUEsWUFHakNzQyxLQUhpQyx5QkFHakNBLEtBSGlDOztBQUl6QyxhQUFLekIsS0FBTCxDQUFXNkIsYUFBWCxHQUEyQixDQUN6QjtBQUNFQyxVQUFBQSxRQUFRLEVBQUVMO0FBRFosU0FEeUIsQ0FBM0I7QUFLRCxPQVRELE1BU087QUFDTCxhQUFLekIsS0FBTCxDQUFXNkIsYUFBWCxHQUEyQixFQUEzQjtBQUNEO0FBQ0Y7OzswQ0FFd0I7QUFBQSxVQUFSRSxJQUFRLFNBQVJBLElBQVE7QUFDdkIsYUFBT3BELE1BQU0sQ0FBQ0MsTUFBUCxDQUFjbUQsSUFBZCxFQUFvQjtBQUN6QjtBQUNBbEMsUUFBQUEsTUFBTSxFQUFHa0MsSUFBSSxDQUFDbEMsTUFBTCxJQUFla0MsSUFBSSxDQUFDbEMsTUFBTCxDQUFZUCxJQUE1QixJQUFxQ3lDLElBQUksQ0FBQ2xDO0FBRnpCLE9BQXBCLENBQVA7QUFJRDs7O21DQUVjO0FBQ2IsYUFBTyxDQUNMLElBQUloQiw0QkFBSixDQUNFLEtBQUtrQyxLQURQLEVBRUU7QUFDQSxXQUFLaUIsZ0JBQUwsQ0FBc0I7QUFDcEJDLFFBQUFBLEVBQUUsRUFBRSxPQURnQjtBQUVwQjtBQUNBYixRQUFBQSxJQUFJLEVBQUUsS0FBS0wsS0FBTCxDQUFXSztBQUhHLE9BQXRCLENBSEYsQ0FESyxFQVVMLElBQUksS0FBS0wsS0FBTCxDQUFXakMsV0FBZixDQUNFLEtBQUtrRCxnQkFBTCxDQUNFckQsTUFBTSxDQUFDQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLbUMsS0FBTCxDQUFXaEMsZ0JBQTdCLEVBQStDO0FBQzdDa0QsUUFBQUEsRUFBRSxFQUFFLFNBRHlDO0FBRTdDYixRQUFBQSxJQUFJLEVBQUUsS0FBS3BCLEtBQUwsQ0FBV0MsT0FGNEI7QUFHN0NpQyxRQUFBQSxjQUFjLEVBQUUsd0JBQUM3QyxDQUFEO0FBQUEsaUJBQU8sQ0FBQyxDQUFELEVBQUksQ0FBQ0EsQ0FBQyxDQUFDOEMsS0FBUCxFQUFjLENBQWQsQ0FBUDtBQUFBLFNBSDZCO0FBSTdDNUMsUUFBQUEsUUFBUSxFQUFFLGtCQUFDRixDQUFEO0FBQUEsaUJBQU9BLENBQUMsQ0FBQ0csS0FBVDtBQUFBLFNBSm1DO0FBSzdDUixRQUFBQSxTQUFTLEVBQUUsS0FBSytCLEtBQUwsQ0FBVy9CLFNBTHVCO0FBTTdDQyxRQUFBQSxJQUFJLEVBQUUsS0FBSzhCLEtBQUwsQ0FBVzlCLElBTjRCO0FBTzdDbUQsUUFBQUEsUUFBUSxFQUFFLEtBUG1DO0FBUTdDQyxRQUFBQSxVQUFVLEVBQUU7QUFDVkMsVUFBQUEsS0FBSyxFQUFFLEtBREc7QUFFVkMsVUFBQUEsU0FBUyxFQUFFO0FBRkQ7QUFSaUMsT0FBL0MsQ0FERixDQURGLENBVkssRUEyQkwsS0FBS3ZDLEtBQUwsQ0FBVzZCLGFBQVgsSUFDRSxJQUFJVyx3QkFBSixDQUFxQjtBQUNuQlAsUUFBQUEsRUFBRSxZQUFLLEtBQUtsQixLQUFMLENBQVdrQixFQUFoQixlQURpQjtBQUVuQmIsUUFBQUEsSUFBSSxFQUFFLEtBQUtwQixLQUFMLENBQVc2QixhQUZFO0FBR25CO0FBQ0E1QyxRQUFBQSxJQUFJLEVBQUUsS0FBSzhCLEtBQUwsQ0FBVzlCO0FBSkUsT0FBckIsQ0E1QkcsQ0FBUDtBQW1DRDs7OztFQXBIMEN3RCxvQjs7OztnQkFBeEIxQyxlLGVBQ0EsaUI7O2dCQURBQSxlLGtCQUVHckIsWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvc2l0ZUxheWVyLCBDT09SRElOQVRFX1NZU1RFTSB9IGZyb20gJ0BkZWNrLmdsL2NvcmUnO1xuaW1wb3J0IHsgU2NhdHRlcnBsb3RMYXllciB9IGZyb20gJ0BkZWNrLmdsL2xheWVycyc7XG5pbXBvcnQgeyBTaW1wbGVNZXNoTGF5ZXIgfSBmcm9tICdAZGVjay5nbC9tZXNoLWxheWVycyc7XG5pbXBvcnQgUGF0aE91dGxpbmVMYXllciBmcm9tICcuLi9wYXRoLW91dGxpbmUtbGF5ZXIvcGF0aC1vdXRsaW5lLWxheWVyJztcbmltcG9ydCBBcnJvdzJER2VvbWV0cnkgZnJvbSAnLi9hcnJvdy0yZC1nZW9tZXRyeSc7XG5cbmltcG9ydCBjcmVhdGVQYXRoTWFya2VycyBmcm9tICcuL2NyZWF0ZS1wYXRoLW1hcmtlcnMnO1xuaW1wb3J0IHsgZ2V0Q2xvc2VzdFBvaW50T25Qb2x5bGluZSB9IGZyb20gJy4vcG9seWxpbmUnO1xuXG5jb25zdCBESVNUQU5DRV9GT1JfTVVMVElfQVJST1dTID0gMC4xO1xuY29uc3QgQVJST1dfSEVBRF9TSVpFID0gMC4yO1xuY29uc3QgQVJST1dfVEFJTF9XSURUSCA9IDAuMDU7XG4vLyBjb25zdCBBUlJPV19DRU5URVJfQURKVVNUID0gLTAuODtcblxuY29uc3QgREVGQVVMVF9NQVJLRVJfTEFZRVIgPSBTaW1wbGVNZXNoTGF5ZXI7XG5cbmNvbnN0IERFRkFVTFRfTUFSS0VSX0xBWUVSX1BST1BTID0ge1xuICBtZXNoOiBuZXcgQXJyb3cyREdlb21ldHJ5KHsgaGVhZFNpemU6IEFSUk9XX0hFQURfU0laRSwgdGFpbFdpZHRoOiBBUlJPV19UQUlMX1dJRFRIIH0pLFxufTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgUGF0aE91dGxpbmVMYXllci5kZWZhdWx0UHJvcHMsIHtcbiAgTWFya2VyTGF5ZXI6IERFRkFVTFRfTUFSS0VSX0xBWUVSLFxuICBtYXJrZXJMYXllclByb3BzOiBERUZBVUxUX01BUktFUl9MQVlFUl9QUk9QUyxcblxuICBzaXplU2NhbGU6IDEwMCxcbiAgZnA2NDogZmFsc2UsXG5cbiAgaGlnaHRsaWdodEluZGV4OiAtMSxcbiAgaGlnaGxpZ2h0UG9pbnQ6IG51bGwsXG5cbiAgZ2V0UGF0aDogKHgpID0+IHgucGF0aCxcbiAgZ2V0Q29sb3I6ICh4KSA9PiB4LmNvbG9yLFxuICBnZXRNYXJrZXJDb2xvcjogKHgpID0+IFswLCAwLCAwLCAyNTVdLFxuICBnZXREaXJlY3Rpb246ICh4KSA9PiB4LmRpcmVjdGlvbixcbiAgZ2V0TWFya2VyUGVyY2VudGFnZXM6IChvYmplY3QsIHsgbGluZUxlbmd0aCB9KSA9PlxuICAgIGxpbmVMZW5ndGggPiBESVNUQU5DRV9GT1JfTVVMVElfQVJST1dTID8gWzAuMjUsIDAuNSwgMC43NV0gOiBbMC41XSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXRoTWFya2VyTGF5ZXIgZXh0ZW5kcyBDb21wb3NpdGVMYXllcjxhbnk+IHtcbiAgc3RhdGljIGxheWVyTmFtZSA9ICdQYXRoTWFya2VyTGF5ZXInO1xuICBzdGF0aWMgZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbWFya2VyczogW10sXG4gICAgICBtZXNoOiBuZXcgQXJyb3cyREdlb21ldHJ5KHsgaGVhZFNpemU6IEFSUk9XX0hFQURfU0laRSwgdGFpbFdpZHRoOiBBUlJPV19UQUlMX1dJRFRIIH0pLFxuICAgICAgY2xvc2VzdFBvaW50OiBudWxsLFxuICAgIH07XG4gIH1cbiAgLy8gQHRzLWlnbm9yZVxuICBwcm9qZWN0RmxhdCh4eXosIHZpZXdwb3J0LCBjb29yZGluYXRlU3lzdGVtLCBjb29yZGluYXRlT3JpZ2luKSB7XG4gICAgaWYgKGNvb3JkaW5hdGVTeXN0ZW0gPT09IENPT1JESU5BVEVfU1lTVEVNLk1FVEVSX09GRlNFVFMpIHtcbiAgICAgIGNvbnN0IFtkeCwgZHldID0gdmlld3BvcnQubWV0ZXJzVG9MbmdMYXREZWx0YSh4eXopO1xuICAgICAgY29uc3QgW3gsIHldID0gY29vcmRpbmF0ZU9yaWdpbjtcbiAgICAgIHJldHVybiB2aWV3cG9ydC5wcm9qZWN0RmxhdChbeCArIGR4LCBkeSArIHldKTtcbiAgICB9IGVsc2UgaWYgKGNvb3JkaW5hdGVTeXN0ZW0gPT09IENPT1JESU5BVEVfU1lTVEVNLkxOR0xBVF9PRkZTRVRTKSB7XG4gICAgICBjb25zdCBbZHgsIGR5XSA9IHh5ejtcbiAgICAgIGNvbnN0IFt4LCB5XSA9IGNvb3JkaW5hdGVPcmlnaW47XG4gICAgICByZXR1cm4gdmlld3BvcnQucHJvamVjdEZsYXQoW3ggKyBkeCwgZHkgKyB5XSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZpZXdwb3J0LnByb2plY3RGbGF0KHh5eik7XG4gIH1cblxuICB1cGRhdGVTdGF0ZSh7IHByb3BzLCBvbGRQcm9wcywgY2hhbmdlRmxhZ3MgfSkge1xuICAgIGlmIChjaGFuZ2VGbGFncy5kYXRhQ2hhbmdlZCB8fCBjaGFuZ2VGbGFncy51cGRhdGVUcmlnZ2Vyc0NoYW5nZWQpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZGF0YSxcbiAgICAgICAgZ2V0UGF0aCxcbiAgICAgICAgZ2V0RGlyZWN0aW9uLFxuICAgICAgICBnZXRNYXJrZXJDb2xvcixcbiAgICAgICAgZ2V0TWFya2VyUGVyY2VudGFnZXMsXG4gICAgICAgIGNvb3JkaW5hdGVTeXN0ZW0sXG4gICAgICAgIGNvb3JkaW5hdGVPcmlnaW4sXG4gICAgICB9ID0gdGhpcy5wcm9wcztcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnN0IHsgdmlld3BvcnQgfSA9IHRoaXMuY29udGV4dDtcbiAgICAgIGNvbnN0IHByb2plY3RGbGF0ID0gKG8pID0+IHRoaXMucHJvamVjdEZsYXQobywgdmlld3BvcnQsIGNvb3JkaW5hdGVTeXN0ZW0sIGNvb3JkaW5hdGVPcmlnaW4pO1xuICAgICAgdGhpcy5zdGF0ZS5tYXJrZXJzID0gY3JlYXRlUGF0aE1hcmtlcnMoe1xuICAgICAgICBkYXRhLFxuICAgICAgICBnZXRQYXRoLFxuICAgICAgICBnZXREaXJlY3Rpb24sXG4gICAgICAgIGdldENvbG9yOiBnZXRNYXJrZXJDb2xvcixcbiAgICAgICAgZ2V0TWFya2VyUGVyY2VudGFnZXMsXG4gICAgICAgIHByb2plY3RGbGF0LFxuICAgICAgfSk7XG4gICAgICB0aGlzLl9yZWNhbGN1bGF0ZUNsb3Nlc3RQb2ludCgpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlRmxhZ3MucHJvcHNDaGFuZ2VkKSB7XG4gICAgICBpZiAocHJvcHMucG9pbnQgIT09IG9sZFByb3BzLnBvaW50KSB7XG4gICAgICAgIHRoaXMuX3JlY2FsY3VsYXRlQ2xvc2VzdFBvaW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX3JlY2FsY3VsYXRlQ2xvc2VzdFBvaW50KCkge1xuICAgIGNvbnN0IHsgaGlnaGxpZ2h0UG9pbnQsIGhpZ2hsaWdodEluZGV4IH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChoaWdobGlnaHRQb2ludCAmJiBoaWdobGlnaHRJbmRleCA+PSAwKSB7XG4gICAgICBjb25zdCBvYmplY3QgPSB0aGlzLnByb3BzLmRhdGFbaGlnaGxpZ2h0SW5kZXhdO1xuICAgICAgY29uc3QgcG9pbnRzID0gdGhpcy5wcm9wcy5nZXRQYXRoKG9iamVjdCk7XG4gICAgICBjb25zdCB7IHBvaW50IH0gPSBnZXRDbG9zZXN0UG9pbnRPblBvbHlsaW5lKHsgcG9pbnRzLCBwOiBoaWdobGlnaHRQb2ludCB9KTtcbiAgICAgIHRoaXMuc3RhdGUuY2xvc2VzdFBvaW50cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHBvc2l0aW9uOiBwb2ludCxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUuY2xvc2VzdFBvaW50cyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIGdldFBpY2tpbmdJbmZvKHsgaW5mbyB9KSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oaW5mbywge1xuICAgICAgLy8gb3ZlcnJpZGUgb2JqZWN0IHdpdGggcGlja2VkIGZlYXR1cmVcbiAgICAgIG9iamVjdDogKGluZm8ub2JqZWN0ICYmIGluZm8ub2JqZWN0LnBhdGgpIHx8IGluZm8ub2JqZWN0LFxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIHJldHVybiBbXG4gICAgICBuZXcgUGF0aE91dGxpbmVMYXllcihcbiAgICAgICAgdGhpcy5wcm9wcyxcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICAgIGlkOiAncGF0aHMnLFxuICAgICAgICAgIC8vIE5vdGU6IGRhdGEgaGFzIHRvIGJlIHBhc3NlZCBleHBsaWNpdGx5IGxpa2UgdGhpcyB0byBhdm9pZCBiZWluZyBlbXB0eVxuICAgICAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YSxcbiAgICAgICAgfSlcbiAgICAgICksXG4gICAgICBuZXcgdGhpcy5wcm9wcy5NYXJrZXJMYXllcihcbiAgICAgICAgdGhpcy5nZXRTdWJMYXllclByb3BzKFxuICAgICAgICAgIE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMubWFya2VyTGF5ZXJQcm9wcywge1xuICAgICAgICAgICAgaWQ6ICdtYXJrZXJzJyxcbiAgICAgICAgICAgIGRhdGE6IHRoaXMuc3RhdGUubWFya2VycyxcbiAgICAgICAgICAgIGdldE9yaWVudGF0aW9uOiAoeCkgPT4gWzAsIC14LmFuZ2xlLCAwXSxcbiAgICAgICAgICAgIGdldENvbG9yOiAoeCkgPT4geC5jb2xvcixcbiAgICAgICAgICAgIHNpemVTY2FsZTogdGhpcy5wcm9wcy5zaXplU2NhbGUsXG4gICAgICAgICAgICBmcDY0OiB0aGlzLnByb3BzLmZwNjQsXG4gICAgICAgICAgICBwaWNrYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIGJsZW5kOiBmYWxzZSxcbiAgICAgICAgICAgICAgZGVwdGhUZXN0OiBmYWxzZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIHRoaXMuc3RhdGUuY2xvc2VzdFBvaW50cyAmJlxuICAgICAgICBuZXcgU2NhdHRlcnBsb3RMYXllcih7XG4gICAgICAgICAgaWQ6IGAke3RoaXMucHJvcHMuaWR9LWhpZ2hsaWdodGAsXG4gICAgICAgICAgZGF0YTogdGhpcy5zdGF0ZS5jbG9zZXN0UG9pbnRzLFxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBmcDY0OiB0aGlzLnByb3BzLmZwNjQsXG4gICAgICAgIH0pLFxuICAgIF07XG4gIH1cbn1cbiJdfQ==