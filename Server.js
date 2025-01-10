require('dotenv').config({ path: './API.env' });
const express = require('express');
const cors = require('cors');
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push } = require("firebase/database");

// Import `node-fetch` dynamically for compatibility
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "codecitizen.firebaseapp.com",
    databaseURL: "https://codecitizen-default-rtdb.firebaseio.com",
    projectId: "codecitizen",
    storageBucket: "codecitizen.appspot.com",
    messagingSenderId: "951887554060",
    appId: "1:951887554060:web:c99c2f52eb5d4c1fd8f029"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const database = getDatabase(appFirebase);

// Function to generate blog post
async function generateBlogPost() {
    const prompt = `
        There should be no title. No explaining in the beginning, just output the story.
        Do not write about a circle or a forest. Write about the main topic. Write a very unique mystical story
        about one of the main topics, chosen randomly using advanced randomness. The main topics include:
        Astronomy, Quantum Mysticism, Ethereal Realms, Astral Projection, Sacred Geometry, Crystal Healing, 
        Divination, The Akashic Records, The Etheric Body, Alchemy of the Soul, and many others.
    `;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: [
                    { role: "system", content: "You are a mystical blog writer." },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        const generatedText = result.choices[0].message.content.trim();
        const newPost = {
            title: generatedText.split("\n")[0],
            content: generatedText
        };

        await push(ref(database, 'blogPosts'), newPost);
        console.log("Blog post generated and saved.");
    } catch (error) {
        console.error("Error generating post:", error.message);
    }
}

// Start generating blog posts every 30 seconds
const postInterval = 30000; // 30 seconds
function startGeneratingPosts() {
    setInterval(generateBlogPost, postInterval);
}

startGeneratingPosts();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type']
}));

// Serve MysticalCitizen.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/MysticalCitizen.html');
});

// Endpoint to send Firebase API key (Protected)
app.get('/firebase-key', (req, res) => {
    res.json({ 'apiKey': process.env.FIREBASE_API_KEY });
});

// Endpoint to send OpenAI API key (Protected)
app.get('/openai-key', (req, res) => {
    res.json({ 'apiKey': process.env.OPENAI_API_KEY });
});

// Handle CORS for all other routes
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
