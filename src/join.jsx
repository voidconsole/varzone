import { useState } from "react"
import app from "./firebase"
import { Link } from "react-router-dom"
import { getAuth, signInAnonymously } from "firebase/auth"
import { getDatabase, ref, set, get, update } from "firebase/database"
import { useNavigate } from "react-router-dom"
import FactionPopup from "./factionPopup"
import styles from "./join.module.css"

function JoinVar() {
    const db = getDatabase()
    const [code, setCode] = useState("")
    const [username, setUsername] = useState("")
    const [warning, setWarning] = useState("")
    const [showPopup, setShowPopup] = useState(false)
    const auth = getAuth(app)
    const [Factions, setFactions] = useState([])
    const [Resolution, setResolution] = useState("")
	
    const [pendingUserData, setPendingUserData] = useState(null)
    const navigate = useNavigate()
    function handleCode(e) {
        setCode(e.target.value)
    }
    function handleUser(e) {
        setUsername(e.target.value)
    }
    function handleFactionSelect(pickedFaction) {
        setShowPopup(false)
        if (pendingUserData) {
            const { user, data, role } = pendingUserData
            const updates = {}
            updates[
                `${data.adminUID}/${data.varId}/factions/${pickedFaction}/${role}/${user.uid}`
            ] = username
            update(ref(db), updates)
                .then(() => {
                    navigate("/var", {
                        state: {
                            uid: user.uid,
                            uname: username,
                            isAnon: user.isAnonymous,
                            role: role,
                            faction: pickedFaction,
                            adminUID: data.adminUID,
			    varID: data.varId,
                        },
                    })
                })
                .catch(error => {
                    console.error("Error updating faction:", error)
                    setWarning("Error joining faction")
                })
        }
    }
    function handleClick(e) {
        e.preventDefault()
        if (code.length !== 8) {
            setWarning("Access code must be exactly 8 characters long")
            return
        } else {
            setWarning(null)
        }
        signInAnonymously(auth)
            .then(userCredential => {
                const user = userCredential.user
                const accessCode = code.trim().slice(0, 5)
                const roleCode = code.trim().slice(5, 8)
                var data = undefined
                var role = undefined

                get(ref(db, `accessCodes/${accessCode}`))
                    .then(snapshot => {
                        if (snapshot.exists()) {
                            data = snapshot.val()
                            if (data.oratorCode === roleCode) {
                                role = "orators"
                                get(
                                    ref(
                                        db,
                                        `${data.adminUID}/${data.varId}/factions/`
                                    )
                                ).then(snapshot => {
                                    if (snapshot.exists()) {
                                       setResolution(JSON.stringify(snapshot.val().resolution)||"")
                                        setFactions(
                                            Object.keys(snapshot.val().factions) || []
                                        )
                                        setPendingUserData({ user, data, role })
                                        setShowPopup(true)
                                    }
                                })
                            } else if (data.judgeCode === roleCode) {
                                role = "judges"
                                const userRefPath = `${data.adminUID}/${data.varId}/${role}/${user.uid}`
                                const updates = {}
                                updates[userRefPath] = username
                                update(ref(db), updates).then(() => {
                                    navigate("/var", {
                                        state: {
                                            uid: user.uid,
                                            uname: username,
                                            isAnon: user.isAnonymous,
                                            role: role,
                                            faction: null,
                                            adminUID: data.adminUID,
                                            varID: data.varId
                                        },
                                    })
                                })
                            } else if (data.spectatorCode === roleCode) {
                                role = "spectators"
                                const userRefPath = `${data.adminUID}/${data.varId}/${role}/${user.uid}`
                                const updates = {}
                                updates[userRefPath] = username
                                update(ref(db), updates).then(() => {
                                    navigate("/var", {
                                        state: {
                                            uid: user.uid,
                                            uname: username,
                                            isAnon: user.isAnonymous,
                                            role: role,
                                            faction: null,
                                            adminUID: data.adminUID,
                                            varID: data.varId,

                                        },
                                    })
                                })
                            } else {
                                setWarning("Invalid code")
                            }
                            
                        } else {
                            
                            setWarning("Var not found")
                        }
                    })
                    .catch(error => {
                        setWarning("Error reading var", error.message)
                    })
            })
            .catch(error => {
                const errorCode = error.code
                console.error(
                    "Error signing in anonymously:",
                    errorCode,
                    error.message
                )
                setWarning("Error signing in", error.message)
            })
    }
    return (
        <div>
            {showPopup && (
                <FactionPopup
                    factions={Factions}
					resolution={Resolution}
                    onSelect={handleFactionSelect}
                />
            )}
            <form className={styles.joinVar}>
                <h1 className={styles.title}>Join a Var</h1>

                <input
                    type="text"
                    onChange={handleUser}
                    placeholder="Enter a username"
                    className={styles.input}
                    name="username"
                    spellCheck="false"
                />
                <input
                    type="text"
                    onChange={handleCode}
                    placeholder="Enter the access code"
                    className={`${styles.input} ${styles.accessCode}`}
                    name="code"
                    spellCheck="false"
                />
                <label>{warning}</label>
                <button
                    type="submit"
                    onClick={handleClick}
                    className={styles.button}
                >
                    Let's Goo
                </button>
                <p className={styles.linkText}>
                    Want to create a Var? <Link to="/register">Sign up</Link>
                </p>
            </form>
        </div>
    )
}
export default JoinVar
