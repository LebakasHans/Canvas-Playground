<script setup lang="ts">
import { Canvas, Rect } from 'fabric';

const containerRef = useTemplateRef<HTMLDivElement>('container');
const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas');
const canvas = shallowRef<Canvas | null>(null);

const { attachClampingHandlers } = useCanvasObjectClamping(canvas);
useCanvasResize(containerRef, canvas);

onMounted(() => {
  canvas.value = new Canvas(canvasRef.value || undefined);

  const rect = new Rect({
    fill: 'red',
    width: 50,
    height: 50,
    hasControls: true,
  });

  canvas.value.add(rect);

  attachClampingHandlers();
});
</script>

<template>
  <div ref="container" class="bg-black w-full h-full">
    <canvas ref="canvas" />
  </div>
</template>
