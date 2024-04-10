<template>
  <ScrollArea class="size-full items-center justify-center">
    <div v-for="tags in Array.from({ length: 50 }, () => 'testtesttest')" :key="tags">
      <div class="text-lg">{{ tags }}</div>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
</script>

<style scoped></style>
