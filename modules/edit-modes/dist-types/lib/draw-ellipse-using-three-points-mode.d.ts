import { Position, Polygon, FeatureOf } from '../geojson-types';
import { ThreeClickPolygonMode } from './three-click-polygon-mode';
export declare class DrawEllipseUsingThreePointsMode extends ThreeClickPolygonMode {
    getThreeClickPolygon(coord1: Position, coord2: Position, coord3: Position, modeConfig: any): FeatureOf<Polygon> | null | undefined;
}
//# sourceMappingURL=draw-ellipse-using-three-points-mode.d.ts.map