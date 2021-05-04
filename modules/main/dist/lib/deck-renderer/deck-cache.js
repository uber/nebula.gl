"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DeckCache = /*#__PURE__*/function () {
  function DeckCache(getData, convert) {
    _classCallCheck(this, DeckCache);

    _defineProperty(this, "objects", void 0);

    _defineProperty(this, "originals", void 0);

    _defineProperty(this, "updateTrigger", void 0);

    _defineProperty(this, "_idToPosition", void 0);

    _defineProperty(this, "_getData", void 0);

    _defineProperty(this, "_convert", void 0);

    this.objects = [];
    this.originals = [];
    this.updateTrigger = 0;
    this._idToPosition = new Map();
    this._getData = getData;
    this._convert = convert;
  }

  _createClass(DeckCache, [{
    key: "updateAllDeckObjects",
    value: function updateAllDeckObjects() {
      var _this = this;

      if (!this._getData || !this._convert) return;
      this.originals.length = 0;
      this.objects.length = 0;

      this._idToPosition.clear();

      this._getData().forEach(function (d) {
        _this._idToPosition.set(d.id, _this.objects.length);

        _this.originals.push(d);

        _this.objects.push(_this._convert(d));
      });

      this.triggerUpdate();
    }
  }, {
    key: "updateDeckObjectsByIds",
    value: function updateDeckObjectsByIds(ids) {
      var _this2 = this;

      if (!this._getData || !this._convert) return;
      ids.forEach(function (id) {
        var p = _this2._idToPosition.get(id);

        if (p !== undefined) {
          _this2.objects[p] = _this2._convert(_this2.originals[p]);
        }
      });
      this.triggerUpdate();
    }
  }, {
    key: "triggerUpdate",
    value: function triggerUpdate() {
      this.updateTrigger++;
    }
  }, {
    key: "getDeckObjectById",
    value: function getDeckObjectById(id) {
      var p = this._idToPosition.get(id);

      return p !== undefined ? this.objects[p] : null;
    }
  }, {
    key: "getOriginalById",
    value: function getOriginalById(id) {
      var p = this._idToPosition.get(id);

      return p !== undefined ? this.originals[p] : null;
    }
  }]);

  return DeckCache;
}();

exports["default"] = DeckCache;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZGVjay1yZW5kZXJlci9kZWNrLWNhY2hlLnRzIl0sIm5hbWVzIjpbIkRlY2tDYWNoZSIsImdldERhdGEiLCJjb252ZXJ0Iiwib2JqZWN0cyIsIm9yaWdpbmFscyIsInVwZGF0ZVRyaWdnZXIiLCJfaWRUb1Bvc2l0aW9uIiwiTWFwIiwiX2dldERhdGEiLCJfY29udmVydCIsImxlbmd0aCIsImNsZWFyIiwiZm9yRWFjaCIsImQiLCJzZXQiLCJpZCIsInB1c2giLCJ0cmlnZ2VyVXBkYXRlIiwiaWRzIiwicCIsImdldCIsInVuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0lBQXFCQSxTO0FBUW5CLHFCQUFZQyxPQUFaLEVBQW9DQyxPQUFwQyxFQUFxRTtBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUNuRSxTQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxTQUFLQyxhQUFMLEdBQXFCLENBQXJCO0FBRUEsU0FBS0MsYUFBTCxHQUFxQixJQUFJQyxHQUFKLEVBQXJCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQlAsT0FBaEI7QUFDQSxTQUFLUSxRQUFMLEdBQWdCUCxPQUFoQjtBQUNEOzs7OzJDQUVzQjtBQUFBOztBQUNyQixVQUFJLENBQUMsS0FBS00sUUFBTixJQUFrQixDQUFDLEtBQUtDLFFBQTVCLEVBQXNDO0FBRXRDLFdBQUtMLFNBQUwsQ0FBZU0sTUFBZixHQUF3QixDQUF4QjtBQUNBLFdBQUtQLE9BQUwsQ0FBYU8sTUFBYixHQUFzQixDQUF0Qjs7QUFDQSxXQUFLSixhQUFMLENBQW1CSyxLQUFuQjs7QUFFQSxXQUFLSCxRQUFMLEdBQWdCSSxPQUFoQixDQUF3QixVQUFDQyxDQUFELEVBQU87QUFDN0IsUUFBQSxLQUFJLENBQUNQLGFBQUwsQ0FBbUJRLEdBQW5CLENBQXdCRCxDQUFELENBQVdFLEVBQWxDLEVBQXNDLEtBQUksQ0FBQ1osT0FBTCxDQUFhTyxNQUFuRDs7QUFDQSxRQUFBLEtBQUksQ0FBQ04sU0FBTCxDQUFlWSxJQUFmLENBQW9CSCxDQUFwQjs7QUFDQSxRQUFBLEtBQUksQ0FBQ1YsT0FBTCxDQUFhYSxJQUFiLENBQWtCLEtBQUksQ0FBQ1AsUUFBTCxDQUFjSSxDQUFkLENBQWxCO0FBQ0QsT0FKRDs7QUFNQSxXQUFLSSxhQUFMO0FBQ0Q7OzsyQ0FFc0JDLEcsRUFBZTtBQUFBOztBQUNwQyxVQUFJLENBQUMsS0FBS1YsUUFBTixJQUFrQixDQUFDLEtBQUtDLFFBQTVCLEVBQXNDO0FBRXRDUyxNQUFBQSxHQUFHLENBQUNOLE9BQUosQ0FBWSxVQUFDRyxFQUFELEVBQVE7QUFDbEIsWUFBTUksQ0FBQyxHQUFHLE1BQUksQ0FBQ2IsYUFBTCxDQUFtQmMsR0FBbkIsQ0FBdUJMLEVBQXZCLENBQVY7O0FBQ0EsWUFBSUksQ0FBQyxLQUFLRSxTQUFWLEVBQXFCO0FBQ25CLFVBQUEsTUFBSSxDQUFDbEIsT0FBTCxDQUFhZ0IsQ0FBYixJQUFrQixNQUFJLENBQUNWLFFBQUwsQ0FBYyxNQUFJLENBQUNMLFNBQUwsQ0FBZWUsQ0FBZixDQUFkLENBQWxCO0FBQ0Q7QUFDRixPQUxEO0FBT0EsV0FBS0YsYUFBTDtBQUNEOzs7b0NBRWU7QUFDZCxXQUFLWixhQUFMO0FBQ0Q7OztzQ0FFaUJVLEUsRUFBc0M7QUFDdEQsVUFBTUksQ0FBQyxHQUFHLEtBQUtiLGFBQUwsQ0FBbUJjLEdBQW5CLENBQXVCTCxFQUF2QixDQUFWOztBQUNBLGFBQU9JLENBQUMsS0FBS0UsU0FBTixHQUFrQixLQUFLbEIsT0FBTCxDQUFhZ0IsQ0FBYixDQUFsQixHQUFvQyxJQUEzQztBQUNEOzs7b0NBRWVKLEUsRUFBc0M7QUFDcEQsVUFBTUksQ0FBQyxHQUFHLEtBQUtiLGFBQUwsQ0FBbUJjLEdBQW5CLENBQXVCTCxFQUF2QixDQUFWOztBQUNBLGFBQU9JLENBQUMsS0FBS0UsU0FBTixHQUFrQixLQUFLakIsU0FBTCxDQUFlZSxDQUFmLENBQWxCLEdBQXNDLElBQTdDO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBEZWNrQ2FjaGU8VE9SSUcsIFRDT05WPiB7XG4gIG9iamVjdHM6IFRDT05WW107XG4gIG9yaWdpbmFsczogVE9SSUdbXTtcbiAgdXBkYXRlVHJpZ2dlcjogbnVtYmVyO1xuICBfaWRUb1Bvc2l0aW9uOiBNYXA8c3RyaW5nLCBudW1iZXI+O1xuICBfZ2V0RGF0YTogKCkgPT4gVE9SSUdbXTtcbiAgX2NvbnZlcnQ6IChhcmcwOiBUT1JJRykgPT4gVENPTlY7XG5cbiAgY29uc3RydWN0b3IoZ2V0RGF0YTogKCkgPT4gVE9SSUdbXSwgY29udmVydDogKGFyZzA6IFRPUklHKSA9PiBUQ09OVikge1xuICAgIHRoaXMub2JqZWN0cyA9IFtdO1xuICAgIHRoaXMub3JpZ2luYWxzID0gW107XG4gICAgdGhpcy51cGRhdGVUcmlnZ2VyID0gMDtcblxuICAgIHRoaXMuX2lkVG9Qb3NpdGlvbiA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9nZXREYXRhID0gZ2V0RGF0YTtcbiAgICB0aGlzLl9jb252ZXJ0ID0gY29udmVydDtcbiAgfVxuXG4gIHVwZGF0ZUFsbERlY2tPYmplY3RzKCkge1xuICAgIGlmICghdGhpcy5fZ2V0RGF0YSB8fCAhdGhpcy5fY29udmVydCkgcmV0dXJuO1xuXG4gICAgdGhpcy5vcmlnaW5hbHMubGVuZ3RoID0gMDtcbiAgICB0aGlzLm9iamVjdHMubGVuZ3RoID0gMDtcbiAgICB0aGlzLl9pZFRvUG9zaXRpb24uY2xlYXIoKTtcblxuICAgIHRoaXMuX2dldERhdGEoKS5mb3JFYWNoKChkKSA9PiB7XG4gICAgICB0aGlzLl9pZFRvUG9zaXRpb24uc2V0KChkIGFzIGFueSkuaWQsIHRoaXMub2JqZWN0cy5sZW5ndGgpO1xuICAgICAgdGhpcy5vcmlnaW5hbHMucHVzaChkKTtcbiAgICAgIHRoaXMub2JqZWN0cy5wdXNoKHRoaXMuX2NvbnZlcnQoZCkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gIH1cblxuICB1cGRhdGVEZWNrT2JqZWN0c0J5SWRzKGlkczogc3RyaW5nW10pIHtcbiAgICBpZiAoIXRoaXMuX2dldERhdGEgfHwgIXRoaXMuX2NvbnZlcnQpIHJldHVybjtcblxuICAgIGlkcy5mb3JFYWNoKChpZCkgPT4ge1xuICAgICAgY29uc3QgcCA9IHRoaXMuX2lkVG9Qb3NpdGlvbi5nZXQoaWQpO1xuICAgICAgaWYgKHAgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLm9iamVjdHNbcF0gPSB0aGlzLl9jb252ZXJ0KHRoaXMub3JpZ2luYWxzW3BdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMudHJpZ2dlclVwZGF0ZSgpO1xuICB9XG5cbiAgdHJpZ2dlclVwZGF0ZSgpIHtcbiAgICB0aGlzLnVwZGF0ZVRyaWdnZXIrKztcbiAgfVxuXG4gIGdldERlY2tPYmplY3RCeUlkKGlkOiBzdHJpbmcpOiBUQ09OViB8IG51bGwgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHAgPSB0aGlzLl9pZFRvUG9zaXRpb24uZ2V0KGlkKTtcbiAgICByZXR1cm4gcCAhPT0gdW5kZWZpbmVkID8gdGhpcy5vYmplY3RzW3BdIDogbnVsbDtcbiAgfVxuXG4gIGdldE9yaWdpbmFsQnlJZChpZDogc3RyaW5nKTogVE9SSUcgfCBudWxsIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBwID0gdGhpcy5faWRUb1Bvc2l0aW9uLmdldChpZCk7XG4gICAgcmV0dXJuIHAgIT09IHVuZGVmaW5lZCA/IHRoaXMub3JpZ2luYWxzW3BdIDogbnVsbDtcbiAgfVxufVxuIl19