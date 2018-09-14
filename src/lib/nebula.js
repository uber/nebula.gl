// @flow
import EventEmitter from 'events';
import document from 'global/document';
import window from 'global/window';
import { WebMercatorViewport } from 'deck.gl';

import DeckDrawer from './deck-renderer/deck-drawer';
import LayerMouseEvent from './layer-mouse-event';
import Projector from './projector';
import NebulaLayer from './nebula-layer';

const LOGGER_PREFIX = 'Nebula: ';

export default class Nebula {
  init(props: Object) {
    this.props = props;
    this.projector = new Projector(this.props.viewport);
    this.wmViewport = new WebMercatorViewport(this.props.viewport);

    // TODO: Properly use pointer events
    // ['click', 'dblclick', 'mousemove', 'mouseup', 'mousedown'].forEach(name =>
    ['click', 'dblclick', 'pointermove', 'pointerup', 'pointerdown'].forEach(name =>
      document.addEventListener(name, this._onMouseEvent, true)
    );
  }

  updateProps(newProps: Object) {
    this.props = newProps;
    const { viewport } = this.props;
    const { projector } = this;

    if (projector.shouldChangeCenter(viewport)) {
      this.log(`Changing center to [${viewport.longitude}, ${viewport.latitude}]`);
      projector.setCenterFromViewport(viewport);
    }

    this.wmViewport = new WebMercatorViewport(viewport);
  }

  props: Object;
  projector: Projector;
  deckgl: Object | null;
  mainContainer: Object | null;
  deckglMouseOverInfo: ?Object;
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
    this.getAllLayers().forEach(layer => {
      if (layer && layer.deckCache) {
        (layer.deckCache: any).updateAllDeckObjects();
      }
    });
    this.forceUpdate();
  }

  updateDeckObjectsByIds(ids: string[]) {
    this.getAllLayers().forEach(layer => {
      if (layer && layer.deckCache) {
        (layer.deckCache: any).updateDeckObjectsByIds(ids);
      }
    });
    this.forceUpdate();
  }

  rerenderLayers() {
    this.updateAllDeckObjects();
  }

  _isNebulaEvent({ buttons, target, type }: Object) {
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
      }
    });

    this._handleDeckGLEvent(proxyEvent);
  };

  allowEvent(lngLat: [number, number], event: Object): boolean {
    return true;
  }

  _getMouseGroundPosition(event: Object) {
    return this.wmViewport.unproject([event.offsetX, event.offsetY]);
  }

  _handleDeckGLEvent(event: Object) {
    const {
      deckgl,
      props: { onMapMouseEvent, selectionType }
    } = this;
    let sendMapEvent = true;
    let cursor = 'auto';

    if (event && deckgl && selectionType) {
      if (!this._deckDrawer) this._deckDrawer = new DeckDrawer(this);

      const lngLat = this._getMouseGroundPosition(event);
      if (!this.allowEvent(lngLat, event)) return;

      const drawerResult = this._deckDrawer.handleEvent(event, lngLat, selectionType);
      if (drawerResult.redraw) this.forceUpdate();
      return;
    }

    if (event && deckgl && (!event.buttons || event.type !== 'mousemove')) {
      // TODO: sort by mouse priority
      const layerIds = deckgl.props.layers
        .filter(l => l && l.props && l.props.nebulaLayer && l.props.nebulaLayer.enablePicking)
        .map(l => l.id);

      const pickingInfo = deckgl.queryObject({
        x: event.offsetX,
        y: event.offsetY,
        radius: 5,
        layerIds
      });
      this.queryObjectEvents.emit('pick', { event, pickingInfo });
      if (pickingInfo) {
        sendMapEvent = false;

        const { index, lngLat } = pickingInfo;
        if (!this.allowEvent(lngLat, event)) return;

        const { layer: deckLayer, object } = pickingInfo;
        const original =
          object.original ||
          (deckLayer.props.nebulaLayer &&
            deckLayer.props.nebulaLayer.deckCache &&
            deckLayer.props.nebulaLayer.deckCache.originals[index]);

        if (original) {
          this.deckglMouseOverInfo = { originalLayer: deckLayer.props.nebulaLayer, index };
          const nebulaMouseEvent = new LayerMouseEvent(event, {
            data: original,
            metadata: object.metadata,
            groundPoint: lngLat,
            nebula: this
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

      const lngLat = this._getMouseGroundPosition(event);
      if (!this.allowEvent(lngLat, event)) return;

      // send to layers first
      const nebulaMouseEvent = new LayerMouseEvent(event, {
        groundPoint: lngLat,
        nebula: this
      });
      this.getAllLayers()
        .filter(layer => layer && layer.usesMapEvents)
        .forEach(layer => layer.emit('mapMouseEvent', nebulaMouseEvent));

      if (onMapMouseEvent) {
        onMapMouseEvent(event, lngLat);
      }
    }
  }

  getExtraDeckLayers(): Object[] {
    const result = [];

    if (this._deckDrawer) result.push(...this._deckDrawer.render());

    return result;
  }

  renderDeckLayers() {
    return this.getAllLayers()
      .map(layer => (layer instanceof NebulaLayer ? layer.render({ nebula: this }) : layer))
      .filter(Boolean);
  }

  getAllLayers() {
    const result = [];

    this.props.layers.filter(Boolean).forEach(layer => {
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

  updateAndGetRenderedLayers(layers: Object[], viewport: WebMercatorViewport, container: Object) {
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

  setDeck(deckgl: Object | null) {
    if (deckgl) {
      this.deckgl = deckgl;
    }
  }
}
