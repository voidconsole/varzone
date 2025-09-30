
import { useState } from 'react';
import app from "./firebase"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom";
import styles from './register.module.css'
function RegisterCard() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [help, setHelp] = useState("")

const auth = getAuth(app)
const navigate = useNavigate()


function handleEmail(e) {
	setEmail(e.target.value); 
}
function handlePassword(e) {
	setPassword(e.target.value);
}
function handleRegister(e) {
	e.preventDefault(); 

createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
        const user = userCredential.user
        navigate("/create", {
            state: {
                uid: user.uid,
                email: user.email,
                uname: user.displayName,
                isAnon: user.isAnonymous,
            },
        })
    })
    .catch(error => {
        const errorCode = error.code
        if (errorCode === "auth/invalid-email") {
            setHelp("The email address is invalid.")
        }
        if (errorCode === "auth/email-already-exists") {
            setHelp("This email is already in use.")
        }
	if (errorCode === "auth/email-already-in-use") {
        setHelp("This email is already in use.")
    }
        if (errorCode === "auth/invalid-credential") {
            setHelp("Incorrect email or password. ")
        }
	if (errorCode === "auth/weak-password") {
        setHelp("Password is too weak.")
    } else {
        alert(error)
    }
    })
}
	return (
        <form className={styles.registerCard}>
            <h1 className={styles.title}>Register to create a debate!</h1>
            <input
                type="email"
                onChange={handleEmail}
                placeholder="Email"
                className={styles.input}
            />
            <input
                type="password"
                onChange={handlePassword}
                placeholder="Create a password"
                className={styles.input}
            />

            {help === "This email is already in use." ? (
                <p id="help">
                    {help}
                    <a
                        onClick={() => {
                            navigate("/login", {viewTransition: true})
                        }}
                    >
                        {" Login instead"}
                    </a>
                </p>
            ) : (
                <p id="help">{help}</p>
            )}
            <button
                type="submit"
                onClick={handleRegister}
                className={styles.button}
            >
                Let's Goo
            </button>
            <p className={styles.linkText}>
                Already have an account? <Link to="/login" viewTransition>Login</Link>
            </p>
        </form>
    )
	
}
export default RegisterCard;