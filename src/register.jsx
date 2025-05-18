import React from 'react';
// import formik from 'formik'
import { useState } from 'react';
import styles from './register.module.css'
import app from "./firebase"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { Link } from "react-router-dom";
function RegisterCard() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');


const auth = getAuth(app)


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
        // Signed in
        const user = userCredential.user
	
    })
    .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
	alert(errorMessage)
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
            <button
                type="submit"
                onClick={handleRegister}
                className={styles.button}
            >
                Let's Goo
            </button>
            <p className={styles.linkText}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
            {}
        </form>
    )
	
}
export default RegisterCard;