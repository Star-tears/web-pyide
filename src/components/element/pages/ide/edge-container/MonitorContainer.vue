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
              <tr>
                <td>/main.py</td>
                <td><NTag :bordered="false" type="success" size="small"> 运行中 </NTag></td>
                <td>...</td>
                <td>...</td>
              </tr>
              <tr>
                <td>/utils/main.py</td>
                <td><NTag :bordered="false" type="error" size="small"> 停止 </NTag></td>
                <td>...</td>
                <td>...</td>
              </tr>
              <tr>
                <td>test.py</td>
                <td><NTag :bordered="false" type="info" size="small"> 运行结束 </NTag></td>
                <td>...</td>
                <td>...</td>
              </tr>
            </tbody>
          </n-table>
        </n-card>
      </div>
    </NScrollbar>
  </div>
</template>

<script setup lang="ts">
import { NScrollbar } from 'naive-ui';
</script>

<style scoped></style>
