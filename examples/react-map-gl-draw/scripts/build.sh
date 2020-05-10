node scripts/validate-token.js

# staging or prod
MODE=$1
WEBSITE_DIR=`pwd`

# clean up dist directory
rm -rf ./dist
mkdir dist

# copy static assets
cp -r ./static dist
cp -r ./data dist/data
mv dist/static/index.html dist/

# build script
webpack -p --env.prod
