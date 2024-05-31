import os
from dotenv import load_dotenv

from app.common.config import Config
from fastapi import FastAPI, WebSocket
from fastapi import FastAPI, Request
from fastapi.routing import APIRoute
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import jinja2
import uvicorn
from app.api.main import api_router
from app.core.config import settings
from fastapi.staticfiles import StaticFiles
import mimetypes

mimetypes.init()
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("image/svg+xml", ".svg")

# 加载.env文件，如果存在的话
load_dotenv(".env", override=False)  # 设置override=False表示环境变量优先
active_env = os.getenv("ACTIVE_ENV")
load_dotenv(f".env.{active_env}", override=False)

address = os.getenv("PYIDE_SERVER_ADDRESS", "0.0.0.0")
port = int(os.getenv("PYIDE_SERVER_PORT", 21006))
Config.WEBIDESERVER = os.getenv("PYIDE_WEBSERVER_PATH", ".webide-server")
Config.FRONTEND = os.getenv("PYIDE_FRONTEND_PATH", "dist")
Config.PROJECTS = os.path.join(Config.WEBIDESERVER, "projects")
Config.IDE = os.getenv("PYIDE_IDE_PATH", ".webide-server/projects/ide")
Config.SDK = os.getenv("PYIDE_SDK_PATH", ".webide-server/projects/sdk")
Config.PYTHON = os.getenv("PYIDE_PYTHON_PATH", "python3")

print(Config.WEBIDESERVER)


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)
app.include_router(api_router, prefix=settings.API_V1_STR)
app.mount(
    "/assets",
    StaticFiles(directory=os.path.join(Config.FRONTEND, "assets")),
    name="static",
)
# app.mount("/", StaticFiles(directory= os.path.join(os.path.dirname(__file__),'..','..','dist'),html=True), name="home")
templates = Jinja2Templates(directory=os.path.join(Config.FRONTEND))


@app.get("/", response_class=HTMLResponse, tags=["index"])
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/editor", response_class=HTMLResponse, tags=["editor"])
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


if __name__ == "__main__":
    uvicorn.run(app, host=address, port=port, reload=False)
