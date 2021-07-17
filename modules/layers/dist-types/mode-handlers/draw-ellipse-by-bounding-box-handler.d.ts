import { PointerMoveEvent } from '../event-types';
import { EditAction } from './mode-handler';
import { TwoClickPolygonHandler } from './two-click-polygon-handler';
export declare class DrawEllipseByBoundingBoxHandler extends TwoClickPolygonHandler {
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
}
//# sourceMappingURL=draw-ellipse-by-bounding-box-handler.d.ts.map