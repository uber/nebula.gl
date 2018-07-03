// @flow
/* eslint-env browser */

import { CompositeLayer } from 'deck.gl';

// Minimum number of pixels the pointer must move from the original pointer down to be considered dragging
// const MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS = 7;

export default class EditableLayer extends CompositeLayer {
  onClick({ picks, screenCoords, groundCoords }) {
    // default implementation - do nothing
  }

  onStartDragging({ picks, screenCoords, groundCoords }) {
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

  // TODO: implement onCancelDragging (e.g. drag off screen)

  initializeState() {
    this.state = {
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
        dragging: false
      }
    };
  }

  finalizeState() {
    this.removePointerHandlers();
  }

  updateState({ props, changeFlags }) {
    // unsubscribe previous layer instance's handlers
    this.removePointerHandlers();
    this.addPointerHandlers();
  }

  removePointerHandlers() {
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

  addPointerHandlers() {
    this.state._editableLayerState.pointerHandlers = {
      onPointerMove: this.onPointerMove.bind(this),
      onPointerDown: this.onPointerDown.bind(this),
      onPointerUp: this.onPointerUp.bind(this)
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

  //
  //
  //
  //
  //
  //
  //
  //
  //

  onPointerDown(event) {
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
        dragging: false
      }
    });
  }

  onPointerMove(event) {
    // const screenCoords = this.getScreenCoords(event);
    // const groundCoords = this.context.viewport.unproject([pointerCoords.x, pointerCoords.y]);
    // if (this.props.mode === 'extendLineString' && this.state.extensionLineString) {
    //   this.setState({
    //     extensionLineString: {
    //       ...this.state.extensionLineString,
    //       geometry: {
    //         ...this.state.extensionLineString.geometry,
    //         coordinates: [this.state.extensionLineString.geometry.coordinates[0], [...position]]
    //       }
    //     }
    //   });
    //   // TODO: figure out how to properly update state from a pointer event handler
    //   this.setLayerNeedsUpdate();
    //   // if (this.state.extensionsLineStringLayer) {
    //   //   this.state.extensionsLineStringLayer.setNeedsRedraw();
    //   // }
    //   // this.setNeedsRedraw('update from pointer event');
    //   // this.context.layerManager.setNeedsUpdate('update from pointer event');
    // }
    // if (!this.state.pointerDownEditHandle) {
    //   // TODO: only subscribe to pointermove once the pointer goes down (at which point we can remove this check)
    //   return;
    // }
    // // stop propagation to prevent map panning
    // event.stopPropagation();
    // if (!this.state.draggingEditHandle) {
    //   // pointer is moving, but is it moving enough?
    //   if (
    //     Math.abs(this.state.pointerDownCoords.x - pointerCoords.x) >
    //       MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS ||
    //     Math.abs(this.state.pointerDownCoords.y - pointerCoords.y) >
    //       MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS
    //   ) {
    //     this.state.draggingEditHandle = this.state.pointerDownEditHandle;
    //     // Fire the start dragging event
    //     this.props.onStartDraggingPosition({
    //       featureIndex: this.props.selectedFeatureIndex,
    //       positionIndexes: this.state.draggingEditHandle.positionIndexes
    //     });
    //   } else {
    //     // pointer barely moved, so nothing else to do
    //     return;
    //   }
    // }
    // const { positionIndexes } = this.state.draggingEditHandle;
    // const { selectedFeatureIndex } = this.props;
    // const updatedData = this.state.editableFeatureCollection
    //   .replacePosition(selectedFeatureIndex, positionIndexes, position)
    //   .getObject();
    // this.props.onEdit({
    //   updatedData,
    //   updatedMode: 'edit',
    //   editType: 'movePosition',
    //   featureIndex: selectedFeatureIndex,
    //   positionIndexes,
    //   position
    // });
  }

  onPointerUp(event) {
    // if (this.state.draggingEditHandle) {
    //   this.props.onStopDraggingPosition({
    //     featureIndex: this.props.selectedFeatureIndex,
    //     positionIndexes: this.state.draggingEditHandle.positionIndexes
    //   });
    // } else if (this.state.pointerDownCoords) {
    //   // They didn't drag, so consider it a click
    //   this.onClick(event);
    // }
    // this.setState({
    //   draggingEditHandle: null,
    //   pointerDownEditHandle: null,
    //   pointerDownCoords: null
    // });
  }

  getScreenCoords(pointerEvent) {
    return {
      x: pointerEvent.clientX - this.context.gl.canvas.getBoundingClientRect().x,
      y: pointerEvent.clientY - this.context.gl.canvas.getBoundingClientRect().y
    };
  }

  getGroundCoords(screenCoords) {
    return this.context.viewport.unproject([screenCoords.x, screenCoords.y]);
  }
}

EditableLayer.layerName = 'EditableLayer';
