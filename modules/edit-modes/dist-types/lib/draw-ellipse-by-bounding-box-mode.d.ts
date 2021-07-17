import { Position, Polygon, FeatureOf } from '../geojson-types';
import { TwoClickPolygonMode } from './two-click-polygon-mode';
export declare class DrawEllipseByBoundingBoxMode extends TwoClickPolygonMode {
    getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon>;
}
//# sourceMappingURL=draw-ellipse-by-bounding-box-mode.d.ts.map