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
  // 'view' | 'modify' | 'drawLineString' | 'drawPolygon'
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
    layers = layers.concat(this.createDrawLineStringLayers());

    return layers;
  }

  initializeState() {
    super.initializeState();

    this.setState({
      editableFeatureCollection: null,
      selectedFeature: null,
      editHandles: null,
      drawLineStringFeature: null
    });
  }

  // TODO: figure out how to properly update state from an outside event handler
  shouldUpdateState({ props, oldProps, context, oldContext, changeFlags }) {
    return true;
  }

  updateState({ props, oldProps, changeFlags }) {
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

    this.setState({ editableFeatureCollection, selectedFeature, editHandles });

    this.handleDrawLineStringStateUpdate({ props, oldProps, changeFlags });
  }

  handleDrawLineStringStateUpdate({ props, oldProps, changeFlags }) {
    const selectedFeature = this.state.selectedFeature;

    if (
      props.mode !== 'drawLineString' ||
      changeFlags.dataChanged ||
      props.selectedFeatureIndex !== oldProps.selectedFeatureIndex
    ) {
      this.setState({ drawLineStringFeature: null });
      return;
    }

    if (
      selectedFeature !== null &&
      selectedFeature.geometry.type !== 'LineString' &&
      selectedFeature.geometry.type !== 'Point'
    ) {
      // Perhaps this should warn?
      this.setState({ drawLineStringFeature: null });
      return;
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

  createDrawLineStringLayers() {
    if (!this.state.drawLineStringFeature) {
      return [];
    }

    const layer = new GeoJsonLayer(
      this.getSubLayerProps({
        id: 'draw-linestring',
        data: this.state.drawLineStringFeature,
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
        getLineColor: feature => this.props.getLineColor(feature, true),
        getFillColor: () => this.props.getEditHandlePointColor({ type: 'existing' }),
        // TODO: dashed line for extended LineString?
        getRadius: this.props.getEditHandlePointRadius
      })
    );

    return [layer];
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

    if (
      this.props.mode === 'modify' &&
      editHandleInfo &&
      editHandleInfo.object.type === 'existing'
    ) {
      this.handleRemovePosition(selectedFeatureIndex, editHandleInfo.object.positionIndexes);
    } else if (
      this.props.mode === 'drawLineString' &&
      selectedFeature &&
      (selectedFeature.geometry.type === 'LineString' || selectedFeature.geometry.type === 'Point')
    ) {
      this.handleExtendLineString(selectedFeature, selectedFeatureIndex, groundCoords);
    } else if (this.props.mode === 'drawLineString' && !selectedFeature) {
      this.handleDrawNewLineString(groundCoords);
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
    if (this.props.mode === 'drawLineString') {
      const { selectedFeature } = this.state;
      if (selectedFeature && selectedFeature.geometry.type === 'LineString') {
        // Draw an extension line beyond the last point
        const startPosition =
          selectedFeature.geometry.coordinates[selectedFeature.geometry.coordinates.length - 1];

        this.setState({
          drawLineStringFeature: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [startPosition, groundCoords]
            }
          }
        });
      } else if (selectedFeature && selectedFeature.geometry.type === 'Point') {
        // Draw an extension line starting from the point
        const startPosition = selectedFeature.geometry.coordinates;

        this.setState({
          drawLineStringFeature: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [startPosition, groundCoords]
            }
          }
        });
      } else if (!selectedFeature) {
        this.setState({
          drawLineStringFeature: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: groundCoords
            }
          }
        });
      }

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
      updatedSelectedFeatureIndex: this.props.selectedFeatureIndex,
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
      updatedSelectedFeatureIndex: this.props.selectedFeatureIndex,
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
        updatedSelectedFeatureIndex: this.props.selectedFeatureIndex,
        editType: 'removePosition',
        featureIndex,
        positionIndexes
      });
    }
  }

  handleExtendLineString(selectedFeature, featureIndex, groundCoords) {
    let featureCollection = this.state.editableFeatureCollection;
    let positionIndexes;

    if (selectedFeature.geometry.type === 'Point') {
      positionIndexes = [1];
      featureCollection = featureCollection.upgradePointToLineString(featureIndex, groundCoords);
    } else {
      positionIndexes = [selectedFeature.geometry.coordinates.length];
      featureCollection = featureCollection.addPosition(
        featureIndex,
        positionIndexes,
        groundCoords
      );
    }

    const updatedData = featureCollection.getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: 'drawLineString',
      updatedSelectedFeatureIndex: this.props.selectedFeatureIndex,
      editType: 'addPosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleDrawNewLineString(groundCoords) {
    // Starts off as a point (since LineString requires at least 2 positions)
    const newFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: groundCoords
      }
    };

    const updatedData = this.state.editableFeatureCollection.addFeature(newFeature).getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: 'drawLineString',
      updatedSelectedFeatureIndex: this.props.data.features.length,
      editType: 'addLineString',
      featureIndex: this.props.data.features.length,
      positionIndexes: [0],
      position: groundCoords
    });
  }

  getPickedEditHandle(picks) {
    return picks.find(pick => pick.isEditingHandle);
  }
}

EditableGeoJsonLayer.layerName = 'EditableGeoJsonLayer';
EditableGeoJsonLayer.defaultProps = defaultProps;
