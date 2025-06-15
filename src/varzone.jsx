import { useState } from "react"
import app from "./firebase"
import { Link } from "react-router-dom"
import { getAuth, signInAnonymously } from "firebase/auth"
import { getDatabase, ref, set } from "firebase/database"
import { useNavigate, useLocation } from "react-router-dom"
import Faction from "./faction"
import "./app.css"
import styles from "./varzone.module.css"


function Varzone() {
    const db = getDatabase()
    const navigate = useNavigate()
    const auth = getAuth(app)
    const location = useLocation()
    const user = location.state
//     db.ref("").on("value", snapshot => {
// 	if (snapshot.exists()) {
// 	    const data = snapshot.val()
// 	    console.log("Access Codes:", data)
// 	} else {
// 	    console.log("No access codes found.")
// 	}
//     })
    return (
        <>
            <h1>Debate statement</h1>
            <div className={styles.factions}>
                <Faction
                    name="Proposition"
                    members={["Alice", "Bob"]}
                />
                <Faction
                    name="Opposition"
                    members={["Charlie", "Dave"]}
                />

            </div>
        </>
    )
}

export default Varzone