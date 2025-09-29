import React, { useState, useRef, useEffect } from 'react';
import { Sheet } from 'react-modal-sheet';
import { fetchMicData } from './utils/apiUtils'


const GRID_ROWS = 6;
const GRID_COLS = 5;

function GridCell({ row, col, value, onClick }) {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: '#f9f9f9'
      }}
      onClick={() => onClick(row, col)}
    >
      {value || `no mic data`}
    </div>
  );
}

function convertToRowCol(index) {
  const row = (Math.floor((index - 1)/GRID_COLS)) + 1;
  const col = ((index - 1) % GRID_ROWS) + 1;
  return [row, col]
}

export default function App() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [micData, setMicData] = useState(null);
  const [grid, setGrid] = React.useState(
    Array.from( {length: GRID_ROWS}, () => Array(GRID_COLS).fill("No mic data"))
  );
  const sheetRef = useRef(null);

  useEffect(() => {
    fetchMicData().then(data => {
      setMicData(data);
      //console.log(micData)
    });
  }, [])

  useEffect(() => {
    if (micData && micData.length > 0) {
      setGrid(prev => {
        const updated = prev.map(rowArr => [...rowArr]);
        console.log("2nd use effect");
        console.log(micData.length);
        for(var x = 0; x < micData.length; x++) {
          const mic = micData[x];
          const [row, col] = convertToRowCol(mic.micnumber)
          console.log(row)
          console.log(col);
          const value = "micnumber: " + mic.micnumber + "\nipaddress: " + mic.ipaddress;
          updated[row -1][col - 1] = value;
        }
        //micData.forEach(({row, col, value }) => {
        //  updated[row][col] = value;
        //});
        return updated;
      });
    }
  }, [micData]);

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
    setPanelOpen(true);
  };

  const makeTheCall = () => {
    alert('clicked');
  }

  return (
    // the parent div that holds all components
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#eef2f7"
    }}>
      <button onClick={makeTheCall}>call</button>
      <div style={{
        display: "grid",
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gap: "8px"
      }}>
        {Array.from({ length: GRID_ROWS }).map((_, row) =>
          Array.from({ length: GRID_COLS }).map((_, col) =>
            <GridCell 
              key={`${row}-${col}`} 
              row={row} col={col}
              value={grid[row][col]}
              onClick={handleCellClick} 
              />
          )
        )}
      </div>

    <Sheet
      isOpen={panelOpen}
      onClose={() => setPanelOpen(false)}
      snapPoints={[0, 0.25, 0.5, 0.75, 1]}   // Use percentage values
      initialSnap={2}                         // Snap to 0.5 (50% height) initially
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <div style={{ padding: "24px" }}>
            <h2>Sensor Info</h2>
            {selectedCell &&
              <div>
                <p>Cell: Row {selectedCell.row + 1}, Column {selectedCell.col + 1}</p>
              </div>
            }
            <button onClick={() => setPanelOpen(false)}>Close</button>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>


    </div>
  );
}
