"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.SELECTION_TYPE = void 0;

var _layers = require("@deck.gl/layers");

var _helpers = require("@turf/helpers");

var _bbox = _interopRequireDefault(require("@turf/bbox"));

var _bboxPolygon = _interopRequireDefault(require("@turf/bbox-polygon"));

var _buffer = _interopRequireDefault(require("@turf/buffer"));

var _difference = _interopRequireDefault(require("@turf/difference"));

var _distance = _interopRequireDefault(require("@turf/distance"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var POLYGON_LINE_COLOR = [0, 255, 0, 255];
var POLYGON_FILL_COLOR = [255, 255, 255, 90];
var POLYGON_LINE_WIDTH = 2;
var POLYGON_DASHES = [20, 20];
var POLYGON_THRESHOLD = 0.01;
var EXPANSION_KM = 10;
var LAYER_ID_VIEW = 'DeckDrawerView';
var LAYER_ID_PICK = 'DeckDrawerPick';
var SELECTION_TYPE = {
  NONE: null,
  RECTANGLE: 'rectangle',
  POLYGON: 'polygon'
};
exports.SELECTION_TYPE = SELECTION_TYPE;

var DeckDrawer = /*#__PURE__*/function () {
  function DeckDrawer(nebula) {
    _classCallCheck(this, DeckDrawer);

    _defineProperty(this, "nebula", void 0);

    _defineProperty(this, "usePolygon", void 0);

    _defineProperty(this, "validPolygon", void 0);

    _defineProperty(this, "landPoints", void 0);

    _defineProperty(this, "mousePoints", void 0);

    this.nebula = nebula;
    this.usePolygon = false;
    this.landPoints = [];
    this.mousePoints = [];
  }

  _createClass(DeckDrawer, [{
    key: "_getLayerIds",
    value: function _getLayerIds() {
      // TODO: sort by mouse priority
      return this.nebula.deckgl.props.layers.filter(function (l) {
        return l && l.props && l.props.nebulaLayer && l.props.nebulaLayer.enableSelection;
      }).map(function (l) {
        return l.id;
      });
    }
  }, {
    key: "_selectFromPickingInfos",
    value: function _selectFromPickingInfos(pickingInfos) {
      var objects = pickingInfos.map(function (_ref) {
        var layer = _ref.layer,
            index = _ref.index,
            object = _ref.object;
        return object.original || layer.props.nebulaLayer.deckCache.originals[index];
      });
      this.nebula.props.onSelection(objects);
    }
  }, {
    key: "_getBoundingBox",
    value: function _getBoundingBox() {
      var mousePoints = this.mousePoints;
      var allX = mousePoints.map(function (mousePoint) {
        return mousePoint[0];
      });
      var allY = mousePoints.map(function (mousePoint) {
        return mousePoint[1];
      });
      var x = Math.min.apply(Math, _toConsumableArray(allX));
      var y = Math.min.apply(Math, _toConsumableArray(allY));
      var maxX = Math.max.apply(Math, _toConsumableArray(allX));
      var maxY = Math.max.apply(Math, _toConsumableArray(allY));
      return {
        x: x,
        y: y,
        width: maxX - x,
        height: maxY - y
      };
    }
  }, {
    key: "_selectRectangleObjects",
    value: function _selectRectangleObjects() {
      if (this.landPoints.length !== 2) return;

      var _this$mousePoints$ = _slicedToArray(this.mousePoints[0], 2),
          x1 = _this$mousePoints$[0],
          y1 = _this$mousePoints$[1];

      var _this$mousePoints$2 = _slicedToArray(this.mousePoints[1], 2),
          x2 = _this$mousePoints$2[0],
          y2 = _this$mousePoints$2[1];

      var pickingInfos = this.nebula.deckgl.pickObjects({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
        layerIds: this._getLayerIds()
      });

      this._selectFromPickingInfos(pickingInfos);
    }
  }, {
    key: "_selectPolygonObjects",
    value: function _selectPolygonObjects() {
      var pickingInfos = this.nebula.deckgl.pickObjects(_objectSpread({}, this._getBoundingBox(), {
        layerIds: [LAYER_ID_PICK].concat(_toConsumableArray(this._getLayerIds()))
      }));

      this._selectFromPickingInfos(pickingInfos.filter(function (item) {
        return item.layer.id !== LAYER_ID_PICK;
      }));
    }
  }, {
    key: "_getMousePosFromEvent",
    value: function _getMousePosFromEvent(event) {
      var offsetX = event.offsetX,
          offsetY = event.offsetY;
      return [offsetX, offsetY];
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event, lngLat, selectionType) {
      // capture all events (mouse-up is needed to prevent us stuck in moving map)
      if (event.type !== 'mouseup') event.stopPropagation(); // @ts-ignore

      this.usePolygon = selectionType === SELECTION_TYPE.POLYGON;
      var redraw = false;
      var deactivate = false;
      var usePolygon = this.usePolygon,
          landPoints = this.landPoints,
          mousePoints = this.mousePoints;

      if (event.type === 'mousedown') {
        if (usePolygon && landPoints.length) {
          // if landPoints.length is zero we want to insert two points (so we let it run the else)
          // also don't insert if polygon is invalid
          if (this.landPoints.length < 3 || this.validPolygon) {
            landPoints.push(lngLat);
            mousePoints.push(this._getMousePosFromEvent(event));
          }
        } else {
          this.landPoints = [lngLat, lngLat];

          var m = this._getMousePosFromEvent(event);

          this.mousePoints = [m, m];
        }

        redraw = true;
      } else if (event.type === 'mousemove' && landPoints.length) {
        // update last point
        landPoints[landPoints.length - 1] = lngLat;
        mousePoints[mousePoints.length - 1] = this._getMousePosFromEvent(event);
        redraw = true;
      } else if (event.type === 'mouseup') {
        if (usePolygon) {
          // check to see if completed
          // TODO: Maybe double-click to finish?
          if (landPoints.length > 4 && (0, _distance["default"])(landPoints[0], landPoints[landPoints.length - 1]) < POLYGON_THRESHOLD && this.validPolygon) {
            this._selectPolygonObjects();

            this.reset();
            redraw = true;
            deactivate = true;
          }
        } else {
          this._selectRectangleObjects();

          this.reset();
          redraw = true;
          deactivate = true;
        }
      }

      return {
        redraw: redraw,
        deactivate: deactivate
      };
    }
  }, {
    key: "reset",
    value: function reset() {
      this.landPoints = [];
      this.mousePoints = [];
    }
  }, {
    key: "_makeStartPointHighlight",
    value: function _makeStartPointHighlight(center) {
      var buffer = (0, _buffer["default"])((0, _helpers.point)(center), POLYGON_THRESHOLD / 4.0); // @ts-ignore

      return (0, _bboxPolygon["default"])((0, _bbox["default"])(buffer)).geometry.coordinates;
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var data = [];
      var dataPick = [];

      if (!this.usePolygon && this.landPoints.length === 2) {
        // Use mouse points instead of land points so we get the right shape
        // no matter what bearing is.
        var _this$mousePoints = _slicedToArray(this.mousePoints, 2),
            _this$mousePoints$3 = _slicedToArray(_this$mousePoints[0], 2),
            x1 = _this$mousePoints$3[0],
            y1 = _this$mousePoints$3[1],
            _this$mousePoints$4 = _slicedToArray(_this$mousePoints[1], 2),
            x2 = _this$mousePoints$4[0],
            y2 = _this$mousePoints$4[1];

        var selPolygon = [[x1, y1], [x1, y2], [x2, y2], [x2, y1], [x1, y1]].map(function (mousePos) {
          return _this.nebula.unprojectMousePosition(mousePos);
        });
        data.push({
          polygon: selPolygon,
          lineColor: POLYGON_LINE_COLOR,
          fillColor: POLYGON_FILL_COLOR
        });
      } else if (this.usePolygon && this.landPoints.length) {
        data.push({
          polygon: this.landPoints,
          lineColor: POLYGON_LINE_COLOR,
          fillColor: POLYGON_FILL_COLOR
        }); // Hack: use a polygon to hide the outside, because pickObjects()
        // does not support polygons

        if (this.landPoints.length >= 3) {
          var landPointsPoly = (0, _helpers.polygon)([[].concat(_toConsumableArray(this.landPoints), [this.landPoints[0]])]);
          var bigBuffer = (0, _buffer["default"])((0, _helpers.point)(this.landPoints[0]), EXPANSION_KM);
          var bigPolygon;

          try {
            // turfDifference throws an exception if the polygon
            // intersects with itself
            bigPolygon = (0, _difference["default"])(bigBuffer, landPointsPoly);
            dataPick.push({
              polygon: bigPolygon.geometry.coordinates,
              fillColor: [0, 0, 0, 1]
            });
            this.validPolygon = true;
          } catch (e) {
            // invalid selection polygon
            this.validPolygon = false;
          }
        }
      }

      if (this.landPoints.length) {
        // highlight start point
        data.push({
          polygon: this._makeStartPointHighlight(this.landPoints[0]),
          lineColor: [0, 0, 0, 0],
          fillColor: POLYGON_LINE_COLOR
        });
      } // Hack to make the PolygonLayer() stay active,
      // otherwise it takes 3 seconds (!) to init!
      // TODO: fix this


      data.push({
        polygon: [[0, 0]]
      });
      dataPick.push({
        polygon: [[0, 0]]
      });
      return [new _layers.PolygonLayer({
        id: LAYER_ID_VIEW,
        data: data,
        // @ts-ignore
        fp64: false,
        opacity: 1.0,
        pickable: false,
        lineWidthMinPixels: POLYGON_LINE_WIDTH,
        lineWidthMaxPixels: POLYGON_LINE_WIDTH,
        lineDashJustified: true,
        getLineDashArray: function getLineDashArray(x) {
          return POLYGON_DASHES;
        },
        // @ts-ignore
        getLineColor: function getLineColor(obj) {
          return obj.lineColor || [0, 0, 0, 255];
        },
        // @ts-ignore
        getFillColor: function getFillColor(obj) {
          return obj.fillColor || [0, 0, 0, 255];
        },
        // @ts-ignore
        getPolygon: function getPolygon(o) {
          return o.polygon;
        }
      }), new _layers.PolygonLayer({
        id: LAYER_ID_PICK,
        data: dataPick,
        // @ts-ignore
        getLineColor: function getLineColor(obj) {
          return obj.lineColor || [0, 0, 0, 255];
        },
        // @ts-ignore
        getFillColor: function getFillColor(obj) {
          return obj.fillColor || [0, 0, 0, 255];
        },
        // @ts-ignore
        fp64: false,
        opacity: 1.0,
        stroked: false,
        pickable: true,
        // @ts-ignore
        getPolygon: function getPolygon(o) {
          return o.polygon;
        }
      })];
    }
  }]);

  return DeckDrawer;
}();

exports["default"] = DeckDrawer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGVjay1yZW5kZXJlci9kZWNrLWRyYXdlci50cyJdLCJuYW1lcyI6WyJQT0xZR09OX0xJTkVfQ09MT1IiLCJQT0xZR09OX0ZJTExfQ09MT1IiLCJQT0xZR09OX0xJTkVfV0lEVEgiLCJQT0xZR09OX0RBU0hFUyIsIlBPTFlHT05fVEhSRVNIT0xEIiwiRVhQQU5TSU9OX0tNIiwiTEFZRVJfSURfVklFVyIsIkxBWUVSX0lEX1BJQ0siLCJTRUxFQ1RJT05fVFlQRSIsIk5PTkUiLCJSRUNUQU5HTEUiLCJQT0xZR09OIiwiRGVja0RyYXdlciIsIm5lYnVsYSIsInVzZVBvbHlnb24iLCJsYW5kUG9pbnRzIiwibW91c2VQb2ludHMiLCJkZWNrZ2wiLCJwcm9wcyIsImxheWVycyIsImZpbHRlciIsImwiLCJuZWJ1bGFMYXllciIsImVuYWJsZVNlbGVjdGlvbiIsIm1hcCIsImlkIiwicGlja2luZ0luZm9zIiwib2JqZWN0cyIsImxheWVyIiwiaW5kZXgiLCJvYmplY3QiLCJvcmlnaW5hbCIsImRlY2tDYWNoZSIsIm9yaWdpbmFscyIsIm9uU2VsZWN0aW9uIiwiYWxsWCIsIm1vdXNlUG9pbnQiLCJhbGxZIiwieCIsIk1hdGgiLCJtaW4iLCJ5IiwibWF4WCIsIm1heCIsIm1heFkiLCJ3aWR0aCIsImhlaWdodCIsImxlbmd0aCIsIngxIiwieTEiLCJ4MiIsInkyIiwicGlja09iamVjdHMiLCJhYnMiLCJsYXllcklkcyIsIl9nZXRMYXllcklkcyIsIl9zZWxlY3RGcm9tUGlja2luZ0luZm9zIiwiX2dldEJvdW5kaW5nQm94IiwiaXRlbSIsImV2ZW50Iiwib2Zmc2V0WCIsIm9mZnNldFkiLCJsbmdMYXQiLCJzZWxlY3Rpb25UeXBlIiwidHlwZSIsInN0b3BQcm9wYWdhdGlvbiIsInJlZHJhdyIsImRlYWN0aXZhdGUiLCJ2YWxpZFBvbHlnb24iLCJwdXNoIiwiX2dldE1vdXNlUG9zRnJvbUV2ZW50IiwibSIsIl9zZWxlY3RQb2x5Z29uT2JqZWN0cyIsInJlc2V0IiwiX3NlbGVjdFJlY3RhbmdsZU9iamVjdHMiLCJjZW50ZXIiLCJidWZmZXIiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwiZGF0YSIsImRhdGFQaWNrIiwic2VsUG9seWdvbiIsIm1vdXNlUG9zIiwidW5wcm9qZWN0TW91c2VQb3NpdGlvbiIsInBvbHlnb24iLCJsaW5lQ29sb3IiLCJmaWxsQ29sb3IiLCJsYW5kUG9pbnRzUG9seSIsImJpZ0J1ZmZlciIsImJpZ1BvbHlnb24iLCJlIiwiX21ha2VTdGFydFBvaW50SGlnaGxpZ2h0IiwiUG9seWdvbkxheWVyIiwiZnA2NCIsIm9wYWNpdHkiLCJwaWNrYWJsZSIsImxpbmVXaWR0aE1pblBpeGVscyIsImxpbmVXaWR0aE1heFBpeGVscyIsImxpbmVEYXNoSnVzdGlmaWVkIiwiZ2V0TGluZURhc2hBcnJheSIsImdldExpbmVDb2xvciIsIm9iaiIsImdldEZpbGxDb2xvciIsImdldFBvbHlnb24iLCJvIiwic3Ryb2tlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxrQkFBa0IsR0FBRyxDQUFDLENBQUQsRUFBSSxHQUFKLEVBQVMsQ0FBVCxFQUFZLEdBQVosQ0FBM0I7QUFDQSxJQUFNQyxrQkFBa0IsR0FBRyxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixFQUFoQixDQUEzQjtBQUNBLElBQU1DLGtCQUFrQixHQUFHLENBQTNCO0FBQ0EsSUFBTUMsY0FBYyxHQUFHLENBQUMsRUFBRCxFQUFLLEVBQUwsQ0FBdkI7QUFDQSxJQUFNQyxpQkFBaUIsR0FBRyxJQUExQjtBQUNBLElBQU1DLFlBQVksR0FBRyxFQUFyQjtBQUNBLElBQU1DLGFBQWEsR0FBRyxnQkFBdEI7QUFDQSxJQUFNQyxhQUFhLEdBQUcsZ0JBQXRCO0FBRU8sSUFBTUMsY0FBYyxHQUFHO0FBQzVCQyxFQUFBQSxJ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aUJBQU9BLENBQUMsQ0FBQ3BCLE9BQVQ7QUFBQTtBQWhCRyxPQUFqQixDQURLLEVBbUJMLElBQUlRLG9CQUFKLENBQWlCO0FBQ2ZuRSxRQUFBQSxFQUFFLEVBQUVsQixhQURXO0FBRWZ3RSxRQUFBQSxJQUFJLEVBQUVDLFFBRlM7QUFHZjtBQUNBb0IsUUFBQUEsWUFBWSxFQUFFLHNCQUFDQyxHQUFEO0FBQUEsaUJBQVNBLEdBQUcsQ0FBQ2hCLFNBQUosSUFBaUIsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxHQUFWLENBQTFCO0FBQUEsU0FKQztBQUtmO0FBQ0FpQixRQUFBQSxZQUFZLEVBQUUsc0JBQUNELEdBQUQ7QUFBQSxpQkFBU0EsR0FBRyxDQUFDZixTQUFKLElBQWlCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsR0FBVixDQUExQjtBQUFBLFNBTkM7QUFPZjtBQUNBTyxRQUFBQSxJQUFJLEVBQUUsS0FSUztBQVNmQyxRQUFBQSxPQUFPLEVBQUUsR0FUTTtBQVVmVyxRQUFBQSxPQUFPLEVBQUUsS0FWTTtBQVdmVixRQUFBQSxRQUFRLEVBQUUsSUFYSztBQVlmO0FBQ0FRLFFBQUFBLFVBQVUsRUFBRSxvQkFBQ0MsQ0FBRDtBQUFBLGlCQUFPQSxDQUFDLENBQUNwQixPQUFUO0FBQUE7QUFiRyxPQUFqQixDQW5CSyxDQUFQO0FBbUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9seWdvbkxheWVyIH0gZnJvbSAnQGRlY2suZ2wvbGF5ZXJzJztcbmltcG9ydCB7IHBvaW50LCBwb2x5Z29uIH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgdHVyZkJib3ggZnJvbSAnQHR1cmYvYmJveCc7XG5pbXBvcnQgdHVyZkJib3hQb2x5Z29uIGZyb20gJ0B0dXJmL2Jib3gtcG9seWdvbic7XG5pbXBvcnQgdHVyZkJ1ZmZlciBmcm9tICdAdHVyZi9idWZmZXInO1xuaW1wb3J0IHR1cmZEaWZmZXJlbmNlIGZyb20gJ0B0dXJmL2RpZmZlcmVuY2UnO1xuaW1wb3J0IHR1cmZEaXN0YW5jZSBmcm9tICdAdHVyZi9kaXN0YW5jZSc7XG5cbmNvbnN0IFBPTFlHT05fTElORV9DT0xPUiA9IFswLCAyNTUsIDAsIDI1NV07XG5jb25zdCBQT0xZR09OX0ZJTExfQ09MT1IgPSBbMjU1LCAyNTUsIDI1NSwgOTBdO1xuY29uc3QgUE9MWUdPTl9MSU5FX1dJRFRIID0gMjtcbmNvbnN0IFBPTFlHT05fREFTSEVTID0gWzIwLCAyMF07XG5jb25zdCBQT0xZR09OX1RIUkVTSE9MRCA9IDAuMDE7XG5jb25zdCBFWFBBTlNJT05fS00gPSAxMDtcbmNvbnN0IExBWUVSX0lEX1ZJRVcgPSAnRGVja0RyYXdlclZpZXcnO1xuY29uc3QgTEFZRVJfSURfUElDSyA9ICdEZWNrRHJhd2VyUGljayc7XG5cbmV4cG9ydCBjb25zdCBTRUxFQ1RJT05fVFlQRSA9IHtcbiAgTk9ORTogbnVsbCxcbiAgUkVDVEFOR0xFOiAncmVjdGFuZ2xlJyxcbiAgUE9MWUdPTjogJ3BvbHlnb24nLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVja0RyYXdlciB7XG4gIG5lYnVsYTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgdXNlUG9seWdvbjogYm9vbGVhbjtcbiAgdmFsaWRQb2x5Z29uOiBib29sZWFuO1xuICBsYW5kUG9pbnRzOiBbbnVtYmVyLCBudW1iZXJdW107XG4gIG1vdXNlUG9pbnRzOiBbbnVtYmVyLCBudW1iZXJdW107XG5cbiAgY29uc3RydWN0b3IobmVidWxhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gICAgdGhpcy5uZWJ1bGEgPSBuZWJ1bGE7XG4gICAgdGhpcy51c2VQb2x5Z29uID0gZmFsc2U7XG4gICAgdGhpcy5sYW5kUG9pbnRzID0gW107XG4gICAgdGhpcy5tb3VzZVBvaW50cyA9IFtdO1xuICB9XG5cbiAgX2dldExheWVySWRzKCkge1xuICAgIC8vIFRPRE86IHNvcnQgYnkgbW91c2UgcHJpb3JpdHlcbiAgICByZXR1cm4gdGhpcy5uZWJ1bGEuZGVja2dsLnByb3BzLmxheWVyc1xuICAgICAgLmZpbHRlcigobCkgPT4gbCAmJiBsLnByb3BzICYmIGwucHJvcHMubmVidWxhTGF5ZXIgJiYgbC5wcm9wcy5uZWJ1bGFMYXllci5lbmFibGVTZWxlY3Rpb24pXG4gICAgICAubWFwKChsKSA9PiBsLmlkKTtcbiAgfVxuXG4gIF9zZWxlY3RGcm9tUGlja2luZ0luZm9zKHBpY2tpbmdJbmZvczogUmVjb3JkPHN0cmluZywgYW55PltdKSB7XG4gICAgY29uc3Qgb2JqZWN0cyA9IHBpY2tpbmdJbmZvcy5tYXAoXG4gICAgICAoeyBsYXllciwgaW5kZXgsIG9iamVjdCB9KSA9PlxuICAgICAgICBvYmplY3Qub3JpZ2luYWwgfHwgbGF5ZXIucHJvcHMubmVidWxhTGF5ZXIuZGVja0NhY2hlLm9yaWdpbmFsc1tpbmRleF1cbiAgICApO1xuICAgIHRoaXMubmVidWxhLnByb3BzLm9uU2VsZWN0aW9uKG9iamVjdHMpO1xuICB9XG5cbiAgX2dldEJvdW5kaW5nQm94KCk6IFJlY29yZDxzdHJpbmcsIGFueT4ge1xuICAgIGNvbnN0IHsgbW91c2VQb2ludHMgfSA9IHRoaXM7XG4gICAgY29uc3QgYWxsWCA9IG1vdXNlUG9pbnRzLm1hcCgobW91c2VQb2ludCkgPT4gbW91c2VQb2ludFswXSk7XG4gICAgY29uc3QgYWxsWSA9IG1vdXNlUG9pbnRzLm1hcCgobW91c2VQb2ludCkgPT4gbW91c2VQb2ludFsxXSk7XG4gICAgY29uc3QgeCA9IE1hdGgubWluKC4uLmFsbFgpO1xuICAgIGNvbnN0IHkgPSBNYXRoLm1pbiguLi5hbGxZKTtcbiAgICBjb25zdCBtYXhYID0gTWF0aC5tYXgoLi4uYWxsWCk7XG4gICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KC4uLmFsbFkpO1xuXG4gICAgcmV0dXJuIHsgeCwgeSwgd2lkdGg6IG1heFggLSB4LCBoZWlnaHQ6IG1heFkgLSB5IH07XG4gIH1cblxuICBfc2VsZWN0UmVjdGFuZ2xlT2JqZWN0cygpIHtcbiAgICBpZiAodGhpcy5sYW5kUG9pbnRzLmxlbmd0aCAhPT0gMikgcmV0dXJuO1xuXG4gICAgY29uc3QgW3gxLCB5MV0gPSB0aGlzLm1vdXNlUG9pbnRzWzBdO1xuICAgIGNvbnN0IFt4MiwgeTJdID0gdGhpcy5tb3VzZVBvaW50c1sxXTtcbiAgICBjb25zdCBwaWNraW5nSW5mb3MgPSB0aGlzLm5lYnVsYS5kZWNrZ2wucGlja09iamVjdHMoe1xuICAgICAgeDogTWF0aC5taW4oeDEsIHgyKSxcbiAgICAgIHk6IE1hdGgubWluKHkxLCB5MiksXG4gICAgICB3aWR0aDogTWF0aC5hYnMoeDIgLSB4MSksXG4gICAgICBoZWlnaHQ6IE1hdGguYWJzKHkyIC0geTEpLFxuICAgICAgbGF5ZXJJZHM6IHRoaXMuX2dldExheWVySWRzKCksXG4gICAgfSk7XG5cbiAgICB0aGlzLl9zZWxlY3RGcm9tUGlja2luZ0luZm9zKHBpY2tpbmdJbmZvcyk7XG4gIH1cblxuICBfc2VsZWN0UG9seWdvbk9iamVjdHMoKSB7XG4gICAgY29uc3QgcGlja2luZ0luZm9zID0gdGhpcy5uZWJ1bGEuZGVja2dsLnBpY2tPYmplY3RzKHtcbiAgICAgIC4uLnRoaXMuX2dldEJvdW5kaW5nQm94KCksXG4gICAgICBsYXllcklkczogW0xBWUVSX0lEX1BJQ0ssIC4uLnRoaXMuX2dldExheWVySWRzKCldLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fc2VsZWN0RnJvbVBpY2tpbmdJbmZvcyhwaWNraW5nSW5mb3MuZmlsdGVyKChpdGVtKSA9PiBpdGVtLmxheWVyLmlkICE9PSBMQVlFUl9JRF9QSUNLKSk7XG4gIH1cblxuICBfZ2V0TW91c2VQb3NGcm9tRXZlbnQoZXZlbnQ6IFJlY29yZDxzdHJpbmcsIGFueT4pOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICBjb25zdCB7IG9mZnNldFgsIG9mZnNldFkgfSA9IGV2ZW50O1xuICAgIHJldHVybiBbb2Zmc2V0WCwgb2Zmc2V0WV07XG4gIH1cblxuICBoYW5kbGVFdmVudChcbiAgICBldmVudDogUmVjb3JkPHN0cmluZywgYW55PixcbiAgICBsbmdMYXQ6IFtudW1iZXIsIG51bWJlcl0sXG4gICAgc2VsZWN0aW9uVHlwZTogbnVtYmVyXG4gICk6IHsgcmVkcmF3OiBib29sZWFuOyBkZWFjdGl2YXRlOiBib29sZWFuIH0ge1xuICAgIC8vIGNhcHR1cmUgYWxsIGV2ZW50cyAobW91c2UtdXAgaXMgbmVlZGVkIHRvIHByZXZlbnQgdXMgc3R1Y2sgaW4gbW92aW5nIG1hcClcbiAgICBpZiAoZXZlbnQudHlwZSAhPT0gJ21vdXNldXAnKSBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy51c2VQb2x5Z29uID0gc2VsZWN0aW9uVHlwZSA9PT0gU0VMRUNUSU9OX1RZUEUuUE9MWUdPTjtcblxuICAgIGxldCByZWRyYXcgPSBmYWxzZTtcbiAgICBsZXQgZGVhY3RpdmF0ZSA9IGZhbHNlO1xuXG4gICAgY29uc3QgeyB1c2VQb2x5Z29uLCBsYW5kUG9pbnRzLCBtb3VzZVBvaW50cyB9ID0gdGhpcztcblxuICAgIGlmIChldmVudC50eXBlID09PSAnbW91c2Vkb3duJykge1xuICAgICAgaWYgKHVzZVBvbHlnb24gJiYgbGFuZFBvaW50cy5sZW5ndGgpIHtcbiAgICAgICAgLy8gaWYgbGFuZFBvaW50cy5sZW5ndGggaXMgemVybyB3ZSB3YW50IHRvIGluc2VydCB0d28gcG9pbnRzIChzbyB3ZSBsZXQgaXQgcnVuIHRoZSBlbHNlKVxuICAgICAgICAvLyBhbHNvIGRvbid0IGluc2VydCBpZiBwb2x5Z29uIGlzIGludmFsaWRcbiAgICAgICAgaWYgKHRoaXMubGFuZFBvaW50cy5sZW5ndGggPCAzIHx8IHRoaXMudmFsaWRQb2x5Z29uKSB7XG4gICAgICAgICAgbGFuZFBvaW50cy5wdXNoKGxuZ0xhdCk7XG4gICAgICAgICAgbW91c2VQb2ludHMucHVzaCh0aGlzLl9nZXRNb3VzZVBvc0Zyb21FdmVudChldmVudCkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxhbmRQb2ludHMgPSBbbG5nTGF0LCBsbmdMYXRdO1xuICAgICAgICBjb25zdCBtID0gdGhpcy5fZ2V0TW91c2VQb3NGcm9tRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLm1vdXNlUG9pbnRzID0gW20sIG1dO1xuICAgICAgfVxuICAgICAgcmVkcmF3ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZW1vdmUnICYmIGxhbmRQb2ludHMubGVuZ3RoKSB7XG4gICAgICAvLyB1cGRhdGUgbGFzdCBwb2ludFxuICAgICAgbGFuZFBvaW50c1tsYW5kUG9pbnRzLmxlbmd0aCAtIDFdID0gbG5nTGF0O1xuICAgICAgbW91c2VQb2ludHNbbW91c2VQb2ludHMubGVuZ3RoIC0gMV0gPSB0aGlzLl9nZXRNb3VzZVBvc0Zyb21FdmVudChldmVudCk7XG4gICAgICByZWRyYXcgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNldXAnKSB7XG4gICAgICBpZiAodXNlUG9seWdvbikge1xuICAgICAgICAvLyBjaGVjayB0byBzZWUgaWYgY29tcGxldGVkXG4gICAgICAgIC8vIFRPRE86IE1heWJlIGRvdWJsZS1jbGljayB0byBmaW5pc2g/XG4gICAgICAgIGlmIChcbiAgICAgICAgICBsYW5kUG9pbnRzLmxlbmd0aCA+IDQgJiZcbiAgICAgICAgICB0dXJmRGlzdGFuY2UobGFuZFBvaW50c1swXSwgbGFuZFBvaW50c1tsYW5kUG9pbnRzLmxlbmd0aCAtIDFdKSA8IFBPTFlHT05fVEhSRVNIT0xEICYmXG4gICAgICAgICAgdGhpcy52YWxpZFBvbHlnb25cbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5fc2VsZWN0UG9seWdvbk9iamVjdHMoKTtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgcmVkcmF3ID0gdHJ1ZTtcbiAgICAgICAgICBkZWFjdGl2YXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0UmVjdGFuZ2xlT2JqZWN0cygpO1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIHJlZHJhdyA9IHRydWU7XG4gICAgICAgIGRlYWN0aXZhdGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHJlZHJhdywgZGVhY3RpdmF0ZSB9O1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5sYW5kUG9pbnRzID0gW107XG4gICAgdGhpcy5tb3VzZVBvaW50cyA9IFtdO1xuICB9XG5cbiAgX21ha2VTdGFydFBvaW50SGlnaGxpZ2h0KGNlbnRlcjogW251bWJlciwgbnVtYmVyXSk6IG51bWJlcltdIHtcbiAgICBjb25zdCBidWZmZXIgPSB0dXJmQnVmZmVyKHBvaW50KGNlbnRlciksIFBPTFlHT05fVEhSRVNIT0xEIC8gNC4wKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIHR1cmZCYm94UG9seWdvbih0dXJmQmJveChidWZmZXIpKS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBkYXRhID0gW107XG4gICAgY29uc3QgZGF0YVBpY2sgPSBbXTtcblxuICAgIGlmICghdGhpcy51c2VQb2x5Z29uICYmIHRoaXMubGFuZFBvaW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIC8vIFVzZSBtb3VzZSBwb2ludHMgaW5zdGVhZCBvZiBsYW5kIHBvaW50cyBzbyB3ZSBnZXQgdGhlIHJpZ2h0IHNoYXBlXG4gICAgICAvLyBubyBtYXR0ZXIgd2hhdCBiZWFyaW5nIGlzLlxuICAgICAgY29uc3QgW1t4MSwgeTFdLCBbeDIsIHkyXV0gPSB0aGlzLm1vdXNlUG9pbnRzO1xuICAgICAgY29uc3Qgc2VsUG9seWdvbiA9IFtcbiAgICAgICAgW3gxLCB5MV0sXG4gICAgICAgIFt4MSwgeTJdLFxuICAgICAgICBbeDIsIHkyXSxcbiAgICAgICAgW3gyLCB5MV0sXG4gICAgICAgIFt4MSwgeTFdLFxuICAgICAgXS5tYXAoKG1vdXNlUG9zKSA9PiB0aGlzLm5lYnVsYS51bnByb2plY3RNb3VzZVBvc2l0aW9uKG1vdXNlUG9zKSk7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBwb2x5Z29uOiBzZWxQb2x5Z29uLFxuICAgICAgICBsaW5lQ29sb3I6IFBPTFlHT05fTElORV9DT0xPUixcbiAgICAgICAgZmlsbENvbG9yOiBQT0xZR09OX0ZJTExfQ09MT1IsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudXNlUG9seWdvbiAmJiB0aGlzLmxhbmRQb2ludHMubGVuZ3RoKSB7XG4gICAgICBkYXRhLnB1c2goe1xuICAgICAgICBwb2x5Z29uOiB0aGlzLmxhbmRQb2ludHMsXG4gICAgICAgIGxpbmVDb2xvcjogUE9MWUdPTl9MSU5FX0NPTE9SLFxuICAgICAgICBmaWxsQ29sb3I6IFBPTFlHT05fRklMTF9DT0xPUixcbiAgICAgIH0pO1xuXG4gICAgICAvLyBIYWNrOiB1c2UgYSBwb2x5Z29uIHRvIGhpZGUgdGhlIG91dHNpZGUsIGJlY2F1c2UgcGlja09iamVjdHMoKVxuICAgICAgLy8gZG9lcyBub3Qgc3VwcG9ydCBwb2x5Z29uc1xuICAgICAgaWYgKHRoaXMubGFuZFBvaW50cy5sZW5ndGggPj0gMykge1xuICAgICAgICBjb25zdCBsYW5kUG9pbnRzUG9seSA9IHBvbHlnb24oW1suLi50aGlzLmxhbmRQb2ludHMsIHRoaXMubGFuZFBvaW50c1swXV1dKTtcbiAgICAgICAgY29uc3QgYmlnQnVmZmVyID0gdHVyZkJ1ZmZlcihwb2ludCh0aGlzLmxhbmRQb2ludHNbMF0pLCBFWFBBTlNJT05fS00pO1xuICAgICAgICBsZXQgYmlnUG9seWdvbjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyB0dXJmRGlmZmVyZW5jZSB0aHJvd3MgYW4gZXhjZXB0aW9uIGlmIHRoZSBwb2x5Z29uXG4gICAgICAgICAgLy8gaW50ZXJzZWN0cyB3aXRoIGl0c2VsZlxuICAgICAgICAgIGJpZ1BvbHlnb24gPSB0dXJmRGlmZmVyZW5jZShiaWdCdWZmZXIsIGxhbmRQb2ludHNQb2x5KTtcbiAgICAgICAgICBkYXRhUGljay5wdXNoKHtcbiAgICAgICAgICAgIHBvbHlnb246IGJpZ1BvbHlnb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXMsXG4gICAgICAgICAgICBmaWxsQ29sb3I6IFswLCAwLCAwLCAxXSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnZhbGlkUG9seWdvbiA9IHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBpbnZhbGlkIHNlbGVjdGlvbiBwb2x5Z29uXG4gICAgICAgICAgdGhpcy52YWxpZFBvbHlnb24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmxhbmRQb2ludHMubGVuZ3RoKSB7XG4gICAgICAvLyBoaWdobGlnaHQgc3RhcnQgcG9pbnRcbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIHBvbHlnb246IHRoaXMuX21ha2VTdGFydFBvaW50SGlnaGxpZ2h0KHRoaXMubGFuZFBvaW50c1swXSksXG4gICAgICAgIGxpbmVDb2xvcjogWzAsIDAsIDAsIDBdLFxuICAgICAgICBmaWxsQ29sb3I6IFBPTFlHT05fTElORV9DT0xPUixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEhhY2sgdG8gbWFrZSB0aGUgUG9seWdvbkxheWVyKCkgc3RheSBhY3RpdmUsXG4gICAgLy8gb3RoZXJ3aXNlIGl0IHRha2VzIDMgc2Vjb25kcyAoISkgdG8gaW5pdCFcbiAgICAvLyBUT0RPOiBmaXggdGhpc1xuICAgIGRhdGEucHVzaCh7IHBvbHlnb246IFtbMCwgMF1dIH0pO1xuICAgIGRhdGFQaWNrLnB1c2goeyBwb2x5Z29uOiBbWzAsIDBdXSB9KTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgUG9seWdvbkxheWVyKHtcbiAgICAgICAgaWQ6IExBWUVSX0lEX1ZJRVcsXG4gICAgICAgIGRhdGEsXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZnA2NDogZmFsc2UsXG4gICAgICAgIG9wYWNpdHk6IDEuMCxcbiAgICAgICAgcGlja2FibGU6IGZhbHNlLFxuICAgICAgICBsaW5lV2lkdGhNaW5QaXhlbHM6IFBPTFlHT05fTElORV9XSURUSCxcbiAgICAgICAgbGluZVdpZHRoTWF4UGl4ZWxzOiBQT0xZR09OX0xJTkVfV0lEVEgsXG4gICAgICAgIGxpbmVEYXNoSnVzdGlmaWVkOiB0cnVlLFxuICAgICAgICBnZXRMaW5lRGFzaEFycmF5OiAoeCkgPT4gUE9MWUdPTl9EQVNIRVMsXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZ2V0TGluZUNvbG9yOiAob2JqKSA9PiBvYmoubGluZUNvbG9yIHx8IFswLCAwLCAwLCAyNTVdLFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGdldEZpbGxDb2xvcjogKG9iaikgPT4gb2JqLmZpbGxDb2xvciB8fCBbMCwgMCwgMCwgMjU1XSxcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBnZXRQb2x5Z29uOiAobykgPT4gby5wb2x5Z29uLFxuICAgICAgfSksXG4gICAgICBuZXcgUG9seWdvbkxheWVyKHtcbiAgICAgICAgaWQ6IExBWUVSX0lEX1BJQ0ssXG4gICAgICAgIGRhdGE6IGRhdGFQaWNrLFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGdldExpbmVDb2xvcjogKG9iaikgPT4gb2JqLmxpbmVDb2xvciB8fCBbMCwgMCwgMCwgMjU1XSxcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBnZXRGaWxsQ29sb3I6IChvYmopID0+IG9iai5maWxsQ29sb3IgfHwgWzAsIDAsIDAsIDI1NV0sXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgZnA2NDogZmFsc2UsXG4gICAgICAgIG9wYWNpdHk6IDEuMCxcbiAgICAgICAgc3Ryb2tlZDogZmFsc2UsXG4gICAgICAgIHBpY2thYmxlOiB0cnVlLFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGdldFBvbHlnb246IChvKSA9PiBvLnBvbHlnb24sXG4gICAgICB9KSxcbiAgICBdO1xuICB9XG59XG4iXX0=