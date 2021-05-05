import { FeatureCollection } from '../geojson-types';
import { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection } from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class DrawLineStringMode extends GeoJsonEditMode {
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>): void;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
}
//# sourceMappingURL=draw-line-string-mode.d.ts.map