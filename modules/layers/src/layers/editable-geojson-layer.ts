/* eslint-env browser */

import { GeoJsonLayer, ScatterplotLayer, IconLayer, TextLayer } from '@deck.gl/layers';

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
  DrawCircleByDiameterMode,
  DrawEllipseByBoundingBoxMode,
  DrawRectangleUsingThreePointsMode,
  DrawEllipseUsingThreePointsMode,
  Draw90DegreePolygonMode,
  DrawPolygonByDraggingMode,
  SnappableMode,
  TransformMode,
  EditAction,
  ClickEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  PointerMoveEvent,
  GeoJsonEditModeType,
  GeoJsonEditModeConstructor,
  FeatureCollection,
} from '@nebula.gl/edit-modes';

import EditableLayer from './editable-layer';

const DEFAULT_LINE_COLOR = [0x0, 0x0, 0x0, 0x99];
const DEFAULT_FILL_COLOR = [0x0, 0x0, 0x0, 0x90];
const DEFAULT_SELECTED_LINE_COLOR = [0x0, 0x0, 0x0, 0xff];
const DEFAULT_SELECTED_FILL_COLOR = [0x0, 0x0, 0x90, 0x90];
const DEFAULT_TENTATIVE_LINE_COLOR = [0x90, 0x90, 0x90, 0xff];
const DEFAULT_TENTATIVE_FILL_COLOR = [0x90, 0x90, 0x90, 0x90];
const DEFAULT_EDITING_EXISTING_POINT_COLOR = [0xc0, 0x0, 0x0, 0xff];
const DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR = [0x0, 0x0, 0x0, 0x80];
const DEFAULT_EDITING_SNAP_POINT_COLOR = [0x7c, 0x00, 0xc0, 0xff];
const DEFAULT_EDITING_POINT_OUTLINE_COLOR = [0xff, 0xff, 0xff, 0xff];
const DEFAULT_EDITING_EXISTING_POINT_RADIUS = 5;
const DEFAULT_EDITING_INTERMEDIATE_POINT_RADIUS = 3;
const DEFAULT_EDITING_SNAP_POINT_RADIUS = 7;

const DEFAULT_EDIT_MODE = DrawPolygonMode;

function guideAccessor(accessor) {
  if (!accessor || typeof accessor !== 'function') {
    return accessor;
  }
  return (guideMaybeWrapped) => accessor(unwrapGuide(guideMaybeWrapped));
}

// The object handed to us from deck.gl is different depending on the version of deck.gl used, unwrap as necessary
function unwrapGuide(guideMaybeWrapped) {
  if (guideMaybeWrapped.__source) {
    return guideMaybeWrapped.__source.object;
  } else if (guideMaybeWrapped.sourceFeature) {
    return guideMaybeWrapped.sourceFeature.feature;
  }
  // It is not wrapped, return as is
  return guideMaybeWrapped;
}

function getEditHandleColor(handle) {
  switch (handle.properties.editHandleType) {
    case 'existing':
      return DEFAULT_EDITING_EXISTING_POINT_COLOR;
    case 'snap-source':
      return DEFAULT_EDITING_SNAP_POINT_COLOR;
    case 'intermediate':
    default:
      return DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR;
  }
}

function getEditHandleOutlineColor(handle) {
  return DEFAULT_EDITING_POINT_OUTLINE_COLOR;
}

function getEditHandleRadius(handle) {
  switch (handle.properties.editHandleType) {
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
  mode: DEFAULT_EDIT_MODE,

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
  lineWidthUnits: 'pixels',
  lineJointRounded: false,
  lineMiterLimit: 4,
  pointRadiusScale: 1,
  pointRadiusMinPixels: 2,
  pointRadiusMaxPixels: Number.MAX_SAFE_INTEGER,
  getLineColor: (feature, isSelected, mode) =>
    isSelected ? DEFAULT_SELECTED_LINE_COLOR : DEFAULT_LINE_COLOR,
  getFillColor: (feature, isSelected, mode) =>
    isSelected ? DEFAULT_SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR,
  getRadius: (f) =>
    (f && f.properties && f.properties.radius) || (f && f.properties && f.properties.size) || 1,
  getLineWidth: (f) => (f && f.properties && f.properties.lineWidth) || 3,

  // Tentative feature rendering
  getTentativeLineColor: (f) => DEFAULT_TENTATIVE_LINE_COLOR,
  getTentativeFillColor: (f) => DEFAULT_TENTATIVE_FILL_COLOR,
  getTentativeLineWidth: (f) => (f && f.properties && f.properties.lineWidth) || 3,

  editHandleType: 'point',

  // point handles
  editHandlePointRadiusScale: 1,
  editHandlePointOutline: true,
  editHandlePointStrokeWidth: 2,
  editHandlePointRadiusMinPixels: 4,
  editHandlePointRadiusMaxPixels: 8,
  getEditHandlePointColor: getEditHandleColor,
  getEditHandlePointOutlineColor: getEditHandleOutlineColor,
  getEditHandlePointRadius: getEditHandleRadius,

  // icon handles
  editHandleIconAtlas: null,
  editHandleIconMapping: null,
  editHandleIconSizeScale: 1,
  getEditHandleIcon: (handle) => handle.properties.editHandleType,
  getEditHandleIconSize: 10,
  getEditHandleIconColor: getEditHandleColor,
  getEditHandleIconAngle: 0,

  // misc
  billboard: true,
};

// Mapping of mode name to mode class (for legacy purposes)
const modeNameMapping = {
  view: ViewMode,

  // Alter modes
  modify: ModifyMode,
  translate: new SnappableMode(new TranslateMode()),

  transform: new SnappableMode(new TransformMode()),
  scale: ScaleMode,
  rotate: RotateMode,
  duplicate: DuplicateMode,
  split: SplitPolygonMode,
  extrude: ExtrudeMode,
  elevation: ElevationMode,

  // Draw modes
  drawPoint: DrawPointMode,
  drawLineString: DrawLineStringMode,
  drawPolygon: DrawPolygonMode,
  drawRectangle: DrawRectangleMode,
  drawCircleFromCenter: DrawCircleFromCenterMode,
  drawCircleByBoundingBox: DrawCircleByDiameterMode,
  drawEllipseByBoundingBox: DrawEllipseByBoundingBoxMode,
  drawRectangleUsing3Points: DrawRectangleUsingThreePointsMode,
  drawEllipseUsing3Points: DrawEllipseUsingThreePointsMode,
  draw90DegreePolygon: Draw90DegreePolygonMode,
  drawPolygonByDragging: DrawPolygonByDraggingMode,
};

type Props = {
  mode: string | GeoJsonEditModeConstructor | GeoJsonEditModeType;
  onEdit: (arg0: EditAction<FeatureCollection>) => void;
  // TODO: type the rest

  [key: string]: any;
};

// type State = {
//   mode: GeoJsonEditMode,
//   tentativeFeature: ?Feature,
//   editHandles: any[],
//   selectedFeatures: Feature[]
// };

export default class EditableGeoJsonLayer extends EditableLayer {
  static layerName = 'EditableGeoJsonLayer';
  static defaultProps = defaultProps;
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
      getLineColor: this.selectionAwareAccessor(this.props.getLineColor),
      getFillColor: this.selectionAwareAccessor(this.props.getFillColor),
      getRadius: this.selectionAwareAccessor(this.props.getRadius),
      getLineWidth: this.selectionAwareAccessor(this.props.getLineWidth),

      _subLayerProps: {
        'line-strings': {
          billboard: this.props.billboard,
        },
        'polygons-stroke': {
          billboard: this.props.billboard,
        },
      },

      updateTriggers: {
        getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getRadius: [this.props.selectedFeatureIndexes, this.props.mode],
        getLineWidth: [this.props.selectedFeatureIndexes, this.props.mode],
      },
    });

    let layers: any = [new GeoJsonLayer(subLayerProps)];

    layers = layers.concat(this.createGuidesLayers(), this.createTooltipsLayers());

    return layers;
  }

  initializeState() {
    super.initializeState();

    this.setState({
      selectedFeatures: [],
      editHandles: [],
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
    changeFlags,
  }: {
    props: Props;
    oldProps: Props;
    changeFlags: any;
  }) {
    // @ts-ignore
    super.updateState({ oldProps, props, changeFlags });

    if (changeFlags.propsOrDataChanged) {
      const modePropChanged = Object.keys(oldProps).length === 0 || props.mode !== oldProps.mode;
      if (modePropChanged) {
        let mode;
        if (typeof props.mode === 'function') {
          // They passed a constructor/class, so new it up
          const ModeConstructor = props.mode;
          mode = new ModeConstructor();
        } else if (typeof props.mode === 'string') {
          // Lookup the mode based on its name (for backwards compatibility)
          mode = modeNameMapping[props.mode];
          // eslint-disable-next-line no-console
          console.warn(
            "Deprecated use of passing `mode` as a string. Pass the mode's class constructor instead."
          );
        } else {
          // Should be an instance of EditMode in this case
          mode = props.mode;
        }

        if (!mode) {
          console.warn(`No mode configured for ${String(props.mode)}`); // eslint-disable-line no-console,no-undef
          // Use default mode
          mode = new DEFAULT_EDIT_MODE();
        }

        if (mode !== this.state.mode) {
          this.setState({ mode, cursor: null });
        }
      }
    }

    let selectedFeatures = [];
    if (Array.isArray(props.selectedFeatureIndexes)) {
      // TODO: needs improved testing, i.e. checking for duplicates, NaNs, out of range numbers, ...
      selectedFeatures = props.selectedFeatureIndexes.map((elem) => props.data.features[elem]);
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
        // Force a re-render
        // This supports double-click where we need to ensure that there's a re-render between the two clicks
        // even though the data wasn't changed, just the internal tentative feature.
        this.setNeedsUpdate();
        props.onEdit(editAction);
      },
      onUpdateCursor: (cursor: string | null | undefined) => {
        this.setState({ cursor });
      },
    };
  }

  selectionAwareAccessor(accessor: any) {
    if (typeof accessor !== 'function') {
      return accessor;
    }
    return (feature: Record<string, any>) =>
      accessor(feature, this.isFeatureSelected(feature), this.props.mode);
  }

  isFeatureSelected(feature: Record<string, any>) {
    if (!this.props.data || !this.props.selectedFeatureIndexes) {
      return false;
    }
    if (!this.props.selectedFeatureIndexes.length) {
      return false;
    }
    const featureIndex = this.props.data.features.indexOf(feature);
    return this.props.selectedFeatureIndexes.includes(featureIndex);
  }

  getPickingInfo({ info, sourceLayer }: Record<string, any>) {
    if (sourceLayer.id.endsWith('guides')) {
      // If user is picking an editing handle, add additional data to the info
      info.isGuide = true;
    }

    return info;
  }

  createGuidesLayers() {
    const mode = this.getActiveMode();
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
        getIcon: guideAccessor(this.props.getEditHandleIcon),
        getSize: guideAccessor(this.props.getEditHandleIconSize),
        getColor: guideAccessor(this.props.getEditHandleIconColor),
        getAngle: guideAccessor(this.props.getEditHandleIconAngle),
      };
    } else {
      pointLayerProps = {
        type: ScatterplotLayer,
        radiusScale: this.props.editHandlePointRadiusScale,
        stroked: this.props.editHandlePointOutline,
        getLineWidth: this.props.editHandlePointStrokeWidth,
        radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
        radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
        getRadius: guideAccessor(this.props.getEditHandlePointRadius),
        getFillColor: guideAccessor(this.props.getEditHandlePointColor),
        getLineColor: guideAccessor(this.props.getEditHandlePointOutlineColor),
      };
    }

    const layer = new GeoJsonLayer(
      this.getSubLayerProps({
        id: `guides`,
        data: guides,
        fp64: this.props.fp64,
        _subLayerProps: {
          points: pointLayerProps,
        },
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineWidthUnits: this.props.lineWidthUnits,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        getLineColor: guideAccessor(this.props.getTentativeLineColor),
        getLineWidth: guideAccessor(this.props.getTentativeLineWidth),
        getFillColor: guideAccessor(this.props.getTentativeFillColor),
      })
    );

    return [layer];
  }

  createTooltipsLayers() {
    const mode = this.getActiveMode();
    const tooltips = mode.getTooltips(this.getModeProps(this.props));

    const layer = new TextLayer(
      this.getSubLayerProps({
        id: `tooltips`,
        data: tooltips,
      })
    );

    return [layer];
  }

  onLayerClick(event: ClickEvent) {
    this.getActiveMode().handleClick(event, this.getModeProps(this.props));
  }

  onLayerKeyUp(event: KeyboardEvent) {
    this.getActiveMode().handleKeyUp(event, this.getModeProps(this.props));
  }

  onStartDragging(event: StartDraggingEvent) {
    this.getActiveMode().handleStartDragging(event, this.getModeProps(this.props));
  }

  onDragging(event: DraggingEvent) {
    this.getActiveMode().handleDragging(event, this.getModeProps(this.props));
  }

  onStopDragging(event: StopDraggingEvent) {
    this.getActiveMode().handleStopDragging(event, this.getModeProps(this.props));
  }

  onPointerMove(event: PointerMoveEvent) {
    this.setState({ lastPointerMoveEvent: event });
    this.getActiveMode().handlePointerMove(event, this.getModeProps(this.props));
  }

  getCursor({ isDragging }: { isDragging: boolean }) {
    let { cursor } = this.state;
    if (!cursor) {
      // default cursor
      cursor = isDragging ? 'grabbing' : 'grab';
    }
    return cursor;
  }

  getActiveMode(): GeoJsonEditModeType {
    return this.state.mode;
  }
}
