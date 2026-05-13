#!/usr/bin/env bash
# 13.05.2026 Delfi-CH

# Description
# Script for bundeling the linux-web-installer

# Params:
# type (options: deb, rpm, pacman, tgz)

# Usage:
# Best invoked via package.json
# ./bundle.sh (type)

# Returns:
# 0: All good
# 1: Error

type=$1
if [ -z "$type" ]; then
    echo "No type set, defaulting to tar.gz..."
fi

echo "Bundeling backend..."
pnpm backend-build &> /dev/null
status=$?

if [ "$status" != 0 ]; then
    echo "Bundeling backend failed!"
    exit 1
else
    echo "Bundeling backend was successfull!"
fi

echo "Bundeling frontend..."
pnpm build &> /dev/null
status=$?
if [ "$status" != 0 ]; then
    echo "Bundeling frontend failed!"
    exit 1
else
    echo "Bundeling frontend was successfull!"
fi
echo "Copying frontend to dist..."
cp -r ui dist/ui
status=$?
if [ "$status" != 0 ]; then
    echo "Copying frontend to dist failed!"
    exit 1
else
    echo "Copying frontend to dist was successfull!"
fi