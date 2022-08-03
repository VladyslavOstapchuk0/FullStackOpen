import { useEffect, useState } from 'react';
import './App.css';
import Filter from './components/Filter';
import NotificationMessage from './components/NotificationMessage';
import PersonsForm from './components/PersonsForm';
import PersonsList from './components/PersonsList';
import personsService from './services/persons';

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

  const filteredPersons = Object.values(persons).filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddName = (event) => {
    event.preventDefault();

    const newNameAdd = {
      name: newName,
      number: newNumber,
    };

    if (persons.some((e) => e.name === newName)) {
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
          })
          .catch((err) => {
            setNotification({
              text: `Information of ${newName} was already deleted from the server`,
              type: 'error',
            });
            setTimeout(() => {
              setNotification(null);
            }, 5000);
            setNewName('');
            setNewNumber('');
          });
      } else {
        return;
      }
    }

    personsService
      .create(newNameAdd)
      .then((createdPerson) => {
        setNotification({ text: `Added ${newName}`, type: 'success' });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
        setNewName('');
        setNewNumber('');
        setPersons(createdPerson);
      })
      .catch((error) => {
        setNotification({
          text: error.response.data.error || error,
          type: 'error',
        });
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });
  };

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deleteOne(person.id)
        .then(() => {
          const newPersons = persons.filter((data) => {
            return data.id !== person.id;
          });
          setNotification({ text: `deleted ${person.name}`, type: 'success' });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
          setPersons(newPersons);
        })
        .catch((error) => {
          setNotification({
            text: error.response.data.error || error,
            type: 'error',
          });
          setTimeout(() => {
            setNotification(null);
          }, 5000);
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
