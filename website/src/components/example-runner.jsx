import React, {Component} from 'react'; // eslint-disable-line
import PropTypes from 'prop-types';
import {setPathPrefix} from 'luma.gl';

import InfoPanel from './info-panel';

const STYLES = {
  EXAMPLE_NOT_SUPPPORTED: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }
};

const propTypes = {
  example: PropTypes.object,
  canvas: PropTypes.string
};

const defaultProps = {
  canvas: 'example-canvas'
};

const DEFAULT_ALT_TEXT = 'THIS EXAMPLE IS NOT SUPPORTED';

export default class ExampleRunner extends Component {
  componentDidMount() {
    const {example} = this.props;
    const exampleApp = example.app;

    // Ensure the example can find its images
    // TODO - ideally ocular-gatsvy should extract images from example source?
    const RAW_GITHUB = 'https://raw.githubusercontent.com/uber/luma.gl/master';
    setPathPrefix(`${RAW_GITHUB}/${example.path}`);

    // Start the actual example
    exampleApp.start(this.props);
  }

  componentWillUnmount() {
    const {example} = this.props;
    const exampleApp = example.app;
    if (exampleApp) {
      exampleApp.stop(this.props);
    }
  }

  render() {
    const {example, width, height, name, noPanel, sourceLink} = this.props;
    const exampleApp = example.app;

    const notSupported = example.isSupported && !example.isSupported();

    if (notSupported) {
      const altText = example.getAltText ? example.getAltText() : DEFAULT_ALT_TEXT;
      return (
        <div style={STYLES.EXAMPLE_NOT_SUPPPORTED}>
          <h2> {altText} </h2>
        </div>
      );
    }

    // HTML is stored on the app
    const controls = exampleApp.getInfo && exampleApp.getInfo();

    return (
      <div className="fg" style={{width, height, padding: 0, border: 0}}>
        <canvas
          id={this.props.canvas}
          style={{width: '100%', height: '100%', padding: 0, border: 0}}
        />
        {noPanel ? null : <InfoPanel name={name} controls={controls} sourceLink={sourceLink} />}
      </div>
    );
  }
}

ExampleRunner.propTypes = propTypes;
ExampleRunner.defaultProps = defaultProps;
