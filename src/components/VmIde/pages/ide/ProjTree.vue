<template>
  <NScrollbar class="size-full items-center justify-center" x-scrollable>
    <NTree
      show-line
      block-line
      expand-on-click
      v-model:expanded-keys="expendKeys"
      :data="[tree_data]"
      :render-prefix="renderPrefix"
      :selected-keys="selectKeys"
      :on-update:selected-keys="updateSelectKeys"
      :render-label="renderLabel"
    />
  </NScrollbar>
</template>

<script setup lang="ts">
import { computed, h, onMounted } from 'vue';
import { NScrollbar, NIcon, NTree } from 'naive-ui';
import type { TreeOption } from 'naive-ui';
import { FileTrayFullOutline } from '@vicons/ionicons5';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
import { getFileIcon, getFolderIcon } from '@/utils';
import type { Key } from 'naive-ui/es/tree/src/interface';
import { IdeService } from '@/client';
import LabelItem from '@/components/VmIde/components/LabelItem.vue';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const tree_data = computed(() => ideInfo.value.currProj.data);
// const expandKeys = ref<Key[]>(['文件夹']);
const selectKeys = computed(() => ideInfo.value.selectKeys);

const emit = defineEmits<{
  (e: 'get-item', path: string): void;
}>();

const expendKeys = computed({
  get: () => ideInfo.value.currProj.expandedKeys,
  set: (value: Key[]) => {
    ideInfo.value.currProj.expandedKeys = value;
    ideStore.ide_save_project();
  }
});

const updateSelectKeys = (
  keys: Array<string | number>,
  option: Array<TreeOption | null>,
  meta: { node: TreeOption | null; action: 'select' | 'unselect' }
) => {
  ideStore.setCurrentKey(keys[0] as string);
  if (option && option.length > 0 && option[0].type === 'file')
    emit('get-item', option[0].path as string);
};
const renderPrefix = ({
  option,
  checked,
  selected
}: {
  option: TreeOption;
  checked: boolean;
  selected: boolean;
}) => {
  if (option.type === 'file') return getFileIcon(option.label);
  if (option.type === 'dir') return getFolderIcon(option.label);
  return h(NIcon, null, {
    default: () => h(FileTrayFullOutline)
  });
};

const renderLabel = (info: { option: TreeOption; checked: boolean; selected: boolean }) => {
  return h(
    LabelItem,
    {
      label: info.option.label,
      'onNew-name': (newName) => {
        ideStore.setNodeSelected(info.option);
        if (info.option.type === 'dir' && info.option.path === '/') {
          renameProject(newName, info.option.label);
        } else if (info.option.type === 'dir') {
          renameFolder(newName, info.option.path as string, ideStore.getCurrentProj());
        } else if (info.option.type === 'file') {
          renameFile(newName, info.option.path as string, ideStore.getCurrentProj());
        }
        // console.log(ideInfo.value);
      }
    },
    null
  );
};

onMounted(() => {
  setTimeout(() => {
    ideStore.setCurrentKey('/');
    if (ideStore.getCurrentNode() !== null) {
      ideStore.setNodeSelected(ideStore.getCurrentNode());
    }
    setTimeout(() => {
      if (ideInfo.value.currProj.pathSelected !== null) {
        ideStore.setCurrentKey(ideInfo.value.currProj.pathSelected);
        if (ideStore.getCurrentNode() !== null) {
          ideStore.setNodeSelected(ideStore.getCurrentNode());
        }
      }
    }, 200);
  }, 300);
});

const renameProject = (newName: string, oldName: string) => {
  IdeService.ideIdeRenameProject({
    requestBody: {
      oldName: oldName,
      newName: newName
    }
  }).then((res) => {
    if (res.code == 0) {
      ideStore.handleRename(newName);
      ideStore.ide_save_project();
    }
  });
};
const renameFile = (newName: string, oldPath: string, projectName: string) => {
  IdeService.ideIdeRenameFile({
    requestBody: {
      newName: newName,
      projectName: projectName,
      oldPath: oldPath
    }
  }).then((res) => {
    if (res.code == 0) {
      ideStore.handleRename(newName);
      ideStore.ide_save_project();
    }
  });
};
const renameFolder = (newName: string, oldPath: string, projectName: string) => {
  IdeService.ideIdeRenameFolder({
    requestBody: {
      newName: newName,
      projectName: projectName,
      oldPath: oldPath
    }
  }).then((res) => {
    if (res.code == 0) {
      ideStore.handleRename(newName);
      ideStore.ide_save_project();
    }
  });
};
</script>

<style scoped></style>
