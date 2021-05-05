"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LayerMouseEvent = /*#__PURE__*/function () {
  // original item that this event is related to
  // internal nebula info about the object
  // the mouse [lng,lat] raycasted onto the ground
  // browser event
  // reference to nebula
  function LayerMouseEvent(nativeEvent, _ref) {
    var data = _ref.data,
        groundPoint = _ref.groundPoint,
        nebula = _ref.nebula,
        metadata = _ref.metadata;

    _classCallCheck(this, LayerMouseEvent);

    _defineProperty(this, "canceled", void 0);

    _defineProperty(this, "data", void 0);

    _defineProperty(this, "metadata", void 0);

    _defineProperty(this, "groundPoint", void 0);

    _defineProperty(this, "nativeEvent", void 0);

    _defineProperty(this, "nebula", void 0);

    this.nativeEvent = nativeEvent;
    this.data = data;
    this.groundPoint = groundPoint;
    this.nebula = nebula;
    this.metadata = metadata;
  }

  _createClass(LayerMouseEvent, [{
    key: "stopPropagation",
    value: function stopPropagation() {
      this.nativeEvent.stopPropagation();
      this.canceled = true;
    }
  }]);

  return LayerMouseEvent;
}();

exports["default"] = LayerMouseEvent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbGF5ZXItbW91c2UtZXZlbnQudHMiXSwibmFtZXMiOlsiTGF5ZXJNb3VzZUV2ZW50IiwibmF0aXZlRXZlbnQiLCJkYXRhIiwiZ3JvdW5kUG9pbnQiLCJuZWJ1bGEiLCJtZXRhZGF0YSIsInN0b3BQcm9wYWdhdGlvbiIsImNhbmNlbGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7SUFFcUJBLGU7QUFFbkI7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUdBLDJCQUNFQyxXQURGLFFBR0U7QUFBQSxRQURFQyxJQUNGLFFBREVBLElBQ0Y7QUFBQSxRQURRQyxXQUNSLFFBRFFBLFdBQ1I7QUFBQSxRQURxQkMsTUFDckIsUUFEcUJBLE1BQ3JCO0FBQUEsUUFENkJDLFFBQzdCLFFBRDZCQSxRQUM3Qjs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFDQSxTQUFLSixXQUFMLEdBQW1CQSxXQUFuQjtBQUVBLFNBQUtDLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtDLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDRDs7OztzQ0FFaUI7QUFDaEIsV0FBS0osV0FBTCxDQUFpQkssZUFBakI7QUFDQSxXQUFLQyxRQUFMLEdBQWdCLElBQWhCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb3NpdGlvbiB9IGZyb20gJ2dlb2pzb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllck1vdXNlRXZlbnQge1xuICBjYW5jZWxlZDogYm9vbGVhbjtcbiAgLy8gb3JpZ2luYWwgaXRlbSB0aGF0IHRoaXMgZXZlbnQgaXMgcmVsYXRlZCB0b1xuICBkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAvLyBpbnRlcm5hbCBuZWJ1bGEgaW5mbyBhYm91dCB0aGUgb2JqZWN0XG4gIG1ldGFkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICAvLyB0aGUgbW91c2UgW2xuZyxsYXRdIHJheWNhc3RlZCBvbnRvIHRoZSBncm91bmRcbiAgZ3JvdW5kUG9pbnQ6IFBvc2l0aW9uO1xuICAvLyBicm93c2VyIGV2ZW50XG4gIG5hdGl2ZUV2ZW50OiBNb3VzZUV2ZW50O1xuICAvLyByZWZlcmVuY2UgdG8gbmVidWxhXG4gIG5lYnVsYTogUmVjb3JkPHN0cmluZywgYW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBuYXRpdmVFdmVudDogTW91c2VFdmVudCxcbiAgICB7IGRhdGEsIGdyb3VuZFBvaW50LCBuZWJ1bGEsIG1ldGFkYXRhIH06IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgKSB7XG4gICAgdGhpcy5uYXRpdmVFdmVudCA9IG5hdGl2ZUV2ZW50O1xuXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmdyb3VuZFBvaW50ID0gZ3JvdW5kUG9pbnQ7XG4gICAgdGhpcy5uZWJ1bGEgPSBuZWJ1bGE7XG4gICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICB9XG5cbiAgc3RvcFByb3BhZ2F0aW9uKCkge1xuICAgIHRoaXMubmF0aXZlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5jYW5jZWxlZCA9IHRydWU7XG4gIH1cbn1cbiJdfQ==