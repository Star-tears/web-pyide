<template>
  <div>
    <n-button size="small" class="rounded-[6px] px-2" @click="debugPyTask" :disabled="!getIsPyFile">
      <template #icon>
        <Icon icon="codicon:debug-alt-small" />
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { useIdeStore } from '@/stores/ide';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { NButton } from 'naive-ui';
import { storeToRefs } from 'pinia';
import DebugPyDialog from '../dialog/DebugPyDialog.vue';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const debugPyDialog = ref<InstanceType<typeof DebugPyDialog>>(null);
const dialog = useDialog();

const getIsPyFile = computed(() => {
  return ideInfo.value.currProj.pathSelected
    ? ideInfo.value.currProj.pathSelected.endsWith('.py') &&
        ideInfo.value.currProj.pathSelected.startsWith('/')
    : false;
});

const debugPyTask = () => {
  const d = dialog.success({
    title: '指定参数',
    content: () =>
      h(DebugPyDialog, {
        filePath: ideInfo.value.currProj.pathSelected as string,
        projName: ideStore.getCurrentProj(),
        ref: debugPyDialog
      }),
    positiveText: '运行',
    onPositiveClick: () => {
      d.loading = true;
      return new Promise((resolve) => {
        debugPyDialog.value
          .submitDebugTask()
          .then((res) => {
            if (res.code == 0) {
              ideStore.toPyTaskView((res.data as any).taskId);
            }
          })
          .then(resolve);
      });
    }
  });
};
</script>

<style scoped></style>
