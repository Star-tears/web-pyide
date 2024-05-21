<template>
  <div class="size-full">
    <MarkdownEditor
      v-if="isMarkdown"
      :codeItem="props.codeItem"
      :codeItemIndex="props.codeItemIndex"
    />
    <CodeEditor v-else :codeItem="props.codeItem" :codeItemIndex="props.codeItemIndex" />
  </div>
</template>

<script setup lang="ts">
import CodeEditor from '@/components/VmIde/pages/ide/editor/CodeEditor.vue';
import MarkdownEditor from '@/components/VmIde/pages/ide/editor/MarkdownEditor.vue';

interface Props {
  codeItem?: any;
  codeItemIndex?: number;
}

const props = defineProps<Props>();

const isMarkdown = computed(() => {
  return props.codeItem.path.endsWith('.md');
});

onMounted(() => {
  console.log(props);
});
</script>

<style scoped></style>
