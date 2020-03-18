// @flow
/* eslint-env browser */

import React from 'react';
import { ImportComponent } from './import-component.js';
import { EditorModal } from './editor-modal.js';

export type ImportModalProps = {
  onImport: any => mixed,
  onClose: () => mixed
};

export function ImportModal(props: ImportModalProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  function toggleModal(e) {
    if (isOpen) {
      props.onClose();
    }
    setIsOpen(!isOpen);
  }

  return (
    <>
      <EditorModal
        onClose={props.onClose}
        title={'Import'}
        content={<ImportComponent onImport={props.onImport} onCancel={toggleModal} />}
      />
    </>
  );
}
