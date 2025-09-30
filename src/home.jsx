import { useState, useEffect} from "react"
import { Link } from "react-router-dom"
import styles from "./home.module.css"
function Home() {
    const [titleChars, setTitleChars] = useState([])
    const [description, setDescription] = useState("")
    const fullTitle = "Vaarzone"
    const fullDescription =
        "From friendly debates to online wars, this is the perfect place for your fights."
    useEffect(() => {
	const typeDescription = (fullText, setText, interval) => {
	    const words = fullText.split(" ")
	    let i = 0
	    const typeWord = () => {
		if (i < words.length) {
		    setText(words.slice(0, i + 1).join(" "))
		    i++
		    setTimeout(typeWord, interval)
		}
	    }
	    typeWord()
	}
        const typeTitle = () => {
            let i = 0
            const intervalId = setInterval(() => {
                if (i+1 < fullTitle.length) {
                    setTitleChars(prev => [...prev, fullTitle[i]])
		    console.log(fullTitle[i])
		    console.log(titleChars)
                    i++
                } else {
                    clearInterval(intervalId)
                    setTimeout(
                        () =>
                            typeDescription(
                                fullDescription,
                                setDescription,
                                100
                            ),
                        500
                    )
                }
            }, 200)
        }
        typeTitle()
    }, [])

    return (
        <div className={styles.home}>
            <h3 className={styles.subtitle}>Welcome to</h3>
            <h1 className={styles.title}>
                {titleChars.map((char, index) => (
                    <span key={index} className={styles.letter}>
                        {char}
                    </span>
                ))}
            </h1>
            <p className={styles.description}>{description}</p>
            <div className={styles.actions}>
                <Link to="/login">
                    <button className={styles.button}>
                        <h4>Create A Var</h4>
                        <p>Login as admin</p>
                    </button>
                </Link>
                <Link to="/join">
                    <button className={styles.button}>
                        <h4>Join a Var</h4>
                        <p>Use the access code</p>
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Home
