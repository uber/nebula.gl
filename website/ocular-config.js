// const resolve = require('path').resolve;
// const ALIASES = require('ocular-dev-tools/config/ocular.config')({
//   root: resolve(__dirname, '..')
// }).aliases;

const DOCS = require('../docs/table-of-contents.json');
const DEPENDENCIES = require('./package.json').dependencies;

// When duplicating example dependencies in website, autogenerate
// aliases to ensure the website version is picked up
// NOTE: nebula.gl module dependencies are automatically injected
// TODO - should this be automatically done by ocular-gatsby?
const dependencyAliases = {};
for (const dependency in DEPENDENCIES) {
  dependencyAliases[dependency] = `${__dirname}/node_modules/${dependency}`;
}

module.exports = {
  logLevel: 1,

  PROJECT_TYPE: 'github',

  PROJECT_NAME: 'nebula.gl',
  PROJECT_ORG: 'uber',
  PROJECT_URL: `https://nebula.gl`,
  PROJECT_DESC: 'WebGL2 Components',

  PROJECTS: {},

  HOME_HEADING:
    'High-performance WebGL2 components for GPU-powered data visualization and computation.',

  HOME_RIGHT: null,

  HOME_BULLETS: [
    {
      text: 'Advanced GPU Usage',
      desc: 'Simplifies advanced GPU techniques, e.g. Instanced Rendering and Transform Feedback',
      img: 'icons/icon-react.svg'
    },
    {
      text: 'Shader Programming Power',
      desc:
        'Modularized shader code, classes for controlling GPU inputs and outputs, and support for debugging and profiling of GLSL shaders.',
      img: 'icons/icon-layers.svg'
    },
    {
      text: 'Performance Focus',
      desc: 'Enables visualization and GPU processing of very large data sets.',
      img: 'icons/icon-high-precision.svg'
    }
  ],

  ADDITIONAL_LINKS: [],

  EXAMPLES: [
    {
      title: 'BasicOverlayExample',
      path: 'examples/core/instancing/',
      image: 'images/example-instancing.jpg'
    },
    {
      title: 'ClusteringOverlayExample',
      path: 'examples/core/cubemap/',
      image: 'images/example-cubemap.jpg'},
    {
      title: 'EditPointsExample',
      path: 'examples/core/mandelbrot/',
      image: 'images/example-mandelbrot.jpg'
    },
    {
      title: 'EditPolygonsExample',
      path: 'examples/core/quasicrystals/',
      image: 'images/example-fragment.jpg'
    },
    {
      title: 'WorldHeritageExample',
      path: 'examples/core/persistence/',
      image: 'images/example-persistence.jpg'
    }
  ],

  THEME_OVERRIDES: [{ key: true, value: true }],

  DOCS,

  DOC_FOLDER: `${__dirname}/../docs/`,
  ROOT_FOLDER: `${__dirname}/../`,
  DIR_NAME: __dirname,

  // Avoids duplicate conflicting inputs when importing from examples folders
  // Ocular adds this to gatsby's webpack config
  webpack: {
    resolve: {
      alias: dependencyAliases
    }
  },

  // TODO - remnants from gatsby starter, remove and replace with ocular CAPS constants aboves
  // Domain of your website without pathPrefix.
  siteUrl: 'https://nebula.gl',
  // Prefixes all links. For cases when deployed to example.github.io/gatsby-advanced-starter/.
  pathPrefix: '/nebula',
  // Path to the RSS file.
  siteRss: '/rss.xml'
};
