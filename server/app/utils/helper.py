import platform
import time

system = platform.system().lower()


def convert_path(path):
    if system == "windows":
        return path.lstrip("/").replace("/", "\\")
    else:
        return path.lstrip("/")


def singleton(cls):
    instances = {}

    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance


def gen_run_id(prefix: str):
    return str(prefix + "-" + str(int(time.time() * 1000)))
