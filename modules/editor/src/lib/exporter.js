// @flow

import tokml from '@maphubs/tokml';
// import { stringify as stringifyWkt } from 'wellknown';
import WKT from 'terraformer-wkt-parser';
import type { GeoJsonFeature, AnyGeoJson, GeoJsonGeometry, PolygonalGeometry } from '../types.js';
import { isFeatureNew } from '../utils.js';

export const UNNAMED = '__unnamed_feature__';

export type ExportParameters = {
  data: string,
  filename: string,
  mimetype: string
};

export function toGeoJson(geojson: AnyGeoJson): ExportParameters {
  const filename = `${getFilename(geojson)}.geojson`;
  const prepped = prepareGeoJsonForExport(geojson);

  return {
    data: JSON.stringify(prepped, null, 2),
    filename,
    mimetype: 'application/json'
  };
}

export function toKml(geojson: AnyGeoJson): ExportParameters {
  const filename = `${getFilename(geojson)}.kml`;
  const prepped = prepareGeoJsonForExport(geojson);

  // For some reason, google maps doesn't surface id unless it is in the properties
  // So, put it also in properties
  if (prepped.type === 'FeatureCollection') {
    prepped.features.forEach(f => {
      if (!f.id) {
        return;
      }

      f.properties = f.properties || {};
      f.properties.id = f.id;
    });
  }

  const kmlString = tokml(prepped);

  // kmlString = addIdToKml(prepped, kmlString);

  return {
    data: kmlString,
    filename,
    mimetype: 'application/xml'
  };
}

export function toWkt(geojson: AnyGeoJson): ExportParameters {
  const filename = `${getFilename(geojson)}.wkt`;
  const prepped = prepareGeoJsonForExport(geojson);

  let wkt;
  if (prepped.type === 'Feature') {
    wkt = WKT.convert(prepped);
  } else {
    // feature collection
    wkt = '';
    for (const feature of prepped.features) {
      wkt += `${WKT.convert(feature)}\n`;
    }
    if (wkt.length > 0) {
      wkt = wkt.substring(0, wkt.length - 1);
    }
  }

  return {
    data: wkt,
    filename,
    mimetype: 'text/plain'
  };
}

export function toStats(geojson: AnyGeoJson): ExportParameters {
  const filename = `${getFilename(geojson)}.txt`;
  const prepped = prepareGeoJsonForExport(geojson);

  let pointCount = 0;
  let ringCount = 0;
  let polygonCount = 0;
  let featureCount = 0;

  if (prepped.type === 'Feature') {
    const polygonStats = getPolygonalStats(prepped.geometry);
    ({ pointCount, ringCount, polygonCount } = polygonStats);
    featureCount = 1;
  } else {
    for (const feature of prepped.features) {
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
    filename,
    mimetype: 'text/plain'
  };
}

export function toIds(geojson: AnyGeoJson): ExportParameters {
  const filename = `${getFilename(geojson)}.txt`;
  const features = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];
  const ids = features
    .filter(f => !isFeatureNew(f))
    .map(f => f.id)
    .join('\n');

  return {
    data: ids,
    filename,
    mimetype: 'text/plain'
  };
}

// TODO: can remove this code once https://github.com/mapbox/tokml/issues/39 is fixed
/*
function addIdToKml(geojson: AnyGeoJson, kml: string): string {
  const ids = geojson.type === 'FeatureCollection' ? geojson.features.map(f => f.id) : [geojson.id];

  // Add id to each placemark element
  const placemarks = kml.match(/<Placemark>/g);
  if (placemarks && placemarks.length === ids.length) {
    // Sanity check to ensure there's a placemark per feature
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      if (id) {
        // Put id in the XML
        kml = kml.replace(/<Placemark>/, `<Placemark id="${id}">`);
      } else {
        // Put in a placeholder token so next loop goes to next placemark
        kml = kml.replace(/<Placemark>/, '<Placemark __NOID__>');
      }
    }

    // Take out the placholder token
    kml = kml.replace(/<Placemark __NOID__>/g, '<Placemark>');
  }
  return kml;
}
*/

function getPolygonalStats(geometry: GeoJsonGeometry) {
  if (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') {
    return {
      pointCount: -1,
      ringCount: -1,
      polygonCount: -1
    };
  }

  const polygonal: PolygonalGeometry = geometry;

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
    polygonCount
  };
}

function getFilename(geojson) {
  let filename = 'geojsonFeatures';
  if (geojson.type === 'Feature') {
    filename = geojson.properties.name || UNNAMED;
  }
  return filename;
}

function prepareGeoJsonForExport(geojson: AnyGeoJson): AnyGeoJson {
  let forExport;
  if (geojson.type === 'FeatureCollection') {
    forExport = {
      ...geojson,
      features: geojson.features.map(prepareFeatureForExport)
    };
  } else {
    forExport = prepareFeatureForExport(geojson);
  }

  return forExport;
}

function prepareFeatureForExport(feature: GeoJsonFeature): GeoJsonFeature {
  const prepped = {
    ...feature,
    properties: {
      ...feature.properties,
      name: feature.properties.name || UNNAMED,
      description: feature.properties.description || ''
    }
  };

  if (isFeatureNew(prepped)) {
    // $FlowFixMe
    delete prepped.id;
  }

  return prepped;
}
