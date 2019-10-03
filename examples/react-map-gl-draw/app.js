import DeckGL from '@deck.gl/react';
import MapGL, {StaticMap} from 'react-map-gl';
import React, {Component} from 'react';
import Toolbar from './toolbar';
import {ReactMapEditor, Editor, EditorModes} from 'react-map-gl-draw';
import {render} from 'react-dom';
import {ScatterplotLayer} from '@deck.gl/layers';

// eslint-disable-next-line no-process-env, no-undef
const MAP_STYLE = process.env.MapStyle || 'mapbox://styles/mapbox/light-v9';
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-lint
const MALE_COLOR = [0, 128, 255];
const FEMALE_COLOR = [255, 0, 128];
const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/scatterplot/manhattan.json'; // eslint-disable-line

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.7,
  zoom: 11,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // map
      viewport: INITIAL_VIEW_STATE,
      // editor
      selectedMode: EditorModes.READ_ONLY,
      features: [],
      selectedFeatureIndex: null
    };
    this._editorRef = null;
    this._deckRef = null;
  }

  _onDelete = () => {
    const {selectedFeatureIndex} = this.state;
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

    this.setState({selectedMode});
  };

  _updateViewport = viewport => {
    this.setState({viewport});
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

  _renderLayers() {
    const {
      data = DATA_URL,
      radius = 30,
      maleColor = MALE_COLOR,
      femaleColor = FEMALE_COLOR
    } = this.props;

    return [
      new ScatterplotLayer({
        id: 'scatter-plot',
        data,
        radiusScale: radius,
        radiusMinPixels: 0.25,
        getPosition: d => [d[0], d[1], 0],
        getFillColor: d => (d[2] === 1 ? maleColor : femaleColor),
        getRadius: 1,
        updateTriggers: {
          getFillColor: [maleColor, femaleColor]
        }
      })
    ];
  }

  render() {
    const {viewport, selectedMode} = this.state;
    return (
      <DeckGL
        ref={_ => this._deckRef = _}
        layers={this._renderLayers()}
        initialViewState={viewport}
        onViewStateChange={this._updateViewport}
        controller={true}
      >
        {this._deckRef && <Editor
          viewport={this._deckRef.viewports[0]}
          eventManager={this._deckRef.deck.eventManager}
          ref={_ => this._editorRef = _}
          clickRadius={12}
          mode={'DRAW_POLYGON'}
        />
        }
        <StaticMap
          reuseMaps
          mapStyle={MAP_STYLE}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </DeckGL>
    );
  }
}

export function renderToDom(container) {
  render(<App/>, container);
}
