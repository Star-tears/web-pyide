<template>
  <div ref="pyConsoleContainer" class="flex size-full flex-row">
    <div class="h-full w-6 border-r border-t">
      <NScrollbar class="size-full">
        <div class="mt-7 flex w-full flex-col items-center justify-center gap-1">
          <n-button quaternary size="tiny" class="px-1" @click="reloadPyTask">
            <template #icon>
              <Icon icon="material-symbols:refresh" />
            </template>
          </n-button>
          <n-button quaternary size="tiny" class="px-1" @click="stopPyTask">
            <template #icon>
              <Icon icon="material-symbols:stop" />
            </template>
          </n-button>
          <n-button quaternary size="tiny" class="px-1" @click="killPyTask">
            <template #icon>
              <Icon icon="material-symbols:delete-outline" />
            </template>
          </n-button>
        </div>
      </NScrollbar>
    </div>
    <div class="flex w-0 flex-1 flex-col">
      <div class="mr-12 h-7 overflow-hidden">
        <n-tabs
          v-model:value="activeConsoleName"
          type="card"
          closable
          @close="handleClose"
          addable
          class="mr-8"
          :tab-style="{
            padding: '0 0 0 0.375rem',
            height: '1.75rem',
            minWidth: '60px'
          }"
          :add-tab-style="{
            padding: '0 0.375rem 0 0.375rem',
            height: '1.75rem'
          }"
          :on-add="onAdd"
        >
          <n-tab-pane
            v-for="panel in ideInfo.taskIdList"
            :key="panel"
            :tab="getTabContent(panel.toString())"
            :name="panel"
          >
          </n-tab-pane>
          <template #prefix>
            <n-button quaternary size="small" class="px-1" @click="refreshTaskIdList">
              <template #icon>
                <Icon icon="tabler:refresh" />
              </template>
            </n-button>
          </template>
        </n-tabs>
      </div>
      <div class="flex h-0 flex-1 flex-row">
        <div class="size-full">
          <PyConsoleItem
            v-for="name in ideInfo.taskIdList"
            :key="name"
            :task-id="name"
            :class="{ hidden: activeConsoleName !== name }"
          >
          </PyConsoleItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIdeStore } from '@/stores/ide';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { NIcon, NScrollbar } from 'naive-ui';
import { storeToRefs } from 'pinia';
import PyConsoleItem from './py-console/PyConsoleItem.vue';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const pyConsoleContainer = ref(null);
const activeConsoleName = computed({
  get: () => ideInfo.value.activePyTaskIdValue,
  set: (value: string) => (ideInfo.value.activePyTaskIdValue = value)
});

onMounted(() => {
  ideStore.refreshTaskIdList();
});

function handleClose(name: any) {
  const index = ideInfo.value.taskIdList.findIndex((v: any) => name === v);
  ideInfo.value.taskIdList.splice(index, 1);
  if (activeConsoleName.value === name) {
    if (ideInfo.value.taskIdList.length > index)
      activeConsoleName.value = ideInfo.value.taskIdList[index];
    else if (ideInfo.value.taskIdList.length > 0) {
      activeConsoleName.value = ideInfo.value.taskIdList[index - 1];
    } else {
      activeConsoleName.value = '';
    }
  }
}

const getTabContent = (key: string) => {
  return h('div', { class: 'flex flex-row h-full items-center gap-2 w-full' }, [
    h(Icon, { icon: 'ph:terminal-window', width: '20px', height: '20px' }),
    h('div', null, key)
  ]);
};

const onAdd = () => {
  // panelsRef.value.push(indexCount.value);
  // activeConsoleName.value = indexCount.value;
  // indexCount.value++;
};
const refreshTaskIdList = () => {
  ideStore.refreshTaskIdList();
};

const reloadPyTask = () => {
  ideStore.reloadPyTask();
};
const stopPyTask = () => {
  ideStore.stopPyTask();
};
const killPyTask = () => {
  ideStore.killPyTask();
};
</script>

<style scoped></style>
