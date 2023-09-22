#!/usr/bin/env bash
set -e

yarn cli vcan start
yarn cli bridge start --source can --target file --target-file out.txt