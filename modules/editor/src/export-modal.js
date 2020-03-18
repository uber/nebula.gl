// @flow
/* eslint-env browser */

import React from 'react';
import styled from 'styled-components';
import { EditorModal } from './editor-modal.js';

const ExportArea = styled.div`
  box-sizing: border-box;
  display: block;
  width: auto;
  height: auto;
  min-height: 300px;
  padding: 0rem 1rem;
`;

export type ExportModalProps = {
  features: any,
  onClose: () => mixed
};

export function ExportModal(props: ExportModalProps) {
  return (
    <>
      <EditorModal
        onClose={props.onClose}
        title={'Export'}
        content={<ExportArea>{JSON.stringify(props.features)}</ExportArea>}
      />
    </>
  );
}
