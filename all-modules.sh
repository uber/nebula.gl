set -ex

for M in modules/*
do
  pushd $M
  "$@"
  popd
done
