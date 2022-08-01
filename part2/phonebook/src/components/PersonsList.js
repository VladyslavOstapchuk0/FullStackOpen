import Person from './Person';

const PersonsList = ({ filteredPersons, handleDelete }) => {
  return (
    <>
      {filteredPersons.map((person) => {
        return (
          <div key={person.id}>
            <Person person={person} />
            <button onClick={() => handleDelete(person)}>Delete</button>
          </div>
        );
      })}
    </>
  );
};

export default PersonsList;
