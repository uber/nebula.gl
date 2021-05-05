"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Feature = /*#__PURE__*/function () {
  // geo json coordinates
  function Feature(geoJson, style) {
    var original = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var metadata = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, Feature);

    _defineProperty(this, "geoJson", void 0);

    _defineProperty(this, "style", void 0);

    _defineProperty(this, "original", void 0);

    _defineProperty(this, "metadata", void 0);

    this.geoJson = geoJson;
    this.style = style;
    this.original = original;
    this.metadata = metadata;
  }

  _createClass(Feature, [{
    key: "getCoords",
    value: function getCoords() {
      // @ts-ignore
      return this.geoJson.geometry.coordinates;
    }
  }]);

  return Feature;
}();

exports["default"] = Feature;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZmVhdHVyZS50cyJdLCJuYW1lcyI6WyJGZWF0dXJlIiwiZ2VvSnNvbiIsInN0eWxlIiwib3JpZ2luYWwiLCJtZXRhZGF0YSIsImdlb21ldHJ5IiwiY29vcmRpbmF0ZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztJQUlxQkEsTztBQUNuQjtBQU1BLG1CQUNFQyxPQURGLEVBRUVDLEtBRkYsRUFLRTtBQUFBLFFBRkFDLFFBRUEsdUVBRm1DLElBRW5DO0FBQUEsUUFEQUMsUUFDQSx1RUFEZ0MsRUFDaEM7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQ0EsU0FBS0gsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS0MsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNEOzs7O2dDQUVnQjtBQUNmO0FBQ0EsYUFBTyxLQUFLSCxPQUFMLENBQWFJLFFBQWIsQ0FBc0JDLFdBQTdCO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGZWF0dXJlIGFzIEdlb0pzb24sIEdlb21ldHJ5IH0gZnJvbSAnZ2VvanNvbic7XG5cbmltcG9ydCB7IFN0eWxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGZWF0dXJlIHtcbiAgLy8gZ2VvIGpzb24gY29vcmRpbmF0ZXNcbiAgZ2VvSnNvbjogR2VvSnNvbjxHZW9tZXRyeT47XG4gIHN0eWxlOiBTdHlsZTtcbiAgb3JpZ2luYWw6IGFueSB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIG1ldGFkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGdlb0pzb246IEdlb0pzb248R2VvbWV0cnk+LFxuICAgIHN0eWxlOiBTdHlsZSxcbiAgICBvcmlnaW5hbDogYW55IHwgbnVsbCB8IHVuZGVmaW5lZCA9IG51bGwsXG4gICAgbWV0YWRhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuICApIHtcbiAgICB0aGlzLmdlb0pzb24gPSBnZW9Kc29uO1xuICAgIHRoaXMuc3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLm9yaWdpbmFsID0gb3JpZ2luYWw7XG4gICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuICB9XG5cbiAgZ2V0Q29vcmRzKCk6IGFueSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiB0aGlzLmdlb0pzb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gIH1cbn1cbiJdfQ==