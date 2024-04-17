<template>
  <div class="size-full">
    <div id="xterm" class="xterm size-full"></div>
  </div>
</template>

<script setup lang="ts">
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';

onMounted(() => {
  const terminal = new Terminal();
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(document.getElementById('xterm'));
  fitAddon.fit();
  terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
});
</script>

<style scoped></style>
