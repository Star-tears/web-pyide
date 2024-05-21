<template>
  <mavonEditor
    v-model="codeItemContent"
    style="height: 100%"
    :externalLink="false"
    :toolbars="toolbars"
    :editable="!readOnly"
    @change="mdChanged"
  />
</template>

<script setup lang="ts">
import { IdeService } from '@/client';
import { useIdeStore } from '@/stores/ide';
import { useDebounceFn } from '@vueuse/core';
// @ts-ignore
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import 'mavon-editor/dist/markdown/github-markdown.min.css';
import { storeToRefs } from 'pinia';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);

interface Props {
  codeItem?: any;
  codeItemIndex?: number;
}

const props = defineProps<Props>();

const readOnly = ref(false);
const toolbars = {
  bold: true,
  italic: true,
  header: true,
  underline: true,
  strikethrough: true,
  mark: true,
  superscript: true,
  subscript: true,
  quote: true,
  ol: true,
  ul: true,
  link: true,
  imagelink: true,
  code: true,
  table: true,
  undo: true,
  redo: true,
  trash: true,
  save: true,
  alignleft: true,
  aligncenter: true,
  alignright: true,
  navigation: true,
  subfield: true,
  fullscreen: false,
  readmodel: true,
  htmlcode: true,
  help: true,
  preview: true
};

const codeItemContent = computed({
  get() {
    return props.codeItem.content;
  },
  set(newValue) {
    ideStore.setCodeItemContent({ index: props.codeItemIndex, content: newValue });
  }
});

onMounted(() => {
  if (!props.codeItem.path.startsWith('/')) readOnly.value = true;
});

const mdChanged = (value: any) => {
  ideStore.setCodeItemContent({ index: props.codeItemIndex, content: value });
  ideIdeWriteFile_debouncedFn(value);
};
const ideIdeWriteFile_debouncedFn = useDebounceFn(
  (value: any) => {
    IdeService.ideIdeWriteFile({
      requestBody: {
        projectName: ideInfo.value.currProj.data.name,
        filePath: props.codeItem.path,
        fileData: value
      }
    });
  },
  1000,
  { maxWait: 5000 }
);
</script>

<style scoped></style>
