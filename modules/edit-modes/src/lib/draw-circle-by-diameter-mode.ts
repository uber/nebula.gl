import circle from '@turf/circle';
import distance from '@turf/distance';
import area from '@turf/area';
import memoize from '../memoize';
import { ModeProps, Tooltip } from '../types';
import { Position, Polygon, FeatureOf, FeatureCollection } from '../geojson-types';
import { getIntermediatePosition } from './geojson-edit-mode';
import { TwoClickPolygonMode } from './two-click-polygon-mode';

export class DrawCircleByDiameterMode extends TwoClickPolygonMode {
  radius: number | null | undefined = null;
  position: Position;
  areaCircle: number | null | undefined = null;
  diameter: number | null | undefined = null;
  getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon> {
    // Default turf value for circle is 64
    const { steps = 64 } = modeConfig || {};
    const options = { steps };

    if (steps < 4) {
      console.warn(`Minimum steps to draw a circle is 4 `); // eslint-disable-line no-console,no-undef
      options.steps = 4;
    }

    const centerCoordinates = getIntermediatePosition(coord1, coord2);
    // setting value of radius as distance of center and other point
    this.radius = Math.max(distance(coord1, centerCoordinates), 0.001);
    // setting value of diameter as distance of points
    this.diameter = Math.max(distance(coord1, coord2), 0.001);
    // setting position tooltip as center of circle
    this.position = centerCoordinates;

    const geometry = circle(centerCoordinates, this.radius, options);

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
      modeConfig: props.modeConfig,
      radius: this.radius,
      areaCircle: this.areaCircle,
      diameter: this.diameter,
    });
  }

  /**
   * redefine the tooltip of geometry
   * @param modeConfig
   * @param radius
   * @param areaCircle
   * @param diameter
   */
  _getTooltips = memoize(({ modeConfig, radius, areaCircle, diameter }) => {
    let tooltips = [];
    const { formatTooltip } = modeConfig || {};
    let text;
    if (radius && areaCircle) {
      if (formatTooltip) {
        text = formatTooltip(radius);
      } else {
        // By default, round to 2 decimal places and append units
        text = `Radius: ${parseFloat(radius).toFixed(2)} kilometers
      \n Area: ${parseFloat(areaCircle).toFixed(2)}
      \n Diameter: ${parseFloat(diameter).toFixed(2)} kilometers`;
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
