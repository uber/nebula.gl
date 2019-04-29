const resolve = require('path').resolve;

const DOCS = require('../docs/table-of-contents.json');
const DEPENDENCIES = require('./package.json').dependencies;

const LIB_DIR = resolve(__dirname, '..');
const CORE_SRC_DIR = resolve(LIB_DIR, './modules/core/src');
const LAYERS_SRC_DIR = resolve(LIB_DIR, './modules/layers/src');
const OVERLAYS_SRC_DIR = resolve(LIB_DIR, './modules/overlays/src');

// eslint-disable-next-line import/no-extraneous-dependencies
const ALIASES = {
  'nebula.gl/dist': CORE_SRC_DIR,
  'nebula.gl': CORE_SRC_DIR,

  '@nebula.gl/layers/dist': LAYERS_SRC_DIR,
  '@nebula.gl/layers': LAYERS_SRC_DIR,

  '@nebula.gl/overlays/dist': OVERLAYS_SRC_DIR,
  '@nebula.gl/overlays': OVERLAYS_SRC_DIR,

  '@deck.gl/core': resolve(LIB_DIR, './node_modules/@deck.gl/core'),
  '@deck.gl/layers': resolve(LIB_DIR, './node_modules/@deck.gl/layers'),

  // Use luma.gl specified by root package.json
  'luma.gl': resolve(LIB_DIR, './node_modules/luma.gl'),
  // Important: ensure shared dependencies come from the main node_modules dir
  // Versions will be controlled by the deck.gl top level package.json
  'math.gl': resolve(LIB_DIR, './node_modules/math.gl'),
  seer: resolve(LIB_DIR, './node_modules/seer'),
  react: resolve(LIB_DIR, './node_modules/react')
};

// When duplicating example dependencies in website, autogenerate
// aliases to ensure the website version is picked up
// NOTE: module dependencies are automatically injected
// TODO - should this be automatically done by ocular-gatsby?
const dependencyAliases = {};
// eslint-disable-next-line
for (const dependency in DEPENDENCIES) {
  dependencyAliases[dependency] = `${__dirname}/node_modules/${dependency}`;
}

module.exports = {
  // Adjusts amount of debug information from ocular-gatsby
  logLevel: 3,

  DOC_FOLDER: `${__dirname}/../docs/`,
  ROOT_FOLDER: `${__dirname}/../`,
  DIR_NAME: `${__dirname}`,

  DOCS,

  // TODO/ib - from ocular, deduplicate with above settings
  PROJECT_TYPE: 'github',

  PROJECT_NAME: 'nebula.gl',
  PROJECT_ORG: 'uber',
  PROJECT_URL: 'https://nebula.gl',
  PROJECT_DESC: 'A suite of 3D-enabled data editing layers for deck.gl',
  PATH_PREFIX: '/',

  FOOTER_LOGO: '',

  GA_TRACKING: null,

  // For showing star counts and contributors.
  // Should be like btoa('YourUsername:YourKey') and should be readonly.
  GITHUB_KEY: null,

  HOME_PATH: '/',

  HOME_HEADING: 'Framework agnostic loaders for visualization assets',

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

  PROJECTS: [],

  ADDITIONAL_LINKS: [],

  EXAMPLES: [
    // {
    //   title: 'Nebula-Deck',
    //   componentUrl: resolve(__dirname, './examples/deck/example.js'),
    //   path: 'examples/deck'
    // }
    // {
    //   title: 'ClusteringOverlayExample',
    //   path: 'examples/core/cubemap/',
    //   image: 'images/example-cubemap.jpg'
    // },
    // {
    //   title: 'EditPointsExample',
    //   path: 'examples/core/mandelbrot/',
    //   image: 'images/example-mandelbrot.jpg'
    // },
    // {
    //   title: 'EditPolygonsExample',
    //   path: 'examples/core/quasicrystals/',
    //   image: 'images/example-fragment.jpg'
    // },
    // {
    //   title: 'WorldHeritageExample',
    //   path: 'examples/core/persistence/',
    //   image: 'images/example-persistence.jpg'
    // }
  ],

  // Avoids duplicate conflicting inputs when importing from examples folders
  // Ocular adds this to gatsby's webpack config
  webpack: {
    resolve: {
      // modules: [resolve(__dirname, './node_modules')],
      alias: Object.assign({}, ALIASES, dependencyAliases, {
        //   '@luma.gl/addons': `${__dirname}/node_modules/@luma.gl/addons/src`,
        //   '@luma.gl/core': `${__dirname}/node_modules/@luma.gl/core/src`,
        //   '@luma.gl/constants': `${__dirname}/node_modules/@luma.gl/constants/src`,
        //   '@luma.gl/webgl': `${__dirname}/node_modules/@luma.gl/webgl/src`,
        //   '@deck.gl/core': `${__dirname}/node_modules/@deck.gl/core/src`,
        //   '@deck.gl/layers': `${__dirname}/node_modules/@deck.gl/layers/src`,
        //   '@deck.gl/react': `${__dirname}/node_modules/@deck.gl/react/src`
      })
    }
  }
};
