/* eslint-env browser */
import * as React from 'react';
import { AnyGeoJson } from '@nebula.gl/edit-modes';
import { EditorModal } from './editor-modal';
import { ExportComponent } from './export-component';

export type ExportModalProps = {
  geoJson: AnyGeoJson;
  onClose: () => unknown;
  filename?: string;
  additionalInputs?: React.ReactNode;
};

export function ExportModal(props: ExportModalProps) {
  return (
    <EditorModal
      onClose={props.onClose}
      title={'Export'}
      content={<ExportComponent {...props} />}
    />
  );
}
