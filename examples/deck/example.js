// @flow

import window from 'global/window';
import React, { Component } from 'react';
import DeckGL, { MapView, MapController, COORDINATE_SYSTEM } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import circle from '@turf/circle';

import {
  EditableGeoJsonLayer,
  SelectionLayer,
  CompositeModeHandler,
  ModifyHandler,
  DrawLineStringHandler,
  SELECTION_TYPE
} from 'nebula.gl';

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
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '13px'
  },
  toolboxRow: {
    display: 'flex',
    marginBottom: '5px'
  },
  toolboxRowWrapping: {
    display: 'flex',
    marginBottom: '5px',
    flexWrap: 'wrap'
  },
  toolboxDivider: {
    marginBottom: '5px',
    borderBottom: '1px solid gray'
  },
  toolboxItem: {
    flexBasis: '50%'
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

const ToolboxRow = props => <div style={styles.toolboxRow}>{props.children}</div>;
const ToolboxRowWrapping = props => <div style={styles.toolboxRowWrapping}>{props.children}</div>;
const ToolboxLabel = props => <div style={styles.toolboxItem}>{props.children}</div>;
const ToolboxControl = props => <div style={styles.toolboxItem}>{props.children}</div>;
const ToolboxDivider = props => <div style={styles.toolboxDivider} />;

const ALL_MODES = [
  { category: 'View', modes: ['view'] },
  {
    category: 'Alter',
    modes: ['modify', 'elevation', 'translate', 'rotate', 'scale', 'duplicate', 'extrude', 'split']
  },
  {
    category: 'Draw',
    modes: [
      'drawPoint',
      'drawLineString',
      'drawPolygon',
      'draw90DegreePolygon',
      'drawRectangle',
      'drawRectangleUsing3Points',
      'drawCircleFromCenter',
      'drawCircleByBoundingBox',
      'drawEllipseByBoundingBox',
      'drawEllipseUsing3Points'
    ]
  },
  {
    category: 'Composite',
    modes: ['drawLineString+modify']
  }
];

const POLYGON_DRAWING_MODES = [
  'drawPolygon',
  'draw90DegreePolygon',
  'drawRectangle',
  'drawRectangleUsing3Points',
  'drawCircleFromCenter',
  'drawCircleByBoundingBox',
  'drawEllipseByBoundingBox',
  'drawEllipseUsing3Points'
];

const modeHandlers = Object.assign(
  {
    'drawLineString+modify': new CompositeModeHandler([
      new DrawLineStringHandler(),
      new ModifyHandler()
    ])
  },
  EditableGeoJsonLayer.defaultProps.modeHandlers
);

export default class Example extends Component<
  {},
  {
    viewport: Object,
    testFeatures: any,
    mode: string,
    modeConfig: any,
    pointsRemovable: boolean,
    selectedFeatureIndexes: number[],
    editHandleType: string,
    selectionTool: ?string
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
      selectedFeatureIndexes: [],
      editHandleType: 'point',
      selectionTool: null
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

    if (this.state.mode !== 'view' || this.state.selectionTool) {
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
          features: [
            circle([-122.45, 37.81], 4, { steps: 5000 }),
            circle([-122.33, 37.81], 4, { steps: 5000 }),
            circle([-122.45, 37.73], 4, { steps: 5000 }),
            circle([-122.33, 37.73], 4, { steps: 5000 })
          ]
        },
        selectedFeatureIndexes: []
      });
    }
  };

  _renderSelectFeatureCheckbox(index: number, featureType: string) {
    const { selectedFeatureIndexes } = this.state;
    return (
      <ToolboxLabel key={index}>
        <label>
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
        </label>
      </ToolboxLabel>
    );
  }

  _renderSelectFeatureCheckboxes() {
    const {
      testFeatures: { features }
    } = this.state;
    const checkboxes = [];
    for (let i = 0; i < features.length; ++i) {
      checkboxes.push(this._renderSelectFeatureCheckbox(i, features[i].geometry.type));
    }
    return checkboxes;
  }

  _renderBooleanOperationControls() {
    const operations = ['union', 'difference', 'intersection'];
    return (
      <ToolboxRow key="booleanOperations">
        <ToolboxLabel>Boolean operation (requires single selection)</ToolboxLabel>
        <ToolboxControl>
          {operations.map(operation => (
            <button
              key={operation}
              style={{
                backgroundColor:
                  this.state.modeConfig && this.state.modeConfig.booleanOperation === operation
                    ? '#a0cde8'
                    : ''
              }}
              onClick={() => {
                if (this.state.modeConfig && this.state.modeConfig.booleanOperation === operation) {
                  this.setState({ modeConfig: null });
                } else {
                  this.setState({ modeConfig: { booleanOperation: operation } });
                }
              }}
            >
              {operation}
            </button>
          ))}
        </ToolboxControl>
      </ToolboxRow>
    );
  }

  _renderDrawLineStringModeControls() {
    return (
      <ToolboxRow key="drawLineString">
        <ToolboxLabel>Draw LineString At Front</ToolboxLabel>
        <ToolboxControl>
          <input
            type="checkbox"
            checked={Boolean(this.state.modeConfig && this.state.modeConfig.drawAtFront)}
            onChange={event =>
              this.setState({
                modeConfig: {
                  drawAtFront: Boolean(event.target.checked)
                }
              })
            }
          />
        </ToolboxControl>
      </ToolboxRow>
    );
  }

  _renderModifyModeControls() {
    return (
      <ToolboxRow key="modify">
        <ToolboxLabel>Allow removing points</ToolboxLabel>
        <ToolboxControl>
          <input
            type="checkbox"
            checked={this.state.pointsRemovable}
            onChange={() => this.setState({ pointsRemovable: !this.state.pointsRemovable })}
          />
        </ToolboxControl>
      </ToolboxRow>
    );
  }

  _renderSplitModeControls() {
    return (
      <ToolboxRow key="split">
        <ToolboxLabel>Constrain to 90&deg;</ToolboxLabel>
        <ToolboxControl>
          <input
            type="checkbox"
            checked={Boolean(this.state.modeConfig && this.state.modeConfig.lock90Degree)}
            onChange={event =>
              this.setState({ modeConfig: { lock90Degree: Boolean(event.target.checked) } })
            }
          />
        </ToolboxControl>
      </ToolboxRow>
    );
  }

  _renderModeConfigControls() {
    const controls = [];

    if (POLYGON_DRAWING_MODES.indexOf(this.state.mode) > -1) {
      controls.push(this._renderBooleanOperationControls());
    }
    if (this.state.mode === 'drawLineString') {
      controls.push(this._renderDrawLineStringModeControls());
    }
    if (this.state.mode === 'modify') {
      controls.push(this._renderModifyModeControls());
    }
    if (this.state.mode === 'split') {
      controls.push(this._renderSplitModeControls());
    }

    return controls;
  }

  _renderToolBox() {
    return (
      <div style={styles.toolbox}>
        {ALL_MODES.map(category => (
          <ToolboxRowWrapping key={category.category}>
            <div style={{ paddingRight: '4px' }}>{category.category} Modes</div>
            {category.modes.map(mode => (
              <button
                key={mode}
                style={{
                  margin: '2px',
                  // padding: '2px 6px',
                  backgroundColor: this.state.mode === mode ? '#a0cde8' : ''
                }}
                onClick={() => {
                  this.setState({ mode, modeConfig: {}, selectionTool: null });
                }}
              >
                {mode}
              </button>
            ))}
          </ToolboxRowWrapping>
        ))}
        {this._renderModeConfigControls()}
        <ToolboxDivider />
        <ToolboxRow>
          <ToolboxLabel>Load sample data</ToolboxLabel>
          <ToolboxControl>
            <button onClick={() => this._loadSample('mixed')}>Mixed</button>
            <button onClick={() => this._loadSample('complex')}>Complex</button>
          </ToolboxControl>
        </ToolboxRow>

        <ToolboxRow>
          <ToolboxLabel>Use Icons</ToolboxLabel>
          <ToolboxControl>
            <input
              type="checkbox"
              checked={this.state.editHandleType === 'icon'}
              onChange={() =>
                this.setState({
                  editHandleType: this.state.editHandleType === 'icon' ? 'point' : 'icon'
                })
              }
            />
          </ToolboxControl>
        </ToolboxRow>

        <ToolboxRow>
          <ToolboxLabel>Select Features</ToolboxLabel>
          <ToolboxControl>
            <input
              type="button"
              value="Clear"
              onClick={() =>
                this.setState({ selectedFeatureIndexes: [], selectionTool: SELECTION_TYPE.NONE })
              }
            />
            <input
              type="button"
              value="Rect"
              onClick={() =>
                this.setState({ mode: 'view', selectionTool: SELECTION_TYPE.RECTANGLE })
              }
            />
            <input
              type="button"
              value="Lasso"
              onClick={() => this.setState({ mode: 'view', selectionTool: SELECTION_TYPE.POLYGON })}
            />
          </ToolboxControl>
        </ToolboxRow>
        <ToolboxRowWrapping>{this._renderSelectFeatureCheckboxes()}</ToolboxRowWrapping>
      </div>
    );
  }

  render() {
    const { testFeatures, selectedFeatureIndexes, mode, modeConfig } = this.state;

    const viewport = {
      ...this.state.viewport,
      height: window.innerHeight,
      width: window.innerWidth
    };

    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      id: 'geojson',
      data: testFeatures,
      selectedFeatureIndexes,
      modeHandlers,
      mode,
      modeConfig,
      // TODO: remove this after update to 6.2
      fp64: false,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT_EXPERIMENTAL,
      //
      autoHighlight: false,

      // Editing callbacks
      onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {
        let updatedSelectedFeatureIndexes = this.state.selectedFeatureIndexes;
        if (
          !['movePosition', 'extruding', 'rotating', 'translating', 'scaling'].includes(editType)
        ) {
          // Don't log edits that happen as the pointer moves since they're really chatty
          // eslint-disable-next-line
          console.log('onEdit', editType, featureIndexes, editContext);
        }
        if (editType === 'removePosition' && !this.state.pointsRemovable) {
          // This is a simple example of custom handling of edits
          // reject the edit
          return;
        }
        if (editType === 'addFeature' && mode !== 'duplicate') {
          // Add the new feature to the selection
          updatedSelectedFeatureIndexes = [...this.state.selectedFeatureIndexes, ...featureIndexes];
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

    const layers = [editableGeoJsonLayer];

    if (this.state.selectionTool) {
      layers.push(
        new SelectionLayer({
          id: 'selection',
          selectionType: this.state.selectionTool,
          onSelect: ({ pickingInfos }) => {
            this.setState({ selectedFeatureIndexes: pickingInfos.map(pi => pi.index) });
          },
          layerIds: ['geojson'],

          getTentativeFillColor: () => [255, 0, 255, 100],
          getTentativeLineColor: () => [0, 0, 255, 255],
          getTentativeLineDashArray: () => [0, 0],
          lineWidthMinPixels: 3
        })
      );
    }

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <DeckGL
          {...viewport}
          getCursor={editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)}
          layers={layers}
          views={
            new MapView({
              id: 'basemap',
              controller: {
                type: MapController,
                doubleClickZoom: this.state.mode === 'view' && !this.state.selectionTool
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
