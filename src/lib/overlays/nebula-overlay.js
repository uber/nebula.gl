// @flow
import { Component } from 'react';
import PropTypes from 'prop-types';

export default class NebulaOverlay<Props> extends Component<Props, *> {
  static contextTypes = {
    viewport: PropTypes.object,
    wmViewport: PropTypes.object,
    nebula: PropTypes.object
  };
}
