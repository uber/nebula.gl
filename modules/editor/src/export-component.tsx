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
  features: any;
  onClose: () => unknown;
};

export function ExportComponent(props: ExportComponentProps) {
  const geojson = props.features;
  const [exportParams, setExportParams] = React.useState(toGeoJson(geojson));
  const [format, setFormat] = React.useState('geoJson');

  const tooMuch = exportParams.data.length > 500000;

  function copyData() {
    copy(exportParams.data).then(() => props.onClose());
    // TODO Design and add in a notifications banner for errors in the modal.
    //   .catch(err => {alert(`Error copying to clipboard: `, err)})
  }

  function downloadData() {
    downloadjs(new Blob([exportParams.data]), exportParams.filename, exportParams.mimetype);
    props.onClose();
  }

  return (
    <>
      <FormatSelect>
        <strong style={{ padding: '0.5rem 0.25rem' }}>Format:</strong>
        <Button
          style={{
            backgroundColor: format === 'geoJson' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)',
          }}
          onClick={() => {
            setExportParams(toGeoJson(geojson));
            setFormat('geoJson');
          }}
        >
          GeoJson
        </Button>
        <Button
          style={{
            backgroundColor: format === 'kml' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)',
          }}
          onClick={() => {
            setExportParams(toKml(geojson));
            setFormat('kml');
          }}
        >
          KML
        </Button>
        <Button
          style={{
            backgroundColor: format === 'wkt' ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)',
          }}
          onClick={() => {
            setExportParams(toWkt(geojson));
            setFormat('wkt');
          }}
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
      <FooterRow>
        <Button style={{ backgroundColor: 'rgb(0, 105, 217)' }} onClick={downloadData}>
          Download
        </Button>
        <Button style={{ backgroundColor: 'rgb(0, 105, 217)' }} onClick={copyData}>
          Copy
        </Button>
        <Button onClick={props.onClose}>Cancel</Button>
      </FooterRow>
    </>
  );
}
