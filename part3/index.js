require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

morgan.token('body', (req) => {
  if (req.method === 'POST') return JSON.stringify(req.body);
  return '';
});

app.use(express.json());
app.use(express.static('build'));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(cors());

app.get('/api/info', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
      `
      );
    })
    .catch((error) => next(error));
});

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      if (persons) {
        res.json(persons);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then((result) => {
      if (result) res.status(201).json(result);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then((updatedResult) => {
      if (updatedResult) res.json(updatedResult);
      else throw new Error();
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) res.status(204).end();
      else res.status(404);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandling = (error, req, res, next) => {
  console.error('Error is ', error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandling);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
