// ModeSelector.jsx
import React from "react";

const MODES = ["Monitor", "Mic Check", "Edit Cast"];

export default function ModeSelector({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Mode"
      style={{
        display: "inline-flex",
        borderRadius: 6,
        border: "1px solid #ccc",
        overflow: "hidden",
        fontSize: 12,
      }}
    >
      {MODES.map((m) => {
        const selected = value === m;
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(m)}
            style={{
              padding: "4px 8px",
              border: "none",
              cursor: "pointer",
              background: selected ? "#2563eb" : "#fff",
              color: selected ? "#fff" : "#111",
              flex: 1,
              whiteSpace: "nowrap",
            }}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}