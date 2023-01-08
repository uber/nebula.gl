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
      onEdit: () => {},
    };

    super.handleClick(event, propsWithoutEdit);
  }

  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>): void {
    const propsWithoutEdit = {
      ...props,
      onEdit: () => {},
    };

    super.handleKeyUp(event, propsWithoutEdit);
  }

  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    const tentativeGuide = this.getTentativeGuide(props);

    if (tentativeGuide && tentativeGuide.geometry.type === 'Polygon') {
      const { modeConfig } = props;
      const { formatTooltip, measurementCallback } = modeConfig || {};
      const units = 'sq. m';

      const centroid = turfCentroid(tentativeGuide);
      const area = turfArea(tentativeGuide);

      let text: string;
      if (formatTooltip) {
        text = formatTooltip(area);
      } else {
        // By default, round to 2 decimal places and append units
        // @ts-expect-error are isn't string
        text = `${parseFloat(area).toFixed(2)} ${units}`;
      }

      if (measurementCallback) {
        measurementCallback(area);
      }

      return [
        {
          // @ts-expect-error turf types diff
          position: centroid.geometry.coordinates,
          text,
        },
      ];
    }
    return DEFAULT_TOOLTIPS;
  }
}
