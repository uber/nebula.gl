// @flow
/* eslint-env browser */

import wkt from 'terraformer-wkt-parser';
import togeojson from '@tmcw/togeojson';
import DOMParser from 'xmldom';
import { newFeatureId } from './utils.js';
import type { GeoJsonFeature, AnyGeoJson } from './types.js';

export type ValidImportData = {
  valid: true,
  type: 'GeoJSON' | 'KML' | 'WKT',
  features: GeoJsonFeature[]
};

export type InvalidImportData = {
  valid: false,
  validationErrors: string[]
};

export type ImportData = ValidImportData | InvalidImportData;

function shouldTryGeoJson(data: string): boolean {
  return data.startsWith('{');
}

function shouldTryKml(data: string): boolean {
  return data.startsWith('<');
}

function shouldTryWkt(data: string): boolean {
  return (
    data.startsWith('POINT') ||
    data.startsWith('LINESTRING') ||
    data.startsWith('POLYGON') ||
    data.startsWith('MULTIPOINT') ||
    data.startsWith('MULTILINESTRING') ||
    data.startsWith('MULTIPOLYGON')
  );
}

function getFeatures(geojson: AnyGeoJson): GeoJsonFeature[] {
  if (geojson.type !== 'FeatureCollection' && geojson.type !== 'Feature') {
    throw Error(`GeoJSON must have type of 'Feature' or 'FeatureCollection'`);
  }

  const features: GeoJsonFeature[] =
    geojson.type === 'FeatureCollection' ? geojson.features : [geojson];

  return features;
}

function parseImportString(data: string): Promise<ImportData> {
  data = data.trim();
  let validData: ?ValidImportData;
  const validationErrors: string[] = [];
  if (shouldTryGeoJson(data)) {
    // Parse as GeoJSON
    try {
      const parsed = JSON.parse(data);
      validData = {
        valid: true,
        type: 'GeoJSON',
        features: getFeatures(parsed)
      };
    } catch (err) {
      validationErrors.push('Error parsing GeoJSON');
      validationErrors.push(err.toString());
    }
  } else if (shouldTryKml(data)) {
    // Parse as KML
    const xml = new DOMParser().parseFromString(data, 'text/xml');

    try {
      const parsed = togeojson.kml(xml);
      const isFeature = parsed && parsed.type === 'Feature';
      const isFeatureCollectionWithFeatures =
        parsed && parsed.type === 'FeatureCollection' && parsed.features.length > 0;
      const isValid = isFeature || isFeatureCollectionWithFeatures;
      if (isValid) {
        validData = {
          valid: true,
          type: 'KML',
          features: getFeatures(parsed)
        };
      } else {
        validationErrors.push('Invalid KML');
      }
    } catch (err) {
      validationErrors.push('Error parsing KML');
      validationErrors.push(err.toString());
    }
  } else if (shouldTryWkt(data)) {
    try {
      const parsed = wkt.parse(data);
      if (parsed) {
        validData = {
          valid: true,
          type: 'WKT',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: parsed,
              id: newFeatureId()
            }
          ]
        };
      } else {
        validationErrors.push('Invalid WKT');
      }
    } catch (err) {
      validationErrors.push('Error parsing WKT');
      validationErrors.push(err.toString());
    }
  } else {
    validationErrors.push('Unknown data format');
  }

  if (validData) {
    return Promise.resolve(validData);
  }
  return Promise.resolve({
    valid: false,
    validationErrors
  });
}

function parseImportFile(file: File): Promise<ImportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileAsString: any = reader.result;
      resolve(parseImportString(fileAsString));
    };
    reader.onabort = () => {
      reject(Error('file reading was aborted'));
    };
    reader.onerror = () => {
      reject(Error('file reading has failed'));
    };

    reader.readAsText(file);
  });
}

export function parseImport(data: string | File): Promise<ImportData> {
  if (typeof data === 'string') {
    return parseImportString(data);
  }
  return parseImportFile(data);
}
