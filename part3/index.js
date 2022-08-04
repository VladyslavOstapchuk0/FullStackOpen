const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
let { persons } = require('./db.json');

const generateId = () => {
  return Math.floor(Math.random() * 100000);
};

morgan.token('body', (req, res) => {
  if (req.method === 'POST') return JSON.stringify(req.body);
  return '';
});

app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(cors());

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: 'name or number is missing',
    });
  } else if (persons.some((e) => e.name === name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    name: name,
    number: number || '',
    id: generateId(),
  };

  persons.push(person);
  res.status(201).json(person);
});

app.get('/api/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `
  );
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.sendStatus(404);
  }

  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
