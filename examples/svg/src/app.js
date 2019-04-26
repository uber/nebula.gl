/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import {SVGEditing, SVGEditingModes} from 'nebula.gl';

const MODES = [
  {name: 'Read Only', value: SVGEditingModes.READ_ONLY},
  {name: 'Select Feature', value: SVGEditingModes.SELECT_FEATURE},
  {name: 'Edit Vertex', value: SVGEditingModes.EDIT_VERTEX},
  {name: 'Draw Point', value: SVGEditingModes.DRAW_POINT},
  {name: 'Draw Path', value: SVGEditingModes.DRAW_PATH},
  {name: 'Draw Polygon', value: SVGEditingModes.DRAW_POLYGON}
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
      mode: SVGEditingModes.READ_ONLY,
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

  _onKeydown = (evt) => {
    if (evt.keyCode === 27) {
      // esc key
      this.setState({selectedId: null});
    }
  };

  _updateViewport = (viewport) => {
    this.setState({viewport});
  };

  _onSelect = (selectedId) => {
    this.setState({selectedId});
  };

  _onDelete = () => {
    const {selectedId} = this.state;
    if (selectedId === null || selectedId === undefined) {
      return;
    }
    const selectedIndex = this.state.features.findIndex(f => f.properties.id === selectedId);
    if (selectedIndex >= 0) {
      const newFeatures = [...this.state.features];
      newFeatures.splice(selectedIndex, 1);
      this.setState({features: newFeatures, selectedId: null});
    }
  };

  _onUpdate = (features) => {
    this.setState({
      features
    });
  };

  _renderControlPanel = () => {
    return (
      <div style={{position: 'absolute', top: 0, right: 0, maxWidth: '320px'}}>
        <select defaultValue={this.state.mode} onChange={this._switchMode}>
          {MODES.map((mode, i) => <option key={i} value={mode.value}>{mode.name}</option>)}
        </select>
        <button style={{marginLeft: 6}} onClick={this._onDelete}>delete</button>
      </div>
    );
  };

  _switchMode = (evt) => {
    const mode = evt.target.value;
    this.setState({
      mode,
      selectedId: null
    });
  };

  render() {
    const {viewport, mode, selectedId, features} = this.state;
    return (
      <MapGL
        {...viewport}
        ref={_ => this._mapRef = _}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._updateViewport}>
        <SVGEditing
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
        {this._renderControlPanel()}
      </MapGL>
    );
  }
}

export function renderToDom(container) {
  render(<App/>, container);
}
