require('dotenv').config({ path: './API.env' });
const express = require('express');
const cors = require('cors');


const app = express();

const port = process.env.PORT || 5000;

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