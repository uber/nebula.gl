"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportModal = ExportModal;

var React = _interopRequireWildcard(require("react"));

var _editorModal = require("./editor-modal");

var _exportComponent = require("./export-component");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-env browser */
function ExportModal(props) {
  return /*#__PURE__*/React.createElement(_editorModal.EditorModal, {
    onClose: props.onClose,
    title: 'Export',
    content: /*#__PURE__*/React.createElement(_exportComponent.ExportComponent, props)
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9leHBvcnQtbW9kYWwudHN4Il0sIm5hbWVzIjpbIkV4cG9ydE1vZGFsIiwicHJvcHMiLCJvbkNsb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7O0FBSkE7QUFhTyxTQUFTQSxXQUFULENBQXFCQyxLQUFyQixFQUE4QztBQUNuRCxzQkFDRSxvQkFBQyx3QkFBRDtBQUNFLElBQUEsT0FBTyxFQUFFQSxLQUFLLENBQUNDLE9BRGpCO0FBRUUsSUFBQSxLQUFLLEVBQUUsUUFGVDtBQUdFLElBQUEsT0FBTyxlQUFFLG9CQUFDLGdDQUFELEVBQXFCRCxLQUFyQjtBQUhYLElBREY7QUFPRCIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbnYgYnJvd3NlciAqL1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQW55R2VvSnNvbiB9IGZyb20gJ0BuZWJ1bGEuZ2wvZWRpdC1tb2Rlcyc7XG5pbXBvcnQgeyBFZGl0b3JNb2RhbCB9IGZyb20gJy4vZWRpdG9yLW1vZGFsJztcbmltcG9ydCB7IEV4cG9ydENvbXBvbmVudCB9IGZyb20gJy4vZXhwb3J0LWNvbXBvbmVudCc7XG5cbmV4cG9ydCB0eXBlIEV4cG9ydE1vZGFsUHJvcHMgPSB7XG4gIGdlb0pzb246IEFueUdlb0pzb247XG4gIG9uQ2xvc2U6ICgpID0+IHVua25vd247XG4gIGZpbGVuYW1lPzogc3RyaW5nO1xuICBhZGRpdGlvbmFsSW5wdXRzPzogUmVhY3QuUmVhY3ROb2RlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEV4cG9ydE1vZGFsKHByb3BzOiBFeHBvcnRNb2RhbFByb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPEVkaXRvck1vZGFsXG4gICAgICBvbkNsb3NlPXtwcm9wcy5vbkNsb3NlfVxuICAgICAgdGl0bGU9eydFeHBvcnQnfVxuICAgICAgY29udGVudD17PEV4cG9ydENvbXBvbmVudCB7Li4ucHJvcHN9IC8+fVxuICAgIC8+XG4gICk7XG59XG4iXX0=