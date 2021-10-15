/* eslint-env browser */

import { CompositeLayer } from '@deck.gl/core';
import { ScatterplotLayer, LineLayer } from '@deck.gl/layers';

const defaultProps = {};

export default class ElevatedEditHandleLayer extends CompositeLayer<any> {
  static layerName = 'ElevatedEditHandleLayer';
  static defaultProps = defaultProps;
  renderLayers() {
    const handles = new ScatterplotLayer(
      Object.assign({}, this.props, {
        id: `${this.props.id}-ScatterplotLayer`,
        data: this.props.data,
      })
    );

    const lines = new LineLayer(
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'CompositeLayerProps<any> & { id:... Remove this comment to see the full error message
      Object.assign({}, this.props, {
        id: `${this.props.id}-LineLayer`,
        data: this.props.data,
        pickable: false,
        getSourcePosition: ({ position }) => [position[0], position[1], 0],
        getTargetPosition: ({ position }) => [position[0], position[1], position[2] || 0],
        getColor: [150, 150, 150, 200],
        getStrokeWidth: 3,
      })
    );

    return [handles, lines];
  }
}
