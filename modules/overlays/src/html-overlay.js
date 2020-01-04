// @flow
import React, { Component, cloneElement } from 'react';

const styles = {
  mainContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none'
  }
};

export default class HtmlOverlay<Props> extends Component<
  Props & { children: any, viewport: Object, zIndex?: number },
  *
> {
  // Override this to provide your items
  getItems(): Array<*> {
    const { children } = this.props;
    if (children) {
      return Array.isArray(children) ? children : [children];
    }
    return [];
  }

  getCoords(coordinates: number[]): [number, number] {
    const pos = this.props.viewport.project(coordinates);
    if (!pos) return [-1, -1];
    return pos;
  }

  inView([x, y]: number[]): boolean {
    const { width, height } = this.props.viewport;
    return !(x < 0 || y < 0 || x > width || y > height);
  }

  scaleWithZoom(n: number) {
    const { zoom } = this.props.viewport;
    return n / Math.pow(2, 20 - zoom);
  }

  breakpointWithZoom(threshold: number, a: any, b: any): any {
    const { zoom } = this.props.viewport;
    return zoom > threshold ? a : b;
  }

  getViewport() {
    return this.props.viewport;
  }

  getZoom() {
    return this.props.viewport.zoom;
  }

  render() {
    const { zIndex = 1 } = this.props;
    const style = Object.assign(({ zIndex }: any), styles.mainContainer);

    const renderItems = [];
    this.getItems()
      .filter(Boolean)
      .forEach(item => {
        const [x, y] = this.getCoords(item.props.coordinates);
        if (this.inView([x, y])) {
          renderItems.push(cloneElement(item, { x, y }));
        }
      });

    return <div style={style}>{renderItems}</div>;
  }
}

// This is needed for Deck.gl 8.0+
// $FlowFixMe
HtmlOverlay.deckGLViewProps = true;
