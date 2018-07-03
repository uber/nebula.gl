// @flow
/* eslint-env browser */

import { CompositeLayer, GeoJsonLayer, ScatterplotLayer } from 'deck.gl';
import { EditableFeatureCollection } from '../editable-feature-collection';

const DEFAULT_LINE_COLOR = [0x0, 0x0, 0x0, 0xff];
const DEFAULT_FILL_COLOR = [0x0, 0x0, 0x0, 0x90];
const DEFAULT_SELECTED_LINE_COLOR = [0x90, 0x90, 0x90, 0xff];
const DEFAULT_SELECTED_FILL_COLOR = [0x90, 0x90, 0x90, 0x90];
const DEFAULT_EDITING_EXISTING_POINT_COLOR = [0xc0, 0x0, 0x0, 0xff];
const DEFAULT_EDITING_INTERMEDIATE_POINT_COLOR = [0x0, 0x0, 0x0, 0x80];

const defaultProps = {
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

  // 'view' | 'edit' | 'addLineString' | 'extendLineString' | 'addPolygon'
  mode: 'edit',

  onEdit: () => {},
  onStartDraggingPosition: () => {},
  onStopDraggingPosition: () => {},

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

// Minimum number of pixels the pointer must move from the original pointer down to be considered dragging
const MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS = 7;

export default class EditableGeoJsonLayer extends CompositeLayer {
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
    this.state = {
      draggingEditHandle: null,
      editableFeatureCollection: null,
      selectedFeature: null,
      editHandles: null,
      extensionLineString: null
    };
  }

  finalizeState() {
    this.removePointerHandlers();
  }

  // TODO: figure out how to properly update state from a pointer event handler
  shouldUpdateState({ props, oldProps, context, oldContext, changeFlags }) {
    return true;
  }

  updateState({ props, changeFlags }) {
    let editableFeatureCollection = this.state.editableFeatureCollection;
    if (changeFlags.dataChanged) {
      editableFeatureCollection = new EditableFeatureCollection(props.data);
    }

    const selectedFeature =
      typeof props.selectedFeatureIndex === 'number'
        ? props.data.features[props.selectedFeatureIndex]
        : null;

    const editHandles = selectedFeature
      ? editableFeatureCollection.getEditHandles(props.selectedFeatureIndex)
      : null;

    this.handleExtendLineStringStateUpdate({ props, changeFlags });

    this.setState({ editableFeatureCollection, selectedFeature, editHandles });

    // unsubscribe previous layer instance's handlers
    this.removePointerHandlers();
    if (props.mode !== 'view') {
      // and re-subscribe to this instance
      this.addPointerHandlers();
    }
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

      if (info.object) {
        info.positionIndexes = info.object.positionIndexes;
      }
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
        // getLineColor: () => [0xff, 0x0, 0x0, 0xff],
        getFillColor: this.props.getEditHandlePointColor,
        getRadius: this.props.getEditHandlePointRadius
      })
    );

    const layers = [this.state.extensionsLineStringLayer];

    return layers;
  }

  removePointerHandlers() {
    if (this.state.pointerHandlers) {
      this.context.gl.canvas.removeEventListener(
        'pointermove',
        this.state.pointerHandlers.onPointerMove
      );
      this.context.gl.canvas.removeEventListener(
        'pointerdown',
        this.state.pointerHandlers.onPointerDown
      );
      this.context.gl.canvas.removeEventListener(
        'pointerup',
        this.state.pointerHandlers.onPointerUp
      );
    }
  }

  addPointerHandlers() {
    this.state.pointerHandlers = {
      onPointerMove: this.onPointerMove.bind(this),
      onPointerDown: this.onPointerDown.bind(this),
      onPointerUp: this.onPointerUp.bind(this)
    };

    this.context.gl.canvas.addEventListener(
      'pointermove',
      this.state.pointerHandlers.onPointerMove
    );
    this.context.gl.canvas.addEventListener(
      'pointerdown',
      this.state.pointerHandlers.onPointerDown
    );
    this.context.gl.canvas.addEventListener('pointerup', this.state.pointerHandlers.onPointerUp);
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

  onPointerMove(event) {
    const pointerCoords = this.getPointerCoords(event);
    const position = this.context.viewport.unproject([pointerCoords.x, pointerCoords.y]);

    if (this.props.mode === 'extendLineString' && this.state.extensionLineString) {
      this.setState({
        extensionLineString: {
          ...this.state.extensionLineString,
          geometry: {
            ...this.state.extensionLineString.geometry,
            coordinates: [this.state.extensionLineString.geometry.coordinates[0], [...position]]
          }
        }
      });

      // TODO: figure out how to properly update state from a pointer event handler
      this.setLayerNeedsUpdate();
      // if (this.state.extensionsLineStringLayer) {
      //   this.state.extensionsLineStringLayer.setNeedsRedraw();
      // }
      // this.setNeedsRedraw('update from pointer event');
      // this.context.layerManager.setNeedsUpdate('update from pointer event');
    }

    if (!this.state.pointerDownEditHandle) {
      // TODO: only subscribe to pointermove once the pointer goes down (at which point we can remove this check)
      return;
    }

    // stop propagation to prevent map panning
    event.stopPropagation();

    if (!this.state.draggingEditHandle) {
      // pointer is moving, but is it moving enough?

      if (
        Math.abs(this.state.pointerDownCoords.x - pointerCoords.x) >
          MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS ||
        Math.abs(this.state.pointerDownCoords.y - pointerCoords.y) >
          MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS
      ) {
        this.state.draggingEditHandle = this.state.pointerDownEditHandle;

        // Fire the start dragging event
        this.props.onStartDraggingPosition({
          featureIndex: this.props.selectedFeatureIndex,
          positionIndexes: this.state.draggingEditHandle.positionIndexes
        });
      } else {
        // pointer barely moved, so nothing else to do
        return;
      }
    }

    const { positionIndexes } = this.state.draggingEditHandle;
    const { selectedFeatureIndex } = this.props;

    const updatedData = this.state.editableFeatureCollection
      .replacePosition(selectedFeatureIndex, positionIndexes, position)
      .getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: 'edit',
      editType: 'movePosition',
      featureIndex: selectedFeatureIndex,
      positionIndexes,
      position
    });
  }

  onPointerDown(event) {
    const pointerCoords = this.getPointerCoords(event);
    const allPicked = this.context.layerManager.pickObject({
      ...pointerCoords,
      mode: 'query',
      layers: [this.props.id],
      radius: 10
    });

    const pickedPoint = allPicked.find(picked => picked.isEditingHandle);
    if (pickedPoint) {
      if (pickedPoint.object.type === 'intermediate') {
        const { position, positionIndexes } = pickedPoint.object;
        const { selectedFeatureIndex } = this.props;

        const updatedData = this.state.editableFeatureCollection
          .addPosition(selectedFeatureIndex, positionIndexes, position)
          .getObject();

        this.props.onEdit({
          updatedData,
          updatedMode: 'edit',
          editType: 'addIntermediatePosition',
          featureIndex: selectedFeatureIndex,
          positionIndexes,
          position
        });
      }

      this.setState({ pointerDownEditHandle: pickedPoint });
    }
    this.setState({ pointerDownCoords: pointerCoords });
  }

  onClick(event) {
    const { pointerDownCoords, pointerDownEditHandle, selectedFeature } = this.state;
    const { selectedFeatureIndex } = this.props;

    if (this.props.mode === 'edit' && pointerDownEditHandle) {
      // they clicked an edit handle but didn't drag it, so remove it
      const { positionIndexes } = pointerDownEditHandle;

      let updatedData;
      try {
        updatedData = this.state.editableFeatureCollection
          .removePosition(selectedFeatureIndex, positionIndexes)
          .getObject();
      } catch (error) {
        // Sometimes we can't remove a coordinate (e.g. trying to remove a position from a triangle)
      }

      if (updatedData) {
        this.props.onEdit({
          updatedData,
          updatedMode: 'edit',
          editType: 'removePosition',
          featureIndex: selectedFeatureIndex,
          positionIndexes
        });
      }
    }
    if (this.props.mode === 'extendLineString') {
      const positionIndexes = [selectedFeature.geometry.coordinates.length];
      const groundPosition = this.context.viewport.unproject([
        pointerDownCoords.x,
        pointerDownCoords.y
      ]);

      const updatedData = this.state.editableFeatureCollection
        .addPosition(selectedFeatureIndex, positionIndexes, groundPosition)
        .getObject();

      this.props.onEdit({
        updatedData,
        updatedMode: 'extendLineString',
        editType: 'addPosition',
        featureIndex: selectedFeatureIndex,
        positionIndexes
      });
    }
  }

  onPointerUp(event) {
    if (this.state.draggingEditHandle) {
      this.props.onStopDraggingPosition({
        featureIndex: this.props.selectedFeatureIndex,
        positionIndexes: this.state.draggingEditHandle.positionIndexes
      });
    } else if (this.state.pointerDownCoords) {
      // They didn't drag, so consider it a click
      this.onClick(event);
    }
    this.setState({
      draggingEditHandle: null,
      pointerDownEditHandle: null,
      pointerDownCoords: null
    });
  }

  getPointerCoords(pointerEvent) {
    return {
      x: pointerEvent.clientX - this.context.gl.canvas.getBoundingClientRect().x,
      y: pointerEvent.clientY - this.context.gl.canvas.getBoundingClientRect().y
    };
  }
}

EditableGeoJsonLayer.layerName = 'EditableGeoJsonLayer';
EditableGeoJsonLayer.defaultProps = defaultProps;
