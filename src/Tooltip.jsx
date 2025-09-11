import React, { useState, useEffect } from "react"
import "./Tooltip.css"

export default function Tooltip({ text, children }) {
    const [visible, setVisible] = useState(false)
    const [hovered, setHovered] = useState(false)

    useEffect(() => {
        let timeout
        if (hovered) {
            timeout = setTimeout(() => setVisible(true), 700) // 0.7 seconds delay
        } else {
            setVisible(false)
        }
        return () => clearTimeout(timeout) // Clear timeout on unmount or hover state change
    }, [hovered])

    const showTooltip = () => setHovered(true)
    const hideTooltip = () => setHovered(false)

    return (
        <div
            className="tooltip-wrapper"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {visible && <div className="tooltip-box">{text}</div>}
        </div>
    )
}
