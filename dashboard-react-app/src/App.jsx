import React, { useState, useRef, useEffect } from 'react';
import { Sheet } from 'react-modal-sheet';
import { fetchMicData, fetchShowData, postMicCheckStatus, clearMicCheckStatus } from './utils/apiUtils'

import ToggleSwitch from './ToggleSwitch';
import ModeSelector from './ModeSelector';

const GRID_ROWS = 6;
const GRID_COLS = 5;

// The mininum number of 'no audio' signals to change color
const noAudioBufferMax = 10;

const noAudioStatus = "No Audio"

function getMicColor(status) {
  var color = "white";
  if (status == "No RF") {
    color = "LightCoral";
    // Removing no audio status
  } else if (status == "Offline") {
    color = "skyblue";
  } else if (status == "Low Battery") {
    color = "yellow";
  } else if (status == "Good") {
    color = "lightgreen";
  }

  return color;
}

function getOperationStatusColor(status) {
  const noaudiolive = "white"
  const audiolive = "yellow"
  const noaudio = "lightblue"
  const overdrive = "red"
  const other = "#E1BEE7"
  var color = "white"
  var msg = ""

  if (status === 7 ) {
    color = noaudiolive
    msg = "Muted"
  } else if (status === 15 ) {
    color = noaudiolive
    msg = "Muted"
  } else if (status === 3) {
    color = audiolive
    msg = "Live"
  } else if (status === 11) {
    color = audiolive
    msg = "Live"
  } else if (status === 4) {
    color = noaudio
    msg = "No Audio"
  } else if (status === 12) {
    color = noaudio
    msg = "No Audio"
  } else if (status === 1) {
    color = overdrive
    msg = "Overdrive"
  } else if (status === 9) {
    color = overdrive
    msg = "Overdrive"
  } else {
    color = other
    msg = "Unknown"
  }
  return [color, msg]
}

function getActorColor(actors) {
  const goodColor = "green"
  const badColor = "lightcoral"
  if (!Array.isArray(actors) || actors.length == 0) {
    // goes to the default if 
    return badColor
  }


  var allCheck = true;
  for (const element of actors) {
    if (!element.checked) {
      allCheck = false;
      break;
    }
  }
  var color;
  if (allCheck) {
    color = goodColor
  } else {
    color = badColor
  }
  return color;
}

function getComboBackgroundColor(status, actors) {
  const topColor = getMicColor(status);
  const bottomColor = getActorColor(actors);

  const colorPayload = `linear-gradient(to bottom, ${topColor} 35%, ${bottomColor} 35%)`;

  return colorPayload;
}

function getTheaterMixComboBackgroundColor(apiStatus, theaterMixStatus, actors) {
  const topColor = "white";
  const midLeftColor = getMicColor(apiStatus);
  const midRightColor = "green";
  const bottomColor = getActorColor(actors);

  return `
    linear-gradient(to right,
      ${midLeftColor} 50%,
      ${midRightColor} 50%
    ) 0 15% / 100% 25% no-repeat,
    linear-gradient(to bottom,
      ${topColor} 15%,
      ${topColor} 15%,
      transparent 15%,
      transparent 35%,
      ${bottomColor} 35%
    ) 0 0 / 100% 100% no-repeat
  `;

}

function GridCell({ row, col, value, onClick, mode, onMicCheckRowToggle }) {
  const topColor = "white";
  const midLeftColor = getMicColor(value.status);
  const [midRightColor, midRightMsg] = getOperationStatusColor(value.opstatus);
  const inMicCheckMode = mode === "Mic Check";
  const inEditCastMode = mode === "Edit Cast";
  const bottomColor = inMicCheckMode
    ? getActorColor(value.actors)
    : "white";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        display: "inline-block",
        cursor: "pointer",
        padding: 0,
        minWidth: 160,
        overflow: "hidden",
      }}
      onClick={() => onClick(row, col)}
    >
      {/* Top section */}
      <div
        style={{
          background: topColor,
          padding: 8,
        }}
      >
        <div style={{ fontWeight: "bold" }}>Mic #{value?.micnumber}</div>
      </div>

      {/* Middle section: left/right split */}
      <div
        style={{
          display: "flex",
          height: 40, // adjust as needed
        }}
      >
        <div
          style={{
            flex: 1,
            background: midLeftColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            border: "1px solid black",
            boxSizing: "border-box",
          }}
        >
          {/* LEFT mid label */}
          {value.status}
        </div>
        <div
          style={{
            flex: 1,
            background: midRightColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            border: "1px solid black",
            boxSizing: "border-box",
          }}
        >
          {/* RIGHT mid label */}
          {midRightMsg}
        </div>
      </div>

      {/* Bottom section for mic checks*/}
      {(inMicCheckMode || inEditCastMode) && (
        <div
          style={{
            background: bottomColor,
            padding: 8,
          }}
        >
          {/* Bottom label */}
          {inMicCheckMode && (
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>Actor Assignments</div>
          )}

          {inMicCheckMode &&
            Array.from({ length: 4 }).map((_, idx) => {
              const actor = value.actors?.[idx];
              return (
                <label
                  key={idx}
                  style={{ display: "flex", alignItems: "center", minHeight: 24, cursor: actor ? "pointer" : "default" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    style={{ marginLeft: 8 }}
                    type="checkbox"
                    checked={!!actor && actor.checked}
                    disabled={!actor}
                    onChange={e => {
                      if (actor) {
                        onMicCheckRowToggle(row, col, idx, !actor.checked);
                      }
                      e.stopPropagation();
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                  {actor ? actor.name : "\u00A0"}
                </label>
              );
            })}

          {/* Bottom label */}
          {inEditCastMode && (
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>Actor Assignments</div>
          )}

          {inEditCastMode &&
            Array.from({ length: 4 }).map((_, idx) => {
              const actor = value.actors?.[idx];
              return (
                <div
                  key={idx}
                  style={{ display: "flex", alignItems: "center", minHeight: 24 }}
                >
                  <input
                    type="text"
                    style={{ marginLeft: 8, flex: 1 }}
                    value={actor ? actor.name : ""}
                    onChange={(e) => {
                      // For now just local update; you can later wire this to a POST
                      if (!actor) return;
                      const newName = e.target.value;

                      // shallow-copy grid data at higher level later if you want to persist
                      const updatedActor = { ...actor, name: newName };
                      const updatedActors = [...(value.actors || [])];
                      updatedActors[idx] = updatedActor;
                      // If you want to push this up, add a callback like onActorNameChange
                      // and call it here with (row, col, idx, newName)
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}


function convertToRowCol(index) {
  const row = Math.floor((index - 1) / GRID_COLS);
  const col = (index - 1) % GRID_COLS;
  return [row, col]
}

export default function App() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [micData, setMicData] = useState(null);
  const [showData, setShowData] = useState(null);
  const [title, setTitle] = useState("");
  const [grid, setGrid] = React.useState(
    Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill({ text: "No mic data", status: null, opstatus: null }))
  );
  const sheetRef = useRef(null);

  // const [micCheckEnabled, setMicCheckEnabled] = useState(false);
  const [mode, setMode] = useState("Monitor");

  const handleMicCheckRowToggle = async (row, col, micRow, checked) => {
    //TODO: Make this do a POST to the API.
    try {
      const mic = grid[row][col];
      const payload = { micnumber: mic.micnumber, name: mic.actors[micRow].name, miccheck: checked };
      const result = await postMicCheckStatus(payload);

      const newData = await fetchMicData();
      setMicData(newData);

    } catch (error) {
      console.log("Error calling mic check: ", error);
    }
  };

  const handleClearAll = async () => {
    console.log("handle clear all");
    try {
      const result = await clearMicCheckStatus();
      console.log("Clear all result: ", result);

      const newData = await fetchMicData();
      setMicData(newData);
    } catch (error) {
      console.log("Error clearing all: ", error);
    }
  }



  function makeDetailsContent(obj, indent = "") {
    return Object.entries(obj)
      .map(([key, value]) => {
        if (key == "actors") {
          var payload = "actors:\n";
          for (const index in value) {
            const actor = value[index];
            payload += `${indent}  name: ${actor.name} miccheck: ${actor.checked}\n`
          }
          return payload
        }
        else if (Array.isArray(value)) {
          // Nested array of KVPs
          return `${indent}${key}:\n${value.map((item, idx) =>
            typeof item === "object"
              ? makeDetailsContent(item, indent + "  ")  // Recurse deeper
              : `${indent}  [${idx}]: ${item}`
          ).join('\n')
            }`;
        } else if (typeof value === "object" && value !== null) {
          // Nested object
          return `${indent}${key}:\n${makeDetailsContent(value, indent + "  ")}`;
        } else {
          // Primitive value
          return `${indent}${key}: ${value}`;
        }
      })
      .join('\n');
  }

  useEffect(() => {
    // TODO: Call fetchMicData periodically, not just on refresh.
    let intervalidID = setInterval(() => {
      fetchMicData().then(data => {
        setMicData(data);
        //console.log(micData)
      });
    }, 1000);

    return () => clearInterval(intervalidID);

  }, [])

  useEffect(() => {
    let intervalidID = setInterval(() => {
      fetchShowData().then(data => {
        const name = data?.activeshowname ?? "Unknown show";
        setTitle(name)
      })
    }, 5000);
    return () => clearInterval(intervalidID);
  }, []);

  useEffect(() => {
    if (micData && micData.length > 0) {
      const first = micData[0];
      //if (first && first.showTag) {
      // setTitle(first.showTag);
      //}
      setGrid(prev => {
        const updated = prev.map(rowArr => [...rowArr]);
        for (var x = 0; x < micData.length; x++) {
          const mic = micData[x];
          const [row, col] = convertToRowCol(mic.micnumber)
          const detailsContent = makeDetailsContent(mic);
          // TODO: Get proper formatting here.

          var previousStatus = null;
          const prevValue = prev[row][col];
          if (prevValue && Object.hasOwn(prevValue, 'status')) {
            previousStatus = prevValue.status;
          }

          const value = {
            text: `micnumber: ${mic.micnumber}\nipaddress: ${mic.ipaddress}`,
            status: mic.micstatus,
            opstatus: mic.opstatus,
            statusLabel: mic.micstatus,
            micnumber: mic.micnumber,
            ipaddress: mic.ipaddress,
            actors: mic.actors,
            details: detailsContent,
            previousStatus: previousStatus
          }
          updated[row][col] = value;
        }
        return updated;
      });
    }
  }, [micData]);

  const handleCellClick = (row, col) => {
    // This is what opens the details panel, it fires when a cell is clicked.
    setSelectedCell({ row, col });
    setPanelOpen(true);
  };



  return (
    // the parent div that holds all components
    // dad, change the fontsize above Loading... to fit what you want
    <div style={{ color: "#111"}}> 
      <table style={{ height: "100vh", width: "100vw", background: "#eef2f7" }}>
        <tbody>
          <tr>
            <td style={{ textAlign: "center", paddingTop: 16 }}>
              <h1 style={{ margin: 0, fontSize: "20px" }}>
                {title || "Loading…"}
              </h1>
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", padding: 24, paddingTop: 8, paddingBottom: 8 }}>
              <ModeSelector value={mode} onChange={setMode} />

              {mode === "Mic Check" && (
                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={handleClearAll}
                    style={{
                      padding: "8px 16px",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top", padding: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: `repeat(${GRID_ROWS}, auto)`,
                  gridTemplateColumns: `repeat(${GRID_COLS}, auto)`,
                  gap: "8px",
                  overflowY: "auto"
                }}
              >
                {Array.from({ length: GRID_ROWS }).map((_, row) =>
                  Array.from({ length: GRID_COLS }).map((_, col) =>
                    <GridCell
                      key={`${row}-${col}`}
                      row={row} col={col}
                      value={grid[row][col]}
                      onClick={handleCellClick}
                      mode={mode}
                      onMicCheckRowToggle={handleMicCheckRowToggle}
                    />
                  )
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>



      <Sheet
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        snapPoints={[0, 0.25, 0.5, 0.75, 1]}   // Use percentage values
        initialSnap={2}                         // Snap to 0.5 (50% height) initially
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div style={{ padding: "24px", maxHeight: "60vh", overflowY: "auto" }}>
              <h2>Reciever Info</h2>
              {selectedCell &&
                <div>
                  <pre>{grid[selectedCell.row][selectedCell.col].details}</pre>
                </div>
              }
              <button onClick={() => setPanelOpen(false)}>Close</button>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onClick={() => setPanelOpen(false)} />
      </Sheet>


    </div>
  );
}
