<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <div
        class="rounded px-4 dark:hover:bg-white/20"
        :class="{ 'bg-white': isActive }"
        @click="onItemClicked"
        v-on-click-outside="onClickOutside"
      >
        {{ props.label }}
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <slot />
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { vOnClickOutside } from '@vueuse/components';

interface Props {
  label: string;
}

const props = defineProps<Props>();

const isActive = ref(false);

const onItemClicked = () => {
  isActive.value = true;
};
const onClickOutside = () => {
  isActive.value = false;
};
</script>

<style scoped></style>
