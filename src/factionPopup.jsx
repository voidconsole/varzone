import React, { useState, useEffect, useRef } from "react"
import "./Popup.css"

export default function FactionPopup({ factions = [], onSelect }) {
    const [selected, setSelected] = useState(null)
    const popupRef = useRef()

    const handleClickOutside = e => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            onSelect(null) // Close without selection
        }
    }

    const handleEscape = e => {
        if (e.key === "Escape") {
            onSelect(null)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [    
	
    ])

    return (
        <div className="popup-overlay">
            <div className="popup-container" ref={popupRef}>
                <h2 className="popup-title">
                    Which faction do you want to join?
                </h2>

                <div className="faction-options">
                    {factions.map((faction, index) => (
                        <div
                            key={index}
                            onClick={() => setSelected(faction)}
                            className={`faction-box ${
                                selected === faction ? "selected" : ""
                            }`}
                        >
                            {faction}
                        </div>
                    ))}
                </div>

                {selected && (
                    <button
                        onClick={() => onSelect(selected)}
                        className="next-button"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    )
}
