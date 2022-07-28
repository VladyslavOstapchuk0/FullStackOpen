import Person from "./Person";

const PersonsList = ({ filteredPersons }) => {
  return (
    <>
      {filteredPersons.map((person) => {
        return <Person key={person.id} person={person} />;
      })}
    </>
  );
};

export default PersonsList;
