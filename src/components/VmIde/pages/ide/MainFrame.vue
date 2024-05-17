<template>
  <div class="flex flex-row">
    <SiderBar class="h-full w-12" />
    <MainContent class="w-0 flex-1" />
  </div>
</template>

<script setup lang="ts">
import SiderBar from '@/components/VmIde/pages/ide/SiderBar.vue';
import MainContent from '@/components/VmIde/pages/ide/MainContent.vue';
</script>

<style scoped></style>
