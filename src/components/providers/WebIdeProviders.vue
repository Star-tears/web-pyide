<template>
  <div>
    <NConfigProvider :theme="darkTheme">
      <NMessageProvider>
        <NDialogProvider>
          <slot />
        </NDialogProvider>
      </NMessageProvider>
      <NGlobalStyle />
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { NConfigProvider, NGlobalStyle, NDialogProvider, NMessageProvider } from 'naive-ui';
import { darkTheme } from 'naive-ui';
import { useColorMode } from '@vueuse/core';

const mode = useColorMode();
mode.value = 'dark';
</script>

<style scoped></style>
