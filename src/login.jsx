import React from 'react';
import { useState } from 'react';
import styles from './login.module.css'
import app from "./firebase"
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import RegisterCard from './register';


function LoginCard() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [help, setHelp] = useState("")


const navigate = useNavigate()
const auth = getAuth(app)


function handleEmail(e) {
	setEmail(e.target.value); 
}
function handlePassword(e) {
	setPassword(e.target.value);
}


function handleLogin(e) {
	e.preventDefault(); 

signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
        // Signed in
        const user = userCredential.user
	navigate("/create", { state: { uid: user.uid, email: user.email, uname:user.displayName, isAnon: user.isAnonymous} })
    })
    .catch(error => {
        const errorCode = error.code
	if (errorCode
		=== "auth/invalid-email" 
	) {
		
		setHelp("The email address is invalid.")
	}
	if (

        errorCode === "auth/user-not-found" 
    ) {
        setHelp("User not found.")
    }
    if (errorCode === "auth/invalid-credential") {
        setHelp("Incorrect email or password. ")
    }

    })	
}
	return (
        <div>
            <form className={styles.loginCard}>
                <h1 className={styles.title}>Login to create a debate!</h1>
                <input
                    type="email"
                    onChange={handleEmail}
                    placeholder="Email"
                    className={styles.input}
                />
                <input
                    type="password"
                    onChange={handlePassword}
                    placeholder="Password"
                    className={styles.input}
                />
    
                    {help === "Incorrect email or password. " ? (
                        <p id="help">
                            {help}
                            <a onClick={()=>{sendPasswordResetEmail(auth, email)}}>
                                Forgot?{" "}
                            </a>
                        </p>
                    ) : (
                        ""
                    )}

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

export default LoginCard;

