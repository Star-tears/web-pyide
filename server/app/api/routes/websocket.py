from app.utils.taskmanager import PythonConsoleConnectionManager
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

pythonConsoleConnectionManager = PythonConsoleConnectionManager()

@router.websocket("/pythonConsole")
async def python_console_endpoint(websocket: WebSocket,taskId:str):
    await pythonConsoleConnectionManager.connect(websocket,taskId)
    try:
        while True:
            await pythonConsoleConnectionManager.send_message()
    except WebSocketDisconnect:
        pythonConsoleConnectionManager.disconnect(websocket,taskId)