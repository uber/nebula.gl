import { recursivelyTraverseNestedArrays } from '../../lib/utils';

const Point = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [102.0, 0.5]
  }
};

const LineString = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]
  }
};

const Polygon = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]],
      [[20, 30], [35, 35], [30, 20], [20, 30]]
    ]
  }
};

const MultiPolygon = {
  type: 'Feature',
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [[[40, 40], [20, 45], [45, 30], [40, 40]]],
      [
        [[20, 35], [10, 30], [10, 10], [30, 5], [45, 20], [20, 35]],
        [[30, 20], [20, 15], [20, 25], [30, 20]]
      ]
    ]
  }
};

describe('recursivelyTraverseNestedArrays()', () => {
  it('should not call function for point', () => {
    let callCount = 0;
    const callback = (array, prefix) => callCount++;
    recursivelyTraverseNestedArrays(Point.geometry.coordinates, [], callback);
    expect(callCount).toBe(0);
  });

  it('should work for LineString', () => {
    const results = [];
    recursivelyTraverseNestedArrays(LineString.geometry.coordinates, [], (array, prefix) => {
      results.push({
        array,
        prefix
      });
    });
    expect(results.length).toBe(1);
    expect(JSON.stringify(results[0].array)).toBe('[[102,0],[103,1],[104,0],[105,1]]');
    expect(JSON.stringify(results[0].prefix)).toBe('[]');
  });

  it('should work for Polygon', () => {
    const results = [];
    recursivelyTraverseNestedArrays(Polygon.geometry.coordinates, [], (array, prefix) => {
      results.push({
        array,
        prefix
      });
    });
    expect(results.length).toBe(2);
    expect(JSON.stringify(results[0].array)).toBe('[[35,10],[45,45],[15,40],[10,20],[35,10]]');
    expect(JSON.stringify(results[0].prefix)).toBe('[0]');
    expect(JSON.stringify(results[1].array)).toBe('[[20,30],[35,35],[30,20],[20,30]]');
    expect(JSON.stringify(results[1].prefix)).toBe('[1]');
  });

  it('should work for MultiPolygon', () => {
    const results = [];
    recursivelyTraverseNestedArrays(MultiPolygon.geometry.coordinates, [], (array, prefix) => {
      results.push({
        array,
        prefix
      });
    });
    expect(results.length).toBe(3);
    expect(JSON.stringify(results[0].array)).toBe('[[40,40],[20,45],[45,30],[40,40]]');
    expect(JSON.stringify(results[0].prefix)).toBe('[0,0]');
    expect(JSON.stringify(results[1].array)).toBe(
      '[[20,35],[10,30],[10,10],[30,5],[45,20],[20,35]]'
    );
    expect(JSON.stringify(results[1].prefix)).toBe('[1,0]');
    expect(JSON.stringify(results[2].array)).toBe('[[30,20],[20,15],[20,25],[30,20]]');
    expect(JSON.stringify(results[2].prefix)).toBe('[1,1]');
  });
});
