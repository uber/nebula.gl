/* eslint-env browser */

import { CompositeLayer, GeoJsonLayer, ScatterplotLayer } from 'deck.gl';
import { EditableFeatureCollection } from '../editable-feature-collection';

const DEFAULT_LINE_COLOR = [0x0, 0x0, 0x0, 0xff];
const DEFAULT_FILL_COLOR = [0x0, 0x0, 0x0, 0x90];
const DEFAULT_SELECTED_LINE_COLOR = [0x90, 0x90, 0x90, 0xff];
const DEFAULT_SELECTED_FILL_COLOR = [0x90, 0x90, 0x90, 0x90];
const DEFAULT_EDITING_POINT_COLOR = [0x0, 0x0, 0x0, 0xff];

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

  // Editing handles
  editingPointRadiusScale: 1,
  editingPointRadiusMinPixels: 4,
  editingPointRadiusMaxPixels: Number.MAX_SAFE_INTEGER,
  getEditingPointColor: () => DEFAULT_EDITING_POINT_COLOR,
  getEditingPointRadius: () => 3
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

    return layers;
  }

  initializeState() {
    this.state = {
      draggingPosition: null,
      editableFeatureCollection: null
    };
  }

  finalizeState() {
    this.removePointerHandlers();
  }

  updateState({ props, changeFlags }) {
    if (changeFlags.dataChanged) {
      this.setState({ editableFeatureCollection: new EditableFeatureCollection(props.data) });
    }

    // unsubscribe previous layer instance's handlers
    this.removePointerHandlers();
    if (props.editable) {
      // and re-subscribe to this instance
      this.addPointerHandlers();
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
    if (!this.getEditingFeature() || !this.state.editableFeatureCollection) {
      return [];
    }

    const positions = this.state.editableFeatureCollection.getEditHandles(
      this.props.selectedFeatureIndex
    );

    // TODO: support using IconLayer for editing handles
    const layers = [
      new ScatterplotLayer(
        this.getSubLayerProps({
          id: 'edit-handles',
          data: positions,
          fp64: this.props.fp64,

          // Proxy editing point props
          radiusScale: this.props.editingPointRadiusScale,
          radiusMinPixels: this.props.editingPointRadiusMinPixels,
          radiusMaxPixels: this.props.editingPointRadiusMaxPixels,
          getColor: this.props.getEditingPointColor,
          getRadius: this.props.getEditingPointRadius
        })
      )
    ];

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
    if (!this.props.editable) {
      return null;
    }
    if (Array.isArray(this.props.data)) {
      return this.props.data[this.props.selectedFeatureIndex];
    }
    if (this.props.data.type === 'FeatureCollection') {
      return this.props.data.features[this.props.selectedFeatureIndex];
    }
    // Assume it is a single feature
    return this.props.data;
  }

  onPointerMove(event) {
    if (!this.state.pointerDownPosition) {
      // TODO: only subscribe to pointermove once the pointer goes down (at which point we can remove this check)
      return;
    }

    // stop propagation to prevent map panning
    event.stopPropagation();

    const pointerCoords = this.getPointerCoords(event);

    if (!this.state.draggingPosition) {
      // pointer is moving, but is it moving enough?

      if (
        Math.abs(this.state.pointerDownCoords.x - pointerCoords.x) >
          MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS ||
        Math.abs(this.state.pointerDownCoords.y - pointerCoords.y) >
          MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS
      ) {
        this.state.draggingPosition = this.state.pointerDownPosition;

        // Fire the start dragging event
        (this.props.onStartDraggingPosition || (() => {}))({
          featureIndex: this.props.selectedFeatureIndex,
          positionIndexes: this.state.draggingPosition.positionIndexes
        });
      } else {
        // pointer barely moved, so nothing else to do
        return;
      }
    }

    const position = this.context.viewport.unproject([pointerCoords.x, pointerCoords.y]);
    const { positionIndexes } = this.state.draggingPosition;
    const { selectedFeatureIndex } = this.props;

    const updatedData = this.state.editableFeatureCollection
      .replacePosition(selectedFeatureIndex, positionIndexes, position)
      .getObject();

    (this.props.onEdit || (() => {}))({
      data: updatedData
    });

    (this.props.onDraggingPosition || (() => {}))({
      data: updatedData,
      position,
      featureIndex: selectedFeatureIndex,
      positionIndexes: this.state.draggingPosition.positionIndexes
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
      this.setState({ pointerDownPosition: pickedPoint, pointerDownCoords: pointerCoords });
    }
  }

  onPointerUp(event) {
    if (this.state.draggingPosition) {
      (this.props.onStopDraggingPosition || (() => {}))({
        featureIndex: this.props.selectedFeatureIndex,
        positionIndexes: this.state.draggingPosition.positionIndexes
      });
    } else if (this.state.pointerDownPosition) {
      // the pointer went down on a point but wasn't dragged, so remove it
      const { positionIndexes } = this.state.pointerDownPosition;
      const { selectedFeatureIndex } = this.props;

      let updatedData;
      try {
        updatedData = this.state.editableFeatureCollection
          .removePosition(selectedFeatureIndex, positionIndexes)
          .getObject();
      } catch (error) {
        // Sometimes we can't remove a coordinate (e.g. trying to remove a position from a triangle)
      }

      if (updatedData) {
        (this.props.onEdit || (() => {}))({
          data: updatedData
        });

        (this.props.onRemovePoint || (() => {}))({
          data: updatedData,
          featureIndex: selectedFeatureIndex,
          positionIndexes
        });
      }
    }
    this.setState({ draggingPosition: null, pointerDownPosition: null, pointerDownCoords: null });
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
