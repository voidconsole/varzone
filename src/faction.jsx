import { useState, useEffect } from "react"
import "./app.css"
import styles from "./varzone.module.css"
import { getDatabase, ref, onValue, set } from "firebase/database"

function Faction(props) {
	// TODO: use useRef instead of useState to prevent state rendering at type, simply use Copilot. And for NOT rerendering at new message find a way.
    const [message, setMessage] = useState("")
    const [data, setData] = useState({})
    const isMember = data.orators
        ? Object.keys(data.orators).includes(props.uid)
        : false
    console.log(data)
    const Pastels = [
        "#f58d78ff",
        "#ec7e7eff",
        "#e477c7ff",
        "#a46ce9ff",
        "#eb698eff",
        "#e66f83ff",
        "#ec9661ff",
        "#ecc162ff",
        "#73f167ff",
        "#5be7d0ff",
        "#68d7ebff",
        "#74c7ecff",
        "#6397e9ff",
        "#6274e9ff",
    ]
    const db = getDatabase()
    useEffect(() => {
        // Register the onValue listener
        const DataRef = ref(db, `${props.path}`)
        const unsubscribe = onValue(DataRef, snapshot => {
            var theData = snapshot.exportVal()
            setData(theData || {}) // Ensure Data is always an object
            console.log("the datataa", theData)
        })

        // Cleanup the listener when the component unmounts
        return () => unsubscribe()
    }, [db, props.path])

    const colors = {}
    if (data.members) {
        Object.values(data.members).forEach(member => {
            colors[member] = Pastels[Math.floor(Math.random() * Pastels.length)]
        })
    }

    const send = e => {
        e.preventDefault()
        document.getElementById(styles.send).focus()
        if (message.trim() !== "" && isMember) {
            console.log("Sending:", message.trim())
            setMessage("")
            const messageKey = `m${
                data.messages ? Object.keys(data.messages).length + 1 : 0
            }`
            set(ref(db, `${props.path}/messages/${messageKey}`), {
                [data.members[props.uid]]: message.trim(),
            })
            console.log(data.messages)
        }
    }

    return (
        <div className={styles.faction}>
            <h1 id={styles.name}>{props.name}</h1>
            {data.messages ? (
                <div className={styles.messages}>
                    {Object.values(data.messages).map((msgData, i) => {
                        const sender = Object.keys(msgData)[0]
                        const messageText = msgData[sender]
                        return (
                            <div className={styles.messageBox} key={i}>
                                <span
                                    style={{ color: colors[sender] }}
                                    className={styles.sender}
                                >
                                    {sender}
                                </span>
                                <span className={styles.message}>
                                    {messageText}
                                </span>
                            </div>
                        )
                    })}
                </div>
            ) : null}
            {isMember ? (
                <div id={styles.inputBox}>
                    <input
                        type="text"
                        name="message"
                        id={styles.input}
                        placeholder="Type a message..."
                        autoComplete="off"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                send(e)
                            }
                        }}
                    />
                    <button
                        type="submit"
                        id={styles.send}
                        onClick={send}
                        onKeyDown={() => {
                            document.getElementById(styles.input).focus()
                        }}
                    >
                        ▶
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default Faction
