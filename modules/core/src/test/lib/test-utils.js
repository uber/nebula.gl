// @flow
/* eslint-env jest */

import type { Position } from '../../geojson-types.js';
import type { ClickEvent, PointerMoveEvent } from '../../lib/event-types.js';

export function createPointFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Point', coordinates: [1, 2] }
  };
}

export function createLineStringFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: [[1, 2], [2, 3], [3, 4]] }
  };
}

export function createPolygonFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        // exterior ring
        [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
        // hole
        [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
      ]
    }
  };
}

export function createMultiPointFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'MultiPoint', coordinates: [[1, 2], [3, 4]] }
  };
}

export function createMultiLineStringFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiLineString',
      coordinates: [[[1, 2], [2, 3], [3, 4]], [[5, 6], [6, 7], [7, 8]]]
    }
  };
}

export function createMultiPolygonFeature() {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          // exterior ring polygon 1
          [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
          // hole  polygon 1
          [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
        ],
        [
          // exterior ring polygon 2
          [[2, -1], [4, -1], [4, 1], [2, 1], [2, -1]]
        ]
      ]
    }
  };
}

export function createFeatureCollection() {
  return {
    type: 'FeatureCollection',
    features: [
      createPointFeature(),
      createLineStringFeature(),
      createPolygonFeature(),
      createMultiPointFeature(),
      createMultiLineStringFeature(),
      createMultiPolygonFeature()
    ]
  };
}

export function createClickEvent(groundCoords: Position): ClickEvent {
  return {
    screenCoords: [-1, -1],
    groundCoords,
    picks: []
  };
}

export function createPointerMoveEvent(groundCoords: Position): PointerMoveEvent {
  return {
    screenCoords: [-1, -1],
    groundCoords,
    picks: [],
    isDragging: false,
    pointerDownPicks: null,
    pointerDownScreenCoords: null,
    pointerDownGroundCoords: null,
    sourceEvent: null
  };
}
