"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImportModal = ImportModal;

var React = _interopRequireWildcard(require("react"));

var _importComponent = require("./import-component");

var _editorModal = require("./editor-modal");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-env browser */
function ImportModal(props) {
  return /*#__PURE__*/React.createElement(_editorModal.EditorModal, {
    onClose: props.onClose,
    title: 'Import',
    content: /*#__PURE__*/React.createElement(_importComponent.ImportComponent, {
      onImport: props.onImport,
      onCancel: props.onClose,
      additionalInputs: props.additionalInputs
    })
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbXBvcnQtbW9kYWwudHN4Il0sIm5hbWVzIjpbIkltcG9ydE1vZGFsIiwicHJvcHMiLCJvbkNsb3NlIiwib25JbXBvcnQiLCJhZGRpdGlvbmFsSW5wdXRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7O0FBSkE7QUFZTyxTQUFTQSxXQUFULENBQXFCQyxLQUFyQixFQUE4QztBQUNuRCxzQkFDRSxvQkFBQyx3QkFBRDtBQUNFLElBQUEsT0FBTyxFQUFFQSxLQUFLLENBQUNDLE9BRGpCO0FBRUUsSUFBQSxLQUFLLEVBQUUsUUFGVDtBQUdFLElBQUEsT0FBTyxlQUNMLG9CQUFDLGdDQUFEO0FBQ0UsTUFBQSxRQUFRLEVBQUVELEtBQUssQ0FBQ0UsUUFEbEI7QUFFRSxNQUFBLFFBQVEsRUFBRUYsS0FBSyxDQUFDQyxPQUZsQjtBQUdFLE1BQUEsZ0JBQWdCLEVBQUVELEtBQUssQ0FBQ0c7QUFIMUI7QUFKSixJQURGO0FBYUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cblxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgSW1wb3J0Q29tcG9uZW50IH0gZnJvbSAnLi9pbXBvcnQtY29tcG9uZW50JztcbmltcG9ydCB7IEVkaXRvck1vZGFsIH0gZnJvbSAnLi9lZGl0b3ItbW9kYWwnO1xuXG5leHBvcnQgdHlwZSBJbXBvcnRNb2RhbFByb3BzID0ge1xuICBvbkltcG9ydDogKGFyZzA6IGFueSkgPT4gdW5rbm93bjtcbiAgb25DbG9zZTogKCkgPT4gdW5rbm93bjtcbiAgYWRkaXRpb25hbElucHV0cz86IFJlYWN0LlJlYWN0Tm9kZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBJbXBvcnRNb2RhbChwcm9wczogSW1wb3J0TW9kYWxQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxFZGl0b3JNb2RhbFxuICAgICAgb25DbG9zZT17cHJvcHMub25DbG9zZX1cbiAgICAgIHRpdGxlPXsnSW1wb3J0J31cbiAgICAgIGNvbnRlbnQ9e1xuICAgICAgICA8SW1wb3J0Q29tcG9uZW50XG4gICAgICAgICAgb25JbXBvcnQ9e3Byb3BzLm9uSW1wb3J0fVxuICAgICAgICAgIG9uQ2FuY2VsPXtwcm9wcy5vbkNsb3NlfVxuICAgICAgICAgIGFkZGl0aW9uYWxJbnB1dHM9e3Byb3BzLmFkZGl0aW9uYWxJbnB1dHN9XG4gICAgICAgIC8+XG4gICAgICB9XG4gICAgLz5cbiAgKTtcbn1cbiJdfQ==