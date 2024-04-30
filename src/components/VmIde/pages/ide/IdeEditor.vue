<template>
  <div class="size-full">
    <CodeEditor :codeItem="$props.codeItem" :codeItemIndex="$props.codeItemIndex"></CodeEditor>/>
  </div>
</template>

<script setup lang="ts">
import CodeEditor from '@/components/VmIde/pages/ide/editor/CodeEditor.vue';

interface Props {
  codeItem?: any;
  codeItemIndex?: number;
}

const props = defineProps<Props>();
</script>

<style scoped></style>
