<template>
  <div class="size-full">
    <NScrollbar>
      <div class="m-2">
        <n-card title="脚本管理区">
          <template #header-extra>
            <NTag type="success" class="mr-4"> {{ taskCount }}个 </NTag>
          </template>
          <n-table striped :single-line="false">
            <thead>
              <tr>
                <th>脚本id</th>
                <th>运行状态</th>
                <th>运行指令</th>
                <th>控制</th>
              </tr>
            </thead>
            <tbody>
              <template
                v-for="(taskInfo, taskId) in ideInfo.taskInfoDict as Record<string, any>"
                :key="taskId"
              >
                <tr>
                  <td>{{ taskId }}</td>
                  <td>
                    <NTag
                      :bordered="false"
                      :type="taskInfo.alive ? 'success' : 'error'"
                      size="small"
                    >
                      {{ taskInfo.alive ? '运行中' : '停止' }}
                    </NTag>
                  </td>
                  <td>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger as-child>
                          <Button variant="outline"> 查看脚本启动指令 </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{{ taskInfo.cmd }}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  <td>
                    <div
                      class="inline-flex border border-gray-200 rounded-full p-0.5 dark:border-neutral-700"
                    >
                      <button
                        type="button"
                        class="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-500 dark:hover:bg-blue-900 dark:hover:text-blue-200"
                        @click="toPyTaskView(taskId)"
                      >
                        <Icon icon="mdi:eye" width="24" height="24" />
                      </button>
                      <button
                        type="button"
                        class="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-500 dark:hover:bg-blue-900 dark:hover:text-blue-200"
                        @click="reloadPyTask(taskId)"
                      >
                        <Icon icon="ion:reload-circle" width="24" height="24" />
                      </button>
                      <button
                        type="button"
                        class="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-500 dark:hover:bg-blue-900 dark:hover:text-blue-200"
                        @click="stopPyTask(taskId)"
                      >
                        <Icon icon="material-symbols:stop" width="24" height="24" />
                      </button>
                      <button
                        type="button"
                        class="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-neutral-500 dark:hover:bg-blue-900 dark:hover:text-blue-200"
                        @click="killPyTask(taskId)"
                      >
                        <Icon icon="mdi:bin" width="24" height="24" />
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </n-table>
        </n-card>
      </div>
    </NScrollbar>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IdeService } from '@/client';
import { NScrollbar } from 'naive-ui';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const taskCount = computed(() => {
  return Object.keys(ideInfo.value.taskInfoDict).length;
});

onMounted(() => {
  ideStore.refreshTaskInfoDict();
});

const toPyTaskView = (taskId: string) => {
  ideStore.toPyTaskView(taskId);
};
const reloadPyTask = (taskId: string) => {
  ideStore.reloadPyTask(taskId);
};
const stopPyTask = (taskId: string) => {
  ideStore.stopPyTask(taskId);
};
const killPyTask = (taskId: string) => {
  ideStore.killPyTask(taskId);
};
</script>

<style scoped></style>
