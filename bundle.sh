#!/usr/bin/env bash
# 13.05.2026 Delfi-CH

# Description
# Script for bundeling the linux-web-installer

# Params:
# type (options: deb, rpm, tgz, all, none)

# Usage:
# Best invoked via package.json
# ./bundle.sh (type)

# Returns:
# 0: All good
# 1: Error

type=$1
if [ -z "$type" ]; then
    echo "No type set, defaulting to tar.gz..."
    type="tgz"
fi

echo "Bundeling backend..."
pnpm backend-build &> /dev/null
status=$?

if [ "$status" != 0 ]; then
    echo "Bundeling backend failed!"
    exit 1
else
    echo "Bundeling backend was sucessfull!"
fi

echo "Bundeling frontend..."
pnpm build &> /dev/null
status=$?
if [ "$status" != 0 ]; then
    echo "Bundeling frontend failed!"
    exit 1
else
    echo "Bundeling frontend was sucessfull!"
fi
echo "Copying frontend to dist..."
cp -r ui dist/ui
status=$?
if [ "$status" != 0 ]; then
    echo "Copying frontend to dist failed!"
    exit 1
else
    echo "Copying frontend to dist was sucessfull!"
fi

bundle_debian () {
    echo "Testing for dpkg-deb..."
    type dpkg-deb &> /dev/null
    status=$?
    if [ "$status" != 0 ]; then
        echo "dpkg-deb wasnt found in \$PATH!"
        echo "Aborting..."
        exit 1
    fi
    echo "dpkg-deb was found!"

    echo "Creating directories..."
    mkdir -p dist/httpstart-debian/usr/bin/
    if [ "$status" != 0 ]; then
        echo "Creating directories failed!"
        exit 1
    fi

    mkdir -p dist/httpstart-debian/usr/share/httpstart
    if [ "$status" != 0 ]; then
        echo "Creating directories failed!"
        exit 1
    fi
    mkdir -p dist/httpstart-debian/usr/share/doc/node-httpstart/
    if [ "$status" != 0 ]; then
        echo "Creating directories failed!"
        exit 1
    fi

    echo "Creating directories was sucessfull!"

    echo "Copying files..."

    cp dist/httpstart dist/httpstart-debian/usr/bin/httpstart
    status=$?
    if [ "$status" != 0 ]; then
        echo "Copying files failed!"
        exit 1
    fi

    cp dist/index.cjs dist/httpstart-debian/usr/share/httpstart/index.cjs
    status=$?
    if [ "$status" != 0 ]; then
        echo "Copying files failed!"
        exit 1
    fi

    cp -r dist/ui dist/httpstart-debian/usr/share/httpstart/
    status=$?
    if [ "$status" != 0 ]; then
        echo "Copying files failed!"
        exit 1
    fi
    
    echo "Copying files was sucessfull!"

    echo "Copying metadata..."

    pushd dist/httpstart-debian &> /dev/null
    gzip -9 -n -k DEBIAN/changelog &> /dev/null
    status=$?
    if [ "$status" != 0 ]; then
        echo "Copying metadata failed!"
        exit 1
    fi

    mv DEBIAN/changelog.gz ./usr/share/doc/node-httpstart/
    status=$?
    if [ "$status" != 0 ]; then
        echo "Copying metadata failed!"
        exit 1
    fi
    rm -f DEBIAN/changelog.gz

    cp DEBIAN/copyright ./usr/share/doc/node-httpstart/
    status=$?
    if [ "$status" != 0 ]; then
        echo "Copying metadata failed!"
        exit 1
    fi
    popd &> /dev/null


    echo "Building .deb file..."

    pushd dist &> /dev/null 
    dpkg-deb --root-owner-group --build httpstart-debian/ &> /dev/null
    status=$?
    if [ "$status" != 0 ]; then
        echo "Building .deb file failed!"
        exit 1
    fi
    popd &> /dev/null
    echo "Building .deb file was sucessfull!"
}

bundle_tgz () {
    echo "Testing for tar..."
    type tar &> /dev/null
    status=$?
    if [ "$status" != 0 ]; then
        echo "tar wasnt found in \$PATH!"
        echo "Aborting..."
        exit 1
    fi
    echo "tar was found!"

    echo "Testing for gzip..."
    type gzip &> /dev/null
    status=$?
    if [ "$status" != 0 ]; then
        echo "gzip wasnt found in \$PATH!"
        echo "Aborting..."
        exit 1
    fi
    echo "gzip was found!"

    echo "Creating tar.gz..."
    tar -czf dist/httpstart.tar.gz dist/ui dist/httpstart README.md LICENSE
    if [ "$status" != 0 ]; then
        echo "Creating tar.gz failed!"
        echo "Aborting..."
        exit 1
    fi
    echo "Creating tar.gz was sucessfull"
}

if [ "$type" == "deb" ] || [ "$type" == "all" ]; then
    echo "Bundeling for Debian (dpkg)..."
    bundle_debian
fi

if [ "$type" == "tgz" ] || [ "$type" == "all" ]; then
    echo "Bundeling for tar.gz (tgz)..."
    bundle_tgz
fi