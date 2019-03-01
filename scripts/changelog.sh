#!/usr/bin/env bash

read -p "Generate changelog [Y/N]? " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
  exit 0
fi

FILE=CHANGELOG.md
TMP=/tmp/new.txt

if [ -z "$EDITOR" ]
then
  EDITOR=vim
fi

if [ -f $FILE ]; then
  PREV_VER=`cat CHANGELOG.md | grep "^## " | head -n 1 | tr -Cs "0123456789." " " | awk '{ print $1 }'`
  CUR_VER=`cat lerna.json | grep version | tr -Cs "0123456789." " " | awk '{ print $1 }'`
  D=`date "+%Y-%m-%d"`
  rm $TMP
  echo >>$TMP
  echo "## [$CUR_VER](https://github.com/uber/nebula.gl/compare/v$PREV_VER...v$CUR_VER) - $D" >>$TMP
  echo >>$TMP
  echo "### Changes" >>$TMP
  echo >>$TMP
  git log v$PREV_VER... --pretty="format:* %s" >>$TMP
  echo >>$TMP
  $EDITOR $TMP
  sed -i "" "/<!-- INSERT HERE -->/r $TMP" "$FILE"
else
  echo $FILE not found.
fi


