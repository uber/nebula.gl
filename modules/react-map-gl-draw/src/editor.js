// @flow

import React from 'react';

import type { Feature } from '@nebula.gl/edit-modes';
import type { GeoJsonType, RenderState, Id } from './types';

import { RENDER_STATE, RENDER_TYPE, GEOJSON_TYPE, GUIDE_TYPE, ELEMENT_TYPE } from './constants';
import ModeHandler from './mode-handler';
import { getFeatureCoordinates } from './edit-modes/utils';

export default class Editor extends ModeHandler {
  /* HELPERS */
  _getPathInScreenCoords(coordinates: any, type: GeoJsonType) {
    if (coordinates.length === 0) {
      return '';
    }

    const screenCoords = coordinates.map(p => this.project(p));

    let pathString = '';
    switch (type) {
      case GEOJSON_TYPE.POINT:
        return screenCoords;

      case GEOJSON_TYPE.LINE_STRING:
        pathString = screenCoords.map(p => `${p[0]},${p[1]}`).join('L');
        return `M ${pathString}`;

      case GEOJSON_TYPE.POLYGON:
        pathString = screenCoords.map(p => `${p[0]},${p[1]}`).join('L');
        return `M ${pathString} z`;

      default:
        return null;
    }
  }

  _getEditHandleState = (editHandle: Feature, renderState: ?string) => {
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

    if (editHandleIndex === draggingEditHandleIndex) {
      return RENDER_STATE.SELECTED;
    }

    if (hovered && hovered.type === ELEMENT_TYPE.EDIT_HANDLE && hovered.index === editHandleIndex) {
      return RENDER_STATE.HOVERED;
    }

    return RENDER_STATE.INACTIVE;
  };

  _getFeatureRenderState = (index: number, renderState: ?RenderState) => {
    const { selectedFeatureIndex, hovered } = this.state;
    if (renderState) {
      return renderState;
    }

    if (index === selectedFeatureIndex) {
      return RENDER_STATE.SELECTED;
    }

    if (hovered && hovered.type === ELEMENT_TYPE.FEATURE && hovered.featureIndex === index) {
      return RENDER_STATE.HOVERED;
    }

    return RENDER_STATE.INACTIVE;
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
      properties: { featureIndex, positionIndexes }
    } = editHandle;
    const { clickRadius, getEditHandleShape, getEditHandleStyle } = this.props;

    const index = positionIndexes[0];

    const shape =
      typeof getEditHandleShape === 'function'
        ? getEditHandleShape({
            feature: feature || editHandle,
            index,
            featureIndex
          })
        : getEditHandleShape;

    let style = getEditHandleStyle({
      feature: feature || editHandle,
      index,
      state: this._getEditHandleState(editHandle)
    });

    // disable events for cursor editHandle
    if (editHandle.properties.guideType === GUIDE_TYPE.CURSOR_EDIT_HANDLE) {
      style = {
        ...style,
        pointerEvents: 'none'
      };
    }

    const elemKey = `${ELEMENT_TYPE.EDIT_HANDLE}.${featureIndex}.${index}`;
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
                fillOpacity: 0
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

  _renderSegment = (featureIndex: Id, index: number, coordinates: number[], style: Object) => {
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
            strokeWidth: clickRadius || radius,
            opacity: 0
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

  _renderSegments = (featureIndex: Id, coordinates: number[], style: Object) => {
    const segments = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
      segments.push(
        this._renderSegment(featureIndex, i, [coordinates[i], coordinates[i + 1]], style)
      );
    }
    return segments;
  };

  _renderFill = (featureIndex: Id, coordinates: number[], style: Object) => {
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
    const { getFeatureStyle } = this.props;
    const {
      geometry: { coordinates },
      properties: { renderType }
    } = feature;

    if (!coordinates || coordinates.length < 2) {
      return null;
    }

    // >= 2 coordinates
    const firstCoords = coordinates[0];
    const lastCoords = coordinates[coordinates.length - 1];
    const uncommittedStyle = getFeatureStyle({ feature, state: RENDER_STATE.UNCOMMITTED });

    let committedPath;
    let uncommittedPath;
    let closingPath;
    const fill = this._renderFill('tentative', coordinates, uncommittedStyle);

    switch (renderType) {
      case RENDER_TYPE.LINE_STRING:
      case RENDER_TYPE.POLYGON:
        const committedStyle = getFeatureStyle({ feature, state: RENDER_STATE.SELECTED });
        if (cursorEditHandle) {
          const cursorCoords = coordinates[coordinates.length - 2];
          committedPath = this._renderSegments(
            'tentative',
            coordinates.slice(0, coordinates.length - 1),
            committedStyle
          );
          uncommittedPath = this._renderSegment(
            'tentative-uncommitted',
            coordinates.length - 2,
            [cursorCoords, lastCoords],
            uncommittedStyle
          );
        } else {
          committedPath = this._renderSegments('tentative', coordinates, committedStyle);
        }

        if (renderType === RENDER_TYPE.POLYGON) {
          const closingStyle = getFeatureStyle({ feature, state: RENDER_STATE.CLOSING });
          closingPath = this._renderSegment(
            'tentative-closing',
            coordinates.length - 1,
            [lastCoords, firstCoords],
            closingStyle
          );
        }

        break;

      case RENDER_TYPE.RECTANGLE:
        uncommittedPath = this._renderSegments(
          'tentative',
          [...coordinates, firstCoords],
          uncommittedStyle
        );
        break;

      default:
    }

    return [fill, committedPath, uncommittedPath, closingPath].filter(Boolean);
  };

  _renderGuides = ({ tentativeFeature, editHandles }: Object) => {
    const features = this.getFeatures();
    const cursorEditHandle = editHandles.find(
      f => f.properties.guideType === GUIDE_TYPE.CURSOR_EDIT_HANDLE
    );
    return (
      <g key="feature-guides">
        {tentativeFeature && this._renderTentativeFeature(tentativeFeature, cursorEditHandle)}
        {editHandles &&
          editHandles.map(editHandle => {
            const feature =
              (features && features[editHandle.properties.featureIndex]) || tentativeFeature;
            return this._renderEditHandle(editHandle, feature);
          })}
      </g>
    );
  };

  _renderPoint = (feature: Feature, index: number, path: string) => {
    const renderState = this._getFeatureRenderState(index);
    const { getFeatureStyle, getFeatureShape, clickRadius } = this.props;
    const style = getFeatureStyle({ feature, state: renderState });
    const shape =
      typeof getFeatureShape === 'function'
        ? getFeatureShape({ feature, state: renderState })
        : getFeatureShape;

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
              fillOpacity: 0
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
            opacity: 0
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
    const { getFeatureStyle, clickRadius } = this.props;
    const { selectedFeatureIndex } = this.state;
    const selected = index === selectedFeatureIndex;
    const renderState = this._getFeatureRenderState(index);
    const style = getFeatureStyle({ feature, state: renderState });

    const elemKey = `feature.${index}`;
    if (selected) {
      return (
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
            strokeWidth: clickRadius,
            opacity: 0
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
    const { getFeatureStyle } = this.props;
    const { selectedFeatureIndex } = this.state;
    const selected = index === selectedFeatureIndex;

    const renderState = this._getFeatureRenderState(index);
    const style = getFeatureStyle({ feature, state: renderState });

    const elemKey = `feature.${index}`;
    if (selected) {
      const coordinates = getFeatureCoordinates(feature);
      if (!coordinates) {
        return null;
      }
      return (
        <g key={elemKey}>
          {this._renderFill(index, coordinates, style)}
          {this._renderSegments(index, coordinates, style)}
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
    if (!coordinates || !coordinates.length) {
      return null;
    }

    const {
      properties: { renderType },
      geometry: { type }
    } = feature;
    const path = this._getPathInScreenCoords(coordinates, type);
    if (!path) {
      return null;
    }

    switch (renderType) {
      case RENDER_TYPE.POINT:
        return this._renderPoint(feature, index, path);
      case RENDER_TYPE.LINE_STRING:
        return this._renderPath(feature, index, path);

      case RENDER_TYPE.POLYGON:
      case RENDER_TYPE.RECTANGLE:
        return this._renderPolygon(feature, index, path);

      default:
        return null;
    }
  };

  _renderCanvas = () => {
    const features = this.getFeatures();
    const guides = this._modeHandler && this._modeHandler.getGuides(this.getModeProps());

    return (
      <svg key="draw-canvas" width="100%" height="100%">
        {features &&
          features.length > 0 && <g key="feature-group">{features.map(this._renderFeature)}</g>}
        {guides && <g key="feature-guides">{this._renderGuides(guides)}</g>}
      </svg>
    );
  };

  _renderEditor = () => {
    const viewport = (this._context && this._context.viewport) || {};
    const { style } = this.props;
    const { width, height } = viewport;

    return (
      <div
        id="editor"
        style={{
          width,
          height,
          ...style
        }}
        ref={_ => {
          this._containerRef = _;
        }}
      >
        {this._renderCanvas()}
      </div>
    );
  };

  render() {
    return super.render(this._renderEditor());
  }
}
