/* global window */
import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import { Editor, EditorModes } from 'react-map-gl-draw';

import Toolbar from './toolbar';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 800,
        height: 600,
        longitude: -122.45,
        latitude: 37.78,
        zoom: 14
      },
      selectedMode: EditorModes.READ_ONLY,
      features: [],
      selectedFeatureId: null
    };
    this._mapRef = null;
  }

  componentDidMount() {
    window.addEventListener('keydown', this._onKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._onKeydown);
  }

  _onKeydown = evt => {
    if (evt.keyCode === 27) {
      // esc key
      this.setState({ selectedFeatureId: null });
    }
  };

  _updateViewport = viewport => {
    this.setState({ viewport });
  };

  _onSelect = ({ selectedFeatureId }) => {
    this.setState({ selectedFeatureId });
  };

  _onDelete = () => {
    const { selectedFeatureId } = this.state;
    if (selectedFeatureId === null || selectedFeatureId === undefined) {
      return;
    }

    const selectedIndex = this.state.features.findIndex(f => f.id === selectedFeatureId);
    if (selectedIndex >= 0) {
      const newFeatures = [...this.state.features];
      newFeatures.splice(selectedIndex, 1);
      this.setState({ features: newFeatures, selectedFeatureId: null });
    }
  };

  _onUpdate = features => {
    this.setState({
      features
    });
  };

  _switchMode = evt => {
    let selectedMode = evt.target.id;
    if (selectedMode === this.state.selectedMode) {
      selectedMode = null;
    }

    this.setState({
      selectedMode,
      selectedFeatureId: null
    });
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

  _getEditHandleShape = ({ feature }) => {
    return feature.properties.renderType === 'Point' ? 'circle' : 'rect';
  };

  render() {
    const { viewport, selectedMode, selectedFeatureId, features } = this.state;
    return (
      <MapGL
        {...viewport}
        ref={_ => (this._mapRef = _)}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/uberdata/cive48w2e001a2imn5mcu2vrs"
        onViewportChange={this._updateViewport}
      >
        <Editor
          clickRadius={12}
          mode={selectedMode}
          features={features}
          selectedFeatureId={selectedFeatureId}
          onSelect={this._onSelect}
          onUpdate={this._onUpdate}
          getEditHandleShape={this._getEditHandleShape}
        />
        {this._renderToolbar()}
      </MapGL>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}
