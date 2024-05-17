<template>
  <div class="relative size-full">
    <NButton
      size="small"
      class="absolute right-2 top-2 z-50 px-2"
      :render-icon="renderMinIcon"
      @click="onMinBtnClick"
    />
    <PyConsoleContainer :class="{ hidden: ideInfo.edgeContainerValue !== 'py-console' }" />
    <TerminalContainer :class="{ hidden: ideInfo.edgeContainerValue !== 'terminal' }" />
    <MonitorContainer v-if="ideInfo.edgeContainerValue === 'monitor'" />
    <PkgManagerContainer v-if="ideInfo.edgeContainerValue === 'pkg-manager'" />
  </div>
</template>

<script setup lang="ts">
import TerminalContainer from '@/components/VmIde/pages/ide/edge-container/TerminalContainer.vue';
import { NButton, NIcon } from 'naive-ui';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
import { RemoveOutline } from '@vicons/ionicons5';
import PyConsoleContainer from './edge-container/PyConsoleContainer.vue';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const renderMinIcon = () => {
  return h(NIcon, null, {
    default: () => h(RemoveOutline)
  });
};
const onMinBtnClick = () => {
  ideInfo.value.edgeContainerValue = '';
};
</script>

<style scoped></style>
<style>
.xterm .xterm-viewport {
  overflow-y: auto;
}

.xterm-viewport::-webkit-scrollbar {
  background-color: #2f2f2f;
  width: 10px;
}

.xterm-viewport::-webkit-scrollbar-thumb {
  background: #545a5e;
}

.xterm-viewport::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  background: #2f2f2f;
}
</style>
