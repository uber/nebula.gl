import {
  toDeckColor,
  recursivelyTraverseNestedArrays,
  generatePointsParallelToLinePoints,
  distance2d,
  mix,
  nearestPointOnProjectedLine,
} from '../../src/utils';
import {
  Position,
  FeatureOf,
  LineString as LineStringType,
  Point as PointType,
  Viewport,
} from '@nebula.gl/edit-modes';

const Point = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [102.0, 0.5],
  },
};

const LineString = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [102.0, 0.0],
      [103.0, 1.0],
      [104.0, 0.0],
      [105.0, 1.0],
    ],
  },
};

const Polygon = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [35, 10],
        [45, 45],
        [15, 40],
        [10, 20],
        [35, 10],
      ],
      [
        [20, 30],
        [35, 35],
        [30, 20],
        [20, 30],
      ],
    ],
  },
};

const MultiPolygon = {
  type: 'Feature',
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [40, 40],
          [20, 45],
          [45, 30],
          [40, 40],
        ],
      ],
      [
        [
          [20, 35],
          [10, 30],
          [10, 10],
          [30, 5],
          [45, 20],
          [20, 35],
        ],
        [
          [30, 20],
          [20, 15],
          [20, 25],
          [30, 20],
        ],
      ],
    ],
  },
};

describe('toDeckColor()', () => {
  it('toDeckColor() - positive case', () => {
    const deckColor = toDeckColor([100, 90, 255, 1]);
    const expectedResult = [25500, 22950, 65025, 255];
    expect(deckColor).toEqual(expectedResult);
  });

  it('toDeckColor() - invalid color', () => {
    const deckColor = toDeckColor(123123);
    const expectedDefaultDeckColor = [255, 0, 0, 255];
    expect(deckColor).toEqual(expectedDefaultDeckColor);
  });
});

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
        prefix,
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
        prefix,
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
        prefix,
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

describe('generatePointsParallelToLinePoints()', () => {
  it('generate Points Parallel to Line Points -- empty points', () => {
    const p1: Position = [0, 0];
    const p2: Position = [0, 0];
    const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, [0, 0]);
    expect(p3).toEqual([0, 0]);
    expect(p4).toEqual([0, 0]);
  });

  it('generate Points Parallel to Line Points -- valid points', () => {
    const p1: Position = [-122.32, 37.81800998554937];
    const p2: Position = [-122.37, 37.83386913944292];
    const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, [-124.5, 37.9]);
    expect(p3).toEqual([-123.14819346449626, 36.26988514860277]);
    expect(p4).toEqual([-123.09803547871964, 36.254027457172775]);
  });
});

describe('nearestPointOnProjectedLine() and related functions', () => {
  it('distance2d()', () => {
    expect(distance2d(0, 0, 0, 0)).toEqual(0);
    expect(distance2d(0, 1, 0, 0)).toEqual(1);
  });
  it('mix()', () => {
    expect(mix(1, 2, 0)).toEqual(1);
    expect(mix(1, 2, 1)).toEqual(2);
  });
  it('nearestPointOnProjectedLine()', () => {
    const line: FeatureOf<LineStringType> = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0, 0],
          [1, 1, 1],
        ],
      },
    };
    const inPoint: FeatureOf<PointType> = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0.5, 0.5],
      },
    };
    const viewport: Viewport = {
      // @ts-ignore
      project: (x) => x,
      unproject: (x) => x,
    };
    const result = nearestPointOnProjectedLine(line, inPoint, viewport);
    expect(result.geometry.type).toEqual('Point');
    expect(result.geometry.coordinates.length).toEqual(3);
    expect(result.geometry.coordinates[0]).toBeCloseTo(0.5, 3);
    expect(result.geometry.coordinates[1]).toBeCloseTo(0.5, 3);
    expect(result.geometry.coordinates[2]).toBeCloseTo(0.5, 3);
    expect(result.properties.index).toEqual(0);
  });
});
