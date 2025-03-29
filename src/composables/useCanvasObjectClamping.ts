import type { BasicTransformEvent, Canvas, FabricObject, TPointerEvent } from 'fabric';

export function useCanvasObjectClamping(canvas: Ref<Canvas | null>) {
  const scalingProperties = {
    left: 0,
    top: 0,
    scaleX: 0,
    scaleY: 0,
  };

  function clampScaling(e: BasicTransformEvent<TPointerEvent> & { target: FabricObject }) {
    if (!e.target || !canvas.value)
      return;

    const shape = e.target;
    const maxWidth = canvas.value.getWidth();
    const maxHeight = canvas.value.getHeight();

    // left border
    if (shape.left! < 0) {
      shape.left = scalingProperties.left;
      shape.scaleX = scalingProperties.scaleX;
    }
    else {
      scalingProperties.left = shape.left!;
      scalingProperties.scaleX = shape.scaleX!;
    }

    // right border
    if (scalingProperties.scaleX * shape.width! + shape.left! >= maxWidth) {
      shape.scaleX = (maxWidth - scalingProperties.left) / shape.width!;
    }
    else {
      scalingProperties.scaleX = shape.scaleX!;
    }

    // top border
    if (shape.top! < 0) {
      shape.top = scalingProperties.top;
      shape.scaleY = scalingProperties.scaleY;
    }
    else {
      scalingProperties.top = shape.top!;
      scalingProperties.scaleY = shape.scaleY!;
    }

    // bottom border
    if (scalingProperties.scaleY * shape.height! + shape.top! >= maxHeight) {
      shape.scaleY = (maxHeight - scalingProperties.top) / shape.height!;
    }
    else {
      scalingProperties.scaleY = shape.scaleY!;
    }
  }

  function clampMovementAndRotation(e: BasicTransformEvent<TPointerEvent> & { target: FabricObject }) {
    if (!e.target || !canvas.value)
      return;
    const obj = e.target;
    if (obj.height! > canvas.value.getHeight() || obj.width! > canvas.value.getWidth()) {
      return;
    }
    obj.setCoords();
    // top-left corner
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
      obj.top = Math.max(obj.top!, obj.top! - obj.getBoundingRect().top);
      obj.left = Math.max(obj.left!, obj.left! - obj.getBoundingRect().left);
    }
    // bottom-right corner
    if (
      obj.getBoundingRect().top + obj.getBoundingRect().height > canvas.value.getHeight()
      || obj.getBoundingRect().left + obj.getBoundingRect().width > canvas.value.getWidth()
    ) {
      obj.top = Math.min(
        obj.top!,
        canvas.value.getHeight() - obj.getBoundingRect().height + obj.top! - obj.getBoundingRect().top,
      );
      obj.left = Math.min(
        obj.left!,
        canvas.value.getWidth() - obj.getBoundingRect().width + obj.left! - obj.getBoundingRect().left,
      );
    }
  }

  function attachClampingHandlers() {
    if (!canvas.value)
      return;

    canvas.value.on('object:scaling', clampScaling);
    canvas.value.on('object:moving', clampMovementAndRotation);
    canvas.value.on('object:rotating', clampMovementAndRotation);
  }

  return { attachClampingHandlers };
}
