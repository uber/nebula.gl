"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorModal = EditorModal;
exports.Button = void 0;

var React = _interopRequireWildcard(require("react"));

var _styledReactModal = _interopRequireWildcard(require("styled-react-modal"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n  font-size: 1.25rem;\n  font-weight: 500;\n  margin: 0;\n"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  padding: 0.75rem 0.75rem;\n  border-bottom: 1px solid rgb(222, 226, 230);\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  pointer-events: auto;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 0.3rem;\n  outline: 0;\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n  position: relative;\n  display: block;\n  width: 50rem;\n  height: auto;\n  max-width: 500px;\n  margin: 1.75rem auto;\n  box-sizing: border-box;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  font-size: 1rem;\n  font-weight: 400;\n  color: rgb(21, 25, 29);\n  line-height: 1.5;\n  text-align: left;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  display: inline-block;\n  color: #fff;\n  background-color: rgb(90, 98, 94);\n  font-size: 1em;\n  margin: 0.25em;\n  padding: 0.375em 0.75em;\n  border: 1px solid transparent;\n  border-radius: 0.25em;\n  display: block;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Button = _styledComponents["default"].button(_templateObject());

exports.Button = Button;

var StyledModal = _styledReactModal["default"].styled(_templateObject2());

var Content = _styledComponents["default"].div(_templateObject3());

var HeaderRow = _styledComponents["default"].div(_templateObject4());

var Header = _styledComponents["default"].h5(_templateObject5());

function EditorModal(props) {
  var _React$useState = React.useState(true),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isOpen = _React$useState2[0],
      setIsOpen = _React$useState2[1];

  function toggleModal() {
    if (isOpen) {
      props.onClose();
    }

    setIsOpen(!isOpen);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_styledReactModal.ModalProvider, null, /*#__PURE__*/React.createElement(StyledModal, {
    isOpen: isOpen,
    onBackgroundClick: toggleModal,
    onEscapeKeydown: toggleModal
  }, /*#__PURE__*/React.createElement(Content, null, /*#__PURE__*/React.createElement(HeaderRow, null, /*#__PURE__*/React.createElement(Header, null, props.title)), props.content))));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lZGl0b3ItbW9kYWwudHN4Il0sIm5hbWVzIjpbIkJ1dHRvbiIsInN0eWxlZCIsImJ1dHRvbiIsIlN0eWxlZE1vZGFsIiwiTW9kYWwiLCJDb250ZW50IiwiZGl2IiwiSGVhZGVyUm93IiwiSGVhZGVyIiwiaDUiLCJFZGl0b3JNb2RhbCIsInByb3BzIiwiUmVhY3QiLCJ1c2VTdGF0ZSIsImlzT3BlbiIsInNldElzT3BlbiIsInRvZ2dsZU1vZGFsIiwib25DbG9zZSIsInRpdGxlIiwiY29udGVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFTyxJQUFNQSxNQUFNLEdBQUdDLDZCQUFPQyxNQUFWLG1CQUFaOzs7O0FBWVAsSUFBTUMsV0FBVyxHQUFHQyw2QkFBTUgsTUFBVCxvQkFBakI7O0FBZ0JBLElBQU1JLE9BQU8sR0FBR0osNkJBQU9LLEdBQVYsb0JBQWI7O0FBYUEsSUFBTUMsU0FBUyxHQUFHTiw2QkFBT0ssR0FBVixvQkFBZjs7QUFRQSxJQUFNRSxNQUFNLEdBQUdQLDZCQUFPUSxFQUFWLG9CQUFaOztBQVlPLFNBQVNDLFdBQVQsQ0FBcUJDLEtBQXJCLEVBQXdDO0FBQUEsd0JBQ2pCQyxLQUFLLENBQUNDLFFBQU4sQ0FBZSxJQUFmLENBRGlCO0FBQUE7QUFBQSxNQUN0Q0MsTUFEc0M7QUFBQSxNQUM5QkMsU0FEOEI7O0FBRzdDLFdBQVNDLFdBQVQsR0FBdUI7QUFDckIsUUFBSUYsTUFBSixFQUFZO0FBQ1ZILE1BQUFBLEtBQUssQ0FBQ00sT0FBTjtBQUNEOztBQUNERixJQUFBQSxTQUFTLENBQUMsQ0FBQ0QsTUFBRixDQUFUO0FBQ0Q7O0FBRUQsc0JBQ0UsdURBQ0Usb0JBQUMsK0JBQUQscUJBQ0Usb0JBQUMsV0FBRDtBQUFhLElBQUEsTUFBTSxFQUFFQSxNQUFyQjtBQUE2QixJQUFBLGlCQUFpQixFQUFFRSxXQUFoRDtBQUE2RCxJQUFBLGVBQWUsRUFBRUE7QUFBOUUsa0JBQ0Usb0JBQUMsT0FBRCxxQkFDRSxvQkFBQyxTQUFELHFCQUNFLG9CQUFDLE1BQUQsUUFBU0wsS0FBSyxDQUFDTyxLQUFmLENBREYsQ0FERixFQUlHUCxLQUFLLENBQUNRLE9BSlQsQ0FERixDQURGLENBREYsQ0FERjtBQWNEIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWVudiBicm93c2VyICovXG5cbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBNb2RhbCwgeyBNb2RhbFByb3ZpZGVyIH0gZnJvbSAnc3R5bGVkLXJlYWN0LW1vZGFsJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5leHBvcnQgY29uc3QgQnV0dG9uID0gc3R5bGVkLmJ1dHRvbmBcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBjb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDkwLCA5OCwgOTQpO1xuICBmb250LXNpemU6IDFlbTtcbiAgbWFyZ2luOiAwLjI1ZW07XG4gIHBhZGRpbmc6IDAuMzc1ZW0gMC43NWVtO1xuICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogMC4yNWVtO1xuICBkaXNwbGF5OiBibG9jaztcbmA7XG5cbmNvbnN0IFN0eWxlZE1vZGFsID0gTW9kYWwuc3R5bGVkYFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogNTByZW07XG4gIGhlaWdodDogYXV0bztcbiAgbWF4LXdpZHRoOiA1MDBweDtcbiAgbWFyZ2luOiAxLjc1cmVtIGF1dG87XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBcIkhlbHZldGljYSBOZXVlXCIsIEFyaWFsLCBcIk5vdG8gU2Fuc1wiLCBzYW5zLXNlcmlmLCBcIkFwcGxlIENvbG9yIEVtb2ppXCIsIFwiU2Vnb2UgVUkgRW1vamlcIiwgXCJTZWdvZSBVSSBTeW1ib2xcIiwgXCJOb3RvIENvbG9yIEVtb2ppXCI7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgY29sb3I6IHJnYigyMSwgMjUsIDI5KTtcbiAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbmA7XG5cbmNvbnN0IENvbnRlbnQgPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHdpZHRoOiAxMDAlO1xuICBwb2ludGVyLWV2ZW50czogYXV0bztcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgYmFja2dyb3VuZC1jbGlwOiBwYWRkaW5nLWJveDtcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjIpO1xuICBib3JkZXItcmFkaXVzOiAwLjNyZW07XG4gIG91dGxpbmU6IDA7XG5gO1xuXG5jb25zdCBIZWFkZXJSb3cgPSBzdHlsZWQuZGl2YFxuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBwYWRkaW5nOiAwLjc1cmVtIDAuNzVyZW07XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2IoMjIyLCAyMjYsIDIzMCk7XG5gO1xuXG5jb25zdCBIZWFkZXIgPSBzdHlsZWQuaDVgXG4gIGZvbnQtc2l6ZTogMS4yNXJlbTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgbWFyZ2luOiAwO1xuYDtcblxuZXhwb3J0IHR5cGUgTW9kYWxQcm9wcyA9IHtcbiAgdGl0bGU6IGFueTtcbiAgY29udGVudDogYW55O1xuICBvbkNsb3NlOiAoKSA9PiB1bmtub3duO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEVkaXRvck1vZGFsKHByb3BzOiBNb2RhbFByb3BzKSB7XG4gIGNvbnN0IFtpc09wZW4sIHNldElzT3Blbl0gPSBSZWFjdC51c2VTdGF0ZSh0cnVlKTtcblxuICBmdW5jdGlvbiB0b2dnbGVNb2RhbCgpIHtcbiAgICBpZiAoaXNPcGVuKSB7XG4gICAgICBwcm9wcy5vbkNsb3NlKCk7XG4gICAgfVxuICAgIHNldElzT3BlbighaXNPcGVuKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxNb2RhbFByb3ZpZGVyPlxuICAgICAgICA8U3R5bGVkTW9kYWwgaXNPcGVuPXtpc09wZW59IG9uQmFja2dyb3VuZENsaWNrPXt0b2dnbGVNb2RhbH0gb25Fc2NhcGVLZXlkb3duPXt0b2dnbGVNb2RhbH0+XG4gICAgICAgICAgPENvbnRlbnQ+XG4gICAgICAgICAgICA8SGVhZGVyUm93PlxuICAgICAgICAgICAgICA8SGVhZGVyPntwcm9wcy50aXRsZX08L0hlYWRlcj5cbiAgICAgICAgICAgIDwvSGVhZGVyUm93PlxuICAgICAgICAgICAge3Byb3BzLmNvbnRlbnR9XG4gICAgICAgICAgPC9Db250ZW50PlxuICAgICAgICA8L1N0eWxlZE1vZGFsPlxuICAgICAgPC9Nb2RhbFByb3ZpZGVyPlxuICAgIDwvPlxuICApO1xufVxuIl19