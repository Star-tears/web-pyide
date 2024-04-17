import { NIcon } from 'naive-ui';
import { FileTrayFullOutline } from '@vicons/ionicons5';
import { Icon } from '@iconify/vue';

export const getFileIcon = (key: string) => {
  const ext_name = key.substring(key.lastIndexOf('.') + 1);
  return h(NIcon, null, {
    default: () => {
      switch (ext_name) {
        case 'py':
          return h(Icon, { icon: 'vscode-icons:file-type-python' });
        case 'md':
          return h(Icon, { icon: 'vscode-icons:file-type-markdown' });
        case 'c':
          return h(Icon, { icon: 'vscode-icons:file-type-c2' });
        case 'cpp':
          return h(Icon, { icon: 'vscode-icons:file-type-cpp3' });
        case 'h':
          return h(Icon, { icon: 'vscode-icons:file-type-cheader' });
        case 'css':
          return h(Icon, { icon: 'vscode-icons:file-type-css' });
        case 'less':
          return h(Icon, { icon: 'vscode-icons:file-type-less' });
        case 'sass':
          return h(Icon, { icon: 'vscode-icons:file-type-sass' });
        case 'hpp':
          return h(Icon, { icon: 'vscode-icons:file-type-cppheader' });
        case 'sh':
          return h(Icon, { icon: 'vscode-icons:file-type-powershell' });
        case 'vue':
          return h(Icon, { icon: 'vscode-icons:file-type-vue' });
        case 'html':
          return h(Icon, { icon: 'vscode-icons:file-type-html' });
        case 'ts':
          return h(Icon, { icon: 'vscode-icons:file-type-typescript-official' });
        case 'js':
          return h(Icon, { icon: 'vscode-icons:file-type-js-official' });
        case 'cs':
          return h(Icon, { icon: 'vscode-icons:file-type-csharp2' });
        case 'java':
          return h(Icon, { icon: 'vscode-icons:file-type-java' });
        default:
          return h(FileTrayFullOutline);
      }
    }
  });
};
