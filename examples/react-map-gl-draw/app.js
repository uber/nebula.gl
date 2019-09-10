import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import { Editor, EditorModes } from 'react-map-gl-draw';

import Toolbar from './toolbar';

// eslint-disable-next-line no-process-env, no-undef
const MAP_STYLE = process.env.MapStyle || 'mapbox://styles/mapbox/light-v9';

const DEFAULT_VIEWPORT = {
  width: 800,
  height: 600,
  longitude: -122.45,
  latitude: 37.78,
  zoom: 14
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // map
      viewport: DEFAULT_VIEWPORT,
      // editor
      selectedMode: EditorModes.READ_ONLY,
      features: [],
      selectedFeatureIndex: null
    };
    this._mapRef = null;
    this._editorRef = null;
  }

  _onDelete = () => {
    const { selectedFeatureIndex } = this.state;
    if (selectedFeatureIndex === null || selectedFeatureIndex === undefined) {
      return;
    }

    this._editorRef.deleteFeatures(selectedFeatureIndex);
  };

  _switchMode = evt => {
    let selectedMode = evt.target.id;
    if (selectedMode === this.state.selectedMode) {
      selectedMode = null;
    }

    this.setState({ selectedMode });
  };

  _updateViewport = viewport => {
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
    const { viewport, selectedMode } = this.state;
    return (
      <MapGL
        {...viewport}
        ref={_ => (this._mapRef = _)}
        width="100%"
        height="100%"
        mapStyle={MAP_STYLE}
        onViewportChange={this._updateViewport}
      >
        <Editor
          ref={_ => (this._editorRef = _)}
          clickRadius={12}
          onSelect={selected => {
            this.setState({ selectedFeatureIndex: selected && selected.selectedFeatureIndex });
          }}
          mode={selectedMode}
        />
        {this._renderToolbar()}
      </MapGL>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}
