// @flow
import keymirror from 'keymirror';

import Feature from './feature';

export const GeoJsonGeometryTypes = keymirror({
  Point: null,
  LineString: null,
  Polygon: null,
  MultiPoint: null,
  MultiLineString: null,
  MultiPolygon: null
});

export function expandMultiGeometry(
  data: Feature[],
  singleType: string,
  multiType: string,
  createMulti: Function
): { result: Feature[], rejected: Feature[] } {
  const result = [];
  const rejected = [];

  data.forEach(nf => {
    if (nf.geoJson.geometry.type === singleType) {
      result.push(nf);
    } else if (nf.geoJson.geometry.type === multiType) {
      nf.geoJson.geometry.coordinates.forEach((coord, index) => {
        result.push(new Feature(createMulti(coord), nf.style, nf.original, { index }));
      });
    } else {
      rejected.push(nf);
    }
  });

  return { result, rejected };
}
