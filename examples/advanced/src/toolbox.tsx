import * as React from 'react';
import styled from 'styled-components';

const styles = {
  toolboxItem: {
    flexBasis: '50%',
  },
};

export const Toolbox = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  color: #f0f0f0;
  padding: 0;
  width: 230px;
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  overflow: auto;
  z-index: 999;
`;

export const ToolboxRow = (props) => <div>{props.children}</div>;
export const ToolboxControl = (props) => <div style={styles.toolboxItem}>{props.children}</div>;

export const ToolboxTitle = styled.div`
  background: rgba(39, 45, 59, 0.8);
  font-size: 16px;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0px 8px;
`;

const buttonBackground = (props: { selected?: boolean }) =>
  props.selected ? 'rgba(30, 84, 183, 0.8)' : 'rgba(23, 28, 41, 0.8)';

export const ToolboxButton = styled.button`
  display: block;
  width: 100%;
  border: none;
  color: #f0f0f0;
  background: ${buttonBackground};
  text-align: left;
  font-size: 16px;
  outline: none;
  height: 44px;
  cursor: pointer;

  &:hover {
    background: #276ef1;
  }
`;

const ToolboxCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border: none;
  color: #f0f0f0;
  background: ${buttonBackground};
  text-align: left;
  text-transform: capitalize;
  font-size: 16px;
  outline: none;
  height: 44px;
  cursor: pointer;

  &:hover {
    background: #276ef1;
  }
`;

export const ToolboxCheckbox = (props) => (
  <label>
    <ToolboxCheckboxContainer>
      <input {...{ ...props, children: null }} />
      {props.children}
    </ToolboxCheckboxContainer>
  </label>
);
