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
import { useWsStore } from '@/stores/websocket';
import { onMounted } from 'vue';
import { useIdeStore } from '@/stores/ide';
const wsStore = useWsStore();
const ideStore = useIdeStore();
const { wsInfo } = storeToRefs(wsStore);
onMounted(() => {
  if (!wsInfo.value.rws) {
    wsStore.init({});
  }
  const t = setInterval(() => {
    if (wsInfo.value.connected) {
      ideStore.ide_list_projects({
        callback: (dict: any) => {
          clearInterval(t);
          if (dict.code == 0) {
            // ideStore.handleProjects(dict.data);
          }
        }
      });
    }
  }, 1000);
});
</script>

<style scoped></style>
