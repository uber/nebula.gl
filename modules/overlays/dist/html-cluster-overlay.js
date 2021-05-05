"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helpers = require("@turf/helpers");

var _supercluster = _interopRequireDefault(require("supercluster"));

var _htmlOverlay = _interopRequireDefault(require("./html-overlay"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HtmlClusterOverlay = /*#__PURE__*/function (_HtmlOverlay) {
  _inherits(HtmlClusterOverlay, _HtmlOverlay);

  var _super = _createSuper(HtmlClusterOverlay);

  function HtmlClusterOverlay() {
    var _this;

    _classCallCheck(this, HtmlClusterOverlay);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "_superCluster", void 0);

    _defineProperty(_assertThisInitialized(_this), "_lastObjects", null);

    return _this;
  }

  _createClass(HtmlClusterOverlay, [{
    key: "getItems",
    value: function getItems() {
      var _this2 = this;

      // supercluster().load() is expensive and we want to run it only
      // when necessary and not for every frame.
      // TODO: Warn if this is running many times / sec
      var newObjects = this.getAllObjects();

      if (newObjects !== this._lastObjects) {
        this._superCluster = new _supercluster["default"](this.getClusterOptions());

        this._superCluster.load(newObjects.map(function (object) {
          return (0, _helpers.point)(_this2.getObjectCoordinates(object), {
            object: object
          });
        }));

        this._lastObjects = newObjects; // console.log('new Supercluster() run');
      }

      var clusters = this._superCluster.getClusters([-180, -90, 180, 90], Math.round(this.getZoom()));

      return clusters.map(function (_ref) {
        var coordinates = _ref.geometry.coordinates,
            _ref$properties = _ref.properties,
            cluster = _ref$properties.cluster,
            pointCount = _ref$properties.point_count,
            clusterId = _ref$properties.cluster_id,
            object = _ref$properties.object;
        return cluster ? _this2.renderCluster(coordinates, clusterId, pointCount) : _this2.renderObject(coordinates, object);
      });
    }
  }, {
    key: "getClusterObjects",
    value: function getClusterObjects(clusterId) {
      return this._superCluster.getLeaves(clusterId, Infinity).map(function (object) {
        return object.properties.object;
      });
    } // Override to provide items that need clustering.
    // If the items have not changed please provide the same array to avoid
    // regeneration of the cluster which causes performance issues.

  }, {
    key: "getAllObjects",
    value: function getAllObjects() {
      return [];
    } // override to provide coordinates for each object of getAllObjects()

  }, {
    key: "getObjectCoordinates",
    value: function getObjectCoordinates(obj) {
      return [0, 0];
    } // Get options object used when instantiating supercluster

  }, {
    key: "getClusterOptions",
    value: function getClusterOptions() {
      return {
        maxZoom: 20
      };
    } // override to return an HtmlOverlayItem

  }, {
    key: "renderObject",
    value: function renderObject(coordinates, obj) {
      return null;
    } // override to return an HtmlOverlayItem
    // use getClusterObjects() to get cluster contents

  }, {
    key: "renderCluster",
    value: function renderCluster(coordinates, clusterId, pointCount) {
      return null;
    }
  }]);

  return HtmlClusterOverlay;
}(_htmlOverlay["default"]);

exports["default"] = HtmlClusterOverlay;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9odG1sLWNsdXN0ZXItb3ZlcmxheS50cyJdLCJuYW1lcyI6WyJIdG1sQ2x1c3Rlck92ZXJsYXkiLCJuZXdPYmplY3RzIiwiZ2V0QWxsT2JqZWN0cyIsIl9sYXN0T2JqZWN0cyIsIl9zdXBlckNsdXN0ZXIiLCJTdXBlcmNsdXN0ZXIiLCJnZXRDbHVzdGVyT3B0aW9ucyIsImxvYWQiLCJtYXAiLCJvYmplY3QiLCJnZXRPYmplY3RDb29yZGluYXRlcyIsImNsdXN0ZXJzIiwiZ2V0Q2x1c3RlcnMiLCJNYXRoIiwicm91bmQiLCJnZXRab29tIiwiY29vcmRpbmF0ZXMiLCJnZW9tZXRyeSIsInByb3BlcnRpZXMiLCJjbHVzdGVyIiwicG9pbnRDb3VudCIsInBvaW50X2NvdW50IiwiY2x1c3RlcklkIiwiY2x1c3Rlcl9pZCIsInJlbmRlckNsdXN0ZXIiLCJyZW5kZXJPYmplY3QiLCJnZXRMZWF2ZXMiLCJJbmZpbml0eSIsIm9iaiIsIm1heFpvb20iLCJIdG1sT3ZlcmxheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBRXFCQSxrQjs7Ozs7Ozs7Ozs7Ozs7Ozs7O21FQUUwQixJOzs7Ozs7OytCQUVYO0FBQUE7O0FBQ2hDO0FBQ0E7QUFFQTtBQUVBLFVBQU1DLFVBQVUsR0FBRyxLQUFLQyxhQUFMLEVBQW5COztBQUNBLFVBQUlELFVBQVUsS0FBSyxLQUFLRSxZQUF4QixFQUFzQztBQUNwQyxhQUFLQyxhQUFMLEdBQXFCLElBQUlDLHdCQUFKLENBQWlCLEtBQUtDLGlCQUFMLEVBQWpCLENBQXJCOztBQUNBLGFBQUtGLGFBQUwsQ0FBbUJHLElBQW5CLENBQ0VOLFVBQVUsQ0FBQ08sR0FBWCxDQUFlLFVBQUNDLE1BQUQ7QUFBQSxpQkFBWSxvQkFBTSxNQUFJLENBQUNDLG9CQUFMLENBQTBCRCxNQUExQixDQUFOLEVBQXlDO0FBQUVBLFlBQUFBLE1BQU0sRUFBTkE7QUFBRixXQUF6QyxDQUFaO0FBQUEsU0FBZixDQURGOztBQUdBLGFBQUtOLFlBQUwsR0FBb0JGLFVBQXBCLENBTG9DLENBTXBDO0FBQ0Q7O0FBRUQsVUFBTVUsUUFBUSxHQUFHLEtBQUtQLGFBQUwsQ0FBbUJRLFdBQW5CLENBQ2YsQ0FBQyxDQUFDLEdBQUYsRUFBTyxDQUFDLEVBQVIsRUFBWSxHQUFaLEVBQWlCLEVBQWpCLENBRGUsRUFFZkMsSUFBSSxDQUFDQyxLQUFMLENBQVcsS0FBS0MsT0FBTCxFQUFYLENBRmUsQ0FBakI7O0FBS0EsYUFBT0osUUFBUSxDQUFDSCxHQUFULENBQ0w7QUFBQSxZQUNjUSxXQURkLFFBQ0VDLFFBREYsQ0FDY0QsV0FEZDtBQUFBLG1DQUVFRSxVQUZGO0FBQUEsWUFFZ0JDLE9BRmhCLG1CQUVnQkEsT0FGaEI7QUFBQSxZQUVzQ0MsVUFGdEMsbUJBRXlCQyxXQUZ6QjtBQUFBLFlBRThEQyxTQUY5RCxtQkFFa0RDLFVBRmxEO0FBQUEsWUFFeUVkLE1BRnpFLG1CQUV5RUEsTUFGekU7QUFBQSxlQUlFVSxPQUFPLEdBQ0gsTUFBSSxDQUFDSyxhQUFMLENBQW1CUixXQUFuQixFQUFnQ00sU0FBaEMsRUFBMkNGLFVBQTNDLENBREcsR0FFSCxNQUFJLENBQUNLLFlBQUwsQ0FBa0JULFdBQWxCLEVBQStCUCxNQUEvQixDQU5OO0FBQUEsT0FESyxDQUFQO0FBU0Q7OztzQ0FFaUJhLFMsRUFBOEI7QUFDOUMsYUFBTyxLQUFLbEIsYUFBTCxDQUNKc0IsU0FESSxDQUNNSixTQUROLEVBQ2lCSyxRQURqQixFQUVKbkIsR0FGSSxDQUVBLFVBQUNDLE1BQUQ7QUFBQSxlQUFZQSxNQUFNLENBQUNTLFVBQVAsQ0FBa0JULE1BQTlCO0FBQUEsT0FGQSxDQUFQO0FBR0QsSyxDQUVEO0FBQ0E7QUFDQTs7OztvQ0FDMkI7QUFDekIsYUFBTyxFQUFQO0FBQ0QsSyxDQUVEOzs7O3lDQUNxQm1CLEcsRUFBZ0M7QUFDbkQsYUFBTyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQVA7QUFDRCxLLENBRUQ7Ozs7d0NBQzREO0FBQzFELGFBQU87QUFDTEMsUUFBQUEsT0FBTyxFQUFFO0FBREosT0FBUDtBQUdELEssQ0FFRDs7OztpQ0FDYWIsVyxFQUF1QlksRyxFQUFzRDtBQUN4RixhQUFPLElBQVA7QUFDRCxLLENBRUQ7QUFDQTs7OztrQ0FFRVosVyxFQUNBTSxTLEVBQ0FGLFUsRUFDd0M7QUFDeEMsYUFBTyxJQUFQO0FBQ0Q7Ozs7RUExRXNEVSx1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHBvaW50IH0gZnJvbSAnQHR1cmYvaGVscGVycyc7XG5pbXBvcnQgU3VwZXJjbHVzdGVyIGZyb20gJ3N1cGVyY2x1c3Rlcic7XG5pbXBvcnQgSHRtbE92ZXJsYXkgZnJvbSAnLi9odG1sLW92ZXJsYXknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdG1sQ2x1c3Rlck92ZXJsYXk8T2JqVHlwZT4gZXh0ZW5kcyBIdG1sT3ZlcmxheSB7XG4gIF9zdXBlckNsdXN0ZXI6IFJlY29yZDxzdHJpbmcsIGFueT47XG4gIF9sYXN0T2JqZWN0czogT2JqVHlwZVtdIHwgbnVsbCB8IHVuZGVmaW5lZCA9IG51bGw7XG5cbiAgZ2V0SXRlbXMoKTogUmVjb3JkPHN0cmluZywgYW55PltdIHtcbiAgICAvLyBzdXBlcmNsdXN0ZXIoKS5sb2FkKCkgaXMgZXhwZW5zaXZlIGFuZCB3ZSB3YW50IHRvIHJ1biBpdCBvbmx5XG4gICAgLy8gd2hlbiBuZWNlc3NhcnkgYW5kIG5vdCBmb3IgZXZlcnkgZnJhbWUuXG5cbiAgICAvLyBUT0RPOiBXYXJuIGlmIHRoaXMgaXMgcnVubmluZyBtYW55IHRpbWVzIC8gc2VjXG5cbiAgICBjb25zdCBuZXdPYmplY3RzID0gdGhpcy5nZXRBbGxPYmplY3RzKCk7XG4gICAgaWYgKG5ld09iamVjdHMgIT09IHRoaXMuX2xhc3RPYmplY3RzKSB7XG4gICAgICB0aGlzLl9zdXBlckNsdXN0ZXIgPSBuZXcgU3VwZXJjbHVzdGVyKHRoaXMuZ2V0Q2x1c3Rlck9wdGlvbnMoKSk7XG4gICAgICB0aGlzLl9zdXBlckNsdXN0ZXIubG9hZChcbiAgICAgICAgbmV3T2JqZWN0cy5tYXAoKG9iamVjdCkgPT4gcG9pbnQodGhpcy5nZXRPYmplY3RDb29yZGluYXRlcyhvYmplY3QpLCB7IG9iamVjdCB9KSlcbiAgICAgICk7XG4gICAgICB0aGlzLl9sYXN0T2JqZWN0cyA9IG5ld09iamVjdHM7XG4gICAgICAvLyBjb25zb2xlLmxvZygnbmV3IFN1cGVyY2x1c3RlcigpIHJ1bicpO1xuICAgIH1cblxuICAgIGNvbnN0IGNsdXN0ZXJzID0gdGhpcy5fc3VwZXJDbHVzdGVyLmdldENsdXN0ZXJzKFxuICAgICAgWy0xODAsIC05MCwgMTgwLCA5MF0sXG4gICAgICBNYXRoLnJvdW5kKHRoaXMuZ2V0Wm9vbSgpKVxuICAgICk7XG5cbiAgICByZXR1cm4gY2x1c3RlcnMubWFwKFxuICAgICAgKHtcbiAgICAgICAgZ2VvbWV0cnk6IHsgY29vcmRpbmF0ZXMgfSxcbiAgICAgICAgcHJvcGVydGllczogeyBjbHVzdGVyLCBwb2ludF9jb3VudDogcG9pbnRDb3VudCwgY2x1c3Rlcl9pZDogY2x1c3RlcklkLCBvYmplY3QgfSxcbiAgICAgIH0pID0+XG4gICAgICAgIGNsdXN0ZXJcbiAgICAgICAgICA/IHRoaXMucmVuZGVyQ2x1c3Rlcihjb29yZGluYXRlcywgY2x1c3RlcklkLCBwb2ludENvdW50KVxuICAgICAgICAgIDogdGhpcy5yZW5kZXJPYmplY3QoY29vcmRpbmF0ZXMsIG9iamVjdClcbiAgICApO1xuICB9XG5cbiAgZ2V0Q2x1c3Rlck9iamVjdHMoY2x1c3RlcklkOiBudW1iZXIpOiBPYmpUeXBlW10ge1xuICAgIHJldHVybiB0aGlzLl9zdXBlckNsdXN0ZXJcbiAgICAgIC5nZXRMZWF2ZXMoY2x1c3RlcklkLCBJbmZpbml0eSlcbiAgICAgIC5tYXAoKG9iamVjdCkgPT4gb2JqZWN0LnByb3BlcnRpZXMub2JqZWN0KTtcbiAgfVxuXG4gIC8vIE92ZXJyaWRlIHRvIHByb3ZpZGUgaXRlbXMgdGhhdCBuZWVkIGNsdXN0ZXJpbmcuXG4gIC8vIElmIHRoZSBpdGVtcyBoYXZlIG5vdCBjaGFuZ2VkIHBsZWFzZSBwcm92aWRlIHRoZSBzYW1lIGFycmF5IHRvIGF2b2lkXG4gIC8vIHJlZ2VuZXJhdGlvbiBvZiB0aGUgY2x1c3RlciB3aGljaCBjYXVzZXMgcGVyZm9ybWFuY2UgaXNzdWVzLlxuICBnZXRBbGxPYmplY3RzKCk6IE9ialR5cGVbXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLy8gb3ZlcnJpZGUgdG8gcHJvdmlkZSBjb29yZGluYXRlcyBmb3IgZWFjaCBvYmplY3Qgb2YgZ2V0QWxsT2JqZWN0cygpXG4gIGdldE9iamVjdENvb3JkaW5hdGVzKG9iajogT2JqVHlwZSk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIHJldHVybiBbMCwgMF07XG4gIH1cblxuICAvLyBHZXQgb3B0aW9ucyBvYmplY3QgdXNlZCB3aGVuIGluc3RhbnRpYXRpbmcgc3VwZXJjbHVzdGVyXG4gIGdldENsdXN0ZXJPcHRpb25zKCk6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWF4Wm9vbTogMjAsXG4gICAgfTtcbiAgfVxuXG4gIC8vIG92ZXJyaWRlIHRvIHJldHVybiBhbiBIdG1sT3ZlcmxheUl0ZW1cbiAgcmVuZGVyT2JqZWN0KGNvb3JkaW5hdGVzOiBudW1iZXJbXSwgb2JqOiBPYmpUeXBlKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gb3ZlcnJpZGUgdG8gcmV0dXJuIGFuIEh0bWxPdmVybGF5SXRlbVxuICAvLyB1c2UgZ2V0Q2x1c3Rlck9iamVjdHMoKSB0byBnZXQgY2x1c3RlciBjb250ZW50c1xuICByZW5kZXJDbHVzdGVyKFxuICAgIGNvb3JkaW5hdGVzOiBudW1iZXJbXSxcbiAgICBjbHVzdGVySWQ6IG51bWJlcixcbiAgICBwb2ludENvdW50OiBudW1iZXJcbiAgKTogUmVjb3JkPHN0cmluZywgYW55PiB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=