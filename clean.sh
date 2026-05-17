#!/usr/bin/env bash
# 13.05.2026 Delfi-CH

# Description
# Script for cleaning up the bundeling of the linux-web-installer

# Params:
# type (options: deb, rpm, pacman, tgz, all)

# Usage:
# Best invoked via package.json
# ./clean.sh (type)

# Returns:
# 0: All good
# 1: Error

type=$1
if [ -z "$type" ]; then
    echo "No type set, defaulting to tar.gz..."
fi

echo "Deleting shared files..."

rm -f dist/index.cjs
status=$?
if [ "$status" != 0 ]; then
    echo "Deleting shared files failed!"
    exit 1
fi

rm -rf dist/ui
status=$?
if [ "$status" != 0 ]; then
    echo "Deleting shared files failed!"
    exit 1
fi

echo "Deleting shared files was sucessfull!"

if [ "$type" == "deb" ] || [ "$type" == "all" ]; then
    echo "Deleting debian specific files..."

    rm -f dist/httpstart-debian/usr/bin/httpstart
    status=$?
    if [ "$status" != 0 ]; then
        echo "Deleting debian specific files failed!"
        exit 1
    fi

    rm -rf dist/httpstart-debian/usr/share/httpstart/*
    status=$?
    if [ "$status" != 0 ]; then
        echo "Deleting debian specific files failed!"
        exit 1
    fi

    rm -rf dist/httpstart-debian/usr/share/doc/node-httpstart/*
    status=$?
    if [ "$status" != 0 ]; then
        echo "Deleting debian specific files failed!"
        exit 1
    fi

    rm -f dist/httpstart-debian.deb
    status=$?
    if [ "$status" != 0 ]; then
        echo "Deleting debian specific files failed!"
        exit 1
    fi

    echo "Deleting debian specific files was sucessfull!"

fi

if [ "$type" == "tgz" ] || [ "$type" == "all" ]; then
    echo "Deleting tar.gz specific files..."
    rm -f dist/httpstart.tar.gz
    status=$?
    if [ "$status" != 0 ]; then
        echo "Deleting tar.gz specific files failed!"
        exit 1
    fi

    echo "Deleting tar.gz specific files was sucessfull!"
fi
exit 0