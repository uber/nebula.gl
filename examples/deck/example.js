// @flow
/* eslint-disable no-inline-comments */

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

  _onLayerClick = info => {
    if (info) {
      console.log(`select editing feature ${info.index}`); // eslint-disable-line
      // a feature was clicked
      // TODO: once https://github.com/uber/deck.gl/pull/1918 lands, this will work since it'll work with Multi* geometry types
      // this.setState({ selectedFeatureIndex: info.index });
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
      pickable: true,
      isEditing: this.state.isEditing,

      onStartDraggingPoint: ({ featureIndex, coordinateIndexes }) => {
        // eslint-disable-next-line no-console, no-undef
        console.log(`Start dragging point`, featureIndex, coordinateIndexes);
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
        // eslint-disable-next-line no-console, no-undef
        console.log(`Stop dragging point`, featureIndex, coordinateIndexes);
      },

      // Can specify GeoJsonLayer props
      getFillColor: () => [0x00, 0x20, 0x70, 0x30],
      getLineColor: () => [0x00, 0x20, 0x70, 0xc0],
      getLineWidth: () => 30,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 10,

      // As well as point layer props
      pointRadiusMinPixels: 10,
      getPointColor: () => [0x00, 0x20, 0x70, 0xff],
      pointHighlightColor: [0xff, 0xff, 0xff, 0xff]
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
