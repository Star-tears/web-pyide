import asyncio
from app.utils.taskmanager import PythonConsoleConnectionManager
from fastapi import APIRouter,WebSocket, WebSocketDisconnect
import app.utils.taskmanager as t
router = APIRouter()

# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: list[WebSocket] = []

#     async def connect(self, websocket: WebSocket,projectSelected:str):
#         await websocket.accept()
#         self.active_connections.append(websocket)
#         import platform

#         if platform.system() == 'Windows':
#             # 在 Windows 上执行的代码
#             from app.utils.winpty import WINPTY
#             async with WINPTY(websocket,projectSelected) as pty:
#                 await pty.run()
#         else:
#             # 在 Linux 上执行的代码
#             from app.utils.pty import PTY
#             async with PTY(websocket,projectSelected) as pty:
#                 await pty.run()

#     def disconnect(self, websocket: WebSocket):
#         self.active_connections.remove(websocket)

#     async def send_personal_message(self, message: str, websocket: WebSocket):
#         await websocket.send_text(message)

#     async def broadcast(self, message: str):
#         for connection in self.active_connections:
#             await connection.send_text(message)


# manager = ConnectionManager()

# @router.websocket("/terminal")
# async def terminal_endpoint(websocket: WebSocket,projectSelected:str):
#     await manager.connect(websocket,projectSelected)
#     try:
#         pass
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)

pythonConsoleConnectionManager = PythonConsoleConnectionManager()

@router.websocket("/pythonConsole")
async def python_console_endpoint(websocket: WebSocket,taskId:str):
    await t.manager.connect(websocket, taskId)
    listener_task =asyncio.create_task(t.manager.start_message_listener(websocket, taskId))
    try:
        while True:
            await websocket.receive_text()  # 保持连接活动，等待客户端消息（可按需处理）
    except asyncio.CancelledError:
        print(f"WebSocket receive loop for task {taskId} was cancelled.")
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for task {taskId}.")
    finally:
        # 取消监听任务
        if not listener_task.done():
            listener_task.cancel()
        await listener_task  # 等待任务结束，确保资源正确释放
    # await pythonConsoleConnectionManager.connect(websocket,taskId)
    # try:
    #     pass
    # except WebSocketDisconnect:
    #     pythonConsoleConnectionManager.disconnect(websocket,taskId)
