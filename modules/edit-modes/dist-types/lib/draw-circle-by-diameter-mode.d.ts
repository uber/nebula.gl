import { Position, Polygon, FeatureOf } from '../geojson-types';
import { TwoClickPolygonMode } from './two-click-polygon-mode';
export declare class DrawCircleByDiameterMode extends TwoClickPolygonMode {
    getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon>;
}
//# sourceMappingURL=draw-circle-by-diameter-mode.d.ts.map