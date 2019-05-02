import React from 'react';

export const styles = {
  toolbox: {
    position: 'absolute',
    top: 12,
    left: 12,
    background: 'white',
    padding: 10,
    borderRadius: 4,
    boxShadow: '0 0 4px rgba(0,0,0,.15)',
    maxWidth: 250,
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '13px'
  },
  toolboxRow: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '4px 0'
  },
  toolboxRowWrapping: {
    display: 'flex',
    marginBottom: '5px',
    flexWrap: 'wrap'
  },
  toolboxDivider: {
    margin: '6px 0',
    borderBottom: '1px solid #ddd'
  },
  toolboxLabel: {
    marginBottom: '4px'
  },
  toolboxButton: {
    margin: '2px',
    outline: 0
  }
};

function styledComponent(props, component, id) {
  const { style, children, ...others } = props;
  switch (component) {
    case 'button':
      return (
        <button {...others} style={{ ...style, ...styles[id] }}>
          {children}
        </button>
      );
    default:
      return (
        <div {...others} style={{ ...styles[id], ...style }} {...others}>
          {children}
        </div>
      );
  }
}

export const ToolboxRow = props => styledComponent(props, 'div', 'toolboxRow');
export const ToolboxRowWrapping = props => styledComponent(props, 'div', 'toolboxRowWrapping');
export const ToolboxLabel = props => styledComponent(props, 'div', 'toolboxLabel');
export const ToolboxDivider = props => styledComponent(props, 'div', 'toolboxDivider');
export const ToolboxButton = props => styledComponent(props, 'button', 'toolboxButton');
