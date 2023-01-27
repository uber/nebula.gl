/* eslint-env browser */

import type { UpdateParameters, DefaultProps } from '@deck.gl/core/typed';
import { GeoJsonLayer, ScatterplotLayer, IconLayer, TextLayer } from '@deck.gl/layers/typed';
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
  DrawSquareMode,
  DrawRectangleFromCenterMode,
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
  FeatureCollection,
} from '@nebula.gl/edit-modes';

import { Color } from '../types';
import { PROJECTED_PIXEL_SIZE_MULTIPLIER } from '../constants';

import EditableLayer, { EditableLayerProps } from './editable-layer';
import EditablePathLayer from './editable-path-layer';

const DEFAULT_LINE_COLOR: Color = [0x0, 0x0, 0x0, 0x99];
const DEFAULT_FILL_COLOR: Color = [0x0, 0x0, 0x0, 0x90];
const DEFAULT_SELECTED_LINE_COLOR: Color = [0x0, 0x0, 0x0, 0xff];
const DEFAULT_SELECTED_FILL_COLOR: Color = [0x0, 0x0, 0x90, 0x90];
const DEFAULT_TENTATIVE_LINE_COLOR: Color = [0x90, 0x90, 0x90, 0xff];
const DEFAULT_TENTATIVE_FILL_COLOR: Color = [0x90, 0x90, 0x90, 0x90];
const DEFAULT_EDITING_EXISTING_POINT_COLOR: Color = [0xc0, 0x0, 0x0, 0xff];
const DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR: Color = [0x0, 0x0, 0x0, 0x80];
const DEFAULT_EDITING_SNAP_POINT_COLOR: Color = [0x7c, 0x00, 0xc0, 0xff];
const DEFAULT_EDITING_POINT_OUTLINE_COLOR: Color = [0xff, 0xff, 0xff, 0xff];
const DEFAULT_EDITING_EXISTING_POINT_RADIUS = 5;
const DEFAULT_EDITING_INTERMEDIATE_POINT_RADIUS = 3;
const DEFAULT_EDITING_SNAP_POINT_RADIUS = 7;
const DEFAULT_TOOLTIP_FONT_SIZE = 32 * PROJECTED_PIXEL_SIZE_MULTIPLIER;

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

export type EditableGeojsonLayerProps<DataT = any> = EditableLayerProps<DataT> & {
  mode?: any;
  modeConfig?: any;
  selectedFeatureIndexes?: number[];
  onEdit?: (updatedData?, editType?: string, featureIndexes?: number[], editContext?) => void;

  pickable?: boolean;
  pickingRadius?: number;
  pickingDepth?: number;
  fp64?: boolean;
  filled?: boolean;
  stroked?: boolean;
  lineWidthScale?: number;
  lineWidthMinPixels?: number;
  lineWidthMaxPixels?: number;
  pickingLineWidthExtraPixels?: number;
  lineWidthUnits?: string;
  lineJointRounded?: boolean;
  lineCapRounded?: boolean;
  lineMiterLimit?: number;
  pointRadiusScale?: number;
  pointRadiusMinPixels?: number;
  pointRadiusMaxPixels?: number;

  getLineColor?: Color | ((feature, isSelected, mode) => Color);
  getFillColor?: Color | ((feature, isSelected, mode) => Color);
  getRadius?: number | ((f) => number);
  getLineWidth?: number | ((f) => number);

  getTentativeLineColor?: Color | ((feature, isSelected, mode) => Color);
  getTentativeFillColor?: Color | ((feature, isSelected, mode) => Color);
  getTentativeLineWidth?: number | ((f) => number);

  editHandleType?: string;

  editHandlePointRadiusScale?: number;
  editHandlePointOutline?: boolean;
  editHandlePointStrokeWidth?: number;
  editHandlePointRadiusUnits?: string;
  editHandlePointRadiusMinPixels?: number;
  editHandlePointRadiusMaxPixels?: number;
  getEditHandlePointColor?: Color | ((handle) => Color);
  getEditHandlePointOutlineColor?: Color | ((handle) => Color);
  getEditHandlePointRadius?: number | ((handle) => number);

  // icon handles
  editHandleIconAtlas?: any;
  editHandleIconMapping?: any;
  editHandleIconSizeScale?: number;
  editHandleIconSizeUnits?: string;
  getEditHandleIcon?: (handle) => string;
  getEditHandleIconSize?: number;
  getEditHandleIconColor?: Color | ((handle) => Color);
  getEditHandleIconAngle?: number | ((handle) => number);

  // misc
  billboard?: boolean;
};

const defaultProps: DefaultProps<EditableGeojsonLayerProps<any>> = {
  mode: DEFAULT_EDIT_MODE,

  // Edit and interaction events
  onEdit: () => {},

  pickable: true,
  pickingRadius: 10,
  pickingDepth: 5,
  fp64: false,
  filled: true,
  stroked: true,
  lineWidthScale: PROJECTED_PIXEL_SIZE_MULTIPLIER,
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
  pickingLineWidthExtraPixels: 0,
  lineWidthUnits: 'pixels',
  lineJointRounded: false,
  lineCapRounded: false,
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
  editHandlePointRadiusUnits: 'pixels',
  editHandlePointRadiusMinPixels: 4,
  editHandlePointRadiusMaxPixels: 8,
  getEditHandlePointColor: getEditHandleColor,
  getEditHandlePointOutlineColor: getEditHandleOutlineColor,
  getEditHandlePointRadius: getEditHandleRadius,

  // icon handles
  editHandleIconAtlas: null,
  editHandleIconMapping: null,
  editHandleIconSizeScale: 1,
  editHandleIconSizeUnits: 'pixels',
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
  drawSquare: DrawSquareMode,
  drawRectangleFromCenter: DrawRectangleFromCenterMode,
  drawSquareFromCenter: DrawSquareFromCenterMode,
  drawCircleFromCenter: DrawCircleFromCenterMode,
  drawCircleByBoundingBox: DrawCircleByDiameterMode,
  drawEllipseByBoundingBox: DrawEllipseByBoundingBoxMode,
  drawRectangleUsing3Points: DrawRectangleUsingThreePointsMode,
  drawEllipseUsing3Points: DrawEllipseUsingThreePointsMode,
  draw90DegreePolygon: Draw90DegreePolygonMode,
  drawPolygonByDragging: DrawPolygonByDraggingMode,
};

// type State = {
//   mode: GeoJsonEditMode,
//   tentativeFeature: ?Feature,
//   editHandles: any[],
//   selectedFeatures: Feature[]
// };

export default class EditableGeoJsonLayer extends EditableLayer<
  FeatureCollection,
  EditableGeojsonLayerProps<FeatureCollection>
> {
  static layerName = 'EditableGeoJsonLayer';
  static defaultProps = defaultProps;

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
      lineCapRounded: this.props.lineCapRounded,
      lineMiterLimit: this.props.lineMiterLimit,
      pointRadiusScale: this.props.pointRadiusScale,
      pointRadiusMinPixels: this.props.pointRadiusMinPixels,
      pointRadiusMaxPixels: this.props.pointRadiusMaxPixels,
      getLineColor: this.selectionAwareAccessor(this.props.getLineColor),
      getFillColor: this.selectionAwareAccessor(this.props.getFillColor),
      getPointRadius: this.selectionAwareAccessor(this.props.getRadius),
      getLineWidth: this.selectionAwareAccessor(this.props.getLineWidth),

      _subLayerProps: {
        linestrings: {
          billboard: this.props.billboard,
          updateTriggers: {
            // required to update dashed array attribute
            all: [this.props.selectedFeatureIndexes, this.props.mode],
          },
        },
        'polygons-stroke': {
          billboard: this.props.billboard,
          pickingLineWidthExtraPixels: this.props.pickingLineWidthExtraPixels,
          type: EditablePathLayer,
          updateTriggers: {
            // required to update dashed array attribute
            all: [this.props.selectedFeatureIndexes, this.props.mode],
          },
        },
      },

      updateTriggers: {
        getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getPointRadius: [this.props.selectedFeatureIndexes, this.props.mode],
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

  updateState({ props, oldProps, changeFlags, context }: UpdateParameters<this>) {
    super.updateState({ oldProps, props, changeFlags, context });

    if (changeFlags.propsOrDataChanged) {
      const modePropChanged = Object.keys(oldProps).length === 0 || props.mode !== oldProps.mode;
      if (modePropChanged) {
        let mode: DrawPolygonMode;
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
    if (
      Array.isArray(props.selectedFeatureIndexes) &&
      typeof props.data === 'object' &&
      'features' in props.data
    ) {
      // TODO: needs improved testing, i.e. checking for duplicates, NaNs, out of range numbers, ...
      const propsData = props.data;
      // @ts-ignore error TS2339: Property 'features' does not exist on type 'never'
      selectedFeatures = props.selectedFeatureIndexes.map((elem) => propsData.features[elem]);
    }

    this.setState({ selectedFeatures });
  }

  getModeProps(props: EditableGeojsonLayerProps<any>) {
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

    return this.state.selectedFeatures.includes(feature);
  }

  getPickingInfo({ info, sourceLayer }: Record<string, any>) {
    if (sourceLayer.id.endsWith('guides')) {
      // If user is picking an editing handle, add additional data to the info
      info.isGuide = true;
    }

    return info;
  }

  _updateAutoHighlight(info) {
    // Extra handling for guides
    if (info?.sourceLayer) {
      if (info.isGuide) {
        for (const layer of info.sourceLayer.getSubLayers()) {
          layer.updateAutoHighlight(info);
        }
      } else {
        info.sourceLayer.updateAutoHighlight(info);
      }
    }
  }

  createGuidesLayers() {
    const mode = this.getActiveMode();
    // @ts-expect-error narrow type
    const guides: FeatureCollection = mode.getGuides(this.getModeProps(this.props));

    if (!guides || !guides.features.length) {
      return [];
    }

    const subLayerProps = {
      linestrings: {
        billboard: this.props.billboard,
        autoHighlight: false,
      },
      'polygons-fill': {
        autoHighlight: false,
      },
      'polygons-stroke': {
        billboard: this.props.billboard,
      },
    };

    if (this.props.editHandleType === 'icon') {
      subLayerProps['points-icon'] = {
        type: IconLayer,
        iconAtlas: this.props.editHandleIconAtlas,
        iconMapping: this.props.editHandleIconMapping,
        sizeUnits: this.props.editHandleIconSizeUnits,
        sizeScale: this.props.editHandleIconSizeScale,
        getIcon: guideAccessor(this.props.getEditHandleIcon),
        getSize: guideAccessor(this.props.getEditHandleIconSize),
        getColor: guideAccessor(this.props.getEditHandleIconColor),
        getAngle: guideAccessor(this.props.getEditHandleIconAngle),
        billboard: this.props.billboard,
      };
    } else {
      subLayerProps['points-circle'] = {
        type: ScatterplotLayer,
        radiusScale: this.props.editHandlePointRadiusScale,
        stroked: this.props.editHandlePointOutline,
        getLineWidth: this.props.editHandlePointStrokeWidth,
        radiusUnits: this.props.editHandlePointRadiusUnits,
        radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
        radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
        getRadius: guideAccessor(this.props.getEditHandlePointRadius),
        getFillColor: guideAccessor(this.props.getEditHandlePointColor),
        getLineColor: guideAccessor(this.props.getEditHandlePointOutlineColor),
        billboard: this.props.billboard,
      };
    }

    const layer = new GeoJsonLayer(
      this.getSubLayerProps({
        id: `guides`,
        data: guides,
        fp64: this.props.fp64,
        _subLayerProps: subLayerProps,
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineWidthUnits: this.props.lineWidthUnits,
        lineJointRounded: this.props.lineJointRounded,
        lineCapRounded: this.props.lineCapRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        getLineColor: guideAccessor(this.props.getTentativeLineColor),
        getLineWidth: guideAccessor(this.props.getTentativeLineWidth),
        getFillColor: guideAccessor(this.props.getTentativeFillColor),
        pointType: this.props.editHandleType === 'icon' ? 'icon' : 'circle',
        iconAtlas: this.props.editHandleIconAtlas,
      })
    );

    return [layer];
  }

  createTooltipsLayers() {
    const mode = this.getActiveMode();
    // @ts-expect-error narrow type
    const tooltips = mode.getTooltips(this.getModeProps(this.props));

    const layer = new TextLayer({
      getSize: DEFAULT_TOOLTIP_FONT_SIZE,
      ...this.getSubLayerProps({
        id: `tooltips`,
        data: tooltips,
      }),
    });

    return [layer];
  }

  onLayerClick(event: ClickEvent) {
    // @ts-expect-error narrow type
    this.getActiveMode().handleClick(event, this.getModeProps(this.props));
  }

  onLayerKeyUp(event: KeyboardEvent) {
    // @ts-expect-error narrow type
    this.getActiveMode().handleKeyUp(event, this.getModeProps(this.props));
  }

  onStartDragging(event: StartDraggingEvent) {
    // @ts-expect-error narrow type
    this.getActiveMode().handleStartDragging(event, this.getModeProps(this.props));
  }

  onDragging(event: DraggingEvent) {
    // @ts-expect-error narrow type
    this.getActiveMode().handleDragging(event, this.getModeProps(this.props));
  }

  onStopDragging(event: StopDraggingEvent) {
    // @ts-expect-error narrow type
    this.getActiveMode().handleStopDragging(event, this.getModeProps(this.props));
  }

  onPointerMove(event: PointerMoveEvent) {
    this.setState({ lastPointerMoveEvent: event });
    // @ts-expect-error narrow type
    this.getActiveMode().handlePointerMove(event, this.getModeProps(this.props));
  }

  getCursor({ isDragging }: { isDragging: boolean }) {
    if (this.state === null || this.state === undefined) {
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
