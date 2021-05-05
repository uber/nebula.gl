import { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection, TentativeFeature } from '../types';
import { Position, Polygon, FeatureOf, FeatureCollection } from '../geojson-types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class ThreeClickPolygonMode extends GeoJsonEditMode {
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    getThreeClickPolygon(coord1: Position, coord2: Position, coord3: Position, modeConfig: any): FeatureOf<Polygon> | null | undefined;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    createTentativeFeature(props: ModeProps<FeatureCollection>): TentativeFeature;
}
//# sourceMappingURL=three-click-polygon-mode.d.ts.map