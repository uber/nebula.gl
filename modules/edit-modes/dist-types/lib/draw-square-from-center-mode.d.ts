import { Position, Polygon, FeatureOf } from '../geojson-types';
import { TwoClickPolygonMode } from './two-click-polygon-mode';
export declare class DrawSquareFromCenterMode extends TwoClickPolygonMode {
    getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon>;
}
//# sourceMappingURL=draw-square-from-center-mode.d.ts.map