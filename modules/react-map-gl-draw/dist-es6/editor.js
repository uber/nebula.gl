"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
          properties = feature.properties;
      var shape = properties === null || properties === void 0 ? void 0 : properties.shape;
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

      var properties = feature.properties,
          geojsonType = feature.geometry.type;
      var shape = properties === null || properties === void 0 ? void 0 : properties.shape; // @ts-ignore

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lZGl0b3IudHN4Il0sIm5hbWVzIjpbImRlZmF1bHRQcm9wcyIsIk1vZGVIYW5kbGVyIiwiY2xpY2tSYWRpdXMiLCJmZWF0dXJlU2hhcGUiLCJlZGl0SGFuZGxlU2hhcGUiLCJlZGl0SGFuZGxlU3R5bGUiLCJkZWZhdWx0RWRpdEhhbmRsZVN0eWxlIiwiZmVhdHVyZVN0eWxlIiwiZGVmYXVsdEZlYXR1cmVTdHlsZSIsImZlYXR1cmVzRHJhZ2dhYmxlIiwiRWRpdG9yIiwiZWRpdEhhbmRsZSIsInJlbmRlclN0YXRlIiwic3RhdGUiLCJwb2ludGVyRG93blBpY2tzIiwiaG92ZXJlZCIsImVkaXRIYW5kbGVJbmRleCIsInByb3BlcnRpZXMiLCJwb3NpdGlvbkluZGV4ZXMiLCJkcmFnZ2luZ0VkaXRIYW5kbGVJbmRleCIsInBpY2tlZE9iamVjdCIsIm9iamVjdCIsImd1aWRlVHlwZSIsIkdVSURFX1RZUEUiLCJFRElUX0hBTkRMRSIsImluZGV4Iiwic2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcyIsImluY2x1ZGVzIiwiUkVOREVSX1NUQVRFIiwiU0VMRUNURUQiLCJ0eXBlIiwiRUxFTUVOVF9UWVBFIiwiSE9WRVJFRCIsIkNVUlNPUl9FRElUX0hBTkRMRSIsIkNMT1NJTkciLCJJTkFDVElWRSIsInNlbGVjdGVkRmVhdHVyZUluZGV4IiwiX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4IiwiRkVBVFVSRSIsImZlYXR1cmVJbmRleCIsInN0eWxlUHJvcCIsInBhcmFtcyIsImZlYXR1cmUiLCJjb29yZGluYXRlcyIsInAiLCJwcm9qZWN0IiwiZWRpdEhhbmRsZVR5cGUiLCJwcm9wcyIsImxlbmd0aCIsInNoYXBlIiwiX2dldFN0eWxlUHJvcCIsIl9nZXRFZGl0SGFuZGxlU3RhdGUiLCJzdHlsZSIsInBvaW50ZXJFdmVudHMiLCJlbGVtS2V5Iiwic3Ryb2tlIiwiZmlsbCIsImZpbGxPcGFjaXR5IiwiaGVpZ2h0Iiwid2lkdGgiLCJwYXRoIiwiX2dldFBhdGhJblNjcmVlbkNvb3JkcyIsIkdFT0pTT05fVFlQRSIsIkxJTkVfU1RSSU5HIiwicmFkaXVzIiwib3RoZXJzIiwiU0VHTUVOVCIsInN0cm9rZVdpZHRoIiwib3BhY2l0eSIsInNlZ21lbnRzIiwiaSIsInB1c2giLCJfcmVuZGVyU2VnbWVudCIsIlBPTFlHT04iLCJGSUxMIiwiY3Vyc29yRWRpdEhhbmRsZSIsImdlb2pzb25UeXBlIiwiZ2VvbWV0cnkiLCJBcnJheSIsImlzQXJyYXkiLCJmaXJzdENvb3JkcyIsImxhc3RDb29yZHMiLCJ1bmNvbW1pdHRlZFN0eWxlIiwiVU5DT01NSVRURUQiLCJjb21taXR0ZWRQYXRoIiwidW5jb21taXR0ZWRQYXRoIiwiY2xvc2luZ1BhdGgiLCJfcmVuZGVyRmlsbCIsIlNIQVBFIiwiY29tbWl0dGVkU3R5bGUiLCJjdXJzb3JDb29yZHMiLCJfcmVuZGVyU2VnbWVudHMiLCJzbGljZSIsImNsb3NpbmdTdHlsZSIsIlJFQ1RBTkdMRSIsImZpbHRlciIsIkJvb2xlYW4iLCJndWlkZUZlYXR1cmVzIiwiZmVhdHVyZXMiLCJnZXRGZWF0dXJlcyIsImZpbmQiLCJmIiwidGVudGF0aXZlRmVhdHVyZSIsIlRFTlRBVElWRSIsIm1hcCIsImd1aWRlIiwiX3JlbmRlclRlbnRhdGl2ZUZlYXR1cmUiLCJfcmVuZGVyRWRpdEhhbmRsZSIsIl9nZXRGZWF0dXJlUmVuZGVyU3RhdGUiLCJzZWxlY3RlZCIsIlBPSU5UIiwiX3JlbmRlclBvaW50IiwiX3JlbmRlclBhdGgiLCJDSVJDTEUiLCJfcmVuZGVyUG9seWdvbiIsImd1aWRlcyIsIl9tb2RlSGFuZGxlciIsImdldEd1aWRlcyIsImdldE1vZGVQcm9wcyIsIl9yZW5kZXJGZWF0dXJlIiwiX3JlbmRlckd1aWRlcyIsInZpZXdwb3J0IiwiX2NvbnRleHQiLCJfIiwiX2NvbnRhaW5lclJlZiIsIl9yZW5kZXJDYW52YXMiLCJzY3JlZW5Db29yZHMiLCJwYXRoU3RyaW5nIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBS0E7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QUN0QixHQUFiLENBQWlCLFVBQUM1RCxDQUFEO0FBQUEsNkJBQVVBLENBQUMsQ0FBQyxDQUFELENBQVgsY0FBa0JBLENBQUMsQ0FBQyxDQUFELENBQW5CO0FBQUEsV0FBakIsRUFBMkNvRixJQUEzQyxDQUFnRCxHQUFoRCxDQUFiO0FBQ0EsNkJBQVlELFVBQVo7O0FBRUY7QUFDRSxpQkFBTyxJQUFQO0FBYko7QUFlRDs7OztFQTNCaUM5SCx1Qjs7OztnQkFBZlMsTSxrQkFDR1YsWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgRmVhdHVyZSB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgeyBHZW9Kc29uVHlwZSwgUmVuZGVyU3RhdGUsIElkIH0gZnJvbSAnLi90eXBlcyc7XG5cbmltcG9ydCB7IFJFTkRFUl9TVEFURSwgU0hBUEUsIEdFT0pTT05fVFlQRSwgR1VJREVfVFlQRSwgRUxFTUVOVF9UWVBFIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IE1vZGVIYW5kbGVyIGZyb20gJy4vbW9kZS1oYW5kbGVyJztcbmltcG9ydCB7IGdldEZlYXR1cmVDb29yZGluYXRlcyB9IGZyb20gJy4vZWRpdC1tb2Rlcy91dGlscyc7XG5cbmltcG9ydCB7XG4gIGVkaXRIYW5kbGVTdHlsZSBhcyBkZWZhdWx0RWRpdEhhbmRsZVN0eWxlLFxuICBmZWF0dXJlU3R5bGUgYXMgZGVmYXVsdEZlYXR1cmVTdHlsZSxcbn0gZnJvbSAnLi9zdHlsZSc7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgLi4uTW9kZUhhbmRsZXIuZGVmYXVsdFByb3BzLFxuICBjbGlja1JhZGl1czogMCxcbiAgZmVhdHVyZVNoYXBlOiAnY2lyY2xlJyxcbiAgZWRpdEhhbmRsZVNoYXBlOiAncmVjdCcsXG4gIGVkaXRIYW5kbGVTdHlsZTogZGVmYXVsdEVkaXRIYW5kbGVTdHlsZSxcbiAgZmVhdHVyZVN0eWxlOiBkZWZhdWx0RmVhdHVyZVN0eWxlLFxuICBmZWF0dXJlc0RyYWdnYWJsZTogdHJ1ZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvciBleHRlbmRzIE1vZGVIYW5kbGVyIHtcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuICAvKiBIRUxQRVJTICovXG4gIF9nZXRQYXRoSW5TY3JlZW5Db29yZHMoY29vcmRpbmF0ZXM6IGFueSwgdHlwZTogR2VvSnNvblR5cGUpIHtcbiAgICBpZiAoY29vcmRpbmF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgY29uc3Qgc2NyZWVuQ29vcmRzID0gY29vcmRpbmF0ZXMubWFwKChwKSA9PiB0aGlzLnByb2plY3QocCkpO1xuXG4gICAgbGV0IHBhdGhTdHJpbmcgPSAnJztcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgR0VPSlNPTl9UWVBFLlBPSU5UOlxuICAgICAgICByZXR1cm4gc2NyZWVuQ29vcmRzO1xuXG4gICAgICBjYXNlIEdFT0pTT05fVFlQRS5MSU5FX1NUUklORzpcbiAgICAgICAgcGF0aFN0cmluZyA9IHNjcmVlbkNvb3Jkcy5tYXAoKHApID0+IGAke3BbMF19LCR7cFsxXX1gKS5qb2luKCdMJyk7XG4gICAgICAgIHJldHVybiBgTSAke3BhdGhTdHJpbmd9YDtcblxuICAgICAgY2FzZSBHRU9KU09OX1RZUEUuUE9MWUdPTjpcbiAgICAgICAgcGF0aFN0cmluZyA9IHNjcmVlbkNvb3Jkcy5tYXAoKHApID0+IGAke3BbMF19LCR7cFsxXX1gKS5qb2luKCdMJyk7XG4gICAgICAgIHJldHVybiBgTSAke3BhdGhTdHJpbmd9IHpgO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBfZ2V0RWRpdEhhbmRsZVN0YXRlID0gKGVkaXRIYW5kbGU6IEZlYXR1cmUsIHJlbmRlclN0YXRlOiBzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkKSA9PiB7XG4gICAgY29uc3QgeyBwb2ludGVyRG93blBpY2tzLCBob3ZlcmVkIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKHJlbmRlclN0YXRlKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RhdGU7XG4gICAgfVxuXG4gICAgY29uc3QgZWRpdEhhbmRsZUluZGV4ID0gZWRpdEhhbmRsZS5wcm9wZXJ0aWVzLnBvc2l0aW9uSW5kZXhlc1swXTtcbiAgICBsZXQgZHJhZ2dpbmdFZGl0SGFuZGxlSW5kZXggPSBudWxsO1xuICAgIGNvbnN0IHBpY2tlZE9iamVjdCA9IHBvaW50ZXJEb3duUGlja3MgJiYgcG9pbnRlckRvd25QaWNrc1swXSAmJiBwb2ludGVyRG93blBpY2tzWzBdLm9iamVjdDtcbiAgICBpZiAocGlja2VkT2JqZWN0ICYmIHBpY2tlZE9iamVjdC5ndWlkZVR5cGUgPT09IEdVSURFX1RZUEUuRURJVF9IQU5ETEUpIHtcbiAgICAgIGRyYWdnaW5nRWRpdEhhbmRsZUluZGV4ID0gcGlja2VkT2JqZWN0LmluZGV4O1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGVkaXRIYW5kbGVJbmRleCA9PT0gZHJhZ2dpbmdFZGl0SGFuZGxlSW5kZXggfHxcbiAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcy5pbmNsdWRlcyhlZGl0SGFuZGxlSW5kZXgpXG4gICAgKSB7XG4gICAgICByZXR1cm4gUkVOREVSX1NUQVRFLlNFTEVDVEVEO1xuICAgIH1cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKGhvdmVyZWQgJiYgaG92ZXJlZC50eXBlID09PSBFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEUpIHtcbiAgICAgIGlmIChob3ZlcmVkLmluZGV4ID09PSBlZGl0SGFuZGxlSW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5IT1ZFUkVEO1xuICAgICAgfVxuXG4gICAgICAvLyBjdXJzb3IgaG92ZXJlZCBvbiBmaXJzdCB2ZXJ0ZXggd2hlbiBkcmF3aW5nIHBvbHlnb25cbiAgICAgIGlmIChcbiAgICAgICAgaG92ZXJlZC5pbmRleCA9PT0gMCAmJlxuICAgICAgICBlZGl0SGFuZGxlLnByb3BlcnRpZXMuZ3VpZGVUeXBlID09PSBHVUlERV9UWVBFLkNVUlNPUl9FRElUX0hBTkRMRVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBSRU5ERVJfU1RBVEUuQ0xPU0lORztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUkVOREVSX1NUQVRFLklOQUNUSVZFO1xuICB9O1xuXG4gIF9nZXRGZWF0dXJlUmVuZGVyU3RhdGUgPSAoaW5kZXg6IG51bWJlciwgcmVuZGVyU3RhdGU6IFJlbmRlclN0YXRlIHwgbnVsbCB8IHVuZGVmaW5lZCkgPT4ge1xuICAgIGNvbnN0IHsgaG92ZXJlZCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleCA9IHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4KCk7XG4gICAgaWYgKHJlbmRlclN0YXRlKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RhdGU7XG4gICAgfVxuXG4gICAgaWYgKGluZGV4ID09PSBzZWxlY3RlZEZlYXR1cmVJbmRleCkge1xuICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5TRUxFQ1RFRDtcbiAgICB9XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmIChob3ZlcmVkICYmIGhvdmVyZWQudHlwZSA9PT0gRUxFTUVOVF9UWVBFLkZFQVRVUkUgJiYgaG92ZXJlZC5mZWF0dXJlSW5kZXggPT09IGluZGV4KSB7XG4gICAgICByZXR1cm4gUkVOREVSX1NUQVRFLkhPVkVSRUQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJFTkRFUl9TVEFURS5JTkFDVElWRTtcbiAgfTtcblxuICBfZ2V0U3R5bGVQcm9wID0gKHN0eWxlUHJvcDogYW55LCBwYXJhbXM6IGFueSkgPT4ge1xuICAgIHJldHVybiB0eXBlb2Ygc3R5bGVQcm9wID09PSAnZnVuY3Rpb24nID8gc3R5bGVQcm9wKHBhcmFtcykgOiBzdHlsZVByb3A7XG4gIH07XG5cbiAgLyogUkVOREVSICovXG5cbiAgLyogZXNsaW50LWRpc2FibGUgbWF4LXBhcmFtcyAqL1xuICBfcmVuZGVyRWRpdEhhbmRsZSA9IChlZGl0SGFuZGxlOiBGZWF0dXJlLCBmZWF0dXJlOiBGZWF0dXJlKSA9PiB7XG4gICAgLyogZXNsaW50LWVuYWJsZSBtYXgtcGFyYW1zICovXG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMoZWRpdEhhbmRsZSk7XG4gICAgY29uc3QgcCA9IHRoaXMucHJvamVjdChjb29yZGluYXRlcyAmJiBjb29yZGluYXRlc1swXSk7XG4gICAgaWYgKCFwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICBwcm9wZXJ0aWVzOiB7IGZlYXR1cmVJbmRleCwgcG9zaXRpb25JbmRleGVzLCBlZGl0SGFuZGxlVHlwZSB9LFxuICAgIH0gPSBlZGl0SGFuZGxlO1xuICAgIGNvbnN0IHsgY2xpY2tSYWRpdXMsIGVkaXRIYW5kbGVTaGFwZSwgZWRpdEhhbmRsZVN0eWxlIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgaW5kZXggPSBwb3NpdGlvbkluZGV4ZXMubGVuZ3RoID4gMSA/IHBvc2l0aW9uSW5kZXhlc1sxXSA6IHBvc2l0aW9uSW5kZXhlc1swXTtcblxuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGVkaXRIYW5kbGVTaGFwZSwge1xuICAgICAgZmVhdHVyZTogZmVhdHVyZSB8fCBlZGl0SGFuZGxlLFxuICAgICAgaW5kZXgsXG4gICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBzdGF0ZTogdGhpcy5fZ2V0RWRpdEhhbmRsZVN0YXRlKGVkaXRIYW5kbGUpLFxuICAgIH0pO1xuXG4gICAgbGV0IHN0eWxlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGVkaXRIYW5kbGVTdHlsZSwge1xuICAgICAgZmVhdHVyZTogZmVhdHVyZSB8fCBlZGl0SGFuZGxlLFxuICAgICAgaW5kZXgsXG4gICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICBzaGFwZSxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHN0YXRlOiB0aGlzLl9nZXRFZGl0SGFuZGxlU3RhdGUoZWRpdEhhbmRsZSksXG4gICAgfSk7XG5cbiAgICAvLyBkaXNhYmxlIGV2ZW50cyBmb3IgY3Vyc29yIGVkaXRIYW5kbGVcbiAgICBpZiAoZWRpdEhhbmRsZS5wcm9wZXJ0aWVzLmd1aWRlVHlwZSA9PT0gR1VJREVfVFlQRS5DVVJTT1JfRURJVF9IQU5ETEUpIHtcbiAgICAgIHN0eWxlID0ge1xuICAgICAgICAuLi5zdHlsZSxcbiAgICAgICAgLy8gZGlzYWJsZSBwb2ludGVyIGV2ZW50cyBmb3IgY3Vyc29yXG4gICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgZWxlbUtleSA9IGAke0VMRU1FTlRfVFlQRS5FRElUX0hBTkRMRX0uJHtmZWF0dXJlSW5kZXh9LiR7aW5kZXh9LiR7ZWRpdEhhbmRsZVR5cGV9YDtcbiAgICAvLyBmaXJzdCA8Y2lyY2xlfHJlY3Q+IGlzIHRvIG1ha2UgcGF0aCBlYXNpbHkgaW50ZXJhY3RlZCB3aXRoXG4gICAgc3dpdGNoIChzaGFwZSkge1xuICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZyBrZXk9e2VsZW1LZXl9IHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3BbMF19LCAke3BbMV19KWB9PlxuICAgICAgICAgICAgPGNpcmNsZVxuICAgICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5FRElUX0hBTkRMRX1cbiAgICAgICAgICAgICAgZGF0YS1pbmRleD17aW5kZXh9XG4gICAgICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17ZmVhdHVyZUluZGV4fVxuICAgICAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IC4uLnN0eWxlLCBzdHJva2U6ICdub25lJywgZmlsbDogJyMwMDAnLCBmaWxsT3BhY2l0eTogMCB9fVxuICAgICAgICAgICAgICBjeD17MH1cbiAgICAgICAgICAgICAgY3k9ezB9XG4gICAgICAgICAgICAgIHI9e2NsaWNrUmFkaXVzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxjaXJjbGVcbiAgICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRURJVF9IQU5ETEV9XG4gICAgICAgICAgICAgIGRhdGEtaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgICAgICAga2V5PXtlbGVtS2V5fVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgICAgIGN4PXswfVxuICAgICAgICAgICAgICBjeT17MH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9nPlxuICAgICAgICApO1xuICAgICAgY2FzZSAncmVjdCc6XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGcga2V5PXtlbGVtS2V5fSB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtwWzBdfSwgJHtwWzFdfSlgfT5cbiAgICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkVESVRfSEFORExFfVxuICAgICAgICAgICAgICBkYXRhLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtmZWF0dXJlSW5kZXh9XG4gICAgICAgICAgICAgIGtleT17YCR7ZWxlbUtleX0uaGlkZGVuYH1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAuLi5zdHlsZSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGNsaWNrUmFkaXVzLFxuICAgICAgICAgICAgICAgIHdpZHRoOiBjbGlja1JhZGl1cyxcbiAgICAgICAgICAgICAgICBmaWxsOiAnIzAwMCcsXG4gICAgICAgICAgICAgICAgZmlsbE9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIHI9e2NsaWNrUmFkaXVzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkVESVRfSEFORExFfVxuICAgICAgICAgICAgICBkYXRhLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtmZWF0dXJlSW5kZXh9XG4gICAgICAgICAgICAgIGtleT17YCR7ZWxlbUtleX1gfVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIF9yZW5kZXJTZWdtZW50ID0gKFxuICAgIGZlYXR1cmVJbmRleDogSWQsXG4gICAgaW5kZXg6IG51bWJlcixcbiAgICBjb29yZGluYXRlczogbnVtYmVyW10sXG4gICAgc3R5bGU6IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgKSA9PiB7XG4gICAgY29uc3QgcGF0aCA9IHRoaXMuX2dldFBhdGhJblNjcmVlbkNvb3Jkcyhjb29yZGluYXRlcywgR0VPSlNPTl9UWVBFLkxJTkVfU1RSSU5HKTtcbiAgICBjb25zdCB7IHJhZGl1cywgLi4ub3RoZXJzIH0gPSBzdHlsZTtcbiAgICBjb25zdCB7IGNsaWNrUmFkaXVzIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgZWxlbUtleSA9IGAke0VMRU1FTlRfVFlQRS5TRUdNRU5UfS4ke2ZlYXR1cmVJbmRleH0uJHtpbmRleH1gO1xuICAgIHJldHVybiAoXG4gICAgICA8ZyBrZXk9e2VsZW1LZXl9PlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGtleT17YCR7ZWxlbUtleX0uaGlkZGVuYH1cbiAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5TRUdNRU5UfVxuICAgICAgICAgIGRhdGEtaW5kZXg9e2luZGV4fVxuICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17ZmVhdHVyZUluZGV4fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAuLi5vdGhlcnMsXG4gICAgICAgICAgICBzdHJva2U6ICdyZ2JhKDAsMCwwLDApJyxcbiAgICAgICAgICAgIHN0cm9rZVdpZHRoOiBjbGlja1JhZGl1cyB8fCByYWRpdXMsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgIH19XG4gICAgICAgICAgZD17cGF0aH1cbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBrZXk9e2VsZW1LZXl9XG4gICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuU0VHTUVOVH1cbiAgICAgICAgICBkYXRhLWluZGV4PXtpbmRleH1cbiAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgICBzdHlsZT17b3RoZXJzfVxuICAgICAgICAgIGQ9e3BhdGh9XG4gICAgICAgIC8+XG4gICAgICA8L2c+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyU2VnbWVudHMgPSAoZmVhdHVyZUluZGV4OiBJZCwgY29vcmRpbmF0ZXM6IG51bWJlcltdLCBzdHlsZTogUmVjb3JkPHN0cmluZywgYW55PikgPT4ge1xuICAgIGNvbnN0IHNlZ21lbnRzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIHNlZ21lbnRzLnB1c2goXG4gICAgICAgIHRoaXMuX3JlbmRlclNlZ21lbnQoZmVhdHVyZUluZGV4LCBpLCBbY29vcmRpbmF0ZXNbaV0sIGNvb3JkaW5hdGVzW2kgKyAxXV0sIHN0eWxlKVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlZ21lbnRzO1xuICB9O1xuXG4gIF9yZW5kZXJGaWxsID0gKGZlYXR1cmVJbmRleDogSWQsIGNvb3JkaW5hdGVzOiBudW1iZXJbXSwgc3R5bGU6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IHtcbiAgICBjb25zdCBwYXRoID0gdGhpcy5fZ2V0UGF0aEluU2NyZWVuQ29vcmRzKGNvb3JkaW5hdGVzLCBHRU9KU09OX1RZUEUuUE9MWUdPTik7XG4gICAgcmV0dXJuIChcbiAgICAgIDxwYXRoXG4gICAgICAgIGtleT17YCR7RUxFTUVOVF9UWVBFLkZJTEx9LiR7ZmVhdHVyZUluZGV4fWB9XG4gICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZJTEx9XG4gICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17ZmVhdHVyZUluZGV4fVxuICAgICAgICBzdHlsZT17eyAuLi5zdHlsZSwgc3Ryb2tlOiAnbm9uZScgfX1cbiAgICAgICAgZD17cGF0aH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyVGVudGF0aXZlRmVhdHVyZSA9IChmZWF0dXJlOiBGZWF0dXJlLCBjdXJzb3JFZGl0SGFuZGxlOiBGZWF0dXJlKSA9PiB7XG4gICAgY29uc3QgeyBmZWF0dXJlU3R5bGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge1xuICAgICAgZ2VvbWV0cnk6IHsgdHlwZTogZ2VvanNvblR5cGUgfSxcbiAgICAgIHByb3BlcnRpZXMsXG4gICAgfSA9IGZlYXR1cmU7XG5cbiAgICBjb25zdCBzaGFwZSA9IHByb3BlcnRpZXM/LnNoYXBlO1xuXG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMoZmVhdHVyZSk7XG4gICAgaWYgKCFjb29yZGluYXRlcyB8fCAhQXJyYXkuaXNBcnJheShjb29yZGluYXRlcykgfHwgY29vcmRpbmF0ZXMubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gPj0gMiBjb29yZGluYXRlc1xuICAgIGNvbnN0IGZpcnN0Q29vcmRzID0gY29vcmRpbmF0ZXNbMF07XG4gICAgY29uc3QgbGFzdENvb3JkcyA9IGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IHVuY29tbWl0dGVkU3R5bGUgPSB0aGlzLl9nZXRTdHlsZVByb3AoZmVhdHVyZVN0eWxlLCB7XG4gICAgICBmZWF0dXJlLFxuICAgICAgaW5kZXg6IG51bGwsXG4gICAgICBzdGF0ZTogUkVOREVSX1NUQVRFLlVOQ09NTUlUVEVELFxuICAgIH0pO1xuXG4gICAgbGV0IGNvbW1pdHRlZFBhdGg7XG4gICAgbGV0IHVuY29tbWl0dGVkUGF0aDtcbiAgICBsZXQgY2xvc2luZ1BhdGg7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGZpbGwgPSB0aGlzLl9yZW5kZXJGaWxsKCd0ZW50YXRpdmUnLCBjb29yZGluYXRlcywgdW5jb21taXR0ZWRTdHlsZSk7XG5cbiAgICBjb25zdCB0eXBlID0gc2hhcGUgfHwgZ2VvanNvblR5cGU7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFNIQVBFLkxJTkVfU1RSSU5HOlxuICAgICAgY2FzZSBTSEFQRS5QT0xZR09OOlxuICAgICAgICBjb25zdCBjb21taXR0ZWRTdHlsZSA9IHRoaXMuX2dldFN0eWxlUHJvcChmZWF0dXJlU3R5bGUsIHtcbiAgICAgICAgICBmZWF0dXJlLFxuICAgICAgICAgIHN0YXRlOiBSRU5ERVJfU1RBVEUuU0VMRUNURUQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjdXJzb3JFZGl0SGFuZGxlKSB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGNvbnN0IGN1cnNvckNvb3JkcyA9IGNvb3JkaW5hdGVzW2Nvb3JkaW5hdGVzLmxlbmd0aCAtIDJdO1xuICAgICAgICAgIGNvbW1pdHRlZFBhdGggPSB0aGlzLl9yZW5kZXJTZWdtZW50cyhcbiAgICAgICAgICAgICd0ZW50YXRpdmUnLFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29vcmRpbmF0ZXMuc2xpY2UoMCwgY29vcmRpbmF0ZXMubGVuZ3RoIC0gMSksXG4gICAgICAgICAgICBjb21taXR0ZWRTdHlsZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdW5jb21taXR0ZWRQYXRoID0gdGhpcy5fcmVuZGVyU2VnbWVudChcbiAgICAgICAgICAgICd0ZW50YXRpdmUtdW5jb21taXR0ZWQnLFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgY29vcmRpbmF0ZXMubGVuZ3RoIC0gMixcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIFtjdXJzb3JDb29yZHMsIGxhc3RDb29yZHNdLFxuICAgICAgICAgICAgdW5jb21taXR0ZWRTdHlsZVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGNvbW1pdHRlZFBhdGggPSB0aGlzLl9yZW5kZXJTZWdtZW50cygndGVudGF0aXZlJywgY29vcmRpbmF0ZXMsIGNvbW1pdHRlZFN0eWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaGFwZSA9PT0gU0hBUEUuUE9MWUdPTikge1xuICAgICAgICAgIGNvbnN0IGNsb3NpbmdTdHlsZSA9IHRoaXMuX2dldFN0eWxlUHJvcChmZWF0dXJlU3R5bGUsIHtcbiAgICAgICAgICAgIGZlYXR1cmUsXG4gICAgICAgICAgICBpbmRleDogbnVsbCxcbiAgICAgICAgICAgIHN0YXRlOiBSRU5ERVJfU1RBVEUuQ0xPU0lORyxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNsb3NpbmdQYXRoID0gdGhpcy5fcmVuZGVyU2VnbWVudChcbiAgICAgICAgICAgICd0ZW50YXRpdmUtY2xvc2luZycsXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb29yZGluYXRlcy5sZW5ndGggLSAxLFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgW2xhc3RDb29yZHMsIGZpcnN0Q29vcmRzXSxcbiAgICAgICAgICAgIGNsb3NpbmdTdHlsZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBTSEFQRS5SRUNUQU5HTEU6XG4gICAgICAgIHVuY29tbWl0dGVkUGF0aCA9IHRoaXMuX3JlbmRlclNlZ21lbnRzKFxuICAgICAgICAgICd0ZW50YXRpdmUnLFxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBbLi4uY29vcmRpbmF0ZXMsIGZpcnN0Q29vcmRzXSxcbiAgICAgICAgICB1bmNvbW1pdHRlZFN0eWxlXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgIH1cblxuICAgIHJldHVybiBbZmlsbCwgY29tbWl0dGVkUGF0aCwgdW5jb21taXR0ZWRQYXRoLCBjbG9zaW5nUGF0aF0uZmlsdGVyKEJvb2xlYW4pO1xuICB9O1xuXG4gIF9yZW5kZXJHdWlkZXMgPSAoZ3VpZGVGZWF0dXJlczogRmVhdHVyZVtdKSA9PiB7XG4gICAgY29uc3QgZmVhdHVyZXMgPSB0aGlzLmdldEZlYXR1cmVzKCk7XG4gICAgY29uc3QgY3Vyc29yRWRpdEhhbmRsZSA9XG4gICAgICBndWlkZUZlYXR1cmVzICYmXG4gICAgICBndWlkZUZlYXR1cmVzLmZpbmQoKGYpID0+IGYucHJvcGVydGllcy5ndWlkZVR5cGUgPT09IEdVSURFX1RZUEUuQ1VSU09SX0VESVRfSEFORExFKTtcbiAgICBjb25zdCB0ZW50YXRpdmVGZWF0dXJlID0gZmVhdHVyZXMuZmluZCgoZikgPT4gZi5wcm9wZXJ0aWVzLmd1aWRlVHlwZSA9PT0gR1VJREVfVFlQRS5URU5UQVRJVkUpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxnIGtleT1cImZlYXR1cmUtZ3VpZGVzXCI+XG4gICAgICAgIHtndWlkZUZlYXR1cmVzLm1hcCgoZ3VpZGUpID0+IHtcbiAgICAgICAgICBjb25zdCBndWlkZVR5cGUgPSBndWlkZS5wcm9wZXJ0aWVzLmd1aWRlVHlwZTtcbiAgICAgICAgICBzd2l0Y2ggKGd1aWRlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBHVUlERV9UWVBFLlRFTlRBVElWRTpcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlclRlbnRhdGl2ZUZlYXR1cmUoZ3VpZGUsIGN1cnNvckVkaXRIYW5kbGUpO1xuICAgICAgICAgICAgY2FzZSBHVUlERV9UWVBFLkVESVRfSEFORExFOlxuICAgICAgICAgICAgY2FzZSBHVUlERV9UWVBFLkNVUlNPUl9FRElUX0hBTkRMRTpcbiAgICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSBndWlkZS5wcm9wZXJ0aWVzLnNoYXBlIHx8IGd1aWRlLmdlb21ldHJ5LnR5cGU7XG4gICAgICAgICAgICAgIC8vIFRPRE8gdGhpcyBzaG91bGQgYmUgcmVtb3ZlZCB3aGVuIGZpeCBlZGl0aW5nIG1vZGVcbiAgICAgICAgICAgICAgLy8gZG9uJ3QgcmVuZGVyIGN1cnNvciBmb3IgcmVjdGFuZ2xlXG4gICAgICAgICAgICAgIGlmIChzaGFwZSA9PT0gU0hBUEUuUkVDVEFOR0xFICYmIGd1aWRlLnByb3BlcnRpZXMuZWRpdEhhbmRsZVR5cGUgPT09ICdpbnRlcm1lZGlhdGUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc3QgZmVhdHVyZSA9XG4gICAgICAgICAgICAgICAgKGZlYXR1cmVzICYmIGZlYXR1cmVzW2d1aWRlLnByb3BlcnRpZXMuZmVhdHVyZUluZGV4XSkgfHwgdGVudGF0aXZlRmVhdHVyZTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlckVkaXRIYW5kbGUoZ3VpZGUsIGZlYXR1cmUpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgIDwvZz5cbiAgICApO1xuICB9O1xuXG4gIF9yZW5kZXJQb2ludCA9IChmZWF0dXJlOiBGZWF0dXJlLCBpbmRleDogbnVtYmVyLCBwYXRoOiBzdHJpbmcpID0+IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgcmVuZGVyU3RhdGUgPSB0aGlzLl9nZXRGZWF0dXJlUmVuZGVyU3RhdGUoaW5kZXgpO1xuICAgIGNvbnN0IHsgZmVhdHVyZVN0eWxlLCBmZWF0dXJlU2hhcGUsIGNsaWNrUmFkaXVzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGZlYXR1cmVTaGFwZSwgeyBmZWF0dXJlLCBpbmRleCwgc3RhdGU6IHJlbmRlclN0YXRlIH0pO1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGZlYXR1cmVTdHlsZSwgeyBmZWF0dXJlLCBpbmRleCwgc3RhdGU6IHJlbmRlclN0YXRlIH0pO1xuXG4gICAgY29uc3QgZWxlbUtleSA9IGBmZWF0dXJlLiR7aW5kZXh9YDtcbiAgICBpZiAoc2hhcGUgPT09ICdyZWN0Jykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGcga2V5PXtlbGVtS2V5fSB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtwYXRoWzBdWzBdfSwgJHtwYXRoWzBdWzFdfSlgfT5cbiAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAuLi5zdHlsZSxcbiAgICAgICAgICAgICAgd2lkdGg6IGNsaWNrUmFkaXVzLFxuICAgICAgICAgICAgICBoZWlnaHQ6IGNsaWNrUmFkaXVzLFxuICAgICAgICAgICAgICBmaWxsOiAnIzAwMCcsXG4gICAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAwLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GRUFUVVJFfVxuICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGtleT17ZWxlbUtleX1cbiAgICAgICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2c+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZyBrZXk9e2BmZWF0dXJlLiR7aW5kZXh9YH0gdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7cGF0aFswXVswXX0sICR7cGF0aFswXVsxXX0pYH0+XG4gICAgICAgIDxjaXJjbGVcbiAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GRUFUVVJFfVxuICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgICAga2V5PXtgJHtlbGVtS2V5fS5oaWRkZW5gfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAuLi5zdHlsZSxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjeD17MH1cbiAgICAgICAgICBjeT17MH1cbiAgICAgICAgICByPXtjbGlja1JhZGl1c31cbiAgICAgICAgLz5cbiAgICAgICAgPGNpcmNsZVxuICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICBrZXk9e2VsZW1LZXl9XG4gICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgIGN4PXswfVxuICAgICAgICAgIGN5PXswfVxuICAgICAgICAvPlxuICAgICAgPC9nPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlclBhdGggPSAoZmVhdHVyZTogRmVhdHVyZSwgaW5kZXg6IG51bWJlciwgcGF0aDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgeyBmZWF0dXJlU3R5bGUsIGNsaWNrUmFkaXVzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ID0gdGhpcy5fZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXgoKTtcbiAgICBjb25zdCBzZWxlY3RlZCA9IGluZGV4ID09PSBzZWxlY3RlZEZlYXR1cmVJbmRleDtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgcmVuZGVyU3RhdGUgPSB0aGlzLl9nZXRGZWF0dXJlUmVuZGVyU3RhdGUoaW5kZXgpO1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5fZ2V0U3R5bGVQcm9wKGZlYXR1cmVTdHlsZSwgeyBmZWF0dXJlLCBpbmRleCwgc3RhdGU6IHJlbmRlclN0YXRlIH0pO1xuXG4gICAgY29uc3QgZWxlbUtleSA9IGBmZWF0dXJlLiR7aW5kZXh9YDtcbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgPGcga2V5PXtlbGVtS2V5fT57dGhpcy5fcmVuZGVyU2VnbWVudHMoaW5kZXgsIGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMsIHN0eWxlKX08L2c+XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIGZpcnN0IDxwYXRoPiBpcyB0byBtYWtlIHBhdGggZWFzaWx5IGludGVyYWN0ZWQgd2l0aFxuICAgIHJldHVybiAoXG4gICAgICA8ZyBrZXk9e2VsZW1LZXl9PlxuICAgICAgICA8cGF0aFxuICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC4uLnN0eWxlLFxuICAgICAgICAgICAgc3Ryb2tlOiAncmdiYSgwLDAsMCwwKScsXG4gICAgICAgICAgICBzdHJva2VXaWR0aDogY2xpY2tSYWRpdXMsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgIH19XG4gICAgICAgICAgZD17cGF0aH1cbiAgICAgICAgLz5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GRUFUVVJFfVxuICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgICAga2V5PXtlbGVtS2V5fVxuICAgICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgICBkPXtwYXRofVxuICAgICAgICAvPlxuICAgICAgPC9nPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlclBvbHlnb24gPSAoZmVhdHVyZTogRmVhdHVyZSwgaW5kZXg6IG51bWJlciwgcGF0aDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgeyBmZWF0dXJlU3R5bGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlSW5kZXggPSB0aGlzLl9nZXRTZWxlY3RlZEZlYXR1cmVJbmRleCgpO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gaW5kZXggPT09IHNlbGVjdGVkRmVhdHVyZUluZGV4O1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCByZW5kZXJTdGF0ZSA9IHRoaXMuX2dldEZlYXR1cmVSZW5kZXJTdGF0ZShpbmRleCk7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLl9nZXRTdHlsZVByb3AoZmVhdHVyZVN0eWxlLCB7IGZlYXR1cmUsIGluZGV4LCBzdGF0ZTogcmVuZGVyU3RhdGUgfSk7XG5cbiAgICBjb25zdCBlbGVtS2V5ID0gYGZlYXR1cmUuJHtpbmRleH1gO1xuICAgIGlmIChzZWxlY3RlZCkge1xuICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMoZmVhdHVyZSk7XG4gICAgICBpZiAoIWNvb3JkaW5hdGVzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGcga2V5PXtlbGVtS2V5fT5cbiAgICAgICAgICB7Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZXR0aWVyL3ByZXR0aWVyXG4gICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgdGhpcy5fcmVuZGVyRmlsbChpbmRleCwgY29vcmRpbmF0ZXMsIHN0eWxlKX1cbiAgICAgICAgICB7Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZXR0aWVyL3ByZXR0aWVyXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIHRoaXMuX3JlbmRlclNlZ21lbnRzKGluZGV4LCBjb29yZGluYXRlcywgc3R5bGUpfVxuICAgICAgICA8L2c+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8cGF0aFxuICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GRUFUVVJFfVxuICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2luZGV4fVxuICAgICAgICBrZXk9e2VsZW1LZXl9XG4gICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgZD17cGF0aH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyRmVhdHVyZSA9IChmZWF0dXJlOiBGZWF0dXJlLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBnZXRGZWF0dXJlQ29vcmRpbmF0ZXMoZmVhdHVyZSk7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmICghY29vcmRpbmF0ZXMgfHwgIWNvb3JkaW5hdGVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHtcbiAgICAgIHByb3BlcnRpZXMsXG4gICAgICBnZW9tZXRyeTogeyB0eXBlOiBnZW9qc29uVHlwZSB9LFxuICAgIH0gPSBmZWF0dXJlO1xuXG4gICAgY29uc3Qgc2hhcGUgPSBwcm9wZXJ0aWVzPy5zaGFwZTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgcGF0aCA9IHRoaXMuX2dldFBhdGhJblNjcmVlbkNvb3Jkcyhjb29yZGluYXRlcywgZ2VvanNvblR5cGUpO1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdHlwZSA9IHNoYXBlIHx8IGdlb2pzb25UeXBlO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBTSEFQRS5QT0lOVDpcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlclBvaW50KGZlYXR1cmUsIGluZGV4LCBwYXRoKTtcbiAgICAgIGNhc2UgU0hBUEUuTElORV9TVFJJTkc6XG4gICAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJQYXRoKGZlYXR1cmUsIGluZGV4LCBwYXRoKTtcblxuICAgICAgY2FzZSBTSEFQRS5DSVJDTEU6XG4gICAgICBjYXNlIFNIQVBFLlBPTFlHT046XG4gICAgICBjYXNlIFNIQVBFLlJFQ1RBTkdMRTpcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlclBvbHlnb24oZmVhdHVyZSwgaW5kZXgsIHBhdGgpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgX3JlbmRlckNhbnZhcyA9ICgpID0+IHtcbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuZ2V0RmVhdHVyZXMoKTtcbiAgICBjb25zdCBndWlkZXMgPSB0aGlzLl9tb2RlSGFuZGxlciAmJiB0aGlzLl9tb2RlSGFuZGxlci5nZXRHdWlkZXModGhpcy5nZXRNb2RlUHJvcHMoKSk7XG4gICAgY29uc3QgZ3VpZGVGZWF0dXJlcyA9IGd1aWRlcyAmJiBndWlkZXMuZmVhdHVyZXM7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyBrZXk9XCJkcmF3LWNhbnZhc1wiIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIj5cbiAgICAgICAge2ZlYXR1cmVzICYmIGZlYXR1cmVzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIDxnIGtleT1cImZlYXR1cmUtZ3JvdXBcIj57ZmVhdHVyZXMubWFwKHRoaXMuX3JlbmRlckZlYXR1cmUpfTwvZz5cbiAgICAgICAgKX1cbiAgICAgICAge2d1aWRlRmVhdHVyZXMgJiYgZ3VpZGVGZWF0dXJlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8ZyBrZXk9XCJmZWF0dXJlLWd1aWRlc1wiPnt0aGlzLl9yZW5kZXJHdWlkZXMoZ3VpZGVGZWF0dXJlcyl9PC9nPlxuICAgICAgICApfVxuICAgICAgPC9zdmc+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IHZpZXdwb3J0ID0gKHRoaXMuX2NvbnRleHQgJiYgdGhpcy5fY29udGV4dC52aWV3cG9ydCkgfHwge307XG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcy5wcm9wcztcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgeyB3aWR0aCA9IDAsIGhlaWdodCA9IDAgfSA9IHZpZXdwb3J0O1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGlkPVwiZWRpdG9yXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgIH19XG4gICAgICAgIHJlZj17KF8pID0+IHtcbiAgICAgICAgICB0aGlzLl9jb250YWluZXJSZWYgPSBfO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5fcmVuZGVyQ2FudmFzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9O1xufVxuIl19