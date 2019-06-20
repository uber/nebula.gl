import React from 'react';

export const styles = {
  toolbox: {
    position: 'fixed',
    top: 0,
    left: 0,
    color: '#F0F0F0',
    background: '#272D3B',
    padding: 0,
    width: 230,
    height: '100%',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '14px',
    overflow: 'scroll',
    zIndex: 999
  },
  toolboxRow: {},
  toolboxRowWrapping: {
    marginBottom: '5px'
  },
  toolboxDivider: {
    marginBottom: '5px',
    borderBottom: '1px solid gray'
  },
  toolboxItem: {
    flexBasis: '50%'
  },
  toolboxLabel: {},
  toolboxButton: {
    display: 'block',
    width: '100%',
    border: 'none',
    color: '#F0F0F0',
    background: '#171C29',
    textAlign: 'left',
    textTransform: 'capitalize',
    fontSize: 15,
    outline: 'none',
    height: 44
  }
};

export const ToolboxRow = props => <div style={styles.toolboxRow}>{props.children}</div>;
export const ToolboxRowWrapping = props => (
  <div style={styles.toolboxRowWrapping}>{props.children}</div>
);
export const ToolboxLabel = props => <div style={styles.toolboxLabel}>{props.children}</div>;
export const ToolboxControl = props => <div style={styles.toolboxItem}>{props.children}</div>;
export const ToolboxDivider = props => <div style={styles.toolboxDivider} />;

export const ToolboxButton = props => (
  <button {...props} style={{ ...styles.toolboxButton, ...props.style }}>
    {props.children}
  </button>
);

export const ToolboxCheckbox = props => (
  <div style={styles.toolboxButton}>
    <input {...{ ...props, children: null }} />
    {props.children}
  </div>
);
