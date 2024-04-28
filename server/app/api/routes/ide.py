import os
from typing import Any

from fastapi import APIRouter, HTTPException

from app.common.config import Config
from app.models.response import ResponseBase
from app.utils.resource import list_projects

router = APIRouter()


@router.get("/ide_list_projects", response_model=ResponseBase)
def ide_list_projects():
    ide_path = os.path.join(Config.PROJECTS, "ide")
    code, projects = list_projects(ide_path)
    return ResponseBase(type="response", id=0, code=code, data=projects)
