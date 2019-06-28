// @flow
import type { Geometry, Position, Feature as GeoJson } from '@nebula.gl/edit-modes';
import type { Id, RenderType } from './types';
import { GEOJSON_TYPE } from './constants';

type FeatureProps = {
  id: Id,
  type: string,
  renderType?: ?RenderType,
  points?: ?any,
  isClosed?: ?boolean,
  otherProps?: ?any
};

export default class Feature {
  static fromFeature(feature: GeoJson) {
    const {
      id,
      geometry: { coordinates, type },
      properties: { renderType, ...otherProps }
    } = feature;

    switch (type) {
      case GEOJSON_TYPE.POINT:
        return new Feature({
          id,
          type,
          renderType,
          points: [coordinates],
          otherProps
        });

      case GEOJSON_TYPE.LINE_STRING:
        return new Feature({
          id,
          type,
          renderType,
          points: coordinates,
          otherProps
        });

      case GEOJSON_TYPE.POLYGON:
        const points = coordinates[0] && coordinates[0].slice(0, -1);
        return new Feature({
          id,
          type,
          renderType,
          points,
          isClosed: true,
          otherProps
        });

      default:
        return null;
    }
  }

  constructor(props: FeatureProps) {
    this.id = props.id;
    this.type = props.type;
    this.renderType = props.renderType;
    this.points = props.points || [];
    this.isClosed = props.isClosed;
    this.otherProps = props.otherProps;
  }

  id: Id;
  type: Geometry;
  renderType: ?string;
  isClosed: ?boolean = false;
  points: Position[];
  otherProps: ?any;

  addPoint(pt: number[]) {
    this.points.push(pt);
    return true;
  }

  insertPoint(pt: number[], index: number) {
    this.points.splice(index, 0, pt);
  }

  getBoundingBox() {
    if (!this.points || !this.points.length) {
      return null;
    }
    const bbox = this.points.reduce(
      (result, pt) => {
        result.xmin = Math.min(pt[0], result.xmin);
        result.xmax = Math.min(pt[0], result.xmax);
        result.ymin = Math.min(pt[1], result.ymin);
        result.ymax = Math.min(pt[1], result.ymax);

        return result;
      },
      { xmin: Infinity, xmax: -Infinity, ymin: Infinity, ymax: -Infinity }
    );

    return bbox;
  }

  removePoint(index: number) {
    const { points } = this;
    if (index >= 0 && index < points.length) {
      points.splice(index, 1);
      if (points.length < 3) {
        this.isClosed = false;
      }
      return true;
    }
    return false;
  }

  replacePoint(index: number, pt: Array<number>) {
    const { points } = this;
    if (index >= 0 && index < points.length) {
      points[index] = pt;
      return true;
    }
    return false;
  }

  closePath() {
    const { points } = this;
    if (points.length >= 3 && !this.isClosed) {
      this.isClosed = true;
      return true;
    }
    return false;
  }

  toFeature(): GeoJson {
    const { id, points, isClosed, renderType, otherProps } = this;

    let feature = null;
    if (points.length < 2) {
      feature = {
        type: 'Feature',
        geometry: {
          type: GEOJSON_TYPE.POINT,
          coordinates: points[0]
        },
        properties: {
          renderType,
          ...otherProps
        },
        id
      };
    } else if (points.length < 3 || !isClosed) {
      feature = {
        type: 'Feature',
        geometry: {
          type: GEOJSON_TYPE.LINE_STRING,
          coordinates: points
        },
        properties: {
          renderType,
          bbox: this.getBoundingBox(),
          ...otherProps
        },
        id
      };
    } else {
      feature = {
        type: 'Feature',
        geometry: {
          type: GEOJSON_TYPE.POLYGON,
          coordinates: [[...points, points[0]]]
        },
        properties: {
          renderType,
          isClosed,
          bbox: this.getBoundingBox(),
          ...otherProps
        },
        id
      };
    }

    return feature;
  }
}
