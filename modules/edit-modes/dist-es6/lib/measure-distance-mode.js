"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MeasureDistanceMode = void 0;

var _distance = _interopRequireDefault(require("@turf/distance"));

var _utils = require("../utils");

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

var MeasureDistanceMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(MeasureDistanceMode, _GeoJsonEditMode);

  var _super = _createSuper(MeasureDistanceMode);

  function MeasureDistanceMode() {
    var _this;

    _classCallCheck(this, MeasureDistanceMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_isMeasuringSessionFinished", false);

    _defineProperty(_assertThisInitialized(_this), "_currentTooltips", []);

    _defineProperty(_assertThisInitialized(_this), "_currentDistance", 0);

    _defineProperty(_assertThisInitialized(_this), "_calculateDistanceForTooltip", function (_ref) {
      var positionA = _ref.positionA,
          positionB = _ref.positionB,
          modeConfig = _ref.modeConfig;

      var _ref2 = modeConfig || {},
          turfOptions = _ref2.turfOptions,
          measurementCallback = _ref2.measurementCallback;

      var distance = (0, _distance["default"])(positionA, positionB, turfOptions);

      if (measurementCallback) {
        measurementCallback(distance);
      }

      return distance;
    });

    return _this;
  }

  _createClass(MeasureDistanceMode, [{
    key: "_formatTooltip",
    value: function _formatTooltip(distance, modeConfig) {
      var _ref3 = modeConfig || {},
          formatTooltip = _ref3.formatTooltip,
          turfOptions = _ref3.turfOptions;

      var units = turfOptions && turfOptions.units || 'kilometers';
      var text;

      if (formatTooltip) {
        text = formatTooltip(distance);
      } else {
        // By default, round to 2 decimal places and append units
        text = "".concat(parseFloat(distance).toFixed(2), " ").concat(units);
      }

      return text;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event, props) {
      var modeConfig = props.modeConfig,
          data = props.data,
          onEdit = props.onEdit; // restart measuring session

      if (this._isMeasuringSessionFinished) {
        this._isMeasuringSessionFinished = false;
        this.resetClickSequence();
        this._currentTooltips = [];
        this._currentDistance = 0;
      }

      var picks = event.picks;
      var clickedEditHandle = (0, _utils.getPickedEditHandle)(picks);
      var positionAdded = false;

      if (!clickedEditHandle) {
        // Don't add another point right next to an existing one
        this.addClickSequence(event);
        positionAdded = true;
      }

      var clickSequence = this.getClickSequence();

      if (clickSequence.length > 1 && clickedEditHandle && Array.isArray(clickedEditHandle.properties.positionIndexes) && clickedEditHandle.properties.positionIndexes[0] === clickSequence.length - 1) {
        // They clicked the last point (or double-clicked), so add the LineString
        this._isMeasuringSessionFinished = true;
      } else if (positionAdded) {
        if (clickSequence.length > 1) {
          this._currentDistance += this._calculateDistanceForTooltip({
            positionA: clickSequence[clickSequence.length - 2],
            positionB: clickSequence[clickSequence.length - 1],
            modeConfig: modeConfig
          });

          this._currentTooltips.push({
            position: event.mapCoords,
            text: this._formatTooltip(this._currentDistance, modeConfig)
          });
        } // new tentative point


        onEdit({
          // data is the same
          updatedData: data,
          editType: 'addTentativePosition',
          editContext: {
            position: event.mapCoords
          }
        });
      }
    }
  }, {
    key: "handleKeyUp",
    value: function handleKeyUp(event, props) {
      if (this._isMeasuringSessionFinished) return;
      event.stopPropagation();
      var key = event.key;
      var clickSequenceLength = this.getClickSequence().length;

      switch (key) {
        case 'Escape':
          this._isMeasuringSessionFinished = true;

          if (clickSequenceLength === 1) {
            this.resetClickSequence();
            this._currentTooltips = [];
          } // force update drawings


          props.onUpdateCursor('cell');
          break;

        case 'Enter':
          this.handleClick(props.lastPointerMoveEvent, props);
          this._isMeasuringSessionFinished = true;
          break;

        default:
          break;
      }
    }
  }, {
    key: "getGuides",
    value: function getGuides(props) {
      var _guides$features;

      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var clickSequence = this.getClickSequence();
      var lastCoords = lastPointerMoveEvent && !this._isMeasuringSessionFinished ? [lastPointerMoveEvent.mapCoords] : [];
      var guides = {
        type: 'FeatureCollection',
        features: []
      };

      if (clickSequence.length > 0) {
        guides.features.push({
          type: 'Feature',
          properties: {
            guideType: 'tentative'
          },
          geometry: {
            type: 'LineString',
            coordinates: [].concat(_toConsumableArray(clickSequence), lastCoords)
          }
        });
      }

      var editHandles = clickSequence.map(function (clickedCoord, index) {
        return {
          type: 'Feature',
          properties: {
            guideType: 'editHandle',
            editHandleType: 'existing',
            featureIndex: -1,
            positionIndexes: [index]
          },
          geometry: {
            type: 'Point',
            coordinates: clickedCoord
          }
        };
      });

      (_guides$features = guides.features).push.apply(_guides$features, _toConsumableArray(editHandles)); // @ts-ignore


      return guides;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      props.onUpdateCursor('cell');
    }
  }, {
    key: "getTooltips",
    value: function getTooltips(props) {
      var lastPointerMoveEvent = props.lastPointerMoveEvent,
          modeConfig = props.modeConfig;
      var positions = this.getClickSequence();

      if (positions.length > 0 && lastPointerMoveEvent && !this._isMeasuringSessionFinished) {
        var distance = this._calculateDistanceForTooltip({
          positionA: positions[positions.length - 1],
          positionB: lastPointerMoveEvent.mapCoords,
          modeConfig: props.modeConfig
        });

        return [].concat(_toConsumableArray(this._currentTooltips), [{
          position: lastPointerMoveEvent.mapCoords,
          text: this._formatTooltip(this._currentDistance + distance, modeConfig)
        }]);
      }

      return this._currentTooltips;
    }
  }]);

  return MeasureDistanceMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.MeasureDistanceMode = MeasureDistanceMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbWVhc3VyZS1kaXN0YW5jZS1tb2RlLnRzIl0sIm5hbWVzIjpbIk1lYXN1cmVEaXN0YW5jZU1vZGUiLCJwb3NpdGlvbkEiLCJwb3NpdGlvbkIiLCJtb2RlQ29uZmlnIiwidHVyZk9wdGlvbnMiLCJtZWFzdXJlbWVudENhbGxiYWNrIiwiZGlzdGFuY2UiLCJmb3JtYXRUb29sdGlwIiwidW5pdHMiLCJ0ZXh0IiwicGFyc2VGbG9hdCIsInRvRml4ZWQiLCJldmVudCIsInByb3BzIiwiZGF0YSIsIm9uRWRpdCIsIl9pc01lYXN1cmluZ1Nlc3Npb25GaW5pc2hlZCIsInJlc2V0Q2xpY2tTZXF1ZW5jZSIsIl9jdXJyZW50VG9vbHRpcHMiLCJfY3VycmVudERpc3RhbmNlIiwicGlja3MiLCJjbGlja2VkRWRpdEhhbmRsZSIsInBvc2l0aW9uQWRkZWQiLCJhZGRDbGlja1NlcXVlbmNlIiwiY2xpY2tTZXF1ZW5jZSIsImdldENsaWNrU2VxdWVuY2UiLCJsZW5ndGgiLCJBcnJheSIsImlzQXJyYXkiLCJwcm9wZXJ0aWVzIiwicG9zaXRpb25JbmRleGVzIiwiX2NhbGN1bGF0ZURpc3RhbmNlRm9yVG9vbHRpcCIsInB1c2giLCJwb3NpdGlvbiIsIm1hcENvb3JkcyIsIl9mb3JtYXRUb29sdGlwIiwidXBkYXRlZERhdGEiLCJlZGl0VHlwZSIsImVkaXRDb250ZXh0Iiwic3RvcFByb3BhZ2F0aW9uIiwia2V5IiwiY2xpY2tTZXF1ZW5jZUxlbmd0aCIsIm9uVXBkYXRlQ3Vyc29yIiwiaGFuZGxlQ2xpY2siLCJsYXN0UG9pbnRlck1vdmVFdmVudCIsImxhc3RDb29yZHMiLCJndWlkZXMiLCJ0eXBlIiwiZmVhdHVyZXMiLCJndWlkZVR5cGUiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZWRpdEhhbmRsZXMiLCJtYXAiLCJjbGlja2VkQ29vcmQiLCJpbmRleCIsImVkaXRIYW5kbGVUeXBlIiwiZmVhdHVyZUluZGV4IiwicG9zaXRpb25zIiwiR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBR0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFFYUEsbUI7Ozs7Ozs7Ozs7Ozs7Ozs7a0ZBQ21CLEs7O3VFQUNYLEU7O3VFQUNBLEM7O21GQUVZLGdCQUEwQztBQUFBLFVBQXZDQyxTQUF1QyxRQUF2Q0EsU0FBdUM7QUFBQSxVQUE1QkMsU0FBNEIsUUFBNUJBLFNBQTRCO0FBQUEsVUFBakJDLFVBQWlCLFFBQWpCQSxVQUFpQjs7QUFBQSxrQkFDMUJBLFVBQVUsSUFBSSxFQURZO0FBQUEsVUFDL0RDLFdBRCtELFNBQy9EQSxXQUQrRDtBQUFBLFVBQ2xEQyxtQkFEa0QsU0FDbERBLG1CQURrRDs7QUFFdkUsVUFBTUMsUUFBUSxHQUFHLDBCQUFhTCxTQUFiLEVBQXdCQyxTQUF4QixFQUFtQ0UsV0FBbkMsQ0FBakI7O0FBRUEsVUFBSUMsbUJBQUosRUFBeUI7QUFDdkJBLFFBQUFBLG1CQUFtQixDQUFDQyxRQUFELENBQW5CO0FBQ0Q7O0FBRUQsYUFBT0EsUUFBUDtBQUNELEs7Ozs7Ozs7bUNBRWNBLFEsRUFBVUgsVSxFQUFhO0FBQUEsa0JBQ0dBLFVBQVUsSUFBSSxFQURqQjtBQUFBLFVBQzVCSSxhQUQ0QixTQUM1QkEsYUFENEI7QUFBQSxVQUNiSCxXQURhLFNBQ2JBLFdBRGE7O0FBRXBDLFVBQU1JLEtBQUssR0FBSUosV0FBVyxJQUFJQSxXQUFXLENBQUNJLEtBQTVCLElBQXNDLFlBQXBEO0FBRUEsVUFBSUMsSUFBSjs7QUFDQSxVQUFJRixhQUFKLEVBQW1CO0FBQ2pCRSxRQUFBQSxJQUFJLEdBQUdGLGFBQWEsQ0FBQ0QsUUFBRCxDQUFwQjtBQUNELE9BRkQsTUFFTztBQUNMO0FBQ0FHLFFBQUFBLElBQUksYUFBTUMsVUFBVSxDQUFDSixRQUFELENBQVYsQ0FBcUJLLE9BQXJCLENBQTZCLENBQTdCLENBQU4sY0FBeUNILEtBQXpDLENBQUo7QUFDRDs7QUFFRCxhQUFPQyxJQUFQO0FBQ0Q7OztnQ0FFV0csSyxFQUFtQkMsSyxFQUFxQztBQUFBLFVBQzFEVixVQUQwRCxHQUM3QlUsS0FENkIsQ0FDMURWLFVBRDBEO0FBQUEsVUFDOUNXLElBRDhDLEdBQzdCRCxLQUQ2QixDQUM5Q0MsSUFEOEM7QUFBQSxVQUN4Q0MsTUFEd0MsR0FDN0JGLEtBRDZCLENBQ3hDRSxNQUR3QyxFQUdsRTs7QUFDQSxVQUFJLEtBQUtDLDJCQUFULEVBQXNDO0FBQ3BDLGFBQUtBLDJCQUFMLEdBQW1DLEtBQW5DO0FBQ0EsYUFBS0Msa0JBQUw7QUFDQSxhQUFLQyxnQkFBTCxHQUF3QixFQUF4QjtBQUNBLGFBQUtDLGdCQUFMLEdBQXdCLENBQXhCO0FBQ0Q7O0FBVGlFLFVBVzFEQyxLQVgwRCxHQVdoRFIsS0FYZ0QsQ0FXMURRLEtBWDBEO0FBWWxFLFVBQU1DLGlCQUFpQixHQUFHLGdDQUFvQkQsS0FBcEIsQ0FBMUI7QUFFQSxVQUFJRSxhQUFhLEdBQUcsS0FBcEI7O0FBQ0EsVUFBSSxDQUFDRCxpQkFBTCxFQUF3QjtBQUN0QjtBQUNBLGFBQUtFLGdCQUFMLENBQXNCWCxLQUF0QjtBQUNBVSxRQUFBQSxhQUFhLEdBQUcsSUFBaEI7QUFDRDs7QUFDRCxVQUFNRSxhQUFhLEdBQUcsS0FBS0MsZ0JBQUwsRUFBdEI7O0FBRUEsVUFDRUQsYUFBYSxDQUFDRSxNQUFkLEdBQXVCLENBQXZCLElBQ0FMLGlCQURBLElBRUFNLEtBQUssQ0FBQ0MsT0FBTixDQUFjUCxpQkFBaUIsQ0FBQ1EsVUFBbEIsQ0FBNkJDLGVBQTNDLENBRkEsSUFHQVQsaUJBQWlCLENBQUNRLFVBQWxCLENBQTZCQyxlQUE3QixDQUE2QyxDQUE3QyxNQUFvRE4sYUFBYSxDQUFDRSxNQUFkLEdBQXVCLENBSjdFLEVBS0U7QUFDQTtBQUNBLGFBQUtWLDJCQUFMLEdBQW1DLElBQW5DO0FBQ0QsT0FSRCxNQVFPLElBQUlNLGFBQUosRUFBbUI7QUFDeEIsWUFBSUUsYUFBYSxDQUFDRSxNQUFkLEdBQXVCLENBQTNCLEVBQThCO0FBQzVCLGVBQUtQLGdCQUFMLElBQXlCLEtBQUtZLDRCQUFMLENBQWtDO0FBQ3pEOUIsWUFBQUEsU0FBUyxFQUFFdUIsYUFBYSxDQUFDQSxhQUFhLENBQUNFLE1BQWQsR0FBdUIsQ0FBeEIsQ0FEaUM7QUFFekR4QixZQUFBQSxTQUFTLEVBQUVzQixhQUFhLENBQUNBLGFBQWEsQ0FBQ0UsTUFBZCxHQUF1QixDQUF4QixDQUZpQztBQUd6RHZCLFlBQUFBLFVBQVUsRUFBVkE7QUFIeUQsV0FBbEMsQ0FBekI7O0FBS0EsZUFBS2UsZ0JBQUwsQ0FBc0JjLElBQXRCLENBQTJCO0FBQ3pCQyxZQUFBQSxRQUFRLEVBQUVyQixLQUFLLENBQUNzQixTQURTO0FBRXpCekIsWUFBQUEsSUFBSSxFQUFFLEtBQUswQixjQUFMLENBQW9CLEtBQUtoQixnQkFBekIsRUFBMkNoQixVQUEzQztBQUZtQixXQUEzQjtBQUlELFNBWHVCLENBYXhCOzs7QUFDQVksUUFBQUEsTUFBTSxDQUFDO0FBQ0w7QUFDQXFCLFVBQUFBLFdBQVcsRUFBRXRCLElBRlI7QUFHTHVCLFVBQUFBLFFBQVEsRUFBRSxzQkFITDtBQUlMQyxVQUFBQSxXQUFXLEVBQUU7QUFDWEwsWUFBQUEsUUFBUSxFQUFFckIsS0FBSyxDQUFDc0I7QUFETDtBQUpSLFNBQUQsQ0FBTjtBQVFEO0FBQ0Y7OztnQ0FFV3RCLEssRUFBc0JDLEssRUFBcUM7QUFDckUsVUFBSSxLQUFLRywyQkFBVCxFQUFzQztBQUV0Q0osTUFBQUEsS0FBSyxDQUFDMkIsZUFBTjtBQUhxRSxVQUk3REMsR0FKNkQsR0FJckQ1QixLQUpxRCxDQUk3RDRCLEdBSjZEO0FBTXJFLFVBQU1DLG1CQUFtQixHQUFHLEtBQUtoQixnQkFBTCxHQUF3QkMsTUFBcEQ7O0FBRUEsY0FBUWMsR0FBUjtBQUNFLGFBQUssUUFBTDtBQUNFLGVBQUt4QiwyQkFBTCxHQUFtQyxJQUFuQzs7QUFDQSxjQUFJeUIsbUJBQW1CLEtBQUssQ0FBNUIsRUFBK0I7QUFDN0IsaUJBQUt4QixrQkFBTDtBQUNBLGlCQUFLQyxnQkFBTCxHQUF3QixFQUF4QjtBQUNELFdBTEgsQ0FNRTs7O0FBQ0FMLFVBQUFBLEtBQUssQ0FBQzZCLGNBQU4sQ0FBcUIsTUFBckI7QUFDQTs7QUFDRixhQUFLLE9BQUw7QUFDRSxlQUFLQyxXQUFMLENBQWlCOUIsS0FBSyxDQUFDK0Isb0JBQXZCLEVBQTZDL0IsS0FBN0M7QUFDQSxlQUFLRywyQkFBTCxHQUFtQyxJQUFuQztBQUNBOztBQUNGO0FBQ0U7QUFmSjtBQWlCRDs7OzhCQUVTSCxLLEVBQTZEO0FBQUE7O0FBQUEsVUFDN0QrQixvQkFENkQsR0FDcEMvQixLQURvQyxDQUM3RCtCLG9CQUQ2RDtBQUVyRSxVQUFNcEIsYUFBYSxHQUFHLEtBQUtDLGdCQUFMLEVBQXRCO0FBRUEsVUFBTW9CLFVBQVUsR0FDZEQsb0JBQW9CLElBQUksQ0FBQyxLQUFLNUIsMkJBQTlCLEdBQ0ksQ0FBQzRCLG9CQUFvQixDQUFDVixTQUF0QixDQURKLEdBRUksRUFITjtBQUtBLFVBQU1ZLE1BQU0sR0FBRztBQUNiQyxRQUFBQSxJQUFJLEVBQUUsbUJBRE87QUFFYkMsUUFBQUEsUUFBUSxFQUFFO0FBRkcsT0FBZjs7QUFLQSxVQUFJeEIsYUFBYSxDQUFDRSxNQUFkLEdBQXVCLENBQTNCLEVBQThCO0FBQzVCb0IsUUFBQUEsTUFBTSxDQUFDRSxRQUFQLENBQWdCaEIsSUFBaEIsQ0FBcUI7QUFDbkJlLFVBQUFBLElBQUksRUFBRSxTQURhO0FBRW5CbEIsVUFBQUEsVUFBVSxFQUFFO0FBQ1ZvQixZQUFBQSxTQUFTLEVBQUU7QUFERCxXQUZPO0FBS25CQyxVQUFBQSxRQUFRLEVBQUU7QUFDUkgsWUFBQUEsSUFBSSxFQUFFLFlBREU7QUFFUkksWUFBQUEsV0FBVywrQkFBTTNCLGFBQU4sR0FBd0JxQixVQUF4QjtBQUZIO0FBTFMsU0FBckI7QUFVRDs7QUFFRCxVQUFNTyxXQUFXLEdBQUc1QixhQUFhLENBQUM2QixHQUFkLENBQWtCLFVBQUNDLFlBQUQsRUFBZUMsS0FBZjtBQUFBLGVBQTBCO0FBQzlEUixVQUFBQSxJQUFJLEVBQUUsU0FEd0Q7QUFFOURsQixVQUFBQSxVQUFVLEVBQUU7QUFDVm9CLFlBQUFBLFNBQVMsRUFBRSxZQUREO0FBRVZPLFlBQUFBLGNBQWMsRUFBRSxVQUZOO0FBR1ZDLFlBQUFBLFlBQVksRUFBRSxDQUFDLENBSEw7QUFJVjNCLFlBQUFBLGVBQWUsRUFBRSxDQUFDeUIsS0FBRDtBQUpQLFdBRmtEO0FBUTlETCxVQUFBQSxRQUFRLEVBQUU7QUFDUkgsWUFBQUEsSUFBSSxFQUFFLE9BREU7QUFFUkksWUFBQUEsV0FBVyxFQUFFRztBQUZMO0FBUm9ELFNBQTFCO0FBQUEsT0FBbEIsQ0FBcEI7O0FBY0EsMEJBQUFSLE1BQU0sQ0FBQ0UsUUFBUCxFQUFnQmhCLElBQWhCLDRDQUF3Qm9CLFdBQXhCLEdBekNxRSxDQTBDckU7OztBQUNBLGFBQU9OLE1BQVA7QUFDRDs7O3NDQUVpQmxDLEssRUFBeUJDLEssRUFBcUM7QUFDOUVBLE1BQUFBLEtBQUssQ0FBQzZCLGNBQU4sQ0FBcUIsTUFBckI7QUFDRDs7O2dDQUVXN0IsSyxFQUFnRDtBQUFBLFVBQ2xEK0Isb0JBRGtELEdBQ2IvQixLQURhLENBQ2xEK0Isb0JBRGtEO0FBQUEsVUFDNUJ6QyxVQUQ0QixHQUNiVSxLQURhLENBQzVCVixVQUQ0QjtBQUUxRCxVQUFNdUQsU0FBUyxHQUFHLEtBQUtqQyxnQkFBTCxFQUFsQjs7QUFFQSxVQUFJaUMsU0FBUyxDQUFDaEMsTUFBVixHQUFtQixDQUFuQixJQUF3QmtCLG9CQUF4QixJQUFnRCxDQUFDLEtBQUs1QiwyQkFBMUQsRUFBdUY7QUFDckYsWUFBTVYsUUFBUSxHQUFHLEtBQUt5Qiw0QkFBTCxDQUFrQztBQUNqRDlCLFVBQUFBLFNBQVMsRUFBRXlELFNBQVMsQ0FBQ0EsU0FBUyxDQUFDaEMsTUFBVixHQUFtQixDQUFwQixDQUQ2QjtBQUVqRHhCLFVBQUFBLFNBQVMsRUFBRTBDLG9CQUFvQixDQUFDVixTQUZpQjtBQUdqRC9CLFVBQUFBLFVBQVUsRUFBRVUsS0FBSyxDQUFDVjtBQUgrQixTQUFsQyxDQUFqQjs7QUFLQSw0Q0FDSyxLQUFLZSxnQkFEVixJQUVFO0FBQ0VlLFVBQUFBLFFBQVEsRUFBRVcsb0JBQW9CLENBQUNWLFNBRGpDO0FBRUV6QixVQUFBQSxJQUFJLEVBQUUsS0FBSzBCLGNBQUwsQ0FBb0IsS0FBS2hCLGdCQUFMLEdBQXdCYixRQUE1QyxFQUFzREgsVUFBdEQ7QUFGUixTQUZGO0FBT0Q7O0FBRUQsYUFBTyxLQUFLZSxnQkFBWjtBQUNEOzs7O0VBdkxzQ3lDLGdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5pbXBvcnQgeyBGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMnO1xuaW1wb3J0IHsgQ2xpY2tFdmVudCwgUG9pbnRlck1vdmVFdmVudCwgTW9kZVByb3BzLCBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uLCBUb29sdGlwIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0UGlja2VkRWRpdEhhbmRsZSB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IEdlb0pzb25FZGl0TW9kZSB9IGZyb20gJy4vZ2VvanNvbi1lZGl0LW1vZGUnO1xuXG5leHBvcnQgY2xhc3MgTWVhc3VyZURpc3RhbmNlTW9kZSBleHRlbmRzIEdlb0pzb25FZGl0TW9kZSB7XG4gIF9pc01lYXN1cmluZ1Nlc3Npb25GaW5pc2hlZCA9IGZhbHNlO1xuICBfY3VycmVudFRvb2x0aXBzID0gW107XG4gIF9jdXJyZW50RGlzdGFuY2UgPSAwO1xuXG4gIF9jYWxjdWxhdGVEaXN0YW5jZUZvclRvb2x0aXAgPSAoeyBwb3NpdGlvbkEsIHBvc2l0aW9uQiwgbW9kZUNvbmZpZyB9KSA9PiB7XG4gICAgY29uc3QgeyB0dXJmT3B0aW9ucywgbWVhc3VyZW1lbnRDYWxsYmFjayB9ID0gbW9kZUNvbmZpZyB8fCB7fTtcbiAgICBjb25zdCBkaXN0YW5jZSA9IHR1cmZEaXN0YW5jZShwb3NpdGlvbkEsIHBvc2l0aW9uQiwgdHVyZk9wdGlvbnMpO1xuXG4gICAgaWYgKG1lYXN1cmVtZW50Q2FsbGJhY2spIHtcbiAgICAgIG1lYXN1cmVtZW50Q2FsbGJhY2soZGlzdGFuY2UpO1xuICAgIH1cblxuICAgIHJldHVybiBkaXN0YW5jZTtcbiAgfTtcblxuICBfZm9ybWF0VG9vbHRpcChkaXN0YW5jZSwgbW9kZUNvbmZpZz8pIHtcbiAgICBjb25zdCB7IGZvcm1hdFRvb2x0aXAsIHR1cmZPcHRpb25zIH0gPSBtb2RlQ29uZmlnIHx8IHt9O1xuICAgIGNvbnN0IHVuaXRzID0gKHR1cmZPcHRpb25zICYmIHR1cmZPcHRpb25zLnVuaXRzKSB8fCAna2lsb21ldGVycyc7XG5cbiAgICBsZXQgdGV4dDtcbiAgICBpZiAoZm9ybWF0VG9vbHRpcCkge1xuICAgICAgdGV4dCA9IGZvcm1hdFRvb2x0aXAoZGlzdGFuY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCeSBkZWZhdWx0LCByb3VuZCB0byAyIGRlY2ltYWwgcGxhY2VzIGFuZCBhcHBlbmQgdW5pdHNcbiAgICAgIHRleHQgPSBgJHtwYXJzZUZsb2F0KGRpc3RhbmNlKS50b0ZpeGVkKDIpfSAke3VuaXRzfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICBoYW5kbGVDbGljayhldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBjb25zdCB7IG1vZGVDb25maWcsIGRhdGEsIG9uRWRpdCB9ID0gcHJvcHM7XG5cbiAgICAvLyByZXN0YXJ0IG1lYXN1cmluZyBzZXNzaW9uXG4gICAgaWYgKHRoaXMuX2lzTWVhc3VyaW5nU2Vzc2lvbkZpbmlzaGVkKSB7XG4gICAgICB0aGlzLl9pc01lYXN1cmluZ1Nlc3Npb25GaW5pc2hlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgIHRoaXMuX2N1cnJlbnRUb29sdGlwcyA9IFtdO1xuICAgICAgdGhpcy5fY3VycmVudERpc3RhbmNlID0gMDtcbiAgICB9XG5cbiAgICBjb25zdCB7IHBpY2tzIH0gPSBldmVudDtcbiAgICBjb25zdCBjbGlja2VkRWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUocGlja3MpO1xuXG4gICAgbGV0IHBvc2l0aW9uQWRkZWQgPSBmYWxzZTtcbiAgICBpZiAoIWNsaWNrZWRFZGl0SGFuZGxlKSB7XG4gICAgICAvLyBEb24ndCBhZGQgYW5vdGhlciBwb2ludCByaWdodCBuZXh0IHRvIGFuIGV4aXN0aW5nIG9uZVxuICAgICAgdGhpcy5hZGRDbGlja1NlcXVlbmNlKGV2ZW50KTtcbiAgICAgIHBvc2l0aW9uQWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgICBjb25zdCBjbGlja1NlcXVlbmNlID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAoXG4gICAgICBjbGlja1NlcXVlbmNlLmxlbmd0aCA+IDEgJiZcbiAgICAgIGNsaWNrZWRFZGl0SGFuZGxlICYmXG4gICAgICBBcnJheS5pc0FycmF5KGNsaWNrZWRFZGl0SGFuZGxlLnByb3BlcnRpZXMucG9zaXRpb25JbmRleGVzKSAmJlxuICAgICAgY2xpY2tlZEVkaXRIYW5kbGUucHJvcGVydGllcy5wb3NpdGlvbkluZGV4ZXNbMF0gPT09IGNsaWNrU2VxdWVuY2UubGVuZ3RoIC0gMVxuICAgICkge1xuICAgICAgLy8gVGhleSBjbGlja2VkIHRoZSBsYXN0IHBvaW50IChvciBkb3VibGUtY2xpY2tlZCksIHNvIGFkZCB0aGUgTGluZVN0cmluZ1xuICAgICAgdGhpcy5faXNNZWFzdXJpbmdTZXNzaW9uRmluaXNoZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAocG9zaXRpb25BZGRlZCkge1xuICAgICAgaWYgKGNsaWNrU2VxdWVuY2UubGVuZ3RoID4gMSkge1xuICAgICAgICB0aGlzLl9jdXJyZW50RGlzdGFuY2UgKz0gdGhpcy5fY2FsY3VsYXRlRGlzdGFuY2VGb3JUb29sdGlwKHtcbiAgICAgICAgICBwb3NpdGlvbkE6IGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAyXSxcbiAgICAgICAgICBwb3NpdGlvbkI6IGNsaWNrU2VxdWVuY2VbY2xpY2tTZXF1ZW5jZS5sZW5ndGggLSAxXSxcbiAgICAgICAgICBtb2RlQ29uZmlnLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fY3VycmVudFRvb2x0aXBzLnB1c2goe1xuICAgICAgICAgIHBvc2l0aW9uOiBldmVudC5tYXBDb29yZHMsXG4gICAgICAgICAgdGV4dDogdGhpcy5fZm9ybWF0VG9vbHRpcCh0aGlzLl9jdXJyZW50RGlzdGFuY2UsIG1vZGVDb25maWcpLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gbmV3IHRlbnRhdGl2ZSBwb2ludFxuICAgICAgb25FZGl0KHtcbiAgICAgICAgLy8gZGF0YSBpcyB0aGUgc2FtZVxuICAgICAgICB1cGRhdGVkRGF0YTogZGF0YSxcbiAgICAgICAgZWRpdFR5cGU6ICdhZGRUZW50YXRpdmVQb3NpdGlvbicsXG4gICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgcG9zaXRpb246IGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleVVwKGV2ZW50OiBLZXlib2FyZEV2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGlmICh0aGlzLl9pc01lYXN1cmluZ1Nlc3Npb25GaW5pc2hlZCkgcmV0dXJuO1xuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgeyBrZXkgfSA9IGV2ZW50O1xuXG4gICAgY29uc3QgY2xpY2tTZXF1ZW5jZUxlbmd0aCA9IHRoaXMuZ2V0Q2xpY2tTZXF1ZW5jZSgpLmxlbmd0aDtcblxuICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICBjYXNlICdFc2NhcGUnOlxuICAgICAgICB0aGlzLl9pc01lYXN1cmluZ1Nlc3Npb25GaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIGlmIChjbGlja1NlcXVlbmNlTGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdGhpcy5yZXNldENsaWNrU2VxdWVuY2UoKTtcbiAgICAgICAgICB0aGlzLl9jdXJyZW50VG9vbHRpcHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBmb3JjZSB1cGRhdGUgZHJhd2luZ3NcbiAgICAgICAgcHJvcHMub25VcGRhdGVDdXJzb3IoJ2NlbGwnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdFbnRlcic6XG4gICAgICAgIHRoaXMuaGFuZGxlQ2xpY2socHJvcHMubGFzdFBvaW50ZXJNb3ZlRXZlbnQsIHByb3BzKTtcbiAgICAgICAgdGhpcy5faXNNZWFzdXJpbmdTZXNzaW9uRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGdldEd1aWRlcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24ge1xuICAgIGNvbnN0IHsgbGFzdFBvaW50ZXJNb3ZlRXZlbnQgfSA9IHByb3BzO1xuICAgIGNvbnN0IGNsaWNrU2VxdWVuY2UgPSB0aGlzLmdldENsaWNrU2VxdWVuY2UoKTtcblxuICAgIGNvbnN0IGxhc3RDb29yZHMgPVxuICAgICAgbGFzdFBvaW50ZXJNb3ZlRXZlbnQgJiYgIXRoaXMuX2lzTWVhc3VyaW5nU2Vzc2lvbkZpbmlzaGVkXG4gICAgICAgID8gW2xhc3RQb2ludGVyTW92ZUV2ZW50Lm1hcENvb3Jkc11cbiAgICAgICAgOiBbXTtcblxuICAgIGNvbnN0IGd1aWRlcyA9IHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogW10sXG4gICAgfTtcblxuICAgIGlmIChjbGlja1NlcXVlbmNlLmxlbmd0aCA+IDApIHtcbiAgICAgIGd1aWRlcy5mZWF0dXJlcy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZ3VpZGVUeXBlOiAndGVudGF0aXZlJyxcbiAgICAgICAgfSxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFsuLi5jbGlja1NlcXVlbmNlLCAuLi5sYXN0Q29vcmRzXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGVkaXRIYW5kbGVzID0gY2xpY2tTZXF1ZW5jZS5tYXAoKGNsaWNrZWRDb29yZCwgaW5kZXgpID0+ICh7XG4gICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGd1aWRlVHlwZTogJ2VkaXRIYW5kbGUnLFxuICAgICAgICBlZGl0SGFuZGxlVHlwZTogJ2V4aXN0aW5nJyxcbiAgICAgICAgZmVhdHVyZUluZGV4OiAtMSxcbiAgICAgICAgcG9zaXRpb25JbmRleGVzOiBbaW5kZXhdLFxuICAgICAgfSxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBjbGlja2VkQ29vcmQsXG4gICAgICB9LFxuICAgIH0pKTtcblxuICAgIGd1aWRlcy5mZWF0dXJlcy5wdXNoKC4uLmVkaXRIYW5kbGVzKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIGd1aWRlcztcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIHByb3BzLm9uVXBkYXRlQ3Vyc29yKCdjZWxsJyk7XG4gIH1cblxuICBnZXRUb29sdGlwcyhwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IFRvb2x0aXBbXSB7XG4gICAgY29uc3QgeyBsYXN0UG9pbnRlck1vdmVFdmVudCwgbW9kZUNvbmZpZyB9ID0gcHJvcHM7XG4gICAgY29uc3QgcG9zaXRpb25zID0gdGhpcy5nZXRDbGlja1NlcXVlbmNlKCk7XG5cbiAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA+IDAgJiYgbGFzdFBvaW50ZXJNb3ZlRXZlbnQgJiYgIXRoaXMuX2lzTWVhc3VyaW5nU2Vzc2lvbkZpbmlzaGVkKSB7XG4gICAgICBjb25zdCBkaXN0YW5jZSA9IHRoaXMuX2NhbGN1bGF0ZURpc3RhbmNlRm9yVG9vbHRpcCh7XG4gICAgICAgIHBvc2l0aW9uQTogcG9zaXRpb25zW3Bvc2l0aW9ucy5sZW5ndGggLSAxXSxcbiAgICAgICAgcG9zaXRpb25COiBsYXN0UG9pbnRlck1vdmVFdmVudC5tYXBDb29yZHMsXG4gICAgICAgIG1vZGVDb25maWc6IHByb3BzLm1vZGVDb25maWcsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIC4uLnRoaXMuX2N1cnJlbnRUb29sdGlwcyxcbiAgICAgICAge1xuICAgICAgICAgIHBvc2l0aW9uOiBsYXN0UG9pbnRlck1vdmVFdmVudC5tYXBDb29yZHMsXG4gICAgICAgICAgdGV4dDogdGhpcy5fZm9ybWF0VG9vbHRpcCh0aGlzLl9jdXJyZW50RGlzdGFuY2UgKyBkaXN0YW5jZSwgbW9kZUNvbmZpZyksXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9jdXJyZW50VG9vbHRpcHM7XG4gIH1cbn1cbiJdfQ==