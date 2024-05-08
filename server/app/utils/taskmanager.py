import asyncio
from queue import Queue
import subprocess
import threading
import time
from typing import Dict, List

from app.utils.helper import singleton
from fastapi import WebSocket, WebSocketDisconnect
from fastapi.websockets import WebSocketState


@singleton
class TaskManager(object):
    def __init__(self, *args, **kwargs) -> None:
        self.subprograms = {}

    def set_subprogram(self, program_id, sub_t):
        self.stop_subprogram(program_id)
        self.subprograms[program_id] = sub_t
    
    def remove_subprogram(self, program_id):
        if program_id is None:
            self.stop_subprogram()
            self.subprograms.clear()
        elif program_id in self.subprograms:
            self.stop_subprogram(program_id)
            self.subprograms.pop(program_id, None)
    
    def start_subprogram(self, program_id):
        if program_id in self.subprograms:
            self.subprograms[program_id].start()
    
    def stop_subprogram(self, program_id):
        if program_id is None:
            for _, t in self.subprograms.items():
                t.stop()
            for _, t in self.subprograms.items():
                try:
                    t.join()
                except:
                    pass
        elif program_id in self.subprograms:
            try:
                t = self.subprograms.pop(program_id)
                t.stop()
                t.join()
            except:
                pass

@singleton
class MessageQueue:
    def __init__(self):
        self.queue = asyncio.Queue()

    async def enqueue(self, message: str, recipient: str = 'all'):
        """将消息放入队列中，recipient 参数指定消息目标，'all' 表示广播"""
        print(56)
        await self.queue.put((message, recipient))
        print(id(self.queue))

    async def process_queue(self, connection_manager):
        """消费队列中的消息并发送给对应的 WebSocket 连接"""
        while True:
            print(64)
            print(id(self.queue))
            message, recipient = await self.queue.get()
            print([recipient,message])
            if recipient == 'all':
                await connection_manager.broadcast(message)
            else:
                # 实际应用中可能需要根据recipient找到特定的WebSocket连接
                # 这里简化处理，假设broadcast方法能处理单个和广播
                await connection_manager.send_to_task(recipient,message)
            self.queue.task_done()


@singleton
class PythonConsoleConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.active_task_dict: Dict[str, WebSocket]={}
        self.message_queue = MessageQueue()
        asyncio.run(self.start_processing_queue())

    async def connect(self, websocket: WebSocket,taskId:str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.active_task_dict[taskId]=websocket
        print(self.active_task_dict)

    def disconnect(self, websocket: WebSocket,taskId:str):
        self.active_connections.remove(websocket)
        self.active_task_dict.pop(taskId)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)
        for _, ws in self.active_task_dict.items():
            await ws.send_text(message)
    
    async def send_to_task(self,taskId:str,message:str):
        await self.active_task_dict[taskId].send_text(message)

    async def enqueue_message(self, message: str, recipient='all'):
        """使用队列发送消息"""
        print(101)
        await self.message_queue.enqueue(message, recipient)

    async def start_processing_queue(self):
        """启动一个协程来处理消息队列"""
        print(108108108108108)
        asyncio.create_task(self.message_queue.process_queue(self))

pythonConsoleConnectionManager = PythonConsoleConnectionManager()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.message_queues: Dict[str, Queue] = {}

    async def connect(self, websocket: WebSocket, taskId: str):
        """
        Adds a new WebSocket connection to the manager.
        """
        await websocket.accept()
        if taskId not in self.active_connections:
            self.active_connections[taskId] = []
        self.active_connections[taskId].append(websocket)
        self.message_queues[taskId] = Queue()  # 初始化消息队列

    def disconnect(self, websocket: WebSocket, taskId: str):
        """
        Removes a WebSocket connection from the manager.
        """
        if taskId in self.active_connections:
            self.active_connections[taskId].remove(websocket)
            if not self.active_connections[taskId]:  # 如果该客户端ID下没有更多连接了
                del self.active_connections[taskId]
                del self.message_queues[taskId]  # 清除对应的消息队列
            print(f"Connection closed for client {taskId}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        """
        Sends a personal message to a specific WebSocket.
        """
        print(message,websocket)
        await websocket.send_text(message)

    def add_message_to_queue(self, target: str, message: str):
        """
        Adds a message to the queue for the given target.
        """
        if target in self.message_queues:
            self.message_queues[target].put(message)
            print(self.message_queues[target])

    async def start_message_listener(self, websocket: WebSocket, client_id: str):
        """
        Coroutine to listen for messages from the thread and send them over WebSocket.
        Ensures the WebSocket is open before sending messages.
        """
        while True:
            self.add_message_to_queue("1","asd")
            time.sleep(0.1)
            try:
                if client_id in self.message_queues and not self.message_queues[client_id].empty():
                    msg = self.message_queues[client_id].get()
                    print(msg)
                    await self.send_personal_message(msg, websocket)
                    self.message_queues[client_id].task_done()
                print(175)
            except Exception as e:
                print(e)

# 实例化ConnectionManager并在FastAPI应用中使用
manager = ConnectionManager()

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

    async def response_to_client(self, stdout):
        if stdout:
            try:
                print(stdout)
                # manager.add_message_to_queue(self.id,stdout)
            except Exception as e:
                print('[Program {} is exception], {}'.format(self.id, e))
    async def run_program(self):
        p = None
        print('[Program {} is start]'.format(self.id))
        try:
            p = subprocess.Popen(self.cmd, shell=False, universal_newlines=True,
                                 stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            self.p = p
            while self.alive and p.poll() is None:
                stdout = p.stdout.readline()
                stdout = stdout.strip()
                await self.response_to_client(stdout)
                time.sleep(1)
            if not self.alive:
                await self.response_to_client('[program is terminate]')
                p.kill()
                print('[Program {} is terminate]'.format(self.id))
                return
            try:
                stdout = p.stdout.read()
                await self.response_to_client(stdout)
            except:
                pass
            await self.response_to_client(stdout)
            if p.returncode == 0:
                print('Program {} success'.format(self.id))
                p.kill()
                return 'ok'
            else:
                print('Program {} failed'.format(self.id))
                p.kill()
                return 'failed'
        except Exception as e:
            print('[Program {} is exception], {}'.format(self.id, e))
            await self.response_to_client('[Program is exception], {}'.format(e))
        finally:
            try:
                p.kill()
            except:
                pass

    def run(self):
        self.alive = True
        try:
            asyncio.run(self.run_program())
        except Exception as e:
            print(e)
            pass
        self.alive = False

