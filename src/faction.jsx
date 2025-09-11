import "./app.css";
import React from "react";
import styles from "./varzone.module.css"; // Assuming you have a CSS file for styling
function Faction(props) {

  return (
      <div className={styles.faction}>
          <h1>{props.name}</h1>
          <div className={styles.messages}>
              {props.members.map((member, index) => (
                  //what do i do here mannnnn

                  <div>
                      {
                          console.log(member, index)
                          /* {member} */
                      }
                  </div>
              ))}
          </div>
      </div>
  )

}

export default Faction;