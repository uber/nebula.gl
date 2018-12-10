#!/usr/bin/env bash


for X in modules/*/package.json
do
  V=`cat $X | grep version | awk '{ print $2 }' | tr -d \",`
  echo Version in $X is $V
  sed -i "" 's/"nebula.gl": ".*"/"nebula.gl": "'"$V"'"/g' $X
done

