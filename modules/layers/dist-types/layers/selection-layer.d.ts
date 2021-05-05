/// <reference types="deck.gl" />
import { CompositeLayer } from '@deck.gl/core';
import EditableGeoJsonLayer from './editable-geojson-layer';
export declare const SELECTION_TYPE: {
    NONE: any;
    RECTANGLE: string;
    POLYGON: string;
};
export default class SelectionLayer extends CompositeLayer<any> {
    static layerName: string;
    static defaultProps: {
        selectionType: string;
        layerIds: any[];
        onSelect: () => void;
    };
    _selectRectangleObjects(coordinates: any): void;
    _selectPolygonObjects(coordinates: any): void;
    renderLayers(): EditableGeoJsonLayer[];
    shouldUpdateState({ changeFlags: { stateChanged, propsOrDataChanged } }: Record<string, any>): any;
}
//# sourceMappingURL=selection-layer.d.ts.map