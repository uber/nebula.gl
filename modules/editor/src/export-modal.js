// @flow
/* eslint-env browser */

import React from 'react';
import type { AnyGeoJson } from '@nebula.gl/edit-modes';
import { EditorModal } from './editor-modal.js';
import { ExportComponent } from './export-component.js';

export type ExportModalProps = {
  features: AnyGeoJson,
  onClose: () => mixed
};

export function ExportModal(props: ExportModalProps) {
  return (
    <EditorModal
      onClose={props.onClose}
      title={'Export'}
      content={<ExportComponent features={props.features} onClose={props.onClose} />}
    />
  );
}
