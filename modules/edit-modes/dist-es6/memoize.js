"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = memoize;

// port from @deck.gl/core
function isEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (Array.isArray(a)) {
    // Special treatment for arrays: compare 1-level deep
    // This is to support equality of matrix/coordinate props
    var len = a.length;

    if (!b || b.length !== len) {
      return false;
    }

    for (var i = 0; i < len; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  return false;
}
/**
 * Speed up consecutive function calls by caching the result of calls with identical input
 * https://en.wikipedia.org/wiki/Memoization
 * @param {function} compute - the function to be memoized
 */


function memoize(compute) {
  var cachedArgs = {};
  var cachedResult;
  return function (args) {
    for (var key in args) {
      if (!isEqual(args[key], cachedArgs[key])) {
        cachedResult = compute(args);
        cachedArgs = args;
        break;
      }
    }

    return cachedResult;
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tZW1vaXplLnRzIl0sIm5hbWVzIjpbImlzRXF1YWwiLCJhIiwiYiIsIkFycmF5IiwiaXNBcnJheSIsImxlbiIsImxlbmd0aCIsImkiLCJtZW1vaXplIiwiY29tcHV0ZSIsImNhY2hlZEFyZ3MiLCJjYWNoZWRSZXN1bHQiLCJhcmdzIiwia2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQSxTQUFTQSxPQUFULENBQWlCQyxDQUFqQixFQUF5QkMsQ0FBekIsRUFBaUM7QUFDL0IsTUFBSUQsQ0FBQyxLQUFLQyxDQUFWLEVBQWE7QUFDWCxXQUFPLElBQVA7QUFDRDs7QUFDRCxNQUFJQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0gsQ0FBZCxDQUFKLEVBQXNCO0FBQ3BCO0FBQ0E7QUFDQSxRQUFNSSxHQUFHLEdBQUdKLENBQUMsQ0FBQ0ssTUFBZDs7QUFDQSxRQUFJLENBQUNKLENBQUQsSUFBTUEsQ0FBQyxDQUFDSSxNQUFGLEtBQWFELEdBQXZCLEVBQTRCO0FBQzFCLGFBQU8sS0FBUDtBQUNEOztBQUVELFNBQUssSUFBSUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsR0FBcEIsRUFBeUJFLENBQUMsRUFBMUIsRUFBOEI7QUFDNUIsVUFBSU4sQ0FBQyxDQUFDTSxDQUFELENBQUQsS0FBU0wsQ0FBQyxDQUFDSyxDQUFELENBQWQsRUFBbUI7QUFDakIsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFDRCxTQUFPLEtBQVA7QUFDRDtBQUVEOzs7Ozs7O0FBS2UsU0FBU0MsT0FBVCxDQUFpQkMsT0FBakIsRUFBb0M7QUFDakQsTUFBSUMsVUFBVSxHQUFHLEVBQWpCO0FBQ0EsTUFBSUMsWUFBSjtBQUVBLFNBQU8sVUFBQ0MsSUFBRCxFQUFlO0FBQ3BCLFNBQUssSUFBTUMsR0FBWCxJQUFrQkQsSUFBbEIsRUFBd0I7QUFDdEIsVUFBSSxDQUFDWixPQUFPLENBQUNZLElBQUksQ0FBQ0MsR0FBRCxDQUFMLEVBQVlILFVBQVUsQ0FBQ0csR0FBRCxDQUF0QixDQUFaLEVBQTBDO0FBQ3hDRixRQUFBQSxZQUFZLEdBQUdGLE9BQU8sQ0FBQ0csSUFBRCxDQUF0QjtBQUNBRixRQUFBQSxVQUFVLEdBQUdFLElBQWI7QUFDQTtBQUNEO0FBQ0Y7O0FBQ0QsV0FBT0QsWUFBUDtBQUNELEdBVEQ7QUFVRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIHBvcnQgZnJvbSBAZGVjay5nbC9jb3JlXG5mdW5jdGlvbiBpc0VxdWFsKGE6IGFueSwgYjogYW55KSB7XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkoYSkpIHtcbiAgICAvLyBTcGVjaWFsIHRyZWF0bWVudCBmb3IgYXJyYXlzOiBjb21wYXJlIDEtbGV2ZWwgZGVlcFxuICAgIC8vIFRoaXMgaXMgdG8gc3VwcG9ydCBlcXVhbGl0eSBvZiBtYXRyaXgvY29vcmRpbmF0ZSBwcm9wc1xuICAgIGNvbnN0IGxlbiA9IGEubGVuZ3RoO1xuICAgIGlmICghYiB8fCBiLmxlbmd0aCAhPT0gbGVuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogU3BlZWQgdXAgY29uc2VjdXRpdmUgZnVuY3Rpb24gY2FsbHMgYnkgY2FjaGluZyB0aGUgcmVzdWx0IG9mIGNhbGxzIHdpdGggaWRlbnRpY2FsIGlucHV0XG4gKiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NZW1vaXphdGlvblxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29tcHV0ZSAtIHRoZSBmdW5jdGlvbiB0byBiZSBtZW1vaXplZFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZW1vaXplKGNvbXB1dGU6IEZ1bmN0aW9uKSB7XG4gIGxldCBjYWNoZWRBcmdzID0ge307XG4gIGxldCBjYWNoZWRSZXN1bHQ7XG5cbiAgcmV0dXJuIChhcmdzOiBhbnkpID0+IHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBhcmdzKSB7XG4gICAgICBpZiAoIWlzRXF1YWwoYXJnc1trZXldLCBjYWNoZWRBcmdzW2tleV0pKSB7XG4gICAgICAgIGNhY2hlZFJlc3VsdCA9IGNvbXB1dGUoYXJncyk7XG4gICAgICAgIGNhY2hlZEFyZ3MgPSBhcmdzO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNhY2hlZFJlc3VsdDtcbiAgfTtcbn1cbiJdfQ==