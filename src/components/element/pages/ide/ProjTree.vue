<template>
  <NScrollbar class="size-full items-center justify-center" x-scrollable>
    <NTree
      ref="tree"
      show-line
      block-line
      expand-on-click
      v-model:checked-keys="checkedKeys"
      v-model:selected-keys="selectKeys"
      :data="[tree_data]"
      :render-prefix="renderPrefix"
      :on-update:expanded-keys="updatePrefixWithExpaned"
    />
  </NScrollbar>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';
import { NScrollbar, NIcon, NTree } from 'naive-ui';
import type { TreeOption } from 'naive-ui';
import { Folder, FolderOpenOutline, FileTrayFullOutline } from '@vicons/ionicons5';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
import type { Key } from 'naive-ui/es/tree/src/interface';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const tree_data = computed(() => ideInfo.value.currProj.data);
// const ideInfo = computed(() => ideStore.ideInfo);
// const expandKeys = ref<Key[]>(['文件夹']);
const checkedKeys = ref<Key[]>(['main.py']);
const selectKeys = ref<Key[]>(['main.py']);
const tree = ref<typeof NTree | null>(null);

const checkOnClick = (node: TreeOption) => {
  checkedKeys.value.push(node.key);
  console.log(node);
  return true;
};
const updatePrefixWithExpaned = (
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null;
    action: 'expand' | 'collapse' | 'filter';
  }
) => {
  if (!meta.node) return;
  switch (meta.action) {
    case 'expand':
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(FolderOpenOutline)
        });
      break;
    case 'collapse':
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(Folder)
        });
      break;
  }
};
const updateCheckedKeys = (
  keys: Array<string | number>,
  option: Array<TreeOption | null>,
  meta: { node: TreeOption | null; action: 'check' | 'uncheck' }
) => {
  // console.log(keys);
  // checkedKeys.value.concat(keys);
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
  if (option.children)
    return h(NIcon, null, {
      default: () => h(Folder)
    });
  return h(NIcon, null, {
    default: () => h(FileTrayFullOutline)
  });
};
onMounted(() => {
  // ideStore.setTreeRef(tree.value);
  //   setTimeout(() => {
  //     if (!ideInfo.value.treeRef) return;
  //     ideInfo.value.treeRef.setCurrentKey('/');
  //     if (ideInfo.value.treeRef.getCurrentNode() !== null) {
  //       ideStore.setNodeSelected(ideInfo.value.treeRef.getCurrentNode());
  //     }
  //     setTimeout(() => {
  //       if (ideInfo.value.currProj.pathSelected !== null) {
  //         ideInfo.value.treeRef.setCurrentKey(ideInfo.value.currProj.pathSelected);
  //         if (ideInfo.value.treeRef.getCurrentNode() !== null) {
  //           ideStore.setNodeSelected(ideInfo.value.treeRef.getCurrentNode());
  //         }
  //       }
  //     }, 200);
  //   }, 300);
});
</script>

<style scoped></style>
