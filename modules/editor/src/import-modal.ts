// @flow
/* eslint-env browser */

import React from 'react';
import { ImportComponent } from './import-component.ts';
import { EditorModal } from './editor-modal.ts';

export type ImportModalProps = {
  onImport: any => mixed,
  onClose: () => mixed,
  additionalInputs?: React$Node
};

export function ImportModal(props: ImportModalProps) {
  return (
    <EditorModal
      onClose={props.onClose}
      title={'Import'}
      content={
        <ImportComponent
          onImport={props.onImport}
          onCancel={props.onClose}
          additionalInputs={props.additionalInputs}
        />
      }
    />
  );
}
