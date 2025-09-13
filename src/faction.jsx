import "./app.css";
import styles from "./varzone.module.css"; 
function Faction(props) {
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
		"#74c7ec",
		"#6397e9ff",
		"#6274e9ff",
	];

		const colors = {};
		if (props.members) {
			Object.values(props.members).map(member => {
				colors[member] = Pastels[Math.floor(Math.random() * Pastels.length)];
			});
		}

  return (
      <div className={styles.faction}>
          <h1 id={styles.name}>{props.name}</h1>
          <div className={styles.messages}>
          {Object.keys(props.messages).map((msg, i) => (
              <div className={styles.messageBox} key={i}>
                  {Object.keys(props.messages[msg]).map((key, j) => (
			<>
                      <span key={j} style={{ color: colors[key] }} className={styles.sender}>
                          {key}
                      </span>
                          <span className={styles.message}>{props.messages[msg][key]}</span>
			</>
                  ))}
              </div>
          ))}
	  </div>
	  {props.isMember?<input type="text" className={styles.input} placeholder="Type a message..." />:null}
      </div>
  ) 

}

export default Faction;