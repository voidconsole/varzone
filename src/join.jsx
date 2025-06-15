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
    const [faction, setFaction] = useState("")

    const navigate = useNavigate()
    function handleCode(e) {
        setCode(e.target.value)
    }
    function handleUser(e) {
        setUsername(e.target.value)
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
                            console.log("Var Data:", data)
                            if (data.oratorCode === roleCode) {
                                role = "orators"
                                get(
                                    ref(
                                        db,
                                        `${data.adminUid}/${data.varId}/factions/`
                                    )
                                ).then(snapshot => {
                                    if (snapshot.exists()) {
                                        console.log("Factions:", factions)

                                        setFactions(
                                            Object.keys(snapshot.val()) || []
                                        )
                                        setShowPopup(true)
					console.log(
                        `${data.adminUid}/${data.varId}/factions/${faction}/${role}`
                    )
					
                                        set(
                                            ref(
                                                db,
                                                `${data.adminUid}/${data.varId}/factions/${faction}/${role}`
                                            ),
                                            {
                                                [user.uid]: username,
                                            }
                                        )
                                    }
                                })
                            } else if (data.judgeCode === roleCode) {
                                role = "judges"
                                set(
                                    ref(
                                        db,
                                        `${data.adminUid}/${data.varId}/${role}`
                                    ),
                                    {
                                        [user.uid]: username,
                                    }
                                )
                            } else if (data.spectatorCode === roleCode) {
                                role = "spectators"
                                set(
                                    ref(
                                        db,
                                        `${data.adminUid}/${data.varId}/${role}`
                                    ),
                                    {
                                        [user.uid]: username,
                                    }
                                )
                            } else {
                                setWarning("Invalid code")
                            }
                            console.log("Role:", role)

                            //     navigate("/var", {
                            //         state: {
                            //             uid: user.uid,
                            //             uname: username,
                            //             isAnon: user.isAnonymous,
                            //             isAdmin: false,
                            //             role: role,
                            //             faction: faction,
                            //             data: data,
                            //         },
                            //     })
                        } else {
                            console.error("Var not found")
                        }
                    })
                    .catch(error => {
                        console.error("Error reading var:", error)
                    })
            })

            .catch(error => {
                const errorCode = error.code
                console.error(
                    "Error signing in anonymously:",
                    errorCode,
                    error.message
                )
            })
    }
    return (
        <div>
            <form className={styles.joinVar}>
                <h1 className={styles.title}>Join a Var</h1>
                {showPopup && (
                    <FactionPopup
                        factions={factions}
                        onSelect={pickedFaction => {
				console.log("Selected faction:", pickedFaction)
                            setFaction(pickedFaction)
                        }}
                    />
                )}
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
