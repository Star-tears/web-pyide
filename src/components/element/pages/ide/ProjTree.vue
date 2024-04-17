<template>
  <NScrollbar class="size-full items-center justify-center" x-scrollable>
    <NTree
      show-line
      block-line
      expand-on-click
      default-expand-all
      :data="[tree_data]"
      :render-prefix="renderPrefix"
      :selected-keys="selectKeys"
      :on-update:selected-keys="updateSelectKeys"
    />
  </NScrollbar>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import { NScrollbar, NIcon, NTree } from 'naive-ui';
import type { TreeOption } from 'naive-ui';
import { Folder, FolderOpenOutline, FileTrayFullOutline } from '@vicons/ionicons5';
import { Icon } from '@iconify/vue';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const tree_data = computed(() => ideInfo.value.currProj.data);
// const expandKeys = ref<Key[]>(['文件夹']);
const selectKeys = computed(() => ideInfo.value.selectKeys);

const emit = defineEmits<{
  (e: 'get-item', path: string): void;
}>();

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
  if (option.type === 'file') {
    const ext_name = option.label.substring(option.label.lastIndexOf('.') + 1);
    return h(NIcon, null, {
      default: () => {
        switch (ext_name) {
          case 'py':
            return h(Icon, { icon: 'vscode-icons:file-type-python' });
          case 'md':
            return h(Icon, { icon: 'vscode-icons:file-type-markdown' });
          case 'c':
            return h(Icon, { icon: 'vscode-icons:file-type-c2' });
          case 'cpp':
            return h(Icon, { icon: 'vscode-icons:file-type-cpp3' });
          case 'h':
            return h(Icon, { icon: 'vscode-icons:file-type-cheader' });
          case 'css':
            return h(Icon, { icon: 'vscode-icons:file-type-css' });
          case 'less':
            return h(Icon, { icon: 'vscode-icons:file-type-less' });
          case 'sass':
            return h(Icon, { icon: 'vscode-icons:file-type-sass' });
          case 'hpp':
            return h(Icon, { icon: 'vscode-icons:file-type-cppheader' });
          case 'sh':
            return h(Icon, { icon: 'vscode-icons:file-type-powershell' });
          case 'vue':
            return h(Icon, { icon: 'vscode-icons:file-type-vue' });
          case 'html':
            return h(Icon, { icon: 'vscode-icons:file-type-html' });
          case 'ts':
            return h(Icon, { icon: 'vscode-icons:file-type-typescript-official' });
          case 'js':
            return h(Icon, { icon: 'vscode-icons:file-type-js-official' });
          case 'cs':
            return h(Icon, { icon: 'vscode-icons:file-type-csharp2' });
          case 'java':
            return h(Icon, { icon: 'vscode-icons:file-type-java' });
          default:
            return h(FileTrayFullOutline);
        }
      }
    });
  }
  if (option.children)
    return h(NIcon, null, {
      default: () => h(Folder)
    });
  return h(NIcon, null, {
    default: () => h(FileTrayFullOutline)
  });
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
</script>

<style scoped></style>
