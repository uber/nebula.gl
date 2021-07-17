import * as React from 'react';
import { AnyGeoJson } from '@nebula.gl/edit-modes';
export declare type ExportModalProps = {
    geoJson: AnyGeoJson;
    onClose: () => unknown;
    filename?: string;
    additionalInputs?: React.ReactNode;
};
export declare function ExportModal(props: ExportModalProps): JSX.Element;
//# sourceMappingURL=export-modal.d.ts.map