/* eslint-env browser */

import { CompositeLayer, GeoJsonLayer, ScatterplotLayer } from 'deck.gl';
import { immutablyReplaceCoordinate } from '../geojson';

export default class EditablePolygonsLayer extends CompositeLayer {
  static layerName = 'EditablePolygonsLayer';

  renderLayers() {
    let layers = [
      new GeoJsonLayer({
        ...this.props,
        id: `${this.props.id}-polygons`
      })
    ];

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
    // and re-subscribe to this instance
    this.addPointerHandlers();
  }

  getPickingInfo({ info, sourceLayer }) {
    if (sourceLayer.id.startsWith(`${this.props.id}-points`)) {
      // If user is picking a point, add additional data to the info
      info.isPoint = true;
      // Get polygon index and ring index from layer id `${this.props.id}-points|${polygonIndex}|${ringIndex}`
      const coordinateIndexes = sourceLayer.id
        .substring(`${this.props.id}-points|`.length)
        .split('|');
      const polygonIndex = parseInt(coordinateIndexes[0], 10);
      const ringIndex = parseInt(coordinateIndexes[1], 10);
      if (this.getEditingFeature().geometry.type === 'MultiPolygon') {
        info.coordinateIndexes = [polygonIndex, ringIndex, info.index];
      } else if (this.getEditingFeature().geometry.type === 'Polygon') {
        info.coordinateIndexes = [ringIndex, info.index];
      }
    }

    return info;
  }

  createPointLayers() {
    if (!this.props.data) {
      return [];
    }
    if (typeof this.props.editingFeatureIndex !== 'number') {
      return [];
    }

    const layers = [];

    const geometry = this.getEditingFeature().geometry;
    let polygons = [];
    if (geometry.type === 'MultiPolygon') {
      polygons = geometry.coordinates;
    } else if (geometry.type === 'Polygon') {
      polygons = [geometry.coordinates];
    }

    for (let polygonIndex = 0; polygonIndex < polygons.length; polygonIndex++) {
      const polygon = polygons[polygonIndex];
      for (let ringIndex = 0; ringIndex < polygon.length; ringIndex++) {
        const ring = polygon[ringIndex];

        // create a layer per ring
        const layer = new ScatterplotLayer({
          ...this.props,
          data: ring,
          getPosition: data => data,
          pickable: true,
          autoHighlight: true,
          getRadius: this.props.getPointRadius || (() => 1),
          radiusScale: this.props.pointRadiusScale || 20,
          radiusMinPixels: this.props.pointRadiusMinPixels || 4,
          radiusMaxPixels: this.props.pointRadiusMaxPixels || 10,
          opacity: this.props.pointOpacity || 1.0,
          highlightColor: this.props.pointHighlightColor || [0xff, 0xff, 0xff, 0xff],
          getColor: this.props.getPointColor || (() => [0x80, 0x80, 0x80, 0xff]),
          id: `${this.props.id}-points|${polygonIndex}|${ringIndex}`
        });
        layers.push(layer);
      }
    }

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

  getEditingFeature() {
    if (Array.isArray(this.props.data)) {
      return this.props.data[this.props.editingFeatureIndex];
    } else if (this.props.data.type === 'FeatureCollection') {
      return this.props.data.features[this.props.editingFeatureIndex];
    }
    throw Error('Unhandled data type');
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

        const coordinates = immutablyReplaceCoordinate(
          editingFeature.geometry.coordinates,
          coordinateIndexes,
          groundCoords,
          true
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
          featureIndex: this.props.editingFeatureIndex,
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
          featureIndex: this.props.editingFeatureIndex,
          coordinateIndexes: pickedPoint.coordinateIndexes
        });
      }
    }
  }

  onPointerUp() {
    if (this.state.draggingPoint && this.props.onStopDraggingPoint) {
      this.props.onStopDraggingPoint({
        featureIndex: this.props.editingFeatureIndex,
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
