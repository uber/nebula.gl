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
  EditableGeoJsonLayerEditModePoc,
  SelectionLayer,
  CompositeMode,
  DrawLineStringMode,
  ModifyMode,
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
  Toolbox,
  ToolboxControl,
  ToolboxTitle,
  ToolboxRow,
  ToolboxButton,
  ToolboxCheckbox
} from './toolbox';

// TODO edit-modes: once we refactor EditableGeoJsonLayer to use new EditMode interface, this can go away
let EditableGeoJsonLayerImpl = EditableGeoJsonLayer;
let COMPOSITE_MODE;
if (
  window.location &&
  window.location.search &&
  window.location.search.indexOf('useEditModePoc') !== -1
) {
  EditableGeoJsonLayerImpl = EditableGeoJsonLayerEditModePoc;
  COMPOSITE_MODE = new CompositeMode([new DrawLineStringMode(), new ModifyMode()]);
} else {
  COMPOSITE_MODE = new CompositeModeHandler([new DrawLineStringHandler(), new ModifyHandler()]);
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

const EMPTY_FEATURE_COLLECTION = {
  type: 'FeatureCollection',
  features: []
};

const modeHandlers = Object.assign(
  {
    'drawLineString+modify': COMPOSITE_MODE
  },
  EditableGeoJsonLayerImpl.defaultProps.modeHandlers
);

function hex2rgb(hex: string) {
  const value = parseInt(hex, 16);
  return [16, 8, 0].map(shift => ((value >> shift) & 0xff) / 255);
}

const FEATURE_COLORS = [
  '00AEE4',
  'DAF0E3',
  '9BCC32',
  '07A35A',
  'F7DF90',
  'EA376C',
  '6A126A',
  'FCB09B',
  'B0592D',
  'C1B5E3',
  '9C805B',
  'CCDFE5'
].map(hex2rgb);

// TODO edit-modes:  delete once fully on EditMode implementation and just use handle.sourceFeature.feature...
// Unwrap the edit handle object from either layer implementation
function getEditHandleTypeFromEitherLayer(handleOrFeature) {
  return handleOrFeature.sourceFeature
    ? handleOrFeature.sourceFeature.feature.properties.editHandleType
    : handleOrFeature.type;
}

function getEditHandleColor(handle: {}) {
  switch (getEditHandleTypeFromEitherLayer(handle)) {
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
    showGeoJson: boolean,
    featureMenu: ?{
      index: number,
      x: number,
      y: number
    }
  }
> {
  constructor() {
    super();

    this.state = {
      viewport: initialViewport,
      testFeatures: EMPTY_FEATURE_COLLECTION,
      mode: 'drawPolygon',
      modeConfig: null,
      pointsRemovable: true,
      selectedFeatureIndexes: [],
      editHandleType: 'point',
      selectionTool: null,
      showGeoJson: false,
      featureMenu: null
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
        testFeatures: EMPTY_FEATURE_COLLECTION,
        selectedFeatureIndexes: []
      });
    } else if (type === 'file') {
      const el = document.createElement('input');
      el.type = 'file';
      el.onchange = e => {
        if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = ({ target }) => {
            this._parseStringJson(target.result);
          };
          reader.readAsText(e.target.files[0]);
        }
      };
      el.click();
    }
  };

  _copy = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(this.state.testFeatures));
    } else {
      this._error('No navigator.clipboard');
    }
  };

  _paste = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.readText().then(
        value => {
          this._parseStringJson(value);
        },
        reason => {
          this._error(reason);
        }
      );
    } else {
      this._error('No navigator.clipboard');
    }
  };

  _download = () => {
    const blob = new Blob([JSON.stringify(this.state.testFeatures)], { type: 'octet/stream' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'nebula.geojson';
    a.click();
  };

  _parseStringJson = (json: string) => {
    let testFeatures = null;
    try {
      testFeatures = JSON.parse(json);
      if (Array.isArray(testFeatures)) {
        testFeatures = {
          type: 'FeatureCollection',
          features: testFeatures
        };
      }
      // eslint-disable-next-line
      console.log('Loaded JSON:', testFeatures);
      this.setState({ testFeatures });
    } catch (err) {
      this._error(err);
    }
  };

  _error = (err: any) => {
    // eslint-disable-next-line
    alert(err);
  };

  _getHtmlColorForFeature(index: number, selected: boolean) {
    const length = FEATURE_COLORS.length;
    const color = FEATURE_COLORS[index % length].map(c => c * 255).join(',');
    const alpha = selected ? 1.0 : 0.7;

    return `rgba(${color}, ${alpha})`;
  }

  _getDeckColorForFeature(index: number, bright: number, alpha: number) {
    const length = FEATURE_COLORS.length;
    const color = FEATURE_COLORS[index % length].map(c => c * bright * 255);

    return [...color, alpha * 255];
  }

  _renderSelectFeatureCheckbox(index: number, featureType: string) {
    const { selectedFeatureIndexes } = this.state;
    return (
      <div key={index}>
        <ToolboxCheckbox
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
        >
          <span
            style={{
              color: this._getHtmlColorForFeature(index, selectedFeatureIndexes.includes(index))
            }}
          >
            {index}
            {': '}
            {featureType}
          </span>
          <a
            style={{ position: 'absolute', right: 12 }}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              this.setState({
                selectedFeatureIndexes: [index],
                featureMenu: { index, x: e.clientX, y: e.clientY }
              });
            }}
          >
            &gt;&gt;
          </a>
        </ToolboxCheckbox>
      </div>
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
        <ToolboxTitle>
          Boolean operation<br />(requires single selection)
        </ToolboxTitle>
        <ToolboxControl>
          {operations.map(operation => (
            <ToolboxButton
              key={operation}
              selected={
                this.state.modeConfig && this.state.modeConfig.booleanOperation === operation
              }
              onClick={() => {
                if (this.state.modeConfig && this.state.modeConfig.booleanOperation === operation) {
                  this.setState({ modeConfig: null });
                } else {
                  this.setState({ modeConfig: { booleanOperation: operation } });
                }
              }}
            >
              {operation}
            </ToolboxButton>
          ))}
        </ToolboxControl>
      </ToolboxRow>
    );
  }

  _renderDrawLineStringModeControls() {
    return (
      <ToolboxRow key="drawLineString">
        <ToolboxTitle>Draw LineString At Front</ToolboxTitle>
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
        <ToolboxTitle>Allow removing points</ToolboxTitle>
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
        <ToolboxTitle>Constrain to 90&deg;</ToolboxTitle>
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
          <ToolboxTitle>Enable snapping</ToolboxTitle>
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
      <Toolbox>
        {ALL_MODES.map(category => (
          <ToolboxRow key={category.category}>
            <ToolboxTitle>{category.category} Modes</ToolboxTitle>
            {category.modes.map(mode => (
              <ToolboxButton
                key={mode}
                selected={this.state.mode === mode}
                onClick={() => {
                  this.setState({ mode, modeConfig: {}, selectionTool: null });
                }}
              >
                {mode}
              </ToolboxButton>
            ))}
          </ToolboxRow>
        ))}
        {this._renderModeConfigControls()}
        {this.state.showGeoJson && (
          <React.Fragment>
            <ToolboxTitle>GeoJSON</ToolboxTitle>
            <ToolboxButton onClick={() => this.setState({ showGeoJson: !this.state.showGeoJson })}>
              hide &#9650;
            </ToolboxButton>
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
            <ToolboxTitle>GeoJSON</ToolboxTitle>
            <ToolboxButton onClick={() => this.setState({ showGeoJson: !this.state.showGeoJson })}>
              show &#9660;
            </ToolboxButton>
          </React.Fragment>
        )}
        <ToolboxButton onClick={() => this._copy()}>Copy</ToolboxButton>
        <ToolboxButton onClick={() => this._paste()}>Paste</ToolboxButton>
        <ToolboxButton onClick={() => this._download()}>Download</ToolboxButton>
        <ToolboxRow>
          <ToolboxTitle>Load data</ToolboxTitle>
          <ToolboxControl>
            <ToolboxButton onClick={() => this._loadSample('mixed')}>Mixed Sample</ToolboxButton>
            <ToolboxButton onClick={() => this._loadSample('complex')}>
              Complex Sample
            </ToolboxButton>
            <ToolboxButton onClick={() => this._loadSample('blank')}>Blank</ToolboxButton>
            <ToolboxButton onClick={() => this._loadSample('file')}>Open file...</ToolboxButton>
          </ToolboxControl>
        </ToolboxRow>

        <ToolboxRow>
          <ToolboxTitle>Options</ToolboxTitle>
          <ToolboxControl>
            <ToolboxCheckbox
              type="checkbox"
              checked={this.state.editHandleType === 'icon'}
              onChange={() =>
                this.setState({
                  editHandleType: this.state.editHandleType === 'icon' ? 'point' : 'icon'
                })
              }
            >
              Use Icons
            </ToolboxCheckbox>
          </ToolboxControl>

          <ToolboxControl>
            <ToolboxCheckbox
              type="checkbox"
              checked={this.state.editHandleType === 'elevated'}
              onChange={() =>
                this.setState({
                  editHandleType: this.state.editHandleType === 'elevated' ? 'point' : 'elevated'
                })
              }
            >
              Use ElevatedEditHandleLayer
            </ToolboxCheckbox>
          </ToolboxControl>
        </ToolboxRow>

        <ToolboxRow>
          <ToolboxTitle>Select Features</ToolboxTitle>
          <ToolboxControl>
            <ToolboxButton
              onClick={() =>
                this.setState({ selectedFeatureIndexes: [], selectionTool: SELECTION_TYPE.NONE })
              }
            >
              Clear Selection
            </ToolboxButton>
            <ToolboxButton
              onClick={() =>
                this.setState({ mode: 'view', selectionTool: SELECTION_TYPE.RECTANGLE })
              }
            >
              Rect Select
            </ToolboxButton>
            <ToolboxButton
              onClick={() => this.setState({ mode: 'view', selectionTool: SELECTION_TYPE.POLYGON })}
            >
              Lasso Select
            </ToolboxButton>
          </ToolboxControl>
        </ToolboxRow>
        <ToolboxTitle>Features</ToolboxTitle>
        <ToolboxRow>{this._renderSelectFeatureCheckboxes()}</ToolboxRow>
      </Toolbox>
    );
  }

  renderStaticMap(viewport: Object) {
    return <StaticMap {...viewport} mapStyle={'mapbox://styles/mapbox/dark-v10'} />;
  }

  _featureMenuClick(action: string) {
    const { index } = this.state.featureMenu || {};
    let testFeatures = this.state.testFeatures;

    if (action === 'delete') {
      const features = [...testFeatures.features];
      features.splice(index, 1);
      testFeatures = Object.assign({}, testFeatures, {
        features
      });
    } else if (action === 'split') {
      // TODO
    } else if (action === 'info') {
      // eslint-disable-next-line
      console.log(testFeatures.features[index]);
    }

    this.setState({ featureMenu: null, testFeatures });
  }

  _renderFeatureMenu({ x, y, index }: Object) {
    return (
      <div style={{ position: 'fixed', top: y - 40, left: x + 20 }}>
        <ToolboxButton onClick={() => this._featureMenuClick('delete')}>Delete</ToolboxButton>
        <ToolboxButton onClick={() => this._featureMenuClick('split')}>Split</ToolboxButton>
        <ToolboxButton onClick={() => this._featureMenuClick('info')}>Info</ToolboxButton>
        <ToolboxButton onClick={() => this._featureMenuClick('')}>Close</ToolboxButton>
      </div>
    );
  }

  customizeLayers(layers: Object[]) {}

  onEdit = ({ updatedData, editType, editContext }) => {
    let updatedSelectedFeatureIndexes = this.state.selectedFeatureIndexes;
    if (!['movePosition', 'extruding', 'rotating', 'translating', 'scaling'].includes(editType)) {
      // Don't log edits that happen as the pointer moves since they're really chatty
      const updatedDataInfo = featuresToInfoString(updatedData);
      // eslint-disable-next-line
      console.log('onEdit', editType, editContext, updatedDataInfo);
    }
    if (editType === 'removePosition' && !this.state.pointsRemovable) {
      // This is a simple example of custom handling of edits
      // reject the edit
      return;
    }
    if (editType === 'addFeature' && this.state.mode !== 'duplicate') {
      const { featureIndexes } = editContext;
      // Add the new feature to the selection
      updatedSelectedFeatureIndexes = [...this.state.selectedFeatureIndexes, ...featureIndexes];
    }
    this.setState({
      testFeatures: updatedData,
      selectedFeatureIndexes: updatedSelectedFeatureIndexes
    });
  };

  getFillColor = (feature, isSelected) => {
    const index = this.state.testFeatures.features.indexOf(feature);
    return isSelected
      ? this._getDeckColorForFeature(index, 1.0, 0.5)
      : this._getDeckColorForFeature(index, 0.5, 0.5);
  };

  getLineColor = (feature, isSelected) => {
    const index = this.state.testFeatures.features.indexOf(feature);
    return isSelected
      ? this._getDeckColorForFeature(index, 1.0, 1.0)
      : this._getDeckColorForFeature(index, 0.5, 1.0);
  };

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
        ...modeConfig,
        viewport,
        calculateElevationChange: opts =>
          ElevationHandler.calculateElevationChangeWithViewport(viewport, opts)
      };
    } else if (mode === 'modify') {
      modeConfig = {
        ...modeConfig,
        viewport
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

    // Demonstrate how to override sub layer properties
    let _subLayerProps = null;
    if (this.state.editHandleType === 'elevated') {
      if (EditableGeoJsonLayerImpl === EditableGeoJsonLayerEditModePoc) {
        _subLayerProps = {
          guides: {
            _subLayerProps: {
              points: {
                type: ElevatedEditHandleLayer,
                getFillColor: [0, 255, 0]
              }
            }
          }
        };
      } else {
        _subLayerProps = {
          editHandles: {
            type: ElevatedEditHandleLayer,
            getFillColor: [0, 255, 0]
          }
        };
      }
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
      onEdit: this.onEdit,

      editHandleType: this.state.editHandleType,

      // test using icons for edit handles
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
      getEditHandleIcon: d => getEditHandleTypeFromEitherLayer(d),
      getEditHandleIconSize: 40,
      getEditHandleIconColor: getEditHandleColor,

      // Specify the same GeoJsonLayer props
      lineWidthMinPixels: 2,
      pointRadiusMinPixels: 5,
      // getLineDashArray: () => [0, 0],

      // Accessors receive an isSelected argument
      getFillColor: this.getFillColor,
      getLineColor: this.getLineColor,

      // Can customize editing points props
      getEditHandlePointColor: getEditHandleColor,
      editHandlePointRadiusScale: 2,

      // customize tentative feature style
      // getTentativeLineDashArray: () => [7, 4],
      // getTentativeLineColor: () => [0x8f, 0x8f, 0x8f, 0xff],

      _subLayerProps,

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
        {this.state.featureMenu && this._renderFeatureMenu(this.state.featureMenu)}
      </div>
    );
  }
}

function featuresToInfoString(featureCollection: any): string {
  const info = featureCollection.features.map(
    feature => `${feature.geometry.type}(${getPositionCount(feature.geometry)})`
  );

  return JSON.stringify(info);
}

function getPositionCount(geometry): number {
  const flatMap = (f, arr) => arr.reduce((x, y) => [...x, ...f(y)], []);

  const { type, coordinates } = geometry;
  switch (type) {
    case 'Point':
      return 1;
    case 'LineString':
    case 'MultiPoint':
      return coordinates.length;
    case 'Polygon':
    case 'MultiLineString':
      return flatMap(x => x, coordinates).length;
    case 'MultiPolygon':
      return flatMap(x => flatMap(y => y, x), coordinates).length;
    default:
      throw Error(`Unknown geometry type: ${type}`);
  }
}
