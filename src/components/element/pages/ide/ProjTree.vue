<template>
  <NScrollbar class="size-full items-center justify-center" x-scrollable>
    <NTree
      show-line
      block-line
      expand-on-click
      :data="data"
      :on-update:expanded-keys="updatePrefixWithExpaned"
    />
  </NScrollbar>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { NScrollbar, NIcon } from 'naive-ui';
import type { TreeOption } from 'naive-ui';
import { Folder, FolderOpenOutline, FileTrayFullOutline } from '@vicons/ionicons5';

const data = ref([
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
            label: 'template.txt',
            key: 'template.txt',
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
const updatePrefixWithExpaned =
  () =>
  (
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
</script>

<style scoped></style>
