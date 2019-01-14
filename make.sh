#!/bin/bash

# Static site generator for my personal blog
echo -n "Removing existing post directories..."
ls -a1 | grep -E d{4} | xargs rm -r
echo "Done!!!"

echo "Generating new posts..."
node generate.js
echo "Done!!!"
