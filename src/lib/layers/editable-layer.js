// @flow
/* eslint-env browser */

import { CompositeLayer } from 'deck.gl';

// Minimum number of pixels the pointer must move from the original pointer down to be considered dragging
const MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS = 7;

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

  onPointerMove({ screenCoords, groundCoords, isDragging, sourceEvent, keyHolded }: Object) {
    // default implementation - do nothing
  }

  // TODO: implement onCancelDragging (e.g. drag off screen)

  initializeState() {
    this.setState({
      _editableLayerState: {
        // Key press event handlers
        keyHandlers: null,
        keyHolded: '',
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
    this._removeKeyHandlers();
  }

  updateState({ props, changeFlags }: Object) {
    // unsubscribe previous layer instance's handlers
    this._removePointerHandlers();
    this._addPointerHandlers();
    this._removeKeyHandlers();
    this._addKeyHandlers();
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
      this.context.gl.canvas.removeEventListener(
        'dblclick',
        this.state._editableLayerState.pointerHandlers.onDoubleClick
      );
    }
    this.state._editableLayerState.pointerHandlers = null;
  }

  _removeKeyHandlers() {
    if (this.state._editableLayerState.keyHandlers) {
      this.context.gl.canvas.removeEventListener(
        'keydown',
        this.state._editableLayerState.keyHandlers.onKeydown
      );
      this.context.gl.canvas.removeEventListener(
        'keyup',
        this.state._editableLayerState.keyHandlers.onKeyup
      );
    }
    this.state._editableLayerState.keyHandlers = null;
  }

  _addPointerHandlers() {
    this.state._editableLayerState.pointerHandlers = {
      onPointerMove: this._onPointerMove.bind(this),
      onPointerDown: this._onPointerDown.bind(this),
      onPointerUp: this._onPointerUp.bind(this),
      onDoubleClick: this._onDoubleClick.bind(this)
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
    this.context.gl.canvas.addEventListener(
      'dblclick',
      this.state._editableLayerState.pointerHandlers.onDoubleClick
    );
  }

  _addKeyHandlers() {
    this.state._editableLayerState.keyHandlers = {
      onKeyDown: this._onKeyDown.bind(this),
      onKeyUp: this._onKeyUp.bind(this)
    };

    this.context.gl.canvas.addEventListener(
      'keydown',
      this.state._editableLayerState.keyHandlers.onKeyDown
    );
    this.context.gl.canvas.addEventListener(
      'keyup',
      this.state._editableLayerState.keyHandlers.onKeyUp
    );
  }

  _onKeyDown(event: Object) {
    this.setState({
      _editableLayerState: {
        ...this.state._editableLayerState,
        keyHolded: event.key
      }
    });
  }

  _onKeyUp(event: Object) {
    this.setState({
      _editableLayerState: {
        ...this.state._editableLayerState,
        keyHolded: ''
      }
    });
  }

  _onDoubleClick(event: Object) {
    const screenCoords = this.getScreenCoords(event);
    const groundCoords = this.getGroundCoords(screenCoords);
    this.onDoubleClick({
      groundCoords
    });
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
    const { keyHolded } = this.state._editableLayerState;

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
      sourceEvent: event,
      keyHolded
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
