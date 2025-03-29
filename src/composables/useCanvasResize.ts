import type { Canvas, FabricObject } from 'fabric';
import { useResizeObserver } from '@vueuse/core';

export function useCanvasResize(containerRef: Ref<HTMLDivElement | null>, canvas: Ref<Canvas | null>) {
  useResizeObserver(containerRef, (entries) => {
    const entry = entries[0];
    if (canvas.value) {
      const oldWidth = canvas.value.getWidth();
      const oldHeight = canvas.value.getHeight();
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;

      canvas.value.setDimensions({
        width: newWidth,
        height: newHeight,
      });

      if (newWidth < oldWidth || newHeight < oldHeight) {
        const objects = canvas.value.getObjects();
        if (objects.length > 0) {
          objects.forEach((obj: FabricObject) => {
            const objBounds = obj.getBoundingRect();
            if (objBounds.left + objBounds.width > newWidth) {
              obj.set({ left: Math.max(0, newWidth - objBounds.width) });
            }
            if (objBounds.top + objBounds.height > newHeight) {
              obj.set({ top: Math.max(0, newHeight - objBounds.height) });
            }
            obj.setCoords();
          });

          canvas.value.renderAll();
        }
      }
    }
  });
}
