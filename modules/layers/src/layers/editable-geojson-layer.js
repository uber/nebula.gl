// @flow
/* eslint-env browser */

import { GeoJsonLayer, ScatterplotLayer, IconLayer } from '@deck.gl/layers';
import { ModeHandler } from '../mode-handlers/mode-handler.js';
import { ViewHandler } from '../mode-handlers/view-handler.js';
import { ModifyHandler } from '../mode-handlers/modify-handler.js';
import { ElevationHandler } from '../mode-handlers/elevation-handler.js';
import { SnappableHandler } from '../mode-handlers/snappable-handler.js';
import { TranslateHandler } from '../mode-handlers/translate-handler.js';
import { DuplicateHandler } from '../mode-handlers/duplicate-handler';
import { RotateHandler } from '../mode-handlers/rotate-handler.js';
import { ScaleHandler } from '../mode-handlers/scale-handler.js';
import { DrawPointHandler } from '../mode-handlers/draw-point-handler.js';
import { DrawLineStringHandler } from '../mode-handlers/draw-line-string-handler.js';
import { DrawPolygonHandler } from '../mode-handlers/draw-polygon-handler.js';
import { Draw90DegreePolygonHandler } from '../mode-handlers/draw-90degree-polygon-handler.js';
import { DrawRectangleHandler } from '../mode-handlers/draw-rectangle-handler.js';
import { SplitPolygonHandler } from '../mode-handlers/split-polygon-handler.js';
import { DrawRectangleUsingThreePointsHandler } from '../mode-handlers/draw-rectangle-using-three-points-handler.js';
import { DrawCircleFromCenterHandler } from '../mode-handlers/draw-circle-from-center-handler.js';
import { DrawCircleByBoundingBoxHandler } from '../mode-handlers/draw-circle-by-bounding-box-handler.js';
import { DrawEllipseByBoundingBoxHandler } from '../mode-handlers/draw-ellipse-by-bounding-box-handler.js';
import { DrawEllipseUsingThreePointsHandler } from '../mode-handlers/draw-ellipse-using-three-points-handler.js';

import type { EditAction } from '../mode-handlers/mode-handler.js';
import type { Position } from '../geojson-types.js';
import type {
  ClickEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  PointerMoveEvent
} from '../event-types.js';
import { ExtrudeHandler } from '../mode-handlers/extrude-handler.js';
import EditableLayer from './editable-layer.js';

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

function getEditHandleColor(handle) {
  switch (handle.type) {
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
  switch (handle.type) {
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
  fp64: false,
  filled: true,
  stroked: true,
  lineWidthScale: 1,
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
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
  editHandleParameters: {},
  editHandleLayerProps: {},

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
  getEditHandleIcon: handle => handle.type,
  getEditHandleIconSize: 10,
  getEditHandleIconColor: getEditHandleColor,
  getEditHandleIconAngle: 0,

  // Mode handlers
  modeHandlers: {
    view: new ViewHandler(),
    modify: new ModifyHandler(),
    elevation: new ElevationHandler(),
    extrude: new ExtrudeHandler(),
    rotate: new RotateHandler(),
    translate: new SnappableHandler(new TranslateHandler()),
    duplicate: new DuplicateHandler(),
    scale: new ScaleHandler(),
    drawPoint: new DrawPointHandler(),
    drawLineString: new DrawLineStringHandler(),
    drawPolygon: new DrawPolygonHandler(),
    draw90DegreePolygon: new Draw90DegreePolygonHandler(),
    split: new SplitPolygonHandler(),
    drawRectangle: new DrawRectangleHandler(),
    drawRectangleUsing3Points: new DrawRectangleUsingThreePointsHandler(),
    drawCircleFromCenter: new DrawCircleFromCenterHandler(),
    drawCircleByBoundingBox: new DrawCircleByBoundingBoxHandler(),
    drawEllipseByBoundingBox: new DrawEllipseByBoundingBoxHandler(),
    drawEllipseUsing3Points: new DrawEllipseUsingThreePointsHandler()
  }
};

type Props = {
  mode: string,
  modeHandlers: { [mode: string]: ModeHandler },
  onEdit: EditAction => void,
  // TODO: type the rest
  [string]: any
};

// type State = {
//   modeHandler: EditableFeatureCollection,
//   tentativeFeature: ?Feature,
//   editHandles: any[],
//   selectedFeatures: Feature[]
// };

export default class EditableGeoJsonLayer extends EditableLayer {
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

      updateTriggers: {
        getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getRadius: [this.props.selectedFeatureIndexes, this.props.mode],
        getLineWidth: [this.props.selectedFeatureIndexes, this.props.mode],
        getLineDashArray: [this.props.selectedFeatureIndexes, this.props.mode]
      }
    });

    let layers: any = [new GeoJsonLayer(subLayerProps)];

    layers = layers.concat(this.createTentativeLayers());
    layers = layers.concat(this.createEditHandleLayers());

    return layers;
  }

  initializeState() {
    super.initializeState();

    this.setState({
      selectedFeatures: [],
      editHandles: []
    });
  }

  // TODO: figure out how to properly update state from an outside event handler
  shouldUpdateState({ props, oldProps, context, oldContext, changeFlags }: Object) {
    if (changeFlags.stateChanged) {
      return true;
    }
    return true;
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

    let modeHandler: ModeHandler = this.state.modeHandler;
    if (changeFlags.propsOrDataChanged) {
      if (props.modeHandlers !== oldProps.modeHandlers || props.mode !== oldProps.mode) {
        modeHandler = props.modeHandlers[props.mode];

        if (!modeHandler) {
          console.warn(`No handler configured for mode ${props.mode}`); // eslint-disable-line no-console,no-undef
          // Use default mode handler
          modeHandler = new ModeHandler();
        }

        if (modeHandler !== this.state.modeHandler) {
          this.setState({ modeHandler });
        }

        modeHandler.setFeatureCollection(props.data);
      } else if (changeFlags.dataChanged) {
        modeHandler.setFeatureCollection(props.data);
      }

      modeHandler.setModeConfig(props.modeConfig);
      modeHandler.setSelectedFeatureIndexes(props.selectedFeatureIndexes);
      modeHandler.setDeckGlContext(this.context);
      modeHandler.setLayerId(props.id);
      this.updateTentativeFeature();
      this.updateEditHandles();
    }

    let selectedFeatures = [];
    if (Array.isArray(props.selectedFeatureIndexes)) {
      // TODO: needs improved testing, i.e. checking for duplicates, NaNs, out of range numbers, ...
      selectedFeatures = props.selectedFeatureIndexes.map(elem => props.data.features[elem]);
    }

    this.setState({ selectedFeatures });
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
    if (sourceLayer.id.endsWith('-edit-handles')) {
      // If user is picking an editing handle, add additional data to the info
      info.isEditingHandle = true;
    }

    return info;
  }

  createEditHandleLayers() {
    if (!this.state.editHandles.length) {
      return [];
    }

    const sharedProps = {
      id: `${this.props.editHandleType.layerName || this.props.editHandleType}-edit-handles`,
      data: this.state.editHandles,
      fp64: this.props.fp64,

      parameters: this.props.editHandleParameters,
      ...this.props.editHandleLayerProps
    };

    let layer;

    switch (this.props.editHandleType) {
      case 'icon':
        layer = new IconLayer(
          this.getSubLayerProps({
            ...sharedProps,
            iconAtlas: this.props.editHandleIconAtlas,
            iconMapping: this.props.editHandleIconMapping,
            sizeScale: this.props.editHandleIconSizeScale,
            getIcon: this.props.getEditHandleIcon,
            getSize: this.props.getEditHandleIconSize,
            getColor: this.props.getEditHandleIconColor,
            getAngle: this.props.getEditHandleIconAngle,

            getPosition: d => d.position
          })
        );
        break;

      case 'point':
        layer = new ScatterplotLayer(
          this.getSubLayerProps({
            ...sharedProps,

            // Proxy editing point props
            radiusScale: this.props.editHandlePointRadiusScale,
            outline: this.props.editHandlePointOutline,
            strokeWidth: this.props.editHandlePointStrokeWidth,
            radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
            radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
            getRadius: this.props.getEditHandlePointRadius,
            getColor: this.props.getEditHandlePointColor
          })
        );
        break;

      default:
        if (typeof this.props.editHandleType === 'function') {
          const EditHandleType = this.props.editHandleType;
          layer = new EditHandleType(
            this.getSubLayerProps({
              ...sharedProps,

              // Proxy editing point props
              radiusScale: this.props.editHandlePointRadiusScale,
              outline: this.props.editHandlePointOutline,
              strokeWidth: this.props.editHandlePointStrokeWidth,
              radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
              radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
              getRadius: this.props.getEditHandlePointRadius,
              getColor: this.props.getEditHandlePointColor
            })
          );
        }
        break;
    }

    return [layer];
  }

  createTentativeLayers() {
    if (!this.state.tentativeFeature) {
      return [];
    }

    const layer = new GeoJsonLayer(
      this.getSubLayerProps({
        id: 'tentative',
        data: this.state.tentativeFeature,
        fp64: this.props.fp64,
        pickable: false,
        stroked: true,
        autoHighlight: false,
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        pointRadiusScale: this.props.editHandlePointRadiusScale,
        outline: this.props.editHandlePointOutline,
        strokeWidth: this.props.editHandlePointStrokeWidth,
        pointRadiusMinPixels: this.props.editHandlePointRadiusMinPixels,
        pointRadiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
        getRadius: this.props.getEditHandlePointRadius,
        getLineColor: feature => this.props.getTentativeLineColor(feature, this.props.mode),
        getLineWidth: feature => this.props.getTentativeLineWidth(feature, this.props.mode),
        getFillColor: feature => this.props.getTentativeFillColor(feature, this.props.mode),
        getLineDashArray: feature =>
          this.props.getTentativeLineDashArray(
            feature,
            this.state.selectedFeatures[0],
            this.props.mode
          )
      })
    );

    return [layer];
  }

  updateTentativeFeature() {
    const tentativeFeature = this.state.modeHandler.getTentativeFeature();
    if (tentativeFeature !== this.state.tentativeFeature) {
      this.setState({ tentativeFeature });
      this.setLayerNeedsUpdate();
    }
  }

  updateEditHandles(picks?: Array<Object>, groundCoords?: Position) {
    const editHandles = this.state.modeHandler.getEditHandles(picks, groundCoords);
    if (editHandles !== this.state.editHandles) {
      this.setState({ editHandles });
      this.setLayerNeedsUpdate();
    }
  }

  onLayerClick(event: ClickEvent) {
    const editAction = this.state.modeHandler.handleClick(event);
    this.updateTentativeFeature();
    this.updateEditHandles();

    if (editAction) {
      this.props.onEdit(editAction);
    }
  }

  onStartDragging(event: StartDraggingEvent) {
    const editAction = this.state.modeHandler.handleStartDragging(event);
    this.updateTentativeFeature();
    this.updateEditHandles();

    if (editAction) {
      this.props.onEdit(editAction);
    }
  }

  onStopDragging(event: StopDraggingEvent) {
    const editAction = this.state.modeHandler.handleStopDragging(event);
    this.updateTentativeFeature();
    this.updateEditHandles();

    if (editAction) {
      this.props.onEdit(editAction);
    }
  }

  onPointerMove(event: PointerMoveEvent) {
    const { groundCoords, picks, sourceEvent } = event;

    const { editAction, cancelMapPan } = this.state.modeHandler.handlePointerMove(event);
    this.updateTentativeFeature();
    this.updateEditHandles(picks, groundCoords);

    if (cancelMapPan) {
      // TODO: find a less hacky way to prevent map panning
      // Stop propagation to prevent map panning while dragging an edit handle
      sourceEvent.stopPropagation();
    }

    if (editAction) {
      this.props.onEdit(editAction);
    }
  }

  getCursor({ isDragging }: { isDragging: boolean }) {
    return this.state.modeHandler.getCursor({ isDragging });
  }
}

EditableGeoJsonLayer.layerName = 'EditableGeoJsonLayer';
EditableGeoJsonLayer.defaultProps = defaultProps;
