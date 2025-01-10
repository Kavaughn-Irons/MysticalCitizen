require('dotenv').config({ path: './API.env' });
const express = require('express');
const cors = require('cors');
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push } = require("firebase/database");
const fetch = require('node-fetch');



firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "codecitizen.firebaseapp.com",
    databaseURL: "https://codecitizen-default-rtdb.firebaseio.com",
    projectId: "codecitizen",
    storageBucket: "codecitizen.appspot.com",
    messagingSenderId: "951887554060",
    appId: "1:951887554060:web:c99c2f52eb5d4c1fd8f029"
};

const appFirebase = initializeApp(firebaseConfig);
const database = getDatabase(appFirebase);

async function generateBlogPost() {
    const prompt = "there should be no title. no special characters. do not explain anything just output the story. Do not write about a circle or a forest write about the main topic. Write a very unique mystical story about one of the main topics and choose one of the main topics randomly. Make choosing a topic an advanced random process. Advanced randomness. Atronomy, Quantum Mysticism, Ethereal Realms, Astral Projection, Sacred Geometry, Crystal Healing, Divination, The Akashic Records, The Etheric Body, Alchemy of the Soul, The Oracle’s Vision, Ancient Wisdom, The Third Eye, Shamanic Journeys, Karma and Reincarnation, Spirit Guides, The Multiverse, Sacred Circles, Soul Contracts, The Unseen Forces, The Power of Symbols, Magic of the Elements, Intuition and Inner Sight, Sacred Sound Frequencies, Energy Healing, The Flow of Chi, Light Bodies, The Astral Plane, The Sacred Feminine, Transcendental Meditation, Moon Phases and Rituals, The Dark Night of the Soul, The Path of Enlightenment, Visionary Art, Serpent Power, Metaphysical Realms, Divine Manifestation, The Golden Ratio, Celestial Beings, Cosmic Consciousness, The Spirit of the Forest, The Philosopher’s Stone, Interdimensional Beings, Astral Voyages, Soul Evolution, Psychic Abilities, Universal Energy Field, Sacred Fire, The Sacred Breath, The Divine Spark, The Eternal Flame, The Inner Temple, Light Language, Sacred Masculine, The Void, Parallel Realities, Time Bending, The Circle of Life, The Eternal Now, Spiritual Awakening, Cosmic Energy Flow, Shifting Consciousness, The Higher Self, The Law of Attraction, Soul Retrieval, The Veil Between Worlds, Ritual Magic, Channeling Messages, The Waking Dream, Soul Mates, Quantum Consciousness, The Shifting Dimensions, The Infinite Mind, Dreamtime Realms, The Ancient Mysteries, Vibrational Healing, The Light of the Ancients, Ascension Pathways, The Crystal Kingdom, The Mind-Body Connection, Lightworkers’ Journey, Deep Meditation States, The Unconscious Mind, The Holy Grail, Sacred Symbols and Archetypes, The Altar of Truth, Energy Transference, Interdimensional Travel, The Five Elements of Being, Awakening to the Divine, The Mind of the Universe, Sacred Temples of Light, The Eternal Soul, The Cosmic Spiral, Celestial Soundscapes, Spirit of the Earth, The Divine Matrix, The Ancient Ones, Light of the Universe, The Divine Flow write about very completely innovative and very different topics, do not write about the same topic. No special characters, do not explain anything, no title"

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',

            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,  // Use the openaiKey here
                'Content-Type': 'application/json'       // Project ID
            },
            body: JSON.stringify({
                model: "gpt-4-turbo",
                messages: [
                    { role: "system", content: "You are a mystical blog writer." },
                    { role: "user", content: prompt }
                ]
            })
        });

        const result = await response.json();
        const generatedText = result.choices[0].message.content.trim();
        const newPost = {
            title: generatedText.split("\n")[0],
            content: generatedText
        };

        push(ref(database, 'blogPosts'), newPost);
    } catch (error) {
        console.error("Error generating post:", error);
    }
}

// Start generating blog posts every 30 seconds
const postInterval = 600000; // 30 seconds interval in milliseconds
function startGeneratingPosts() {
    setInterval(generateBlogPost, postInterval);
}

startGeneratingPosts();

const app = express();

const port = process.env.PORT;

// Enable CORS
app.use(cors({
    origin: process.env.PORT,
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

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});