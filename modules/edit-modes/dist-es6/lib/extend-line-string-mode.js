"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendLineStringMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode");

var _immutableFeatureCollection = require("./immutable-feature-collection");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var ExtendLineStringMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(ExtendLineStringMode, _GeoJsonEditMode);

  var _super = _createSuper(ExtendLineStringMode);

  function ExtendLineStringMode() {
    _classCallCheck(this, ExtendLineStringMode);

    return _super.apply(this, arguments);
  }

  _createClass(ExtendLineStringMode, [{
    key: "getSingleSelectedLineString",
    value: function getSingleSelectedLineString(props) {
      var selectedGeometry = this.getSelectedGeometry(props);

      if (selectedGeometry && selectedGeometry.type === 'LineString') {
        return selectedGeometry;
      }

      return null;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event, props) {
      var selectedIndexes = props.selectedIndexes;
      var selectedLineString = this.getSingleSelectedLineString(props);

      if (!selectedLineString) {
        console.warn("ExtendLineStringMode only supported for single LineString selection"); // eslint-disable-line

        return;
      } // Extend the LineString


      var positionIndexes = [selectedLineString.coordinates.length];
      var modeConfig = props.modeConfig;

      if (modeConfig && modeConfig.drawAtFront) {
        positionIndexes = [0];
      }

      var featureIndex = selectedIndexes[0];
      var updatedData = new _immutableFeatureCollection.ImmutableFeatureCollection(props.data).addPosition(featureIndex, positionIndexes, event.mapCoords).getObject();
      props.onEdit({
        updatedData: updatedData,
        editType: 'addPosition',
        editContext: {
          featureIndexes: [featureIndex],
          positionIndexes: positionIndexes,
          position: event.mapCoords
        }
      });
    }
  }, {
    key: "getGuides",
    value: function getGuides(props) {
      var guides = {
        type: 'FeatureCollection',
        features: []
      };
      var selectedLineString = this.getSingleSelectedLineString(props);

      if (!selectedLineString) {
        // nothing to do
        // @ts-ignore
        return guides;
      }

      var mapCoords = props.lastPointerMoveEvent && props.lastPointerMoveEvent.mapCoords; // Draw an extension line starting from one end of the selected LineString to the cursor

      var startPosition = null;
      var modeConfig = props.modeConfig;

      if (modeConfig && modeConfig.drawAtFront) {
        startPosition = selectedLineString.coordinates[0];
      } else {
        startPosition = selectedLineString.coordinates[selectedLineString.coordinates.length - 1];
      }

      guides.features.push({
        type: 'Feature',
        properties: {
          guideType: 'tentative'
        },
        geometry: {
          type: 'LineString',
          coordinates: [startPosition, mapCoords]
        }
      }); // @ts-ignore

      return guides;
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      props.onUpdateCursor('cell');
    }
  }]);

  return ExtendLineStringMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.ExtendLineStringMode = ExtendLineStringMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZXh0ZW5kLWxpbmUtc3RyaW5nLW1vZGUudHMiXSwibmFtZXMiOlsiRXh0ZW5kTGluZVN0cmluZ01vZGUiLCJwcm9wcyIsInNlbGVjdGVkR2VvbWV0cnkiLCJnZXRTZWxlY3RlZEdlb21ldHJ5IiwidHlwZSIsImV2ZW50Iiwic2VsZWN0ZWRJbmRleGVzIiwic2VsZWN0ZWRMaW5lU3RyaW5nIiwiZ2V0U2luZ2xlU2VsZWN0ZWRMaW5lU3RyaW5nIiwiY29uc29sZSIsIndhcm4iLCJwb3NpdGlvbkluZGV4ZXMiLCJjb29yZGluYXRlcyIsImxlbmd0aCIsIm1vZGVDb25maWciLCJkcmF3QXRGcm9udCIsImZlYXR1cmVJbmRleCIsInVwZGF0ZWREYXRhIiwiSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24iLCJkYXRhIiwiYWRkUG9zaXRpb24iLCJtYXBDb29yZHMiLCJnZXRPYmplY3QiLCJvbkVkaXQiLCJlZGl0VHlwZSIsImVkaXRDb250ZXh0IiwiZmVhdHVyZUluZGV4ZXMiLCJwb3NpdGlvbiIsImd1aWRlcyIsImZlYXR1cmVzIiwibGFzdFBvaW50ZXJNb3ZlRXZlbnQiLCJzdGFydFBvc2l0aW9uIiwicHVzaCIsInByb3BlcnRpZXMiLCJndWlkZVR5cGUiLCJnZW9tZXRyeSIsIm9uVXBkYXRlQ3Vyc29yIiwiR2VvSnNvbkVkaXRNb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVhQSxvQjs7Ozs7Ozs7Ozs7OztnREFDaUJDLEssRUFBb0U7QUFDOUYsVUFBTUMsZ0JBQWdCLEdBQUcsS0FBS0MsbUJBQUwsQ0FBeUJGLEtBQXpCLENBQXpCOztBQUVBLFVBQUlDLGdCQUFnQixJQUFJQSxnQkFBZ0IsQ0FBQ0UsSUFBakIsS0FBMEIsWUFBbEQsRUFBZ0U7QUFDOUQsZUFBT0YsZ0JBQVA7QUFDRDs7QUFDRCxhQUFPLElBQVA7QUFDRDs7O2dDQUVXRyxLLEVBQW1CSixLLEVBQXFDO0FB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LGdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9zaXRpb24sIExpbmVTdHJpbmcsIEZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi4vZ2VvanNvbi10eXBlcyc7XG5pbXBvcnQgeyBDbGlja0V2ZW50LCBQb2ludGVyTW92ZUV2ZW50LCBNb2RlUHJvcHMsIEd1aWRlRmVhdHVyZUNvbGxlY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBHZW9Kc29uRWRpdE1vZGUgfSBmcm9tICcuL2dlb2pzb24tZWRpdC1tb2RlJztcbmltcG9ydCB7IEltbXV0YWJsZUZlYXR1cmVDb2xsZWN0aW9uIH0gZnJvbSAnLi9pbW11dGFibGUtZmVhdHVyZS1jb2xsZWN0aW9uJztcblxuZXhwb3J0IGNsYXNzIEV4dGVuZExpbmVTdHJpbmdNb2RlIGV4dGVuZHMgR2VvSnNvbkVkaXRNb2RlIHtcbiAgZ2V0U2luZ2xlU2VsZWN0ZWRMaW5lU3RyaW5nKHByb3BzOiBNb2RlUHJvcHM8RmVhdHVyZUNvbGxlY3Rpb24+KTogTGluZVN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHNlbGVjdGVkR2VvbWV0cnkgPSB0aGlzLmdldFNlbGVjdGVkR2VvbWV0cnkocHJvcHMpO1xuXG4gICAgaWYgKHNlbGVjdGVkR2VvbWV0cnkgJiYgc2VsZWN0ZWRHZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIHJldHVybiBzZWxlY3RlZEdlb21ldHJ5O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKGV2ZW50OiBDbGlja0V2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRJbmRleGVzIH0gPSBwcm9wcztcbiAgICBjb25zdCBzZWxlY3RlZExpbmVTdHJpbmcgPSB0aGlzLmdldFNpbmdsZVNlbGVjdGVkTGluZVN0cmluZyhwcm9wcyk7XG5cbiAgICBpZiAoIXNlbGVjdGVkTGluZVN0cmluZykge1xuICAgICAgY29uc29sZS53YXJuKGBFeHRlbmRMaW5lU3RyaW5nTW9kZSBvbmx5IHN1cHBvcnRlZCBmb3Igc2luZ2xlIExpbmVTdHJpbmcgc2VsZWN0aW9uYCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBFeHRlbmQgdGhlIExpbmVTdHJpbmdcbiAgICBsZXQgcG9zaXRpb25JbmRleGVzID0gW3NlbGVjdGVkTGluZVN0cmluZy5jb29yZGluYXRlcy5sZW5ndGhdO1xuXG4gICAgY29uc3QgbW9kZUNvbmZpZyA9IHByb3BzLm1vZGVDb25maWc7XG4gICAgaWYgKG1vZGVDb25maWcgJiYgbW9kZUNvbmZpZy5kcmF3QXRGcm9udCkge1xuICAgICAgcG9zaXRpb25JbmRleGVzID0gWzBdO1xuICAgIH1cbiAgICBjb25zdCBmZWF0dXJlSW5kZXggPSBzZWxlY3RlZEluZGV4ZXNbMF07XG4gICAgY29uc3QgdXBkYXRlZERhdGEgPSBuZXcgSW1tdXRhYmxlRmVhdHVyZUNvbGxlY3Rpb24ocHJvcHMuZGF0YSlcbiAgICAgIC5hZGRQb3NpdGlvbihmZWF0dXJlSW5kZXgsIHBvc2l0aW9uSW5kZXhlcywgZXZlbnQubWFwQ29vcmRzKVxuICAgICAgLmdldE9iamVjdCgpO1xuXG4gICAgcHJvcHMub25FZGl0KHtcbiAgICAgIHVwZGF0ZWREYXRhLFxuICAgICAgZWRpdFR5cGU6ICdhZGRQb3NpdGlvbicsXG4gICAgICBlZGl0Q29udGV4dDoge1xuICAgICAgICBmZWF0dXJlSW5kZXhlczogW2ZlYXR1cmVJbmRleF0sXG4gICAgICAgIHBvc2l0aW9uSW5kZXhlcyxcbiAgICAgICAgcG9zaXRpb246IGV2ZW50Lm1hcENvb3JkcyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBnZXRHdWlkZXMocHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiBHdWlkZUZlYXR1cmVDb2xsZWN0aW9uIHtcbiAgICBjb25zdCBndWlkZXMgPSB7XG4gICAgICB0eXBlOiAnRmVhdHVyZUNvbGxlY3Rpb24nLFxuICAgICAgZmVhdHVyZXM6IFtdLFxuICAgIH07XG5cbiAgICBjb25zdCBzZWxlY3RlZExpbmVTdHJpbmcgPSB0aGlzLmdldFNpbmdsZVNlbGVjdGVkTGluZVN0cmluZyhwcm9wcyk7XG4gICAgaWYgKCFzZWxlY3RlZExpbmVTdHJpbmcpIHtcbiAgICAgIC8vIG5vdGhpbmcgdG8gZG9cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJldHVybiBndWlkZXM7XG4gICAgfVxuXG4gICAgY29uc3QgbWFwQ29vcmRzID0gcHJvcHMubGFzdFBvaW50ZXJNb3ZlRXZlbnQgJiYgcHJvcHMubGFzdFBvaW50ZXJNb3ZlRXZlbnQubWFwQ29vcmRzO1xuXG4gICAgLy8gRHJhdyBhbiBleHRlbnNpb24gbGluZSBzdGFydGluZyBmcm9tIG9uZSBlbmQgb2YgdGhlIHNlbGVjdGVkIExpbmVTdHJpbmcgdG8gdGhlIGN1cnNvclxuICAgIGxldCBzdGFydFBvc2l0aW9uOiBQb3NpdGlvbiB8IG51bGwgfCB1bmRlZmluZWQgPSBudWxsO1xuICAgIGNvbnN0IHsgbW9kZUNvbmZpZyB9ID0gcHJvcHM7XG4gICAgaWYgKG1vZGVDb25maWcgJiYgbW9kZUNvbmZpZy5kcmF3QXRGcm9udCkge1xuICAgICAgc3RhcnRQb3NpdGlvbiA9IHNlbGVjdGVkTGluZVN0cmluZy5jb29yZGluYXRlc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRQb3NpdGlvbiA9IHNlbGVjdGVkTGluZVN0cmluZy5jb29yZGluYXRlc1tzZWxlY3RlZExpbmVTdHJpbmcuY29vcmRpbmF0ZXMubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgZ3VpZGVzLmZlYXR1cmVzLnB1c2goe1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBndWlkZVR5cGU6ICd0ZW50YXRpdmUnLFxuICAgICAgfSxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIHR5cGU6ICdMaW5lU3RyaW5nJyxcbiAgICAgICAgY29vcmRpbmF0ZXM6IFtzdGFydFBvc2l0aW9uLCBtYXBDb29yZHNdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIGd1aWRlcztcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIHByb3BzLm9uVXBkYXRlQ3Vyc29yKCdjZWxsJyk7XG4gIH1cbn1cbiJdfQ==