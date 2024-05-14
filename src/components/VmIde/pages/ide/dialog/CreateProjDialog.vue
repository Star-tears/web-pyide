<template>
  <div>
    <n-card>
      <div class="flex flex-col gap-2">
        <div>新工作区名:</div>
        <n-input
          placeholder="输入新工作区名"
          v-model:value="newProjNameValue"
          :status="inputValidationStatus"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NInput } from 'naive-ui';

const newProjNameValue = defineModel<string>('newProjNameValue');

const inputValidationStatus = ref(undefined);

watch(newProjNameValue, () => {
  if (newProjNameValue.value === '') inputValidationStatus.value = 'error';
  else inputValidationStatus.value = undefined;
});
</script>

<style scoped></style>
