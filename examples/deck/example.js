// @flow
/* eslint-env browser */

import window from 'global/window';
import React, { Component } from 'react';
import DeckGL from '@deck.gl/react';
import { MapView, MapController } from '@deck.gl/core';
import { StaticMap } from 'react-map-gl';
import GL from '@luma.gl/constants';
import circle from '@turf/circle';

import {
  EditableGeoJsonLayer,
  EditableGeoJsonLayer_EDIT_MODE_POC as EditableGeoJsonLayerEditModePoc,
  SelectionLayer,
  CompositeModeHandler,
  ModifyHandler,
  ElevationHandler,
  DrawLineStringHandler,
  ElevatedEditHandleLayer,
  SELECTION_TYPE
} from 'nebula.gl';

import sampleGeoJson from '../data/sample-geojson.json';

import iconSheet from '../data/edit-handles.png';

import {
  ToolboxControl,
  ToolboxDivider,
  ToolboxLabel,
  ToolboxRow,
  ToolboxRowWrapping,
  styles as ToolboxStyles
} from './toolbox';

// TODO: once we refactor EditableGeoJsonLayer to use new EditMode interface, this can go away
let EditableGeoJsonLayerImpl = EditableGeoJsonLayer;
if (window.location.search && window.location.search.indexOf('useEditModePoc') !== -1) {
  EditableGeoJsonLayerImpl = EditableGeoJsonLayerEditModePoc;
}

const styles = {
  mapContainer: {
    alignItems: 'stretch',
    display: 'flex',
    height: '100vh'
  },
  checkbox: {
    margin: 10
  }
};

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 37.76,
  longitude: -122.44,
  pitch: 0,
  width: 0,
  zoom: 11
};

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
  EditableGeoJsonLayerImpl.defaultProps.modeHandlers
);

function getEditHandleColor(handle: Object) {
  switch (handle.type) {
    case 'existing':
      return [0xff, 0x80, 0x00, 0xff];
    case 'snap':
      return [0x7c, 0x00, 0xc0, 0xff];
    case 'intermediate':
    default:
      return [0x0, 0x0, 0x0, 0x80];
  }
}

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
    selectionTool: ?string,
    showGeoJson: boolean
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
      selectionTool: null,
      showGeoJson: false
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
    } else if (type === 'blank') {
      this.setState({
        testFeatures: {
          type: 'FeatureCollection',
          features: []
        }
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

  _renderSnappingControls() {
    return (
      <div key="snap">
        <ToolboxRow>
          <ToolboxLabel>Enable snapping</ToolboxLabel>
          <ToolboxControl>
            <input
              type="checkbox"
              checked={Boolean(this.state.modeConfig && this.state.modeConfig.enableSnapping)}
              onChange={event => {
                const modeConfig = {
                  ...this.state.modeConfig,
                  enableSnapping: Boolean(event.target.checked)
                };
                this.setState({ modeConfig });
              }}
            />
          </ToolboxControl>
        </ToolboxRow>
      </div>
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
    if (this.state.mode === 'translate') {
      controls.push(this._renderSnappingControls());
    }

    return controls;
  }

  _renderToolBox() {
    return (
      <div style={ToolboxStyles.toolbox}>
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
        {this.state.showGeoJson && (
          <React.Fragment>
            <ToolboxLabel>
              GeoJSON{' '}
              <button onClick={() => this.setState({ showGeoJson: !this.state.showGeoJson })}>
                hide &#9650;
              </button>
            </ToolboxLabel>
            <ToolboxControl>
              <textarea
                id="geo-json-text"
                rows={5}
                style={{ width: '100%' }}
                value={JSON.stringify(this.state.testFeatures)}
                onChange={event => this.setState({ testFeatures: JSON.parse(event.target.value) })}
              />
            </ToolboxControl>
          </React.Fragment>
        )}
        {!this.state.showGeoJson && (
          <React.Fragment>
            <ToolboxLabel>
              GeoJSON{' '}
              <button onClick={() => this.setState({ showGeoJson: !this.state.showGeoJson })}>
                show &#9660;
              </button>
            </ToolboxLabel>
          </React.Fragment>
        )}
        <ToolboxDivider />
        <ToolboxRow>
          <ToolboxLabel>Load sample data</ToolboxLabel>
          <ToolboxControl>
            <button onClick={() => this._loadSample('mixed')}>Mixed</button>
            <button onClick={() => this._loadSample('complex')}>Complex</button>
            <button onClick={() => this._loadSample('blank')}>Blank</button>
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
          <ToolboxLabel>Use ElevatedEditHandleLayer</ToolboxLabel>
          <ToolboxControl>
            <input
              type="checkbox"
              checked={this.state.editHandleType === 'elevated'}
              onChange={() =>
                this.setState({
                  editHandleType: this.state.editHandleType === 'elevated' ? 'point' : 'elevated'
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

  renderStaticMap(viewport: Object) {
    return <StaticMap {...viewport} />;
  }

  customizeLayers(layers: Object[]) {}

  render() {
    const { testFeatures, selectedFeatureIndexes, mode } = this.state;
    let { modeConfig } = this.state;

    const viewport = {
      ...this.state.viewport,
      height: window.innerHeight,
      width: window.innerWidth
    };

    if (mode === 'elevation') {
      modeConfig = {
        calculateElevationChange: opts =>
          ElevationHandler.calculateElevationChangeWithViewport(viewport, opts)
      };
    } else if (mode === 'translate' && modeConfig && modeConfig.enableSnapping) {
      // Snapping can be accomplished to features that aren't rendered in the same layer
      modeConfig = {
        ...modeConfig,
        additionalSnapTargets: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-122.52235, 37.734008],
                  [-122.52217, 37.712706],
                  [-122.49436, 37.711979],
                  [-122.49725, 37.734306],
                  [-122.52235, 37.734008]
                ]
              ]
            }
          }
        ]
      };
    }

    const editableGeoJsonLayer = new EditableGeoJsonLayerImpl({
      id: 'geojson',
      data: testFeatures,
      selectedFeatureIndexes,
      modeHandlers,
      mode,
      modeConfig,
      autoHighlight: false,

      // Editing callbacks
      onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {
        let updatedSelectedFeatureIndexes = this.state.selectedFeatureIndexes;
        if (
          !['movePosition', 'extruding', 'rotating', 'translating', 'scaling'].includes(editType)
        ) {
          // Don't log edits that happen as the pointer moves since they're really chatty
          // eslint-disable-next-line
          console.log('onEdit', editType, editContext);
        }
        if (editType === 'removePosition' && !this.state.pointsRemovable) {
          // This is a simple example of custom handling of edits
          // reject the edit
          return;
        }
        if (editType === 'addFeature' && mode !== 'duplicate') {
          // TODO: once we refactor EditableGeoJsonLayer to use new EditMode interface, this check can go away
          featureIndexes = featureIndexes || editContext.featureIndexes;
          // Add the new feature to the selection
          updatedSelectedFeatureIndexes = [...this.state.selectedFeatureIndexes, ...featureIndexes];
        }
        this.setState({
          testFeatures: updatedData,
          selectedFeatureIndexes: updatedSelectedFeatureIndexes
        });
      },

      // test using icons for edit handles
      editHandleType:
        this.state.editHandleType === 'elevated'
          ? ElevatedEditHandleLayer
          : this.state.editHandleType,
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
      getEditHandleIconColor: getEditHandleColor,

      // Specify the same GeoJsonLayer props
      lineWidthMinPixels: 2,
      pointRadiusMinPixels: 5,
      getLineDashArray: () => [0, 0],

      // Accessors receive an isSelected argument
      getFillColor: (feature, isSelected) => {
        return isSelected ? [0x20, 0x40, 0x90, 0x80] : [0x20, 0x20, 0x20, 0x30];
      },
      getLineColor: (feature, isSelected) => {
        return isSelected ? [0x00, 0x20, 0x90, 0xff] : [0x20, 0x20, 0x20, 0xff];
      },

      // Can customize editing points props
      getEditHandlePointColor: getEditHandleColor,
      editHandlePointRadiusScale: 2,

      // customize tentative feature style
      getTentativeLineDashArray: () => [7, 4],
      getTentativeLineColor: () => [0x8f, 0x8f, 0x8f, 0xff],

      parameters: {
        depthTest: true,
        depthMask: false,

        blend: true,
        blendEquation: GL.FUNC_ADD,
        blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA]
      }
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

    this.customizeLayers(layers);

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <DeckGL
          viewState={viewport}
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
          onClick={this._onLayerClick}
          onViewStateChange={({ viewState }) => this.setState({ viewport: viewState })}
        >
          {this.renderStaticMap(viewport)}
        </DeckGL>
        {this._renderToolBox()}
      </div>
    );
  }
}
