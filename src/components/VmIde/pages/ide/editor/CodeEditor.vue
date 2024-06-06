<template>
  <codemirror
    v-model="codeItemContent"
    ref="cmEditor"
    placeholder="Code goes here..."
    :style="{ height: '100%', fontSize: fontSize + 'px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
    @change="codeChanged"
    :disabled="readOnly"
  />
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
import { IdeService } from '@/client';
import { useDebounceFn } from '@vueuse/core';
import { autocompletion } from '@codemirror/autocomplete';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);

const cmEditor = ref(null);
const readOnly = ref(false);

interface Props {
  codeItem?: any;
  codeItemIndex?: number;
}

const props = defineProps<Props>();
let fontSize = ref(16); // 初始字体大小

const handleWheel = (event: WheelEvent) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault(); // 阻止默认的滚动行为
    if (event.deltaY < 0) {
      // 如果滚轮向上（放大字体）
      fontSize.value += 2; // 增加字体大小，可根据需要调整增量
    } else {
      // 如果滚轮向下（缩小字体）
      fontSize.value -= 2; // 减小字体大小，同样可调整
    }
    // 限制字体大小在一个合理的范围内，例如8至100
    fontSize.value = Math.min(Math.max(fontSize.value, 8), 100);
  }
};

onMounted(() => {
  if (!props.codeItem.path.startsWith('/')) readOnly.value = true;
  document.addEventListener('wheel', handleWheel, { passive: false });
});

onUnmounted(() => {
  document.removeEventListener('wheel', handleWheel);
});

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

const completeOptions = ref<any>([{ label: 'lalalala' }]);
// const completeOptions = ref<any>([]);

const myCompletions = (context: any) => {
  let word = context.matchBefore(/\w*/);
  if (word.from == word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: completeOptions.value
  };
};

const extensions = [python(), oneDark, autocompletion({ override: [myCompletions] })];

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

const isPython = () => {
  return props.codeItem.path.endsWith('.py');
};

const calculateLineNumberAndColumnIndex = (cursorPosition: number): [number, number] => {
  let lineNumber = 0; // 初始化行号为0
  let columnIndex = 0; // 初始化列号为0

  for (let i = 0; i < cursorPosition; i++) {
    if (codeItemContent.value[i] === '\n') {
      // 遇到换行符，行号加1，列号重置为0
      lineNumber++;
      columnIndex = 0;
    } else {
      // 否则，只是普通字符，列号加1
      columnIndex++;
    }
  }
  return [lineNumber, columnIndex];
};

const codeChanged = (value: any) => {
  ideStore.setCodeItemContent({ index: props.codeItemIndex, content: value });
  ideIdeWriteFile_debouncedFn(value);
};

const ideIdeWriteFile_debouncedFn = useDebounceFn(
  (value: any) => {
    // const state = view.value.state;
    // const ranges = state.selection.ranges;
    // const cursor = ranges[0].anchor;
    // const [lineNum, colNum] = calculateLineNumberAndColumnIndex(cursor);
    // IdeService.ideIdeWriteFile({
    //   requestBody: {
    //     projectName: ideInfo.value.currProj.data.name,
    //     filePath: props.codeItem.path,
    //     fileData: value,
    //     complete: isPython(),
    //     line: lineNum,
    //     column: colNum
    //   }
    // }).then((res) => {
    //   if (isPython) {
    //     const completeDatas: any = res.data;
    //     if (!res.data || completeDatas.length == 0) return;
    //     let completions = [].concat(completeDatas);
    //     const labeledObjects: { label: string }[] = completions.map((item) => ({ label: item }));
    //     completeOptions.value = labeledObjects;
    //   }
    // });
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
