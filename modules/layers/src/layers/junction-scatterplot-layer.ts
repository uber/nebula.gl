import { CompositeLayer } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';

export default class JunctionScatterplotLayer extends CompositeLayer<any> {
  static layerName = 'JunctionScatterplotLayer';
  static defaultProps = {
    // @ts-ignore
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
      new ScatterplotLayer({
        ...this.props,
        id: `${id}-full`,
        data: this.props.data,
        getLineColor: getStrokeColor,
        updateTriggers: {
          ...updateTriggers,
          getStrokeColor: updateTriggers.getStrokeColor,
        },
      }), // the inner part
      new ScatterplotLayer({
        ...this.props,
        id: `${id}-inner`,
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
