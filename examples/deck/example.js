// @flow

import window from 'global/window';
import React, { Component } from 'react';
import DeckGL, { MapView, MapController } from 'deck.gl';
import { StaticMap } from 'react-map-gl';

import { EditableGeoJsonLayer } from 'nebula.gl';

import sampleGeoJson from '../data/sample-geojson.json';

import iconSheet from '../data/edit-handles.png';

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 37.76,
  longitude: -122.44,
  pitch: 0,
  width: 0,
  zoom: 11
};

const styles = {
  toolbox: {
    position: 'absolute',
    top: 12,
    left: 12,
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
    flex: '0 0 50%',
    marginBottom: 7
  },
  toolboxDescription: {
    margin: 0,
    flex: '0 0 50%',
    fontSize: '90%'
  },
  mapContainer: {
    alignItems: 'stretch',
    display: 'flex',
    height: '100vh'
  },
  checkbox: {
    margin: 10
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
      testFeatures: sampleGeoJson,
      mode: 'modify',
      pointsRemovable: true,
      selectedFeatureIndexes: [],
      editHandleType: 'point'
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
      this.setState({ selectedFeatureIndexes: [info.index] });
    } else {
      console.log('deselect editing feature'); // eslint-disable-line
      // open space was clicked, so stop editing
      this.setState({ selectedFeatureIndexes: [] });
    }
  };

  _resize = () => {
    this.forceUpdate();
  };

  _renderCheckbox(index, featureType) {
    const { selectedFeatureIndexes } = this.state;
    return (
      <dd style={styles.toolboxDescription} key={index}>
        <input
          style={styles.checkbox}
          type="checkbox"
          checked={selectedFeatureIndexes.includes(index)}
          onChange={() => {
            if (selectedFeatureIndexes.includes(index)) {
              this.setState({
                selectedFeatureIndexes: selectedFeatureIndexes.filter(e => e !== index)
              });
            } else {
              this.setState({
                selectedFeatureIndexes: [...selectedFeatureIndexes, index]
              });
            }
          }}
        />
        {index}
        {': '}
        {featureType}
        {''}
      </dd>
    );
  }

  _renderAllCheckboxes() {
    const { testFeatures: { features } } = this.state;
    const checkboxes = [];
    for (let i = 0; i < features.length; ++i) {
      checkboxes.push(this._renderCheckbox(i, features[i].geometry.type));
    }
    return checkboxes;
  }

  _renderToolBox() {
    return (
      <div style={styles.toolbox}>
        <dl style={styles.toolboxList}>
          <dt style={styles.toolboxTerm}>Mode</dt>
          <dd style={styles.toolboxDescription}>
            <select
              value={this.state.mode}
              onChange={event => this.setState({ mode: event.target.value })}
            >
              <option value="view">view</option>
              <option value="modify">modify</option>
              <option value="drawLineString">drawLineString</option>
              <option value="drawPolygon">drawPolygon</option>
              <option value="drawRectangle">drawRectangle</option>
              <option value="drawCircle">drawCircle</option>
              <option value="drawCircle2">drawCircle2</option>
            </select>
          </dd>
          <dt style={styles.toolboxTerm}>Allow removing points</dt>
          <dd style={styles.toolboxDescription}>
            <input
              type="checkbox"
              checked={this.state.pointsRemovable}
              onChange={() => this.setState({ pointsRemovable: !this.state.pointsRemovable })}
            />
          </dd>
          <dt style={styles.toolboxTerm}>Use Icons</dt>
          <dd style={styles.toolboxDescription}>
            <input
              type="checkbox"
              checked={this.state.editHandleType === 'icon'}
              onChange={() =>
                this.setState({
                  editHandleType: this.state.editHandleType === 'icon' ? 'point' : 'icon'
                })
              }
            />
          </dd>
          <dt style={styles.toolboxTerm}>Select Features</dt>
          <dd style={styles.toolboxDescription}>
            <input
              type="button"
              value="Clear selection"
              onClick={() => this.setState({ selectedFeatureIndexes: [] })}
            />
          </dd>
          {this._renderAllCheckboxes()}
        </dl>
      </div>
    );
  }

  render() {
    const { testFeatures, selectedFeatureIndexes, mode } = this.state;

    const viewport = {
      ...this.state.viewport,
      height: window.innerHeight,
      width: window.innerWidth
    };

    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      id: 'geojson',
      data: testFeatures,
      selectedFeatureIndexes,
      mode,
      fp64: true,
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
          testFeatures: updatedData,
          mode: updatedMode,
          selectedFeatureIndexes: updatedSelectedFeatureIndexes
        });
      },

      // test using icons for edit handles
      editHandleType: this.state.editHandleType,
      editHandleIconAtlas: iconSheet,
      editHandleIconMapping: {
        intermediate: {
          x: 0,
          y: 0,
          width: 58,
          height: 58,
          mask: false
        },
        existing: {
          x: 58,
          y: 0,
          width: 58,
          height: 58,
          mask: false
        }
      },
      getEditHandleIcon: d => d.type,
      getEditHandleIconSize: 40,
      getEditHandleIconColor: handle =>
        handle.type === 'existing' ? [0xff, 0x80, 0x00, 0xff] : [0x0, 0x0, 0x0, 0x80],

      // Specify the same GeoJsonLayer props
      lineWidthMinPixels: 2,
      pointRadiusMinPixels: 5,
      getLineDashArray: () => [0, 0],

      // Accessors receive an isSelected argument
      getFillColor: (feature, isSelected) => {
        return isSelected ? [0x20, 0x40, 0x90, 0xc0] : [0x20, 0x20, 0x20, 0x30];
      },
      getLineColor: (feature, isSelected) => {
        return isSelected ? [0x00, 0x20, 0x90, 0xff] : [0x20, 0x20, 0x20, 0xff];
      },

      // Can customize editing points props
      getEditHandlePointColor: handle =>
        handle.type === 'existing' ? [0xff, 0x80, 0x00, 0xff] : [0x0, 0x0, 0x0, 0x80],
      editHandlePointRadiusScale: 2,

      // customize drawing line style
      getDrawLineDashArray: () => [7, 4],
      getDrawLineColor: () => [0x8f, 0x8f, 0x8f, 0xff]
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
        {this._renderToolBox()}
      </div>
    );
  }
}
