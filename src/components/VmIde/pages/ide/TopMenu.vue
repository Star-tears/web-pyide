<template>
  <div class="flex h-8 flex-row items-center justify-between border-b border-slate-600 px-4">
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
