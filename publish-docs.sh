#!/bin/bash
cd website &&
npm run build &&
mv dist /tmp/nebula-docs &&
cd .. &&
git checkout gh-pages &&
rm -rf * &&
mv /tmp/nebula-docs/* . &&
rm -rf /tmp/nebula-docs && 
git add . 
git commit -m 'Upgrade docs' &&
git push && git checkout master
