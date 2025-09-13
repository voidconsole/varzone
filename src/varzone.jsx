import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { getDatabase, ref, get } from "firebase/database"
import Faction from "./faction"
import "./app.css"
import styles from "./varzone.module.css"

function Varzone() {
    const navigate = useNavigate()
    const location = useLocation()
    const data = location.state

    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!data || !data.adminUID || !data.varID) {
            console.error("Invalid data passed to the component.")
            navigate("/unauthorized")
            return
        }

        const db = getDatabase()
        const contentRef = ref(db, `/${data.adminUID}/${data.varID}/`)

        get(contentRef)
            .then(snapshot => {
                if (snapshot.exists()) {
                    const val = snapshot.val()
                    setContent(val)
                    console.log("Data fetched successfully:", val)
                } else {
                    console.warn("No data found for the given path.")
                    if (!data.isAdmin) {
                        navigate("/unauthorized")
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error)
                setError("Failed to load data. Please try again later.")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [data, navigate])

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div className={styles.error}>{error}</div>
    }

    if (!content) {
        return <div>No content available. Please wait...</div>
    }

    const factionCount = Object.keys(content.factions).length
    let gridStyle = {}

    if (factionCount === 2) {
        gridStyle = { gridTemplateColumns: "repeat(2, 1fr)" }
    } else if (factionCount === 3) {
        gridStyle = { gridTemplateColumns: "repeat(3, 1fr)" }
    } else if (factionCount === 4) {
        gridStyle = {
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
        }
    } else if (factionCount === 5) {
        gridStyle = {
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
        }
    } else if (factionCount === 6) {
        gridStyle = {
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
        }
    }

    return (
        <>
            <h1>Resolution: {content.resolution}</h1>
            <div id={styles.factions} style={gridStyle}>
                {Object.keys(content.factions).map((faction, i) => (
                    <Faction
                        key={i}
                        name={faction}
                        score={content.factions[faction].score}
                        members={content.factions[faction].orators}
                        messages={content.factions[faction].messages}
			isMember={data.faction===faction}
                    />
                ))}
            </div>
        </>
    )
}

export default Varzone
