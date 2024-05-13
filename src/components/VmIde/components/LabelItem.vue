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
        <ContextMenuItem v-if="isDir" @click="createfile">新建文件</ContextMenuItem>
        <ContextMenuItem v-if="isDir" @click="createFolder">新建文件夹</ContextMenuItem>
        <ContextMenuItem @click="deleteFile">删除</ContextMenuItem>
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

interface Props {
  label?: string;
  isDir?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'file name',
  isDir: false
});

const emit = defineEmits<{
  (e: 'new-name', newName: string): void;
  (e: 'create-file'): void;
  (e: 'create-folder'): void;
  (e: 'delete-file'): void;
}>();

const fileName = ref(props.label);
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
    emit('new-name', newFileName.value);
  }
};

watch(newFileName, () => {
  if (newFileName.value === '') inputValidationStatus.value = 'error';
  else inputValidationStatus.value = undefined;
});

const createfile = () => {
  emit('create-file');
};
const createFolder = () => {
  emit('create-folder');
};

const deleteFile = () => {
  emit('delete-file');
};
</script>

<style scoped></style>
