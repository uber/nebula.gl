// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  item: {
    position: 'absolute',
    userSelect: 'none'
  }
};

type Props = {
  coordinates: number[],
  children: any,
  style?: Object
};

export default class HtmlOverlayItem extends Component<Props> {
  static contextTypes = {
    parent: PropTypes.object
  };

  render() {
    const { children, coordinates, style, ...props } = this.props;
    const [x, y] = this.context.parent.getCoords(coordinates);
    if (this.context.parent.inView([x, y]))
      return (
        <div style={{ ...styles.item, ...style, left: x, top: y }} {...props}>
          {children}
        </div>
      );

    return null;
  }
}
