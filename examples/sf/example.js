// @flow
import window from 'global/window';
import React, { Component } from 'react';
import DeckGL, { TextLayer } from 'deck.gl';
import MapGL from 'react-map-gl';

import {
  EditableJunctionsLayer,
  EditableGeoJsonLayer,
  Feature,
  HtmlTooltipOverlay,
  Nebula,
  SegmentsLayer,
  SELECTION_TYPE
} from 'nebula.gl';

import testPolygons from '../data/sf-polygons';

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
    selectionType?: number,
    testPolygons: Array<Object>
  }
> {
  constructor() {
    super();

    // TODO: once https://github.com/uber/deck.gl/pull/1918 lands, remove this filter since it'll work with MultiPolygons
    const testPolygonsWithoutMultiPolygons = testPolygons.filter(
      feature => feature.geometry.type === 'Polygon'
    );

    this.state = {
      viewport: initialViewport,
      allowEdit: true,
      testPolygons: testPolygonsWithoutMultiPolygons
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
        editStart: (event, info) => console.log('Junctions editStart', event, info), // eslint-disable-line
        editEnd: (event, info) => {
          console.log('Junctions editEnd', event, info); // eslint-disable-line

          if (this.state.allowEdit) {
            const original = this.testJunctions.find(j => j.id === info.id);
            if (original) {
              original.position = info.feature.geoJson.geometry.coordinates;
            }
          }
        }
      }
    });

    this._loadData(
      'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/layer-browser/sfmta.routes.json'
    );
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  nebula: Nebula;
  testSegments: Object[];
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

  _onChangeViewport = (viewport: Object) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  _resize = () => {
    this.forceUpdate();
  };

  _onSelect = (features: Object[]) => {
    console.log('selected', features); // eslint-disable-line
    this._enableSelection(SELECTION_TYPE.NONE);
  };

  _onLayerClick = info => {
    if (info) {
      console.log(`select editing feature ${info.index}`); // eslint-disable-line
      // a polygon was clicked
      this.setState({ selectedFeatureIndex: info.index });
    } else {
      console.log('deselect editing feature'); // eslint-disable-line
      // open space was clicked, so stop editing
      this.setState({ selectedFeatureIndex: null });
    }
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
          Road Count: {this.testSegments.length} Poly Count: {this.state.testPolygons.length}
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
    const { editableJunctionsLayer, segmentsLayer, state } = this;
    let { viewport } = state;
    const { selectionType } = state;

    const { innerHeight: height, innerWidth: width } = window;
    viewport = Object.assign(viewport, { height, width });

    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      data: this.state.testPolygons,
      selectedFeatureIndex: this.state.selectedFeatureIndex,
      pickable: true,
      editable: this.state.allowEdit,

      onStartDraggingPoint: ({ coordinateIndexes }) => {
        console.log(`Start dragging point`, coordinateIndexes); // eslint-disable-line
      },
      onDraggingPoint: ({ feature, featureIndex, coordinateIndexes }) => {
        if (this.state.allowEdit) {
          // replace the feature being edited
          this.setState({
            testPolygons: [
              ...this.state.testPolygons.slice(0, featureIndex),
              feature,
              ...this.state.testPolygons.slice(featureIndex + 1)
            ]
          });
        }
      },
      onStopDraggingPoint: ({ coordinateIndexes }) => {
        console.log(`Stop dragging point`, coordinateIndexes); // eslint-disable-line
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

    const textLayer = new TextLayer({
      id: 'text-layer',
      data: [
        {
          text: 'This DeckGL layer is rendered inside NebulaGL :-)',
          position: [-122.4, 37.7]
        }
      ]
    });
    const nebulaLayers = [segmentsLayer, editableJunctionsLayer];
    const deckLayers = [editableGeoJsonLayer, textLayer];

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <MapGL {...viewport} onChangeViewport={this._onChangeViewport}>
          <Nebula
            ref={nebula => (this.nebula = nebula || this.nebula)}
            viewport={viewport}
            layers={nebulaLayers}
            onSelection={this._onSelect}
            selectionType={selectionType}
            onMapMouseEvent={() => this.forceUpdate()}
          >
            <HtmlTooltipOverlay />
          </Nebula>
          <DeckGL {...viewport} onLayerClick={this._onLayerClick} layers={deckLayers} />
        </MapGL>

        {this._renderToolBox()}
      </div>
    );
  }
}
