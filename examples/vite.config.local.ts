// This file contains configuration settings that allow
// examples to be built against the nebula.gl source code in this repo instead
// of building against their installed version of nebula.gl.
//
// This enables using the examples to debug the main nebula.gl library source
// without publishing or npm linking, with conveniences such hot reloading etc.
const resolve = require('path').resolve;

const LIB_DIR = resolve(__dirname, '..');
const MAIN_SRC_DIR = resolve(LIB_DIR, './modules/main/src/');
const EDIT_MODES_SRC_DIR = resolve(LIB_DIR, './modules/edit-modes/src/');
const LAYERS_SRC_DIR = resolve(LIB_DIR, './modules/layers/src/');
const OVERLAYS_SRC_DIR = resolve(LIB_DIR, './modules/overlays/src/');
const EDITOR_SRC_DIR = resolve(LIB_DIR, './modules/editor/src/');
const REACT_EDITOR_LITE_SRC_DIR = resolve(LIB_DIR, './modules/react-map-gl-draw/src');

// Support for hot reloading changes to the nebula.gl library:
export function makeLocalDevConfig(EXAMPLE_DIR = LIB_DIR) {
  return {
    alias: {
      'nebula.gl/dist': MAIN_SRC_DIR,
      'nebula.gl': MAIN_SRC_DIR,

      '@nebula.gl/edit-modes/dist': EDIT_MODES_SRC_DIR,
      '@nebula.gl/edit-modes': EDIT_MODES_SRC_DIR,

      '@nebula.gl/layers/dist': LAYERS_SRC_DIR,
      '@nebula.gl/layers': LAYERS_SRC_DIR,

      '@nebula.gl/overlays/dist': OVERLAYS_SRC_DIR,
      '@nebula.gl/overlays': OVERLAYS_SRC_DIR,

      '@nebula.gl/editor/dist': EDITOR_SRC_DIR,
      '@nebula.gl/editor': EDITOR_SRC_DIR,

      'react-map-gl-draw/dist': REACT_EDITOR_LITE_SRC_DIR,
      'react-map-gl-draw': REACT_EDITOR_LITE_SRC_DIR,

      'react-map-gl': resolve(LIB_DIR, './node_modules/react-map-gl'),

      '@deck.gl/core': resolve(LIB_DIR, './node_modules/@deck.gl/core'),
      '@deck.gl/layers': resolve(LIB_DIR, './node_modules/@deck.gl/layers'),

      // Use luma.gl specified by root package.json
      'luma.gl': resolve(LIB_DIR, './node_modules/luma.gl'),
      // Important: ensure shared dependencies come from the main node_modules dir
      // Versions will be controlled by the deck.gl top level package.json
      'math.gl': resolve(LIB_DIR, './node_modules/math.gl'),
      seer: resolve(LIB_DIR, './node_modules/seer'),
      react: resolve(LIB_DIR, './node_modules/react'),
    },
  };
}
