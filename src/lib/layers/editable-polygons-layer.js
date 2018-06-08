/* eslint-env browser */

import { CompositeLayer, GeoJsonLayer, ScatterplotLayer } from 'deck.gl';

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

    if (changeFlags.dataChanged) {
      const feature = props.data;

      let coordinates;
      if (feature.geometry && feature.geometry.type === 'Polygon') {
        coordinates = feature.geometry.coordinates[0];
      } else if (feature.geometry && feature.geometry.type === 'MultiPolygon') {
        coordinates = feature.geometry.coordinates[0][0];
      } else {
        throw Error(`Unsupported geometry type: ${feature.geometry.type}`);
      }

      this.state.points = coordinates;
    }
  }

  getPickingInfo({ info, sourceLayer }) {
    if (sourceLayer.id.startsWith(`${this.props.id}-points`)) {
      info.isPoint = true;
      // `${this.props.id}-points-${polygonIndex}-${ringIndex}`
      const coordinateIndices = sourceLayer.id
        .substring(`${this.props.id}-points-`.length)
        .split('-');
      info.polygonIndex = parseInt(coordinateIndices[0], 10);
      info.ringIndex = parseInt(coordinateIndices[1], 10);
    }

    return info;
  }

  createPointLayers() {
    if (!this.props.data || !this.props.data.geometry) {
      return [];
    }

    const layers = [];

    const geometry = this.props.data.geometry;
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
          pickable: true,
          getPosition: data => data,
          getRadius: () => 1,
          radiusScale: 2,
          radiusMinPixels: 5,
          radiusMaxPixels: 10,
          opacity: 1.0,
          autoHighlight: true,
          highlightColor: [255, 255, 255, 255],
          getColor: () => [128, 128, 128, 255],
          id: `${this.props.id}-points-${polygonIndex}-${ringIndex}`
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

  onPointerMove(event) {
    if (this.state.draggingPoint) {
      // stop propagation to prevent map panning
      event.stopPropagation();

      if (this.props.onEditing) {
        const pointerCoords = this.getPointerCoords(event);
        const groundCoords = this.context.layerManager.viewports[0].unproject([
          pointerCoords.x,
          pointerCoords.y
        ]);

        const { polygonIndex, ringIndex, index } = this.state.draggingPoint;
        let coordinateIndices;

        // Immutably set coordinates
        let affectedPolygon;
        let affectedRing;
        if (this.props.data.geometry.type === 'MultiPolygon') {
          affectedPolygon = this.props.data.geometry.coordinates[polygonIndex];
          coordinateIndices = [polygonIndex, ringIndex, index];
        } else if (this.props.data.geometry.type === 'Polygon') {
          affectedPolygon = this.props.data.geometry.coordinates;
          coordinateIndices = [ringIndex, index];
        } else {
          throw Error(`Unsupported geometry type ${this.props.data.geometry.type}`);
        }

        // Immutably update affected ring (with the actual point that was changed)
        affectedRing = affectedPolygon[ringIndex];
        affectedRing = [
          ...affectedRing.slice(0, index),
          groundCoords,
          ...affectedRing.slice(index + 1)
        ];

        // The first and last point are repeated, so update both if necessary
        const lastIndexInRing = affectedRing.length - 1;
        if (index === 0 || index === lastIndexInRing) {
          affectedRing[0] = groundCoords;
          affectedRing[lastIndexInRing] = groundCoords;
        }

        // Immutably update polygon containing affected ring
        affectedPolygon = [
          ...affectedPolygon.slice(0, ringIndex),
          affectedRing,
          ...affectedPolygon.slice(ringIndex + 1)
        ];

        let coordinates;
        if (this.props.data.geometry.type === 'MultiPolygon') {
          coordinates = [
            ...this.props.data.geometry.coordinates.slice(0, polygonIndex),
            affectedPolygon,
            ...this.props.data.geometry.coordinates.slice(polygonIndex + 1)
          ];
        } else if (this.props.data.geometry.type === 'Polygon') {
          coordinates = affectedPolygon;
        }

        // Mutably set coordinates
        // let coordinates = this.props.data.geometry.coordinates;
        // if (this.props.data.geometry.type === 'MultiPolygon') {
        //   coordinates[polygonIndex][ringIndex][index] = groundCoords;
        // } else if (this.props.data.geometry.type === 'Polygon') {
        //   coordinates[ringIndex][index] = groundCoords;
        // }
        // // The first and last point are repeated, so update both if necessary
        // const lastIndexInRing = affectedRing.length - 1;
        // if (index === 0 || index === lastIndexInRing) {
        //   affectedRing[0] = groundCoords;
        //   affectedRing[lastIndexInRing] = groundCoords;
        // }

        const updatedFeature = {
          ...this.props.data,
          geometry: {
            ...this.props.data.geometry,
            coordinates
          }
        };

        this.props.onEditing({
          feature: updatedFeature,
          coordinateIndices
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
      if (this.props.onEditStart) {
        this.props.onEditStart(pickedPoint);
      }
    }
  }

  onPointerUp() {
    this.setState({ draggingPoint: null });
  }

  getPointerCoords(mouseEvent) {
    return {
      x: mouseEvent.clientX - this.context.gl.canvas.getBoundingClientRect().x,
      y: mouseEvent.clientY - this.context.gl.canvas.getBoundingClientRect().y
    };
  }
}
