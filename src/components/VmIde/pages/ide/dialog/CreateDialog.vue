<template>
  <div>
    <n-card>
      <div class="flex flex-col gap-2">
        <div class="flex flex-row gap-1 items-center">
          <div>父路径:</div>
          <n-tag type="info"> {{ props.parentPath }} </n-tag>
        </div>
        <n-input
          :placeholder="props.placeholder"
          v-model:value="newFileNameValue"
          :status="inputValidationStatus"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTag } from 'naive-ui';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
import { IdeService } from '@/client';

interface Props {
  parentPath: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  parentPath: '/',
  placeholder: '输入文件名'
});

const newFileNameValue = defineModel<string>('newFileNameValue');

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const inputValidationStatus = ref(undefined);

watch(newFileNameValue, () => {
  if (newFileNameValue.value === '') inputValidationStatus.value = 'error';
  else inputValidationStatus.value = undefined;
});
</script>

<style scoped></style>
