<template>
  <div>
    <TopMenuItemBase label="文件(F)">
      <DropdownMenuItem
        :disabled="ideInfo.nodeSelected === null || ideInfo.nodeSelected.type !== 'dir'"
        @click="createFile"
      >
        新建文件
      </DropdownMenuItem>
      <DropdownMenuItem
        :disabled="ideInfo.nodeSelected === null || ideInfo.nodeSelected.type !== 'dir'"
      >
        新建文件夹
      </DropdownMenuItem>
      <DropdownMenuItem :disabled="ideInfo.nodeSelected === null">命名</DropdownMenuItem>
      <DropdownMenuItem
        :disabled="ideInfo.nodeSelected === null || ideInfo.nodeSelected.path === '/'"
      >
        删除文件
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="openProjsDialog">切换工作区</DropdownMenuItem>
    </TopMenuItemBase>
  </div>
</template>

<script setup lang="ts">
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
import { useDialog } from 'naive-ui';
import ProjsDialog from '@/components/VmIde/pages/ide/dialog/ProjsDialog.vue';
const dialog = useDialog();

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const createFile = () => {
  dialog.info({
    title: '选择项目',
    content: () => h(ProjsDialog, null),
    positiveText: '确认',
    style: {
      width: '70%',
      maxWidth: '700px'
    },
    onPositiveClick: () => {}
  });
};

const openProjsDialog = () => {
  dialog.info({
    title: '选择项目',
    content: () => h(ProjsDialog, null),
    positiveText: '确认',
    style: {
      width: '70%',
      maxWidth: '700px'
    },
    onPositiveClick: () => {}
  });
};
</script>

<style scoped></style>
