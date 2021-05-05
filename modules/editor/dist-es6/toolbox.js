"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toolbox = Toolbox;

var React = _interopRequireWildcard(require("react"));

var _editModes = require("@nebula.gl/edit-modes");

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _icon = require("./icon");

var _importModal = require("./import-modal");

var _exportModal = require("./export-modal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: row-reverse;\n  position: absolute;\n  top: 0;\n  right: 0;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  color: #fff;\n  background: ", ";\n  font-size: 1em;\n  font-weight: 400;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,\n    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\n    'Noto Color Emoji';\n  border: 1px solid transparent;\n  border-radius: 0.25em;\n  margin: 0.05em;\n  padding: 0.1em 0.2em;\n  :hover {\n    background: rgb(128, 137, 133);\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  top: 10px;\n  right: 10px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Tools = _styledComponents["default"].div(_templateObject());

var Button = _styledComponents["default"].button(_templateObject2(), function (_ref) {
  var kind = _ref.kind,
      active = _ref.active;
  return kind === 'danger' ? 'rgb(180, 40, 40)' : active ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)';
});

var SubToolsContainer = _styledComponents["default"].div(_templateObject3());

var SubTools = _styledComponents["default"].div(_templateObject4());

var MODE_GROUPS = [{
  modes: [{
    mode: _editModes.ViewMode,
    content: /*#__PURE__*/React.createElement(_icon.Icon, {
      name: "pointer"
    })
  }]
}, {
  modes: [{
    mode: _editModes.DrawPointMode,
    content: /*#__PURE__*/React.createElement(_icon.Icon, {
      name: "map-pin"
    })
  }]
}, {
  modes: [{
    mode: _editModes.DrawLineStringMode,
    content: /*#__PURE__*/React.createElement(_icon.Icon, {
      name: "stats"
    })
  }]
}, {
  modes: [{
    mode: _editModes.DrawPolygonMode,
    content: /*#__PURE__*/React.createElement(_icon.Icon, {
      name: "shape-polygon"
    })
  }, {
    mode: _editModes.DrawRectangleMode,
    content: /*#__PURE__*/React.createElement(_icon.Icon, {
      name: "rectangle"
    })
  }, {
    mode: _editModes.DrawCircleFromCenterMode,
    content: /*#__PURE__*/React.createElement(_icon.Icon, {
      name: "circle"
    })
  }]
}, {
  modes: [{
    mode: _editModes.MeasureDistanceMode,
    content: /*#__PURE__*/React.createElement(_icon.Icon, {
      name: "ruler"
    })
  }, {
    mode: _editModes.MeasureAngleMode,
    content: /*#__PURE__*/React.createElement(_icon.Icon, {
      name: "shape-triangle"
    })
  }, {
    mode: _editModes.MeasureAreaMode,
    content: /*#__PURE__*/React.createElement(_icon.Icon, {
      name: "shape-square"
    })
  }]
}];

function ModeButton(_ref2) {
  var buttonConfig = _ref2.buttonConfig,
      mode = _ref2.mode,
      onClick = _ref2.onClick;
  return /*#__PURE__*/React.createElement(Button, {
    active: buttonConfig.mode === mode,
    onClick: onClick
  }, buttonConfig.content);
}

function ModeGroupButtons(_ref3) {
  var modeGroup = _ref3.modeGroup,
      mode = _ref3.mode,
      onSetMode = _ref3.onSetMode;

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      expanded = _React$useState2[0],
      setExpanded = _React$useState2[1];

  var modes = modeGroup.modes;
  var subTools = null;

  if (expanded) {
    subTools = /*#__PURE__*/React.createElement(SubTools, null, modes.map(function (buttonConfig, i) {
      return /*#__PURE__*/React.createElement(ModeButton, {
        key: i,
        buttonConfig: buttonConfig,
        mode: mode,
        onClick: function onClick() {
          onSetMode(function () {
            return buttonConfig.mode;
          });
          setExpanded(false);
        }
      });
    }));
  } // Get the button config if it is active otherwise, choose the first


  var buttonConfig = modes.find(function (m) {
    return m.mode === mode;
  }) || modes[0];
  return /*#__PURE__*/React.createElement(SubToolsContainer, null, subTools, /*#__PURE__*/React.createElement(ModeButton, {
    buttonConfig: buttonConfig,
    mode: mode,
    onClick: function onClick() {
      onSetMode(function () {
        return buttonConfig.mode;
      });
      setExpanded(true);
    }
  }));
}

function Toolbox(_ref4) {
  var mode = _ref4.mode,
      modeConfig = _ref4.modeConfig,
      geoJson = _ref4.geoJson,
      onSetMode = _ref4.onSetMode,
      onSetModeConfig = _ref4.onSetModeConfig,
      onSetGeoJson = _ref4.onSetGeoJson,
      _onImport = _ref4.onImport;

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      showConfig = _React$useState4[0],
      setShowConfig = _React$useState4[1];

  var _React$useState5 = React.useState(false),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      showImport = _React$useState6[0],
      setShowImport = _React$useState6[1];

  var _React$useState7 = React.useState(false),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      showExport = _React$useState8[0],
      setShowExport = _React$useState8[1];

  var _React$useState9 = React.useState(false),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      showClearConfirmation = _React$useState10[0],
      setShowClearConfirmation = _React$useState10[1];

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tools, null, MODE_GROUPS.map(function (modeGroup, i) {
    return /*#__PURE__*/React.createElement(ModeGroupButtons, {
      key: i,
      modeGroup: modeGroup,
      mode: mode,
      onSetMode: onSetMode
    });
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return setShowExport(true);
    },
    title: "Export"
  }, /*#__PURE__*/React.createElement(_icon.Icon, {
    name: "export"
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return setShowImport(true);
    },
    title: "Import"
  }, /*#__PURE__*/React.createElement(_icon.Icon, {
    name: "import"
  })), /*#__PURE__*/React.createElement(SubToolsContainer, null, showConfig && /*#__PURE__*/React.createElement(SubTools, null, /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return setShowConfig(false);
    }
  }, /*#__PURE__*/React.createElement(_icon.Icon, {
    name: "chevron-right"
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return onSetModeConfig({
        booleanOperation: 'difference'
      });
    },
    active: modeConfig && modeConfig.booleanOperation === 'difference'
  }, /*#__PURE__*/React.createElement(_icon.Icon, {
    name: "minus-front"
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return onSetModeConfig({
        booleanOperation: 'union'
      });
    },
    active: modeConfig && modeConfig.booleanOperation === 'union'
  }, /*#__PURE__*/React.createElement(_icon.Icon, {
    name: "unite"
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return onSetModeConfig({
        booleanOperation: 'intersection'
      });
    },
    active: modeConfig && modeConfig.booleanOperation === 'intersection'
  }, /*#__PURE__*/React.createElement(_icon.Icon, {
    name: "intersect"
  }))), /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return setShowConfig(true);
    }
  }, /*#__PURE__*/React.createElement(_icon.Icon, {
    name: "cog"
  }))), /*#__PURE__*/React.createElement(SubToolsContainer, null, showClearConfirmation && /*#__PURE__*/React.createElement(SubTools, null, /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      onSetGeoJson({
        type: 'FeatureCollection',
        features: []
      });
      setShowClearConfirmation(false);
    },
    kind: "danger",
    title: "Clear all features"
  }, "Clear all features ", /*#__PURE__*/React.createElement(_icon.Icon, {
    name: "trash"
  })), /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return setShowClearConfirmation(false);
    }
  }, "Cancel")), /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      return setShowClearConfirmation(true);
    },
    title: "Clear"
  }, /*#__PURE__*/React.createElement(_icon.Icon, {
    name: "trash"
  })))), showImport && /*#__PURE__*/React.createElement(_importModal.ImportModal, {
    onImport: function onImport(imported) {
      _onImport(imported);

      setShowImport(false);
    },
    onClose: function onClose() {
      return setShowImport(false);
    }
  }), showExport && /*#__PURE__*/React.createElement(_exportModal.ExportModal, {
    geoJson: geoJson,
    onClose: function onClose() {
      return setShowExport(false);
    }
  }));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90b29sYm94LnRzeCJdLCJuYW1lcyI6WyJUb29scyIsInN0eWxlZCIsImRpdiIsIkJ1dHRvbiIsImJ1dHRvbiIsImtpbmQiLCJhY3RpdmUiLCJTdWJUb29sc0NvbnRhaW5lciIsIlN1YlRvb2xzIiwiTU9ERV9HUk9VUFMiLCJtb2RlcyIsIm1vZGUiLCJWaWV3TW9kZSIsImNvbnRlbnQiLCJEcmF3UG9pbnRNb2RlIiwiRHJhd0xpbmVTdHJpbmdNb2RlIiwiRHJhd1BvbHlnb25Nb2RlIiwiRHJhd1JlY3RhbmdsZU1vZGUiLCJEcmF3Q2lyY2xlRnJvbUNlbnRlck1vZGUiLCJNZWFzdXJlRGlzdGFuY2VNb2RlIiwiTWVhc3VyZUFuZ2xlTW9kZSIsIk1lYXN1cmVBcmVhTW9kZSIsIk1vZGVCdXR0b24iLCJidXR0b25Db25maWciLCJvbkNsaWNrIiwiTW9kZUdyb3VwQnV0dG9ucyIsIm1vZGVHcm91cCIsIm9uU2V0TW9kZSIsIlJlYWN0IiwidXNlU3RhdGUiLCJleHBhbmRlZCIsInNldEV4cGFuZGVkIiwic3ViVG9vbHMiLCJtYXAiLCJpIiwiZmluZCIsIm0iLCJUb29sYm94IiwibW9kZUNvbmZpZyIsImdlb0pzb24iLCJvblNldE1vZGVDb25maWciLCJvblNldEdlb0pzb24iLCJvbkltcG9ydCIsInNob3dDb25maWciLCJzZXRTaG93Q29uZmlnIiwic2hvd0ltcG9ydCIsInNldFNob3dJbXBvcnQiLCJzaG93RXhwb3J0Iiwic2V0U2hvd0V4cG9ydCIsInNob3dDbGVhckNvbmZpcm1hdGlvbiIsInNldFNob3dDbGVhckNvbmZpcm1hdGlvbiIsImJvb2xlYW5PcGVyYXRpb24iLCJ0eXBlIiwiZmVhdHVyZXMiLCJpbXBvcnRlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBV0E7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFB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Q0Usb0JBQUMsVUFBRDtBQUFNLElBQUEsSUFBSSxFQUFDO0FBQVgsSUFERixDQWhCRixDQS9DRixDQURGLEVBd0VHTCxVQUFVLGlCQUNULG9CQUFDLHdCQUFEO0FBQ0UsSUFBQSxRQUFRLEVBQUUsa0JBQUNTLFFBQUQsRUFBYztBQUN0QlosTUFBQUEsU0FBUSxDQUFDWSxRQUFELENBQVI7O0FBQ0FSLE1BQUFBLGFBQWEsQ0FBQyxLQUFELENBQWI7QUFDRCxLQUpIO0FBS0UsSUFBQSxPQUFPLEVBQUU7QUFBQSxhQUFNQSxhQUFhLENBQUMsS0FBRCxDQUFuQjtBQUFBO0FBTFgsSUF6RUosRUFrRkdDLFVBQVUsaUJBQUksb0JBQUMsd0JBQUQ7QUFBYSxJQUFBLE9BQU8sRUFBRVIsT0FBdEI7QUFBK0IsSUFBQSxPQUFPLEVBQUU7QUFBQSxhQUFNUyxhQUFhLENBQUMsS0FBRCxDQUFuQjtBQUFBO0FBQXhDLElBbEZqQixDQURGO0FBc0ZEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgVmlld01vZGUsXG4gIERyYXdQb2ludE1vZGUsXG4gIERyYXdMaW5lU3RyaW5nTW9kZSxcbiAgRHJhd1BvbHlnb25Nb2RlLFxuICBEcmF3Q2lyY2xlRnJvbUNlbnRlck1vZGUsXG4gIERyYXdSZWN0YW5nbGVNb2RlLFxuICBNZWFzdXJlRGlzdGFuY2VNb2RlLFxuICBNZWFzdXJlQW5nbGVNb2RlLFxuICBNZWFzdXJlQXJlYU1vZGUsXG59IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7IEljb24gfSBmcm9tICcuL2ljb24nO1xuXG5pbXBvcnQgeyBJbXBvcnRNb2RhbCB9IGZyb20gJy4vaW1wb3J0LW1vZGFsJztcbmltcG9ydCB7IEV4cG9ydE1vZGFsIH0gZnJvbSAnLi9leHBvcnQtbW9kYWwnO1xuXG5jb25zdCBUb29scyA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgdG9wOiAxMHB4O1xuICByaWdodDogMTBweDtcbmA7XG5cbmNvbnN0IEJ1dHRvbiA9IHN0eWxlZC5idXR0b248eyBhY3RpdmU/OiBib29sZWFuOyBraW5kPzogc3RyaW5nIH0+YFxuICBjb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZDogJHsoeyBraW5kLCBhY3RpdmUgfSkgPT5cbiAgICBraW5kID09PSAnZGFuZ2VyJyA/ICdyZ2IoMTgwLCA0MCwgNDApJyA6IGFjdGl2ZSA/ICdyZ2IoMCwgMTA1LCAyMTcpJyA6ICdyZ2IoOTAsIDk4LCA5NCknfTtcbiAgZm9udC1zaXplOiAxZW07XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgJ0hlbHZldGljYSBOZXVlJywgQXJpYWwsXG4gICAgJ05vdG8gU2FucycsIHNhbnMtc2VyaWYsICdBcHBsZSBDb2xvciBFbW9qaScsICdTZWdvZSBVSSBFbW9qaScsICdTZWdvZSBVSSBTeW1ib2wnLFxuICAgICdOb3RvIENvbG9yIEVtb2ppJztcbiAgYm9yZGVyOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1yYWRpdXM6IDAuMjVlbTtcbiAgbWFyZ2luOiAwLjA1ZW07XG4gIHBhZGRpbmc6IDAuMWVtIDAuMmVtO1xuICA6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHJnYigxMjgsIDEzNywgMTMzKTtcbiAgfVxuYDtcblxuY29uc3QgU3ViVG9vbHNDb250YWluZXIgPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5gO1xuXG5jb25zdCBTdWJUb29scyA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3ctcmV2ZXJzZTtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuYDtcblxuZXhwb3J0IHR5cGUgUHJvcHMgPSB7XG4gIG1vZGU6IGFueTtcbiAgbW9kZUNvbmZpZzogYW55O1xuICBnZW9Kc29uOiBhbnk7XG4gIG9uU2V0TW9kZTogKG1vZGU6IGFueSkgPT4gdW5rbm93bjtcbiAgb25TZXRNb2RlQ29uZmlnOiAobW9kZUNvbmZpZzogYW55KSA9PiB1bmtub3duO1xuICBvblNldEdlb0pzb246IChnZW9qc29uOiBhbnkpID0+IHVua25vd247XG4gIG9uSW1wb3J0OiAoaW1wb3J0ZWQ6IGFueSkgPT4gdW5rbm93bjtcbn07XG5cbmNvbnN0IE1PREVfR1JPVVBTID0gW1xuICB7XG4gICAgbW9kZXM6IFt7IG1vZGU6IFZpZXdNb2RlLCBjb250ZW50OiA8SWNvbiBuYW1lPVwicG9pbnRlclwiIC8+IH1dLFxuICB9LFxuICB7XG4gICAgbW9kZXM6IFt7IG1vZGU6IERyYXdQb2ludE1vZGUsIGNvbnRlbnQ6IDxJY29uIG5hbWU9XCJtYXAtcGluXCIgLz4gfV0sXG4gIH0sXG4gIHtcbiAgICBtb2RlczogW1xuICAgICAge1xuICAgICAgICBtb2RlOiBEcmF3TGluZVN0cmluZ01vZGUsXG4gICAgICAgIGNvbnRlbnQ6IDxJY29uIG5hbWU9XCJzdGF0c1wiIC8+LFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgbW9kZXM6IFtcbiAgICAgIHsgbW9kZTogRHJhd1BvbHlnb25Nb2RlLCBjb250ZW50OiA8SWNvbiBuYW1lPVwic2hhcGUtcG9seWdvblwiIC8+IH0sXG4gICAgICB7IG1vZGU6IERyYXdSZWN0YW5nbGVNb2RlLCBjb250ZW50OiA8SWNvbiBuYW1lPVwicmVjdGFuZ2xlXCIgLz4gfSxcbiAgICAgIHsgbW9kZTogRHJhd0NpcmNsZUZyb21DZW50ZXJNb2RlLCBjb250ZW50OiA8SWNvbiBuYW1lPVwiY2lyY2xlXCIgLz4gfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgbW9kZXM6IFtcbiAgICAgIHsgbW9kZTogTWVhc3VyZURpc3RhbmNlTW9kZSwgY29udGVudDogPEljb24gbmFtZT1cInJ1bGVyXCIgLz4gfSxcbiAgICAgIHsgbW9kZTogTWVhc3VyZUFuZ2xlTW9kZSwgY29udGVudDogPEljb24gbmFtZT1cInNoYXBlLXRyaWFuZ2xlXCIgLz4gfSxcbiAgICAgIHsgbW9kZTogTWVhc3VyZUFyZWFNb2RlLCBjb250ZW50OiA8SWNvbiBuYW1lPVwic2hhcGUtc3F1YXJlXCIgLz4gfSxcbiAgICBdLFxuICB9LFxuXTtcblxuZnVuY3Rpb24gTW9kZUJ1dHRvbih7IGJ1dHRvbkNvbmZpZywgbW9kZSwgb25DbGljayB9OiBhbnkpIHtcbiAgcmV0dXJuIChcbiAgICA8QnV0dG9uIGFjdGl2ZT17YnV0dG9uQ29uZmlnLm1vZGUgPT09IG1vZGV9IG9uQ2xpY2s9e29uQ2xpY2t9PlxuICAgICAge2J1dHRvbkNvbmZpZy5jb250ZW50fVxuICAgIDwvQnV0dG9uPlxuICApO1xufVxuZnVuY3Rpb24gTW9kZUdyb3VwQnV0dG9ucyh7IG1vZGVHcm91cCwgbW9kZSwgb25TZXRNb2RlIH06IGFueSkge1xuICBjb25zdCBbZXhwYW5kZWQsIHNldEV4cGFuZGVkXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcblxuICBjb25zdCB7IG1vZGVzIH0gPSBtb2RlR3JvdXA7XG5cbiAgbGV0IHN1YlRvb2xzID0gbnVsbDtcblxuICBpZiAoZXhwYW5kZWQpIHtcbiAgICBzdWJUb29scyA9IChcbiAgICAgIDxTdWJUb29scz5cbiAgICAgICAge21vZGVzLm1hcCgoYnV0dG9uQ29uZmlnLCBpKSA9PiAoXG4gICAgICAgICAgPE1vZGVCdXR0b25cbiAgICAgICAgICAgIGtleT17aX1cbiAgICAgICAgICAgIGJ1dHRvbkNvbmZpZz17YnV0dG9uQ29uZmlnfVxuICAgICAgICAgICAgbW9kZT17bW9kZX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgb25TZXRNb2RlKCgpID0+IGJ1dHRvbkNvbmZpZy5tb2RlKTtcbiAgICAgICAgICAgICAgc2V0RXhwYW5kZWQoZmFsc2UpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICApKX1cbiAgICAgIDwvU3ViVG9vbHM+XG4gICAgKTtcbiAgfVxuXG4gIC8vIEdldCB0aGUgYnV0dG9uIGNvbmZpZyBpZiBpdCBpcyBhY3RpdmUgb3RoZXJ3aXNlLCBjaG9vc2UgdGhlIGZpcnN0XG4gIGNvbnN0IGJ1dHRvbkNvbmZpZyA9IG1vZGVzLmZpbmQoKG0pID0+IG0ubW9kZSA9PT0gbW9kZSkgfHwgbW9kZXNbMF07XG5cbiAgcmV0dXJuIChcbiAgICA8U3ViVG9vbHNDb250YWluZXI+XG4gICAgICB7c3ViVG9vbHN9XG4gICAgICA8TW9kZUJ1dHRvblxuICAgICAgICBidXR0b25Db25maWc9e2J1dHRvbkNvbmZpZ31cbiAgICAgICAgbW9kZT17bW9kZX1cbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIG9uU2V0TW9kZSgoKSA9PiBidXR0b25Db25maWcubW9kZSk7XG4gICAgICAgICAgc2V0RXhwYW5kZWQodHJ1ZSk7XG4gICAgICAgIH19XG4gICAgICAvPlxuICAgIDwvU3ViVG9vbHNDb250YWluZXI+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBUb29sYm94KHtcbiAgbW9kZSxcbiAgbW9kZUNvbmZpZyxcbiAgZ2VvSnNvbixcbiAgb25TZXRNb2RlLFxuICBvblNldE1vZGVDb25maWcsXG4gIG9uU2V0R2VvSnNvbixcbiAgb25JbXBvcnQsXG59OiBQcm9wcykge1xuICBjb25zdCBbc2hvd0NvbmZpZywgc2V0U2hvd0NvbmZpZ10gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzaG93SW1wb3J0LCBzZXRTaG93SW1wb3J0XSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3Nob3dFeHBvcnQsIHNldFNob3dFeHBvcnRdID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbc2hvd0NsZWFyQ29uZmlybWF0aW9uLCBzZXRTaG93Q2xlYXJDb25maXJtYXRpb25dID0gUmVhY3QudXNlU3RhdGUoZmFsc2UpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxUb29scz5cbiAgICAgICAge01PREVfR1JPVVBTLm1hcCgobW9kZUdyb3VwLCBpKSA9PiAoXG4gICAgICAgICAgPE1vZGVHcm91cEJ1dHRvbnMga2V5PXtpfSBtb2RlR3JvdXA9e21vZGVHcm91cH0gbW9kZT17bW9kZX0gb25TZXRNb2RlPXtvblNldE1vZGV9IC8+XG4gICAgICAgICkpfVxuXG4gICAgICAgIHsvKiA8Ym94LWljb24gbmFtZT0nY3VycmVudC1sb2NhdGlvbicgPjwvYm94LWljb24+ICovfVxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldFNob3dFeHBvcnQodHJ1ZSl9IHRpdGxlPVwiRXhwb3J0XCI+XG4gICAgICAgICAgPEljb24gbmFtZT1cImV4cG9ydFwiIC8+XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9eygpID0+IHNldFNob3dJbXBvcnQodHJ1ZSl9IHRpdGxlPVwiSW1wb3J0XCI+XG4gICAgICAgICAgPEljb24gbmFtZT1cImltcG9ydFwiIC8+XG4gICAgICAgIDwvQnV0dG9uPlxuXG4gICAgICAgIDxTdWJUb29sc0NvbnRhaW5lcj5cbiAgICAgICAgICB7c2hvd0NvbmZpZyAmJiAoXG4gICAgICAgICAgICA8U3ViVG9vbHM+XG4gICAgICAgICAgICAgIDxCdXR0b24gb25DbGljaz17KCkgPT4gc2V0U2hvd0NvbmZpZyhmYWxzZSl9PlxuICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJjaGV2cm9uLXJpZ2h0XCIgLz5cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNldE1vZGVDb25maWcoeyBib29sZWFuT3BlcmF0aW9uOiAnZGlmZmVyZW5jZScgfSl9XG4gICAgICAgICAgICAgICAgYWN0aXZlPXttb2RlQ29uZmlnICYmIG1vZGVDb25maWcuYm9vbGVhbk9wZXJhdGlvbiA9PT0gJ2RpZmZlcmVuY2UnfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEljb24gbmFtZT1cIm1pbnVzLWZyb250XCIgLz5cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNldE1vZGVDb25maWcoeyBib29sZWFuT3BlcmF0aW9uOiAndW5pb24nIH0pfVxuICAgICAgICAgICAgICAgIGFjdGl2ZT17bW9kZUNvbmZpZyAmJiBtb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb24gPT09ICd1bmlvbid9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8SWNvbiBuYW1lPVwidW5pdGVcIiAvPlxuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2V0TW9kZUNvbmZpZyh7IGJvb2xlYW5PcGVyYXRpb246ICdpbnRlcnNlY3Rpb24nIH0pfVxuICAgICAgICAgICAgICAgIGFjdGl2ZT17bW9kZUNvbmZpZyAmJiBtb2RlQ29uZmlnLmJvb2xlYW5PcGVyYXRpb24gPT09ICdpbnRlcnNlY3Rpb24nfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImludGVyc2VjdFwiIC8+XG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICB7LyogPEJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRTaG93Q29uZmlnKGZhbHNlKX0+XG4gICAgICAgICAgICAgICAgPEljb24gbmFtZT1cInhcIiAvPlxuICAgICAgICAgICAgICA8L0J1dHRvbj4gKi99XG4gICAgICAgICAgICA8L1N1YlRvb2xzPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRTaG93Q29uZmlnKHRydWUpfT5cbiAgICAgICAgICAgIDxJY29uIG5hbWU9XCJjb2dcIiAvPlxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L1N1YlRvb2xzQ29udGFpbmVyPlxuXG4gICAgICAgIDxTdWJUb29sc0NvbnRhaW5lcj5cbiAgICAgICAgICB7c2hvd0NsZWFyQ29uZmlybWF0aW9uICYmIChcbiAgICAgICAgICAgIDxTdWJUb29scz5cbiAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIG9uU2V0R2VvSnNvbih7IHR5cGU6ICdGZWF0dXJlQ29sbGVjdGlvbicsIGZlYXR1cmVzOiBbXSB9KTtcbiAgICAgICAgICAgICAgICAgIHNldFNob3dDbGVhckNvbmZpcm1hdGlvbihmYWxzZSk7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBraW5kPVwiZGFuZ2VyXCJcbiAgICAgICAgICAgICAgICB0aXRsZT1cIkNsZWFyIGFsbCBmZWF0dXJlc1wiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBDbGVhciBhbGwgZmVhdHVyZXMgPEljb24gbmFtZT1cInRyYXNoXCIgLz5cbiAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgIDxCdXR0b24gb25DbGljaz17KCkgPT4gc2V0U2hvd0NsZWFyQ29uZmlybWF0aW9uKGZhbHNlKX0+Q2FuY2VsPC9CdXR0b24+XG4gICAgICAgICAgICA8L1N1YlRvb2xzPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRTaG93Q2xlYXJDb25maXJtYXRpb24odHJ1ZSl9IHRpdGxlPVwiQ2xlYXJcIj5cbiAgICAgICAgICAgIDxJY29uIG5hbWU9XCJ0cmFzaFwiIC8+XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvU3ViVG9vbHNDb250YWluZXI+XG5cbiAgICAgICAgey8qIHpvb20gaW4gYW5kIG91dCAqL31cbiAgICAgIDwvVG9vbHM+XG5cbiAgICAgIHtzaG93SW1wb3J0ICYmIChcbiAgICAgICAgPEltcG9ydE1vZGFsXG4gICAgICAgICAgb25JbXBvcnQ9eyhpbXBvcnRlZCkgPT4ge1xuICAgICAgICAgICAgb25JbXBvcnQoaW1wb3J0ZWQpO1xuICAgICAgICAgICAgc2V0U2hvd0ltcG9ydChmYWxzZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRTaG93SW1wb3J0KGZhbHNlKX1cbiAgICAgICAgLz5cbiAgICAgICl9XG5cbiAgICAgIHtzaG93RXhwb3J0ICYmIDxFeHBvcnRNb2RhbCBnZW9Kc29uPXtnZW9Kc29ufSBvbkNsb3NlPXsoKSA9PiBzZXRTaG93RXhwb3J0KGZhbHNlKX0gLz59XG4gICAgPC8+XG4gICk7XG59XG4iXX0=