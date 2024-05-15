<template>
  <NScrollbar class="size-full items-center justify-center" x-scrollable>
    <NTree
      show-line
      block-line
      expand-on-click
      :expanded-keys="expendKeys"
      :data="tree_data"
      :render-prefix="renderPrefix"
      :selected-keys="selectKeys"
      :on-update:selected-keys="updateSelectKeys"
      :on-update-expanded-keys="updateExpandedKeys"
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
import CreateDialog from './dialog/CreateDialog.vue';
import path from 'path-browserify';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const tree_data = computed(() => {
  return [ideInfo.value.currProj.data];
});
// const expandKeys = ref<Key[]>(['文件夹']);
const selectKeys = computed(() => ideInfo.value.selectKeys);
const createNewFileName = ref('');
const dialog = useDialog();
const message = useMessage();
const emit = defineEmits<{
  (e: 'get-item', path: string): void;
}>();

const expendKeys = computed(() => ideInfo.value.currProj.expandedKeys);
const updateExpandedKeys = (
  keys: Array<string | number>,
  option: Array<TreeOption | null>,
  meta: { node: TreeOption | null; action: 'expand' | 'collapse' | 'filter' }
) => {
  ideInfo.value.currProj.expandedKeys = keys;
  ideStore.ide_save_project();
};
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
      label: info.option.name as string,
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
      },
      isDir: info.option.type === 'dir',
      'onCreate-file': () => {
        ideStore.setNodeSelected(info.option);
        createNewFileName.value = '';
        const d = dialog.success({
          title: '新建文件',
          content: () =>
            h(CreateDialog, {
              parentPath: info.option.path as string,
              placeholder: '输入文件名',
              newFileNameValue: createNewFileName.value,
              'onUpdate:newFileNameValue': (v) => (createNewFileName.value = v)
            }),
          positiveText: '确认创建',
          onPositiveClick: () => {
            d.loading = true;
            return new Promise((resolve) => {
              if (createNewFileName.value === '') {
                message.error('文件名不能为空');
                setTimeout(resolve, 10);
              } else {
                createFile(
                  createNewFileName.value,
                  info.option.path as string,
                  ideStore.getCurrentProj()
                ).then(resolve);
              }
            });
          }
        });
      },
      'onCreate-folder': () => {
        ideStore.setNodeSelected(info.option);
        createNewFileName.value = '';
        const d = dialog.success({
          title: '新建文件夹',
          content: () =>
            h(CreateDialog, {
              parentPath: info.option.path as string,
              placeholder: '输入文件夹名',
              newFileNameValue: createNewFileName.value,
              'onUpdate:newFileNameValue': (v) => (createNewFileName.value = v)
            }),
          positiveText: '确认创建',
          onPositiveClick: () => {
            d.loading = true;
            return new Promise((resolve) => {
              if (createNewFileName.value === '') {
                message.error('文件夹名不能为空');
                setTimeout(resolve, 10);
              } else {
                createFolder(
                  createNewFileName.value,
                  info.option.path as string,
                  ideStore.getCurrentProj()
                ).then(resolve);
              }
            });
          }
        });
      },
      'onDelete-file': () => {
        ideStore.setNodeSelected(info.option);
        if (info.option.type === 'dir' && info.option.path === '/') {
          deleteProject(ideStore.getCurrentProj());
        } else if (info.option.type === 'dir') {
          deleteFolder(info.option.path as string, ideStore.getCurrentProj());
        } else if (info.option.type === 'file') {
          deleteFile(info.option.path as string, ideStore.getCurrentProj());
        }
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
const deleteProject = (projectName: string) => {
  IdeService.ideIdeDeleteProject({
    requestBody: {
      projectName: projectName
    }
  }).then((res) => {
    if (res.code == 0) {
      ideStore.handleDelProject(projectName);
    }
  });
};
const deleteFile = (filePath: string, projectName: string) => {
  IdeService.ideIdeDeleteFile({
    requestBody: {
      projectName: projectName,
      filePath: filePath
    }
  }).then((res) => {
    if (res.code == 0) {
      ideStore.handleDelFile({ parentData: ideStore.getParentNode(filePath), filePath: filePath });
    }
  });
};
const deleteFolder = (folderPath: string, projectName: string) => {
  IdeService.ideIdeDeleteFolder({
    requestBody: {
      projectName: projectName,
      folderPath: folderPath
    }
  }).then((res) => {
    if (res.code == 0) {
      ideStore.handleDelFolder({
        parentData: ideStore.getParentNode(folderPath),
        folderPath: folderPath
      });
    }
  });
};

const createFile = (fileName: string, parentPath: string, projectName: string) => {
  return IdeService.ideIdeCreateFile({
    requestBody: {
      projectName: projectName,
      parentPath: parentPath,
      fileName: fileName
    }
  }).then((res) => {
    if (res.code == 0) {
      const newPath = path.join(parentPath, fileName);
      ideStore.addChildrenNode({
        name: fileName,
        path: newPath,
        type: 'file'
      });
      ideStore.ide_save_project();
    }
  });
};

const createFolder = (folderName: string, parentPath: string, projectName: string) => {
  return IdeService.ideIdeCreateFolder({
    requestBody: {
      projectName: projectName,
      parentPath: parentPath,
      folderName: folderName
    }
  }).then((res) => {
    if (res.code == 0) {
      const newPath = path.join(parentPath, folderName);
      ideStore.addChildrenNode({
        name: folderName,
        path: newPath,
        type: 'dir'
      });
      ideStore.ide_save_project();
    }
  });
};
</script>

<style scoped></style>
