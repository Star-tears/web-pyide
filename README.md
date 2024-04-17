# PyIDE

---

> 一个简易的在线Python的IDE  
> 基于Vue3 + Python3.10 + Tornado6.1实现  
> 前后端分离  
> 重构方向Vite + Vue3 + Python3.10 + FastAPI

## 功能说明

- 支持工程、文件、文件夹的增删查改
- 支持Python代码基本补全
- 支持Python代码(GUI不支持)运行管理和输出
- 支持Markdown文件的编辑和预览

## 更新说明

- 基于Vue3+Python3.10的全新实现
- 引入markdown编辑器
- 引入图标vscode-icons
- 更改编辑器主题

## 编译和运行

### 环境

- Node: 20.12.1
- Yarn: 1.22.22
- Python: 3.10
- FastAPI(后端还未重构，目前仍为Tornado: 6.1)

### 前端

```bash
yarn install

# 开发运行(默认端口是8080)
yarn dev

# 打包编译(默认打包的路径在dist目录，后端程序已经配置从该目录加载资源)
yarn build
```

### 后端

```bash
# 假定已经安装好Python环境（建议使用虚拟Python环境并激活）

# 进入后端目录
cd server

# 安装依赖
pip install -r requirements.txt

# 运行（运行端口为10086）指定端口可以使用参数 --port=10010
# 如果前端页面是独立运行的，不可指定后端端口（除非修改前端代码）
python server.py

# 访问 (工程保存在projects/ide里面)
# 开发运行前端的情况: localhost:8080
# 打包好前端的情况: localhost:10086
pyinstaller server.py
```

## 重构进度

### 前端

- [x] 布局，可拖拽调节网格之间比例
- [x] 状态管理从Vuex迁移至Pinia，wsStore，ideStore
- [x] ProjTree绑定文件目录，切换文件
- [x] CodeTabs切换文件
- [x] 代码编辑器读取文件内容
- [x] 代码编辑器写入文件
- [x] 文件树图标、tab栏图标
- [ ] 在终端运行代码
- [ ] 文件、文件夹创建删除等操作

### 后端

在前端重构完毕或即将完成时开启
