import { useState } from "react"

const Switcher = (props) => {
    const [isChecked, setIsChecked] = useState(props.checked || false)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
	props.onChange(!isChecked)
	
    }

    const boxStyle = {
	position: "relative",
        height: "20px",
        width: "56px",
        borderRadius: "9999px",
        transition: "background-color 0.3s ease",
        backgroundColor: isChecked
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(0, 0, 0, 0.53)",
        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
    }
    const dotStyle = {
        position: "absolute",
        top: "-4px",
        left: isChecked ? "28px" : "0px",
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        backgroundColor: "white",
        transition: "left 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    }
    const innerDotStyle = {
        width: "16px",
        height: "16px",
        borderRadius: "9999px",
        backgroundColor: isChecked ? "#6366F1" : "white", // Indigo for ON
        border: isChecked ? "1px solid white" : "1px solid #1a1a1a",
        transition: "background-color 0.3s, border-color 0.3s",
    }
    return (
        <label
            style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
            }}
        >
            <div style={{ position: "relative" }}>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    style={{ display: "none" }}
                />
                <div style={boxStyle}></div>
                <div style={dotStyle}>
                    <span style={innerDotStyle}></span>
                </div>
            </div>
        </label>
    )
}

export default Switcher
