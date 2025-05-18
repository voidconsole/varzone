import React, { useState } from "react"

const AlertDialog = ({ onClose }) => {
    const [copied, setCopied] = useState(null)

    const codes = {
        Spectator: "SPEC-1234",
        Judge: "JUDGE-5678",
        Orator: "ORATOR-9012",
    }

    const handleCopy = type => {
        navigator.clipboard.writeText(codes[type])
        setCopied(type)
        setTimeout(() => setCopied(null), 1500)
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(10px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div className="createVar">
                <h2 className="title">Your Var has been created!</h2>

                {Object.entries(codes).map(([label, code]) => (
                    <div className="switcher" key={label}>
                        <span>{label} Code:</span>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5em",
                            }}
                        >
                            <div style={{ fontFamily: "monospace" }}>
                                {code}
                            </div>
                            <button
                                className="removeButton"
                                onClick={() => handleCopy(label)}
                            >
                                {copied === label ? "✓" : "📋"}
                            </button>
                        </div>
                    </div>
                ))}

                <button className="button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    )
}

export default AlertDialog
