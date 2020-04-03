// @flow
import React, { Component } from 'react';

const styles = {
  item: {
    position: 'absolute',
    userSelect: 'none'
  }
};

type Props = {
  // Injected by HtmlOverlay
  x?: number,
  y?: number,

  // User provided
  coordinates: number[],
  children: any,
  style?: Object
};

export default class HtmlOverlayItem extends Component<Props> {
  render() {
    const { x, y, children, style, ...props } = this.props;

    return (
      <div style={{ ...styles.item, ...style, left: x, top: y }} {...props}>
        {children}
      </div>
    );
  }
}
