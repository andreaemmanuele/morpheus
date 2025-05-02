#!/bin/bash

ROOT_DIR=$(pwd)

if [ ! -f "$ROOT_DIR/.env" ]; then
  echo "Root .env file doesn't exist. Creating an empty one."
  touch "$ROOT_DIR/.env"
fi

PACKAGE_DIRS=$(find packages -type d -maxdepth 1 -mindepth 1)

for dir in $PACKAGE_DIRS; do
  echo "Creating symlink in $dir"
  ln -sf "$ROOT_DIR/.env" "$dir/.env"
done

echo "Symlinks created successfully!"
