// @flow

import turfArea from '@turf/area';
import turfCentroid from '@turf/centroid';
import type { ClickEvent, Tooltip, ModeProps } from '../types.js';
import type { FeatureCollection } from '../geojson-types.js';
import { DrawPolygonMode } from './draw-polygon-mode.js';

const DEFAULT_TOOLTIPS = [];

export class MeasureAreaMode extends DrawPolygonMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const propsWithoutEdit = {
      ...props,
      onEdit: () => {}
    };

    super.handleClick(event, propsWithoutEdit);
  }

  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    const tentativeGuide = this.getTentativeGuide(props);

    if (tentativeGuide && tentativeGuide.geometry.type === 'Polygon') {
      const { modeConfig } = props;
      const { formatTooltip, measurementCallback } = modeConfig || {};
      const units = 'sq. m';

      const centroid = turfCentroid(tentativeGuide);
      const area = turfArea(tentativeGuide);

      let text;
      if (formatTooltip) {
        text = formatTooltip(area);
      } else {
        // By default, round to 2 decimal places and append units
        text = `${parseFloat(area).toFixed(2)} ${units}`;
      }

      if (measurementCallback) {
        measurementCallback(area);
      }

      return [
        {
          position: centroid.geometry.coordinates,
          text
        }
      ];
    }
    return DEFAULT_TOOLTIPS;
  }
}
