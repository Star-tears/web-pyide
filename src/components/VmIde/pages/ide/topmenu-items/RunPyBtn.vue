<template>
  <div>
    <n-button size="small" class="rounded-[6px] px-2" @click="runPyTask" :disabled="!getIsPyFile">
      <template #icon>
        <Icon icon="codicon:debug-start" />
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { useIdeStore } from '@/stores/ide';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { NButton } from 'naive-ui';
import { storeToRefs } from 'pinia';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);

const getIsPyFile = computed(() => {
  return ideInfo.value.currProj.pathSelected
    ? ideInfo.value.currProj.pathSelected.endsWith('.py')
    : false;
});

const runPyTask = () => {
  ideStore.runPyTask();
};
</script>

<style scoped></style>
