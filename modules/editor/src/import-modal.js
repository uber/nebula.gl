// @flow
/* eslint-env browser */

import React from 'react';
import Modal, { ModalProvider } from 'styled-react-modal';
import styled from 'styled-components';
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

const Button = styled.button`
  display: inline-block;
  color: #fff;
  background-color: rgb(90, 98, 94);
  font-size: 1em;
  margin: 0.25em;
  padding: 0.375em 0.75em;
  border: 1px solid transparent;
  border-radius: 0.25em;
  display: block;
`;

export type ImportModalProps = {
  onImport: any => mixed
};

export function ImportModal(props: ImportModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  function toggleModal(e) {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <ModalProvider>
        <Button style={{ position: 'absolute', top: '10px', left: '10px' }} onClick={toggleModal}>
          Import...
        </Button>
        <StyledModal isOpen={isOpen} onBackgroundClick={toggleModal} onEscapeKeydown={toggleModal}>
          <ImportComponent onImport={props.onImport} onCancel={toggleModal} />
        </StyledModal>
      </ModalProvider>
    </div>
  );
}
