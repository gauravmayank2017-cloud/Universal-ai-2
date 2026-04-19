import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase + AI Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCr2dcChgltcxitoumuzb4MhzQpgTfZ5kg",
    authDomain: "helpai-d5d33.firebaseapp.com",
    projectId: "helpai-d5d33",
    databaseURL: "https://helpai-d5d33-default-rtdb.firebaseio.com",
    storageBucket: "helpai-d5d33.firebasestorage.app",
    appId: "1:638645254102:web:9784af26ba64272100d677"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const GEMINI_API_KEY = "AIzaSyAlEDBqSIvNLQB4dodpAjfCS7nlNkw2jV0";

window.execute = async () => {
    const input = document.getElementById('userInput').value;
    const terminal = document.getElementById('terminal');
    if (!input) return;

    terminal.innerHTML += `<p style="color:white">>> USER: ${input}</p>`;
    
    // Gemini AI Call
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] })
        });
        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;

        // Save to Firebase
        await addDoc(collection(db, "logs"), { prompt: input, response: aiText, time: Date.now() });

        terminal.innerHTML += `<p>>> AI: ${aiText}</p>`;
        terminal.scrollTop = terminal.scrollHeight;
    } catch (e) {
        terminal.innerHTML += `<p style="color:red">>> ERROR: Connection Failed</p>`;
    }
    document.getElementById('userInput').value = "";
};
