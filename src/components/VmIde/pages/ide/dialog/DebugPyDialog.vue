<template>
  <div>
    <div class="flex flex-col gap-2">
      <div class="flex flex-row items-center gap-1">
        <div>主程序:</div>
        <n-tag type="info"> {{ props.filePath }} </n-tag>
      </div>
      <n-card>
        <div class="flex flex-col gap-2">
          <n-input v-model:value="argOpt" type="text" placeholder="--example" />
          <n-input v-model:value="argValue" type="text" placeholder="hello" />
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IdeService } from '@/client';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);

interface Props {
  filePath: string;
  projName: string;
}

const argOpt = ref(null);
const argValue = ref(null);
const options = ref(null);

const props = withDefaults(defineProps<Props>(), {
  filePath: '/main.py'
});

onMounted(() => {
  const filePathList = ideStore.getFilePathList([props.filePath]);
  options.value = filePathList;
});

const submitDebugTask = async () => {
  const res = await IdeService.ideDebugPythonProgram({
    requestBody: {
      projectName: props.projName,
      filePath: props.filePath,
      options: [argOpt.value ? argOpt.value : '', argValue.value ? argValue.value : '']
    }
  });
  return res;
};

defineExpose({
  submitDebugTask
});
</script>

<style scoped></style>
