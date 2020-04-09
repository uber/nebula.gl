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
import { FeatureCollection } from '../geojson-types';
import {
  ClickEvent,
  PointerMoveEvent,
  ModeProps,
  GuideFeatureCollection,
  TentativeFeature,
} from '../types';
import { GeoJsonEditMode, GeoJsonEditAction } from './geojson-edit-mode';
import { ImmutableFeatureCollection } from './immutable-feature-collection';

export class SplitPolygonMode extends GeoJsonEditMode {
  calculateMapCoords(clickSequence: any, mapCoords: any, props: ModeProps<FeatureCollection>) {
    const modeConfig = props.modeConfig;
    if (!modeConfig || !modeConfig.lock90Degree || !clickSequence.length) {
      return mapCoords;
    }
    if (clickSequence.length === 1) {
      // if first point is clicked, then find closest polygon point and build ~90deg vector
      const firstPoint = clickSequence[0];
      const selectedGeometry = this.getSelectedGeometry(props);
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
        const currentDistance = turfDistance(firstPoint, mapCoords, { units: 'meters' });
        return turfDestination(firstPoint, currentDistance, lastBearing, {
          units: 'meters',
        }).geometry.coordinates;
      }
      return mapCoords;
    }
    // Allow only 90 degree turns
    const lastPoint = clickSequence[clickSequence.length - 1];
    const [approximatePoint] = generatePointsParallelToLinePoints(
      clickSequence[clickSequence.length - 2],
      lastPoint,
      mapCoords
    );
    // align point with current ground
    const nearestPt = nearestPointOnLine(lineString([lastPoint, approximatePoint]), mapCoords)
      .geometry.coordinates;
    return nearestPt;
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const clickSequence = this.getClickSequence();

    const guides: GuideFeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (clickSequence.length === 0 || !props.lastPointerMoveEvent) {
      // nothing to do yet
      return guides;
    }

    const { mapCoords } = props.lastPointerMoveEvent;

    guides.features.push({
      type: 'Feature',
      properties: {
        guideType: 'tentative',
      },
      geometry: {
        type: 'LineString',
        coordinates: [...clickSequence, this.calculateMapCoords(clickSequence, mapCoords, props)],
      },
    });

    return guides;
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const tentativeFeature = this.getTentativeGuide(props);

    const selectedGeometry = this.getSelectedGeometry(props);

    if (!selectedGeometry) {
      // eslint-disable-next-line no-console,no-undef
      console.warn('A polygon must be selected for splitting');
      return;
    }

    const clickSequence = this.getClickSequence();
    if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
      clickSequence.push(
        tentativeFeature.geometry.coordinates[tentativeFeature.geometry.coordinates.length - 1]
      );
    } else {
      this.addClickSequence(event);
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
        return;
      }

      const editAction = this.splitPolygon(tentativeFeature, props);

      if (editAction) {
        props.onEdit(editAction);
      }
    }
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }

  splitPolygon(tentativeFeature: TentativeFeature, props: ModeProps<FeatureCollection>) {
    const selectedGeometry = this.getSelectedGeometry(props);
    const featureIndex = props.selectedIndexes[0];
    const modeConfig = props.modeConfig || {};

    // Default gap in between the polygon
    let { gap = 0.1, units = 'centimeters' } = modeConfig;
    if (gap === 0) {
      gap = 0.1;
      units = 'centimeters';
    }

    const buffer = turfBuffer(tentativeFeature, gap, { units });
    // @ts-ignore
    const updatedGeometry = turfDifference(selectedGeometry, buffer);
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
    const updatedData = new ImmutableFeatureCollection(props.data).replaceGeometry(featureIndex, {
      type: 'MultiPolygon',
      coordinates: updatedCoordinates,
    });

    const editAction: GeoJsonEditAction = {
      updatedData: updatedData.getObject(),
      editType: 'split',
      editContext: {
        featureIndexes: [featureIndex],
      },
    };

    return editAction;
  }
}
