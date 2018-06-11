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
      if (this.props.data.geometry.type === 'MultiPolygon') {
        info.coordinateIndexes = [polygonIndex, ringIndex, info.index];
      } else if (this.props.data.geometry.type === 'Polygon') {
        info.coordinateIndexes = [ringIndex, info.index];
      }
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
        let polygonIndex;
        let ringIndex;
        let pointIndex;

        // Immutably set coordinates
        let affectedPolygon;
        let affectedRing;
        if (this.props.data.geometry.type === 'MultiPolygon') {
          polygonIndex = coordinateIndexes[0];
          ringIndex = coordinateIndexes[1];
          pointIndex = coordinateIndexes[2];
          affectedPolygon = this.props.data.geometry.coordinates[polygonIndex];
        } else if (this.props.data.geometry.type === 'Polygon') {
          ringIndex = coordinateIndexes[0];
          pointIndex = coordinateIndexes[1];
          affectedPolygon = this.props.data.geometry.coordinates;
        } else {
          throw Error(`Unsupported geometry type ${this.props.data.geometry.type}`);
        }

        // Immutably update affected ring (with the actual point that was changed)
        affectedRing = affectedPolygon[ringIndex];
        affectedRing = [
          ...affectedRing.slice(0, pointIndex),
          groundCoords,
          ...affectedRing.slice(pointIndex + 1)
        ];

        // The first and last point are repeated, so update both if necessary
        const lastIndexInRing = affectedRing.length - 1;
        if (pointIndex === 0 || pointIndex === lastIndexInRing) {
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
        //   coordinates[polygonIndex][ringIndex][pointIndex] = groundCoords;
        // } else if (this.props.data.geometry.type === 'Polygon') {
        //   coordinates[ringIndex][pointIndex] = groundCoords;
        // }
        // // The first and last point are repeated, so update both if necessary
        // const lastIndexInRing = affectedRing.length - 1;
        // if (pointIndex === 0 || pointIndex === lastIndexInRing) {
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

        this.props.onDraggingPoint({
          feature: updatedFeature,
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
          coordinateIndexes: pickedPoint.coordinateIndexes
        });
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
