
import os

class Config:
    PYTHON = "python"
    # PROJECTS = os.path.join(os.path.abspath('.'), 'projects')
    PROJECTS = os.path.join(os.path.dirname(__file__),'..','..','..','.webide-server', 'projects')
