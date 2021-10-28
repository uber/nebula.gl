import window from 'global/window';
import * as React from 'react';
import DeckGL, { TextLayer } from 'deck.gl';
import MapGL from 'react-map-gl';

import {
  NebulaCore,
  Feature,
  SegmentsLayer,
  SELECTION_TYPE,
  PROJECTED_PIXEL_SIZE_MULTIPLIER,
} from 'nebula.gl';

// import { HtmlTooltipOverlay } from '@nebula.gl/overlays';

import testPolygons from '../data/sf-polygons';

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 37.75,
  longitude: -122.445,
  pitch: 0,
  width: 0,
  zoom: 17,
};

const styles = {
  toolbox: {
    position: 'absolute',
    top: 12,
    left: 12,
    background: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 10,
  },
  mapContainer: {
    alignItems: 'stretch',
    display: 'flex',
    height: '100vh',
  },
};

export default class Example extends React.Component<
  {},
  {
    viewport: Object,
    allowEdit: boolean,
    selectionType?: number,
    testFeatures: Array<Object>,
  }
> {
  constructor() {
    super();

    this.state = {
      viewport: initialViewport,
      allowEdit: true,
      testFeatures: { type: 'FeatureCollection', features: testPolygons },
    };

    this.testSegments = [];
    this.segmentsLayer = new SegmentsLayer({
      getData: () => this.testSegments,
      toNebulaFeature: (data) => this._toNebulaFeature(data),
    });
    this.segmentsLayer.highlightColor = [1, 1, 1, 1];
    this.segmentsLayer.arrowSize = 50;

    this.nebula = new NebulaCore();
    this.nebula.init({});

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

  nebula: NebulaCore;
  testSegments: Object[];
  segmentsLayer: SegmentsLayer;

  /**
   * Loads the test data from a static json file.
   * @param {string} path The path to the json file.
   */
  _loadData(path: string) {
    window.fetch(path).then((response) => {
      response.text().then((json) => {
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
      viewport: { ...this.state.viewport, ...viewport },
    });
  };

  _resize = () => {
    this.forceUpdate();
  };

  _onSelect = (features: Object[]) => {
    console.log('selected', features); // eslint-disable-line
    this._enableSelection(SELECTION_TYPE.NONE);
  };

  _onLayerClick = (info) => {
    if (info) {
      console.log(`select editing feature ${info.index}`); // eslint-disable-line
      // a polygon was clicked
      this.setState({ selectedFeatureIndexes: [info.index] });
    } else {
      console.log('deselect editing feature'); // eslint-disable-line
      // open space was clicked, so stop editing
      this.setState({ selectedFeatureIndexes: [] });
    }
  };

  _enableSelection(type: number) {
    this.setState({
      selectionType: type,
    });
  }

  _toNebulaFeature(segment: Object) {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [segment.START, segment.END],
      },
      properties: null,
    };
    const style = {
      lineColor: [0, 0, 1, 1],
      lineWidthMeters: 5.0,
      tooltip: segment.LINE,
      arrowStyle: 3,
      zLevel: Math.random(),
    };
    return new Feature(geojson, style);
  }

  _toNebulaFeatureJunc(junc: Object) {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: junc.position,
      },
      properties: null,
    };
    const style = {
      pointRadiusMeters: 5,
      outlineRadiusMeters: 0,
      fillColor: [0, 0, 0, 1],
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
          Road Count: {this.testSegments.length}
          Poly Count: {this.state.testFeatures.features.length}
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
    const { segmentsLayer, state } = this;
    let { viewport } = state;
    // const { selectionType } = state;

    const { innerHeight: height, innerWidth: width } = window;
    viewport = Object.assign(viewport, { height, width });

    // const editableGeoJsonLayer = new EditableGeoJsonLayer({
    //   data: this.state.testFeatures,
    //   selectedFeatureIndexes: this.state.selectedFeatureIndexes,
    //   pickable: true,
    //   editable: this.state.allowEdit,

    //   onEdit: ({ data }) => {
    //     if (this.state.allowEdit) {
    //       this.setState({ testFeatures: data });
    //     }
    //   },

    //   // Can specify GeoJsonLayer props
    //   getFillColor: () => [0x00, 0x20, 0x70, 0x30],
    //   getLineColor: () => [0x00, 0x20, 0x70, 0xc0],
    //   getLineWidth: () => 30,
    //   lineWidthMinPixels: 2,
    //   lineWidthMaxPixels: 10,

    //   // As well as point layer props
    //   getPointColor: () => [0x00, 0x20, 0x70, 0xff],
    //   pointHighlightColor: [0xff, 0xff, 0xff, 0xff]
    // });

    /*
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
*/

    const textLayer = new TextLayer({
      id: 'text-layer',
      data: [
        {
          text: 'Text Layer :-)',
          position: [-122.4, 37.7],
        },
      ],
      getSize: PROJECTED_PIXEL_SIZE_MULTIPLIER,
    });
    const nebulaLayers = [segmentsLayer];
    const deckLayers = this.nebula.updateAndGetRenderedLayers(nebulaLayers, viewport, this);
    deckLayers.push(textLayer);

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <MapGL {...viewport} onChangeViewport={this._onChangeViewport}>
          <DeckGL {...viewport} onLayerClick={this._onLayerClick} layers={deckLayers} />
        </MapGL>

        {this._renderToolBox()}
      </div>
    );
  }
}
