// @flow

import React from 'react';
import { DrawPointMode, DrawPolygonMode } from '@nebula.gl/edit-modes';

type ContainerPosition = 'topright' | 'bottomright' | 'bottomleft' | 'topleft';

export type Props = {
  mode: any,
  modeConfig: any,
  onSetMode: any => mixed,
  onSetModeConfig: any => mixed,
  position?: ?ContainerPosition
};

const MODE_BUTTONS = [
  // TODO: change these to icons
  { mode: DrawPointMode, content: <span>Draw point</span> },
  { mode: DrawPolygonMode, content: <span>Draw polygon</span> },
  { mode: DrawPolygonMode, content: <span>Import Geometry</span> },
  { mode: DrawPolygonMode, content: <span>Export Geometry</span> }
];

export function Toolbox({ mode, modeConfig, onSetMode, onSetModeConfig, position }: Props) {
  return (
    <div style={getContainerStyles(position)}>
      {MODE_BUTTONS.map((modeButton, i) => (
        <button
          key={i}
          style={{ backgroundColor: mode === modeButton.mode ? 'red' : 'gray' }}
          onClick={() => onSetMode(() => modeButton.mode)}
        >
          {modeButton.content}
        </button>
      ))}
    </div>
  );
}

function getContainerStyles(position: ?ContainerPosition) {
  let styles = {
    position: 'absolute'
  };

  switch (position) {
    case 'topright':
    default:
      styles = {
        ...styles,
        top: '10px',
        right: '10px',
        display: 'flex',
        flexFlow: 'column'
      };
      break;
  }

  return styles;
}
