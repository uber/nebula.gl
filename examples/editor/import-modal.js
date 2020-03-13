// @flow
/* eslint-env browser */

import React from 'react';
import Modal from 'styled-react-modal';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

const StyledModal = Modal.styled`
  width: 20rem;
  height: 20rem;
  display: flex;
  flexFlow: 'column';
  align-items: center;
  justify-content: center;
  background-color: white;
`;

const Button = styled.button`
  display: inline-block;
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
  display: block;
`;

export type ImportModalProps = {
  onImport: geojson => mixed
};

export function FancyModalButton(props: ImportModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [text, setText] = React.useState('');

  function toggleModal(e) {
    setIsOpen(!isOpen);
  }

  const divStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    display: 'flex',
    flexFlow: 'column'
  };

  const innerStyle = { width: 'auto' };

  return (
    <div style={divStyle}>
      <Button onClick={toggleModal}>Click me</Button>
      <StyledModal isOpen={isOpen} onBackgroundClick={toggleModal} onEscapeKeydown={toggleModal}>
        <div style={innerStyle}>
          Enter some text:
          <TextareaAutosize rows={5} onChange={event => setText(event.target.value)} />
        </div>
        <div>
          <Button
            onClick={() => {
              props.onImport(JSON.parse(text));
              toggleModal();
            }}
          >
            Import Geometry
          </Button>
          <Button onClick={toggleModal}>Close me</Button>
        </div>
      </StyledModal>
    </div>
  );
}
