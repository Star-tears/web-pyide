<template>
  <div>
    <NConfigProvider :theme="darkTheme">
      <slot />
      <NGlobalStyle />
    </NConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { NConfigProvider, NGlobalStyle } from 'naive-ui';
import { darkTheme } from 'naive-ui';
</script>

<style scoped></style>
