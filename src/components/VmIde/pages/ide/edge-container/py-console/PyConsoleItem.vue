<template>
  <div ref="pyConsoleItemContainer" class="size-full">
    <div :id="'xterm-py-console-' + props.taskId" class="xterm size-full"></div>
  </div>
</template>

<script setup lang="ts">
import { Terminal } from '@xterm/xterm';
import { onKeyStroke, useElementSize } from '@vueuse/core';
import { Atom, Dracula, Github, MaterialDark, Chalkboard } from 'xterm-theme';
import xtermTheme from 'xterm-theme';
import { FitAddon } from '@xterm/addon-fit';
import { AttachAddon } from '@xterm/addon-attach';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';

interface Props {
  taskId: string;
}

const props = defineProps<Props>();

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);

const pyConsoleItemContainer = ref(null);
const { width, height } = useElementSize(pyConsoleItemContainer);

onMounted(() => {
  const term = new Terminal({
    theme: Atom,
    cursorBlink: true,
    disableStdin: false,
    scrollback: 100,
    convertEol: true
  });
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  const loc = window.location;
  let new_uri;
  if (loc.protocol === 'https:') {
    new_uri = 'wss:';
  } else {
    new_uri = 'ws:';
  }
  if (import.meta.env.DEV) {
    const server_host = import.meta.env.VITE_SERVER_HOST;
    new_uri += '//' + server_host + '/api/v1/ws/pythonConsole' + '?taskId=' + props.taskId;
  } else {
    new_uri += '//' + loc.host + '/api/v1/ws/pythonConsole' + '?taskId=' + props.taskId;
  }
  const socket = new WebSocket(new_uri);

  const attachAddon = new AttachAddon(socket);
  term.loadAddon(attachAddon);
  term.open(document.getElementById('xterm-py-console-' + props.taskId));
  onUnmounted(() => {
    socket.close();
  });
  watch(width, async () => {
    fitAddon.fit();
  });
  watch(height, async () => {
    fitAddon.fit();
  });
});
</script>

<style scoped></style>
