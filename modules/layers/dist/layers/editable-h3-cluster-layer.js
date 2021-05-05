"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _geoLayers = require("@deck.gl/geo-layers");

var _editModes = require("@nebula.gl/edit-modes");

var _h3Js = require("h3-js");

var _editableGeojsonLayer = _interopRequireDefault(require("./editable-geojson-layer"));

var _editableLayer = _interopRequireDefault(require("./editable-layer"));

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

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_EDIT_MODE = _editModes.ViewMode;
var DEFAULT_H3_RESOLUTION = 9;
var EMPTY_FEATURE_COLLECTION = {
  type: 'FeatureCollection',
  features: []
};

var defaultProps = _objectSpread({
  mode: DEFAULT_EDIT_MODE
}, _editableGeojsonLayer["default"].defaultProps, {
  // h3 layer
  data: [],
  selectedIndexes: [],
  filled: false,
  stroked: true,
  lineWidthScale: 1,
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
  lineWidthUnits: 'pixels',
  getHexagons: function getHexagons(d) {
    return d.hexIds;
  },
  getEditedCluster: function getEditedCluster(updatedHexagons, existingCluster) {
    if (existingCluster) {
      return _objectSpread({}, existingCluster, {
        hexIds: updatedHexagons
      });
    }

    return {
      hexIds: updatedHexagons
    };
  },
  resolution: DEFAULT_H3_RESOLUTION
});

var EditableH3ClusterLayer = /*#__PURE__*/function (_EditableLayer) {
  _inherits(EditableH3ClusterLayer, _EditableLayer);

  var _super = _createSuper(EditableH3ClusterLayer);

  function EditableH3ClusterLayer() {
    _classCallCheck(this, EditableH3ClusterLayer);

    return _super.apply(this, arguments);
  }

  _createClass(EditableH3ClusterLayer, [{
    key: "initializeState",
    value: function initializeState() {
      _get(_getPrototypeOf(EditableH3ClusterLayer.prototype), "initializeState", this).call(this);

      this.setState({
        tentativeHexagonIDs: []
      });
    } // convert array of (lng, lat) coords to cluster of hexes

  }, {
    key: "getDerivedHexagonIDs",
    value: function getDerivedHexagonIDs(coords) {
      return (0, _h3Js.polyfill)(coords, this.props.resolution, true);
    } // convert pair of (lng, lat) coords into single hex

  }, {
    key: "getDerivedHexagonID",
    value: function getDerivedHexagonID(coords) {
      return (0, _h3Js.geoToH3)(coords[1], coords[0], this.props.resolution);
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      var _this = this;

      var layers = [new _editableGeojsonLayer["default"](this.getSubLayerProps({
        id: 'editable-geojson',
        mode: this.props.mode,
        data: EMPTY_FEATURE_COLLECTION,
        selectedFeatureIndexes: [],
        onEdit: function onEdit(editAction) {
          var editType = editAction.editType,
              editContext = editAction.editContext;

          switch (editType) {
            case 'updateTentativeFeature':
              // tentative feature updates, updated on every pointer move
              if (editContext.feature.geometry.type === 'Polygon') {
                var coords = editContext.feature.geometry.coordinates;

                var hexIDs = _this.getDerivedHexagonIDs(coords);

                _this.setState({
                  tentativeHexagonIDs: hexIDs
                });
              } else if (editContext.feature.geometry.type === 'Point') {
                var _coords = editContext.feature.geometry.coordinates;

                var hexID = _this.getDerivedHexagonID(_coords);

                _this.setState({
                  tentativeHexagonIDs: [hexID]
                });
              }

              break;

            case 'addFeature':
              var updatedData = _toConsumableArray(_this.props.data);

              var modeConfig = _this.props.modeConfig;

              if (!modeConfig || !modeConfig.booleanOperation) {
                // add new h3 cluster
                updatedData.push(_this.props.getEditedCluster(_this.state.tentativeHexagonIDs, null));
              } else if (_this.props.selectedIndexes.length !== 1) {
                // eslint-disable-next-line no-console,no-undef
                console.warn('booleanOperation only supported for single cluster selection');
              } else {
                // they're affecting a selected cluster
                var finalHexagonIDs;
                var committedHexagonIDs = new Set(_this.getSelectedHexIDs());
                var tentativeHexagonIDs = new Set(_this.state.tentativeHexagonIDs);

                switch (modeConfig.booleanOperation) {
                  case 'union':
                  default:
                    finalHexagonIDs = _toConsumableArray(new Set([].concat(_toConsumableArray(committedHexagonIDs), _toConsumableArray(tentativeHexagonIDs))));
                    break;

                  case 'intersection':
                    finalHexagonIDs = _toConsumableArray(committedHexagonIDs).filter(function (hexID) {
                      return tentativeHexagonIDs.has(hexID);
                    });
                    break;

                  case 'difference':
                    finalHexagonIDs = _toConsumableArray(committedHexagonIDs).filter(function (hexID) {
                      return !tentativeHexagonIDs.has(hexID);
                    });
                    break;
                }

                var selectedIndex = _this.props.selectedIndexes[0];
                var existingCluster = _this.props.data[selectedIndex];
                updatedData[selectedIndex] = _this.props.getEditedCluster(finalHexagonIDs, existingCluster);
              }

              _this.setState({
                tentativeHexagonIDs: []
              });

              _this.props.onEdit({
                updatedData: updatedData
              });

              break;

            default:
              break;
          }
        }
      })), new _geoLayers.H3ClusterLayer(this.getSubLayerProps({
        id: 'hexagons',
        data: this.props.data,
        getHexagons: this.props.getHexagons
      })), new _geoLayers.H3ClusterLayer(this.getSubLayerProps({
        id: 'tentative-hexagons',
        data: [{
          hexIds: this.state.tentativeHexagonIDs
        }],
        getHexagons: function getHexagons(d) {
          return d.hexIds;
        }
      }))];
      return layers;
    } // because data is an array of hexagon data, we take the cumulative of all selected indexes,
    // using props.getHexagons to support multiple data types

  }, {
    key: "getSelectedHexIDs",
    value: function getSelectedHexIDs() {
      var _this2 = this;

      var cumulativeHexIDs = [];
      this.props.selectedIndexes.forEach(function (index) {
        var selectedCluster = _this2.props.data[index];

        var hexIDs = _this2.props.getHexagons(selectedCluster);

        cumulativeHexIDs = cumulativeHexIDs.concat(hexIDs);
      });
      return cumulativeHexIDs;
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref) {
      var isDragging = _ref.isDragging;
      var cursor = this.state.cursor;

      if (!cursor) {
        // default cursor
        cursor = isDragging ? 'grabbing' : 'grab';
      }

      return cursor;
    }
  }]);

  return EditableH3ClusterLayer;
}(_editableLayer["default"]);

exports["default"] = EditableH3ClusterLayer;

_defineProperty(EditableH3ClusterLayer, "layerName", 'EditableH3ClusterLayer');

_defineProperty(EditableH3ClusterLayer, "defaultProps", defaultProps);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtaDMtY2x1c3Rlci1sYXllci50cyJdLCJuYW1lcyI6WyJERUZBVUxUX0VESVRfTU9ERSIsIlZpZXdNb2RlIiwiREVGQVVMVF9IM19SRVNPTFVUSU9OIiwiRU1QVFlfRkVBVFVSRV9DT0xMRUNUSU9OIiwidHlwZSIsImZlYXR1cmVzIiwiZGVmYXVsdFByb3BzIiwibW9kZSIsIkVkaXRhYmxlR2VvSnNvbkxheWVyIiwiZGF0YSIsInNlbGVjdGVkSW5kZXhlcyIsImZpbGxlZCIsInN0cm9rZWQiLCJsaW5lV2lkdGhTY2FsZSIsImxpbmVXaWR0aE1pblBpeGVscyIsImxpbmVXaWR0aE1heFBpeGVscyIsIk51bWJlciIsIk1BWF9TQUZFX0lOVEVHRVIiLCJsaW5lV2lkdGhVbml0cyIsImdldEhleGFnb25zIiwiZCIsImhleElkcyIsImdldEVkaXRlZENsdXN0ZXIiLCJ1cGRhdGVkSGV4YWdvbnMiLCJleGlzdGluZ0NsdXN0ZXIiLCJyZXNvbHV0aW9uIiwiRWRpdGFibGVIM0NsdXN0ZXJMYXllciIsInNldFN0YXRlIiwidGVudGF0aXZlSGV4YWdvbklEcyIsImNvb3JkcyIsInByb3BzIiwibGF5ZXJzIiwiZ2V0U3ViTGF5ZXJQcm9wcyIsImlkIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsIm9uRWRpdCIsImVkaXRBY3Rpb24iLCJlZGl0VHlwZSIsImVkaXRDb250ZXh0IiwiZmVhdHVyZSIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiLCJoZXhJRHMiLCJnZXREZXJpdmVkSGV4YWdvbklEcyIsImhleElEIiwiZ2V0RGVyaXZlZEhleGFnb25JRCIsInVwZGF0ZWREYXRhIiwibW9kZUNvbmZpZyIsImJvb2xlYW5PcGVyYXRpb24iLCJwdXNoIiwic3RhdGUiLCJsZW5ndGgiLCJjb25zb2xlIiwid2FybiIsImZpbmFsSGV4YWdvbklEcyIsImNvbW1pdHRlZEhleGFnb25JRHMiLCJTZXQiLCJnZXRTZWxlY3RlZEhleElEcyIsImZpbHRlciIsImhhcyIsInNlbGVjdGVkSW5kZXgiLCJIM0NsdXN0ZXJMYXllciIsImN1bXVsYXRpdmVIZXhJRHMiLCJmb3JFYWNoIiwiaW5kZXgiLCJzZWxlY3RlZENsdXN0ZXIiLCJjb25jYXQiLCJpc0RyYWdnaW5nIiwiY3Vyc29yIiwiRWRpdGFibGVMYXllciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxpQkFBaUIsR0FBR0MsbUJBQTFCO0FBQ0EsSUFBTUMscUJBQXFCLEdBQUcsQ0FBOUI7QUFDQSxJQUFNQyx3QkFBd0IsR0FBRztBQUMvQkMsRUFBQUEsSUFBSSxFQUFFLG1CQUR5QjtBQUUvQkMsRUFBQUEsUUFBUSxFQUFFO0FBRnFCLENBQWpDOztBQUtBLElBQU1DLFlBQVk7QUFDaEJDLEVBQUFBLElBQUksRUFBRVA7QUFEVSxHQUliUSxpQ0FBcUJGLFlBSlI7QUFNaEI7QUFDQUcsRUFBQUEsSUFBSSxFQUFFLEVBUFU7QUFRaEJDLEVBQUFBLGVBQWUsRUFBRSxFQVJEO0FBU2hCQyxFQUFBQSxNQUFNLEVBQUUsS0FUUTtBQVVoQkMsRUFBQUEsT0FBTyxFQUFFLElBVk87QUFXaEJDLEVBQUFBLGNBQWMsRUFBRSxDQVhBO0FBWWhCQyxFQUFBQSxrQkFBa0IsRUFBRSxDQVpKO0FBYWhCQyxFQUFBQSxrQkFBa0IsRUFBRUMsTUFBTSxDQUFDQyxnQkFiWDtBQWNoQkMsRUFBQUEsY0FBYyxFQUFFLFFBZEE7QUFlaEJDLEVBQUFBLFdBQVcsRUFBRSxxQkFBQ0MsQ0FBRDtBQUFBLFdBQU9BLENBQUMsQ0FBQ0MsTUFBVDtBQUFBLEdBZkc7QUFnQmhCQyxFQUFBQSxnQkFBZ0IsRUFBRSwwQkFBQ0MsZUFBRCxFQUFrQkMsZUFBbEIsRUFBc0M7QUFDdEQsUUFBSUEsZUFBSixFQUFxQjtBQUNuQiwrQkFDS0EsZUFETDtBQUVFSCxRQUFBQSxNQUFNLEVBQUVFO0FB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LENBQVdYLFdBQVgsQ0FBdUI4QyxlQUF2QixDQUFmOztBQUNBSCxRQUFBQSxnQkFBZ0IsR0FBR0EsZ0JBQWdCLENBQUNJLE1BQWpCLENBQXdCeEIsTUFBeEIsQ0FBbkI7QUFDRCxPQUpEO0FBS0EsYUFBT29CLGdCQUFQO0FBQ0Q7OztvQ0FFa0Q7QUFBQSxVQUF2Q0ssVUFBdUMsUUFBdkNBLFVBQXVDO0FBQUEsVUFDM0NDLE1BRDJDLEdBQ2hDLEtBQUtsQixLQUQyQixDQUMzQ2tCLE1BRDJDOztBQUVqRCxVQUFJLENBQUNBLE1BQUwsRUFBYTtBQUNYO0FBQ0FBLFFBQUFBLE1BQU0sR0FBR0QsVUFBVSxHQUFHLFVBQUgsR0FBZ0IsTUFBbkM7QUFDRDs7QUFDRCxhQUFPQyxNQUFQO0FBQ0Q7Ozs7RUF0SmlEQyx5Qjs7OztnQkFBL0IzQyxzQixlQUNBLHdCOztnQkFEQUEsc0Isa0JBRUdwQixZIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWVudiBicm93c2VyICovXG5cbmltcG9ydCB7IEgzQ2x1c3RlckxheWVyIH0gZnJvbSAnQGRlY2suZ2wvZ2VvLWxheWVycyc7XG5pbXBvcnQgeyBWaWV3TW9kZSB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgeyBwb2x5ZmlsbCwgZ2VvVG9IMyB9IGZyb20gJ2gzLWpzJztcbmltcG9ydCBFZGl0YWJsZUdlb0pzb25MYXllciBmcm9tICcuL2VkaXRhYmxlLWdlb2pzb24tbGF5ZXInO1xuaW1wb3J0IEVkaXRhYmxlTGF5ZXIgZnJvbSAnLi9lZGl0YWJsZS1sYXllcic7XG5cbmNvbnN0IERFRkFVTFRfRURJVF9NT0RFID0gVmlld01vZGU7XG5jb25zdCBERUZBVUxUX0gzX1JFU09MVVRJT04gPSA5O1xuY29uc3QgRU1QVFlfRkVBVFVSRV9DT0xMRUNUSU9OID0ge1xuICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICBmZWF0dXJlczogW10sXG59O1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIG1vZGU6IERFRkFVTFRfRURJVF9NT0RFLFxuXG4gIC8vIEVkaXRhYmxlR2VvSnNvbkxheWVyXG4gIC4uLkVkaXRhYmxlR2VvSnNvbkxheWVyLmRlZmF1bHRQcm9wcyxcblxuICAvLyBoMyBsYXllclxuICBkYXRhOiBbXSxcbiAgc2VsZWN0ZWRJbmRleGVzOiBbXSxcbiAgZmlsbGVkOiBmYWxzZSxcbiAgc3Ryb2tlZDogdHJ1ZSxcbiAgbGluZVdpZHRoU2NhbGU6IDEsXG4gIGxpbmVXaWR0aE1pblBpeGVsczogMSxcbiAgbGluZVdpZHRoTWF4UGl4ZWxzOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgbGluZVdpZHRoVW5pdHM6ICdwaXhlbHMnLFxuICBnZXRIZXhhZ29uczogKGQpID0+IGQuaGV4SWRzLFxuICBnZXRFZGl0ZWRDbHVzdGVyOiAodXBkYXRlZEhleGFnb25zLCBleGlzdGluZ0NsdXN0ZXIpID0+IHtcbiAgICBpZiAoZXhpc3RpbmdDbHVzdGVyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5leGlzdGluZ0NsdXN0ZXIsXG4gICAgICAgIGhleElkczogdXBkYXRlZEhleGFnb25zLFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGhleElkczogdXBkYXRlZEhleGFnb25zLFxuICAgIH07XG4gIH0sXG4gIHJlc29sdXRpb246IERFRkFVTFRfSDNfUkVTT0xVVElPTixcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRhYmxlSDNDbHVzdGVyTGF5ZXIgZXh0ZW5kcyBFZGl0YWJsZUxheWVyIHtcbiAgc3RhdGljIGxheWVyTmFtZSA9ICdFZGl0YWJsZUgzQ2x1c3RlckxheWVyJztcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZVN0YXRlKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRlbnRhdGl2ZUhleGFnb25JRHM6IFtdLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gY29udmVydCBhcnJheSBvZiAobG5nLCBsYXQpIGNvb3JkcyB0byBjbHVzdGVyIG9mIGhleGVzXG4gIGdldERlcml2ZWRIZXhhZ29uSURzKGNvb3Jkcykge1xuICAgIHJldHVybiBwb2x5ZmlsbChjb29yZHMsIHRoaXMucHJvcHMucmVzb2x1dGlvbiwgdHJ1ZSk7XG4gIH1cblxuICAvLyBjb252ZXJ0IHBhaXIgb2YgKGxuZywgbGF0KSBjb29yZHMgaW50byBzaW5nbGUgaGV4XG4gIGdldERlcml2ZWRIZXhhZ29uSUQoY29vcmRzKSB7XG4gICAgcmV0dXJuIGdlb1RvSDMoY29vcmRzWzFdLCBjb29yZHNbMF0sIHRoaXMucHJvcHMucmVzb2x1dGlvbik7XG4gIH1cblxuICByZW5kZXJMYXllcnMoKSB7XG4gICAgY29uc3QgbGF5ZXJzOiBhbnkgPSBbXG4gICAgICBuZXcgRWRpdGFibGVHZW9Kc29uTGF5ZXIoXG4gICAgICAgIHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyh7XG4gICAgICAgICAgaWQ6ICdlZGl0YWJsZS1nZW9qc29uJyxcblxuICAgICAgICAgIG1vZGU6IHRoaXMucHJvcHMubW9kZSxcbiAgICAgICAgICBkYXRhOiBFTVBUWV9GRUFUVVJFX0NPTExFQ1RJT04sXG4gICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSW5kZXhlczogW10sXG5cbiAgICAgICAgICBvbkVkaXQ6IChlZGl0QWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGVkaXRUeXBlLCBlZGl0Q29udGV4dCB9ID0gZWRpdEFjdGlvbjtcblxuICAgICAgICAgICAgc3dpdGNoIChlZGl0VHlwZSkge1xuICAgICAgICAgICAgICBjYXNlICd1cGRhdGVUZW50YXRpdmVGZWF0dXJlJzpcbiAgICAgICAgICAgICAgICAvLyB0ZW50YXRpdmUgZmVhdHVyZSB1cGRhdGVzLCB1cGRhdGVkIG9uIGV2ZXJ5IHBvaW50ZXIgbW92ZVxuICAgICAgICAgICAgICAgIGlmIChlZGl0Q29udGV4dC5mZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdQb2x5Z29uJykge1xuICAgICAgICAgICAgICAgICAgY29uc3QgY29vcmRzID0gZWRpdENvbnRleHQuZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGhleElEcyA9IHRoaXMuZ2V0RGVyaXZlZEhleGFnb25JRHMoY29vcmRzKTtcblxuICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRlbnRhdGl2ZUhleGFnb25JRHM6IGhleElEcyB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVkaXRDb250ZXh0LmZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gJ1BvaW50Jykge1xuICAgICAgICAgICAgICAgICAgY29uc3QgY29vcmRzID0gZWRpdENvbnRleHQuZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGhleElEID0gdGhpcy5nZXREZXJpdmVkSGV4YWdvbklEKGNvb3Jkcyk7XG5cbiAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB0ZW50YXRpdmVIZXhhZ29uSURzOiBbaGV4SURdIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAnYWRkRmVhdHVyZSc6XG4gICAgICAgICAgICAgICAgY29uc3QgdXBkYXRlZERhdGEgPSBbLi4udGhpcy5wcm9wcy5kYXRhXTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG1vZGVDb25maWcgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgICAgICAgICBpZiAoIW1vZGVDb25maWcgfHwgIW1vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgLy8gYWRkIG5ldyBoMyBjbHVzdGVyXG4gICAgICAgICAgICAgICAgICB1cGRhdGVkRGF0YS5wdXNoKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmdldEVkaXRlZENsdXN0ZXIodGhpcy5zdGF0ZS50ZW50YXRpdmVIZXhhZ29uSURzLCBudWxsKVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMuc2VsZWN0ZWRJbmRleGVzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignYm9vbGVhbk9wZXJhdGlvbiBvbmx5IHN1cHBvcnRlZCBmb3Igc2luZ2xlIGNsdXN0ZXIgc2VsZWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8vIHRoZXkncmUgYWZmZWN0aW5nIGEgc2VsZWN0ZWQgY2x1c3RlclxuICAgICAgICAgICAgICAgICAgbGV0IGZpbmFsSGV4YWdvbklEcztcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1pdHRlZEhleGFnb25JRHMgPSBuZXcgU2V0KHRoaXMuZ2V0U2VsZWN0ZWRIZXhJRHMoKSk7XG4gICAgICAgICAgICAgICAgICBjb25zdCB0ZW50YXRpdmVIZXhhZ29uSURzID0gbmV3IFNldCh0aGlzLnN0YXRlLnRlbnRhdGl2ZUhleGFnb25JRHMpO1xuXG4gICAgICAgICAgICAgICAgICBzd2l0Y2ggKG1vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd1bmlvbic6XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgZmluYWxIZXhhZ29uSURzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4ubmV3IFNldChbLi4uY29tbWl0dGVkSGV4YWdvbklEcywgLi4udGVudGF0aXZlSGV4YWdvbklEc10pLFxuICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2ludGVyc2VjdGlvbic6XG4gICAgICAgICAgICAgICAgICAgICAgZmluYWxIZXhhZ29uSURzID0gWy4uLmNvbW1pdHRlZEhleGFnb25JRHNdLmZpbHRlcigoaGV4SUQ6IHN0cmluZykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbnRhdGl2ZUhleGFnb25JRHMuaGFzKGhleElEKVxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RpZmZlcmVuY2UnOlxuICAgICAgICAgICAgICAgICAgICAgIGZpbmFsSGV4YWdvbklEcyA9IFsuLi5jb21taXR0ZWRIZXhhZ29uSURzXS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAoaGV4SUQ6IHN0cmluZykgPT4gIXRlbnRhdGl2ZUhleGFnb25JRHMuaGFzKGhleElEKVxuICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSW5kZXggPSB0aGlzLnByb3BzLnNlbGVjdGVkSW5kZXhlc1swXTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nQ2x1c3RlciA9IHRoaXMucHJvcHMuZGF0YVtzZWxlY3RlZEluZGV4XTtcbiAgICAgICAgICAgICAgICAgIHVwZGF0ZWREYXRhW3NlbGVjdGVkSW5kZXhdID0gdGhpcy5wcm9wcy5nZXRFZGl0ZWRDbHVzdGVyKFxuICAgICAgICAgICAgICAgICAgICBmaW5hbEhleGFnb25JRHMsXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nQ2x1c3RlclxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICAgIHRlbnRhdGl2ZUhleGFnb25JRHM6IFtdLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkVkaXQoeyB1cGRhdGVkRGF0YSB9KTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICApLFxuXG4gICAgICBuZXcgSDNDbHVzdGVyTGF5ZXIoXG4gICAgICAgIHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyh7XG4gICAgICAgICAgaWQ6ICdoZXhhZ29ucycsXG4gICAgICAgICAgZGF0YTogdGhpcy5wcm9wcy5kYXRhLFxuICAgICAgICAgIGdldEhleGFnb25zOiB0aGlzLnByb3BzLmdldEhleGFnb25zLFxuICAgICAgICB9KVxuICAgICAgKSxcbiAgICAgIG5ldyBIM0NsdXN0ZXJMYXllcihcbiAgICAgICAgdGhpcy5nZXRTdWJMYXllclByb3BzKHtcbiAgICAgICAgICBpZDogJ3RlbnRhdGl2ZS1oZXhhZ29ucycsXG4gICAgICAgICAgZGF0YTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBoZXhJZHM6IHRoaXMuc3RhdGUudGVudGF0aXZlSGV4YWdvbklEcyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBnZXRIZXhhZ29uczogKGQpID0+IGQuaGV4SWRzLFxuICAgICAgICB9KVxuICAgICAgKSxcbiAgICBdO1xuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvLyBiZWNhdXNlIGRhdGEgaXMgYW4gYXJyYXkgb2YgaGV4YWdvbiBkYXRhLCB3ZSB0YWtlIHRoZSBjdW11bGF0aXZlIG9mIGFsbCBzZWxlY3RlZCBpbmRleGVzLFxuICAvLyB1c2luZyBwcm9wcy5nZXRIZXhhZ29ucyB0byBzdXBwb3J0IG11bHRpcGxlIGRhdGEgdHlwZXNcbiAgZ2V0U2VsZWN0ZWRIZXhJRHMoKSB7XG4gICAgbGV0IGN1bXVsYXRpdmVIZXhJRHMgPSBbXTtcbiAgICB0aGlzLnByb3BzLnNlbGVjdGVkSW5kZXhlcy5mb3JFYWNoKChpbmRleCkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRDbHVzdGVyID0gdGhpcy5wcm9wcy5kYXRhW2luZGV4XTtcbiAgICAgIGNvbnN0IGhleElEcyA9IHRoaXMucHJvcHMuZ2V0SGV4YWdvbnMoc2VsZWN0ZWRDbHVzdGVyKTtcbiAgICAgIGN1bXVsYXRpdmVIZXhJRHMgPSBjdW11bGF0aXZlSGV4SURzLmNvbmNhdChoZXhJRHMpO1xuICAgIH0pO1xuICAgIHJldHVybiBjdW11bGF0aXZlSGV4SURzO1xuICB9XG5cbiAgZ2V0Q3Vyc29yKHsgaXNEcmFnZ2luZyB9OiB7IGlzRHJhZ2dpbmc6IGJvb2xlYW4gfSkge1xuICAgIGxldCB7IGN1cnNvciB9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoIWN1cnNvcikge1xuICAgICAgLy8gZGVmYXVsdCBjdXJzb3JcbiAgICAgIGN1cnNvciA9IGlzRHJhZ2dpbmcgPyAnZ3JhYmJpbmcnIDogJ2dyYWInO1xuICAgIH1cbiAgICByZXR1cm4gY3Vyc29yO1xuICB9XG59XG4iXX0=