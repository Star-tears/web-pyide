import { defineStore } from 'pinia';
import { ref } from 'vue';
import path from 'path-browserify';
import { IdeService } from '@/client';
import { useDebounceFn } from '@vueuse/core';

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
    selectKeys: [],
    nodeSelected: null,
    projList: [],
    pythonPkgInstalledList: [],
    edgeContainerValue: null,
    activePyTaskIdValue: '',
    taskIdList: [],
    taskInfoDict: {}
  });

  const getCurrentProj = () => {
    return ideInfo.value.currProj.data.label;
  };
  const toPyTaskView = (taskId: string) => {
    if (!ideInfo.value.taskIdList.includes(taskId)) {
      ideInfo.value.taskIdList.push(taskId);
    }
    ideInfo.value.edgeContainerValue = 'py-console';
    ideInfo.value.activePyTaskIdValue = taskId;
  };
  const refreshTaskInfoDict = () => {
    IdeService.ideGetTaskInfoDict().then((res) => {
      ideInfo.value.taskInfoDict = res.data;
    });
  };
  const killPyTask = (taskId?: string) => {
    IdeService.ideKillPythonProgram({
      requestBody: {
        taskId: taskId ? taskId : ideInfo.value.activePyTaskIdValue
      }
    }).then((res) => {
      if (res.code == 0) {
        refreshTaskIdList();
        refreshTaskInfoDict();
      }
    });
  };
  const reloadPyTask = (taskId?: string) => {
    IdeService.ideReloadPythonProgram({
      requestBody: {
        taskId: taskId ? taskId : ideInfo.value.activePyTaskIdValue
      }
    }).then((res) => {
      if (res.code == 0) {
        refreshTaskInfoDict();
      }
    });
  };
  const stopPyTask = (taskId?: string) => {
    IdeService.ideStopPythonProgram({
      requestBody: {
        taskId: taskId ? taskId : ideInfo.value.activePyTaskIdValue
      }
    }).then((res) => {
      if (res.code == 0) {
        refreshTaskInfoDict();
      }
    });
  };
  const runPyTask = () => {
    if (
      ideInfo.value.currProj.config.name &&
      ideInfo.value.currProj.pathSelected &&
      ideInfo.value.currProj.pathSelected.endsWith('.py')
    ) {
      IdeService.ideRunPythonProgram({
        requestBody: {
          projectName: ideInfo.value.currProj.config.name,
          filePath: ideInfo.value.currProj.pathSelected
        }
      }).then((res: any) => {
        if (res.code == 0) {
          refreshTaskIdList();
          toPyTaskView(res.data['taskId']);
          refreshTaskInfoDict();
        }
      });
    }
  };
  const refreshTaskIdList = () => {
    IdeService.ideGetTaskIdList().then((res) => {
      ideInfo.value.taskIdList = res.data;
      if (
        !ideInfo.value.taskIdList.includes(ideInfo.value.activePyTaskIdValue) &&
        ideInfo.value.taskIdList.length > 0
      ) {
        ideInfo.value.activePyTaskIdValue = ideInfo.value.taskIdList[0];
      }
    });
  };
  const setCurrentKey = (key: string) => {
    ideInfo.value.currProj.pathSelected = key;
    ideInfo.value.selectKeys = [key];
    ideInfo.value.nodeSelected = getCurrentNode();
  };
  const getParentNode = (path: string) => {
    let data = ideInfo.value.currProj.data;
    let alive = true;
    while (alive) {
      alive = false;
      for (let i = 0; i < data.children.length; i++) {
        if (data.children[i].path === path) {
          return data;
        } else if (path.indexOf(data.children[i].path) === 0) {
          data = data.children[i];
          alive = true;
          break;
        }
      }
    }
  };
  const getCurrentNode = () => {
    if (!(ideInfo.value.selectKeys || ideInfo.value.selectKeys.length > 0)) return null;
    return findNodeByKey(ideInfo.value.currProj.data, ideInfo.value.selectKeys[0]);
  };
  const findNodeByKey = (node: any, key: string): any => {
    if (node.key === key) {
      return node;
    }
    if (node.children)
      for (const child of node.children) {
        const foundNode = findNodeByKey(child, key);
        if (foundNode) {
          return foundNode;
        }
      }
    return null;
  };
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
  const handleProject = (data: any) => {
    ideInfo.value.codeItems = [];
    ideInfo.value.currProj.expandedKeys = [];
    ideInfo.value.currProj.config = data.config || {};
    ideInfo.value.currProj.data = data;
    ideInfo.value.currProj.pathSelected = ideInfo.value.currProj.config.selectFilePath;
    if (data.config !== undefined && data.config.expendKeys !== undefined) {
      ideInfo.value.currProj.expandedKeys = data.config.expendKeys;
      ideInfo.value.currProj.expandedKeys.sort();
    }
    if (ideInfo.value.currProj.pathSelected) {
      ideInfo.value.nodeSelected = getCurrentNode();
    }
  };
  const handleDelProject = (projectName: string) => {
    for (let i = 0; i < ideInfo.value.projList.length; i++) {
      if (ideInfo.value.projList[i].name === projectName) {
        ideInfo.value.projList.splice(i, 1);
        break;
      }
    }
    if (ideInfo.value.currProj.config.name === projectName) {
      ideInfo.value.codeItems = [];
      ideInfo.value.currProj.data = {};
      ideInfo.value.currProj.expandedKeys = [];
      ideInfo.value.currProj.pathSelected = '';
    }
  };
  const handleDelFolder = ({ parentData, folderPath }: { parentData: any; folderPath: string }) => {
    for (let i = 0; i < parentData.children.length; i++) {
      if (parentData.children[i].path === folderPath) {
        parentData.children.splice(i, 1);
        break;
      }
    }
    const codeItems = [];
    for (let i = 0; i < ideInfo.value.codeItems.length; i++) {
      if (ideInfo.value.codeItems[i].path.indexOf(folderPath) !== 0) {
        codeItems.push(ideInfo.value.codeItems[i]);
      }
    }
    ideInfo.value.codeItems.value = codeItems;
    if (ideInfo.value.currProj.pathSelected.indexOf(folderPath) === 0) {
      ideInfo.value.currProj.pathSelected = codeItems.length > 0 ? codeItems[0].path : '';
    }
    const expandedKeys = [];
    for (let i = 0; i < ideInfo.value.currProj.expandedKeys.length; i++) {
      if (ideInfo.value.currProj.expandedKeys[i].indexOf(folderPath) !== 0) {
        expandedKeys.push(ideInfo.value.currProj.expandedKeys[i]);
      }
    }
    ideInfo.value.currProj.expandedKeys.value = expandedKeys;
  };
  const handleGetFile = ({
    filePath,
    data,
    save
  }: {
    filePath: string;
    data: any;
    save: boolean;
  }) => {
    for (let i = 0; i < ideInfo.value.codeItems.length; i++) {
      if (ideInfo.value.codeItems[i].path === filePath) {
        ideInfo.value.currProj.pathSelected = filePath;
        ideInfo.value.codeSelected = ideInfo.value.codeItems[i];
        return;
      }
    }
    ideInfo.value.codeItems.push({
      name: path.basename(filePath),
      content: data,
      path: filePath,
      codemirror: null
    });
    if (save !== false || ideInfo.value.currProj.pathSelected === filePath) {
      ideInfo.value.currProj.pathSelected = filePath;
      ideInfo.value.codeSelected = ideInfo.value.codeItems[ideInfo.value.codeItems.length - 1];
      // self.saveProject();
      setCurrentKey(ideInfo.value.currProj.pathSelected);
      ideInfo.value.nodeSelected = getCurrentNode();
    }
  };
  const handleDelFile = ({ parentData, filePath }: { parentData: any; filePath: string }) => {
    for (let i = 0; i < ideInfo.value.codeItems.length; i++) {
      if (ideInfo.value.codeItems[i].path === filePath) {
        if (i > 0) {
          ideInfo.value.currProj.pathSelected = ideInfo.value.codeItems[i - 1].path;
        } else if (i < ideInfo.value.codeItems.length - 1) {
          ideInfo.value.currProj.pathSelected = ideInfo.value.codeItems[i + 1].path;
        }
        ideInfo.value.codeItems.splice(i, 1);
        break;
      }
    }
    if (parentData) {
      for (let i = 0; i < parentData.children.length; i++) {
        if (parentData.children[i].path === filePath) {
          parentData.children.splice(i, 1);
          break;
        }
      }
    }
    // self.saveProject(self.getProject);
  };
  const addChildrenNode = ({ name, path, type }: { name: string; path: string; type: string }) => {
    if (!ideInfo.value.nodeSelected || ideInfo.value.nodeSelected.type !== 'dir') return;
    if (type === 'dir') {
      ideInfo.value.nodeSelected.children.push({
        name: name,
        label: name,
        key: path,
        path: path,
        type: type,
        uuid: path,
        children: []
      });
    } else {
      ideInfo.value.nodeSelected.children.push({
        name: name,
        label: name,
        key: path,
        path: path,
        type: type,
        uuid: path
      });
    }
    // ideInfo.value.currProj.expandedKeys.push(ideInfo.value.nodeSelected.path);
    if (type == 'file') {
      ideInfo.value.currProj.pathSelected = path;

      ideInfo.value.codeItems.push({
        name: name,
        content: '',
        path: path,
        codemirror: null
      });
      ideInfo.value.codeSelected = ideInfo.value.codeItems[ideInfo.value.codeItems.length - 1];
    } else {
      // ideInfo.value.currProj.expandedKeys.push(path);
    }
  };
  const handleRename = (name: string) => {
    if (!ideInfo.value.nodeSelected || !ideInfo.value.nodeSelected.type) return;
    if (ideInfo.value.nodeSelected.path === '/') {
      // rename project
      ideInfo.value.currProj.config.name = name;
      ideInfo.value.currProj.data.name = name;
      ideInfo.value.currProj.data.label = name;
    } else {
      // rename file/folder
      const renameNodeData = (nodeData: any, parentPath: string) => {
        nodeData.path = path.join(parentPath, nodeData.name);
        nodeData.key = nodeData.path;
        nodeData.uuid = nodeData.path;
        if (nodeData.type === 'dir' && nodeData.children) {
          for (let i = 0; i < nodeData.children.length; i++) {
            renameNodeData(nodeData.children[i], nodeData.path);
          }
        }
      };
      const newPath = path.join(path.dirname(ideInfo.value.nodeSelected.path), name);

      // rename code item
      for (let i = 0; i < ideInfo.value.codeItems.length; i++) {
        if (ideInfo.value.codeItems[i].path === ideInfo.value.nodeSelected.path) {
          ideInfo.value.codeItems[i].name = name;
          ideInfo.value.codeItems[i].path = newPath;
        } else if (ideInfo.value.codeItems[i].path.indexOf(ideInfo.value.nodeSelected.path) === 0) {
          ideInfo.value.codeItems[i].path = ideInfo.value.codeItems[i].path.replace(
            ideInfo.value.nodeSelected.path,
            newPath
          );
        }
      }
      // rename console item
      for (let i = 0; i < ideInfo.value.consoleItems.length; i++) {
        if (ideInfo.value.consoleItems[i].path === ideInfo.value.nodeSelected.path) {
          ideInfo.value.consoleItems[i].name = name;
          ideInfo.value.consoleItems[i].path = newPath;
        } else if (
          ideInfo.value.consoleItems[i].path.indexOf(ideInfo.value.nodeSelected.path) === 0
        ) {
          ideInfo.value.consoleItems[i].path = ideInfo.value.consoleItems[i].path.replace(
            ideInfo.value.nodeSelected.path,
            newPath
          );
        }
      }
      // rename expand key
      for (let i = 0; i < ideInfo.value.currProj.expandedKeys.length; i++) {
        if (ideInfo.value.currProj.expandedKeys[i].indexOf(ideInfo.value.nodeSelected.path) === 0) {
          ideInfo.value.currProj.expandedKeys[i] = ideInfo.value.currProj.expandedKeys[i].replace(
            ideInfo.value.nodeSelected.path,
            newPath
          );
        }
      }
      // rename path selected
      if (ideInfo.value.currProj.pathSelected.indexOf(ideInfo.value.nodeSelected.path) === 0) {
        ideInfo.value.currProj.pathSelected = ideInfo.value.currProj.pathSelected.replace(
          ideInfo.value.nodeSelected.path,
          newPath
        );
      }

      // rename node selected name
      ideInfo.value.nodeSelected.name = name;
      ideInfo.value.nodeSelected.label = name;
      // rename node selected path and all children item path
      renameNodeData(ideInfo.value.nodeSelected, path.dirname(ideInfo.value.nodeSelected.path));
    }
  };
  const handleCreateFile = (filePath: string) => {
    ideInfo.value.currProj.expandedKeys.push(filePath);
    ideInfo.value.currProj.pathSelected = filePath;
  };
  const handleCreateFolder = (folderPath: string) => {
    ideInfo.value.currProj.expandedKeys.push(folderPath);
  };
  const handleRunResult = (dict: any) => {
    if (dict.code === 0) {
      if (dict.data === null || dict.data.stdout === undefined || dict.data.stdout === null) {
        // 程序开始, 先把运行状态置为True，把输出清空
        for (let i = 0; i < ideInfo.value.consoleItems.length; i++) {
          if (ideInfo.value.consoleItems[i].id !== dict.id) continue;
          if (!ideInfo.value.consoleItems[i].run) {
            ideInfo.value.consoleItems[i].resultList = [];
          }
          ideInfo.value.consoleItems[i].run = true;
          break;
        }
      } else {
        for (let i = 0; i < ideInfo.value.consoleItems.length; i++) {
          if (ideInfo.value.consoleItems[i].id !== dict.id) continue;
          // 限制保存结果的最大30000行
          if (ideInfo.value.consoleItems[i].resultList.length > 30000) {
            // 超过最大行数，把前100行扔掉
            ideInfo.value.consoleItems[i].resultList.splice(0, 100);
          }
          // 把结果压进结果列表
          ideInfo.value.consoleItems[i].resultList.push(`${dict.data.stdout}`);
          // 限制只刷新选中的Console的结果
          // if (ideInfo.value.consoleSelected.id !== ideInfo.value.consoleItems[i].id && !window.GlobalUtil.model.socketModel.socketInfo.connected) {
          //   break;
          // }
          // const textArea = document.getElementById('console-' + ideInfo.value.consoleItems[i].id)
          // if (textArea !== undefined && textArea !== null) {
          //   textArea.scrollTop = textArea.scrollHeight;
          // }
          break;
        }
      }
    } else {
      // 程序结束，把程序状态置为False，显示所有输出
      for (let i = 0; i < ideInfo.value.consoleItems.length; i++) {
        if (ideInfo.value.consoleItems[i].id !== dict.id) continue;
        // 如果当前终端没有程序在运行，则先清空输出（一般发生在文件不存在或非py文件或输入的命令为空或命令不是字符串）
        if (!ideInfo.value.consoleItems[i].run && !ideInfo.value.consoleItems[i].stop) {
          ideInfo.value.consoleItems[i].resultList = [];
        }
        if (dict.data && dict.data.stdout) {
          ideInfo.value.consoleItems[i].resultList.push(`${dict.data.stdout}`);
        }
        const textArea = document.getElementById('console-' + ideInfo.value.consoleItems[i].id);
        if (textArea !== undefined && textArea !== null) {
          textArea.scrollTop = textArea.scrollHeight;
        }
        ideInfo.value.consoleItems[i].run = false;
        break;
      }
    }
  };
  const handleStopResult = ({ consoleId, dict }: { consoleId: any; dict: any }) => {
    if (dict.code === 0) {
      for (let i = 0; i < ideInfo.value.consoleItems.length; i++) {
        if (consoleId && ideInfo.value.consoleItems[i].id !== consoleId) continue;
        ideInfo.value.consoleItems[i].stop = true;
        ideInfo.value.consoleItems[i].run = false;
      }
    }
  };
  const addExpandNodeKey = (key: any) => {
    if (ideInfo.value.currProj.expandedKeys.indexOf(key) < 0) {
      ideInfo.value.currProj.expandedKeys.push(key);
      // _this.saveProject();
    }
  };
  const delExpandNodeKey = (key: any) => {
    ideInfo.value.currProj.expandedKeys.splice(
      ideInfo.value.currProj.expandedKeys.findIndex((item: any) => item === key),
      1
    );
  };
  const setNodeSelected = (selected: any) => {
    ideInfo.value.nodeSelected = selected;
    // console.log(ideInfo.value);
  };
  const setPathSelected = (selected: any) => {
    ideInfo.value.currProj.pathSelected = selected;
  };
  const setCodeSelected = (selected: any) => {
    ideInfo.value.codeSelected = selected;
  };
  const setConsoleSelected = (selected: any) => {
    ideInfo.value.consoleSelected = selected;
  };
  const setTreeRef = (treeRef: any) => {
    ideInfo.value.treeRef = treeRef;
  };
  const assignConsoleSelected = (item: any) => {
    if (item && typeof item === 'object') Object.assign = (ideInfo.value.consoleSelected, item);
  };
  const spliceConsoleItems = ({ start, count }: { start: any; count: any }) => {
    ideInfo.value.consoleItems.splice(start, count);
  };
  const setConsoleId = (consoleId: any) => {
    ideInfo.value.consoleId = consoleId;
  };
  const addConsoleItem = (item: any) => {
    ideInfo.value.consoleItems.push(item);
  };
  const setConsoleItems = (items: any) => {
    ideInfo.value.consoleItems = items;
  };

  const addCodeItem = (item: any) => {
    ideInfo.value.codeItems.push(item);
  };
  const setCodeItems = (items: any) => {
    ideInfo.value.codeItems = items;
  };
  const setCodeItemMirror = ({ index, codemirror }: { index: any; codemirror: any }) => {
    ideInfo.value.codeItems[index].codemirror = codemirror;
  };
  const setCodeItemContent = ({ index, content }: { index: any; content: any }) => {
    ideInfo.value.codeItems[index].content = content;
  };
  const setCodeHeight = (height: number) => {
    ideInfo.value.codeHeight = height;
  };
  const setPythonPkgInstalledList = (pkg_list: any) => {
    ideInfo.value.pythonPkgInstalledList = pkg_list;
  };

  const ide_save_project = () => {
    ide_save_project_debouncedFn();
  };
  const ide_save_project_debouncedFn = useDebounceFn(
    () => {
      const openList = [];
      for (let i = 0; i < ideInfo.value.codeItems.length; i++) {
        openList.push(ideInfo.value.codeItems[i].path);
      }
      IdeService.ideIdeSaveProject({
        requestBody: {
          projectName: ideInfo.value.currProj.data.name,
          expendKeys: ideInfo.value.currProj.expandedKeys,
          openList: openList,
          selectFilePath: ideInfo.value.currProj.pathSelected
        }
      });
    },
    1000,
    { maxWait: 5000 }
  );

  return {
    ideInfo,
    handleProjects,
    setTreeRef,
    setNodeSelected,
    handleProject,
    setCurrentKey,
    getCurrentNode,
    handleGetFile,
    setPathSelected,
    setCodeSelected,
    setConsoleSelected,
    setConsoleItems,
    setCodeItems,
    setCodeItemContent,
    setPythonPkgInstalledList,
    ide_save_project,
    refreshTaskIdList,
    runPyTask,
    stopPyTask,
    reloadPyTask,
    killPyTask,
    refreshTaskInfoDict,
    toPyTaskView,
    handleRename,
    getCurrentProj,
    handleDelFile,
    handleDelFolder,
    handleDelProject,
    getParentNode,
    addChildrenNode
  };
});
