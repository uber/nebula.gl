// @flow
/* eslint-env browser */

import { GeoJsonLayer, ScatterplotLayer } from 'deck.gl';
import type { GeoJsonFeature } from '../../types';
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
  lineDashJustified: false,
  getLineColor: (feature, isSelected) =>
    isSelected ? DEFAULT_SELECTED_LINE_COLOR : DEFAULT_LINE_COLOR,
  getFillColor: (feature, isSelected) =>
    isSelected ? DEFAULT_SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR,
  getRadius: f =>
    (f && f.properties && f.properties.radius) || (f && f.properties && f.properties.size) || 1,
  getLineWidth: f => (f && f.properties && f.properties.lineWidth) || 1,
  getLineDashArray: null,

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
      lineDashJustified: this.props.lineDashJustified,
      getLineColor: this.selectionAwareAccessor(this.props.getLineColor),
      getFillColor: this.selectionAwareAccessor(this.props.getFillColor),
      getRadius: this.selectionAwareAccessor(this.props.getRadius),
      getLineWidth: this.selectionAwareAccessor(this.props.getLineWidth),
      getLineDashArray: this.selectionAwareAccessor(this.props.getLineDashArray),

      updateTriggers: {
        getLineColor: this.props.selectedFeatureIndex,
        getFillColor: this.props.selectedFeatureIndex,
        getRadius: this.props.selectedFeatureIndex,
        getLineWidth: this.props.selectedFeatureIndex,
        getLineDashArray: this.props.selectedFeatureIndex
      }
    });

    let layers = [new GeoJsonLayer(subLayerProps)];

    layers = layers.concat(this.createPointLayers());
    layers = layers.concat(this.createDrawLayers());

    return layers;
  }

  initializeState() {
    super.initializeState();

    this.setState({
      editableFeatureCollection: null,
      selectedFeature: null,
      editHandles: null,
      drawFeature: null
    });
  }

  // TODO: figure out how to properly update state from an outside event handler
  shouldUpdateState({ props, oldProps, context, oldContext, changeFlags }: Object) {
    return true;
  }

  updateState({ props, oldProps, changeFlags }: Object) {
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

    let drawFeature = this.state.drawFeature;
    if (props !== oldProps) {
      // If the props are different, recalculate the draw feature
      drawFeature = this.getDrawFeature(selectedFeature, props.mode, null);
    }

    this.setState({ editableFeatureCollection, selectedFeature, editHandles, drawFeature });
  }

  selectionAwareAccessor(accessor: any) {
    if (typeof accessor !== 'function') {
      return accessor;
    }
    return (feature: Object) => accessor(feature, this.isFeatureSelected(feature));
  }

  isFeatureSelected(feature: Object) {
    // TODO: Upgrade deck to include https://github.com/uber/deck.gl/commit/40ff66ed
    // This will be buggy until then
    if (!this.props.data) {
      return false;
    }
    const featureIndex = this.props.data.features.indexOf(feature);
    return this.props.selectedFeatureIndex === featureIndex;
  }

  getPickingInfo({ info, sourceLayer }: Object) {
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

  createDrawLayers() {
    if (!this.state.drawFeature) {
      return [];
    }

    const layer = new GeoJsonLayer(
      this.getSubLayerProps({
        id: 'draw',
        data: this.state.drawFeature,
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
        getLineDashArray: () => [10, 10],
        // getRadius: () => this.props.getEditHandlePointRadius() + 20
        getRadius: this.props.getEditHandlePointRadius
      })
    );

    return [layer];
  }

  onClick({ picks, screenCoords, groundCoords }: Object) {
    const { selectedFeature } = this.state;
    const { selectedFeatureIndex } = this.props;
    const editHandleInfo = this.getPickedEditHandle(picks);

    if (this.props.mode === 'modify') {
      if (editHandleInfo && editHandleInfo.object.type === 'existing') {
        this.handleRemovePosition(selectedFeatureIndex, editHandleInfo.object.positionIndexes);
      }
    } else if (this.props.mode === 'drawLineString' || this.props.mode === 'drawPolygon') {
      if (!selectedFeature) {
        this.handleDrawNewPoint(groundCoords);
      } else if (this.props.mode === 'drawLineString') {
        this.handleDrawLineString(selectedFeature, selectedFeatureIndex, groundCoords, picks);
      } else if (this.props.mode === 'drawPolygon') {
        this.handleDrawPolygon(selectedFeature, selectedFeatureIndex, groundCoords, picks);
      }
    }
  }

  onStartDragging({
    picks,
    screenCoords,
    groundCoords,
    dragStartScreenCoords,
    dragStartGroundCoords
  }: Object) {
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

  onDragging({
    picks,
    screenCoords,
    groundCoords,
    dragStartScreenCoords,
    dragStartGroundCoords
  }: Object) {
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

  onPointerMove({ screenCoords, groundCoords, isDragging }: Object) {
    if (this.props.mode === 'drawLineString' || this.props.mode === 'drawPolygon') {
      const drawFeature = this.getDrawFeature(
        this.state.selectedFeature,
        this.props.mode,
        groundCoords
      );

      this.setState({ drawFeature });

      // TODO: figure out how to properly update state from a pointer event handler
      this.setLayerNeedsUpdate();
    }
  }

  getDrawFeature(selectedFeature: ?GeoJsonFeature, mode: string, groundCoords: ?(number[])) {
    let drawFeature = null;

    if (!selectedFeature && !groundCoords) {
      // Need a mouse position in order to draw a single point
      return null;
    }

    if (!selectedFeature) {
      // Start with a point
      drawFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: groundCoords
        }
      };
    } else if (selectedFeature.geometry.type === 'Point') {
      // Draw an extension line starting from the point
      const startPosition = selectedFeature.geometry.coordinates;
      const endPosition = groundCoords || startPosition;

      drawFeature = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [startPosition, endPosition]
        }
      };
    } else if (selectedFeature.geometry.type === 'LineString') {
      const lastPositionOfLineString =
        selectedFeature.geometry.coordinates[selectedFeature.geometry.coordinates.length - 1];
      const currentPosition = groundCoords || lastPositionOfLineString;

      if (mode === 'drawLineString') {
        // Draw a single line extending beyond the last point

        drawFeature = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [lastPositionOfLineString, currentPosition]
          }
        };
      } else if (mode === 'drawPolygon') {
        // Draw a polygon containing all the points of the LineString,
        // then the mouse position,
        // then back to the starting position

        drawFeature = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                ...selectedFeature.geometry.coordinates,
                currentPosition,
                selectedFeature.geometry.coordinates[0]
              ]
            ]
          }
        };
      }
    }
    return drawFeature;
  }

  handleMovePosition(featureIndex: number, positionIndexes: number, groundCoords: number[]) {
    const updatedData = this.state.editableFeatureCollection
      .replacePosition(featureIndex, positionIndexes, groundCoords)
      .getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: this.props.mode,
      updatedSelectedFeatureIndex: featureIndex,
      editType: 'movePosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleAddIntermediatePosition(
    featureIndex: number,
    positionIndexes: number,
    groundCoords: number[]
  ) {
    const updatedData = this.state.editableFeatureCollection
      .addPosition(featureIndex, positionIndexes, groundCoords)
      .getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: this.props.mode,
      updatedSelectedFeatureIndex: featureIndex,
      editType: 'addPosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleRemovePosition(featureIndex: number, positionIndexes: number) {
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
        updatedSelectedFeatureIndex: featureIndex,
        editType: 'removePosition',
        featureIndex,
        positionIndexes
      });
    }
  }

  handleDrawLineString(
    selectedFeature: GeoJsonFeature,
    featureIndex: number,
    groundCoords: number[],
    picks: Object[]
  ) {
    let featureCollection = this.state.editableFeatureCollection;
    let positionIndexes;

    if (selectedFeature.geometry.type === 'Point') {
      positionIndexes = [1];
      featureCollection = featureCollection.upgradePointToLineString(featureIndex, groundCoords);
    } else if (selectedFeature.geometry.type === 'LineString') {
      positionIndexes = [selectedFeature.geometry.coordinates.length];
      featureCollection = featureCollection.addPosition(
        featureIndex,
        positionIndexes,
        groundCoords
      );
    } else {
      console.warn(`Unsupported geometry type: ${selectedFeature.geometry.type}`); // eslint-disable-line
    }

    const updatedData = featureCollection.getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: this.props.mode,
      updatedSelectedFeatureIndex: featureIndex,
      editType: 'addPosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleDrawPolygon(
    selectedFeature: GeoJsonFeature,
    featureIndex: number,
    groundCoords: number[],
    picks: Object[]
  ) {
    let featureCollection = this.state.editableFeatureCollection;
    let positionIndexes;

    let updatedMode = this.props.mode;

    if (selectedFeature.geometry.type === 'Point') {
      positionIndexes = [1];
      featureCollection = featureCollection.upgradePointToLineString(featureIndex, groundCoords);
    } else if (selectedFeature.geometry.type === 'LineString') {
      const pickedHandleInfo = this.getPickedEditHandle(picks);
      if (
        pickedHandleInfo &&
        pickedHandleInfo.object.positionIndexes[0] === 0 &&
        selectedFeature.geometry.coordinates.length > 2
      ) {
        // They clicked the first position of the LineString, so close the polygon
        featureCollection = featureCollection.convertLineStringToPolygon(featureIndex);
        updatedMode = 'modify';
      } else {
        // Add another point along the LineString
        positionIndexes = [selectedFeature.geometry.coordinates.length];
        featureCollection = featureCollection.addPosition(
          featureIndex,
          positionIndexes,
          groundCoords
        );
      }
    } else {
      console.warn(`Unsupported geometry type: ${selectedFeature.geometry.type}`); // eslint-disable-line
    }

    const updatedData = featureCollection.getObject();

    this.props.onEdit({
      updatedData,
      updatedMode,
      updatedSelectedFeatureIndex: featureIndex,
      editType: 'addPosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleDrawNewPoint(groundCoords: number[]) {
    // Starts off as a point (since LineString requires at least 2 positions)
    const newFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: groundCoords
      }
    };

    const updatedData = this.state.editableFeatureCollection.addFeature(newFeature).getObject();
    const featureIndex = this.props.data.features.length;

    this.props.onEdit({
      updatedData,
      updatedMode: this.props.mode,
      updatedSelectedFeatureIndex: featureIndex,
      editType: 'addFeature',
      featureIndex,
      positionIndexes: [0],
      position: groundCoords
    });
  }

  getPickedEditHandle(picks: Object[]) {
    return picks.find(pick => pick.isEditingHandle);
  }
}

EditableGeoJsonLayer.layerName = 'EditableGeoJsonLayer';
EditableGeoJsonLayer.defaultProps = defaultProps;
