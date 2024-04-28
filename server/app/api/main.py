from fastapi import APIRouter

from app.api.routes import ide

api_router = APIRouter()
api_router.include_router(ide.router, tags=["ide"])
