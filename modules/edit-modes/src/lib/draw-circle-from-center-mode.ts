import circle from '@turf/circle';
import distance from '@turf/distance';
import area from '@turf/area';
import memoize from '../memoize';
import { ModeProps, Tooltip } from '../types';
import { Position, Polygon, FeatureOf, FeatureCollection } from '../geojson-types';
import { TwoClickPolygonMode } from './two-click-polygon-mode';

export class DrawCircleFromCenterMode extends TwoClickPolygonMode {
  radius: number | null | undefined = null;
  position: Position;
  areaCircle: number | null | undefined = null;
  getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon> {
    // Default turf value for circle is 64
    const { steps = 64 } = modeConfig || {};
    const options = { steps };
    // setting with position of center of circle
    this.position = coord2;

    if (steps < 4) {
      console.warn(`Minimum steps to draw a circle is 4 `); // eslint-disable-line no-console,no-undef
      options.steps = 4;
    }

    // setting value of radius as distance of center and other point
    this.radius = Math.max(distance(coord1, coord2), 0.001);
    const geometry = circle(coord1, this.radius, options);

    geometry.properties = geometry.properties || {};
    geometry.properties.shape = 'Circle';
    // calculate area of circle with turf function
    this.areaCircle = area(geometry);
    // @ts-expect-error turf types diff
    return geometry;
  }

  /**
   * define the default function to display the tooltip for
   * nebula geometry mode type
   * @param props properties of geometry nebula mode
   */
  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    return this._getTooltips({
      modeConfig: props?.modeConfig,
      radius: this.radius,
      areaCircle: this.areaCircle,
    });
  }

  /**
   * redefine the tooltip of geometry
   * @param modeConfig
   * @param radius
   * @param areaCircle
   */
  _getTooltips = memoize(({ modeConfig, radius, areaCircle }) => {
    let tooltips = [];
    const { formatTooltip } = modeConfig || {};
    let text: string;
    if (radius && areaCircle) {
      if (formatTooltip) {
        text = formatTooltip(radius);
      } else {
        // By default, round to 2 decimal places and append units
        text = `Radius: ${parseFloat(radius).toFixed(2)} kilometers
      \n Area: ${parseFloat(areaCircle).toFixed(2)}`;
      }

      tooltips = [
        {
          position: this.position,
          text,
        },
      ];
    }

    return tooltips;
  });
}
