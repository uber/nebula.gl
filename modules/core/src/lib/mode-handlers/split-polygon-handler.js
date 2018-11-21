// @flow

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import turfDifference from '@turf/difference';
import turfBuffer from '@turf/buffer';
import type { Feature, Polygon } from '../../geojson-types.js';
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
      return;
    }
    const pt = {
      type: 'Point',
      coordinates: event.groundCoords
    };
    const isPointInPolygon = booleanPointInPolygon(pt, selectedGeometry);
    if (clickSequence.length > 1 && tentativeFeature && !isPointInPolygon) {
      this.resetClickSequence();
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
    const { gap = 0.001, units = 'miles' } = modeConfig;

    const buffer = turfBuffer(tentativeFeature, gap, { units });
    const updatedGeometry = turfDifference(selectedGeometry, buffer);
    this._setTentativeFeature(null);
    if (!updatedGeometry) {
      // eslint-disable-next-line no-console,no-undef
      console.warn('Canceling edit. Split Polygon erased');
      return null;
    }

    const pieces = updatedGeometry.geometry.coordinates.map(coordinates => {
      if (updatedGeometry.geometry.type === 'Polygon') {
        coordinates = [coordinates];
      }
      return {
        type: 'Polygon',
        coordinates
      };
    });

    let updatedData = this.getImmutableFeatureCollection().replaceGeometry(
      featureIndex,
      pieces.shift()
    );

    pieces.forEach(polygon => {
      updatedData = updatedData.addFeature(
        ({
          type: 'Feature',
          properties: {},
          geometry: (polygon: any)
        }: Feature)
      );
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
