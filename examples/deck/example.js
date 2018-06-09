// @flow
import window from 'global/window';
import React, { Component } from 'react';
import DeckGL, { MapController } from 'deck.gl';
import { StaticMap } from 'react-map-gl';

import { EditablePolygonsLayer } from 'nebula.gl';

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 37.75,
  longitude: -122.4,
  pitch: 0,
  width: 0,
  zoom: 10
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
      testFeature: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [-122.518844, 37.788081],
                [-122.487602, 37.793778],
                [-122.479362, 37.812225],
                [-122.405891, 37.816564],
                [-122.378768, 37.796763],
                [-122.350616, 37.722121],
                [-122.381858, 37.696046],
                [-122.504768, 37.685722],
                [-122.518844, 37.788081]
              ],
              [
                [-122.4816947, 37.7351084],
                [-122.4665643, 37.7132991],
                [-122.4450611, 37.7237229],
                [-122.4391468, 37.7420784],
                [-122.4816947, 37.7351084]
              ]
            ],
            [
              [
                [-122.383918, 37.831208],
                [-122.367095, 37.837716],
                [-122.355766, 37.806801],
                [-122.373275, 37.804087],
                [-122.383918, 37.831208]
              ]
            ]
          ]
        }
      }
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

  _resize = () => {
    this.forceUpdate();
  };

  render() {
    const { testFeature } = this.state;

    const viewport = {
      ...this.state.viewport,
      height: window.innerHeight,
      width: window.innerWidth
    };

    const editablePolygonsLayer = new EditablePolygonsLayer({
      data: testFeature,
      onStartDraggingPoint: ({ coordinateIndexes }) => {
        // eslint-disable-next-line no-console, no-undef
        console.log(`Start dragging point`, coordinateIndexes);
      },
      onDraggingPoint: ({ feature, coordinateIndexes }) => this.setState({ testFeature: feature }),
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
      getPointColor: () => [0x00, 0x20, 0x70, 0xff],
      pointHighlightColor: [0xff, 0xff, 0xff, 0xff]
    });

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <StaticMap {...viewport}>
          <DeckGL
            {...viewport}
            layers={[editablePolygonsLayer]}
            controller={MapController}
            onViewStateChange={({ viewState }) => this.setState({ viewport: viewState })}
          />
        </StaticMap>
      </div>
    );
  }
}
