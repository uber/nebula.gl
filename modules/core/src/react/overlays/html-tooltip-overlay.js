// @flow
import React from 'react';
import window from 'global/window';

import HtmlOverlay from './html-overlay';
import HtmlOverlayItem from './html-overlay-item';

type Props = {};

type State = {
  visible: boolean,
  pickingInfo: ?Object
};

const styles = {
  tooltip: {
    transform: 'translate(-50%,-100%)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '4px 8px',
    borderRadius: 8,
    color: 'white'
  }
};

const SHOW_TOOLTIP_TIMEOUT = 250;

export default class HtmlTooltipOverlay extends HtmlOverlay<Props> {
  constructor(props: Props) {
    super(props);
    this.state = { visible: false, pickingInfo: null };
  }

  componentWillMount() {
    this.context.nebula.queryObjectEvents.on('pick', ({ event, pickingInfo }) => {
      if (this.timeoutID !== null) {
        window.clearTimeout(this.timeoutID);
      }
      this.timeoutID = null;

      if (pickingInfo && this._getTooltip(pickingInfo)) {
        this.timeoutID = window.setTimeout(() => {
          this.setState({ visible: true, pickingInfo });
        }, SHOW_TOOLTIP_TIMEOUT);
      } else {
        this.setState({ visible: false });
      }
    });
  }

  timeoutID: ?TimeoutID = null;
  state: State;

  _getTooltip(pickingInfo: Object): string {
    return pickingInfo.object.style.tooltip;
  }

  _makeOverlay() {
    const { pickingInfo } = this.state;

    if (pickingInfo) {
      return (
        <HtmlOverlayItem key={0} coordinates={pickingInfo.lngLat} style={styles.tooltip}>
          {this._getTooltip(pickingInfo)}
        </HtmlOverlayItem>
      );
    }

    return null;
  }

  getItems(): Array<?Object> {
    if (this.state.visible) {
      return [this._makeOverlay()];
    }

    return [];
  }
}
