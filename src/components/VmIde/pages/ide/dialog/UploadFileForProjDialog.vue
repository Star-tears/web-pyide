<template>
  <div>
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-1 items-center">
        <div>父路径:</div>
        <n-tag type="info"> {{ props.parentPath }} </n-tag>
      </div>
      <n-upload
        ref="uploadRef"
        multiple
        directory-dnd
        :action="
          '/api/v1/ide/upload-file-for-proj?projName=' +
          props.projName +
          '&dirPath=' +
          props.parentPath
        "
        :default-upload="false"
        :on-finish="onFileUploadFinish"
        :on-error="onFileUploadError"
        :on-update:file-list="onUpdateFileList"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <archive-icon />
            </n-icon>
          </div>
          <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
          <n-p depth="3" style="margin: 8px 0 0 0"> 可上传多个文件 </n-p>
        </n-upload-dragger>
      </n-upload>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NUpload, NUploadDragger, NTag, NIcon, NText, type UploadFileInfo } from 'naive-ui';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
import path from 'path-browserify';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
interface Props {
  parentPath: string;
  projName: string;
}

const props = withDefaults(defineProps<Props>(), {
  parentPath: '/'
});

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const fileCount = ref(0);
const uploadCount = ref(0);
const uploadRef = ref<InstanceType<typeof NUpload>>();

const onFileUploadFinish = (options: { file: UploadFileInfo; event?: ProgressEvent }) => {
  const filePath = path.resolve(props.parentPath, options.file.name);
  ideStore.addChildrenNode({ name: options.file.name, path: filePath, type: 'file' });
  ++uploadCount.value;
};
const onFileUploadError = (options: { file: UploadFileInfo; event?: ProgressEvent }) => {
  ++uploadCount.value;
};
const onUpdateFileList = (fileList: UploadFileInfo[]) => {
  fileCount.value = fileList.length;
};
const waitUpload = async () => {
  if (fileCount.value == uploadCount.value) {
    return;
  }

  // 模拟异步操作，比如从外部获取计数器的更新
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 这里假设每秒检查一次

  // 递归调用自身，直到条件满足
  await waitUpload();
};

const startUpload = async () => {
  uploadRef.value?.submit();
  await waitUpload();
};

defineExpose({
  startUpload
});
</script>

<style scoped></style>
