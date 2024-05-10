<template>
  <div class="size-full">
    <NScrollbar>
      <div class="m-2">
        <n-card title="脚本管理区">
          <template #header-extra>
            <NTag type="success" class="mr-4"> 3个 </NTag>
          </template>
          <n-table striped>
            <thead>
              <tr>
                <th>脚本id</th>
                <th>运行状态</th>
                <th>...</th>
                <th>控制</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(taskInfo, taskId) in taskInfoList" :key="taskId">
                <tr>
                  <td>{{ taskId }}</td>
                  <td>
                    <NTag :bordered="false" :type="taskInfo.alive ? 'success' : 'error'" size="small">
                      {{ taskInfo.alive ? '运行中' : '停止' }}
                    </NTag>
                  </td>
                  <td>...</td>
                  <td>...</td>
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
import { IdeService } from '@/client';
import { NScrollbar } from 'naive-ui';

const taskInfoList = ref<any>({});
onMounted(() => {
  IdeService.ideGetTaskInfoList().then((res) => {
    taskInfoList.value = res.data;
  });
});
</script>

<style scoped></style>
