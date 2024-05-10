<template>
  <div class="w-12 border-r border-slate-600">
    <div class="flex flex-col items-center justify-between h-full">
      <div></div>
      <div class="mb-6 flex flex-col justify-center">
        <ToggleGroup v-model="edgeWinValue" type="single" orientation="vertical" class="flex-col gap-4">
          <ToggleGroupItem value="py-console" class="px-1" :style="getActiveStyle('py-console')">
            <Icon icon="mdi:language-python" class="size-7" />
          </ToggleGroupItem>
          <ToggleGroupItem value="terminal" class="px-1" :style="getActiveStyle('terminal')">
            <Icon icon="ph:terminal-fill" class="size-7" />
          </ToggleGroupItem>
          <ToggleGroupItem value="monitor" class="px-1" :style="getActiveStyle('monitor')">
            <Icon icon="material-symbols-light:stacks-rounded" class="size-7" />
          </ToggleGroupItem>
          <ToggleGroupItem value="pkg-manager" class="px-1" :style="getActiveStyle('pkg-manager')">
            <Icon icon="material-symbols-light:package-2" class="size-7" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIdeStore } from '@/stores/ide';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { storeToRefs } from 'pinia';
import { useThemeVars } from 'naive-ui';

const themeVars = useThemeVars();

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const edgeWinValue = computed({
  get: () => ideInfo.value.edgeContainerValue,
  set: (value: string) => (ideInfo.value.edgeContainerValue = value)
});

const getActiveStyle = (value: string) => {
  const styleValue: Record<string, any> = {};
  if (ideInfo.value.edgeContainerValue === value)
    styleValue.borderLeft = '1.5px solid ' + themeVars.value.primaryColor;

  return styleValue;
};
</script>

<style scoped></style>
