// @flow
import window from 'global/window';
import React, { Component } from 'react';
import DeckGL, { WebMercatorViewport } from 'deck.gl';
import MapGL from 'react-map-gl';

import { EditableJunctionsLayer, Feature, NebulaCore } from 'nebula.gl';

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 40.78,
  longitude: -73.97,
  pitch: 0,
  width: 0,
  zoom: 14
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
      viewport: initialViewport
    };

    this.testJunctions = [
      { id: 1, position: [-73.978, 40.781] },
      { id: 2, position: [-73.972, 40.789] }
    ];
    this.editableJunctionsLayer = new EditableJunctionsLayer({
      getData: () => this.testJunctions,
      toNebulaFeature: data => this._toNebulaFeatureJunc(data),
      on: {
        editEnd: (event, info) => {
          const original = this.testJunctions.find(j => j.id === info.id);
          if (original) {
            original.position = info.feature.geoJson.geometry.coordinates;
          }
        }
      }
    });

    this.nebulaCore = new NebulaCore();
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  editableJunctionsLayer: EditableJunctionsLayer;

  _onChangeViewport = (viewport: Object) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  _resize = () => {
    this.forceUpdate();
  };

  _toNebulaFeatureJunc(junc: Object) {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: junc.position
      },
      properties: null
    };
    const style = {
      pointRadiusMeters: 20,
      outlineRadiusMeters: 20,
      fillColor: [1, 0, 0, 1],
      outlineColor: [0, 0, 1, 1]
    };
    return new Feature(geojson, style);
  }

  render() {
    const { editableJunctionsLayer, state } = this;
    let { viewport } = state;

    const { innerHeight: height, innerWidth: width } = window;
    viewport = Object.assign(viewport, { height, width });

    const wmViewport = new WebMercatorViewport(viewport);

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <MapGL {...viewport} onChangeViewport={this._onChangeViewport}>
          <DeckGL
            ref={deckgl => this.nebulaCore.setDeck(deckgl)}
            layers={this.nebulaCore.updateAndGetRenderedLayers(
              [editableJunctionsLayer],
              viewport,
              this
            )}
            viewports={[wmViewport]}
          />
        </MapGL>
      </div>
    );
  }
}
