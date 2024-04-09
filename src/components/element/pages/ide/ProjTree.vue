<template>
  <ScrollArea class="size-full items-center justify-center">
    <div v-for="tag in Array.from({ length: 50 }, () => 'testtesttesttesttest')" :key="tag">
      <div class="text-sm">
        {{ tag }}
      </div>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
</script>

<style scoped></style>
