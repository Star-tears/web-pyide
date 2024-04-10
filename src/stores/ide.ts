import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useIdeStore = defineStore('ide', () => {
  const ideInfo = ref<Record<string, any>>({
    codeHeight: 0,
    codeItems: [],
    consoleItems: [],
    codeSelected: {},
    consoleSelected: {},
    consoleId: 10001,
    currProj: {
      config: {},
      data: {},
      expandedKeys: [],
      pathSelected: null
    },
    treeRef: null,
    nodeSelected: null,
    projList: [],
    pythonPkgInstalledList: []
  });

  const handleProjects = (data: any) => {
    ideInfo.value.projList = data;
    let lastAccessTime = 0;
    for (let i = 0; i < ideInfo.value.projList.length; i++) {
      if (ideInfo.value.projList[i].lastAccessTime > lastAccessTime) {
        lastAccessTime = ideInfo.value.projList[i].lastAccessTime;
        ideInfo.value.currProj.config.name = ideInfo.value.projList[i].name;
      }
    }
  };

  return { ideInfo, handleProjects };
});
