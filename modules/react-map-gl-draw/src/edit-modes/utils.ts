import { MjolnirEvent } from 'mjolnir.js';
import type { FeatureOf, Feature, Polygon, Position } from '@nebula.gl/edit-modes';

import { GEOJSON_TYPE, ELEMENT_TYPE, GUIDE_TYPE } from '../constants';

export function isNumeric(val: any) {
  return !Array.isArray(val) && !isNaN(parseFloat(val)) && isFinite(val);
}

export function parseEventElement(evt: MjolnirEvent, features: Feature[], guides: Feature[]) {
  const elem = evt.target;
  if (!elem || !elem.dataset || !elem.dataset.type) {
    return null;
  }

  let featureIndex = elem.dataset.featureIndex;
  featureIndex = isNumeric(featureIndex) ? Number(featureIndex) : -1;

  let index = elem.dataset.index;
  index = isNumeric(index) ? Number(index) : undefined;

  const type = elem.dataset.type;
  const tentativeFeature =
    guides && guides.find((g) => g.properties.guideType === GUIDE_TYPE.TENTATIVE);
  let object = null;
  let isGuide = false;

  switch (type) {
    case ELEMENT_TYPE.EDIT_HANDLE:
      object = guides.find((g) => {
        const indexes = g.properties.positionIndexes;
        if (indexes) {
          return indexes[indexes.length - 1] === index;
        }
        return false;
      });
      isGuide = true;
      break;
    case ELEMENT_TYPE.SEGMENT:
    case ELEMENT_TYPE.FEATURE:
    case ELEMENT_TYPE.FILL:
      object = features[featureIndex] || tentativeFeature;
      break;
    default:
  }

  return {
    object,
    isGuide,
    type,
    index,
    featureIndex,
  };
}

export function getScreenCoords(evt: MjolnirEvent) {
  const {
    offsetCenter: { x, y },
  } = evt;
  return [Number(x), Number(y)];
}

export function findClosestPointOnLineSegment(p1: Position, p2: Position, p: Position) {
  // line
  const k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  const b = p1[1] - k * p1[0];

  // vertical line
  if (!isFinite(k)) {
    const q: Position = [p1[0], p[1]];
    return inBounds(p1, p2, q) ? q : null;
  }

  // p is on line [p1, p2]
  if (p[0] * k + b - p[1] === 0) {
    return inBounds(p1, p2, p) ? p : null;
  }

  const qx = (k * p[1] + p[0] - k * b) / (k * k + 1);
  const qy = k * qx + b;

  return inBounds(p1, p2, [qx, qy]) ? [qx, qy] : null;
}

export function getFeatureCoordinates(feature: Feature) {
  const coordinates = feature && feature.geometry && feature.geometry.coordinates;
  if (!coordinates) {
    return null;
  }

  const isPolygonal = feature.geometry.type === GEOJSON_TYPE.POLYGON;
  const isSinglePoint = feature.geometry.type === GEOJSON_TYPE.POINT;
  return isPolygonal ? coordinates[0] : isSinglePoint ? [coordinates] : coordinates;
}

export function updateRectanglePosition(
  feature: FeatureOf<Polygon>,
  editHandleIndex: number,
  mapCoords: Position
) {
  const coordinates = getFeatureCoordinates(feature);
  if (!coordinates) {
    return null;
  }
  // @ts-ignore
  const points = coordinates.slice(0, 4);
  points[editHandleIndex % 4] = mapCoords;

  /*
   *   p0.x, p0.y (p0) ------ p2.x, p0.y (p1)
   *       |                      |
   *       |                      |
   *   p0.x, p2.y (p3) ----- p2.x, p2.y (p2)
   */
  const p0 = points[(editHandleIndex + 2) % 4];
  const p2 = points[editHandleIndex % 4];
  points[(editHandleIndex + 1) % 4] = [p2[0], p0[1]];
  points[(editHandleIndex + 3) % 4] = [p0[0], p2[1]];

  return feature.geometry.type === GEOJSON_TYPE.POLYGON ? [[...points, points[0]]] : points;
}

function inBounds(p1: Position, p2: Position, p: Position): boolean {
  const bounds = [
    Math.min(p1[0], p2[0]),
    Math.max(p1[0], p2[0]),
    Math.min(p1[1], p2[1]),
    Math.max(p1[1], p2[1]),
  ];

  return p[0] >= bounds[0] && p[0] <= bounds[1] && p[1] >= bounds[2] && p[1] <= bounds[3];
}
