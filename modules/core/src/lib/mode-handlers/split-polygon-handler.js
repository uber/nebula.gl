// @flow

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import turfDifference from '@turf/difference';
import turfBuffer from '@turf/buffer';
import lineIntersect from '@turf/line-intersect';
import type { ClickEvent, PointerMoveEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class SplitPolygonHandler extends ModeHandler {
  handleClick(event: ClickEvent): ?EditAction {
    super.handleClick(event);

    const editAction: ?EditAction = null;
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
      coordinates: event.groundCoords
    };
    const isPointInPolygon = booleanPointInPolygon(pt, selectedGeometry);
    if (clickSequence.length > 1 && tentativeFeature && !isPointInPolygon) {
      this.resetClickSequence();
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
    groundCoords
  }: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
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
        coordinates: [...clickSequence, groundCoords]
      }
    });

    return result;
  }

  splitPolygon() {
    const selectedGeometry = this.getSelectedGeometry();
    const tentativeFeature = this.getTentativeFeature();
    const featureIndex = this.getSelectedFeatureIndexes()[0];
    const modeConfig = this.getModeConfig();

    // Default gap in between the polygon
    let { gap = 0.1, units = 'centimeters' } = modeConfig;
    if (gap === 0) {
      gap = 0.1;
      units = 'centimeters';
    }

    const buffer = turfBuffer(tentativeFeature, gap, { units });
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
      updatedCoordinates = coordinates.map(c => [c]);
    } else {
      // Handle Case when Multipolygon has holes
      updatedCoordinates = coordinates.reduce((agg, prev) => {
        prev.forEach(p => {
          agg.push([p]);
        });
        return agg;
      }, []);
    }

    // Update the type to Mulitpolygon
    const updatedData = this.getImmutableFeatureCollection().replaceGeometry(featureIndex, {
      type: 'MultiPolygon',
      coordinates: updatedCoordinates
    });

    const editAction: EditAction = {
      updatedData: updatedData.getObject(),
      editType: 'split',
      featureIndex,
      positionIndexes: null,
      position: null
    };

    return editAction;
  }
}
