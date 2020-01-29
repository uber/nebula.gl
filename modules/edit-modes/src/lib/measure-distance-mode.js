// @flow

import turfDistance from '@turf/distance';
import memoize from 'memoizee';
import type {
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  Tooltip,
  ModeProps,
  GuideFeatureCollection,
  EditHandleFeature
} from '../types.js';
import type { FeatureCollection, Position } from '../geojson-types.js';
import { BaseGeoJsonEditMode } from './geojson-edit-mode.js';

const DEFAULT_TOOLTIPS = [];

export class MeasureDistanceMode extends BaseGeoJsonEditMode {
  startingPoint: ?$ReadOnly<EditHandleFeature> = null;
  endingPoint: ?$ReadOnly<EditHandleFeature> = null;
  endingPointLocked = false;

  _setEndingPoint(mapCoords: Position) {
    this.endingPoint = {
      type: 'Feature',
      properties: {
        guideType: 'editHandle',
        editHandleType: 'existing',
        featureIndex: -1,
        positionIndexes: []
      },
      geometry: {
        type: 'Point',
        coordinates: mapCoords
      }
    };
  }

  _getTooltips = memoize((modeConfig, startingPoint, endingPoint) => {
    let tooltips = DEFAULT_TOOLTIPS;

    if (startingPoint && endingPoint) {
      const { formatTooltip, turfOptions, measurementCallback } = modeConfig || {};
      const units = (turfOptions && turfOptions.units) || 'kilometers';

      const distance = turfDistance(startingPoint, endingPoint, turfOptions);

      let text;
      if (formatTooltip) {
        text = formatTooltip(distance);
      } else {
        // By default, round to 2 decimal places and append units
        text = `${parseFloat(distance).toFixed(2)} ${units}`;
      }

      if (measurementCallback) {
        measurementCallback(distance);
      }

      tooltips = [
        {
          position: endingPoint.geometry.coordinates,
          text
        }
      ];
    }

    return tooltips;
  });

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void {
    if (!this.startingPoint || this.endingPointLocked) {
      this.startingPoint = {
        type: 'Feature',
        properties: {
          guideType: 'editHandle',
          editHandleType: 'existing',
          featureIndex: -1,
          positionIndexes: []
        },
        geometry: {
          type: 'Point',
          coordinates: event.mapCoords
        }
      };
      this.endingPoint = null;
      this.endingPointLocked = false;
    } else if (this.startingPoint) {
      this._setEndingPoint(event.mapCoords);
      this.endingPointLocked = true;
    }
  }

  // Called when the pointer moved, regardless of whether the pointer is down, up, and whether something was picked
  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void {
    if (this.startingPoint && !this.endingPointLocked) {
      this._setEndingPoint(event.mapCoords);
    }

    props.onUpdateCursor('cell');
  }

  // Called when the pointer went down on something rendered by this layer and the pointer started to move
  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void {}

  // Called when the pointer went down on something rendered by this layer, the pointer moved, and now the pointer is up
  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void {}

  // Return features that can be used as a guide for editing the data
  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const guides: GuideFeatureCollection = { type: 'FeatureCollection', features: [] };
    const { features } = guides;

    if (this.startingPoint) {
      features.push(this.startingPoint);
    }
    if (this.endingPoint) {
      features.push(this.endingPoint);
    }
    if (this.startingPoint && this.endingPoint) {
      features.push({
        type: 'Feature',
        properties: { guideType: 'tentative' },
        geometry: {
          type: 'LineString',
          coordinates: [
            this.startingPoint.geometry.coordinates,
            this.endingPoint.geometry.coordinates
          ]
        }
      });
    }
    return guides;
  }

  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    return this._getTooltips(props.modeConfig, this.startingPoint, this.endingPoint);
  }
}
