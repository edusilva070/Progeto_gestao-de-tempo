const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(TASKS_FILE)) fs.writeFileSync(TASKS_FILE, '[]');
if (!fs.existsSync(NOTES_FILE)) fs.writeFileSync(NOTES_FILE, '[]');

const helperRead = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const helperWrite = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// ROTAS DE TAREFAS
app.get('/api/tasks', (req, res) => res.json(helperRead(TASKS_FILE)));
app.post('/api/tasks', (req, res) => {
    const tasks = helperRead(TASKS_FILE);
    const newTask = { id: Date.now(), ...req.body };
    tasks.push(newTask);
    helperWrite(TASKS_FILE, tasks);
    res.status(201).json(newTask);
});

// ROTAS DE NOTAS (AGENDA RÁPIDA)
app.get('/api/notes', (req, res) => res.json(helperRead(NOTES_FILE)));
app.post('/api/notes', (req, res) => {
    const notes = helperRead(NOTES_FILE);
    const newNote = { id: Date.now(), content: req.body.content };
    notes.push(newNote);
    helperWrite(NOTES_FILE, notes);
    res.status(201).json(newNote);
});
app.delete('/api/notes/:id', (req, res) => {
    let notes = helperRead(NOTES_FILE);
    notes = notes.filter(n => n.id !== parseInt(req.params.id));
    helperWrite(NOTES_FILE, notes);
    res.json({ message: "Nota removida" });
});

app.listen(5000, () => console.log('Servidor TIMEFLOW rodando na porta 5000'));