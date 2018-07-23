// @flow

import window from 'global/window';
import React, { Component } from 'react';
import DeckGL, { MapView, MapController } from 'deck.gl';
import { StaticMap } from 'react-map-gl';

import { EditableGeoJsonLayer } from 'nebula.gl';

const geoJsonURL =
  'https://raw.githubusercontent.com/matthrice/deck.gl-data/master/examples/geojson/austin-geojson.json';

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 30.2687,
  longitude: -97.774,
  pitch: 0,
  width: 0,
  zoom: 15
};

const styles = {
  toolbox: {
    position: 'absolute',
    top: 12,
    left: 12,
    background: 'white',
    padding: 10,
    borderRadius: 4,
    border: '1px solid gray',
    width: 350,
    fontFamily: 'Arial, Helvetica, sans-serif'
  },
  toolboxList: {
    margin: 0,
    display: 'flex',
    flexWrap: 'wrap'
  },
  toolboxTerm: {
    flex: '0 0 60%',
    marginBottom: 7
  },
  toolboxDescription: {
    margin: 0,
    flex: '0 0 40%'
  },
  mapContainer: {
    alignItems: 'stretch',
    display: 'flex',
    height: '100vh'
  }
};

export default class Example extends Component<
  {},
  {
    viewport: Object
  }
> {
  constructor() {
    super();
    this.state = {
      viewport: initialViewport,
      testFeatures: {
        type: 'FeatureCollection',
        features: []
      },
      mode: 'view',
      pointsRemovable: true,
      selectedFeatureIndexes: []
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);

    window.fetch(geoJsonURL).then(response => {
      response.text().then(json => {
        const testFeatures = JSON.parse(json);
        this.setState({ testFeatures });
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _onChangeViewport = (viewport: Object) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  _onLayerClick = info => {
    if (this.state.mode !== 'view') {
      // don't change selection while editing
      return;
    }

    if (info) {
      console.log(`select editing feature ${info.index}`); // eslint-disable-line
      // a feature was clicked
      // TODO: once https://github.com/uber/deck.gl/pull/1918 lands, this will work since it'll work with Multi* geometry types
      this.setState({
        selectedFeatureIndexes: this.state.selectedFeatureIndexes.concat([info.index])
      });
    } else {
      console.log('deselect editing feature'); // eslint-disable-line
      // open space was clicked, so stop editing
      this.setState({ selectedFeatureIndexes: [] });
    }
  };

  _resize = () => {
    this.forceUpdate();
  };

  _renderToolBox() {
    return (
      <div style={styles.toolbox}>
        <dl style={styles.toolboxList}>
          <dt style={styles.toolboxTerm}>Mode</dt>
          <dd style={styles.toolboxDescription}>
            <select
              value={this.state.mode}
              onChange={event => this.setState({ mode: event.target.value })}
            >
              <option value="view">view</option>
              <option value="modify">modify</option>
              <option value="drawLineString">drawLineString</option>
              <option value="drawPolygon">drawPolygon</option>
            </select>
          </dd>
          <dt style={styles.toolboxTerm}>Selected feature indexes</dt>
          <dd style={styles.toolboxDescription}>
            <input
              type="text"
              onChange={event => {
                const indexes = event.target.value.split('');
                this.setState({
                  selectedFeatureIndexes: indexes.map(num => Number.parseInt(num, 10))
                });
              }}
            />
          </dd>
          <dt style={styles.toolboxTerm}>Feature count</dt>
          <dd style={styles.toolboxDescription}>{this.state.testFeatures.features.length}</dd>
        </dl>
      </div>
    );
  }

  render() {
    const { testFeatures, selectedFeatureIndexes } = this.state;

    const viewport = {
      ...this.state.viewport,
      height: window.innerHeight,
      width: window.innerWidth
    };

    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      data: testFeatures,
      selectedFeatureIndexes,
      mode: this.state.mode,
      fp64: true,
      autoHighlight: true,

      // Editing callbacks
      onEdit: ({
        updatedData,
        updatedMode,
        updatedSelectedFeatureIndexes,
        editType,
        featureIndex,
        positionIndexes,
        position
      }) => {
        if (editType === 'removePosition' && !this.state.pointsRemovable) {
          // reject the edit
          return;
        }
        this.setState({
          testFeatures: updatedData,
          mode: updatedMode,
          selectedFeatureIndexes: updatedSelectedFeatureIndexes
        });
      },

      // Specify the same GeoJsonLayer props
      lineWidthScale: 10,
      pointRadiusScale: 10,

      // Accessors receive an isSelected argument
      getFillColor: (feature, isSelected) => {
        return isSelected ? [0x20, 0x40, 0x90, 0xc0] : [0x20, 0x20, 0x20, 0x30];
      },
      getLineColor: (feature, isSelected) => {
        return isSelected ? [0x00, 0x20, 0x90, 0xff] : [0x20, 0x20, 0x20, 0xff];
      },

      // Can customize editing points props
      getEditHandlePointColor: handle =>
        handle.type === 'existing' ? [0xff, 0x80, 0x00, 0xff] : [0x0, 0x0, 0x0, 0x80]
    });

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <DeckGL
          {...viewport}
          layers={[editableGeoJsonLayer]}
          views={new MapView({ id: 'basemap', controller: MapController })}
          onLayerClick={this._onLayerClick}
          onViewStateChange={({ viewState }) => this.setState({ viewport: viewState })}
        >
          <StaticMap {...viewport} />
        </DeckGL>
        {this._renderToolBox()}
      </div>
    );
  }
}
