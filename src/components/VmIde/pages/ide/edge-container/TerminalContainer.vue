<template>
  <div ref="terminalContainer" class="size-full flex flex-col">
    <div class="ml-2 h-7 mr-12 overflow-hidden">
      <n-tabs v-model:value="activeConsoleName" type="card" closable @close="handleClose" addable class="mr-8"
        :tab-style="{
          padding: '0 0 0 0.375rem',
          height: '1.75rem',
          minWidth: '60px',
          maxWidth: '100px'
        }" :add-tab-style="{
          padding: '0 0.375rem 0 0.375rem',
          height: '1.75rem'
        }" :on-add="onAdd">
        <n-tab-pane v-for="panel in panelsRef" :key="panel" :tab="getTabContent(panel.toString())" :name="panel">
        </n-tab-pane>
      </n-tabs>
    </div>
    <div class="flex-1 h-0 flex flex-row">
      <div class="w-6 border-r h-full border-t">
        <NScrollbar class="size-full">
          <div class="w-full flex flex-col items-center justify-center mt-2 gap-1">
            <n-button quaternary size="tiny" class="px-1">
              <template #icon>
                <Icon icon="codicon:debug-start" />
              </template>
            </n-button>
            <n-button quaternary size="tiny" class="px-1">
              <template #icon>
                <Icon icon="material-symbols:stop" />
              </template>
            </n-button>
            <n-button quaternary size="tiny" class="px-1">
              <template #icon>
                <Icon icon="material-symbols:delete-outline" />
              </template>
            </n-button>
          </div>
        </NScrollbar>
      </div>
      <div class="h-full flex-1 w-0">
        <TerminalItem v-for="name in panelsRef" :key="name" :console-item-index="name"
          :class="{ hidden: activeConsoleName !== name }">
        </TerminalItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js';
import { NIcon, NScrollbar } from 'naive-ui';
import TerminalItem from './terminal/TerminalItem.vue';

const terminalContainer = ref(null);
const activeConsoleName = ref(null);
const panelsRef = ref([]);
const indexCount = ref(0);
function handleClose(name: number) {
  const { value: panels } = panelsRef;
  const index = panels.findIndex((v) => name === v);
  panels.splice(index, 1);
  if (activeConsoleName.value === name) {
    activeConsoleName.value = panels[index];
  }
}

const getTabContent = (key: string) => {
  return h('div', { class: 'flex flex-row h-full items-center gap-2' }, [
    h(Icon, { icon: 'ph:terminal-window', width: '20px', height: '20px' }),
    h('div', null, key)
  ]);
};

const onAdd = () => {
  panelsRef.value.push(indexCount.value);
  activeConsoleName.value = indexCount.value;
  indexCount.value++;
};
</script>

<style scoped></style>
