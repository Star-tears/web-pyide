<template>
  <div ref="terminalContainer" class="size-full">
    <div id="xterm" class="xterm size-full"></div>
  </div>
</template>

<script setup lang="ts">
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { useElementSize } from '@vueuse/core';
const terminalContainer = ref(null);
const { width, height } = useElementSize(terminalContainer);

const terminal = new Terminal();
const fitAddon = new FitAddon();

terminal.loadAddon(fitAddon);

onMounted(() => {
  terminal.open(document.getElementById('xterm'));
  terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
});
watch(width, async () => {
  fitAddon.fit();
});
watch(height, async () => {
  fitAddon.fit();
});
</script>

<style scoped></style>
