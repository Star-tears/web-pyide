<template>
  <div class="size-full">
    <TerminalContainer v-if="ideInfo.edgeContainerValue === 'console'" />
    <MonitorContainer v-if="ideInfo.edgeContainerValue === 'monitor'" />
    <PkgManagerContainer v-if="ideInfo.edgeContainerValue === 'pkg-manager'" />
  </div>
</template>

<script setup lang="ts">
import TerminalContainer from '@/components/element/pages/ide/edge-container/TerminalContainer.vue';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
</script>

<style scoped></style>
