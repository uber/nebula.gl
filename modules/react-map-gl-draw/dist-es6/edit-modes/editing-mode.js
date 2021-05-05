"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _editModes = require("@nebula.gl/edit-modes");

var _constants = require("../constants");

var _baseMode = _interopRequireDefault(require("./base-mode"));

var _utils = require("./utils");

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

var EditingMode = /*#__PURE__*/function (_BaseMode) {
  _inherits(EditingMode, _BaseMode);

  var _super = _createSuper(EditingMode);

  function EditingMode() {
    _classCallCheck(this, EditingMode);

    return _super.apply(this, arguments);
  }

  _createClass(EditingMode, [{
    key: "handleClick",
    value: function handleClick(event, props) {
      var picked = event.picks && event.picks[0];
      var selectedFeatureIndex = props.selectedIndexes && props.selectedIndexes[0]; // @ts-ignore

      if (!picked || !picked.object || picked.featureIndex !== selectedFeatureIndex) {
        return;
      } // @ts-ignore


      var objectType = picked.type,
          featureIndex = picked.featureIndex,
          index = picked.index;
      var feature = this.getSelectedFeature(props, featureIndex);

      if (feature && (feature.geometry.type === _constants.GEOJSON_TYPE.POLYGON || feature.geometry.type === _constants.GEOJSON_TYPE.LINE_STRING) && objectType === _constants.ELEMENT_TYPE.SEGMENT) {
        var coordinates = (0, _utils.getFeatureCoordinates)(feature);

        if (!coordinates) {
          return;
        } // @ts-ignore


        var insertIndex = (index + 1) % coordinates.length;
        var positionIndexes = feature.geometry.type === _constants.SHAPE.POLYGON ? [0, insertIndex] : [insertIndex];

        var insertMapCoords = this._getPointOnSegment(feature, picked, event.mapCoords);

        var updatedData = new _editModes.ImmutableFeatureCollection(props.data) // @ts-ignore
        .addPosition(featureIndex, positionIndexes, insertMapCoords).getObject();
        props.onEdit({
          editType: _constants.EDIT_TYPE.ADD_POSITION,
          updatedData: updatedData,
          editContext: [{
            featureIndex: featureIndex,
            editHandleIndex: insertIndex,
            // @ts-ignore
            screenCoords: props.viewport && props.viewport.project(insertMapCoords),
            mapCoords: insertMapCoords
          }]
        });
      }
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      // replace point
      var picked = event.picks && event.picks[0]; // @ts-ignore

      if (!picked || !picked.Object || !(0, _utils.isNumeric)(picked.featureIndex)) {
        return;
      }

      var pickedObject = picked.object;

      switch (pickedObject.type) {
        case _constants.ELEMENT_TYPE.FEATURE:
        case _constants.ELEMENT_TYPE.FILL:
        case _constants.ELEMENT_TYPE.EDIT_HANDLE:
          this._handleDragging(event, props);

          break;

        default:
      }
    }
  }, {
    key: "_handleDragging",
    value: function _handleDragging(event, props) {
      var onEdit = props.onEdit; // @ts-ignore

      var selectedFeature = this.getSelectedFeature(props); // nothing clicked
      // @ts-ignore

      var isDragging = event.isDragging,
          pointerDownPicks = event.pointerDownPicks,
          screenCoords = event.screenCoords;
      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var clicked = pointerDownPicks && pointerDownPicks[0]; // @ts-ignore

      if (!clicked || !clicked.object || !(0, _utils.isNumeric)(clicked.featureIndex)) {
        return;
      } // @ts-ignore


      var objectType = clicked.type,
          editHandleIndex = clicked.index; // not dragging

      var updatedData = null;
      var editType = isDragging ? _constants.EDIT_TYPE.MOVE_POSITION : _constants.EDIT_TYPE.FINISH_MOVE_POSITION;

      switch (objectType) {
        case _constants.ELEMENT_TYPE.FEATURE:
        case _constants.ELEMENT_TYPE.FILL:
        case _constants.ELEMENT_TYPE.SEGMENT:
          if (!props.featuresDraggable) {
            break;
          } // dragging feature


          var dx = screenCoords[0] - lastPointerMoveEvent.screenCoords[0];
          var dy = screenCoords[1] - lastPointerMoveEvent.screenCoords[1];
          updatedData = this._updateFeature(props, 'feature', {
            dx: dx,
            dy: dy
          });
          onEdit({
            editType: editType,
            updatedData: updatedData,
            editContext: null
          });
          break;

        case _constants.ELEMENT_TYPE.EDIT_HANDLE:
          // dragging editHandle
          // dragging rectangle or other shapes
          var updateType = selectedFeature.properties.shape === _constants.SHAPE.RECTANGLE ? 'rectangle' : 'editHandle';
          updatedData = this._updateFeature(props, updateType, {
            editHandleIndex: editHandleIndex,
            mapCoords: event.mapCoords
          });
          onEdit({
            editType: editType,
            updatedData: updatedData,
            editContext: null
          });
          break;

        default:
      }
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      // no selected feature
      // @ts-ignore
      var selectedFeature = this.getSelectedFeature(props);

      if (!selectedFeature) {
        return;
      } // @ts-ignore


      if (!event.isDragging) {
        return;
      }

      this._handleDragging(event, props);
    } // TODO - refactor

  }, {
    key: "_updateFeature",
    value: function _updateFeature(props, type) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var data = props.data,
          selectedIndexes = props.selectedIndexes,
          viewport = props.viewport;
      var featureIndex = selectedIndexes && selectedIndexes[0];
      var feature = this.getSelectedFeature(props, featureIndex);
      var geometry = null;
      var coordinates = (0, _utils.getFeatureCoordinates)(feature);

      if (!coordinates) {
        return null;
      }

      var newCoordinates = _toConsumableArray(coordinates);

      switch (type) {
        case 'editHandle':
          var positionIndexes = feature.geometry.type === _constants.GEOJSON_TYPE.POLYGON ? [0, options.editHandleIndex] : [options.editHandleIndex];
          return new _editModes.ImmutableFeatureCollection(data).replacePosition(featureIndex, positionIndexes, options.mapCoords).getObject();

        case 'feature':
          var dx = options.dx,
              dy = options.dy; // @ts-ignore

          newCoordinates = newCoordinates.map(function (mapCoords) {
            // @ts-ignore
            var pixels = viewport && viewport.project(mapCoords);

            if (pixels) {
              pixels[0] += dx;
              pixels[1] += dy;
              return viewport && viewport.unproject(pixels);
            }

            return null;
          }).filter(Boolean);
          geometry = {
            type: feature.geometry.type,
            coordinates: feature.geometry.type === _constants.GEOJSON_TYPE.POLYGON ? [newCoordinates] : feature.geometry.type === _constants.GEOJSON_TYPE.POINT ? newCoordinates[0] : newCoordinates
          };
          return new _editModes.ImmutableFeatureCollection(data).replaceGeometry(featureIndex, geometry).getObject();

        case 'rectangle':
          // moved editHandleIndex and destination mapCoords
          newCoordinates = (0, _utils.updateRectanglePosition)( // @ts-ignore
          feature, options.editHandleIndex, options.mapCoords);
          geometry = {
            type: _constants.GEOJSON_TYPE.POLYGON,
            coordinates: newCoordinates
          };
          return new _editModes.ImmutableFeatureCollection(data).replaceGeometry(featureIndex, geometry).getObject();

        default:
          return data && new _editModes.ImmutableFeatureCollection(data).getObject();
      }
    }
  }, {
    key: "_getPointOnSegment",
    value: function _getPointOnSegment(feature, picked, pickedMapCoords) {
      var coordinates = (0, _utils.getFeatureCoordinates)(feature);

      if (!coordinates) {
        return null;
      }

      var srcVertexIndex = picked.index;
      var targetVertexIndex = picked.index + 1;
      return (0, _utils.findClosestPointOnLineSegment)( // @ts-ignore
      coordinates[srcVertexIndex], coordinates[targetVertexIndex], pickedMapCoords);
    }
  }, {
    key: "_getCursorEditHandle",
    value: function _getCursorEditHandle(event, feature) {
      // event can be null when the user has not interacted with the map whatsoever
      // and therefore props.lastPointerMoveEvent is still null
      // returning null here means we can e.g. set a featureIndex without requiring an event
      if (!event) {
        return null;
      } // @ts-ignore


      var isDragging = event.isDragging,
          picks = event.picks; // if not pick segment

      var picked = picks && picks[0]; // @ts-ignore

      if (!picked || !(0, _utils.isNumeric)(picked.featureIndex) || picked.type !== _constants.ELEMENT_TYPE.SEGMENT) {
        return null;
      } // if dragging or feature is neither polygon nor line string


      if (isDragging || feature.geometry.type !== _constants.GEOJSON_TYPE.POLYGON && feature.geometry.type !== _constants.GEOJSON_TYPE.LINE_STRING) {
        return null;
      }

      var insertMapCoords = this._getPointOnSegment(feature, picked, event.mapCoords);

      if (!insertMapCoords) {
        return null;
      }

      return {
        type: 'Feature',
        properties: {
          guideType: _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE,
          shape: feature.properties.shape,
          positionIndexes: [-1],
          editHandleType: 'intermediate'
        },
        geometry: {
          type: _constants.GEOJSON_TYPE.POINT,
          coordinates: insertMapCoords
        }
      };
    } // @ts-ignore

  }, {
    key: "getGuides",
    value: function getGuides(props) {
      // @ts-ignore
      var selectedFeature = this.getSelectedFeature(props);
      var selectedFeatureIndex = props.selectedIndexes && props.selectedIndexes[0];

      if (!selectedFeature || selectedFeature.geometry.type === _constants.GEOJSON_TYPE.POINT) {
        return null;
      }

      var event = props.lastPointerMoveEvent; // feature editHandles

      var editHandles = this.getEditHandlesFromFeature(selectedFeature, selectedFeatureIndex) || []; // cursor editHandle

      var cursorEditHandle = this._getCursorEditHandle(event, selectedFeature);

      if (cursorEditHandle) {
        // @ts-ignore
        editHandles.push(cursorEditHandle);
      }

      return {
        type: 'FeatureCollection',
        features: editHandles.length ? editHandles : null
      };
    }
  }]);

  return EditingMode;
}(_baseMode["default"]);

exports["default"] = EditingMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lZGl0LW1vZGVzL2VkaXRpbmctbW9kZS50cyJdLCJuYW1lcyI6WyJFZGl0aW5nTW9kZSIsImV2ZW50IiwicHJvcHMiLCJwaWNrZWQiLCJwaWNrcyIsInNlbGVjdGVkRmVhdHVyZUluZGV4Iiwic2VsZWN0ZWRJbmRleGVzIiwib2JqZWN0IiwiZmVhdHVyZUluZGV4Iiwib2JqZWN0VHlwZSIsInR5cGUiLCJpbmRleCIsImZlYXR1cmUiLCJnZXRTZWxlY3RlZEZlYXR1cmUiLCJnZW9tZXRyeSIsIkdFT0pTT05fVFlQRSIsIlBPTFlHT04iLCJMSU5FX1NUUklORyIsIkVMRU1FTlRfVFlQRSIsIlNFR01FTlQiLCJjb29yZGluYXRlcyIsImluc2VydEluZGV4IiwibGVuZ3RoIiwicG9zaXRpb25JbmRleGVzIiwiU0hBUEUiLCJpbnNlcnRNYXBDb29yZHMiLCJfZ2V0UG9pbnRPblNlZ21lbnQiLCJtYXBDb29yZHMiLCJ1cGRhdGVkRGF0YSIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwiZGF0YSIsImFkZFBvc2l0aW9uIiwiZ2V0T2JqZWN0Iiwib25FZGl0IiwiZWRpdFR5cGUiLCJFRElUX1RZUEUiLCJBRERfUE9TSVRJT04iLCJlZGl0Q29udGV4dCIsImVkaXRIYW5kbGVJbmRleCIsInNjcmVlbkNvb3JkcyIsInZpZXdwb3J0IiwicHJvamVjdCIsIk9iamVjdCIsInBpY2tlZE9iamVjdCIsIkZFQVRVUkUiLCJGSUxMIiwiRURJVF9IQU5ETEUiLCJfaGFuZGxlRHJhZ2dpbmciLCJzZWxlY3RlZEZlYXR1cmUiLCJpc0RyYWdnaW5nIiwicG9pbnRlckRvd25QaWNrcyIsImxhc3RQb2ludGVyTW92ZUV2ZW50IiwiY2xpY2tlZCIsIk1PVkVfUE9TSVRJT04iLCJGSU5JU0hfTU9WRV9QT1NJVElPTiIsImZlYXR1cmVzRHJhZ2dhYmxlIiwiZHgiLCJkeSIsIl91cGRhdGVGZWF0dXJlIiwidXBkYXRlVHlwZSIsInByb3BlcnRpZXMiLCJzaGFwZSIsIlJFQ1RBTkdMRSIsIm9wdGlvbnMiLCJuZXdDb29yZGluYXRlcyIsInJlcGxhY2VQb3NpdGlvbiIsIm1hcCIsInBpeGVscyIsInVucHJvamVjdCIsImZpbHRlciIsIkJvb2xlYW4iLCJQT0lOVCIsInJlcGxhY2VHZW9tZXRyeSIsInBpY2tlZE1hcENvb3JkcyIsInNyY1ZlcnRleEluZGV4IiwidGFyZ2V0VmVydGV4SW5kZXgiLCJndWlkZVR5cGUiLCJHVUlERV9UWVBFIiwiQ1VSU09SX0VESVRfSEFORExFIiwiZWRpdEhhbmRsZVR5cGUiLCJlZGl0SGFuZGxlcyIsImdldEVkaXRIYW5kbGVzRnJvbUZlYXR1cmUiLCJjdXJzb3JFZGl0SGFuZGxlIiwiX2dldEN1cnNvckVkaXRIYW5kbGUiLCJwdXNoIiwiZmVhdHVyZXMiLCJCYXNlTW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQVdBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQU9xQkEsVzs7Ozs7Ozs7Ozs7OztnQ0FDUEMsSyxFQUFtQkMsSyxFQUFxQztBQUNsRSxVQUFNQyxNQUFNLEdBQUdGLEtBQUssQ0FBQ0csS0FBTixJQUFlSCxLQUFLLENBQUNHLEtBQU4sQ0FBWSxDQUFaLENBQTlCO0FBQ0EsVUFBTUMsb0JBQW9CLEdBQUdILEtBQUssQ0FBQ0ksZUFBTixJQUF5QkosS0FBSyxDQUFDSSxlQUFOLENBQXNCLENBQXRCLENBQXRELENBRmtFLENBR2xFOztBQUNBLFVBQUksQ0FBQ0gsTUFBRCxJQUFXLENBQUNBLE1BQU0sQ0FBQ0ksTUFBbkIsSUFBNkJKLE1BQU0sQ0FBQ0ssWUFBUCxLQUF3Qkgsb0JBQXpELEVBQStFO0FBQzdFO0FBQ0QsT0FOaUUsQ0FRbEU7OztBQVJrRSxVQVNwREksVUFUb0QsR0FTaEJOLE1BVGdCLENBUzFETyxJQVQwRDtBQUFBLFVBU3hDRixZQVR3QyxHQVNoQkwsTUFUZ0IsQ0FTeENLLFlBVHdDO0FBQUEsVUFTMUJHLEtBVDBCLEdBU2hCUixNQVRnQixDQVMxQlEs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QVQ2QyxDQVc3Qzs7QUFDQSxVQUFNNkIsV0FBVyxHQUFHLEtBQUtDLHlCQUFMLENBQStCakMsZUFBL0IsRUFBZ0QzQyxvQkFBaEQsS0FBeUUsRUFBN0YsQ0FaNkMsQ0FjN0M7O0FBQ0EsVUFBTTZFLGdCQUFnQixHQUFHLEtBQUtDLG9CQUFMLENBQTBCbEYsS0FBMUIsRUFBaUMrQyxlQUFqQyxDQUF6Qjs7QUFDQSxVQUFJa0MsZ0JBQUosRUFBc0I7QUFDcEI7QUFDQUYsUUFBQUEsV0FBVyxDQUFDSSxJQUFaLENBQWlCRixnQkFBakI7QUFDRDs7QUFFRCxhQUFPO0FBQ0x4RSxRQUFBQSxJQUFJLEVBQUUsbUJBREQ7QUFFTDJFLFFBQUFBLFFBQVEsRUFBRUwsV0FBVyxDQUFDMUQsTUFBWixHQUFxQjBELFdBQXJCLEdBQW1DO0FBRnhDLE9BQVA7QUFJRDs7OztFQTFUc0NNLG9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUge1xuICBGZWF0dXJlLFxuICBGZWF0dXJlQ29sbGVjdGlvbixcbiAgQ2xpY2tFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIFBvc2l0aW9uLFxufSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHsgTW9kZVByb3BzIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbXBvcnQgeyBTSEFQRSwgRURJVF9UWVBFLCBFTEVNRU5UX1RZUEUsIEdFT0pTT05fVFlQRSwgR1VJREVfVFlQRSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgQmFzZU1vZGUgZnJvbSAnLi9iYXNlLW1vZGUnO1xuaW1wb3J0IHtcbiAgZmluZENsb3Nlc3RQb2ludE9uTGluZVNlZ21lbnQsXG4gIGdldEZlYXR1cmVDb29yZGluYXRlcyxcbiAgaXNOdW1lcmljLFxuICB1cGRhdGVSZWN0YW5nbGVQb3NpdGlvbixcbn0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRpbmdNb2RlIGV4dGVuZHMgQmFzZU1vZGUge1xuICBoYW5kbGVDbGljayhldmVudDogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBjb25zdCBwaWNrZWQgPSBldmVudC5waWNrcyAmJiBldmVudC5waWNrc1swXTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleCA9IHByb3BzLnNlbGVjdGVkSW5kZXhlcyAmJiBwcm9wcy5zZWxlY3RlZEluZGV4ZXNbMF07XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmICghcGlja2VkIHx8ICFwaWNrZWQub2JqZWN0IHx8IHBpY2tlZC5mZWF0dXJlSW5kZXggIT09IHNlbGVjdGVkRmVhdHVyZUluZGV4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHsgdHlwZTogb2JqZWN0VHlwZSwgZmVhdHVyZUluZGV4LCBpbmRleCB9ID0gcGlja2VkO1xuICAgIGNvbnN0IGZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZShwcm9wcywgZmVhdHVyZUluZGV4KTtcblxuICAgIGlmIChcbiAgICAgIGZlYXR1cmUgJiZcbiAgICAgIChmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09IEdFT0pTT05fVFlQRS5QT0xZR09OIHx8XG4gICAgICAgIGZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gR0VPSlNPTl9UWVBFLkxJTkVfU1RSSU5HKSAmJlxuICAgICAgb2JqZWN0VHlwZSA9PT0gRUxFTUVOVF9UWVBFLlNFR01FTlRcbiAgICApIHtcbiAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0RmVhdHVyZUNvb3JkaW5hdGVzKGZlYXR1cmUpO1xuICAgICAgaWYgKCFjb29yZGluYXRlcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjb25zdCBpbnNlcnRJbmRleCA9IChpbmRleCArIDEpICUgY29vcmRpbmF0ZXMubGVuZ3RoO1xuICAgICAgY29uc3QgcG9zaXRpb25JbmRleGVzID1cbiAgICAgICAgZmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSBTSEFQRS5QT0xZR09OID8gWzAsIGluc2VydEluZGV4XSA6IFtpbnNlcnRJbmRleF07XG4gICAgICBjb25zdCBpbnNlcnRNYXBDb29yZHMgPSB0aGlzLl9nZXRQb2ludE9uU2VnbWVudChmZWF0dXJlLCBwaWNrZWQsIGV2ZW50Lm1hcENvb3Jkcyk7XG5cbiAgICAgIGNvbnN0IHVwZGF0ZWREYXRhID0gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHByb3BzLmRhdGEpXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgLmFkZFBvc2l0aW9uKGZlYXR1cmVJbmRleCwgcG9zaXRpb25JbmRleGVzLCBpbnNlcnRNYXBDb29yZHMpXG4gICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgcHJvcHMub25FZGl0KHtcbiAgICAgICAgZWRpdFR5cGU6IEVESVRfVFlQRS5BRERfUE9TSVRJT04sXG4gICAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgICBlZGl0Q29udGV4dDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgICAgICAgIGVkaXRIYW5kbGVJbmRleDogaW5zZXJ0SW5kZXgsXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBzY3JlZW5Db29yZHM6IHByb3BzLnZpZXdwb3J0ICYmIHByb3BzLnZpZXdwb3J0LnByb2plY3QoaW5zZXJ0TWFwQ29vcmRzKSxcbiAgICAgICAgICAgIG1hcENvb3JkczogaW5zZXJ0TWFwQ29vcmRzLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIC8vIHJlcGxhY2UgcG9pbnRcbiAgICBjb25zdCBwaWNrZWQgPSBldmVudC5waWNrcyAmJiBldmVudC5waWNrc1swXTtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAoIXBpY2tlZCB8fCAhcGlja2VkLk9iamVjdCB8fCAhaXNOdW1lcmljKHBpY2tlZC5mZWF0dXJlSW5kZXgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGlja2VkT2JqZWN0ID0gcGlja2VkLm9iamVjdDtcbiAgICBzd2l0Y2ggKHBpY2tlZE9iamVjdC50eXBlKSB7XG4gICAgICBjYXNlIEVMRU1FTlRfVFlQRS5GRUFUVVJFOlxuICAgICAgY2FzZSBFTEVNRU5UX1RZUEUuRklMTDpcbiAgICAgIGNhc2UgRUxFTUVOVF9UWVBFLkVESVRfSEFORExFOlxuICAgICAgICB0aGlzLl9oYW5kbGVEcmFnZ2luZyhldmVudCwgcHJvcHMpO1xuXG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH1cblxuICBfaGFuZGxlRHJhZ2dpbmcoXG4gICAgZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQgfCBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgICBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPlxuICApIHtcbiAgICBjb25zdCB7IG9uRWRpdCB9ID0gcHJvcHM7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzKTtcbiAgICAvLyBub3RoaW5nIGNsaWNrZWRcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgeyBpc0RyYWdnaW5nLCBwb2ludGVyRG93blBpY2tzLCBzY3JlZW5Db29yZHMgfSA9IGV2ZW50O1xuICAgIGNvbnN0IHsgbGFzdFBvaW50ZXJNb3ZlRXZlbnQgfSA9IHByb3BzO1xuXG4gICAgY29uc3QgY2xpY2tlZCA9IHBvaW50ZXJEb3duUGlja3MgJiYgcG9pbnRlckRvd25QaWNrc1swXTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKCFjbGlja2VkIHx8ICFjbGlja2VkLm9iamVjdCB8fCAhaXNOdW1lcmljKGNsaWNrZWQuZmVhdHVyZUluZGV4KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCB7IHR5cGU6IG9iamVjdFR5cGUsIGluZGV4OiBlZGl0SGFuZGxlSW5kZXggfSA9IGNsaWNrZWQ7XG5cbiAgICAvLyBub3QgZHJhZ2dpbmdcbiAgICBsZXQgdXBkYXRlZERhdGEgPSBudWxsO1xuICAgIGNvbnN0IGVkaXRUeXBlID0gaXNEcmFnZ2luZyA/IEVESVRfVFlQRS5NT1ZFX1BPU0lUSU9OIDogRURJVF9UWVBFLkZJTklTSF9NT1ZFX1BPU0lUSU9OO1xuXG4gICAgc3dpdGNoIChvYmplY3RUeXBlKSB7XG4gICAgICBjYXNlIEVMRU1FTlRfVFlQRS5GRUFUVVJFOlxuICAgICAgY2FzZSBFTEVNRU5UX1RZUEUuRklMTDpcbiAgICAgIGNhc2UgRUxFTUVOVF9UWVBFLlNFR01FTlQ6XG4gICAgICAgIGlmICghcHJvcHMuZmVhdHVyZXNEcmFnZ2FibGUpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSAvLyBkcmFnZ2luZyBmZWF0dXJlXG5cbiAgICAgICAgY29uc3QgZHggPSBzY3JlZW5Db29yZHNbMF0gLSBsYXN0UG9pbnRlck1vdmVFdmVudC5zY3JlZW5Db29yZHNbMF07XG4gICAgICAgIGNvbnN0IGR5ID0gc2NyZWVuQ29vcmRzWzFdIC0gbGFzdFBvaW50ZXJNb3ZlRXZlbnQuc2NyZWVuQ29vcmRzWzFdO1xuICAgICAgICB1cGRhdGVkRGF0YSA9IHRoaXMuX3VwZGF0ZUZlYXR1cmUocHJvcHMsICdmZWF0dXJlJywgeyBkeCwgZHkgfSk7XG4gICAgICAgIG9uRWRpdCh7XG4gICAgICAgICAgZWRpdFR5cGUsXG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdENvbnRleHQ6IG51bGwsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEU6XG4gICAgICAgIC8vIGRyYWdnaW5nIGVkaXRIYW5kbGVcbiAgICAgICAgLy8gZHJhZ2dpbmcgcmVjdGFuZ2xlIG9yIG90aGVyIHNoYXBlc1xuICAgICAgICBjb25zdCB1cGRhdGVUeXBlID1cbiAgICAgICAgICBzZWxlY3RlZEZlYXR1cmUucHJvcGVydGllcy5zaGFwZSA9PT0gU0hBUEUuUkVDVEFOR0xFID8gJ3JlY3RhbmdsZScgOiAnZWRpdEhhbmRsZSc7XG4gICAgICAgIHVwZGF0ZWREYXRhID0gdGhpcy5fdXBkYXRlRmVhdHVyZShwcm9wcywgdXBkYXRlVHlwZSwge1xuICAgICAgICAgIGVkaXRIYW5kbGVJbmRleCxcbiAgICAgICAgICBtYXBDb29yZHM6IGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgICAgfSk7XG4gICAgICAgIG9uRWRpdCh7XG4gICAgICAgICAgZWRpdFR5cGUsXG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdENvbnRleHQ6IG51bGwsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH1cblxuICBoYW5kbGVQb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICAvLyBubyBzZWxlY3RlZCBmZWF0dXJlXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzKTtcbiAgICBpZiAoIXNlbGVjdGVkRmVhdHVyZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKCFldmVudC5pc0RyYWdnaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5faGFuZGxlRHJhZ2dpbmcoZXZlbnQsIHByb3BzKTtcbiAgfVxuXG4gIC8vIFRPRE8gLSByZWZhY3RvclxuICBfdXBkYXRlRmVhdHVyZShwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPiwgdHlwZTogc3RyaW5nLCBvcHRpb25zOiBhbnkgPSB7fSkge1xuICAgIGNvbnN0IHsgZGF0YSwgc2VsZWN0ZWRJbmRleGVzLCB2aWV3cG9ydCB9ID0gcHJvcHM7XG5cbiAgICBjb25zdCBmZWF0dXJlSW5kZXggPSBzZWxlY3RlZEluZGV4ZXMgJiYgc2VsZWN0ZWRJbmRleGVzWzBdO1xuICAgIGNvbnN0IGZlYXR1cmUgPSB0aGlzLmdldFNlbGVjdGVkRmVhdHVyZShwcm9wcywgZmVhdHVyZUluZGV4KTtcblxuICAgIGxldCBnZW9tZXRyeSA9IG51bGw7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMoZmVhdHVyZSk7XG4gICAgaWYgKCFjb29yZGluYXRlcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IG5ld0Nvb3JkaW5hdGVzID0gWy4uLmNvb3JkaW5hdGVzXTtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnZWRpdEhhbmRsZSc6XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uSW5kZXhlcyA9XG4gICAgICAgICAgZmVhdHVyZS5nZW9tZXRyeS50eXBlID09PSBHRU9KU09OX1RZUEUuUE9MWUdPTlxuICAgICAgICAgICAgPyBbMCwgb3B0aW9ucy5lZGl0SGFuZGxlSW5kZXhdXG4gICAgICAgICAgICA6IFtvcHRpb25zLmVkaXRIYW5kbGVJbmRleF07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihkYXRhKVxuICAgICAgICAgIC5yZXBsYWNlUG9zaXRpb24oZmVhdHVyZUluZGV4LCBwb3NpdGlvbkluZGV4ZXMsIG9wdGlvbnMubWFwQ29vcmRzKVxuICAgICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgY2FzZSAnZmVhdHVyZSc6XG4gICAgICAgIGNvbnN0IHsgZHgsIGR5IH0gPSBvcHRpb25zO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgbmV3Q29vcmRpbmF0ZXMgPSBuZXdDb29yZGluYXRlc1xuICAgICAgICAgIC5tYXAoKG1hcENvb3JkcykgPT4ge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29uc3QgcGl4ZWxzID0gdmlld3BvcnQgJiYgdmlld3BvcnQucHJvamVjdChtYXBDb29yZHMpO1xuICAgICAgICAgICAgaWYgKHBpeGVscykge1xuICAgICAgICAgICAgICBwaXhlbHNbMF0gKz0gZHg7XG4gICAgICAgICAgICAgIHBpeGVsc1sxXSArPSBkeTtcbiAgICAgICAgICAgICAgcmV0dXJuIHZpZXdwb3J0ICYmIHZpZXdwb3J0LnVucHJvamVjdChwaXhlbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgICBnZW9tZXRyeSA9IHtcbiAgICAgICAgICB0eXBlOiBmZWF0dXJlLmdlb21ldHJ5LnR5cGUsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6XG4gICAgICAgICAgICBmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09IEdFT0pTT05fVFlQRS5QT0xZR09OXG4gICAgICAgICAgICAgID8gW25ld0Nvb3JkaW5hdGVzXVxuICAgICAgICAgICAgICA6IGZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gR0VPSlNPTl9UWVBFLlBPSU5UXG4gICAgICAgICAgICAgID8gbmV3Q29vcmRpbmF0ZXNbMF1cbiAgICAgICAgICAgICAgOiBuZXdDb29yZGluYXRlcyxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKGRhdGEpXG4gICAgICAgICAgLnJlcGxhY2VHZW9tZXRyeShmZWF0dXJlSW5kZXgsIGdlb21ldHJ5KVxuICAgICAgICAgIC5nZXRPYmplY3QoKTtcblxuICAgICAgY2FzZSAncmVjdGFuZ2xlJzpcbiAgICAgICAgLy8gbW92ZWQgZWRpdEhhbmRsZUluZGV4IGFuZCBkZXN0aW5hdGlvbiBtYXBDb29yZHNcbiAgICAgICAgbmV3Q29vcmRpbmF0ZXMgPSB1cGRhdGVSZWN0YW5nbGVQb3NpdGlvbihcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgZmVhdHVyZSxcbiAgICAgICAgICBvcHRpb25zLmVkaXRIYW5kbGVJbmRleCxcbiAgICAgICAgICBvcHRpb25zLm1hcENvb3Jkc1xuICAgICAgICApO1xuICAgICAgICBnZW9tZXRyeSA9IHtcbiAgICAgICAgICB0eXBlOiBHRU9KU09OX1RZUEUuUE9MWUdPTixcbiAgICAgICAgICBjb29yZGluYXRlczogbmV3Q29vcmRpbmF0ZXMsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihkYXRhKVxuICAgICAgICAgIC5yZXBsYWNlR2VvbWV0cnkoZmVhdHVyZUluZGV4LCBnZW9tZXRyeSlcbiAgICAgICAgICAuZ2V0T2JqZWN0KCk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBkYXRhICYmIG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihkYXRhKS5nZXRPYmplY3QoKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0UG9pbnRPblNlZ21lbnQoZmVhdHVyZTogRmVhdHVyZSwgcGlja2VkOiBhbnksIHBpY2tlZE1hcENvb3JkczogUG9zaXRpb24pIHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyhmZWF0dXJlKTtcbiAgICBpZiAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qgc3JjVmVydGV4SW5kZXggPSBwaWNrZWQuaW5kZXg7XG4gICAgY29uc3QgdGFyZ2V0VmVydGV4SW5kZXggPSBwaWNrZWQuaW5kZXggKyAxO1xuICAgIHJldHVybiBmaW5kQ2xvc2VzdFBvaW50T25MaW5lU2VnbWVudChcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvb3JkaW5hdGVzW3NyY1ZlcnRleEluZGV4XSxcbiAgICAgIGNvb3JkaW5hdGVzW3RhcmdldFZlcnRleEluZGV4XSxcbiAgICAgIHBpY2tlZE1hcENvb3Jkc1xuICAgICk7XG4gIH1cblxuICBfZ2V0Q3Vyc29yRWRpdEhhbmRsZShldmVudDogUG9pbnRlck1vdmVFdmVudCwgZmVhdHVyZTogRmVhdHVyZSkge1xuICAgIC8vIGV2ZW50IGNhbiBiZSBudWxsIHdoZW4gdGhlIHVzZXIgaGFzIG5vdCBpbnRlcmFjdGVkIHdpdGggdGhlIG1hcCB3aGF0c29ldmVyXG4gICAgLy8gYW5kIHRoZXJlZm9yZSBwcm9wcy5sYXN0UG9pbnRlck1vdmVFdmVudCBpcyBzdGlsbCBudWxsXG4gICAgLy8gcmV0dXJuaW5nIG51bGwgaGVyZSBtZWFucyB3ZSBjYW4gZS5nLiBzZXQgYSBmZWF0dXJlSW5kZXggd2l0aG91dCByZXF1aXJpbmcgYW4gZXZlbnRcbiAgICBpZiAoIWV2ZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgeyBpc0RyYWdnaW5nLCBwaWNrcyB9ID0gZXZlbnQ7XG4gICAgLy8gaWYgbm90IHBpY2sgc2VnbWVudFxuICAgIGNvbnN0IHBpY2tlZCA9IHBpY2tzICYmIHBpY2tzWzBdO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAoIXBpY2tlZCB8fCAhaXNOdW1lcmljKHBpY2tlZC5mZWF0dXJlSW5kZXgpIHx8IHBpY2tlZC50eXBlICE9PSBFTEVNRU5UX1RZUEUuU0VHTUVOVCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gaWYgZHJhZ2dpbmcgb3IgZmVhdHVyZSBpcyBuZWl0aGVyIHBvbHlnb24gbm9yIGxpbmUgc3RyaW5nXG4gICAgaWYgKFxuICAgICAgaXNEcmFnZ2luZyB8fFxuICAgICAgKGZlYXR1cmUuZ2VvbWV0cnkudHlwZSAhPT0gR0VPSlNPTl9UWVBFLlBPTFlHT04gJiZcbiAgICAgICAgZmVhdHVyZS5nZW9tZXRyeS50eXBlICE9PSBHRU9KU09OX1RZUEUuTElORV9TVFJJTkcpXG4gICAgKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBpbnNlcnRNYXBDb29yZHMgPSB0aGlzLl9nZXRQb2ludE9uU2VnbWVudChmZWF0dXJlLCBwaWNrZWQsIGV2ZW50Lm1hcENvb3Jkcyk7XG5cbiAgICBpZiAoIWluc2VydE1hcENvb3Jkcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZ3VpZGVUeXBlOiBHVUlERV9UWVBFLkNVUlNPUl9FRElUX0hBTkRMRSxcbiAgICAgICAgc2hhcGU6IGZlYXR1cmUucHJvcGVydGllcy5zaGFwZSxcbiAgICAgICAgcG9zaXRpb25JbmRleGVzOiBbLTFdLFxuICAgICAgICBlZGl0SGFuZGxlVHlwZTogJ2ludGVybWVkaWF0ZScsXG4gICAgICB9LFxuICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgdHlwZTogR0VPSlNPTl9UWVBFLlBPSU5ULFxuICAgICAgICBjb29yZGluYXRlczogaW5zZXJ0TWFwQ29vcmRzLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG4gIC8vIEB0cy1pZ25vcmVcbiAgZ2V0R3VpZGVzKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IHRoaXMuZ2V0U2VsZWN0ZWRGZWF0dXJlKHByb3BzKTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleCA9IHByb3BzLnNlbGVjdGVkSW5kZXhlcyAmJiBwcm9wcy5zZWxlY3RlZEluZGV4ZXNbMF07XG5cbiAgICBpZiAoIXNlbGVjdGVkRmVhdHVyZSB8fCBzZWxlY3RlZEZlYXR1cmUuZ2VvbWV0cnkudHlwZSA9PT0gR0VPSlNPTl9UWVBFLlBPSU5UKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBldmVudCA9IHByb3BzLmxhc3RQb2ludGVyTW92ZUV2ZW50O1xuXG4gICAgLy8gZmVhdHVyZSBlZGl0SGFuZGxlc1xuICAgIGNvbnN0IGVkaXRIYW5kbGVzID0gdGhpcy5nZXRFZGl0SGFuZGxlc0Zyb21GZWF0dXJlKHNlbGVjdGVkRmVhdHVyZSwgc2VsZWN0ZWRGZWF0dXJlSW5kZXgpIHx8IFtdO1xuXG4gICAgLy8gY3Vyc29yIGVkaXRIYW5kbGVcbiAgICBjb25zdCBjdXJzb3JFZGl0SGFuZGxlID0gdGhpcy5fZ2V0Q3Vyc29yRWRpdEhhbmRsZShldmVudCwgc2VsZWN0ZWRGZWF0dXJlKTtcbiAgICBpZiAoY3Vyc29yRWRpdEhhbmRsZSkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZWRpdEhhbmRsZXMucHVzaChjdXJzb3JFZGl0SGFuZGxlKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmVDb2xsZWN0aW9uJyxcbiAgICAgIGZlYXR1cmVzOiBlZGl0SGFuZGxlcy5sZW5ndGggPyBlZGl0SGFuZGxlcyA6IG51bGwsXG4gICAgfTtcbiAgfVxufVxuIl19