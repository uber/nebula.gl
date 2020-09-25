import * as React from 'react';
import {
  ViewMode,
  DrawPointMode,
  DrawPolygonMode,
  DrawCircleFromCenterMode,
  DrawRectangleMode,
} from '@nebula.gl/edit-modes';
import styled from 'styled-components';
import { Icon } from './icon';

import { ImportModal } from './import-modal';
import { ExportModal } from './export-modal';

const Tools = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 10px;
  right: 10px;
`;

const Button = styled.button<{ active?: boolean }>`
  color: #fff;
  background: ${({ active }) => (active ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)')};
  font-size: 1em;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  border: 1px solid transparent;
  border-radius: 0.25em;
  margin: 0.05em;
  padding: 0.1em 0.2em;
  :hover {
    background: rgb(128, 137, 133);
  }
`;

const ConfigContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export type Props = {
  mode: any;
  modeConfig: any;
  geoJson: any;
  onSetMode: (mode: any) => unknown;
  onSetModeConfig: (modeConfig: any) => unknown;
  onSetGeoJson: (geojson: any) => unknown;
  onImport: (imported: any) => unknown;
};

const MODE_BUTTONS = [
  { mode: ViewMode, content: <Icon name="pointer" /> },
  { mode: DrawPointMode, content: <Icon name="radio-circle-marked" /> },
  { mode: DrawPolygonMode, content: <Icon name="shape-polygon" /> },
  { mode: DrawRectangleMode, content: <Icon name="rectangle" /> },
  { mode: DrawCircleFromCenterMode, content: <Icon name="circle" /> },
];

export function Toolbox({
  mode,
  modeConfig,
  geoJson,
  onSetMode,
  onSetModeConfig,
  onSetGeoJson,
  onImport,
}: Props) {
  const [showConfig, setShowConfig] = React.useState(false);
  const [showImport, setShowImport] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);

  return (
    <>
      <Tools>
        {MODE_BUTTONS.map((modeButton, i) => (
          <Button
            key={i}
            active={mode === modeButton.mode}
            onClick={() => {
              onSetMode(() => modeButton.mode);
            }}
          >
            {modeButton.content}
          </Button>
        ))}

        {/* <box-icon name='current-location' ></box-icon> */}
        <Button onClick={() => setShowExport(true)} title="Export">
          <Icon name="export" />
        </Button>
        <Button onClick={() => setShowImport(true)} title="Import">
          <Icon name="import" />
        </Button>
        <Button
          onClick={() => onSetGeoJson({ type: 'FeatureCollection', features: [] })}
          title="Clear"
        >
          <Icon name="trash" />
        </Button>
        <ConfigContainer>
          {showConfig && (
            <>
              <Button
                onClick={() => onSetModeConfig({ booleanOperation: 'union' })}
                active={modeConfig && modeConfig.booleanOperation === 'union'}
              >
                <Icon name="plus" />
              </Button>
              <Button
                onClick={() => onSetModeConfig({ booleanOperation: 'difference' })}
                active={modeConfig && modeConfig.booleanOperation === 'difference'}
              >
                <Icon name="minus" />
              </Button>
            </>
          )}
          <Button onClick={() => setShowConfig(!showConfig)}>
            <Icon name="cog" />
          </Button>
        </ConfigContainer>
      </Tools>

      {showImport && (
        <ImportModal
          onImport={(imported) => {
            onImport(imported);
            setShowImport(false);
          }}
          onClose={() => setShowImport(false)}
        />
      )}

      {showExport && <ExportModal geoJson={geoJson} onClose={() => setShowExport(false)} />}
    </>
  );
}
