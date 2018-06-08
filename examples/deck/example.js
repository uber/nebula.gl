// @flow
import window from 'global/window';
import React, { Component } from 'react';
import DeckGL, { WebMercatorViewport } from 'deck.gl';
import MapGL from 'react-map-gl';

import { EditablePolygonsLayer } from 'nebula.gl';

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 70,
  longitude: 25,
  pitch: 0,
  width: 0,
  zoom: 6
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
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [
              [
                [20.5659, 69.4614],
                [22.7197, 70.088],
                [21.7199, 70.1851],
                [21.9616, 70.8049],
                [25.0378, 70.776],
                [25.4113, 70.1478],
                [24.3237, 70.0505],
                [25.7429, 69.7336],
                [25.9716, 70.0018],
                [26.9604, 69.7485],
                [26.9384, 69.2561],
                [25.3125, 69.2288],
                [24.1249, 69.4766],
                [20.5659, 69.4614]
              ],
              [[22.8295, 70.6053], [23.4887, 70.3372], [24.1699, 70.6672], [22.8295, 70.6053]]
            ],
            [[[20.4125, 69.5306], [21.4013, 70.144], [22.2912, 70.058], [20.4125, 69.5306]]]
          ]
        }
      }
    };

    this.editablePolygonsLayer = new EditablePolygonsLayer({
      data: this.state.testFeature,
      onEditing: feature => this.setState({ testFeature: feature })
    });
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

  // _toNebulaFeatureJunc(junc: Object) {
  //   const geojson = {
  //     type: 'Feature',
  //     geometry: {
  //       type: 'Point',
  //       coordinates: junc.position
  //     },
  //     properties: null
  //   };
  //   const style = {
  //     pointRadiusMeters: 20,
  //     outlineRadiusMeters: 20,
  //     fillColor: [1, 0, 0, 1],
  //     outlineColor: [0, 0, 1, 1]
  //   };
  //   return new Feature(geojson, style);
  // }

  render() {
    const { state } = this;
    let { viewport } = state;

    const { innerHeight: height, innerWidth: width } = window;
    viewport = Object.assign(viewport, { height, width });

    const wmViewport = new WebMercatorViewport(viewport);

    const editablePolygonsLayer = new EditablePolygonsLayer({
      data: this.state.testFeature,
      onEditing: ({ feature }) => this.setState({ testFeature: feature })
    });

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <MapGL {...viewport} onChangeViewport={this._onChangeViewport}>
          <DeckGL layers={[editablePolygonsLayer]} viewports={[wmViewport]} />
        </MapGL>
      </div>
    );
  }
}
