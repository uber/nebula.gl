// @flow
/* eslint-env browser */

import { CompositeLayer } from 'deck.gl';

// Minimum number of pixels the pointer must move from the original pointer down to be considered dragging
const MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS = 7;

export default class EditableLayer extends CompositeLayer {
  // Overridable interaction event handlers
  onClick({ picks, screenCoords, groundCoords }) {
    // default implementation - do nothing
  }

  onStartDragging({
    picks,
    screenCoords,
    groundCoords,
    dragStartScreenCoords,
    dragStartGroundCoords
  }) {
    // default implementation - do nothing
  }

  onDragging({ picks, screenCoords, groundCoords, dragStartScreenCoords, dragStartGroundCoords }) {
    // default implementation - do nothing
  }

  onStopDragging({
    picks,
    screenCoords,
    groundCoords,
    dragStartScreenCoords,
    dragStartGroundCoords
  }) {
    // default implementation - do nothing
  }

  onPointerMove({ screenCoords, groundCoords, isDragging }) {
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
      }
    });
  }

  finalizeState() {
    this._removePointerHandlers();
  }

  updateState({ props, changeFlags }) {
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
      onPointerDown: this._onPointerDown.bind(this),
      onPointerUp: this._onPointerUp.bind(this)
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

  _onPointerDown(event) {
    const screenCoords = this.getScreenCoords(event);
    const groundCoords = this.getGroundCoords(screenCoords);

    const picks = this.context.layerManager.pickObject({
      x: screenCoords[0],
      y: screenCoords[1],
      mode: 'query',
      layers: [this.props.id],
      radius: 10
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

  _onPointerMove(event) {
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

      // Stop propagation to prevent map panning
      // TODO: find a less hacky way to prevent map panning
      event.stopPropagation();

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

    this.onPointerMove({ screenCoords, groundCoords, isDragging });

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

  _onPointerUp(event) {
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

  getScreenCoords(pointerEvent) {
    return [
      pointerEvent.clientX - this.context.gl.canvas.getBoundingClientRect().x,
      pointerEvent.clientY - this.context.gl.canvas.getBoundingClientRect().y
    ];
  }

  getGroundCoords(screenCoords) {
    return this.context.viewport.unproject([screenCoords[0], screenCoords[1]]);
  }

  movedEnoughForDrag(screenCoords1, screenCoords2) {
    return (
      Math.abs(screenCoords1[0] - screenCoords2[0]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS ||
      Math.abs(screenCoords1[1] - screenCoords2[1]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS
    );
  }
}

EditableLayer.layerName = 'EditableLayer';
