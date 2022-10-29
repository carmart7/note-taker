const express = require('express');
const fs = require('fs');
const db = require('./db/db.json')
const { v4: uuidv4 } = require('uuid');
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(__dirname + '/public'));

app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
})

app.get('/api/notes', (req, res) => {
    let currentNotes = JSON.parse(fs.readFileSync(__dirname + '/db/db.json'));
    res.json(currentNotes);
})

app.post('/api/notes', (req, res) => {
    let note = req.body;
    note.id = uuidv4();
    let currentNotes = JSON.parse(fs.readFileSync(__dirname + '/db/db.json'));
    currentNotes.push(note);
    fs.writeFile(`./db/db.json`, JSON.stringify(currentNotes, null, '\t'), (err) => err ? console.error(err) : res.send('Success'));
})

app.delete('/api/notes/:id', (req, res) => {
    let currentNotes = JSON.parse(fs.readFileSync(__dirname + '/db/db.json'));
    for (let i = 0; i < currentNotes.length; i++) {
        if(currentNotes[i].id == req.params.id) {
            currentNotes.splice(i, 1);
        }
    }
    fs.writeFile(`./db/db.json`, JSON.stringify(currentNotes, null, '\t'), (err) => err ? console.error(err) : res.send('success'));
})

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})


app.listen(port, () => {
    console.log(`Listening on ${port}`);
})