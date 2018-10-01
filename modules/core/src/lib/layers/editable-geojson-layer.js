// @flow
/* eslint-env browser */

import { GeoJsonLayer, ScatterplotLayer, IconLayer } from 'deck.gl';
import turfTransformRotate from '@turf/transform-rotate';
import turfTransformTranslate from '@turf/transform-translate';
import turfDistance from '@turf/distance';
import { point } from '@turf/helpers';
import { EditableFeatureCollection } from '../editable-feature-collection.js';
import type { EditAction } from '../editable-feature-collection.js';
import type { Feature, Position } from '../../geojson-types.js';
import EditableLayer from './editable-layer.js';

const DEFAULT_LINE_COLOR = [0x0, 0x0, 0x0, 0xff];
const DEFAULT_FILL_COLOR = [0x0, 0x0, 0x0, 0x90];
const DEFAULT_SELECTED_LINE_COLOR = [0x90, 0x90, 0x90, 0xff];
const DEFAULT_SELECTED_FILL_COLOR = [0x90, 0x90, 0x90, 0x90];
const DEFAULT_EDITING_EXISTING_POINT_COLOR = [0xc0, 0x0, 0x0, 0xff];
const DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR = [0x0, 0x0, 0x0, 0x80];

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
  drawAtFront: false,
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

  // point handles
  editHandlePointRadiusScale: 1,
  editHandlePointOutline: false,
  editHandlePointStrokeWidth: 1,
  editHandlePointRadiusMinPixels: 4,
  editHandlePointRadiusMaxPixels: 8,
  getEditHandlePointColor: handle =>
    handle.type === 'existing'
      ? DEFAULT_EDITING_EXISTING_POINT_COLOR
      : DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR,
  getEditHandlePointRadius: handle => (handle.type === 'existing' ? 5 : 3),

  // icon handles
  editHandleIconAtlas: null,
  editHandleIconMapping: null,
  editHandleIconSizeScale: 1,
  getEditHandleIcon: handle => handle.type,
  getEditHandleIconSize: 10,
  getEditHandleIconColor: handle =>
    handle.type === 'existing'
      ? DEFAULT_EDITING_EXISTING_POINT_COLOR
      : DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR,
  getEditHandleIconAngle: 0
};

type Props = {
  onEdit: EditAction => void,
  // TODO
  [string]: any
};

type State = {
  editableFeatureCollection: EditableFeatureCollection,
  tentativeFeature: ?Feature,
  editHandles: any[],
  selectedFeatures: Feature[],
  pointerMovePicks: any[]
};

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
      editableFeatureCollection: new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: []
      }),
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

    const editableFeatureCollection = this.state.editableFeatureCollection;
    if (changeFlags.dataChanged) {
      editableFeatureCollection.setFeatureCollection(props.data);
    }

    if (changeFlags.propsOrDataChanged) {
      editableFeatureCollection.setMode(props.mode);
      editableFeatureCollection.setSelectedFeatureIndexes(props.selectedFeatureIndexes);
      editableFeatureCollection.setDrawAtFront(props.drawAtFront);
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
      id: `${this.props.editHandleType}-edit-handles`,
      data: this.state.editHandles,
      fp64: this.props.fp64
    };

    const layer =
      this.props.editHandleType === 'icon'
        ? new IconLayer(
            this.getSubLayerProps({
              ...sharedProps,
              iconAtlas: this.props.editHandleIconAtlas,
              iconMapping: this.props.editHandleIconMapping,
              sizeScale: this.props.editHandleIconSizeScale,
              getIcon: this.props.getEditHandleIcon,
              getSize: this.props.getEditHandleIconSize,
              getColor: this.props.getEditHandleIconColor,
              getAngle: this.props.getEditHandleIconAngle,

              getPosition: d => d.position,

              parameters: this.props.editHandleParameters
            })
          )
        : this.props.editHandleType === 'point'
          ? new ScatterplotLayer(
              this.getSubLayerProps({
                ...sharedProps,

                // Proxy editing point props
                radiusScale: this.props.editHandlePointRadiusScale,
                outline: this.props.editHandlePointOutline,
                strokeWidth: this.props.editHandlePointStrokeWidth,
                radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
                radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
                getRadius: this.props.getEditHandlePointRadius,
                getColor: this.props.getEditHandlePointColor,

                parameters: this.props.editHandleParameters
              })
            )
          : null;

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
    const tentativeFeature = this.state.editableFeatureCollection.getTentativeFeature();
    if (tentativeFeature !== this.state.tentativeFeature) {
      this.setState({ tentativeFeature });
      this.setLayerNeedsUpdate();
    }
  }

  updateEditHandles() {
    const editHandles = this.state.editableFeatureCollection.getEditHandles();
    if (editHandles !== this.state.editHandles) {
      this.setState({ editHandles });
      this.setLayerNeedsUpdate();
    }
  }

  onClick({
    picks,
    screenCoords,
    groundCoords
  }: {
    picks: any[],
    screenCoords: Position,
    groundCoords: Position
  }) {
    const editHandleInfo = this.getPickedEditHandle(picks);
    const editHandle = editHandleInfo ? editHandleInfo.object : null;

    const editAction = this.state.editableFeatureCollection.onClick(groundCoords, editHandle);
    this.updateTentativeFeature();
    this.updateEditHandles();

    if (editAction) {
      this.props.onEdit(editAction);
    }
  }

  onStartDragging({
    picks,
    screenCoords,
    groundCoords,
    dragStartScreenCoords,
    dragStartGroundCoords
  }: {
    picks: any[],
    screenCoords: Position,
    groundCoords: Position,
    dragStartScreenCoords: Position,
    dragStartGroundCoords: Position
  }) {
    const { selectedFeatures } = this.state;
    const editHandleInfo = this.getPickedEditHandle(picks);

    if (!selectedFeatures.length) {
      return;
    }

    if (editHandleInfo) {
      if (editHandleInfo.object.type === 'intermediate') {
        this.handleAddIntermediatePosition(
          editHandleInfo.object.featureIndex,
          editHandleInfo.object.positionIndexes,
          groundCoords
        );
      }
    }
  }

  onDragging({
    picks,
    screenCoords,
    groundCoords,
    dragStartScreenCoords,
    dragStartGroundCoords
  }: {
    picks: any[],
    screenCoords: Position,
    groundCoords: Position,
    dragStartScreenCoords: Position,
    dragStartGroundCoords: Position
  }) {
    const { selectedFeatures } = this.state;

    if (!selectedFeatures.length) {
      return;
    }

    const editHandleInfo = this.getPickedEditHandle(picks);
    if (editHandleInfo) {
      this.handleMovePosition(
        editHandleInfo.object.featureIndex,
        editHandleInfo.object.positionIndexes,
        groundCoords
      );
    }
  }

  onStopDragging({
    picks,
    screenCoords,
    groundCoords,
    dragStartScreenCoords,
    dragStartGroundCoords
  }: {
    picks: any[],
    screenCoords: Position,
    groundCoords: Position,
    dragStartScreenCoords: Position,
    dragStartGroundCoords: Position
  }) {
    const { selectedFeatures } = this.state;

    if (!selectedFeatures.length) {
      return;
    }

    const editHandleInfo = this.getPickedEditHandle(picks);

    if (editHandleInfo) {
      this.handleFinishMovePosition(
        editHandleInfo.object.featureIndex,
        editHandleInfo.object.positionIndexes,
        groundCoords
      );
    }
  }

  onPointerDown({
    screenCoords,
    groundCoords,
    sourceEvent
  }: {
    screenCoords: Position,
    groundCoords: Position,
    sourceEvent: any
  }) {
    const isDuplicateFeature =
      this.props.mode === 'modify' &&
      this.props.modeConfig &&
      this.props.modeConfig.action === 'duplicate';
    const feature = this.state.selectedFeatures[0];
    if (isDuplicateFeature) {
      const editAction = this.state.editableFeatureCollection.getAddFeatureEditAction(
        feature.geometry
      );

      if (editAction) {
        this.props.onEdit(editAction);
      }
    }
  }

  onPointerMove({
    picks,
    screenCoords,
    groundCoords,
    isDragging,
    pointerDownPicks,
    sourceEvent
  }: {
    picks: any[],
    screenCoords: Position,
    groundCoords: Position,
    isDragging: boolean,
    pointerDownPicks: any[],
    sourceEvent: any
  }) {
    const isTranslateFeature =
      this.props.mode === 'modify' &&
      this.props.modeConfig &&
      ['transformTranslate', 'duplicate'].includes(this.props.modeConfig.action);
    let distanceMoved = 0.02;
    const { pointerMovePicks } = this.state;
    if (
      isTranslateFeature &&
      pointerMovePicks &&
      pointerMovePicks.length &&
      picks &&
      picks.length
    ) {
      distanceMoved = Math.max(
        turfDistance(point(pointerMovePicks[0].lngLat), point(picks[0].lngLat)),
        0.02
      );
    }
    this.setState({ pointerMovePicks: picks });

    if (pointerDownPicks && pointerDownPicks.length > 0) {
      if (isTranslateFeature) {
        sourceEvent.stopPropagation();
        this.handleTransformTranslate(screenCoords, groundCoords, pointerDownPicks, distanceMoved);
        return;
      }
      const editHandleInfo = this.getPickedEditHandle(pointerDownPicks);
      if (editHandleInfo) {
        // TODO: find a less hacky way to prevent map panning
        // Stop propagation to prevent map panning while dragging an edit handle
        sourceEvent.stopPropagation();
      }
    }

    this.state.editableFeatureCollection.onPointerMove(groundCoords);
    this.updateTentativeFeature();
    this.updateEditHandles();

    if (
      this.props.mode === 'modify' &&
      this.props.modeConfig &&
      this.props.modeConfig.action === 'transformRotate'
    ) {
      this.handleTransformRotate(screenCoords, groundCoords);
    }
  }

  handleTransformRotate(screenCoords: Position, groundCoords: Position) {
    const { modeConfig } = this.props;
    let pivot;

    if (modeConfig && modeConfig.usePickAsPivot) {
      const picks = this.context.layerManager.pickObject({
        x: screenCoords[0],
        y: screenCoords[1],
        mode: 'query',
        layers: [this.props.id],
        radius: 100,
        viewports: [this.context.viewport]
      });
      // do nothing when mouse position far away from any point
      if (!picks || !picks.length || !picks[0].object.position) {
        return;
      }
      pivot = picks[0].object.position;
    } else {
      pivot = modeConfig.pivot;
    }
    const featureIndex = this.props.selectedFeatureIndexes[0];
    const feature = this.state.selectedFeatures[0];
    const rotatedFeature = turfTransformRotate(feature, 2, { pivot });

    const updatedData = this.state.editableFeatureCollection.featureCollection
      .replaceGeometry(featureIndex, rotatedFeature.geometry)
      .getObject();

    this.props.onEdit({
      updatedData,
      editType: 'transformPosition',
      featureIndex,
      positionIndexes: this.props.positionIndexes,
      position: groundCoords
    });
  }

  handleTransformTranslate(
    screenCoords: Position,
    groundCoords: Position,
    pointerDownPicks: any[],
    distanceMoved: number
  ) {
    const featureIndex = this.props.selectedFeatureIndexes[0];
    const feature = this.state.selectedFeatures[0];
    const p1 = { x: screenCoords[0], y: screenCoords[1] };
    const p2 = { x: pointerDownPicks[0].x, y: pointerDownPicks[0].y };
    const angleFromNorth = (pointA, pointB) => {
      const angleFromWest = (Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x) * 180) / Math.PI;
      return angleFromWest > 90 && angleFromWest < 180 ? angleFromWest - 90 : angleFromWest + 270;
    };
    const direction = angleFromNorth(p2, p1);
    const movedFeature = turfTransformTranslate(feature, distanceMoved, direction);

    const updatedData = this.state.editableFeatureCollection.featureCollection
      .replaceGeometry(featureIndex, movedFeature.geometry)
      .getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: this.props.mode,
      updatedSelectedFeatureIndexes: this.props.selectedFeatureIndexes,
      editType: 'transformPosition',
      featureIndex,
      positionIndexes: this.props.positionIndexes,
      position: groundCoords
    });
  }

  handleMovePosition(featureIndex: number, positionIndexes: number[], groundCoords: Position) {
    const updatedData = this.state.editableFeatureCollection.featureCollection
      .replacePosition(featureIndex, positionIndexes, groundCoords)
      .getObject();

    this.props.onEdit({
      updatedData,
      editType: 'movePosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleFinishMovePosition(
    featureIndex: number,
    positionIndexes: number[],
    groundCoords: Position
  ) {
    const updatedData = this.state.editableFeatureCollection.featureCollection
      .replacePosition(featureIndex, positionIndexes, groundCoords)
      .getObject();

    this.props.onEdit({
      updatedData,
      editType: 'finishMovePosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleAddIntermediatePosition(
    featureIndex: number,
    positionIndexes: number[],
    groundCoords: Position
  ) {
    const updatedData = this.state.editableFeatureCollection.featureCollection
      .addPosition(featureIndex, positionIndexes, groundCoords)
      .getObject();

    this.props.onEdit({
      updatedData,
      editType: 'addPosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  getPickedEditHandle(picks: Object[]) {
    return picks.find(pick => pick.isEditingHandle);
  }

  getCursor({ isDragging }: { isDragging: boolean }) {
    const mode = this.props.mode;
    if (mode.startsWith('draw')) {
      return 'cell';
    }

    const picks = this.state.pointerMovePicks;
    if (mode === 'modify' && picks && picks.length > 0) {
      const existingHandlePicked = picks.some(
        pick => pick.isEditingHandle && pick.object.type === 'existing'
      );
      const intermediateHandlePicked = picks.some(
        pick => pick.isEditingHandle && pick.object.type === 'intermediate'
      );
      if (existingHandlePicked) {
        return 'move';
      }
      if (intermediateHandlePicked) {
        return 'cell';
      }
    }

    return isDragging ? 'grabbing' : 'grab';
  }
}

EditableGeoJsonLayer.layerName = 'EditableGeoJsonLayer';
EditableGeoJsonLayer.defaultProps = defaultProps;
