// @flow
/* eslint-env browser */

import { GeoJsonLayer, ScatterplotLayer, IconLayer } from 'deck.gl';
import bboxPolygon from '@turf/bbox-polygon';
import circle from '@turf/circle';
import ellipse from '@turf/ellipse';
import distance from '@turf/distance';
import center from '@turf/center';
import destination from '@turf/destination';
import bearing from '@turf/bearing';
import turfTransformRotate from '@turf/transform-rotate';
import pointToLineDistance from '@turf/point-to-line-distance';
import { point, featureCollection as fc } from '@turf/helpers';
import { EditableFeatureCollection } from '../editable-feature-collection.js';
import type { EditAction } from '../editable-feature-collection.js';
import type { AnyGeoJson, Feature, Position } from '../../geojson-types.js';
import EditableLayer from './editable-layer.js';

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
  drawAtFront: false,
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
  editHandleParameters: {},

  // point handles
  editHandlePointRadiusScale: 1,
  editHandlePointOutline: false,
  editHandlePointStrokeWidth: 1,
  editHandlePointRadiusMinPixels: 4,
  editHandlePointRadiusMaxPixels: 8,
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

type Props = {
  onEdit: EditAction => void,
  // TODO
  [string]: any
};

type State = {
  editableFeatureCollection: EditableFeatureCollection,
  tentativeFeature: ?Feature,
  drawFeature: ?AnyGeoJson,
  editHandles: any[],
  selectedFeatures: Feature[],
  pointerMovePicks: any[]
};

export default class EditableGeoJsonLayer extends EditableLayer {
  state: State;

  props: Props;

  setState: ($Shape<State>) => void;

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

    let layers: any = [new GeoJsonLayer(subLayerProps)];

    layers = layers.concat(this.createPointLayers());
    layers = layers.concat(this.createDrawLayers());

    return layers;
  }

  initializeState() {
    super.initializeState();

    this.setState({
      editableFeatureCollection: new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: []
      }),
      selectedFeatures: [],
      editHandles: [],
      drawFeature: null
    });
  }

  // TODO: figure out how to properly update state from an outside event handler
  shouldUpdateState({ props, oldProps, context, oldContext, changeFlags }: Object) {
    if (changeFlags.stateChanged) {
      return true;
    }
    return true;
  }

  updateState({
    props,
    oldProps,
    changeFlags
  }: {
    props: Props,
    oldProps: Props,
    changeFlags: any
  }) {
    super.updateState({ props, changeFlags });

    const editableFeatureCollection = this.state.editableFeatureCollection;
    if (changeFlags.dataChanged) {
      editableFeatureCollection.setFeatureCollection(props.data);
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
    if (changeFlags.propsOrDataChanged) {
      // If the props are different, recalculate the draw feature
      const selectedFeature = selectedFeatures.length === 1 ? selectedFeatures[0] : null;
      drawFeature = this.getDrawFeature(selectedFeature, props.mode, null);

      editableFeatureCollection.setMode(props.mode);
      editableFeatureCollection.setSelectedFeatureIndexes(props.selectedFeatureIndexes);
      this.updateTentativeFeature();
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

              getPosition: d => d.position,

              parameters: this.props.editHandleParameters
            })
          )
        : this.props.editHandleType === 'point'
          ? new ScatterplotLayer(
              this.getSubLayerProps({
                ...sharedProps,

                // Proxy editing point props
                radiusScale: this.props.editHandlePointRadiusScale,
                outline: this.props.editHandlePointOutline,
                strokeWidth: this.props.editHandlePointStrokeWidth,
                radiusMinPixels: this.props.editHandlePointRadiusMinPixels,
                radiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
                getRadius: this.props.getEditHandlePointRadius,
                getColor: this.props.getEditHandlePointColor,

                parameters: this.props.editHandleParameters
              })
            )
          : null;

    return [layer];
  }

  createDrawLayers() {
    if (!this.state.drawFeature && !this.state.tentativeFeature) {
      return [];
    }

    const layers = [];

    const tentativeFeature = this.state.tentativeFeature;
    if (tentativeFeature) {
      layers.push(
        new GeoJsonLayer(
          this.getSubLayerProps({
            id: 'tentative',
            data: tentativeFeature,
            fp64: this.props.fp64,
            pickable: false,
            stroked: true,
            autoHighlight: false,
            lineWidthScale: this.props.lineWidthScale,
            lineWidthMinPixels: this.props.lineWidthMinPixels,
            lineWidthMaxPixels: this.props.lineWidthMaxPixels,
            lineJointRounded: this.props.lineJointRounded,
            lineMiterLimit: this.props.lineMiterLimit,
            pointRadiusScale: this.props.editHandlePointRadiusScale,
            outline: this.props.editHandlePointOutline,
            strokeWidth: this.props.editHandlePointStrokeWidth,
            pointRadiusMinPixels: this.props.editHandlePointRadiusMinPixels,
            pointRadiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
            getRadius: this.props.getEditHandlePointRadius,
            getLineColor: feature =>
              this.props.getDrawLineColor(feature, this.state.selectedFeatures[0], this.props.mode),
            getLineWidth: feature =>
              this.props.getDrawLineWidth(feature, this.state.selectedFeatures[0], this.props.mode),
            getFillColor: feature =>
              this.props.getDrawFillColor(feature, this.state.selectedFeatures[0], this.props.mode),
            getLineDashArray: feature =>
              this.props.getDrawLineDashArray(
                feature,
                this.state.selectedFeatures[0],
                this.props.mode
              )
          })
        )
      );
    }

    layers.push(
      new GeoJsonLayer(
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
          outline: this.props.editHandlePointOutline,
          strokeWidth: this.props.editHandlePointStrokeWidth,
          pointRadiusMinPixels: this.props.editHandlePointRadiusMinPixels,
          pointRadiusMaxPixels: this.props.editHandlePointRadiusMaxPixels,
          getRadius: this.props.getEditHandlePointRadius,
          getLineColor: feature =>
            this.props.getDrawLineColor(feature, this.state.selectedFeatures[0], this.props.mode),
          getLineWidth: feature =>
            this.props.getDrawLineWidth(feature, this.state.selectedFeatures[0], this.props.mode),
          getFillColor: feature =>
            this.props.getDrawFillColor(feature, this.state.selectedFeatures[0], this.props.mode),
          getLineDashArray: feature =>
            this.props.getDrawLineDashArray(
              feature,
              this.state.selectedFeatures[0],
              this.props.mode
            )
        })
      )
    );
    return layers;
  }

  updateTentativeFeature() {
    const tentativeFeature = this.state.editableFeatureCollection.getTentativeFeature();
    if (tentativeFeature !== this.state.tentativeFeature) {
      this.setState({ tentativeFeature });
      this.setLayerNeedsUpdate();
    }
  }

  onDoubleClick({ groundCoords }: Object) {
    const { selectedFeatures } = this.state;
    const { selectedFeatureIndexes } = this.props;
    const selectedFeature = selectedFeatures[0];
    const featureIndex = selectedFeatureIndexes[0];
    let featureCollection = this.state.editableFeatureCollection;

    if (
      this.props.mode === 'drawPolygon' &&
      selectedFeatures.length === 1 &&
      selectedFeature.geometry.type === 'LineString' &&
      selectedFeature.geometry.coordinates.length > 4
    ) {
      const { coordinates } = selectedFeature.geometry;
      // close the polygon.
      featureCollection = featureCollection.replaceGeometry(featureIndex, {
        type: 'Polygon',
        // when double clicked, there will be additional 2 pointer up/down events fired.
        // Remove those 2 unnecessary points from coordinates.
        // Issue #69 dblclick event is also firing 2 additional pointer up/down events
        coordinates: [[...coordinates.slice(0, coordinates.length - 2), coordinates[0]]]
      });
      const updatedMode = 'modify';
      const updatedData = featureCollection.getFeatureCollection();

      this.props.onEdit({
        updatedData,
        updatedMode,
        updatedSelectedFeatureIndexes: this.props.selectedFeatureIndexes,
        editType: 'addPosition',
        featureIndex,
        positionIndexes: undefined,
        position: groundCoords
      });
    }
  }

  onClick({ picks, screenCoords, groundCoords }: Object) {
    const { selectedFeatures } = this.state;
    const { selectedFeatureIndexes } = this.props;
    const editHandleInfo = this.getPickedEditHandle(picks);

    let editAction = null;

    if (editHandleInfo && editHandleInfo.object.type === 'existing') {
      this.handleRemovePosition(
        this.props.data.features[editHandleInfo.object.featureIndex],
        editHandleInfo.object.featureIndex,
        editHandleInfo.object.positionIndexes
      );
    } else if (this.props.mode === 'drawLineString') {
      editAction = this.state.editableFeatureCollection.onClick(groundCoords);
      this.updateTentativeFeature();
    } else if (
      this.props.mode === 'drawPoint' ||
      this.props.mode === 'drawPolygon' ||
      this.props.mode === 'drawRectangle' ||
      this.props.mode === 'drawRectangleUsing3Points' ||
      this.props.mode === 'drawCircleFromCenter' ||
      this.props.mode === 'drawCircleByBoundingBox' ||
      this.props.mode === 'drawEllipseByBoundingBox' ||
      this.props.mode === 'drawEllipseUsing3Points'
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
        if (
          this.props.mode === 'drawRectangleUsing3Points' ||
          this.props.mode === 'drawEllipseUsing3Points'
        ) {
          this.handleDrawRectangleUsing3Points(
            selectedFeatures[0],
            selectedFeatureIndexes[0],
            groundCoords,
            picks
          );
        }
        if (
          this.props.mode === 'drawCircleFromCenter' ||
          this.props.mode === 'drawCircleByBoundingBox'
        ) {
          this.handleDrawCircle(
            selectedFeatures[0],
            selectedFeatureIndexes[0],
            groundCoords,
            picks
          );
        }
        if (this.props.mode === 'drawEllipseByBoundingBox') {
          this.handleDrawEllipseByBoundingBox(
            selectedFeatures[0],
            selectedFeatureIndexes[0],
            groundCoords,
            picks
          );
        }
      }
    }

    if (editAction) {
      this.props.onEdit(editAction);
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

  onPointerMove({
    screenCoords,
    groundCoords,
    isDragging,
    picks,
    pointerDownPicks,
    sourceEvent
  }: Object) {
    this.setState({ pointerMovePicks: picks });

    if (pointerDownPicks && pointerDownPicks.length > 0) {
      const editHandleInfo = this.getPickedEditHandle(pointerDownPicks);
      if (editHandleInfo) {
        // TODO: find a less hacky way to prevent map panning
        // Stop propagation to prevent map panning while dragging an edit handle
        sourceEvent.stopPropagation();
      }
    }

    this.state.editableFeatureCollection.onPointerMove(groundCoords);
    this.updateTentativeFeature();

    if (
      this.props.mode === 'drawPolygon' ||
      this.props.mode === 'drawRectangle' ||
      this.props.mode === 'drawRectangleUsing3Points' ||
      this.props.mode === 'drawCircleFromCenter' ||
      this.props.mode === 'drawCircleByBoundingBox' ||
      this.props.mode === 'drawEllipseByBoundingBox' ||
      this.props.mode === 'drawEllipseUsing3Points'
    ) {
      const selectedFeature =
        this.state.selectedFeatures.length === 1 ? this.state.selectedFeatures[0] : null;
      const drawFeature = this.getDrawFeature(selectedFeature, this.props.mode, groundCoords);

      this.setState({ drawFeature });

      // TODO: figure out how to properly update state from a pointer event handler
      this.setLayerNeedsUpdate();
    }

    if (
      this.props.mode === 'modify' &&
      this.props.modeConfig &&
      this.props.modeConfig.action === 'transformRotate'
    ) {
      this.handleTransformRotate(screenCoords, groundCoords);
    }
  }

  getDrawFeature(selectedFeature: ?Feature, mode: string, groundCoords: ?Position): ?AnyGeoJson {
    let drawFeature: ?AnyGeoJson = null;

    if (!selectedFeature) {
      if (!groundCoords) {
        // Need a mouse position in order to draw a single point
        return null;
      }
      // Start with a point
      drawFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: groundCoords
        }
      };
    } else if (selectedFeature.geometry.type === 'Point') {
      if (
        mode === 'drawLineString' ||
        mode === 'drawPolygon' ||
        mode === 'drawRectangleUsing3Points' ||
        mode === 'drawEllipseUsing3Points'
      ) {
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
      } else if (mode === 'drawCircleFromCenter') {
        const centerCoordinates = ((selectedFeature.geometry.coordinates: any): Array<number>);
        const radius = Math.max(
          distance(selectedFeature, groundCoords || centerCoordinates),
          0.001
        );
        drawFeature = circle(centerCoordinates, radius);
      } else if (mode === 'drawCircleByBoundingBox') {
        const centerCoordinates = (selectedFeature.geometry.coordinates.map(
          (p, i) => (groundCoords && (p + groundCoords[i]) / 2) || p
        ): Array<number>);
        const radius = Math.max(
          distance(selectedFeature, centerCoordinates || selectedFeature),
          0.001
        );
        drawFeature = circle(centerCoordinates, radius);
      } else if (mode === 'drawEllipseByBoundingBox') {
        const corner1 = ((selectedFeature.geometry.coordinates: any): Array<number>);
        const corner2 = groundCoords || corner1;

        const minX = Math.min(corner1[0], corner2[0]);
        const minY = Math.min(corner1[1], corner2[1]);
        const maxX = Math.max(corner1[0], corner2[0]);
        const maxY = Math.max(corner1[1], corner2[1]);

        const polygonPoints = bboxPolygon([minX, minY, maxX, maxY]).geometry.coordinates[0];
        const ellipseCenter = center(fc([point(corner1), point(corner2)]));

        const xSemiAxis = Math.max(
          distance(point(polygonPoints[0]), point(polygonPoints[1])),
          0.001
        );
        const ySemiAxis = Math.max(
          distance(point(polygonPoints[0]), point(polygonPoints[3])),
          0.001
        );

        drawFeature = ellipse(ellipseCenter, xSemiAxis, ySemiAxis);
      }
    } else if (selectedFeature.geometry.type === 'LineString') {
      const positionOfLineString = this.props.drawAtFront
        ? selectedFeature.geometry.coordinates[0]
        : selectedFeature.geometry.coordinates[selectedFeature.geometry.coordinates.length - 1];
      const currentPosition = groundCoords || positionOfLineString;

      if (mode === 'drawLineString') {
        // Draw a single line extending beyond the last point

        drawFeature = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [positionOfLineString, currentPosition]
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
      } else if (mode === 'drawRectangleUsing3Points') {
        const [p1, p2] = selectedFeature.geometry.coordinates;
        const pt = point(currentPosition);
        const options = { units: 'miles' };
        const ddistance = pointToLineDistance(pt, selectedFeature, options);
        const lineBearing = bearing(p1, p2);

        // Check if current point is to the left or right of line
        // Line from A=(x1,y1) to B=(x2,y2) a point P=(x,y)
        // then (x−x1)(y2−y1)−(y−y1)(x2−x1)
        const isPointToLeftOfLine =
          (currentPosition[0] - p1[0]) * (p2[1] - p1[1]) -
          (currentPosition[1] - p1[1]) * (p2[0] - p1[0]);

        // Bearing to draw perpendicular to the line string
        const orthogonalBearing = isPointToLeftOfLine < 0 ? lineBearing - 90 : lineBearing - 270;

        // Get coordinates for the point p3 and p4 which are perpendicular to the lineString
        // Add the distance as the current position moves away from the lineString
        const p3 = destination(p2, ddistance, orthogonalBearing, options);
        const p4 = destination(p1, ddistance, orthogonalBearing, options);

        if (selectedFeature.geometry.type !== 'LineString') {
          // This shouldn't happen, but flow needs the type guard right before using it, grr...
          return null;
        }

        drawFeature = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                // Draw a polygon containing all the points of the LineString,
                // then the points orthogonal to the lineString,
                // then back to the starting position
                ...selectedFeature.geometry.coordinates,
                p3.geometry.coordinates,
                p4.geometry.coordinates,
                p1
              ]
            ]
          }
        };
      } else if (mode === 'drawEllipseUsing3Points') {
        const [p1, p2] = selectedFeature.geometry.coordinates;

        const ellipseCenter = center(fc([point(p1), point(p2)]));
        const xSemiAxis = Math.max(distance(ellipseCenter, point(currentPosition)), 0.001);
        const ySemiAxis = Math.max(distance(p1, p2), 0.001) / 2;
        const options = { angle: bearing(p1, p2) };

        drawFeature = ellipse(ellipseCenter, xSemiAxis, ySemiAxis, options);
      }
    }
    return drawFeature;
  }

  handleTransformRotate(screenCoords: number[], groundCoords: Position) {
    const { modeConfig } = this.props;
    let pivot;

    if (modeConfig && modeConfig.usePickAsPivot) {
      const picks = this.context.layerManager.pickObject({
        x: screenCoords[0],
        y: screenCoords[1],
        mode: 'query',
        layers: [this.props.id],
        radius: 100,
        viewports: [this.context.viewport]
      });
      // do nothing when mouse position far away from any point
      if (!picks || !picks.length || !picks[0].object.position) {
        return;
      }
      pivot = picks[0].object.position;
    } else {
      pivot = modeConfig.pivot;
    }
    const featureIndex = this.props.selectedFeatureIndexes[0];
    const feature = this.state.selectedFeatures[0];
    const rotatedFeature = turfTransformRotate(feature, 2, { pivot });

    const updatedData = this.state.editableFeatureCollection
      .replaceGeometry(featureIndex, rotatedFeature.geometry)
      .getFeatureCollection();

    this.props.onEdit({
      updatedData,
      updatedMode: this.props.mode,
      updatedSelectedFeatureIndexes: this.props.selectedFeatureIndexes,
      editType: 'transformPosition',
      featureIndex,
      positionIndexes: this.props.positionIndexes,
      position: groundCoords
    });
  }

  handleMovePosition(featureIndex: number, positionIndexes: number[], groundCoords: Position) {
    const updatedData = this.state.editableFeatureCollection
      .replacePosition(featureIndex, positionIndexes, groundCoords)
      .getFeatureCollection();

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

  handleFinishMovePosition(
    featureIndex: number,
    positionIndexes: number[],
    groundCoords: Position
  ) {
    const updatedData = this.state.editableFeatureCollection
      .replacePosition(featureIndex, positionIndexes, groundCoords)
      .getFeatureCollection();

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
    positionIndexes: number[],
    groundCoords: Position
  ) {
    const updatedData = this.state.editableFeatureCollection
      .addPosition(featureIndex, positionIndexes, groundCoords)
      .getFeatureCollection();

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

  handleRemovePosition(selectedFeature: Feature, featureIndex: number, positionIndexes: number[]) {
    let updatedData;
    try {
      updatedData = this.state.editableFeatureCollection
        .removePosition(featureIndex, positionIndexes)
        .getFeatureCollection();
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
        positionIndexes,
        position: null
      });
    }
  }

  handleDrawLineString(
    selectedFeature: Feature,
    featureIndex: number,
    groundCoords: Position,
    picks: Object[]
  ) {
    const { drawAtFront } = this.props;
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
      positionIndexes = [drawAtFront ? 0 : selectedFeature.geometry.coordinates.length];
      featureCollection = featureCollection.addPosition(
        featureIndex,
        positionIndexes,
        groundCoords
      );
    } else {
      console.warn(`Unsupported geometry type: ${selectedFeature.geometry.type}`); // eslint-disable-line
      return;
    }

    const updatedData = featureCollection.getFeatureCollection();

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

  handleDrawRectangleUsing3Points(
    selectedFeature: Feature,
    featureIndex: number,
    groundCoords: Position,
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
    } else {
      // Draw the rectangle with the drawFeature geometry
      featureCollection = featureCollection.replaceGeometry(
        featureIndex,
        // $FlowFixMe: it's ok, I know drawFeature will be there
        this.state.drawFeature.geometry
      );
      updatedMode = 'modify';
    }
    const updatedData = featureCollection.getFeatureCollection();

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

  handleDrawPolygon(
    selectedFeature: Feature,
    featureIndex: number,
    groundCoords: Position,
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
            // $FlowFixMe: just do it
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

    const updatedData = featureCollection.getFeatureCollection();

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
    selectedFeature: Feature,
    featureIndex: number,
    groundCoords: Position,
    picks: Object[]
  ) {
    let featureCollection = this.state.editableFeatureCollection;
    let positionIndexes;

    let updatedMode = this.props.mode;

    if (selectedFeature.geometry.type === 'Point') {
      positionIndexes = null;
      featureCollection = featureCollection.replaceGeometry(
        featureIndex,
        // $FlowFixMe: it's ok, I know drawFeature will be there
        this.state.drawFeature.geometry
      );
      updatedMode = 'modify';
    } else {
      console.warn(`Unsupported geometry type: ${selectedFeature.geometry.type}`); // eslint-disable-line
      return;
    }

    const updatedData = featureCollection.getFeatureCollection();

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
    selectedFeature: Feature,
    featureIndex: number,
    groundCoords: Position,
    picks: Object[]
  ) {
    let featureCollection = this.state.editableFeatureCollection;
    let positionIndexes;

    let updatedMode = this.props.mode;

    if (selectedFeature.geometry.type === 'Point') {
      positionIndexes = null;
      featureCollection = featureCollection.replaceGeometry(
        featureIndex,
        // $FlowFixMe: it's ok, I know drawFeature will be there
        this.state.drawFeature.geometry
      );
      updatedMode = 'modify';
    } else {
      console.warn(`Unsupported geometry type: ${selectedFeature.geometry.type}`); // eslint-disable-line
      return;
    }

    const updatedData = featureCollection.getFeatureCollection();

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

  handleDrawEllipseByBoundingBox(
    selectedFeature: Feature,
    featureIndex: number,
    groundCoords: Position,
    picks: Object[]
  ) {
    let featureCollection = this.state.editableFeatureCollection;
    let positionIndexes;

    let updatedMode = this.props.mode;

    if (selectedFeature.geometry.type === 'Point') {
      positionIndexes = null;
      featureCollection = featureCollection.replaceGeometry(
        featureIndex,
        // $FlowFixMe: it's ok, I know drawFeature will be there
        this.state.drawFeature.geometry
      );
      updatedMode = 'modify';
    } else {
      console.warn(`Unsupported geometry type: ${selectedFeature.geometry.type}`); // eslint-disable-line
      return;
    }

    const updatedData = featureCollection.getFeatureCollection();

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

  handleDrawNewPoint(groundCoords: Position) {
    // Starts off as a point (since LineString requires at least 2 positions)
    const newFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: groundCoords
      }
    };

    const updatedData = this.state.editableFeatureCollection
      .addFeature(newFeature)
      .getFeatureCollection();
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

  getCursor({ isDragging }: { isDragging: boolean }) {
    const mode = this.props.mode;
    if (mode.startsWith('draw')) {
      return 'cell';
    }

    const picks = this.state.pointerMovePicks;
    if (mode === 'modify' && picks && picks.length > 0) {
      const existingHandlePicked = picks.some(
        pick => pick.isEditingHandle && pick.object.type === 'existing'
      );
      const intermediateHandlePicked = picks.some(
        pick => pick.isEditingHandle && pick.object.type === 'intermediate'
      );
      if (existingHandlePicked) {
        return 'move';
      }
      if (intermediateHandlePicked) {
        return 'cell';
      }
    }

    return isDragging ? 'grabbing' : 'grab';
  }
}

EditableGeoJsonLayer.layerName = 'EditableGeoJsonLayer';
EditableGeoJsonLayer.defaultProps = defaultProps;
