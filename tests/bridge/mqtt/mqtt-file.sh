#!/usr/bin/env bash
set -e

yarn cli bridge start --source mqtt --source-port 3000 --target file --target-file out.txt