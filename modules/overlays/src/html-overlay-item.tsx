import * as React from 'react';

const styles = {
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

    return (
      // @ts-expect-error ts-migrate(2322) FIXME: Type '{ left: number; top: number; position: strin... Remove this comment to see the full error message
      <div style={{ ...styles.item, ...style, left: x, top: y }} {...props}>
        {children}
      </div>
    );
  }
}
