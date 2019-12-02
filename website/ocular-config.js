const resolve = require('path').resolve;

const DOCS = require('../docs/table-of-contents.json');
const DEPENDENCIES = require('./package.json').dependencies;

const LIB_DIR = resolve(__dirname, '..');
const MAIN_SRC_DIR = resolve(LIB_DIR, './modules/main/src');
const EDIT_MODES_SRC_DIR = resolve(LIB_DIR, './modules/edit-modes/src');
const LAYERS_SRC_DIR = resolve(LIB_DIR, './modules/layers/src');
const OVERLAYS_SRC_DIR = resolve(LIB_DIR, './modules/overlays/src');

// eslint-disable-next-line import/no-extraneous-dependencies
const ALIASES = {
  'nebula.gl/dist': MAIN_SRC_DIR,
  'nebula.gl': MAIN_SRC_DIR,

  '@nebula.gl/edit-modes/dist': EDIT_MODES_SRC_DIR,
  '@nebula.gl/edit-modes': EDIT_MODES_SRC_DIR,

  '@nebula.gl/layers/dist': LAYERS_SRC_DIR,
  '@nebula.gl/layers': LAYERS_SRC_DIR,

  '@nebula.gl/overlays/dist': OVERLAYS_SRC_DIR,
  '@nebula.gl/overlays': OVERLAYS_SRC_DIR,

  '@deck.gl/core': resolve(LIB_DIR, './node_modules/@deck.gl/core'),
  '@deck.gl/layers': resolve(LIB_DIR, './node_modules/@deck.gl/layers'),
  '@deck.gl/react': resolve(LIB_DIR, './node_modules/@deck.gl/react'),

  // Use luma.gl specified by root package.json
  '@luma.gl/core': resolve(LIB_DIR, './node_modules/@luma.gl/core'),
  '@luma.gl/webgl': resolve(LIB_DIR, './node_modules/@luma.gl/webgl'),
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
  logLevel: 4,

  DOC_FOLDERS: [`${__dirname}/../docs/`],
  ROOT_FOLDER: `${__dirname}/../`,
  DIR_NAME: `${__dirname}`,

  DOCS,

  // TODO/ib - from ocular, deduplicate with above settings
  PROJECT_TYPE: 'github',

  PROJECT_NAME: 'nebula.gl',
  PROJECT_ORG: 'uber',
  PROJECT_URL: 'https://github.com/uber/nebula.gl',
  PROJECT_DESC: 'High-Performance, 3D-enabled GeoJSON editing deck.gl and React',
  PATH_PREFIX: '/',

  FOOTER_LOGO: '',

  GA_TRACKING: null,

  // For showing star counts and contributors.
  // Should be like btoa('YourUsername:YourKey') and should be readonly.
  GITHUB_KEY: 'NO-KEY',

  HOME_PATH: '/',

  HOME_HEADING: 'High-Performance, 3D-enabled GeoJSON editing deck.gl and React',

  HOME_RIGHT: null,

  HOME_BULLETS: [
    {
      text: 'High Performance Editing',
      desc: 'Can be used with deck.gl for performant rendering of 100K+ segment datasets',
      img: 'images/icon-high-precision.svg'
    },
    {
      text: 'Full GeoJson Support',
      desc:
        'Supports corner cases like converting between Polygon and MultiPolygon features as points are added',
      img: 'images/icon-high-precision.svg'
    },
    {
      text: '3D Editing',
      desc: 'Edit Volumes and Elevations.',
      img: 'images/icon-high-precision.svg'
    }
  ],

  PROJECTS: [
    {
      name: 'deck.gl',
      title: 'deck.gl',
      url: 'https://deck.gl'
    },
    {
      name: 'luma.gl',
      title: 'luma.gl',
      url: 'https://luma.gl'
    },
    {
      name: 'react-map-gl',
      title: 'react-map-gl',
      url: 'https://uber.github.io/react-map-gl'
    },
    {
      name: 'react-vis',
      title: 'react-vis',
      url: 'https://uber.github.io/react-vis'
    }
  ],

  ADDITIONAL_LINKS: [{ name: 'GeoJSON Editor', href: '/geojson-editor', index: 0 }],

  LINK_TO_GET_STARTED: '/docs',

  THEME_OVERRIDES: [
    {
      key: 'none',
      value: 'none'
    }
  ],

  EXAMPLES: [
    // {
    //   title: 'EditableGeoJsonLayer',
    //   componentUrl: resolve(__dirname, '../examples/deck/example.js'),
    //   path: 'examples/editablegeojsonlayer'
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
