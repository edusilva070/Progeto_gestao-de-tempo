const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000; 

// Middlewares
app.use(cors()); 
app.use(express.json()); 

const filePath = path.join(__dirname, 'data', 'tasks.json');

const readTasks = () => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeTasks = (tasks) => {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
};

// --- ROTAS DA API ---

app.get('/api/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});


app.post('/api/tasks', (req, res) => {
    const { title, category, context, energy_required, duration_minutes } = req.body;

    if (!title || !category || !context || !energy_required) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios!' });
    }

    const tasks = readTasks();

    const newTask = {
        id: Date.now().toString(), 
        title,
        category,          
        context,           
        energy_required,  
        duration_minutes: duration_minutes || 30,
        status: 'pending',
        created_at: new Date()
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando lindamente em http://localhost:${PORT}`);
});