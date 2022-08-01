import { useState, useEffect } from 'react';
import PersonsForm from './components/PersonsForm';
import PersonsList from './components/PersonsList';
import Filter from './components/Filter';
import personsService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const hook = () => {
    personsService.getAll().then((response) => {
      setPersons(response);
    });
  };

  useEffect(hook, []);

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddName = (event) => {
    event.preventDefault();
    const newNameAdd = {
      name: newName,
      number: newNumber,
      id: persons[persons.length - 1].id + 1,
    };
    if (persons.some((e) => e.name === newName)) {
      alert(`${newName} is already added to the phonebook`);
      return;
    }

    personsService.create(newNameAdd).then(() => {
      setPersons(persons.concat(newNameAdd));
      setNewName('');
      setNewNumber('');
    });
  };

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.deleteOne(person.id).then(() => {
        const newPersons = persons.filter((data) => {
          return data.id !== person.id;
        });
        setPersons(newPersons);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} setFilter={setFilter} />

      <h3>Add a new</h3>
      <PersonsForm
        handleAddName={handleAddName}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>
      <PersonsList
        filteredPersons={filteredPersons}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
