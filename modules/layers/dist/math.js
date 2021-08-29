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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYXRoLnRzIl0sIm5hbWVzIjpbInRvRGVncmVlIiwicmFkaWFuIiwiTWF0aCIsIlBJIiwidG9SYWRpYW4iLCJhbmdsZSIsImNvbnZlcnRFN0FycmF5IiwiYXJyYXkiLCJwb2ludHMiLCJpIiwibGVuZ3RoIiwibGF0IiwibG5nIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRU8sU0FBU0EsUUFBVCxDQUFrQkMsTUFBbEIsRUFBMEM7QUFDL0MsU0FBUUEsTUFBTSxHQUFHLEdBQVYsR0FBaUJDLElBQUksQ0FBQ0MsRUFBN0I7QUFDRDs7QUFFTSxTQUFTQyxRQUFULENBQWtCQyxLQUFsQixFQUF5QztBQUM5QyxTQUFRQSxLQUFLLEdBQUdILElBQUksQ0FBQ0MsRUFBZCxHQUFvQixHQUEzQjtBQUNEO0FBRUQ7Ozs7Ozs7OztBQU9PLFNBQVNHLGNBQVQsQ0FBd0JDLEtBQXhCLEVBQXFEO0FBQzFELE1BQU1DLE1BQU0sR0FBRyxFQUFmOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsS0FBSyxDQUFDRyxNQUExQixFQUFrQ0QsQ0FBQyxJQUFJLENBQXZDLEVBQTBDO0FBQ3hDLFFBQU1FLEdBQUcsR0FBR0osS0FBSyxDQUFDRSxDQUFELENBQUwsR0FBVyxJQUF2QjtBQUNBLFFBQU1HLEdBQUcsR0FBR0wsS0FBSyxDQUFDRSxDQUFDLEdBQUcsQ0FBTCxDQUFMLEdBQWUsSUFBM0I7QUFDQUQsSUFBQUEsTUFBTSxDQUFDSyxJQUFQLENBQVksQ0FBQ0QsR0FBRCxFQUFNRCxHQUFOLENBQVo7QUFDRDs7QUFDRCxTQUFPSCxNQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb3NpdGlvbiB9IGZyb20gJ2dlb2pzb24nO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9EZWdyZWUocmFkaWFuOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gKHJhZGlhbiAqIDE4MCkgLyBNYXRoLlBJO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9SYWRpYW4oYW5nbGU6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiAoYW5nbGUgKiBNYXRoLlBJKSAvIDE4MDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBvZiBsYXRpdHVkZXMsIGxvbmdpdHVkZXMgaW4gRTcgZm9ybWF0IHRvIGEgbGlzdCBvZiBwb2ludHMgaW4gZGVncmVlcy5cbiAqXG4gKiBAcGFyYW0ge1tdfSBhcnJheTogQW4gRTcgYXJyYXkgW2xhdF9lNywgbG5nX2U3LCBsYXRfZTcsIGxuZ19lNywgLi4uXVxuICogQHJldHVybiB7W119IEFuIGFycmF5IG9mIHBvaW50cyBpbiBkZWdyZWVzXG4gKiAgICAgICAgICAgICAgWyBbbG5nX2RlZ3JlZXMsIGxhdF9kZWdyZWVzXSwgW2xuZ19kZWdyZWVzLCBsYXRfZGVncmVlc10sIC4uLl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRFN0FycmF5KGFycmF5OiBudW1iZXJbXSk6IFBvc2l0aW9uW10ge1xuICBjb25zdCBwb2ludHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkgKz0gMikge1xuICAgIGNvbnN0IGxhdCA9IGFycmF5W2ldICogMWUtNztcbiAgICBjb25zdCBsbmcgPSBhcnJheVtpICsgMV0gKiAxZS03O1xuICAgIHBvaW50cy5wdXNoKFtsbmcsIGxhdF0pO1xuICB9XG4gIHJldHVybiBwb2ludHM7XG59XG4iXX0=