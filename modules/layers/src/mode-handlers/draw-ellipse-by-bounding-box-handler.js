// @flow

import bboxPolygon from '@turf/bbox-polygon';
import distance from '@turf/distance';
import ellipse from '@turf/ellipse';
import { point } from '@turf/helpers';
import type { PointerMoveEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { TwoClickPolygonHandler } from './two-click-polygon-handler.js';
import { getIntermediatePosition } from './mode-handler.js';

export class DrawEllipseByBoundingBoxHandler extends TwoClickPolygonHandler {
  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };
    const clickSequence = this.getClickSequence();

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const corner1 = clickSequence[0];
    const corner2 = event.groundCoords;

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
