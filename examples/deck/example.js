// @flow

import window from 'global/window';
import React, { Component } from 'react';
import DeckGL, { MapController } from 'deck.gl';
import { StaticMap } from 'react-map-gl';

import { EditableGeoJsonLayer } from 'nebula.gl';

import sampleGeoJson from '../data/sample-geojson.json';

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 37.76,
  longitude: -122.44,
  pitch: 0,
  width: 0,
  zoom: 11
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
      testFeatures: sampleGeoJson,
      mode: 'drawLineString',
      pointsRemovable: true,
      selectedFeatureIndex: null
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _onChangeViewport = (viewport: Object) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  _incrementSelectedFeature() {
    if (this.state.selectedFeatureIndex === null) {
      this.setState({ selectedFeatureIndex: 0 });
    } else {
      this.setState({
        selectedFeatureIndex:
          (this.state.selectedFeatureIndex + 1) % this.state.testFeatures.features.length
      });
    }
  }

  _decrementSelectedFeature() {
    if (this.state.selectedFeatureIndex === null) {
      this.setState({ selectedFeatureIndex: 0 });
    } else {
      this.setState({
        selectedFeatureIndex:
          (this.state.selectedFeatureIndex + this.state.testFeatures.features.length - 1) %
          this.state.testFeatures.features.length
      });
    }
  }

  _deselectFeature() {
    this.setState({ selectedFeatureIndex: null });
  }

  _onLayerClick = info => {
    console.log('onLayerClick', info); // eslint-disable-line

    if (this.state.mode !== 'view') {
      // don't change selection while editing
      return;
    }

    if (info) {
      console.log(`select editing feature ${info.index}`); // eslint-disable-line
      // a feature was clicked
      // TODO: once https://github.com/uber/deck.gl/pull/1918 lands, this will work since it'll work with Multi* geometry types
      this.setState({ selectedFeatureIndex: info.index });
    } else {
      console.log('deselect editing feature'); // eslint-disable-line
      // open space was clicked, so stop editing
      this.setState({ selectedFeatureIndex: null });
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
            </select>
          </dd>
          <dt style={styles.toolboxTerm}>Allow removing points</dt>
          <dd style={styles.toolboxDescription}>
            <input
              type="checkbox"
              checked={this.state.pointsRemovable}
              onChange={() => this.setState({ pointsRemovable: !this.state.pointsRemovable })}
            />
          </dd>
          <dt style={styles.toolboxTerm}>Selected feature index</dt>
          <dd style={styles.toolboxDescription}>
            {this.state.selectedFeatureIndex}{' '}
            <span style={{ float: 'right' }}>
              <button
                onClick={() => this._decrementSelectedFeature()}
                title="Select previous feature"
              >
                -
              </button>
              <button
                onClick={() => this._incrementSelectedFeature()}
                title="Select previous feature"
              >
                +
              </button>
              <button onClick={() => this._deselectFeature()} title="Deselect feature">
                Deselect
              </button>
            </span>
          </dd>
          <dt style={styles.toolboxTerm}>Selected feature type</dt>
          <dd style={styles.toolboxDescription}>
            {this.state.selectedFeatureIndex !== null
              ? this.state.testFeatures.features[this.state.selectedFeatureIndex].geometry.type
              : ''}
          </dd>
          <dt style={styles.toolboxTerm}>Feature count</dt>
          <dd style={styles.toolboxDescription}>{this.state.testFeatures.features.length}</dd>
        </dl>
      </div>
    );
  }

  render() {
    const { testFeatures, selectedFeatureIndex } = this.state;

    const viewport = {
      ...this.state.viewport,
      height: window.innerHeight,
      width: window.innerWidth
    };

    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      data: testFeatures,
      selectedFeatureIndex,
      mode: this.state.mode,
      fp64: true,
      autoHighlight: true,

      // Editing callbacks
      onEdit: ({
        updatedData,
        updatedMode,
        updatedSelectedFeatureIndex,
        editType,
        featureIndex,
        positionIndexes,
        position
      }) => {
        if (editType !== 'movePosition') {
          // Don't log moves since they're really chatty
          // eslint-disable-next-line
          console.log(
            'onEdit',
            editType,
            updatedMode,
            updatedSelectedFeatureIndex,
            featureIndex,
            positionIndexes,
            position
          );
        }
        if (editType === 'removePosition' && !this.state.pointsRemovable) {
          // reject the edit
          return;
        }
        this.setState({
          testFeatures: updatedData,
          mode: updatedMode,
          selectedFeatureIndex: updatedSelectedFeatureIndex
        });
      },

      // Specify the same GeoJsonLayer props
      lineWidthMinPixels: 2,

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
        <StaticMap {...viewport}>
          <DeckGL
            {...viewport}
            layers={[editableGeoJsonLayer]}
            controller={MapController}
            onLayerClick={this._onLayerClick}
            onViewStateChange={({ viewState }) => this.setState({ viewport: viewState })}
          />
        </StaticMap>
        {this._renderToolBox()}
      </div>
    );
  }
}
