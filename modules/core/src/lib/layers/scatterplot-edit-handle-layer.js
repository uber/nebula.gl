// @flow
import { ScatterplotLayer } from 'deck.gl';

const DEFAULT_EDITING_EXISTING_POINT_COLOR = [0xc0, 0x0, 0x0, 0xff];
const DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR = [0x0, 0x0, 0x0, 0x80];

const defaultProps = {
  radiusScale: 1,
  outline: false,
  strokeWidth: 1,
  radiusMinPixels: 4,
  radiusMaxPixels: 8,
  getRadius: handle => (handle.type === 'existing' ? 5 : 3),
  getColor: handle =>
    handle.type === 'existing'
      ? DEFAULT_EDITING_EXISTING_POINT_COLOR
      : DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR,
  parameters: {}
};

export default class ScatterplotEditHandleLayer extends ScatterplotLayer {
  constructor(props: Object) {
    super({
      ...defaultProps,
      ...props
    });
  }
}

ScatterplotEditHandleLayer.defaultProps = defaultProps;
