from typing import Any
from pydantic import BaseModel

class ResponseBase(BaseModel):
    type: str = 'response'
    id: int
    code: int = 0
    data: dict | list | None = None