import window from 'global/window';
import * as React from 'react';
import { StaticMap } from 'react-map-gl';
import CSS from 'csstype';

import DeckGL from '@deck.gl/react/typed';
import { WebMercatorViewport } from '@deck.gl/core/typed';
import { TextLayer } from '@deck.gl/layers/typed';

import {
  NebulaCore,
  SELECTION_TYPE,
  Feature,
  SegmentsLayer,
  PROJECTED_PIXEL_SIZE_MULTIPLIER,
} from 'nebula.gl';
import { FeatureCollection, ViewMode, ModifyMode } from '@nebula.gl/edit-modes';
import { EditableGeoJsonLayer, SelectionLayer } from '@nebula.gl/layers';

import testPolygons from '../data/sf-polygons';

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 37.7,
  longitude: -122.4,
  pitch: 0,
  width: 0,
  zoom: 10,
};

const toolboxStyle: CSS.Properties<string | number> = {
  position: 'absolute',
  top: '12px',
  left: '12px',
  background: 'rgba(0, 0, 0, 0.2)',
  padding: '10px',
  borderRadius: '10px',
};

const mapContainerStyle: CSS.Properties<string | number> = {
  alignItems: 'stretch',
  display: 'flex',
  height: '100vh',
};

type Segment = {
  id: number;
  START: number;
  END: number;
  LINE: any;
};

export default class Example extends React.Component<
  {},
  {
    viewState: Object;
    allowEdit: boolean;
    selectionType: string | null;
    testFeatures: FeatureCollection;
    selectedFeatureIndexes: number[];
  }
> {
  testJunctions: any;

  constructor(props) {
    super(props);

    this.state = {
      selectionType: null,
      viewState: initialViewport,
      allowEdit: true,
      testFeatures: {
        features: testPolygons,
        type: 'FeatureCollection',
      },
      selectedFeatureIndexes: [],
    };

    this.testSegments = [];
    this.segmentsLayer = new SegmentsLayer({
      id: 'segments-layer',
      pickable: true,
      getData: () => this.testSegments,
      toNebulaFeature: (data) => this._toNebulaFeature(data),
    });
    this.segmentsLayer.highlightColor = [1, 1, 1, 1];
    this.segmentsLayer.arrowSize = 200;

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
  testSegments: Segment[];
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

  _onViewStateChange = (data: { viewState: Object }) => {
    this.setState({
      viewState: { ...this.state.viewState, ...data.viewState },
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
    if (info && info.index >= 0) {
      console.log(`select editing feature ${info.index}`); // eslint-disable-line
      // a polygon was clicked
      this.setState({ selectedFeatureIndexes: [info.index] });
    } else {
      console.log('deselect editing feature'); // eslint-disable-line
      // open space was clicked, so stop editing
      this.setState({ selectedFeatureIndexes: [] });
    }
  };

  _enableSelection(type: string | null) {
    this.setState({
      selectionType: type,
    });
  }

  _toNebulaFeature(segment: Segment) {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [segment.START, segment.END],
      },
      properties: {},
    };
    const style = {
      lineColor: [0, 0, 1, 1],
      lineWidthMeters: 10,
      tooltip: segment.LINE,
      arrowStyle: 3,
      arrowColor: [1, 0, 0, 1],
      zLevel: Math.random(),
    };
    // @ts-ignore
    return new Feature(geojson, style);
  }

  _toNebulaFeatureJunc(junc: { position: number[] }) {
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
    // @ts-ignore
    return new Feature(geojson, style);
  }

  _renderToolBox() {
    return (
      <div style={toolboxStyle}>
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
    let { viewState, selectedFeatureIndexes } = state;
    // const { selectionType } = state;

    const { innerHeight: height, innerWidth: width } = window;
    viewState = Object.assign(viewState, { height, width });

    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      // @ts-ignore according to docs FeatureCollection should be valid type here
      data: this.state.testFeatures,
      selectedFeatureIndexes,
      pickable: true,
      mode: selectedFeatureIndexes.length > 0 ? ModifyMode : ViewMode,

      onEdit: ({ updatedData }) => {
        if (this.state.allowEdit) {
          this.setState({ testFeatures: updatedData });
        }
      },

      // Can specify GeoJsonLayer props
      getFillColor: () => [0x00, 0x20, 0x70, 0x30],
      getLineColor: () => [0x00, 0x20, 0x70, 0xc0],
      getLineWidth: () => 3,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 10,
    });

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

    const selectionLayer = new SelectionLayer({
      id: 'selection',
      selectionType: this.state.selectionType,
      onSelect: ({ pickingInfos }) => {
        // Process selection here
      },
      layerIds: ['segments'],
      getTentativeFillColor: () => [255, 0, 255, 100],
      getTentativeLineColor: () => [0, 0, 255, 255],
      getTentativeLineDashArray: () => [0, 0],
      lineWidthMinPixels: 1,
    });

    const textLayer = new TextLayer({
      id: 'text-layer',
      data: [
        {
          text: 'Text Layer :-)',
          position: [-122.4, 37.7],
        },
      ],
      getSize: 20 * PROJECTED_PIXEL_SIZE_MULTIPLIER,
    });

    const nebulaLayers = [segmentsLayer];
    const deckLayers = this.nebula.updateAndGetRenderedLayers(
      nebulaLayers,
      // @ts-ignore
      new WebMercatorViewport(viewState),
      this
    );
    deckLayers.push(textLayer, editableGeoJsonLayer, selectionLayer);

    return (
      <div style={mapContainerStyle}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <StaticMap {...viewState}>
          <DeckGL
            height={height}
            width={width}
            viewState={viewState}
            onClick={this._onLayerClick}
            layers={deckLayers}
            onViewStateChange={this._onViewStateChange}
            controller={{}}
          />
        </StaticMap>
        {this._renderToolBox()}
      </div>
    );
  }
}
