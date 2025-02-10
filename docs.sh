#!/bin/bash
cp README.md ./autodocs
cd ./autodocs
make html
rm README.md
rm -r ../docs
cp -r _build/html ../docs   
rm -r  _build
cd ../