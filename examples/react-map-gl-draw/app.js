import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import {
  Editor,
  SelectMode,
  EditingMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawRectangleMode,
  DrawRectangleOneclickMode,
  DrawPolygonMode,
} from 'react-map-gl-draw';
import { MODES } from './constants';
import Toolbar from './toolbar';

const MODE_TO_HANDLER = {
  [MODES.READ_ONLY]: null,
  [MODES.SELECT]: SelectMode,
  [MODES.EDITING]: EditingMode,
  [MODES.DRAW_POINT]: DrawPointMode,
  [MODES.DRAW_PATH]: DrawLineStringMode,
  [MODES.DRAW_RECTANGLE]: DrawRectangleMode,
  [MODES.DRAW_RECTANGLE_ONE_CLICK]: DrawRectangleOneclickMode,
  [MODES.DRAW_POLYGON]: DrawPolygonMode,
};

// eslint-disable-next-line no-process-env, no-undef
const MAP_STYLE = process.env.MapStyle || 'mapbox://styles/mapbox/light-v9';

const DEFAULT_VIEWPORT = {
  width: 800,
  height: 600,
  longitude: -122.45,
  latitude: 37.78,
  zoom: 14,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // map
      viewport: DEFAULT_VIEWPORT,
      // editor
      selectedMode: null,
      selectedFeatureIndex: null,
    };
    this._editorRef = null;
  }

  _onDelete = () => {
    const { selectedFeatureIndex } = this.state;
    if (selectedFeatureIndex === null || selectedFeatureIndex === undefined) {
      return;
    }

    this._editorRef.deleteFeatures(selectedFeatureIndex);
  };

  _switchMode = (evt) => {
    let selectedMode = evt.target.id;
    if (selectedMode === this.state.selectedMode) {
      selectedMode = null;
    }

    const HandlerClass = MODE_TO_HANDLER[selectedMode];
    const modeHandler = HandlerClass ? new HandlerClass() : null;
    this.setState({ selectedMode, modeHandler });
  };

  _updateViewport = (viewport) => {
    this.setState({ viewport });
  };

  _renderToolbar = () => {
    return (
      <Toolbar
        selectedMode={this.state.selectedMode}
        onSwitchMode={this._switchMode}
        onDelete={this._onDelete}
      />
    );
  };

  render() {
    const { viewport, modeHandler } = this.state;
    return (
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={MAP_STYLE}
        onViewportChange={this._updateViewport}
      >
        <Editor
          ref={(_) => (this._editorRef = _)}
          clickRadius={12}
          onSelect={(selected) => {
            this.setState({ selectedFeatureIndex: selected && selected.selectedFeatureIndex });
          }}
          mode={modeHandler}
        />
        {this._renderToolbar()}
      </MapGL>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}
