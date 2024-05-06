import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__),'..'))

from fastapi import FastAPI, WebSocket
from fastapi import FastAPI
from fastapi.routing import APIRoute
import uvicorn
from app.api.main import api_router
from app.core.config import settings
# from fastapi.staticfiles import StaticFiles

def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

# app.mount("/static", StaticFiles(directory="dist"), name="static")
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000,reload=False)
