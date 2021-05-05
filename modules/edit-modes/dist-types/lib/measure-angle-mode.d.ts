import { ClickEvent, PointerMoveEvent, Tooltip, ModeProps, GuideFeatureCollection } from '../types';
import { FeatureCollection } from '../geojson-types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class MeasureAngleMode extends GeoJsonEditMode {
    _getTooltips: (args: any) => any;
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    getPoints(props: ModeProps<FeatureCollection>): import("../geojson-types").Position[];
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    getTooltips(props: ModeProps<FeatureCollection>): Tooltip[];
}
//# sourceMappingURL=measure-angle-mode.d.ts.map