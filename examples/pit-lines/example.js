// @flow
import window from 'global/window';
import React, { Component } from 'react';
import MapGL from 'react-map-gl';

import { Nebula, Feature, EditableLinesLayer, HtmlTooltipOverlay } from 'nebula.gl';

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 40.44043,
  longitude: -79.99304294586182,
  pitch: 0,
  width: 0,
  zoom: 17
};

const styles = {
  mapContainer: {
    alignItems: 'stretch',
    display: 'flex',
    height: '100vh'
  }
};

export default class Example extends Component<
  {},
  {
    viewport: Object,
    allowEdit: boolean,
    selectionType?: number
  }
> {
  constructor() {
    super();

    this.state = {
      viewport: initialViewport,
      allowEdit: true
    };

    this.testPolylines = [];
    this.linesLayer = new EditableLinesLayer({
      getData: () => this.testPolylines,
      toNebulaFeature: data => {
        const style = {
          outlineColor: [0, 0, 0, 0.8],
          fillColor: data.edited ? [1, 0, 0, 0.5] : [0, 0, 1, 0.5],
          lineWidthMeters: 2
        };
        return new Feature(data.geoJson, style);
      },
      on: {
        mousedown: event => {
          this.linesLayer.selectedLineId = event.data.id;
          this.nebula.updateAllDeckObjects();
        },
        editEnd: (event, info) => {
          this.testPolylines[info.id].geoJson = info.feature.geoJson;
          this.testPolylines[info.id].edited = true;
        }
      }
    });

    this._loadPolyData(
      'https://raw.githubusercontent.com/matthrice/geoJson-examples/master/pittsburgh-line-data'
    );
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  nebula: Nebula;
  editableLinesLayer: EditableLinesLayer;

  _loadPolyData(path) {
    window.fetch(path).then(response => {
      response.json().then(json => {
        json.features.filter(feature => feature.geometry.type === 'LineString').forEach(feature =>
          this.testPolylines.push({
            geoJson: feature,
            id: this.testPolylines.length,
            edited: false
          })
        );
        // Refresh after fetching data
        this.nebula.updateAllDeckObjects();
      });
    });
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
    const { state, linesLayer } = this;
    let { viewport } = state;

    const { innerHeight: height, innerWidth: width } = window;
    viewport = Object.assign(viewport, { height, width });

    const layers = [linesLayer];

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <MapGL {...viewport} onChangeViewport={this._onChangeViewport}>
          <Nebula
            ref={nebula => (this.nebula = nebula || this.nebula)}
            {...{ layers, viewport }}
            onMapMouseEvent={() => this.forceUpdate()}
          >
            <HtmlTooltipOverlay />
          </Nebula>
        </MapGL>
      </div>
    );
  }
}
