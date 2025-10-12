import React, { useState, useRef, useEffect } from 'react';
import { Sheet } from 'react-modal-sheet';
import { fetchMicData, postMicCheckStatus, clearMicCheckStatus } from './utils/apiUtils'

import ToggleSwitch from './ToggleSwitch';

const GRID_ROWS = 6;
const GRID_COLS = 5;

// The mininum number of 'no audio' signals to change color
const noAudioBufferMax = 10;

const noAudioStatus = "No Audio"

function getBackgroundColor(status) {
  var color = "white";
  if (status == "Offline" || status == "No RF") {
    color = "LightCoral";
  } else if (status == noAudioStatus) {
    color = "skyblue";
  } else if (status == "Low Battery") {
    color = "yellow";
  } else if (status == "Good") {
    color = "lightgreen";
  }

  return color;
}

function getActorColor(actors) {
  var allCheck = true;
  for (const element of actors) {
    if (!element.checked) {
      allCheck = false;
      break;
    }
  }
  var color;
  if (allCheck) {
    color = "green"
  } else {
    color = "lightcoral"
  }
  return color;
}

function getComboBackgroundColor(status, actors) {
  const topColor = getBackgroundColor(status);
  const bottomColor = getActorColor(actors);

  const colorPayload = `linear-gradient(to bottom, ${topColor} 35%, ${bottomColor} 35%)`;

  return colorPayload;
}

function GridCell({ row, col, value, onClick, micCheckEnabled, onMicCheckRowToggle }) {
  var bgColor;
  if (micCheckEnabled && value.text != "No mic data") {
    bgColor = getComboBackgroundColor(value.status, value.actors);
  } else {
    bgColor = getBackgroundColor(value.status);
  }

  // background: '#f9f9f9'
  // {lines.map((line, i) => <div key={i}>{line}</div>)}
  return (
    <div
      style={{
        border: '1px solid #ccc',
        display: 'inline-block', // allows cell to shrink/grow to fit content
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: bgColor,
        padding: micCheckEnabled ? 24 : 8,
        minWidth: 160,
      }}
      onClick={() => onClick(row, col)}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span>Mic #: {value?.micnumber}</span>

        <span>Status: {value?.statusLabel}</span>
        {micCheckEnabled && (
          <>
            {Array.from({ length: 4 }).map((_, idx) => {
              const actor = value.actors?.[idx];
              return (
                <label
                  key={idx}
                  style={{ display: "flex", alignItems: "center", minHeight: 24 }}
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
                  {actor ? actor.name : '\u00A0'}
                </label>
              )
            })}
          </>
        )}
      </div>
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
  const [grid, setGrid] = React.useState(
    Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill({ text: "No mic data", status: null }))
  );
  const sheetRef = useRef(null);

  const [micCheckEnabled, setMicCheckEnabled] = useState(false);

  const handleMicCheckRowToggle = async (row, col, micRow, checked) => {
    //TODO: Make this do a POST to the API.
    try {
      const mic = grid[row][col];
      const payload = { micnumber: mic.micnumber, name: mic.actors[micRow].name, miccheck: checked };
      console.log(payload);
      const result = await postMicCheckStatus(payload);
      console.log("Mic check result: ", result);

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
          var payload = "";
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

  function handleNoAudios(oldStatus, newStatus, audioCount) {
    var finalStatus = newStatus;
    var statusLabel = finalStatus;
    if (newStatus == noAudioStatus) {
      if (oldStatus == "Low Battery" || oldStatus == "Good") {
        audioCount += 1;
        if (audioCount >= noAudioBufferMax) {
          finalStatus = newStatus;
          statusLabel = newStatus;
        } else {
          finalStatus = oldStatus;
          statusLabel = `${newStatus} (${audioCount}s)`
        }
      } else {
        audioCount = 0;
      }
    } else {
      audioCount = 0;
    }

    return [finalStatus, statusLabel, audioCount];
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
    if (micData && micData.length > 0) {
      setGrid(prev => {
        const updated = prev.map(rowArr => [...rowArr]);
        for (var x = 0; x < micData.length; x++) {
          const mic = micData[x];
          const [row, col] = convertToRowCol(mic.micnumber)
          const detailsContent = makeDetailsContent(mic);
          // TODO: Get proper formatting here.

          var previousStatus = null;
          var audioCount = 0;
          const prevValue = prev[row][col];
          if (prevValue && Object.hasOwn(prevValue, 'status')) {
            previousStatus = prevValue.status;
          }
          if (prevValue && Object.hasOwn(prevValue, 'noAudioCount')) {
            audioCount = prevValue.noAudioCount;
          }

          const [finalStatus, statusLabel, finalCount] = handleNoAudios(previousStatus, mic.micstatus, audioCount);

          const value = {
            text: `micnumber: ${mic.micnumber}\nipaddress: ${mic.ipaddress}`,
            status: finalStatus,
            statusLabel: statusLabel,
            micnumber: mic.micnumber,
            ipaddress: mic.ipaddress,
            actors: mic.actors,
            details: detailsContent,
            noAudioCount: finalCount,
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
    <div>
      <table style={{ height: "100vh", width: "100vw", background: "#eef2f7" }}>
        <tbody>
          <tr>
            <td style={{ textAlign: "center", padding: 24 }}>
              <ToggleSwitch
                label="Mic Check"
                checked={micCheckEnabled}
                onChange={setMicCheckEnabled}
                clickHandler={handleClearAll}
              />
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
                      micCheckEnabled={micCheckEnabled}
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
