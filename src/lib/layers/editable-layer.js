// @flow
/* eslint-env browser */

import window from 'global/window';
import { CompositeLayer } from 'deck.gl';

// Minimum number of pixels the pointer must move from the original pointer down to be considered dragging
const MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS = 7;

// To detect the double-click event, pointer events will have delay
const POINTER_EVENT_DELAY = 450;

export default class EditableLayer extends CompositeLayer {
  // Overridable interaction event handlers
  onClick({ picks, screenCoords, groundCoords }: Object) {
    // default implementation - do nothing
  }
  onDoubleClick({ groundCoords }: Object) {
    // default implementation - do nothing
  }

  onStartDragging({
    picks,
    screenCoords,
    groundCoords,
    dragStartScreenCoords,
    dragStartGroundCoords
  }: Object) {
    // default implementation - do nothing
  }

  onDragging({
    picks,
    screenCoords,
    groundCoords,
    dragStartScreenCoords,
    dragStartGroundCoords
  }: Object) {
    // default implementation - do nothing
  }

  onStopDragging({
    picks,
    screenCoords,
    groundCoords,
    dragStartScreenCoords,
    dragStartGroundCoords
  }: Object) {
    // default implementation - do nothing
  }

  onPointerMove({ screenCoords, groundCoords, isDragging, sourceEvent }: Object) {
    // default implementation - do nothing
  }

  // TODO: implement onCancelDragging (e.g. drag off screen)

  initializeState() {
    this.setState({
      _editableLayerState: {
        // Pointer event handlers
        pointerHandlers: null,
        // Picked objects at the time the pointer went down
        pointerDownPicks: null,
        // Screen coordinates where the pointer went down
        pointerDownScreenCoords: null,
        // Ground coordinates where the pointer went down
        pointerDownGroundCoords: null,
        // Is the pointer dragging (pointer down + moved at least MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS)
        isDragging: false
      },
      pointerUpCounter: 0,
      pointerUpTimer: null,
      pointerDownCounter: 0,
      pointerDownTimer: null
    });
  }

  finalizeState() {
    this._removePointerHandlers();
  }

  updateState({ props, changeFlags }: Object) {
    // unsubscribe previous layer instance's handlers
    this._removePointerHandlers();
    this._addPointerHandlers();
  }

  _removePointerHandlers() {
    if (this.state._editableLayerState.pointerHandlers) {
      this.context.gl.canvas.removeEventListener(
        'pointermove',
        this.state._editableLayerState.pointerHandlers.onPointerMove
      );
      this.context.gl.canvas.removeEventListener(
        'pointerdown',
        this.state._editableLayerState.pointerHandlers.onPointerDown
      );
      this.context.gl.canvas.removeEventListener(
        'pointerup',
        this.state._editableLayerState.pointerHandlers.onPointerUp
      );
    }
    this.state._editableLayerState.pointerHandlers = null;
  }

  _addPointerHandlers() {
    this.state._editableLayerState.pointerHandlers = {
      onPointerMove: this._onPointerMove.bind(this),
      onPointerDown: this._onDelayedPointerDown.bind(this),
      onPointerUp: this._onDelayedPointerUp.bind(this)
    };

    this.context.gl.canvas.addEventListener(
      'pointermove',
      this.state._editableLayerState.pointerHandlers.onPointerMove
    );
    this.context.gl.canvas.addEventListener(
      'pointerdown',
      this.state._editableLayerState.pointerHandlers.onPointerDown
    );
    this.context.gl.canvas.addEventListener(
      'pointerup',
      this.state._editableLayerState.pointerHandlers.onPointerUp
    );
  }

  _onDoubleClick(event: Object) {
    const screenCoords = this.getScreenCoords(event);
    const groundCoords = this.getGroundCoords(screenCoords);
    this.onDoubleClick({
      groundCoords
    });
  }

  _onDelayedPointerDown(event: Object) {
    this.setState({ pointerDownCounter: this.state.pointerDownCounter + 1 });
    const pointerDownTimer = window.setTimeout(
      function _temp() {
        if (this.state.pointerDownCounter > 1) {
          this._onDoubleClick(event);
          window.clearTimeout(this.state.pointerDownTimer);
        } else {
          this._onPointerDown(event);
        }
        this.setState({ pointerDownCounter: 0 });
      }.bind(this),
      POINTER_EVENT_DELAY
    );
    this.setState({ pointerDownTimer });
  }

  _onPointerDown(event: Object) {
    const screenCoords = this.getScreenCoords(event);
    const groundCoords = this.getGroundCoords(screenCoords);

    const picks = this.context.layerManager.pickObject({
      x: screenCoords[0],
      y: screenCoords[1],
      mode: 'query',
      layers: [this.props.id],
      radius: 10,
      viewports: [this.context.viewport]
    });

    this.setState({
      _editableLayerState: {
        ...this.state._editableLayerState,
        pointerDownScreenCoords: screenCoords,
        pointerDownGroundCoords: groundCoords,
        pointerDownPicks: picks,
        isDragging: false
      }
    });
  }

  _onPointerMove(event: Object) {
    const screenCoords = this.getScreenCoords(event);
    const groundCoords = this.getGroundCoords(screenCoords);

    const {
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownGroundCoords
    } = this.state._editableLayerState;

    let { isDragging } = this.state._editableLayerState;

    if (pointerDownPicks && pointerDownPicks.length > 0) {
      // Pointer went down on something and is moving

      // Did it move enough to consider it a drag
      if (!isDragging && this.movedEnoughForDrag(pointerDownScreenCoords, screenCoords)) {
        // OK, this is considered dragging

        // Fire the start dragging event
        this.onStartDragging({
          picks: pointerDownPicks,
          screenCoords,
          groundCoords,
          dragStartScreenCoords: pointerDownScreenCoords,
          dragStartGroundCoords: pointerDownGroundCoords
        });

        isDragging = true;
        this.setState({
          _editableLayerState: {
            ...this.state._editableLayerState,
            isDragging
          }
        });
      }
    }

    this.onPointerMove({
      screenCoords,
      groundCoords,
      isDragging,
      pointerDownPicks,
      sourceEvent: event
    });

    if (isDragging) {
      this.onDragging({
        picks: pointerDownPicks,
        screenCoords,
        groundCoords,
        dragStartScreenCoords: pointerDownScreenCoords,
        dragStartGroundCoords: pointerDownGroundCoords
      });
    }
  }

  _onDelayedPointerUp(event: Object) {
    this.setState({ pointerUpCounter: this.state.pointerUpCounter + 1 });
    const pointerUpTimer = window.setTimeout(
      function _temp() {
        if (this.state.pointerUpCounter > 1) {
          window.clearTimeout(this.state.pointerUpTimer);
          // do nothing here, as double-click handled in pointer down events
        } else {
          this._onPointerUp(event);
        }
        this.setState({ pointerUpCounter: 0 });
      }.bind(this),
      POINTER_EVENT_DELAY
    );
    this.setState({ pointerUpTimer });
  }

  _onPointerUp(event: Object) {
    const screenCoords = this.getScreenCoords(event);
    const groundCoords = this.getGroundCoords(screenCoords);

    const {
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownGroundCoords,
      isDragging
    } = this.state._editableLayerState;

    if (!pointerDownScreenCoords) {
      // This is a pointer up without a pointer down (e.g. user pointer downed elsewhere), so ignore
      return;
    }

    if (isDragging) {
      this.onStopDragging({
        picks: pointerDownPicks,
        screenCoords,
        groundCoords,
        dragStartScreenCoords: pointerDownScreenCoords,
        dragStartGroundCoords: pointerDownGroundCoords
      });
    } else if (!this.movedEnoughForDrag(pointerDownScreenCoords, screenCoords)) {
      this.onClick({
        picks: pointerDownPicks,
        screenCoords,
        groundCoords
      });
    }

    this.setState({
      _editableLayerState: {
        ...this.state._editableLayerState,
        pointerDownScreenCoords: null,
        pointerDownGroundCoords: null,
        pointerDownPicks: null,
        isDragging: false
      }
    });
  }

  getScreenCoords(pointerEvent: Object) {
    return [
      pointerEvent.clientX - this.context.gl.canvas.getBoundingClientRect().x,
      pointerEvent.clientY - this.context.gl.canvas.getBoundingClientRect().y
    ];
  }

  getGroundCoords(screenCoords: number[]) {
    return this.context.viewport.unproject([screenCoords[0], screenCoords[1]]);
  }

  movedEnoughForDrag(screenCoords1: number[], screenCoords2: number[]) {
    return (
      Math.abs(screenCoords1[0] - screenCoords2[0]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS ||
      Math.abs(screenCoords1[1] - screenCoords2[1]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS
    );
  }
}

EditableLayer.layerName = 'EditableLayer';
