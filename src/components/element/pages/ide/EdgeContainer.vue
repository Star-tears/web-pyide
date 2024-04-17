<template>
  <div class="size-full">
    <div id="xterm" class="xterm"></div>
  </div>
</template>

<script setup lang="ts">
import { Terminal } from '@xterm/xterm';
onMounted(() => {
  var term = new Terminal();
  term.open(document.getElementById('xterm'));
  term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
});
</script>

<style scoped></style>
