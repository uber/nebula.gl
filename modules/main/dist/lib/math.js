"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDegree = toDegree;
exports.toRadian = toRadian;
exports.convertE7Array = convertE7Array;

function toDegree(radian) {
  return radian * 180 / Math.PI;
}

function toRadian(angle) {
  return angle * Math.PI / 180;
}
/**
 * Converts an array of latitudes, longitudes in E7 format to a list of points in degrees.
 *
 * @param {[]} array: An E7 array [lat_e7, lng_e7, lat_e7, lng_e7, ...]
 * @return {[]} An array of points in degrees
 *              [ [lng_degrees, lat_degrees], [lng_degrees, lat_degrees], ...]
 */


function convertE7Array(array) {
  var points = [];

  for (var i = 0; i < array.length; i += 2) {
    var lat = array[i] * 1e-7;
    var lng = array[i + 1] * 1e-7;
    points.push([lng, lat]);
  }

  return points;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbWF0aC50cyJdLCJuYW1lcyI6WyJ0b0RlZ3JlZSIsInJhZGlhbiIsIk1hdGgiLCJQSSIsInRvUmFkaWFuIiwiYW5nbGUiLCJjb252ZXJ0RTdBcnJheSIsImFycmF5IiwicG9pbnRzIiwiaSIsImxlbmd0aCIsImxhdCIsImxuZyIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVPLFNBQVNBLFFBQVQsQ0FBa0JDLE1BQWxCLEVBQTBDO0FBQy9DLFNBQVFBLE1BQU0sR0FBRyxHQUFWLEdBQWlCQyxJQUFJLENBQUNDLEVBQTdCO0FBQ0Q7O0FBRU0sU0FBU0MsUUFBVCxDQUFrQkMsS0FBbEIsRUFBeUM7QUFDOUMsU0FBUUEsS0FBSyxHQUFHSCxJQUFJLENBQUNDLEVBQWQsR0FBb0IsR0FBM0I7QUFDRDtBQUVEOzs7Ozs7Ozs7QUFPTyxTQUFTRyxjQUFULENBQXdCQyxLQUF4QixFQUFxRDtBQUMxRCxNQUFNQyxNQUFNLEdBQUcsRUFBZjs7QUFDQSxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLEtBQUssQ0FBQ0csTUFBMUIsRUFBa0NELENBQUMsSUFBSSxDQUF2QyxFQUEwQztBQUN4QyxRQUFNRSxHQUFHLEdBQUdKLEtBQUssQ0FBQ0UsQ0FBRCxDQUFMLEdBQVcsSUFBdkI7QUFDQSxRQUFNRyxHQUFHLEdBQUdMLEtBQUssQ0FBQ0UsQ0FBQyxHQUFHLENBQUwsQ0FBTCxHQUFlLElBQTNCO0FBQ0FELElBQUFBLE1BQU0sQ0FBQ0ssSUFBUCxDQUFZLENBQUNELEdBQUQsRUFBTUQsR0FBTixDQUFaO0FBQ0Q7O0FBQ0QsU0FBT0gsTUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9zaXRpb24gfSBmcm9tICdnZW9qc29uJztcblxuZXhwb3J0IGZ1bmN0aW9uIHRvRGVncmVlKHJhZGlhbjogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIChyYWRpYW4gKiAxODApIC8gTWF0aC5QSTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUmFkaWFuKGFuZ2xlOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gKGFuZ2xlICogTWF0aC5QSSkgLyAxODA7XG59XG5cbi8qKlxuICogQ29udmVydHMgYW4gYXJyYXkgb2YgbGF0aXR1ZGVzLCBsb25naXR1ZGVzIGluIEU3IGZvcm1hdCB0byBhIGxpc3Qgb2YgcG9pbnRzIGluIGRlZ3JlZXMuXG4gKlxuICogQHBhcmFtIHtbXX0gYXJyYXk6IEFuIEU3IGFycmF5IFtsYXRfZTcsIGxuZ19lNywgbGF0X2U3LCBsbmdfZTcsIC4uLl1cbiAqIEByZXR1cm4ge1tdfSBBbiBhcnJheSBvZiBwb2ludHMgaW4gZGVncmVlc1xuICogICAgICAgICAgICAgIFsgW2xuZ19kZWdyZWVzLCBsYXRfZGVncmVlc10sIFtsbmdfZGVncmVlcywgbGF0X2RlZ3JlZXNdLCAuLi5dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0RTdBcnJheShhcnJheTogbnVtYmVyW10pOiBQb3NpdGlvbltdIHtcbiAgY29uc3QgcG9pbnRzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpICs9IDIpIHtcbiAgICBjb25zdCBsYXQgPSBhcnJheVtpXSAqIDFlLTc7XG4gICAgY29uc3QgbG5nID0gYXJyYXlbaSArIDFdICogMWUtNztcbiAgICBwb2ludHMucHVzaChbbG5nLCBsYXRdKTtcbiAgfVxuICByZXR1cm4gcG9pbnRzO1xufVxuIl19