<template>
  <div>
    <TopMenuItemBase label="文件(F)">
      <DropdownMenuItem @click="openCreateProjDialog">新建工作区</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="openProjsDialog">切换工作区</DropdownMenuItem>
    </TopMenuItemBase>
  </div>
</template>

<script setup lang="ts">
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
import { useDialog } from 'naive-ui';
import ProjsDialog from '@/components/VmIde/pages/ide/dialog/ProjsDialog.vue';
import CreateProjDialog from '@/components/VmIde/pages/ide/dialog/CreateProjDialog.vue';
import { IdeService } from '@/client';
const dialog = useDialog();
const message = useMessage();

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const createNewProjName = ref('');

const openCreateProjDialog = () => {
  createNewProjName.value = '';
  const d = dialog.success({
    title: '新建文件',
    content: () =>
      h(CreateProjDialog, {
        newProjNameValue: createNewProjName.value,
        'onUpdate:newProjNameValue': (v) => (createNewProjName.value = v)
      }),
    positiveText: '确认创建',
    onPositiveClick: () => {
      d.loading = true;
      return new Promise((resolve) => {
        if (createNewProjName.value === '') {
          message.error('工作区名不能为空');
          setTimeout(resolve, 10);
        } else {
          createProject(createNewProjName.value).then(resolve);
        }
      });
    }
  });
};
const openProjsDialog = () => {
  dialog.info({
    title: '选择项目',
    content: () => h(ProjsDialog, null),
    positiveText: '确认',
    style: {
      width: '70%',
      maxWidth: '700px'
    },
    onPositiveClick: () => {}
  });
};

const createProject = (projectName: string) => {
  return IdeService.ideIdeCreateProject({
    requestBody: {
      projectName: projectName
    }
  }).then((res) => {
    if (res.code == 0) {
      message.success('创建成功');
      IdeService.ideIdeListProjects().then((res) => {
        if (res.code == 0) {
          ideStore.handleProjects(res.data);
          if (projectName) {
            getProject(projectName);
          }
        }
      });
    }
  });
};

const getProject = (name?: any) => {
  IdeService.ideIdeGetProject({
    requestBody: { projectName: name === undefined ? ideInfo.value.currProj.config.name : name }
  }).then((res) => {
    if (res.code == 0) {
      ideStore.handleProject(res.data);
      for (var i = 0; i < ideInfo.value.currProj.config.openList.length; i++) {
        getFile(ideInfo.value.currProj.config.openList[i], false);
      }
    }
  });
};
const getFile = (path: string, save: boolean) => {
  IdeService.ideIdeGetFile({
    requestBody: {
      filePath: path,
      projectName: ideInfo.value.currProj.data.name
    }
  }).then((res) => {
    if (res.code == 0) {
      ideStore.handleGetFile({
        filePath: path,
        data: res.data,
        save: save
      });
      if (save !== false) ideStore.ide_save_project();
    }
  });
};
</script>

<style scoped></style>
