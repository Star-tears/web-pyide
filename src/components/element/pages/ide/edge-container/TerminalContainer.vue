<template>
  <div ref="terminalContainer" class="size-full">
    <div id="xterm" class="xterm size-full"></div>
  </div>
</template>

<script setup lang="ts">
import { Terminal } from '@xterm/xterm';
import { useElementSize } from '@vueuse/core';
import { Atom, Dracula, Github, MaterialDark, Chalkboard } from 'xterm-theme';
import xtermTheme from 'xterm-theme';
import { FitAddon } from '@xterm/addon-fit';
const terminalContainer = ref(null);
const { width, height } = useElementSize(terminalContainer);

const term = new Terminal({
  theme: Atom,
  cursorBlink: true,
  disableStdin: false,
  scrollback: 100,
  convertEol: true
});
const fitAddon = new FitAddon();
term.loadAddon(fitAddon);

term.onKey((e) => {
  term.write(e.key);
  if (e.key == '\r') term.write('\n');
});
onMounted(() => {
  term.open(document.getElementById('xterm'));
  term.writeln('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ 测试');
});
watch(width, async () => {
  fitAddon.fit();
});
watch(height, async () => {
  fitAddon.fit();
});
</script>

<style scoped></style>
<style>
.xterm .xterm-viewport {
  overflow-y: auto;
}
.xterm-viewport::-webkit-scrollbar {
  background-color: #2f2f2f;
  width: 10px;
}

.xterm-viewport::-webkit-scrollbar-thumb {
  background: #545a5e;
}
.xterm-viewport::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  background: #2f2f2f;
}
</style>
