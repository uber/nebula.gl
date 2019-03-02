#!/usr/bin/env node

/*
Copyright (c) 2018 Uber Technologies, Inc.
This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/

/* eslint-env node */
// @flow

const path = require('path');
const flowCopySource = require('flow-copy-source');

async function run() {
  await flowCopySource(
    [path.resolve(__dirname, '../modules/core/src')],
    path.resolve(__dirname, '../modules/core/dist-es6'),
    {
      ignore: ['**/*.test.js', 'test/**/*.js']
    }
  );

  await flowCopySource(
    [path.resolve(__dirname, '../modules/react/src')],
    path.resolve(__dirname, '../modules/react/dist-es6'),
    {
      ignore: ['**/*.test.js', 'test/**/*.js']
    }
  );
}

run();
