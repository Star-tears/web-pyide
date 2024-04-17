<template>
  <div>
    <TopMenuItemBase label="文件(F)">
      <DropdownMenuItem>新建文件</DropdownMenuItem>
      <DropdownMenuItem>新建文件夹</DropdownMenuItem>
      <DropdownMenuItem>重命名</DropdownMenuItem>
      <DropdownMenuItem>删除文件</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>切换工作区</DropdownMenuItem>
    </TopMenuItemBase>
  </div>
</template>

<script setup lang="ts">
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
</script>

<style scoped></style>
