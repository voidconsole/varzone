import React from "react"
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
    const [codes, setCodes] = useState(null)

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
	if (isDone) {
	setShowPopup(false)
	}
	else {
navigate("/var", {
    state: {
        uid: user.uid,
        // uname: username,
        // isAnon: user.isAnonymous,
        // isAdmin: true,
        // role: role,
        // faction: null,
        // adminUID: data.adminUID,
        // varID: data.varId,
        codes: {codes }
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
	const adminCode = makeCode(5)
        const varId = "var" + makeCode(3)
        const oratorCode = makeCode(3)
        const judgeCode = makeCode(3)
        const spectatorCode = makeCode(3)
	setCodes({
                        admin: adminCode,
                        judge: judgeCode,
                        orator: oratorCode,
                        spectator: spectatorCode,
			varId: varId
                    })
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
            orators: {},
            judges: {},
            spectators: {},
        })
	// TODO: fix following code, with firebase, doesnt work. or just make the sync between code createtion of firebase and copy copy popup. i.e avoid multiple funct code creation runs. 
        set(ref(db, `/accessCodes/${adminCode}`), {
            adminUID: user.uid,
            varId: codes.varId,
            oratorCode: codes.orator,
            judgeCode: codes.judge,
            spectatorCode: codes.spectator,
        })
        setShowPopup(true)
    }
    return (
        <div>
            {showPopup && (
                <CopyCode
                    code={codes}
		    onSelect={handleNext}
                />
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
