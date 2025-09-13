import React, { useEffect, useRef } from "react"
import "./Popup.css"
import Tooltip from "./Tooltip"

export default function CopyCode({ code, onSelect }) {
    const popupRef = useRef()
    const handleClickOutside = e => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
            onSelect(false)
        }
    }
    console.log("codes in popup", code)

    const handleEscape = e => {
        if (e.key === "Escape") {
            onSelect(false)
        }
    }
    const handleCopy = code => {
        navigator.clipboard
            .writeText(code)
            .then(() => {})
            .catch(() => {
                console.log("failed to copy")
            })
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [])

    return (
        <div className="popup-overlay">
            <div className="popup-container" ref={popupRef}>
                <h2 className="popup-title">Invite others to your Var</h2>
                <div className="code-section">
                    <ul>
                        <li key={"spectator"}>
                            <Tooltip text="A spectator can watch the Var">
                                <h4>Spectator Access</h4>
                            </Tooltip>
                            <Tooltip text="Click to copy">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCopy(
                                            "Spectator Code: " +
                                                code.admin +
                                                code.spectator
                                        )
                                    }
                                    className={"code-button"}
                                >
                                    {code.admin + code.spectator}
                                </button>
                            </Tooltip>
                        </li>
                        <li key={"orator"}>
                            <Tooltip text="An orator can pick and speak for a faction">
                                <h4>Orator Access</h4>
                            </Tooltip>
                            <Tooltip text="Click to copy">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCopy(
                                            "Orator Code: " +
                                                code.admin +
                                                code.orator
                                        )
                                    }
                                    className={"code-button"}
                                >
                                    {code.admin + code.orator}
                                </button>
                            </Tooltip>
                        </li>
                        <li key={"judge"}>
                            <Tooltip text="A judge can vote for the winning argument">
                                <h4>Judge Access</h4>
                            </Tooltip>
                            <Tooltip text="Click to copy">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleCopy(
                                            "Judge Code: " +
                                                code.admin +
                                                code.judge
                                        )
                                    }
                                    className={"code-button"}
                                >
                                    {code.admin + code.judge}
                                </button>
                            </Tooltip>
                        </li>
                    </ul>
                </div>

                <button onClick={() => onSelect(true)} className="next-button">
                    Next
                </button>
            </div>
        </div>
    )
}
