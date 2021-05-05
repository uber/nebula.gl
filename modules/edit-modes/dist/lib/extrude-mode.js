"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtrudeMode = void 0;

var _bearing = _interopRequireDefault(require("@turf/bearing"));

var _utils = require("../utils");

var _modifyMode = require("./modify-mode");

var _immutableFeatureCollection = require("./immutable-feature-collection");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

var ExtrudeMode = /*#__PURE__*/function (_ModifyMode) {
  _inherits(ExtrudeMode, _ModifyMode);

  var _super = _createSuper(ExtrudeMode);

  function ExtrudeMode() {
    var _this;

    _classCallCheck(this, ExtrudeMode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "isPointAdded", false);

    return _this;
  }

  _createClass(ExtrudeMode, [{
    key: "handleDragging",
    value: function handleDragging(event, props) {
      var editHandle = (0, _utils.getPickedEditHandle)(event.pointerDownPicks);

      if (editHandle) {
        var featureIndex = editHandle.properties.featureIndex;
        var positionIndexes = editHandle.properties.positionIndexes;
        var size = this.coordinatesSize(positionIndexes, featureIndex, props.data);
        positionIndexes = this.isPointAdded ? this.nextPositionIndexes(positionIndexes, size) : positionIndexes; // p1 and p1 are end points for edge

        var p1 = this.getPointForPositionIndexes(this.prevPositionIndexes(positionIndexes, size), featureIndex, props.data);
        var p2 = this.getPointForPositionIndexes(positionIndexes, featureIndex, props.data);

        if (p1 && p2) {
          // p3 and p4 are end points for moving (extruding) edge
          var _generatePointsParall = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, event.mapCoords),
              _generatePointsParall2 = _slicedToArray(_generatePointsParall, 2),
              p3 = _generatePointsParall2[0],
              p4 = _generatePointsParall2[1];

          var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replacePosition(featureIndex, this.prevPositionIndexes(positionIndexes, size), p4).replacePosition(featureIndex, positionIndexes, p3).getObject();
          props.onEdit({
            updatedData: updatedData,
            editType: 'extruding',
            editContext: {
              featureIndexes: [featureIndex],
              positionIndexes: this.nextPositionIndexes(positionIndexes, size),
              position: p3
            }
          });
          event.cancelPan();
        }
      }
    }
  }, {
    key: "handleStartDragging",
    value: function handleStartDragging(event, props) {
      var selectedFeatureIndexes = props.selectedIndexes;
      var editHandle = (0, _utils.getPickedIntermediateEditHandle)(event.picks);

      if (selectedFeatureIndexes.length && editHandle) {
        var _editHandle$propertie = editHandle.properties,
            positionIndexes = _editHandle$propertie.positionIndexes,
            featureIndex = _editHandle$propertie.featureIndex;
        var size = this.coordinatesSize(positionIndexes, featureIndex, props.data); // p1 and p1 are end points for edge

        var p1 = this.getPointForPositionIndexes(this.prevPositionIndexes(positionIndexes, size), featureIndex, props.data);
        var p2 = this.getPointForPositionIndexes(positionIndexes, featureIndex, props.data);

        if (p1 && p2) {
          var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data);

          if (!this.isOrthogonal(positionIndexes, featureIndex, size, props.data)) {
            updatedData = updatedData.addPosition(featureIndex, positionIndexes, p2);
          }

          if (!this.isOrthogonal(this.prevPositionIndexes(positionIndexes, size), featureIndex, size, props.data)) {
            updatedData = updatedData.addPosition(featureIndex, positionIndexes, p1);
            this.isPointAdded = true;
          }

          props.onEdit({
            updatedData: updatedData.getObject(),
            editType: 'startExtruding',
            editContext: {
              featureIndexes: [featureIndex],
              positionIndexes: positionIndexes,
              position: p1
            }
          });
        }
      }
    }
  }, {
    key: "handleStopDragging",
    value: function handleStopDragging(event, props) {
      var selectedFeatureIndexes = props.selectedIndexes;
      var editHandle = (0, _utils.getPickedEditHandle)(event.pointerDownPicks);

      if (selectedFeatureIndexes.length && editHandle) {
        var featureIndex = editHandle.properties.featureIndex;
        var positionIndexes = editHandle.properties.positionIndexes;
        var size = this.coordinatesSize(positionIndexes, featureIndex, props.data);
        positionIndexes = this.isPointAdded ? this.nextPositionIndexes(positionIndexes, size) : positionIndexes; // p1 and p1 are end points for edge

        var p1 = this.getPointForPositionIndexes(this.prevPositionIndexes(positionIndexes, size), featureIndex, props.data);
        var p2 = this.getPointForPositionIndexes(positionIndexes, featureIndex, props.data);

        if (p1 && p2) {
          // p3 and p4 are end points for new moved (extruded) edge
          var _generatePointsParall3 = (0, _utils.generatePointsParallelToLinePoints)(p1, p2, event.mapCoords),
              _generatePointsParall4 = _slicedToArray(_generatePointsParall3, 2),
              p3 = _generatePointsParall4[0],
              p4 = _generatePointsParall4[1];

          var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).replacePosition(featureIndex, this.prevPositionIndexes(positionIndexes, size), p4).replacePosition(featureIndex, positionIndexes, p3).getObject();
          props.onEdit({
            updatedData: updatedData,
            editType: 'extruded',
            editContext: {
              featureIndexes: [featureIndex],
              positionIndexes: positionIndexes,
              position: p3
            }
          });
        }
      }

      this.isPointAdded = false;
    }
  }, {
    key: "coordinatesSize",
    value: function coordinatesSize(positionIndexes, featureIndex, _ref) {
      var features = _ref.features;
      var size = 0;

      if (Array.isArray(positionIndexes)) {
        var feature = features[featureIndex];
        var coordinates = feature.geometry.coordinates; // for Multi polygons, length will be 3

        if (positionIndexes.length === 3) {
          var _positionIndexes = _slicedToArray(positionIndexes, 2),
              a = _positionIndexes[0],
              b = _positionIndexes[1];

          if (coordinates.length && coordinates[a].length) {
            size = coordinates[a][b].length;
          }
        } else {
          var _positionIndexes2 = _slicedToArray(positionIndexes, 1),
              _b = _positionIndexes2[0];

          if (coordinates.length && coordinates[_b].length) {
            size = coordinates[_b].length;
          }
        }
      }

      return size;
    }
  }, {
    key: "getBearing",
    value: function getBearing(p1, p2) {
      var angle = (0, _bearing["default"])(p1, p2);

      if (angle < 0) {
        return Math.floor(360 + angle);
      }

      return Math.floor(angle);
    }
  }, {
    key: "isOrthogonal",
    value: function isOrthogonal(positionIndexes, featureIndex, size, features) {
      if (!Array.isArray(positionIndexes)) {
        return false;
      }

      if (positionIndexes[positionIndexes.length - 1] === size - 1) {
        positionIndexes[positionIndexes.length - 1] = 0;
      }

      var prevPoint = this.getPointForPositionIndexes(this.prevPositionIndexes(positionIndexes, size), featureIndex, features);
      var nextPoint = this.getPointForPositionIndexes(this.nextPositionIndexes(positionIndexes, size), featureIndex, features);
      var currentPoint = this.getPointForPositionIndexes(positionIndexes, featureIndex, features);
      var prevAngle = this.getBearing(currentPoint, prevPoint);
      var nextAngle = this.getBearing(currentPoint, nextPoint);
      return [89, 90, 91, 269, 270, 271].includes(Math.abs(prevAngle - nextAngle));
    }
  }, {
    key: "nextPositionIndexes",
    value: function nextPositionIndexes(positionIndexes, size) {
      if (!Array.isArray(positionIndexes)) {
        return [];
      }

      var next = _toConsumableArray(positionIndexes);

      if (next.length) {
        next[next.length - 1] = next[next.length - 1] === size - 1 ? 0 : next[next.length - 1] + 1;
      }

      return next;
    }
  }, {
    key: "prevPositionIndexes",
    value: function prevPositionIndexes(positionIndexes, size) {
      if (!Array.isArray(positionIndexes)) {
        return [];
      }

      var prev = _toConsumableArray(positionIndexes);

      if (prev.length) {
        prev[prev.length - 1] = prev[prev.length - 1] === 0 ? size - 2 : prev[prev.length - 1] - 1;
      }

      return prev;
    }
  }, {
    key: "getPointForPositionIndexes",
    value: function getPointForPositionIndexes(positionIndexes, featureIndex, _ref2) {
      var features = _ref2.features;
      var p1;

      if (Array.isArray(positionIndexes)) {
        var feature = features[featureIndex];
        var coordinates = feature.geometry.coordinates; // for Multi polygons, length will be 3

        if (positionIndexes.length === 3) {
          var _positionIndexes3 = _slicedToArray(positionIndexes, 3),
              a = _positionIndexes3[0],
              b = _positionIndexes3[1],
              c = _positionIndexes3[2];

          if (coordinates.length && coordinates[a].length) {
            p1 = coordinates[a][b][c];
          }
        } else {
          var _positionIndexes4 = _slicedToArray(positionIndexes, 2),
              _b2 = _positionIndexes4[0],
              _c = _positionIndexes4[1];

          if (coordinates.length && coordinates[_b2].length) {
            p1 = coordinates[_b2][_c];
          }
        }
      }

      return p1;
    }
  }]);

  return ExtrudeMode;
}(_modifyMode.ModifyMode);

exports.ExtrudeMode = ExtrudeMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZXh0cnVkZS1tb2RlLnRzIl0sIm5hbWVzIjpbIkV4dHJ1ZGVNb2RlIiwiZXZlbnQiLCJwcm9wcyIsImVkaXRIYW5kbGUiLCJwb2ludGVyRG93blBpY2tzIiwiZmVhdHVyZUluZGV4IiwicHJvcGVydGllcyIsInBvc2l0aW9uSW5kZXhlcyIsInNpemUiLCJjb29yZGluYXRlc1NpemUiLCJkYXRhIiwiaXNQb2ludEFkZGVkIiwibmV4dFBvc2l0aW9uSW5kZXhlcyIsInAxIiwiZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMiLCJwcmV2UG9zaXRpb25JbmRleGVzIiwicDIiLCJtYXBDb29yZHMiLCJwMyIsInA0IiwidXBkYXRlZERhdGEiLCJJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbiIsInJlcGxhY2VQb3NpdGlvbiIsImdldE9iamVjdCIsIm9uRWRpdCIsImVkaXRUeXBlIiwiZWRpdENvbnRleHQiLCJmZWF0dXJlSW5kZXhlcyIsInBvc2l0aW9uIiwiY2FuY2VsUGFuIiwic2VsZWN0ZWRGZWF0dXJlSW5kZXhlcyIsInNlbGVjdGVkSW5kZXhlcyIsInBpY2tzIiwibGVuZ3RoIiwiaXNPcnRob2dvbmFsIiwiYWRkUG9zaXRpb24iLCJmZWF0dXJlcyIsIkFycmF5IiwiaXNBcnJheSIsImZlYXR1cmUiLCJjb29yZGluYXRlcyIsImdlb21ldHJ5IiwiYSIsImIiLCJhbmdsZSIsIk1hdGgiLCJmbG9vciIsInByZXZQb2ludCIsIm5leHRQb2ludCIsImN1cnJlbnRQb2ludCIsInByZXZBbmdsZSIsImdldEJlYXJpbmciLCJuZXh0QW5nbGUiLCJpbmNsdWRlcyIsImFicyIsIm5leHQiLCJwcmV2IiwiYyIsIk1vZGlmeU1vZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFPQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLFc7Ozs7Ozs7Ozs7Ozs7Ozs7bUVBR0ks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Q0FBZVYsTUFBekMsRUFBaUQ7QUFDL0NwQixZQUFBQSxFQUFFLEdBQUcyQixXQUFXLENBQUNHLEdBQUQsQ0FBWCxDQUFlYyxFQUFmLENBQUw7QUFDRDtBQUNGO0FBQ0Y7O0FBQ0QsYUFBTzVDLEVBQVA7QUFDRDs7OztFQWpQOEI2QyxzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZWFyaW5nIGZyb20gJ0B0dXJmL2JlYXJpbmcnO1xuaW1wb3J0IHtcbiAgZ2VuZXJhdGVQb2ludHNQYXJhbGxlbFRvTGluZVBvaW50cyxcbiAgZ2V0UGlja2VkRWRpdEhhbmRsZSxcbiAgZ2V0UGlja2VkSW50ZXJtZWRpYXRlRWRpdEhhbmRsZSxcbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi9nZW9qc29uLXR5cGVzJztcbmltcG9ydCB7IE1vZGVQcm9wcywgU3RhcnREcmFnZ2luZ0V2ZW50LCBTdG9wRHJhZ2dpbmdFdmVudCwgRHJhZ2dpbmdFdmVudCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IE1vZGlmeU1vZGUgfSBmcm9tICcuL21vZGlmeS1tb2RlJztcbmltcG9ydCB7IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi9pbW11dGFibGUtZmVhdHVyZS1jb2xsZWN0aW9uJztcblxuZXhwb3J0IGNsYXNzIEV4dHJ1ZGVNb2RlIGV4dGVuZHMgTW9kaWZ5TW9kZSB7XG4gIC8vIHRoaXMgbW9kZSBpcyBidXN0ZWQgPShcblxuICBpc1BvaW50QWRkZWQgPSBmYWxzZTtcblxuICBoYW5kbGVEcmFnZ2luZyhldmVudDogRHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICBjb25zdCBlZGl0SGFuZGxlID0gZ2V0UGlja2VkRWRpdEhhbmRsZShldmVudC5wb2ludGVyRG93blBpY2tzKTtcblxuICAgIGlmIChlZGl0SGFuZGxlKSB7XG4gICAgICBjb25zdCB7IGZlYXR1cmVJbmRleCB9ID0gZWRpdEhhbmRsZS5wcm9wZXJ0aWVzO1xuICAgICAgbGV0IHsgcG9zaXRpb25JbmRleGVzIH0gPSBlZGl0SGFuZGxlLnByb3BlcnRpZXM7XG5cbiAgICAgIGNvbnN0IHNpemUgPSB0aGlzLmNvb3JkaW5hdGVzU2l6ZShwb3NpdGlvbkluZGV4ZXMsIGZlYXR1cmVJbmRleCwgcHJvcHMuZGF0YSk7XG4gICAgICBwb3NpdGlvbkluZGV4ZXMgPSB0aGlzLmlzUG9pbnRBZGRlZFxuICAgICAgICA/IHRoaXMubmV4dFBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIHNpemUpXG4gICAgICAgIDogcG9zaXRpb25JbmRleGVzO1xuICAgICAgLy8gcDEgYW5kIHAxIGFyZSBlbmQgcG9pbnRzIGZvciBlZGdlXG4gICAgICBjb25zdCBwMSA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMoXG4gICAgICAgIHRoaXMucHJldlBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIHNpemUpLFxuICAgICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICAgIHByb3BzLmRhdGFcbiAgICAgICk7XG4gICAgICBjb25zdCBwMiA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBmZWF0dXJlSW5kZXgsIHByb3BzLmRhdGEpO1xuICAgICAgaWYgKHAxICYmIHAyKSB7XG4gICAgICAgIC8vIHAzIGFuZCBwNCBhcmUgZW5kIHBvaW50cyBmb3IgbW92aW5nIChleHRydWRpbmcpIGVkZ2VcbiAgICAgICAgY29uc3QgW3AzLCBwNF0gPSBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKHAxLCBwMiwgZXZlbnQubWFwQ29vcmRzKTtcblxuICAgICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKVxuICAgICAgICAgIC5yZXBsYWNlUG9zaXRpb24oZmVhdHVyZUluZGV4LCB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSwgcDQpXG4gICAgICAgICAgLnJlcGxhY2VQb3NpdGlvbihmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgcDMpXG4gICAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdFR5cGU6ICdleHRydWRpbmcnLFxuICAgICAgICAgIGVkaXRDb250ZXh0OiB7XG4gICAgICAgICAgICBmZWF0dXJlSW5kZXhlczogW2ZlYXR1cmVJbmRleF0sXG4gICAgICAgICAgICBwb3NpdGlvbkluZGV4ZXM6IHRoaXMubmV4dFBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIHNpemUpLFxuICAgICAgICAgICAgcG9zaXRpb246IHAzLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV2ZW50LmNhbmNlbFBhbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVN0YXJ0RHJhZ2dpbmcoZXZlbnQ6IFN0YXJ0RHJhZ2dpbmdFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pIHtcbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmVJbmRleGVzID0gcHJvcHMuc2VsZWN0ZWRJbmRleGVzO1xuXG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEludGVybWVkaWF0ZUVkaXRIYW5kbGUoZXZlbnQucGlja3MpO1xuICAgIGlmIChzZWxlY3RlZEZlYXR1cmVJbmRleGVzLmxlbmd0aCAmJiBlZGl0SGFuZGxlKSB7XG4gICAgICBjb25zdCB7IHBvc2l0aW9uSW5kZXhlcywgZmVhdHVyZUluZGV4IH0gPSBlZGl0SGFuZGxlLnByb3BlcnRpZXM7XG5cbiAgICAgIGNvbnN0IHNpemUgPSB0aGlzLmNvb3JkaW5hdGVzU2l6ZShwb3NpdGlvbkluZGV4ZXMsIGZlYXR1cmVJbmRleCwgcHJvcHMuZGF0YSk7XG4gICAgICAvLyBwMSBhbmQgcDEgYXJlIGVuZCBwb2ludHMgZm9yIGVkZ2VcbiAgICAgIGNvbnN0IHAxID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhcbiAgICAgICAgdGhpcy5wcmV2UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgICAgcHJvcHMuZGF0YVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHAyID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIGZlYXR1cmVJbmRleCwgcHJvcHMuZGF0YSk7XG5cbiAgICAgIGlmIChwMSAmJiBwMikge1xuICAgICAgICBsZXQgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSk7XG4gICAgICAgIGlmICghdGhpcy5pc09ydGhvZ29uYWwocG9zaXRpb25JbmRleGVzLCBmZWF0dXJlSW5kZXgsIHNpemUsIHByb3BzLmRhdGEpKSB7XG4gICAgICAgICAgdXBkYXRlZERhdGEgPSB1cGRhdGVkRGF0YS5hZGRQb3NpdGlvbihmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgcDIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhdGhpcy5pc09ydGhvZ29uYWwoXG4gICAgICAgICAgICB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgICAgICAgIHNpemUsXG4gICAgICAgICAgICBwcm9wcy5kYXRhXG4gICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICB1cGRhdGVkRGF0YSA9IHVwZGF0ZWREYXRhLmFkZFBvc2l0aW9uKGZlYXR1cmVJbmRleCwgcG9zaXRpb25JbmRleGVzLCBwMSk7XG4gICAgICAgICAgdGhpcy5pc1BvaW50QWRkZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvcHMub25FZGl0KHtcbiAgICAgICAgICB1cGRhdGVkRGF0YTogdXBkYXRlZERhdGEuZ2V0T2JqZWN0KCksXG4gICAgICAgICAgZWRpdFR5cGU6ICdzdGFydEV4dHJ1ZGluZycsXG4gICAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwMSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVTdG9wRHJhZ2dpbmcoZXZlbnQ6IFN0b3BEcmFnZ2luZ0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMgPSBwcm9wcy5zZWxlY3RlZEluZGV4ZXM7XG4gICAgY29uc3QgZWRpdEhhbmRsZSA9IGdldFBpY2tlZEVkaXRIYW5kbGUoZXZlbnQucG9pbnRlckRvd25QaWNrcyk7XG4gICAgaWYgKHNlbGVjdGVkRmVhdHVyZUluZGV4ZXMubGVuZ3RoICYmIGVkaXRIYW5kbGUpIHtcbiAgICAgIGNvbnN0IHsgZmVhdHVyZUluZGV4IH0gPSBlZGl0SGFuZGxlLnByb3BlcnRpZXM7XG4gICAgICBsZXQgeyBwb3NpdGlvbkluZGV4ZXMgfSA9IGVkaXRIYW5kbGUucHJvcGVydGllcztcblxuICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuY29vcmRpbmF0ZXNTaXplKHBvc2l0aW9uSW5kZXhlcywgZmVhdHVyZUluZGV4LCBwcm9wcy5kYXRhKTtcbiAgICAgIHBvc2l0aW9uSW5kZXhlcyA9IHRoaXMuaXNQb2ludEFkZGVkXG4gICAgICAgID8gdGhpcy5uZXh0UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgc2l6ZSlcbiAgICAgICAgOiBwb3NpdGlvbkluZGV4ZXM7XG4gICAgICAvLyBwMSBhbmQgcDEgYXJlIGVuZCBwb2ludHMgZm9yIGVkZ2VcbiAgICAgIGNvbnN0IHAxID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhcbiAgICAgICAgdGhpcy5wcmV2UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgICAgcHJvcHMuZGF0YVxuICAgICAgKTtcbiAgICAgIGNvbnN0IHAyID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIGZlYXR1cmVJbmRleCwgcHJvcHMuZGF0YSk7XG5cbiAgICAgIGlmIChwMSAmJiBwMikge1xuICAgICAgICAvLyBwMyBhbmQgcDQgYXJlIGVuZCBwb2ludHMgZm9yIG5ldyBtb3ZlZCAoZXh0cnVkZWQpIGVkZ2VcbiAgICAgICAgY29uc3QgW3AzLCBwNF0gPSBnZW5lcmF0ZVBvaW50c1BhcmFsbGVsVG9MaW5lUG9pbnRzKHAxLCBwMiwgZXZlbnQubWFwQ29vcmRzKTtcblxuICAgICAgICBjb25zdCB1cGRhdGVkRGF0YSA9IG5ldyBJbW11dGFibGVGZWF0dXJlQ29sbGVjdGlvbihwcm9wcy5kYXRhKVxuICAgICAgICAgIC5yZXBsYWNlUG9zaXRpb24oZmVhdHVyZUluZGV4LCB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSwgcDQpXG4gICAgICAgICAgLnJlcGxhY2VQb3NpdGlvbihmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgcDMpXG4gICAgICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgICAgIHByb3BzLm9uRWRpdCh7XG4gICAgICAgICAgdXBkYXRlZERhdGEsXG4gICAgICAgICAgZWRpdFR5cGU6ICdleHRydWRlZCcsXG4gICAgICAgICAgZWRpdENvbnRleHQ6IHtcbiAgICAgICAgICAgIGZlYXR1cmVJbmRleGVzOiBbZmVhdHVyZUluZGV4XSxcbiAgICAgICAgICAgIHBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwMyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pc1BvaW50QWRkZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGNvb3JkaW5hdGVzU2l6ZShcbiAgICBwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBmZWF0dXJlSW5kZXg6IG51bWJlcixcbiAgICB7IGZlYXR1cmVzIH06IEZlYXR1cmVDb2xsZWN0aW9uXG4gICkge1xuICAgIGxldCBzaXplID0gMDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwb3NpdGlvbkluZGV4ZXMpKSB7XG4gICAgICBjb25zdCBmZWF0dXJlID0gZmVhdHVyZXNbZmVhdHVyZUluZGV4XTtcbiAgICAgIGNvbnN0IGNvb3JkaW5hdGVzOiBhbnkgPSBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICAgICAgLy8gZm9yIE11bHRpIHBvbHlnb25zLCBsZW5ndGggd2lsbCBiZSAzXG4gICAgICBpZiAocG9zaXRpb25JbmRleGVzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICBjb25zdCBbYSwgYl0gPSBwb3NpdGlvbkluZGV4ZXM7XG4gICAgICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggJiYgY29vcmRpbmF0ZXNbYV0ubGVuZ3RoKSB7XG4gICAgICAgICAgc2l6ZSA9IGNvb3JkaW5hdGVzW2FdW2JdLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgW2JdID0gcG9zaXRpb25JbmRleGVzO1xuICAgICAgICBpZiAoY29vcmRpbmF0ZXMubGVuZ3RoICYmIGNvb3JkaW5hdGVzW2JdLmxlbmd0aCkge1xuICAgICAgICAgIHNpemUgPSBjb29yZGluYXRlc1tiXS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNpemU7XG4gIH1cblxuICBnZXRCZWFyaW5nKHAxOiBhbnksIHAyOiBhbnkpIHtcbiAgICBjb25zdCBhbmdsZSA9IGJlYXJpbmcocDEsIHAyKTtcbiAgICBpZiAoYW5nbGUgPCAwKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigzNjAgKyBhbmdsZSk7XG4gICAgfVxuICAgIHJldHVybiBNYXRoLmZsb29yKGFuZ2xlKTtcbiAgfVxuXG4gIGlzT3J0aG9nb25hbChcbiAgICBwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBmZWF0dXJlSW5kZXg6IG51bWJlcixcbiAgICBzaXplOiBudW1iZXIsXG4gICAgZmVhdHVyZXM6IEZlYXR1cmVDb2xsZWN0aW9uXG4gICkge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShwb3NpdGlvbkluZGV4ZXMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChwb3NpdGlvbkluZGV4ZXNbcG9zaXRpb25JbmRleGVzLmxlbmd0aCAtIDFdID09PSBzaXplIC0gMSkge1xuICAgICAgcG9zaXRpb25JbmRleGVzW3Bvc2l0aW9uSW5kZXhlcy5sZW5ndGggLSAxXSA9IDA7XG4gICAgfVxuICAgIGNvbnN0IHByZXZQb2ludCA9IHRoaXMuZ2V0UG9pbnRGb3JQb3NpdGlvbkluZGV4ZXMoXG4gICAgICB0aGlzLnByZXZQb3NpdGlvbkluZGV4ZXMocG9zaXRpb25JbmRleGVzLCBzaXplKSxcbiAgICAgIGZlYXR1cmVJbmRleCxcbiAgICAgIGZlYXR1cmVzXG4gICAgKTtcbiAgICBjb25zdCBuZXh0UG9pbnQgPSB0aGlzLmdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKFxuICAgICAgdGhpcy5uZXh0UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlcywgc2l6ZSksXG4gICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICBmZWF0dXJlc1xuICAgICk7XG4gICAgY29uc3QgY3VycmVudFBvaW50ID0gdGhpcy5nZXRQb2ludEZvclBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXMsIGZlYXR1cmVJbmRleCwgZmVhdHVyZXMpO1xuICAgIGNvbnN0IHByZXZBbmdsZSA9IHRoaXMuZ2V0QmVhcmluZyhjdXJyZW50UG9pbnQsIHByZXZQb2ludCk7XG4gICAgY29uc3QgbmV4dEFuZ2xlID0gdGhpcy5nZXRCZWFyaW5nKGN1cnJlbnRQb2ludCwgbmV4dFBvaW50KTtcbiAgICByZXR1cm4gWzg5LCA5MCwgOTEsIDI2OSwgMjcwLCAyNzFdLmluY2x1ZGVzKE1hdGguYWJzKHByZXZBbmdsZSAtIG5leHRBbmdsZSkpO1xuICB9XG5cbiAgbmV4dFBvc2l0aW9uSW5kZXhlcyhwb3NpdGlvbkluZGV4ZXM6IG51bWJlcltdIHwgbnVsbCB8IHVuZGVmaW5lZCwgc2l6ZTogbnVtYmVyKTogbnVtYmVyW10ge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShwb3NpdGlvbkluZGV4ZXMpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGNvbnN0IG5leHQgPSBbLi4ucG9zaXRpb25JbmRleGVzXTtcbiAgICBpZiAobmV4dC5sZW5ndGgpIHtcbiAgICAgIG5leHRbbmV4dC5sZW5ndGggLSAxXSA9IG5leHRbbmV4dC5sZW5ndGggLSAxXSA9PT0gc2l6ZSAtIDEgPyAwIDogbmV4dFtuZXh0Lmxlbmd0aCAtIDFdICsgMTtcbiAgICB9XG4gICAgcmV0dXJuIG5leHQ7XG4gIH1cblxuICBwcmV2UG9zaXRpb25JbmRleGVzKHBvc2l0aW9uSW5kZXhlczogbnVtYmVyW10gfCBudWxsIHwgdW5kZWZpbmVkLCBzaXplOiBudW1iZXIpOiBudW1iZXJbXSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHBvc2l0aW9uSW5kZXhlcykpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY29uc3QgcHJldiA9IFsuLi5wb3NpdGlvbkluZGV4ZXNdO1xuICAgIGlmIChwcmV2Lmxlbmd0aCkge1xuICAgICAgcHJldltwcmV2Lmxlbmd0aCAtIDFdID0gcHJldltwcmV2Lmxlbmd0aCAtIDFdID09PSAwID8gc2l6ZSAtIDIgOiBwcmV2W3ByZXYubGVuZ3RoIC0gMV0gLSAxO1xuICAgIH1cbiAgICByZXR1cm4gcHJldjtcbiAgfVxuXG4gIGdldFBvaW50Rm9yUG9zaXRpb25JbmRleGVzKFxuICAgIHBvc2l0aW9uSW5kZXhlczogbnVtYmVyW10gfCBudWxsIHwgdW5kZWZpbmVkLFxuICAgIGZlYXR1cmVJbmRleDogbnVtYmVyLFxuICAgIHsgZmVhdHVyZXMgfTogRmVhdHVyZUNvbGxlY3Rpb25cbiAgKSB7XG4gICAgbGV0IHAxO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHBvc2l0aW9uSW5kZXhlcykpIHtcbiAgICAgIGNvbnN0IGZlYXR1cmUgPSBmZWF0dXJlc1tmZWF0dXJlSW5kZXhdO1xuICAgICAgY29uc3QgY29vcmRpbmF0ZXM6IGFueSA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gICAgICAvLyBmb3IgTXVsdGkgcG9seWdvbnMsIGxlbmd0aCB3aWxsIGJlIDNcbiAgICAgIGlmIChwb3NpdGlvbkluZGV4ZXMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIGNvbnN0IFthLCBiLCBjXSA9IHBvc2l0aW9uSW5kZXhlcztcbiAgICAgICAgaWYgKGNvb3JkaW5hdGVzLmxlbmd0aCAmJiBjb29yZGluYXRlc1thXS5sZW5ndGgpIHtcbiAgICAgICAgICBwMSA9IGNvb3JkaW5hdGVzW2FdW2JdW2NdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBbYiwgY10gPSBwb3NpdGlvbkluZGV4ZXM7XG4gICAgICAgIGlmIChjb29yZGluYXRlcy5sZW5ndGggJiYgY29vcmRpbmF0ZXNbYl0ubGVuZ3RoKSB7XG4gICAgICAgICAgcDEgPSBjb29yZGluYXRlc1tiXVtjXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcDE7XG4gIH1cbn1cbiJdfQ==