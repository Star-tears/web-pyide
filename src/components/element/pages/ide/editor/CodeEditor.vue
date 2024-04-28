<template>
  <codemirror
    v-model="codeItemContent"
    placeholder="Code goes here..."
    style="height: 100%"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
    @change="codeChanged"
  />
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
import { IdeService } from '@/client';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);

interface Props {
  codeItem?: any;
  codeItemIndex?: number;
}

const props = defineProps<Props>();

// const code = ref(`print('Hello, world!')`);
const extensions = [python(), oneDark];

const codeItemContent = computed({
  get() {
    return props.codeItem.content;
  },
  set(newValue) {
    ideStore.setCodeItemContent({ index: props.codeItemIndex, content: newValue });
  }
});

// Codemirror EditorView instance ref
const view = shallowRef();
const handleReady = (payload: any) => {
  view.value = payload.view;
};

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
  const state = view.value.state;
  const ranges = state.selection.ranges;
  const selected = ranges.reduce((r: any, range: any) => r + range.to - range.from, 0);
  const cursor = ranges[0].anchor;
  const length = state.doc.length;
  const lines = state.doc.lines;
  // more state info ...
  // return ...
};

const codeChanged = (value: any) => {
  ideStore.setCodeItemContent({ index: props.codeItemIndex, content: value });
  IdeService.ideIdeWriteFile({
    requestBody: {
      projectName: ideInfo.value.currProj.data.name,
      filePath: props.codeItem.path,
      fileData: value
    }
  });
};
</script>

<style>
.cm-scroller::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px;
  /* 高宽分别对应横竖滚动条的尺寸 */
  height: 10px;
}

.cm-scroller::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  /* background: #87939A; */
  background: #545a5e;
}

.cm-scroller::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  background: #2f2f2f;
}
</style>
