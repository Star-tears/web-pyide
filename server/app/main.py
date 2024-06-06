import os

from app.common.config import Config
from fastapi import FastAPI, File
from fastapi import FastAPI, Request
from fastapi.routing import APIRoute
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import uvicorn
from app.api.main import api_router
from app.core.config import settings
from fastapi.staticfiles import StaticFiles
import mimetypes

mimetypes.init()
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("image/svg+xml", ".svg")


address = os.getenv("PYIDE_SERVER_ADDRESS", "0.0.0.0")
port = int(os.getenv("PYIDE_SERVER_PORT", 21006))


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


@app.get("/favicon.ico", tags=["favicon"])
async def favicon():
    # 这里假设你有一个放在static目录下的favicon.ico文件
    return File(
        os.path.join(Config.FRONTEND, "favicon.ico"),
        media_type="image/vnd.microsoft.icon",
    )


if __name__ == "__main__":
    uvicorn.run(app, host=address, port=port, reload=False)
