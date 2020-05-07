/* eslint-env browser */

import * as React from 'react';
import Modal, { ModalProvider } from 'styled-react-modal';
import styled from 'styled-components';

export const Button = styled.button`
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

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.75rem 0.75rem;
  border-bottom: 1px solid rgb(222, 226, 230);
`;

const Header = styled.h5`
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
`;

export type ModalProps = {
  title: any;
  content: any;
  onClose: () => unknown;
};

export function EditorModal(props: ModalProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  function toggleModal() {
    if (isOpen) {
      props.onClose();
    }
    setIsOpen(!isOpen);
  }

  return (
    <>
      <ModalProvider>
        <StyledModal isOpen={isOpen} onBackgroundClick={toggleModal} onEscapeKeydown={toggleModal}>
          <Content>
            <HeaderRow>
              <Header>{props.title}</Header>
            </HeaderRow>
            {props.content}
          </Content>
        </StyledModal>
      </ModalProvider>
    </>
  );
}
