<template>
  <div>
    <NSplit direction="vertical" :default-size="0.75">
      <template #1>
        <NSplit direction="horizontal" :default-size="0.2">
          <template #1> <ProjTree /> </template>
          <template #2> <CodeTabs /> <IdeEditor /> </template>
        </NSplit>
      </template>
      <template #2> Pane 2 </template>
    </NSplit>
  </div>
</template>

<script setup lang="ts">
import ProjTree from '@/components/element/pages/ide/ProjTree.vue';
import { NSplit } from 'naive-ui';
import IdeEditor from '@/components/element/pages/ide/IdeEditor.vue';
import CodeTabs from '@/components/element/pages/ide/CodeTabs.vue';
</script>

<style scoped></style>
