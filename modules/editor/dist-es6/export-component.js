"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportComponent = ExportComponent;

var React = _interopRequireWildcard(require("react"));

var _clipboardCopy = _interopRequireDefault(require("clipboard-copy"));

var _downloadjs = _interopRequireDefault(require("downloadjs"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _exporter = require("./lib/exporter");

var _editorModal = require("./editor-modal");

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
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: flex-end;\n  padding: 0.75rem 0.75rem;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  padding: 0px;\n  width: 100%;\n  resize: vertical;\n  min-height: 300px;\n  max-height: 500px;\n  border: 1px solid rgb(206, 212, 218);\n  border-radius: 0.3rem;\n  font-family: -apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',\n    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';\n  font-size: 1rem;\n  font-weight: 400;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  box-sizing: border-box;\n  display: block;\n  width: auto;\n  height: auto;\n  min-height: 300px;\n  padding: 0rem 1rem;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  padding: 0.75rem 0.75rem 0rem 0.75rem;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var FormatSelect = _styledComponents["default"].div(_templateObject());

var ExportArea = _styledComponents["default"].div(_templateObject2());

var ExportData = _styledComponents["default"].textarea(_templateObject3());

var FooterRow = _styledComponents["default"].div(_templateObject4());

function ExportComponent(_ref) {
  var geoJson = _ref.geoJson,
      onClose = _ref.onClose,
      filename = _ref.filename,
      additionalInputs = _ref.additionalInputs;

  var _React$useState = React.useState('geoJson'),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      format = _React$useState2[0],
      setFormat = _React$useState2[1];

  var filenameValue = filename;

  if (!filenameValue) {
    if (geoJson.type === 'FeatureCollection') {
      filenameValue = 'features';
    } else {
      // single feature
      filenameValue = geoJson.properties.name || geoJson.id || 'feature';
    }
  }

  var exportParams = React.useMemo(function () {
    switch (format) {
      case 'geoJson':
        return (0, _exporter.toGeoJson)(geoJson, filenameValue);

      case 'kml':
        return (0, _exporter.toKml)(geoJson, filenameValue);

      case 'wkt':
        return (0, _exporter.toWkt)(geoJson, filenameValue);

      default:
        throw Error("Unsupported format ".concat(format));
    }
  }, [geoJson, format, filenameValue]);
  var tooMuch = exportParams.data.length > 500000;

  function copyData() {
    (0, _clipboardCopy["default"])(exportParams.data).then(function () {
      return onClose();
    }); // TODO Design and add in a notifications banner for errors in the modal.
    //   .catch(err => {alert(`Error copying to clipboard: `, err)})
  }

  function downloadData() {
    (0, _downloadjs["default"])(new Blob([exportParams.data]), exportParams.filename, exportParams.mimetype);
    onClose();
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormatSelect, null, /*#__PURE__*/React.createElement("strong", {
    style: {
      padding: '0.5rem 0.25rem'
    }
  }, "Format:"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: format === 'geoJson' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)'
    },
    onClick: function onClick() {
      return setFormat('geoJson');
    }
  }, "GeoJSON"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: format === 'kml' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)'
    },
    onClick: function onClick() {
      return setFormat('kml');
    }
  }, "KML"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: format === 'wkt' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)'
    },
    onClick: function onClick() {
      return setFormat('wkt');
    }
  }, "WKT")), /*#__PURE__*/React.createElement(ExportArea, null, /*#__PURE__*/React.createElement(ExportData, {
    readOnly: true,
    style: tooMuch ? {
      fontStyle: 'italic',
      padding: '0.75rem 0rem'
    } : {},
    value: tooMuch ? 'Too much data to display. Download or Copy to clipboard instead.' : exportParams.data
  })), additionalInputs || null, /*#__PURE__*/React.createElement(FooterRow, null, /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: 'rgb(0, 105, 217)'
    },
    onClick: downloadData
  }, "Download"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    style: {
      backgroundColor: 'rgb(0, 105, 217)'
    },
    onClick: copyData
  }, "Copy"), /*#__PURE__*/React.createElement(_editorModal.Button, {
    onClick: onClose
  }, "Cancel")));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9leHBvcnQtY29tcG9uZW50LnRzeCJdLCJuYW1lcyI6WyJGb3JtYXRTZWxlY3QiLCJzdHlsZWQiLCJkaXYiLCJFeHBvcnRBcmVhIiwiRXhwb3J0RGF0YSIsInRleHRhcmVhIiwiRm9vdGVyUm93IiwiRXhwb3J0Q29tcG9uZW50IiwiZ2VvSnNvbiIsIm9uQ2xvc2UiLCJmaWxlbmFtZSIsImFkZGl0aW9uYWxJbnB1dHMiLCJSZWFjdCIsInVzZVN0YXRlIiwiZm9ybWF0Iiwic2V0Rm9ybWF0IiwiZmlsZW5hbWVWYWx1ZSIsInR5cGUiLCJwcm9wZXJ0aWVzIiwibmFtZSIsImlkIiwiZXhwb3J0UGFyYW1zIiwidXNlTWVtbyIsIkVycm9yIiwidG9vTXVjaCIsImRhdGEiLCJsZW5ndGgiLCJjb3B5RGF0YSIsInRoZW4iLCJkb3dubG9hZERhdGEiLCJCbG9iIiwibWltZXR5cGUiLCJwYWRkaW5nIiwiYmFja2dyb3VuZENvbG9yIiwiZm9udFN0eWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxZQUFZLEdBQUdDLDZCQUFPQyxHQUFWLG1CQUFsQjs7QUFLQSxJQUFNQyxVQUFVLEdBQUdGLDZCQUFPQyxHQUFWLG9CQUFoQjs7QUFTQSxJQUFNRSxVQUFVLEdBQUdILDZCQUFPSSxRQUFWLG9CQUFoQjs7QUFjQSxJQUFNQyxTQUFTLEdBQUdMLDZCQUFPQyxHQUFWLG9CQUFmOztBQWFPLFNBQVNLLGVBQVQsT0FLa0I7QUFBQSxNQUp2QkMsT0FJdUIsUUFKdkJBLE9BSXVCO0FBQUEsTUFIdkJDLE9BR3VCLFFBSHZCQSxPQUd1QjtBQUFBLE1BRnZCQyxRQUV1QixRQUZ2QkEsUUFFdUI7QUFBQSxNQUR2QkMsZ0JBQ3VCLFFBRHZCQSxnQkFDdUI7O0FBQUEsd0JBQ0tDLEtBQUss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SFIsT0FBTyxHQUNILGtFQURHLEdBRUhILFlBQVksQ0FBQ0k7QUFOckIsSUFERixDQTVCRixFQXVDR2QsZ0JBQWdCLElBQUksSUF2Q3ZCLGVBd0NFLG9CQUFDLFNBQUQscUJBQ0Usb0JBQUMsbUJBQUQ7QUFBUSxJQUFBLEtBQUssRUFBRTtBQUFFc0IsTUFBQUEsZUFBZSxFQUFFO0FBQW5CLEtBQWY7QUFBd0QsSUFBQSxPQUFPLEVBQUVKO0FBQWpFLGdCQURGLGVBSUUsb0JBQUMsbUJBQUQ7QUFBUSxJQUFBLEtBQUssRUFBRTtBQUFFSSxNQUFBQSxlQUFlLEVBQUU7QUFBbkIsS0FBZjtBQUF3RCxJQUFBLE9BQU8sRUFBRU47QUFBakUsWUFKRixlQU9FLG9CQUFDLG1CQUFEO0FBQVEsSUFBQSxPQUFPLEVBQUVsQjtBQUFqQixjQVBGLENBeENGLENBREY7QUFvREQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNvcHkgZnJvbSAnY2xpcGJvYXJkLWNvcHknO1xuaW1wb3J0IGRvd25sb2FkanMgZnJvbSAnZG93bmxvYWRqcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcbmltcG9ydCB7IHRvR2VvSnNvbiwgdG9LbWwsIHRvV2t0IH0gZnJvbSAnLi9saWIvZXhwb3J0ZXInO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnLi9lZGl0b3ItbW9kYWwnO1xuXG5jb25zdCBGb3JtYXRTZWxlY3QgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwLjc1cmVtIDAuNzVyZW0gMHJlbSAwLjc1cmVtO1xuYDtcblxuY29uc3QgRXhwb3J0QXJlYSA9IHN0eWxlZC5kaXZgXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogYXV0bztcbiAgaGVpZ2h0OiBhdXRvO1xuICBtaW4taGVpZ2h0OiAzMDBweDtcbiAgcGFkZGluZzogMHJlbSAxcmVtO1xuYDtcblxuY29uc3QgRXhwb3J0RGF0YSA9IHN0eWxlZC50ZXh0YXJlYWBcbiAgcGFkZGluZzogMHB4O1xuICB3aWR0aDogMTAwJTtcbiAgcmVzaXplOiB2ZXJ0aWNhbDtcbiAgbWluLWhlaWdodDogMzAwcHg7XG4gIG1heC1oZWlnaHQ6IDUwMHB4O1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2IoMjA2LCAyMTIsIDIxOCk7XG4gIGJvcmRlci1yYWRpdXM6IDAuM3JlbTtcbiAgZm9udC1mYW1pbHk6IC1hcHBsZS1zeXN0ZW0sIHN5c3RlbS11aSwgJ1NlZ29lIFVJJywgUm9ib3RvLCAnSGVsdmV0aWNhIE5ldWUnLCBBcmlhbCwgJ05vdG8gU2FucycsXG4gICAgc2Fucy1zZXJpZiwgJ0FwcGxlIENvbG9yIEVtb2ppJywgJ1NlZ29lIFVJIEVtb2ppJywgJ1NlZ29lIFVJIFN5bWJvbCcsICdOb3RvIENvbG9yIEVtb2ppJztcbiAgZm9udC1zaXplOiAxcmVtO1xuICBmb250LXdlaWdodDogNDAwO1xuYDtcblxuY29uc3QgRm9vdGVyUm93ID0gc3R5bGVkLmRpdmBcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgcGFkZGluZzogMC43NXJlbSAwLjc1cmVtO1xuYDtcblxuZXhwb3J0IHR5cGUgRXhwb3J0Q29tcG9uZW50UHJvcHMgPSB7XG4gIGdlb0pzb246IGFueTtcbiAgb25DbG9zZTogKCkgPT4gdW5rbm93bjtcbiAgZmlsZW5hbWU/OiBzdHJpbmc7XG4gIGFkZGl0aW9uYWxJbnB1dHM/OiBSZWFjdC5SZWFjdE5vZGU7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gRXhwb3J0Q29tcG9uZW50KHtcbiAgZ2VvSnNvbixcbiAgb25DbG9zZSxcbiAgZmlsZW5hbWUsXG4gIGFkZGl0aW9uYWxJbnB1dHMsXG59OiBFeHBvcnRDb21wb25lbnRQcm9wcykge1xuICBjb25zdCBbZm9ybWF0LCBzZXRGb3JtYXRdID0gUmVhY3QudXNlU3RhdGUoJ2dlb0pzb24nKTtcblxuICBsZXQgZmlsZW5hbWVWYWx1ZSA9IGZpbGVuYW1lO1xuICBpZiAoIWZpbGVuYW1lVmFsdWUpIHtcbiAgICBpZiAoZ2VvSnNvbi50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nKSB7XG4gICAgICBmaWxlbmFtZVZhbHVlID0gJ2ZlYXR1cmVzJztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc2luZ2xlIGZlYXR1cmVcbiAgICAgIGZpbGVuYW1lVmFsdWUgPSBnZW9Kc29uLnByb3BlcnRpZXMubmFtZSB8fCBnZW9Kc29uLmlkIHx8ICdmZWF0dXJlJztcbiAgICB9XG4gIH1cblxuICBjb25zdCBleHBvcnRQYXJhbXMgPSBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgICAgY2FzZSAnZ2VvSnNvbic6XG4gICAgICAgIHJldHVybiB0b0dlb0pzb24oZ2VvSnNvbiwgZmlsZW5hbWVWYWx1ZSk7XG4gICAgICBjYXNlICdrbWwnOlxuICAgICAgICByZXR1cm4gdG9LbWwoZ2VvSnNvbiwgZmlsZW5hbWVWYWx1ZSk7XG4gICAgICBjYXNlICd3a3QnOlxuICAgICAgICByZXR1cm4gdG9Xa3QoZ2VvSnNvbiwgZmlsZW5hbWVWYWx1ZSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBFcnJvcihgVW5zdXBwb3J0ZWQgZm9ybWF0ICR7Zm9ybWF0fWApO1xuICAgIH1cbiAgfSwgW2dlb0pzb24sIGZvcm1hdCwgZmlsZW5hbWVWYWx1ZV0pO1xuICBjb25zdCB0b29NdWNoID0gZXhwb3J0UGFyYW1zLmRhdGEubGVuZ3RoID4gNTAwMDAwO1xuXG4gIGZ1bmN0aW9uIGNvcHlEYXRhKCkge1xuICAgIGNvcHkoZXhwb3J0UGFyYW1zLmRhdGEpLnRoZW4oKCkgPT4gb25DbG9zZSgpKTtcbiAgICAvLyBUT0RPIERlc2lnbiBhbmQgYWRkIGluIGEgbm90aWZpY2F0aW9ucyBiYW5uZXIgZm9yIGVycm9ycyBpbiB0aGUgbW9kYWwuXG4gICAgLy8gICAuY2F0Y2goZXJyID0+IHthbGVydChgRXJyb3IgY29weWluZyB0byBjbGlwYm9hcmQ6IGAsIGVycil9KVxuICB9XG5cbiAgZnVuY3Rpb24gZG93bmxvYWREYXRhKCkge1xuICAgIGRvd25sb2FkanMobmV3IEJsb2IoW2V4cG9ydFBhcmFtcy5kYXRhXSksIGV4cG9ydFBhcmFtcy5maWxlbmFtZSwgZXhwb3J0UGFyYW1zLm1pbWV0eXBlKTtcbiAgICBvbkNsb3NlKCk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8Rm9ybWF0U2VsZWN0PlxuICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IHBhZGRpbmc6ICcwLjVyZW0gMC4yNXJlbScgfX0+Rm9ybWF0Ojwvc3Ryb25nPlxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogZm9ybWF0ID09PSAnZ2VvSnNvbicgPyAncmdiKDAsIDEwNSwgMjE3KScgOiAncmdiKDkwLCA5OCwgOTQpJyxcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZvcm1hdCgnZ2VvSnNvbicpfVxuICAgICAgICA+XG4gICAgICAgICAgR2VvSlNPTlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGZvcm1hdCA9PT0gJ2ttbCcgPyAncmdiKDAsIDEwNSwgMjE3KScgOiAncmdiKDkwLCA5OCwgOTQpJyxcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZvcm1hdCgna21sJyl9XG4gICAgICAgID5cbiAgICAgICAgICBLTUxcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b25cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBmb3JtYXQgPT09ICd3a3QnID8gJ3JnYigwLCAxMDUsIDIxNyknIDogJ3JnYig5MCwgOTgsIDk0KScsXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGb3JtYXQoJ3drdCcpfVxuICAgICAgICA+XG4gICAgICAgICAgV0tUXG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9Gb3JtYXRTZWxlY3Q+XG4gICAgICA8RXhwb3J0QXJlYT5cbiAgICAgICAgPEV4cG9ydERhdGFcbiAgICAgICAgICByZWFkT25seT17dHJ1ZX1cbiAgICAgICAgICBzdHlsZT17dG9vTXVjaCA/IHsgZm9udFN0eWxlOiAnaXRhbGljJywgcGFkZGluZzogJzAuNzVyZW0gMHJlbScgfSA6IHt9fVxuICAgICAgICAgIHZhbHVlPXtcbiAgICAgICAgICAgIHRvb011Y2hcbiAgICAgICAgICAgICAgPyAnVG9vIG11Y2ggZGF0YSB0byBkaXNwbGF5LiBEb3dubG9hZCBvciBDb3B5IHRvIGNsaXBib2FyZCBpbnN0ZWFkLidcbiAgICAgICAgICAgICAgOiBleHBvcnRQYXJhbXMuZGF0YVxuICAgICAgICAgIH1cbiAgICAgICAgLz5cbiAgICAgIDwvRXhwb3J0QXJlYT5cbiAgICAgIHthZGRpdGlvbmFsSW5wdXRzIHx8IG51bGx9XG4gICAgICA8Rm9vdGVyUm93PlxuICAgICAgICA8QnV0dG9uIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogJ3JnYigwLCAxMDUsIDIxNyknIH19IG9uQ2xpY2s9e2Rvd25sb2FkRGF0YX0+XG4gICAgICAgICAgRG93bmxvYWRcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiAncmdiKDAsIDEwNSwgMjE3KScgfX0gb25DbGljaz17Y29weURhdGF9PlxuICAgICAgICAgIENvcHlcbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDxCdXR0b24gb25DbGljaz17b25DbG9zZX0+Q2FuY2VsPC9CdXR0b24+XG4gICAgICA8L0Zvb3RlclJvdz5cbiAgICA8Lz5cbiAgKTtcbn1cbiJdfQ==