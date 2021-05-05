"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layers = require("@deck.gl/layers");

var _editModes = require("@nebula.gl/edit-modes");

var _editableLayer = _interopRequireDefault(require("./editable-layer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_LINE_COLOR = [0x0, 0x0, 0x0, 0x99];
var DEFAULT_FILL_COLOR = [0x0, 0x0, 0x0, 0x90];
var DEFAULT_SELECTED_LINE_COLOR = [0x0, 0x0, 0x0, 0xff];
var DEFAULT_SELECTED_FILL_COLOR = [0x0, 0x0, 0x90, 0x90];
var DEFAULT_TENTATIVE_LINE_COLOR = [0x90, 0x90, 0x90, 0xff];
var DEFAULT_TENTATIVE_FILL_COLOR = [0x90, 0x90, 0x90, 0x90];
var DEFAULT_EDITING_EXISTING_POINT_COLOR = [0xc0, 0x0, 0x0, 0xff];
var DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR = [0x0, 0x0, 0x0, 0x80];
var DEFAULT_EDITING_SNAP_POINT_COLOR = [0x7c, 0x00, 0xc0, 0xff];
var DEFAULT_EDITING_POINT_OUTLINE_COLOR = [0xff, 0xff, 0xff, 0xff];
var DEFAULT_EDITING_EXISTING_POINT_RADIUS = 5;
var DEFAULT_EDITING_INTERMEDIATE_POINT_RADIUS = 3;
var DEFAULT_EDITING_SNAP_POINT_RADIUS = 7;
var DEFAULT_EDIT_MODE = _editModes.DrawPolygonMode;

function guideAccessor(accessor) {
  if (!accessor || typeof accessor !== 'function') {
    return accessor;
  }

  return function (guideMaybeWrapped) {
    return accessor(unwrapGuide(guideMaybeWrapped));
  };
} // The object handed to us from deck.gl is different depending on the version of deck.gl used, unwrap as necessary


function unwrapGuide(guideMaybeWrapped) {
  if (guideMaybeWrapped.__source) {
    return guideMaybeWrapped.__source.object;
  } else if (guideMaybeWrapped.sourceFeature) {
    return guideMaybeWrapped.sourceFeature.feature;
  } // It is not wrapped, return as is


  return guideMaybeWrapped;
}

function getEditHandleColor(handle) {
  switch (handle.properties.editHandleType) {
    case 'existing':
      return DEFAULT_EDITING_EXISTING_POINT_COLOR;

    case 'snap-source':
      return DEFAULT_EDITING_SNAP_POINT_COLOR;

    case 'intermediate':
    default:
      return DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR;
  }
}

function getEditHandleOutlineColor(handle) {
  return DEFAULT_EDITING_POINT_OUTLINE_COLOR;
}

function getEditHandleRadius(handle) {
  switch (handle.properties.editHandleType) {
    case 'existing':
      return DEFAULT_EDITING_EXISTING_POINT_RADIUS;

    case 'snap':
      return DEFAULT_EDITING_SNAP_POINT_RADIUS;

    case 'intermediate':
    default:
      return DEFAULT_EDITING_INTERMEDIATE_POINT_RADIUS;
  }
}

var defaultProps = {
  mode: DEFAULT_EDIT_MODE,
  // Edit and interaction events
  onEdit: function onEdit() {},
  pickable: true,
  pickingRadius: 10,
  pickingDepth: 5,
  fp64: false,
  filled: true,
  stroked: true,
  lineWidthScale: 1,
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
  lineWidthUnits: 'pixels',
  lineJointRounded: false,
  lineMiterLimit: 4,
  pointRadiusScale: 1,
  pointRadiusMinPixels: 2,
  pointRadiusMaxPixels: Number.MAX_SAFE_INTEGER,
  getLineColor: function getLineColor(feature, isSelected, mode) {
    return isSelected ? DEFAULT_SELECTED_LINE_COLOR : DEFAULT_LINE_COLOR;
  },
  getFillColor: function getFillColor(feature, isSelected, mode) {
    return isSelected ? DEFAULT_SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR;
  },
  getRadius: function getRadius(f) {
    return f && f.properties && f.properties.radius || f && f.properties && f.properties.size || 1;
  },
  getLineWidth: function getLineWidth(f) {
    return f && f.properties && f.properties.lineWidth || 3;
  },
  // Tentative feature rendering
  getTentativeLineColor: function getTentativeLineColor(f) {
    return DEFAULT_TENTATIVE_LINE_COLOR;
  },
  getTentativeFillColor: function getTentativeFillColor(f) {
    return DEFAULT_TENTATIVE_FILL_COLOR;
  },
  getTentativeLineWidth: function getTentativeLineWidth(f) {
    return f && f.properties && f.properties.lineWidth || 3;
  },
  editHandleType: 'point',
  // point handles
  editHandlePointRadiusScale: 1,
  editHandlePointOutline: true,
  editHandlePointStrokeWidth: 2,
  editHandlePointRadiusMinPixels: 4,
  editHandlePointRadiusMaxPixels: 8,
  getEditHandlePointColor: getEditHandleColor,
  getEditHandlePointOutlineColor: getEditHandleOutlineColor,
  getEditHandlePointRadius: getEditHandleRadius,
  // icon handles
  editHandleIconAtlas: null,
  editHandleIconMapping: null,
  editHandleIconSizeScale: 1,
  getEditHandleIcon: function getEditHandleIcon(handle) {
    return handle.properties.editHandleType;
  },
  getEditHandleIconSize: 10,
  getEditHandleIconColor: getEditHandleColor,
  getEditHandleIconAngle: 0,
  // misc
  billboard: true
}; // Mapping of mode name to mode class (for legacy purposes)

var modeNameMapping = {
  view: _editModes.ViewMode,
  // Alter modes
  modify: _editModes.ModifyMode,
  translate: new _editModes.SnappableMode(new _editModes.TranslateMode()),
  transform: new _editModes.SnappableMode(new _editModes.TransformMode()),
  scale: _editModes.ScaleMode,
  rotate: _editModes.RotateMode,
  duplicate: _editModes.DuplicateMode,
  split: _editModes.SplitPolygonMode,
  extrude: _editModes.ExtrudeMode,
  elevation: _editModes.ElevationMode,
  // Draw modes
  drawPoint: _editModes.DrawPointMode,
  drawLineString: _editModes.DrawLineStringMode,
  drawPolygon: _editModes.DrawPolygonMode,
  drawRectangle: _editModes.DrawRectangleMode,
  drawSquareFromCenter: _editModes.DrawSquareFromCenterMode,
  drawCircleFromCenter: _editModes.DrawCircleFromCenterMode,
  drawCircleByBoundingBox: _editModes.DrawCircleByDiameterMode,
  drawEllipseByBoundingBox: _editModes.DrawEllipseByBoundingBoxMode,
  drawRectangleUsing3Points: _editModes.DrawRectangleUsingThreePointsMode,
  drawEllipseUsing3Points: _editModes.DrawEllipseUsingThreePointsMode,
  draw90DegreePolygon: _editModes.Draw90DegreePolygonMode,
  drawPolygonByDragging: _editModes.DrawPolygonByDraggingMode
};

// type State = {
//   mode: GeoJsonEditMode,
//   tentativeFeature: ?Feature,
//   editHandles: any[],
//   selectedFeatures: Feature[]
// };
var EditableGeoJsonLayer = /*#__PURE__*/function (_EditableLayer) {
  _inherits(EditableGeoJsonLayer, _EditableLayer);

  var _super = _createSuper(EditableGeoJsonLayer);

  function EditableGeoJsonLayer() {
    _classCallCheck(this, EditableGeoJsonLayer);

    return _super.apply(this, arguments);
  }

  _createClass(EditableGeoJsonLayer, [{
    key: "renderLayers",
    // props: Props;
    // setState: ($Shape<State>) => void;
    value: function renderLayers() {
      var subLayerProps = this.getSubLayerProps({
        id: 'geojson',
        // Proxy most GeoJsonLayer props as-is
        data: this.props.data,
        fp64: this.props.fp64,
        filled: this.props.filled,
        stroked: this.props.stroked,
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineWidthUnits: this.props.lineWidthUnits,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        pointRadiusScale: this.props.pointRadiusScale,
        pointRadiusMinPixels: this.props.pointRadiusMinPixels,
        pointRadiusMaxPixels: this.props.pointRadiusMaxPixels,
        getLineColor: this.selectionAwareAccessor(this.props.getLineColor),
        getFillColor: this.selectionAwareAccessor(this.props.getFillColor),
        getRadius: this.selectionAwareAccessor(this.props.getRadius),
        getLineWidth: this.selectionAwareAccessor(this.props.getLineWidth),
        _subLayerProps: {
          'line-strings': {
            billboard: this.props.billboard
          },
          'polygons-stroke': {
            billboard: this.props.billboard
          }
        },
        updateTriggers: {
          getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
          getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
          getRadius: [this.props.selectedFeatureIndexes, this.props.mode],
          getLineWidth: [this.props.selectedFeatureIndexes, this.props.mode]
        }
      });
      var layers = [new _layers.GeoJsonLayer(subLayerProps)];
      layers = layers.concat(this.createGuidesLayers(), this.createTooltipsLayers());
      return layers;
    }
  }, {
    key: "initializeState",
    value: function initializeState() {
      _get(_getPrototypeOf(EditableGeoJsonLayer.prototype), "initializeState", this).call(this);

      this.setState({
        selectedFeatures: [],
        editHandles: []
      });
    } // TODO: is this the best way to properly update state from an outside event handler?

  }, {
    key: "shouldUpdateState",
    value: function shouldUpdateState(opts) {
      // console.log(
      //   'shouldUpdateState',
      //   opts.changeFlags.propsOrDataChanged,
      //   opts.changeFlags.stateChanged
      // );
      return _get(_getPrototypeOf(EditableGeoJsonLayer.prototype), "shouldUpdateState", this).call(this, opts) || opts.changeFlags.stateChanged;
    }
  }, {
    key: "updateState",
    value: function updateState(_ref) {
      var props = _ref.props,
          oldProps = _ref.oldProps,
          changeFlags = _ref.changeFlags;

      // @ts-ignore
      _get(_getPrototypeOf(EditableGeoJsonLayer.prototype), "updateState", this).call(this, {
        oldProps: oldProps,
        props: props,
        changeFlags: changeFlags
      });

      if (changeFlags.propsOrDataChanged) {
        var modePropChanged = Object.keys(oldProps).length === 0 || props.mode !== oldProps.mode;

        if (modePropChanged) {
          var mode;

          if (typeof props.mode === 'function') {
            // They passed a constructor/class, so new it up
            var ModeConstructor = props.mode;
            mode = new ModeConstructor();
          } else if (typeof props.mode === 'string') {
            // Lookup the mode based on its name (for backwards compatibility)
            mode = modeNameMapping[props.mode]; // eslint-disable-next-line no-console

            console.warn("Deprecated use of passing `mode` as a string. Pass the mode's class constructor instead.");
          } else {
            // Should be an instance of EditMode in this case
            mode = props.mode;
          }

          if (!mode) {
            console.warn("No mode configured for ".concat(String(props.mode))); // eslint-disable-line no-console,no-undef
            // Use default mode

            mode = new DEFAULT_EDIT_MODE();
          }

          if (mode !== this.state.mode) {
            this.setState({
              mode: mode,
              cursor: null
            });
          }
        }
      }

      var selectedFeatures = [];

      if (Array.isArray(props.selectedFeatureIndexes)) {
        // TODO: needs improved testing, i.e. checking for duplicates, NaNs, out of range numbers, ...
        selectedFeatures = props.selectedFeatureIndexes.map(function (elem) {
          return props.data.features[elem];
        });
      }

      this.setState({
        selectedFeatures: selectedFeatures
      });
    }
  }, {
    key: "getModeProps",
    value: function getModeProps(props) {
      var _this = this;

      return {
        modeConfig: props.modeConfig,
        data: props.data,
        selectedIndexes: props.selectedFeatureIndexes,
        lastPointerMoveEvent: this.state.lastPointerMoveEvent,
        cursor: this.state.cursor,
        onEdit: function onEdit(editAction) {
          // Force a re-render
          // This supports double-click where we need to ensure that there's a re-render between the two clicks
          // even though the data wasn't changed, just the internal tentative feature.
          _this.setNeedsUpdate();

          props.onEdit(editAction);
        },
        onUpdateCursor: function onUpdateCursor(cursor) {
          _this.setState({
            cursor: cursor
          });
        }
      };
    }
  }, {
    key: "selectionAwareAccessor",
    value: function selectionAwareAccessor(accessor) {
      var _this2 = this;

      if (typeof accessor !== 'function') {
        return accessor;
      }

      return function (feature) {
        return accessor(feature, _this2.isFeatureSelected(feature), _this2.props.mode);
      };
    }
  }, {
    key: "isFeatureSelected",
    value: function isFeatureSelected(feature) {
      if (!this.props.data || !this.props.selectedFeatureIndexes) {
        return false;
      }

      if (!this.props.selectedFeatureIndexes.length) {
        return false;
      }

      var featureIndex = this.props.data.features.indexOf(feature);
      return this.props.selectedFeatureIndexes.includes(featureIndex);
    }
  }, {
    key: "getPickingInfo",
    value: function getPickingInfo(_ref2) {
      var info = _ref2.info,
          sourceLayer = _ref2.sourceLayer;

      if (sourceLayer.id.endsWith('guides')) {
        // If user is picking an editing handle, add additional data to the info
        info.isGuide = true;
      }

      return info;
    }
  }, {
    key: "createGuidesLayers",
    value: function createGuidesLayers() {
      var mode = this.getActiveMode();
      var guides = mode.getGuides(this.getModeProps(this.props));

      if (!guides || !guides.features.length) {
        return [];
      }

      var pointLayerProps;

      if (this.props.editHandleType === 'icon') {
        pointLayerProps = {
          type: _layers.IconLayer,
          iconAtlas: this.props.editHandleIconAtlas,
          iconMapping: this.props.editHandleIconMapping,
          sizeScale: this.props.editHandleIconSizeScale,
          getIcon: guideAccessor(this.props.getEditHandleIcon),
          getSize: guideAccessor(this.props.getEditHandleIconSize),
          getColor: guideAccessor(this.props.getEditHandleIconColor),
          getAngle: guideAccessor(this.props.getEditHandleIconAngle)
        };
      } else {
        pointLayerProps = {
          type: _layers.ScatterplotLayer,
          radiusScale: this.props.editHandlePointRadiusScale,
          stroked: this.props.editHandlePointOutline,
          getLineWidth: this.props.editHandlePointStrokeWidth,
          radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
          radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
          getRadius: guideAccessor(this.props.getEditHandlePointRadius),
          getFillColor: guideAccessor(this.props.getEditHandlePointColor),
          getLineColor: guideAccessor(this.props.getEditHandlePointOutlineColor)
        };
      }

      var layer = new _layers.GeoJsonLayer(this.getSubLayerProps({
        id: "guides",
        data: guides,
        fp64: this.props.fp64,
        _subLayerProps: {
          points: pointLayerProps
        },
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineWidthUnits: this.props.lineWidthUnits,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        getLineColor: guideAccessor(this.props.getTentativeLineColor),
        getLineWidth: guideAccessor(this.props.getTentativeLineWidth),
        getFillColor: guideAccessor(this.props.getTentativeFillColor)
      }));
      return [layer];
    }
  }, {
    key: "createTooltipsLayers",
    value: function createTooltipsLayers() {
      var mode = this.getActiveMode();
      var tooltips = mode.getTooltips(this.getModeProps(this.props));
      var layer = new _layers.TextLayer(this.getSubLayerProps({
        id: "tooltips",
        data: tooltips
      }));
      return [layer];
    }
  }, {
    key: "onLayerClick",
    value: function onLayerClick(event) {
      this.getActiveMode().handleClick(event, this.getModeProps(this.props));
    }
  }, {
    key: "onLayerKeyUp",
    value: function onLayerKeyUp(event) {
      this.getActiveMode().handleKeyUp(event, this.getModeProps(this.props));
    }
  }, {
    key: "onStartDragging",
    value: function onStartDragging(event) {
      this.getActiveMode().handleStartDragging(event, this.getModeProps(this.props));
    }
  }, {
    key: "onDragging",
    value: function onDragging(event) {
      this.getActiveMode().handleDragging(event, this.getModeProps(this.props));
    }
  }, {
    key: "onStopDragging",
    value: function onStopDragging(event) {
      this.getActiveMode().handleStopDragging(event, this.getModeProps(this.props));
    }
  }, {
    key: "onPointerMove",
    value: function onPointerMove(event) {
      this.setState({
        lastPointerMoveEvent: event
      });
      this.getActiveMode().handlePointerMove(event, this.getModeProps(this.props));
    }
  }, {
    key: "getCursor",
    value: function getCursor(_ref3) {
      var isDragging = _ref3.isDragging;
      var cursor = this.state.cursor;

      if (!cursor) {
        // default cursor
        cursor = isDragging ? 'grabbing' : 'grab';
      }

      return cursor;
    }
  }, {
    key: "getActiveMode",
    value: function getActiveMode() {
      return this.state.mode;
    }
  }]);

  return EditableGeoJsonLayer;
}(_editableLayer["default"]);

exports["default"] = EditableGeoJsonLayer;

_defineProperty(EditableGeoJsonLayer, "layerName", 'EditableGeoJsonLayer');

_defineProperty(EditableGeoJsonLayer, "defaultProps", defaultProps);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtZ2VvanNvbi1sYXllci50cyJdLCJuYW1lcyI6WyJERUZBVUxUX0xJTkVfQ09MT1IiLCJERUZBVUxUX0ZJTExfQ09MT1IiLCJERUZBVUxUX1NFTEVDVEVEX0xJTkVfQ09MT1IiLCJERUZBVUxUX1NFTEVDVEVEX0ZJTExfQ09MT1IiLCJERUZBVUxUX1RFTlRBVElWRV9MSU5FX0NPTE9SIiwiREVGQVVMVF9URU5UQVRJVkVfRklMTF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19QT0lOVF9PVVRMSU5FX0NPTE9SIiwiREVGQVVMVF9FRElUSU5HX0VYSVNUSU5HX1BPSU5UX1JBRElVUyIsIkRFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfUkFESVVTIiwiREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfUkFESVVTIiwiREVGQVVMVF9FRElUX01PREUiLCJEcmF3UG9seWdvbk1vZGUiLCJndWlkZUFjY2Vzc29yIiwiYWNjZXNzb3IiLCJndWlkZU1heWJlV3JhcHBlZCIsInVud3JhcEd1aWRlIiwiX19zb3VyY2UiLCJvYmplY3QiLCJzb3VyY2VGZWF0dXJlIiwiZmVhdHVyZSIsImdldEVkaXRIYW5kbGVDb2xvciIsImhhbmRsZSIsInByb3BlcnRpZXMiLCJlZGl0SGFuZGxlVHlwZSIsImdldEVkaXRIYW5kbGVPdXRsaW5lQ29sb3IiLCJnZXRFZGl0SGFuZGxlUmFkaXVzIiwiZGVmYXVsdFByb3BzIiwibW9kZSIsIm9uRWRpdCIsInBpY2thYmxlIiwicGlja2luZ1JhZGl1cyIsInBpY2tpbmdEZXB0aCIsImZwNjQiLCJmaWxsZWQiLCJzdHJva2VkIiwibGluZVdpZHRoU2NhbGUiLCJsaW5lV2lkdGhNaW5QaXhlbHMiLCJsaW5lV2lkdGhNYXhQaXhlbHMiLCJOdW1iZXIiLCJNQVhfU0FGRV9JTlRFR0VSIiwibGluZVdpZHRoVW5pdHMiLCJsaW5lSm9pbnRSb3VuZGVkIiwibGluZU1pdGVyTGltaXQiLCJwb2ludFJhZGl1c1NjYWxlIiwicG9pbnRSYWRpdXNNaW5QaXhlbHMiLCJwb2ludFJhZGl1c01heFBpeGVscyIsImdldExpbmVDb2xvciIsImlzU2VsZWN0ZWQiLCJnZXRGaWxsQ29sb3IiLCJnZXRSYWRpdXMiLCJmIiwicmFkaXVzIiwic2l6ZSIsImdldExpbmVXaWR0aCIsImxpbmVXaWR0aCIsImdldFRlbnRhdGl2ZUxpbmVDb2xvciIsImdldFRlbnRhdGl2ZUZpbGxDb2xvciIsImdldFRlbnRhdGl2ZUxpbmVXaWR0aCIsImVkaXRIYW5kbGVQb2ludFJhZGl1c1NjYWxlIiwiZWRpdEhhbmRsZVBvaW50T3V0bGluZSIsImVkaXRIYW5kbGVQb2ludFN0cm9rZVdpZHRoIiwiZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzIiwiZWRpdEhhbmRsZVBvaW50UmFkaXVzTWF4UGl4ZWxzIiwiZ2V0RWRpdEhhbmRsZVBvaW50Q29sb3IiLCJnZXRFZGl0SGFuZGxlUG9pbnRPdXRsaW5lQ29sb3IiLCJnZXRFZGl0SGFuZGxlUG9pbnRSYWRpdXMiLCJlZGl0SGFuZGxlSWNvbkF0bGFzIiwiZWRpdEhhbmRsZUljb25NYXBwaW5nIiwiZWRpdEhhbmRsZUljb25TaXplU2NhbGUiLCJnZXRFZGl0SGFuZGxlSWNvbiIsImdldEVkaXRIYW5kbGVJY29uU2l6ZSIsImdldEVkaXRIYW5kbGVJY29uQ29sb3IiLCJnZXRFZGl0SGFuZGxlSWNvbkFuZ2xlIiwiYmlsbGJvYXJkIiwibW9kZU5hbWVNYXBwaW5nIiwidmlldyIsIlZpZXdNb2RlIiwibW9kaWZ5IiwiTW9kaWZ5TW9kZSIsInRyYW5zbGF0ZSIsIlNuYXBwYWJsZU1vZGUiLCJUcmFuc2xhdGVNb2RlIiwidHJhbnNmb3JtIiwiVHJhbnNmb3JtTW9kZSIsInNjYWxlIiwiU2NhbGVNb2RlIiwicm90YXRlIiwiUm90YXRlTW9kZSIsImR1cGxpY2F0ZSIsIkR1cGxpY2F0ZU1vZGUiLCJzcGxpdCIsIlNwbGl0UG9seWdvbk1vZGUiLCJleHRydWRlIiwiRXh0cnVkZU1vZGUiLCJlbGV2YXRpb24iLCJFbGV2YXRpb25Nb2RlIiwiZHJhd1BvaW50IiwiRHJhd1BvaW50TW9kZSIsImRyYXdMaW5lU3RyaW5nIiwiRHJhd0xpbmVTdHJpbmdNb2RlIiwiZHJhd1BvbHlnb24iLCJkcmF3UmVjdGFuZ2xlIiwiRHJhd1JlY3RhbmdsZU1vZGUiLCJkcmF3U3F1YXJlRnJvbUNlbnRlciIsIkRyYXdTcXVhcmVGcm9tQ2VudGVyTW9kZSIsImRyYXdDaXJjbGVGcm9tQ2VudGVyIiwiRHJhd0NpcmNsZUZyb21DZW50ZXJNb2RlIiwiZHJhd0NpcmNsZUJ5Qm91bmRpbmdCb3giLCJEcmF3Q2lyY2xlQnlEaWFtZXRlck1vZGUiLCJkcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3giLCJEcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3hNb2RlIiwiZHJhd1JlY3RhbmdsZVVzaW5nM1BvaW50cyIsIkRyYXdSZWN0YW5nbGVVc2luZ1RocmVlUG9pbnRzTW9kZSIsImRyYXdFbGxpcHNlVXNpbmczUG9pbnRzIiwiRHJhd0VsbGlwc2VVc2luZ1RocmVlUG9pbnRzTW9kZSIsImRyYXc5MERlZ3JlZVBvbHlnb24iLCJEcmF3OTBEZWdyZWVQb2x5Z29uTW9kZSIsImRyYXdQb2x5Z29uQnlEcmFnZ2luZyIsIkRyYXdQb2x5Z29uQnlEcmFnZ2luZ01vZGUiLCJFZGl0YWJsZUdlb0pzb25MYXllciIsInN1YkxheWVyUHJvcHMiLCJnZXRTdWJMYXllclByb3BzIiwiaWQiLCJkYXRhIiwicHJvcHMiLCJzZWxlY3Rpb25Bd2FyZUFjY2Vzc29yIiwiX3N1YkxheWVyUHJvcHMiLCJ1cGRhdGVUcmlnZ2VycyIsInNlbGVjdGVkRmVhdHVyZUluZGV4ZXMiLCJsYXllcnMiLCJHZW9Kc29uTGF5ZXIiLCJjb25jYXQiLCJjcmVhdGVHdWlkZXNMYXllcnMiLCJjcmVhdGVUb29sdGlwc0xheWVycyIsInNldFN0YXRlIiwic2VsZWN0ZWRGZWF0dXJlcyIsImVkaXRIYW5kbGVzIiwib3B0cyIsImNoYW5nZUZsYWdzIiwic3RhdGVDaGFuZ2VkIiwib2xkUHJvcHMiLCJwcm9wc09yRGF0YUNoYW5nZWQiLCJtb2RlUHJvcENoYW5nZWQiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiTW9kZUNvbnN0cnVjdG9yIiwiY29uc29sZSIsIndhcm4iLCJTdHJpbmciLCJzdGF0ZSIsImN1cnNvciIsIkFycmF5IiwiaXNBcnJheSIsIm1hcCIsImVsZW0iLCJmZWF0dXJlcyIsIm1vZGVDb25maWciLCJzZWxlY3RlZEluZGV4ZXMiLCJsYXN0UG9pbnRlck1vdmVFdmVudCIsImVkaXRBY3Rpb24iLCJzZXROZWVkc1VwZGF0ZSIsIm9uVXBkYXRlQ3Vyc29yIiwiaXNGZWF0dXJlU2VsZWN0ZWQiLCJmZWF0dXJlSW5kZXgiLCJpbmRleE9mIiwiaW5jbHVkZXMiLCJpbmZvIiwic291cmNlTGF5ZXIiLCJlbmRzV2l0aCIsImlzR3VpZGUiLCJnZXRBY3RpdmVNb2RlIiwiZ3VpZGVzIiwiZ2V0R3VpZGVzIiwiZ2V0TW9kZVByb3BzIiwicG9pbnRMYXllclByb3BzIiwidHlwZSIsIkljb25MYXllciIsImljb25BdGxhcyIsImljb25NYXBwaW5nIiwic2l6ZVNjYWxlIiwiZ2V0SWNvbiIsImdldFNpemUiLCJnZXRDb2xvciIsImdldEFuZ2xlIiwiU2NhdHRlcnBsb3RMYXllciIsInJhZGl1c1NjYWxlIiwicmFkaXVzTWluUGl4ZWxzIiwicmFkaXVzTWF4UGl4ZWxzIiwibGF5ZXIiLCJwb2ludHMiLCJ0b29sdGlwcyIsImdldFRvb2x0aXBzIiwiVGV4dExheWVyIiwiZXZlbnQiLCJoYW5kbGVDbGljayIsImhhbmRsZUtleVVwIiwiaGFuZGxlU3RhcnREcmFnZ2luZyIsImhhbmRsZURyYWdnaW5nIiwiaGFuZGxlU3RvcERyYWdnaW5nIiwiaGFuZGxlUG9pbnRlck1vdmUiLCJp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bEQsTUFEMkMsR0FDaEMsS0FBS0QsS0FEMkIsQ0FDM0NDLE1BRDJDOztBQUVqRCxVQUFJLENBQUNBLE1BQUwsRUFBYTtBQUNYO0FBQ0FBLFFBQUFBLE1BQU0sR0FBR2tELFVBQVUsR0FBRyxVQUFILEdBQWdCLE1BQW5DO0FBQ0Q7O0FBQ0QsYUFBT2xELE1BQVA7QUFDRDs7O29DQUVvQztBQUNuQyxhQUFPLEtBQUtELEtBQUwsQ0FBVzNILElBQWxCO0FBQ0Q7Ozs7RUF4UitDK0sseUI7Ozs7Z0JBQTdCbkYsb0IsZUFDQSxzQjs7Z0JBREFBLG9CLGtCQUVHN0YsWSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG5pbXBvcnQgeyBHZW9Kc29uTGF5ZXIsIFNjYXR0ZXJwbG90TGF5ZXIsIEljb25MYXllciwgVGV4dExheWVyIH0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcblxuaW1wb3J0IHtcbiAgVmlld01vZGUsXG4gIE1vZGlmeU1vZGUsXG4gIFRyYW5zbGF0ZU1vZGUsXG4gIFNjYWxlTW9kZSxcbiAgUm90YXRlTW9kZSxcbiAgRHVwbGljYXRlTW9kZSxcbiAgU3BsaXRQb2x5Z29uTW9kZSxcbiAgRXh0cnVkZU1vZGUsXG4gIEVsZXZhdGlvbk1vZGUsXG4gIERyYXdQb2ludE1vZGUsXG4gIERyYXdMaW5lU3RyaW5nTW9kZSxcbiAgRHJhd1BvbHlnb25Nb2RlLFxuICBEcmF3UmVjdGFuZ2xlTW9kZSxcbiAgRHJhd1NxdWFyZUZyb21DZW50ZXJNb2RlLFxuICBEcmF3Q2lyY2xlRnJvbUNlbnRlck1vZGUsXG4gIERyYXdDaXJjbGVCeURpYW1ldGVyTW9kZSxcbiAgRHJhd0VsbGlwc2VCeUJvdW5kaW5nQm94TW9kZSxcbiAgRHJhd1JlY3RhbmdsZVVzaW5nVGhyZWVQb2ludHNNb2RlLFxuICBEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNNb2RlLFxuICBEcmF3OTBEZWdyZWVQb2x5Z29uTW9kZSxcbiAgRHJhd1BvbHlnb25CeURyYWdnaW5nTW9kZSxcbiAgU25hcHBhYmxlTW9kZSxcbiAgVHJhbnNmb3JtTW9kZSxcbiAgRWRpdEFjdGlvbixcbiAgQ2xpY2tFdmVudCxcbiAgU3RhcnREcmFnZ2luZ0V2ZW50LFxuICBTdG9wRHJhZ2dpbmdFdmVudCxcbiAgRHJhZ2dpbmdFdmVudCxcbiAgUG9pbnRlck1vdmVFdmVudCxcbiAgR2VvSnNvbkVkaXRNb2RlVHlwZSxcbiAgR2VvSnNvbkVkaXRNb2RlQ29uc3RydWN0b3IsXG4gIEZlYXR1cmVDb2xsZWN0aW9uLFxufSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuXG5pbXBvcnQgRWRpdGFibGVMYXllciBmcm9tICcuL2VkaXRhYmxlLWxheWVyJztcblxuY29uc3QgREVGQVVMVF9MSU5FX0NPTE9SID0gWzB4MCwgMHgwLCAweDAsIDB4OTldO1xuY29uc3QgREVGQVVMVF9GSUxMX0NPTE9SID0gWzB4MCwgMHgwLCAweDAsIDB4OTBdO1xuY29uc3QgREVGQVVMVF9TRUxFQ1RFRF9MSU5FX0NPTE9SID0gWzB4MCwgMHgwLCAweDAsIDB4ZmZdO1xuY29uc3QgREVGQVVMVF9TRUxFQ1RFRF9GSUxMX0NPTE9SID0gWzB4MCwgMHgwLCAweDkwLCAweDkwXTtcbmNvbnN0IERFRkFVTFRfVEVOVEFUSVZFX0xJTkVfQ09MT1IgPSBbMHg5MCwgMHg5MCwgMHg5MCwgMHhmZl07XG5jb25zdCBERUZBVUxUX1RFTlRBVElWRV9GSUxMX0NPTE9SID0gWzB4OTAsIDB4OTAsIDB4OTAsIDB4OTBdO1xuY29uc3QgREVGQVVMVF9FRElUSU5HX0VYSVNUSU5HX1BPSU5UX0NPTE9SID0gWzB4YzAsIDB4MCwgMHgwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfQ09MT1IgPSBbMHgwLCAweDAsIDB4MCwgMHg4MF07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9DT0xPUiA9IFsweDdjLCAweDAwLCAweGMwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19QT0lOVF9PVVRMSU5FX0NPTE9SID0gWzB4ZmYsIDB4ZmYsIDB4ZmYsIDB4ZmZdO1xuY29uc3QgREVGQVVMVF9FRElUSU5HX0VYSVNUSU5HX1BPSU5UX1JBRElVUyA9IDU7XG5jb25zdCBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX1JBRElVUyA9IDM7XG5jb25zdCBERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9SQURJVVMgPSA3O1xuXG5jb25zdCBERUZBVUxUX0VESVRfTU9ERSA9IERyYXdQb2x5Z29uTW9kZTtcblxuZnVuY3Rpb24gZ3VpZGVBY2Nlc3NvcihhY2Nlc3Nvcikge1xuICBpZiAoIWFjY2Vzc29yIHx8IHR5cGVvZiBhY2Nlc3NvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBhY2Nlc3NvcjtcbiAgfVxuICByZXR1cm4gKGd1aWRlTWF5YmVXcmFwcGVkKSA9PiBhY2Nlc3Nvcih1bndyYXBHdWlkZShndWlkZU1heWJlV3JhcHBlZCkpO1xufVxuXG4vLyBUaGUgb2JqZWN0IGhhbmRlZCB0byB1cyBmcm9tIGRlY2suZ2wgaXMgZGlmZmVyZW50IGRlcGVuZGluZyBvbiB0aGUgdmVyc2lvbiBvZiBkZWNrLmdsIHVzZWQsIHVud3JhcCBhcyBuZWNlc3NhcnlcbmZ1bmN0aW9uIHVud3JhcEd1aWRlKGd1aWRlTWF5YmVXcmFwcGVkKSB7XG4gIGlmIChndWlkZU1heWJlV3JhcHBlZC5fX3NvdXJjZSkge1xuICAgIHJldHVybiBndWlkZU1heWJlV3JhcHBlZC5fX3NvdXJjZS5vYmplY3Q7XG4gIH0gZWxzZSBpZiAoZ3VpZGVNYXliZVdyYXBwZWQuc291cmNlRmVhdHVyZSkge1xuICAgIHJldHVybiBndWlkZU1heWJlV3JhcHBlZC5zb3VyY2VGZWF0dXJlLmZlYXR1cmU7XG4gIH1cbiAgLy8gSXQgaXMgbm90IHdyYXBwZWQsIHJldHVybiBhcyBpc1xuICByZXR1cm4gZ3VpZGVNYXliZVdyYXBwZWQ7XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRIYW5kbGVDb2xvcihoYW5kbGUpIHtcbiAgc3dpdGNoIChoYW5kbGUucHJvcGVydGllcy5lZGl0SGFuZGxlVHlwZSkge1xuICAgIGNhc2UgJ2V4aXN0aW5nJzpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfQ09MT1I7XG4gICAgY2FzZSAnc25hcC1zb3VyY2UnOlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19TTkFQX1BPSU5UX0NPTE9SO1xuICAgIGNhc2UgJ2ludGVybWVkaWF0ZSc6XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX0NPTE9SO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRIYW5kbGVPdXRsaW5lQ29sb3IoaGFuZGxlKSB7XG4gIHJldHVybiBERUZBVUxUX0VESVRJTkdfUE9JTlRfT1VUTElORV9DT0xPUjtcbn1cblxuZnVuY3Rpb24gZ2V0RWRpdEhhbmRsZVJhZGl1cyhoYW5kbGUpIHtcbiAgc3dpdGNoIChoYW5kbGUucHJvcGVydGllcy5lZGl0SGFuZGxlVHlwZSkge1xuICAgIGNhc2UgJ2V4aXN0aW5nJzpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfRVhJU1RJTkdfUE9JTlRfUkFESVVTO1xuICAgIGNhc2UgJ3NuYXAnOlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19TTkFQX1BPSU5UX1JBRElVUztcbiAgICBjYXNlICdpbnRlcm1lZGlhdGUnOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX0lOVEVSTUVESUFURV9QT0lOVF9SQURJVVM7XG4gIH1cbn1cblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBtb2RlOiBERUZBVUxUX0VESVRfTU9ERSxcblxuICAvLyBFZGl0IGFuZCBpbnRlcmFjdGlvbiBldmVudHNcbiAgb25FZGl0OiAoKSA9PiB7fSxcblxuICBwaWNrYWJsZTogdHJ1ZSxcbiAgcGlja2luZ1JhZGl1czogMTAsXG4gIHBpY2tpbmdEZXB0aDogNSxcbiAgZnA2NDogZmFsc2UsXG4gIGZpbGxlZDogdHJ1ZSxcbiAgc3Ryb2tlZDogdHJ1ZSxcbiAgbGluZVdpZHRoU2NhbGU6IDEsXG4gIGxpbmVXaWR0aE1pblBpeGVsczogMSxcbiAgbGluZVdpZHRoTWF4UGl4ZWxzOiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUixcbiAgbGluZVdpZHRoVW5pdHM6ICdwaXhlbHMnLFxuICBsaW5lSm9pbnRSb3VuZGVkOiBmYWxzZSxcbiAgbGluZU1pdGVyTGltaXQ6IDQsXG4gIHBvaW50UmFkaXVzU2NhbGU6IDEsXG4gIHBvaW50UmFkaXVzTWluUGl4ZWxzOiAyLFxuICBwb2ludFJhZGl1c01heFBpeGVsczogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gIGdldExpbmVDb2xvcjogKGZlYXR1cmUsIGlzU2VsZWN0ZWQsIG1vZGUpID0+XG4gICAgaXNTZWxlY3RlZCA/IERFRkFVTFRfU0VMRUNURURfTElORV9DT0xPUiA6IERFRkFVTFRfTElORV9DT0xPUixcbiAgZ2V0RmlsbENvbG9yOiAoZmVhdHVyZSwgaXNTZWxlY3RlZCwgbW9kZSkgPT5cbiAgICBpc1NlbGVjdGVkID8gREVGQVVMVF9TRUxFQ1RFRF9GSUxMX0NPTE9SIDogREVGQVVMVF9GSUxMX0NPTE9SLFxuICBnZXRSYWRpdXM6IChmKSA9PlxuICAgIChmICYmIGYucHJvcGVydGllcyAmJiBmLnByb3BlcnRpZXMucmFkaXVzKSB8fCAoZiAmJiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLnNpemUpIHx8IDEsXG4gIGdldExpbmVXaWR0aDogKGYpID0+IChmICYmIGYucHJvcGVydGllcyAmJiBmLnByb3BlcnRpZXMubGluZVdpZHRoKSB8fCAzLFxuXG4gIC8vIFRlbnRhdGl2ZSBmZWF0dXJlIHJlbmRlcmluZ1xuICBnZXRUZW50YXRpdmVMaW5lQ29sb3I6IChmKSA9PiBERUZBVUxUX1RFTlRBVElWRV9MSU5FX0NPTE9SLFxuICBnZXRUZW50YXRpdmVGaWxsQ29sb3I6IChmKSA9PiBERUZBVUxUX1RFTlRBVElWRV9GSUxMX0NPTE9SLFxuICBnZXRUZW50YXRpdmVMaW5lV2lkdGg6IChmKSA9PiAoZiAmJiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLmxpbmVXaWR0aCkgfHwgMyxcblxuICBlZGl0SGFuZGxlVHlwZTogJ3BvaW50JyxcblxuICAvLyBwb2ludCBoYW5kbGVzXG4gIGVkaXRIYW5kbGVQb2ludFJhZGl1c1NjYWxlOiAxLFxuICBlZGl0SGFuZGxlUG9pbnRPdXRsaW5lOiB0cnVlLFxuICBlZGl0SGFuZGxlUG9pbnRTdHJva2VXaWR0aDogMixcbiAgZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzOiA0LFxuICBlZGl0SGFuZGxlUG9pbnRSYWRpdXNNYXhQaXhlbHM6IDgsXG4gIGdldEVkaXRIYW5kbGVQb2ludENvbG9yOiBnZXRFZGl0SGFuZGxlQ29sb3IsXG4gIGdldEVkaXRIYW5kbGVQb2ludE91dGxpbmVDb2xvcjogZ2V0RWRpdEhhbmRsZU91dGxpbmVDb2xvcixcbiAgZ2V0RWRpdEhhbmRsZVBvaW50UmFkaXVzOiBnZXRFZGl0SGFuZGxlUmFkaXVzLFxuXG4gIC8vIGljb24gaGFuZGxlc1xuICBlZGl0SGFuZGxlSWNvbkF0bGFzOiBudWxsLFxuICBlZGl0SGFuZGxlSWNvbk1hcHBpbmc6IG51bGwsXG4gIGVkaXRIYW5kbGVJY29uU2l6ZVNjYWxlOiAxLFxuICBnZXRFZGl0SGFuZGxlSWNvbjogKGhhbmRsZSkgPT4gaGFuZGxlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUsXG4gIGdldEVkaXRIYW5kbGVJY29uU2l6ZTogMTAsXG4gIGdldEVkaXRIYW5kbGVJY29uQ29sb3I6IGdldEVkaXRIYW5kbGVDb2xvcixcbiAgZ2V0RWRpdEhhbmRsZUljb25BbmdsZTogMCxcblxuICAvLyBtaXNjXG4gIGJpbGxib2FyZDogdHJ1ZSxcbn07XG5cbi8vIE1hcHBpbmcgb2YgbW9kZSBuYW1lIHRvIG1vZGUgY2xhc3MgKGZvciBsZWdhY3kgcHVycG9zZXMpXG5jb25zdCBtb2RlTmFtZU1hcHBpbmcgPSB7XG4gIHZpZXc6IFZpZXdNb2RlLFxuXG4gIC8vIEFsdGVyIG1vZGVzXG4gIG1vZGlmeTogTW9kaWZ5TW9kZSxcbiAgdHJhbnNsYXRlOiBuZXcgU25hcHBhYmxlTW9kZShuZXcgVHJhbnNsYXRlTW9kZSgpKSxcblxuICB0cmFuc2Zvcm06IG5ldyBTbmFwcGFibGVNb2RlKG5ldyBUcmFuc2Zvcm1Nb2RlKCkpLFxuICBzY2FsZTogU2NhbGVNb2RlLFxuICByb3RhdGU6IFJvdGF0ZU1vZGUsXG4gIGR1cGxpY2F0ZTogRHVwbGljYXRlTW9kZSxcbiAgc3BsaXQ6IFNwbGl0UG9seWdvbk1vZGUsXG4gIGV4dHJ1ZGU6IEV4dHJ1ZGVNb2RlLFxuICBlbGV2YXRpb246IEVsZXZhdGlvbk1vZGUsXG5cbiAgLy8gRHJhdyBtb2Rlc1xuICBkcmF3UG9pbnQ6IERyYXdQb2ludE1vZGUsXG4gIGRyYXdMaW5lU3RyaW5nOiBEcmF3TGluZVN0cmluZ01vZGUsXG4gIGRyYXdQb2x5Z29uOiBEcmF3UG9seWdvbk1vZGUsXG4gIGRyYXdSZWN0YW5nbGU6IERyYXdSZWN0YW5nbGVNb2RlLFxuICBkcmF3U3F1YXJlRnJvbUNlbnRlcjogRHJhd1NxdWFyZUZyb21DZW50ZXJNb2RlLFxuICBkcmF3Q2lyY2xlRnJvbUNlbnRlcjogRHJhd0NpcmNsZUZyb21DZW50ZXJNb2RlLFxuICBkcmF3Q2lyY2xlQnlCb3VuZGluZ0JveDogRHJhd0NpcmNsZUJ5RGlhbWV0ZXJNb2RlLFxuICBkcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3g6IERyYXdFbGxpcHNlQnlCb3VuZGluZ0JveE1vZGUsXG4gIGRyYXdSZWN0YW5nbGVVc2luZzNQb2ludHM6IERyYXdSZWN0YW5nbGVVc2luZ1RocmVlUG9pbnRzTW9kZSxcbiAgZHJhd0VsbGlwc2VVc2luZzNQb2ludHM6IERyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c01vZGUsXG4gIGRyYXc5MERlZ3JlZVBvbHlnb246IERyYXc5MERlZ3JlZVBvbHlnb25Nb2RlLFxuICBkcmF3UG9seWdvbkJ5RHJhZ2dpbmc6IERyYXdQb2x5Z29uQnlEcmFnZ2luZ01vZGUsXG59O1xuXG50eXBlIFByb3BzID0ge1xuICBtb2RlOiBzdHJpbmcgfCBHZW9Kc29uRWRpdE1vZGVDb25zdHJ1Y3RvciB8IEdlb0pzb25FZGl0TW9kZVR5cGU7XG4gIG9uRWRpdDogKGFyZzA6IEVkaXRBY3Rpb248RmVhdHVyZUNvbGxlY3Rpb24+KSA9PiB2b2lkO1xuICAvLyBUT0RPOiB0eXBlIHRoZSByZXN0XG5cbiAgW2tleTogc3RyaW5nXTogYW55O1xufTtcblxuLy8gdHlwZSBTdGF0ZSA9IHtcbi8vICAgbW9kZTogR2VvSnNvbkVkaXRNb2RlLFxuLy8gICB0ZW50YXRpdmVGZWF0dXJlOiA/RmVhdHVyZSxcbi8vICAgZWRpdEhhbmRsZXM6IGFueVtdLFxuLy8gICBzZWxlY3RlZEZlYXR1cmVzOiBGZWF0dXJlW11cbi8vIH07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRhYmxlR2VvSnNvbkxheWVyIGV4dGVuZHMgRWRpdGFibGVMYXllciB7XG4gIHN0YXRpYyBsYXllck5hbWUgPSAnRWRpdGFibGVHZW9Kc29uTGF5ZXInO1xuICBzdGF0aWMgZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuICAvLyBwcm9wczogUHJvcHM7XG5cbiAgLy8gc2V0U3RhdGU6ICgkU2hhcGU8U3RhdGU+KSA9PiB2b2lkO1xuICByZW5kZXJMYXllcnMoKSB7XG4gICAgY29uc3Qgc3ViTGF5ZXJQcm9wcyA9IHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyh7XG4gICAgICBpZDogJ2dlb2pzb24nLFxuXG4gICAgICAvLyBQcm94eSBtb3N0IEdlb0pzb25MYXllciBwcm9wcyBhcy1pc1xuICAgICAgZGF0YTogdGhpcy5wcm9wcy5kYXRhLFxuICAgICAgZnA2NDogdGhpcy5wcm9wcy5mcDY0LFxuICAgICAgZmlsbGVkOiB0aGlzLnByb3BzLmZpbGxlZCxcbiAgICAgIHN0cm9rZWQ6IHRoaXMucHJvcHMuc3Ryb2tlZCxcbiAgICAgIGxpbmVXaWR0aFNjYWxlOiB0aGlzLnByb3BzLmxpbmVXaWR0aFNjYWxlLFxuICAgICAgbGluZVdpZHRoTWluUGl4ZWxzOiB0aGlzLnByb3BzLmxpbmVXaWR0aE1pblBpeGVscyxcbiAgICAgIGxpbmVXaWR0aE1heFBpeGVsczogdGhpcy5wcm9wcy5saW5lV2lkdGhNYXhQaXhlbHMsXG4gICAgICBsaW5lV2lkdGhVbml0czogdGhpcy5wcm9wcy5saW5lV2lkdGhVbml0cyxcbiAgICAgIGxpbmVKb2ludFJvdW5kZWQ6IHRoaXMucHJvcHMubGluZUpvaW50Um91bmRlZCxcbiAgICAgIGxpbmVNaXRlckxpbWl0OiB0aGlzLnByb3BzLmxpbmVNaXRlckxpbWl0LFxuICAgICAgcG9pbnRSYWRpdXNTY2FsZTogdGhpcy5wcm9wcy5wb2ludFJhZGl1c1NjYWxlLFxuICAgICAgcG9pbnRSYWRpdXNNaW5QaXhlbHM6IHRoaXMucHJvcHMucG9pbnRSYWRpdXNNaW5QaXhlbHMsXG4gICAgICBwb2ludFJhZGl1c01heFBpeGVsczogdGhpcy5wcm9wcy5wb2ludFJhZGl1c01heFBpeGVscyxcbiAgICAgIGdldExpbmVDb2xvcjogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0TGluZUNvbG9yKSxcbiAgICAgIGdldEZpbGxDb2xvcjogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0RmlsbENvbG9yKSxcbiAgICAgIGdldFJhZGl1czogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0UmFkaXVzKSxcbiAgICAgIGdldExpbmVXaWR0aDogdGhpcy5zZWxlY3Rpb25Bd2FyZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0TGluZVdpZHRoKSxcblxuICAgICAgX3N1YkxheWVyUHJvcHM6IHtcbiAgICAgICAgJ2xpbmUtc3RyaW5ncyc6IHtcbiAgICAgICAgICBiaWxsYm9hcmQ6IHRoaXMucHJvcHMuYmlsbGJvYXJkLFxuICAgICAgICB9LFxuICAgICAgICAncG9seWdvbnMtc3Ryb2tlJzoge1xuICAgICAgICAgIGJpbGxib2FyZDogdGhpcy5wcm9wcy5iaWxsYm9hcmQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuXG4gICAgICB1cGRhdGVUcmlnZ2Vyczoge1xuICAgICAgICBnZXRMaW5lQ29sb3I6IFt0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMsIHRoaXMucHJvcHMubW9kZV0sXG4gICAgICAgIGdldEZpbGxDb2xvcjogW3RoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcywgdGhpcy5wcm9wcy5tb2RlXSxcbiAgICAgICAgZ2V0UmFkaXVzOiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdLFxuICAgICAgICBnZXRMaW5lV2lkdGg6IFt0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMsIHRoaXMucHJvcHMubW9kZV0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IGxheWVyczogYW55ID0gW25ldyBHZW9Kc29uTGF5ZXIoc3ViTGF5ZXJQcm9wcyldO1xuXG4gICAgbGF5ZXJzID0gbGF5ZXJzLmNvbmNhdCh0aGlzLmNyZWF0ZUd1aWRlc0xheWVycygpLCB0aGlzLmNyZWF0ZVRvb2x0aXBzTGF5ZXJzKCkpO1xuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplU3RhdGUoKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRGZWF0dXJlczogW10sXG4gICAgICBlZGl0SGFuZGxlczogW10sXG4gICAgfSk7XG4gIH1cblxuICAvLyBUT0RPOiBpcyB0aGlzIHRoZSBiZXN0IHdheSB0byBwcm9wZXJseSB1cGRhdGUgc3RhdGUgZnJvbSBhbiBvdXRzaWRlIGV2ZW50IGhhbmRsZXI/XG4gIHNob3VsZFVwZGF0ZVN0YXRlKG9wdHM6IGFueSkge1xuICAgIC8vIGNvbnNvbGUubG9nKFxuICAgIC8vICAgJ3Nob3VsZFVwZGF0ZVN0YXRlJyxcbiAgICAvLyAgIG9wdHMuY2hhbmdlRmxhZ3MucHJvcHNPckRhdGFDaGFuZ2VkLFxuICAgIC8vICAgb3B0cy5jaGFuZ2VGbGFncy5zdGF0ZUNoYW5nZWRcbiAgICAvLyApO1xuICAgIHJldHVybiBzdXBlci5zaG91bGRVcGRhdGVTdGF0ZShvcHRzKSB8fCBvcHRzLmNoYW5nZUZsYWdzLnN0YXRlQ2hhbmdlZDtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKHtcbiAgICBwcm9wcyxcbiAgICBvbGRQcm9wcyxcbiAgICBjaGFuZ2VGbGFncyxcbiAgfToge1xuICAgIHByb3BzOiBQcm9wcztcbiAgICBvbGRQcm9wczogUHJvcHM7XG4gICAgY2hhbmdlRmxhZ3M6IGFueTtcbiAgfSkge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBzdXBlci51cGRhdGVTdGF0ZSh7IG9sZFByb3BzLCBwcm9wcywgY2hhbmdlRmxhZ3MgfSk7XG5cbiAgICBpZiAoY2hhbmdlRmxhZ3MucHJvcHNPckRhdGFDaGFuZ2VkKSB7XG4gICAgICBjb25zdCBtb2RlUHJvcENoYW5nZWQgPSBPYmplY3Qua2V5cyhvbGRQcm9wcykubGVuZ3RoID09PSAwIHx8IHByb3BzLm1vZGUgIT09IG9sZFByb3BzLm1vZGU7XG4gICAgICBpZiAobW9kZVByb3BDaGFuZ2VkKSB7XG4gICAgICAgIGxldCBtb2RlO1xuICAgICAgICBpZiAodHlwZW9mIHByb3BzLm1vZGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAvLyBUaGV5IHBhc3NlZCBhIGNvbnN0cnVjdG9yL2NsYXNzLCBzbyBuZXcgaXQgdXBcbiAgICAgICAgICBjb25zdCBNb2RlQ29uc3RydWN0b3IgPSBwcm9wcy5tb2RlO1xuICAgICAgICAgIG1vZGUgPSBuZXcgTW9kZUNvbnN0cnVjdG9yKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHByb3BzLm1vZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgLy8gTG9va3VwIHRoZSBtb2RlIGJhc2VkIG9uIGl0cyBuYW1lIChmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkpXG4gICAgICAgICAgbW9kZSA9IG1vZGVOYW1lTWFwcGluZ1twcm9wcy5tb2RlXTtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIFwiRGVwcmVjYXRlZCB1c2Ugb2YgcGFzc2luZyBgbW9kZWAgYXMgYSBzdHJpbmcuIFBhc3MgdGhlIG1vZGUncyBjbGFzcyBjb25zdHJ1Y3RvciBpbnN0ZWFkLlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBTaG91bGQgYmUgYW4gaW5zdGFuY2Ugb2YgRWRpdE1vZGUgaW4gdGhpcyBjYXNlXG4gICAgICAgICAgbW9kZSA9IHByb3BzLm1vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIW1vZGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oYE5vIG1vZGUgY29uZmlndXJlZCBmb3IgJHtTdHJpbmcocHJvcHMubW9kZSl9YCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZSxuby11bmRlZlxuICAgICAgICAgIC8vIFVzZSBkZWZhdWx0IG1vZGVcbiAgICAgICAgICBtb2RlID0gbmV3IERFRkFVTFRfRURJVF9NT0RFKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kZSAhPT0gdGhpcy5zdGF0ZS5tb2RlKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IG1vZGUsIGN1cnNvcjogbnVsbCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBzZWxlY3RlZEZlYXR1cmVzID0gW107XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcykpIHtcbiAgICAgIC8vIFRPRE86IG5lZWRzIGltcHJvdmVkIHRlc3RpbmcsIGkuZS4gY2hlY2tpbmcgZm9yIGR1cGxpY2F0ZXMsIE5hTnMsIG91dCBvZiByYW5nZSBudW1iZXJzLCAuLi5cbiAgICAgIHNlbGVjdGVkRmVhdHVyZXMgPSBwcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLm1hcCgoZWxlbSkgPT4gcHJvcHMuZGF0YS5mZWF0dXJlc1tlbGVtXSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkRmVhdHVyZXMgfSk7XG4gIH1cblxuICBnZXRNb2RlUHJvcHMocHJvcHM6IFByb3BzKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGVDb25maWc6IHByb3BzLm1vZGVDb25maWcsXG4gICAgICBkYXRhOiBwcm9wcy5kYXRhLFxuICAgICAgc2VsZWN0ZWRJbmRleGVzOiBwcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLFxuICAgICAgbGFzdFBvaW50ZXJNb3ZlRXZlbnQ6IHRoaXMuc3RhdGUubGFzdFBvaW50ZXJNb3ZlRXZlbnQsXG4gICAgICBjdXJzb3I6IHRoaXMuc3RhdGUuY3Vyc29yLFxuICAgICAgb25FZGl0OiAoZWRpdEFjdGlvbjogRWRpdEFjdGlvbjxGZWF0dXJlQ29sbGVjdGlvbj4pID0+IHtcbiAgICAgICAgLy8gRm9yY2UgYSByZS1yZW5kZXJcbiAgICAgICAgLy8gVGhpcyBzdXBwb3J0cyBkb3VibGUtY2xpY2sgd2hlcmUgd2UgbmVlZCB0byBlbnN1cmUgdGhhdCB0aGVyZSdzIGEgcmUtcmVuZGVyIGJldHdlZW4gdGhlIHR3byBjbGlja3NcbiAgICAgICAgLy8gZXZlbiB0aG91Z2ggdGhlIGRhdGEgd2Fzbid0IGNoYW5nZWQsIGp1c3QgdGhlIGludGVybmFsIHRlbnRhdGl2ZSBmZWF0dXJlLlxuICAgICAgICB0aGlzLnNldE5lZWRzVXBkYXRlKCk7XG4gICAgICAgIHByb3BzLm9uRWRpdChlZGl0QWN0aW9uKTtcbiAgICAgIH0sXG4gICAgICBvblVwZGF0ZUN1cnNvcjogKGN1cnNvcjogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCkgPT4ge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgY3Vyc29yIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgc2VsZWN0aW9uQXdhcmVBY2Nlc3NvcihhY2Nlc3NvcjogYW55KSB7XG4gICAgaWYgKHR5cGVvZiBhY2Nlc3NvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGFjY2Vzc29yO1xuICAgIH1cbiAgICByZXR1cm4gKGZlYXR1cmU6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+XG4gICAgICBhY2Nlc3NvcihmZWF0dXJlLCB0aGlzLmlzRmVhdHVyZVNlbGVjdGVkKGZlYXR1cmUpLCB0aGlzLnByb3BzLm1vZGUpO1xuICB9XG5cbiAgaXNGZWF0dXJlU2VsZWN0ZWQoZmVhdHVyZTogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIGlmICghdGhpcy5wcm9wcy5kYXRhIHx8ICF0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGZlYXR1cmVJbmRleCA9IHRoaXMucHJvcHMuZGF0YS5mZWF0dXJlcy5pbmRleE9mKGZlYXR1cmUpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMuaW5jbHVkZXMoZmVhdHVyZUluZGV4KTtcbiAgfVxuXG4gIGdldFBpY2tpbmdJbmZvKHsgaW5mbywgc291cmNlTGF5ZXIgfTogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICAgIGlmIChzb3VyY2VMYXllci5pZC5lbmRzV2l0aCgnZ3VpZGVzJykpIHtcbiAgICAgIC8vIElmIHVzZXIgaXMgcGlja2luZyBhbiBlZGl0aW5nIGhhbmRsZSwgYWRkIGFkZGl0aW9uYWwgZGF0YSB0byB0aGUgaW5mb1xuICAgICAgaW5mby5pc0d1aWRlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaW5mbztcbiAgfVxuXG4gIGNyZWF0ZUd1aWRlc0xheWVycygpIHtcbiAgICBjb25zdCBtb2RlID0gdGhpcy5nZXRBY3RpdmVNb2RlKCk7XG4gICAgY29uc3QgZ3VpZGVzOiBGZWF0dXJlQ29sbGVjdGlvbiA9IG1vZGUuZ2V0R3VpZGVzKHRoaXMuZ2V0TW9kZVByb3BzKHRoaXMucHJvcHMpKTtcblxuICAgIGlmICghZ3VpZGVzIHx8ICFndWlkZXMuZmVhdHVyZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgbGV0IHBvaW50TGF5ZXJQcm9wcztcbiAgICBpZiAodGhpcy5wcm9wcy5lZGl0SGFuZGxlVHlwZSA9PT0gJ2ljb24nKSB7XG4gICAgICBwb2ludExheWVyUHJvcHMgPSB7XG4gICAgICAgIHR5cGU6IEljb25MYXllcixcbiAgICAgICAgaWNvbkF0bGFzOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVJY29uQXRsYXMsXG4gICAgICAgIGljb25NYXBwaW5nOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVJY29uTWFwcGluZyxcbiAgICAgICAgc2l6ZVNjYWxlOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVJY29uU2l6ZVNjYWxlLFxuICAgICAgICBnZXRJY29uOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZUljb24pLFxuICAgICAgICBnZXRTaXplOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZUljb25TaXplKSxcbiAgICAgICAgZ2V0Q29sb3I6IGd1aWRlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlSWNvbkNvbG9yKSxcbiAgICAgICAgZ2V0QW5nbGU6IGd1aWRlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlSWNvbkFuZ2xlKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvaW50TGF5ZXJQcm9wcyA9IHtcbiAgICAgICAgdHlwZTogU2NhdHRlcnBsb3RMYXllcixcbiAgICAgICAgcmFkaXVzU2NhbGU6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzU2NhbGUsXG4gICAgICAgIHN0cm9rZWQ6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50T3V0bGluZSxcbiAgICAgICAgZ2V0TGluZVdpZHRoOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFN0cm9rZVdpZHRoLFxuICAgICAgICByYWRpdXNNaW5QaXhlbHM6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzLFxuICAgICAgICByYWRpdXNNYXhQaXhlbHM6IHRoaXMucHJvcHMuZWRpdEhhbmRsZVBvaW50UmFkaXVzTWF4UGl4ZWxzLFxuICAgICAgICBnZXRSYWRpdXM6IGd1aWRlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlUG9pbnRSYWRpdXMpLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IGd1aWRlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlUG9pbnRDb2xvciksXG4gICAgICAgIGdldExpbmVDb2xvcjogZ3VpZGVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldEVkaXRIYW5kbGVQb2ludE91dGxpbmVDb2xvciksXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IGxheWVyID0gbmV3IEdlb0pzb25MYXllcihcbiAgICAgIHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyh7XG4gICAgICAgIGlkOiBgZ3VpZGVzYCxcbiAgICAgICAgZGF0YTogZ3VpZGVzLFxuICAgICAgICBmcDY0OiB0aGlzLnByb3BzLmZwNjQsXG4gICAgICAgIF9zdWJMYXllclByb3BzOiB7XG4gICAgICAgICAgcG9pbnRzOiBwb2ludExheWVyUHJvcHMsXG4gICAgICAgIH0sXG4gICAgICAgIGxpbmVXaWR0aFNjYWxlOiB0aGlzLnByb3BzLmxpbmVXaWR0aFNjYWxlLFxuICAgICAgICBsaW5lV2lkdGhNaW5QaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWluUGl4ZWxzLFxuICAgICAgICBsaW5lV2lkdGhNYXhQaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWF4UGl4ZWxzLFxuICAgICAgICBsaW5lV2lkdGhVbml0czogdGhpcy5wcm9wcy5saW5lV2lkdGhVbml0cyxcbiAgICAgICAgbGluZUpvaW50Um91bmRlZDogdGhpcy5wcm9wcy5saW5lSm9pbnRSb3VuZGVkLFxuICAgICAgICBsaW5lTWl0ZXJMaW1pdDogdGhpcy5wcm9wcy5saW5lTWl0ZXJMaW1pdCxcbiAgICAgICAgZ2V0TGluZUNvbG9yOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0VGVudGF0aXZlTGluZUNvbG9yKSxcbiAgICAgICAgZ2V0TGluZVdpZHRoOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0VGVudGF0aXZlTGluZVdpZHRoKSxcbiAgICAgICAgZ2V0RmlsbENvbG9yOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0VGVudGF0aXZlRmlsbENvbG9yKSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHJldHVybiBbbGF5ZXJdO1xuICB9XG5cbiAgY3JlYXRlVG9vbHRpcHNMYXllcnMoKSB7XG4gICAgY29uc3QgbW9kZSA9IHRoaXMuZ2V0QWN0aXZlTW9kZSgpO1xuICAgIGNvbnN0IHRvb2x0aXBzID0gbW9kZS5nZXRUb29sdGlwcyh0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG5cbiAgICBjb25zdCBsYXllciA9IG5ldyBUZXh0TGF5ZXIoXG4gICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICBpZDogYHRvb2x0aXBzYCxcbiAgICAgICAgZGF0YTogdG9vbHRpcHMsXG4gICAgICB9KVxuICAgICk7XG5cbiAgICByZXR1cm4gW2xheWVyXTtcbiAgfVxuXG4gIG9uTGF5ZXJDbGljayhldmVudDogQ2xpY2tFdmVudCkge1xuICAgIHRoaXMuZ2V0QWN0aXZlTW9kZSgpLmhhbmRsZUNsaWNrKGV2ZW50LCB0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG4gIH1cblxuICBvbkxheWVyS2V5VXAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLmdldEFjdGl2ZU1vZGUoKS5oYW5kbGVLZXlVcChldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25TdGFydERyYWdnaW5nKGV2ZW50OiBTdGFydERyYWdnaW5nRXZlbnQpIHtcbiAgICB0aGlzLmdldEFjdGl2ZU1vZGUoKS5oYW5kbGVTdGFydERyYWdnaW5nKGV2ZW50LCB0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG4gIH1cblxuICBvbkRyYWdnaW5nKGV2ZW50OiBEcmFnZ2luZ0V2ZW50KSB7XG4gICAgdGhpcy5nZXRBY3RpdmVNb2RlKCkuaGFuZGxlRHJhZ2dpbmcoZXZlbnQsIHRoaXMuZ2V0TW9kZVByb3BzKHRoaXMucHJvcHMpKTtcbiAgfVxuXG4gIG9uU3RvcERyYWdnaW5nKGV2ZW50OiBTdG9wRHJhZ2dpbmdFdmVudCkge1xuICAgIHRoaXMuZ2V0QWN0aXZlTW9kZSgpLmhhbmRsZVN0b3BEcmFnZ2luZyhldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25Qb2ludGVyTW92ZShldmVudDogUG9pbnRlck1vdmVFdmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBsYXN0UG9pbnRlck1vdmVFdmVudDogZXZlbnQgfSk7XG4gICAgdGhpcy5nZXRBY3RpdmVNb2RlKCkuaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQsIHRoaXMuZ2V0TW9kZVByb3BzKHRoaXMucHJvcHMpKTtcbiAgfVxuXG4gIGdldEN1cnNvcih7IGlzRHJhZ2dpbmcgfTogeyBpc0RyYWdnaW5nOiBib29sZWFuIH0pIHtcbiAgICBsZXQgeyBjdXJzb3IgfSA9IHRoaXMuc3RhdGU7XG4gICAgaWYgKCFjdXJzb3IpIHtcbiAgICAgIC8vIGRlZmF1bHQgY3Vyc29yXG4gICAgICBjdXJzb3IgPSBpc0RyYWdnaW5nID8gJ2dyYWJiaW5nJyA6ICdncmFiJztcbiAgICB9XG4gICAgcmV0dXJuIGN1cnNvcjtcbiAgfVxuXG4gIGdldEFjdGl2ZU1vZGUoKTogR2VvSnNvbkVkaXRNb2RlVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUubW9kZTtcbiAgfVxufVxuIl19