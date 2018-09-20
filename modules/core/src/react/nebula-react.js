// @flow
import React, { Component } from 'react';
import DeckGL from 'deck.gl';
import PropTypes from 'prop-types';

import type { Viewport } from '../types';
import Nebula from '../lib/nebula';

type Props = {
  layers: Object[],
  onSelection?: (selectedFeatures: Object[]) => void,
  selectionType?: number,
  onMapMouseEvent?: Function,
  viewport: Viewport,
  eventFilter?: Function,
  logger?: Object,
  children?: any,
  extraDeckProps?: Object
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
    const {
      props: { viewport },
      wmViewport
    } = nebula;
    return { viewport, wmViewport, nebula };
  }

  componentWillMount() {
    this.nebula = new Nebula();
    this.nebula.init(this.props);
    this.nebula.forceUpdate = () => this.forceUpdate();
  }

  componentDidMount() {
    const { deckgl } = this.nebula;
    if (deckgl) {
      deckgl.deck.animationLoop._startPromise.then(() => {
        deckgl.deck.animationLoop.stop();
      });
    }
  }

  componentWillReceiveProps(props: Props) {
    this.nebula.updateProps(props);
  }

  componentDidUpdate() {
    if (!this.nebula.deckgl) return;
    const { deck } = this.nebula.deckgl;

    if (!deck.animationLoop.gl) {
      // the GL context isn't ready.
      return;
    }

    // We hijack the animationLoop so that DeckGL rendering will
    // be in-sync with the React and Mapbox render cycle.
    deck.animationLoop._setupFrame();
    deck.animationLoop._updateCallbackData();
    deck._needsRedraw = true;
    deck._onRenderFrame({
      gl: deck.animationLoop.gl,
      canvas: deck.animationLoop.gl.canvas
    });
  }

  nebula: Nebula;

  updateAllDeckObjects() {
    this.nebula.updateAllDeckObjects();
  }

  updateDeckObjectsByIds(ids: string[]) {
    this.nebula.updateDeckObjectsByIds(ids);
  }

  render() {
    const { viewport, children, extraDeckProps } = this.props;
    const { width, height } = viewport;

    const style =
      extraDeckProps && extraDeckProps.controller
        ? { ...styles.canvasContainer, pointerEvents: 'all' }
        : styles.canvasContainer;

    return (
      <div style={style} ref={div => this.nebula.setMainContainer(div)}>
        <DeckGL
          ref={deckgl => this.nebula.setDeck(deckgl)}
          width={width}
          height={height}
          viewState={viewport}
          layers={this.nebula.getRenderedLayers()}
          {...extraDeckProps}
        />
        {children}
      </div>
    );
  }
}
