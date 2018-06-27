/* eslint-env browser */

import { CompositeLayer, GeoJsonLayer, ScatterplotLayer } from 'deck.gl';
import { immutablyReplaceCoordinate, flattenPositions } from '../geojson';

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

  // Editing points
  editingPointRadiusScale: 1,
  editingPointRadiusMinPixels: 4,
  editingPointRadiusMaxPixels: Number.MAX_SAFE_INTEGER,
  getEditingPointColor: () => DEFAULT_EDITING_POINT_COLOR,
  getEditingPointRadius: () => 3
};

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
      draggingPoint: null
    };
  }

  finalizeState() {
    this.removePointerHandlers();
  }

  updateState({ props, changeFlags }) {
    // unsubscribe previous layer instance's handlers
    this.removePointerHandlers();
    if (props.isEditing) {
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
    if (sourceLayer.id.endsWith('-points')) {
      // If user is picking a point, add additional data to the info
      info.isPoint = true;

      if (info.object) {
        info.coordinateIndexes = info.object.indexes;
      }
    }

    return info;
  }

  createPointLayers() {
    if (!this.getEditingFeature()) {
      return [];
    }

    const editingFeature = this.getEditingFeature();
    const positions = flattenPositions(editingFeature.geometry);

    // TODO: support using IconLayer for editing handles
    const layers = [
      new ScatterplotLayer(
        this.getSubLayerProps({
          id: 'points',
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
    if (!this.props.isEditing) {
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
    if (this.state.draggingPoint) {
      // stop propagation to prevent map panning
      event.stopPropagation();

      if (this.props.onDraggingPoint) {
        const pointerCoords = this.getPointerCoords(event);
        const groundCoords = this.context.layerManager.viewports[0].unproject([
          pointerCoords.x,
          pointerCoords.y
        ]);

        const { coordinateIndexes } = this.state.draggingPoint;
        const editingFeature = this.getEditingFeature();
        const isPolygonal =
          editingFeature.geometry.type === 'Polygon' ||
          editingFeature.geometry.type === 'MultiPolygon';

        const coordinates = immutablyReplaceCoordinate(
          editingFeature.geometry.coordinates,
          coordinateIndexes,
          groundCoords,
          isPolygonal
        );

        const updatedFeature = {
          ...editingFeature,
          geometry: {
            ...editingFeature.geometry,
            coordinates
          }
        };

        this.props.onDraggingPoint({
          feature: updatedFeature,
          featureIndex: this.props.selectedFeatureIndex,
          coordinateIndexes: this.state.draggingPoint.coordinateIndexes
        });
      }
    }
  }

  onPointerDown(event) {
    const allPicked = this.context.layerManager.pickObject({
      ...this.getPointerCoords(event),
      mode: 'query',
      layers: [this.props.id],
      radius: 10,
      depth: 2
    });

    const pickedPoint = allPicked.find(picked => picked.isPoint);
    if (pickedPoint) {
      this.setState({ draggingPoint: pickedPoint });
      if (this.props.onStartDraggingPoint) {
        this.props.onStartDraggingPoint({
          featureIndex: this.props.selectedFeatureIndex,
          coordinateIndexes: pickedPoint.coordinateIndexes
        });
      }
    }
  }

  onPointerUp() {
    if (this.state.draggingPoint && this.props.onStopDraggingPoint) {
      this.props.onStopDraggingPoint({
        featureIndex: this.props.selectedFeatureIndex,
        coordinateIndexes: this.state.draggingPoint.coordinateIndexes
      });
    }
    this.setState({ draggingPoint: null });
  }

  getPointerCoords(mouseEvent) {
    return {
      x: mouseEvent.clientX - this.context.gl.canvas.getBoundingClientRect().x,
      y: mouseEvent.clientY - this.context.gl.canvas.getBoundingClientRect().y
    };
  }
}

EditableGeoJsonLayer.layerName = 'EditableGeoJsonLayer';
EditableGeoJsonLayer.defaultProps = defaultProps;
