import { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection, TentativeFeature } from '../types';
import { Position, FeatureCollection } from '../geojson-types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class Draw90DegreePolygonMode extends GeoJsonEditMode {
    createTentativeFeature(props: ModeProps<FeatureCollection>): TentativeFeature;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    finalizedCoordinates(coords: Position[]): Position[][];
    getIntermediatePoint(coordinates: Position[]): any;
}
//# sourceMappingURL=draw-90degree-polygon-mode.d.ts.map