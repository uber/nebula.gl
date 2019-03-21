// @flow
import { CompositeLayer, ScatterplotLayer } from 'deck.gl';

export default class JunctionScatterplotLayer extends CompositeLayer {
  static layerName = 'JunctionScatterplotLayer';
  static defaultProps = {
    ...ScatterplotLayer.defaultProps,
    getFillColor: d => [0, 0, 0, 255],
    getStrokeColor: d => [255, 255, 255, 255],
    getInnerRadius: d => 1
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
        getColor: getStrokeColor,
        updateTriggers: {
          ...updateTriggers,
          getColor: updateTriggers.getStrokeColor
        }
      }),
      // the inner part
      new ScatterplotLayer({
        ...this.props,
        id: `${id}-inner`,
        data: this.props.data,
        getColor: getFillColor,
        getRadius: getInnerRadius,
        pickable: false,
        updateTriggers: {
          ...updateTriggers,
          getColor: updateTriggers.getFillColor,
          getRadius: updateTriggers.getInnerRadius
        }
      })
    ];
  }
}
