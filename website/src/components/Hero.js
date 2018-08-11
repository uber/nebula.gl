import React, { Component } from 'react';
import DeckGL, { MapView, MapController } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import { EditableGeoJsonLayer } from 'nebula.gl';
import window from 'global/window';
import document from 'global/document';

import { PROJECT_NAME, PROJECT_DESC } from 'config';
import sampleGeoJson from '../../../examples/data/sample-geojson.json';

const initialViewport = {
  bearing: 0,
  latitude: 37.76,
  longitude: -122.44,
  pitch: 0,
  zoom: 10
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
      data: sampleGeoJson,
      mode: 'view',
      toolMode: 'view',
      pointsRemovable: true,
      selectedFeatureIndexes: [],
      inbg: true
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    window.addEventListener('keydown', this._keydown);
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
        <a onClick={() => this.setState({ data: EMPTY, selectedFeatureIndexes: [] })}>Clear</a>
        <a onClick={() => this.fileLoad()}>Load</a>
        <a onClick={() => this.fileSave()}>Save</a>

        <div className="SubToolBox" style={{ top: 95, display: isDisplay('new') }}>
          <a onClick={() => setModeNew('drawLineString')}>Line</a>
          <a onClick={() => setModeNew('drawPolygon')}>Polygon</a>
          <a onClick={() => setModeNew('drawRectangle')}>Rectangle</a>
          <a onClick={() => setModeNew('drawCircle')}>Circle</a>
        </div>
      </div>
    );
  }

  fileSave() {
    const blob = new Blob([JSON.stringify(this.state.data)], { type: 'application/json' }); // eslint-disable-line
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'nebula.geojson';
    a.click();
  }

  fileLoad() {
    alert('Not implemented yet'); // eslint-disable-line
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

    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      data,
      selectedFeatureIndexes,
      mode: this.state.mode,
      // TODO: remove fp64 and use deck new projection
      fp64: false,
      autoHighlight: true,

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
      lineWidthMinPixels: 4,
      editHandlePointRadiusMinPixels: 8,

      // Accessors receive an isSelected argument
      getFillColor: (feature, isSelected) => {
        return isSelected ? [0x20, 0x40, 0x90, 0xc0] : [0x20, 0x20, 0x20, 0x30];
      },
      getLineColor: (feature, isSelected) => {
        return isSelected ? [0x00, 0x20, 0x90, 0xff] : [0x20, 0x20, 0x20, 0xff];
      },

      // Can customize editing points props
      getEditHandlePointColor: handle =>
        handle.type === 'existing' ? [0xff, 0x80, 0x00, 0xff] : [0x0, 0x0, 0x0, 0x80]
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
          <StaticMap {...viewport} />
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
