"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactMapGl = require("react-map-gl");

var React = _interopRequireWildcard(require("react"));

var _editModes = require("@nebula.gl/edit-modes");

var _editingMode = _interopRequireDefault(require("./edit-modes/editing-mode"));

var _utils = require("./edit-modes/utils");

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

var defaultProps = {
  selectable: true,
  mode: null,
  features: null,
  onSelect: null,
  onUpdate: null,
  onUpdateCursor: function onUpdateCursor() {}
};
var defaultState = {
  featureCollection: new _editModes.ImmutableFeatureCollection({
    type: 'FeatureCollection',
    features: []
  }),
  selectedFeatureIndex: null,
  selectedEditHandleIndexes: [],
  // index, isGuide, mapCoords, screenCoords
  hovered: null,
  isDragging: false,
  didDrag: false,
  lastPointerMoveEvent: null,
  pointerDownPicks: null,
  pointerDownScreenCoords: null,
  pointerDownMapCoords: null
};

var ModeHandler = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ModeHandler, _React$PureComponent);

  var _super = _createSuper(ModeHandler);

  function ModeHandler(props) {
    var _this;

    _classCallCheck(this, ModeHandler);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "_events", void 0);

    _defineProperty(_assertThisInitialized(_this), "_eventsRegistered", void 0);

    _defineProperty(_assertThisInitialized(_this), "_modeHandler", void 0);

    _defineProperty(_assertThisInitialized(_this), "_context", void 0);

    _defineProperty(_assertThisInitialized(_this), "_containerRef", void 0);

    _defineProperty(_assertThisInitialized(_this), "getFeatures", function () {
      var featureCollection = _this._getFeatureCollection();

      featureCollection = featureCollection && featureCollection.getObject();
      return featureCollection && featureCollection.features;
    });

    _defineProperty(_assertThisInitialized(_this), "addFeatures", function (features) {
      var featureCollection = _this._getFeatureCollection();

      if (featureCollection) {
        if (!Array.isArray(features)) {
          features = [features];
        }

        featureCollection = featureCollection.addFeatures(features);

        _this.setState({
          featureCollection: featureCollection
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "deleteFeatures", function (featureIndexes) {
      var featureCollection = _this._getFeatureCollection();

      var selectedFeatureIndex = _this._getSelectedFeatureIndex();

      if (featureCollection) {
        if (!Array.isArray(featureIndexes)) {
          featureIndexes = [featureIndexes];
        }

        featureCollection = featureCollection.deleteFeatures(featureIndexes);
        var newState = {
          featureCollection: featureCollection
        };

        if (featureIndexes.findIndex(function (index) {
          return selectedFeatureIndex === index;
        }) >= 0) {
          newState.selectedFeatureIndex = null;
          newState.selectedEditHandleIndexes = [];
        }

        _this.setState(newState);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "deleteHandles", function (featureIndex, handleIndexes) {
      var featureCollection = _this._getFeatureCollection();

      if (!featureIndex) {
        featureIndex = _this._getSelectedFeatureIndex();
      }

      if (!handleIndexes) {
        if (!_this.state.selectedEditHandleIndexes.length) {
          return featureCollection;
        }

        handleIndexes = _this.state.selectedEditHandleIndexes;
      }

      var features = featureCollection.getObject().features; // It seems currently only POLYGON and LINE_STRING are supported
      // see handleClick event in editing-mode.ts

      var allowedTypes = [_constants.GEOJSON_TYPE.LINE_STRING, _constants.GEOJSON_TYPE.POLYGON];

      if (featureIndex !== null && features[featureIndex] && allowedTypes.includes(features[featureIndex].geometry.type)) {
        // Remove first indexes in DESC order
        handleIndexes.sort(function (n1, n2) {
          return n2 - n1;
        });
        var positionIndexes;

        if (features[featureIndex].geometry.type === _constants.GEOJSON_TYPE.LINE_STRING) {
          positionIndexes = handleIndexes.map(function (pos) {
            return [pos];
          });
        } else {
          // Currently only spport to handle simple polygons, thus pos 0
          positionIndexes = handleIndexes.map(function (pos) {
            return [0, pos];
          });
        }

        positionIndexes.forEach(function (pos) {
          featureCollection = featureCollection.removePosition(featureIndex, pos);
        });

        var selectedEditHandleIndexes = _this.state.selectedEditHandleIndexes.filter(function (handleIndex) {
          return !handleIndexes.includes(handleIndex);
        });

        _this.setState({
          featureCollection: featureCollection,
          selectedEditHandleIndexes: selectedEditHandleIndexes
        });
      }

      return featureCollection;
    });

    _defineProperty(_assertThisInitialized(_this), "_getMemorizedFeatureCollection", (0, _editModes._memoize)(function (_ref) {
      var propsFeatures = _ref.propsFeatures,
          stateFeatures = _ref.stateFeatures;
      var features = propsFeatures || stateFeatures; // Any changes in ImmutableFeatureCollection will create a new object

      if (features instanceof _editModes.ImmutableFeatureCollection) {
        return features;
      }

      if (features && features.type === 'FeatureCollection') {
        return new _editModes.ImmutableFeatureCollection({
          type: 'FeatureCollection',
          features: features.features
        });
      }

      return new _editModes.ImmutableFeatureCollection({
        type: 'FeatureCollection',
        features: features || []
      });
    }));

    _defineProperty(_assertThisInitialized(_this), "_getFeatureCollection", function () {
      return _this._getMemorizedFeatureCollection({
        propsFeatures: _this.props.features,
        stateFeatures: _this.state.featureCollection
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_setupModeHandler", function () {
      var mode = _this.props.mode;
      _this._modeHandler = mode;

      if (!mode) {
        _this._degregisterEvents();

        return;
      }

      _this._registerEvents();
    });

    _defineProperty(_assertThisInitialized(_this), "_clearEditingState", function () {
      _this.setState({
        selectedFeatureIndex: null,
        selectedEditHandleIndexes: [],
        hovered: null,
        pointerDownPicks: null,
        pointerDownScreenCoords: null,
        pointerDownMapCoords: null,
        isDragging: false,
        didDrag: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_getSelectedFeatureIndex", function () {
      if ('selectedFeatureIndex' in _this.props) {
        return _this.props.selectedFeatureIndex;
      }

      return _this.state.selectedFeatureIndex;
    });

    _defineProperty(_assertThisInitialized(_this), "_onSelect", function (selected) {
      var selectedFeatureIndex = selected.selectedFeatureIndex;
      var selectedEditHandleIndexes = _this.state.selectedEditHandleIndexes;
      var newState = {
        selectedFeatureIndex: selectedFeatureIndex,
        selectedEditHandleIndexes: selectedEditHandleIndexes
      };

      if (_this.state.selectedFeatureIndex !== selectedFeatureIndex) {
        newState.selectedEditHandleIndexes = [];
      }

      _this.setState(newState);

      if (_this.props.onSelect) {
        _this.props.onSelect(selected);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onEdit", function (editAction) {
      var editType = editAction.editType,
          updatedData = editAction.updatedData,
          editContext = editAction.editContext;
      var newState = {
        featureCollection: new _editModes.ImmutableFeatureCollection(updatedData)
      };

      if (editType === _constants.EDIT_TYPE.ADD_POSITION) {
        // @ts-ignore
        newState.selectedEditHandleIndexes = [];
      }

      _this.setState(newState);

      switch (editType) {
        case _constants.EDIT_TYPE.ADD_FEATURE:
          _this._onSelect({
            selectedFeature: null,
            selectedFeatureIndex: null,
            selectedEditHandleIndex: null,
            selectedEditHandleIndexes: [],
            screenCoords: editContext && editContext.screenCoords,
            mapCoords: editContext && editContext.mapCoords
          });

          break;

        default:
      }

      if (_this.props.onUpdate) {
        _this.props.onUpdate({
          data: updatedData && updatedData.features,
          editType: editType,
          editContext: editContext
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_degregisterEvents", function () {
      var eventManager = _this._context && _this._context.eventManager;

      if (!_this._events || !eventManager) {
        return;
      }

      if (_this._eventsRegistered) {
        eventManager.off(_this._events);
        _this._eventsRegistered = false;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_registerEvents", function () {
      var ref = _this._containerRef;
      var eventManager = _this._context && _this._context.eventManager;

      if (!_this._events || !ref || !eventManager) {
        return;
      }

      if (_this._eventsRegistered) {
        return;
      }

      eventManager.on(_this._events, ref);
      _this._eventsRegistered = true;
    });

    _defineProperty(_assertThisInitialized(_this), "_onEvent", function (handler, evt, stopPropagation) {
      var event = _this._getEvent(evt);

      handler(event);

      if (stopPropagation) {
        evt.stopImmediatePropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onClick", function (event) {
      var modeProps = _this.getModeProps(); // TODO refactor EditingMode
      // @ts-ignore


      if (_this._modeHandler instanceof _editingMode["default"] || _this.props.selectable) {
        var mapCoords = event.mapCoords,
            screenCoords = event.screenCoords;
        var pickedObject = event.picks && event.picks[0];

        var selectedEditHandleIndexes = _toConsumableArray(_this.state.selectedEditHandleIndexes); // @ts-ignore


        if (pickedObject && (0, _utils.isNumeric)(pickedObject.featureIndex)) {
          var handleIndex = // @ts-ignore
          pickedObject.type === _constants.ELEMENT_TYPE.EDIT_HANDLE ? pickedObject.index : null;
          var index = selectedEditHandleIndexes.indexOf(handleIndex);

          if (handleIndex !== null) {
            if (index !== -1) {
              selectedEditHandleIndexes.splice(index, 1);
            } else {
              selectedEditHandleIndexes.push(handleIndex);
            }

            _this.setState({
              selectedEditHandleIndexes: selectedEditHandleIndexes
            });
          } // @ts-ignore


          var selectedFeatureIndex = pickedObject.featureIndex;

          _this._onSelect({
            selectedFeature: pickedObject.object,
            selectedFeatureIndex: selectedFeatureIndex,
            selectedEditHandleIndex: handleIndex,
            selectedEditHandleIndexes: selectedEditHandleIndexes,
            // @ts-ignore
            mapCoords: mapCoords,
            screenCoords: screenCoords
          });
        } else {
          _this._onSelect({
            selectedFeature: null,
            selectedFeatureIndex: null,
            selectedEditHandleIndex: null,
            selectedEditHandleIndexes: selectedEditHandleIndexes,
            // @ts-ignore
            mapCoords: mapCoords,
            screenCoords: screenCoords
          });
        }
      }

      _this._modeHandler.handleClick(event, modeProps);
    });

    _defineProperty(_assertThisInitialized(_this), "_onDblclick", function (event) {
      if ((0, _utils.isNumeric)(_this._getSelectedFeatureIndex())) {
        event.sourceEvent.stopImmediatePropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onPointerMove", function (event) {
      // hovering
      var hovered = _this._getHoverState(event);

      var _this$state = _this.state,
          isDragging = _this$state.isDragging,
          didDrag = _this$state.didDrag,
          pointerDownPicks = _this$state.pointerDownPicks,
          pointerDownScreenCoords = _this$state.pointerDownScreenCoords,
          pointerDownMapCoords = _this$state.pointerDownMapCoords;

      if (isDragging && !didDrag && pointerDownScreenCoords) {
        var dx = event.screenCoords[0] - pointerDownScreenCoords[0];
        var dy = event.screenCoords[1] - pointerDownScreenCoords[1];

        if (dx * dx + dy * dy > 5) {
          _this.setState({
            didDrag: true
          });
        }
      }

      var pointerMoveEvent = _objectSpread({}, event, {
        isDragging: isDragging,
        pointerDownPicks: pointerDownPicks,
        pointerDownScreenCoords: pointerDownScreenCoords,
        pointerDownMapCoords: pointerDownMapCoords,
        cancelPan: event.sourceEvent.stopImmediatePropagation
      });

      if (_this.state.didDrag) {
        var modeProps = _this.getModeProps();

        if (_this._modeHandler.handleDragging) {
          _this._modeHandler.handleDragging(pointerMoveEvent, modeProps);
        } else {
          _this._modeHandler.handlePointerMove(pointerMoveEvent, modeProps);
        }
      }

      _this.setState({
        hovered: hovered,
        // @ts-ignore
        lastPointerMoveEvent: pointerMoveEvent
      });
    });

    _defineProperty(_assertThisInitialized(_this), "_onPointerDown", function (event) {
      var dragToDraw = _this.props.modeConfig && _this.props.modeConfig.dragToDraw;
      var isDragging = Boolean(event.picks && event.picks[0]) || dragToDraw;

      var startDraggingEvent = _objectSpread({}, event, {
        isDragging: isDragging,
        pointerDownScreenCoords: event.screenCoords,
        pointerDownMapCoords: event.mapCoords,
        cancelPan: event.sourceEvent.stopImmediatePropagation
      });

      var newState = {
        isDragging: isDragging,
        pointerDownPicks: event.picks,
        pointerDownScreenCoords: event.screenCoords,
        pointerDownMapCoords: event.mapCoords
      }; // @ts-ignore

      _this.setState(newState);

      var modeProps = _this.getModeProps();

      _this._modeHandler.handleStartDragging(startDraggingEvent, modeProps);
    });

    _defineProperty(_assertThisInitialized(_this), "_onPointerUp", function (event) {
      var _this$state2 = _this.state,
          didDrag = _this$state2.didDrag,
          pointerDownPicks = _this$state2.pointerDownPicks,
          pointerDownScreenCoords = _this$state2.pointerDownScreenCoords,
          pointerDownMapCoords = _this$state2.pointerDownMapCoords;

      var stopDraggingEvent = _objectSpread({}, event, {
        isDragging: false,
        pointerDownPicks: didDrag ? pointerDownPicks : null,
        pointerDownScreenCoords: didDrag ? pointerDownScreenCoords : null,
        pointerDownMapCoords: didDrag ? pointerDownMapCoords : null,
        cancelPan: event.sourceEvent.cancelPan
      });

      var newState = {
        isDragging: false,
        didDrag: false,
        pointerDownPicks: null,
        pointerDownScreenCoords: null,
        pointerDownMapCoords: null
      };

      _this.setState(newState);

      var modeProps = _this.getModeProps();

      if (didDrag) {
        _this._modeHandler.handleStopDragging(stopDraggingEvent, modeProps);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "_onPan", function (event) {
      var isDragging = _this.state.isDragging;

      if (isDragging) {
        event.sourceEvent.stopImmediatePropagation();
      }

      if (_this._modeHandler.handlePan) {
        _this._modeHandler.handlePan(event, _this.getModeProps());
      }
    });

    _defineProperty(_assertThisInitialized(_this), "project", function (pt) {
      var viewport = _this._context && _this._context.viewport;
      return viewport && viewport.project(pt);
    });

    _defineProperty(_assertThisInitialized(_this), "unproject", function (pt) {
      var viewport = _this._context && _this._context.viewport;
      return viewport && viewport.unproject(pt);
    });

    _defineProperty(_assertThisInitialized(_this), "_getHoverState", function (event) {
      var object = event.picks && event.picks[0];

      if (!object) {
        return null;
      }

      return _objectSpread({
        screenCoords: event.screenCoords,
        mapCoords: event.mapCoords
      }, object);
    });

    _this.state = defaultState;
    _this._eventsRegistered = false;
    _this._events = {
      anyclick: function anyclick(evt) {
        return _this._onEvent(_this._onClick, evt, true);
      },
      dblclick: function dblclick(evt) {
        return _this._onEvent(_this._onDblclick, evt, false);
      },
      click: function click(evt) {
        return evt.stopImmediatePropagation();
      },
      pointermove: function pointermove(evt) {
        return _this._onEvent(_this._onPointerMove, evt, false);
      },
      pointerdown: function pointerdown(evt) {
        return _this._onEvent(_this._onPointerDown, evt, true);
      },
      pointerup: function pointerup(evt) {
        return _this._onEvent(_this._onPointerUp, evt, true);
      },
      panmove: function panmove(evt) {
        return _this._onEvent(_this._onPan, evt, false);
      },
      panstart: function panstart(evt) {
        return _this._onEvent(_this._onPan, evt, false);
      },
      panend: function panend(evt) {
        return _this._onEvent(_this._onPan, evt, false);
      }
    };
    return _this;
  }

  _createClass(ModeHandler, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._setupModeHandler();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.mode !== this.props.mode) {
        this._clearEditingState();

        this._setupModeHandler();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._degregisterEvents();
    }
  }, {
    key: "getModeProps",
    value: function getModeProps() {
      var featureCollection = this._getFeatureCollection();

      var lastPointerMoveEvent = this.state.lastPointerMoveEvent;

      var selectedFeatureIndex = this._getSelectedFeatureIndex();

      var selectedEditHandleIndexes = this.state.selectedEditHandleIndexes;
      var viewport = this._context && this._context.viewport;
      return {
        data: featureCollection && featureCollection.featureCollection,
        selectedIndexes: (0, _utils.isNumeric)(selectedFeatureIndex) ? [selectedFeatureIndex] : [],
        selectedEditHandleIndexes: selectedEditHandleIndexes,
        lastPointerMoveEvent: lastPointerMoveEvent,
        viewport: viewport,
        featuresDraggable: this.props.featuresDraggable,
        onEdit: this._onEdit,
        onUpdateCursor: this.props.onUpdateCursor,
        modeConfig: this.props.modeConfig
      };
    }
    /* MEMORIZERS */

  }, {
    key: "_getEvent",
    value: function _getEvent(evt) {
      var features = this.getFeatures();

      var guides = this._modeHandler.getGuides(this.getModeProps());

      var picked = (0, _utils.parseEventElement)(evt, features, guides && guides.features);
      var screenCoords = (0, _utils.getScreenCoords)(evt); // @ts-ignore

      var mapCoords = this.unproject(screenCoords);
      return {
        picks: picked ? [picked] : null,
        screenCoords: screenCoords,
        mapCoords: mapCoords,
        sourceEvent: evt
      };
    }
  }, {
    key: "_render",
    value: function _render() {
      return /*#__PURE__*/React.createElement("div", null);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/React.createElement(_reactMapGl._MapContext.Consumer, null, function (context) {
        _this2._context = context;
        var viewport = context && context.viewport;

        if (!viewport || viewport.height <= 0 || viewport.width <= 0) {
          return null;
        }

        return _this2._render();
      });
    }
  }]);

  return ModeHandler;
}(React.PureComponent);

exports["default"] = ModeHandler;

_defineProperty(ModeHandler, "displayName", 'ModeHandler');

_defineProperty(ModeHandler, "defaultProps", defaultProps);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlLWhhbmRsZXIudHN4Il0sIm5hbWVzIjpbImRlZmF1bHRQcm9wcyIsInNlbGVjdGFibGUiLCJtb2RlIiwiZmVhdHVyZXMiLCJvblNlbGVjdCIsIm9uVXBkYXRlIiwib25VcGRhdGVDdXJzb3IiLCJkZWZhdWx0U3RhdGUiLCJmZWF0dXJlQ29sbGVjdGlvbiIsIkltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIiwidHlwZSIsInNlbGVjdGVkRmVhdHVyZUluZGV4Iiwic2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcyIsImhvdmVyZWQiLCJpc0RyYWdnaW5nIiwiZGlkRHJhZyIsImxhc3RQb2ludGVyTW92ZUV2ZW50IiwicG9pbnRlckRvd25QaWNrcyIsInBvaW50ZXJEb3duU2NyZWVuQ29vcmRzIiwicG9pbnRlckRvd25NYXBDb29yZHMiLCJNb2RlSGFuZGxlciIsInByb3BzIiwiX2dldEZlYXR1cmVDb2xsZWN0aW9uIiwiZ2V0T2JqZWN0IiwiQXJyYXkiLCJpc0FycmF5IiwiYWRkRmVhdHVyZXMiLCJzZXRTdGF0ZSIsImZlYXR1cmVJbmRleGVzIiwiX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4IiwiZGVsZXRlRmVhdHVyZXMiLCJuZXdTdGF0ZSIsImZpbmRJbmRleCIsImluZGV4IiwiZmVhdHVyZUluZGV4IiwiaGFuZGxlSW5kZXhlcyIsInN0YXRlIiwibGVuZ3RoIiwiYWxsb3dlZFR5cGVzIiwiR0VPSlNPTl9UWVBFIiwiTElORV9TVFJJTkciLCJQT0xZR09OIiwiaW5jbHVkZXMiLCJnZW9tZXRyeSIsInNvcnQiLCJuMSIsIm4yIiwicG9zaXRpb25JbmRleGVzIiwibWFwIiwicG9zIiwiZm9yRWFjaCIsInJlbW92ZVBvc2l0aW9uIiwiZmlsdGVyIiwiaGFuZGxlSW5kZXgiLCJwcm9wc0ZlYXR1cmVzIiwic3RhdGVGZWF0dXJlcyIsIl9nZXRNZW1vcml6ZWRGZWF0dXJlQ29sbGVjdGlvbiIsIl9tb2RlSGFuZGxlciIsIl9kZWdyZWdpc3RlckV2ZW50cyIsIl9yZWdpc3RlckV2ZW50cyIsInNlbGVjdGVkIiwiZWRpdEFjdGlvbiIsImVkaXRUeXBlIiwidXBkYXRlZERhdGEiLCJlZGl0Q29udGV4dCIsIkVESVRfVFlQRSIsIkFERF9QT1NJVElPTiIsIkFERF9GRUFUVVJFIiwiX29uU2VsZWN0Iiwic2VsZWN0ZWRGZWF0dXJlIiwic2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXgiLCJzY3JlZW5Db29yZHMiLCJtYXBDb29yZHMiLCJkYXRhIiwiZXZlbnRNYW5hZ2VyIiwiX2NvbnRleHQiLCJfZXZlbnRzIiwiX2V2ZW50c1JlZ2lzdGVyZWQiLCJvZmYiLCJyZWYiLCJfY29udGFpbmVyUmVmIiwib24iLCJoYW5kbGVyIiwiZXZ0Iiwic3RvcFByb3BhZ2F0aW9uIiwiZXZlbnQiLCJfZ2V0RXZlbnQiLCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24iLCJtb2RlUHJvcHMiLCJnZXRNb2RlUHJvcHMiLCJFZGl0aW5nTW9kZSIsInBpY2tlZE9iamVjdCIsInBpY2tzIiwiRUxFTUVOVF9UWVBFIiwiRURJVF9IQU5ETEUiLCJpbmRleE9mIiwic3BsaWNlIiwicHVzaCIsIm9iamVjdCIsImhhbmRsZUNsaWNrIiwic291cmNlRXZlbnQiLCJfZ2V0SG92ZXJTdGF0ZSIsImR4IiwiZHkiLCJwb2ludGVyTW92ZUV2ZW50IiwiY2FuY2VsUGFuIiwiaGFuZGxlRHJhZ2dpbmciLCJoYW5kbGVQb2ludGVyTW92ZSIsImRyYWdUb0RyYXciLCJtb2RlQ29uZmlnIiwiQm9vbGVhbiIsInN0YXJ0RHJhZ2dpbmdFdmVudCIsImhhbmRsZVN0YXJ0RHJhZ2dpbmciLCJzdG9wRHJhZ2dpbmdFdmVudCIsImhhbmRsZVN0b3BEcmFnZ2luZyIsImhhbmRsZVBhbiIsInB0Iiwidmlld3BvcnQiLCJwcm9qZWN0IiwidW5wcm9qZWN0IiwiYW55Y2xpY2siLCJfb25FdmVudCIsIl9vbkNsaWNrIiwiZGJsY2xpY2siLCJfb25EYmxjbGljayIsImNsaWNrIiwicG9pbnRlcm1vdmUiLCJfb25Qb2ludGVyTW92ZSIsInBvaW50ZXJkb3duIiwiX29uUG9pbnRlckRvd24iLCJwb2ludGVydXAiLCJfb25Qb2ludGVyVXAiLCJwYW5tb3ZlIiwiX29uUGFuIiwicGFuc3RhcnQiLCJwYW5lbmQiLCJfc2V0dXBNb2RlSGFuZGxlciIsInByZXZQcm9wcyIsIl9jbGVhckVkaXRpbmdTdGF0ZSIsInNlbGVjdGVkSW5kZXhlcyIsImZlYXR1cmVzRHJhZ2dhYmxlIiwib25FZGl0IiwiX29uRWRpdCIsImdldEZlYXR1cmVzIiwiZ3VpZGVzIiwiZ2V0R3VpZGVzIiwicGlja2VkIiwiY29udGV4dCIsImhlaWdodCIsIndpZHRoIiwiX3JlbmRlciIsIlJlYWN0IiwiUHVyZUNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQVdBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUc7QUFDbkJDLEVBQUFBLFVBQVUsRUFBRSxJQURPO0FBRW5CQyxFQUFBQSxJQUFJLEVBQUUsSUFGYTtBQUduQkMsRUFBQUEsUUFBUSxFQUFFLElBSFM7QUFJbkJDLEVBQUFBLFFBQVEsRUFBRSxJQUpTO0FBS25CQyxFQUFBQSxRQUFRLEVBQUUsSUFMUztBQU1uQkMsRUFBQUEsY0FBYyxFQUFFLDBCQUFNLENBQUU7QUFOTCxDQUFyQjtBQVNBLElBQU1DLFlBQVksR0FBRztBQUNuQkMsRUFBQUEsaUJBQWlCLEVBQUUsSUFBSUMscUNBQUosQ0FBK0I7QUFDaERDLElBQUFBLElBQUksRUFBRSxtQkFEMEM7QUFFaERQLElBQUFBLFFBQVEsRUFBRTtBQUZzQyxHQUEvQixDQURBO0FBTW5CUSxFQUFBQSxvQkFBb0IsRUFBRSxJQU5IO0FBT25CQyxFQUFBQSx5QkFBeUIsRUFBRSxFQVBSO0FBU25CO0FBQ0FDLEVBQUFBLE9BQU8sRUFBRSxJQVZVO0FBWW5CQyxFQUFBQSxVQUFVLEVBQUUsS0FaTztBQWFuQkMsRUFBQUEsT0FBTyxF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Q0FBM0QsRUFBOEQ7QUFDNUQsaUJBQU8sSUFBUDtBQUNEOztBQUVELGVBQU8sTUFBSSxDQUFDQyxPQUFMLEVBQVA7QUFDRCxPQVZILENBREY7QUFjRDs7OztFQTNmc0NDLEtBQUssQ0FBQ0MsYTs7OztnQkFBMUJwSSxXLGlCQUNFLGE7O2dCQURGQSxXLGtCQUVHcEIsWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IF9NYXBDb250ZXh0IGFzIE1hcENvbnRleHQsIE1hcENvbnRleHRQcm9wcyB9IGZyb20gJ3JlYWN0LW1hcC1nbCc7XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbixcbiAgRmVhdHVyZSxcbiAgRmVhdHVyZUNvbGxlY3Rpb24sXG4gIEVkaXRBY3Rpb24sXG4gIF9tZW1vaXplIGFzIG1lbW9pemUsXG59IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5cbmltcG9ydCB7IE1qb2xuaXJFdmVudCB9IGZyb20gJ21qb2xuaXIuanMnO1xuaW1wb3J0IHsgQmFzZUV2ZW50LCBFZGl0b3JQcm9wcywgRWRpdG9yU3RhdGUsIFNlbGVjdEFjdGlvbiB9IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQgRWRpdGluZ01vZGUgZnJvbSAnLi9lZGl0LW1vZGVzL2VkaXRpbmctbW9kZSc7XG5pbXBvcnQgeyBnZXRTY3JlZW5Db29yZHMsIHBhcnNlRXZlbnRFbGVtZW50LCBpc051bWVyaWMgfSBmcm9tICcuL2VkaXQtbW9kZXMvdXRpbHMnO1xuaW1wb3J0IHsgRURJVF9UWVBFLCBFTEVNRU5UX1RZUEUsIEdFT0pTT05fVFlQRSB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBzZWxlY3RhYmxlOiB0cnVlLFxuICBtb2RlOiBudWxsLFxuICBmZWF0dXJlczogbnVsbCxcbiAgb25TZWxlY3Q6IG51bGwsXG4gIG9uVXBkYXRlOiBudWxsLFxuICBvblVwZGF0ZUN1cnNvcjogKCkgPT4ge30sXG59O1xuXG5jb25zdCBkZWZhdWx0U3RhdGUgPSB7XG4gIGZlYXR1cmVDb2xsZWN0aW9uOiBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oe1xuICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgZmVhdHVyZXM6IFtdLFxuICB9KSxcblxuICBzZWxlY3RlZEZlYXR1cmVJbmRleDogbnVsbCxcbiAgc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlczogW10sXG5cbiAgLy8gaW5kZXgsIGlzR3VpZGUsIG1hcENvb3Jkcywgc2NyZWVuQ29vcmRzXG4gIGhvdmVyZWQ6IG51bGwsXG5cbiAgaXNEcmFnZ2luZzogZmFsc2UsXG4gIGRpZERyYWc6IGZhbHNlLFxuXG4gIGxhc3RQb2ludGVyTW92ZUV2ZW50OiBudWxsLFxuXG4gIHBvaW50ZXJEb3duUGlja3M6IG51bGwsXG4gIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBudWxsLFxuICBwb2ludGVyRG93bk1hcENvb3JkczogbnVsbCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZGVIYW5kbGVyIGV4dGVuZHMgUmVhY3QuUHVyZUNvbXBvbmVudDxFZGl0b3JQcm9wcywgRWRpdG9yU3RhdGU+IHtcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ01vZGVIYW5kbGVyJztcbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogRWRpdG9yUHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IGRlZmF1bHRTdGF0ZTtcbiAgICB0aGlzLl9ldmVudHNSZWdpc3RlcmVkID0gZmFsc2U7XG5cbiAgICB0aGlzLl9ldmVudHMgPSB7XG4gICAgICBhbnljbGljazogKGV2dCkgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vbkNsaWNrLCBldnQsIHRydWUpLFxuICAgICAgZGJsY2xpY2s6IChldnQpID0+IHRoaXMuX29uRXZlbnQodGhpcy5fb25EYmxjbGljaywgZXZ0LCBmYWxzZSksXG4gICAgICBjbGljazogKGV2dCkgPT4gZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpLFxuICAgICAgcG9pbnRlcm1vdmU6IChldnQpID0+IHRoaXMuX29uRXZlbnQodGhpcy5fb25Qb2ludGVyTW92ZSwgZXZ0LCBmYWxzZSksXG4gICAgICBwb2ludGVyZG93bjogKGV2dCkgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vblBvaW50ZXJEb3duLCBldnQsIHRydWUpLFxuICAgICAgcG9pbnRlcnVwOiAoZXZ0KSA9PiB0aGlzLl9vbkV2ZW50KHRoaXMuX29uUG9pbnRlclVwLCBldnQsIHRydWUpLFxuICAgICAgcGFubW92ZTogKGV2dCkgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vblBhbiwgZXZ0LCBmYWxzZSksXG4gICAgICBwYW5zdGFydDogKGV2dCkgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vblBhbiwgZXZ0LCBmYWxzZSksXG4gICAgICBwYW5lbmQ6IChldnQpID0+IHRoaXMuX29uRXZlbnQodGhpcy5fb25QYW4sIGV2dCwgZmFsc2UpLFxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLl9zZXR1cE1vZGVIYW5kbGVyKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzOiBFZGl0b3JQcm9wcykge1xuICAgIGlmIChwcmV2UHJvcHMubW9kZSAhPT0gdGhpcy5wcm9wcy5tb2RlKSB7XG4gICAgICB0aGlzLl9jbGVhckVkaXRpbmdTdGF0ZSgpO1xuICAgICAgdGhpcy5fc2V0dXBNb2RlSGFuZGxlcigpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuX2RlZ3JlZ2lzdGVyRXZlbnRzKCk7XG4gIH1cblxuICBfZXZlbnRzOiBhbnk7XG4gIF9ldmVudHNSZWdpc3RlcmVkOiBib29sZWFuO1xuICBfbW9kZUhhbmRsZXI6IGFueTtcbiAgX2NvbnRleHQ6IE1hcENvbnRleHRQcm9wcyB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIF9jb250YWluZXJSZWY6IEhUTUxFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICBnZXRGZWF0dXJlcyA9ICgpID0+IHtcbiAgICBsZXQgZmVhdHVyZUNvbGxlY3Rpb24gPSB0aGlzLl9nZXRGZWF0dXJlQ29sbGVjdGlvbigpO1xuICAgIGZlYXR1cmVDb2xsZWN0aW9uID0gZmVhdHVyZUNvbGxlY3Rpb24gJiYgZmVhdHVyZUNvbGxlY3Rpb24uZ2V0T2JqZWN0KCk7XG4gICAgcmV0dXJuIGZlYXR1cmVDb2xsZWN0aW9uICYmIGZlYXR1cmVDb2xsZWN0aW9uLmZlYXR1cmVzO1xuICB9O1xuXG4gIGFkZEZlYXR1cmVzID0gKGZlYXR1cmVzOiBGZWF0dXJlIHwgRmVhdHVyZVtdKSA9PiB7XG4gICAgbGV0IGZlYXR1cmVDb2xsZWN0aW9uID0gdGhpcy5fZ2V0RmVhdHVyZUNvbGxlY3Rpb24oKTtcbiAgICBpZiAoZmVhdHVyZUNvbGxlY3Rpb24pIHtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShmZWF0dXJlcykpIHtcbiAgICAgICAgZmVhdHVyZXMgPSBbZmVhdHVyZXNdO1xuICAgICAgfVxuXG4gICAgICBmZWF0dXJlQ29sbGVjdGlvbiA9IGZlYXR1cmVDb2xsZWN0aW9uLmFkZEZlYXR1cmVzKGZlYXR1cmVzKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBmZWF0dXJlQ29sbGVjdGlvbiB9KTtcbiAgICB9XG4gIH07XG5cbiAgZGVsZXRlRmVhdHVyZXMgPSAoZmVhdHVyZUluZGV4ZXM6IG51bWJlciB8IG51bWJlcltdKSA9PiB7XG4gICAgbGV0IGZlYXR1cmVDb2xsZWN0aW9uID0gdGhpcy5fZ2V0RmVhdHVyZUNvbGxlY3Rpb24oKTtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleCA9IHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4KCk7XG4gICAgaWYgKGZlYXR1cmVDb2xsZWN0aW9uKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZmVhdHVyZUluZGV4ZXMpKSB7XG4gICAgICAgIGZlYXR1cmVJbmRleGVzID0gW2ZlYXR1cmVJbmRleGVzXTtcbiAgICAgIH1cbiAgICAgIGZlYXR1cmVDb2xsZWN0aW9uID0gZmVhdHVyZUNvbGxlY3Rpb24uZGVsZXRlRmVhdHVyZXMoZmVhdHVyZUluZGV4ZXMpO1xuICAgICAgY29uc3QgbmV3U3RhdGU6IGFueSA9IHsgZmVhdHVyZUNvbGxlY3Rpb24gfTtcbiAgICAgIGlmIChmZWF0dXJlSW5kZXhlcy5maW5kSW5kZXgoKGluZGV4KSA9PiBzZWxlY3RlZEZlYXR1cmVJbmRleCA9PT0gaW5kZXgpID49IDApIHtcbiAgICAgICAgbmV3U3RhdGUuc2VsZWN0ZWRGZWF0dXJlSW5kZXggPSBudWxsO1xuICAgICAgICBuZXdTdGF0ZS5zZWxlY3RlZEVkaXRIYW5kbGVJbmRleGVzID0gW107XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcbiAgICB9XG4gIH07XG5cbiAgZGVsZXRlSGFuZGxlcyA9IChcbiAgICBmZWF0dXJlSW5kZXg6IG51bWJlciB8IHVuZGVmaW5lZCxcbiAgICBoYW5kbGVJbmRleGVzOiBudW1iZXJbXSB8IHVuZGVmaW5lZFxuICApOiBGZWF0dXJlQ29sbGVjdGlvbiA9PiB7XG4gICAgbGV0IGZlYXR1cmVDb2xsZWN0aW9uID0gdGhpcy5fZ2V0RmVhdHVyZUNvbGxlY3Rpb24oKTtcbiAgICBpZiAoIWZlYXR1cmVJbmRleCkge1xuICAgICAgZmVhdHVyZUluZGV4ID0gdGhpcy5fZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXgoKTtcbiAgICB9XG4gICAgaWYgKCFoYW5kbGVJbmRleGVzKSB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGZlYXR1cmVDb2xsZWN0aW9uO1xuICAgICAgfVxuICAgICAgaGFuZGxlSW5kZXhlcyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcztcbiAgICB9XG4gICAgY29uc3QgZmVhdHVyZXMgPSBmZWF0dXJlQ29sbGVjdGlvbi5nZXRPYmplY3QoKS5mZWF0dXJlcztcbiAgICAvLyBJdCBzZWVtcyBjdXJyZW50bHkgb25seSBQT0xZR09OIGFuZCBMSU5FX1NUUklORyBhcmUgc3VwcG9ydGVkXG4gICAgLy8gc2VlIGhhbmRsZUNsaWNrIGV2ZW50IGluIGVkaXRpbmctbW9kZS50c1xuICAgIGNvbnN0IGFsbG93ZWRUeXBlcyA9IFtHRU9KU09OX1RZUEUuTElORV9TVFJJTkcsIEdFT0pTT05fVFlQRS5QT0xZR09OXTtcbiAgICBpZiAoXG4gICAgICBmZWF0dXJlSW5kZXggIT09IG51bGwgJiZcbiAgICAgIGZlYXR1cmVzW2ZlYXR1cmVJbmRleF0gJiZcbiAgICAgIGFsbG93ZWRUeXBlcy5pbmNsdWRlcyhmZWF0dXJlc1tmZWF0dXJlSW5kZXhdLmdlb21ldHJ5LnR5cGUpXG4gICAgKSB7XG4gICAgICAvLyBSZW1vdmUgZmlyc3QgaW5kZXhlcyBpbiBERVNDIG9yZGVyXG4gICAgICBoYW5kbGVJbmRleGVzLnNvcnQoKG4xLCBuMikgPT4gbjIgLSBuMSk7XG4gICAgICBsZXQgcG9zaXRpb25JbmRleGVzO1xuICAgICAgaWYgKGZlYXR1cmVzW2ZlYXR1cmVJbmRleF0uZ2VvbWV0cnkudHlwZSA9PT0gR0VPSlNPTl9UWVBFLkxJTkVfU1RSSU5HKSB7XG4gICAgICAgIHBvc2l0aW9uSW5kZXhlcyA9IGhhbmRsZUluZGV4ZXMubWFwKChwb3MpID0+IFtwb3NdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEN1cnJlbnRseSBvbmx5IHNwcG9ydCB0byBoYW5kbGUgc2ltcGxlIHBvbHlnb25zLCB0aHVzIHBvcyAwXG4gICAgICAgIHBvc2l0aW9uSW5kZXhlcyA9IGhhbmRsZUluZGV4ZXMubWFwKChwb3MpID0+IFswLCBwb3NdKTtcbiAgICAgIH1cbiAgICAgIHBvc2l0aW9uSW5kZXhlcy5mb3JFYWNoKChwb3MpID0+IHtcbiAgICAgICAgZmVhdHVyZUNvbGxlY3Rpb24gPSBmZWF0dXJlQ29sbGVjdGlvbi5yZW1vdmVQb3NpdGlvbihmZWF0dXJlSW5kZXgsIHBvcyk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkRWRpdEhhbmRsZUluZGV4ZXMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkRWRpdEhhbmRsZUluZGV4ZXMuZmlsdGVyKFxuICAgICAgICAoaGFuZGxlSW5kZXgpID0+ICFoYW5kbGVJbmRleGVzLmluY2x1ZGVzKGhhbmRsZUluZGV4KVxuICAgICAgKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBmZWF0dXJlQ29sbGVjdGlvbiwgc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcyB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZlYXR1cmVDb2xsZWN0aW9uO1xuICB9O1xuXG4gIGdldE1vZGVQcm9wcygpIHtcbiAgICBjb25zdCBmZWF0dXJlQ29sbGVjdGlvbiA9IHRoaXMuX2dldEZlYXR1cmVDb2xsZWN0aW9uKCk7XG5cbiAgICBjb25zdCB7IGxhc3RQb2ludGVyTW92ZUV2ZW50IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ID0gdGhpcy5fZ2V0U2VsZWN0ZWRGZWF0dXJlSW5kZXgoKTtcbiAgICBjb25zdCBzZWxlY3RlZEVkaXRIYW5kbGVJbmRleGVzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZEVkaXRIYW5kbGVJbmRleGVzO1xuICAgIGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5fY29udGV4dCAmJiB0aGlzLl9jb250ZXh0LnZpZXdwb3J0O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGE6IGZlYXR1cmVDb2xsZWN0aW9uICYmIGZlYXR1cmVDb2xsZWN0aW9uLmZlYXR1cmVDb2xsZWN0aW9uLFxuICAgICAgc2VsZWN0ZWRJbmRleGVzOiBpc051bWVyaWMoc2VsZWN0ZWRGZWF0dXJlSW5kZXgpID8gW3NlbGVjdGVkRmVhdHVyZUluZGV4XSA6IFtdLFxuICAgICAgc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcyxcbiAgICAgIGxhc3RQb2ludGVyTW92ZUV2ZW50LFxuICAgICAgdmlld3BvcnQsXG4gICAgICBmZWF0dXJlc0RyYWdnYWJsZTogdGhpcy5wcm9wcy5mZWF0dXJlc0RyYWdnYWJsZSxcbiAgICAgIG9uRWRpdDogdGhpcy5fb25FZGl0LFxuICAgICAgb25VcGRhdGVDdXJzb3I6IHRoaXMucHJvcHMub25VcGRhdGVDdXJzb3IsXG4gICAgICBtb2RlQ29uZmlnOiB0aGlzLnByb3BzLm1vZGVDb25maWcsXG4gICAgfTtcbiAgfVxuXG4gIC8qIE1FTU9SSVpFUlMgKi9cbiAgX2dldE1lbW9yaXplZEZlYXR1cmVDb2xsZWN0aW9uID0gbWVtb2l6ZSgoeyBwcm9wc0ZlYXR1cmVzLCBzdGF0ZUZlYXR1cmVzIH06IGFueSkgPT4ge1xuICAgIGNvbnN0IGZlYXR1cmVzID0gcHJvcHNGZWF0dXJlcyB8fCBzdGF0ZUZlYXR1cmVzO1xuICAgIC8vIEFueSBjaGFuZ2VzIGluIEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIHdpbGwgY3JlYXRlIGEgbmV3IG9iamVjdFxuICAgIGlmIChmZWF0dXJlcyBpbnN0YW5jZW9mIEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gZmVhdHVyZXM7XG4gICAgfVxuXG4gICAgaWYgKGZlYXR1cmVzICYmIGZlYXR1cmVzLnR5cGUgPT09ICdGZWF0dXJlQ29sbGVjdGlvbicpIHtcbiAgICAgIHJldHVybiBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24oe1xuICAgICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgICBmZWF0dXJlczogZmVhdHVyZXMuZmVhdHVyZXMsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uKHtcbiAgICAgIHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsXG4gICAgICBmZWF0dXJlczogZmVhdHVyZXMgfHwgW10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIF9nZXRGZWF0dXJlQ29sbGVjdGlvbiA9ICgpID0+IHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0TWVtb3JpemVkRmVhdHVyZUNvbGxlY3Rpb24oe1xuICAgICAgcHJvcHNGZWF0dXJlczogdGhpcy5wcm9wcy5mZWF0dXJlcyxcbiAgICAgIHN0YXRlRmVhdHVyZXM6IHRoaXMuc3RhdGUuZmVhdHVyZUNvbGxlY3Rpb24sXG4gICAgfSk7XG4gIH07XG5cbiAgX3NldHVwTW9kZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgbW9kZSA9IHRoaXMucHJvcHMubW9kZTtcbiAgICB0aGlzLl9tb2RlSGFuZGxlciA9IG1vZGU7XG5cbiAgICBpZiAoIW1vZGUpIHtcbiAgICAgIHRoaXMuX2RlZ3JlZ2lzdGVyRXZlbnRzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMoKTtcbiAgfTtcblxuICAvKiBFRElUSU5HIE9QRVJBVElPTlMgKi9cbiAgX2NsZWFyRWRpdGluZ1N0YXRlID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRGZWF0dXJlSW5kZXg6IG51bGwsXG4gICAgICBzZWxlY3RlZEVkaXRIYW5kbGVJbmRleGVzOiBbXSxcblxuICAgICAgaG92ZXJlZDogbnVsbCxcblxuICAgICAgcG9pbnRlckRvd25QaWNrczogbnVsbCxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHM6IG51bGwsXG5cbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZGlkRHJhZzogZmFsc2UsXG4gICAgfSk7XG4gIH07XG5cbiAgX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4ID0gKCkgPT4ge1xuICAgIGlmICgnc2VsZWN0ZWRGZWF0dXJlSW5kZXgnIGluIHRoaXMucHJvcHMpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnNlbGVjdGVkRmVhdHVyZUluZGV4O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zZWxlY3RlZEZlYXR1cmVJbmRleDtcbiAgfTtcblxuICBfb25TZWxlY3QgPSAoc2VsZWN0ZWQ6IFNlbGVjdEFjdGlvbikgPT4ge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRGZWF0dXJlSW5kZXggfSA9IHNlbGVjdGVkO1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHsgc2VsZWN0ZWRGZWF0dXJlSW5kZXgsIHNlbGVjdGVkRWRpdEhhbmRsZUluZGV4ZXMgfTtcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZEZlYXR1cmVJbmRleCAhPT0gc2VsZWN0ZWRGZWF0dXJlSW5kZXgpIHtcbiAgICAgIG5ld1N0YXRlLnNlbGVjdGVkRWRpdEhhbmRsZUluZGV4ZXMgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG4gICAgaWYgKHRoaXMucHJvcHMub25TZWxlY3QpIHtcbiAgICAgIHRoaXMucHJvcHMub25TZWxlY3Qoc2VsZWN0ZWQpO1xuICAgIH1cbiAgfTtcblxuICBfb25FZGl0ID0gKGVkaXRBY3Rpb246IEVkaXRBY3Rpb248YW55PikgPT4ge1xuICAgIGNvbnN0IHsgZWRpdFR5cGUsIHVwZGF0ZWREYXRhLCBlZGl0Q29udGV4dCB9ID0gZWRpdEFjdGlvbjtcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHsgZmVhdHVyZUNvbGxlY3Rpb246IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbih1cGRhdGVkRGF0YSkgfTtcbiAgICBpZiAoZWRpdFR5cGUgPT09IEVESVRfVFlQRS5BRERfUE9TSVRJT04pIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIG5ld1N0YXRlLnNlbGVjdGVkRWRpdEhhbmRsZUluZGV4ZXMgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG5cbiAgICBzd2l0Y2ggKGVkaXRUeXBlKSB7XG4gICAgICBjYXNlIEVESVRfVFlQRS5BRERfRkVBVFVSRTpcbiAgICAgICAgdGhpcy5fb25TZWxlY3Qoe1xuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZTogbnVsbCxcbiAgICAgICAgICBzZWxlY3RlZEZlYXR1cmVJbmRleDogbnVsbCxcbiAgICAgICAgICBzZWxlY3RlZEVkaXRIYW5kbGVJbmRleDogbnVsbCxcbiAgICAgICAgICBzZWxlY3RlZEVkaXRIYW5kbGVJbmRleGVzOiBbXSxcbiAgICAgICAgICBzY3JlZW5Db29yZHM6IGVkaXRDb250ZXh0ICYmIGVkaXRDb250ZXh0LnNjcmVlbkNvb3JkcyxcbiAgICAgICAgICBtYXBDb29yZHM6IGVkaXRDb250ZXh0ICYmIGVkaXRDb250ZXh0Lm1hcENvb3JkcyxcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vblVwZGF0ZSkge1xuICAgICAgdGhpcy5wcm9wcy5vblVwZGF0ZSh7XG4gICAgICAgIGRhdGE6IHVwZGF0ZWREYXRhICYmIHVwZGF0ZWREYXRhLmZlYXR1cmVzLFxuICAgICAgICBlZGl0VHlwZSxcbiAgICAgICAgZWRpdENvbnRleHQsXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLyogRVZFTlRTICovXG4gIF9kZWdyZWdpc3RlckV2ZW50cyA9ICgpID0+IHtcbiAgICBjb25zdCBldmVudE1hbmFnZXIgPSB0aGlzLl9jb250ZXh0ICYmIHRoaXMuX2NvbnRleHQuZXZlbnRNYW5hZ2VyO1xuICAgIGlmICghdGhpcy5fZXZlbnRzIHx8ICFldmVudE1hbmFnZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzUmVnaXN0ZXJlZCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLm9mZih0aGlzLl9ldmVudHMpO1xuICAgICAgdGhpcy5fZXZlbnRzUmVnaXN0ZXJlZCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBfcmVnaXN0ZXJFdmVudHMgPSAoKSA9PiB7XG4gICAgY29uc3QgcmVmID0gdGhpcy5fY29udGFpbmVyUmVmO1xuICAgIGNvbnN0IGV2ZW50TWFuYWdlciA9IHRoaXMuX2NvbnRleHQgJiYgdGhpcy5fY29udGV4dC5ldmVudE1hbmFnZXI7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXJlZiB8fCAhZXZlbnRNYW5hZ2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50c1JlZ2lzdGVyZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBldmVudE1hbmFnZXIub24odGhpcy5fZXZlbnRzLCByZWYpO1xuICAgIHRoaXMuX2V2ZW50c1JlZ2lzdGVyZWQgPSB0cnVlO1xuICB9O1xuXG4gIF9vbkV2ZW50ID0gKGhhbmRsZXI6IEZ1bmN0aW9uLCBldnQ6IE1qb2xuaXJFdmVudCwgc3RvcFByb3BhZ2F0aW9uOiBib29sZWFuKSA9PiB7XG4gICAgY29uc3QgZXZlbnQgPSB0aGlzLl9nZXRFdmVudChldnQpO1xuICAgIGhhbmRsZXIoZXZlbnQpO1xuXG4gICAgaWYgKHN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcblxuICBfb25DbGljayA9IChldmVudDogQmFzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgbW9kZVByb3BzID0gdGhpcy5nZXRNb2RlUHJvcHMoKTtcbiAgICAvLyBUT0RPIHJlZmFjdG9yIEVkaXRpbmdNb2RlXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmICh0aGlzLl9tb2RlSGFuZGxlciBpbnN0YW5jZW9mIEVkaXRpbmdNb2RlIHx8IHRoaXMucHJvcHMuc2VsZWN0YWJsZSkge1xuICAgICAgY29uc3QgeyBtYXBDb29yZHMsIHNjcmVlbkNvb3JkcyB9ID0gZXZlbnQ7XG4gICAgICBjb25zdCBwaWNrZWRPYmplY3QgPSBldmVudC5waWNrcyAmJiBldmVudC5waWNrc1swXTtcbiAgICAgIGNvbnN0IHNlbGVjdGVkRWRpdEhhbmRsZUluZGV4ZXMgPSBbLi4udGhpcy5zdGF0ZS5zZWxlY3RlZEVkaXRIYW5kbGVJbmRleGVzXTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGlmIChwaWNrZWRPYmplY3QgJiYgaXNOdW1lcmljKHBpY2tlZE9iamVjdC5mZWF0dXJlSW5kZXgpKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZUluZGV4ID1cbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgcGlja2VkT2JqZWN0LnR5cGUgPT09IEVMRU1FTlRfVFlQRS5FRElUX0hBTkRMRSA/IHBpY2tlZE9iamVjdC5pbmRleCA6IG51bGw7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcy5pbmRleE9mKGhhbmRsZUluZGV4KTtcbiAgICAgICAgaWYgKGhhbmRsZUluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxlY3RlZEVkaXRIYW5kbGVJbmRleGVzLnB1c2goaGFuZGxlSW5kZXgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcyB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ID0gcGlja2VkT2JqZWN0LmZlYXR1cmVJbmRleDtcbiAgICAgICAgdGhpcy5fb25TZWxlY3Qoe1xuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZTogcGlja2VkT2JqZWN0Lm9iamVjdCxcbiAgICAgICAgICBzZWxlY3RlZEZlYXR1cmVJbmRleCxcbiAgICAgICAgICBzZWxlY3RlZEVkaXRIYW5kbGVJbmRleDogaGFuZGxlSW5kZXgsXG4gICAgICAgICAgc2VsZWN0ZWRFZGl0SGFuZGxlSW5kZXhlcyxcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgbWFwQ29vcmRzLFxuICAgICAgICAgIHNjcmVlbkNvb3JkcyxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9vblNlbGVjdCh7XG4gICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlOiBudWxsLFxuICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZUluZGV4OiBudWxsLFxuICAgICAgICAgIHNlbGVjdGVkRWRpdEhhbmRsZUluZGV4OiBudWxsLFxuICAgICAgICAgIHNlbGVjdGVkRWRpdEhhbmRsZUluZGV4ZXMsXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIG1hcENvb3JkcyxcbiAgICAgICAgICBzY3JlZW5Db29yZHMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX21vZGVIYW5kbGVyLmhhbmRsZUNsaWNrKGV2ZW50LCBtb2RlUHJvcHMpO1xuICB9O1xuXG4gIF9vbkRibGNsaWNrID0gKGV2ZW50OiBCYXNlRXZlbnQpID0+IHtcbiAgICBpZiAoaXNOdW1lcmljKHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZUluZGV4KCkpKSB7XG4gICAgICBldmVudC5zb3VyY2VFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH07XG5cbiAgX29uUG9pbnRlck1vdmUgPSAoZXZlbnQ6IEJhc2VFdmVudCkgPT4ge1xuICAgIC8vIGhvdmVyaW5nXG4gICAgY29uc3QgaG92ZXJlZCA9IHRoaXMuX2dldEhvdmVyU3RhdGUoZXZlbnQpO1xuICAgIGNvbnN0IHtcbiAgICAgIGlzRHJhZ2dpbmcsXG4gICAgICBkaWREcmFnLFxuICAgICAgcG9pbnRlckRvd25QaWNrcyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzLFxuICAgICAgcG9pbnRlckRvd25NYXBDb29yZHMsXG4gICAgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoaXNEcmFnZ2luZyAmJiAhZGlkRHJhZyAmJiBwb2ludGVyRG93blNjcmVlbkNvb3Jkcykge1xuICAgICAgY29uc3QgZHggPSBldmVudC5zY3JlZW5Db29yZHNbMF0gLSBwb2ludGVyRG93blNjcmVlbkNvb3Jkc1swXTtcbiAgICAgIGNvbnN0IGR5ID0gZXZlbnQuc2NyZWVuQ29vcmRzWzFdIC0gcG9pbnRlckRvd25TY3JlZW5Db29yZHNbMV07XG4gICAgICBpZiAoZHggKiBkeCArIGR5ICogZHkgPiA1KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkaWREcmFnOiB0cnVlIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHBvaW50ZXJNb3ZlRXZlbnQgPSB7XG4gICAgICAuLi5ldmVudCxcbiAgICAgIGlzRHJhZ2dpbmcsXG4gICAgICBwb2ludGVyRG93blBpY2tzLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHMsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkcyxcbiAgICAgIGNhbmNlbFBhbjogZXZlbnQuc291cmNlRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uLFxuICAgIH07XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5kaWREcmFnKSB7XG4gICAgICBjb25zdCBtb2RlUHJvcHMgPSB0aGlzLmdldE1vZGVQcm9wcygpO1xuICAgICAgaWYgKHRoaXMuX21vZGVIYW5kbGVyLmhhbmRsZURyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMuX21vZGVIYW5kbGVyLmhhbmRsZURyYWdnaW5nKHBvaW50ZXJNb3ZlRXZlbnQsIG1vZGVQcm9wcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9tb2RlSGFuZGxlci5oYW5kbGVQb2ludGVyTW92ZShwb2ludGVyTW92ZUV2ZW50LCBtb2RlUHJvcHMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaG92ZXJlZCxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGxhc3RQb2ludGVyTW92ZUV2ZW50OiBwb2ludGVyTW92ZUV2ZW50LFxuICAgIH0pO1xuICB9O1xuXG4gIF9vblBvaW50ZXJEb3duID0gKGV2ZW50OiBCYXNlRXZlbnQpID0+IHtcbiAgICBjb25zdCBkcmFnVG9EcmF3ID0gdGhpcy5wcm9wcy5tb2RlQ29uZmlnICYmIHRoaXMucHJvcHMubW9kZUNvbmZpZy5kcmFnVG9EcmF3O1xuICAgIGNvbnN0IGlzRHJhZ2dpbmcgPSBCb29sZWFuKGV2ZW50LnBpY2tzICYmIGV2ZW50LnBpY2tzWzBdKSB8fCBkcmFnVG9EcmF3O1xuICAgIGNvbnN0IHN0YXJ0RHJhZ2dpbmdFdmVudCA9IHtcbiAgICAgIC4uLmV2ZW50LFxuICAgICAgaXNEcmFnZ2luZyxcbiAgICAgIHBvaW50ZXJEb3duU2NyZWVuQ29vcmRzOiBldmVudC5zY3JlZW5Db29yZHMsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkczogZXZlbnQubWFwQ29vcmRzLFxuICAgICAgY2FuY2VsUGFuOiBldmVudC5zb3VyY2VFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24sXG4gICAgfTtcblxuICAgIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgICAgaXNEcmFnZ2luZyxcbiAgICAgIHBvaW50ZXJEb3duUGlja3M6IGV2ZW50LnBpY2tzLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IGV2ZW50LnNjcmVlbkNvb3JkcyxcbiAgICAgIHBvaW50ZXJEb3duTWFwQ29vcmRzOiBldmVudC5tYXBDb29yZHMsXG4gICAgfTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG5cbiAgICBjb25zdCBtb2RlUHJvcHMgPSB0aGlzLmdldE1vZGVQcm9wcygpO1xuICAgIHRoaXMuX21vZGVIYW5kbGVyLmhhbmRsZVN0YXJ0RHJhZ2dpbmcoc3RhcnREcmFnZ2luZ0V2ZW50LCBtb2RlUHJvcHMpO1xuICB9O1xuXG4gIF9vblBvaW50ZXJVcCA9IChldmVudDogQmFzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBkaWREcmFnLCBwb2ludGVyRG93blBpY2tzLCBwb2ludGVyRG93blNjcmVlbkNvb3JkcywgcG9pbnRlckRvd25NYXBDb29yZHMgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc3RvcERyYWdnaW5nRXZlbnQgPSB7XG4gICAgICAuLi5ldmVudCxcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgcG9pbnRlckRvd25QaWNrczogZGlkRHJhZyA/IHBvaW50ZXJEb3duUGlja3MgOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IGRpZERyYWcgPyBwb2ludGVyRG93blNjcmVlbkNvb3JkcyA6IG51bGwsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkczogZGlkRHJhZyA/IHBvaW50ZXJEb3duTWFwQ29vcmRzIDogbnVsbCxcbiAgICAgIGNhbmNlbFBhbjogZXZlbnQuc291cmNlRXZlbnQuY2FuY2VsUGFuLFxuICAgIH07XG5cbiAgICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZGlkRHJhZzogZmFsc2UsXG4gICAgICBwb2ludGVyRG93blBpY2tzOiBudWxsLFxuICAgICAgcG9pbnRlckRvd25TY3JlZW5Db29yZHM6IG51bGwsXG4gICAgICBwb2ludGVyRG93bk1hcENvb3JkczogbnVsbCxcbiAgICB9O1xuXG4gICAgdGhpcy5zZXRTdGF0ZShuZXdTdGF0ZSk7XG4gICAgY29uc3QgbW9kZVByb3BzID0gdGhpcy5nZXRNb2RlUHJvcHMoKTtcblxuICAgIGlmIChkaWREcmFnKSB7XG4gICAgICB0aGlzLl9tb2RlSGFuZGxlci5oYW5kbGVTdG9wRHJhZ2dpbmcoc3RvcERyYWdnaW5nRXZlbnQsIG1vZGVQcm9wcyk7XG4gICAgfVxuICB9O1xuXG4gIF9vblBhbiA9IChldmVudDogQmFzZUV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBpc0RyYWdnaW5nIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmIChpc0RyYWdnaW5nKSB7XG4gICAgICBldmVudC5zb3VyY2VFdmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX21vZGVIYW5kbGVyLmhhbmRsZVBhbikge1xuICAgICAgdGhpcy5fbW9kZUhhbmRsZXIuaGFuZGxlUGFuKGV2ZW50LCB0aGlzLmdldE1vZGVQcm9wcygpKTtcbiAgICB9XG4gIH07XG5cbiAgLyogSEVMUEVSUyAqL1xuICBwcm9qZWN0ID0gKHB0OiBbbnVtYmVyLCBudW1iZXJdKSA9PiB7XG4gICAgY29uc3Qgdmlld3BvcnQgPSB0aGlzLl9jb250ZXh0ICYmIHRoaXMuX2NvbnRleHQudmlld3BvcnQ7XG4gICAgcmV0dXJuIHZpZXdwb3J0ICYmIHZpZXdwb3J0LnByb2plY3QocHQpO1xuICB9O1xuXG4gIHVucHJvamVjdCA9IChwdDogW251bWJlciwgbnVtYmVyXSkgPT4ge1xuICAgIGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5fY29udGV4dCAmJiB0aGlzLl9jb250ZXh0LnZpZXdwb3J0O1xuICAgIHJldHVybiB2aWV3cG9ydCAmJiB2aWV3cG9ydC51bnByb2plY3QocHQpO1xuICB9O1xuXG4gIF9nZXRFdmVudChldnQ6IE1qb2xuaXJFdmVudCkge1xuICAgIGNvbnN0IGZlYXR1cmVzID0gdGhpcy5nZXRGZWF0dXJlcygpO1xuICAgIGNvbnN0IGd1aWRlcyA9IHRoaXMuX21vZGVIYW5kbGVyLmdldEd1aWRlcyh0aGlzLmdldE1vZGVQcm9wcygpKTtcbiAgICBjb25zdCBwaWNrZWQgPSBwYXJzZUV2ZW50RWxlbWVudChldnQsIGZlYXR1cmVzLCBndWlkZXMgJiYgZ3VpZGVzLmZlYXR1cmVzKTtcbiAgICBjb25zdCBzY3JlZW5Db29yZHMgPSBnZXRTY3JlZW5Db29yZHMoZXZ0KTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgbWFwQ29vcmRzID0gdGhpcy51bnByb2plY3Qoc2NyZWVuQ29vcmRzKTtcblxuICAgIHJldHVybiB7XG4gICAgICBwaWNrczogcGlja2VkID8gW3BpY2tlZF0gOiBudWxsLFxuICAgICAgc2NyZWVuQ29vcmRzLFxuICAgICAgbWFwQ29vcmRzLFxuICAgICAgc291cmNlRXZlbnQ6IGV2dCxcbiAgICB9O1xuICB9XG5cbiAgX2dldEhvdmVyU3RhdGUgPSAoZXZlbnQ6IEJhc2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IG9iamVjdCA9IGV2ZW50LnBpY2tzICYmIGV2ZW50LnBpY2tzWzBdO1xuICAgIGlmICghb2JqZWN0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc2NyZWVuQ29vcmRzOiBldmVudC5zY3JlZW5Db29yZHMsXG4gICAgICBtYXBDb29yZHM6IGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgIC4uLm9iamVjdCxcbiAgICB9O1xuICB9O1xuXG4gIF9yZW5kZXIoKSB7XG4gICAgcmV0dXJuIDxkaXYgLz47XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxNYXBDb250ZXh0LkNvbnN1bWVyPlxuICAgICAgICB7KGNvbnRleHQpID0+IHtcbiAgICAgICAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICBjb25zdCB2aWV3cG9ydCA9IGNvbnRleHQgJiYgY29udGV4dC52aWV3cG9ydDtcblxuICAgICAgICAgIGlmICghdmlld3BvcnQgfHwgdmlld3BvcnQuaGVpZ2h0IDw9IDAgfHwgdmlld3BvcnQud2lkdGggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlcigpO1xuICAgICAgICB9fVxuICAgICAgPC9NYXBDb250ZXh0LkNvbnN1bWVyPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==