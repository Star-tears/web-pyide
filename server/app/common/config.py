
import os

class Config:
    PYTHON = "python"
    PROJECTS = os.path.join(os.path.abspath('.'),'..','.webide-server', 'projects')
    # PROJECTS = os.path.join(os.path.dirname(__file__),'..','..','..','.webide-server', 'projects')
