import argparse
import os
import pty
import sys
import time

master=pty.spawn('/bin/bash')
os.write(master, b'ls\n')  # 向伪终端发送命令
data = os.read(master, 1024)
print(data.decode('utf-8').rstrip())