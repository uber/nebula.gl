import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { EditorModes } from 'react-map-gl-draw';

const MODES = [
  { id: EditorModes.EDIT_VERTEX, text: 'Select Feature', icon: 'icon-select.svg' },
  { id: EditorModes.DRAW_POINT, text: 'Draw Point', icon: 'icon-point.svg' },
  { id: EditorModes.DRAW_PATH, text: 'Draw Polyline', icon: 'icon-path.svg' },
  { id: EditorModes.DRAW_POLYGON, text: 'Draw Polygon', icon: 'icon-polygon.svg' },
  { id: EditorModes.DRAW_RECTANGLE, text: 'Draw Rectangle', icon: 'icon-rectangle.svg' }
];

const Container = styled.div`
  position: absolute;
  width: 48px;
  left: 24px;
  top: 24px;
  background: #fff;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
  outline: none;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Row = styled.div`
  height: 34px;
  padding: 7px;
  display: flex;
  justify-content: left;
  background: ${props => (props.selected ? '#0071bc' : props.hovered ? '#e6e6e6;' : 'inherit')};
`;

const Img = styled.img`
  width: inherit;
  height: inherit;
`;

const Tooltip = styled.div`
  position: absolute;
  left: 52px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  min-width: 100px;
  max-width: 300px;
  height: 24px;
  font-size: 12px;
  z-index: 9;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default class Toolbar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hoveredMode: null
    };
  }

  _onHover = evt => {
    this.setState({ hoveredMode: evt && evt.target.id });
  };

  render() {
    const { selectedMode } = this.props;
    const { hoveredMode } = this.state;

    return (
      <Container>
        {MODES.map(m => {
          return (
            <Row
              onClick={this.props.onClick}
              onMouseOver={this.props.onHover}
              onMouseOut={_ => this._onHover(null)}
              selected={m.id === selectedMode}
              hovered={m.id === hoveredMode}
              key={m.id}
              id={m.id}
            >
              <Img id={m.id} onMouseOver={this._onHover} src={m.icon} />
              {hoveredMode === m.id && <Tooltip>{m.text}</Tooltip>}
            </Row>
          );
        })}
      </Container>
    );
  }
}
