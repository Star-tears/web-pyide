from fastapi import APIRouter

from app.api.routes import ide, websocket

api_router = APIRouter()
api_router.include_router(ide.router, prefix="/ide", tags=["ide"])
api_router.include_router(websocket.router, prefix="/ws", tags=["ws"])
