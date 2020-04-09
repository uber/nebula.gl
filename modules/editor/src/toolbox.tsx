import * as React from 'react';
import { ViewMode, DrawPointMode, DrawPolygonMode } from '@nebula.gl/edit-modes';
import styled from 'styled-components';
import { ImportModal } from './import-modal';
import { ExportModal } from './export-modal';

const Tools = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 10px;
  right: 10px;
`;

const Button = styled.span`
  color: #fff;
  background-color: rgb(90, 98, 94);
  font-size: 1em;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  border: 1px solid transparent;
  border-radius: 0.25em;
  margin: 0.05em;
  padding: 0.1em 0.2em;
`;

export type Props = {
  mode: any;
  features: any;
  onSetMode: (arg0: any) => unknown;
  onImport: (arg0: any) => unknown;
};

const MODE_BUTTONS = [
  // TODO: change these to icons
  { mode: ViewMode, content: 'View' },
  { mode: DrawPointMode, content: 'Draw Point' },
  { mode: DrawPolygonMode, content: 'Draw Polygon' },
];

export function Toolbox(props: Props) {
  // Initialize to zero index on load as nothing is active.
  const [showImport, setShowImport] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);

  return (
    <>
      <Tools>
        {MODE_BUTTONS.map((modeButton, i) => (
          <Button
            key={i}
            style={{
              backgroundColor:
                props.mode === modeButton.mode ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)',
            }}
            onClick={() => {
              props.onSetMode(() => modeButton.mode);
            }}
          >
            {modeButton.content}
          </Button>
        ))}
        <Button onClick={() => setShowImport(true)}> Import Geometry </Button>
        <Button onClick={() => setShowExport(true)}> Export Geometry </Button>
      </Tools>
      {showImport && (
        <ImportModal
          onImport={(geojson) => {
            props.onImport(geojson);
            setShowImport(false);
          }}
          onClose={() => setShowImport(false)}
        />
      )}
      {showExport && <ExportModal features={props.features} onClose={() => setShowExport(false)} />}
    </>
  );
}
