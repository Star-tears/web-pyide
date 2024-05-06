import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__),'..'))

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

def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

app.include_router(api_router, prefix=settings.API_V1_STR)
app.mount("/assets", StaticFiles(directory= os.path.join(os.path.dirname(__file__),'..','..','dist', 'assets')), name="assets")
templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__),'..','..','dist'))

@app.get("/", response_class=HTMLResponse,tags=["index"])
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/editor", response_class=HTMLResponse,tags=["editor"])
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=21006,reload=False)
