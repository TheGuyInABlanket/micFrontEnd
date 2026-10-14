import React, { useState, useRef, useEffect } from 'react';
import { Sheet } from 'react-modal-sheet';
import { fetchMicData, fetchShowData, postMicCheckStatus, clearMicCheckStatus, postShowConfiguration, postActiveShow } from './utils/apiUtils'

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
  } else if (status == "RF Off") {
    color = "red";
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

  if (status === 7) {
    color = noaudiolive
    msg = "Muted"
  } else if (status === 15) {
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

function GridCell({
  row,
  col,
  value,
  onClick,
  mode,
  onMicCheckRowToggle,
  onActorNameChange,
}) {
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minHeight: 24,
                  }}
                >
                  <input
                    type="text"
                    style={{ marginLeft: 8, flex: 1 }}
                    value={actor?.name ?? ""}
                    disabled={value.micnumber == null}
                    onChange={(e) =>
                      onActorNameChange(row, col, idx, e.target.value)
                    }
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

function createCastDraft(grid, configuration, showNumber) {
  const show = configuration?.shows?.showlist?.find(
    (item) => String(item.shownumber) === String(showNumber)
  );

  if (!show) {
    throw new Error(`Show ${showNumber} was not found`);
  }

  const castByMic = new Map(
    show.cast.map((entry) => [
      String(entry.micnumber),
      entry.actors,
    ])
  );

  return grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      actors: (castByMic.get(String(cell.micnumber)) ?? []).map(
        (name) => ({
          name,
          checked: false,
        })
      ),
    }))
  );
}

function getCastSnapshot(grid) {
  return JSON.stringify(
    grid
      .flat()
      .filter((cell) => cell?.micnumber != null)
      .map((cell) => ({
        micnumber: String(cell.micnumber),
        actors: (cell.actors ?? [])
          .map((actor) => actor.name)
          .filter(
            (name) =>
              typeof name === "string" && name.trim() !== ""
          ),
      }))
  );
}

export default function App() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [micData, setMicData] = useState(null);
  const [showData, setShowData] = useState(null);
  const [title, setTitle] = useState("");

  const [isSavingCast, setIsSavingCast] = useState(false);
  const [castSaveError, setCastSaveError] = useState("");

  const [draftBaseline, setDraftBaseline] = useState("");
  const [isChangingShow, setIsChangingShow] = useState(false);

  const [draftShowName, setDraftShowName] = useState("");
  const [showNameBaseline, setShowNameBaseline] = useState("");
  const [grid, setGrid] = React.useState(
    Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill({ text: "No mic data", status: null, opstatus: null }))
  );
  const sheetRef = useRef(null);

  // const [micCheckEnabled, setMicCheckEnabled] = useState(false);
  const [mode, setMode] = useState("Monitor");
  const [activeShow, setActiveShow] = useState(1);
  const [draftGrid, setDraftGrid] = useState(null);
  const [editedShowNumber, setEditedShowNumber] = useState(null);

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

  const handleSaveCast = async () => {
    if (controlsBusy) return;

    const showName = draftShowName.trim();

    if (!showName) {
      setCastSaveError("Please enter a show title.");
      return;
    }

    if (!showData || !draftGrid || !editedShowNumber) {
      setCastSaveError("No cast draft is available to save.");
      return;
    }

    setIsSavingCast(true);
    setCastSaveError("");

    try {
      const updatedConfiguration = buildShowConfiguration(
        showData,
        draftGrid,
        editedShowNumber,
        showName
      );

      const savedConfiguration = await postShowConfiguration(
        updatedConfiguration
      );

      // Your endpoint returns the full submitted configuration.
      setShowData(savedConfiguration);
      setTitle(
        savedConfiguration.shows.activeshowname ?? "Unknown show"
      );
      setActiveShow(
        Number(savedConfiguration.shows.activeshownumber)
      );

      setDraftGrid(null);
      setEditedShowNumber(null);
      clearCastDraft();
      setMode("Monitor");
    } catch (error) {
      console.error("Error saving cast:", error);
      setCastSaveError(error.message);

      // Keep the draft so the user can retry without losing edits.
    } finally {
      setIsSavingCast(false);
    }
  };

  const handleDiscardCast = () => {
    if (controlsBusy) return;

    clearCastDraft();
    setCastSaveError("");
    setMode("Monitor");
  };

  function buildShowConfiguration(
    configuration,
    grid,
    editedShowNumber,
    editedShowName
  ) {
    const targetShowNumber = String(editedShowNumber);

    const targetExists = configuration.shows.showlist.some(
      (show) => String(show.shownumber) === targetShowNumber
    );

    if (!targetExists) {
      throw new Error(`Show ${targetShowNumber} was not found`);
    }

    const gridCast = grid
      .flat()
      .filter((cell) => cell?.micnumber != null)
      .map((cell) => ({
        actors: (cell.actors ?? [])
          .map((actor) => actor.name)
          .filter((name) => typeof name === "string" && name.trim() !== ""),
        micnumber: String(cell.micnumber),
      }));

    const showlist = configuration.shows.showlist.map((show) => {
      if (String(show.shownumber) !== targetShowNumber) {
        return show;
      }

      // Preserve microphones that aren't represented in the grid.
      const castByMic = new Map(
        show.cast.map((entry) => [String(entry.micnumber), entry])
      );

      for (const entry of gridCast) {
        castByMic.set(entry.micnumber, entry);
      }

      return {
        ...show,
        showname: editedShowName,
        cast: Array.from(castByMic.values()).sort(
          (a, b) => Number(a.micnumber) - Number(b.micnumber)
        ),
      };
    });



    const editingActiveShow =
      String(configuration.shows.activeshownumber) ===
      targetShowNumber;

    return {
      ...configuration,
      shows: {
        ...configuration.shows,
        activeshowname: editingActiveShow
          ? editedShowName
          : configuration.shows.activeshowname,
        showlist,
      },
    };
  }

  const handleModeChange = (nextMode) => {
    if (controlsBusy || nextMode === mode) return;

    if (
      mode === "Edit Cast" &&
      !confirmDiscardEdits(`Switching to ${nextMode}`)
    ) {
      return;
    }

    if (nextMode === "Edit Cast") {
      try {
        const showNumber =
          showData?.shows?.activeshownumber;

        if (showNumber == null) {
          throw new Error(
            "Show configuration has not loaded yet"
          );
        }

        startCastDraft(showData, showNumber);
        setCastSaveError("");
        setMode(nextMode);
      } catch (error) {
        console.error(error);
        setCastSaveError(error.message);
      }

      return;
    }

    clearCastDraft();
    setCastSaveError("");
    setMode(nextMode);
  };

  const handleActorNameChange = (row, col, actorIndex, newName) => {
    setDraftGrid((previous) => {
      if (!previous) return previous;

      return previous.map((rowCells, rowIndex) => {
        if (rowIndex !== row) return rowCells;

        return rowCells.map((cell, colIndex) => {
          if (colIndex !== col) return cell;

          const actors = [...(cell.actors ?? [])];

          // Create missing slots so empty fields can be populated.
          while (actors.length <= actorIndex) {
            actors.push({ name: "", checked: false });
          }

          actors[actorIndex] = {
            ...actors[actorIndex],
            name: newName,
          };

          return {
            ...cell,
            actors,
          };
        });
      });
    });
  };

  const hasUnsavedCastEdits =
    draftGrid !== null &&
    (
      getCastSnapshot(draftGrid) !== draftBaseline ||
      draftShowName !== showNameBaseline
    );

  const controlsBusy = isSavingCast || isChangingShow;

  const startCastDraft = (configuration, showNumber) => {
    const selectedShow = configuration.shows.showlist.find(
      (show) => String(show.shownumber) === String(showNumber)
    );

    if (!selectedShow) {
      throw new Error(`Show ${showNumber} was not found`);
    }

    const draft = createCastDraft(
      grid,
      configuration,
      showNumber
    );

    const showName = selectedShow.showname ?? "";

    setDraftGrid(draft);
    setDraftBaseline(getCastSnapshot(draft));
    setEditedShowNumber(String(showNumber));

    setDraftShowName(showName);
    setShowNameBaseline(showName);
  };

  const clearCastDraft = () => {
    setDraftGrid(null);
    setDraftBaseline("");
    setEditedShowNumber(null);

    setDraftShowName("");
    setShowNameBaseline("");
  };

  const confirmDiscardEdits = (actionDescription) => {
    if (!hasUnsavedCastEdits) return true;

    return window.confirm(
      `You have unsaved cast or show-title edits.\n\n` +
      `${actionDescription} will discard those edits.\n\n` +
      `Click OK to discard and continue, or Cancel to keep editing.`
    );
  };

  const handleActiveShowChange = async (nextShowNumber) => {
    const nextNumber = Number(nextShowNumber);

    if (controlsBusy || nextNumber === Number(activeShow)) {
      return;
    }

    if (
      !confirmDiscardEdits(
        `Changing the active show to ${nextNumber}`
      )
    ) {
      return;
    }

    setIsChangingShow(true);
    setCastSaveError("");

    let activationSucceeded = false;

    try {
      // Keep the current draft intact until activation succeeds.
      await postActiveShow(nextNumber);
      activationSucceeded = true;

      setActiveShow(nextNumber);
      clearCastDraft();

      // Retrieve authoritative active-show metadata and casts.
      const configuration = await fetchShowData();

      setShowData(configuration);
      setTitle(
        configuration.shows.activeshowname ?? "Unknown show"
      );
      setActiveShow(
        Number(configuration.shows.activeshownumber)
      );

      // Remain in Edit Cast, editing the newly active show.
      startCastDraft(
        configuration,
        configuration.shows.activeshownumber
      );
    } catch (error) {
      console.error("Error changing active show:", error);

      if (activationSucceeded) {
        // Activation worked, but loading the new draft failed.
        // Do not leave the previous show's draft on screen.
        clearCastDraft();
        setMode("Monitor");

        setCastSaveError(
          `The show was activated, but its data could not be loaded: ${error.message}`
        );
      } else {
        // Activation failed; preserve the original draft.
        setCastSaveError(error.message);
      }
    } finally {
      setIsChangingShow(false);
    }
  };


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
    const intervalID = setInterval(() => {
      fetchShowData().then((data) => {
        setShowData(data);
        setTitle(data?.shows?.activeshowname ?? "Unknown show");

        const showNumber = data?.shows?.activeshownumber;

        if (showNumber != null) {
          setActiveShow(Number(showNumber));
        }
      });
    }, 5000);

    return () => clearInterval(intervalID);
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
    <div style={{ color: "#111" }}>
      <table style={{ height: "100vh", width: "100vw", background: "#eef2f7" }}>
        <tbody>
          <tr>
            <td style={{ textAlign: "center", paddingTop: 16 }}>
              {mode === "Edit Cast" && draftGrid !== null ? (
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Show title:
                  <input
                    type="text"
                    value={draftShowName}
                    onChange={(e) => setDraftShowName(e.target.value)}
                    disabled={controlsBusy}
                    style={{
                      padding: "6px 10px",
                      fontSize: "20px",
                      width: 320,
                      maxWidth: "65vw",
                    }}
                  />
                </label>
              ) : (
                <h1 style={{ margin: 0, fontSize: "20px" }}>
                  {title || "Loading…"}
                </h1>
              )}
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: "center", padding: 24, paddingTop: 8, paddingBottom: 8 }}>
              <ModeSelector value={mode} onChange={handleModeChange} />

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

              {mode === "Edit Cast" && (
                <div style={{ marginTop: 12 }}>
                  {/* Save / Discard row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 12,
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleSaveCast}
                      disabled={controlsBusy || !draftGrid || !showData}
                      style={{
                        padding: "8px 16px",
                        fontSize: "16px",
                        cursor: isSavingCast ? "wait" : "pointer",
                      }}
                    >
                      {isSavingCast ? "Saving..." : "Save"}
                    </button>

                    <button
                      type="button"
                      onClick={handleDiscardCast}
                      disabled={controlsBusy}
                      style={{
                        padding: "8px 16px",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    >
                      Discard
                    </button>
                  </div>


                  {/* Active show row */}
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 24,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>Active show: {activeShow}</span>

                    <label
                      htmlFor="active-show-select"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      Set Active Show:
                      <select
                        id="active-show-select"
                        value={activeShow}
                        disabled={controlsBusy || !showData}
                        onChange={(e) =>
                          handleActiveShowChange(e.target.value)
                        }
                        style={{
                          padding: "6px 10px",
                          fontSize: "16px",
                        }}
                      >
                        {[1, 2, 3, 4].map((showNumber) => (
                          <option key={showNumber} value={showNumber}>
                            {showNumber}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              )}

              {castSaveError && (
                <div
                  role="alert"
                  style={{
                    marginTop: 8,
                    color: "crimson",
                  }}
                >
                  {castSaveError}
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
                      row={row}
                      col={col}
                      value={
                        mode === "Edit Cast" && draftGrid
                          ? {
                            ...grid[row][col],
                            actors: draftGrid[row][col].actors,
                          }
                          : grid[row][col]
                      }
                      onClick={handleCellClick}
                      mode={mode}
                      onMicCheckRowToggle={handleMicCheckRowToggle}
                      onActorNameChange={handleActorNameChange}
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
