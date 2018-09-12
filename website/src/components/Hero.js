import React, { Component } from 'react';
import DeckGL, { MapView, MapController, GeoJsonLayer, ScatterplotLayer } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import { EditableGeoJsonLayer } from 'nebula.gl';
import window from 'global/window';
import document from 'global/document';

import { PROJECT_NAME, PROJECT_DESC } from 'config';

const DATA_URL =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson';

const DEMO_COLORS = [
  '#2761A6',
  '#339DC0',
  '#53B9C2',
  '#91D2BA',
  '#CBEAB6',
  '#FFFEDB',
  '#90D1B9',
  '#287FB5'
];

function processInitialData(data) {
  // add color and elevation to states
  let color = 0;
  let elevation = 1;
  data.features.forEach(state => {
    const num = parseInt(DEMO_COLORS[color++ % DEMO_COLORS.length].substring(1), 16);
    const fillColor = [16, 8, 0].map(sh => (num >> sh) & 0xff);
    state.properties.fillColor = fillColor;
    state.properties.elevation = Math.round(1 + elevation++ % 10) * 10000;
  });
  return data;
}

const LIGHT_SETTINGS = {
  lightsPosition: [0, 80, 190000, -125, 80, 190000],
  ambientRatio: 0.3,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [1.0, 0.0, 1.0, 0.0],
  numberOfLights: 2
};

class EditableGeoJsonLayer2 extends EditableGeoJsonLayer {
  renderLayers() {
    const subLayerProps = this.getSubLayerProps({
      id: 'geojson',

      // Proxy most GeoJsonLayer props as-is
      data: this.props.data,
      fp64: this.props.fp64,
      filled: this.props.filled,
      stroked: this.props.stroked,
      lineWidthScale: this.props.lineWidthScale,
      lineWidthMinPixels: this.props.lineWidthMinPixels,
      lineWidthMaxPixels: this.props.lineWidthMaxPixels,
      lineJointRounded: this.props.lineJointRounded,
      lineMiterLimit: this.props.lineMiterLimit,
      pointRadiusScale: this.props.pointRadiusScale,
      pointRadiusMinPixels: this.props.pointRadiusMinPixels,
      pointRadiusMaxPixels: this.props.pointRadiusMaxPixels,
      lineDashJustified: this.props.lineDashJustified,
      getLineColor: this.selectionAwareAccessor(this.props.getLineColor),
      getFillColor: this.selectionAwareAccessor(this.props.getFillColor),
      getRadius: this.selectionAwareAccessor(this.props.getRadius),
      getLineWidth: this.selectionAwareAccessor(this.props.getLineWidth),
      getLineDashArray: this.selectionAwareAccessor(this.props.getLineDashArray),

      extruded: this.props.extruded,
      getElevation: f => (f && f.properties && f.properties.elevation) || 150000,
      lightSettings: LIGHT_SETTINGS,
      // opacity: 1,

      updateTriggers: {
        getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getRadius: [this.props.selectedFeatureIndexes, this.props.mode],
        getLineWidth: [this.props.selectedFeatureIndexes, this.props.mode],
        getLineDashArray: [this.props.selectedFeatureIndexes, this.props.mode]
      }
    });

    let layers = [new GeoJsonLayer(subLayerProps)];

    layers = layers.concat(this.createPointLayers());
    layers = layers.concat(this.createDrawLayers());

    return layers;
  }

  createPointLayers() {
    if (!this.state.editHandles.length) {
      return [];
    }

    const sharedProps = {
      id: `${this.props.editHandleType}-edit-handles`,
      data: this.state.editHandles,
      fp64: this.props.fp64
    };

    const layer =
      this.props.editHandleType === 'point'
        ? new ScatterplotLayer(
            this.getSubLayerProps({
              ...sharedProps,

              // Proxy editing point props
              radiusScale: this.props.editHandlePointRadiusScale,
              outline: this.props.editHandlePointOutline,
              strokeWidth: this.props.editHandlePointStrokeWidth,
              radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
              radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
              getRadius: this.props.getEditHandlePointRadius,
              getColor: this.props.getEditHandlePointColor,

              parameters: {
                depthTest: false,
                blend: false
              }
            })
          )
        : null;

    return [layer];
  }
}

const initialViewport = {
  bearing: 0,
  latitude: 50.73,
  longitude: -98,
  pitch: 60,
  zoom: 3
};

const styles = {
  toolbox: {
    position: 'absolute',
    top: 100,
    right: 20,
    background: 'white',
    padding: 10,
    borderRadius: 4,
    border: '1px solid gray',
    width: 350,
    fontFamily: 'Arial, Helvetica, sans-serif'
  },
  toolboxList: {
    margin: 0,
    display: 'flex',
    flexWrap: 'wrap'
  },
  toolboxTerm: {
    flex: '0 0 60%',
    marginBottom: 7
  },
  toolboxDescription: {
    margin: 0,
    flex: '0 0 40%'
  },
  mapContainer: {
    alignItems: 'stretch',
    display: 'flex'
  },
  bgMapContainer: {},
  btn: {
    pointerEvents: 'all'
  }
};

const EMPTY = {
  type: 'FeatureCollection',
  features: []
};

class Hero extends Component {
  constructor() {
    super();

    this.state = {
      viewport: initialViewport,
      data: EMPTY,
      mode: 'view',
      toolMode: 'view',
      pointsRemovable: true,
      selectedFeatureIndexes: [],
      inbg: true,
      stats: {
        features: 0,
        points: 0
      },
      extrude: false
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    window.addEventListener('keydown', this._keydown);

    window.fetch(DATA_URL).then(response => {
      response.text().then(json => {
        const data = processInitialData(JSON.parse(json));
        this.setState({ data });
        this.calcStats(data);
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
    window.removeEventListener('keydown', this._keydown);
  }

  _keydown = ({ key }) => {
    if (key === 'Escape') {
      this.setState({
        mode: 'view',
        toolMode: 'view',
        selectedFeatureIndexes: []
      });
    }
  };

  _onLayerClick = info => {
    console.log('onLayerClick', info); // eslint-disable-line

    if (this.state.toolMode === 'delete' && info) {
      const features = [...this.state.data.features];
      features.splice(info.index, 1);
      const data = { ...this.state.data, features };

      this.setState({ selectedFeatureIndexes: [], data });
      return;
    }

    if (this.state.mode !== 'view') {
      // don't change selection while editing
      return;
    }

    if (info) {
      console.log(`select editing feature ${info.index}`); // eslint-disable-line
      // a feature was clicked
      // TODO: once https://github.com/uber/deck.gl/pull/1918 lands, this will work since it'll work with Multi* geometry types
      this.setState({ selectedFeatureIndexes: [info.index], mode: 'modify', toolMode: 'modify' });
    } else {
      console.log('deselect editing feature'); // eslint-disable-line
      // open space was clicked, so stop editing
      this.setState({ selectedFeatureIndexes: [] });
    }
  };

  _resize = () => {
    this.forceUpdate();
  };

  renderToolBox() {
    const TOOL_MODE_TO_MODE = {
      view: 'view',
      modify: 'modify',
      new: 'view',
      delete: 'view'
    };
    const setMode = toolMode => this.setState({ toolMode, mode: TOOL_MODE_TO_MODE[toolMode] });
    const setModeNew = mode =>
      this.setState({ mode, toolMode: 'new2', selectedFeatureIndexes: [] });
    const isSelected = toolMode => (this.state.toolMode === toolMode ? 'selected' : '');
    const isDisplay = toolMode => (this.state.toolMode === toolMode ? '' : 'none');

    return (
      <div className="HeroToolBox">
        <a onClick={() => setMode('view')} className={isSelected('view')}>
          Select
        </a>
        <a onClick={() => setMode('modify')} className={isSelected('modify')}>
          Modify
        </a>
        <a onClick={() => setMode('new')} className={isSelected('new') + isSelected('new2')}>
          New
        </a>
        <a onClick={() => setMode('delete')} className={isSelected('delete')}>
          Delete
        </a>
        <hr />
        <a onClick={() => this.color()}>Color</a>
        <hr />
        <a onClick={() => this.setState({ data: EMPTY, selectedFeatureIndexes: [] })}>Clear</a>
        <a onClick={() => this.fileLoad()}>Load</a>
        <a onClick={() => this.fileSave()}>Save</a>

        <div className="SubToolBox" style={{ top: 95, display: isDisplay('new') }}>
          <a onClick={() => setModeNew('drawLineString')}>Line</a>
          <a onClick={() => setModeNew('drawPolygon')}>Polygon</a>
          <a onClick={() => setModeNew('drawRectangle')}>Rectangle</a>
          <a onClick={() => setModeNew('drawRectangleUsing3Points')}>Rect 3X</a>
          <a onClick={() => setModeNew('drawCircleFromCenter')}>Circle</a>
          <a onClick={() => setModeNew('drawEllipseByBoundingBox')}>Ellipse</a>
        </div>

        <hr />
        <div onClick={() => this.calcStats(this.state.data)}>
          {this.state.stats.features} features<br />
          {this.state.stats.points} points
        </div>

        <hr />
        <div>
          <input
            type="checkbox"
            checked={this.state.extrude}
            onChange={event => this.setState({ extrude: event.target.checked })}
          />Extrude<br />
          <input
            type="checkbox"
            checked={this.state.viewport.pitch > 0}
            onChange={event =>
              this.setState({
                viewport: { ...this.state.viewport, pitch: event.target.checked ? 60 : 0 }
              })
            }
          />Tilt
          <button
            onClick={() =>
              this.setState({
                viewport: { ...this.state.viewport, bearing: this.state.viewport.bearing + 90 }
              })
            }
          >
            &diams;
          </button>
        </div>
      </div>
    );
  }

  calcStats(data) {
    const { features } = data;
    let points = 0;
    features.forEach(f => (points += f.geometry.coordinates.flatten(9).length >> 1));
    this.setState({ stats: { features: features.length, points } });
  }

  color() {
    const { selectedFeatureIndexes } = this.state;
    if (selectedFeatureIndexes && selectedFeatureIndexes.length) {
      const inputElement = document.createElement('input');
      inputElement.type = 'color';
      inputElement.addEventListener('change', () => {
        const color = inputElement.value;
        if (color.length === 7 && color.substring(0, 1) === '#') {
          // convert from #123456 to array of numbers
          const num = parseInt(color.substring(1), 16);
          const fillColor = [16, 8, 0].map(sh => (num >> sh) & 0xff);

          const features = [...this.state.data.features];
          if (!features[selectedFeatureIndexes[0]].properties) {
            features[selectedFeatureIndexes[0]].properties = {};
          }
          features[selectedFeatureIndexes[0]].properties.fillColor = fillColor;
          const data = { ...this.state.data, features };
          this.setState({ data });
        }
      });
      inputElement.click();
    }
  }

  fileSave() {
    const blob = new Blob([JSON.stringify(this.state.data)], { type: 'application/json' }); // eslint-disable-line
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'nebula.geojson';
    a.click();
  }

  fileLoad() {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.addEventListener('change', () => {
      if (inputElement.files && inputElement.files[0]) {
        // load geo-json
        const reader = new FileReader(); // eslint-disable-line
        reader.onloadend = () => {
          let data = null;
          try {
            data = JSON.parse(reader.result);
          } catch (e) {
            alert(e); // eslint-disable-line
          }

          if (data) {
            this.setState({ data });
            this.calcStats(data);
          }
        };
        reader.readAsBinaryString(inputElement.files[0]);
      }
    });
    inputElement.click();
  }

  renderMap() {
    const { data, selectedFeatureIndexes } = this.state;
    const headerContent = document.getElementsByClassName('header-content')[0];
    let needsRefresh = false;

    let height = 0;
    if (this.nHero) {
      height += this.nHero.getBoundingClientRect().height;
    } else {
      needsRefresh = true;
    }

    if (headerContent) {
      height += headerContent.getBoundingClientRect().height;
    } else {
      needsRefresh = true;
    }

    if (needsRefresh) {
      // needed in case the css has not been loaded
      // or html elements not rendered
      window.setTimeout(() => this.forceUpdate(), 100);
    }

    const viewport = {
      ...this.state.viewport,
      height,
      width: window.innerWidth
    };

    const editableGeoJsonLayer = new EditableGeoJsonLayer2({
      data,
      selectedFeatureIndexes,
      mode: this.state.mode,
      // TODO: remove fp64 and use deck new projection
      fp64: false,
      autoHighlight: false,
      extruded: this.state.extrude,

      // Editing callbacks
      onEdit: ({
        updatedData,
        updatedMode,
        updatedSelectedFeatureIndexes,
        editType,
        featureIndex,
        positionIndexes,
        position
      }) => {
        if (editType !== 'movePosition') {
          // Don't log moves since they're really chatty
          // eslint-disable-next-line
          console.log(
            'onEdit',
            editType,
            updatedMode,
            updatedSelectedFeatureIndexes,
            featureIndex,
            positionIndexes,
            position
          );
        }
        if (editType === 'removePosition' && !this.state.pointsRemovable) {
          // reject the edit
          return;
        }
        this.setState({
          data: updatedData,
          mode: updatedMode,
          selectedFeatureIndexes: updatedSelectedFeatureIndexes
        });
      },

      // Specify the same GeoJsonLayer props
      // Make things bigger to look good on home screen
      lineWidthMinPixels: 2,
      editHandlePointRadiusMinPixels: 4,
      editHandlePointRadiusScale: 200,
      lineDashJustified: true,

      // Accessors receive an isSelected argument
      getFillColor: (feature, isSelected) => {
        if (feature && feature.properties && feature.properties.fillColor) {
          return feature.properties.fillColor;
        }
        return isSelected ? [0x00, 0x00, 0xff, 0x90] : [0xf0, 0xf0, 0xf0, 0x70];
      },
      getLineColor: (feature, isSelected) => {
        return isSelected ? [0x00, 0x20, 0x90, 0xff] : [0x20, 0x20, 0x20, 0xff];
      },

      // Can customize editing points props
      getEditHandlePointColor: handle =>
        handle.type === 'existing' ? [0xff, 0xff, 0xff, 0xff] : [0x0, 0x0, 0x0, 0x80]
    });

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <DeckGL
          {...viewport}
          layers={[editableGeoJsonLayer]}
          views={new MapView({ id: 'basemap', controller: MapController })}
          onLayerClick={this._onLayerClick}
          onViewStateChange={({ viewState }) => this.setState({ viewport: viewState })}
        >
          <StaticMap {...viewport} mapStyle={'mapbox://styles/mapbox/dark-v9'} />
        </DeckGL>
        {this.renderToolBox()}
      </div>
    );
  }

  render() {
    return (
      <div>
        <div style={styles.bgMapContainer}>{this.renderMap()}</div>
        <div
          className="Hero"
          id="NebulaHero"
          style={{ visibility: this.state.inbg ? '' : 'hidden', opacity: this.state.inbg ? 1 : 0 }}
          ref={nHero => (this.nHero = nHero)}
        >
          <div className="container">
            <h1>{PROJECT_NAME}</h1>
            <p>{PROJECT_DESC}</p>
            <a href="#/documentation" style={styles.btn} className="btn">
              {'View Docs'}
            </a>
            <br />
            <a
              href="#"
              onClick={() => this.setState({ inbg: false })}
              style={styles.btn}
              className="btn"
            >
              {'Start Editing'}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Hero;
