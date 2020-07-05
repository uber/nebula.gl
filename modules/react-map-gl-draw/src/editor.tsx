import * as React from 'react';

import { Feature } from '@nebula.gl/edit-modes';
import { GeoJsonType, RenderState, Id } from './types';

import { RENDER_STATE, SHAPE, GEOJSON_TYPE, GUIDE_TYPE, ELEMENT_TYPE } from './constants';
import ModeHandler from './mode-handler';
import { getFeatureCoordinates } from './edit-modes/utils';

import {
  editHandleStyle as defaultEditHandleStyle,
  featureStyle as defaultFeatureStyle,
} from './style';

const defaultProps = {
  ...ModeHandler.defaultProps,
  clickRadius: 0,
  featureShape: 'circle',
  editHandleShape: 'rect',
  editHandleStyle: defaultEditHandleStyle,
  featureStyle: defaultFeatureStyle,
  featuresDraggable: true,
};

export default class Editor extends ModeHandler {
  static defaultProps = defaultProps;

  /* HELPERS */
  _getPathInScreenCoords(coordinates: any, type: GeoJsonType) {
    if (coordinates.length === 0) {
      return '';
    }

    const screenCoords = coordinates.map((p) => this.project(p));

    let pathString = '';
    switch (type) {
      case GEOJSON_TYPE.POINT:
        return screenCoords;

      case GEOJSON_TYPE.LINE_STRING:
        pathString = screenCoords.map((p) => `${p[0]},${p[1]}`).join('L');
        return `M ${pathString}`;

      case GEOJSON_TYPE.POLYGON:
        pathString = screenCoords.map((p) => `${p[0]},${p[1]}`).join('L');
        return `M ${pathString} z`;

      default:
        return null;
    }
  }

  _getEditHandleState = (editHandle: Feature, renderState: string | null | undefined) => {
    const { pointerDownPicks, hovered } = this.state;

    if (renderState) {
      return renderState;
    }

    const editHandleIndex = editHandle.properties.positionIndexes[0];
    let draggingEditHandleIndex = null;
    const pickedObject = pointerDownPicks && pointerDownPicks[0] && pointerDownPicks[0].object;
    if (pickedObject && pickedObject.guideType === GUIDE_TYPE.EDIT_HANDLE) {
      draggingEditHandleIndex = pickedObject.index;
    }

    if (
      editHandleIndex === draggingEditHandleIndex ||
      this.state.selectedEditHandleIndexes.includes(editHandleIndex)
    ) {
      return RENDER_STATE.SELECTED;
    }
    // @ts-ignore
    if (hovered && hovered.type === ELEMENT_TYPE.EDIT_HANDLE) {
      if (hovered.index === editHandleIndex) {
        return RENDER_STATE.HOVERED;
      }

      // cursor hovered on first vertex when drawing polygon
      if (
        hovered.index === 0 &&
        editHandle.properties.guideType === GUIDE_TYPE.CURSOR_EDIT_HANDLE
      ) {
        return RENDER_STATE.CLOSING;
      }
    }

    return RENDER_STATE.INACTIVE;
  };

  _getFeatureRenderState = (index: number, renderState: RenderState | null | undefined) => {
    const { hovered } = this.state;
    const selectedFeatureIndex = this._getSelectedFeatureIndex();
    if (renderState) {
      return renderState;
    }

    if (index === selectedFeatureIndex) {
      return RENDER_STATE.SELECTED;
    }
    // @ts-ignore
    if (hovered && hovered.type === ELEMENT_TYPE.FEATURE && hovered.featureIndex === index) {
      return RENDER_STATE.HOVERED;
    }

    return RENDER_STATE.INACTIVE;
  };

  _getStyleProp = (styleProp: any, params: any) => {
    return typeof styleProp === 'function' ? styleProp(params) : styleProp;
  };

  /* RENDER */

  /* eslint-disable max-params */
  _renderEditHandle = (editHandle: Feature, feature: Feature) => {
    /* eslint-enable max-params */
    const coordinates = getFeatureCoordinates(editHandle);
    const p = this.project(coordinates && coordinates[0]);
    if (!p) {
      return null;
    }

    const {
      properties: { featureIndex, positionIndexes, editHandleType },
    } = editHandle;
    const { clickRadius, editHandleShape, editHandleStyle } = this.props;

    const index = positionIndexes.length > 1 ? positionIndexes[1] : positionIndexes[0];

    const shape = this._getStyleProp(editHandleShape, {
      feature: feature || editHandle,
      index,
      featureIndex,
      // @ts-ignore
      state: this._getEditHandleState(editHandle),
    });

    let style = this._getStyleProp(editHandleStyle, {
      feature: feature || editHandle,
      index,
      featureIndex,
      shape,
      // @ts-ignore
      state: this._getEditHandleState(editHandle),
    });

    // disable events for cursor editHandle
    if (editHandle.properties.guideType === GUIDE_TYPE.CURSOR_EDIT_HANDLE) {
      style = {
        ...style,
        // disable pointer events for cursor
        pointerEvents: 'none',
      };
    }

    const elemKey = `${ELEMENT_TYPE.EDIT_HANDLE}.${featureIndex}.${index}.${editHandleType}`;
    // first <circle|rect> is to make path easily interacted with
    switch (shape) {
      case 'circle':
        return (
          <g key={elemKey} transform={`translate(${p[0]}, ${p[1]})`}>
            <circle
              data-type={ELEMENT_TYPE.EDIT_HANDLE}
              data-index={index}
              data-feature-index={featureIndex}
              key={`${elemKey}.hidden`}
              style={{ ...style, stroke: 'none', fill: '#000', fillOpacity: 0 }}
              cx={0}
              cy={0}
              r={clickRadius}
            />
            <circle
              data-type={ELEMENT_TYPE.EDIT_HANDLE}
              data-index={index}
              data-feature-index={featureIndex}
              key={elemKey}
              style={style}
              cx={0}
              cy={0}
            />
          </g>
        );
      case 'rect':
        return (
          <g key={elemKey} transform={`translate(${p[0]}, ${p[1]})`}>
            <rect
              data-type={ELEMENT_TYPE.EDIT_HANDLE}
              data-index={index}
              data-feature-index={featureIndex}
              key={`${elemKey}.hidden`}
              style={{
                ...style,
                height: clickRadius,
                width: clickRadius,
                fill: '#000',
                fillOpacity: 0,
              }}
              r={clickRadius}
            />
            <rect
              data-type={ELEMENT_TYPE.EDIT_HANDLE}
              data-index={index}
              data-feature-index={featureIndex}
              key={`${elemKey}`}
              style={style}
            />
          </g>
        );

      default:
        return null;
    }
  };

  _renderSegment = (
    featureIndex: Id,
    index: number,
    coordinates: number[],
    style: Record<string, any>
  ) => {
    const path = this._getPathInScreenCoords(coordinates, GEOJSON_TYPE.LINE_STRING);
    const { radius, ...others } = style;
    const { clickRadius } = this.props;

    const elemKey = `${ELEMENT_TYPE.SEGMENT}.${featureIndex}.${index}`;
    return (
      <g key={elemKey}>
        <path
          key={`${elemKey}.hidden`}
          data-type={ELEMENT_TYPE.SEGMENT}
          data-index={index}
          data-feature-index={featureIndex}
          style={{
            ...others,
            stroke: 'rgba(0,0,0,0)',
            strokeWidth: clickRadius || radius,
            opacity: 0,
          }}
          d={path}
        />
        <path
          key={elemKey}
          data-type={ELEMENT_TYPE.SEGMENT}
          data-index={index}
          data-feature-index={featureIndex}
          style={others}
          d={path}
        />
      </g>
    );
  };

  _renderSegments = (featureIndex: Id, coordinates: number[], style: Record<string, any>) => {
    const segments = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
      segments.push(
        this._renderSegment(featureIndex, i, [coordinates[i], coordinates[i + 1]], style)
      );
    }
    return segments;
  };

  _renderFill = (featureIndex: Id, coordinates: number[], style: Record<string, any>) => {
    const path = this._getPathInScreenCoords(coordinates, GEOJSON_TYPE.POLYGON);
    return (
      <path
        key={`${ELEMENT_TYPE.FILL}.${featureIndex}`}
        data-type={ELEMENT_TYPE.FILL}
        data-feature-index={featureIndex}
        style={{ ...style, stroke: 'none' }}
        d={path}
      />
    );
  };

  _renderTentativeFeature = (feature: Feature, cursorEditHandle: Feature) => {
    const { featureStyle } = this.props;
    const {
      geometry: { type: geojsonType },
      properties: { shape },
    } = feature;

    const coordinates = getFeatureCoordinates(feature);
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      return null;
    }

    // >= 2 coordinates
    const firstCoords = coordinates[0];
    const lastCoords = coordinates[coordinates.length - 1];
    const uncommittedStyle = this._getStyleProp(featureStyle, {
      feature,
      index: null,
      state: RENDER_STATE.UNCOMMITTED,
    });

    let committedPath;
    let uncommittedPath;
    let closingPath;
    // @ts-ignore
    const fill = this._renderFill('tentative', coordinates, uncommittedStyle);

    const type = shape || geojsonType;
    switch (type) {
      case SHAPE.LINE_STRING:
      case SHAPE.POLYGON:
        const committedStyle = this._getStyleProp(featureStyle, {
          feature,
          state: RENDER_STATE.SELECTED,
        });

        if (cursorEditHandle) {
          // @ts-ignore
          const cursorCoords = coordinates[coordinates.length - 2];
          committedPath = this._renderSegments(
            'tentative',
            // @ts-ignore
            coordinates.slice(0, coordinates.length - 1),
            committedStyle
          );
          uncommittedPath = this._renderSegment(
            'tentative-uncommitted',
            // @ts-ignore
            coordinates.length - 2,
            // @ts-ignore
            [cursorCoords, lastCoords],
            uncommittedStyle
          );
        } else {
          // @ts-ignore
          committedPath = this._renderSegments('tentative', coordinates, committedStyle);
        }

        if (shape === SHAPE.POLYGON) {
          const closingStyle = this._getStyleProp(featureStyle, {
            feature,
            index: null,
            state: RENDER_STATE.CLOSING,
          });

          closingPath = this._renderSegment(
            'tentative-closing',
            // @ts-ignore
            coordinates.length - 1,
            // @ts-ignore
            [lastCoords, firstCoords],
            closingStyle
          );
        }

        break;

      case SHAPE.RECTANGLE:
        uncommittedPath = this._renderSegments(
          'tentative',
          // @ts-ignore
          [...coordinates, firstCoords],
          uncommittedStyle
        );
        break;

      default:
    }

    return [fill, committedPath, uncommittedPath, closingPath].filter(Boolean);
  };

  _renderGuides = (guideFeatures: Feature[]) => {
    const features = this.getFeatures();
    const cursorEditHandle =
      guideFeatures &&
      guideFeatures.find((f) => f.properties.guideType === GUIDE_TYPE.CURSOR_EDIT_HANDLE);
    const tentativeFeature = features.find((f) => f.properties.guideType === GUIDE_TYPE.TENTATIVE);

    return (
      <g key="feature-guides">
        {guideFeatures.map((guide) => {
          const guideType = guide.properties.guideType;
          switch (guideType) {
            case GUIDE_TYPE.TENTATIVE:
              return this._renderTentativeFeature(guide, cursorEditHandle);
            case GUIDE_TYPE.EDIT_HANDLE:
            case GUIDE_TYPE.CURSOR_EDIT_HANDLE:
              const shape = guide.properties.shape || guide.geometry.type;
              // TODO this should be removed when fix editing mode
              // don't render cursor for rectangle
              if (shape === SHAPE.RECTANGLE && guide.properties.editHandleType === 'intermediate') {
                return null;
              }
              const feature =
                (features && features[guide.properties.featureIndex]) || tentativeFeature;
              return this._renderEditHandle(guide, feature);
            default:
              return null;
          }
        })}
      </g>
    );
  };

  _renderPoint = (feature: Feature, index: number, path: string) => {
    // @ts-ignore
    const renderState = this._getFeatureRenderState(index);
    const { featureStyle, featureShape, clickRadius } = this.props;
    const shape = this._getStyleProp(featureShape, { feature, index, state: renderState });
    const style = this._getStyleProp(featureStyle, { feature, index, state: renderState });

    const elemKey = `feature.${index}`;
    if (shape === 'rect') {
      return (
        <g key={elemKey} transform={`translate(${path[0][0]}, ${path[0][1]})`}>
          <rect
            data-type={ELEMENT_TYPE.FEATURE}
            data-feature-index={index}
            key={`${elemKey}.hidden`}
            style={{
              ...style,
              width: clickRadius,
              height: clickRadius,
              fill: '#000',
              fillOpacity: 0,
            }}
          />
          <rect
            data-type={ELEMENT_TYPE.FEATURE}
            data-feature-index={index}
            key={elemKey}
            style={style}
          />
        </g>
      );
    }

    return (
      <g key={`feature.${index}`} transform={`translate(${path[0][0]}, ${path[0][1]})`}>
        <circle
          data-type={ELEMENT_TYPE.FEATURE}
          data-feature-index={index}
          key={`${elemKey}.hidden`}
          style={{
            ...style,
            opacity: 0,
          }}
          cx={0}
          cy={0}
          r={clickRadius}
        />
        <circle
          data-type={ELEMENT_TYPE.FEATURE}
          data-feature-index={index}
          key={elemKey}
          style={style}
          cx={0}
          cy={0}
        />
      </g>
    );
  };

  _renderPath = (feature: Feature, index: number, path: string) => {
    const { featureStyle, clickRadius } = this.props;
    const selectedFeatureIndex = this._getSelectedFeatureIndex();
    const selected = index === selectedFeatureIndex;
    // @ts-ignore
    const renderState = this._getFeatureRenderState(index);
    const style = this._getStyleProp(featureStyle, { feature, index, state: renderState });

    const elemKey = `feature.${index}`;
    if (selected) {
      return (
        // @ts-ignore
        <g key={elemKey}>{this._renderSegments(index, feature.geometry.coordinates, style)}</g>
      );
    }

    // first <path> is to make path easily interacted with
    return (
      <g key={elemKey}>
        <path
          data-type={ELEMENT_TYPE.FEATURE}
          data-feature-index={index}
          key={`${elemKey}.hidden`}
          style={{
            ...style,
            stroke: 'rgba(0,0,0,0)',
            strokeWidth: clickRadius,
            opacity: 0,
          }}
          d={path}
        />
        <path
          data-type={ELEMENT_TYPE.FEATURE}
          data-feature-index={index}
          key={elemKey}
          style={style}
          d={path}
        />
      </g>
    );
  };

  _renderPolygon = (feature: Feature, index: number, path: string) => {
    const { featureStyle } = this.props;
    const selectedFeatureIndex = this._getSelectedFeatureIndex();
    const selected = index === selectedFeatureIndex;
    // @ts-ignore
    const renderState = this._getFeatureRenderState(index);
    const style = this._getStyleProp(featureStyle, { feature, index, state: renderState });

    const elemKey = `feature.${index}`;
    if (selected) {
      const coordinates = getFeatureCoordinates(feature);
      if (!coordinates) {
        return null;
      }
      return (
        <g key={elemKey}>
          {// eslint-disable-next-line prettier/prettier
          //@ts-ignore
          this._renderFill(index, coordinates, style)}
          {// eslint-disable-next-line prettier/prettier
          // @ts-ignore
          this._renderSegments(index, coordinates, style)}
        </g>
      );
    }

    return (
      <path
        data-type={ELEMENT_TYPE.FEATURE}
        data-feature-index={index}
        key={elemKey}
        style={style}
        d={path}
      />
    );
  };

  _renderFeature = (feature: Feature, index: number) => {
    const coordinates = getFeatureCoordinates(feature);
    // @ts-ignore
    if (!coordinates || !coordinates.length) {
      return null;
    }
    const {
      properties: { shape },
      geometry: { type: geojsonType },
    } = feature;
    // @ts-ignore
    const path = this._getPathInScreenCoords(coordinates, geojsonType);
    if (!path) {
      return null;
    }

    const type = shape || geojsonType;
    switch (type) {
      case SHAPE.POINT:
        return this._renderPoint(feature, index, path);
      case SHAPE.LINE_STRING:
        return this._renderPath(feature, index, path);

      case SHAPE.CIRCLE:
      case SHAPE.POLYGON:
      case SHAPE.RECTANGLE:
        return this._renderPolygon(feature, index, path);

      default:
        return null;
    }
  };

  _renderCanvas = () => {
    const features = this.getFeatures();
    const guides = this._modeHandler && this._modeHandler.getGuides(this.getModeProps());
    const guideFeatures = guides && guides.features;

    return (
      <svg key="draw-canvas" width="100%" height="100%">
        {features && features.length > 0 && (
          <g key="feature-group">{features.map(this._renderFeature)}</g>
        )}
        {guideFeatures && guideFeatures.length > 0 && (
          <g key="feature-guides">{this._renderGuides(guideFeatures)}</g>
        )}
      </svg>
    );
  };

  _render = () => {
    const viewport = (this._context && this._context.viewport) || {};
    const { style } = this.props;
    // @ts-ignore
    const { width = 0, height = 0 } = viewport;
    return (
      <div
        id="editor"
        style={{
          width,
          height,
          ...style,
        }}
        ref={(_) => {
          this._containerRef = _;
        }}
      >
        {this._renderCanvas()}
      </div>
    );
  };
}
