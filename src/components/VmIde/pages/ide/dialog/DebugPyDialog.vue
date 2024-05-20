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
          <n-select v-model:value="argValue" :options="options" :render-label="renderLabel" />
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IdeService } from '@/client';
import { useIdeStore } from '@/stores/ide';
import { getFileIcon } from '@/utils';
import { NIcon, type SelectOption } from 'naive-ui';
import { storeToRefs } from 'pinia';
import type { VNodeChild } from 'vue';

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

const renderLabel = (option: SelectOption): VNodeChild => {
  return [
    h(
      NIcon,
      {
        style: {
          verticalAlign: '-0.15em',
          marginRight: '4px'
        }
      },
      {
        default: () => getFileIcon(option.label as string)
      }
    ),
    option.label as string
  ];
};

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
