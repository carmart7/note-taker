const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
})

app.get('/api/notes', (req, res) => {
    res.json(fs.readFileSync(__dirname + '/db/db.json'));
})

app.post('/api/notes', (req, res) => {
    let note = req.body;
    console.log(note);
    note.id = uuidv4();
    let currentNote = JSON.parse(fs.readFileSync(__dirname + '/db/db.json'));
    currentNote.push(note);
    fs.writeFile(`./db/db.json`, JSON.stringify(currentNote, null, '\t'), (err) => err ? console.error(err) : console.log(`Note for ${note.title} has been written to JSON file`));
    const response = {
        status: 'added',
        body: note
    };
    res.json(response);
})

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})


app.listen(port, () => {
    console.log(`Listening on ${port}`);
})