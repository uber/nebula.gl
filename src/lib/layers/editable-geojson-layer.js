// @flow
/* eslint-env browser */

import { GeoJsonLayer, ScatterplotLayer, IconLayer } from 'deck.gl';
import bboxPolygon from '@turf/bbox-polygon';
import circle from '@turf/circle';
import distance from '@turf/distance';
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
  getLineColor: (feature, isSelected, mode) =>
    isSelected ? DEFAULT_SELECTED_LINE_COLOR : DEFAULT_LINE_COLOR,
  getFillColor: (feature, isSelected, mode) =>
    isSelected ? DEFAULT_SELECTED_FILL_COLOR : DEFAULT_FILL_COLOR,
  getRadius: f =>
    (f && f.properties && f.properties.radius) || (f && f.properties && f.properties.size) || 1,
  getLineWidth: f => (f && f.properties && f.properties.lineWidth) || 1,
  getLineDashArray: (feature, isSelected, mode) =>
    isSelected && mode !== 'view' ? [7, 4] : [0, 0],

  // drawing line
  getDrawLineDashArray: (f, mode) => [7, 4],
  getDrawLineColor: (f, mode) => DEFAULT_SELECTED_LINE_COLOR,
  getDrawFillColor: (f, mode) => DEFAULT_SELECTED_FILL_COLOR,
  getDrawLineWidth: (f, mode) => (f && f.properties && f.properties.lineWidth) || 1,

  editHandleType: 'point',

  // point handles
  editHandlePointRadiusScale: 1,
  editHandlePointRadiusMinPixels: 4,
  editHandlePointRadiusMaxPixels: Number.MAX_SAFE_INTEGER,
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
        getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getRadius: [this.props.selectedFeatureIndexes, this.props.mode],
        getLineWidth: [this.props.selectedFeatureIndexes, this.props.mode],
        getLineDashArray: [this.props.selectedFeatureIndexes, this.props.mode]
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
      selectedFeatures: [],
      editHandles: [],
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

    let selectedFeatures = [];
    if (Array.isArray(props.selectedFeatureIndexes)) {
      // TODO: needs improved testing, i.e. checking for duplicates, NaNs, out of range numbers, ...
      selectedFeatures = props.selectedFeatureIndexes.map(elem => props.data.features[elem]);
    }

    let editHandles = [];
    if (selectedFeatures.length && props.mode !== 'view') {
      props.selectedFeatureIndexes.forEach(index => {
        editHandles = editHandles.concat(editableFeatureCollection.getEditHandles(index));
      });
    }

    let drawFeature = this.state.drawFeature;
    if (props !== oldProps) {
      // If the props are different, recalculate the draw feature
      const selectedFeature = selectedFeatures.length === 1 ? selectedFeatures[0] : null;
      drawFeature = this.getDrawFeature(selectedFeature, props.mode, null);
    }

    this.setState({
      editableFeatureCollection,
      selectedFeatures,
      editHandles,
      drawFeature
    });
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

  createPointLayers() {
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

              getPosition: d => d.position
            })
          )
        : this.props.editHandleType === 'point'
          ? new ScatterplotLayer(
              this.getSubLayerProps({
                ...sharedProps,

                // Proxy editing point props
                radiusScale: this.props.editHandlePointRadiusScale,
                radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
                radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
                getRadius: this.props.getEditHandlePointRadius,
                getColor: this.props.getEditHandlePointColor
              })
            )
          : null;

    return [layer];
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
        stroked: this.props.mode !== 'drawPolygon',
        autoHighlight: false,
        lineWidthScale: this.props.lineWidthScale,
        lineWidthMinPixels: this.props.lineWidthMinPixels,
        lineWidthMaxPixels: this.props.lineWidthMaxPixels,
        lineJointRounded: this.props.lineJointRounded,
        lineMiterLimit: this.props.lineMiterLimit,
        pointRadiusScale: this.props.editHandlePointRadiusScale,
        pointRadiusMinPixels: this.props.editHandlePointRadiusMinPixels,
        pointRadiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
        getRadius: this.props.getEditHandlePointRadius,
        getLineColor: this.props.getDrawLineColor(this.state.selectedFeatures[0], this.props.mode),
        getLineWidth: this.props.getDrawLineWidth(this.state.selectedFeatures[0], this.props.mode),
        getFillColor: this.props.getDrawFillColor(this.state.selectedFeatures[0], this.props.mode),
        getLineDashArray: this.props.getDrawLineDashArray(
          this.state.selectedFeatures[0],
          this.props.mode
        )
      })
    );

    return [layer];
  }

  onClick({ picks, screenCoords, groundCoords }: Object) {
    const { selectedFeatures } = this.state;
    const { selectedFeatureIndexes } = this.props;
    const editHandleInfo = this.getPickedEditHandle(picks);

    if (this.props.mode === 'modify') {
      if (editHandleInfo && editHandleInfo.object.type === 'existing') {
        this.handleRemovePosition(
          this.props.data.features[editHandleInfo.object.featureIndex],
          editHandleInfo.object.featureIndex,
          editHandleInfo.object.positionIndexes
        );
      }
    } else if (
      this.props.mode === 'drawLineString' ||
      this.props.mode === 'drawPolygon' ||
      this.props.mode === 'drawRectangle' ||
      this.props.mode === 'drawCircle'
    ) {
      if (!selectedFeatures.length) {
        this.handleDrawNewPoint(groundCoords);
      } else if (selectedFeatures.length === 1) {
        // can only draw feature while one is selected
        if (this.props.mode === 'drawLineString') {
          this.handleDrawLineString(
            selectedFeatures[0],
            selectedFeatureIndexes[0],
            groundCoords,
            picks
          );
        }
        if (this.props.mode === 'drawPolygon') {
          this.handleDrawPolygon(
            selectedFeatures[0],
            selectedFeatureIndexes[0],
            groundCoords,
            picks
          );
        }
        if (this.props.mode === 'drawRectangle') {
          this.handleDrawRectangle(
            selectedFeatures[0],
            selectedFeatureIndexes[0],
            groundCoords,
            picks
          );
        }
        if (this.props.mode === 'drawCircle') {
          this.handleDrawCircle(
            selectedFeatures[0],
            selectedFeatureIndexes[0],
            groundCoords,
            picks
          );
        }
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
  }: Object) {
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
  }: Object) {
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

  onPointerMove({ screenCoords, groundCoords, isDragging, pointerDownPicks, sourceEvent }: Object) {
    if (
      this.props.mode === 'drawLineString' ||
      this.props.mode === 'drawPolygon' ||
      this.props.mode === 'drawRectangle' ||
      this.props.mode === 'drawCircle'
    ) {
      const selectedFeature =
        this.state.selectedFeatures.length === 1 ? this.state.selectedFeatures[0] : null;
      const drawFeature = this.getDrawFeature(selectedFeature, this.props.mode, groundCoords);

      this.setState({ drawFeature });

      // TODO: figure out how to properly update state from a pointer event handler
      this.setLayerNeedsUpdate();
    }

    if (pointerDownPicks && pointerDownPicks.length > 0) {
      const editHandleInfo = this.getPickedEditHandle(pointerDownPicks);
      if (editHandleInfo) {
        // TODO: find a less hacky way to prevent map panning
        // Stop propagation to prevent map panning while dragging an edit handle
        sourceEvent.stopPropagation();
      }
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
      if (mode === 'drawLineString' || mode === 'drawPolygon') {
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
      } else if (mode === 'drawRectangle') {
        const corner1 = ((selectedFeature.geometry.coordinates: any): Array<number>);
        const corner2 = groundCoords || corner1;
        const minX = Math.min(corner1[0], corner2[0]);
        const minY = Math.min(corner1[1], corner2[1]);
        const maxX = Math.max(corner1[0], corner2[0]);
        const maxY = Math.max(corner1[1], corner2[1]);

        drawFeature = bboxPolygon([minX, minY, maxX, maxY]);
      } else if (mode === 'drawCircle') {
        const center = ((selectedFeature.geometry.coordinates: any): Array<number>);
        const radius = Math.max(distance(selectedFeature, groundCoords || center), 0.001);
        drawFeature = circle(center, radius);
      }
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
        // Requires two features, a non-stroked polygon for fill and a
        // line string for the drawing feature
        drawFeature = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    // Draw a polygon containing all the points of the LineString,
                    // then the mouse position,
                    // then back to the starting position
                    ...selectedFeature.geometry.coordinates,
                    currentPosition,
                    selectedFeature.geometry.coordinates[0]
                  ]
                ]
              }
            },
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [
                  selectedFeature.geometry.coordinates[
                    selectedFeature.geometry.coordinates.length - 1
                  ],
                  currentPosition,
                  selectedFeature.geometry.coordinates[0]
                ]
              }
            }
          ]
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
      updatedSelectedFeatureIndexes: this.props.selectedFeatureIndexes,
      editType: 'movePosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleFinishMovePosition(featureIndex: number, positionIndexes: number, groundCoords: number[]) {
    const updatedData = this.state.editableFeatureCollection
      .replacePosition(featureIndex, positionIndexes, groundCoords)
      .getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: this.props.mode,
      updatedSelectedFeatureIndexes: this.props.selectedFeatureIndexes,
      editType: 'finishMovePosition',
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
      updatedSelectedFeatureIndexes: this.props.selectedFeatureIndexes,
      editType: 'addPosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleRemovePosition(
    selectedFeature: GeoJsonFeature,
    featureIndex: number,
    positionIndexes: number
  ) {
    let updatedData;
    try {
      updatedData = this.state.editableFeatureCollection
        .removePosition(featureIndex, positionIndexes)
        .getObject();
    } catch (error) {
      // This happens if user attempts to remove the last point
    }

    if (updatedData) {
      this.props.onEdit({
        updatedData,
        updatedMode: this.props.mode,
        updatedSelectedFeatureIndexes: this.props.selectedFeatureIndexes,
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

      // Upgrade from Point to LineString
      featureCollection = featureCollection.replaceGeometry(featureIndex, {
        type: 'LineString',
        coordinates: [selectedFeature.geometry.coordinates, groundCoords]
      });
    } else if (selectedFeature.geometry.type === 'LineString') {
      positionIndexes = [selectedFeature.geometry.coordinates.length];
      featureCollection = featureCollection.addPosition(
        featureIndex,
        positionIndexes,
        groundCoords
      );
    } else {
      console.warn(`Unsupported geometry type: ${selectedFeature.geometry.type}`); // eslint-disable-line
      return;
    }

    const updatedData = featureCollection.getObject();

    this.props.onEdit({
      updatedData,
      updatedMode: this.props.mode,
      updatedSelectedFeatureIndexes: this.props.selectedFeatureIndexes,
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
      // Upgrade from Point to LineString
      featureCollection = featureCollection.replaceGeometry(featureIndex, {
        type: 'LineString',
        coordinates: [selectedFeature.geometry.coordinates, groundCoords]
      });
    } else if (selectedFeature.geometry.type === 'LineString') {
      const pickedHandleInfo = this.getPickedEditHandle(picks);
      if (
        pickedHandleInfo &&
        pickedHandleInfo.object.positionIndexes[0] === 0 &&
        selectedFeature.geometry.coordinates.length > 2
      ) {
        // They clicked the first position of the LineString, so close the polygon
        featureCollection = featureCollection.replaceGeometry(featureIndex, {
          type: 'Polygon',
          coordinates: [
            [...selectedFeature.geometry.coordinates, selectedFeature.geometry.coordinates[0]]
          ]
        });
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
      return;
    }

    const updatedData = featureCollection.getObject();

    this.props.onEdit({
      updatedData,
      updatedMode,
      updatedSelectedFeatureIndexes: this.props.selectedFeatureIndexes,
      editType: 'addPosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleDrawRectangle(
    selectedFeature: GeoJsonFeature,
    featureIndex: number,
    groundCoords: number[],
    picks: Object[]
  ) {
    let featureCollection = this.state.editableFeatureCollection;
    let positionIndexes;

    let updatedMode = this.props.mode;

    if (selectedFeature.geometry.type === 'Point') {
      positionIndexes = null;
      featureCollection = featureCollection.replaceGeometry(
        featureIndex,
        this.state.drawFeature.geometry
      );
      updatedMode = 'modify';
    } else {
      console.warn(`Unsupported geometry type: ${selectedFeature.geometry.type}`); // eslint-disable-line
      return;
    }

    const updatedData = featureCollection.getObject();

    this.props.onEdit({
      updatedData,
      updatedMode,
      updatedSelectedFeatureIndexes: this.props.selectedFeatureIndexes,
      editType: 'addPosition',
      featureIndex,
      positionIndexes,
      position: groundCoords
    });
  }

  handleDrawCircle(
    selectedFeature: GeoJsonFeature,
    featureIndex: number,
    groundCoords: number[],
    picks: Object[]
  ) {
    let featureCollection = this.state.editableFeatureCollection;
    let positionIndexes;

    let updatedMode = this.props.mode;

    if (selectedFeature.geometry.type === 'Point') {
      positionIndexes = null;
      featureCollection = featureCollection.replaceGeometry(
        featureIndex,
        this.state.drawFeature.geometry
      );
      updatedMode = 'modify';
    } else {
      console.warn(`Unsupported geometry type: ${selectedFeature.geometry.type}`); // eslint-disable-line
      return;
    }

    const updatedData = featureCollection.getObject();

    this.props.onEdit({
      updatedData,
      updatedMode,
      updatedSelectedFeatureIndexes: this.props.selectedFeatureIndexes,
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
      updatedSelectedFeatureIndexes: [featureIndex],
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
