<template>
  <div class="h-screen w-screen flex flex-col">
    <TopMenu />
    <MainFrame class="flex-grow" />
    <FooterStatusBar />
  </div>
</template>

<script setup lang="ts">
import TopMenu from '@/components/element/pages/ide/TopMenu.vue'
import FooterStatusBar from '@/components/element/pages/ide/FooterStatusBar.vue'
import MainFrame from '@/components/element/pages/ide/MainFrame.vue'
</script>

<style scoped></style>
