#!/bin/bash
cp ./README.md ./kooljs
cd ./kooljs
npm install
npm run build
npm publish
rm ./README.md
cd ../