import asyncio
import os
import subprocess
import threading
import time
from app.handlers.handler_info import HandlerInfo
from fastapi import APIRouter,WebSocket, WebSocketDisconnect

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket,projectSelected:str):
        await websocket.accept()
        self.active_connections.append(websocket)
        import platform

        if platform.system() == 'Windows':
            # 在 Windows 上执行的代码
            from app.utils.winpty import WINPTY
            async with WINPTY(websocket,projectSelected) as pty:
                await pty.run()
        else:
            # 在 Linux 上执行的代码
            from app.utils.pty import PTY
            async with PTY(websocket,projectSelected) as pty:
                await pty.run()

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()

@router.websocket("/terminal")
async def terminal_endpoint(websocket: WebSocket,projectSelected:str):
    await manager.connect(websocket,projectSelected)
    try:
        pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)

class PythonConsoleManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.handler_info = HandlerInfo()

    async def connect(self, websocket: WebSocket,projectSelected:str):
        await websocket.accept()
        self.active_connections.append(websocket)
        

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)


pythonConsoleManager = PythonConsoleManager()

@router.websocket("/PythonConsole")
async def python_console_endpoint(websocket: WebSocket,projectSelected:str):
    await manager.connect(websocket,projectSelected)
    try:
        pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)


class SubProgramThread(threading.Thread):
    def __init__(self, cmd, cmd_id, client, event_loop):
        super(SubProgramThread, self).__init__()
        self.cmd = cmd
        self.cmd_id = cmd_id
        self.client = client
        self.alive = True
        self.daemon = True
        self.event_loop = event_loop
        self.p = None
    
    def stop(self):
        self.alive = False
        if self.p:
            try:
                self.p.kill()
            except:
                pass
            self.p = None

    def response_to_client(self, code, stdout):
        if stdout:
            # IOLoop.current().spawn_callback(response, self.client, self.cmd_id, code, {'stdout': stdout})
            pass

    def run_python_program(self):
        start_time = time.time()
        p = None
        asyncio.set_event_loop(self.event_loop)
        print('[{}-Program {} is start]'.format(self.client.id, self.cmd_id))
        try:
            p = subprocess.Popen(self.cmd, shell=False, universal_newlines=True,
                                 stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            self.p = p
            while self.alive and p.poll() is None:
                if not self.client.connected:
                    self.alive = False
                    p.kill()
                    self.client.handler_info.remove_subprogram(self.cmd_id)
                    print('[{}-Program {} is kill][client is disconnect]'.format(self.client.id, self.cmd_id))
                    return
                stdout = p.stdout.readline()
                stdout = stdout.strip()
                self.response_to_client(0, stdout)
                time.sleep(0.002)
            if not self.alive:
                self.response_to_client(1111, '[program is terminate]')
                p.kill()
                self.client.handler_info.remove_subprogram(self.cmd_id)
                print('[{}-Program {} is terminate]'.format(self.client.id, self.cmd_id))
                return
            try:
                stdout = p.stdout.read()
                self.response_to_client(0, stdout)
            except:
                pass
            if self.client.connected:
                stdout = '[Program exit with code {code}]'.format(code=p.returncode)
            else:
                stdout = '[Finish in {second:.2f}s with exit code {code}]'.format(second=time.time() - start_time, code=p.returncode)
            self.response_to_client(1111, stdout)
            self.client.handler_info.remove_subprogram(self.cmd_id)
            if p.returncode == 0:
                print('{}-Program {} success'.format(self.client.id, self.cmd_id))
                p.kill()
                return 'ok'
            else:
                print('{}-Program {} failed'.format(self.client.id, self.cmd_id))
                p.kill()
                return 'failed'
        except Exception as e:
            print('[{}-Program {} is exception], {}'.format(self.client.id, self.cmd_id, e))
            self.response_to_client(1111, '[Program is exception], {}'.format(e))
        finally:
            try:
                p.kill()
            except:
                pass
            try:
                self.client.handler_info.remove_subprogram(self.cmd_id)
            except:
                pass

    def run(self):
        self.alive = True
        try:
            self.run_python_program()
        except Exception as e:
            print(e)
            pass
        self.alive = False
