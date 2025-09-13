import { useState } from "react"
import styles from "./join.module.css"
import app from "./firebase"
import { Link } from "react-router-dom"
import { getAuth, signInAnonymously } from "firebase/auth"
import { getDatabase, ref, set, get } from "firebase/database"
import { useNavigate } from "react-router-dom"
import FactionPopup from "./factionPopup"

function JoinVar() {
    const db = getDatabase()
    const [code, setCode] = useState("")
    const [username, setUsername] = useState("")
    const [warning, setWarning] = useState("")
    const [showPopup, setShowPopup] = useState(false)
    const auth = getAuth(app)
    const [factions, setFactions] = useState([])

    // Store user and data for when faction is selected
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

        // Now complete the database operation with the selected faction
        if (pendingUserData) {
            const { user, data, role } = pendingUserData


            set(
                ref(
                    db,
                    `${data.adminUID}/${data.varId}/factions/${pickedFaction}/${role}`
                ),
                {
                    [user.uid]: username,
                }
            )
                .then(() => {
                    // Navigate after successful database update
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
                // Signed in
                const user = userCredential.user
                const accessCode = code.trim().slice(0, 5)
                const roleCode = code.trim().slice(5, 8)
                var data = undefined
                var role = undefined

                get(ref(db, `accessCodes/${accessCode}`))
                    .then(snapshot => {
                        if (snapshot.exists()) {
                            // Var exists, proceed (e.g., navigate or update state)
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
                                       
                                        setFactions(
                                            Object.keys(snapshot.val()) || []
                                        )
                                        // Store the user data for when faction is selected
                                        setPendingUserData({ user, data, role })
                                        setShowPopup(true)
                                    }
                                })
                            } else if (data.judgeCode === roleCode) {
                                role = "judges"
                                set(
                                    ref(
                                        db,
                                        `${data.adminUID}/${data.varId}/${role}`
                                    ),
                                    {
                                        [user.uid]: username,
                                    }
                                ).then(() => {
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
                                set(
                                    ref(
                                        db,
                                        `${data.adminUID}/${data.varId}/${role}`
                                    ),
                                    {
                                        [user.uid]: username,
                                    }
                                ).then(() => {
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
                    factions={factions}
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
