
import os

class Config:
    PYTHON = "python"
    FRONTEND = os.path.join('dist')
    WEBIDESERVER = os.path.join('.webide-server')
    PROJECTS =  os.path.join('.webide-server','projects')
    # PROJECTS = os.path.join(os.path.abspath('.'),'..','.webide-server', 'projects')
    # PROJECTS = os.path.join(os.path.dirname(__file__),'..','..','..','.webide-server', 'projects')