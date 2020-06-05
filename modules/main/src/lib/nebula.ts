import { EventEmitter } from 'events';

import document from 'global/document';
import window from 'global/window';
import { WebMercatorViewport } from '@deck.gl/core';

import DeckDrawer from './deck-renderer/deck-drawer';
import LayerMouseEvent from './layer-mouse-event';
import NebulaLayer from './nebula-layer';

const LOGGER_PREFIX = 'Nebula: ';

export default class Nebula {
  init(props: Record<string, any>) {
    this.props = props;
    this.wmViewport = new WebMercatorViewport(this.props.viewport);

    // TODO: Properly use pointer events: ['click', 'pointermove', 'pointerup', 'pointerdown']
    ['click', 'mousemove', 'mouseup', 'mousedown'].forEach((name) =>
      document.addEventListener(name, this._onMouseEvent, true)
    );
  }

  detach() {
    // TODO: Properly use pointer events: ['click', 'pointermove', 'pointerup', 'pointerdown']
    ['click', 'mousemove', 'mouseup', 'mousedown'].forEach((name) =>
      document.removeEventListener(name, this._onMouseEvent, true)
    );
  }

  updateProps(newProps: Record<string, any>) {
    this.props = newProps;
    const { viewport } = this.props;

    this.wmViewport = new WebMercatorViewport(viewport);
  }

  props: Record<string, any>;
  deckgl: Record<string, any> | null;
  mainContainer: Record<string, any> | null;
  deckglMouseOverInfo: Record<string, any> | null | undefined;
  _deckDrawer: DeckDrawer;
  _mouseWasDown: boolean;
  wmViewport: WebMercatorViewport;
  queryObjectEvents: EventEmitter = new EventEmitter();
  forceUpdate: Function;
  inited: boolean;

  log(message: string) {
    const { logger } = this.props;
    if (logger && logger.info) {
      logger.info(LOGGER_PREFIX + message);
    }
  }

  updateAllDeckObjects() {
    this.getAllLayers().forEach((layer) => {
      if (layer && layer.deckCache) {
        (layer.deckCache as any).updateAllDeckObjects();
      }
    });
    this.forceUpdate();
  }

  updateDeckObjectsByIds(ids: string[]) {
    this.getAllLayers().forEach((layer) => {
      if (layer && layer.deckCache) {
        (layer.deckCache as any).updateDeckObjectsByIds(ids);
      }
    });
    this.forceUpdate();
  }

  rerenderLayers() {
    this.updateAllDeckObjects();
  }

  _isNebulaEvent({ buttons, target, type }: Record<string, any>) {
    const { viewport } = this.props;

    // allow mouseup event aggressively to cancel drag properly
    // TODO: use pointer capture setPointerCapture() to capture mouseup properly after deckgl
    if (this._mouseWasDown && type === 'mouseup') {
      this._mouseWasDown = false;
      return true;
    }

    // allow mousemove event while dragging
    if (type === 'mousemove' && buttons > 0) {
      return true;
    }

    if (!target.getBoundingClientRect) {
      return false;
    }

    const rect = target.getBoundingClientRect();
    // Only listen to events coming from the basemap
    // identified by the canvas of the same size as viewport.
    // Need to round the rect dimension as some monitors
    // have some sub-pixel difference with viewport.
    return (
      Math.round(rect.width) === Math.round(viewport.width) &&
      Math.round(rect.height) === Math.round(viewport.height)
    );
  }

  _onMouseEvent = (event: window.MouseEvent) => {
    if (!this._isNebulaEvent(event)) {
      return;
    }

    if (event.type === 'mousedown') {
      this._mouseWasDown = true;
    }

    // offsetX/Y of the MouseEvent provides the offset in the X/Y coordinate
    // of the mouse pointer between that event and the padding edge of the target node.
    // We set our listener to document so we need to adjust offsetX/Y
    // in case the target is not be our WebGL canvas.
    const { top = 0, left = 0 } = this.mainContainer
      ? this.mainContainer.getBoundingClientRect()
      : {};
    const proxyEvent = new Proxy(event, {
      get: (original: any, propertyName: string) => {
        if (propertyName === 'offsetX') {
          return original.pageX - left;
        }

        if (propertyName === 'offsetY') {
          return original.pageY - top;
        }

        // TODO: Properly use pointer events
        if (propertyName === 'type') {
          return original.type.replace('pointer', 'mouse');
        }

        const result = original[propertyName];
        if (typeof result === 'function') {
          return result.bind(original);
        }
        return result;
      },
    });

    this._handleDeckGLEvent(proxyEvent);
  };

  getMouseGroundPosition(event: Record<string, any>) {
    return this.wmViewport.unproject([event.offsetX, event.offsetY]);
  }

  unprojectMousePosition(mousePosition: [number, number]): [number, number] {
    // @ts-ignore
    return this.wmViewport.unproject(mousePosition);
  }

  _handleDeckGLEvent(event: Record<string, any>) {
    const {
      deckgl,
      props: { onMapMouseEvent, selectionType, eventFilter },
    } = this;
    let sendMapEvent = true;
    let cursor = 'auto';

    if (event && deckgl && selectionType) {
      if (!this._deckDrawer) this._deckDrawer = new DeckDrawer(this);

      const lngLat = this.getMouseGroundPosition(event);
      if (eventFilter && !eventFilter(lngLat, event)) return;
      // @ts-ignore
      const drawerResult = this._deckDrawer.handleEvent(event, lngLat, selectionType);
      if (drawerResult.redraw) this.forceUpdate();
      return;
    }

    if (event && deckgl && (!event.buttons || event.type !== 'mousemove')) {
      // TODO: sort by mouse priority
      const layerIds = deckgl.props.layers
        .filter(
          (l: any) => l && l.props && l.props.nebulaLayer && l.props.nebulaLayer.enablePicking
        )
        .map((l: any) => l.id);

      const pickingInfo = deckgl.pickObject({
        x: event.offsetX,
        y: event.offsetY,
        radius: 5,
        layerIds,
      });
      this.queryObjectEvents.emit('pick', { event, pickingInfo });
      if (pickingInfo) {
        sendMapEvent = false;

        const { index, lngLat } = pickingInfo;
        if (eventFilter && !eventFilter(lngLat, event)) return;

        const { layer: deckLayer, object } = pickingInfo;

        if (
          deckLayer &&
          deckLayer.props &&
          deckLayer.props.nebulaLayer &&
          deckLayer.props.nebulaLayer.eventHandler
        ) {
          deckLayer.props.nebulaLayer.eventHandler(event, pickingInfo);
        }

        const original =
          object.original ||
          (deckLayer.props.nebulaLayer &&
            deckLayer.props.nebulaLayer.deckCache &&
            deckLayer.props.nebulaLayer.deckCache.originals[index]);

        if (original) {
          this.deckglMouseOverInfo = { originalLayer: deckLayer.props.nebulaLayer, index };
          // @ts-ignore
          const nebulaMouseEvent = new LayerMouseEvent(event, {
            data: original,
            metadata: object.metadata,
            groundPoint: lngLat,
            nebula: this,
          });
          deckLayer.props.nebulaLayer.emit(event.type, nebulaMouseEvent);
          this.forceUpdate();
        }

        cursor = 'pointer';
      }
    }

    if (document.documentElement) {
      document.documentElement.style.cursor = cursor;
    }

    if (sendMapEvent) {
      this.deckglMouseOverInfo = null;

      const lngLat = this.getMouseGroundPosition(event);
      if (eventFilter && !eventFilter(lngLat, event)) return;

      // send to layers first
      // @ts-ignore
      const nebulaMouseEvent = new LayerMouseEvent(event, {
        groundPoint: lngLat,
        nebula: this,
      });
      this.getAllLayers()
        .filter((layer) => layer && layer.usesMapEvents)
        .forEach((layer) => layer.emit('mapMouseEvent', nebulaMouseEvent));

      this.getAllLayers()
        .filter(
          (layer) =>
            layer && layer.props && layer.props.nebulaLayer && layer.props.nebulaLayer.mapMouseEvent
        )
        .forEach((layer) => layer.props.nebulaLayer.mapMouseEvent(nebulaMouseEvent, layer));

      if (onMapMouseEvent) {
        onMapMouseEvent(event, lngLat);
      }
    }
  }

  getExtraDeckLayers(): Record<string, any>[] {
    const result = [];

    if (this._deckDrawer) result.push(...this._deckDrawer.render());

    return result;
  }

  renderDeckLayers() {
    return this.getAllLayers()
      .map((layer) => (layer instanceof NebulaLayer ? layer.render({ nebula: this }) : layer))
      .filter(Boolean);
  }

  getAllLayers() {
    const result = [];

    this.props.layers.filter(Boolean).forEach((layer) => {
      result.push(layer);
      // Only NebulaLayers have helpers, Deck GL layers don't.
      if (layer instanceof NebulaLayer) {
        result.push(...layer.helperLayers);
      }
    });

    return result.filter(Boolean);
  }

  getRenderedLayers() {
    return [...this.renderDeckLayers(), ...this.getExtraDeckLayers()];
  }

  updateAndGetRenderedLayers(
    layers: Record<string, any>[],
    viewport: WebMercatorViewport,
    container: Record<string, any>
  ) {
    if (this.inited) {
      this.updateProps({ layers, viewport });
      this.forceUpdate = () => container.forceUpdate();
    } else {
      this.inited = true;
      this.init({ layers, viewport });
      this.forceUpdate = () => container.forceUpdate();
      this.updateAllDeckObjects();
    }

    return this.getRenderedLayers();
  }

  setDeck(deckgl: Record<string, any> | null) {
    if (deckgl) {
      this.deckgl = deckgl;
    }
  }

  setMainContainer(mainContainer: Record<string, any> | null) {
    if (mainContainer) {
      this.mainContainer = mainContainer;
    }
  }
}
