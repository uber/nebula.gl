import { Position } from 'geojson';
export default class LayerMouseEvent {
    canceled: boolean;
    data: Record<string, any>;
    metadata: Record<string, any>;
    groundPoint: Position;
    nativeEvent: MouseEvent;
    nebula: Record<string, any>;
    constructor(nativeEvent: MouseEvent, { data, groundPoint, nebula, metadata }: Record<string, any>);
    stopPropagation(): void;
}
//# sourceMappingURL=layer-mouse-event.d.ts.map