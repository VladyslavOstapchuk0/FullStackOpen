require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

morgan.token('body', (req, res) => {
  if (req.method === 'POST') return JSON.stringify(req.body);
  return '';
});

app.use(express.json());
app.use(express.static('build'));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(cors());

// app.get('/api/info', (req, res) => {
//   const person = Person.find({}).then((persons) => {
//     return res.send(
//       `<p>Phonebook has info for ${persons.length} people</p>
//       <p>${new Date()}</p>
//       `
//     );
//   });
//   if (!person) return res.status(404).end();
// });

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

// app.get('/api/persons/:id', (req, res) => {
//   Person.findById(req.params.id)
//     .then((person) => {
//       res.json(person);
//     })
//     .catch((error) => next(error));
// });

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: 'name or number is missing',
    });
  }
  // else if (persons.some((e) => e.name === name)) {
  //   return res.status(400).json({
  //     error: 'name must be unique',
  //   });
  // }

  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res) => {
  const { name, number } = req.body;
  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedResult) => {
      res.json(updatedResult);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandling = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }

  next(error);
};

app.use(errorHandling);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
