import React from "react";
import styles from "./home.module.css"
import { Link } from "react-router-dom";

function Home() {

	  return (
          <div className={styles.home}>
              <h3 className={styles.subtitle}>Welcome to</h3>
              <h1 className={styles.title}>Varzone</h1>
              <p className={styles.description}>
                  From friendly debates to online wars, this is the perfect
                  place for your fights.
              </p>
              <div className={styles.actions}>
                  <Link to="/login">
                      <button className={styles.button}>
                          <h4>Create A Var</h4>
                          <p>Login as admin</p>
                      </button>
                  </Link>
                  <button className={styles.button}>
                      <h4>Join a Var</h4>
                      <p>Use the access code</p>
                  </button>
              </div>
          </div>
      )
}

export default Home;