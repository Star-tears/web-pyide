<template>
  <div class="flex flex-row">
    <SiderBar />
    <MainContent class="flex-grow" />
  </div>
</template>

<script setup lang="ts">
import SiderBar from '@/components/element/pages/ide/SiderBar.vue';
import MainContent from '@/components/element/pages/ide/MainContent.vue';
</script>

<style scoped></style>
