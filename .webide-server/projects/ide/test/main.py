#!/usr/bin/env python3
import argparse
import time

# while True:
#     print('main', time.time())
#     time.sleep(0.1)

print('main')


parser = argparse.ArgumentParser()
parser.add_argument('--echo-str', type=str, default='hello')
args = parser.parse_args()
print(args.echo_str)