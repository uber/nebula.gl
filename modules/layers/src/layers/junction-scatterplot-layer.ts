import { CompositeLayer, CompositeLayerProps, DefaultProps } from '@deck.gl/core/typed';
import { ScatterplotLayer } from '@deck.gl/layers/typed';

import { Color } from '../types';

interface JunctionScatterplotLayerProps extends CompositeLayerProps<any> {
  getFillColor?: Color | ((d) => Color);
  getStrokeColor?: Color | ((d) => Color);
  getInnerRadius?: number | ((d) => number);
}

export default class JunctionScatterplotLayer extends CompositeLayer<JunctionScatterplotLayerProps> {
  static layerName = 'JunctionScatterplotLayer';
  static defaultProps: DefaultProps<JunctionScatterplotLayerProps> = {
    ...ScatterplotLayer.defaultProps,
    getFillColor: (d) => [0, 0, 0, 255],
    getStrokeColor: (d) => [255, 255, 255, 255],
    getInnerRadius: (d) => 1,
  };

  renderLayers() {
    const { id, getFillColor, getStrokeColor, getInnerRadius, updateTriggers } = this.props;

    // data needs to be passed explicitly after deck.gl 5.3
    return [
      // the full circles
      new ScatterplotLayer<any>({
        ...this.props,
        id: `${id}-full` as string,
        data: this.props.data,
        getLineColor: getStrokeColor,
        updateTriggers: {
          ...updateTriggers,
          getStrokeColor: updateTriggers.getStrokeColor,
        },
      }), // the inner part
      new ScatterplotLayer<any>({
        ...this.props,
        id: `${id}-inner` as string,
        data: this.props.data,
        getFillColor,
        getRadius: getInnerRadius,
        pickable: false,
        updateTriggers: {
          ...updateTriggers,
          getFillColor: updateTriggers.getFillColor,
          getRadius: updateTriggers.getInnerRadius,
        },
      }),
    ];
  }
}
