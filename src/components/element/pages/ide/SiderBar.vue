<template>
  <div class="w-12 border-r border-slate-600">
    <div class="flex flex-col items-center justify-between h-full">
      <div></div>
      <div class="mb-6 flex flex-col justify-center">
        <ToggleGroup type="single" orientation="vertical" class="flex-col gap-4">
          <ToggleGroupItem value="a" class="px-1">
            <Icon icon="material-symbols-light:terminal-rounded" class="size-7" />
          </ToggleGroupItem>
          <ToggleGroupItem value="b" class="px-1">
            <Icon icon="material-symbols-light:stacks-rounded" class="size-7" />
          </ToggleGroupItem>
          <ToggleGroupItem value="c" class="px-1">
            <Icon icon="material-symbols-light:package-2" class="size-7" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Icon } from '@iconify/vue/dist/iconify.js';
</script>

<style scoped></style>
