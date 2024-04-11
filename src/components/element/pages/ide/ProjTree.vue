<template>
  <NScrollbar class="size-full items-center justify-center" x-scrollable>
    <NTree
      ref="tree"
      show-line
      block-line
      expand-on-click
      :data="data"
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

const ideStore = useIdeStore();
// const { ideInfo } = storeToRefs(ideStore);
// const ideInfo = computed(() => ideStore.ideInfo);

const tree = ref<typeof NTree | null>(null);
const data = ref<Array<TreeOption | null>>([
  {
    key: '文件夹',
    label: '文件夹',
    prefix: () =>
      h(NIcon, null, {
        default: () => h(Folder)
      }),
    children: [
      {
        key: '空的',
        label: '空的',
        disabled: true,
        prefix: () =>
          h(NIcon, null, {
            default: () => h(Folder)
          })
      },
      {
        key: '我的文件',
        label: '我的文件',
        prefix: () =>
          h(NIcon, null, {
            default: () => h(Folder)
          }),
        children: [
          {
            label: 'main.py',
            key: 'main.py',
            prefix: () =>
              h(NIcon, null, {
                default: () => h(FileTrayFullOutline)
              })
          }
        ]
      }
    ]
  }
]);
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
