// @flow
import React from 'react';
import PropTypes from 'prop-types';
import NebulaOverlay from './nebula-overlay';

const styles = {
  mainContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none'
  }
};

export default class HtmlOverlay<Props> extends NebulaOverlay<Props> {
  static childContextTypes = {
    parent: PropTypes.object
  };

  getChildContext() {
    return { parent: this };
  }

  // override this to provide your items
  getItems(): Array<*> {
    throw new Error('Please provide your own items');
  }

  getCoords(coordinates: number[]): [number, number] {
    const pos = this.context.wmViewport.project(coordinates);
    if (!pos) return [-1, -1];
    return pos;
  }

  inView([x, y]: number[]): boolean {
    const { width, height } = this.context.viewport;
    return !(x < 0 || y < 0 || x > width || y > height);
  }

  scaleWithZoom(n: number) {
    const { zoom } = this.context.viewport;
    return n / Math.pow(2, 20 - zoom);
  }

  breakpointWithZoom(threshold: number, a: any, b: any): any {
    const { zoom } = this.context.viewport;
    return zoom > threshold ? a : b;
  }

  getViewport() {
    return this.context.viewport;
  }

  getZoom() {
    return this.context.viewport.zoom;
  }

  render() {
    return <div style={styles.mainContainer}>{this.getItems()}</div>;
  }
}
