import React from 'react';

export const styles = {
  toolbox: {
    position: 'absolute',
    top: 12,
    left: 12,
    background: 'white',
    padding: 10,
    borderRadius: 4,
    border: '1px solid gray',
    width: 350,
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '13px'
  },
  toolboxRow: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  toolboxRowWrapping: {
    display: 'flex',
    marginBottom: '5px',
    flexWrap: 'wrap'
  },
  toolboxDivider: {
    marginBottom: '5px',
    borderBottom: '1px solid gray'
  },
  toolboxItem: {
    flexBasis: '50%'
  },
  toolboxLabel: {
    textTransform: 'uppercase'
  }
};

export const ToolboxRow = props => <div style={styles.toolboxRow}>{props.children}</div>;
export const ToolboxRowWrapping = props => <div style={styles.toolboxRowWrapping}>{props.children}</div>;
export const ToolboxLabel = props => <div style={styles.toolboxLabel}>{props.children}</div>;
export const ToolboxControl = props => <div style={styles.toolboxItem}>{props.children}</div>;
export const ToolboxDivider = props => <div style={styles.toolboxDivider} />;
