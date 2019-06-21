import React, { Component } from 'react';
import styled from 'styled-components';

import Example from '../../../examples/advanced/example';

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 4rem);
  margin-top: 4rem;
`;

export default class GeoJsonEditor extends Component {
  render() {
    return (
      <Container id="geoJsonEditorContainer">
        <Example />
      </Container>
    );
  }
}
