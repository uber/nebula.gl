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
  DrawSquareFromCenterMode,
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
  drawSquareFromCenter: DrawSquareFromCenterMode,
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'fp64' does not exist on type 'CompositeL... Remove this comment to see the full error message
      fp64: this.props.fp64,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'filled' does not exist on type 'Composit... Remove this comment to see the full error message
      filled: this.props.filled,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'stroked' does not exist on type 'Composi... Remove this comment to see the full error message
      stroked: this.props.stroked,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineWidthScale' does not exist on type '... Remove this comment to see the full error message
      lineWidthScale: this.props.lineWidthScale,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineWidthMinPixels' does not exist on ty... Remove this comment to see the full error message
      lineWidthMinPixels: this.props.lineWidthMinPixels,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineWidthMaxPixels' does not exist on ty... Remove this comment to see the full error message
      lineWidthMaxPixels: this.props.lineWidthMaxPixels,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineWidthUnits' does not exist on type '... Remove this comment to see the full error message
      lineWidthUnits: this.props.lineWidthUnits,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineJointRounded' does not exist on type... Remove this comment to see the full error message
      lineJointRounded: this.props.lineJointRounded,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineMiterLimit' does not exist on type '... Remove this comment to see the full error message
      lineMiterLimit: this.props.lineMiterLimit,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'pointRadiusScale' does not exist on type... Remove this comment to see the full error message
      pointRadiusScale: this.props.pointRadiusScale,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'pointRadiusMinPixels' does not exist on ... Remove this comment to see the full error message
      pointRadiusMinPixels: this.props.pointRadiusMinPixels,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'pointRadiusMaxPixels' does not exist on ... Remove this comment to see the full error message
      pointRadiusMaxPixels: this.props.pointRadiusMaxPixels,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'getLineColor' does not exist on type 'Co... Remove this comment to see the full error message
      getLineColor: this.selectionAwareAccessor(this.props.getLineColor),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'getFillColor' does not exist on type 'Co... Remove this comment to see the full error message
      getFillColor: this.selectionAwareAccessor(this.props.getFillColor),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'getRadius' does not exist on type 'Compo... Remove this comment to see the full error message
      getRadius: this.selectionAwareAccessor(this.props.getRadius),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'getLineWidth' does not exist on type 'Co... Remove this comment to see the full error message
      getLineWidth: this.selectionAwareAccessor(this.props.getLineWidth),

      _subLayerProps: {
        'line-strings': {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'billboard' does not exist on type 'Compo... Remove this comment to see the full error message
          billboard: this.props.billboard,
        },
        'polygons-stroke': {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'billboard' does not exist on type 'Compo... Remove this comment to see the full error message
          billboard: this.props.billboard,
        },
      },

      updateTriggers: {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'selectedFeatureIndexes' does not exist o... Remove this comment to see the full error message
        getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'selectedFeatureIndexes' does not exist o... Remove this comment to see the full error message
        getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'selectedFeatureIndexes' does not exist o... Remove this comment to see the full error message
        getRadius: [this.props.selectedFeatureIndexes, this.props.mode],
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'selectedFeatureIndexes' does not exist o... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2416) FIXME: Property 'updateState' in type 'EditableGeoJsonLay... Remove this comment to see the full error message
  updateState({
    props,
    oldProps,
    changeFlags,
  }: {
    props: Props;
    oldProps: Props;
    changeFlags: any;
  }) {
    // @ts-expect-error ts-migrate(2559) FIXME: Type 'Props' has no properties in common with type... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'mode' does not exist on type 'CompositeL... Remove this comment to see the full error message
      accessor(feature, this.isFeatureSelected(feature), this.props.mode);
  }

  isFeatureSelected(feature: Record<string, any>) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'selectedFeatureIndexes' does not exist o... Remove this comment to see the full error message
    if (!this.props.data || !this.props.selectedFeatureIndexes) {
      return false;
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'selectedFeatureIndexes' does not exist o... Remove this comment to see the full error message
    if (!this.props.selectedFeatureIndexes.length) {
      return false;
    }
    const featureIndex = this.props.data.features.indexOf(feature);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'selectedFeatureIndexes' does not exist o... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'CompositeLayerProps<any>' is not... Remove this comment to see the full error message
    const guides: FeatureCollection = mode.getGuides(this.getModeProps(this.props));

    if (!guides || !guides.features.length) {
      return [];
    }

    let pointLayerProps;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'editHandleType' does not exist on type '... Remove this comment to see the full error message
    if (this.props.editHandleType === 'icon') {
      pointLayerProps = {
        type: IconLayer,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'editHandleIconAtlas' does not exist on t... Remove this comment to see the full error message
        iconAtlas: this.props.editHandleIconAtlas,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'editHandleIconMapping' does not exist on... Remove this comment to see the full error message
        iconMapping: this.props.editHandleIconMapping,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'editHandleIconSizeScale' does not exist ... Remove this comment to see the full error message
        sizeScale: this.props.editHandleIconSizeScale,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getEditHandleIcon' does not exist on typ... Remove this comment to see the full error message
        getIcon: guideAccessor(this.props.getEditHandleIcon),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getEditHandleIconSize' does not exist on... Remove this comment to see the full error message
        getSize: guideAccessor(this.props.getEditHandleIconSize),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getEditHandleIconColor' does not exist o... Remove this comment to see the full error message
        getColor: guideAccessor(this.props.getEditHandleIconColor),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getEditHandleIconAngle' does not exist o... Remove this comment to see the full error message
        getAngle: guideAccessor(this.props.getEditHandleIconAngle),
      };
    } else {
      pointLayerProps = {
        type: ScatterplotLayer,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'editHandlePointRadiusScale' does not exi... Remove this comment to see the full error message
        radiusScale: this.props.editHandlePointRadiusScale,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'editHandlePointOutline' does not exist o... Remove this comment to see the full error message
        stroked: this.props.editHandlePointOutline,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'editHandlePointStrokeWidth' does not exi... Remove this comment to see the full error message
        getLineWidth: this.props.editHandlePointStrokeWidth,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'editHandlePointRadiusMinPixels' does not... Remove this comment to see the full error message
        radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'editHandlePointRadiusMaxPixels' does not... Remove this comment to see the full error message
        radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getEditHandlePointRadius' does not exist... Remove this comment to see the full error message
        getRadius: guideAccessor(this.props.getEditHandlePointRadius),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getEditHandlePointColor' does not exist ... Remove this comment to see the full error message
        getFillColor: guideAccessor(this.props.getEditHandlePointColor),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getEditHandlePointOutlineColor' does not... Remove this comment to see the full error message
        getLineColor: guideAccessor(this.props.getEditHandlePointOutlineColor),
      };
    }

    const layer = new GeoJsonLayer(
      this.getSubLayerProps({
        id: `guides`,
        data: guides,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'fp64' does not exist on type 'CompositeL... Remove this comment to see the full error message
        fp64: this.props.fp64,
        _subLayerProps: {
          points: pointLayerProps,
        },
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineWidthScale' does not exist on type '... Remove this comment to see the full error message
        lineWidthScale: this.props.lineWidthScale,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineWidthMinPixels' does not exist on ty... Remove this comment to see the full error message
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineWidthMaxPixels' does not exist on ty... Remove this comment to see the full error message
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineWidthUnits' does not exist on type '... Remove this comment to see the full error message
        lineWidthUnits: this.props.lineWidthUnits,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineJointRounded' does not exist on type... Remove this comment to see the full error message
        lineJointRounded: this.props.lineJointRounded,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'lineMiterLimit' does not exist on type '... Remove this comment to see the full error message
        lineMiterLimit: this.props.lineMiterLimit,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getTentativeLineColor' does not exist on... Remove this comment to see the full error message
        getLineColor: guideAccessor(this.props.getTentativeLineColor),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getTentativeLineWidth' does not exist on... Remove this comment to see the full error message
        getLineWidth: guideAccessor(this.props.getTentativeLineWidth),
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getTentativeFillColor' does not exist on... Remove this comment to see the full error message
        getFillColor: guideAccessor(this.props.getTentativeFillColor),
      })
    );

    return [layer];
  }

  createTooltipsLayers() {
    const mode = this.getActiveMode();
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'CompositeLayerProps<any>' is not... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'CompositeLayerProps<any>' is not... Remove this comment to see the full error message
    this.getActiveMode().handleClick(event, this.getModeProps(this.props));
  }

  onLayerKeyUp(event: KeyboardEvent) {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'CompositeLayerProps<any>' is not... Remove this comment to see the full error message
    this.getActiveMode().handleKeyUp(event, this.getModeProps(this.props));
  }

  onStartDragging(event: StartDraggingEvent) {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'CompositeLayerProps<any>' is not... Remove this comment to see the full error message
    this.getActiveMode().handleStartDragging(event, this.getModeProps(this.props));
  }

  onDragging(event: DraggingEvent) {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'CompositeLayerProps<any>' is not... Remove this comment to see the full error message
    this.getActiveMode().handleDragging(event, this.getModeProps(this.props));
  }

  onStopDragging(event: StopDraggingEvent) {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'CompositeLayerProps<any>' is not... Remove this comment to see the full error message
    this.getActiveMode().handleStopDragging(event, this.getModeProps(this.props));
  }

  onPointerMove(event: PointerMoveEvent) {
    this.setState({ lastPointerMoveEvent: event });
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'CompositeLayerProps<any>' is not... Remove this comment to see the full error message
    this.getActiveMode().handlePointerMove(event, this.getModeProps(this.props));
  }

  getCursor({ isDragging }: { isDragging: boolean }) {
    if (this.state === null) {
      // Layer in 'Awaiting state'
      return null;
    }

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
