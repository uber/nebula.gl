import * as React from 'react';

const styles: { item: React.CSSProperties } = {
  item: {
    position: 'absolute',
    userSelect: 'none',
  },
};

type Props = {
  // Injected by HtmlOverlay
  x?: number;
  y?: number;

  // User provided
  coordinates: number[];
  children: any;
  style?: Record<string, any>;
};

export default class HtmlOverlayItem extends React.Component<Props> {
  render() {
    const { x, y, children, style, coordinates, ...props } = this.props;
    const overlayStyle: React.CSSProperties = { ...styles.item, ...style, left: x, top: y };

    return (
      <div style={overlayStyle} {...props}>
        {children}
      </div>
    );
  }
}
