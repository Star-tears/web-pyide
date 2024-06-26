import asyncio
import subprocess
import threading
import time
from typing import Any, Dict

from app.utils.helper import singleton
from fastapi import WebSocket


@singleton
class PythonConsoleConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.active_connections_dict: Dict[str, list[WebSocket]] = {}
        self.queue_dict: Dict[str, asyncio.Queue] = {}
        self.single_queue_limit = 200

    async def connect(self, websocket: WebSocket, taskId: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.add_websocket(taskId, websocket)

    async def put_message(self, taskId: str, message: str):
        message_queue = self.queue_dict.setdefault(taskId, asyncio.Queue())
        await message_queue.put(message)
        current_size = message_queue.qsize()
        if current_size > self.single_queue_limit:
            _ = await message_queue.get()
            message_queue.task_done()

    def disconnect(self, websocket: WebSocket, taskId: str):
        self.active_connections.remove(websocket)
        self.remove_websocket(taskId, websocket)

    async def send_message(self, taskId):
        message_queue = self.queue_dict.get(taskId)
        if message_queue is None:
            await asyncio.sleep(1)
        else:
            message = await message_queue.get()
            connections = self.active_connections_dict.get(taskId)
            if connections is not None:
                for websocket in connections:
                    await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

    def add_websocket(self, taskId: str, websocket: WebSocket):
        # 使用dict.setdefault方法，如果键存在，则返回对应的值；如果不存在，则插入键并返回默认值（这里是一个新列表）
        connections = self.active_connections_dict.setdefault(taskId, [])
        # 现在，无论键是否存在，connections都是一个列表，可以直接追加新的websocket
        connections.append(websocket)

    def remove_websocket(self, taskId: str, websocket: WebSocket):
        # 获取对应taskId的列表，如果不存在则返回None
        connections = self.active_connections_dict.get(taskId)
        if connections is not None:
            # 尝试从列表中移除指定的websocket
            if websocket in connections:
                connections.remove(websocket)
                # 如果移除后列表变为空，则从字典中删除这个键
                if not connections:
                    del self.active_connections_dict[taskId]

    def remove_taskId(self, taskId: str):
        # 获取对应taskId的列表，如果不存在则返回None
        message_queue = self.queue_dict.get(taskId)
        if message_queue is not None:
            # print(f"del {taskId}")
            del self.active_connections_dict[taskId]


pythonConsoleConnectionManager = PythonConsoleConnectionManager()


@singleton
class TaskManager(object):
    def __init__(self, *args, **kwargs) -> None:
        self.task_dict = {}

    def get_task_id_list(self):
        return list(self.task_dict.keys())

    def get_task_info_dict(self):
        task_info_list: Dict[str, Dict[str, Any]] = {}
        for task_id, sub_t in self.task_dict.items():
            task_info_list[task_id] = {}
            task_info_list[task_id]["alive"] = sub_t.is_alive()
            task_info_list[task_id]["cmd"] = sub_t.cmd
        return task_info_list

    def set_subprogram(self, program_id, sub_t):
        self.stop_subprogram(program_id)
        self.task_dict[program_id] = sub_t

    def remove_subprogram(self, program_id):
        if program_id is None:
            self.stop_subprogram()
            self.task_dict.clear()
        elif program_id in self.task_dict:
            self.stop_subprogram(program_id)
            self.task_dict.pop(program_id, None)

    def start_subprogram(self, program_id):
        if program_id in self.task_dict:
            self.task_dict[program_id].start()

    def stop_subprogram(self, program_id):
        if program_id is None:
            for _, t in self.task_dict.items():
                t.stop()
            for _, t in self.task_dict.items():
                try:
                    t.join()
                except:
                    pass
        elif program_id in self.task_dict:
            try:
                t = self.task_dict.get(program_id)
                t.stop()
                t.join()
            except:
                pass

    def kill_subprogram(self, program_id):
        if program_id is None:
            for _, t in self.task_dict.items():
                t.stop()
            for _, t in self.task_dict.items():
                try:
                    pythonConsoleConnectionManager.remove_taskId(program_id)
                    t.join()
                except:
                    pass
        elif program_id in self.task_dict:
            try:
                t = self.task_dict.pop(program_id)
                t.stop()
                pythonConsoleConnectionManager.remove_taskId(program_id)
                t.join()
            except:
                pass

    def reload_subprogram(self, program_id):
        if program_id in self.task_dict:
            try:
                t = self.task_dict.get(program_id)
                cmd = t.cmd
                taskId = program_id
                self.set_subprogram(program_id, SubProgramThread(cmd, taskId))
                self.start_subprogram(program_id)
            except:
                pass


class SubProgramThread(threading.Thread):
    def __init__(self, cmd, id):
        super(SubProgramThread, self).__init__()
        self.cmd = cmd
        self.id = id
        self.alive = True
        self.daemon = True
        self.p = None

    def stop(self):
        self.alive = False
        if self.p:
            try:
                self.p.kill()
            except:
                pass
            self.p = None

    def response_to_client(self, stdout):
        if stdout:
            try:
                # print('[Program {} stdout: {}]'.format(self.id,stdout))
                asyncio.run(
                    pythonConsoleConnectionManager.put_message(self.id, stdout + "\r\n")
                )
            except Exception as e:
                print("[Program {} is exception], {}".format(self.id, e))

    def run_program(self):
        p = None
        print("[Program {} is start]".format(self.id))
        try:
            p = subprocess.Popen(
                self.cmd,
                shell=False,
                universal_newlines=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
            )
            self.p = p
            while self.alive and p.poll() is None:
                stdout = p.stdout.readline()
                stdout = stdout.strip()
                self.response_to_client(stdout)
                time.sleep(0.02)
            if not self.alive:
                self.response_to_client("[program is terminate]")
                p.kill()
                print("[Program {} is terminate]".format(self.id))
                return
            try:
                stdout = p.stdout.read()
                self.response_to_client(stdout)
            except:
                pass
            # self.response_to_client(stdout)
            if p.returncode == 0:
                self.response_to_client("Program {} success".format(self.id))
                p.kill()
                return "ok"
            else:
                self.response_to_client("Program {} failed".format(self.id))
                p.kill()
                return "failed"
        except Exception as e:
            print("[Program {} is exception], {}".format(self.id, e))
            self.response_to_client("[Program is exception], {}".format(e))
        finally:
            try:
                p.kill()
            except:
                pass

    def run(self):
        self.alive = True
        try:
            self.run_program()
        except Exception as e:
            print(e)
            pass
        self.alive = False
