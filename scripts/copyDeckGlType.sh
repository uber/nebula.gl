#!/usr/bin/env bash
declare -a folders=(
    node_modules/@danmarshall/deckgl-typings/deck.gl__aggregation-layers
    node_modules/@danmarshall/deckgl-typings/deck.gl__core
    node_modules/@danmarshall/deckgl-typings/deck.gl__layers
    node_modules/@danmarshall/deckgl-typings/deck.gl__google-maps
    node_modules/@danmarshall/deckgl-typings/deck.gl__json
    node_modules/@danmarshall/deckgl-typings/deck.gl__mapbox
    node_modules/@danmarshall/deckgl-typings/deck.gl__mesh-layers
    node_modules/@danmarshall/deckgl-typings/deck.gl__geo-layers
    node_modules/@danmarshall/deckgl-typings/deck.gl__extensions
    node_modules/@danmarshall/deckgl-typings/deck.gl__react
    node_modules/@danmarshall/deckgl-typings/deck.gl
    node_modules/@danmarshall/deckgl-typings/luma.gl__webgl-state-tracker
    node_modules/@danmarshall/deckgl-typings/luma.gl__webgl
    node_modules/@danmarshall/deckgl-typings/luma.gl__shadertools
    node_modules/@danmarshall/deckgl-typings/luma.gl__core
    node_modules/@danmarshall/deckgl-typings/math.gl


)

for  folder in "${folders[@]}"
do
    if [[ -d ${folder} ]]; then
        echo  ${folder}
         cp -R ${folder} node_modules/@types/
    fi
done