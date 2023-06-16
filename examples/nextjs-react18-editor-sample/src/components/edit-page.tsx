import DeckGL from 'deck.gl/typed';
import { ViewMode } from '@nebula.gl/edit-modes';
import { EditableGeoJsonLayer, SelectionLayer } from "@nebula.gl/layers";
import { Map as MapBox } from "react-map-gl";


import { EditorLayout } from "@/components/edit-layout";
import Toolbox, { SELECTION_TYPE } from '@/components/map-edit-toolbox';
import React from "react";

const MAP_STYLE = "mapbox://styles/mapbox/dark-v9";
const INITIAL_VIEW_STATE = {
  longitude: -95.36403,
  latitude: 29.756433,
  zoom: 19,
  maxZoom: 24,
  pitch: 0,
  bearing: 0,
  heading: 0,
  streetViewControl: false,
};

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiZ2Vvcmdpb3MtdWJlciIsImEiOiJjanZidTZzczAwajMxNGVwOGZrd2E5NG90In0.gdsRu_UeU_uPi9IulBruXA";

export default function MyMap() {
  const [features, setFeatures] = React.useState<{
    type: string;
    features: any[];
  }>({
    type: "FeatureCollection",
    features: [],
  });
  const [viewState, setViewState] = React.useState(INITIAL_VIEW_STATE);
  const [editMode, setEditMode] = React.useState<any>(() => ViewMode);
  const [selectMode, setSelectMode] = React.useState<any>(
    () => SELECTION_TYPE.NONE
  );

  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = React.useState<any[]>(
    []
  );
  const [modeConfig, setModeConfig] = React.useState<any>({});

  function onLayerClick(info: any) {
    if (editMode !== ViewMode) {
      return;
    }
    setSelectedFeatureIndexes(info.object ? [info.index] : []);
  }
  const layers: any[] = [
    new (EditableGeoJsonLayer as any)({
      id: 'draw-layer',
      data: features,
      mode: editMode,
      modeConfig,
      pickable: true,
      selectedFeatureIndexes,
      onEdit: ({ updatedData, editType }: { updatedData: any, editType: string }) => {
        setFeatures(updatedData);
        console.log("onEdit");
        console.log("editType", editType);

        console.log("updatedData", updatedData);
        console.log("editMode", editMode);
        console.log("selectMode", selectMode);
        console.log("modeConfig", modeConfig);
        console.log("selectedFeatureIndexes", selectedFeatureIndexes);

        setSelectMode(() => SELECTION_TYPE.NONE);
        if (modeConfig.booleanOperation === undefined && editType === "addTentativePosition") {
          setSelectedFeatureIndexes([]);
        }
      },
    }),
    new (SelectionLayer as any)({
      id: 'select-layer',
      selectionType: selectMode,
      layerIds: ['draw-layer'],
      onSelect: ({ pickingInfos }: { pickingInfos: any[] }) => {
        console.log("onSelect");
        console.log(pickingInfos);
        setSelectedFeatureIndexes(
          pickingInfos.map((info: any) => info.index).filter((index) => index < features.features.length)
        );
      },
      getTentativeLineColor: () => [192, 192, 192, 255],
      lineWidthMinPixels: 0.2
    })
  ];
  return (
    <EditorLayout
      control={
        <Toolbox
          geoJson={features}
          editMode={editMode}
          selectMode={selectMode}
          selectedFeatureIndexes={selectedFeatureIndexes}
          modeConfig={modeConfig}
          onSetEditMode={setEditMode}
          onSetSelectMode={setSelectMode}
          onSetSelectedFeatureIndexes={setSelectedFeatureIndexes}
          onSetModeConfig={setModeConfig}
          onImport={(imported) =>
            setFeatures({
              ...features,
              features: [...features.features, ...imported.features],
            })
          }
          onSetGeoJson={setFeatures}
        />
      }
    >
      <DeckGL
        style={{ overflow: "hidden" }}
        initialViewState={viewState}
        controller={true}
        layers={layers}
        onClick={onLayerClick}
      >
        <MapBox
          initialViewState={viewState}
          maxZoom={viewState.maxZoom}
          doubleClickZoom={false}
          attributionControl={false}
          mapStyle={MAP_STYLE}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </EditorLayout>
  );
}
