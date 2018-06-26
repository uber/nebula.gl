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
  latitude: 37.77,
  longitude: -122.48,
  pitch: 0,
  width: 0,
  zoom: 14
  // zoom: 6
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

    // TODO: once https://github.com/uber/deck.gl/pull/1918 lands, remove this filter since it'll work with MultiPolygons
    // const testPolygonsWithoutMultiPolygons = sampleGeoJson.features.filter(
    //   feature => feature.geometry.type === 'Polygon'
    // );

    this.state = {
      viewport: initialViewport,
      testFeatures: sampleGeoJson,
      // testFeatures: {
      //   type: 'FeatureCollection',
      //   features: testPolygonsWithoutMultiPolygons
      // },
      // selectedFeatureIndex: 0 // Point
      // selectedFeatureIndex: 1 // Point
      // selectedFeatureIndex: 2 // MultiPoint
      // selectedFeatureIndex: 3 // LineString
      // selectedFeatureIndex: 4 // MultiLineString
      // selectedFeatureIndex: 5 // Polygon
      selectedFeatureIndex: 6 // MultiPolygon
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

  _onLayerClick = info => {
    if (info) {
      console.log(`select editing feature ${info.index}`); // eslint-disable-line
      // a feature was clicked
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
      isEditing: true,

      onStartDraggingPoint: ({ coordinateIndexes }) => {
        // eslint-disable-next-line no-console, no-undef
        console.log(`Start dragging point`, coordinateIndexes);
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
      onStopDraggingPoint: ({ coordinateIndexes }) => {
        // eslint-disable-next-line no-console, no-undef
        console.log(`Stop dragging point`, coordinateIndexes);
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
            // onLayerClick={this._onLayerClick}
            onViewStateChange={({ viewState }) => this.setState({ viewport: viewState })}
          />
        </StaticMap>
      </div>
    );
  }
}
