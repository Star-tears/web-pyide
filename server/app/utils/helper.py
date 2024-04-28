import platform

system = platform.system().lower()


def convert_path(path):
    if system == 'windows':
        return path.lstrip('/').replace('/', '\\')
    else:
        return path.lstrip('/')
