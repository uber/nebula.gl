import * as React from 'react';

const styles = {
  mainContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
  },
};

export default class HtmlOverlay extends React.Component<
  { viewport?: Record<string, any>; zIndex?: number; children?: React.ReactNode },
  any
> {
  // Override this to provide your items
  getItems(): Array<any> {
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
    const style = Object.assign({ zIndex } as any, styles.mainContainer);

    const renderItems = [];
    this.getItems()
      .filter(Boolean)
      .forEach((item, index) => {
        const [x, y] = this.getCoords(item.props.coordinates);
        if (this.inView([x, y])) {
          const key = item.key === null || item.key === undefined ? index : item.key;
          renderItems.push(React.cloneElement(item, { x, y, key }));
        }
      });

    return <div style={style}>{renderItems}</div>;
  }
}

// This is needed for Deck.gl 8.0+
//@ts-ignore
HtmlOverlay.deckGLViewProps = true;
