#!/usr/bin/env bash
# This script makes sure that @danmarshall/deckgl-typings is copied to node_modules/@types
# The package  has a script to do the same thing but it seems to be having issues with linux/mac

typesPackageFolder="node_modules/@danmarshall/deckgl-typings"

declare -a folders=(
    deck.gl__aggregation-layers
    deck.gl__core
    deck.gl__layers
    deck.gl__google-maps
    deck.gl__json
    deck.gl__mapbox
    deck.gl__mesh-layers
    deck.gl__geo-layers
    deck.gl__extensions
    deck.gl__react
    deck.gl
    luma.gl__webgl-state-tracker
    luma.gl__webgl
    luma.gl__shadertools
    luma.gl__core
    math.gl


)
echo "Copying Deck.gl types to node_modules/@types folder ..."
for  folder in "${folders[@]}"
do
    if [[ -d "${typesPackageFolder}/${folder}" ]]; then
         cp -R "${typesPackageFolder}/${folder}" node_modules/@types/
    fi
done
echo "Completed copying Deck.gl types"