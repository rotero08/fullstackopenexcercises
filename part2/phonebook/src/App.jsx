/* eslint-disable no-unused-vars */
import { useState } from "react";

const Persons = ({ person }) => {
  return <li>{person.name}</li>;
};

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const handleInput = (event) => {
    setNewName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nameDuplicate = (person) =>
      JSON.stringify(person.name) === JSON.stringify(newName);

    const duplicate = persons.some(nameDuplicate);

    if (duplicate) {
      return alert(`${newName} is already added to phonebook`);
    }

    const newPerson = {
      name: newName,
    };

    setPersons(persons.concat(newPerson));
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleInput} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <Persons key={person.name} person={person} />
        ))}
      </ul>
    </div>
  );
};

export default App;
