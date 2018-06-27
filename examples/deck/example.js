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
  // latitude: 70.13,
  // longitude: 23.04,
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
    background: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 10
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
      isEditing: true,
      selectedFeatureIndex: 5
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

  _onLayerClick = info => {
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
        <div>Loaded Features: {this.state.testFeatures.features.length}</div>
        <div>
          Selected Feature Index: {this.state.selectedFeatureIndex}{' '}
          <button onClick={() => this._decrementSelectedFeature()}>-</button>
          <button onClick={() => this._incrementSelectedFeature()}>+</button>
        </div>
        <div>
          <label>
            Allow edit:{' '}
            <input
              type="checkbox"
              checked={this.state.isEditing}
              onChange={() => this.setState({ isEditing: !this.state.isEditing })}
            />
          </label>
        </div>
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
      isEditing: this.state.isEditing,
      fp64: true,

      onStartDraggingPoint: ({ featureIndex, coordinateIndexes }) => {
        console.log(`Start dragging point`, featureIndex, coordinateIndexes); // eslint-disable-line
      },
      onDraggingPoint: ({ feature, featureIndex, coordinateIndexes }) => {
        // Immutably replace the feature being edited in the featureCollection
        this.setState({
          testFeatures: {
            ...this.state.testFeatures,
            features: [
              ...this.state.testFeatures.features.slice(0, featureIndex),
              feature,
              ...this.state.testFeatures.features.slice(featureIndex + 1)
            ]
          }
        });
      },
      onStopDraggingPoint: ({ featureIndex, coordinateIndexes }) => {
        console.log(`Stop dragging point`, featureIndex, coordinateIndexes); // eslint-disable-line
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
      getEditingPointColor: () => [0xff, 0x80, 0x00, 0xff]
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
