/* eslint-env browser */
import * as React from 'react';
import DeckGL from '@deck.gl/react/typed';
import { MapView, MapController } from '@deck.gl/core/typed';
import StaticMap from 'react-map-gl';
import GL from '@luma.gl/constants';
import circle from '@turf/circle';

import {
  EditableGeoJsonLayer,
  SelectionLayer,
  ModifyMode,
  ResizeCircleMode,
  TranslateMode,
  TransformMode,
  ScaleMode,
  RotateMode,
  DuplicateMode,
  ExtendLineStringMode,
  SplitPolygonMode,
  ExtrudeMode,
  ElevationMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawPolygonMode,
  DrawRectangleMode,
  DrawSquareMode,
  DrawRectangleFromCenterMode,
  DrawSquareFromCenterMode,
  DrawCircleByDiameterMode,
  DrawCircleFromCenterMode,
  DrawEllipseByBoundingBoxMode,
  DrawEllipseUsingThreePointsMode,
  DrawRectangleUsingThreePointsMode,
  Draw90DegreePolygonMode,
  DrawPolygonByDraggingMode,
  MeasureDistanceMode,
  MeasureAreaMode,
  MeasureAngleMode,
  ViewMode,
  CompositeMode,
  SnappableMode,
  ElevatedEditHandleLayer,
  PathMarkerLayer,
  SELECTION_TYPE,
  GeoJsonEditMode,
  Color,
} from 'nebula.gl';

import sampleGeoJson from '../../data/sample-geojson.json';

import iconSheet from '../../data/edit-handles.png';

import {
  Toolbox,
  ToolboxControl,
  ToolboxTitle,
  ToolboxRow,
  ToolboxButton,
  ToolboxCheckbox,
} from './toolbox';

type RGBAColor = Color;
const COMPOSITE_MODE = new CompositeMode([new DrawLineStringMode(), new ModifyMode()]);

const styles = {
  mapContainer: {
    alignItems: 'stretch',
    display: 'flex',
    height: '100vh',
  },
  checkbox: {
    margin: 10,
  },
};

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 37.76,
  longitude: -122.44,
  pitch: 0,
  width: 0,
  zoom: 11,
};

const ALL_MODES: any = [
  {
    category: 'View',
    modes: [
      { label: 'View', mode: ViewMode },
      {
        label: 'Measure Distance',
        mode: MeasureDistanceMode,
      },
      { label: 'Measure Area', mode: MeasureAreaMode },
      { label: 'Measure Angle', mode: MeasureAngleMode },
    ],
  },
  {
    category: 'Draw',
    modes: [
      { label: 'Draw Point', mode: DrawPointMode },
      { label: 'Draw LineString', mode: DrawLineStringMode },
      { label: 'Draw Polygon', mode: DrawPolygonMode },
      { label: 'Draw 90° Polygon', mode: Draw90DegreePolygonMode },
      { label: 'Draw Polygon By Dragging', mode: DrawPolygonByDraggingMode },
      { label: 'Draw Rectangle', mode: DrawRectangleMode },
      { label: 'Draw Rectangle From Center', mode: DrawRectangleFromCenterMode },
      { label: 'Draw Rectangle Using 3 Points', mode: DrawRectangleUsingThreePointsMode },
      { label: 'Draw Square', mode: DrawSquareMode },
      { label: 'Draw Square From Center', mode: DrawSquareFromCenterMode },
      { label: 'Draw Circle From Center', mode: DrawCircleFromCenterMode },
      { label: 'Draw Circle By Diameter', mode: DrawCircleByDiameterMode },
      { label: 'Draw Ellipse By Bounding Box', mode: DrawEllipseByBoundingBoxMode },
      { label: 'Draw Ellipse Using 3 Points', mode: DrawEllipseUsingThreePointsMode },
    ],
  },
  {
    category: 'Alter',
    modes: [
      { label: 'Modify', mode: ModifyMode },
      { label: 'Resize Circle', mode: ResizeCircleMode },
      { label: 'Elevation', mode: ElevationMode },
      { label: 'Translate', mode: new SnappableMode(new TranslateMode()) },
      { label: 'Rotate', mode: RotateMode },
      { label: 'Scale', mode: ScaleMode },
      { label: 'Duplicate', mode: DuplicateMode },
      { label: 'Extend LineString', mode: ExtendLineStringMode },
      { label: 'Extrude', mode: ExtrudeMode },
      { label: 'Split', mode: SplitPolygonMode },
      { label: 'Transform', mode: new SnappableMode(new TransformMode()) },
    ],
  },
  {
    category: 'Composite',
    modes: [{ label: 'Draw LineString + Modify', mode: COMPOSITE_MODE }],
  },
];

const POLYGON_DRAWING_MODES = [
  DrawPolygonMode,
  Draw90DegreePolygonMode,
  DrawPolygonByDraggingMode,
  DrawRectangleMode,
  DrawRectangleFromCenterMode,
  DrawRectangleUsingThreePointsMode,
  DrawSquareMode,
  DrawSquareFromCenterMode,
  DrawCircleFromCenterMode,
  DrawCircleByDiameterMode,
  DrawEllipseByBoundingBoxMode,
  DrawEllipseUsingThreePointsMode,
];

const TWO_CLICK_POLYGON_MODES = [
  DrawRectangleMode,
  DrawSquareMode,
  DrawRectangleFromCenterMode,
  DrawSquareFromCenterMode,
  DrawCircleFromCenterMode,
  DrawCircleByDiameterMode,
  DrawEllipseByBoundingBoxMode,
];

const EMPTY_FEATURE_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

function hex2rgb(hex: string) {
  const value = parseInt(hex, 16);
  return [16, 8, 0].map((shift) => ((value >> shift) & 0xff) / 255);
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
  'CCDFE5',
].map(hex2rgb);

// TODO edit-modes:  delete once fully on EditMode implementation and just use handle.properties.editHandleType...
// Unwrap the edit handle object from either layer implementation
function getEditHandleTypeFromEitherLayer(handleOrFeature) {
  if (handleOrFeature.__source) {
    return handleOrFeature.__source.object.properties.editHandleType;
  } else if (handleOrFeature.sourceFeature) {
    return handleOrFeature.sourceFeature.feature.properties.editHandleType;
  } else if (handleOrFeature.properties) {
    return handleOrFeature.properties.editHandleType;
  }

  return handleOrFeature.type;
}

function getEditHandleColor(handle: {}): RGBAColor {
  switch (getEditHandleTypeFromEitherLayer(handle)) {
    case 'existing':
      return [0xff, 0x80, 0x00, 0xff];
    case 'snap-source':
      return [0xc0, 0x80, 0xf0, 0xff];
    case 'intermediate':
    default:
      return [0xff, 0xc0, 0x80, 0xff];
  }
}

export default class Example extends React.Component<
  {},
  {
    viewport: Record<string, any>;
    testFeatures: any;
    mode: typeof GeoJsonEditMode;
    modeConfig: any;
    pointsRemovable: boolean;
    selectedFeatureIndexes: number[];
    editHandleType: string;
    selectionTool?: string;
    showGeoJson: boolean;
    pathMarkerLayer: boolean;
    featureMenu?: {
      index: number;
      x: number;
      y: number;
    };
  }
> {
  constructor(props: {}) {
    super(props);

    this.state = {
      viewport: initialViewport,
      testFeatures: sampleGeoJson,
      mode: DrawPolygonMode,
      modeConfig: null,
      pointsRemovable: true,
      selectedFeatureIndexes: [],
      editHandleType: 'point',
      selectionTool: null,
      showGeoJson: false,
      pathMarkerLayer: false,
      featureMenu: null,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _onChangeViewport = (viewport: Record<string, any>) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
  };

  _onLayerClick = (info: any) => {
    console.log('onLayerClick', info); // eslint-disable-line
    if (this.state.mode !== ViewMode || this.state.selectionTool) {
      // don't change selection while editing
      return;
    }

    if (info) {
      console.log(`select editing feature ${info.index}`); // eslint-disable-line
      // a feature was clicked
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
        selectedFeatureIndexes: [],
      });
    } else if (type === 'complex') {
      this.setState({
        testFeatures: {
          type: 'FeatureCollection',
          features: [
            circle([-122.45, 37.81], 4, { steps: 5000 }),
            circle([-122.33, 37.81], 4, { steps: 5000 }),
            circle([-122.45, 37.73], 4, { steps: 5000 }),
            circle([-122.33, 37.73], 4, { steps: 5000 }),
          ],
        },
        selectedFeatureIndexes: [],
      });
    } else if (type === 'blank') {
      this.setState({
        testFeatures: EMPTY_FEATURE_COLLECTION,
        selectedFeatureIndexes: [],
      });
    } else if (type === 'file') {
      const el = document.createElement('input');
      el.type = 'file';
      el.onchange = (e) => {
        const eventTarget = e.target as HTMLInputElement;
        if (eventTarget.files && eventTarget.files[0]) {
          const reader = new FileReader();
          reader.onload = ({ target }) => {
            this._parseStringJson(target.result as string);
          };
          reader.readAsText(eventTarget.files[0]);
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
        (value) => {
          this._parseStringJson(value);
        },
        (reason) => {
          this._error(reason);
        }
      );
    } else {
      this._error('No navigator.clipboard');
    }
  };

  _download = () => {
    const blob = new Blob([JSON.stringify(this.state.testFeatures)], {
      type: 'octet/stream',
    });
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
          features: testFeatures,
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
    const color = FEATURE_COLORS[index % length].map((c) => c * 255).join(',');
    const alpha = selected ? 1.0 : 0.7;

    return `rgba(${color}, ${alpha})`;
  }

  _getDeckColorForFeature(index: number, bright: number, alpha: number): RGBAColor {
    const length = FEATURE_COLORS.length;
    const color = FEATURE_COLORS[index % length].map((c) => c * bright * 255);

    // @ts-ignore
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
                selectedFeatureIndexes: selectedFeatureIndexes.filter((e) => e !== index),
              });
            } else {
              this.setState({
                selectedFeatureIndexes: [...selectedFeatureIndexes, index],
              });
            }
          }}
        >
          <span
            style={{
              color: this._getHtmlColorForFeature(index, selectedFeatureIndexes.includes(index)),
            }}
          >
            {index}
            {': '}
            {featureType}
          </span>
          <a
            style={{ position: 'absolute', right: 12 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.setState({
                selectedFeatureIndexes: [index],
                featureMenu: { index, x: e.clientX, y: e.clientY },
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
      testFeatures: { features },
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
          Boolean operation
          <br />
          (requires single selection)
        </ToolboxTitle>
        <ToolboxControl>
          {operations.map((operation) => (
            <ToolboxButton
              key={operation}
              selected={
                this.state.modeConfig && this.state.modeConfig.booleanOperation === operation
              }
              onClick={() => {
                if (this.state.modeConfig && this.state.modeConfig.booleanOperation === operation) {
                  this.setState({
                    modeConfig: {
                      ...(this.state.modeConfig || {}),
                      booleanOperation: null,
                    },
                  });
                } else {
                  this.setState({
                    modeConfig: {
                      ...(this.state.modeConfig || {}),
                      booleanOperation: operation,
                    },
                  });
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

  _renderTwoClickPolygonControls() {
    return (
      <ToolboxRow key="twoClick">
        <ToolboxTitle>Drag to draw</ToolboxTitle>
        <ToolboxControl>
          <input
            type="checkbox"
            checked={Boolean(this.state.modeConfig && this.state.modeConfig.dragToDraw)}
            onChange={(event) =>
              this.setState({
                modeConfig: {
                  ...(this.state.modeConfig || {}),
                  dragToDraw: Boolean(event.target.checked),
                },
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
            onChange={(event) =>
              this.setState({
                modeConfig: { lock90Degree: Boolean(event.target.checked) },
              })
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
              onChange={(event) => {
                const modeConfig = {
                  ...this.state.modeConfig,
                  enableSnapping: Boolean(event.target.checked),
                };
                this.setState({ modeConfig });
              }}
            />
          </ToolboxControl>
        </ToolboxRow>
      </div>
    );
  }

  _renderMeasureDistanceControls() {
    return (
      <ToolboxRow key="measure-distance">
        <ToolboxTitle>Units</ToolboxTitle>
        <ToolboxControl>
          <select
            value={
              (this.state.modeConfig &&
                this.state.modeConfig.turfOptions &&
                this.state.modeConfig.turfOptions.units) ||
              'kilometers'
            }
            onChange={(event) => {
              const modeConfig = {
                ...this.state.modeConfig,
                turfOptions: { units: event.target.value },
              };
              this.setState({ modeConfig });
            }}
          >
            <option value="kilometers">kilometers</option>
            <option value="miles">miles</option>
            <option value="degrees">degrees</option>
            <option value="radians">radians</option>
          </select>
        </ToolboxControl>

        <ToolboxTitle>Center Tooltips on Line</ToolboxTitle>
        <ToolboxControl>
          <input
            type="checkbox"
            checked={Boolean(this.state.modeConfig && this.state.modeConfig.centerTooltipsOnLine)}
            onChange={(event) => {
              const modeConfig = {
                ...this.state.modeConfig,
                centerTooltipsOnLine: Boolean(event.target.checked),
              };
              this.setState({ modeConfig });
            }}
          />
        </ToolboxControl>
      </ToolboxRow>
    );
  }

  _renderDrawPolygonModeControls() {
    return (
      <ToolboxRow key="draw-polygon">
        <ToolboxTitle>Prevent overlapping lines</ToolboxTitle>
        <ToolboxControl>
          <input
            type="checkbox"
            checked={Boolean(
              this.state.modeConfig && this.state.modeConfig.preventOverlappingLines
            )}
            onChange={(event) =>
              this.setState({
                modeConfig: {
                  ...(this.state.modeConfig || {}),
                  preventOverlappingLines: Boolean(event.target.checked),
                },
              })
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
    // @ts-ignore
    if (TWO_CLICK_POLYGON_MODES.indexOf(this.state.mode) > -1) {
      controls.push(this._renderTwoClickPolygonControls());
    }
    if (this.state.mode === ModifyMode) {
      controls.push(this._renderModifyModeControls());
    }
    if (this.state.mode === SplitPolygonMode) {
      controls.push(this._renderSplitModeControls());
    }
    if (this.state.mode instanceof SnappableMode) {
      controls.push(this._renderSnappingControls());
    }
    if (this.state.mode === MeasureDistanceMode) {
      controls.push(this._renderMeasureDistanceControls());
    }
    if (this.state.mode === DrawPolygonMode) {
      controls.push(this._renderDrawPolygonModeControls());
    }

    return controls;
  }

  _renderToolBox() {
    return (
      <Toolbox>
        {ALL_MODES.map((category) => (
          <ToolboxRow key={category.category}>
            <ToolboxTitle>{category.category} Modes</ToolboxTitle>
            {category.modes.map(({ mode, label }) => (
              <ToolboxButton
                key={label}
                selected={this.state.mode === mode}
                onClick={() => {
                  this.setState({ mode, modeConfig: {}, selectionTool: null });
                }}
              >
                {label}
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
                onChange={(event) =>
                  this.setState({ testFeatures: JSON.parse(event.target.value) })
                }
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
                  editHandleType: this.state.editHandleType === 'icon' ? 'point' : 'icon',
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
                  editHandleType: this.state.editHandleType === 'elevated' ? 'point' : 'elevated',
                })
              }
            >
              Use ElevatedEditHandleLayer
            </ToolboxCheckbox>
          </ToolboxControl>

          <ToolboxControl>
            <ToolboxCheckbox
              type="checkbox"
              checked={this.state.pathMarkerLayer}
              onChange={() =>
                this.setState({
                  pathMarkerLayer: !this.state.pathMarkerLayer,
                })
              }
            >
              Use PathMarkerLayer
            </ToolboxCheckbox>
          </ToolboxControl>
        </ToolboxRow>

        <ToolboxRow>
          <ToolboxTitle>Select Features</ToolboxTitle>
          <ToolboxControl>
            <ToolboxButton
              onClick={() =>
                this.setState({
                  selectedFeatureIndexes: [],
                  selectionTool: SELECTION_TYPE.NONE,
                })
              }
            >
              Clear Selection
            </ToolboxButton>
            <ToolboxButton
              onClick={() =>
                this.setState({
                  mode: ViewMode,
                  selectionTool: SELECTION_TYPE.RECTANGLE,
                })
              }
            >
              Rect Select
            </ToolboxButton>
            <ToolboxButton
              onClick={() =>
                this.setState({
                  mode: ViewMode,
                  selectionTool: SELECTION_TYPE.POLYGON,
                })
              }
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

  renderStaticMap(viewport: Record<string, any>) {
    return <StaticMap {...viewport} mapStyle={'mapbox://styles/mapbox/dark-v10'} />;
  }

  _featureMenuClick(action: string) {
    const { index } = this.state.featureMenu || {};
    let testFeatures = this.state.testFeatures;

    if (action === 'delete') {
      const features = [...testFeatures.features];
      features.splice(index, 1);
      testFeatures = Object.assign({}, testFeatures, {
        features,
      });
    } else if (action === 'split') {
      // TODO
    } else if (action === 'info') {
      // eslint-disable-next-line
      console.log(testFeatures.features[index]);
    }

    this.setState({ featureMenu: null, testFeatures });
  }

  _renderFeatureMenu({ x, y }: { x: number; y: number }) {
    return (
      <div style={{ position: 'fixed', top: y - 40, left: x + 20 }}>
        <ToolboxButton onClick={() => this._featureMenuClick('delete')}>Delete</ToolboxButton>
        <ToolboxButton onClick={() => this._featureMenuClick('split')}>Split</ToolboxButton>
        <ToolboxButton onClick={() => this._featureMenuClick('info')}>Info</ToolboxButton>
        <ToolboxButton onClick={() => this._featureMenuClick('')}>Close</ToolboxButton>
      </div>
    );
  }

  customizeLayers(layers: Record<string, any>[]) {}

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

    if (editType === 'addFeature' && this.state.mode !== DuplicateMode) {
      const { featureIndexes } = editContext;
      // Add the new feature to the selection
      updatedSelectedFeatureIndexes = [...this.state.selectedFeatureIndexes, ...featureIndexes];
    }

    this.setState({
      testFeatures: updatedData,
      selectedFeatureIndexes: updatedSelectedFeatureIndexes,
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

    const viewport: Record<string, any> = {
      ...this.state.viewport,
      height: window.innerHeight,
      width: window.innerWidth,
    };

    if (mode === ElevationMode) {
      modeConfig = {
        ...modeConfig,
        viewport,
        calculateElevationChange: (opts) =>
          ElevationMode.calculateElevationChangeWithViewport(viewport, opts),
      };
    } else if (mode === ModifyMode) {
      modeConfig = {
        ...modeConfig,
        viewport,
        lockRectangles: true,
      };
    } else if (mode instanceof SnappableMode && modeConfig) {
      if (mode._handler instanceof TranslateMode) {
        modeConfig = {
          ...modeConfig,
          viewport,
          screenSpace: true,
        };
      }

      if (modeConfig && modeConfig.enableSnapping) {
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
                    [-122.52235, 37.734008],
                  ],
                ],
              },
            },
          ],
        };
      }
    } else if (mode === DrawPolygonByDraggingMode) {
      modeConfig = {
        ...modeConfig,
        throttleMs: 100,
      };
    }

    // Demonstrate how to override sub layer properties
    let _subLayerProps = {
      tooltips: {
        getColor: [255, 255, 255, 255],
      },
    };

    if (this.state.editHandleType === 'elevated') {
      _subLayerProps = Object.assign(_subLayerProps, {
        guides: {
          _subLayerProps: {
            points: {
              type: ElevatedEditHandleLayer,
              getFillColor: [0, 255, 0],
            },
          },
        },
      });
    }

    if (this.state.pathMarkerLayer) {
      _subLayerProps = Object.assign(_subLayerProps, {
        geojson: {
          _subLayerProps: {
            linestrings: {
              type: PathMarkerLayer,
              getMarkerColor: (x) => [255, 255, 255, 255],
              sizeScale: 1500,
            },
          },
        },
      });
    }

    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      id: 'geojson',
      data: testFeatures,
      // @ts-ignore
      selectedFeatureIndexes,
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
          mask: false,
        },
        existing: {
          x: 58,
          y: 0,
          width: 58,
          height: 58,
          mask: false,
        },
        'snap-source': {
          x: 58,
          y: 0,
          width: 58,
          height: 58,
          mask: false,
        },
        'snap-target': {
          x: 0,
          y: 0,
          width: 58,
          height: 58,
          mask: false,
        },
      },
      getEditHandleIcon: (d) => getEditHandleTypeFromEitherLayer(d),
      getEditHandleIconSize: 40,
      getEditHandleIconColor: getEditHandleColor,

      // Specify the same GeoJsonLayer props
      // lineWidthMinPixels: 2,
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
        blendFunc: [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA],
      },
    });

    const layers = [editableGeoJsonLayer];

    if (this.state.selectionTool) {
      layers.push(
        // @ts-ignore
        new SelectionLayer({
          id: 'selection',
          // @ts-ignore
          selectionType: this.state.selectionTool,
          onSelect: ({ pickingInfos }) => {
            this.setState({
              selectedFeatureIndexes: pickingInfos.map((pi) => pi.index),
            });
          },
          layerIds: ['geojson'],

          getTentativeFillColor: () => [255, 0, 255, 100],
          getTentativeLineColor: () => [0, 0, 255, 255],
          lineWidthMinPixels: 3,
        })
      );
    }

    this.customizeLayers(layers);

    return (
      <div style={styles.mapContainer}>
        <DeckGL
          viewState={viewport}
          getCursor={editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)}
          layers={layers}
          height="100%"
          width="100%"
          views={[
            new MapView({
              id: 'basemap',
              controller: {
                type: MapController,
                doubleClickZoom: false,
              },
            }),
          ]}
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
    (feature) => `${feature.geometry.type}(${getPositionCount(feature.geometry)})`
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
      return flatMap((x) => x, coordinates).length;
    case 'MultiPolygon':
      return flatMap((x) => flatMap((y) => y, x), coordinates).length;
    default:
      throw Error(`Unknown geometry type: ${type}`);
  }
}
