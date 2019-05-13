/* global window */
import React, { Component } from 'react';
import { render } from 'react-dom';
import MapGL from 'react-map-gl';
import { Editor, EditorModes } from 'react-map-gl-draw';
import {
  ToolboxRow,
  ToolboxRowWrapping,
  ToolboxLabel,
  ToolboxDivider,
  ToolboxButton,
  styles as ToolboxStyles
} from './toolbox';

const MODES = [
  { name: 'Read Only', value: EditorModes.READ_ONLY },
  { name: 'Select Feature', value: EditorModes.SELECT_FEATURE },
  { name: 'Edit Vertex', value: EditorModes.EDIT_VERTEX },
  { name: 'Draw Point', value: EditorModes.DRAW_POINT },
  { name: 'Draw Path', value: EditorModes.DRAW_PATH },
  { name: 'Draw Polygon', value: EditorModes.DRAW_POLYGON },
  { name: 'Draw Rectangle', value: EditorModes.DRAW_RECTANGLE }
];

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
      mode: EditorModes.READ_ONLY,
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

  _renderToolbox = () => {
    const drawModes = MODES.filter(mode => mode.value.startsWith('DRAW'));
    const otherModes = MODES.filter(mode => !mode.value.startsWith('DRAW'));
    return (
      <div style={ToolboxStyles.toolbox}>
        <ToolboxRowWrapping>
          <ToolboxLabel style={{ paddingLeft: '2px' }}>Modes</ToolboxLabel>
          <ToolboxRow>
            {otherModes.map(mode => (
              <ToolboxButton
                id={mode.value}
                key={mode.value}
                style={{
                  backgroundColor: this.state.mode === mode.value ? '#a0cde8' : ''
                }}
                onClick={this._switchMode}
              >
                {mode.name}
              </ToolboxButton>
            ))}
          </ToolboxRow>
          <ToolboxRow>
            {drawModes.map(mode => (
              <ToolboxButton
                id={mode.value}
                key={mode.value}
                style={{
                  backgroundColor: this.state.mode === mode.value ? '#a0cde8' : ''
                }}
                onClick={this._switchMode}
              >
                {mode.name}
              </ToolboxButton>
            ))}
          </ToolboxRow>
        </ToolboxRowWrapping>
        <ToolboxDivider />
        <ToolboxRowWrapping>
          <ToolboxRow>
            <ToolboxButton onClick={this._onDelete}>Delete</ToolboxButton>
          </ToolboxRow>
        </ToolboxRowWrapping>
      </div>
    );
  };

  _switchMode = evt => {
    const mode = evt.target.id;
    this.setState({
      mode,
      selectedId: null
    });
  };

  render() {
    const { viewport, mode, selectedId, features } = this.state;
    return (
      <MapGL
        {...viewport}
        ref={_ => (this._mapRef = _)}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/light-v9"
        onViewportChange={this._updateViewport}
      >
        <Editor
          viewport={viewport}
          eventManager={this._mapRef && this._mapRef._eventManager}
          width="100%"
          height="100%"
          mode={mode}
          features={features}
          selectedId={selectedId}
          onSelect={this._onSelect}
          onUpdate={this._onUpdate}
        />
        {this._renderToolbox()}
      </MapGL>
    );
  }
}

export function renderToDom(container) {
  render(<App />, container);
}
