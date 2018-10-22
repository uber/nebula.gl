// @flow
import { IconLayer } from 'deck.gl';

const DEFAULT_EDITING_EXISTING_POINT_COLOR = [0xc0, 0x0, 0x0, 0xff];
const DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR = [0x0, 0x0, 0x0, 0x80];

const defaultProps = {
  iconAtlas: null,
  iconMapping: null,
  sizeScale: 1,
  getIcon: handle => handle.type,
  getSize: 10,
  getColor: handle =>
    handle.type === 'existing'
      ? DEFAULT_EDITING_EXISTING_POINT_COLOR
      : DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR,
  getAngle: 0,
  getPosition: d => d.position,
  parameters: {}
};

export default class IconEditHandleLayer extends IconLayer {
  constructor(props: Object) {
    super({
      ...defaultProps,
      ...props
    });
  }
}

IconEditHandleLayer.defaultProps = defaultProps;
