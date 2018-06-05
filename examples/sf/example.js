// @flow
import window from 'global/window';
import React, { Component } from 'react';
import { TextLayer } from 'deck.gl';
import MapGL from 'react-map-gl';

import {
  EditableJunctionsLayer,
  EditablePolygonsLayer,
  Feature,
  HtmlTooltipOverlay,
  Nebula,
  SegmentsLayer,
  SELECTION_TYPE
} from 'nebula.gl';

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 37.75,
  longitude: -122.445,
  pitch: 0,
  width: 0,
  zoom: 17
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

    this.testSegments = [];
    this.segmentsLayer = new SegmentsLayer({
      getData: () => this.testSegments,
      toNebulaFeature: data => this._toNebulaFeature(data)
    });
    this.segmentsLayer.highlightColor = [1, 1, 1, 1];

    this.testJunctions = [];
    this.editableJunctionsLayer = new EditableJunctionsLayer({
      getData: () => this.testJunctions,
      toNebulaFeature: data => this._toNebulaFeatureJunc(data),
      on: {
        /* eslint-disable no-console, no-undef */
        editStart: (event, info) => console.log('Junctions editStart', event, info),
        editEnd: (event, info) => {
          console.log('Junctions editEnd', event, info);
          /* eslint-enable */

          if (this.state.allowEdit) {
            const original = this.testJunctions.find(j => j.id === info.id);
            if (original) {
              original.position = info.feature.geoJson.geometry.coordinates;
            }
          }
        }
      }
    });

    this.testPolygons = [];
    this.editablePolygonsLayer = new EditablePolygonsLayer({
      getData: () => this.testPolygons,
      toNebulaFeature: data =>
        new Feature(data, {
          fillColor: [0, 0, 0, 0.4],
          outlineColor: [0.5, 0.5, 0.5, 1],
          lineWidthMeters: 10
        }),
      on: {
        mousedown: event => {
          this.editablePolygonsLayer.selectedPolygonId = event.data.id;
          this.editablePolygonsLayer.selectedSubPolygonIndex = event.metadata.index;
          this.nebula.updateAllDeckObjects();
        },
        /* eslint-disable no-console, no-undef */
        editStart: (event, info) => console.log('Polygon editStart', event, info),
        editEnd: (event, info) => {
          console.log('Polygon editEnd', event, info);
          /* eslint-enable */

          if (this.state.allowEdit) {
            const original = this.testPolygons.find(p => p.id === info.id);
            if (original) {
              original.geometry.coordinates = info.feature.geoJson.geometry.coordinates;
            }
          }
        }
      }
    });
    this.editablePolygonsLayer.supportMultiPolygon = true;

    this._loadData(
      'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/layer-browser/sfmta.routes.json'
    );
    this._loadPolyData('/static/sf-poly.json');
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  nebula: Nebula;
  testSegments: Object[];
  testPolygons: Object[];
  segmentsLayer: SegmentsLayer;
  editableJunctionsLayer: EditableJunctionsLayer;

  /**
   * Loads the test data from a static json file.
   * @param {string} path The path to the json file.
   */
  _loadData(path: string) {
    window.fetch(path).then(response => {
      response.text().then(json => {
        this.testSegments = JSON.parse(json);

        this.testJunctions = [];
        this.testSegments.forEach((segment, index) => {
          segment.id = index;

          this.testJunctions.push({ id: `${index}S`, position: segment.START });
          this.testJunctions.push({ id: `${index}E`, position: segment.END });
        });

        this.nebula.updateAllDeckObjects();
      });
    });
  }

  _loadPolyData(path: string) {
    window.fetch(path).then(response => {
      response.text().then(json => {
        this.testPolygons = JSON.parse(json);
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

  _onSelect = (features: Object[]) => {
    /* eslint-disable no-console, no-undef */
    console.log('selected', features);
    this._enableSelection(SELECTION_TYPE.NONE);
    /* eslint-enable */
  };

  _enableSelection(type: number) {
    this.setState({
      selectionType: type
    });
  }

  _toNebulaFeature(segment: Object) {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [segment.START, segment.END]
      },
      properties: null
    };
    const { SERVICE: service, LINE: line } = segment;
    const code =
      (line.charCodeAt(0) ^ (line.charCodeAt(1) || 0)) * 89599 +
      (service.charCodeAt(0) ^ (service.charCodeAt(1) * 349));
    const lineColor = [code & 0xff, (code >> 8) & 0xff, (code >> 16) & 0xff, 255];
    const style = {
      lineColor: lineColor.map(x => x / 255),
      lineWidthMeters: 5.0,
      tooltip: segment.LINE
    };
    return new Feature(geojson, style);
  }

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
      pointRadiusMeters: 5,
      outlineRadiusMeters: 0,
      fillColor: [0, 0, 0, 1]
    };
    return new Feature(geojson, style);
  }

  _renderToolBox() {
    return (
      <div style={styles.toolbox}>
        <div>
          <button onClick={() => this._enableSelection(SELECTION_TYPE.RECTANGLE)}>
            Select by Rectangle
          </button>
          <button onClick={() => this._enableSelection(SELECTION_TYPE.POLYGON)}>
            Select by Polygon
          </button>
        </div>
        <div>
          Road Count: {this.testSegments.length} Poly Count: {this.testPolygons.length}
        </div>
        <div>
          <button onClick={() => this.setState({ allowEdit: !this.state.allowEdit })}>
            Allow Edit: {this.state.allowEdit ? 'Yes' : 'No'}
          </button>
          <button onClick={() => this.nebula.updateAllDeckObjects()}>Refresh</button>
        </div>
      </div>
    );
  }

  render() {
    const { editableJunctionsLayer, editablePolygonsLayer, segmentsLayer, state } = this;
    let { viewport } = state;
    const { selectionType } = state;

    const { innerHeight: height, innerWidth: width } = window;
    viewport = Object.assign(viewport, { height, width });

    const textLayer = new TextLayer({
      id: 'text-layer',
      data: [
        {
          text: 'This DeckGL layer is rendered inside NebulaGL :-)',
          position: [-122.4, 37.7]
        }
      ]
    });
    const layers = [segmentsLayer, editableJunctionsLayer, editablePolygonsLayer, textLayer];

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <MapGL {...viewport} onChangeViewport={this._onChangeViewport}>
          <Nebula
            ref={nebula => (this.nebula = nebula || this.nebula)}
            {...{ layers, viewport }}
            onSelection={this._onSelect}
            selectionType={selectionType}
            onMapMouseEvent={() => this.forceUpdate()}
          >
            <HtmlTooltipOverlay />
          </Nebula>
        </MapGL>

        {this._renderToolBox()}
      </div>
    );
  }
}
