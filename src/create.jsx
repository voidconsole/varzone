import React, { useRef } from "react"
import { useState } from "react"
import styles from "./create.module.css"
import { getDatabase, ref, set } from "firebase/database"
import { useLocation, useNavigate } from "react-router-dom"
import Switcher from "./switch"
import CopyCode from "./copyCodePopup"
import Tooltip from "./Tooltip"

function CreateVar() {
    const db = getDatabase()
    const location = useLocation()
    const navigate = useNavigate()
    const user = location.state
    const [showPopup, setShowPopup] = useState(false)
    const [resolution, setResolution] = useState("")
    const [AI, setAI] = useState(false)
    const [factions, setFactions] = useState(["Proposition", "Opposition"])
    const codesRef = useRef({})
    const modulusRef = useRef(null)
    function makeCode(n) {
        var result = ""
        var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        var charactersLength = characters.length
        for (var i = 0; i < n; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            )
        }
        return result
    }

    function handleResolution(e) {
        setResolution(e.target.value)
    }
    function handleAI(e) {
        setAI(e)
    }

    function addLabel() {
        setFactions([...factions, ""])
    }
    function handleNext(isDone) {
        if (!isDone) {
            setShowPopup(false)
        } else {
            navigate("/var", {
                state: {
                    uid: user.uid,
                    uname: "admin",
                    isAnon: user.isAnonymous,
                    role: "admin",
                    faction: null,
                    adminUID: user.uid,
                    varID: codesRef.current.varId,
                },
            })
        }
    }

    function handleLabelChange(e, index) {
        const newFactions = [...factions]
        newFactions[index] = e.target.value
        setFactions(newFactions)
    }

    function removeLabel(index) {
        const newFactions = factions.filter((_, i) => i !== index)
        setFactions(newFactions)
    }

    function handleCreate(e) {
        e.preventDefault()
codesRef.current = {
    admin: makeCode(5),
    judge: makeCode(3),
    orator: makeCode(3),
    spectator: makeCode(3),
    varId: "var" + makeCode(3),
}
	let codes = codesRef.current
         
        console.log("codes set in state", codes)
        const factionsObj = {}
        factions.forEach(value => {
            factionsObj[value] = {
                score: 0,
            }
        })
        set(ref(db, `/${user.uid}/${codes.varId}`), {
            resolution: resolution,
            factions: factionsObj,
            AI: AI,
	    modulus: parseInt(modulusRef.current.value) || 5,
	    created: Date.now(),
            orators: {},
            judges: {},
            spectators: {},
        })

        set(ref(db, `/accessCodes/${codes.admin}`), {
            adminUID: user.uid,
            varId: codes.varId,
            oratorCode: codes.orator,
            judgeCode: codes.judge,
            spectatorCode: codes.spectator,
        })
        console.log("codes set in db", codes)
        setShowPopup(true)
    }
    return (
        <div>
            {showPopup && (
                <CopyCode code={codesRef.current} onSelect={handleNext} />
            )}
            <form className={styles.createVar}>
                <h1 className={styles.title}>Let's create a Var</h1>

                <textarea
                    onChange={handleResolution}
                    placeholder="The resolution statement"
                    className={styles.debate}
                    name="statement"
                    value={resolution}
                />

                <div className={styles.factions}>
                    <div className="add">
                        {" "}
                        Factions
                        <button
                            type="button"
                            onClick={addLabel}
                            className={styles.removeButton}
                            id={styles.addLabel}
                        >
                            +
                        </button>
                    </div>
                    <ul>
                        {factions.map((label, index) => (
                            <li key={index}>
                                <input
                                    type="text"
                                    value={label}
                                    onChange={e => handleLabelChange(e, index)}
                                    className={styles.labelInput}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeLabel(index)}
                                    className={styles.removeButton}
                                >
                                    ⨯
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.switcher}>
                    <Tooltip text="Allows an AI to cast a vote">
                        AI Evaluator:
                    </Tooltip>
                    <Switcher checked={AI} onChange={handleAI}></Switcher>
                </div>
                <div className={styles.modulus}>
                    <Tooltip text="Set after how many messages a vote can be cast">
                        Vote Frequency:
                    </Tooltip>
                    <input
			type="number"
			min="1"
			max="50"
			ref={modulusRef}
			defaultValue="5"
			className={styles.modulusInput}
			name="modulus"
		    />
                </div>
                <button
                    type="submit"
                    onClick={handleCreate}
                    className={styles.button}
                >
                    Create Var
                </button>
            </form>
        </div>
    )
}
export default CreateVar
