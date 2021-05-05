import { MapContextProps } from 'react-map-gl';
import * as React from 'react';
import { Feature, FeatureCollection, EditAction } from '@nebula.gl/edit-modes';
import { MjolnirEvent } from 'mjolnir.js';
import { EditorProps, EditorState, SelectAction } from './types';
export default class ModeHandler extends React.PureComponent<EditorProps, EditorState> {
    static displayName: string;
    static defaultProps: {
        selectable: boolean;
        mode: any;
        features: any;
        onSelect: any;
        onUpdate: any;
        onUpdateCursor: () => void;
    };
    constructor(props: EditorProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: EditorProps): void;
    componentWillUnmount(): void;
    _events: any;
    _eventsRegistered: boolean;
    _modeHandler: any;
    _context: MapContextProps | null | undefined;
    _containerRef: HTMLElement | null | undefined;
    getFeatures: () => any;
    addFeatures: (features: import("@nebula.gl/edit-modes").FeatureOf<import("@nebula.gl/edit-modes").Point> | import("@nebula.gl/edit-modes").FeatureOf<import("@nebula.gl/edit-modes").LineString> | import("@nebula.gl/edit-modes").FeatureOf<import("@nebula.gl/edit-modes").Polygon> | import("@nebula.gl/edit-modes").FeatureOf<import("@nebula.gl/edit-modes").MultiPoint> | import("@nebula.gl/edit-modes").FeatureOf<import("@nebula.gl/edit-modes").MultiLineString> | import("@nebula.gl/edit-modes").FeatureOf<import("@nebula.gl/edit-modes").MultiPolygon> | Feature[]) => void;
    deleteFeatures: (featureIndexes: number | number[]) => void;
    deleteHandles: (featureIndex: number, handleIndexes: number[]) => FeatureCollection;
    getModeProps(): {
        data: any;
        selectedIndexes: number[];
        selectedEditHandleIndexes: number[];
        lastPointerMoveEvent: import("@nebula.gl/edit-modes").PointerMoveEvent;
        viewport: import("viewport-mercator-project").WebMercatorViewport;
        featuresDraggable: boolean;
        onEdit: (editAction: EditAction<any>) => void;
        onUpdateCursor: Function;
        modeConfig: any;
    };
    _getMemorizedFeatureCollection: (args: any) => any;
    _getFeatureCollection: () => any;
    _setupModeHandler: () => void;
    _clearEditingState: () => void;
    _getSelectedFeatureIndex: () => number;
    _onSelect: (selected: SelectAction) => void;
    _onEdit: (editAction: EditAction<any>) => void;
    _degregisterEvents: () => void;
    _registerEvents: () => void;
    _onEvent: (handler: Function, evt: any, stopPropagation: boolean) => void;
    _onClick: (event: import("@nebula.gl/edit-modes/dist-types/types").BasePointerEvent) => void;
    _onDblclick: (event: import("@nebula.gl/edit-modes/dist-types/types").BasePointerEvent) => void;
    _onPointerMove: (event: import("@nebula.gl/edit-modes/dist-types/types").BasePointerEvent) => void;
    _onPointerDown: (event: import("@nebula.gl/edit-modes/dist-types/types").BasePointerEvent) => void;
    _onPointerUp: (event: import("@nebula.gl/edit-modes/dist-types/types").BasePointerEvent) => void;
    _onPan: (event: import("@nebula.gl/edit-modes/dist-types/types").BasePointerEvent) => void;
    project: (pt: [number, number]) => import("viewport-mercator-project").Coordinates;
    unproject: (pt: [number, number]) => import("viewport-mercator-project").Coordinates;
    _getEvent(evt: MjolnirEvent): {
        picks: {
            object: any;
            isGuide: boolean;
            type: any;
            index: any;
            featureIndex: any;
        }[];
        screenCoords: number[];
        mapCoords: import("viewport-mercator-project").Coordinates;
        sourceEvent: any;
    };
    _getHoverState: (event: import("@nebula.gl/edit-modes/dist-types/types").BasePointerEvent) => {
        object: any;
        index: number;
        isGuide: boolean;
        screenCoords: import("@nebula.gl/edit-modes").ScreenCoordinates;
        mapCoords: import("@nebula.gl/edit-modes").Position;
    };
    _render(): JSX.Element;
    render(): JSX.Element;
}
//# sourceMappingURL=mode-handler.d.ts.map