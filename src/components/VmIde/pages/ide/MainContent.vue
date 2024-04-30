<template>
  <div>
    <NSplit direction="vertical" v-model:size="verticalSize">
      <template #1>
        <NSplit direction="horizontal" :default-size="0.3" :min="0.1">
          <template #1> <ProjTree @get-item="getFile" /> </template>
          <template #2>
            <div class="size-full flex flex-col">
              <CodeTabs @select-item="selectFile" @close-item="closeFile" />
              <template v-for="(item, index) in ideInfo.codeItems" :key="item.path + index">
                <IdeEditor
                  class="flex-1 h-0"
                  :code-item="item"
                  :code-item-index="index"
                  v-if="ideInfo.codeSelected.path === item.path"
                />
              </template>
            </div>
          </template>
        </NSplit>
      </template>
      <template #2> <EdgeContainer /> </template>
    </NSplit>
  </div>
</template>

<script setup lang="ts">
import ProjTree from '@/components/VmIde/pages/ide/ProjTree.vue';
import { NSplit } from 'naive-ui';
import IdeEditor from '@/components/VmIde/pages/ide/IdeEditor.vue';
import CodeTabs from '@/components/VmIde/pages/ide/CodeTabs.vue';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
import { IdeService } from '@/client';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const vsize = ref(0.7);

const verticalSize = computed({
  get: () => {
    return !ideInfo.value.edgeContainerValue || ideInfo.value.edgeContainerValue.length === 0
      ? 1
      : vsize.value;
  },
  set: (value: number) => {
    if (ideInfo.value.edgeContainerValue && ideInfo.value.edgeContainerValue.length > 0)
      vsize.value = value;
  }
});
/**
 * 选择文件
 * @param item 点击的选项卡item，有path属性
 */
const selectFile = (item: any) => {
  ideStore.setPathSelected(item.path);
  ideStore.setCodeSelected(item);
  if (ideInfo.value.currProj.pathSelected) {
    ideStore.setCurrentKey(ideInfo.value.currProj.pathSelected);
  }
  ideStore.setNodeSelected(ideStore.getCurrentNode());
  ideStore.ide_save_project();
};
/**
 * 关闭文件
 * @param item 点击的选项卡item，有path属性
 */
const closeFile = (item: any) => {
  const codeItems = [];
  for (let i = 0; i < ideInfo.value.codeItems.length; i++) {
    if (item.path !== ideInfo.value.codeItems[i].path) {
      codeItems.push(ideInfo.value.codeItems[i]);
    } else {
      if (i > 0) {
        if (ideInfo.value.currProj.pathSelected === item.path) {
          ideStore.setPathSelected(ideInfo.value.codeItems[i - 1].path);
          ideStore.setCodeSelected(ideInfo.value.codeItems[i - 1]);
          // this.$store.commit('ide/setNodeSelected', ideInfo.value.codeItems[i - 1]);
        }
      } else if (i < ideInfo.value.codeItems.length - 1) {
        if (ideInfo.value.currProj.pathSelected === item.path) {
          ideStore.setPathSelected(ideInfo.value.codeItems[i + 1].path);
          ideStore.setCodeSelected(ideInfo.value.codeItems[i + 1]);
          // this.$store.commit('ide/setNodeSelected', ideInfo.value.codeItems[i + 1]);
        }
      }
    }
  }
  ideStore.setCodeItems(codeItems);
  if (ideInfo.value.codeItems.length === 0) {
    ideStore.setPathSelected(null);
    ideStore.setCodeSelected({});
    // this.$store.commit('ide/setNodeSelected', null);
  }
  ideStore.ide_save_project();
};
const closeConsoleSafe = (item: any) => {
  //! todo
  closeConsole(item);
};
const closeConsole = (item: any) => {
  const consoleItems = [];
  for (let i = 0; i < ideInfo.value.consoleItems.length; i++) {
    if (item.name === 'Terminal' && item.path === 'Terminal') {
      if (item.id !== ideInfo.value.consoleItems[i].id) {
        consoleItems.push(ideInfo.value.consoleItems[i]);
      } else {
        if (i > 0) {
          ideStore.setConsoleSelected(ideInfo.value.consoleItems[i - 1]);
        } else if (i < ideInfo.value.consoleItems.length - 1) {
          ideStore.setConsoleSelected(ideInfo.value.consoleItems[i + 1]);
        }
      }
    } else {
      if (
        item.path !== ideInfo.value.consoleItems[i].path ||
        item.id !== ideInfo.value.consoleItems[i].id
      ) {
        consoleItems.push(ideInfo.value.consoleItems[i]);
      } else {
        if (i > 0) {
          ideStore.setConsoleSelected(ideInfo.value.consoleItems[i - 1]);
        } else if (i < ideInfo.value.consoleItems.length - 1) {
          ideStore.setConsoleSelected(ideInfo.value.consoleItems[i + 1]);
        }
      }
    }
  }
  ideStore.setConsoleItems(consoleItems);
  if (ideInfo.value.consoleItems.length === 0) {
    ideStore.setConsoleSelected({});
  }
};

const getFile = (path: string, save?: boolean) => {
  IdeService.ideIdeGetFile({
    requestBody: {
      filePath: path,
      projectName: ideInfo.value.currProj.data.name
    }
  }).then((res) => {
    if (res.code == 0) {
      ideStore.handleGetFile({
        filePath: path,
        data: res.data,
        save: save
      });
      if (save !== false) ideStore.ide_save_project();
    }
  });
};
</script>

<style scoped></style>
