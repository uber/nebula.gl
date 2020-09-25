/* eslint-env browser */

import * as React from 'react';
import copy from 'clipboard-copy';
import downloadjs from 'downloadjs';
import styled from 'styled-components';
import { toGeoJson, toKml, toWkt } from './lib/exporter';
import { Button } from './editor-modal';

const FormatSelect = styled.div`
  display: flex;
  padding: 0.75rem 0.75rem 0rem 0.75rem;
`;

const ExportArea = styled.div`
  box-sizing: border-box;
  display: block;
  width: auto;
  height: auto;
  min-height: 300px;
  padding: 0rem 1rem;
`;

const ExportData = styled.textarea`
  padding: 0px;
  width: 100%;
  resize: vertical;
  min-height: 300px;
  max-height: 500px;
  border: 1px solid rgb(206, 212, 218);
  border-radius: 0.3rem;
  font-family: -apple-system, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-size: 1rem;
  font-weight: 400;
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.75rem 0.75rem;
`;

export type ExportComponentProps = {
  geoJson: any;
  onClose: () => unknown;
  filename?: string;
  additionalInputs?: React.ReactNode;
};

export function ExportComponent({
  geoJson,
  onClose,
  filename,
  additionalInputs,
}: ExportComponentProps) {
  const [format, setFormat] = React.useState('geoJson');

  let filenameValue = filename;
  if (!filenameValue) {
    if (geoJson.type === 'FeatureCollection') {
      filenameValue = 'features';
    } else {
      // single feature
      filenameValue = geoJson.properties.name || geoJson.id || 'feature';
    }
  }

  const exportParams = React.useMemo(() => {
    switch (format) {
      case 'geoJson':
        return toGeoJson(geoJson, filenameValue);
      case 'kml':
        return toKml(geoJson, filenameValue);
      case 'wkt':
        return toWkt(geoJson, filenameValue);
      default:
        throw Error(`Unsupported format ${format}`);
    }
  }, [geoJson, format, filenameValue]);
  const tooMuch = exportParams.data.length > 500000;

  function copyData() {
    copy(exportParams.data).then(() => onClose());
    // TODO Design and add in a notifications banner for errors in the modal.
    //   .catch(err => {alert(`Error copying to clipboard: `, err)})
  }

  function downloadData() {
    downloadjs(new Blob([exportParams.data]), exportParams.filename, exportParams.mimetype);
    onClose();
  }

  return (
    <>
      <FormatSelect>
        <strong style={{ padding: '0.5rem 0.25rem' }}>Format:</strong>
        <Button
          style={{
            backgroundColor: format === 'geoJson' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)',
          }}
          onClick={() => setFormat('geoJson')}
        >
          GeoJSON
        </Button>
        <Button
          style={{
            backgroundColor: format === 'kml' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)',
          }}
          onClick={() => setFormat('kml')}
        >
          KML
        </Button>
        <Button
          style={{
            backgroundColor: format === 'wkt' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)',
          }}
          onClick={() => setFormat('wkt')}
        >
          WKT
        </Button>
      </FormatSelect>
      <ExportArea>
        <ExportData
          readOnly={true}
          style={tooMuch ? { fontStyle: 'italic', padding: '0.75rem 0rem' } : {}}
          value={
            tooMuch
              ? 'Too much data to display. Download or Copy to clipboard instead.'
              : exportParams.data
          }
        />
      </ExportArea>
      {additionalInputs || null}
      <FooterRow>
        <Button style={{ backgroundColor: 'rgb(0, 105, 217)' }} onClick={downloadData}>
          Download
        </Button>
        <Button style={{ backgroundColor: 'rgb(0, 105, 217)' }} onClick={copyData}>
          Copy
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </FooterRow>
    </>
  );
}
