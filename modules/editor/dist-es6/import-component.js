"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImportComponent = ImportComponent;

var React = _interopRequireWildcard(require("react"));

var _reactDropzone = _interopRequireDefault(require("react-dropzone"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _editorModal = require("./editor-modal");

var _importer = require("./lib/importer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _templateObject8() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: flex-end;\n  padding: 0.75rem 0.75rem;\n  border-top: 1px solid rgb(222, 226, 230);\n"]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n  display: block;\n  padding: 0rem 1rem;\n"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n  padding: 0px;\n  width: 100%;\n  min-height: 250px;\n  height: 100%;\n  border: 1px solid rgb(206, 212, 218);\n  border-radius: 0.3rem;\n  fontfamily: -apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,\n    'Noto Sans' sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\n    'Noto Color Emoji';\n  font-size: 1rem;\n  font-weight: 400;\n"]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n  padding: 0px;\n  width: 100%;\n  resize: vertical;\n  min-height: 250px;\n  max-height: 450px;\n  border: 1px solid rgb(206, 212, 218);\n  border-radius: 0.3rem;\n  font-family: -apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',\n    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  font-size: 1rem;\n  font-weight: 400;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  box-sizing: border-box;\n  display: block;\n  width: auto;\n  height: auto;\n  min-height: 300px;\n  padding: 0rem 1rem;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  padding: 0.75rem 0.75rem 0rem 0.75rem;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  width: auto;\n  height: auto;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  pointer-events: auto;\n  background-color: #fff;\n  background-clip: padding-box;\n  border-radius: 0.3rem;\n  outline: 0;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ImportComponentContent = _styledComponents["default"].div(_templateObject());

var ImportContent = _styledComponents["default"].div(_templateObject2());

var ImportSelect = _styledComponents["default"].div(_templateObject3());

var ImportArea = _styledComponents["default"].div(_templateObject4());

var ImportTextArea = _styledComponents["default"].textarea(_templateObject5());

var ImportDropArea = _styledComponents["default"].div(_templateObject6());

var ImportInfo = _styledComponents["default"].div(_templateObject7());

var FooterRow = _styledComponents["default"].div(_templateObject8());

function ImportComponent(props) {
  var _React$useState = React.useState(true),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isImportText = _React$useState2[0],
      setIsImportText = _React$useState2[1];

  var _React$useState3 = React.useState(''),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      text = _React$useState4[0],
      setText = _React$useState4[1];

  var _React$useState5 = React.useState(null),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      importFile = _React$useState6[0],
      setImportFile = _React$useState6[1];

  var _React$useState7 = React.useState({
    valid: false,
    validationErrors: []
  }),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      parseResult = _React$useState8[0],
      setParseResult = _React$useState8[1];

  React.useEffect(function () {
    function parseData() {
      return _parseData.apply(this, arguments);
    }

    function _parseData() {
      _parseData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!isImportText) {
                  _context.next = 8;
                  break;
                }

                _context.t0 = setParseResult;
                _context.next = 4;
                return (0, _importer.parseImport)(text);

              case 4:
                _context.t1 = _context.sent;
                (0, _context.t0)(_context.t1);
                _context.next = 14;
                break;

              case 8:
                if (!(importFile !== null)) {
                  _context.next = 14;
                  break;
                }

                _context.t2 = setParseResult;
                _context.next = 12;
                return (0, _importer.parseImport)(importFile);

              case 12:
                _context.t3 = _context.sent;
                (0, _context.t2)(_context.t3);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _parseData.apply(this, arguments);
    }

    parseData();
  }, [isImportText, text, importFile]);

  function flush() {
    setImportFile(null);
    setText('');
    props.onCancel();
  }

  function isDataSet() {
    return isImportText && text || !isImportText && importFile;
  } // Check validity (and call custom validation callback if present)


  var valid = isDataSet() && parseResult.valid && (!props.onValidate || props.onValidate(parseResult.features));
  return /*#__PURE__*/React.createElement(ImportComponentContent, null, /*#__PURE__*/React.createElement(ImportContent, null, /*#__PURE__*/React.createElement(ImportSelect, null, /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: isImportText ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)'
    },
    onClick: function onClick() {
      setIsImportText(true);
    }
  }, "Import From Text"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: isImportText ? 'rgb(90, 98, 94)' : 'rgb(0, 105, 217)'
    },
    onClick: function onClick() {
      setIsImportText(false);
    }
  }, "Import From File")), /*#__PURE__*/React.createElement(ImportArea, null, isImportText && /*#__PURE__*/React.createElement(ImportTextArea, {
    style: isDataSet() && !parseResult.valid ? {
      borderColor: 'rgb(220, 53, 69)'
    } : {},
    onChange: function onChange(event) {
      return setText(event.target.value);
    },
    value: text
  }), !isImportText && /*#__PURE__*/React.createElement(_reactDropzone["default"], {
    onDrop: function onDrop(importFiles) {
      return setImportFile(importFiles[0]);
    }
  }, function (_ref) {
    var getRootProps = _ref.getRootProps,
        getInputProps = _ref.getInputProps;
    return /*#__PURE__*/React.createElement(ImportDropArea, _extends({
      style: isDataSet() && !parseResult.valid ? {
        borderColor: 'rgb(220, 53, 69)'
      } : {}
    }, getRootProps()), /*#__PURE__*/React.createElement("input", getInputProps()), importFile ? /*#__PURE__*/React.createElement("p", null, !parseResult.valid ? 'Invalid' : '', " Selected File: ", importFile.name, ".", /*#__PURE__*/React.createElement("br", null), "Drag 'n' drop or click again to change the file.") : /*#__PURE__*/React.createElement("p", null, "Drag 'n' drop your file here, or click to select a file."));
  }), /*#__PURE__*/React.createElement(ImportInfo, {
    style: {
      color: 'rgb(133, 100, 4)',
      backgroundColor: 'rgb(255, 243, 205)'
    }
  }, isDataSet() && !parseResult.valid && // @ts-ignore
  parseResult.validationErrors.map(function (err, i) {
    return /*#__PURE__*/React.createElement("div", {
      key: i
    }, err);
  }))), /*#__PURE__*/React.createElement(ImportInfo, null, "Supported formats:", /*#__PURE__*/React.createElement("ul", {
    style: {
      marginTop: '0'
    }
  }, /*#__PURE__*/React.createElement("li", {
    key: "geojson"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://tools.ietf.org/html/rfc7946",
    target: "_blank",
    rel: "noopener noreferrer",
    title: "GeoJSON Specification"
  }, "GeoJSON")), /*#__PURE__*/React.createElement("li", {
    key: "kml"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://developers.google.com/kml/",
    target: "_blank",
    rel: "noopener noreferrer",
    title: "KML Specification"
  }, "KML")), /*#__PURE__*/React.createElement("li", {
    key: "wkt"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://en.wikipedia.org/wiki/Well-known_text",
    target: "_blank",
    rel: "noopener noreferrer",
    title: "WKT"
  }, "WKT"))))), props.additionalInputs || null, /*#__PURE__*/React.createElement(FooterRow, null, /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: isDataSet() ? {
      backgroundColor: valid ? 'rgb(0, 105, 217)' : 'rgb(220, 53, 69)'
    } : {
      backgroundColor: 'rgb(206, 212, 218)'
    },
    disabled: !valid,
    onClick: function onClick() {
      props.onImport({
        type: 'FeatureCollection',
        properties: {},
        // $FlowFixMe - can't be clicked if it is invalid, so features will be there
        //@ts-ignore
        features: parseResult.features
      });
      flush();
    }
  }, "Import Geometry"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    onClick: flush
  }, "Cancel")));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbXBvcnQtY29tcG9uZW50LnRzeCJdLCJuYW1lcyI6WyJJbXBvcnRDb21wb25lbnRDb250ZW50Iiwic3R5bGVkIiwiZGl2IiwiSW1wb3J0Q29udGVudCIsIkltcG9ydFNlbGVjdCIsIkltcG9ydEFyZWEiLCJJbXBvcnRUZXh0QXJlYSIsInRleHRhcmVhIiwiSW1wb3J0RHJvcEFyZWEiLCJJbXBvcnRJbmZvIiwiRm9vdGVyUm93IiwiSW1wb3J0Q29tcG9uZW50IiwicHJvcHMiLCJSZWFjdCIsInVzZVN0YXRlIiwiaXNJbXBvcnRUZXh0Iiwic2V0SXNJbXBvcnRUZXh0IiwidGV4dCIsInNldFRleHQiLCJpbXBvcnRGaWxlIiwic2V0SW1wb3J0RmlsZSIsInZhbGlkIiwidmFsaWRhdGlvbkVycm9ycyIsInBhcnNlUmVzdWx0Iiwic2V0UGFyc2VSZXN1bHQiLCJ1c2VFZmZlY3QiLCJwYXJzZURhdGEiLCJmbHVzaCIsIm9uQ2FuY2VsIiwiaXNEYXRhU2V0Iiwib25WYWxpZGF0ZSIsImZlYXR1cmVzIiwiYmFja2dyb3VuZENvbG9yIiwiYm9yZGVyQ29sb3IiLCJldmVudCIsInRhcmdldCIsInZhbHVlIiwiaW1wb3J0RmlsZXMiLCJnZXRSb290UHJvcHMiLCJnZXRJbnB1dFByb3BzIiwibmFtZSIsImNvbG9yIiwibWFwIiwiZXJyIiwiaSIsIm1hcmdpblRvcCIsImFkZGl0aW9uYWxJbnB1dHMiLCJvbkltcG9ydCIsInR5cGUiLCJwcm9wZXJ0aWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsc0JBQXNCLEdBQUdDLDZCQUFPQyxHQUFWLG1CQUE1Qjs7QUFZQSxJQUFNQyxhQUFhLEdBQUdGLDZC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QixlQWtHRSxvQkFBQyxTQUFELHFCQUNFLG9CQUFDLG1CQUFEO0FBQ0UsSUFBQSxLQUFLLEVBQ0hqQixTQUFTLEtBQ0w7QUFBRUcsTUFBQUEsZUFBZSxFQUFFWCxLQUFLLEdBQUcsa0JBQUgsR0FBd0I7QUFBaEQsS0FESyxHQUVMO0FBQUVXLE1BQUFBLGVBQWUsRUFBRTtBQUFuQixLQUpSO0FBTUUsSUFBQSxRQUFRLEVBQUUsQ0FBQ1gsS0FOYjtBQU9FLElBQUEsT0FBTyxFQUFFLG1CQUFNO0FBQ2JULE1BQUFBLEtBQUssQ0FBQ21DLFFBQU4sQ0FBZTtBQUNiQyxRQUFBQSxJQUFJLEVBQUUsbUJBRE87QUFFYkMsUUFBQUEsVUFBVSxFQUFFLEVBRkM7QUFHYjtBQUNBO0FBQ0FsQixRQUFBQSxRQUFRLEVBQUVSLFdBQVcsQ0FBQ1E7QUFMVCxPQUFmO0FBT0FKLE1BQUFBLEtBQUs7QUFDTjtBQWhCSCx1QkFERixlQXFCRSxvQkFBQyxtQkFBRDtBQUFRLElBQUEsT0FBTyxFQUFFQTtBQUFqQixjQXJCRixDQWxHRixDQURGO0FBNEhEIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWVudiBicm93c2VyICovXG5cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBEcm9wem9uZSBmcm9tICdyZWFjdC1kcm9wem9uZSc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gJy4vZWRpdG9yLW1vZGFsJztcbmltcG9ydCB7IEltcG9ydERhdGEsIHBhcnNlSW1wb3J0IH0gZnJvbSAnLi9saWIvaW1wb3J0ZXInO1xuXG5jb25zdCBJbXBvcnRDb21wb25lbnRDb250ZW50ID0gc3R5bGVkLmRpdmBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB3aWR0aDogMTAwJTtcbiAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gIGJhY2tncm91bmQtY2xpcDogcGFkZGluZy1ib3g7XG4gIGJvcmRlci1yYWRpdXM6IDAuM3JlbTtcbiAgb3V0bGluZTogMDtcbmA7XG5cbmNvbnN0IEltcG9ydENvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICB3aWR0aDogYXV0bztcbiAgaGVpZ2h0OiBhdXRvO1xuYDtcblxuY29uc3QgSW1wb3J0U2VsZWN0ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMC43NXJlbSAwLjc1cmVtIDByZW0gMC43NXJlbTtcbmA7XG5cbmNvbnN0IEltcG9ydEFyZWEgPSBzdHlsZWQuZGl2YFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6IGF1dG87XG4gIGhlaWdodDogYXV0bztcbiAgbWluLWhlaWdodDogMzAwcHg7XG4gIHBhZGRpbmc6IDByZW0gMXJlbTtcbmA7XG5cbmNvbnN0IEltcG9ydFRleHRBcmVhID0gc3R5bGVkLnRleHRhcmVhYFxuICBwYWRkaW5nOiAwcHg7XG4gIHdpZHRoOiAxMDAlO1xuICByZXNpemU6IHZlcnRpY2FsO1xuICBtaW4taGVpZ2h0OiAyNTBweDtcbiAgbWF4LWhlaWdodDogNDUwcHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYigyMDYsIDIxMiwgMjE4KTtcbiAgYm9yZGVyLXJhZGl1czogMC4zcmVtO1xuICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgc3lzdGVtLXVpLCAnU2Vnb2UgVUknLCBSb2JvdG8sICdIZWx2ZXRpY2EgTmV1ZScsIEFyaWFsLCAnTm90byBTYW5zJyxcbiAgICBzYW5zLXNlcmlmLCAnQXBwbGUgQ29sb3IgRW1vamknLCAnU2Vnb2UgVUkgRW1vamknLCAnU2Vnb2UgVUkgU3ltYm9sJywgJ05vdG8gQ29sb3IgRW1vamknO1xuICBmb250LXNpemU6IDFyZW07XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG5gO1xuXG5jb25zdCBJbXBvcnREcm9wQXJlYSA9IHN0eWxlZC5kaXZgXG4gIHBhZGRpbmc6IDBweDtcbiAgd2lkdGg6IDEwMCU7XG4gIG1pbi1oZWlnaHQ6IDI1MHB4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHJnYigyMDYsIDIxMiwgMjE4KTtcbiAgYm9yZGVyLXJhZGl1czogMC4zcmVtO1xuICBmb250ZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBzeXN0ZW0tdWksICdTZWdvZSBVSScsIFJvYm90bywgJ0hlbHZldGljYSBOZXVlJywgQXJpYWwsXG4gICAgJ05vdG8gU2Fucycgc2Fucy1zZXJpZiwgJ0FwcGxlIENvbG9yIEVtb2ppJywgJ1NlZ29lIFVJIEVtb2ppJywgJ1NlZ29lIFVJIFN5bWJvbCcsXG4gICAgJ05vdG8gQ29sb3IgRW1vamknO1xuICBmb250LXNpemU6IDFyZW07XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG5gO1xuXG5jb25zdCBJbXBvcnRJbmZvID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogYmxvY2s7XG4gIHBhZGRpbmc6IDByZW0gMXJlbTtcbmA7XG5cbmNvbnN0IEZvb3RlclJvdyA9IHN0eWxlZC5kaXZgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIHBhZGRpbmc6IDAuNzVyZW0gMC43NXJlbTtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHJnYigyMjIsIDIyNiwgMjMwKTtcbmA7XG5cbmV4cG9ydCB0eXBlIEltcG9ydENvbXBvbmVudFByb3BzID0ge1xuICBvbkltcG9ydDogKGFyZzA6IGFueSkgPT4gdW5rbm93bjtcbiAgb25WYWxpZGF0ZT86IChhcmcwOiBhbnkpID0+IHVua25vd247XG4gIG9uQ2FuY2VsOiAoKSA9PiB1bmtub3duO1xuICBhZGRpdGlvbmFsSW5wdXRzPzogUmVhY3QuUmVhY3ROb2RlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEltcG9ydENvbXBvbmVudChwcm9wczogSW1wb3J0Q29tcG9uZW50UHJvcHMpIHtcbiAgY29uc3QgW2lzSW1wb3J0VGV4dCwgc2V0SXNJbXBvcnRUZXh0XSA9IFJlYWN0LnVzZVN0YXRlKHRydWUpO1xuICBjb25zdCBbdGV4dCwgc2V0VGV4dF0gPSBSZWFjdC51c2VTdGF0ZSgnJyk7XG4gIGNvbnN0IFtpbXBvcnRGaWxlLCBzZXRJbXBvcnRGaWxlXSA9IFJlYWN0LnVzZVN0YXRlPEZpbGUgfCBudWxsPihudWxsKTtcblxuICBjb25zdCBbcGFyc2VSZXN1bHQsIHNldFBhcnNlUmVzdWx0XSA9IFJlYWN0LnVzZVN0YXRlPEltcG9ydERhdGE+KHtcbiAgICB2YWxpZDogZmFsc2UsXG4gICAgdmFsaWRhdGlvbkVycm9yczogW10sXG4gIH0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgYXN5bmMgZnVuY3Rpb24gcGFyc2VEYXRhKCkge1xuICAgICAgaWYgKGlzSW1wb3J0VGV4dCkge1xuICAgICAgICBzZXRQYXJzZVJlc3VsdChhd2FpdCBwYXJzZUltcG9ydCh0ZXh0KSk7XG4gICAgICB9IGVsc2UgaWYgKGltcG9ydEZpbGUgIT09IG51bGwpIHtcbiAgICAgICAgc2V0UGFyc2VSZXN1bHQoYXdhaXQgcGFyc2VJbXBvcnQoaW1wb3J0RmlsZSkpO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXJzZURhdGEoKTtcbiAgfSwgW2lzSW1wb3J0VGV4dCwgdGV4dCwgaW1wb3J0RmlsZV0pO1xuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHNldEltcG9ydEZpbGUobnVsbCk7XG4gICAgc2V0VGV4dCgnJyk7XG4gICAgcHJvcHMub25DYW5jZWwoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRGF0YVNldCgpIHtcbiAgICByZXR1cm4gKGlzSW1wb3J0VGV4dCAmJiB0ZXh0KSB8fCAoIWlzSW1wb3J0VGV4dCAmJiBpbXBvcnRGaWxlKTtcbiAgfVxuXG4gIC8vIENoZWNrIHZhbGlkaXR5IChhbmQgY2FsbCBjdXN0b20gdmFsaWRhdGlvbiBjYWxsYmFjayBpZiBwcmVzZW50KVxuICBjb25zdCB2YWxpZCA9XG4gICAgaXNEYXRhU2V0KCkgJiZcbiAgICBwYXJzZVJlc3VsdC52YWxpZCAmJlxuICAgICghcHJvcHMub25WYWxpZGF0ZSB8fCBwcm9wcy5vblZhbGlkYXRlKHBhcnNlUmVzdWx0LmZlYXR1cmVzKSk7XG5cbiAgcmV0dXJuIChcbiAgICA8SW1wb3J0Q29tcG9uZW50Q29udGVudD5cbiAgICAgIDxJbXBvcnRDb250ZW50PlxuICAgICAgICA8SW1wb3J0U2VsZWN0PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogaXNJbXBvcnRUZXh0ID8gJ3JnYigwLCAxMDUsIDIxNyknIDogJ3JnYig5MCwgOTgsIDk0KScsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRJc0ltcG9ydFRleHQodHJ1ZSk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIEltcG9ydCBGcm9tIFRleHRcbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGlzSW1wb3J0VGV4dCA/ICdyZ2IoOTAsIDk4LCA5NCknIDogJ3JnYigwLCAxMDUsIDIxNyknLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0SXNJbXBvcnRUZXh0KGZhbHNlKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgSW1wb3J0IEZyb20gRmlsZVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICA8L0ltcG9ydFNlbGVjdD5cbiAgICAgICAgPEltcG9ydEFyZWE+XG4gICAgICAgICAge2lzSW1wb3J0VGV4dCAmJiAoXG4gICAgICAgICAgICA8SW1wb3J0VGV4dEFyZWFcbiAgICAgICAgICAgICAgc3R5bGU9e2lzRGF0YVNldCgpICYmICFwYXJzZVJlc3VsdC52YWxpZCA/IHsgYm9yZGVyQ29sb3I6ICdyZ2IoMjIwLCA1MywgNjkpJyB9IDoge319XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldFRleHQoZXZlbnQudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgdmFsdWU9e3RleHR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgeyFpc0ltcG9ydFRleHQgJiYgKFxuICAgICAgICAgICAgPERyb3B6b25lIG9uRHJvcD17KGltcG9ydEZpbGVzKSA9PiBzZXRJbXBvcnRGaWxlKGltcG9ydEZpbGVzWzBdKX0+XG4gICAgICAgICAgICAgIHsoeyBnZXRSb290UHJvcHMsIGdldElucHV0UHJvcHMgfSkgPT4gKFxuICAgICAgICAgICAgICAgIDxJbXBvcnREcm9wQXJlYVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e1xuICAgICAgICAgICAgICAgICAgICBpc0RhdGFTZXQoKSAmJiAhcGFyc2VSZXN1bHQudmFsaWQgPyB7IGJvcmRlckNvbG9yOiAncmdiKDIyMCwgNTMsIDY5KScgfSA6IHt9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB7Li4uZ2V0Um9vdFByb3BzKCl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPGlucHV0IHsuLi5nZXRJbnB1dFByb3BzKCl9IC8+XG4gICAgICAgICAgICAgICAgICB7aW1wb3J0RmlsZSA/IChcbiAgICAgICAgICAgICAgICAgICAgPHA+XG4gICAgICAgICAgICAgICAgICAgICAgeyFwYXJzZVJlc3VsdC52YWxpZCA/ICdJbnZhbGlkJyA6ICcnfSBTZWxlY3RlZCBGaWxlOiB7aW1wb3J0RmlsZS5uYW1lfS48YnIgLz5cbiAgICAgICAgICAgICAgICAgICAgICBEcmFnICduJyBkcm9wIG9yIGNsaWNrIGFnYWluIHRvIGNoYW5nZSB0aGUgZmlsZS5cbiAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgPHA+RHJhZyAnbicgZHJvcCB5b3VyIGZpbGUgaGVyZSwgb3IgY2xpY2sgdG8gc2VsZWN0IGEgZmlsZS48L3A+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvSW1wb3J0RHJvcEFyZWE+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L0Ryb3B6b25lPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPEltcG9ydEluZm8gc3R5bGU9e3sgY29sb3I6ICdyZ2IoMTMzLCAxMDAsIDQpJywgYmFja2dyb3VuZENvbG9yOiAncmdiKDI1NSwgMjQzLCAyMDUpJyB9fT5cbiAgICAgICAgICAgIHtpc0RhdGFTZXQoKSAmJlxuICAgICAgICAgICAgICAhcGFyc2VSZXN1bHQudmFsaWQgJiZcbiAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICBwYXJzZVJlc3VsdC52YWxpZGF0aW9uRXJyb3JzLm1hcCgoZXJyLCBpKSA9PiA8ZGl2IGtleT17aX0+e2Vycn08L2Rpdj4pfVxuICAgICAgICAgIDwvSW1wb3J0SW5mbz5cbiAgICAgICAgPC9JbXBvcnRBcmVhPlxuICAgICAgICA8SW1wb3J0SW5mbz5cbiAgICAgICAgICBTdXBwb3J0ZWQgZm9ybWF0czpcbiAgICAgICAgICA8dWwgc3R5bGU9e3sgbWFyZ2luVG9wOiAnMCcgfX0+XG4gICAgICAgICAgICA8bGkga2V5PVwiZ2VvanNvblwiPlxuICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgIGhyZWY9XCJodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzk0NlwiXG4gICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICB0aXRsZT1cIkdlb0pTT04gU3BlY2lmaWNhdGlvblwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBHZW9KU09OXG4gICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8bGkga2V5PVwia21sXCI+XG4gICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgaHJlZj1cImh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2ttbC9cIlxuICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiXG4gICAgICAgICAgICAgICAgdGl0bGU9XCJLTUwgU3BlY2lmaWNhdGlvblwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBLTUxcbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDxsaSBrZXk9XCJ3a3RcIj5cbiAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvV2VsbC1rbm93bl90ZXh0XCJcbiAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgICAgIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIlxuICAgICAgICAgICAgICAgIHRpdGxlPVwiV0tUXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIFdLVFxuICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvSW1wb3J0SW5mbz5cbiAgICAgIDwvSW1wb3J0Q29udGVudD5cbiAgICAgIHtwcm9wcy5hZGRpdGlvbmFsSW5wdXRzIHx8IG51bGx9XG4gICAgICA8Rm9vdGVyUm93PlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgc3R5bGU9e1xuICAgICAgICAgICAgaXNEYXRhU2V0KClcbiAgICAgICAgICAgICAgPyB7IGJhY2tncm91bmRDb2xvcjogdmFsaWQgPyAncmdiKDAsIDEwNSwgMjE3KScgOiAncmdiKDIyMCwgNTMsIDY5KScgfVxuICAgICAgICAgICAgICA6IHsgYmFja2dyb3VuZENvbG9yOiAncmdiKDIwNiwgMjEyLCAyMTgpJyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGRpc2FibGVkPXshdmFsaWR9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgcHJvcHMub25JbXBvcnQoe1xuICAgICAgICAgICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgICAgICAgLy8gJEZsb3dGaXhNZSAtIGNhbid0IGJlIGNsaWNrZWQgaWYgaXQgaXMgaW52YWxpZCwgc28gZmVhdHVyZXMgd2lsbCBiZSB0aGVyZVxuICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgZmVhdHVyZXM6IHBhcnNlUmVzdWx0LmZlYXR1cmVzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmbHVzaCgpO1xuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICBJbXBvcnQgR2VvbWV0cnlcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gb25DbGljaz17Zmx1c2h9PkNhbmNlbDwvQnV0dG9uPlxuICAgICAgPC9Gb290ZXJSb3c+XG4gICAgPC9JbXBvcnRDb21wb25lbnRDb250ZW50PlxuICApO1xufVxuIl19