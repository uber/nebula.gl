import document from 'global/document';
import * as React from 'react';
import ReactDOM from 'react-dom';

import { Example } from './example.ts';

const root = document.createElement('div');

if (document.body) {
  document.body.style.margin = '0';

  document.body.appendChild(root);
  ReactDOM.render(<Example />, root);
}
