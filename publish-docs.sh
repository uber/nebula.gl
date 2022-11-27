#!/usr/bin/env bash
set -ex

cd website
yarn
yarn build

mv public /tmp/nebula-docs

cd ..
git checkout gh-pages

for F in /tmp/nebula-docs/*; do
cp -R $F .
git add $(basename "$F")
done

rm -rf /tmp/nebula-docs

git commit --amend --no-verify -m "DOCS"

git push origin gh-pages -f

