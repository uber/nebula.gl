import turfArea from '@turf/area';
import turfCentroid from '@turf/centroid';
import { ClickEvent, Tooltip, ModeProps } from '../types';
import { FeatureCollection } from '../geojson-types';
import { DrawPolygonMode } from './draw-polygon-mode';

const DEFAULT_TOOLTIPS = [];

export class MeasureAreaMode extends DrawPolygonMode {
  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const propsWithoutEdit = {
      ...props,
      // @ts-ignore
      onEdit: () => {},
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
        // @ts-ignore
        text = `${parseFloat(area).toFixed(2)} ${units}`;
      }

      if (measurementCallback) {
        measurementCallback(area);
      }

      return [
        {
          position: centroid.geometry.coordinates,
          text,
        },
      ];
    }
    return DEFAULT_TOOLTIPS;
  }
}
