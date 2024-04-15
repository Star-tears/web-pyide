<template>
  <div class="h-9">
    <n-tabs type="card" :size="size" closable>
      <n-tab-pane v-for="item in codeItems" :tab="item.path" :name="item.path" :key="item.path">
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);

const codeItems = computed(() => ideInfo.value.codeItems);
const size = ref<'small' | 'medium' | 'large'>('small');
</script>

<style scoped></style>
