// @flow
import React, { Component } from 'react';
import DeckGL from 'deck.gl';
import PropTypes from 'prop-types';

import type { Viewport } from '../types';
import Nebula from './nebula';

type Props = {
  layers: Object[],
  onSelection?: (selectedFeatures: Object[]) => void,
  selectionType?: number,
  onMapMouseEvent?: Function,
  viewport: Viewport,
  logger?: Object,
  children?: any
};

const styles = {
  canvasContainer: {
    pointerEvents: 'none',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
};

export default class NebulaReact extends Component<Props> {
  static childContextTypes = {
    viewport: PropTypes.object,
    wmViewport: PropTypes.object,
    nebula: PropTypes.object
  };

  getChildContext() {
    const { nebula } = this;
    const { props: { viewport }, wmViewport } = nebula;
    return { viewport, wmViewport, nebula };
  }

  componentWillMount() {
    this.nebula = new Nebula();
    this.nebula.init(this.props);
    this.nebula.forceUpdate = () => this.forceUpdate();
  }

  componentWillReceiveProps(props: Props) {
    this.nebula.updateProps(props);
  }

  nebula: Nebula;
  mainContainer: ?Object;

  updateAllDeckObjects() {
    this.nebula.updateAllDeckObjects();
  }

  updateDeckObjectsByIds(ids: string[]) {
    this.nebula.updateDeckObjectsByIds(ids);
  }

  render() {
    const { viewport, children } = this.props;
    const { width, height } = viewport;

    return (
      <div style={styles.canvasContainer} ref={div => (this.mainContainer = div)}>
        <DeckGL
          ref={deckgl => this.nebula.setDeck(deckgl)}
          width={width}
          height={height}
          viewports={[this.nebula.wmViewport]}
          layers={this.nebula.getRenderedLayers()}
        />
        {children}
      </div>
    );
  }
}
