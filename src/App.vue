<template>
  <div>
    <Providers>
      <RouterView />
    </Providers>
  </div>
</template>

<script setup lang="ts">
import Providers from '@/components/providers/WebIdeProviders.vue';
</script>

<style scoped></style>
