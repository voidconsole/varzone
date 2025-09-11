import { useState, useEffect } from "react"
// import app from "./firebase"
import { Link, useNavigate, useLocation } from "react-router-dom"
// import { getAuth } from "firebase/auth"
import { getDatabase, ref, get } from "firebase/database"
import Faction from "./faction"
import "./app.css"
import styles from "./varzone.module.css"

function Varzone() {
    const db = getDatabase()
    const navigate = useNavigate()
//     const auth = getAuth(app)
    const location = useLocation()
    const data = location.state
    const [content, setContent] = useState(null)

    useEffect(() => {
        const contentRef = ref(db, `/${data.adminUID}/${data.varID}/`)
        get(contentRef)
            .then(snapshot => {
                if (snapshot.exists()) {
                    const val = snapshot.val()
                    setContent(val)
                    console.log("Data fetched successfully:", val)
                } else {
                    console.log("No access codes found.")
                    navigate("/unauthorized")
                }
            })
            .catch(error => {
                console.error("Error fetching access codes:", error)
            })
}, [db, data, navigate])

if (!content) {
    return <div>Loading...</div>
}

return (
	<>
	{console.log("Content:", content)}
    
        <h1>Debate statement</h1>
        <dialog open>
                {content ? JSON.stringify(content) : "Loading..."}
            </dialog>
            <div className={styles.factions}>
                {content?.factions &&
                    Object.keys(content.factions).map((faction, i) => (
                        <Faction
                            key={i}
                            name={faction}
                            members={content.factions[faction].members}
                        //     varID={data.varID}
                        //     adminUID={data.adminUID}
                        />
                    ))}
            </div>
        </>
    )
}

export default Varzone
