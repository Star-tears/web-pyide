<template>
  <div>
    <n-card hoverable title="项目列表">
      <template #header-extra> <NTag type="success" size="small">3个</NTag> </template>
      <n-table striped>
        <thead>
          <tr>
            <th>项目名</th>
            <th>时间</th>
            <th>选项</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="data in ideInfo.projList" :key="data.name">
            <tr
              class="hover:scale-105 transition-all duration-300 ease-in-out"
              @dblclick="selectProj(data.name)"
            >
              <td class="select-none">{{ data.name }}</td>
              <td>
                <NTag :bordered="false" type="info" size="small" class="select-none">
                  {{ data.ctime }}
                </NTag>
              </td>
              <td>
                <div v-if="ideInfo.currProj.data.name !== data.name" class="select-none">打开</div>
                <check-one v-else theme="filled" size="24" fill="#7ed321" />
              </td>
            </tr>
          </template>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTag } from 'naive-ui';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
import { CheckOne } from '@icon-park/vue-next';
import { IdeService } from '@/client';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);

const selectProj = (projName: string) => {
  getProject(projName);
  ideStore.setCodeItems([]);
};

const getProject = (name?: any) => {
  IdeService.ideIdeGetProject({
    requestBody: { projectName: name === undefined ? ideInfo.value.currProj.config.name : name }
  }).then((res) => {
    if (res.code == 0) {
      ideStore.handleProject(res.data);
      for (var i = 0; i < ideInfo.value.currProj.config.openList.length; i++) {
        getFile(ideInfo.value.currProj.config.openList[i], false);
      }
    }
  });
};
const getFile = (path: string, save: boolean) => {
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
