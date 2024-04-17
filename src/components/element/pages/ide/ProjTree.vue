<template>
  <NScrollbar class="size-full items-center justify-center" x-scrollable>
    <NTree
      show-line
      block-line
      expand-on-click
      :data="[tree_data]"
      :render-prefix="renderPrefix"
      :selected-keys="selectKeys"
      :on-update:selected-keys="updateSelectKeys"
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
  if (option.type === 'file') return getFileIcon(option.label);
  if (option.type === 'dir') return getFolderIcon(option.label);
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
