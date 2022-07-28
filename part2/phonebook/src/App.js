import { useState } from 'react';
import PersonsForm from './components/PersonsForm';
import PersonsList from './components/PersonsList';
import Filter from './components/Filter';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

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

    setPersons(persons.concat(newNameAdd));
    setNewName('');
    setNewNumber('');
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
      <PersonsList filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;
