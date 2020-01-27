// @flow

import turfBearing from '@turf/bearing';
import memoize from 'memoizee';

import type {
  ClickEvent,
  PointerMoveEvent,
  Tooltip,
  ModeProps,
  GuideFeatureCollection
} from '../types.js';
import type { FeatureCollection } from '../geojson-types.js';
import { BaseGeoJsonEditMode } from './geojson-edit-mode.js';

const DEFAULT_TOOLTIPS = [];

export class MeasureAngleMode extends BaseGeoJsonEditMode {
  _getTooltips = memoize((modeConfig, vertex, point1, point2) => {
    let tooltips = DEFAULT_TOOLTIPS;

    if (vertex && point1 && point2) {
      const { formatTooltip, measurementCallback } = modeConfig || {};
      const units = 'deg';

      // const angle = turfAngle(point1, vertex, point2);
      const angle1 = turfBearing(vertex, point1);
      const angle2 = turfBearing(vertex, point2);
      let angle = Math.abs(angle1 - angle2);
      if (angle > 180) {
        angle = 360 - angle;
      }

      let text;
      if (formatTooltip) {
        text = formatTooltip(angle);
      }
      if (!formatTooltip) {
        // By default, round to 2 decimal places and append units
        text = `${parseFloat(angle).toFixed(2)} ${units}`;
      }

      if (measurementCallback) {
        measurementCallback(angle);
      }

      tooltips = [
        {
          position: point2,
          text
        }
      ];
    }

    return tooltips;
  });

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void {
    if (this.getClickSequence().length >= 3) {
      this.resetClickSequence();
    }

    this.addClickSequence(event);
  }

  // Called when the pointer moved, regardless of whether the pointer is down, up, and whether something was picked
  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void {
    props.onUpdateCursor('cell');
  }

  getPoints(props: ModeProps<FeatureCollection>) {
    const clickSequence = this.getClickSequence();

    const points = [...clickSequence];

    if (clickSequence.length < 3 && props.lastPointerMoveEvent) {
      points.push(props.lastPointerMoveEvent.mapCoords);
    }

    return points;
  }

  // Return features that can be used as a guide for editing the data
  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const guides: GuideFeatureCollection = { type: 'FeatureCollection', features: [] };
    const { features } = guides;

    const points = this.getPoints(props);

    if (points.length > 2) {
      features.push({
        type: 'Feature',
        properties: { guideType: 'tentative' },
        geometry: {
          type: 'LineString',
          coordinates: [points[1], points[0], points[2]]
        }
      });
    } else if (points.length > 1) {
      features.push({
        type: 'Feature',
        properties: { guideType: 'tentative' },
        geometry: {
          type: 'LineString',
          coordinates: [points[1], points[0]]
        }
      });
    }

    return guides;
  }

  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    const points = this.getPoints(props);

    return this._getTooltips(props.modeConfig, points[0], points[1], points[2]);
  }
}
