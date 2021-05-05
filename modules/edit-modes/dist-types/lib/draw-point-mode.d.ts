import { ClickEvent, PointerMoveEvent, ModeProps, TentativeFeature } from '../types';
import { FeatureCollection } from '../geojson-types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class DrawPointMode extends GeoJsonEditMode {
    createTentativeFeature(props: ModeProps<FeatureCollection>): TentativeFeature;
    handleClick({ mapCoords }: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
}
//# sourceMappingURL=draw-point-mode.d.ts.map