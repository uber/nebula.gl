"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layers = require("@deck.gl/layers");

var _editModes = require("@nebula.gl/edit-modes");

var _editableLayer = _interopRequireDefault(require("./editable-layer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvZWRpdGFibGUtZ2VvanNvbi1sYXllci50cyJdLCJuYW1lcyI6WyJERUZBVUxUX0xJTkVfQ09MT1IiLCJERUZBVUxUX0ZJTExfQ09MT1IiLCJERUZBVUxUX1NFTEVDVEVEX0xJTkVfQ09MT1IiLCJERUZBVUxUX1NFTEVDVEVEX0ZJTExfQ09MT1IiLCJERUZBVUxUX1RFTlRBVElWRV9MSU5FX0NPTE9SIiwiREVGQVVMVF9URU5UQVRJVkVfRklMTF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfQ09MT1IiLCJERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9DT0xPUiIsIkRFRkFVTFRfRURJVElOR19QT0lOVF9PVVRMSU5FX0NPTE9SIiwiREVGQVVMVF9FRElUSU5HX0VYSVNUSU5HX1BPSU5UX1JBRElVUyIsIkRFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfUkFESVVTIiwiREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfUkFESVVTIiwiREVGQVVMVF9FRElUX01PREUiLCJEcmF3UG9seWdvbk1vZGUiLCJndWlkZUFjY2Vzc29yIiwiYWNjZXNzb3IiLCJndWlkZU1heWJlV3JhcHBlZCIsInVud3JhcEd1aWRlIiwiX19zb3VyY2UiLCJvYmplY3QiLCJzb3VyY2VGZWF0dXJlIiwiZmVhdHVyZSIsImdldEVkaXRIYW5kbGVDb2xvciIsImhhbmRsZSIsInByb3BlcnRpZXMiLCJlZGl0SGFuZGxlVHlwZSIsImdldEVkaXRIYW5kbGVPdXRsaW5lQ29sb3IiLCJnZXRFZGl0SGFuZGxlUmFkaXVzIiwiZGVmYXVsdFByb3BzIiwibW9kZSIsIm9uRWRpdCIsInBpY2thYmxlIiwicGlja2luZ1JhZGl1cyIsInBpY2tpbmdEZXB0aCIsImZwNjQiLCJmaWxsZWQiLCJzdHJva2VkIiwibGluZVdpZHRoU2NhbGUiLCJsaW5lV2lkdGhNaW5QaXhlbHMiLCJsaW5lV2lkdGhNYXhQaXhlbHMiLCJOdW1iZXIiLCJNQVhfU0FGRV9JTlRFR0VSIiwibGluZVdpZHRoVW5pdHMiLCJsaW5lSm9pbnRSb3VuZGVkIiwibGluZU1pdGVyTGltaXQiLCJwb2ludFJhZGl1c1NjYWxlIiwicG9pbnRSYWRpdXNNaW5QaXhlbHMiLCJwb2ludFJhZGl1c01heFBpeGVscyIsImdldExpbmVDb2xvciIsImlzU2VsZWN0ZWQiLCJnZXRGaWxsQ29sb3IiLCJnZXRSYWRpdXMiLCJmIiwicmFkaXVzIiwic2l6ZSIsImdldExpbmVXaWR0aCIsImxpbmVXaWR0aCIsImdldFRlbnRhdGl2ZUxpbmVDb2xvciIsImdldFRlbnRhdGl2ZUZpbGxDb2xvciIsImdldFRlbnRhdGl2ZUxpbmVXaWR0aCIsImVkaXRIYW5kbGVQb2ludFJhZGl1c1NjYWxlIiwiZWRpdEhhbmRsZVBvaW50T3V0bGluZSIsImVkaXRIYW5kbGVQb2ludFN0cm9rZVdpZHRoIiwiZWRpdEhhbmRsZVBvaW50UmFkaXVzTWluUGl4ZWxzIiwiZWRpdEhhbmRsZVBvaW50UmFkaXVzTWF4UGl4ZWxzIiwiZ2V0RWRpdEhhbmRsZVBvaW50Q29sb3IiLCJnZXRFZGl0SGFuZGxlUG9pbnRPdXRsaW5lQ29sb3IiLCJnZXRFZGl0SGFuZGxlUG9pbnRSYWRpdXMiLCJlZGl0SGFuZGxlSWNvbkF0bGFzIiwiZWRpdEhhbmRsZUljb25NYXBwaW5nIiwiZWRpdEhhbmRsZUljb25TaXplU2NhbGUiLCJnZXRFZGl0SGFuZGxlSWNvbiIsImdldEVkaXRIYW5kbGVJY29uU2l6ZSIsImdldEVkaXRIYW5kbGVJY29uQ29sb3IiLCJnZXRFZGl0SGFuZGxlSWNvbkFuZ2xlIiwiYmlsbGJvYXJkIiwibW9kZU5hbWVNYXBwaW5nIiwidmlldyIsIlZpZXdNb2RlIiwibW9kaWZ5IiwiTW9kaWZ5TW9kZSIsInRyYW5zbGF0ZSIsIlNuYXBwYWJsZU1vZGUiLCJUcmFuc2xhdGVNb2RlIiwidHJhbnNmb3JtIiwiVHJhbnNmb3JtTW9kZSIsInNjYWxlIiwiU2NhbGVNb2RlIiwicm90YXRlIiwiUm90YXRlTW9kZSIsImR1cGxpY2F0ZSIsIkR1cGxpY2F0ZU1vZGUiLCJzcGxpdCIsIlNwbGl0UG9seWdvbk1vZGUiLCJleHRydWRlIiwiRXh0cnVkZU1vZGUiLCJlbGV2YXRpb24iLCJFbGV2YXRpb25Nb2RlIiwiZHJhd1BvaW50IiwiRHJhd1BvaW50TW9kZSIsImRyYXdMaW5lU3RyaW5nIiwiRHJhd0xpbmVTdHJpbmdNb2RlIiwiZHJhd1BvbHlnb24iLCJkcmF3UmVjdGFuZ2xlIiwiRHJhd1JlY3RhbmdsZU1vZGUiLCJkcmF3Q2lyY2xlRnJvbUNlbnRlciIsIkRyYXdDaXJjbGVGcm9tQ2VudGVyTW9kZSIsImRyYXdDaXJjbGVCeUJvdW5kaW5nQm94IiwiRHJhd0NpcmNsZUJ5RGlhbWV0ZXJNb2RlIiwiZHJhd0VsbGlwc2VCeUJvdW5kaW5nQm94IiwiRHJhd0VsbGlwc2VCeUJvdW5kaW5nQm94TW9kZSIsImRyYXdSZWN0YW5nbGVVc2luZzNQb2ludHMiLCJEcmF3UmVjdGFuZ2xlVXNpbmdUaHJlZVBvaW50c01vZGUiLCJkcmF3RWxsaXBzZVVzaW5nM1BvaW50cyIsIkRyYXdFbGxpcHNlVXNpbmdUaHJlZVBvaW50c01vZGUiLCJkcmF3OTBEZWdyZWVQb2x5Z29uIiwiRHJhdzkwRGVncmVlUG9seWdvbk1vZGUiLCJkcmF3UG9seWdvbkJ5RHJhZ2dpbmciLCJEcmF3UG9seWdvbkJ5RHJhZ2dpbmdNb2RlIiwiRWRpdGFibGVHZW9Kc29uTGF5ZXIiLCJzdWJMYXllclByb3BzIiwiZ2V0U3ViTGF5ZXJQcm9wcyIsImlkIiwiZGF0YSIsInByb3BzIiwic2VsZWN0aW9uQXdhcmVBY2Nlc3NvciIsIl9zdWJMYXllclByb3BzIiwidXBkYXRlVHJpZ2dlcnMiLCJzZWxlY3RlZEZlYXR1cmVJbmRleGVzIiwibGF5ZXJzIiwiR2VvSnNvbkxheWVyIiwiY29uY2F0IiwiY3JlYXRlR3VpZGVzTGF5ZXJzIiwiY3JlYXRlVG9vbHRpcHNMYXllcnMiLCJzZXRTdGF0ZSIsInNlbGVjdGVkRmVhdHVyZXMiLCJlZGl0SGFuZGxlcyIsIm9wdHMiLCJjaGFuZ2VGbGFncyIsInN0YXRlQ2hhbmdlZCIsIm9sZFByb3BzIiwicHJvcHNPckRhdGFDaGFuZ2VkIiwibW9kZVByb3BDaGFuZ2VkIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsIk1vZGVDb25zdHJ1Y3RvciIsImNvbnNvbGUiLCJ3YXJuIiwiU3RyaW5nIiwic3RhdGUiLCJjdXJzb3IiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJlbGVtIiwiZmVhdHVyZXMiLCJtb2RlQ29uZmlnIiwic2VsZWN0ZWRJbmRleGVzIiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJlZGl0QWN0aW9uIiwic2V0TmVlZHNVcGRhdGUiLCJvblVwZGF0ZUN1cnNvciIsImlzRmVhdHVyZVNlbGVjdGVkIiwiZmVhdHVyZUluZGV4IiwiaW5kZXhPZiIsImluY2x1ZGVzIiwiaW5mbyIsInNvdXJjZUxheWVyIiwiZW5kc1dpdGgiLCJpc0d1aWRlIiwiZ2V0QWN0aXZlTW9kZSIsImd1aWRlcyIsImdldEd1aWRlcyIsImdldE1vZGVQcm9wcyIsInBvaW50TGF5ZXJQcm9wcyIsInR5cGUiLCJJY29uTGF5ZXIiLCJpY29uQXRsYXMiLCJpY29uTWFwcGluZyIsInNpemVTY2FsZSIsImdldEljb24iLCJnZXRTaXplIiwiZ2V0Q29sb3IiLCJnZXRBbmdsZSIsIlNjYXR0ZXJwbG90TGF5ZXIiLCJyYWRpdXNTY2FsZSIsInJhZGl1c01pblBpeGVscyIsInJhZGl1c01heFBpeGVscyIsImxheWVyIiwicG9pbnRzIiwidG9vbHRpcHMiLCJnZXRUb29sdGlwcyIsIlRleHRMYXllciIsImV2ZW50IiwiaGFuZGxlQ2xpY2siLCJoYW5kbGVLZXlVcCIsImhhbmRsZVN0YXJ0RHJhZ2dpbmciLCJoYW5kbGVEcmFnZ2luZyIsImhhbmRsZVN0b3BEcmFnZ2luZyIsImhhbmRsZVBvaW50ZXJNb3ZlIiwiaXNEcmFnZ2luZyIsIkVkaXRhYmxlTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFF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LE1BQU0sR0FBR2tELFVBQVUsR0FBRyxVQUFILEdBQWdCLE1BQW5DO0FBQ0Q7O0FBQ0QsYUFBT2xELE1BQVA7QUFDRDs7O29DQUVvQztBQUNuQyxhQUFPLEtBQUtELEtBQUwsQ0FBV3pILElBQWxCO0FBQ0Q7Ozs7RUF4UitDNksseUI7Ozs7Z0JBQTdCbkYsb0IsZUFDQSxzQjs7Z0JBREFBLG9CLGtCQUVHM0YsWSIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuXG5pbXBvcnQgeyBHZW9Kc29uTGF5ZXIsIFNjYXR0ZXJwbG90TGF5ZXIsIEljb25MYXllciwgVGV4dExheWVyIH0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcblxuaW1wb3J0IHtcbiAgVmlld01vZGUsXG4gIE1vZGlmeU1vZGUsXG4gIFRyYW5zbGF0ZU1vZGUsXG4gIFNjYWxlTW9kZSxcbiAgUm90YXRlTW9kZSxcbiAgRHVwbGljYXRlTW9kZSxcbiAgU3BsaXRQb2x5Z29uTW9kZSxcbiAgRXh0cnVkZU1vZGUsXG4gIEVsZXZhdGlvbk1vZGUsXG4gIERyYXdQb2ludE1vZGUsXG4gIERyYXdMaW5lU3RyaW5nTW9kZSxcbiAgRHJhd1BvbHlnb25Nb2RlLFxuICBEcmF3UmVjdGFuZ2xlTW9kZSxcbiAgRHJhd0NpcmNsZUZyb21DZW50ZXJNb2RlLFxuICBEcmF3Q2lyY2xlQnlEaWFtZXRlck1vZGUsXG4gIERyYXdFbGxpcHNlQnlCb3VuZGluZ0JveE1vZGUsXG4gIERyYXdSZWN0YW5nbGVVc2luZ1RocmVlUG9pbnRzTW9kZSxcbiAgRHJhd0VsbGlwc2VVc2luZ1RocmVlUG9pbnRzTW9kZSxcbiAgRHJhdzkwRGVncmVlUG9seWdvbk1vZGUsXG4gIERyYXdQb2x5Z29uQnlEcmFnZ2luZ01vZGUsXG4gIFNuYXBwYWJsZU1vZGUsXG4gIFRyYW5zZm9ybU1vZGUsXG4gIEVkaXRBY3Rpb24sXG4gIENsaWNrRXZlbnQsXG4gIFN0YXJ0RHJhZ2dpbmdFdmVudCxcbiAgU3RvcERyYWdnaW5nRXZlbnQsXG4gIERyYWdnaW5nRXZlbnQsXG4gIFBvaW50ZXJNb3ZlRXZlbnQsXG4gIEdlb0pzb25FZGl0TW9kZVR5cGUsXG4gIEdlb0pzb25FZGl0TW9kZUNvbnN0cnVjdG9yLFxuICBGZWF0dXJlQ29sbGVjdGlvbixcbn0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcblxuaW1wb3J0IEVkaXRhYmxlTGF5ZXIgZnJvbSAnLi9lZGl0YWJsZS1sYXllcic7XG5cbmNvbnN0IERFRkFVTFRfTElORV9DT0xPUiA9IFsweDAsIDB4MCwgMHgwLCAweDk5XTtcbmNvbnN0IERFRkFVTFRfRklMTF9DT0xPUiA9IFsweDAsIDB4MCwgMHgwLCAweDkwXTtcbmNvbnN0IERFRkFVTFRfU0VMRUNURURfTElORV9DT0xPUiA9IFsweDAsIDB4MCwgMHgwLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfU0VMRUNURURfRklMTF9DT0xPUiA9IFsweDAsIDB4MCwgMHg5MCwgMHg5MF07XG5jb25zdCBERUZBVUxUX1RFTlRBVElWRV9MSU5FX0NPTE9SID0gWzB4OTAsIDB4OTAsIDB4OTAsIDB4ZmZdO1xuY29uc3QgREVGQVVMVF9URU5UQVRJVkVfRklMTF9DT0xPUiA9IFsweDkwLCAweDkwLCAweDkwLCAweDkwXTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9DT0xPUiA9IFsweGMwLCAweDAsIDB4MCwgMHhmZl07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfSU5URVJNRURJQVRFX1BPSU5UX0NPTE9SID0gWzB4MCwgMHgwLCAweDAsIDB4ODBdO1xuY29uc3QgREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfQ09MT1IgPSBbMHg3YywgMHgwMCwgMHhjMCwgMHhmZl07XG5jb25zdCBERUZBVUxUX0VESVRJTkdfUE9JTlRfT1VUTElORV9DT0xPUiA9IFsweGZmLCAweGZmLCAweGZmLCAweGZmXTtcbmNvbnN0IERFRkFVTFRfRURJVElOR19FWElTVElOR19QT0lOVF9SQURJVVMgPSA1O1xuY29uc3QgREVGQVVMVF9FRElUSU5HX0lOVEVSTUVESUFURV9QT0lOVF9SQURJVVMgPSAzO1xuY29uc3QgREVGQVVMVF9FRElUSU5HX1NOQVBfUE9JTlRfUkFESVVTID0gNztcblxuY29uc3QgREVGQVVMVF9FRElUX01PREUgPSBEcmF3UG9seWdvbk1vZGU7XG5cbmZ1bmN0aW9uIGd1aWRlQWNjZXNzb3IoYWNjZXNzb3IpIHtcbiAgaWYgKCFhY2Nlc3NvciB8fCB0eXBlb2YgYWNjZXNzb3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gYWNjZXNzb3I7XG4gIH1cbiAgcmV0dXJuIChndWlkZU1heWJlV3JhcHBlZCkgPT4gYWNjZXNzb3IodW53cmFwR3VpZGUoZ3VpZGVNYXliZVdyYXBwZWQpKTtcbn1cblxuLy8gVGhlIG9iamVjdCBoYW5kZWQgdG8gdXMgZnJvbSBkZWNrLmdsIGlzIGRpZmZlcmVudCBkZXBlbmRpbmcgb24gdGhlIHZlcnNpb24gb2YgZGVjay5nbCB1c2VkLCB1bndyYXAgYXMgbmVjZXNzYXJ5XG5mdW5jdGlvbiB1bndyYXBHdWlkZShndWlkZU1heWJlV3JhcHBlZCkge1xuICBpZiAoZ3VpZGVNYXliZVdyYXBwZWQuX19zb3VyY2UpIHtcbiAgICByZXR1cm4gZ3VpZGVNYXliZVdyYXBwZWQuX19zb3VyY2Uub2JqZWN0O1xuICB9IGVsc2UgaWYgKGd1aWRlTWF5YmVXcmFwcGVkLnNvdXJjZUZlYXR1cmUpIHtcbiAgICByZXR1cm4gZ3VpZGVNYXliZVdyYXBwZWQuc291cmNlRmVhdHVyZS5mZWF0dXJlO1xuICB9XG4gIC8vIEl0IGlzIG5vdCB3cmFwcGVkLCByZXR1cm4gYXMgaXNcbiAgcmV0dXJuIGd1aWRlTWF5YmVXcmFwcGVkO1xufVxuXG5mdW5jdGlvbiBnZXRFZGl0SGFuZGxlQ29sb3IoaGFuZGxlKSB7XG4gIHN3aXRjaCAoaGFuZGxlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUpIHtcbiAgICBjYXNlICdleGlzdGluZyc6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX0VYSVNUSU5HX1BPSU5UX0NPTE9SO1xuICAgIGNhc2UgJ3NuYXAtc291cmNlJzpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9DT0xPUjtcbiAgICBjYXNlICdpbnRlcm1lZGlhdGUnOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX0lOVEVSTUVESUFURV9QT0lOVF9DT0xPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRFZGl0SGFuZGxlT3V0bGluZUNvbG9yKGhhbmRsZSkge1xuICByZXR1cm4gREVGQVVMVF9FRElUSU5HX1BPSU5UX09VVExJTkVfQ09MT1I7XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRIYW5kbGVSYWRpdXMoaGFuZGxlKSB7XG4gIHN3aXRjaCAoaGFuZGxlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUpIHtcbiAgICBjYXNlICdleGlzdGluZyc6XG4gICAgICByZXR1cm4gREVGQVVMVF9FRElUSU5HX0VYSVNUSU5HX1BPSU5UX1JBRElVUztcbiAgICBjYXNlICdzbmFwJzpcbiAgICAgIHJldHVybiBERUZBVUxUX0VESVRJTkdfU05BUF9QT0lOVF9SQURJVVM7XG4gICAgY2FzZSAnaW50ZXJtZWRpYXRlJzpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIERFRkFVTFRfRURJVElOR19JTlRFUk1FRElBVEVfUE9JTlRfUkFESVVTO1xuICB9XG59XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgbW9kZTogREVGQVVMVF9FRElUX01PREUsXG5cbiAgLy8gRWRpdCBhbmQgaW50ZXJhY3Rpb24gZXZlbnRzXG4gIG9uRWRpdDogKCkgPT4ge30sXG5cbiAgcGlja2FibGU6IHRydWUsXG4gIHBpY2tpbmdSYWRpdXM6IDEwLFxuICBwaWNraW5nRGVwdGg6IDUsXG4gIGZwNjQ6IGZhbHNlLFxuICBmaWxsZWQ6IHRydWUsXG4gIHN0cm9rZWQ6IHRydWUsXG4gIGxpbmVXaWR0aFNjYWxlOiAxLFxuICBsaW5lV2lkdGhNaW5QaXhlbHM6IDEsXG4gIGxpbmVXaWR0aE1heFBpeGVsczogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gIGxpbmVXaWR0aFVuaXRzOiAncGl4ZWxzJyxcbiAgbGluZUpvaW50Um91bmRlZDogZmFsc2UsXG4gIGxpbmVNaXRlckxpbWl0OiA0LFxuICBwb2ludFJhZGl1c1NjYWxlOiAxLFxuICBwb2ludFJhZGl1c01pblBpeGVsczogMixcbiAgcG9pbnRSYWRpdXNNYXhQaXhlbHM6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICBnZXRMaW5lQ29sb3I6IChmZWF0dXJlLCBpc1NlbGVjdGVkLCBtb2RlKSA9PlxuICAgIGlzU2VsZWN0ZWQgPyBERUZBVUxUX1NFTEVDVEVEX0xJTkVfQ09MT1IgOiBERUZBVUxUX0xJTkVfQ09MT1IsXG4gIGdldEZpbGxDb2xvcjogKGZlYXR1cmUsIGlzU2VsZWN0ZWQsIG1vZGUpID0+XG4gICAgaXNTZWxlY3RlZCA/IERFRkFVTFRfU0VMRUNURURfRklMTF9DT0xPUiA6IERFRkFVTFRfRklMTF9DT0xPUixcbiAgZ2V0UmFkaXVzOiAoZikgPT5cbiAgICAoZiAmJiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLnJhZGl1cykgfHwgKGYgJiYgZi5wcm9wZXJ0aWVzICYmIGYucHJvcGVydGllcy5zaXplKSB8fCAxLFxuICBnZXRMaW5lV2lkdGg6IChmKSA9PiAoZiAmJiBmLnByb3BlcnRpZXMgJiYgZi5wcm9wZXJ0aWVzLmxpbmVXaWR0aCkgfHwgMyxcblxuICAvLyBUZW50YXRpdmUgZmVhdHVyZSByZW5kZXJpbmdcbiAgZ2V0VGVudGF0aXZlTGluZUNvbG9yOiAoZikgPT4gREVGQVVMVF9URU5UQVRJVkVfTElORV9DT0xPUixcbiAgZ2V0VGVudGF0aXZlRmlsbENvbG9yOiAoZikgPT4gREVGQVVMVF9URU5UQVRJVkVfRklMTF9DT0xPUixcbiAgZ2V0VGVudGF0aXZlTGluZVdpZHRoOiAoZikgPT4gKGYgJiYgZi5wcm9wZXJ0aWVzICYmIGYucHJvcGVydGllcy5saW5lV2lkdGgpIHx8IDMsXG5cbiAgZWRpdEhhbmRsZVR5cGU6ICdwb2ludCcsXG5cbiAgLy8gcG9pbnQgaGFuZGxlc1xuICBlZGl0SGFuZGxlUG9pbnRSYWRpdXNTY2FsZTogMSxcbiAgZWRpdEhhbmRsZVBvaW50T3V0bGluZTogdHJ1ZSxcbiAgZWRpdEhhbmRsZVBvaW50U3Ryb2tlV2lkdGg6IDIsXG4gIGVkaXRIYW5kbGVQb2ludFJhZGl1c01pblBpeGVsczogNCxcbiAgZWRpdEhhbmRsZVBvaW50UmFkaXVzTWF4UGl4ZWxzOiA4LFxuICBnZXRFZGl0SGFuZGxlUG9pbnRDb2xvcjogZ2V0RWRpdEhhbmRsZUNvbG9yLFxuICBnZXRFZGl0SGFuZGxlUG9pbnRPdXRsaW5lQ29sb3I6IGdldEVkaXRIYW5kbGVPdXRsaW5lQ29sb3IsXG4gIGdldEVkaXRIYW5kbGVQb2ludFJhZGl1czogZ2V0RWRpdEhhbmRsZVJhZGl1cyxcblxuICAvLyBpY29uIGhhbmRsZXNcbiAgZWRpdEhhbmRsZUljb25BdGxhczogbnVsbCxcbiAgZWRpdEhhbmRsZUljb25NYXBwaW5nOiBudWxsLFxuICBlZGl0SGFuZGxlSWNvblNpemVTY2FsZTogMSxcbiAgZ2V0RWRpdEhhbmRsZUljb246IChoYW5kbGUpID0+IGhhbmRsZS5wcm9wZXJ0aWVzLmVkaXRIYW5kbGVUeXBlLFxuICBnZXRFZGl0SGFuZGxlSWNvblNpemU6IDEwLFxuICBnZXRFZGl0SGFuZGxlSWNvbkNvbG9yOiBnZXRFZGl0SGFuZGxlQ29sb3IsXG4gIGdldEVkaXRIYW5kbGVJY29uQW5nbGU6IDAsXG5cbiAgLy8gbWlzY1xuICBiaWxsYm9hcmQ6IHRydWUsXG59O1xuXG4vLyBNYXBwaW5nIG9mIG1vZGUgbmFtZSB0byBtb2RlIGNsYXNzIChmb3IgbGVnYWN5IHB1cnBvc2VzKVxuY29uc3QgbW9kZU5hbWVNYXBwaW5nID0ge1xuICB2aWV3OiBWaWV3TW9kZSxcblxuICAvLyBBbHRlciBtb2Rlc1xuICBtb2RpZnk6IE1vZGlmeU1vZGUsXG4gIHRyYW5zbGF0ZTogbmV3IFNuYXBwYWJsZU1vZGUobmV3IFRyYW5zbGF0ZU1vZGUoKSksXG5cbiAgdHJhbnNmb3JtOiBuZXcgU25hcHBhYmxlTW9kZShuZXcgVHJhbnNmb3JtTW9kZSgpKSxcbiAgc2NhbGU6IFNjYWxlTW9kZSxcbiAgcm90YXRlOiBSb3RhdGVNb2RlLFxuICBkdXBsaWNhdGU6IER1cGxpY2F0ZU1vZGUsXG4gIHNwbGl0OiBTcGxpdFBvbHlnb25Nb2RlLFxuICBleHRydWRlOiBFeHRydWRlTW9kZSxcbiAgZWxldmF0aW9uOiBFbGV2YXRpb25Nb2RlLFxuXG4gIC8vIERyYXcgbW9kZXNcbiAgZHJhd1BvaW50OiBEcmF3UG9pbnRNb2RlLFxuICBkcmF3TGluZVN0cmluZzogRHJhd0xpbmVTdHJpbmdNb2RlLFxuICBkcmF3UG9seWdvbjogRHJhd1BvbHlnb25Nb2RlLFxuICBkcmF3UmVjdGFuZ2xlOiBEcmF3UmVjdGFuZ2xlTW9kZSxcbiAgZHJhd0NpcmNsZUZyb21DZW50ZXI6IERyYXdDaXJjbGVGcm9tQ2VudGVyTW9kZSxcbiAgZHJhd0NpcmNsZUJ5Qm91bmRpbmdCb3g6IERyYXdDaXJjbGVCeURpYW1ldGVyTW9kZSxcbiAgZHJhd0VsbGlwc2VCeUJvdW5kaW5nQm94OiBEcmF3RWxsaXBzZUJ5Qm91bmRpbmdCb3hNb2RlLFxuICBkcmF3UmVjdGFuZ2xlVXNpbmczUG9pbnRzOiBEcmF3UmVjdGFuZ2xlVXNpbmdUaHJlZVBvaW50c01vZGUsXG4gIGRyYXdFbGxpcHNlVXNpbmczUG9pbnRzOiBEcmF3RWxsaXBzZVVzaW5nVGhyZWVQb2ludHNNb2RlLFxuICBkcmF3OTBEZWdyZWVQb2x5Z29uOiBEcmF3OTBEZWdyZWVQb2x5Z29uTW9kZSxcbiAgZHJhd1BvbHlnb25CeURyYWdnaW5nOiBEcmF3UG9seWdvbkJ5RHJhZ2dpbmdNb2RlLFxufTtcblxudHlwZSBQcm9wcyA9IHtcbiAgbW9kZTogc3RyaW5nIHwgR2VvSnNvbkVkaXRNb2RlQ29uc3RydWN0b3IgfCBHZW9Kc29uRWRpdE1vZGVUeXBlO1xuICBvbkVkaXQ6IChhcmcwOiBFZGl0QWN0aW9uPEZlYXR1cmVDb2xsZWN0aW9uPikgPT4gdm9pZDtcbiAgLy8gVE9ETzogdHlwZSB0aGUgcmVzdFxuXG4gIFtrZXk6IHN0cmluZ106IGFueTtcbn07XG5cbi8vIHR5cGUgU3RhdGUgPSB7XG4vLyAgIG1vZGU6IEdlb0pzb25FZGl0TW9kZSxcbi8vICAgdGVudGF0aXZlRmVhdHVyZTogP0ZlYXR1cmUsXG4vLyAgIGVkaXRIYW5kbGVzOiBhbnlbXSxcbi8vICAgc2VsZWN0ZWRGZWF0dXJlczogRmVhdHVyZVtdXG4vLyB9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0YWJsZUdlb0pzb25MYXllciBleHRlbmRzIEVkaXRhYmxlTGF5ZXIge1xuICBzdGF0aWMgbGF5ZXJOYW1lID0gJ0VkaXRhYmxlR2VvSnNvbkxheWVyJztcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiAgLy8gcHJvcHM6IFByb3BzO1xuXG4gIC8vIHNldFN0YXRlOiAoJFNoYXBlPFN0YXRlPikgPT4gdm9pZDtcbiAgcmVuZGVyTGF5ZXJzKCkge1xuICAgIGNvbnN0IHN1YkxheWVyUHJvcHMgPSB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgaWQ6ICdnZW9qc29uJyxcblxuICAgICAgLy8gUHJveHkgbW9zdCBHZW9Kc29uTGF5ZXIgcHJvcHMgYXMtaXNcbiAgICAgIGRhdGE6IHRoaXMucHJvcHMuZGF0YSxcbiAgICAgIGZwNjQ6IHRoaXMucHJvcHMuZnA2NCxcbiAgICAgIGZpbGxlZDogdGhpcy5wcm9wcy5maWxsZWQsXG4gICAgICBzdHJva2VkOiB0aGlzLnByb3BzLnN0cm9rZWQsXG4gICAgICBsaW5lV2lkdGhTY2FsZTogdGhpcy5wcm9wcy5saW5lV2lkdGhTY2FsZSxcbiAgICAgIGxpbmVXaWR0aE1pblBpeGVsczogdGhpcy5wcm9wcy5saW5lV2lkdGhNaW5QaXhlbHMsXG4gICAgICBsaW5lV2lkdGhNYXhQaXhlbHM6IHRoaXMucHJvcHMubGluZVdpZHRoTWF4UGl4ZWxzLFxuICAgICAgbGluZVdpZHRoVW5pdHM6IHRoaXMucHJvcHMubGluZVdpZHRoVW5pdHMsXG4gICAgICBsaW5lSm9pbnRSb3VuZGVkOiB0aGlzLnByb3BzLmxpbmVKb2ludFJvdW5kZWQsXG4gICAgICBsaW5lTWl0ZXJMaW1pdDogdGhpcy5wcm9wcy5saW5lTWl0ZXJMaW1pdCxcbiAgICAgIHBvaW50UmFkaXVzU2NhbGU6IHRoaXMucHJvcHMucG9pbnRSYWRpdXNTY2FsZSxcbiAgICAgIHBvaW50UmFkaXVzTWluUGl4ZWxzOiB0aGlzLnByb3BzLnBvaW50UmFkaXVzTWluUGl4ZWxzLFxuICAgICAgcG9pbnRSYWRpdXNNYXhQaXhlbHM6IHRoaXMucHJvcHMucG9pbnRSYWRpdXNNYXhQaXhlbHMsXG4gICAgICBnZXRMaW5lQ29sb3I6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldExpbmVDb2xvciksXG4gICAgICBnZXRGaWxsQ29sb3I6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldEZpbGxDb2xvciksXG4gICAgICBnZXRSYWRpdXM6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldFJhZGl1cyksXG4gICAgICBnZXRMaW5lV2lkdGg6IHRoaXMuc2VsZWN0aW9uQXdhcmVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldExpbmVXaWR0aCksXG5cbiAgICAgIF9zdWJMYXllclByb3BzOiB7XG4gICAgICAgICdsaW5lLXN0cmluZ3MnOiB7XG4gICAgICAgICAgYmlsbGJvYXJkOiB0aGlzLnByb3BzLmJpbGxib2FyZCxcbiAgICAgICAgfSxcbiAgICAgICAgJ3BvbHlnb25zLXN0cm9rZSc6IHtcbiAgICAgICAgICBiaWxsYm9hcmQ6IHRoaXMucHJvcHMuYmlsbGJvYXJkLFxuICAgICAgICB9LFxuICAgICAgfSxcblxuICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgZ2V0TGluZUNvbG9yOiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdLFxuICAgICAgICBnZXRGaWxsQ29sb3I6IFt0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMsIHRoaXMucHJvcHMubW9kZV0sXG4gICAgICAgIGdldFJhZGl1czogW3RoaXMucHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcywgdGhpcy5wcm9wcy5tb2RlXSxcbiAgICAgICAgZ2V0TGluZVdpZHRoOiBbdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLCB0aGlzLnByb3BzLm1vZGVdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGxldCBsYXllcnM6IGFueSA9IFtuZXcgR2VvSnNvbkxheWVyKHN1YkxheWVyUHJvcHMpXTtcblxuICAgIGxheWVycyA9IGxheWVycy5jb25jYXQodGhpcy5jcmVhdGVHdWlkZXNMYXllcnMoKSwgdGhpcy5jcmVhdGVUb29sdGlwc0xheWVycygpKTtcblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZVN0YXRlKCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlbGVjdGVkRmVhdHVyZXM6IFtdLFxuICAgICAgZWRpdEhhbmRsZXM6IFtdLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gVE9ETzogaXMgdGhpcyB0aGUgYmVzdCB3YXkgdG8gcHJvcGVybHkgdXBkYXRlIHN0YXRlIGZyb20gYW4gb3V0c2lkZSBldmVudCBoYW5kbGVyP1xuICBzaG91bGRVcGRhdGVTdGF0ZShvcHRzOiBhbnkpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcbiAgICAvLyAgICdzaG91bGRVcGRhdGVTdGF0ZScsXG4gICAgLy8gICBvcHRzLmNoYW5nZUZsYWdzLnByb3BzT3JEYXRhQ2hhbmdlZCxcbiAgICAvLyAgIG9wdHMuY2hhbmdlRmxhZ3Muc3RhdGVDaGFuZ2VkXG4gICAgLy8gKTtcbiAgICByZXR1cm4gc3VwZXIuc2hvdWxkVXBkYXRlU3RhdGUob3B0cykgfHwgb3B0cy5jaGFuZ2VGbGFncy5zdGF0ZUNoYW5nZWQ7XG4gIH1cblxuICB1cGRhdGVTdGF0ZSh7XG4gICAgcHJvcHMsXG4gICAgb2xkUHJvcHMsXG4gICAgY2hhbmdlRmxhZ3MsXG4gIH06IHtcbiAgICBwcm9wczogUHJvcHM7XG4gICAgb2xkUHJvcHM6IFByb3BzO1xuICAgIGNoYW5nZUZsYWdzOiBhbnk7XG4gIH0pIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgc3VwZXIudXBkYXRlU3RhdGUoeyBvbGRQcm9wcywgcHJvcHMsIGNoYW5nZUZsYWdzIH0pO1xuXG4gICAgaWYgKGNoYW5nZUZsYWdzLnByb3BzT3JEYXRhQ2hhbmdlZCkge1xuICAgICAgY29uc3QgbW9kZVByb3BDaGFuZ2VkID0gT2JqZWN0LmtleXMob2xkUHJvcHMpLmxlbmd0aCA9PT0gMCB8fCBwcm9wcy5tb2RlICE9PSBvbGRQcm9wcy5tb2RlO1xuICAgICAgaWYgKG1vZGVQcm9wQ2hhbmdlZCkge1xuICAgICAgICBsZXQgbW9kZTtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9wcy5tb2RlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgLy8gVGhleSBwYXNzZWQgYSBjb25zdHJ1Y3Rvci9jbGFzcywgc28gbmV3IGl0IHVwXG4gICAgICAgICAgY29uc3QgTW9kZUNvbnN0cnVjdG9yID0gcHJvcHMubW9kZTtcbiAgICAgICAgICBtb2RlID0gbmV3IE1vZGVDb25zdHJ1Y3RvcigpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9wcy5tb2RlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIC8vIExvb2t1cCB0aGUgbW9kZSBiYXNlZCBvbiBpdHMgbmFtZSAoZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5KVxuICAgICAgICAgIG1vZGUgPSBtb2RlTmFtZU1hcHBpbmdbcHJvcHMubW9kZV07XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBcIkRlcHJlY2F0ZWQgdXNlIG9mIHBhc3NpbmcgYG1vZGVgIGFzIGEgc3RyaW5nLiBQYXNzIHRoZSBtb2RlJ3MgY2xhc3MgY29uc3RydWN0b3IgaW5zdGVhZC5cIlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gU2hvdWxkIGJlIGFuIGluc3RhbmNlIG9mIEVkaXRNb2RlIGluIHRoaXMgY2FzZVxuICAgICAgICAgIG1vZGUgPSBwcm9wcy5tb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtb2RlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGBObyBtb2RlIGNvbmZpZ3VyZWQgZm9yICR7U3RyaW5nKHByb3BzLm1vZGUpfWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGUsbm8tdW5kZWZcbiAgICAgICAgICAvLyBVc2UgZGVmYXVsdCBtb2RlXG4gICAgICAgICAgbW9kZSA9IG5ldyBERUZBVUxUX0VESVRfTU9ERSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vZGUgIT09IHRoaXMuc3RhdGUubW9kZSkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBtb2RlLCBjdXJzb3I6IG51bGwgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgc2VsZWN0ZWRGZWF0dXJlcyA9IFtdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4ZXMpKSB7XG4gICAgICAvLyBUT0RPOiBuZWVkcyBpbXByb3ZlZCB0ZXN0aW5nLCBpLmUuIGNoZWNraW5nIGZvciBkdXBsaWNhdGVzLCBOYU5zLCBvdXQgb2YgcmFuZ2UgbnVtYmVycywgLi4uXG4gICAgICBzZWxlY3RlZEZlYXR1cmVzID0gcHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcy5tYXAoKGVsZW0pID0+IHByb3BzLmRhdGEuZmVhdHVyZXNbZWxlbV0pO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEZlYXR1cmVzIH0pO1xuICB9XG5cbiAgZ2V0TW9kZVByb3BzKHByb3BzOiBQcm9wcykge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlQ29uZmlnOiBwcm9wcy5tb2RlQ29uZmlnLFxuICAgICAgZGF0YTogcHJvcHMuZGF0YSxcbiAgICAgIHNlbGVjdGVkSW5kZXhlczogcHJvcHMuc2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyxcbiAgICAgIGxhc3RQb2ludGVyTW92ZUV2ZW50OiB0aGlzLnN0YXRlLmxhc3RQb2ludGVyTW92ZUV2ZW50LFxuICAgICAgY3Vyc29yOiB0aGlzLnN0YXRlLmN1cnNvcixcbiAgICAgIG9uRWRpdDogKGVkaXRBY3Rpb246IEVkaXRBY3Rpb248RmVhdHVyZUNvbGxlY3Rpb24+KSA9PiB7XG4gICAgICAgIC8vIEZvcmNlIGEgcmUtcmVuZGVyXG4gICAgICAgIC8vIFRoaXMgc3VwcG9ydHMgZG91YmxlLWNsaWNrIHdoZXJlIHdlIG5lZWQgdG8gZW5zdXJlIHRoYXQgdGhlcmUncyBhIHJlLXJlbmRlciBiZXR3ZWVuIHRoZSB0d28gY2xpY2tzXG4gICAgICAgIC8vIGV2ZW4gdGhvdWdoIHRoZSBkYXRhIHdhc24ndCBjaGFuZ2VkLCBqdXN0IHRoZSBpbnRlcm5hbCB0ZW50YXRpdmUgZmVhdHVyZS5cbiAgICAgICAgdGhpcy5zZXROZWVkc1VwZGF0ZSgpO1xuICAgICAgICBwcm9wcy5vbkVkaXQoZWRpdEFjdGlvbik7XG4gICAgICB9LFxuICAgICAgb25VcGRhdGVDdXJzb3I6IChjdXJzb3I6IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQpID0+IHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnNvciB9KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHNlbGVjdGlvbkF3YXJlQWNjZXNzb3IoYWNjZXNzb3I6IGFueSkge1xuICAgIGlmICh0eXBlb2YgYWNjZXNzb3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBhY2Nlc3NvcjtcbiAgICB9XG4gICAgcmV0dXJuIChmZWF0dXJlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PlxuICAgICAgYWNjZXNzb3IoZmVhdHVyZSwgdGhpcy5pc0ZlYXR1cmVTZWxlY3RlZChmZWF0dXJlKSwgdGhpcy5wcm9wcy5tb2RlKTtcbiAgfVxuXG4gIGlzRmVhdHVyZVNlbGVjdGVkKGZlYXR1cmU6IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuZGF0YSB8fCAhdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBmZWF0dXJlSW5kZXggPSB0aGlzLnByb3BzLmRhdGEuZmVhdHVyZXMuaW5kZXhPZihmZWF0dXJlKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJbmRleGVzLmluY2x1ZGVzKGZlYXR1cmVJbmRleCk7XG4gIH1cblxuICBnZXRQaWNraW5nSW5mbyh7IGluZm8sIHNvdXJjZUxheWVyIH06IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgICBpZiAoc291cmNlTGF5ZXIuaWQuZW5kc1dpdGgoJ2d1aWRlcycpKSB7XG4gICAgICAvLyBJZiB1c2VyIGlzIHBpY2tpbmcgYW4gZWRpdGluZyBoYW5kbGUsIGFkZCBhZGRpdGlvbmFsIGRhdGEgdG8gdGhlIGluZm9cbiAgICAgIGluZm8uaXNHdWlkZSA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGluZm87XG4gIH1cblxuICBjcmVhdGVHdWlkZXNMYXllcnMoKSB7XG4gICAgY29uc3QgbW9kZSA9IHRoaXMuZ2V0QWN0aXZlTW9kZSgpO1xuICAgIGNvbnN0IGd1aWRlczogRmVhdHVyZUNvbGxlY3Rpb24gPSBtb2RlLmdldEd1aWRlcyh0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG5cbiAgICBpZiAoIWd1aWRlcyB8fCAhZ3VpZGVzLmZlYXR1cmVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGxldCBwb2ludExheWVyUHJvcHM7XG4gICAgaWYgKHRoaXMucHJvcHMuZWRpdEhhbmRsZVR5cGUgPT09ICdpY29uJykge1xuICAgICAgcG9pbnRMYXllclByb3BzID0ge1xuICAgICAgICB0eXBlOiBJY29uTGF5ZXIsXG4gICAgICAgIGljb25BdGxhczogdGhpcy5wcm9wcy5lZGl0SGFuZGxlSWNvbkF0bGFzLFxuICAgICAgICBpY29uTWFwcGluZzogdGhpcy5wcm9wcy5lZGl0SGFuZGxlSWNvbk1hcHBpbmcsXG4gICAgICAgIHNpemVTY2FsZTogdGhpcy5wcm9wcy5lZGl0SGFuZGxlSWNvblNpemVTY2FsZSxcbiAgICAgICAgZ2V0SWNvbjogZ3VpZGVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldEVkaXRIYW5kbGVJY29uKSxcbiAgICAgICAgZ2V0U2l6ZTogZ3VpZGVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldEVkaXRIYW5kbGVJY29uU2l6ZSksXG4gICAgICAgIGdldENvbG9yOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZUljb25Db2xvciksXG4gICAgICAgIGdldEFuZ2xlOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZUljb25BbmdsZSksXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBwb2ludExheWVyUHJvcHMgPSB7XG4gICAgICAgIHR5cGU6IFNjYXR0ZXJwbG90TGF5ZXIsXG4gICAgICAgIHJhZGl1c1NjYWxlOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFJhZGl1c1NjYWxlLFxuICAgICAgICBzdHJva2VkOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludE91dGxpbmUsXG4gICAgICAgIGdldExpbmVXaWR0aDogdGhpcy5wcm9wcy5lZGl0SGFuZGxlUG9pbnRTdHJva2VXaWR0aCxcbiAgICAgICAgcmFkaXVzTWluUGl4ZWxzOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFJhZGl1c01pblBpeGVscyxcbiAgICAgICAgcmFkaXVzTWF4UGl4ZWxzOiB0aGlzLnByb3BzLmVkaXRIYW5kbGVQb2ludFJhZGl1c01heFBpeGVscyxcbiAgICAgICAgZ2V0UmFkaXVzOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZVBvaW50UmFkaXVzKSxcbiAgICAgICAgZ2V0RmlsbENvbG9yOiBndWlkZUFjY2Vzc29yKHRoaXMucHJvcHMuZ2V0RWRpdEhhbmRsZVBvaW50Q29sb3IpLFxuICAgICAgICBnZXRMaW5lQ29sb3I6IGd1aWRlQWNjZXNzb3IodGhpcy5wcm9wcy5nZXRFZGl0SGFuZGxlUG9pbnRPdXRsaW5lQ29sb3IpLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBsYXllciA9IG5ldyBHZW9Kc29uTGF5ZXIoXG4gICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgICBpZDogYGd1aWRlc2AsXG4gICAgICAgIGRhdGE6IGd1aWRlcyxcbiAgICAgICAgZnA2NDogdGhpcy5wcm9wcy5mcDY0LFxuICAgICAgICBfc3ViTGF5ZXJQcm9wczoge1xuICAgICAgICAgIHBvaW50czogcG9pbnRMYXllclByb3BzLFxuICAgICAgICB9LFxuICAgICAgICBsaW5lV2lkdGhTY2FsZTogdGhpcy5wcm9wcy5saW5lV2lkdGhTY2FsZSxcbiAgICAgICAgbGluZVdpZHRoTWluUGl4ZWxzOiB0aGlzLnByb3BzLmxpbmVXaWR0aE1pblBpeGVscyxcbiAgICAgICAgbGluZVdpZHRoTWF4UGl4ZWxzOiB0aGlzLnByb3BzLmxpbmVXaWR0aE1heFBpeGVscyxcbiAgICAgICAgbGluZVdpZHRoVW5pdHM6IHRoaXMucHJvcHMubGluZVdpZHRoVW5pdHMsXG4gICAgICAgIGxpbmVKb2ludFJvdW5kZWQ6IHRoaXMucHJvcHMubGluZUpvaW50Um91bmRlZCxcbiAgICAgICAgbGluZU1pdGVyTGltaXQ6IHRoaXMucHJvcHMubGluZU1pdGVyTGltaXQsXG4gICAgICAgIGdldExpbmVDb2xvcjogZ3VpZGVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUxpbmVDb2xvciksXG4gICAgICAgIGdldExpbmVXaWR0aDogZ3VpZGVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUxpbmVXaWR0aCksXG4gICAgICAgIGdldEZpbGxDb2xvcjogZ3VpZGVBY2Nlc3Nvcih0aGlzLnByb3BzLmdldFRlbnRhdGl2ZUZpbGxDb2xvciksXG4gICAgICB9KVxuICAgICk7XG5cbiAgICByZXR1cm4gW2xheWVyXTtcbiAgfVxuXG4gIGNyZWF0ZVRvb2x0aXBzTGF5ZXJzKCkge1xuICAgIGNvbnN0IG1vZGUgPSB0aGlzLmdldEFjdGl2ZU1vZGUoKTtcbiAgICBjb25zdCB0b29sdGlwcyA9IG1vZGUuZ2V0VG9vbHRpcHModGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuXG4gICAgY29uc3QgbGF5ZXIgPSBuZXcgVGV4dExheWVyKFxuICAgICAgdGhpcy5nZXRTdWJMYXllclByb3BzKHtcbiAgICAgICAgaWQ6IGB0b29sdGlwc2AsXG4gICAgICAgIGRhdGE6IHRvb2x0aXBzLFxuICAgICAgfSlcbiAgICApO1xuXG4gICAgcmV0dXJuIFtsYXllcl07XG4gIH1cblxuICBvbkxheWVyQ2xpY2soZXZlbnQ6IENsaWNrRXZlbnQpIHtcbiAgICB0aGlzLmdldEFjdGl2ZU1vZGUoKS5oYW5kbGVDbGljayhldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25MYXllcktleVVwKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgdGhpcy5nZXRBY3RpdmVNb2RlKCkuaGFuZGxlS2V5VXAoZXZlbnQsIHRoaXMuZ2V0TW9kZVByb3BzKHRoaXMucHJvcHMpKTtcbiAgfVxuXG4gIG9uU3RhcnREcmFnZ2luZyhldmVudDogU3RhcnREcmFnZ2luZ0V2ZW50KSB7XG4gICAgdGhpcy5nZXRBY3RpdmVNb2RlKCkuaGFuZGxlU3RhcnREcmFnZ2luZyhldmVudCwgdGhpcy5nZXRNb2RlUHJvcHModGhpcy5wcm9wcykpO1xuICB9XG5cbiAgb25EcmFnZ2luZyhldmVudDogRHJhZ2dpbmdFdmVudCkge1xuICAgIHRoaXMuZ2V0QWN0aXZlTW9kZSgpLmhhbmRsZURyYWdnaW5nKGV2ZW50LCB0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG4gIH1cblxuICBvblN0b3BEcmFnZ2luZyhldmVudDogU3RvcERyYWdnaW5nRXZlbnQpIHtcbiAgICB0aGlzLmdldEFjdGl2ZU1vZGUoKS5oYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQsIHRoaXMuZ2V0TW9kZVByb3BzKHRoaXMucHJvcHMpKTtcbiAgfVxuXG4gIG9uUG9pbnRlck1vdmUoZXZlbnQ6IFBvaW50ZXJNb3ZlRXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgbGFzdFBvaW50ZXJNb3ZlRXZlbnQ6IGV2ZW50IH0pO1xuICAgIHRoaXMuZ2V0QWN0aXZlTW9kZSgpLmhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50LCB0aGlzLmdldE1vZGVQcm9wcyh0aGlzLnByb3BzKSk7XG4gIH1cblxuICBnZXRDdXJzb3IoeyBpc0RyYWdnaW5nIH06IHsgaXNEcmFnZ2luZzogYm9vbGVhbiB9KSB7XG4gICAgbGV0IHsgY3Vyc29yIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmICghY3Vyc29yKSB7XG4gICAgICAvLyBkZWZhdWx0IGN1cnNvclxuICAgICAgY3Vyc29yID0gaXNEcmFnZ2luZyA/ICdncmFiYmluZycgOiAnZ3JhYic7XG4gICAgfVxuICAgIHJldHVybiBjdXJzb3I7XG4gIH1cblxuICBnZXRBY3RpdmVNb2RlKCk6IEdlb0pzb25FZGl0TW9kZVR5cGUge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLm1vZGU7XG4gIH1cbn1cbiJdfQ==