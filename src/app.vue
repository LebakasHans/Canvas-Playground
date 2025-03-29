<script setup lang="ts">
import type { FabricObject } from 'fabric';

const activeObject = ref<FabricObject | null>(null);
</script>

<template>
  <div class="flex justify-center items-center bg-gray-100 h-screen w-screen p-8">
    <CanvasEditor class="w-4/5" />
    <ObjectPropertyList class="w-1/5 min-w-[200px]" />
  </div>
</template>
