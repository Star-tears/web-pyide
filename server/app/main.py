import argparse
import asyncio
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__),'..'))

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
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('image/svg+xml', '.svg')
def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--address', type=str, default='0.0.0.0', help='server listen address')
    parser.add_argument('--port', type=int, default=21006, help='server listen port')
    parser.add_argument('--webserver-path', type=str, default='.webide-server', help='webserver path')
    parser.add_argument('--frontend-path', type=str, default='dist', help='frontend path')
    parser.add_argument('--sdk-path', type=str, default='sdk', help='sdk path')
    args = parser.parse_args()
    Config.FRONTEND=os.path.join(args.frontend_path)
    Config.WEBIDESERVER=os.path.join(args.webserver_path)
    Config.PROJECTS=os.path.join(Config.WEBIDESERVER,'projects')
    Config.SDK=os.path.join(args.sdk_path)
    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        generate_unique_id_function=custom_generate_unique_id,
    )
    app.include_router(api_router, prefix=settings.API_V1_STR)
    app.mount("/assets", StaticFiles(directory= os.path.join(Config.FRONTEND,'assets')), name="static")
    # app.mount("/", StaticFiles(directory= os.path.join(os.path.dirname(__file__),'..','..','dist'),html=True), name="home")
    templates = Jinja2Templates(directory=os.path.join(Config.FRONTEND))

    @app.get("/", response_class=HTMLResponse,tags=["index"])
    async def home(request: Request):
        return templates.TemplateResponse("index.html", {"request": request})

    @app.get("/editor", response_class=HTMLResponse,tags=["editor"])
    async def home(request: Request):
        return templates.TemplateResponse("index.html", {"request": request})
    uvicorn.run(app, host=args.address, port=21006,reload=False)

if __name__ == "__main__":
    main()
