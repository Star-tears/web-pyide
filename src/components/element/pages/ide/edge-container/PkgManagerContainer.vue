<template>
  <div class="size-full flex flex-col">
    <div class="h-11 flex flex-row items-center">
      <div class="font-semibold text-lg mb-2 ml-4">Python 包管理</div>
    </div>
    <Separator />
    <div class="flex-grow h-0">
      <div class="size-full flex flex-row">
        <div class="min-w-80 w-4/12 h-full">
          <NScrollbar>
            <div class="m-2">
              <NCard hoverable>
                <NCollapse default-expanded-names="1">
                  <NCollapseItem title="已安装" name="1">
                    <template #header-extra>
                      <NTag type="success" size="small">
                        {{ ideInfo.pythonPkgInstalledList.length + ' 个' }}
                      </NTag></template
                    >
                    <NList hoverable>
                      <template
                        v-for="(item, index) in ideInfo.pythonPkgInstalledList"
                        :key="'py-pkg-installed-' + index"
                      >
                        <NListItem>
                          <div class="flex justify-between">
                            <div class="select-none text-sm">{{ item.name }}</div>
                            <NTag :bordered="false" type="info" size="small">
                              {{ item.version }}
                            </NTag>
                          </div>
                        </NListItem>
                      </template>
                    </NList>
                  </NCollapseItem>
                </NCollapse>
              </NCard>
            </div>
          </NScrollbar>
        </div>
        <Separator orientation="vertical" />
        <div class="flex-grow w-0 h-full">
          <NScrollbar>
            <div class="m-2">
              <NCard hoverable content-style="padding: 0;">
                <NTabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
                  <NTabPane name="指令安装">
                    <NForm
                      ref="formRef"
                      :model="model"
                      label-placement="left"
                      :style="{
                        maxWidth: '640px'
                      }"
                    >
                      <NFormItem label="pip install" path="inputValue">
                        <NInput
                          v-model:value="model.inputValue"
                          placeholder="输入包名，可同时安装多个包，空格作为分隔符"
                          clearable
                        />
                        <NButton
                          style="margin-left: 12px"
                          :loading="pipInstallLoading"
                          @click="installPythonPackage"
                        >
                          安装
                        </NButton>
                      </NFormItem>
                    </NForm>
                  </NTabPane>
                  <NTabPane name="本地安装">
                    <NButton class="w-full mb-2">上传并安装</NButton>
                    <NUpload
                      multiple
                      directory-dnd
                      accept=".tar.gz,.tar.bz2,.egg,.zip,.whl"
                      :max="5"
                    >
                      <NUploadDragger>
                        <div style="margin-bottom: 12px">
                          <n-icon size="48" :depth="3">
                            <ArchiveIcon />
                          </n-icon>
                        </div>
                        <n-text style="font-size: 16px">
                          点击或者拖动文件到该区域来准备上传
                        </n-text>
                        <n-p depth="3" style="margin: 8px 0 0 0">
                          可上传一个python安装包安装, 支持.tar.gz, .tar.bz2, .egg, .zip, .whl包
                        </n-p>
                      </NUploadDragger>
                    </NUpload>
                  </NTabPane>
                </NTabs>
              </NCard>
            </div>
          </NScrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NCollapse,
  NCollapseItem,
  NList,
  NListItem,
  NScrollbar,
  NTag,
  NCard,
  NTabs,
  NTabPane,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NUpload,
  NUploadDragger
} from 'naive-ui';
import { useIdeStore } from '@/stores/ide';
import { storeToRefs } from 'pinia';
import { Separator } from '@/components/ui/separator';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';

const ideStore = useIdeStore();
const { ideInfo } = storeToRefs(ideStore);
const model = ref({
  inputValue: null
});
const pipInstallLoading = ref(false);

onMounted(() => {
  refreshPkgInstalledList();
  setInterval(() => {
    refreshPkgInstalledList();
  }, 5000);
});

const refreshPkgInstalledList = () => {
  ideStore.get_python_pkg_installed_list({
    callback: (dict: any) => {
      if (dict.code == 0) {
        ideStore.setPythonPkgInstalledList(dict.data);
      }
    }
  });
};
const installPythonPackage = () => {
  pipInstallLoading.value = true;
  ideStore.install_python_package({
    pkgListStr: model.value.inputValue,
    callback: {
      callback: () => {
        setTimeout(() => {
          pipInstallLoading.value = false;
          refreshPkgInstalledList();
        }, 1000);
      }
    }
  });
};
</script>

<style scoped></style>
