import { PointerMoveEvent } from '../event-types';
import { EditAction } from './mode-handler';
import { ThreeClickPolygonHandler } from './three-click-polygon-handler';
export declare class DrawRectangleUsingThreePointsHandler extends ThreeClickPolygonHandler {
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
}
//# sourceMappingURL=draw-rectangle-using-three-points-handler.d.ts.map