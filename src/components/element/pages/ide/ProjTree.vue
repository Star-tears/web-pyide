<template>
  <NScrollbar class="size-full items-center justify-center" x-scrollable>
    <div v-for="tags in Array.from({ length: 50 }, () => 'testtesttest')" :key="tags">
      <div class="text-lg">{{ tags }}</div>
    </div>
  </NScrollbar>
</template>

<script setup lang="ts">
import { NScrollbar } from 'naive-ui';
</script>

<style scoped></style>
