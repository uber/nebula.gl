import { FeatureCollection } from '../geojson-types';
import { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection, TentativeFeature } from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class SplitPolygonMode extends GeoJsonEditMode {
    calculateMapCoords(clickSequence: any, mapCoords: any, props: ModeProps<FeatureCollection>): any;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    splitPolygon(tentativeFeature: TentativeFeature, props: ModeProps<FeatureCollection>): import("../types").EditAction<FeatureCollection>;
}
//# sourceMappingURL=split-polygon-mode.d.ts.map