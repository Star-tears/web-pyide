# import asyncio
# import logging
# import select
# import subprocess
# import threading
# import time
# import uuid


# class SubProgramThread(threading.Thread):
#     def __init__(self, cmd, id):
#         super(SubProgramThread, self).__init__()
#         self.cmd = cmd
#         self.id = id
#         self.alive = True
#         self.daemon = True
#         self.p = None
    
#     def stop(self):
#         self.alive = False
#         if self.p:
#             try:
#                 self.p.kill()
#             except:
#                 pass
#             self.p = None

#     def response_to_client(self, stdout):
#         if stdout:
#             # IOLoop.current().spawn_callback(response, self.client, self.cmd_id, code, {'stdout': stdout})
#             print(stdout)

#     def run_program(self):
#         p = None
#         print('[Program {} is start]'.format(self.id))
#         try:
#             p = subprocess.Popen(self.cmd, shell=False, universal_newlines=True,
#                                  stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
#             self.p = p
#             while self.alive and p.poll() is None:
#                 stdout = p.stdout.readline()
#                 print(1)
#                 if stdout == '':
#                     time.sleep(0.1)  # Sleep a bit if no output is available
#                     continue
#                 stdout = stdout.strip()
#                 self.response_to_client(stdout)
#             if not self.alive:
#                 self.response_to_client(1111, '[program is terminate]')
#                 p.kill()
#                 print('[Program {} is terminate]'.format(self.id))
#                 return
#             try:
#                 stdout = p.stdout.read()
#                 self.response_to_client(stdout)
#             except:
#                 pass
#             self.response_to_client(stdout)
#             if p.returncode == 0:
#                 print('Program {} success'.format(self.id))
#                 p.kill()
#                 return 'ok'
#             else:
#                 print('Program {} failed'.format(self.id))
#                 p.kill()
#                 return 'failed'
#         except Exception as e:
#             print('[Program {} is exception], {}'.format(self.id, e))
#             self.response_to_client('[Program is exception], {}'.format(e))
#         finally:
#             try:
#                 p.kill()
#             except:
#                 pass

#     def run(self):
#         self.alive = True
#         try:
#             self.run_program()
#         except Exception as e:
#             print(e)
#             pass
#         self.alive = False

# # s1=SubProgramThread(['python',br'C:\Users\seer\Desktop\PythonWebIde\workspace\vite-pyide\.webide-server\projects\ide\test\hello.py'],uuid.uuid4())
# # # s1=SubProgramThread(['pip',br'list'],int(time.time()))
# # s1.start()
# # time.sleep(20)

# class AsyncSubProgramThread:

#     def __init__(self):
#         pass

#     async def read_ws(self):
#         while True:
#             try:
#                 data = await self.ws.receive_text()
#                 print(data)
#             except WebSocketDisconnect:
#                 break
#             except Exception as e:
#                 logging.error("websocket.receive_text error", exc_info=e)
#                 await self.ws.close(reason=str(e))
#                 break
#             if data:
#                 os.write(self.pty, data.encode("utf8"))

#     async def read_pty(self):
#         while True:
#             try:
#                 if hasattr(asyncio, "to_thread"):
#                     data = await asyncio.to_thread(os.read, self.pty, 1024)
#                 else:
#                     data = await asyncio.get_running_loop().run_in_executor(
#                         None, os.read, self.pty, 1024
#                     )
#                 print("pty.recv: ", data)
#             except Exception as e:
#                 logging.error("chan.recv error", exc_info=e)
#                 await self.ws.close(reason=str(e))
#                 break
#             if data:
#                 await self.ws.send_text(data.decode("utf8"))

#     async def __aenter__(self):
#         self.pty, tty = os.openpty()
#         self.process = subprocess.Popen(
#             "/bin/bash",
#             cwd= os.path.join(Config.PROJECTS,"ide",self.projectSelected),
#             stdin=tty,
#             stdout=tty,
#             stderr=tty,
#             shell=True
#         )
#         return self

#     async def run(self):
#         read_pty = asyncio.create_task(self.read_pty())
#         read_ws = asyncio.create_task(self.read_ws())

#         done, pending = await asyncio.wait(
#             [read_pty, read_ws],
#             return_when=asyncio.FIRST_COMPLETED,
#         )
#         for task in pending:
#             task.cancel()

#     async def __aexit__(self, exc_type, exc_val, exc_tb):
#         os.close(self.pty)
#         self.process.terminate()
