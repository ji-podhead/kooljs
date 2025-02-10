#!/bin/bash
cp README.md ./.docs
cd ./.docs
make html
rm README.md
rm -r ../kooljs_website/src/docs/
cp -r _build/html ../kooljs_website/src/docs
rm -r  _build
cd ../