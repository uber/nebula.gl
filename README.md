<p align="right">
  <a href="https://npmjs.org/package/nebula.gl">
    <img src="https://img.shields.io/npm/v/nebula.gl.svg" alt="version" />
  </a>
  <a href="https://travis-ci.org/uber/nebula.gl">
    <img src="https://img.shields.io/travis/uber/nebula.gl/master.svg" alt="build" />
  </a>
  <a href="https://npmjs.org/package/nebula.gl">
    <img src="https://img.shields.io/npm/dm/nebula.gl.svg" alt="downloads" />
  </a>
</p>

# Nebula.gl

A suite of 3D-enabled data editing overlays, suitable for deck.gl.

## To run the example

1.  `git clone git@github.com:uber/nebula.gl.git`
2.  `cd nebula.gl`
3.  `yarn`
4.  `cd examples/deck`
5.  `yarn`
6.  `export MapboxAccessToken='<Add your key>'`
7.  `yarn start-local`
8.  You can view/edit geometry.

## Important note: Only public NPM registries must be used; follow these steps to enable simple switching between NPM registries using npmrc:

1. `npm i -g npmrc`
2. `npmrc`
3. `npmrc -c public`
4. `npmrc public`
# you'll now use public npm

# regenerate your lock file
5. `cd examples/deck`
6. `rm yarn.lock`
7, `yarn`

# switch back to internal
8. `npmrc default`
