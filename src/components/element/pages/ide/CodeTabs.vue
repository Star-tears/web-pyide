<template>
  <div class="h-9">
    <NTabs
      type="card"
      :size="size"
      closable
      :value="ideInfo.currProj.pathSelected"
      :on-update:value="updateValue"
      :on-close="removeTab"
    >
      <NTabPane v-for="item in codeItems" :tab="item.path" :name="item.path" :key="item.path">
      </NTabPane>
    </NTabs>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui';
import { ref } from 'vue';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';

const emit = defineEmits<{
  (e: 'select-item', item: any): void;
  (e: 'close-item', item: any): void;
}>();

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);

const codeItems = computed(() => ideInfo.value.codeItems);
const size = ref<'small' | 'medium' | 'large'>('small');

const updateValue = (value: string) => {
  const item = getItem(value);
  if (!item) return;
  emit('select-item', item);
};
const removeTab = (path: string) => {
  const item = getItem(path);
  if (!item) return;
  emit('close-item', item);
};

const getItem = (path: string) => {
  for (let i = 0; i < ideInfo.value.codeItems.length; i++) {
    if (ideInfo.value.codeItems[i].path === path) {
      return ideInfo.value.codeItems[i];
    }
  }
  return '';
};
</script>

<style scoped></style>
