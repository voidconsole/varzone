import React from "react"
import { useState } from "react"
import styles from "./create.module.css"
import app from "./firebase"
import { getAuth } from "firebase/auth"
import { Link, useLocation, useNavigate } from "react-router-dom"

function JoinVar() {
    const [code, setCode] = useState("")

    const auth = getAuth(app)

    function handleCode(e) {
        setCode(e.target.value)
    }


    function handleClick(e) {}
    return (
        <div>
            <form className={styles.JoinVar}>
                <h1 className={styles.title}></h1>
                <label className={styles.label} for="state"></label>
                <input
                    type="text"
                    onChange={handleClick}
                    placeholder="A debate statement"
                    className={styles.input}
                    name="statement"
                />
                <button
                    type="submit"
                    onClick={handleLogin}
                    className={styles.button}
                >
                    Let's Goo
                </button>
                <p className={styles.linkText}>
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
            </form>
        </div>
    )
}

export default JoinVar
