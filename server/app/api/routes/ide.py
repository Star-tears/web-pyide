import os
import subprocess
from typing import Any
from distutils.version import StrictVersion

from fastapi import APIRouter
import jedi
from jedi import __version__ as jedi_version

from app.common.config import Config
from app.models.response import ResponseBase
from app.utils.resource import *
from app.models.project_items import *
from app.utils.helper import convert_path

jedi_is_gt_17 = StrictVersion(jedi_version) >= StrictVersion('0.17.0')

router = APIRouter()


@router.get("/ide_list_projects", response_model=ResponseBase)
def ide_list_projects():
    ide_path = os.path.join(Config.PROJECTS, "ide")
    code, projects = list_projects(ide_path)
    return ResponseBase(code=code, data=projects)

@router.post("/ide_get_project", response_model=ResponseBase)
def ide_get_project(data:ProjItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, "ide", prj_name)
    code, project = get_project(prj_path)
    return ResponseBase(code=code, data=project)

@router.post("/ide_create_project", response_model=ResponseBase)
async def ide_create_project(data:ProjItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, "ide", prj_name)
    code, _ = create_project(
        prj_path,
        config_data={
            "type": "python",
            "expendKeys": ["/"],
            "openList": ["/main.py"],
            "selectFilePath": "/main.py",
        },
    )
    if code == 0:
        write(os.path.join(prj_path, "main.py"), '#!/usr/bin/env python3\n\n')
    return ResponseBase(code=code, data=_)

@router.post("/ide_delete_project", response_model=ResponseBase)
def ide_delete_project(data:ProjItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, "ide", prj_name)
    code, _ = delete(prj_path)
    return ResponseBase(code=code, data=_)

@router.post("/ide_rename_project", response_model=ResponseBase)
def ide_rename_project(data:ProjReNameItem):
    old_name = data.oldName
    old_path = os.path.join(Config.PROJECTS, "ide", old_name)
    new_name = data.newName
    new_path = os.path.join(Config.PROJECTS, "ide", new_name)
    code, _ = rename(old_path, new_path)
    return ResponseBase(code=code, data=_)

@router.post("/ide_save_project", response_model=ResponseBase)
def ide_save_project(data:SaveProjItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, 'ide', prj_name)
    code, _ = save_project(prj_path, data)
    return ResponseBase(code=code, data=_)

@router.post("/ide_create_file", response_model=ResponseBase)
def ide_create_file(data:CreateFileItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, 'ide', prj_name)
    parent_path = convert_path(data.parentPath)
    file_name = data.fileName
    file_path = os.path.join(prj_path, parent_path, file_name)
    code, _ = write_project_file(prj_path, file_path, '')
    return ResponseBase(code=code, data=_)

@router.post("/ide_write_file", response_model=ResponseBase)
def ide_write_file(data:WriteFileItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, 'ide', prj_name)
    file_path = os.path.join(prj_path, convert_path(data.filePath))
    file_data = data.fileData
    code, _ = write_project_file(prj_path, file_path, file_data)
    if data.complete:
        line = data.line
        column = data.column
        line = line + 1 if line is not None else line
        completions = set()
        if jedi_is_gt_17:
            script = jedi.api.Script(code=file_data, path=file_path,
                                        project=jedi.api.Project(file_path, added_sys_path=[]))
            for completion in script.complete(line=line, column=column):
                completions.add(completion.name)
        else:
            script = jedi.api.Script(source=file_data, line=line, column=column, path=file_path)
            completions = set()
            for completion in script.completions():
                completions.add(completion.name)
        return ResponseBase(code=0, data=list(completions))
    else:
        return ResponseBase(code=code, data=_)
    
@router.post("/ide_get_file", response_model=ResponseBase)
def ide_get_file(data:FileItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, 'ide', prj_name)
    file_path = os.path.join(prj_path, convert_path(data.filePath))
    code, file_data = get_project_file(prj_path, file_path)
    return ResponseBase(code=code, data=file_data)

@router.post("/ide_delete_file", response_model=ResponseBase)
def ide_delete_file(data:FileItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, 'ide', prj_name)
    file_path = os.path.join(prj_path, convert_path(data.filePath))
    code, _ = delete_project_file(prj_path, file_path)
    return ResponseBase(code=code, data=_)

@router.post("/ide_rename_file", response_model=ResponseBase)
def ide_rename_file(data:ReNameItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, 'ide', prj_name)
    old_path = os.path.join(prj_path, convert_path(data.oldPath))
    new_name = data.newName
    new_path = os.path.join(os.path.dirname(old_path), new_name)
    code, _ = rename_project_file(prj_path, old_path, new_path)
    return ResponseBase(code=code, data=_)

@router.post("/ide_create_folder", response_model=ResponseBase)
def ide_create_folder(data: CreateFolderItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, 'ide', prj_name)
    parent_path = convert_path(data.parentPath)
    folder_name = data.folderName
    folder_path = os.path.join(prj_path, parent_path, folder_name)
    code, _ = create_project_folder(prj_path, folder_path)
    return ResponseBase(code=code, data=_)

@router.post("/ide_delete_folder", response_model=ResponseBase)
async def ide_delete_folder(data:DeleteFolderItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, 'ide', prj_name)
    folder_path = os.path.join(prj_path, convert_path(data.folderPath))
    code, _ = delete_project_file(prj_path, folder_path)
    return ResponseBase(code=code, data=_)

@router.post("/ide_rename_folder", response_model=ResponseBase)
def ide_rename_folder(data:ReNameItem):
    prj_name = data.projectName
    prj_path = os.path.join(Config.PROJECTS, 'ide', prj_name)
    old_path = os.path.join(prj_path, convert_path(data.oldPath))
    new_name = data.newName
    new_path = os.path.join(os.path.dirname(old_path), new_name)
    code, _ = rename_project_file(prj_path, old_path, new_path)
    return ResponseBase(code=code, data=_)

@router.get("/get_python_pkg_installed_list", response_model=ResponseBase)
def get_python_pkg_installed_list():
    output = subprocess.run([Config.PYTHON, '-m', 'pip', 'list', '--format=json'], capture_output=True, text=True)
    packages_list = json.loads(output.stdout)
    return ResponseBase(code=0, data=packages_list)