/// <reference types="node" />
import Event from 'events';
import Feature from './feature';
export default class NebulaLayer extends Event.EventEmitter {
    getData: () => Record<string, any>[];
    toNebulaFeature: (data: Record<string, any>) => Feature;
    id: string;
    helperLayers: Record<string, any>[];
    usesMapEvents: boolean;
    enablePicking: boolean;
    enableSelection: boolean;
    constructor({ getData, on, toNebulaFeature }: Record<string, any>);
    render(config: Record<string, any>): unknown;
}
//# sourceMappingURL=nebula-layer.d.ts.map