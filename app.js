const { spawn } = require('child_process');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ejs = require("ejs");
const port = 3000;
require('dotenv').config();

app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

// Handle the text summarization request
app.post('/generate_summary', (req, res) => {
    const inputText = req.body.inputText;

    console.log(inputText)

    const scriptPath = process.env.SCRIPT_PATH;
    const python = process.env.PYTHON 
  
    const pythonProcess = spawn(python, [scriptPath, inputText]);

    let summary = '';

    // Handle data from the Python script
    pythonProcess.stdout.on('data', (data) => {
        summary += data.toString();
        console.log(summary);
    });

    // Handle errors and process completion
    pythonProcess.on('error', (error) => {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            // Success
            res.json({ summary });
        } else {
            console.error(`Error: Python script exited with code ${code}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
