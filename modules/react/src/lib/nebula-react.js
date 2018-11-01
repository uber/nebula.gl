// @flow
import React, { Component } from 'react';
import DeckGL from 'deck.gl';
import { NebulaCore } from 'nebula.gl';
import PropTypes from 'prop-types';

type Props = {
  layers: Object[],
  onSelection?: (selectedFeatures: Object[]) => void,
  selectionType?: number,
  onMapMouseEvent?: Function,
  viewport: Object,
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
    this.nebula = new NebulaCore();
    this.nebula.init(this.props);
    this.nebula.forceUpdate = () => this.forceUpdate();
  }

  componentWillReceiveProps(props: Props) {
    this.nebula.updateProps(props);
  }

  nebula: NebulaCore;
  deckReady: boolean;

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
          ref={deckgl => {
            if (this.deckReady) {
              this.nebula.setDeck(deckgl);
            }
          }}
          onLoad={() => (this.deckReady = true)}
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
