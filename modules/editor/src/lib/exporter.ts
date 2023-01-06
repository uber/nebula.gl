/* eslint-env browser */

import tokml from '@maphubs/tokml';
import { stringify as stringifyWkt } from 'wellknown';
import { AnyGeoJson, Geometry } from '@nebula.gl/edit-modes';

export type ExportParameters = {
  data: string;
  filename: string;
  mimetype: string;
};

export function toGeoJson(geoJson: AnyGeoJson, filename: string): ExportParameters {
  return {
    data: JSON.stringify(geoJson, null, 2),
    filename: `${filename}.geojson`,
    mimetype: 'application/json',
  };
}

export function toKml(geoJson: AnyGeoJson, filename: string): ExportParameters {
  // For some reason, google maps doesn't surface id unless it is in the properties
  // So, put it also in properties
  if (geoJson.type === 'FeatureCollection') {
    geoJson.features.forEach((f) => {
      f.properties = f.properties || {};
    });
  }

  const kmlString = tokml(geoJson);

  // kmlString = addIdToKml(geoJson, kmlString);

  return {
    data: kmlString,
    filename: `${filename}.kml`,
    mimetype: 'application/xml',
  };
}

export function toWkt(geoJson: AnyGeoJson, filename: string): ExportParameters {
  let wkt = '';
  if (geoJson.type === 'Feature') {
    wkt = stringifyWkt(geoJson);
  } else {
    // feature collection
    wkt = '';
    for (const feature of geoJson.features) {
      wkt += `${stringifyWkt(feature)}\n`;
    }
    if (wkt.length > 0) {
      wkt = wkt.substring(0, wkt.length - 1);
    }
  }

  return {
    data: wkt,
    filename: `${filename}.wkt`,
    mimetype: 'text/plain',
  };
}

export function toStats(geoJson: AnyGeoJson, filename: string): ExportParameters {
  let pointCount = 0;
  let ringCount = 0;
  let polygonCount = 0;
  let featureCount = 0;

  if (geoJson.type === 'Feature') {
    const polygonStats = getPolygonalStats(geoJson.geometry);
    ({ pointCount, ringCount, polygonCount } = polygonStats);
    featureCount = 1;
  } else {
    for (const feature of geoJson.features) {
      const polygonStats = getPolygonalStats(feature.geometry);
      pointCount += polygonStats.pointCount;
      ringCount += polygonStats.ringCount;
      polygonCount += polygonStats.polygonCount;
      featureCount++;
    }
  }

  const stats = `Features: ${featureCount}
Polygons: ${polygonCount}
Rings: ${ringCount}
Points: ${pointCount}`;

  return {
    data: stats,
    filename: `${filename}.txt`,
    mimetype: 'text/plain',
  };
}

function getPolygonalStats(geometry: Geometry) {
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
    return {
      pointCount: -1,
      ringCount: -1,
      polygonCount: -1,
    };
  }

  const polygonal = geometry;

  let pointCount = 0;
  let ringCount = 0;
  let polygonCount = 0;
  for (const ringOrPolygon of polygonal.coordinates) {
    if (geometry.type === 'Polygon') {
      polygonCount = 1;
      ringCount++;
      pointCount += ringOrPolygon.length;
    } else if (geometry.type === 'MultiPolygon') {
      polygonCount++;
      for (const ring of ringOrPolygon) {
        ringCount++;
        pointCount += ring.length;
      }
    }
  }
  return {
    pointCount,
    ringCount,
    polygonCount,
  };
}
