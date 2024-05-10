<template>
  <div class="h-8 border-b border-slate-600 flex items-center px-4 flex-row justify-between">
    <FileSettingItem />
    <div>
      <RunPyBtn />
    </div>
  </div>
</template>

<script setup lang="ts">
import RunPyBtn from './topmenu-items/RunPyBtn.vue';
</script>

<style scoped></style>
