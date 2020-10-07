import * as React from 'react';
import {
  ViewMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawPolygonMode,
  DrawCircleFromCenterMode,
  DrawRectangleMode,
  MeasureDistanceMode,
  MeasureAngleMode,
  MeasureAreaMode,
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

const Button = styled.button<{ active?: boolean; kind?: string }>`
  color: #fff;
  background: ${({ kind, active }) =>
    kind === 'danger' ? 'rgb(180, 40, 40)' : active ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)'};
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

const SubToolsContainer = styled.div`
  position: relative;
`;

const SubTools = styled.div`
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  top: 0;
  right: 0;
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

const MODE_GROUPS = [
  {
    modes: [{ mode: ViewMode, content: <Icon name="pointer" /> }],
  },
  {
    modes: [{ mode: DrawPointMode, content: <Icon name="map-pin" /> }],
  },
  {
    modes: [
      {
        mode: DrawLineStringMode,
        content: <Icon name="stats" />,
      },
    ],
  },
  {
    modes: [
      { mode: DrawPolygonMode, content: <Icon name="shape-polygon" /> },
      { mode: DrawRectangleMode, content: <Icon name="rectangle" /> },
      { mode: DrawCircleFromCenterMode, content: <Icon name="circle" /> },
    ],
  },
  {
    modes: [
      { mode: MeasureDistanceMode, content: <Icon name="ruler" /> },
      { mode: MeasureAngleMode, content: <Icon name="shape-triangle" /> },
      { mode: MeasureAreaMode, content: <Icon name="shape-square" /> },
    ],
  },
];

function ModeButton({ buttonConfig, mode, onClick }: any) {
  return (
    <Button active={buttonConfig.mode === mode} onClick={onClick}>
      {buttonConfig.content}
    </Button>
  );
}
function ModeGroupButtons({ modeGroup, mode, onSetMode }: any) {
  const [expanded, setExpanded] = React.useState(false);

  const { modes } = modeGroup;

  let subTools = null;

  if (expanded) {
    subTools = (
      <SubTools>
        {modes.map((buttonConfig, i) => (
          <ModeButton
            key={i}
            buttonConfig={buttonConfig}
            mode={mode}
            onClick={() => {
              onSetMode(() => buttonConfig.mode);
              setExpanded(false);
            }}
          />
        ))}
      </SubTools>
    );
  }

  // Get the button config if it is active otherwise, choose the first
  const buttonConfig = modes.find((m) => m.mode === mode) || modes[0];

  return (
    <SubToolsContainer>
      {subTools}
      <ModeButton
        buttonConfig={buttonConfig}
        mode={mode}
        onClick={() => {
          onSetMode(() => buttonConfig.mode);
          setExpanded(true);
        }}
      />
    </SubToolsContainer>
  );
}

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
  const [showClearConfirmation, setShowClearConfirmation] = React.useState(false);

  return (
    <>
      <Tools>
        {MODE_GROUPS.map((modeGroup, i) => (
          <ModeGroupButtons key={i} modeGroup={modeGroup} mode={mode} onSetMode={onSetMode} />
        ))}

        {/* <box-icon name='current-location' ></box-icon> */}
        <Button onClick={() => setShowExport(true)} title="Export">
          <Icon name="export" />
        </Button>
        <Button onClick={() => setShowImport(true)} title="Import">
          <Icon name="import" />
        </Button>

        <SubToolsContainer>
          {showConfig && (
            <SubTools>
              <Button onClick={() => setShowConfig(false)}>
                <Icon name="chevron-right" />
              </Button>
              <Button
                onClick={() => onSetModeConfig({ booleanOperation: 'difference' })}
                active={modeConfig && modeConfig.booleanOperation === 'difference'}
              >
                <Icon name="minus-front" />
              </Button>
              <Button
                onClick={() => onSetModeConfig({ booleanOperation: 'union' })}
                active={modeConfig && modeConfig.booleanOperation === 'union'}
              >
                <Icon name="unite" />
              </Button>
              <Button
                onClick={() => onSetModeConfig({ booleanOperation: 'intersection' })}
                active={modeConfig && modeConfig.booleanOperation === 'intersection'}
              >
                <Icon name="intersect" />
              </Button>
              {/* <Button onClick={() => setShowConfig(false)}>
                <Icon name="x" />
              </Button> */}
            </SubTools>
          )}
          <Button onClick={() => setShowConfig(true)}>
            <Icon name="cog" />
          </Button>
        </SubToolsContainer>

        <SubToolsContainer>
          {showClearConfirmation && (
            <SubTools>
              <Button
                onClick={() => {
                  onSetGeoJson({ type: 'FeatureCollection', features: [] });
                  setShowClearConfirmation(false);
                }}
                kind="danger"
                title="Clear all features"
              >
                Clear all features <Icon name="trash" />
              </Button>
              <Button onClick={() => setShowClearConfirmation(false)}>Cancel</Button>
            </SubTools>
          )}
          <Button onClick={() => setShowClearConfirmation(true)} title="Clear">
            <Icon name="trash" />
          </Button>
        </SubToolsContainer>

        {/* zoom in and out */}
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
