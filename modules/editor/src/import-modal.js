// @flow
/* eslint-env browser */

import React from 'react';
import Modal, { ModalProvider } from 'styled-react-modal';
import { ImportComponent } from './import-component.js';

const StyledModal = Modal.styled`
  position: relative;
  display: block;
  width: 50rem;
  height: auto;
  max-width: 500px;
  margin: 1.75rem auto;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 1rem;
  font-weight: 400;
  color: rgb(21, 25, 29);
  line-height: 1.5;
  text-align: left;
`;

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
      <ModalProvider>
        <StyledModal isOpen={isOpen} onBackgroundClick={toggleModal} onEscapeKeydown={toggleModal}>
          <ImportComponent onImport={props.onImport} onCancel={toggleModal} />
        </StyledModal>
      </ModalProvider>
    </>
  );
}
