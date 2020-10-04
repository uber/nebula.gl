import * as React from 'react';
import styled from 'styled-components';
import { SelectionContext } from '@nebula.gl/edit-modes';

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

export type Props = {
  data: any;
  selection: SelectionContext;
  onSetSelection: (selection: SelectionContext) => unknown;
};

export function OverlappingSelection({ data, selection, onSetSelection }: Props) {
  const { selectedIndexes, selectContext } = selection;
  if (!selectedIndexes || selectedIndexes.length < 2) {
    return null;
  }

  const left = selectContext ? selectContext.screenCoords[0] : 30;
  const top = selectContext ? selectContext.screenCoords[1] : 30;

  return (
    <div style={{ position: 'absolute', left: `${left}px`, top: `${top}px`, display: 'grid' }}>
      {selectedIndexes.map((index) => {
        const feature = data.features[index];
        return (
          <Button
            onClick={() =>
              onSetSelection({
                selectedIndexes: [index],
              })
            }
            key={index}
          >
            {feature.properties.name}
          </Button>
        );
      })}
    </div>
  );
}
