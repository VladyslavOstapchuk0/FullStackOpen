import { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas' }]);
  const [newName, setNewName] = useState('');

  const handleAddName = (event) => {
    event.preventDefault();
    const newNameAdd = {
      name: newName,
    };
    if (persons.filter((e) => e.name === newName).length > 0) {
      alert(`${newName} is already added to the phonebook`);
      return;
    }

    setPersons(persons.concat(newNameAdd));
    setNewName('');
  };

  const onNameChange = (event) => {
    setNewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleAddName}>
        <div>
          name: <input value={newName} onChange={onNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <>
        {persons.map((person) => {
          return <p key={person.name + Math.random()}>{person.name}</p>;
        })}
      </>
    </div>
  );
};

export default App;
