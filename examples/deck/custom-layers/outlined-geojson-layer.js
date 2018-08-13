// @flow
import { CompositeLayer, GeoJsonLayer } from 'deck.gl';

export default class OutlinedGeoJsonLayer extends CompositeLayer {
  static layerName = 'OutlinedGeoJsonLayer';
  static defaultProps = {
    ...GeoJsonLayer.defaultProps,
    fp64: true,
    getLineFillColor: d => [0, 0, 0, 255],
    getLineStrokeColor: d => [255, 255, 255, 255],
    getLineStrokeWidth: d => 1
  };

  renderLayers() {
    const {
      id,
      getLineFillColor,
      getLineStrokeColor,
      getLineStrokeWidth,
      lineWidthMinPixels,
      updateTriggers
    } = this.props;

    return [
      // the outer part
      new GeoJsonLayer({
        ...this.props,
        id: `${id}-full`,
        data: this.props.data,
        getLineColor: getLineStrokeColor,
        getLineWidth: getLineStrokeWidth,
        lineWidthMinPixels: lineWidthMinPixels + 2,

        updateTriggers: {
          ...updateTriggers,
          getColor: updateTriggers.getStrokeColor,
          getLineWidth: updateTriggers.getLineWidth
        }
      }),
      // the inner part
      new GeoJsonLayer({
        ...this.props,
        id: `${id}-inner`,
        data: this.props.data,
        getLineColor: getLineFillColor,
        pickable: false,
        updateTriggers: {
          ...updateTriggers,
          getColor: updateTriggers.getFillColor
        }
      })
    ];
  }
}
