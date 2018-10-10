// @flow

import window from 'global/window';
import React, { Component } from 'react';
import DeckGL, { MapView, MapController } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import circle from '@turf/circle';

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
    viewport: Object,
    testFeatures: any,
    mode: string,
    modeConfig: any,
    pointsRemovable: boolean,
    drawAtFront: boolean,
    selectedFeatureIndexes: number[],
    editHandleType: string
  }
> {
  constructor() {
    super();

    this.state = {
      viewport: initialViewport,
      testFeatures: sampleGeoJson,
      mode: 'drawPolygon',
      modeConfig: null,
      pointsRemovable: true,
      drawAtFront: false,
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

  _onLayerClick = (info: any) => {
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

  _loadSample = (type: string) => {
    if (type === 'mixed') {
      this.setState({
        testFeatures: sampleGeoJson,
        selectedFeatureIndexes: []
      });
    } else if (type === 'complex') {
      this.setState({
        testFeatures: {
          type: 'FeatureCollection',
          features: [circle([-122.45, 37.77], 5, { steps: 10000 })]
        },
        selectedFeatureIndexes: []
      });
    }
  };

  _renderCheckbox(index: number, featureType: string) {
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
    const {
      testFeatures: { features }
    } = this.state;
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
          <dt style={styles.toolboxTerm}>Load sample data</dt>
          <dd style={styles.toolboxDescription}>
            <button onClick={() => this._loadSample('mixed')}>Mixed</button>
            <button onClick={() => this._loadSample('complex')}>Complex</button>
          </dd>
          <dt style={styles.toolboxTerm}>Mode</dt>
          <dd style={styles.toolboxDescription}>
            <select
              value={this.state.mode}
              onChange={event => this.setState({ mode: event.target.value })}
            >
              <option value="view">view</option>
              <option value="modify">modify</option>
              <option value="rotate">rotate</option>
              <option value="drawPoint">drawPoint</option>
              <option value="drawLineString">drawLineString</option>
              <option value="drawPolygon">drawPolygon</option>
              <option value="drawRectangle">drawRectangle</option>
              <option value="drawRectangleUsing3Points">drawRectangleUsing3Points</option>
              <option value="drawCircleFromCenter">drawCircleFromCenter</option>
              <option value="drawCircleByBoundingBox">drawCircleByBoundingBox</option>
              <option value="drawEllipseByBoundingBox">drawEllipseByBoundingBox</option>
              <option value="drawEllipseUsing3Points">drawEllipseUsing3Points</option>
            </select>
          </dd>
          <dt style={styles.toolboxTerm}>Boolean operation</dt>
          <dd style={styles.toolboxDescription}>
            <select
              value={this.state.modeConfig ? this.state.modeConfig.booleanOperation : ''}
              onChange={event =>
                this.setState({
                  modeConfig: {
                    booleanOperation: event.target.value
                  }
                })
              }
            >
              <option value="">(none)</option>
              <option value="union">union</option>
              <option value="difference">difference</option>
              <option value="intersection">intersection</option>
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
          <dt style={styles.toolboxTerm}>Draw LineString At Front</dt>
          <dd style={styles.toolboxDescription}>
            <input
              type="checkbox"
              checked={this.state.drawAtFront}
              onChange={() =>
                this.setState({
                  drawAtFront: !this.state.drawAtFront
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
    const { testFeatures, selectedFeatureIndexes, mode, drawAtFront } = this.state;

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
      modeConfig: this.state.modeConfig,
      fp64: true,
      autoHighlight: true,
      drawAtFront,

      // Editing callbacks
      onEdit: ({ updatedData, editType, featureIndex, positionIndexes, position }) => {
        let updatedSelectedFeatureIndexes = this.state.selectedFeatureIndexes;
        if (editType !== 'movePosition' && editType !== 'rotating') {
          // Don't log moves since they're really chatty
          // eslint-disable-next-line
          console.log('onEdit', editType, featureIndex, positionIndexes, position);
        }
        if (editType === 'removePosition' && !this.state.pointsRemovable) {
          // reject the edit
          return;
        }
        if (editType === 'addFeature') {
          // Add the new feature to the selection
          updatedSelectedFeatureIndexes = [...this.state.selectedFeatureIndexes, featureIndex];
        }
        this.setState({
          testFeatures: updatedData,
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

      // customize tentative feature style
      getTentativeLineDashArray: () => [7, 4],
      getTentativeLineColor: () => [0x8f, 0x8f, 0x8f, 0xff]
    });

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <DeckGL
          {...viewport}
          getCursor={editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)}
          layers={[editableGeoJsonLayer]}
          views={
            new MapView({
              id: 'basemap',
              controller: {
                type: MapController,
                doubleClickZoom: this.state.mode === 'view'
              }
            })
          }
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
