// @flow
/* eslint-env browser */

import { GeoJsonLayer, ScatterplotLayer, IconLayer } from '@deck.gl/layers';

import {
  ViewMode,
  ModifyMode,
  TranslateMode,
  ScaleMode,
  RotateMode,
  DuplicateMode,
  SplitPolygonMode,
  ExtrudeMode,
  ElevationMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawPolygonMode,
  DrawRectangleMode,
  DrawCircleFromCenterMode,
  DrawCircleByBoundingBoxMode,
  DrawEllipseByBoundingBoxMode,
  DrawRectangleUsingThreePointsMode,
  DrawEllipseUsingThreePointsMode,
  Draw90DegreePolygonMode,
  SnappableMode
} from '@nebula.gl/edit-modes';

import type {
  EditAction,
  ClickEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  PointerMoveEvent,
  GeoJsonEditMode,
  FeatureCollection
} from '@nebula.gl/edit-modes';
import EditableLayer from './editable-layer-edit-mode-poc.js';

const DEFAULT_LINE_COLOR = [0x0, 0x0, 0x0, 0xff];
const DEFAULT_FILL_COLOR = [0x0, 0x0, 0x0, 0x90];
const DEFAULT_SELECTED_LINE_COLOR = [0x90, 0x90, 0x90, 0xff];
const DEFAULT_SELECTED_FILL_COLOR = [0x90, 0x90, 0x90, 0x90];
const DEFAULT_EDITING_EXISTING_POINT_COLOR = [0xc0, 0x0, 0x0, 0xff];
const DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR = [0x0, 0x0, 0x0, 0x80];
const DEFAULT_EDITING_SNAP_POINT_COLOR = [0x7c, 0x00, 0xc0, 0xff];
const DEFAULT_EDITING_EXISTING_POINT_RADIUS = 5;
const DEFAULT_EDITING_INTERMEDIATE_POINT_RADIUS = 3;
const DEFAULT_EDITING_SNAP_POINT_RADIUS = 7;

const DEFAULT_EDIT_MODE = new ViewMode();

function getEditHandleColor(handle) {
  switch (handle.sourceFeature.feature.properties.editHandleType) {
    case 'existing':
      return DEFAULT_EDITING_EXISTING_POINT_COLOR;
    case 'snap':
      return DEFAULT_EDITING_SNAP_POINT_COLOR;
    case 'intermediate':
    default:
      return DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR;
  }
}

function getEditHandleRadius(handle) {
  switch (handle.sourceFeature.feature.properties.editHandleType) {
    case 'existing':
      return DEFAULT_EDITING_EXISTING_POINT_RADIUS;
    case 'snap':
      return DEFAULT_EDITING_SNAP_POINT_RADIUS;
    case 'intermediate':
    default:
      return DEFAULT_EDITING_INTERMEDIATE_POINT_RADIUS;
  }
}

const defaultProps = {
  mode: 'modify',

  // Edit and interaction events
  onEdit: () => {},

  pickable: true,
  pickingRadius: 10,
  pickingDepth: 5,
  fp64: false,
  filled: true,
  stroked: true,
  lineWidthScale: 1,
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
  lineWidthUnits: 'meters',
  lineJointRounded: false,
  lineMiterLimit: 4,
  pointRadiusScale: 1,
  pointRadiusMinPixels: 2,
  pointRadiusMaxPixels: Number.MAX_SAFE_INTEGER,
  lineDashJustified: false,
  getLineColor: (feature, isSelected, mode) =>
    isSelected ? DEFAULT_SELECTED_LINE_COLOR : DEFAULT_LINE_COLOR,
  getFillColor: (feature, isSelected, mode) =>
    isSelected ? DEFAULT_SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR,
  getRadius: f =>
    (f && f.properties && f.properties.radius) || (f && f.properties && f.properties.size) || 1,
  getLineWidth: f => (f && f.properties && f.properties.lineWidth) || 1,
  getLineDashArray: (feature, isSelected, mode) =>
    isSelected && mode !== 'view' ? [7, 4] : [0, 0],

  // Tentative feature rendering
  getTentativeLineDashArray: (f, mode) => [7, 4],
  getTentativeLineColor: (f, mode) => DEFAULT_SELECTED_LINE_COLOR,
  getTentativeFillColor: (f, mode) => DEFAULT_SELECTED_FILL_COLOR,
  getTentativeLineWidth: (f, mode) => (f && f.properties && f.properties.lineWidth) || 1,

  editHandleType: 'point',

  // point handles
  editHandlePointRadiusScale: 1,
  editHandlePointOutline: false,
  editHandlePointStrokeWidth: 1,
  editHandlePointRadiusMinPixels: 4,
  editHandlePointRadiusMaxPixels: 8,
  getEditHandlePointColor: getEditHandleColor,
  getEditHandlePointRadius: getEditHandleRadius,

  // icon handles
  editHandleIconAtlas: null,
  editHandleIconMapping: null,
  editHandleIconSizeScale: 1,
  getEditHandleIcon: handle => handle.sourceFeature.feature.properties.editHandleType,
  getEditHandleIconSize: 10,
  getEditHandleIconColor: getEditHandleColor,
  getEditHandleIconAngle: 0,

  // misc
  billboard: true,

  // Mode handlers
  modeHandlers: {
    view: new ViewMode(),

    // Alter modes
    modify: new ModifyMode(),
    translate: new SnappableMode(new TranslateMode()),
    scale: new ScaleMode(),
    rotate: new RotateMode(),
    duplicate: new DuplicateMode(),
    split: new SplitPolygonMode(),
    extrude: new ExtrudeMode(),
    elevation: new ElevationMode(),

    // Draw modes
    drawPoint: new DrawPointMode(),
    drawLineString: new DrawLineStringMode(),
    drawPolygon: new DrawPolygonMode(),
    drawRectangle: new DrawRectangleMode(),
    drawCircleFromCenter: new DrawCircleFromCenterMode(),
    drawCircleByBoundingBox: new DrawCircleByBoundingBoxMode(),
    drawEllipseByBoundingBox: new DrawEllipseByBoundingBoxMode(),
    drawRectangleUsing3Points: new DrawRectangleUsingThreePointsMode(),
    drawEllipseUsing3Points: new DrawEllipseUsingThreePointsMode(),
    draw90DegreePolygon: new Draw90DegreePolygonMode()
  }
};

type Props = {
  mode: string,
  modeHandlers: { [mode: string]: GeoJsonEditMode },
  onEdit: (EditAction<FeatureCollection>) => void,
  // TODO: type the rest
  [string]: any
};

// type State = {
//   modeHandler: EditableFeatureCollection,
//   tentativeFeature: ?Feature,
//   editHandles: any[],
//   selectedFeatures: Feature[]
// };

// eslint-disable-next-line camelcase
export default class EditableGeoJsonLayer_EDIT_MODE_POC extends EditableLayer {
  // state: State;
  // props: Props;
  // setState: ($Shape<State>) => void;

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
      lineWidthUnits: this.props.lineWidthUnits,
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

      _subLayerProps: {
        'line-strings': {
          billboard: this.props.billboard
        },
        'polygons-stroke': {
          billboard: this.props.billboard
        }
      },

      updateTriggers: {
        getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getRadius: [this.props.selectedFeatureIndexes, this.props.mode],
        getLineWidth: [this.props.selectedFeatureIndexes, this.props.mode],
        getLineDashArray: [this.props.selectedFeatureIndexes, this.props.mode]
      }
    });

    let layers: any = [new GeoJsonLayer(subLayerProps)];

    layers = layers.concat(this.createGuidesLayers());

    return layers;
  }

  initializeState() {
    super.initializeState();

    this.setState({
      selectedFeatures: [],
      editHandles: []
    });
  }

  // TODO: is this the best way to properly update state from an outside event handler?
  shouldUpdateState(opts: any) {
    // console.log(
    //   'shouldUpdateState',
    //   opts.changeFlags.propsOrDataChanged,
    //   opts.changeFlags.stateChanged
    // );
    return super.shouldUpdateState(opts) || opts.changeFlags.stateChanged;
  }

  updateState({
    props,
    oldProps,
    changeFlags
  }: {
    props: Props,
    oldProps: Props,
    changeFlags: any
  }) {
    super.updateState({ props, changeFlags });

    let modeHandler: GeoJsonEditMode = this.state.modeHandler;
    if (changeFlags.propsOrDataChanged) {
      if (props.modeHandlers !== oldProps.modeHandlers || props.mode !== oldProps.mode) {
        modeHandler = props.modeHandlers[props.mode];

        if (!modeHandler) {
          console.warn(`No handler configured for mode ${props.mode}`); // eslint-disable-line no-console,no-undef
          // Use default mode handler
          modeHandler = DEFAULT_EDIT_MODE;
        }

        if (modeHandler !== this.state.modeHandler) {
          this.setState({ modeHandler, cursor: null });
        }
      }
    }

    let selectedFeatures = [];
    if (Array.isArray(props.selectedFeatureIndexes)) {
      // TODO: needs improved testing, i.e. checking for duplicates, NaNs, out of range numbers, ...
      selectedFeatures = props.selectedFeatureIndexes.map(elem => props.data.features[elem]);
    }

    this.setState({ selectedFeatures });
  }

  getModeProps(props: Props) {
    return {
      modeConfig: props.modeConfig,
      data: props.data,
      selectedIndexes: props.selectedFeatureIndexes,
      lastPointerMoveEvent: this.state.lastPointerMoveEvent,
      cursor: this.state.cursor,
      onEdit: (editAction: EditAction<FeatureCollection>) => {
        props.onEdit(editAction);
      },
      onUpdateCursor: (cursor: ?string) => {
        this.setState({ cursor });
      }
    };
  }

  selectionAwareAccessor(accessor: any) {
    if (typeof accessor !== 'function') {
      return accessor;
    }
    return (feature: Object) => accessor(feature, this.isFeatureSelected(feature), this.props.mode);
  }

  isFeatureSelected(feature: Object) {
    if (!this.props.data || !this.props.selectedFeatureIndexes) {
      return false;
    }
    if (!this.props.selectedFeatureIndexes.length) {
      return false;
    }
    const featureIndex = this.props.data.features.indexOf(feature);
    return this.props.selectedFeatureIndexes.includes(featureIndex);
  }

  getPickingInfo({ info, sourceLayer }: Object) {
    if (sourceLayer.id.endsWith('guides')) {
      // If user is picking an editing handle, add additional data to the info
      info.isGuide = true;
    }

    return info;
  }

  createGuidesLayers() {
    const mode = this.props.modeHandlers[this.props.mode] || DEFAULT_EDIT_MODE;
    const guides: FeatureCollection = mode.getGuides(this.getModeProps(this.props));

    if (!guides || !guides.features.length) {
      return [];
    }

    let pointLayerProps;
    if (this.props.editHandleType === 'icon') {
      pointLayerProps = {
        type: IconLayer,
        iconAtlas: this.props.editHandleIconAtlas,
        iconMapping: this.props.editHandleIconMapping,
        sizeScale: this.props.editHandleIconSizeScale,
        getIcon: this.props.getEditHandleIcon,
        getSize: this.props.getEditHandleIconSize,
        getColor: this.props.getEditHandleIconColor,
        getAngle: this.props.getEditHandleIconAngle
      };
    } else {
      pointLayerProps = {
        type: ScatterplotLayer,
        radiusScale: this.props.editHandlePointRadiusScale,
        stroked: this.props.editHandlePointOutline,
        getLineWidth: this.props.editHandlePointStrokeWidth,
        radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
        radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
        getRadius: this.props.getEditHandlePointRadius,
        getFillColor: this.props.getEditHandlePointColor,
        getlineColor: this.props.getEditHandlePointColor
      };
    }

    const layer = new GeoJsonLayer(
      this.getSubLayerProps({
        id: `guides`,
        data: guides,
        fp64: this.props.fp64,
        _subLayerProps: {
          points: pointLayerProps
        },
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineWidthUnits: this.props.lineWidthUnits,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        getLineColor: this.props.getTentativeLineColor,
        getLineWidth: this.props.getTentativeLineWidth,
        getFillColor: this.props.getTentativeFillColor,
        getLineDashArray: this.props.getTentativeLineDashArray
      })
    );

    return [layer];
  }

  onLayerClick(event: ClickEvent) {
    this.getActiveModeHandler().handleClick(event, this.getModeProps(this.props));
  }

  onStartDragging(event: StartDraggingEvent) {
    this.getActiveModeHandler().handleStartDragging(event, this.getModeProps(this.props));
  }

  onStopDragging(event: StopDraggingEvent) {
    this.getActiveModeHandler().handleStopDragging(event, this.getModeProps(this.props));
  }

  onPointerMove(event: PointerMoveEvent) {
    this.setState({ lastPointerMoveEvent: event });
    this.getActiveModeHandler().handlePointerMove(event, this.getModeProps(this.props));
  }

  getCursor({ isDragging }: { isDragging: boolean }) {
    let { cursor } = this.state;
    if (!cursor) {
      cursor = isDragging ? 'grabbing' : 'grab';
    }
    return cursor;
  }

  getActiveModeHandler(): GeoJsonEditMode {
    return this.state.modeHandler;
  }
}

// eslint-disable-next-line camelcase
EditableGeoJsonLayer_EDIT_MODE_POC.layerName = 'EditableGeoJsonLayer_EDIT_MODE_POC';
// eslint-disable-next-line camelcase
EditableGeoJsonLayer_EDIT_MODE_POC.defaultProps = defaultProps;
