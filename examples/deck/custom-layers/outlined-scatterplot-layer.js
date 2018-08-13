// @flow
import { CompositeLayer, ScatterplotLayer } from 'deck.gl';

export default class OutlinedScatterplotLayer extends CompositeLayer {
  static layerName = 'OutlinedScatterplotLayer';
  static defaultProps = {
    ...ScatterplotLayer.defaultProps,
    fp64: true,
    getFillColor: d => [0, 0, 0, 255],
    getStrokeColor: d => [255, 255, 255, 255],
    getOuterRadius: d => 1
  };

  renderLayers() {
    const {
      id,
      getFillColor,
      getStrokeColor,
      getOuterRadius,
      updateTriggers,
      radiusMinPixels
    } = this.props;

    // data needs to be passed explicitly after deck.gl 5.3
    return [
      // the full circles
      new ScatterplotLayer({
        ...this.props,
        id: `${id}-full`,
        data: this.props.data,
        getColor: getStrokeColor,
        getRadius: getOuterRadius,
        radiusMinPixels: radiusMinPixels + 2,
        updateTriggers: {
          ...updateTriggers,
          getColor: updateTriggers.getStrokeColor,
          getRadius: updateTriggers.getOuterRadius
        }
      }),
      // the inner part
      new ScatterplotLayer({
        ...this.props,
        id: `${id}-inner`,
        data: this.props.data,
        getColor: getFillColor,
        pickable: false,
        updateTriggers: {
          ...updateTriggers,
          getColor: updateTriggers.getFillColor
        }
      })
    ];
  }
}
