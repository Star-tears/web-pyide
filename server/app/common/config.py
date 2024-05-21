import os
import sys


class Config:
    # PYTHON = "python"
    PYTHON = sys.executable
    FRONTEND = os.path.join("dist")
    WEBIDESERVER = os.path.join(".webide-server")
    PROJECTS = os.path.join(".webide-server", "projects")
    IDE = os.path.join("ide")
    SDK = os.path.join("sdk")
    # PROJECTS = os.path.join(os.path.abspath('.'),'..','.webide-server', 'projects')
    # PROJECTS = os.path.join(os.path.dirname(__file__),'..','..','..','.webide-server', 'projects')
