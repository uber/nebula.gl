"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _constants = require("./constants");

var _modeHandler = _interopRequireDefault(require("./mode-handler"));

var _utils = require("./edit-modes/utils");

var _style = require("./style");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultProps = _objectSpread({}, _modeHandler["default"].defaultProps, {
  clickRadius: 0,
  featureShape: 'circle',
  editHandleShape: 'rect',
  editHandleStyle: _style.editHandleStyle,
  featureStyle: _style.featureStyle,
  featuresDraggable: true
});

var Editor = /*#__PURE__*/function (_ModeHandler) {
  _inherits(Editor, _ModeHandler);

  var _super = _createSuper(Editor);

  function Editor() {
    var _this;

    _classCallCheck(this, Editor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_getEditHandleState", function (editHandle, renderState) {
      var _this$state = _this.state,
          pointerDownPicks = _this$state.pointerDownPicks,
          hovered = _this$state.hovered;

      if (renderState) {
        return renderState;
      }

      var editHandleIndex = editHandle.properties.positionIndexes[0];
      var draggingEditHandleIndex = null;
      var pickedObject = pointerDownPicks && pointerDownPicks[0] && pointerDownPicks[0].object;

      if (pickedObject && pickedObject.guideType === _constants.GUIDE_TYPE.EDIT_HANDLE) {
        draggingEditHandleIndex = pickedObject.index;
      }

      if (editHandleIndex === draggingEditHandleIndex || _this.state.selectedEditHandleIndexes.includes(editHandleIndex)) {
        return _constants.RENDER_STATE.SELECTED;
      } // @ts-ignore


      if (hovered && hovered.type === _constants.ELEMENT_TYPE.EDIT_HANDLE) {
        if (hovered.index === editHandleIndex) {
          return _constants.RENDER_STATE.HOVERED;
        } // cursor hovered on first vertex when drawing polygon


        if (hovered.index === 0 && editHandle.properties.guideType === _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE) {
          return _constants.RENDER_STATE.CLOSING;
        }
      }

      return _constants.RENDER_STATE.INACTIVE;
    });

    _defineProperty(_assertThisInitialized(_this), "_getFeatureRenderState", function (index, renderState) {
      var hovered = _this.state.hovered;

      var selectedFeatureIndex = _this._getSelectedFeatureIndex();

      if (renderState) {
        return renderState;
      }

      if (index === selectedFeatureIndex) {
        return _constants.RENDER_STATE.SELECTED;
      } // @ts-ignore


      if (hovered && hovered.type === _constants.ELEMENT_TYPE.FEATURE && hovered.featureIndex === index) {
        return _constants.RENDER_STATE.HOVERED;
      }

      return _constants.RENDER_STATE.INACTIVE;
    });

    _defineProperty(_assertThisInitialized(_this), "_getStyleProp", function (styleProp, params) {
      return typeof styleProp === 'function' ? styleProp(params) : styleProp;
    });

    _defineProperty(_assertThisInitialized(_this), "_renderEditHandle", function (editHandle, feature) {
      /* eslint-enable max-params */
      var coordinates = (0, _utils.getFeatureCoordinates)(editHandle);

      var p = _this.project(coordinates && coordinates[0]);

      if (!p) {
        return null;
      }

      var _editHandle$propertie = editHandle.properties,
          featureIndex = _editHandle$propertie.featureIndex,
          positionIndexes = _editHandle$propertie.positionIndexes,
          editHandleType = _editHandle$propertie.editHandleType;
      var _this$props = _this.props,
          clickRadius = _this$props.clickRadius,
          editHandleShape = _this$props.editHandleShape,
          editHandleStyle = _this$props.editHandleStyle;
      var index = positionIndexes.length > 1 ? positionIndexes[1] : positionIndexes[0];

      var shape = _this._getStyleProp(editHandleShape, {
        feature: feature || editHandle,
        index: index,
        featureIndex: featureIndex,
        // @ts-ignore
        state: _this._getEditHandleState(editHandle)
      });

      var style = _this._getStyleProp(editHandleStyle, {
        feature: feature || editHandle,
        index: index,
        featureIndex: featureIndex,
        shape: shape,
        // @ts-ignore
        state: _this._getEditHandleState(editHandle)
      }); // disable events for cursor editHandle


      if (editHandle.properties.guideType === _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE) {
        style = _objectSpread({}, style, {
          // disable pointer events for cursor
          pointerEvents: 'none'
        });
      }

      var elemKey = "".concat(_constants.ELEMENT_TYPE.EDIT_HANDLE, ".").concat(featureIndex, ".").concat(index, ".").concat(editHandleType); // first <circle|rect> is to make path easily interacted with

      switch (shape) {
        case 'circle':
          return /*#__PURE__*/React.createElement("g", {
            key: elemKey,
            transform: "translate(".concat(p[0], ", ").concat(p[1], ")")
          }, /*#__PURE__*/React.createElement("circle", {
            "data-type": _constants.ELEMENT_TYPE.EDIT_HANDLE,
            "data-index": index,
            "data-feature-index": featureIndex,
            key: "".concat(elemKey, ".hidden"),
            style: _objectSpread({}, style, {
              stroke: 'none',
              fill: '#000',
              fillOpacity: 0
            }),
            cx: 0,
            cy: 0,
            r: clickRadius
          }), /*#__PURE__*/React.createElement("circle", {
            "data-type": _constants.ELEMENT_TYPE.EDIT_HANDLE,
            "data-index": index,
            "data-feature-index": featureIndex,
            key: elemKey,
            style: style,
            cx: 0,
            cy: 0
          }));

        case 'rect':
          return /*#__PURE__*/React.createElement("g", {
            key: elemKey,
            transform: "translate(".concat(p[0], ", ").concat(p[1], ")")
          }, /*#__PURE__*/React.createElement("rect", {
            "data-type": _constants.ELEMENT_TYPE.EDIT_HANDLE,
            "data-index": index,
            "data-feature-index": featureIndex,
            key: "".concat(elemKey, ".hidden"),
            style: _objectSpread({}, style, {
              height: clickRadius,
              width: clickRadius,
              fill: '#000',
              fillOpacity: 0
            }),
            r: clickRadius
          }), /*#__PURE__*/React.createElement("rect", {
            "data-type": _constants.ELEMENT_TYPE.EDIT_HANDLE,
            "data-index": index,
            "data-feature-index": featureIndex,
            key: "".concat(elemKey),
            style: style
          }));

        default:
          return null;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_renderSegment", function (featureIndex, index, coordinates, style) {
      var path = _this._getPathInScreenCoords(coordinates, _constants.GEOJSON_TYPE.LINE_STRING);

      var radius = style.radius,
          others = _objectWithoutProperties(style, ["radius"]);

      var clickRadius = _this.props.clickRadius;
      var elemKey = "".concat(_constants.ELEMENT_TYPE.SEGMENT, ".").concat(featureIndex, ".").concat(index);
      return /*#__PURE__*/React.createElement("g", {
        key: elemKey
      }, /*#__PURE__*/React.createElement("path", {
        key: "".concat(elemKey, ".hidden"),
        "data-type": _constants.ELEMENT_TYPE.SEGMENT,
        "data-index": index,
        "data-feature-index": featureIndex,
        style: _objectSpread({}, others, {
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: clickRadius || radius,
          opacity: 0
        }),
        d: path
      }), /*#__PURE__*/React.createElement("path", {
        key: elemKey,
        "data-type": _constants.ELEMENT_TYPE.SEGMENT,
        "data-index": index,
        "data-feature-index": featureIndex,
        style: others,
        d: path
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "_renderSegments", function (featureIndex, coordinates, style) {
      var segments = [];

      for (var i = 0; i < coordinates.length - 1; i++) {
        segments.push(_this._renderSegment(featureIndex, i, [coordinates[i], coordinates[i + 1]], style));
      }

      return segments;
    });

    _defineProperty(_assertThisInitialized(_this), "_renderFill", function (featureIndex, coordinates, style) {
      var path = _this._getPathInScreenCoords(coordinates, _constants.GEOJSON_TYPE.POLYGON);

      return /*#__PURE__*/React.createElement("path", {
        key: "".concat(_constants.ELEMENT_TYPE.FILL, ".").concat(featureIndex),
        "data-type": _constants.ELEMENT_TYPE.FILL,
        "data-feature-index": featureIndex,
        style: _objectSpread({}, style, {
          stroke: 'none'
        }),
        d: path
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_renderTentativeFeature", function (feature, cursorEditHandle) {
      var featureStyle = _this.props.featureStyle;
      var geojsonType = feature.geometry.type,
          shape = feature.properties.shape;
      var coordinates = (0, _utils.getFeatureCoordinates)(feature);

      if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
        return null;
      } // >= 2 coordinates


      var firstCoords = coordinates[0];
      var lastCoords = coordinates[coordinates.length - 1];

      var uncommittedStyle = _this._getStyleProp(featureStyle, {
        feature: feature,
        index: null,
        state: _constants.RENDER_STATE.UNCOMMITTED
      });

      var committedPath;
      var uncommittedPath;
      var closingPath; // @ts-ignore

      var fill = _this._renderFill('tentative', coordinates, uncommittedStyle);

      var type = shape || geojsonType;

      switch (type) {
        case _constants.SHAPE.LINE_STRING:
        case _constants.SHAPE.POLYGON:
          var committedStyle = _this._getStyleProp(featureStyle, {
            feature: feature,
            state: _constants.RENDER_STATE.SELECTED
          });

          if (cursorEditHandle) {
            // @ts-ignore
            var cursorCoords = coordinates[coordinates.length - 2];
            committedPath = _this._renderSegments('tentative', // @ts-ignore
            coordinates.slice(0, coordinates.length - 1), committedStyle);
            uncommittedPath = _this._renderSegment('tentative-uncommitted', // @ts-ignore
            coordinates.length - 2, // @ts-ignore
            [cursorCoords, lastCoords], uncommittedStyle);
          } else {
            // @ts-ignore
            committedPath = _this._renderSegments('tentative', coordinates, committedStyle);
          }

          if (shape === _constants.SHAPE.POLYGON) {
            var closingStyle = _this._getStyleProp(featureStyle, {
              feature: feature,
              index: null,
              state: _constants.RENDER_STATE.CLOSING
            });

            closingPath = _this._renderSegment('tentative-closing', // @ts-ignore
            coordinates.length - 1, // @ts-ignore
            [lastCoords, firstCoords], closingStyle);
          }

          break;

        case _constants.SHAPE.RECTANGLE:
          uncommittedPath = _this._renderSegments('tentative', // @ts-ignore
          [].concat(_toConsumableArray(coordinates), [firstCoords]), uncommittedStyle);
          break;

        default:
      }

      return [fill, committedPath, uncommittedPath, closingPath].filter(Boolean);
    });

    _defineProperty(_assertThisInitialized(_this), "_renderGuides", function (guideFeatures) {
      var features = _this.getFeatures();

      var cursorEditHandle = guideFeatures && guideFeatures.find(function (f) {
        return f.properties.guideType === _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE;
      });
      var tentativeFeature = features.find(function (f) {
        return f.properties.guideType === _constants.GUIDE_TYPE.TENTATIVE;
      });
      return /*#__PURE__*/React.createElement("g", {
        key: "feature-guides"
      }, guideFeatures.map(function (guide) {
        var guideType = guide.properties.guideType;

        switch (guideType) {
          case _constants.GUIDE_TYPE.TENTATIVE:
            return _this._renderTentativeFeature(guide, cursorEditHandle);

          case _constants.GUIDE_TYPE.EDIT_HANDLE:
          case _constants.GUIDE_TYPE.CURSOR_EDIT_HANDLE:
            var shape = guide.properties.shape || guide.geometry.type; // TODO this should be removed when fix editing mode
            // don't render cursor for rectangle

            if (shape === _constants.SHAPE.RECTANGLE && guide.properties.editHandleType === 'intermediate') {
              return null;
            }

            var feature = features && features[guide.properties.featureIndex] || tentativeFeature;
            return _this._renderEditHandle(guide, feature);

          default:
            return null;
        }
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "_renderPoint", function (feature, index, path) {
      // @ts-ignore
      var renderState = _this._getFeatureRenderState(index);

      var _this$props2 = _this.props,
          featureStyle = _this$props2.featureStyle,
          featureShape = _this$props2.featureShape,
          clickRadius = _this$props2.clickRadius;

      var shape = _this._getStyleProp(featureShape, {
        feature: feature,
        index: index,
        state: renderState
      });

      var style = _this._getStyleProp(featureStyle, {
        feature: feature,
        index: index,
        state: renderState
      });

      var elemKey = "feature.".concat(index);

      if (shape === 'rect') {
        return /*#__PURE__*/React.createElement("g", {
          key: elemKey,
          transform: "translate(".concat(path[0][0], ", ").concat(path[0][1], ")")
        }, /*#__PURE__*/React.createElement("rect", {
          "data-type": _constants.ELEMENT_TYPE.FEATURE,
          "data-feature-index": index,
          key: "".concat(elemKey, ".hidden"),
          style: _objectSpread({}, style, {
            width: clickRadius,
            height: clickRadius,
            fill: '#000',
            fillOpacity: 0
          })
        }), /*#__PURE__*/React.createElement("rect", {
          "data-type": _constants.ELEMENT_TYPE.FEATURE,
          "data-feature-index": index,
          key: elemKey,
          style: style
        }));
      }

      return /*#__PURE__*/React.createElement("g", {
        key: "feature.".concat(index),
        transform: "translate(".concat(path[0][0], ", ").concat(path[0][1], ")")
      }, /*#__PURE__*/React.createElement("circle", {
        "data-type": _constants.ELEMENT_TYPE.FEATURE,
        "data-feature-index": index,
        key: "".concat(elemKey, ".hidden"),
        style: _objectSpread({}, style, {
          opacity: 0
        }),
        cx: 0,
        cy: 0,
        r: clickRadius
      }), /*#__PURE__*/React.createElement("circle", {
        "data-type": _constants.ELEMENT_TYPE.FEATURE,
        "data-feature-index": index,
        key: elemKey,
        style: style,
        cx: 0,
        cy: 0
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "_renderPath", function (feature, index, path) {
      var _this$props3 = _this.props,
          featureStyle = _this$props3.featureStyle,
          clickRadius = _this$props3.clickRadius;

      var selectedFeatureIndex = _this._getSelectedFeatureIndex();

      var selected = index === selectedFeatureIndex; // @ts-ignore

      var renderState = _this._getFeatureRenderState(index);

      var style = _this._getStyleProp(featureStyle, {
        feature: feature,
        index: index,
        state: renderState
      });

      var elemKey = "feature.".concat(index);

      if (selected) {
        return (
          /*#__PURE__*/
          // @ts-ignore
          React.createElement("g", {
            key: elemKey
          }, _this._renderSegments(index, feature.geometry.coordinates, style))
        );
      } // first <path> is to make path easily interacted with


      return /*#__PURE__*/React.createElement("g", {
        key: elemKey
      }, /*#__PURE__*/React.createElement("path", {
        "data-type": _constants.ELEMENT_TYPE.FEATURE,
        "data-feature-index": index,
        key: "".concat(elemKey, ".hidden"),
        style: _objectSpread({}, style, {
          stroke: 'rgba(0,0,0,0)',
          strokeWidth: clickRadius,
          opacity: 0
        }),
        d: path
      }), /*#__PURE__*/React.createElement("path", {
        "data-type": _constants.ELEMENT_TYPE.FEATURE,
        "data-feature-index": index,
        key: elemKey,
        style: style,
        d: path
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "_renderPolygon", function (feature, index, path) {
      var featureStyle = _this.props.featureStyle;

      var selectedFeatureIndex = _this._getSelectedFeatureIndex();

      var selected = index === selectedFeatureIndex; // @ts-ignore

      var renderState = _this._getFeatureRenderState(index);

      var style = _this._getStyleProp(featureStyle, {
        feature: feature,
        index: index,
        state: renderState
      });

      var elemKey = "feature.".concat(index);

      if (selected) {
        var coordinates = (0, _utils.getFeatureCoordinates)(feature);

        if (!coordinates) {
          return null;
        }

        return /*#__PURE__*/React.createElement("g", {
          key: elemKey
        }, // eslint-disable-next-line prettier/prettier
        //@ts-ignore
        _this._renderFill(index, coordinates, style), // eslint-disable-next-line prettier/prettier
        // @ts-ignore
        _this._renderSegments(index, coordinates, style));
      }

      return /*#__PURE__*/React.createElement("path", {
        "data-type": _constants.ELEMENT_TYPE.FEATURE,
        "data-feature-index": index,
        key: elemKey,
        style: style,
        d: path
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_renderFeature", function (feature, index) {
      var coordinates = (0, _utils.getFeatureCoordinates)(feature); // @ts-ignore

      if (!coordinates || !coordinates.length) {
        return null;
      }

      var shape = feature.properties.shape,
          geojsonType = feature.geometry.type; // @ts-ignore

      var path = _this._getPathInScreenCoords(coordinates, geojsonType);

      if (!path) {
        return null;
      }

      var type = shape || geojsonType;

      switch (type) {
        case _constants.SHAPE.POINT:
          return _this._renderPoint(feature, index, path);

        case _constants.SHAPE.LINE_STRING:
          return _this._renderPath(feature, index, path);

        case _constants.SHAPE.CIRCLE:
        case _constants.SHAPE.POLYGON:
        case _constants.SHAPE.RECTANGLE:
          return _this._renderPolygon(feature, index, path);

        default:
          return null;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_renderCanvas", function () {
      var features = _this.getFeatures();

      var guides = _this._modeHandler && _this._modeHandler.getGuides(_this.getModeProps());

      var guideFeatures = guides && guides.features;
      return /*#__PURE__*/React.createElement("svg", {
        key: "draw-canvas",
        width: "100%",
        height: "100%"
      }, features && features.length > 0 && /*#__PURE__*/React.createElement("g", {
        key: "feature-group"
      }, features.map(_this._renderFeature)), guideFeatures && guideFeatures.length > 0 && /*#__PURE__*/React.createElement("g", {
        key: "feature-guides"
      }, _this._renderGuides(guideFeatures)));
    });

    _defineProperty(_assertThisInitialized(_this), "_render", function () {
      var viewport = _this._context && _this._context.viewport || {};
      var style = _this.props.style; // @ts-ignore

      var _viewport$width = viewport.width,
          width = _viewport$width === void 0 ? 0 : _viewport$width,
          _viewport$height = viewport.height,
          height = _viewport$height === void 0 ? 0 : _viewport$height;
      return /*#__PURE__*/React.createElement("div", {
        id: "editor",
        style: _objectSpread({
          width: width,
          height: height
        }, style),
        ref: function ref(_) {
          _this._containerRef = _;
        }
      }, _this._renderCanvas());
    });

    return _this;
  }

  _createClass(Editor, [{
    key: "_getPathInScreenCoords",

    /* HELPERS */
    value: function _getPathInScreenCoords(coordinates, type) {
      var _this2 = this;

      if (coordinates.length === 0) {
        return '';
      }

      var screenCoords = coordinates.map(function (p) {
        return _this2.project(p);
      });
      var pathString = '';

      switch (type) {
        case _constants.GEOJSON_TYPE.POINT:
          return screenCoords;

        case _constants.GEOJSON_TYPE.LINE_STRING:
          pathString = screenCoords.map(function (p) {
            return "".concat(p[0], ",").concat(p[1]);
          }).join('L');
          return "M ".concat(pathString);

        case _constants.GEOJSON_TYPE.POLYGON:
          pathString = screenCoords.map(function (p) {
            return "".concat(p[0], ",").concat(p[1]);
          }).join('L');
          return "M ".concat(pathString, " z");

        default:
          return null;
      }
    }
  }]);

  return Editor;
}(_modeHandler["default"]);

exports["default"] = Editor;

_defineProperty(Editor, "defaultProps", defaultProps);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lZGl0b3IudHN4Il0sIm5hbWVzIjpbImRlZmF1bHRQcm9wcyIsIk1vZGVIYW5kbGVyIiwiY2xpY2tSYWRpdXMiLCJmZWF0dXJlU2hhcGUiLCJlZGl0SGFuZGxlU2hhcGUiLCJlZGl0SGFuZGxlU3R5bGUiLCJkZWZhdWx0RWRpdEhhbmRsZVN0eWxlIiwiZmVhdHVyZVN0eWxlIiwiZGVmYXVsdEZlYXR1cmVTdHlsZSIsImZlYXR1cmVzRHJhZ2dhYmxlIiwiRWRpdG9yIiwiZWRpdEhhbmRsZSIsInJlbmRlclN0YXRlIiwic3RhdGUiLCJwb2ludGVyRG93blBpY2tzIiwiaG92ZXJlZCIsImVkaXRIYW5kbGVJbmRleCIsInByb3BlcnRpZXMiLCJwb3NpdGlvbkluZGV4ZXMiLCJkcmFnZ2luZ0VkaXRIYW5kbGVJbmRleCIsInBpY2tlZE9iamVjdCIsIm9iamVjdCIsImd1aWRlVHlwZSIsIkdVSURFX1RZUEUiLCJFRElUX0hBTkRMRSIsImluZGV4Iiwic2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcyIsImluY2x1ZGVzIiwiUkVOREVSX1NUQVRFIiwiU0VMRUNURUQiLCJ0eXBlIiwiRUxFTUVOVF9UWVBFIiwiSE9WRVJFRCIsIkNVUlNPUl9FRElUX0hBTkRMRSIsIkNMT1NJTkciLCJJTkFDVElWRSIsInNlbGVjdGVkRmVhdHVyZUluZGV4IiwiX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4IiwiRkVBVFVSRSIsImZlYXR1cmVJbmRleCIsInN0eWxlUHJvcCIsInBhcmFtcyIsImZlYXR1cmUiLCJjb29yZGluYXRlcyIsInAiLCJwcm9qZWN0IiwiZWRpdEhhbmRsZVR5cGUiLCJwcm9wcyIsImxlbmd0aCIsInNoYXBlIiwiX2dldFN0eWxlUHJvcCIsIl9nZXRFZGl0SGFuZGxlU3RhdGUiLCJzdHlsZSIsInBvaW50ZXJFdmVudHMiLCJlbGVtS2V5Iiwic3Ryb2tlIiwiZmlsbCIsImZpbGxPcGFjaXR5IiwiaGVpZ2h0Iiwid2lkdGgiLCJwYXRoIiwiX2dldFBhdGhJblNjcmVlbkNvb3JkcyIsIkdFT0pTT05fVFlQRSIsIkxJTkVfU1RSSU5HIiwicmFkaXVzIiwib3RoZXJzIiwiU0VHTUVOVCIsInN0cm9rZVdpZHRoIiwib3BhY2l0eSIsInNlZ21lbnRzIiwiaSIsInB1c2giLCJfcmVuZGVyU2VnbWVudCIsIlBPTFlHT04iLCJGSUxMIiwiY3Vyc29yRWRpdEhhbmRsZSIsImdlb2pzb25UeXBlIiwiZ2VvbWV0cnkiLCJBcnJheSIsImlzQXJyYXkiLCJmaXJzdENvb3JkcyIsImxhc3RDb29yZHMiLCJ1bmNvbW1pdHRlZFN0eWxlIiwiVU5DT01NSVRURUQiLCJjb21taXR0ZWRQYXRoIiwidW5jb21taXR0ZWRQYXRoIiwiY2xvc2luZ1BhdGgiLCJfcmVuZGVyRmlsbCIsIlNIQVBFIiwiY29tbWl0dGVkU3R5bGUiLCJjdXJzb3JDb29yZHMiLCJfcmVuZGVyU2VnbWVudHMiLCJzbGljZSIsImNsb3NpbmdTdHlsZSIsIlJFQ1RBTkdMRSIsImZpbHRlciIsIkJvb2xlYW4iLCJndWlkZUZlYXR1cmVzIiwiZmVhdHVyZXMiLCJnZXRGZWF0dXJlcyIsImZpbmQiLCJmIiwidGVudGF0aXZlRmVhdHVyZSIsIlRFTlRBVElWRSIsIm1hcCIsImd1aWRlIiwiX3JlbmRlclRlbnRhdGl2ZUZlYXR1cmUiLCJfcmVuZGVyRWRpdEhhbmRsZSIsIl9nZXRGZWF0dXJlUmVuZGVyU3RhdGUiLCJzZWxlY3RlZCIsIlBPSU5UIiwiX3JlbmRlclBvaW50IiwiX3JlbmRlclBhdGgiLCJDSVJDTEUiLCJfcmVuZGVyUG9seWdvbiIsImd1aWRlcyIsIl9tb2RlSGFuZGxlciIsImdldEd1aWRlcyIsImdldE1vZGVQcm9wcyIsIl9yZW5kZXJGZWF0dXJlIiwiX3JlbmRlckd1aWRlcyIsInZpZXdwb3J0IiwiX2NvbnRleHQiLCJfIiwiX2NvbnRhaW5lclJlZiIsIl9yZW5kZXJDYW52YXMiLCJzY3JlZW5Db29yZHMiLCJwYXRoU3RyaW5nIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUtBOztB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M0MsQ0FBZ0QsR0FBaEQsQ0FBYjtBQUNBLDZCQUFZRCxVQUFaOztBQUVGO0FBQ0UsaUJBQU8sSUFBUDtBQWJKO0FBZUQ7Ozs7RUEzQmlDOUgsdUI7Ozs7Z0JBQWZTLE0sa0JBQ0dWLFkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IEZlYXR1cmUgfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHsgR2VvSnNvblR5cGUsIFJlbmRlclN0YXRlLCBJZCB9IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQgeyBSRU5ERVJfU1RBVEUsIFNIQVBFLCBHRU9KU09OX1RZUEUsIEdVSURFX1RZUEUsIEVMRU1FTlRfVFlQRSB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCBNb2RlSGFuZGxlciBmcm9tICcuL21vZGUtaGFuZGxlcic7XG5pbXBvcnQgeyBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMgfSBmcm9tICcuL2VkaXQtbW9kZXMvdXRpbHMnO1xuXG5pbXBvcnQge1xuICBlZGl0SGFuZGxlU3R5bGUgYXMgZGVmYXVsdEVkaXRIYW5kbGVTdHlsZSxcbiAgZmVhdHVyZVN0eWxlIGFzIGRlZmF1bHRGZWF0dXJlU3R5bGUsXG59IGZyb20gJy4vc3R5bGUnO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIC4uLk1vZGVIYW5kbGVyLmRlZmF1bHRQcm9wcyxcbiAgY2xpY2tSYWRpdXM6IDAsXG4gIGZlYXR1cmVTaGFwZTogJ2NpcmNsZScsXG4gIGVkaXRIYW5kbGVTaGFwZTogJ3JlY3QnLFxuICBlZGl0SGFuZGxlU3R5bGU6IGRlZmF1bHRFZGl0SGFuZGxlU3R5bGUsXG4gIGZlYXR1cmVTdHlsZTogZGVmYXVsdEZlYXR1cmVTdHlsZSxcbiAgZmVhdHVyZXNEcmFnZ2FibGU6IHRydWUsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0b3IgZXh0ZW5kcyBNb2RlSGFuZGxlciB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbiAgLyogSEVMUEVSUyAqL1xuICBfZ2V0UGF0aEluU2NyZWVuQ29vcmRzKGNvb3JkaW5hdGVzOiBhbnksIHR5cGU6IEdlb0pzb25UeXBlKSB7XG4gICAgaWYgKGNvb3JkaW5hdGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGNvbnN0IHNjcmVlbkNvb3JkcyA9IGNvb3JkaW5hdGVzLm1hcCgocCkgPT4gdGhpcy5wcm9qZWN0KHApKTtcblxuICAgIGxldCBwYXRoU3RyaW5nID0gJyc7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIEdFT0pTT05fVFlQRS5QT0lOVDpcbiAgICAgICAgcmV0dXJuIHNjcmVlbkNvb3JkcztcblxuICAgICAgY2FzZSBHRU9KU09OX1RZUEUuTElORV9TVFJJTkc6XG4gICAgICAgIHBhdGhTdHJpbmcgPSBzY3JlZW5Db29yZHMubWFwKChwKSA9PiBgJHtwWzBdfSwke3BbMV19YCkuam9pbignTCcpO1xuICAgICAgICByZXR1cm4gYE0gJHtwYXRoU3RyaW5nfWA7XG5cbiAgICAgIGNhc2UgR0VPSlNPTl9UWVBFLlBPTFlHT046XG4gICAgICAgIHBhdGhTdHJpbmcgPSBzY3JlZW5Db29yZHMubWFwKChwKSA9PiBgJHtwWzBdfSwke3BbMV19YCkuam9pbignTCcpO1xuICAgICAgICByZXR1cm4gYE0gJHtwYXRoU3RyaW5nfSB6YDtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgX2dldEVkaXRIYW5kbGVTdGF0ZSA9IChlZGl0SGFuZGxlOiBGZWF0dXJlLCByZW5kZXJTdGF0ZTogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCkgPT4ge1xuICAgIGNvbnN0IHsgcG9pbnRlckRvd25QaWNrcywgaG92ZXJlZCB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChyZW5kZXJTdGF0ZSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0YXRlO1xuICAgIH1cblxuICAgIGNvbnN0IGVkaXRIYW5kbGVJbmRleCA9IGVkaXRIYW5kbGUucHJvcGVydGllcy5wb3NpdGlvbkluZGV4ZXNbMF07XG4gICAgbGV0IGRyYWdnaW5nRWRpdEhhbmRsZUluZGV4ID0gbnVsbDtcbiAgICBjb25zdCBwaWNrZWRPYmplY3QgPSBwb2ludGVyRG93blBpY2tzICYmIHBvaW50ZXJEb3duUGlja3NbMF0gJiYgcG9pbnRlckRvd25QaWNrc1swXS5vYmplY3Q7XG4gICAgaWYgKHBpY2tlZE9iamVjdCAmJiBwaWNrZWRPYmplY3QuZ3VpZGVUeXBlID09PSBHVUlERV9UWVBFLkVESVRfSEFORExFKSB7XG4gICAgICBkcmFnZ2luZ0VkaXRIYW5kbGVJbmRleCA9IHBpY2tlZE9iamVjdC5pbmRleDtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBlZGl0SGFuZGxlSW5kZXggPT09IGRyYWdnaW5nRWRpdEhhbmRsZUluZGV4IHx8XG4gICAgICB0aGlzLnN0YXRlLnNlbGVjdGVkRWRpdEhhbmRsZUluZGV4ZXMuaW5jbHVkZXMoZWRpdEhhbmRsZUluZGV4KVxuICAgICkge1xuICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5TRUxFQ1RFRDtcbiAgICB9XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmIChob3ZlcmVkICYmIGhvdmVyZWQudHlwZSA9PT0gRUxFTUVOVF9UWVBFLkVESVRfSEFORExFKSB7XG4gICAgICBpZiAoaG92ZXJlZC5pbmRleCA9PT0gZWRpdEhhbmRsZUluZGV4KSB7XG4gICAgICAgIHJldHVybiBSRU5ERVJfU1RBVEUuSE9WRVJFRDtcbiAgICAgIH1cblxuICAgICAgLy8gY3Vyc29yIGhvdmVyZWQgb24gZmlyc3QgdmVydGV4IHdoZW4gZHJhd2luZyBwb2x5Z29uXG4gICAgICBpZiAoXG4gICAgICAgIGhvdmVyZWQuaW5kZXggPT09IDAgJiZcbiAgICAgICAgZWRpdEhhbmRsZS5wcm9wZXJ0aWVzLmd1aWRlVHlwZSA9PT0gR1VJREVfVFlQRS5DVVJTT1JfRURJVF9IQU5ETEVcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gUkVOREVSX1NUQVRFLkNMT1NJTkc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFJFTkRFUl9TVEFURS5JTkFDVElWRTtcbiAgfTtcblxuICBfZ2V0RmVhdHVyZVJlbmRlclN0YXRlID0gKGluZGV4OiBudW1iZXIsIHJlbmRlclN0YXRlOiBSZW5kZXJTdGF0ZSB8IG51bGwgfCB1bmRlZmluZWQpID0+IHtcbiAgICBjb25zdCB7IGhvdmVyZWQgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXggPSB0aGlzLl9nZXRTZWxlY3RlZEZlYXR1cmVJbmRleCgpO1xuICAgIGlmIChyZW5kZXJTdGF0ZSkge1xuICAgICAgcmV0dXJuIHJlbmRlclN0YXRlO1xuICAgIH1cblxuICAgIGlmIChpbmRleCA9PT0gc2VsZWN0ZWRGZWF0dXJlSW5kZXgpIHtcbiAgICAgIHJldHVybiBSRU5ERVJfU1RBVEUuU0VMRUNURUQ7XG4gICAgfVxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAoaG92ZXJlZCAmJiBob3ZlcmVkLnR5cGUgPT09IEVMRU1FTlRfVFlQRS5GRUFUVVJFICYmIGhvdmVyZWQuZmVhdHVyZUluZGV4ID09PSBpbmRleCkge1xuICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5IT1ZFUkVEO1xuICAgIH1cblxuICAgIHJldHVybiBSRU5ERVJfU1RBVEUuSU5BQ1RJVkU7XG4gIH07XG5cbiAgX2dldFN0eWxlUHJvcCA9IChzdHlsZVByb3A6IGFueSwgcGFyYW1zOiBhbnkpID0+IHtcbiAgICByZXR1cm4gdHlwZW9mIHN0eWxlUHJvcCA9PT0gJ2Z1bmN0aW9uJyA/IHN0eWxlUHJvcChwYXJhbXMpIDogc3R5bGVQcm9wO1xuICB9O1xuXG4gIC8qIFJFTkRFUiAqL1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG1heC1wYXJhbXMgKi9cbiAgX3JlbmRlckVkaXRIYW5kbGUgPSAoZWRpdEhhbmRsZTogRmVhdHVyZSwgZmVhdHVyZTogRmVhdHVyZSkgPT4ge1xuICAgIC8qIGVzbGludC1lbmFibGUgbWF4LXBhcmFtcyAqL1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0RmVhdHVyZUNvb3JkaW5hdGVzKGVkaXRIYW5kbGUpO1xuICAgIGNvbnN0IHAgPSB0aGlzLnByb2plY3QoY29vcmRpbmF0ZXMgJiYgY29vcmRpbmF0ZXNbMF0pO1xuICAgIGlmICghcCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qge1xuICAgICAgcHJvcGVydGllczogeyBmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgZWRpdEhhbmRsZVR5cGUgfSxcbiAgICB9ID0gZWRpdEhhbmRsZTtcbiAgICBjb25zdCB7IGNsaWNrUmFkaXVzLCBlZGl0SGFuZGxlU2hhcGUsIGVkaXRIYW5kbGVTdHlsZSB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGluZGV4ID0gcG9zaXRpb25JbmRleGVzLmxlbmd0aCA+IDEgPyBwb3NpdGlvbkluZGV4ZXNbMV0gOiBwb3NpdGlvbkluZGV4ZXNbMF07XG5cbiAgICBjb25zdCBzaGFwZSA9IHRoaXMuX2dldFN0eWxlUHJvcChlZGl0SGFuZGxlU2hhcGUsIHtcbiAgICAgIGZlYXR1cmU6IGZlYXR1cmUgfHwgZWRpdEhhbmRsZSxcbiAgICAgIGluZGV4LFxuICAgICAgZmVhdHVyZUluZGV4LFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgc3RhdGU6IHRoaXMuX2dldEVkaXRIYW5kbGVTdGF0ZShlZGl0SGFuZGxlKSxcbiAgICB9KTtcblxuICAgIGxldCBzdHlsZSA9IHRoaXMuX2dldFN0eWxlUHJvcChlZGl0SGFuZGxlU3R5bGUsIHtcbiAgICAgIGZlYXR1cmU6IGZlYXR1cmUgfHwgZWRpdEhhbmRsZSxcbiAgICAgIGluZGV4LFxuICAgICAgZmVhdHVyZUluZGV4LFxuICAgICAgc2hhcGUsXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBzdGF0ZTogdGhpcy5fZ2V0RWRpdEhhbmRsZVN0YXRlKGVkaXRIYW5kbGUpLFxuICAgIH0pO1xuXG4gICAgLy8gZGlzYWJsZSBldmVudHMgZm9yIGN1cnNvciBlZGl0SGFuZGxlXG4gICAgaWYgKGVkaXRIYW5kbGUucHJvcGVydGllcy5ndWlkZVR5cGUgPT09IEdVSURFX1RZUEUuQ1VSU09SX0VESVRfSEFORExFKSB7XG4gICAgICBzdHlsZSA9IHtcbiAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgIC8vIGRpc2FibGUgcG9pbnRlciBldmVudHMgZm9yIGN1cnNvclxuICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1LZXkgPSBgJHtFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEV9LiR7ZmVhdHVyZUluZGV4fS4ke2luZGV4fS4ke2VkaXRIYW5kbGVUeXBlfWA7XG4gICAgLy8gZmlyc3QgPGNpcmNsZXxyZWN0PiBpcyB0byBtYWtlIHBhdGggZWFzaWx5IGludGVyYWN0ZWQgd2l0aFxuICAgIHN3aXRjaCAoc2hhcGUpIHtcbiAgICAgIGNhc2UgJ2NpcmNsZSc6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGcga2V5PXtlbGVtS2V5fSB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtwWzBdfSwgJHtwWzFdfSlgfT5cbiAgICAgICAgICAgIDxjaXJjbGVcbiAgICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEV9XG4gICAgICAgICAgICAgIGRhdGEtaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgICAgICAga2V5PXtgJHtlbGVtS2V5fS5oaWRkZW5gfVxuICAgICAgICAgICAgICBzdHlsZT17eyAuLi5zdHlsZSwgc3Ryb2tlOiAnbm9uZScsIGZpbGw6ICcjMDAwJywgZmlsbE9wYWNpdHk6IDAgfX1cbiAgICAgICAgICAgICAgY3g9ezB9XG4gICAgICAgICAgICAgIGN5PXswfVxuICAgICAgICAgICAgICByPXtjbGlja1JhZGl1c31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Y2lyY2xlXG4gICAgICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkVESVRfSEFORExFfVxuICAgICAgICAgICAgICBkYXRhLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtmZWF0dXJlSW5kZXh9XG4gICAgICAgICAgICAgIGtleT17ZWxlbUtleX1cbiAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgICAgICBjeD17MH1cbiAgICAgICAgICAgICAgY3k9ezB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ3JlY3QnOlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxnIGtleT17ZWxlbUtleX0gdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7cFswXX0sICR7cFsxXX0pYH0+XG4gICAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5FRElUX0hBTkRMRX1cbiAgICAgICAgICAgICAgZGF0YS1pbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17ZmVhdHVyZUluZGV4fVxuICAgICAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBjbGlja1JhZGl1cyxcbiAgICAgICAgICAgICAgICB3aWR0aDogY2xpY2tSYWRpdXMsXG4gICAgICAgICAgICAgICAgZmlsbDogJyMwMDAnLFxuICAgICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICByPXtjbGlja1JhZGl1c31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5FRElUX0hBTkRMRX1cbiAgICAgICAgICAgICAgZGF0YS1pbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17ZmVhdHVyZUluZGV4fVxuICAgICAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9YH1cbiAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2c+XG4gICAgICAgICk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcblxuICBfcmVuZGVyU2VnbWVudCA9IChcbiAgICBmZWF0dXJlSW5kZXg6IElkLFxuICAgIGluZGV4OiBudW1iZXIsXG4gICAgY29vcmRpbmF0ZXM6IG51bWJlcltdLFxuICAgIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gICkgPT4ge1xuICAgIGNvbnN0IHBhdGggPSB0aGlzLl9nZXRQYXRoSW5TY3JlZW5Db29yZHMoY29vcmRpbmF0ZXMsIEdFT0pTT05fVFlQRS5MSU5FX1NUUklORyk7XG4gICAgY29uc3QgeyByYWRpdXMsIC4uLm90aGVycyB9ID0gc3R5bGU7XG4gICAgY29uc3QgeyBjbGlja1JhZGl1cyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGVsZW1LZXkgPSBgJHtFTEVNRU5UX1RZUEUuU0VHTUVOVH0uJHtmZWF0dXJlSW5kZXh9LiR7aW5kZXh9YDtcbiAgICByZXR1cm4gKFxuICAgICAgPGcga2V5PXtlbGVtS2V5fT5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuU0VHTUVOVH1cbiAgICAgICAgICBkYXRhLWluZGV4PXtpbmRleH1cbiAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLi4ub3RoZXJzLFxuICAgICAgICAgICAgc3Ryb2tlOiAncmdiYSgwLDAsMCwwKScsXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogY2xpY2tSYWRpdXMgfHwgcmFkaXVzLFxuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICB9fVxuICAgICAgICAgIGQ9e3BhdGh9XG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAga2V5PXtlbGVtS2V5fVxuICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLlNFR01FTlR9XG4gICAgICAgICAgZGF0YS1pbmRleD17aW5kZXh9XG4gICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtmZWF0dXJlSW5kZXh9XG4gICAgICAgICAgc3R5bGU9e290aGVyc31cbiAgICAgICAgICBkPXtwYXRofVxuICAgICAgICAvPlxuICAgICAgPC9nPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlclNlZ21lbnRzID0gKGZlYXR1cmVJbmRleDogSWQsIGNvb3JkaW5hdGVzOiBudW1iZXJbXSwgc3R5bGU6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IHtcbiAgICBjb25zdCBzZWdtZW50cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICBzZWdtZW50cy5wdXNoKFxuICAgICAgICB0aGlzLl9yZW5kZXJTZWdtZW50KGZlYXR1cmVJbmRleCwgaSwgW2Nvb3JkaW5hdGVzW2ldLCBjb29yZGluYXRlc1tpICsgMV1dLCBzdHlsZSlcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBzZWdtZW50cztcbiAgfTtcblxuICBfcmVuZGVyRmlsbCA9IChmZWF0dXJlSW5kZXg6IElkLCBjb29yZGluYXRlczogbnVtYmVyW10sIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgY29uc3QgcGF0aCA9IHRoaXMuX2dldFBhdGhJblNjcmVlbkNvb3Jkcyhjb29yZGluYXRlcywgR0VPSlNPTl9UWVBFLlBPTFlHT04pO1xuICAgIHJldHVybiAoXG4gICAgICA8cGF0aFxuICAgICAgICBrZXk9e2Ake0VMRU1FTlRfVFlQRS5GSUxMfS4ke2ZlYXR1cmVJbmRleH1gfVxuICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GSUxMfVxuICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIHN0cm9rZTogJ25vbmUnIH19XG4gICAgICAgIGQ9e3BhdGh9XG4gICAgICAvPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlclRlbnRhdGl2ZUZlYXR1cmUgPSAoZmVhdHVyZTogRmVhdHVyZSwgY3Vyc29yRWRpdEhhbmRsZTogRmVhdHVyZSkgPT4ge1xuICAgIGNvbnN0IHsgZmVhdHVyZVN0eWxlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtcbiAgICAgIGdlb21ldHJ5OiB7IHR5cGU6IGdlb2pzb25UeXBlIH0sXG4gICAgICBwcm9wZXJ0aWVzOiB7IHNoYXBlIH0sXG4gICAgfSA9IGZlYXR1cmU7XG5cbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyhmZWF0dXJlKTtcbiAgICBpZiAoIWNvb3JkaW5hdGVzIHx8ICFBcnJheS5pc0FycmF5KGNvb3JkaW5hdGVzKSB8fCBjb29yZGluYXRlcy5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyA+PSAyIGNvb3JkaW5hdGVzXG4gICAgY29uc3QgZmlyc3RDb29yZHMgPSBjb29yZGluYXRlc1swXTtcbiAgICBjb25zdCBsYXN0Q29vcmRzID0gY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgdW5jb21taXR0ZWRTdHlsZSA9IHRoaXMuX2dldFN0eWxlUHJvcChmZWF0dXJlU3R5bGUsIHtcbiAgICAgIGZlYXR1cmUsXG4gICAgICBpbmRleDogbnVsbCxcbiAgICAgIHN0YXRlOiBSRU5ERVJfU1RBVEUuVU5DT01NSVRURUQsXG4gICAgfSk7XG5cbiAgICBsZXQgY29tbWl0dGVkUGF0aDtcbiAgICBsZXQgdW5jb21taXR0ZWRQYXRoO1xuICAgIGxldCBjbG9zaW5nUGF0aDtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgZmlsbCA9IHRoaXMuX3JlbmRlckZpbGwoJ3RlbnRhdGl2ZScsIGNvb3JkaW5hdGVzLCB1bmNvbW1pdHRlZFN0eWxlKTtcblxuICAgIGNvbnN0IHR5cGUgPSBzaGFwZSB8fCBnZW9qc29uVHlwZTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgU0hBUEUuTElORV9TVFJJTkc6XG4gICAgICBjYXNlIFNIQVBFLlBPTFlHT046XG4gICAgICAgIGNvbnN0IGNvbW1pdHRlZFN0eWxlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGZlYXR1cmVTdHlsZSwge1xuICAgICAgICAgIGZlYXR1cmUsXG4gICAgICAgICAgc3RhdGU6IFJFTkRFUl9TVEFURS5TRUxFQ1RFRCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGN1cnNvckVkaXRIYW5kbGUpIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgY29uc3QgY3Vyc29yQ29vcmRzID0gY29vcmRpbmF0ZXNbY29vcmRpbmF0ZXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgY29tbWl0dGVkUGF0aCA9IHRoaXMuX3JlbmRlclNlZ21lbnRzKFxuICAgICAgICAgICAgJ3RlbnRhdGl2ZScsXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb29yZGluYXRlcy5zbGljZSgwLCBjb29yZGluYXRlcy5sZW5ndGggLSAxKSxcbiAgICAgICAgICAgIGNvbW1pdHRlZFN0eWxlXG4gICAgICAgICAgKTtcbiAgICAgICAgICB1bmNvbW1pdHRlZFBhdGggPSB0aGlzLl9yZW5kZXJTZWdtZW50KFxuICAgICAgICAgICAgJ3RlbnRhdGl2ZS11bmNvbW1pdHRlZCcsXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb29yZGluYXRlcy5sZW5ndGggLSAyLFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgW2N1cnNvckNvb3JkcywgbGFzdENvb3Jkc10sXG4gICAgICAgICAgICB1bmNvbW1pdHRlZFN0eWxlXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgY29tbWl0dGVkUGF0aCA9IHRoaXMuX3JlbmRlclNlZ21lbnRzKCd0ZW50YXRpdmUnLCBjb29yZGluYXRlcywgY29tbWl0dGVkU3R5bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNoYXBlID09PSBTSEFQRS5QT0xZR09OKSB7XG4gICAgICAgICAgY29uc3QgY2xvc2luZ1N0eWxlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGZlYXR1cmVTdHlsZSwge1xuICAgICAgICAgICAgZmVhdHVyZSxcbiAgICAgICAgICAgIGluZGV4OiBudWxsLFxuICAgICAgICAgICAgc3RhdGU6IFJFTkRFUl9TVEFURS5DTE9TSU5HLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2xvc2luZ1BhdGggPSB0aGlzLl9yZW5kZXJTZWdtZW50KFxuICAgICAgICAgICAgJ3RlbnRhdGl2ZS1jbG9zaW5nJyxcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBbbGFzdENvb3JkcywgZmlyc3RDb29yZHNdLFxuICAgICAgICAgICAgY2xvc2luZ1N0eWxlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFNIQVBFLlJFQ1RBTkdMRTpcbiAgICAgICAgdW5jb21taXR0ZWRQYXRoID0gdGhpcy5fcmVuZGVyU2VnbWVudHMoXG4gICAgICAgICAgJ3RlbnRhdGl2ZScsXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIFsuLi5jb29yZGluYXRlcywgZmlyc3RDb29yZHNdLFxuICAgICAgICAgIHVuY29tbWl0dGVkU3R5bGVcbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgfVxuXG4gICAgcmV0dXJuIFtmaWxsLCBjb21taXR0ZWRQYXRoLCB1bmNvbW1pdHRlZFBhdGgsIGNsb3NpbmdQYXRoXS5maWx0ZXIoQm9vbGVhbik7XG4gIH07XG5cbiAgX3JlbmRlckd1aWRlcyA9IChndWlkZUZlYXR1cmVzOiBGZWF0dXJlW10pID0+IHtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuZ2V0RmVhdHVyZXMoKTtcbiAgICBjb25zdCBjdXJzb3JFZGl0SGFuZGxlID1cbiAgICAgIGd1aWRlRmVhdHVyZXMgJiZcbiAgICAgIGd1aWRlRmVhdHVyZXMuZmluZCgoZikgPT4gZi5wcm9wZXJ0aWVzLmd1aWRlVHlwZSA9PT0gR1VJREVfVFlQRS5DVVJTT1JfRURJVF9IQU5ETEUpO1xuICAgIGNvbnN0IHRlbnRhdGl2ZUZlYXR1cmUgPSBmZWF0dXJlcy5maW5kKChmKSA9PiBmLnByb3BlcnRpZXMuZ3VpZGVUeXBlID09PSBHVUlERV9UWVBFLlRFTlRBVElWRSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGcga2V5PVwiZmVhdHVyZS1ndWlkZXNcIj5cbiAgICAgICAge2d1aWRlRmVhdHVyZXMubWFwKChndWlkZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGd1aWRlVHlwZSA9IGd1aWRlLnByb3BlcnRpZXMuZ3VpZGVUeXBlO1xuICAgICAgICAgIHN3aXRjaCAoZ3VpZGVUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIEdVSURFX1RZUEUuVEVOVEFUSVZFOlxuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyVGVudGF0aXZlRmVhdHVyZShndWlkZSwgY3Vyc29yRWRpdEhhbmRsZSk7XG4gICAgICAgICAgICBjYXNlIEdVSURFX1RZUEUuRURJVF9IQU5ETEU6XG4gICAgICAgICAgICBjYXNlIEdVSURFX1RZUEUuQ1VSU09SX0VESVRfSEFORExFOlxuICAgICAgICAgICAgICBjb25zdCBzaGFwZSA9IGd1aWRlLnByb3BlcnRpZXMuc2hhcGUgfHwgZ3VpZGUuZ2VvbWV0cnkudHlwZTtcbiAgICAgICAgICAgICAgLy8gVE9ETyB0aGlzIHNob3VsZCBiZSByZW1vdmVkIHdoZW4gZml4IGVkaXRpbmcgbW9kZVxuICAgICAgICAgICAgICAvLyBkb24ndCByZW5kZXIgY3Vyc29yIGZvciByZWN0YW5nbGVcbiAgICAgICAgICAgICAgaWYgKHNoYXBlID09PSBTSEFQRS5SRUNUQU5HTEUgJiYgZ3VpZGUucHJvcGVydGllcy5lZGl0SGFuZGxlVHlwZSA9PT0gJ2ludGVybWVkaWF0ZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zdCBmZWF0dXJlID1cbiAgICAgICAgICAgICAgICAoZmVhdHVyZXMgJiYgZmVhdHVyZXNbZ3VpZGUucHJvcGVydGllcy5mZWF0dXJlSW5kZXhdKSB8fCB0ZW50YXRpdmVGZWF0dXJlO1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVuZGVyRWRpdEhhbmRsZShndWlkZSwgZmVhdHVyZSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pfVxuICAgICAgPC9nPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlclBvaW50ID0gKGZlYXR1cmU6IEZlYXR1cmUsIGluZGV4OiBudW1iZXIsIHBhdGg6IHN0cmluZykgPT4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCByZW5kZXJTdGF0ZSA9IHRoaXMuX2dldEZlYXR1cmVSZW5kZXJTdGF0ZShpbmRleCk7XG4gICAgY29uc3QgeyBmZWF0dXJlU3R5bGUsIGZlYXR1cmVTaGFwZSwgY2xpY2tSYWRpdXMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc2hhcGUgPSB0aGlzLl9nZXRTdHlsZVByb3AoZmVhdHVyZVNoYXBlLCB7IGZlYXR1cmUsIGluZGV4LCBzdGF0ZTogcmVuZGVyU3RhdGUgfSk7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLl9nZXRTdHlsZVByb3AoZmVhdHVyZVN0eWxlLCB7IGZlYXR1cmUsIGluZGV4LCBzdGF0ZTogcmVuZGVyU3RhdGUgfSk7XG5cbiAgICBjb25zdCBlbGVtS2V5ID0gYGZlYXR1cmUuJHtpbmRleH1gO1xuICAgIGlmIChzaGFwZSA9PT0gJ3JlY3QnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZyBrZXk9e2VsZW1LZXl9IHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3BhdGhbMF1bMF19LCAke3BhdGhbMF1bMV19KWB9PlxuICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GRUFUVVJFfVxuICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGtleT17YCR7ZWxlbUtleX0uaGlkZGVuYH1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIC4uLnN0eWxlLFxuICAgICAgICAgICAgICB3aWR0aDogY2xpY2tSYWRpdXMsXG4gICAgICAgICAgICAgIGhlaWdodDogY2xpY2tSYWRpdXMsXG4gICAgICAgICAgICAgIGZpbGw6ICcjMDAwJyxcbiAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHJlY3RcbiAgICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAga2V5PXtlbGVtS2V5fVxuICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxnIGtleT17YGZlYXR1cmUuJHtpbmRleH1gfSB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtwYXRoWzBdWzBdfSwgJHtwYXRoWzBdWzFdfSlgfT5cbiAgICAgICAgPGNpcmNsZVxuICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC4uLnN0eWxlLFxuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICB9fVxuICAgICAgICAgIGN4PXswfVxuICAgICAgICAgIGN5PXswfVxuICAgICAgICAgIHI9e2NsaWNrUmFkaXVzfVxuICAgICAgICAvPlxuICAgICAgICA8Y2lyY2xlXG4gICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2luZGV4fVxuICAgICAgICAgIGtleT17ZWxlbUtleX1cbiAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgY3g9ezB9XG4gICAgICAgICAgY3k9ezB9XG4gICAgICAgIC8+XG4gICAgICA8L2c+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyUGF0aCA9IChmZWF0dXJlOiBGZWF0dXJlLCBpbmRleDogbnVtYmVyLCBwYXRoOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7IGZlYXR1cmVTdHlsZSwgY2xpY2tSYWRpdXMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXggPSB0aGlzLl9nZXRTZWxlY3RlZEZlYXR1cmVJbmRleCgpO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gaW5kZXggPT09IHNlbGVjdGVkRmVhdHVyZUluZGV4O1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCByZW5kZXJTdGF0ZSA9IHRoaXMuX2dldEZlYXR1cmVSZW5kZXJTdGF0ZShpbmRleCk7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLl9nZXRTdHlsZVByb3AoZmVhdHVyZVN0eWxlLCB7IGZlYXR1cmUsIGluZGV4LCBzdGF0ZTogcmVuZGVyU3RhdGUgfSk7XG5cbiAgICBjb25zdCBlbGVtS2V5ID0gYGZlYXR1cmUuJHtpbmRleH1gO1xuICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICA8ZyBrZXk9e2VsZW1LZXl9Pnt0aGlzLl9yZW5kZXJTZWdtZW50cyhpbmRleCwgZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcywgc3R5bGUpfTwvZz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gZmlyc3QgPHBhdGg+IGlzIHRvIG1ha2UgcGF0aCBlYXNpbHkgaW50ZXJhY3RlZCB3aXRoXG4gICAgcmV0dXJuIChcbiAgICAgIDxnIGtleT17ZWxlbUtleX0+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2luZGV4fVxuICAgICAgICAgIGtleT17YCR7ZWxlbUtleX0uaGlkZGVuYH1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgICAgICBzdHJva2U6ICdyZ2JhKDAsMCwwLDApJyxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiBjbGlja1JhZGl1cyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkPXtwYXRofVxuICAgICAgICAvPlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICBrZXk9e2VsZW1LZXl9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgIGQ9e3BhdGh9XG4gICAgICAgIC8+XG4gICAgICA8L2c+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyUG9seWdvbiA9IChmZWF0dXJlOiBGZWF0dXJlLCBpbmRleDogbnVtYmVyLCBwYXRoOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7IGZlYXR1cmVTdHlsZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleCA9IHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4KCk7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBpbmRleCA9PT0gc2VsZWN0ZWRGZWF0dXJlSW5kZXg7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHJlbmRlclN0YXRlID0gdGhpcy5fZ2V0RmVhdHVyZVJlbmRlclN0YXRlKGluZGV4KTtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuX2dldFN0eWxlUHJvcChmZWF0dXJlU3R5bGUsIHsgZmVhdHVyZSwgaW5kZXgsIHN0YXRlOiByZW5kZXJTdGF0ZSB9KTtcblxuICAgIGNvbnN0IGVsZW1LZXkgPSBgZmVhdHVyZS4ke2luZGV4fWA7XG4gICAgaWYgKHNlbGVjdGVkKSB7XG4gICAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyhmZWF0dXJlKTtcbiAgICAgIGlmICghY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZyBrZXk9e2VsZW1LZXl9PlxuICAgICAgICAgIHsvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJldHRpZXIvcHJldHRpZXJcbiAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICB0aGlzLl9yZW5kZXJGaWxsKGluZGV4LCBjb29yZGluYXRlcywgc3R5bGUpfVxuICAgICAgICAgIHsvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJldHRpZXIvcHJldHRpZXJcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgdGhpcy5fcmVuZGVyU2VnbWVudHMoaW5kZXgsIGNvb3JkaW5hdGVzLCBzdHlsZSl9XG4gICAgICAgIDwvZz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxwYXRoXG4gICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgIGtleT17ZWxlbUtleX1cbiAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICBkPXtwYXRofVxuICAgICAgLz5cbiAgICApO1xuICB9O1xuXG4gIF9yZW5kZXJGZWF0dXJlID0gKGZlYXR1cmU6IEZlYXR1cmUsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IGdldEZlYXR1cmVDb29yZGluYXRlcyhmZWF0dXJlKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKCFjb29yZGluYXRlcyB8fCAhY29vcmRpbmF0ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3Qge1xuICAgICAgcHJvcGVydGllczogeyBzaGFwZSB9LFxuICAgICAgZ2VvbWV0cnk6IHsgdHlwZTogZ2VvanNvblR5cGUgfSxcbiAgICB9ID0gZmVhdHVyZTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgcGF0aCA9IHRoaXMuX2dldFBhdGhJblNjcmVlbkNvb3Jkcyhjb29yZGluYXRlcywgZ2VvanNvblR5cGUpO1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHNoYXBlIHx8IGdlb2pzb25UeXBlO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBTSEFQRS5QT0lOVDpcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlclBvaW50KGZlYXR1cmUsIGluZGV4LCBwYXRoKTtcbiAgICAgIGNhc2UgU0hBUEUuTElORV9TVFJJTkc6XG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJQYXRoKGZlYXR1cmUsIGluZGV4LCBwYXRoKTtcblxuICAgICAgY2FzZSBTSEFQRS5DSVJDTEU6XG4gICAgICBjYXNlIFNIQVBFLlBPTFlHT046XG4gICAgICBjYXNlIFNIQVBFLlJFQ1RBTkdMRTpcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlclBvbHlnb24oZmVhdHVyZSwgaW5kZXgsIHBhdGgpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgX3JlbmRlckNhbnZhcyA9ICgpID0+IHtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuZ2V0RmVhdHVyZXMoKTtcbiAgICBjb25zdCBndWlkZXMgPSB0aGlzLl9tb2RlSGFuZGxlciAmJiB0aGlzLl9tb2RlSGFuZGxlci5nZXRHdWlkZXModGhpcy5nZXRNb2RlUHJvcHMoKSk7XG4gICAgY29uc3QgZ3VpZGVGZWF0dXJlcyA9IGd1aWRlcyAmJiBndWlkZXMuZmVhdHVyZXM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBrZXk9XCJkcmF3LWNhbnZhc1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIj5cbiAgICAgICAge2ZlYXR1cmVzICYmIGZlYXR1cmVzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIDxnIGtleT1cImZlYXR1cmUtZ3JvdXBcIj57ZmVhdHVyZXMubWFwKHRoaXMuX3JlbmRlckZlYXR1cmUpfTwvZz5cbiAgICAgICAgKX1cbiAgICAgICAge2d1aWRlRmVhdHVyZXMgJiYgZ3VpZGVGZWF0dXJlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8ZyBrZXk9XCJmZWF0dXJlLWd1aWRlc1wiPnt0aGlzLl9yZW5kZXJHdWlkZXMoZ3VpZGVGZWF0dXJlcyl9PC9nPlxuICAgICAgICApfVxuICAgICAgPC9zdmc+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IHZpZXdwb3J0ID0gKHRoaXMuX2NvbnRleHQgJiYgdGhpcy5fY29udGV4dC52aWV3cG9ydCkgfHwge307XG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcy5wcm9wcztcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgeyB3aWR0aCA9IDAsIGhlaWdodCA9IDAgfSA9IHZpZXdwb3J0O1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGlkPVwiZWRpdG9yXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgIH19XG4gICAgICAgIHJlZj17KF8pID0+IHtcbiAgICAgICAgICB0aGlzLl9jb250YWluZXJSZWYgPSBfO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5fcmVuZGVyQ2FudmFzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9O1xufVxuIl19