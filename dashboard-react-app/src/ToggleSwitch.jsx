
import React  from "react";

export default function ToggleSwitch({label, checked, onChange}) {
    return (
        <label style={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            top: 20,
            right: 40,
            zIndex: 2, 
        }}>
            <span style={{marginRight: 8}}>{label}</span>
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                style={{transform: "scale(1.3)"}}
            />
        </label>
    );
}