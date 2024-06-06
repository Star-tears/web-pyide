import os
import sys

from dotenv import load_dotenv

# 加载.env文件，如果存在的话
load_dotenv(".env", override=False)  # 设置override=False表示环境变量优先
active_env = os.getenv("ACTIVE_ENV", "prod")
load_dotenv(f".env.{active_env}", override=False)


class Config:
    # PYTHON = "python"
    PYTHON = sys.executable
    FRONTEND = os.path.join("dist")
    WEBIDESERVER = os.path.join(".webide-server")
    PROJECTS = os.path.join(".webide-server", "projects")
    IDE = os.path.join("ide")
    READONLY_PATH = os.path.join("sdk")
    # PROJECTS = os.path.join(os.path.abspath('.'),'..','.webide-server', 'projects')
    # PROJECTS = os.path.join(os.path.dirname(__file__),'..','..','..','.webide-server', 'projects')


Config.WEBIDESERVER = os.getenv("PYIDE_WEBSERVER_PATH", ".webide-server")
Config.FRONTEND = os.getenv("PYIDE_FRONTEND_PATH", "dist")
Config.PROJECTS = os.path.join(Config.WEBIDESERVER, "projects")
Config.IDE = os.getenv("PYIDE_IDE_PATH", ".webide-server/projects/ide")
Config.READONLY_PATH = os.getenv("PYIDE_READONLY_PATH", ".webide-server/projects/sdk")
Config.PYTHON = os.getenv("PYIDE_PYTHON_PATH", "python3")
