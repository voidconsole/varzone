import React, { useEffect } from "react"
import { GoogleGenAI } from "@google/genai"

const fetchTextFromUrl = async url => {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error("Network response was not ok")
        }
        const text = await response.text()
        return text.trim()
    } catch (error) {
        console.error("Error fetching text:", error)
        return null
    }
}

const Voter = ({ messages, data }) => {
    useEffect(() => {
        const url =
            "https://raw.githubusercontent.com/voidconsole/varzone/b458630fd663a7982c9fa4f42e52808117b5b7b0/src/assets/key.txt" // Replace with your URL

        const initializeAI = async () => {
            const apiKey = await fetchTextFromUrl(url)
            if (apiKey) {
                const ai = new GoogleGenAI({ apiKey })
                const vote = await getVote(ai, JSON.stringify(messages), data)
            }
        }

        initializeAI()
    }, [messages, data]) // Add dependencies to the useEffect hook

    return <div>Voter Component</div> // Ensure the component returns JSX
}

async function getVote(ai, messages, content) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Consider these 5 messages ${messages} for the debate resolution: ${content.resolution}, and from the faction ${content.faction}, cast a vote of 1, 0 based on the strength of their argument. Respond with just the number, 0 OR 1, and nothing else.`,
    })
    return response.text
}

export const getAIVote = async (messages, data) => {
    const url =
        "https://raw.githubusercontent.com/voidconsole/varzone/b458630fd663a7982c9fa4f42e52808117b5b7b0/src/assets/key.txt" // Replace with your URL

    try {
        const apiKey = await fetchTextFromUrl(url)
        // const apiKey = "YOUR_API_KEY_HERE" // Uncomment for local testing
        if (apiKey) {
            const ai = new GoogleGenAI({ apiKey })
            const vote = await getVote(ai, JSON.stringify(messages), data)
            return vote
        }
        console.error("API Key not found.")
        return null
    } catch (error) {
        console.error("Error during AI Voting:", error)
        return null
    }
}

export default Voter
