// @flow

import bboxPolygon from '@turf/bbox-polygon';
import distance from '@turf/distance';
import ellipse from '@turf/ellipse';
import { point } from '@turf/helpers';
import type { PointerMoveEvent } from '../types.js';
import { getIntermediatePosition, type GeoJsonEditAction } from './geojson-edit-mode.js';
import { TwoClickPolygonMode } from './two-click-polygon-mode.js';

export class DrawEllipseByBoundingBoxMode extends TwoClickPolygonMode {
  handlePointerMoveAdapter(
    event: PointerMoveEvent
  ): { editAction: ?GeoJsonEditAction, cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };
    const clickSequence = this.getClickSequence();

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const corner1 = clickSequence[0];
    const corner2 = event.mapCoords;

    const minX = Math.min(corner1[0], corner2[0]);
    const minY = Math.min(corner1[1], corner2[1]);
    const maxX = Math.max(corner1[0], corner2[0]);
    const maxY = Math.max(corner1[1], corner2[1]);

    const polygonPoints = bboxPolygon([minX, minY, maxX, maxY]).geometry.coordinates[0];
    const centerCoordinates = getIntermediatePosition(corner1, corner2);

    const xSemiAxis = Math.max(distance(point(polygonPoints[0]), point(polygonPoints[1])), 0.001);
    const ySemiAxis = Math.max(distance(point(polygonPoints[0]), point(polygonPoints[3])), 0.001);

    this._setTentativeFeature(ellipse(centerCoordinates, xSemiAxis, ySemiAxis));

    return result;
  }
}
