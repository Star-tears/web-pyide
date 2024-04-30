<template>
  <div class="flex flex-row">
    <SiderBar class="w-12 h-full" />
    <MainContent class="flex-1 w-0" />
  </div>
</template>

<script setup lang="ts">
import SiderBar from '@/components/VmIde/pages/ide/SiderBar.vue';
import MainContent from '@/components/VmIde/pages/ide/MainContent.vue';
</script>

<style scoped></style>
