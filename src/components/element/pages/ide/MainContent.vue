<template>
  <div>
    <ResizablePanelGroup direction="vertical" class="w-full rounded-lg border">
      <ResizablePanel :default-size="70">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel :default-size="25">
            <ProjTree />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel :default-size="75">
            <ScrollArea class="h-full items-center justify-center">
              <div v-for="tag in Array.from({ length: 50 }, () => 'test')" :key="tag">
                <div class="text-sm">
                  {{ tag }}
                </div>
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel :default-size="30">
        <ScrollArea class="h-full items-center justify-center"
          ><div class="flex h-[200px] items-center justify-center p-6">
            <span class="font-semibold">One</span>
          </div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>

<script setup lang="ts">
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import ProjTree from '@/components/element/pages/ide/ProjTree.vue'
</script>

<style scoped></style>
