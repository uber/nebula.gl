import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import turfDifference from '@turf/difference';
import turfBuffer from '@turf/buffer';
import lineIntersect from '@turf/line-intersect';
import { lineString } from '@turf/helpers';
import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfDestination from '@turf/destination';
import turfPolygonToLine from '@turf/polygon-to-line';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { generatePointsParallelToLinePoints } from '../utils';
import { ClickEvent, PointerMoveEvent } from '../event-types';
import { EditAction, ModeHandler } from './mode-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class SplitPolygonHandler extends ModeHandler {
  calculateGroundCoords(clickSequence: any, groundCoords: any) {
    const modeConfig = this.getModeConfig();
    if (!modeConfig || !modeConfig.lock90Degree || !clickSequence.length) {
      return groundCoords;
    }
    if (clickSequence.length === 1) {
      // if first point is clicked, then find closest polygon point and build ~90deg vector
      const firstPoint = clickSequence[0];
      const selectedGeometry = this.getSelectedGeometry();
      // @ts-ignore
      const feature = turfPolygonToLine(selectedGeometry);

      const lines = feature.type === 'FeatureCollection' ? feature.features : [feature];
      let minDistance = Number.MAX_SAFE_INTEGER;
      let closestPoint = null;
      // If Multipolygon, then we should find nearest polygon line and stick split to it.
      lines.forEach((line) => {
        const snapPoint = nearestPointOnLine(line, firstPoint);
        const distanceFromOrigin = turfDistance(snapPoint, firstPoint);
        if (minDistance > distanceFromOrigin) {
          minDistance = distanceFromOrigin;
          closestPoint = snapPoint;
        }
      });

      if (closestPoint) {
        // closest point is used as 90degree entry to the polygon
        const lastBearing = turfBearing(firstPoint, closestPoint);
        const currentDistance = turfDistance(firstPoint, groundCoords, { units: 'meters' });
        return turfDestination(firstPoint, currentDistance, lastBearing, {
          units: 'meters',
        }).geometry.coordinates;
      }
      return groundCoords;
    }
    // Allow only 90 degree turns
    const lastPoint = clickSequence[clickSequence.length - 1];
    const [approximatePoint] = generatePointsParallelToLinePoints(
      clickSequence[clickSequence.length - 2],
      lastPoint,
      groundCoords
    );
    // align point with current ground
    const nearestPt = nearestPointOnLine(lineString([lastPoint, approximatePoint]), groundCoords)
      .geometry.coordinates;
    return nearestPt;
  }

  handleClick(event: ClickEvent): EditAction | null | undefined {
    super.handleClick({
      ...event,
      groundCoords: this.calculateGroundCoords(this.getClickSequence(), event.groundCoords),
    });
    const editAction: EditAction | null | undefined = null;
    const tentativeFeature = this.getTentativeFeature();
    const selectedGeometry = this.getSelectedGeometry();
    const clickSequence = this.getClickSequence();

    if (!selectedGeometry) {
      // eslint-disable-next-line no-console,no-undef
      console.warn('A polygon must be selected for splitting');
      this._setTentativeFeature(null);
      return editAction;
    }
    const pt = {
      type: 'Point',
      coordinates: clickSequence[clickSequence.length - 1],
    };
    // @ts-ignore
    const isPointInPolygon = booleanPointInPolygon(pt, selectedGeometry);
    if (clickSequence.length > 1 && tentativeFeature && !isPointInPolygon) {
      this.resetClickSequence();
      // @ts-ignore
      const isLineInterectingWithPolygon = lineIntersect(tentativeFeature, selectedGeometry);
      if (isLineInterectingWithPolygon.features.length === 0) {
        this._setTentativeFeature(null);
        return editAction;
      }
      return this.splitPolygon();
    }

    return editAction;
  }

  handlePointerMove({
    groundCoords,
  }: PointerMoveEvent): { editAction: EditAction | null | undefined; cancelMapPan: boolean } {
    const clickSequence = this.getClickSequence();
    const result = { editAction: null, cancelMapPan: false };

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    this._setTentativeFeature({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [...clickSequence, this.calculateGroundCoords(clickSequence, groundCoords)],
      },
    });

    return result;
  }

  splitPolygon() {
    const selectedGeometry = this.getSelectedGeometry();
    const tentativeFeature = this.getTentativeFeature();
    const featureIndex = this.getSelectedFeatureIndexes()[0];
    const modeConfig = this.getModeConfig() || {};

    // Default gap in between the polygon
    let { gap = 0.1, units = 'centimeters' } = modeConfig;
    if (gap === 0) {
      gap = 0.1;
      units = 'centimeters';
    }
    // @ts-ignore
    const buffer = turfBuffer(tentativeFeature, gap, { units });
    // @ts-ignore
    const updatedGeometry = turfDifference(selectedGeometry, buffer);
    this._setTentativeFeature(null);
    if (!updatedGeometry) {
      // eslint-disable-next-line no-console,no-undef
      console.warn('Canceling edit. Split Polygon erased');
      return null;
    }

    const { type, coordinates } = updatedGeometry.geometry;
    let updatedCoordinates = [];
    if (type === 'Polygon') {
      // Update the coordinates as per Multipolygon
      // @ts-ignore
      updatedCoordinates = coordinates.map((c) => [c]);
    } else {
      // Handle Case when Multipolygon has holes
      // @ts-ignore
      updatedCoordinates = coordinates.reduce((agg, prev) => {
        prev.forEach((p) => {
          agg.push([p]);
        });
        return agg;
      }, []);
    }

    // Update the type to Mulitpolygon
    const updatedData = this.getImmutableFeatureCollection().replaceGeometry(featureIndex, {
      type: 'MultiPolygon',
      coordinates: updatedCoordinates,
    });

    const editAction: EditAction = {
      updatedData: updatedData.getObject(),
      editType: 'split',
      featureIndexes: [featureIndex],
      editContext: null,
    };

    return editAction;
  }
}
