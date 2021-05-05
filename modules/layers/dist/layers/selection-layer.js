"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.SELECTION_TYPE = void 0;

var _core = require("@deck.gl/core");

var _layers = require("@deck.gl/layers");

var _helpers = require("@turf/helpers");

var _buffer = _interopRequireDefault(require("@turf/buffer"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _editModes = require("@nebula.gl/edit-modes");

var _editableGeojsonLayer = _interopRequireDefault(require("./editable-geojson-layer"));

var _MODE_MAP;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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

var SELECTION_TYPE = {
  NONE: null,
  RECTANGLE: 'rectangle',
  POLYGON: 'polygon'
};
exports.SELECTION_TYPE = SELECTION_TYPE;
var MODE_MAP = (_MODE_MAP = {}, _defineProperty(_MODE_MAP, SELECTION_TYPE.RECTANGLE, _editModes.DrawRectangleMode), _defineProperty(_MODE_MAP, SELECTION_TYPE.POLYGON, _editModes.DrawPolygonMode), _MODE_MAP);

var MODE_CONFIG_MAP = _defineProperty({}, SELECTION_TYPE.RECTANGLE, {
  dragToDraw: true
});

var defaultProps = {
  selectionType: SELECTION_TYPE.RECTANGLE,
  layerIds: [],
  onSelect: function onSelect() {}
};
var EMPTY_DATA = {
  type: 'FeatureCollection',
  features: []
};
var EXPANSION_KM = 50;
var LAYER_ID_GEOJSON = 'selection-geojson';
var LAYER_ID_BLOCKER = 'selection-blocker';
var PASS_THROUGH_PROPS = ['lineWidthScale', 'lineWidthMinPixels', 'lineWidthMaxPixels', 'lineWidthUnits', 'lineJointRounded', 'lineMiterLimit', 'pointRadiusScale', 'pointRadiusMinPixels', 'pointRadiusMaxPixels', 'lineDashJustified', 'getLineColor', 'getFillColor', 'getRadius', 'getLineWidth', 'getLineDashArray', 'getTentativeLineDashArray', 'getTentativeLineColor', 'getTentativeFillColor', 'getTentativeLineWidth'];

var SelectionLayer = /*#__PURE__*/function (_CompositeLayer) {
  _inherits(SelectionLayer, _CompositeLayer);

  var _super = _createSuper(SelectionLayer);

  function SelectionLayer() {
    _classCallCheck(this, SelectionLayer);

    return _super.apply(this, arguments);
  }

  _createClass(SelectionLayer, [{
    key: "_selectRectangleObjects",
    value: function _selectRectangleObjects(coordinates) {
      var _this$props = this.props,
          layerIds = _this$props.layerIds,
          onSelect = _this$props.onSelect; // @ts-ignore

      var _this$context$viewpor = this.context.viewport.project(coordinates[0][0]),
          _this$context$viewpor2 = _slicedToArray(_this$context$viewpor, 2),
          x1 = _this$context$viewpor2[0],
          y1 = _this$context$viewpor2[1]; // @ts-ignore


      var _this$context$viewpor3 = this.context.viewport.project(coordinates[0][2]),
          _this$context$viewpor4 = _slicedToArray(_this$context$viewpor3, 2),
          x2 = _this$context$viewpor4[0],
          y2 = _this$context$viewpor4[1]; // @ts-ignore


      var pickingInfos = this.context.deck.pickObjects({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
        layerIds: layerIds
      });
      onSelect({
        pickingInfos: pickingInfos
      });
    }
  }, {
    key: "_selectPolygonObjects",
    value: function _selectPolygonObjects(coordinates) {
      var _this = this;

      var _this$props2 = this.props,
          layerIds = _this$props2.layerIds,
          onSelect = _this$props2.onSelect; // @ts-ignore

      var mousePoints = coordinates[0].map(function (c) {
        return _this.context.viewport.project(c);
      });
      var allX = mousePoints.map(function (mousePoint) {
        return mousePoint[0];
      });
      var allY = mousePoints.map(function (mousePoint) {
        return mousePoint[1];
      });
      var x = Math.min.apply(Math, _toConsumableArray(allX));
      var y = Math.min.apply(Math, _toConsumableArray(allY));
      var maxX = Math.max.apply(Math, _toConsumableArray(allX));
      var maxY = Math.max.apply(Math, _toConsumableArray(allY)); // Use a polygon to hide the outside, because pickObjects()
      // does not support polygons

      var landPointsPoly = (0, _helpers.polygon)(coordinates);
      var bigBuffer = (0, _buffer["default"])(landPointsPoly, EXPANSION_KM);
      var bigPolygon;

      try {
        // turfDifference throws an exception if the polygon
        // intersects with itself (TODO: check if true in all versions)
        bigPolygon = (0, _difference["default"])(bigBuffer, landPointsPoly);
      } catch (e) {
        // invalid selection polygon
        console.log('turfDifference() error', e); // eslint-disable-line

        return;
      }

      this.setState({
        pendingPolygonSelection: {
          bigPolygon: bigPolygon
        }
      });
      var blockerId = "".concat(this.props.id, "-").concat(LAYER_ID_BLOCKER); // HACK, find a better way

      setTimeout(function () {
        // @ts-ignore
        var pickingInfos = _this.context.deck.pickObjects({
          x: x,
          y: y,
          width: maxX - x,
          height: maxY - y,
          layerIds: [blockerId].concat(_toConsumableArray(layerIds))
        });

        onSelect({
          pickingInfos: pickingInfos.filter(function (item) {
            return item.layer.id !== _this.props.id;
          })
        });
      }, 250);
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      var _this2 = this;

      var pendingPolygonSelection = this.state.pendingPolygonSelection;
      var mode = MODE_MAP[this.props.selectionType] || _editModes.ViewMode;
      var modeConfig = MODE_CONFIG_MAP[this.props.selectionType];
      var inheritedProps = {};
      PASS_THROUGH_PROPS.forEach(function (p) {
        if (_this2.props[p] !== undefined) inheritedProps[p] = _this2.props[p];
      });
      var layers = [new _editableGeojsonLayer["default"](this.getSubLayerProps(_objectSpread({
        id: LAYER_ID_GEOJSON,
        pickable: true,
        mode: mode,
        modeConfig: modeConfig,
        selectedFeatureIndexes: [],
        data: EMPTY_DATA,
        onEdit: function onEdit(_ref) {
          var updatedData = _ref.updatedData,
              editType = _ref.editType;

          if (editType === 'addFeature') {
            var coordinates = updatedData.features[0].geometry.coordinates;

            if (_this2.props.selectionType === SELECTION_TYPE.RECTANGLE) {
              _this2._selectRectangleObjects(coordinates);
            } else if (_this2.props.selectionType === SELECTION_TYPE.POLYGON) {
              _this2._selectPolygonObjects(coordinates);
            }
          }
        }
      }, inheritedProps)))];

      if (pendingPolygonSelection) {
        var bigPolygon = pendingPolygonSelection.bigPolygon;
        layers.push(new _layers.PolygonLayer( // @ts-ignore
        this.getSubLayerProps({
          id: LAYER_ID_BLOCKER,
          pickable: true,
          stroked: false,
          opacity: 1.0,
          data: [bigPolygon],
          getLineColor: function getLineColor(obj) {
            return [0, 0, 0, 1];
          },
          getFillColor: function getFillColor(obj) {
            return [0, 0, 0, 1];
          },
          getPolygon: function getPolygon(o) {
            return o.geometry.coordinates;
          }
        })));
      }

      return layers;
    }
  }, {
    key: "shouldUpdateState",
    value: function shouldUpdateState(_ref2) {
      var _ref2$changeFlags = _ref2.changeFlags,
          stateChanged = _ref2$changeFlags.stateChanged,
          propsOrDataChanged = _ref2$changeFlags.propsOrDataChanged;
      return stateChanged || propsOrDataChanged;
    }
  }]);

  return SelectionLayer;
}(_core.CompositeLayer);

exports["default"] = SelectionLayer;

_defineProperty(SelectionLayer, "layerName", 'SelectionLayer');

_defineProperty(SelectionLayer, "defaultProps", defaultProps);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvc2VsZWN0aW9uLWxheWVyLnRzIl0sIm5hbWVzIjpbIlNFTEVDVElPTl9UWVBFIiwiTk9ORSIsIlJFQ1RBTkdMRSIsIlBPTFlHT04iLCJNT0RFX01BUCIsIkRyYXdSZWN0YW5nbGVNb2RlIiwiRHJhd1BvbHlnb25Nb2RlIiwiTU9ERV9DT05GSUdfTUFQIiwiZHJhZ1RvRHJhdyIsImRlZmF1bHRQcm9wcyIsInNlbGVjdGlvblR5cGUiLCJsYXllcklkcyIsIm9uU2VsZWN0IiwiRU1QVFlfREFUQSIsInR5cGUiLCJmZWF0dXJlcyIsIkVYUEFOU0lPTl9LTSIsIkxBWUVSX0lEX0dFT0pTT04iLCJMQVlFUl9JRF9CTE9DS0VSIiwiUEFTU19USFJPVUdIX1BST1BTIiwiU2VsZWN0aW9uTGF5ZXIiLCJjb29yZGluYXRlcyIsInByb3BzIiwiY29udGV4dCIsInZpZXdwb3J0IiwicHJvamVjdCIsIngxIiwieTEiLCJ4MiIsInkyIiwicGlja2luZ0luZm9zIiwiZGVjayIsInBpY2tPYmplY3RzIiwieCIsIk1hdGgiLCJtaW4iLCJ5Iiwid2lkdGgiLCJhYnMiLCJoZWlnaHQiLCJtb3VzZVBvaW50cyIsIm1hcCIsImMiLCJhbGxYIiwibW91c2VQb2ludCIsImFsbFkiLCJtYXhYIiwibWF4IiwibWF4WSIsImxhbmRQb2ludHNQb2x5IiwiYmlnQnVmZmVyIiwiYmlnUG9seWdvbiIsImUiLCJjb25zb2xlIiwibG9nIiwic2V0U3RhdGUiLCJwZW5kaW5nUG9seWdvblNlbGVjdGlvbiIsImJsb2NrZXJJZCIsImlkIiwic2V0VGltZW91dCIsImZpbHRlciIsIml0ZW0iLCJsYXllciIsInN0YXRlIiwibW9kZSIsIlZpZXdNb2RlIiwibW9kZUNvbmZpZyIsImluaGVyaXRlZFByb3BzIiwiZm9yRWFjaCIsInAiLCJ1bmRlZmluZWQiLCJsYXllcnMiLCJFZGl0YWJsZUdlb0pzb25MYXllciIsImdldFN1YkxheWVyUHJvcHMiLCJwaWNrYWJsZSIsInNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJkYXRhIiwib25FZGl0IiwidXBkYXRlZERhdGEiLCJlZGl0VHlwZSIsImdlb21ldHJ5IiwiX3NlbGVjdFJlY3RhbmdsZU9iamVjdHMiLCJfc2VsZWN0UG9seWdvbk9iamVjdHMiLCJwdXNoIiwiUG9seWdvbkxheWVyIiwic3Ryb2tlZCIsIm9wYWNpdHkiLCJnZXRMaW5lQ29sb3IiLCJvYmoiLCJnZXRGaWxsQ29sb3IiLCJnZXRQb2x5Z29uIiwibyIsImNoYW5nZUZsYWdzIiwic3RhdGVDaGFuZ2VkIiwicHJvcHNPckRhdGFDaGFuZ2VkIiwiQ29tcG9zaXRlTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRU8sSUFBTUEsY0FBYyxHQUFHO0FBQzVCQyxFQUFBQSxJQUFJLEVBQUUsSUFEc0I7QUFFNUJDLEVBQUFBLFNBQVMsRUFBRSxXQUZpQjtBQUc1QkMsRUFBQUEsT0FBTyxFQUFFO0FBSG1CLENBQXZCOztBQU1QLElBQU1DLFFBQVEsK0NBQ1hKLGNBQWMsQ0FBQ0UsU0FESixFQUNnQkcsNEJBRGhCLDhCQUVYTCxjQUFjLENBQUNHLE9BRkosRUFFY0csMEJBRmQsYUFBZDs7QUFLQSxJQUFNQyxlQUFlLHVCQUNsQlAsY0FBYyxDQUFDRSxTQURHLEVBQ1M7QUFBRU0sRUFBQUEsVUFBVSxFQUFFO0FBQWQsQ0FEVCxDQUFyQjs7QUFJQSxJQUFNQyxZQUFZLEdBQUc7QUFDbkJDLEVBQUFBLGFBQWEsRUFBRVYsY0FBYyxDQUFDRSxTQURYO0FBRW5CUyxFQUFBQSxRQUFRLEVBQUUsRUFGUztBQUduQkMsRUFBQUEsUUFBUSxFQUFFLG9CQUFNLENBQUU7QUFIQyxDQUFyQjtBQU1BLElBQU1DLFVBQVUsR0FBRztBQUNqQkMsRUFBQUEsSUFBSSxFQUFFLG1CQURXO0FBRWpCQyxFQUFBQSxRQUFRLEVBQUU7QUFG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RUFBVSxDQUFWLENBQVQ7QUFBQSxXQU5NO0FBT3BCQyxVQUFBQSxZQUFZLEVBQUUsc0JBQUNELEdBQUQ7QUFBQSxtQkFBUyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsQ0FBVDtBQUFBLFdBUE07QUFRcEJFLFVBQUFBLFVBQVUsRUFBRSxvQkFBQ0MsQ0FBRDtBQUFBLG1CQUFPQSxDQUFDLENBQUNYLFFBQUYsQ0FBVzNELFdBQWxCO0FBQUE7QUFSUSxTQUF0QixDQUZGLENBREY7QUFlRDs7QUFFRCxhQUFPa0QsTUFBUDtBQUNEOzs7NkNBRTZGO0FBQUEsb0NBQTFFcUIsV0FBMEU7QUFBQSxVQUEzREMsWUFBMkQscUJBQTNEQSxZQUEyRDtBQUFBLFVBQTdDQyxrQkFBNkMscUJBQTdDQSxrQkFBNkM7QUFDNUYsYUFBT0QsWUFBWSxJQUFJQyxrQkFBdkI7QUFDRDs7OztFQXRJeUNDLG9COzs7O2dCQUF2QjNFLGMsZUFDQSxnQjs7Z0JBREFBLGMsa0JBRUdYLFkiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbmltcG9ydCB7IENvbXBvc2l0ZUxheWVyIH0gZnJvbSAnQGRlY2suZ2wvY29yZSc7XG5pbXBvcnQgeyBQb2x5Z29uTGF5ZXIgfSBmcm9tICdAZGVjay5nbC9sYXllcnMnO1xuaW1wb3J0IHsgcG9seWdvbiB9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHR1cmZCdWZmZXIgZnJvbSAnQHR1cmYvYnVmZmVyJztcbmltcG9ydCB0dXJmRGlmZmVyZW5jZSBmcm9tICdAdHVyZi9kaWZmZXJlbmNlJztcbmltcG9ydCB7IERyYXdSZWN0YW5nbGVNb2RlLCBEcmF3UG9seWdvbk1vZGUsIFZpZXdNb2RlIH0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcblxuaW1wb3J0IEVkaXRhYmxlR2VvSnNvbkxheWVyIGZyb20gJy4vZWRpdGFibGUtZ2VvanNvbi1sYXllcic7XG5cbmV4cG9ydCBjb25zdCBTRUxFQ1RJT05fVFlQRSA9IHtcbiAgTk9ORTogbnVsbCxcbiAgUkVDVEFOR0xFOiAncmVjdGFuZ2xlJyxcbiAgUE9MWUdPTjogJ3BvbHlnb24nLFxufTtcblxuY29uc3QgTU9ERV9NQVAgPSB7XG4gIFtTRUxFQ1RJT05fVFlQRS5SRUNUQU5HTEVdOiBEcmF3UmVjdGFuZ2xlTW9kZSxcbiAgW1NFTEVDVElPTl9UWVBFLlBPTFlHT05dOiBEcmF3UG9seWdvbk1vZGUsXG59O1xuXG5jb25zdCBNT0RFX0NPTkZJR19NQVAgPSB7XG4gIFtTRUxFQ1RJT05fVFlQRS5SRUNUQU5HTEVdOiB7IGRyYWdUb0RyYXc6IHRydWUgfSxcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgc2VsZWN0aW9uVHlwZTogU0VMRUNUSU9OX1RZUEUuUkVDVEFOR0xFLFxuICBsYXllcklkczogW10sXG4gIG9uU2VsZWN0OiAoKSA9PiB7fSxcbn07XG5cbmNvbnN0IEVNUFRZX0RBVEEgPSB7XG4gIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gIGZlYXR1cmVzOiBbXSxcbn07XG5cbmNvbnN0IEVYUEFOU0lPTl9LTSA9IDUwO1xuY29uc3QgTEFZRVJfSURfR0VPSlNPTiA9ICdzZWxlY3Rpb24tZ2VvanNvbic7XG5jb25zdCBMQVlFUl9JRF9CTE9DS0VSID0gJ3NlbGVjdGlvbi1ibG9ja2VyJztcblxuY29uc3QgUEFTU19USFJPVUdIX1BST1BTID0gW1xuICAnbGluZVdpZHRoU2NhbGUnLFxuICAnbGluZVdpZHRoTWluUGl4ZWxzJyxcbiAgJ2xpbmVXaWR0aE1heFBpeGVscycsXG4gICdsaW5lV2lkdGhVbml0cycsXG4gICdsaW5lSm9pbnRSb3VuZGVkJyxcbiAgJ2xpbmVNaXRlckxpbWl0JyxcbiAgJ3BvaW50UmFkaXVzU2NhbGUnLFxuICAncG9pbnRSYWRpdXNNaW5QaXhlbHMnLFxuICAncG9pbnRSYWRpdXNNYXhQaXhlbHMnLFxuICAnbGluZURhc2hKdXN0aWZpZWQnLFxuICAnZ2V0TGluZUNvbG9yJyxcbiAgJ2dldEZpbGxDb2xvcicsXG4gICdnZXRSYWRpdXMnLFxuICAnZ2V0TGluZVdpZHRoJyxcbiAgJ2dldExpbmVEYXNoQXJyYXknLFxuICAnZ2V0VGVudGF0aXZlTGluZURhc2hBcnJheScsXG4gICdnZXRUZW50YXRpdmVMaW5lQ29sb3InLFxuICAnZ2V0VGVudGF0aXZlRmlsbENvbG9yJyxcbiAgJ2dldFRlbnRhdGl2ZUxpbmVXaWR0aCcsXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3Rpb25MYXllciBleHRlbmRzIENvbXBvc2l0ZUxheWVyPGFueT4ge1xuICBzdGF0aWMgbGF5ZXJOYW1lID0gJ1NlbGVjdGlvbkxheWVyJztcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuICBfc2VsZWN0UmVjdGFuZ2xlT2JqZWN0cyhjb29yZGluYXRlczogYW55KSB7XG4gICAgY29uc3QgeyBsYXllcklkcywgb25TZWxlY3QgfSA9IHRoaXMucHJvcHM7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IFt4MSwgeTFdID0gdGhpcy5jb250ZXh0LnZpZXdwb3J0LnByb2plY3QoY29vcmRpbmF0ZXNbMF1bMF0pO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBbeDIsIHkyXSA9IHRoaXMuY29udGV4dC52aWV3cG9ydC5wcm9qZWN0KGNvb3JkaW5hdGVzWzBdWzJdKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgcGlja2luZ0luZm9zID0gdGhpcy5jb250ZXh0LmRlY2sucGlja09iamVjdHMoe1xuICAgICAgeDogTWF0aC5taW4oeDEsIHgyKSxcbiAgICAgIHk6IE1hdGgubWluKHkxLCB5MiksXG4gICAgICB3aWR0aDogTWF0aC5hYnMoeDIgLSB4MSksXG4gICAgICBoZWlnaHQ6IE1hdGguYWJzKHkyIC0geTEpLFxuICAgICAgbGF5ZXJJZHMsXG4gICAgfSk7XG5cbiAgICBvblNlbGVjdCh7IHBpY2tpbmdJbmZvcyB9KTtcbiAgfVxuXG4gIF9zZWxlY3RQb2x5Z29uT2JqZWN0cyhjb29yZGluYXRlczogYW55KSB7XG4gICAgY29uc3QgeyBsYXllcklkcywgb25TZWxlY3QgfSA9IHRoaXMucHJvcHM7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IG1vdXNlUG9pbnRzID0gY29vcmRpbmF0ZXNbMF0ubWFwKChjKSA9PiB0aGlzLmNvbnRleHQudmlld3BvcnQucHJvamVjdChjKSk7XG5cbiAgICBjb25zdCBhbGxYID0gbW91c2VQb2ludHMubWFwKChtb3VzZVBvaW50KSA9PiBtb3VzZVBvaW50WzBdKTtcbiAgICBjb25zdCBhbGxZID0gbW91c2VQb2ludHMubWFwKChtb3VzZVBvaW50KSA9PiBtb3VzZVBvaW50WzFdKTtcbiAgICBjb25zdCB4ID0gTWF0aC5taW4oLi4uYWxsWCk7XG4gICAgY29uc3QgeSA9IE1hdGgubWluKC4uLmFsbFkpO1xuICAgIGNvbnN0IG1heFggPSBNYXRoLm1heCguLi5hbGxYKTtcbiAgICBjb25zdCBtYXhZID0gTWF0aC5tYXgoLi4uYWxsWSk7XG5cbiAgICAvLyBVc2UgYSBwb2x5Z29uIHRvIGhpZGUgdGhlIG91dHNpZGUsIGJlY2F1c2UgcGlja09iamVjdHMoKVxuICAgIC8vIGRvZXMgbm90IHN1cHBvcnQgcG9seWdvbnNcbiAgICBjb25zdCBsYW5kUG9pbnRzUG9seSA9IHBvbHlnb24oY29vcmRpbmF0ZXMpO1xuICAgIGNvbnN0IGJpZ0J1ZmZlciA9IHR1cmZCdWZmZXIobGFuZFBvaW50c1BvbHksIEVYUEFOU0lPTl9LTSk7XG4gICAgbGV0IGJpZ1BvbHlnb247XG4gICAgdHJ5IHtcbiAgICAgIC8vIHR1cmZEaWZmZXJlbmNlIHRocm93cyBhbiBleGNlcHRpb24gaWYgdGhlIHBvbHlnb25cbiAgICAgIC8vIGludGVyc2VjdHMgd2l0aCBpdHNlbGYgKFRPRE86IGNoZWNrIGlmIHRydWUgaW4gYWxsIHZlcnNpb25zKVxuICAgICAgYmlnUG9seWdvbiA9IHR1cmZEaWZmZXJlbmNlKGJpZ0J1ZmZlciwgbGFuZFBvaW50c1BvbHkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIGludmFsaWQgc2VsZWN0aW9uIHBvbHlnb25cbiAgICAgIGNvbnNvbGUubG9nKCd0dXJmRGlmZmVyZW5jZSgpIGVycm9yJywgZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHBlbmRpbmdQb2x5Z29uU2VsZWN0aW9uOiB7XG4gICAgICAgIGJpZ1BvbHlnb24sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgYmxvY2tlcklkID0gYCR7dGhpcy5wcm9wcy5pZH0tJHtMQVlFUl9JRF9CTE9DS0VSfWA7XG5cbiAgICAvLyBIQUNLLCBmaW5kIGEgYmV0dGVyIHdheVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgcGlja2luZ0luZm9zID0gdGhpcy5jb250ZXh0LmRlY2sucGlja09iamVjdHMoe1xuICAgICAgICB4LFxuICAgICAgICB5LFxuICAgICAgICB3aWR0aDogbWF4WCAtIHgsXG4gICAgICAgIGhlaWdodDogbWF4WSAtIHksXG4gICAgICAgIGxheWVySWRzOiBbYmxvY2tlcklkLCAuLi5sYXllcklkc10sXG4gICAgICB9KTtcblxuICAgICAgb25TZWxlY3Qoe1xuICAgICAgICBwaWNraW5nSW5mb3M6IHBpY2tpbmdJbmZvcy5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0ubGF5ZXIuaWQgIT09IHRoaXMucHJvcHMuaWQpLFxuICAgICAgfSk7XG4gICAgfSwgMjUwKTtcbiAgfVxuXG4gIHJlbmRlckxheWVycygpIHtcbiAgICBjb25zdCB7IHBlbmRpbmdQb2x5Z29uU2VsZWN0aW9uIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgY29uc3QgbW9kZSA9IE1PREVfTUFQW3RoaXMucHJvcHMuc2VsZWN0aW9uVHlwZV0gfHwgVmlld01vZGU7XG4gICAgY29uc3QgbW9kZUNvbmZpZyA9IE1PREVfQ09ORklHX01BUFt0aGlzLnByb3BzLnNlbGVjdGlvblR5cGVdO1xuXG4gICAgY29uc3QgaW5oZXJpdGVkUHJvcHMgPSB7fTtcbiAgICBQQVNTX1RIUk9VR0hfUFJPUFMuZm9yRWFjaCgocCkgPT4ge1xuICAgICAgaWYgKHRoaXMucHJvcHNbcF0gIT09IHVuZGVmaW5lZCkgaW5oZXJpdGVkUHJvcHNbcF0gPSB0aGlzLnByb3BzW3BdO1xuICAgIH0pO1xuXG4gICAgY29uc3QgbGF5ZXJzID0gW1xuICAgICAgbmV3IEVkaXRhYmxlR2VvSnNvbkxheWVyKFxuICAgICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICAgIGlkOiBMQVlFUl9JRF9HRU9KU09OLFxuICAgICAgICAgIHBpY2thYmxlOiB0cnVlLFxuICAgICAgICAgIG1vZGUsXG4gICAgICAgICAgbW9kZUNvbmZpZyxcbiAgICAgICAgICBzZWxlY3RlZEZlYXR1cmVJbmRleGVzOiBbXSxcbiAgICAgICAgICBkYXRhOiBFTVBUWV9EQVRBLFxuICAgICAgICAgIG9uRWRpdDogKHsgdXBkYXRlZERhdGEsIGVkaXRUeXBlIH0pID0+IHtcbiAgICAgICAgICAgIGlmIChlZGl0VHlwZSA9PT0gJ2FkZEZlYXR1cmUnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHsgY29vcmRpbmF0ZXMgfSA9IHVwZGF0ZWREYXRhLmZlYXR1cmVzWzBdLmdlb21ldHJ5O1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLnByb3BzLnNlbGVjdGlvblR5cGUgPT09IFNFTEVDVElPTl9UWVBFLlJFQ1RBTkdMRSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdFJlY3RhbmdsZU9iamVjdHMoY29vcmRpbmF0ZXMpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuc2VsZWN0aW9uVHlwZSA9PT0gU0VMRUNUSU9OX1RZUEUuUE9MWUdPTikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdFBvbHlnb25PYmplY3RzKGNvb3JkaW5hdGVzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgLi4uaW5oZXJpdGVkUHJvcHMsXG4gICAgICAgIH0pXG4gICAgICApLFxuICAgIF07XG5cbiAgICBpZiAocGVuZGluZ1BvbHlnb25TZWxlY3Rpb24pIHtcbiAgICAgIGNvbnN0IHsgYmlnUG9seWdvbiB9ID0gcGVuZGluZ1BvbHlnb25TZWxlY3Rpb247XG4gICAgICBsYXllcnMucHVzaChcbiAgICAgICAgbmV3IFBvbHlnb25MYXllcihcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgdGhpcy5nZXRTdWJMYXllclByb3BzKHtcbiAgICAgICAgICAgIGlkOiBMQVlFUl9JRF9CTE9DS0VSLFxuICAgICAgICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICAgICAgICBzdHJva2VkOiBmYWxzZSxcbiAgICAgICAgICAgIG9wYWNpdHk6IDEuMCxcbiAgICAgICAgICAgIGRhdGE6IFtiaWdQb2x5Z29uXSxcbiAgICAgICAgICAgIGdldExpbmVDb2xvcjogKG9iaikgPT4gWzAsIDAsIDAsIDFdLFxuICAgICAgICAgICAgZ2V0RmlsbENvbG9yOiAob2JqKSA9PiBbMCwgMCwgMCwgMV0sXG4gICAgICAgICAgICBnZXRQb2x5Z29uOiAobykgPT4gby5nZW9tZXRyeS5jb29yZGluYXRlcyxcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICBzaG91bGRVcGRhdGVTdGF0ZSh7IGNoYW5nZUZsYWdzOiB7IHN0YXRlQ2hhbmdlZCwgcHJvcHNPckRhdGFDaGFuZ2VkIH0gfTogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIHJldHVybiBzdGF0ZUNoYW5nZWQgfHwgcHJvcHNPckRhdGFDaGFuZ2VkO1xuICB9XG59XG4iXX0=