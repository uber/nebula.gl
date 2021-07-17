import { LineString, FeatureCollection } from '../geojson-types';
import { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection } from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class ExtendLineStringMode extends GeoJsonEditMode {
    getSingleSelectedLineString(props: ModeProps<FeatureCollection>): LineString | null | undefined;
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
}
//# sourceMappingURL=extend-line-string-mode.d.ts.map