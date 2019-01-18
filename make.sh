#!/bin/bash

# Static site generator for my personal blog
echo -n "Removing existing post directories..."
ls -a1 | grep -E "[0-9]{4}" | xargs rm -rf
echo "Done!!!"

echo "Generating new posts..."
node generate.js
echo "Done!!!"
