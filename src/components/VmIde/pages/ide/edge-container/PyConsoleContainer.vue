<template>
    <div ref="pyConsoleContainer" class="size-full flex flex-row">
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
                    <n-button quaternary size="tiny" class="px-1" @click="refreshTaskIdList">
                        <template #icon>
                            <Icon icon="material-symbols:refresh" />
                        </template>
                    </n-button>
                </div>
            </NScrollbar>
        </div>
        <div class="flex-1 w-0 flex flex-col">
            <div class="h-7 mr-12 overflow-hidden">
                <n-tabs v-model:value="activeConsoleName" type="card" closable @close="handleClose" addable class="mr-8"
                    :tab-style="{
                        padding: '0 0 0 0.375rem',
                        height: '1.75rem',
                        minWidth: '60px'
                    }" :add-tab-style="{
                        padding: '0 0.375rem 0 0.375rem',
                        height: '1.75rem'
                    }" :on-add="onAdd">
                    <n-tab-pane v-for="panel in ideInfo.taskIdList" :key="panel" :tab="getTabContent(panel.toString())"
                        :name="panel">
                    </n-tab-pane>
                </n-tabs>
            </div>
            <div class="flex-1 h-0 flex flex-row">
                <div class="h-full w-full">
                    <PyConsoleItem v-for="name in ideInfo.taskIdList" :key="name" :task-id="name"
                        :class="{ hidden: activeConsoleName !== name }">
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

const indexCount = ref(0);
function handleClose(name: number) {
    // const { value: panels } = panelsRef;
    // const index = panels.findIndex((v) => name === v);
    // panels.splice(index, 1);
    // if (activeConsoleName.value === name) {
    //     activeConsoleName.value = panels[index];
    // }
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
</script>

<style scoped></style>
