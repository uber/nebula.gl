"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawPointMode = void 0;

var _geojsonEditMode = require("./geojson-edit-mode");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DrawPointMode = /*#__PURE__*/function (_GeoJsonEditMode) {
  _inherits(DrawPointMode, _GeoJsonEditMode);

  var _super = _createSuper(DrawPointMode);

  function DrawPointMode() {
    _classCallCheck(this, DrawPointMode);

    return _super.apply(this, arguments);
  }

  _createClass(DrawPointMode, [{
    key: "createTentativeFeature",
    value: function createTentativeFeature(props) {
      var lastPointerMoveEvent = props.lastPointerMoveEvent;
      var lastCoords = lastPointerMoveEvent ? [lastPointerMoveEvent.mapCoords] : [];
      return {
        type: 'Feature',
        properties: {
          guideType: 'tentative'
        },
        geometry: {
          type: 'Point',
          coordinates: lastCoords[0]
        }
      };
    }
  }, {
    key: "handleClick",
    value: function handleClick(_ref, props) {
      var mapCoords = _ref.mapCoords;
      var geometry = {
        type: 'Point',
        coordinates: mapCoords
      }; // @ts-ignore

      props.onEdit(this.getAddFeatureAction(geometry, props.data));
    }
  }, {
    key: "handlePointerMove",
    value: function handlePointerMove(event, props) {
      props.onUpdateCursor('cell');

      _get(_getPrototypeOf(DrawPointMode.prototype), "handlePointerMove", this).call(this, event, props);
    }
  }]);

  return DrawPointMode;
}(_geojsonEditMode.GeoJsonEditMode);

exports.DrawPointMode = DrawPointMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZHJhdy1wb2ludC1tb2RlLnRzIl0sIm5hbWVzIjpbIkRyYXdQb2ludE1vZGUiLCJwcm9wcyIsImxhc3RQb2ludGVyTW92ZUV2ZW50IiwibGFzdENvb3JkcyIsIm1hcENvb3JkcyIsInR5cGUiLCJwcm9wZXJ0aWVzIiwiZ3VpZGVUeXBlIiwiZ2VvbWV0cnkiLCJjb29yZGluYXRlcyIsIm9uRWRpdCIsImdldEFkZEZlYXR1cmVBY3Rpb24iLCJkYXRhIiwiZXZlbnQiLCJvblVwZGF0ZUN1cnNvciIsIkdlb0pzb25FZGl0TW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRWFBLGE7Ozs7Ozs7Ozs7Ozs7MkNBQ1lDLEssRUFBdUQ7QUFBQSxVQUNwRUMsb0JBRG9FLEdBQzNDRCxLQUQyQyxDQUNwRUMsb0JBRG9FO0FBRTVFLFVBQU1DLFVBQVUsR0FBR0Qsb0JBQW9CLEdBQUcsQ0FBQ0Esb0JBQW9CLENBQUNFLFNBQXRCLENBQUgsR0FBc0MsRUFBN0U7QUFFQSxhQUFPO0FBQ0xDLFFBQUFBLElBQUksRUFBRSxTQUREO0FBRUxDLFFBQUFBLFVBQVUsRUFBRTtBQUNWQyxVQUFBQSxTQUFTLEVBQUU7QUFERCxTQUZQO0FBS0xDLFFBQUFBLFFBQVEsRUFBRTtBQUNSSCxVQUFBQSxJQUFJLEVBQUUsT0FERTtBQUVSSSxVQUFBQSxXQUFXLEVBQUVOLFVBQVUsQ0FBQyxDQUFEO0FBRmY7QUFMTCxPQUFQO0FBVUQ7OztzQ0FFc0NGLEssRUFBMkM7QUFBQSxVQUFwRUcsU0FBb0UsUUFBcEVBLFNBQW9FO0FBQ2hGLFVBQU1JLFFBQVEsR0FBRztBQUNmSCxRQUFBQSxJQUFJLEVBQUUsT0FEUztBQUVmSSxRQUFBQSxXQUFXLEVBQUVMO0FBRkUsT0FBakIsQ0FEZ0YsQ0FLaEY7O0FBQ0FILE1BQUFBLEtBQUssQ0FBQ1MsTUFBTixDQUFhLEtBQUtDLG1CQUFMLENBQXlCSCxRQUF6QixFQUFtQ1AsS0FBSyxDQUFDVyxJQUF6QyxDQUFiO0FBQ0Q7OztzQ0FFaUJDLEssRUFBeUJaLEssRUFBcUM7QUFDOUVBLE1BQUFBLEtBQUssQ0FBQ2EsY0FBTixDQUFxQixNQUFyQjs7QUFDQSwyRkFBd0JELEtBQXhCLEVBQStCWixLQUEvQjtBQUNEOzs7O0VBN0JnQ2MsZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDbGlja0V2ZW50LCBQb2ludGVyTW92ZUV2ZW50LCBNb2RlUHJvcHMsIFRlbnRhdGl2ZUZlYXR1cmUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBGZWF0dXJlQ29sbGVjdGlvbiB9IGZyb20gJy4uL2dlb2pzb24tdHlwZXMnO1xuaW1wb3J0IHsgR2VvSnNvbkVkaXRNb2RlIH0gZnJvbSAnLi9nZW9qc29uLWVkaXQtbW9kZSc7XG5cbmV4cG9ydCBjbGFzcyBEcmF3UG9pbnRNb2RlIGV4dGVuZHMgR2VvSnNvbkVkaXRNb2RlIHtcbiAgY3JlYXRlVGVudGF0aXZlRmVhdHVyZShwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPik6IFRlbnRhdGl2ZUZlYXR1cmUge1xuICAgIGNvbnN0IHsgbGFzdFBvaW50ZXJNb3ZlRXZlbnQgfSA9IHByb3BzO1xuICAgIGNvbnN0IGxhc3RDb29yZHMgPSBsYXN0UG9pbnRlck1vdmVFdmVudCA/IFtsYXN0UG9pbnRlck1vdmVFdmVudC5tYXBDb29yZHNdIDogW107XG5cbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBndWlkZVR5cGU6ICd0ZW50YXRpdmUnLFxuICAgICAgfSxcbiAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICAgIGNvb3JkaW5hdGVzOiBsYXN0Q29vcmRzWzBdLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaGFuZGxlQ2xpY2soeyBtYXBDb29yZHMgfTogQ2xpY2tFdmVudCwgcHJvcHM6IE1vZGVQcm9wczxGZWF0dXJlQ29sbGVjdGlvbj4pOiB2b2lkIHtcbiAgICBjb25zdCBnZW9tZXRyeSA9IHtcbiAgICAgIHR5cGU6ICdQb2ludCcsXG4gICAgICBjb29yZGluYXRlczogbWFwQ29vcmRzLFxuICAgIH07XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHByb3BzLm9uRWRpdCh0aGlzLmdldEFkZEZlYXR1cmVBY3Rpb24oZ2VvbWV0cnksIHByb3BzLmRhdGEpKTtcbiAgfVxuXG4gIGhhbmRsZVBvaW50ZXJNb3ZlKGV2ZW50OiBQb2ludGVyTW92ZUV2ZW50LCBwcm9wczogTW9kZVByb3BzPEZlYXR1cmVDb2xsZWN0aW9uPikge1xuICAgIHByb3BzLm9uVXBkYXRlQ3Vyc29yKCdjZWxsJyk7XG4gICAgc3VwZXIuaGFuZGxlUG9pbnRlck1vdmUoZXZlbnQsIHByb3BzKTtcbiAgfVxufVxuIl19