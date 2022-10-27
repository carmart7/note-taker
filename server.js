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
    console.log(currentNotes);
    res.json(currentNotes);
})

app.post('/api/notes', (req, res) => {
    console.log('BODY', req.body);
    let note = req.body;
    console.log(note);
    note.id = uuidv4();
    let currentNotes = JSON.parse(fs.readFileSync(__dirname + '/db/db.json'));
    currentNotes.push(note);
    fs.writeFile(`./db/db.json`, JSON.stringify(currentNotes, null, '\t'), (err) => err ? console.error(err) : console.log(`Note for ${note.title} has been written to JSON file`));
    res.send('Success');
})

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})


app.listen(port, () => {
    console.log(`Listening on ${port}`);
})