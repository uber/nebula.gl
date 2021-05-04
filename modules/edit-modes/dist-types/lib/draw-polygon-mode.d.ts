import { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection, TentativeFeature } from '../types';
import { FeatureCollection } from '../geojson-types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class DrawPolygonMode extends GeoJsonEditMode {
    createTentativeFeature(props: ModeProps<FeatureCollection>): TentativeFeature;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
}
//# sourceMappingURL=draw-polygon-mode.d.ts.map