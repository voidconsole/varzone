import "./app.css";
import React from "react";
import styles from "./varzone.module.css"; // Assuming you have a CSS file for styling
function Faction(props) {

  return (
    <div className={styles.faction}>
      <h1>{props.name}</h1>
      <ul>
	{props.members.map((member, index) => (
	  <li key={index}>{member}</li>
	))}
      </ul>
    </div>
  );

}

export default Faction;