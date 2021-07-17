/// <reference types="react" />
import { Feature } from '@nebula.gl/edit-modes';
import { GeoJsonType } from './types';
import { RENDER_STATE } from './constants';
import ModeHandler from './mode-handler';
import { editHandleStyle as defaultEditHandleStyle, featureStyle as defaultFeatureStyle } from './style';
export default class Editor extends ModeHandler {
    static defaultProps: {
        clickRadius: number;
        featureShape: string;
        editHandleShape: string;
        editHandleStyle: typeof defaultEditHandleStyle;
        featureStyle: typeof defaultFeatureStyle;
        featuresDraggable: boolean;
        selectable: boolean;
        mode: any;
        features: any;
        onSelect: any;
        onUpdate: any;
        onUpdateCursor: () => void;
    };
    _getPathInScreenCoords(coordinates: any, type: GeoJsonType): any;
    _getEditHandleState: (editHandle: Feature, renderState: string) => string;
    _getFeatureRenderState: (index: number, renderState: RENDER_STATE) => RENDER_STATE.INACTIVE | RENDER_STATE.INACTIVE | RENDER_STATE.UNCOMMITTED | RENDER_STATE;
    _getStyleProp: (styleProp: any, params: any) => any;
    _renderEditHandle: (editHandle: Feature, feature: Feature) => JSX.Element;
    _renderSegment: (featureIndex: string | number, index: number, coordinates: number[], style: Record<string, any>) => JSX.Element;
    _renderSegments: (featureIndex: string | number, coordinates: number[], style: Record<string, any>) => any[];
    _renderFill: (featureIndex: string | number, coordinates: number[], style: Record<string, any>) => JSX.Element;
    _renderTentativeFeature: (feature: Feature, cursorEditHandle: Feature) => any[];
    _renderGuides: (guideFeatures: Feature[]) => JSX.Element;
    _renderPoint: (feature: Feature, index: number, path: string) => JSX.Element;
    _renderPath: (feature: Feature, index: number, path: string) => JSX.Element;
    _renderPolygon: (feature: Feature, index: number, path: string) => JSX.Element;
    _renderFeature: (feature: Feature, index: number) => JSX.Element;
    _renderCanvas: () => JSX.Element;
    _render: () => JSX.Element;
}
//# sourceMappingURL=editor.d.ts.map