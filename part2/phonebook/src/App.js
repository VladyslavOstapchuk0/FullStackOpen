import { useState, useEffect } from 'react';
import './App.css';
import PersonsForm from './components/PersonsForm';
import PersonsList from './components/PersonsList';
import Filter from './components/Filter';
import personsService from './services/persons';
import NotificationMessage from './components/NotificationMessage';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({ text: '', type: '' });

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
      // id: persons[persons.length - 1].id + 1,
    };
    if (persons.some((e) => e.name === newName)) {
      if (newNumber === '') {
        alert(`${newName} is already added to the phonebook`);
        return;
      } else {
        if (
          window.confirm(
            `${newName} is already added to the phonebook, replace old number with a new one?`
          )
        ) {
          const currentPerson = persons.filter(
            (person) => person.name === newName
          );
          return personsService
            .update(currentPerson[0].id, { ...newNameAdd, number: newNumber })
            .then(() => {
              let objIndex = persons.findIndex(
                (obj) => obj.id === currentPerson[0].id
              );
              let newObj = [...persons];
              newObj[objIndex].number = newNumber;
              setNotification({ text: `Updated ${newName}`, type: 'success' });
              setTimeout(() => {
                setNotification(null);
              }, 5000);
              setPersons(newObj);
              setNewName('');
              setNewNumber('');
            });
        } else {
          return;
        }
      }
    }

    personsService.create(newNameAdd).then(() => {
      personsService.getAll().then((result) => {
        setNotification({ text: `Added ${newName}`, type: 'success' });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        setNewName('');
        setNewNumber('');
        setPersons(result);
      });
    });
  };

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.deleteOne(person.id).then(() => {
        const newPersons = persons.filter((data) => {
          return data.id !== person.id;
        });
        setNotification({ text: `deleted ${person.name}`, type: 'success' });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        setPersons(newPersons);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} setFilter={setFilter} />
      <NotificationMessage notification={notification} />

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
