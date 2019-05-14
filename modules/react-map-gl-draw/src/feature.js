// @flow
import type { Geometry, Position, Feature as GeoJson } from '@nebula.gl/edit-modes';
import type { Id } from './types';

type FeatureProps = {
  id: Id,
  type: string,
  renderType?: ?string,
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
      case 'Point':
        return new Feature({
          id,
          type,
          renderType: renderType || type,
          points: [coordinates],
          otherProps
        });

      case 'LineString':
        return new Feature({
          id,
          type,
          renderType: renderType || type,
          points: coordinates,
          otherProps
        });

      case 'Polygon':
        return new Feature({
          id,
          type,
          renderType: renderType || type,
          points: coordinates && coordinates[0].slice(0, -1),
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

  addPoint(pt: Array<number>) {
    this.points.push(pt);
    return true;
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
    if (points.length >= 3) {
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
          type: 'Point',
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
          type: 'LineString',
          coordinates: points
        },
        properties: {
          renderType,
          ...otherProps
        },
        id
      };
    } else {
      points.push(points[0]);
      feature = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [points]
        },
        properties: {
          renderType,
          isClosed,
          ...otherProps
        },
        id
      };
    }

    return feature;
  }
}
