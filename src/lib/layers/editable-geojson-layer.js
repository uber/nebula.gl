// @flow
/* eslint-env browser */

import { GeoJsonLayer, ScatterplotLayer } from 'deck.gl';
import { EditableFeatureCollection } from '../editable-feature-collection';
import EditableLayer from './editable-layer';

const DEFAULT_LINE_COLOR = [0x0, 0x0, 0x0, 0xff];
const DEFAULT_FILL_COLOR = [0x0, 0x0, 0x0, 0x90];
const DEFAULT_SELECTED_LINE_COLOR = [0x90, 0x90, 0x90, 0xff];
const DEFAULT_SELECTED_FILL_COLOR = [0x90, 0x90, 0x90, 0x90];
const DEFAULT_EDITING_EXISTING_POINT_COLOR = [0xc0, 0x0, 0x0, 0xff];
const DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR = [0x0, 0x0, 0x0, 0x80];

const defaultProps = {
  // 'view' | 'modify' | 'addLineString' | 'extendLineString' | 'addPolygon'
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
  getLineColor: (feature, isSelected) =>
    isSelected ? DEFAULT_SELECTED_LINE_COLOR : DEFAULT_LINE_COLOR,
  getFillColor: (feature, isSelected) =>
    isSelected ? DEFAULT_SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR,
  getRadius: f =>
    (f && f.properties && f.properties.radius) || (f && f.properties && f.properties.size) || 1,
  getLineWidth: f => (f && f.properties && f.properties.lineWidth) || 1,

  // Editing handles
  editHandlePointRadiusScale: 1,
  editHandlePointRadiusMinPixels: 4,
  editHandlePointRadiusMaxPixels: Number.MAX_SAFE_INTEGER,
  getEditHandlePointColor: handle =>
    handle.type === 'existing'
      ? DEFAULT_EDITING_EXISTING_POINT_COLOR
      : DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR,
  getEditHandlePointRadius: handle => (handle.type === 'existing' ? 5 : 3)
};

export default class EditableGeoJsonLayer extends EditableLayer {
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
      getLineColor: this.selectionAwareAccessor(this.props.getLineColor),
      getFillColor: this.selectionAwareAccessor(this.props.getFillColor),
      getRadius: this.selectionAwareAccessor(this.props.getRadius),
      getLineWidth: this.selectionAwareAccessor(this.props.getLineWidth),

      updateTriggers: {
        getLineColor: this.props.selectedFeatureIndex,
        getFillColor: this.props.selectedFeatureIndex,
        getRadius: this.props.selectedFeatureIndex,
        getLineWidth: this.props.selectedFeatureIndex
      }
    });

    let layers = [new GeoJsonLayer(subLayerProps)];

    layers = layers.concat(this.createPointLayers());
    layers = layers.concat(this.createExtensionLineStringLayers());

    return layers;
  }

  initializeState() {
    super.initializeState();

    this.setState({
      editableFeatureCollection: null,
      selectedFeature: null,
      editHandles: null,
      extensionLineString: null
    });
  }

  // TODO: figure out how to properly update state from an outside event handler
  shouldUpdateState({ props, oldProps, context, oldContext, changeFlags }) {
    return true;
  }

  updateState({ props, changeFlags }) {
    super.updateState({ props, changeFlags });

    let editableFeatureCollection = this.state.editableFeatureCollection;
    if (changeFlags.dataChanged) {
      editableFeatureCollection = new EditableFeatureCollection(props.data);
    }

    const selectedFeature =
      typeof props.selectedFeatureIndex === 'number'
        ? props.data.features[props.selectedFeatureIndex]
        : null;

    const editHandles =
      selectedFeature && props.mode !== 'view'
        ? editableFeatureCollection.getEditHandles(props.selectedFeatureIndex)
        : null;

    this.handleExtendLineStringStateUpdate({ props, changeFlags });

    this.setState({ editableFeatureCollection, selectedFeature, editHandles });
  }

  handleExtendLineStringStateUpdate({ props, changeFlags }) {
    if (props.mode !== 'extendLineString' || typeof props.selectedFeatureIndex !== 'number') {
      this.setState({ extensionLineString: null });
      return;
    }

    const selectedFeature = props.data.features[props.selectedFeatureIndex];

    if (selectedFeature.geometry.type !== 'LineString') {
      this.setState({ extensionLineString: null });
      return;
    }

    if (this.state.extensionLineString === null || changeFlags.dataChanged) {
      const lastPosition =
        selectedFeature.geometry.coordinates[selectedFeature.geometry.coordinates.length - 1];

      const extensionLineString = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [lastPosition, lastPosition]
        }
      };

      this.setState({ extensionLineString });
    }
  }

  selectionAwareAccessor(accessor) {
    if (typeof accessor !== 'function') {
      return accessor;
    }
    return feature => accessor(feature, this.isFeatureSelected(feature));
  }

  isFeatureSelected(feature) {
    // TODO: Upgrade deck to include https://github.com/uber/deck.gl/commit/40ff66ed
    // This will be buggy until then
    if (!this.props.data) {
      return false;
    }
    const featureIndex = this.getFeatures().indexOf(feature);
    return this.props.selectedFeatureIndex === featureIndex;
  }

  getPickingInfo({ info, sourceLayer }) {
    if (sourceLayer.id.endsWith('-edit-handles')) {
      // If user is picking an editing handle, add additional data to the info
      info.isEditingHandle = true;
    }

    return info;
  }

  createPointLayers() {
    if (!this.state.editHandles) {
      return [];
    }

    // TODO: support using IconLayer for editing handles
    const layers = [
      new ScatterplotLayer(
        this.getSubLayerProps({
          id: 'edit-handles',
          data: this.state.editHandles,
          fp64: this.props.fp64,

          // Proxy editing point props
          radiusScale: this.props.editHandlePointRadiusScale,
          radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
          radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
          getColor: this.props.getEditHandlePointColor,
          getRadius: this.props.getEditHandlePointRadius
        })
      )
    ];

    return layers;
  }

  createExtensionLineStringLayers() {
    if (!this.state.extensionLineString) {
      return [];
    }

    this.state.extensionsLineStringLayer = new GeoJsonLayer(
      this.getSubLayerProps({
        id: 'extension-linestring',
        data: this.state.extensionLineString,
        fp64: this.props.fp64,
        pickable: false,
        autoHighlight: false,
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        pointRadiusScale: this.props.editHandlePointRadiusScale,
        pointRadiusMinPixels: this.props.editHandlePointRadiusMinPixels,
        pointRadiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
        getLineColor: feature =>
          this.props.getLineColor
            ? this.props.getLineColor(feature, true)
            : defaultProps.getLineColor(feature, true),
        getFillColor: this.props.getEditHandlePointColor,
        // TODO: dashed line for extended LineString?
        getRadius: this.props.getEditHandlePointRadius
      })
    );

    const layers = [this.state.extensionsLineStringLayer];

    return layers;
  }

  getFeatures() {
    if (Array.isArray(this.props.data)) {
      return this.props.data;
    }
    if (this.props.data.type === 'FeatureCollection') {
      return this.props.data.features;
    }
    // Assume it is a single feature
    return [this.props.data];
  }

  getEditingFeature() {
    if (
      this.props.mode === 'view' ||
      this.props.mode === 'addLineString' ||
      this.props.mode === 'addPolygon'
    ) {
      return null;
    }

    return this.state.selectedFeature;
  }

  onClick({ picks, screenCoords, groundCoords }) {
    const { selectedFeature } = this.state;
    const { selectedFeatureIndex } = this.props;
    const editHandleInfo = this.getPickedEditHandle(picks);

    if (!selectedFeature) {
      return;
    }

    if (
      this.props.mode === 'modify' &&
      editHandleInfo &&
      editHandleInfo.object.type === 'existing'
    ) {
      this.handleRemovePosition(selectedFeatureIndex, editHandleInfo.object.positionIndexes);
    } else if (this.props.mode === 'extendLineString') {
      this.handleExtendLineString(selectedFeature, selectedFeatureIndex, groundCoords);
    }
  }

  onStartDragging({
    picks,
    screenCoords,
    groundCoords,
    dragStartScreenCoords,
    dragStartGroundCoords
  }) {
    const { selectedFeature } = this.state;
    const { selectedFeatureIndex } = this.props;
    const editHandleInfo = this.getPickedEditHandle(picks);

    if (!selectedFeature) {
      return;
    }

    if (editHandleInfo) {
      if (editHandleInfo.object.type === 'intermediate') {
        this.handleAddIntermediatePosition(
          selectedFeatureIndex,
          editHandleInfo.object.positionIndexes,
          groundCoords
        );
      }
    }
  }

  onDragging({ picks, screenCoords, groundCoords, dragStartScreenCoords, dragStartGroundCoords }) {
    const { selectedFeature } = this.state;
    const { selectedFeatureIndex } = this.props;
    const editHandleInfo = this.getPickedEditHandle(picks);

    if (!selectedFeature) {
      return;
    }

    if (editHandleInfo) {
      this.handleMovePosition(
        selectedFeatureIndex,
        editHandleInfo.object.positionIndexes,
        groundCoords
      );
    }
  }

  onPointerMove({ screenCoords, groundCoords, isDragging }) {
    if (this.props.mode === 'extendLineString' && this.state.extensionLineString) {
      this.setState({
        extensionLineString: {
          ...this.state.extensionLineString,
          geometry: {
            ...this.state.extensionLineString.geometry,
            coordinates: [this.state.extensionLineString.geometry.coordinates[0], [...groundCoords]]
          }
        }
      });

      // TODO: figure out how to properly update state from a pointer event handler
      this.setLayerNeedsUpdate();
    }
  }

  handleMovePosition(featureIndex, positionIndexes, groundCoords) {
    const updatedData = this.state.editableFeatureCollection
      .replacePosition(featureIndex, positionIndexes, groundCoords)
      .getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: this.props.mode,
      editType: 'movePosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleAddIntermediatePosition(featureIndex, positionIndexes, groundCoords) {
    const updatedData = this.state.editableFeatureCollection
      .addPosition(featureIndex, positionIndexes, groundCoords)
      .getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: this.props.mode,
      editType: 'addPosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleRemovePosition(featureIndex, positionIndexes) {
    let updatedData;
    try {
      updatedData = this.state.editableFeatureCollection
        .removePosition(featureIndex, positionIndexes)
        .getObject();
    } catch (error) {
      // Sometimes we can't remove a position (e.g. trying to remove a position from a triangle)
    }

    if (updatedData) {
      this.props.onEdit({
        updatedData,
        updatedMode: this.props.mode,
        editType: 'removePosition',
        featureIndex,
        positionIndexes
      });
    }
  }

  handleExtendLineString(selectedFeature, featureIndex, groundCoords) {
    const positionIndexes = [selectedFeature.geometry.coordinates.length];

    const updatedData = this.state.editableFeatureCollection
      .addPosition(featureIndex, positionIndexes, groundCoords)
      .getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: 'extendLineString',
      editType: 'addPosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  getPickedEditHandle(picks) {
    return picks.find(pick => pick.isEditingHandle);
  }
}

EditableGeoJsonLayer.layerName = 'EditableGeoJsonLayer';
EditableGeoJsonLayer.defaultProps = defaultProps;
