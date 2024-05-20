<template>
  <div>
    <div class="flex flex-col gap-2">
      <div class="flex flex-row items-center gap-1">
        <div>主程序:</div>
        <n-tag type="info"> {{ props.filePath }} </n-tag>
      </div>
      <n-select v-model:value="value" :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);

interface Props {
  filePath: string;
  projName: string;
}

const value = ref(null);
const options = ref(null);

const props = withDefaults(defineProps<Props>(), {
  filePath: '/main.py'
});

onMounted(() => {
  const filePathList = ideStore.getFilePathList([props.filePath]);
  options.value = filePathList;
  console.log(filePathList);
});

const submitDebugTask = async () => {};

defineExpose({
  submitDebugTask
});
</script>

<style scoped></style>
