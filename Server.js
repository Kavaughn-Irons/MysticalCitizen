const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Use the Heroku port or fallback to 3000 for local development
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve MysticalCitizen.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/MysticalCitizen.html');
});

// Endpoint to send Firebase API key
app.get('/firebase-key', (req, res) => {
    res.json({ apiKey: process.env.FIREBASE_API_KEY });
});

// Endpoint to send OpenAI API key
app.get('/openai-key', (req, res) => {
    res.json({ apiKey: process.env.OPENAI_API_KEY });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
require('dotenv').config({ path: './API.env' });
const express = require('express');
const cors = require('cors');


const app = express();

// Use the Heroku port or fallback to 3000 for local development
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5000',
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

