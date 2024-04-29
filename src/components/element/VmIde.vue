<template>
  <div class="h-screen w-screen flex flex-col">
    <TopMenu />
    <MainFrame class="flex-1 h-0" />
    <FooterStatusBar />
  </div>
</template>

<script setup lang="ts">
import TopMenu from '@/components/element/pages/ide/TopMenu.vue';
import FooterStatusBar from '@/components/element/pages/ide/FooterStatusBar.vue';
import MainFrame from '@/components/element/pages/ide/MainFrame.vue';
import { storeToRefs } from 'pinia';
// import { useWsStore } from '@/stores/websocket';
import { onMounted } from 'vue';
import { useIdeStore } from '@/stores/ide';
import { IdeService } from '@/client';

// const wsStore = useWsStore();
const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
// const { wsInfo } = storeToRefs(wsStore);

onMounted(() => {
  // if (!wsInfo.value.rws) {
  //   wsStore.init({});
  // }
  const t = setInterval(() => {
    IdeService.ideIdeListProjects().then((res) => {
      if (res.code == 0) {
        clearInterval(t);
        ideStore.handleProjects(res.data);
        getProject();
      }
    });
  }, 1000);
});

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
