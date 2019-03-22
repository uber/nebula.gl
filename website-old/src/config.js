// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

export const PROJECT_TYPE = 'github';
export const PROJECT_NAME = 'nebula.gl';
export const PROJECT_ORG = 'uber';
export const PROJECT_URL = `https://github.com/${PROJECT_ORG}/${PROJECT_NAME}`;
export const PROJECT_DESC = 'An editing framework for deck.gl';

export const PROJECTS = {
  'deck.gl': 'https://uber.github.io/deck.gl',
  'luma.gl': 'https://uber.github.io/luma.gl',
  'react-map-gl': 'https://uber.github.io/react-map-gl',
  'vis.gl': 'https://uber-web.github.io/vis.gl'
};

export const HOME_HEADING = 'A high performance geometry editing framework for deck.gl';

/* eslint-disable quotes */
export const HOME_BULLETS = [
  {
    text: 'Path and Polygon Editing',
    desc: `Supports editing of both paths and polygon layers.`,
    img: 'images/icon-layers.svg'
  },
  {
    text: 'Advanced Editing Features',
    desc: 'Advanced features like curved path editing',
    img: 'images/icon-layers.svg'
  },
  {
    text: 'High Performance',
    desc: `nebula.gl is focused on interactive editing and update performance, \
building on the great rendering performance of deck.gl.`,
    img: 'images/icon-layers.svg'
  }
];

export const ADDITIONAL_LINKS = [];
