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
      :key="currProj"
    />
    <NTree
      show-line
      block-line
      expand-on-click
      :data="sdk_data"
      :render-prefix="renderSdkPrefix"
      :on-update:selected-keys="updateSdkSelectKeys"
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
import { IdeService } from '@/client';
import LabelItem from '@/components/VmIde/components/LabelItem.vue';
import CreateDialog from './dialog/CreateDialog.vue';
import path from 'path-browserify';
import UploadFileForProjDialog from './dialog/UploadFileForProjDialog.vue';
import { Icon } from '@iconify/vue/dist/iconify.js';
const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const tree_data = computed(() => {
  return [ideInfo.value.currProj.data];
});

// 绑定key为currProj，当前项目变化时，重新渲染文件树组件，防止数据绑定导致的未实时变化问题
const currProj = computed(() => {
  return ideStore.getCurrentProj();
});
const sdk_data = ref();

const selectKeys = computed(() => ideInfo.value.selectKeys);
const createNewFileName = ref('');
const uploadFileForProjDialogRef = ref<InstanceType<typeof UploadFileForProjDialog>>(null);
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
const updateSdkSelectKeys = (
  keys: Array<string | number>,
  option: Array<TreeOption | null>,
  meta: { node: TreeOption | null; action: 'select' | 'unselect' }
) => {
  ideStore.setCurrentKey(keys[0] as string);
  const pathString = option[0].key as string;

  // 找到第一个 '/' 的索引位置
  const slashIndex: number = pathString.indexOf('/');

  // 如果找到了 '/'，则从它之后的部分截取字符串；否则，直接返回原字符串
  const resultString: string = slashIndex !== -1 ? pathString.substring(slashIndex) : pathString;
  IdeService.ideGetSdkFile({
    requestBody: {
      filePath: resultString
    }
  }).then((res) => {
    if (res.code == 0) {
      ideStore.handleGetFile({
        filePath: pathString,
        data: res.data,
        save: false
      });
    }
  });
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

const renderSdkPrefix = ({
  option,
  checked,
  selected
}: {
  option: TreeOption;
  checked: boolean;
  selected: boolean;
}) => {
  if ((option.path as string).endsWith('/'))
    return h(Icon, { icon: 'vscode-icons:folder-type-devcontainer', width: 20, height: 20 });
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
      },
      'onUpload-file': () => {
        ideStore.setNodeSelected(info.option);
        const d = dialog.success({
          title: '上传文件',
          content: () =>
            h(UploadFileForProjDialog, {
              parentPath: info.option.path as string,
              projName: ideStore.getCurrentProj(),
              ref: uploadFileForProjDialogRef
            }),
          positiveText: '确认上传',
          onPositiveClick: () => {
            d.loading = true;
            return new Promise((resolve) => {
              uploadFileForProjDialogRef.value.startUpload().then(resolve);
            });
          }
        });
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
  setTimeout(() => {
    IdeService.ideGetSdkProject().then((res) => {
      if (res.code == 0) {
        sdk_data.value = [res.data];
      }
    });
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
