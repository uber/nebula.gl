/// <reference types="deck.gl" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { WebMercatorViewport } from '@deck.gl/core';
import DeckDrawer from './deck-renderer/deck-drawer';
export default class Nebula {
    init(props: Record<string, any>): void;
    detach(): void;
    updateProps(newProps: Record<string, any>): void;
    props: Record<string, any>;
    deckgl: Record<string, any> | null;
    mainContainer: Record<string, any> | null;
    deckglMouseOverInfo: Record<string, any> | null | undefined;
    _deckDrawer: DeckDrawer;
    _mouseWasDown: boolean;
    wmViewport: WebMercatorViewport;
    queryObjectEvents: EventEmitter;
    forceUpdate: Function;
    inited: boolean;
    log(message: string): void;
    updateAllDeckObjects(): void;
    updateDeckObjectsByIds(ids: string[]): void;
    rerenderLayers(): void;
    _isNebulaEvent({ buttons, target, type }: Record<string, any>): boolean;
    _onMouseEvent: (event: any) => void;
    getMouseGroundPosition(event: Record<string, any>): any[];
    unprojectMousePosition(mousePosition: [number, number]): [number, number];
    _handleDeckGLEvent(event: Record<string, any>): void;
    getExtraDeckLayers(): Record<string, any>[];
    renderDeckLayers(): any[];
    getAllLayers(): any[];
    getRenderedLayers(): any[];
    updateAndGetRenderedLayers(layers: Record<string, any>[], viewport: WebMercatorViewport, container: Record<string, any>): any[];
    setDeck(deckgl: Record<string, any> | null): void;
    setMainContainer(mainContainer: Record<string, any> | null): void;
}
//# sourceMappingURL=nebula.d.ts.map