#!/bin/bash
cp README.md ./autodocs
cd ./autodocs
make clean && make html
rm README.md
rm -r ../docs
cp -r _build/ ../docs   
rm -r  _build
cd ../