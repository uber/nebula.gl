import { Position, Polygon, FeatureOf } from '../geojson-types';
import { TwoClickPolygonMode } from './two-click-polygon-mode';
export declare class DrawRectangleMode extends TwoClickPolygonMode {
    getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon>;
}
//# sourceMappingURL=draw-rectangle-mode.d.ts.map