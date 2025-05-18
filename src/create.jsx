import React from "react"
import { useState } from "react"
import styles from "./create.module.css"
import { getDatabase, ref, set } from "firebase/database"
import {useLocation } from "react-router-dom"
import Switcher from "./switch"
import AlertDialog from "./alert"
function CreateVar() {
    const db = getDatabase()
    const location = useLocation()
    const user = location.state
    const [resolution, setResolution] = useState("")
    const [AI, setAI] = useState(false)
    const [factions, setFactions] = useState(["Proposition", "Opposition"])
    const adminCode = makeCode(5)
    const varId = "var" + makeCode(3)
    const oratorCode = makeCode(3)
    const judgeCode = makeCode(3)
    const spectatorCode = makeCode(3)
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
        const factionsObj = {}
        factions.forEach(value => {
            factionsObj[value] = {
                score: 0,
            }
        })

// const oraAccess = adminCode + oratorCode
// const judgeAccess = adminCode + judgeCode
 // const spectatorAccess = adminCode + spectatorCode

        set(ref(db, `/${user.uid}/${varId}`), {
            resolution: resolution,
            factions: factionsObj,
            AI: AI,
            orators: {},
            judges: {},
            spectators: {},
        })

        set(ref(db, `/accessCodes/${adminCode}`), {
            adminUid: user.uid,
            varId: varId,
            oratorCode: oratorCode,
            judgeCode: judgeCode,
            spectatorCode: spectatorCode,
        })
    }
    return (
        <div>
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
                    AI Evaluator:
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
