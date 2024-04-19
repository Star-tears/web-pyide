import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useWsStore } from '@/stores/websocket';
import { IDE_CMD_TYPES } from '@/types/ide';
import path from 'path-browserify';

export const useIdeStore = defineStore('ide', () => {
  const wsStore = useWsStore();
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
    edgeContainerValue: null
  });

  const setCurrentKey = (key: string) => {
    ideInfo.value.selectKeys = [key];
    ideInfo.value.nodeSelected = getCurrentNode();
    console.log(ideInfo.value);
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
    ideInfo.value.codeItems = codeItems;
    if (ideInfo.value.currProj.pathSelected.indexOf(folderPath) === 0) {
      ideInfo.value.currProj.pathSelected = codeItems.length > 0 ? codeItems[0].path : '';
    }
    const expandedKeys = [];
    for (let i = 0; i < ideInfo.value.currProj.expandedKeys.length; i++) {
      if (ideInfo.value.currProj.expandedKeys[i].indexOf(folderPath) !== 0) {
        expandedKeys.push(ideInfo.value.currProj.expandedKeys[i]);
      }
    }
    ideInfo.value.currProj.expandedKeys = expandedKeys;
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
    ideInfo.value.nodeSelected.children.push({
      name: name,
      label: name,
      key: path,
      path: path,
      type: type,
      children: []
    });
    ideInfo.value.currProj.expandedKeys.push(ideInfo.value.nodeSelected.path);
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
      ideInfo.value.currProj.expandedKeys.push(path);
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

  const ide_list_projects = ({
    wsKey,
    msgId,
    callback
  }: {
    wsKey?: string;
    msgId?: number;
    callback?: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      msgId: msgId,
      cmd: IDE_CMD_TYPES.IDE_LIST_PROJECTS,
      data: {},
      callback: callback
    });
  };
  const ide_get_project = ({
    wsKey,
    projectName,
    callback
  }: {
    wsKey?: string;
    projectName: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_GET_PROJECT,
      data: {
        projectName: projectName
      },
      callback: callback
    });
  };
  const ide_create_project = ({
    wsKey,
    projectName,
    callback
  }: {
    wsKey: string;
    projectName: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_CREATE_PROJECT,
      data: {
        projectName: projectName
      },
      callback: callback
    });
  };
  const ide_delete_project = ({
    wsKey,
    projectName,
    callback
  }: {
    wsKey: string;
    projectName: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_DEL_PROJECT,
      data: {
        projectName: projectName
      },
      callback: callback
    });
  };
  const ide_rename_project = ({
    wsKey,
    oldName,
    newName,
    callback
  }: {
    wsKey: string;
    oldName: string;
    newName: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_RENAME_PROJECT,
      data: {
        oldName: oldName,
        newName: newName
      },
      callback: callback
    });
  };
  const ide_save_project = ({ wsKey, callback }: { wsKey?: string; callback?: any }) => {
    const openList = [];
    for (let i = 0; i < ideInfo.value.codeItems.length; i++) {
      openList.push(ideInfo.value.codeItems[i].path);
    }
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_SAVE_PROJECT,
      data: {
        projectName: ideInfo.value.currProj.data.name,
        expendKeys: ideInfo.value.currProj.expandedKeys,
        openList: openList,
        selectFilePath: ideInfo.value.currProj.pathSelected
      },
      callback: callback
    });
  };
  const ide_create_file = ({
    wsKey,
    projectName,
    parentPath,
    fileName,
    callback
  }: {
    wsKey: string;
    projectName: string;
    parentPath: string;
    fileName: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_CREATE_FILE,
      data: {
        projectName: projectName || ideInfo.value.currProj.data.name,
        parentPath: parentPath || ideInfo.value.nodeSelected.path,
        fileName: fileName
      },
      callback: callback
    });
  };
  const ide_write_file = ({
    wsKey,
    projectName,
    filePath,
    fileData,
    complete,
    line,
    column,
    callback
  }: {
    wsKey?: string;
    projectName?: string;
    filePath: string;
    fileData: any;
    complete?: any;
    line?: any;
    column?: any;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_WRITE_FILE,
      data: {
        projectName: projectName || ideInfo.value.currProj.data.name,
        filePath: filePath,
        fileData: fileData,
        complete: complete,
        line: line,
        column: column
      },
      callback: callback
    });
  };
  const ide_get_file = ({
    wsKey,
    projectName,
    filePath,
    callback
  }: {
    wsKey?: string;
    projectName?: string;
    filePath: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_GET_FILE,
      data: {
        projectName: projectName || ideInfo.value.currProj.data.name,
        filePath: filePath
      },
      callback: callback
    });
  };
  const ide_delete_file = ({
    wsKey,
    projectName,
    filePath,
    callback
  }: {
    wsKey: string;
    projectName: string;
    filePath: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_DEL_FILE,
      data: {
        projectName: projectName || ideInfo.value.currProj.data.name,
        filePath: filePath
      },
      callback: callback
    });
  };
  const ide_rename_file = ({
    wsKey,
    projectName,
    oldPath,
    fileName,
    callback
  }: {
    wsKey: string;
    projectName: string;
    oldPath: string;
    fileName: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_RENAME_FILE,
      data: {
        projectName: projectName || ideInfo.value.currProj.data.name,
        oldPath: oldPath || ideInfo.value.nodeSelected.path,
        newName: fileName
      },
      callback: callback
    });
  };
  const ide_create_folder = ({
    wsKey,
    projectName,
    parentPath,
    folderName,
    callback
  }: {
    wsKey: string;
    projectName: string;
    parentPath: string;
    folderName: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_CREATE_FOLDER,
      data: {
        projectName: projectName || ideInfo.value.currProj.data.name,
        parentPath: parentPath || ideInfo.value.nodeSelected.path,
        folderName: folderName
      },
      callback: callback
    });
  };
  const ide_delete_folder = ({
    wsKey,
    projectName,
    folderPath,
    callback
  }: {
    wsKey: string;
    projectName: string;
    folderPath: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_DEL_FOLDER,
      data: {
        projectName: projectName || ideInfo.value.currProj.data.name,
        folderPath: folderPath
      },
      callback: callback
    });
  };
  const ide_rename_folder = ({
    wsKey,
    projectName,
    oldPath,
    folderName,
    callback
  }: {
    wsKey: string;
    projectName: string;
    oldPath: string;
    folderName: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_RENAME_FOLDER,
      data: {
        projectName: projectName || ideInfo.value.currProj.data.name,
        oldPath: oldPath || ideInfo.value.nodeSelected.path,
        newName: folderName
      },
      callback: callback
    });
  };
  const autocomplete_python = ({
    wsKey,
    source,
    line,
    column,
    callback
  }: {
    wsKey: string;
    source: any;
    line: any;
    column: any;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_AUTOCOMPLETE_PYTHON,
      data: {
        source: source,
        line: line,
        column: column
      },
      callback: callback
    });
  };
  const run_pip_command = ({
    wsKey,
    msgId,
    command,
    callback
  }: {
    wsKey: string;
    msgId: number;
    command: any;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      msgId: msgId,
      cmd: IDE_CMD_TYPES.IDE_RUN_PIP_COMMAND,
      data: {
        command: command
      },
      callback: callback
    });
  };
  const run_python_program = ({
    wsKey,
    msgId,
    projectName,
    filePath,
    callback
  }: {
    wsKey: string;
    msgId: number;
    projectName: string;
    filePath: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      msgId: msgId,
      cmd: IDE_CMD_TYPES.IDE_RUN_PYTHON_PROGRAM,
      data: {
        projectName: projectName || ideInfo.value.currProj.data.name,
        filePath: filePath
      },
      callback: callback
    });
  };
  const stop_python_program = ({
    wsKey,
    consoleId,
    callback
  }: {
    wsKey: string;
    consoleId: any;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_STOP_PYTHON_PROGRAM,
      data: {
        program_id: consoleId
      },
      callback: callback
    });
  };
  const get_python_pkg_installed_list = ({
    wsKey,
    callback
  }: {
    wsKey?: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_GET_PYTHON_PKG_INSTALLED_LIST,
      data: {},
      callback: callback
    });
  };
  const install_python_package = ({
    wsKey,
    pkgListStr,
    callback
  }: {
    wsKey: string;
    pkgListStr: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_INSTALL_PYTHON_PACKAGE,
      data: {
        args_str: pkgListStr
      },
      callback: callback
    });
  };
  const install_py_pkg_by_local_file = ({
    wsKey,
    fileName,
    fileBase64,
    callback
  }: {
    wsKey: string;
    fileName: string;
    fileBase64: string;
    callback: any;
  }) => {
    wsStore.sendCmdWs({
      wsKey: wsKey,
      cmd: IDE_CMD_TYPES.IDE_INSTALL_PY_PKG_BY_LOCAL_FILE,
      data: {
        file_name: fileName,
        file_base64: fileBase64
      },
      callback: callback
    });
  };
  return {
    ideInfo,
    handleProjects,
    ide_list_projects,
    setTreeRef,
    setNodeSelected,
    ide_get_project,
    handleProject,
    setCurrentKey,
    getCurrentNode,
    ide_get_file,
    handleGetFile,
    ide_save_project,
    setPathSelected,
    setCodeSelected,
    setConsoleSelected,
    setConsoleItems,
    setCodeItems,
    setCodeItemContent,
    ide_write_file,
    get_python_pkg_installed_list,
    setPythonPkgInstalledList
  };
});
