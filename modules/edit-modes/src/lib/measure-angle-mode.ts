import turfBearing from '@turf/bearing';
// @ts-ignore
import turfCenter from '@turf/center';
// @ts-ignore
import memoize from '../memoize';

import { ClickEvent, PointerMoveEvent, Tooltip, ModeProps, GuideFeatureCollection } from '../types';
import { FeatureCollection } from '../geojson-types';
import { GeoJsonEditMode } from './geojson-edit-mode';

const DEFAULT_TOOLTIPS = [];

export class MeasureAngleMode extends GeoJsonEditMode {
  _getTooltips = memoize(({ modeConfig, vertex, point1, point2 }) => {
    let tooltips = DEFAULT_TOOLTIPS;

    if (vertex && point1 && point2) {
      const { formatTooltip, measurementCallback } = modeConfig || {};
      const units = 'deg';

      const angle1 = turfBearing(vertex, point1);
      const angle2 = turfBearing(vertex, point2);
      let angle = Math.abs(angle1 - angle2);
      if (angle > 180) {
        angle = 360 - angle;
      }

      let text;
      if (formatTooltip) {
        text = formatTooltip(angle);
      } else {
        // By default, round to 2 decimal places and append units
        // @ts-ignore
        text = `${parseFloat(angle).toFixed(2)} ${units}`;
      }

      if (measurementCallback) {
        measurementCallback(angle);
      }

      const position = turfCenter({
        type: 'FeatureCollection',
        features: [point1, point2].map((p) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: p,
          },
        })),
      }).geometry.coordinates;

      tooltips = [
        {
          position,
          text,
        },
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
          coordinates: [points[1], points[0], points[2]],
        },
      });
    } else if (points.length > 1) {
      features.push({
        type: 'Feature',
        properties: { guideType: 'tentative' },
        geometry: {
          type: 'LineString',
          coordinates: [points[1], points[0]],
        },
      });
    }

    return guides;
  }

  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    const points = this.getPoints(props);

    return this._getTooltips({
      modeConfig: props.modeConfig,
      vertex: points[0],
      point1: points[1],
      point2: points[2],
    });
  }
}
