#!/usr/bin/env node

/*
Copyright (c) 2018 Uber Technologies, Inc.
This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

/* eslint-env node */
// @flow

const path = require('path');
const { lstatSync, readdirSync } = require('fs');
const { join } = require('path');
const flowCopySource = require('flow-copy-source');

const getDirectories = directory =>
  readdirSync(directory)
    .map(name => join(directory, name))
    .filter(entry => lstatSync(entry).isDirectory());

async function run() {
  const directories = getDirectories(path.resolve(__dirname, '../modules'));

  for (const directory of directories) {
    console.log(`Copying flow source for directory ${directory}`); // eslint-disable-line

    await flowCopySource([join(directory, 'src')], join(directory, 'dist-es6'), {
      ignore: ['**/*.test.js', 'test/**/*.js']
    });
  }
}

run();
