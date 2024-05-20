from typing import Any
from pydantic import BaseModel


class ProjItem(BaseModel):
    projectName: str


class ProjReNameItem(BaseModel):
    oldName: str
    newName: str


class CreateFileItem(BaseModel):
    projectName: str
    parentPath: str
    fileName: str


class WriteFileItem(BaseModel):
    projectName: str
    filePath: str
    fileData: str
    complete: bool | None = False
    line: int | None = None
    column: int | None = None


class FileItem(BaseModel):
    projectName: str
    filePath: str

class SDKFileItem(BaseModel):
    filePath: str

class ReNameItem(BaseModel):
    projectName: str
    oldPath: str
    newName: str


class CreateFolderItem(BaseModel):
    projectName: str
    parentPath: str
    folderName: str


class DeleteFolderItem(BaseModel):
    projectName: str
    folderPath: str


class SaveProjItem(BaseModel):
    projectName: str
    expendKeys: list
    openList: list
    selectFilePath: str | None


class RunPythonItem(BaseModel):
    projectName: str
    filePath: str

class DebugPythonItem(BaseModel):
    projectName: str
    filePath: str
    options: list[str] | None = None

class PyTaskIdItem(BaseModel):
    taskId: str


class PipCommandItem(BaseModel):
    command: str
    options: list[str] | None = None


class PkgList(BaseModel):
    pkgList: list[str]
