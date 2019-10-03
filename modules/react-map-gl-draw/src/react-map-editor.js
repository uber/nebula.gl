// @flow

import { _MapContext as MapContext } from 'react-map-gl';
import React, { PureComponent } from 'react';
import Editor from './editor';

export default class ReactMapEditor extends PureComponent {
  render() {
    return (
      <MapContext.Consumer>
        {context => {
          const viewport = context && context.viewport;
          const eventManger = context && context.eventManager;

          if (!viewport || viewport.height <= 0 || viewport.width <= 0 || !eventManger) {
            return null;
          }

          return (
            <Editor
              viewport={viewport}
              eventManager={eventManger}
              {...this.props}
            />
          );
        }}
      </MapContext.Consumer>
    );
  }
}

ReactMapEditor.displayName = 'ReactMapEditor';
