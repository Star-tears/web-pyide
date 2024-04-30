<template>
  <div>
    <n-input
      v-if="isRenameState"
      placeholder="输入文件名"
      :default-value="fileName"
      v-model:value="newFileName"
      :status="inputValidationStatus"
      autosize
      style="min-width: 100px; max-width: 150px"
      v-on-click-outside="onClickOutside"
      @keyup.enter="handleEnterKey"
    />

    <ContextMenu v-else>
      <ContextMenuTrigger @dblclick="startRename">{{ fileName }}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem @click="startRename">重命名</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </div>
</template>

<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { vOnClickOutside } from '@vueuse/components';

const fileName = ref('file name');
const isRenameState = ref(false);
const newFileName = ref('');

const inputValidationStatus = ref(undefined);

const handleRenameState = (v: boolean) => {
  isRenameState.value = v;
};

const startRename = () => {
  newFileName.value = fileName.value;
  handleRenameState(true);
};

const onClickOutside = () => {
  handleRenameState(false);
};

const handleEnterKey = () => {
  if (newFileName.value !== '') {
    fileName.value = newFileName.value;
    handleRenameState(false);
  }
};
watch(newFileName, () => {
  if (newFileName.value === '') inputValidationStatus.value = 'error';
  else inputValidationStatus.value = undefined;
});
</script>

<style scoped></style>
