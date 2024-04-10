<template>
  <div>
    <NSplit direction="vertical" :default-size="0.75">
      <template #1>
        <NSplit direction="horizontal">
          <template #1> <ProjTree /> </template>
          <template #2> Pane 4 </template>
        </NSplit>
      </template>
      <template #2> Pane 2 </template>
    </NSplit>
  </div>
</template>

<script setup lang="ts">
import ProjTree from '@/components/element/pages/ide/ProjTree.vue';
import { NSplit } from 'naive-ui';
</script>

<style scoped></style>
