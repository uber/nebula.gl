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
      selectedId: null
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
      this.setState({ selectedId: null });
    }
  };

  _updateViewport = viewport => {
    this.setState({ viewport });
  };

  _onSelect = selectedId => {
    this.setState({ selectedId });
  };

  _onDelete = () => {
    const { selectedId } = this.state;
    if (selectedId === null || selectedId === undefined) {
      return;
    }
    const selectedIndex = this.state.features.findIndex(f => f.id === selectedId);
    if (selectedIndex >= 0) {
      const newFeatures = [...this.state.features];
      newFeatures.splice(selectedIndex, 1);
      this.setState({ features: newFeatures, selectedId: null });
    }
  };

  _onUpdate = features => {
    this.setState({
      features
    });
  };

  _switchMode = evt => {
    this.setState({
      selectedMode: evt.target.id,
      selectedId: null
    });
  };

  _renderToolbar = () => {
    return <Toolbar selectedMode={this.state.selectedMode} onClick={this._switchMode} />;
  };

  render() {
    const { viewport, selectedMode, selectedId, features } = this.state;
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
          viewport={viewport}
          eventManager={this._mapRef && this._mapRef._eventManager}
          width="100%"
          height="100%"
          mode={selectedMode}
          features={features}
          selectedId={selectedId}
          onSelect={this._onSelect}
          onUpdate={this._onUpdate}
        />
        {this._renderToolbar()}
      </MapGL>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}
