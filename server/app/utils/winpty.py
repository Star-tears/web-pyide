import os
import asyncio
import logging
from winpty import PtyProcess

from fastapi import WebSocket, WebSocketDisconnect

from app.common.config import Config


class WINPTY:

    def __init__(self, websocket: WebSocket,projectSelected:str):
        self.ws = websocket
        self.projectSelected=projectSelected

    async def read_ws(self):
        while True:
            try:
                data = await self.ws.receive_text()
                print(data)
            except WebSocketDisconnect:
                break
            except Exception as e:
                logging.error("websocket.receive_text error", exc_info=e)
                await self.ws.close(reason=str(e))
                break
            if data:
                os.write(self.pty, data.encode("utf8"))

    async def read_pty(self):
        while True:
            try:
                if hasattr(asyncio, "to_thread"):
                    data = await asyncio.to_thread(os.read, self.pty, 1024)
                else:
                    data = await asyncio.get_running_loop().run_in_executor(
                        None, os.read, self.pty, 1024
                    )
                print("pty.recv: ", data)
            except Exception as e:
                logging.error("chan.recv error", exc_info=e)
                await self.ws.close(reason=str(e))
                break
            if data:
                await self.ws.send_text(data.decode("utf8"))

    async def __aenter__(self):
        self.process = PtyProcess.spawn('C:/windows/system32/cmd.exe')
        self.pty = self.process.pty.fd;
        return self

    async def run(self):
        read_pty = asyncio.create_task(self.read_pty())
        read_ws = asyncio.create_task(self.read_ws())

        done, pending = await asyncio.wait(
            [read_pty, read_ws],
            return_when=asyncio.FIRST_COMPLETED,
        )
        for task in pending:
            task.cancel()

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        os.close(self.pty)
        self.process.terminate()
