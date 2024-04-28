from typing import Any
from pydantic import BaseModel

class ResponseBase(BaseModel):
    type: str | None = "response"
    id: int | None = None
    code: int = 0
    data: Any