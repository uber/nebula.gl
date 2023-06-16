import {
  DrawCircleFromCenterMode,
  DrawLineStringMode,
  DrawPointMode,
  DrawPolygonMode,
  DrawRectangleMode,
  MeasureAngleMode,
  MeasureAreaMode,
  MeasureDistanceMode,
  ModifyMode,
  ViewMode,
} from "@nebula.gl/edit-modes";
import { ExportModal, ImportModal } from "@nebula.gl/editor";
import {
  ActivityIcon,
  BoxSelectIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  DownloadIcon,
  EraserIcon,
  HexagonIcon,
  MapPinIcon,
  MinusIcon,
  PlusIcon,
  PointerIcon,
  RectangleHorizontalIcon,
  RedoIcon,
  RulerIcon,
  SettingsIcon,
  ShareIcon,
  Trash2Icon,
  TrashIcon,
  TriangleIcon,
  UndoIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import styled from "styled-components";

export const SELECTION_TYPE = {
  NONE: null,
  RECTANGLE: 'rectangle',
  POLYGON: 'polygon',
};
const Tools = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 10px;
  right: 10px;
`;

const Button = styled.button<{ active?: boolean; kind?: string }>`
  color: #fff;
  background: ${({ kind, active }) =>
    kind === "danger"
      ? "rgb(180, 40, 40)"
      : active
        ? "rgb(0, 105, 217)"
        : "rgb(90, 98, 94)"};
  font-size: 1em;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  border: 1px solid transparent;
  border-radius: 0.25em;
  margin: 0.05em;
  padding: 0.1em 0.2em;
  :hover {
    background: rgb(128, 137, 133);
  }
`;

const SubToolsContainer = styled.div`
  position: relative;
`;

const SubTools = styled.div`
  display: flex;
  flex-direction: row-reverse;
  position: absolute;
  top: 0;
  right: 0;
`;

export type Props = {
  editMode: any;
  selectMode: any;
  selectedFeatureIndexes: any;
  modeConfig: any;
  geoJson: any;
  onSetEditMode: (mode: any) => unknown;
  onSetSelectMode: (mode: any) => unknown;
  onSetSelectedFeatureIndexes: (mode: any) => unknown;
  onSetModeConfig: (modeConfig: any) => unknown;
  onSetGeoJson: (geojson: any) => unknown;
  onImport: (imported: any) => unknown;
};
const MODE_GROUPS: {
  modes: {
    mode: typeof ViewMode;
    content: JSX.Element;
    title?: string;
  }[];
}[] = [
    {
      modes: [{ mode: DrawPointMode, content: <MapPinIcon /> }],
    },
    {
      modes: [
        {
          mode: DrawLineStringMode,
          content: <ActivityIcon />,
        },
      ],
    },
    {
      modes: [
        { mode: DrawPolygonMode, content: <HexagonIcon /> },
        { mode: DrawRectangleMode, content: <RectangleHorizontalIcon /> },
        { mode: DrawCircleFromCenterMode, content: <CircleIcon /> },
      ],
    },
    {
      modes: [
        { mode: MeasureDistanceMode, content: <RulerIcon /> },
        { mode: MeasureAngleMode, content: <ChevronLeftIcon /> },
        { mode: MeasureAreaMode, content: <TriangleIcon /> },
      ],
    },
  ];

function ModeButton({ buttonConfig, mode, onClick }: any) {
  return (
    <Button
      title={buttonConfig.title || buttonConfig.mode.name}
      active={buttonConfig.mode === mode}
      onClick={onClick}
    >
      {buttonConfig.content}
    </Button>
  );
}
function ModeGroupButtons({ modeGroup, mode, onSetMode }: any) {
  const [expanded, setExpanded] = React.useState(false);

  const { modes } = modeGroup;

  let subTools = null;

  if (expanded) {
    subTools = (
      <SubTools>
        {modes.map(
          (
            buttonConfig: { mode: any; content: any; title: string },
            i: any
          ) => (
            <ModeButton
              key={i}
              buttonConfig={buttonConfig}
              mode={mode}
              onClick={() => {
                onSetMode(() => buttonConfig.mode);
                setExpanded(false);
              }}
            />
          )
        )}
      </SubTools>
    );
  }

  const buttonConfig = modes.find((m: any) => m.mode === mode) || modes[0];

  return (
    <SubToolsContainer>
      {subTools}
      <ModeButton
        buttonConfig={buttonConfig}
        mode={mode}
        onClick={() => {
          onSetMode(() => buttonConfig.mode);
          setExpanded(true);
        }}
      />
    </SubToolsContainer>
  );
}

const BlackJson = { type: "FeatureCollection", features: [] };
var history: any[] = [];
export default function Toolbox({
  editMode,
  selectMode,
  selectedFeatureIndexes,
  modeConfig,
  geoJson,
  onSetEditMode,
  onSetSelectMode,
  onSetSelectedFeatureIndexes,
  onSetModeConfig,
  onSetGeoJson,
  onImport,
}: Props) {
  const [showConfig, setShowConfig] = React.useState(false);
  const [showImport, setShowImport] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);
  const [showClearConfirmation, setShowClearConfirmation] =
    React.useState(false);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  var saveData = React.useCallback(() => {
    console.log("Saving data");
    const newData = { ...geoJson };
    const newHistory = [...history];

    if (historyIndex < newHistory.length - 1) {
      newHistory.splice(historyIndex + 1);
    }
    // Don't save if data is the same as last saved
    if (
      JSON.stringify(history[history.length - 1]) === JSON.stringify(newData)
    ) {
      return;
    }
    // Only update history if data has changed
    if (
      JSON.stringify(newHistory[newHistory.length - 1]) !==
      JSON.stringify(newData)
    ) {
      newHistory.push(newData);
    }
    history = newHistory;
    setHistoryIndex(newHistory.length - 1);
    localStorage.setItem(
      "map-edit-toolbox-storage",
      JSON.stringify(newHistory)
    );
    console.log("Data saved to localStorage:", newHistory);
  }, [geoJson, historyIndex]);

  // Load data from localStorage on mount
  React.useEffect(() => {
    var data = JSON.parse(
      localStorage.getItem("map-edit-toolbox-storage") || '[{"type":"FeatureCollection","features":[]}]'
    );
    history = data;
    setHistoryIndex(data.length - 1);
    onSetGeoJson(data[data.length - 1]);
    console.log("Data loaded from localStorage:", data);
  }, []);

  // Save data to localStorage on change
  React.useEffect(() => {
    const handleSave = (event: any) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        saveData();
      }
    };
    document.addEventListener("keydown", handleSave);
    return () => {
      document.removeEventListener("keydown", handleSave);
    };
  }, [historyIndex, saveData]);

  function undo() {
    if (historyIndex > 0) {
      if (history[historyIndex] !== geoJson) {
        saveData();
      }
      setHistoryIndex(historyIndex - 1);
      onSetGeoJson(history[historyIndex - 1]);
    }
  }
  function redo() {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onSetGeoJson(history[historyIndex + 1]);
    }
  }

  return (
    <>
      <Tools>
        <SubToolsContainer>
          <Button
            onClick={() => {
              onSetEditMode(() => ViewMode);
              onSetSelectMode(SELECTION_TYPE.NONE);
              setShowConfig(false);
              setShowClearConfirmation(false);
            }}
            title="ViewMode"
          >
            <PointerIcon />
          </Button>
          <Button
            onClick={() => {
              onSetSelectMode(SELECTION_TYPE.RECTANGLE);
              onSetEditMode(() => ModifyMode);
            }}
            title="SelectEditModifyMode"
          >
            <BoxSelectIcon />
          </Button>
        </SubToolsContainer>

        {MODE_GROUPS.map((modeGroup, i) => (
          <ModeGroupButtons
            key={i}
            modeGroup={modeGroup}
            mode={editMode}
            onSetMode={onSetEditMode}
          />
        ))}
        <Button onClick={() => setShowExport(true)} title="Export">
          <DownloadIcon />
        </Button>
        <Button onClick={() => setShowImport(true)} title="Import">
          <ShareIcon />
        </Button>

        <SubToolsContainer>
          <Button onClick={() => setShowConfig(true)}>
            <SettingsIcon />
          </Button>
          {showConfig && (
            <SubTools>
              <Button
                title="closeOperation"
                onClick={() => {
                  onSetModeConfig({});
                  setShowConfig(false);
                }}
              >
                <ChevronRightIcon />
              </Button>
              <Button
                title="difference"
                onClick={() =>
                  onSetModeConfig({ booleanOperation: "difference" })
                }
                active={
                  modeConfig && modeConfig.booleanOperation === "difference"
                }
              >
                <MinusIcon />
              </Button>
              <Button
                title="union"
                onClick={() => onSetModeConfig({ booleanOperation: "union" })}
                active={modeConfig && modeConfig.booleanOperation === "union"}
              >
                <PlusIcon />
              </Button>
              <Button
                title="intersection"
                onClick={() =>
                  onSetModeConfig({ booleanOperation: "intersection" })
                }
                active={
                  modeConfig && modeConfig.booleanOperation === "intersection"
                }
              >
                <XIcon />
              </Button>
            </SubTools>
          )}
        </SubToolsContainer>

        <SubToolsContainer>
          <Button onClick={() => setShowClearConfirmation(true)} title="Clear">
            <TrashIcon />
          </Button>
          {showClearConfirmation && (
            <SubTools>
              <Button
                title="Eraser select features"
                onClick={() => {
                  saveData();
                  geoJson.features = geoJson.features.filter(
                    (feature: any, index: number) =>
                      selectedFeatureIndexes.indexOf(index) === -1
                  );
                  onSetSelectedFeatureIndexes([]);
                  onSetGeoJson(JSON.parse(JSON.stringify(geoJson)));
                  setShowClearConfirmation(false);
                }}
              >
                <EraserIcon />
              </Button>
              <Button
                title="Clean all history features"
                onClick={() => {
                  geoJson = BlackJson;
                  onSetGeoJson(BlackJson);
                  history = [];
                  setHistoryIndex(history.length - 1);
                  saveData();
                  setShowClearConfirmation(false);
                }}
              >
                <Trash2Icon />
              </Button>
              <Button
                title="cancel"
                onClick={() => setShowClearConfirmation(false)}
              >
                <XCircleIcon />
              </Button>
            </SubTools>
          )}
        </SubToolsContainer>

        <Button onClick={() => redo()} title="redo">
          <RedoIcon />
        </Button>
        <Button onClick={() => undo()} title="undo">
          <UndoIcon />
        </Button>
      </Tools>

      {showImport && (
        <ImportModal
          onImport={(imported) => {
            onImport(imported);
            setShowImport(false);
          }}
          onClose={() => setShowImport(false)}
        />
      )}

      {showExport && (
        <ExportModal geoJson={geoJson} onClose={() => setShowExport(false)} />
      )}
    </>
  );
}
