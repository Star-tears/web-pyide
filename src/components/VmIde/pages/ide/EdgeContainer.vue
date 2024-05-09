<template>
  <div class="relative size-full">
    <NButton size="small" class="absolute z-50 right-2 top-2 px-2" :render-icon="renderMinIcon"
      @click="onMinBtnClick" />
    <TerminalContainer :class="{ hidden: ideInfo.edgeContainerValue !== 'console' }" />
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
