import type { BasicTransformEvent, Canvas, FabricObject, TPointerEvent } from 'fabric';
import type { ShallowRef } from 'vue';

export function useCanvasObjectClamping(canvas: ShallowRef<Canvas | null>) {

  function clampObject(obj: FabricObject) {
    if (!canvas.value)
      return;
    
    const canvasWidth = canvas.value.getWidth();
    const canvasHeight = canvas.value.getHeight();
    
    // Update coordinates based on current state
    obj.setCoords();
    
    // Get the bounding rect which accounts for rotation
    const boundingRect = obj.getBoundingRect();
    
    let adjusted = false;
    let adjustedTop = obj.top!;
    let adjustedLeft = obj.left!;
    
    // Adjust top position if needed
    if (boundingRect.top < 0) {
      adjustedTop += Math.abs(boundingRect.top);
      adjusted = true;
    } else if (boundingRect.top + boundingRect.height > canvasHeight) {
      adjustedTop -= (boundingRect.top + boundingRect.height) - canvasHeight;
      adjusted = true;
    }
    
    // Adjust left position if needed
    if (boundingRect.left < 0) {
      adjustedLeft += Math.abs(boundingRect.left);
      adjusted = true;
    } else if (boundingRect.left + boundingRect.width > canvasWidth) {
      adjustedLeft -= (boundingRect.left + boundingRect.width) - canvasWidth;
      adjusted = true;
    }
    
    // Apply adjustments if needed
    if (adjusted) {
      obj.set({
        top: adjustedTop,
        left: adjustedLeft
      });
      obj.setCoords();
    }
  }

  function handleTransform(e: CanvasObjectClampEvent) {
    if (!e.target || !canvas.value)
      return;
  
    //TODO: If the object is to large to fit in the canvas, we should scale it to its previous size
    clampObject(e.target);
  }
  
  function attachClampingHandlers() {
    if (!canvas.value)
      return;
  
    canvas.value.on('object:scaling', handleTransform);
    canvas.value.on('object:moving', handleTransform);
    canvas.value.on('object:rotating', handleTransform);
  }

  return { attachClampingHandlers };
}

type CanvasObjectClampEvent = BasicTransformEvent<TPointerEvent> & { target: FabricObject };